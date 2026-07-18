"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const planMap: Record<
  string,
  {
    name: string;
    price: string;
    description: string;
    features: string[];
  }
> = {
  note: {
    name: "Not Paketi",
    price: "49 TL / ay",
    description: "Kişisel hediye notları, QR mesaj ve yazdırılabilir metinler.",
    features: [
      "Ayda 30 premium not",
      "Ayda 30 QR mesaj",
      "Kısa, uzun, komik ve duygusal notlar",
      "WhatsApp mesajı ve yazdırılabilir not",
    ],
  },
  experience: {
    name: "Deneyim Paketi",
    price: "99 TL / ay",
    description: "Hediye avı, hikâye, gizemli ipucu ve mektup içerikleri.",
    features: [
      "Ayda 20 deneyim içeriği",
      "Ayda 20 QR mesaj",
      "Hediye Avı planı",
      "Kader Bağları, Gizemli Hediye ve Gelecekteki Ben",
    ],
  },
  premium: {
    name: "Premium Özel Paket",
    price: "149 TL / ay",
    description: "Not Paketi + Deneyim Paketi + daha uzun özel içerikler.",
    features: [
      "Ayda 100 içerik",
      "Ayda 100 QR mesaj",
      "Tüm not ve deneyim modları",
      "Premium uzun mektup ve basılabilir kart taslağı",
    ],
  },
};

type DemoUser = {
  name: string;
  email: string;
  emailVerified?: boolean;
};

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "note";

  const [user, setUser] = useState<DemoUser | null>(null);

  const plan = useMemo(() => {
    return planMap[selectedPlan] || planMap.note;
  }, [selectedPlan]);

  useEffect(() => {
    const savedUser = localStorage.getItem("nealsam_user");

    if (!savedUser) {
      alert("Ödeme yapmadan önce giriş yapmalısın.");
      router.push("/giris");
      return;
    }

    setUser(JSON.parse(savedUser));
  }, [router]);

  function completeDemoPayment() {
    localStorage.setItem("nealsam_plan", selectedPlan);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = JSON.parse(localStorage.getItem("nealsam_usage") || "{}");

    usage[currentMonth] = {
      ...(usage[currentMonth] || {}),
      [selectedPlan]: 0,
    };

    localStorage.setItem("nealsam_usage", JSON.stringify(usage));

    alert("Demo ödeme başarılı. Paket hesabına tanımlandı.");
    router.push("/hesabim");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-6">Yönlendiriliyor...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="mb-4 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#b83280]">
            Ödeme özeti
          </p>

          <h1 className="text-4xl font-black">{plan.name}</h1>

          <p className="mt-4 text-lg leading-8 text-[#6b4b4b]">
            {plan.description}
          </p>

          <div className="mt-6 rounded-3xl bg-[#fff7f3] p-6">
            <p className="text-sm font-bold text-[#b83280]">Aylık ücret</p>
            <p className="mt-2 text-5xl font-black text-[#b83280]">
              {plan.price}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {plan.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 text-sm font-bold"
              >
                ✓ {feature}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={completeDemoPayment}
              className="rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
            >
              Demo ödeme yap
            </button>

            <Link
              href="/paketler"
              className="rounded-full bg-[#fff0f7] px-6 py-3 font-bold text-[#b83280]"
            >
              Paketi değiştir
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl bg-[#2b1b1b] p-8 text-white shadow-sm">
          <p className="text-sm font-bold text-[#ffd6e8]">Hesap bilgisi</p>

          <h2 className="mt-3 text-3xl font-black">
            Paket doğrulanmış hesabına tanımlanacak.
          </h2>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-7">
            <p>
              <strong>E-posta:</strong> {user.email}
            </p>
            <p>
              <strong>Durum:</strong>{" "}
              {user.emailVerified ? "E-posta doğrulandı" : "Demo hesap"}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm leading-7">
            Bu sayfa demo ödeme ekranıdır. Gerçek sürümde burada iyzico,
            Stripe veya Shopier ödeme formu olur.
          </div>
        </aside>
      </section>
    </main>
  );
}
