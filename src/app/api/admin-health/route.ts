import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      ok: false,
      supabase: "missing_env",
      activeGiftCount: 0,
      message: "Supabase environment variables are missing.",
    });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { count, error } = await supabase
      .from("gifts")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({
        ok: false,
        supabase: "error",
        activeGiftCount: 0,
        message: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      supabase: "connected",
      activeGiftCount: count || 0,
      message: "Supabase connection is working.",
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      supabase: "error",
      activeGiftCount: 0,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
