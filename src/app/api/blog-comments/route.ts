import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseWithToken(token?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, anonKey, {
    global: token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  });
}

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return { user: null, token: "", supabase: getSupabaseWithToken() };
  }

  const supabase = getSupabaseWithToken(token);

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return { user, token, supabase };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId") || "";

    if (!postId) {
      return NextResponse.json(
        { ok: false, error: "Blog yazısı bulunamadı." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseWithToken();

    const { data, error } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      comments: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Yorumlar alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getUser(request);

    if (!auth.user) {
      return NextResponse.json(
        { ok: false, error: "Yorum yapmak için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const postId = String(body?.postId || "");
    const comment = String(body?.comment || "").trim();
    const displayName = String(body?.displayName || "").trim();

    if (!postId || !comment) {
      return NextResponse.json(
        { ok: false, error: "Yorum metni zorunlu." },
        { status: 400 }
      );
    }

    const { data, error } = await auth.supabase
      .from("blog_comments")
      .insert({
        post_id: postId,
        user_id: auth.user.id,
        display_name: displayName || auth.user.email || "Üye",
        comment,
        status: "published",
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
      comment: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Yorum kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await getUser(request);

    if (!auth.user) {
      return NextResponse.json(
        { ok: false, error: "Silmek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const id = String(body?.id || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Silinecek yorum bulunamadı." },
        { status: 400 }
      );
    }

    const { error } = await auth.supabase
      .from("blog_comments")
      .delete()
      .eq("id", id)
      .eq("user_id", auth.user.id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Yorum silinemedi.",
      },
      { status: 500 }
    );
  }
}
