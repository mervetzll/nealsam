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

async function safeSelect(
  supabase: any,
  table: string,
  userId: string
) {
  try {
    const { data } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
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

    const [premiumExperiences, favoriteGifts, savedGiftResults] =
      await Promise.all([
        safeSelect(supabase, "saved_premium_experiences", user.id),
        safeSelect(supabase, "favorite_gifts", user.id),
        safeSelect(supabase, "saved_gift_results", user.id),
      ]);

    return NextResponse.json({
      ok: true,
      premiumExperiences,
      favoriteGifts,
      savedGiftResults,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Kaydedilenler alınamadı.",
      },
      { status: 500 }
    );
  }
}
