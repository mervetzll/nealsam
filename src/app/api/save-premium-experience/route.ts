import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseWithToken(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Kaydetmek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseWithToken(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { ok: false, error: "Kullanıcı bulunamadı." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const conceptKey = String(body?.conceptKey || "");
    const conceptTitle = String(body?.conceptTitle || "");
    const personName = String(body?.personName || "");
    const senderName = String(body?.senderName || "");
    const relation = String(body?.relation || "");
    const giftName = String(body?.giftName || "");
    const tone = String(body?.tone || "");
    const noteLength = String(body?.noteLength || "");
    const specialDetail = String(body?.specialDetail || "");
    const generatedText = String(body?.generatedText || "");

    if (!conceptKey || !conceptTitle || !generatedText) {
      return NextResponse.json(
        { ok: false, error: "Kaydedilecek deneyim eksik." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("saved_premium_experiences")
      .insert({
        user_id: user.id,
        concept_key: conceptKey,
        concept_title: conceptTitle,
        person_name: personName || null,
        sender_name: senderName || null,
        relation: relation || null,
        gift_name: giftName || null,
        tone: tone || null,
        note_length: noteLength || null,
        special_detail: specialDetail || null,
        generated_text: generatedText,
      })
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
      experience: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Deneyim kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}
