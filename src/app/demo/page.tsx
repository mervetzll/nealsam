"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DemoPage() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    localStorage.setItem("nealsam_plan", "premium");
    localStorage.setItem("nealsam_user_plan", "premium");
    localStorage.setItem("nealsam_current_plan", "premium");
    localStorage.setItem("nealsam_demo_active", "true");
    localStorage.setItem("nealsam_used_count", "0");

    setActivated(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-16 text-[#2b1b1b]">
      <section className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
          NeAlsam Demo
        </p>

        <h1 className="mt-5 text-4xl font-extrabold">
          Demo erişim açıldı
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#6b4b4b]">
          Yanlışlıkla iptal ettiğin demo paketi için test erişimini tekrar açtık.
          Artık not, QR, hikaye, bulmaca ve hediye deneyimlerini test edebilirsin.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-5 text-left">
          <p className="font-bold text-[#b83280]">
            Durum: {activated ? "Demo aktif" : "Demo hazırlanıyor"}
          </p>

          <ul className="mt-4 space-y-2 text-sm font-semibold text-[#6b4b4b]">
            <li>✓ Premium deneyim modları açıldı</li>
            <li>✓ QR not sistemi test edilebilir</li>
            <li>✓ Hikaye modu test edilebilir</li>
            <li>✓ Bulmaca / Hediye Avı test edilebilir</li>
            <li>✓ Hediye fikirleri ve yönlendirme test edilebilir</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/deneyim?plan=premium"
            className="rounded-full bg-[#b83280] px-7 py-4 text-sm font-bold text-white"
          >
            Deneyim modlarını aç
          </Link>

          <Link
            href="/hesabim?plan=premium"
            className="rounded-full bg-[#fff0f7] px-7 py-4 text-sm font-bold text-[#b83280]"
          >
            Hesabımı kontrol et
          </Link>
        </div>
      </section>
    </main>
  );
}
