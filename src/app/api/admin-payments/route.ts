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
      { ok: false, error: "Supabase env eksik." },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabaseAdmin
    .from("payment_attempts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const totalRevenue = (data || [])
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.price || 0), 0);

  return NextResponse.json({
    ok: true,
    payments: data || [],
    summary: {
      totalPayments: data?.length || 0,
      paidPayments: (data || []).filter((item) => item.status === "paid").length,
      failedPayments: (data || []).filter((item) => item.status === "failed").length,
      initializedPayments: (data || []).filter((item) => item.status === "initialized").length,
      totalRevenue,
    },
  });
}
