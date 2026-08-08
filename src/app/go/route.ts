import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const targetUrl = url.searchParams.get("url");
  const giftTitle = url.searchParams.get("gift") || "Bilinmeyen hediye";
  const storeName = url.searchParams.get("store") || "Bilinmeyen mağaza";
  const sourcePage = url.searchParams.get("source") || "unknown";

  if (!targetUrl || !targetUrl.startsWith("https://")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabaseAdmin = getSupabaseAdmin();

  if (supabaseAdmin) {
    await supabaseAdmin.from("store_clicks").insert({
      gift_title: giftTitle,
      store_name: storeName,
      target_url: targetUrl,
      source_page: sourcePage,
    });
  }

  return NextResponse.redirect(targetUrl);
}
