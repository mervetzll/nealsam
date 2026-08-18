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
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function makeKey(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanConceptPayload(body: Record<string, unknown>) {
  const title = String(body.title || "");
  const conceptKey = String(body.concept_key || body.conceptKey || makeKey(title));

  return {
    concept_key: conceptKey,
    title,
    badge: String(body.badge || ""),
    description: String(body.description || ""),
    best_for: toArray(body.best_for || body.bestFor),
    sample: String(body.sample || ""),
    premium_level: String(body.premium_level || body.premiumLevel || "plus"),
    is_active: Boolean(body.is_active ?? body.isActive ?? true),
    updated_at: new Date().toISOString(),
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
    const status = searchParams.get("status") || "all";

    let query = supabase
      .from("premium_concepts")
      .select("*")
      .order("created_at", { ascending: true });

    if (status === "active") {
      query = query.eq("is_active", true);
    }

    if (status === "passive") {
      query = query.eq("is_active", false);
    }

    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,badge.ilike.%${search}%,description.ilike.%${search}%,concept_key.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, concepts: data || [] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Konseptler alınamadı.",
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
    const payload = cleanConceptPayload(body);

    if (!payload.title || !payload.badge || !payload.description) {
      return NextResponse.json(
        { ok: false, error: "Başlık, rozet ve açıklama zorunlu." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("premium_concepts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, concept: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Konsept eklenemedi.",
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
        { ok: false, error: "Konsept ID eksik." },
        { status: 400 }
      );
    }

    const payload = cleanConceptPayload(body);

    const { data, error } = await supabase
      .from("premium_concepts")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, concept: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Konsept güncellenemedi.",
      },
      { status: 500 }
    );
  }
}
