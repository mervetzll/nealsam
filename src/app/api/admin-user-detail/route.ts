import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
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

async function isAdmin() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

async function safeSelect(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  table: string,
  userId: string,
  limit = 50
) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Kullanıcı ID eksik." },
        { status: 400 }
      );
    }

    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId);

    if (userError || !userData?.user) {
      return NextResponse.json(
        { ok: false, error: userError?.message || "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const user = userData.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const favorites = await safeSelect(supabase, "favorite_gifts", userId, 50);
    const savedResults = await safeSelect(
      supabase,
      "saved_gift_results",
      userId,
      50
    );
    const payments = await safeSelect(supabase, "payment_attempts", userId, 50);
    const clicks = await safeSelect(supabase, "store_clicks", userId, 50);
    const premiumExperiences = await safeSelect(
      supabase,
      "saved_premium_experiences",
      userId,
      50
    );

    let adminNote = null;

    try {
      const { data } = await supabase
        .from("user_admin_notes")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      adminNote = data || null;
    } catch {
      adminNote = null;
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at,
      },
      profile: profile || null,
      subscription: subscription || null,
      favorites,
      savedResults,
      payments,
      clicks,
      premiumExperiences,
      adminNote,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Kullanıcı detayı alınamadı.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { ok: false, error: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const userId = body.userId;
    const action = body.action;

    if (!userId || !action) {
      return NextResponse.json(
        { ok: false, error: "Kullanıcı ID veya işlem eksik." },
        { status: 400 }
      );
    }

    if (action === "update_note") {
      const note = String(body.note || "");

      const { data, error } = await supabase
        .from("user_admin_notes")
        .upsert(
          {
            user_id: userId,
            note,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
        .select("*")
        .single();

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ ok: true, adminNote: data });
    }

    if (action === "update_plan") {
      const plan = String(body.plan || "free");

      await supabase
        .from("user_subscriptions")
        .update({ status: "inactive" })
        .eq("user_id", userId)
        .eq("status", "active");

      if (plan !== "free") {
        const { error } = await supabase.from("user_subscriptions").insert({
          user_id: userId,
          plan,
          status: "active",
          source: "admin",
        });

        if (error) {
          return NextResponse.json(
            { ok: false, error: error.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Bilinmeyen işlem." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Kullanıcı güncellenemedi.",
      },
      { status: 500 }
    );
  }
}
