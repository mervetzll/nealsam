import { NextRequest, NextResponse } from "next/server";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { affiliateConfig, siteTracking } from "@/config/affiliate";

export const runtime = "nodejs";

type Platform =
  | "google"
  | "trendyol"
  | "amazon"
  | "hepsiburada"
  | "sephora"
  | "watsons"
  | "gratis"
  | "rossmann"
  | "thepurest"
  | "nars"
  | "maybelline"
  | "decathlon"
  | "nike"
  | "adidas"
  | "sportive"
  | "dr"
  | "kitapyurdu"
  | "bkmkitap"
  | "idefix"
  | "teknosa"
  | "mediamarkt"
  | "vatan"
  | "ikea"
  | "englishhome"
  | "madamecoco"
  | "karaca"
  | "mudo"
  | "ciceksepeti";

function addParams(url: URL, params: Record<string, string>) {
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

function buildDirectStoreUrl(platform: Platform, query: string) {
  const q = query?.trim() || "hediye";

  if (platform === "sephora") {
    const url = new URL("https://www.sephora.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "watsons") {
    const url = new URL("https://www.watsons.com.tr/search");
    url.searchParams.set("text", q);
    return url;
  }

  if (platform === "gratis") {
    const url = new URL("https://www.gratis.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "rossmann") {
    const url = new URL("https://www.rossmann.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "thepurest") {
    const url = new URL("https://thepurestsolutions.com/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "nars") {
    const url = new URL("https://www.narscosmetics.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "maybelline") {
    const url = new URL("https://www.maybelline.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "decathlon") {
    const url = new URL("https://www.decathlon.com.tr/search");
    url.searchParams.set("Ntt", q);
    return url;
  }

  if (platform === "nike") {
    const url = new URL("https://www.nike.com.tr/w");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "adidas") {
    const url = new URL("https://www.adidas.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "sportive") {
    const url = new URL("https://www.sportive.com.tr/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "dr") {
    const url = new URL("https://www.dr.com.tr/search");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "kitapyurdu") {
    const url = new URL("https://www.kitapyurdu.com/index.php");
    url.searchParams.set("route", "product/search");
    url.searchParams.set("filter_name", q);
    return url;
  }

  if (platform === "bkmkitap") {
    const url = new URL("https://www.bkmkitap.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "idefix") {
    const url = new URL("https://www.idefix.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "teknosa") {
    const url = new URL("https://www.teknosa.com/arama/");
    url.searchParams.set("s", q);
    return url;
  }

  if (platform === "mediamarkt") {
    const url = new URL("https://www.mediamarkt.com.tr/tr/search.html");
    url.searchParams.set("query", q);
    return url;
  }

  if (platform === "vatan") {
    const url = new URL("https://www.vatanbilgisayar.com/arama/");
    url.searchParams.set("search", q);
    return url;
  }

  if (platform === "ikea") {
    const url = new URL("https://www.ikea.com.tr/arama/");
    url.searchParams.set("query", q);
    return url;
  }

  if (platform === "englishhome") {
    const url = new URL("https://www.englishhome.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "madamecoco") {
    const url = new URL("https://www.madamecoco.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "karaca") {
    const url = new URL("https://www.karaca.com/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "mudo") {
    const url = new URL("https://www.mudo.com.tr/arama");
    url.searchParams.set("q", q);
    return url;
  }

  if (platform === "ciceksepeti") {
    const url = new URL("https://www.ciceksepeti.com/arama");
    url.searchParams.set("query", q);
    return url;
  }

  const fallbackUrl = new URL("https://www.google.com/search");
  fallbackUrl.searchParams.set("q", q);
  return fallbackUrl;
}

function buildTargetUrl(platform: Platform, query: string) {
  const cleanQuery = query?.trim() || "hediye";

  if (platform === "google") {
    const url = new URL("https://www.google.com/search");
    url.searchParams.set("q", cleanQuery);
    return url;
  }

  if (platform === "trendyol") {
    const url = new URL("https://www.trendyol.com/sr");
    url.searchParams.set("q", cleanQuery);

    addParams(url, {
      utm_source: siteTracking.utmSource,
      utm_medium: siteTracking.utmMedium,
      utm_campaign: siteTracking.utmCampaign,
    });

    if (affiliateConfig.trendyol.enabled) {
      url.searchParams.set("partner", affiliateConfig.trendyol.partnerId);
    }

    return url;
  }

  if (platform === "amazon") {
    const url = new URL("https://www.amazon.com.tr/s");
    url.searchParams.set("k", cleanQuery);

    addParams(url, {
      utm_source: siteTracking.utmSource,
      utm_medium: siteTracking.utmMedium,
      utm_campaign: siteTracking.utmCampaign,
    });

    if (affiliateConfig.amazon.enabled) {
      url.searchParams.set("tag", affiliateConfig.amazon.tag);
    }

    return url;
  }

  if (platform === "hepsiburada") {
    const url = new URL("https://www.hepsiburada.com/ara");
    url.searchParams.set("q", cleanQuery);

    addParams(url, {
      utm_source: siteTracking.utmSource,
      utm_medium: siteTracking.utmMedium,
      utm_campaign: siteTracking.utmCampaign,
    });

    if (affiliateConfig.hepsiburada.enabled) {
      url.searchParams.set("partner", affiliateConfig.hepsiburada.partnerId);
    }

    return url;
  }

  return buildDirectStoreUrl(platform, cleanQuery);
}

function saveClick(request: NextRequest, platform: Platform, query: string) {
  const analyticsDir = path.join(process.cwd(), "analytics");

  if (!existsSync(analyticsDir)) {
    mkdirSync(analyticsDir);
  }

  const filePath = path.join(analyticsDir, "clicks.jsonl");

  const clickData = {
    clickedAt: new Date().toISOString(),
    platform,
    query,
    referrer: request.headers.get("referer") || "",
    userAgent: request.headers.get("user-agent") || "",
  };

  appendFileSync(filePath, JSON.stringify(clickData) + "\n", "utf8");
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const platform = searchParams.get("platform") as Platform | null;
  const query = searchParams.get("q")?.trim() || "hediye";

  const allowedPlatforms: Platform[] = [
    "google",
    "trendyol",
    "amazon",
    "hepsiburada",
    "sephora",
    "watsons",
    "gratis",
    "rossmann",
    "thepurest",
    "nars",
    "maybelline",
    "decathlon",
    "nike",
    "adidas",
    "sportive",
    "dr",
    "kitapyurdu",
    "bkmkitap",
    "idefix",
    "teknosa",
    "mediamarkt",
    "vatan",
    "ikea",
    "englishhome",
    "madamecoco",
    "karaca",
    "mudo",
    "ciceksepeti",
  ];

  if (!platform || !allowedPlatforms.includes(platform)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  saveClick(request, platform, query);

  const targetUrl = buildTargetUrl(platform, query);

  return NextResponse.redirect(targetUrl);
}
