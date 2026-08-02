import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { gifts as fallbackGifts } from "@/data/gifts";

function rowToGift(row: any) {
  return {
    title: row.title,
    category: row.category,
    subCategory: row.sub_category,
    priceMin: row.price_min,
    priceMax: row.price_max,
    recipients: row.recipients || [],
    interests: row.interests || [],
    styles: row.styles || [],
    occasions: row.occasions || [],
    urgency: row.urgency || [],
    riskLevel: row.risk_level || "low",
    reason: row.reason || "",
    note: row.note || "",
    searchQuery: row.search_query || row.title || "",
  };
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json({
      source: "fallback",
      gifts: fallbackGifts,
    });
  }

  const supabase = createClient(url, anonKey);

  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({
      source: "fallback",
      error: error.message,
      gifts: fallbackGifts,
    });
  }

  return NextResponse.json({
    source: "supabase",
    gifts: (data || []).map(rowToGift),
  });
}
