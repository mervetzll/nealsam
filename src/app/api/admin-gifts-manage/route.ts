import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function isAdmin() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

function toArray(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function cleanGiftPayload(body: any) {
  return {
    title: body.title || "",
    category: body.category || "",
    sub_category: body.sub_category || body.subCategory || "",
    price_min: Number(body.price_min || body.priceMin || 0),
    price_max: Number(body.price_max || body.priceMax || 0),
    recipients: toArray(body.recipients),
    interests: toArray(body.interests),
    styles: toArray(body.styles),
    occasions: toArray(body.occasions),
    urgency: toArray(body.urgency),
    risk_level: body.risk_level || body.riskLevel || "medium",
    reason: body.reason || "",
    note: body.note || "",
    search_query: body.search_query || body.searchQuery || body.title || "",
    is_active: Boolean(body.is_active ?? body.isActive ?? true),
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Yetkisiz işlem." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";

    let query = supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (status === "active") {
      query = query.eq("is_active", true);
    }

    if (status === "passive") {
      query = query.eq("is_active", false);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,category.ilike.%${search}%,sub_category.ilike.%${search}%,search_query.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gifts: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Hediyeler alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Yetkisiz işlem." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const payload = cleanGiftPayload(body);

    if (!payload.title || !payload.category || !payload.sub_category) {
      return NextResponse.json(
        { ok: false, error: "Hediye adı, kategori ve alt kategori zorunlu." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("gifts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gift: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Hediye eklenemedi.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ ok: false, error: "Yetkisiz işlem." }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Hediye ID eksik." }, { status: 400 });
    }

    const payload = cleanGiftPayload(body);

    const { data, error } = await supabase
      .from("gifts")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, gift: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Hediye güncellenemedi.",
      },
      { status: 500 }
    );
  }
}
