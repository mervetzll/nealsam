"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getPlanById, plans } from "@/lib/plans";

export default function OdemeClient() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  const selectedPlan = useMemo(() => getPlanById(planId), [planId]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startCheckout() {
    if (!selectedPlan) return;

    setIsLoading(true);
    setMessage("");

    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId: selectedPlan.id }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "Ödeme başlatılamadı.");
      setIsLoading(false);
      return;
    }

    setMessage(
      "Güvenli ödeme altyapısı hazır. Gerçek kartlı ödeme için iyzico veya PayTR hesabı bağlanacak."
    );
    setIsLoading(false);
  }

  if (!selectedPlan) {
    return (
      <main className="min-h-screen bg-[#fff7f3] px-6 py-16 text-[#2b1b1b]">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Ödeme</p>
          <h1 className="mt-3 text-4xl font-extrabold">Paket seçimi bulunamadı</h1>
          <p className="mt-4 text-[#6b4b4b]">
            Ödeme sayfasına devam etmek için önce bir paket seçmelisin.
          </p>

          <div className="mt-8 grid gap-4">
            {plans.map((plan) => (
              <Link
                key={plan.id}
                href={`/odeme?plan=${plan.id}`}
                className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5 font-bold hover:border-[#b83280]"
              >
                {plan.name} — {plan.price} TL
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-16 text-[#2b1b1b]">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Güvenli Ödeme</p>
          <h1 className="mt-3 text-4xl font-extrabold">{selectedPlan.name}</h1>
          <p className="mt-4 text-lg leading-8 text-[#6b4b4b]">
            Kart bilgilerin NeAlsam tarafından saklanmaz. Gerçek ödeme aşamasında
            ödeme işlemi lisanslı ödeme kuruluşu üzerinden alınacak.
          </p>

          <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
            <p className="text-sm font-bold text-[#b83280]">Paket İçeriği</p>
            <ul className="mt-4 space-y-3">
              {selectedPlan.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm font-semibold">
                  <span className="text-[#b83280]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {message && (
            <div className="mt-6 rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5 text-sm font-bold text-[#b83280]">
              {message}
            </div>
          )}
        </section>

        <aside className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Sipariş Özeti</p>

          <div className="mt-6 border-b border-[#f0d7df] pb-6">
            <h2 className="text-2xl font-extrabold">{selectedPlan.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
              {selectedPlan.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-lg font-bold">
            <span>Toplam</span>
            <span>{selectedPlan.price} TL</span>
          </div>

          <button
            onClick={startCheckout}
            disabled={isLoading}
            className="mt-8 w-full rounded-full bg-[#b83280] px-6 py-4 text-sm font-bold text-white disabled:opacity-60"
          >
            {isLoading ? "Hazırlanıyor..." : "Güvenli ödemeye devam et"}
          </button>

          <p className="mt-5 text-xs leading-5 text-[#8a6f6f]">
            Bu aşamada kart bilgisi alınmaz. Canlı ödeme için iyzico veya PayTR
            mağaza hesabı bağlandıktan sonra ödeme sağlayıcısının güvenli ödeme
            ekranına yönlendirme yapılır.
          </p>
        </aside>
      </div>
    </main>
  );
}
