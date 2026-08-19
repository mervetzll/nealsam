import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type BlogStatus = "draft" | "pending" | "published" | "rejected";

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
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`
      );
    }

    const { data: posts, error } = await query;

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const enrichedPosts = await Promise.all(
      (posts || []).map(async (post) => {
        let authorEmail = "";

        try {
          const { data } = await supabase.auth.admin.getUserById(post.author_id);
          authorEmail = data.user?.email || "";
        } catch {
          authorEmail = "";
        }

        return {
          ...post,
          author_email: authorEmail,
        };
      })
    );

    const summary = {
      total: enrichedPosts.length,
      pending: enrichedPosts.filter((post) => post.status === "pending").length,
      published: enrichedPosts.filter((post) => post.status === "published").length,
      draft: enrichedPosts.filter((post) => post.status === "draft").length,
      rejected: enrichedPosts.filter((post) => post.status === "rejected").length,
    };

    return NextResponse.json({
      ok: true,
      posts: enrichedPosts,
      summary,
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

export async function PATCH(request: NextRequest) {
  try {
    const adminError = await requireAdmin();

    if (adminError) return adminError;

    const body = await request.json();

    const id = String(body?.id || "");
    const status = String(body?.status || "") as BlogStatus;
    const adminNote = String(body?.adminNote || "");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Blog yazısı bulunamadı." },
        { status: 400 }
      );
    }

    if (!["draft", "pending", "published", "rejected"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz durum." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const updatePayload: Record<string, any> = {
      status,
      admin_note: adminNote || null,
      updated_at: new Date().toISOString(),
    };

    if (status === "published") {
      updatePayload.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updatePayload)
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
      post: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Blog güncellenemedi.",
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
        { ok: false, error: "Silinecek blog bulunamadı." },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabase();

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

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
        error: error instanceof Error ? error.message : "Blog silinemedi.",
      },
      { status: 500 }
    );
  }
}
