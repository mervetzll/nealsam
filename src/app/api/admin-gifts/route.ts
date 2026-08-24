import { NextResponse } from "next/server";
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

function normalizeArray(value: unknown) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [String(value)];
}

function normalizeGift(item: any) {
  const priceMin = Number(item?.price_min ?? 0);
  const priceMax = Number(item?.price_max ?? 999999);

  return {
    id: item?.id,
    title: item?.title || item?.name || "Hediye",
    name: item?.name || item?.title || "Hediye",
    category: item?.category || "Genel",
    sub_category: item?.sub_category || item?.subCategory || item?.category || "Genel",
    subCategory: item?.sub_category || item?.subCategory || item?.category || "Genel",
    price_min: priceMin,
    price_max: priceMax,
    priceMin,
    priceMax,
    price: item?.price || `${priceMin}–${priceMax} TL`,
    budget: item?.budget || item?.price || `${priceMin}–${priceMax} TL`,
    recipients: normalizeArray(item?.recipients),
    interests: normalizeArray(item?.interests),
    styles: normalizeArray(item?.styles),
    occasions: normalizeArray(item?.occasions),
    urgency: normalizeArray(item?.urgency),
    risk_level: item?.risk_level || item?.riskLevel || "low",
    riskLevel: item?.risk_level || item?.riskLevel || "low",
    reason: item?.reason || item?.description || "",
    note: item?.note || "",
    search_query: item?.search_query || item?.searchQuery || item?.title || "hediye",
    searchQuery: item?.search_query || item?.searchQuery || item?.title || "hediye",
    description: item?.description || item?.reason || "",
    tags: normalizeArray(item?.tags),
    is_active: item?.is_active !== false,
    isActive: item?.is_active !== false,
    created_at: item?.created_at,
    updated_at: item?.updated_at,
  };
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          gifts: [],
        },
        { status: 500 }
      );
    }

    const gifts = (data || []).map(normalizeGift);

    return NextResponse.json({
      ok: true,
      count: gifts.length,
      gifts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Hediyeler alınamadı.",
        gifts: [],
      },
      { status: 500 }
    );
  }
}
