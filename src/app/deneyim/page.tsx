"use client";

import PremiumConceptCards from "@/components/PremiumConceptCards";
import { Suspense } from "react";

import { useEffect, useState } from "react";
import PremiumLock from "@/components/PremiumLock";
import { getCurrentUserPlan, isPremiumPlan } from "@/lib/subscription";
import ExperienceModes from "@/components/ExperienceModes";
import PageHero from "@/components/ui/PageHero";

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
    <main className="min-h-screen bg-[#fff4ef] text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl px-5">
        <PageHero
          eyebrow="QR not ve deneyim"
          title="Hediyenin ürünü sende,"
          accent="hikâyesi bizde."
          description="Hediyenin yanına koyacağın notu, QR kodlu mesajı, hikâyeyi veya bilmeceyi hazırla. QR kodu hediyeye ekle; notun dijital bir sürprize dönüşsün."
        />

        {planLoaded && !isPremium && (
          <div className="mb-8">
            <PremiumLock
              title="QR not, özel mektup ve hikâye akışı Premium ile açılır"
              description="Fikirleri ücretsiz görebilirsin; QR kodlu mesaj, özel mektup ve premium deneyim için bir paket seçmen gerekir."
            />
          </div>
        )}
      </section>

      <ExperienceModes />
            <Suspense fallback={null}>
          <PremiumConceptLauncher />
        </Suspense>

        <PremiumConceptCards />
      </main>
  );
}