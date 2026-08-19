import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function checkAdmin(sessionCookie?: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!checkAdmin(sessionCookie)) {
    return NextResponse.json(
      { ok: false, error: "Yetkisiz işlem." },
      { status: 401 }
    );
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const supabase = getAdminSupabase();

    let query = supabase
      .from("blog_comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`comment.ilike.%${search}%,display_name.ilike.%${search}%`);
    }

    const { data: comments, error } = await query;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const postIds = [...new Set((comments || []).map((comment) => comment.post_id))];

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id,title,slug")
      .in("id", postIds.length ? postIds : ["00000000-0000-0000-0000-000000000000"]);

    const postMap = new Map((posts || []).map((post) => [post.id, post]));

    const enrichedComments = await Promise.all(
      (comments || []).map(async (comment) => {
        let userEmail = "";

        try {
          const { data } = await supabase.auth.admin.getUserById(comment.user_id);
          userEmail = data.user?.email || "";
        } catch {
          userEmail = "";
        }

        const post = postMap.get(comment.post_id);

        return {
          ...comment,
          user_email: userEmail,
          post_title: post?.title || "",
          post_slug: post?.slug || "",
        };
      })
    );

    return NextResponse.json({
      ok: true,
      comments: enrichedComments,
      summary: {
        total: enrichedComments.length,
        published: enrichedComments.filter((item) => item.status === "published").length,
        hidden: enrichedComments.filter((item) => item.status === "hidden").length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Yorumlar alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await request.json();
    const id = String(body?.id || "");
    const status = String(body?.status || "");

    if (!id || !["published", "hidden"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz yorum bilgisi." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from("blog_comments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
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
        error:
          error instanceof Error ? error.message : "Yorum güncellenemedi.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminError = await requireAdmin();
    if (adminError) return adminError;

    const body = await request.json();
    const id = String(body?.id || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Silinecek yorum bulunamadı." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", id);

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
