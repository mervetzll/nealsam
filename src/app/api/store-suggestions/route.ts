import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStoreLinksForGift } from "@/utils/giftStores";

export const dynamic = "force-dynamic";

type StoreRule = {
  id: string;
  store_name: string;
  category: string;
  budget_level: string;
  keywords: string[];
  search_prefix: string;
  affiliate_url: string | null;
  priority: number;
  is_active: boolean;
};

type GiftLike = Record<string, any>;

function normalize(value: unknown) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .trim();
}

function getGiftText(gift: GiftLike) {
  const parts = [
    gift.title,
    gift.category,
    gift.subCategory,
    gift.sub_category,
    gift.reason,
    gift.note,
    gift.searchQuery,
    gift.search_query,
    ...(Array.isArray(gift.interests) ? gift.interests : []),
    ...(Array.isArray(gift.styles) ? gift.styles : []),
  ];

  return normalize(parts.filter(Boolean).join(" "));
}

function getGiftCategory(gift: GiftLike) {
  return normalize(`${gift.category || ""} ${gift.subCategory || gift.sub_category || ""}`);
}

function getBudgetLevel(gift: GiftLike) {
  const max = Number(gift.priceMax || gift.price_max || 0);

  if (!max) return "all";
  if (max <= 700) return "budget";
  if (max <= 2000) return "mid";
  return "premium";
}

function getSearchQuery(gift: GiftLike) {
  return String(
    gift.searchQuery ||
      gift.search_query ||
      gift.title ||
      "hediye"
  );
}

function buildTargetUrl(rule: StoreRule, gift: GiftLike) {
  const query = encodeURIComponent(getSearchQuery(gift));

  if (rule.affiliate_url) {
    return rule.affiliate_url;
  }

  if (rule.search_prefix) {
    return `${rule.search_prefix}${query}`;
  }

  return "";
}

function scoreRule(rule: StoreRule, gift: GiftLike) {
  const giftText = getGiftText(gift);
  const giftCategory = getGiftCategory(gift);
  const budgetLevel = getBudgetLevel(gift);

  const ruleCategory = normalize(rule.category);
  const ruleBudget = normalize(rule.budget_level || "all");

  let score = 0;

  if (ruleCategory === "all") score += 5;
  if (ruleCategory && giftCategory.includes(ruleCategory)) score += 40;
  if (ruleCategory && giftText.includes(ruleCategory)) score += 25;

  if (ruleBudget === "all") score += 10;
  if (ruleBudget === budgetLevel) score += 25;

  const keywords = Array.isArray(rule.keywords) ? rule.keywords : [];

  for (const keyword of keywords) {
    const cleanKeyword = normalize(keyword);
    if (cleanKeyword && giftText.includes(cleanKeyword)) {
      score += 18;
    }
  }

  score += Math.max(0, 10 - Number(rule.priority || 1));

  return score;
}

function makeTrackedUrl(rule: StoreRule, targetUrl: string, gift: GiftLike) {
  const params = new URLSearchParams({
    store: rule.store_name,
    gift: String(gift.title || "hediye"),
    url: targetUrl,
  });

  return `/go?${params.toString()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gift = body.gift || {};

    const fallbackLinks = getStoreLinksForGift(gift);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({
        ok: true,
        source: "fallback",
        links: fallbackLinks,
      });
    }

    const supabase = createClient(supabaseUrl, anonKey);

    const { data, error } = await supabase
      .from("store_rules")
      .select("*")
      .eq("is_active", true)
      .order("priority", { ascending: true });

    if (error || !data?.length) {
      return NextResponse.json({
        ok: true,
        source: "fallback",
        links: fallbackLinks,
      });
    }

    const matchedLinks = (data as StoreRule[])
      .map((rule) => {
        const score = scoreRule(rule, gift);
        const targetUrl = buildTargetUrl(rule, gift);

        if (!targetUrl || score <= 0) return null;

        return {
          label: rule.store_name,
          href: makeTrackedUrl(rule, targetUrl, gift),
          reason: "Admin mağaza kuralına göre önerildi.",
          note:
            rule.budget_level === "premium"
              ? "Bu hediye için premium mağaza seçeneği önerildi."
              : "Bu hediye için uygun mağaza seçeneği önerildi.",
          priority: score >= 45 ? "best" : "normal",
          score,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)
      .map((item: any) => ({
        label: item.label,
        href: item.href,
        reason: item.reason,
        note: item.note,
        priority: item.priority,
      }));

    return NextResponse.json({
      ok: true,
      source: matchedLinks.length ? "supabase" : "fallback",
      links: matchedLinks.length ? matchedLinks : fallbackLinks,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      links: [],
    });
  }
}
