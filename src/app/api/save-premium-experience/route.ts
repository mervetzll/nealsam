import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { ok: false, error: "Supabase environment variables are missing." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Kaydetmek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

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

    const payload = {
      user_id: user.id,
      concept_key: body.conceptKey,
      concept_title: body.conceptTitle,
      person_name: body.personName || "",
      relation: body.relation || "",
      gift_name: body.giftName || "",
      tone: body.tone || "",
      generated_text: body.generatedText || "",
    };

    if (!payload.concept_key || !payload.concept_title || !payload.generated_text) {
      return NextResponse.json(
        { ok: false, error: "Kaydedilecek deneyim bilgisi eksik." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("saved_premium_experiences")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, experience: data });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Premium deneyim kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}
