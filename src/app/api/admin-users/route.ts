import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const allowedPlans = ["free", "note", "plus", "experience", "premium"];

function isAdmin(sessionCookie?: string) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(sessionSecret && sessionCookie === sessionSecret);
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!isAdmin(sessionCookie)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: authUsers, error: authError } =
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

  if (authError) {
    return NextResponse.json(
      { ok: false, error: authError.message },
      { status: 500 }
    );
  }

  const users = authUsers.users || [];
  const userIds = users.map((user) => user.id);

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, name, default_budget, favorite_interests, gift_style")
    .in("id", userIds);

  const { data: subscriptions } = await supabaseAdmin
    .from("user_subscriptions")
    .select("id, user_id, plan, status, started_at, expires_at")
    .in("user_id", userIds)
    .order("started_at", { ascending: false });

  const { data: savedCounts } = await supabaseAdmin
    .from("saved_gift_results")
    .select("user_id")
    .in("user_id", userIds);

  const { data: favoriteCounts } = await supabaseAdmin
    .from("favorite_gifts")
    .select("user_id")
    .in("user_id", userIds);

  const profileMap = new Map((profiles || []).map((item) => [item.id, item]));
  const subMap = new Map();

  for (const subscription of subscriptions || []) {
    if (!subMap.has(subscription.user_id) && subscription.status === "active") {
      subMap.set(subscription.user_id, subscription);
    }
  }

  function countFor(list: { user_id: string }[] | null, userId: string) {
    return (list || []).filter((item) => item.user_id === userId).length;
  }

  return NextResponse.json({
    ok: true,
    users: users.map((user) => {
      const profile = profileMap.get(user.id);
      const subscription = subMap.get(user.id);

      return {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        name: profile?.name || "",
        defaultBudget: profile?.default_budget || "",
        favoriteInterests: profile?.favorite_interests || "",
        giftStyle: profile?.gift_style || "",
        plan: subscription?.plan || "free",
        subscriptionStatus: subscription?.status || "active",
        savedGiftCount: countFor(savedCounts, user.id),
        favoriteGiftCount: countFor(favoriteCounts, user.id),
      };
    }),
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!isAdmin(sessionCookie)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const userId = body.userId;
  const plan = body.plan;

  if (!userId || !allowedPlans.includes(plan)) {
    return NextResponse.json(
      { ok: false, error: "Invalid user or plan" },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  await supabaseAdmin
    .from("user_subscriptions")
    .update({ status: "inactive" })
    .eq("user_id", userId)
    .eq("status", "active");

  const { error } = await supabaseAdmin.from("user_subscriptions").insert({
    user_id: userId,
    plan,
    status: "active",
    started_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Plan updated",
  });
}
