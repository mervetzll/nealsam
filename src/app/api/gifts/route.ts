import { NextResponse } from "next/server";
import { expandedGiftCatalog } from "@/data/expandedGiftCatalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FALLBACK_SUPABASE_URL = "https://iapqvnwqbrlwriqoaojv.supabase.co";

function getSupabaseConfig() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    FALLBACK_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ""),
    key,
  };
}

function normalizeArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [String(value)];
}

function normalizeGift(item: any, index: number) {
  const priceMin = Number(item?.price_min ?? item?.priceMin ?? 0);
  const priceMax = Number(item?.price_max ?? item?.priceMax ?? 999999);

  return {
    id: item?.id || `gift-${index}`,
    title: item?.title || item?.name || "Hediye",
    name: item?.name || item?.title || "Hediye",
    category: item?.category || "Genel",
    sub_category: item?.sub_category || item?.subCategory || item?.category || "Genel",
    price_min: priceMin,
    price_max: priceMax,
    price: item?.price || item?.budget || `${priceMin}–${priceMax} TL`,
    budget: item?.budget || item?.price || `${priceMin}–${priceMax} TL`,
    recipients: normalizeArray(item?.recipients),
    interests: normalizeArray(item?.interests),
    styles: normalizeArray(item?.styles),
    occasions: normalizeArray(item?.occasions),
    urgency: normalizeArray(item?.urgency),
    risk_level: item?.risk_level || item?.riskLevel || "low",
    reason: item?.reason || item?.description || "",
    note: item?.note || "",
    search_query: item?.search_query || item?.searchQuery || item?.title || "hediye",
    description: item?.description || item?.reason || "",
    tags: normalizeArray(item?.tags),
    is_active: item?.is_active !== false,
  };
}

async function getSupabaseGifts() {
  const { supabaseUrl, key } = getSupabaseConfig();

  if (!supabaseUrl || !key) {
    return {
      gifts: [],
      error: "Supabase URL veya key eksik.",
      debug: {
        hasUrl: Boolean(supabaseUrl),
        hasKey: Boolean(key),
      },
    };
  }

  const url =
    `${supabaseUrl}/rest/v1/gifts` +
    `?select=*` +
    `&is_active=eq.true` +
    `&order=created_at.desc`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      return {
        gifts: [],
        error: `Supabase REST hata: ${response.status} ${text.slice(0, 200)}`,
        debug: {
          status: response.status,
          url: supabaseUrl,
        },
      };
    }

    const data = JSON.parse(text);

    return {
      gifts: Array.isArray(data) ? data : [],
      error: "",
      debug: {
        status: response.status,
        url: supabaseUrl,
      },
    };
  } catch (error) {
    return {
      gifts: [],
      error: error instanceof Error ? error.message : "Supabase fetch başarısız.",
      debug: {
        url: supabaseUrl,
      },
    };
  }
}

export async function GET() {
  const result = await getSupabaseGifts();

  const rawGifts =
    result.gifts.length > 0
      ? result.gifts
      : expandedGiftCatalog;

  const gifts = rawGifts.map(normalizeGift);

  return NextResponse.json({
    ok: true,
    source: result.gifts.length > 0 ? "supabase" : "fallback",
    count: gifts.length,
    supabaseCount: result.gifts.length,
    fallbackCount: expandedGiftCatalog.length,
    error: result.error || null,
    debug: result.debug || null,
    gifts,
  });
}
