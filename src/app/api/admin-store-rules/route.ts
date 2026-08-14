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

function cleanStorePayload(body: any) {
  return {
    store_name: body.store_name || body.storeName || "",
    category: body.category || "",
    budget_level: body.budget_level || body.budgetLevel || "all",
    keywords: toArray(body.keywords),
    search_prefix: body.search_prefix || body.searchPrefix || "",
    affiliate_url: body.affiliate_url || body.affiliateUrl || null,
    priority: Number(body.priority || 1),
    is_active: Boolean(body.is_active ?? body.isActive ?? true),
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const status = searchParams.get("status") || "all";

    let query = supabase
      .from("store_rules")
      .select("*")
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(300);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (status === "active") {
      query = query.eq("is_active", true);
    }

    if (status === "passive") {
      query = query.eq("is_active", false);
    }

    if (search.trim()) {
      query = query.or(
        `store_name.ilike.%${search}%,category.ilike.%${search}%,search_prefix.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, rules: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Mağaza kuralları alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const payload = cleanStorePayload(body);

    if (!payload.store_name || !payload.category) {
      return NextResponse.json(
        { ok: false, error: "Mağaza adı ve kategori zorunlu." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("store_rules")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, rule: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Mağaza kuralı eklenemedi.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Kural ID eksik." },
        { status: 400 }
      );
    }

    const payload = cleanStorePayload(body);

    const { data, error } = await supabase
      .from("store_rules")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, rule: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Mağaza kuralı güncellenemedi.",
      },
      { status: 500 }
    );
  }
}
