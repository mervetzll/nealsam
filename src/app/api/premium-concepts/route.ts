import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { premiumConcepts as fallbackConcepts } from "@/data/premiumConcepts";

export const dynamic = "force-dynamic";

function toFallbackResponse() {
  return NextResponse.json({
    ok: true,
    source: "fallback",
    concepts: fallbackConcepts,
  });
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return toFallbackResponse();
    }

    const supabase = createClient(supabaseUrl, anonKey);

    const { data, error } = await supabase
      .from("premium_concepts")
      .select(
        "concept_key,title,badge,description,best_for,sample,premium_level,is_active"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return toFallbackResponse();
    }

    const concepts = data.map((item) => ({
      id: item.concept_key,
      title: item.title,
      badge: item.badge,
      description: item.description,
      bestFor: item.best_for || [],
      sample: item.sample,
      premiumLevel: item.premium_level,
    }));

    return NextResponse.json({
      ok: true,
      source: "supabase",
      concepts,
    });
  } catch {
    return toFallbackResponse();
  }
}
