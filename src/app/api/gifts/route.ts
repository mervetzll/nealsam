import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { giftCatalog } from "@/data/giftCatalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL eksik.");
  }

  if (serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey);
  }

  if (anonKey) {
    return createClient(supabaseUrl, anonKey);
  }

  throw new Error("Supabase key eksik.");
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
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        gifts: [],
        error: error.message,
      };
    }

    return {
      gifts: data || [],
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

  // Admin-managed gifts from Supabase come first; the structured catalog
  // fills in every idea the database does not already have, so matching
  // never falls back to an empty or unstructured list.
  const titleKey = (title: unknown) =>
    String(title || "").toLocaleLowerCase("tr").replace(/\s+/g, " ").trim();
  const supabaseTitles = new Set(result.gifts.map((item: { title?: string; name?: string }) => titleKey(item?.title || item?.name)));
  const rawGifts = [
    ...result.gifts,
    ...giftCatalog.filter((item) => !supabaseTitles.has(titleKey(item.title))),
  ];

  const gifts = rawGifts.map(normalizeGift);

  return NextResponse.json({
    ok: true,
    source: result.gifts.length > 0 ? "supabase+catalog" : "catalog",
    count: gifts.length,
    supabaseCount: result.gifts.length,
    fallbackCount: giftCatalog.length,
    error: result.error || null,
    gifts,
  });
}
