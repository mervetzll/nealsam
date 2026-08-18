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

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const plan = searchParams.get("plan") || "all";

    let query = supabase
      .from("payment_attempts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (plan !== "all") {
      query = query.eq("plan", plan);
    }

    if (search.trim()) {
      query = query.or(
        `user_id.ilike.%${search}%,plan.ilike.%${search}%,status.ilike.%${search}%,iyzico_token.ilike.%${search}%,payment_id.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const payments = data || [];

    const userIds = Array.from(
      new Set(
        payments
          .map((payment) => payment.user_id)
          .filter(Boolean)
      )
    );

    const userEmailMap = new Map<string, string>();

    for (const userId of userIds) {
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        if (userData?.user?.email) {
          userEmailMap.set(userId, userData.user.email);
        }
      } catch {
        // email bulunamazsa boş geç
      }
    }

    const paymentsWithEmail = payments.map((payment) => ({
      ...payment,
      user_email: payment.user_id ? userEmailMap.get(payment.user_id) || "" : "",
    }));

    const summary = {
      total: payments.length,
      paid: payments.filter((item) => item.status === "paid").length,
      failed: payments.filter((item) => item.status === "failed").length,
      pending: payments.filter((item) => item.status === "pending").length,
    };

    return NextResponse.json({
      ok: true,
      payments: paymentsWithEmail,
      summary,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Ödemeler alınamadı.",
      },
      { status: 500 }
    );
  }
}
