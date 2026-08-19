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

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return { user: null, token: "" };

  const supabase = getSupabaseWithToken(token);

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return { user, token };
}

export async function GET(request: NextRequest) {
  try {
    const { user, token } = await getUser(request);

    if (!user || !token) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseWithToken(token);

    const { data, error } = await supabase
      .from("gift_calendar_events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, events: data || [] });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Takvim alınamadı." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, token } = await getUser(request);

    if (!user || !token) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const personName = String(body?.personName || "").trim();
    const relation = String(body?.relation || "").trim();
    const eventTitle = String(body?.eventTitle || "").trim();
    const eventDate = String(body?.eventDate || "").trim();
    const notes = String(body?.notes || "").trim();

    if (!personName || !eventTitle || !eventDate) {
      return NextResponse.json(
        { ok: false, error: "Kişi, etkinlik ve tarih zorunlu." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseWithToken(token);

    const { data, error } = await supabase
      .from("gift_calendar_events")
      .insert({
        user_id: user.id,
        person_name: personName,
        relation: relation || null,
        event_title: eventTitle,
        event_date: eventDate,
        notes: notes || null,
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, event: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Etkinlik eklenemedi." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, token } = await getUser(request);

    if (!user || !token) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = String(body?.id || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Silinecek kayıt bulunamadı." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseWithToken(token);

    const { error } = await supabase
      .from("gift_calendar_events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Kayıt silinemedi." },
      { status: 500 }
    );
  }
}
