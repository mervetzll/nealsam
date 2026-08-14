"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const packageDetails = {
  free: {
    name: "Ücretsiz",
    price: 0,
    description: "Temel hediye önerileriyle başlamak için.",
  },
  plus: {
    name: "Plus",
    price: 49,
    description: "Daha kişisel hediye önerileri için.",
  },
  experience: {
    name: "Deneyim",
    price: 79,
    description: "QR not ve özel hediye deneyimi için.",
  },
  premium: {
    name: "Premium",
    price: 99,
    description: "Tüm premium özellikleri açmak için.",
  },
};

type PlanId = keyof typeof packageDetails;

export default function OdemeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = (searchParams.get("plan") || "premium") as PlanId;

  const plan = packageDetails[selectedPlan] || packageDetails.premium;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startPayment() {
    setLoading(true);
    setMessage("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      setMessage("Ödeme yapmak için önce giriş yapmalısın.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        plan: selectedPlan,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      setMessage(data.error || "Ödeme başlatılamadı.");
      setLoading(false);
      return;
    }

    if (data.paymentPageUrl) {
      window.location.href = data.paymentPageUrl;
      return;
    }

    setMessage("Ödeme sayfası alınamadı.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
        >
          ← Geri Dön
        </button>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-pink-600">
              Güvenli Ödeme
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              {plan.name} Paketi
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
              {plan.description}
            </p>

            <div className="mt-8 rounded-2xl bg-[#fff0f7] p-6">
              <p className="text-sm font-black text-[#6b4a4a]">Paket Fiyatı</p>
              <p className="mt-2 text-5xl font-black text-[#2b1b1b]">
                {plan.price} TL
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-pink-100 bg-[#fff4ef] p-5">
              <p className="text-sm font-black text-[#2b1b1b]">
                Önemli güvenlik notu
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                Kart bilgileri NeAlsam Hediye üzerinde alınmaz ve saklanmaz.
                Online ödeme altyapısı hazırlanıyor. Şimdilik premium erişim admin panelden manuel tanımlanır.
              </p>
            </div>

            {message && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-black text-amber-800">
                {message}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {selectedPlan === "free" ? (
                <Link
                  href="/hediye-bul"
                  className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
                >
                  Ücretsiz Başla
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={startPayment}
                  disabled={loading}
                  className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white transition hover:bg-pink-700 disabled:opacity-60"
                >
                  {loading ? "Ödeme başlatılıyor..." : "Online Ödeme Yakında"}
                </button>
              )}

              <Link
                href="/paketler"
                className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Paketi Değiştir
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Hesap Özeti
            </h2>

            <div className="mt-6 space-y-4">
              <Row label="Paket" value={plan.name} />
              <Row label="Paket Bedeli" value={`${plan.price} TL`} />
              <Row label="Hizmet Bedeli" value="0 TL" />
              <Row label="İndirim" value="0 TL" />
            </div>

            <div className="mt-6 border-t border-pink-100 pt-6">
              <Row label="Ödenecek Toplam" value={`${plan.price} TL`} strong />
            </div>

            <div className="mt-6 rounded-2xl bg-[#fff0f7] p-5">
              <p className="text-sm font-black text-[#2b1b1b]">
                Test / Sandbox modu
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                Şu anda iyzico sandbox bilgileriyle test ediyorsan gerçek ücret
                tahsil edilmez.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-pink-100 bg-[#fff4ef] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Test ödeme akışı
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/odeme/basarili"
                  className="rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white transition hover:opacity-90"
                >
                  Başarılı Test
                </a>

                <a
                  href="/odeme/basarisiz"
                  className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
                >
                  Başarısız Test
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-sm ${
          strong ? "font-black text-[#2b1b1b]" : "font-semibold text-[#6b4a4a]"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-sm ${
          strong ? "font-black text-[#2b1b1b]" : "font-bold text-[#2b1b1b]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
