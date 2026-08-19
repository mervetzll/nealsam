import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return { supabaseUrl, anonKey, serviceRoleKey };
}

function getAnonSupabase(token?: string) {
  const { supabaseUrl, anonKey } = getEnv();

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

function getAdminSupabase() {
  const { supabaseUrl, serviceRoleKey } = getEnv();

  if (!serviceRoleKey) {
    throw new Error("Supabase service role key is missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function getUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return { user: null, token: "" };
  }

  const supabase = getAnonSupabase(token);

  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  return { user, token };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") || "published";
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const auth = await getUser(request);
    const supabase = getAdminSupabase();

    let query = supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (scope === "mine") {
      if (!auth.user) {
        return NextResponse.json(
          { ok: false, error: "Giriş yapmalısın." },
          { status: 401 }
        );
      }

      query = query.eq("author_id", auth.user.id);
    } else {
      query = query.eq("status", "published");
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`
      );
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      posts: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Blog yazıları alınamadı.",
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
        { ok: false, error: "Blog yazısı göndermek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body?.title || "").trim();
    const excerpt = String(body?.excerpt || "").trim();
    const content = String(body?.content || "").trim();
    const category = String(body?.category || "Genel").trim();
    const coverImageUrl = String(body?.coverImageUrl || "").trim();
    const saveAsDraft = Boolean(body?.saveAsDraft);

    if (!title || !content) {
      return NextResponse.json(
        { ok: false, error: "Başlık ve yazı metni zorunlu." },
        { status: 400 }
      );
    }

    const baseSlug = makeSlug(title) || "blog-yazisi";
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        author_id: auth.user.id,
        title,
        slug,
        excerpt: excerpt || content.slice(0, 160),
        content,
        category: category || "Genel",
        cover_image_url: coverImageUrl || null,
        status: saveAsDraft ? "draft" : "pending",
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
      post: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Blog yazısı kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getUser(request);

    if (!auth.user) {
      return NextResponse.json(
        { ok: false, error: "Düzenlemek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id = String(body?.id || "");
    const title = String(body?.title || "").trim();
    const excerpt = String(body?.excerpt || "").trim();
    const content = String(body?.content || "").trim();
    const category = String(body?.category || "Genel").trim();
    const coverImageUrl = String(body?.coverImageUrl || "").trim();
    const saveAsDraft = Boolean(body?.saveAsDraft);

    if (!id || !title || !content) {
      return NextResponse.json(
        { ok: false, error: "Eksik blog bilgisi." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const { data: existingPost, error: findError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !existingPost) {
      return NextResponse.json(
        { ok: false, error: "Blog yazısı bulunamadı." },
        { status: 404 }
      );
    }

    if (existingPost.author_id !== auth.user.id) {
      return NextResponse.json(
        { ok: false, error: "Bu blog yazısını düzenleyemezsin." },
        { status: 403 }
      );
    }

    const nextStatus = saveAsDraft ? "draft" : "pending";

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        excerpt: excerpt || content.slice(0, 160),
        content,
        category: category || "Genel",
        cover_image_url: coverImageUrl || null,
        status: nextStatus,
        admin_note: null,
        updated_at: new Date().toISOString(),
        published_at: null,
      })
      .eq("id", id)
      .eq("author_id", auth.user.id)
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
      post: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Blog yazısı güncellenemedi.",
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
        { ok: false, error: "Silinecek blog bulunamadı." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id)
      .eq("author_id", auth.user.id);

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
        error: error instanceof Error ? error.message : "Blog silinemedi.",
      },
      { status: 500 }
    );
  }
}
