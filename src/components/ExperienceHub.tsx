"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import ExperienceModes from "@/components/ExperienceModes";

const PremiumConceptLauncher = dynamic(() => import("@/components/PremiumConceptLauncher"), { loading: () => <p role="status" className="p-6">Konsept hazırlanıyor…</p> });

type Mode = "note" | "qr" | "hunt" | "premium";
const modes: { id: Mode; icon: string; title: string; description: string }[] = [
  { id: "note", icon: "✍️", title: "Hediye notu yaz", description: "Hazır bir not seç, kendi sözlerinle düzenle ve kopyala." },
  { id: "qr", icon: "💌", title: "QR sürpriz hazırla", description: "Notuna özel bir bağlantı ve indirilebilir QR oluştur." },
  { id: "hunt", icon: "🔎", title: "Hediye avı planla", description: "Hediyenin yanına koyabileceğin ipucu kartlarını hazırla." },
  { id: "premium", icon: "✨", title: "Özel konsept oluştur", description: "Mektup, anı kutusu ve gelişmiş sürpriz seçeneklerini keşfet." },
];

export default function ExperienceHub({ gift, hasConcept }: { gift: string; hasConcept: boolean }) {
  const [mode, setMode] = useState<Mode | null>(hasConcept ? "premium" : gift ? "qr" : null);
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-6 md:pt-16">
        <p className="text-sm font-bold text-pink-600">Hediyene kişisel bir dokunuş</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight md:text-5xl">Nasıl bir sürpriz hazırlamak istersin?</h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#6b4b4b]">Bir yol seç; notunu, mesajını veya ipuçlarını adım adım kişiselleştir.</p>
        {gift && <p className="mt-5 inline-block break-words rounded-2xl bg-white px-4 py-3 text-sm font-bold">Seçtiğin hediye: {gift}</p>}
        <div className="mt-7 grid gap-3 sm:grid-cols-2" aria-label="Deneyim seçimi">
          {modes.map(item => <button key={item.id} type="button" aria-pressed={mode === item.id} aria-controls="experience-workspace" onClick={() => {
              setMode(item.id);
              requestAnimationFrame(() => {
                const workspace = document.getElementById("experience-workspace");
                workspace?.focus({ preventScroll: true });
                workspace?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
              });
            }}
            className={`rounded-3xl border-2 p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600 ${mode === item.id ? "border-pink-600 bg-white shadow-sm" : "border-pink-100 bg-white/70 hover:border-pink-300"}`}>
            <span aria-hidden="true" className="text-2xl">{item.icon}</span>
            <span className="mt-3 block text-lg font-extrabold">{item.title}</span>
            <span className="mt-2 block text-sm leading-6 text-[#6b4b4b]">{item.description}</span>
            <span className="mt-3 block text-sm font-bold text-pink-700">{mode === item.id ? "Seçili ✓" : "Başla →"}</span>
          </button>)}
        </div>
        {!mode && <p className="mt-5 text-sm text-[#6b4b4b]">Başlamak için yukarıdan bir seçenek seç.</p>}
      </section>
      <div id="experience-workspace" tabIndex={-1} aria-label="Seçilen deneyimi hazırla" className="scroll-mt-36 outline-none">
        {mode && mode !== "premium" && <ExperienceModes mode={mode} />}
        {mode === "premium" && <Suspense fallback={<p role="status" className="p-6">Konsept yükleniyor…</p>}><PremiumConceptLauncher /></Suspense>}
      </div>
    </>
  );
}
