"use client";

import { useEffect, useState } from "react";
import PremiumLock from "@/components/PremiumLock";
import { getCurrentUserPlan, isPremiumPlan } from "@/lib/subscription";

export default function HediyeNotuClient() {
  const [isPremium, setIsPremium] = useState(false);
  const [planLoaded, setPlanLoaded] = useState(false);

  useEffect(() => {
    async function loadPlan() {
      const plan = await getCurrentUserPlan();
      setIsPremium(isPremiumPlan(plan));
      setPlanLoaded(true);
    }

    loadPlan();
  }, []);

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      {planLoaded && !isPremium && (
        <div className="mx-auto mb-8 max-w-3xl">
          <PremiumLock
            title="QR hediye notu Premium ile açılır"
            description="Bu özel not sayfası ve QR deneyimi Premium paketle aktif olur. Paket seçmeden kart bilgisi alınmaz."
          />
        </div>
      )}

      <section className="mx-auto max-w-3xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-black text-pink-600">NeAlsam Hediye</p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          Özel Hediye Notu
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
          Bu alan QR kodla açılan özel hediye notu ve dijital sürpriz sayfası
          için hazırlanıyor.
        </p>

        {isPremium ? (
          <div className="mt-8 rounded-2xl bg-[#fff0f7] p-6 text-left">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Premium aktif
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
              Premium kullanıcılar için özel not, mektup ve QR deneyimi burada
              gösterilecek.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-[#fff0f7] p-6 text-left">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Önizleme
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
              Premium paket seçildiğinde bu sayfada kişiye özel not ve QR
              deneyimi açılır.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
