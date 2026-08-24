import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { expandedGiftCatalog } from "@/data/expandedGiftCatalog";

export const dynamic = "force-dynamic";

function normalizeGift(item: any, index: number) {
  return {
    id: item.id || `gift-${index}`,
    title: item.title || item.name || "Hediye",
    name: item.name || item.title || "Hediye",
    category: item.category || "Genel",
    price: item.price || item.budget || "",
    budget: item.budget || item.price || "",
    description: item.description || item.reason || "",
    reason: item.reason || item.description || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
  };
}

async function getSupabaseGifts() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) return [];

  try {
    const supabase = createClient(supabaseUrl, anonKey);

    const { data, error } = await supabase
      .from("gifts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) return [];

    return data || [];
  } catch {
    return [];
  }
}

export async function GET() {
  const supabaseGifts = await getSupabaseGifts();

  const source =
    supabaseGifts.length > 0
      ? supabaseGifts
      : expandedGiftCatalog;

  const gifts = source.map(normalizeGift);

  return NextResponse.json({
    ok: true,
    source: supabaseGifts.length > 0 ? "supabase" : "fallback",
    count: gifts.length,
    gifts,
  });
}
