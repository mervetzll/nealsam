import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function parseArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseNumber(value: unknown, fallback: number) {
  const number = Number(value);

  if (Number.isFinite(number)) return number;

  return fallback;
}

function normalizeGiftPayload(body: any) {
  const title = String(body?.title || body?.name || "").trim();
  const category = String(body?.category || "Genel").trim() || "Genel";
  const subCategory =
    String(body?.sub_category || body?.subCategory || category || "Genel").trim() || "Genel";

  const description =
    String(body?.description || body?.reason || "").trim() ||
    "Bu hediye günlük kullanım ve hediyeleşme için uygun bir seçenektir.";

  const reason =
    String(body?.reason || body?.description || "").trim() ||
    description;

  const note =
    String(body?.note || "").trim() ||
    `${title || "Bu hediye"} küçük bir not, güzel paketleme veya QR özel mesaj ile daha kişisel hale getirilebilir.`;

  const searchQuery =
    String(body?.search_query || body?.searchQuery || title || "hediye").trim() || "hediye";

  const priceMin = parseNumber(body?.price_min ?? body?.priceMin, 0);
  const priceMax = parseNumber(body?.price_max ?? body?.priceMax, 999999);

  return {
    title,
    category,
    sub_category: subCategory,
    price_min: priceMin,
    price_max: priceMax,
    recipients: parseArray(body?.recipients),
    interests: parseArray(body?.interests),
    styles: parseArray(body?.styles),
    occasions: parseArray(body?.occasions),
    urgency: parseArray(body?.urgency),
    risk_level: String(body?.risk_level || body?.riskLevel || "low").trim() || "low",
    reason,
    note,
    search_query: searchQuery,
    is_active: typeof body?.is_active === "boolean" ? body.is_active : true,
    price: body?.price ? String(body.price) : `${priceMin}–${priceMax} TL`,
    budget: body?.budget ? String(body.budget) : `${priceMin}–${priceMax} TL`,
    description,
    tags: parseArray(body?.tags),
    updated_at: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gift = normalizeGiftPayload(body);

    if (!gift.title) {
      return NextResponse.json(
        { ok: false, error: "Hediye başlığı zorunlu." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("gifts")
      .insert(gift)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      gift: data,
    });
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
    const body = await request.json();
    const id = String(body?.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Hediye ID eksik." },
        { status: 400 }
      );
    }

    const gift = normalizeGiftPayload(body);
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("gifts")
      .update(gift)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      gift: data,
    });
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Hediye ID eksik." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    const { error } = await supabase
      .from("gifts")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Hediye silinemedi.",
      },
      { status: 500 }
    );
  }
}
