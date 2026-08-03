import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function isAdmin(sessionCookie?: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!isAdmin(sessionCookie)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase environment variables are missing",
      },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [
    profilesResult,
    savedGiftsResult,
    favoriteGiftsResult,
    subscriptionsResult,
    premiumResult,
    giftsResult,
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),

    supabaseAdmin
      .from("saved_gift_results")
      .select("id", { count: "exact", head: true }),

    supabaseAdmin
      .from("favorite_gifts")
      .select("id", { count: "exact", head: true }),

    supabaseAdmin
      .from("user_subscriptions")
      .select("id", { count: "exact", head: true }),

    supabaseAdmin
      .from("user_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("status", "active")
      .in("plan", ["plus", "experience", "premium"]),

    supabaseAdmin
      .from("gifts")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  return NextResponse.json({
    ok: true,
    stats: {
      activeGifts: giftsResult.count || 0,
      profiles: profilesResult.count || 0,
      savedGiftResults: savedGiftsResult.count || 0,
      favoriteGifts: favoriteGiftsResult.count || 0,
      subscriptions: subscriptionsResult.count || 0,
      premiumUsers: premiumResult.count || 0,
    },
    errors: {
      activeGifts: giftsResult.error?.message || null,
      profiles: profilesResult.error?.message || null,
      savedGiftResults: savedGiftsResult.error?.message || null,
      favoriteGifts: favoriteGiftsResult.error?.message || null,
      subscriptions: subscriptionsResult.error?.message || null,
      premiumUsers: premiumResult.error?.message || null,
    },
  });
}
