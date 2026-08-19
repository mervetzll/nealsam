import { NextResponse } from "next/server";
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Deneyim ID eksik." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("saved_premium_experiences")
      .select(
        "id, concept_key, concept_title, person_name, sender_name, relation, gift_name, tone, note_length, special_detail, generated_text, hunt_location, hunt_steps, hunt_difficulty, hunt_style, hunt_detail, lock_enabled, lock_question, lock_answer, unlock_at, mood_enabled, mood_happy, mood_emotional, mood_romantic, mood_funny, mood_nostalgic, created_at"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { ok: false, error: "Paylaşılacak deneyim bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      experience: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Deneyim alınamadı.",
      },
      { status: 500 }
    );
  }
}
