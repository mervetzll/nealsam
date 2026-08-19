import { NextRequest, NextResponse } from "next/server";
import { getGiftStoreLinks } from "@/lib/giftPresentation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const gift = {
      title: String(body?.title || body?.giftTitle || body?.gift?.title || ""),
      name: String(body?.name || body?.gift?.name || ""),
      category: String(body?.category || body?.gift?.category || ""),
      description: String(body?.description || body?.gift?.description || ""),
      tags: Array.isArray(body?.tags) ? body.tags : [],
    };

    return NextResponse.json({
      ok: true,
      links: getGiftStoreLinks(gift),
      stores: getGiftStoreLinks(gift),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Mağaza linkleri oluşturulamadı." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const gift = {
    title: searchParams.get("title") || searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    description: "",
    tags: [],
  };

  return NextResponse.json({
    ok: true,
    links: getGiftStoreLinks(gift),
    stores: getGiftStoreLinks(gift),
  });
}
