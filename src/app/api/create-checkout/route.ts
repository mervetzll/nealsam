import { NextResponse } from "next/server";
import { getPlanById } from "@/lib/plans";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = getPlanById(body.planId);

    if (!plan) {
      return NextResponse.json(
        { message: "Geçersiz paket seçimi." },
        { status: 400 }
      );
    }

    /**
     * Güvenli mantık:
     * - Fiyat frontend'den alınmaz.
     * - Plan ID gelir.
     * - Gerçek fiyat server tarafında src/lib/plans.ts dosyasından okunur.
     * - Kart bilgisi bizim sisteme girmez.
     * - Sonraki adımda iyzico/PayTR burada başlatılacak.
     */
    return NextResponse.json({
      ok: true,
      status: "payment_provider_required",
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
      },
      message:
        "Ödeme altyapısı hazır. Gerçek ödeme için iyzico veya PayTR mağaza bilgileri bağlanmalı.",
    });
  } catch {
    return NextResponse.json(
      { message: "Ödeme başlatılırken hata oluştu." },
      { status: 500 }
    );
  }
}
