"use client";

import { Suspense } from "react";

import { useEffect, useState } from "react";
import PremiumLock from "@/components/PremiumLock";
import { getCurrentUserPlan, isPremiumPlan } from "@/lib/subscription";
import ExperienceModes from "@/components/ExperienceModes";

import PremiumConceptLauncher from "@/components/PremiumConceptLauncher";
export default function DeneyimPage() {
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
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      

      <section className="mx-auto max-w-6xl px-6 pb-4 pt-6 text-center">
        <p className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm">
          Deneyim Modları
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight md:text-4xl md:text-6xl">
          Hediyenin ürün kısmı sende, hikâyesi bizde.
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
          İstersen bir hediye fikri bul, istersen hediyenin yanına
          koyacağın notu, QR kodlu mesajı, mektubu, hikâyeyi veya bilmece
          akışını oluştur. QR kodu hediyenin yanına ekleyerek notunu dijital
          bir sürprize dönüştürebilirsin.
          Ürünü biz satmayız; fikri ve sunumu kişiselleştiririz.
        </p>
      </section>

        {planLoaded && !isPremium && (
          <div className="mx-auto mt-8 max-w-4xl">
            <PremiumLock
              title="QR not, özel mektup ve hikâye akışı Premium ile açılır"
              description="Ücretsiz olarak fikri görebilirsin; QR kodlu mesaj, özel mektup ve premium hediye deneyimi için paket seçmen gerekir."
            />
          </div>
        )}


      <ExperienceModes />
            <Suspense fallback={null}>
          <PremiumConceptLauncher />
        </Suspense>
      </main>
  );
}