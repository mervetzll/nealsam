import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type SavedType = "premium" | "favorites" | "saved";

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

function getTableName(type: SavedType) {
  if (type === "premium") return "saved_premium_experiences";
  if (type === "favorites") return "favorite_gifts";
  return "saved_gift_results";
}

async function safeSelect(supabase: any, table: string, userId: string) {
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

async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Giriş yapmalısın." },
        { status: 401 }
      ),
      token: "",
      supabase: null,
      user: null,
    };
  }

  const supabase = getSupabaseWithToken(token);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return {
      error: NextResponse.json(
        { ok: false, error: "Kullanıcı bulunamadı." },
        { status: 401 }
      ),
      token,
      supabase,
      user: null,
    };
  }

  return {
    error: null,
    token,
    supabase,
    user,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);

    if (auth.error || !auth.supabase || !auth.user) {
      return auth.error;
    }

    const [premiumExperiences, favoriteGifts, savedGiftResults] =
      await Promise.all([
        safeSelect(auth.supabase, "saved_premium_experiences", auth.user.id),
        safeSelect(auth.supabase, "favorite_gifts", auth.user.id),
        safeSelect(auth.supabase, "saved_gift_results", auth.user.id),
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

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getUserFromRequest(request);

    if (auth.error || !auth.supabase || !auth.user) {
      return auth.error;
    }

    const body = await request.json();
    const id = String(body?.id || "");
    const type = String(body?.type || "") as SavedType;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Silinecek kayıt bulunamadı." },
        { status: 400 }
      );
    }

    if (!["premium", "favorites", "saved"].includes(type)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz kayıt tipi." },
        { status: 400 }
      );
    }

    const tableName = getTableName(type);

    const { error } = await auth.supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", auth.user.id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Kayıt silinemedi.",
      },
      { status: 500 }
    );
  }
}
