import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminClient() {
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

async function safeCount(
  supabase: ReturnType<typeof getAdminClient>,
  table: string,
  filter?: (query: any) => any
) {
  try {
    let query = supabase.from(table).select("*", {
      count: "exact",
      head: true,
    });

    if (filter) {
      query = filter(query);
    }

    const { count, error } = await query;

    if (error) {
      return 0;
    }

    return count || 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    let totalUsers = 0;

    try {
      const { data } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });

      totalUsers = data?.users?.length ? data.users.length : 0;

      // Supabase listUsers total dönmezse daha geniş sayalım
      const allUsers = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      totalUsers = allUsers.data?.users?.length || totalUsers;
    } catch {
      totalUsers = 0;
    }

    const totalGifts = await safeCount(supabase, "gifts");
    const activeGifts = await safeCount(supabase, "gifts", (q) =>
      q.eq("is_active", true)
    );

    const totalFavorites = await safeCount(supabase, "favorite_gifts");
    const savedResults = await safeCount(supabase, "saved_gift_results");
    const paymentAttempts = await safeCount(supabase, "payment_attempts");
    const paidPayments = await safeCount(supabase, "payment_attempts", (q) =>
      q.eq("status", "paid")
    );
    const storeClicks = await safeCount(supabase, "store_clicks");

    let topStores: { store: string; count: number }[] = [];

    try {
      const { data } = await supabase
        .from("store_clicks")
        .select("store")
        .limit(1000);

      const counts = new Map<string, number>();

      for (const item of data || []) {
        const store = item.store || "Bilinmeyen";
        counts.set(store, (counts.get(store) || 0) + 1);
      }

      topStores = Array.from(counts.entries())
        .map(([store, count]) => ({ store, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    } catch {
      topStores = [];
    }

    return NextResponse.json({
      ok: true,
      stats: {
        totalUsers,
        totalGifts,
        activeGifts,
        totalFavorites,
        savedResults,
        paymentAttempts,
        paidPayments,
        storeClicks,
        topStores,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Admin istatistikleri alınamadı.",
      },
      { status: 500 }
    );
  }
}
