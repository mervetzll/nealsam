import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { expandedGiftCatalog } from "@/data/expandedGiftCatalog";

export const dynamic = "force-dynamic";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) return null;

  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey);
  }

  if (anonKey) {
    return createClient(supabaseUrl, anonKey);
  }

  return null;
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
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      gifts: [],
      error: "Supabase client oluşturulamadı.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        gifts: [],
        error: error.message,
      };
    }

    const activeGifts = (data || []).filter((gift: any) => gift?.is_active !== false);

    return {
      gifts: activeGifts,
      error: "",
    };
  } catch (error) {
    return {
      gifts: [],
      error: error instanceof Error ? error.message : "Supabase hediyeleri alınamadı.",
    };
  }
}

export async function GET() {
  const result = await getSupabaseGifts();

  const source =
    result.gifts.length > 0
      ? "supabase"
      : "fallback";

  const rawGifts =
    result.gifts.length > 0
      ? result.gifts
      : expandedGiftCatalog;

  const gifts = rawGifts.map(normalizeGift);

  return NextResponse.json({
    ok: true,
    source,
    count: gifts.length,
    supabaseCount: result.gifts.length,
    fallbackCount: expandedGiftCatalog.length,
    error: result.error || null,
    gifts,
  });
}
