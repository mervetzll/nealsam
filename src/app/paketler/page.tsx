"use client";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import { useEffect, useState } from "react";

const packages = [
  {
    id: "free",
    name: "Ücretsiz",
    price: "0 TL",
    period: "/ ay",
    badge: "Başlangıç",
    description:
      "Hediye fikri bulmak ve temel not seçeneklerini denemek isteyenler için.",
    features: [
      "Hediye fikri önerisi",
      "İnternette arama linkleri",
      "Temel kısa not",
      "Hazır örneklerle deneme",
    ],
    cta: "Ücretsiz dene",
    href: "/hediye-bul",
    highlight: false,
  },
  {
    id: "note",
    name: "Not Paketi",
    price: "49 TL",
    period: "/ ay",
    badge: "En mantıklı",
    description:
      "Seçtiğin hediyenin yanına koyabileceğin daha özel notlar ve QR mesaj için.",
    features: [
      "Kısa, uzun, komik ve duygusal not seçenekleri",
      "QR kodlu hediye mesajı",
      "WhatsApp mesaj metni",
      "Yazdırılabilir not metni",
      "Kopyala ve indir özellikleri",
    ],
    cta: "Not Paketi al",
    href: "/deneyim?mode=not",
    highlight: true,
  },
  {
    id: "experience",
    name: "Deneyim Paketi",
    price: "99 TL",
    period: "/ ay",
    badge: "Yaratıcı",
    description:
      "Sadece not değil; hikâye, bilmece, hediye avı ve özel sunum isteyenler için.",
    features: [
      "Hediye Avı planı",
      "Kader Bağları hikâyesi",
      "Gizemli Hediye ipucu kartları",
      "Gelecekteki Ben mektubu",
      "QR açıklama metni",
      "Sunum ve paketleme fikri",
    ],
    cta: "Deneyim Paketi al",
    href: "/deneyim",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium Özel Paket",
    price: "149 TL",
    period: "/ ay",
    badge: "En dolu",
    description:
      "Hediyeyi daha özel, daha kişisel ve daha profesyonel göstermek isteyenler için.",
    features: [
      "Tüm Not Paketi özellikleri",
      "Tüm Deneyim Paketi özellikleri",
      "Daha uzun kişisel mektup",
      "3 farklı ton alternatifi",
      "Premium romantik / arkadaş / özür metinleri",
      "Basılabilir özel içerik taslağı",
    ],
    cta: "Premium al",
    href: "/deneyim?mode=not",
    highlight: false,
  },
];

export default function PackagesPage() {
  const [activePlan, setActivePlan] = useState("free");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem("nealsam_plan");

    if (savedPlan) {
      setActivePlan(savedPlan);
    }

    setIsLoggedIn(Boolean(localStorage.getItem("nealsam_user")));
  }, []);

  function buyPlan(planId: string) {
    const savedUser = localStorage.getItem("nealsam_user");

    if (!savedUser) {
      alert("Paket satın almak için önce giriş yapmalısın.");
      window.location.href = "/giris";
      return;
    }

    localStorage.setItem("nealsam_plan", planId);
    setActivePlan(planId);
    alert("Demo ödeme başarılı. Paket hesabına tanımlandı.");
  }

  function cancelPlan() {
    localStorage.setItem("nealsam_plan", "free");
    setActivePlan("free");
    alert("Demo abonelik iptal edildi. Ücretsiz plana döndün.");
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-10 text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-[#b83280] shadow-sm">
            Aylık Premium Paketler
          </p>

          <h1 className="text-5xl font-black">
            Hediyeyi sen al, hikâyesini biz yazalım.
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
            NeAlsam fiziksel ürün satmaz. Ürünü kullanıcı internetten alır;
            biz hediyenin yanına koyulacak notu, QR mesajı, hikâyeyi, mektubu
            ve yaratıcı sunumu hazırlarız.
          </p>

          <div className="mx-auto mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-[#b83280] shadow-sm">
            Aktif paket:{" "}
            <span className="ml-1">
              {packages.find((item) => item.id === activePlan)?.name ||
                "Ücretsiz"}
            </span>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-black text-[#b83280]">
              Hesaba tanımlanır
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              Ödeme sonrası paket hesabına tanımlanır. Ay içinde tekrar giriş
              yapıp kullanabilirsin.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-black text-[#b83280]">
              Aylık kullanım
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              Paketler aylıktır. Not, QR veya deneyim hakların hesabında
              görünür.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 text-left shadow-sm">
            <p className="text-sm font-black text-[#b83280]">
              Güvenli ödeme altyapısı
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              Bu demo sürümde ödeme simülasyondur. Gerçek sürümde iyzico,
              Stripe veya Shopier bağlanabilir.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((item) => {
            const isActive = activePlan === item.id;

            return (
              <div
                key={item.name}
                className={`rounded-3xl border p-6 shadow-sm ${
                  item.highlight
                    ? "border-[#b83280] bg-white ring-4 ring-[#f6d7e8]"
                    : "border-[#f0d7df] bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-black">{item.name}</h2>

                  <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                    {isActive ? "Aktif" : item.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-1">
                  <p className="text-4xl font-black text-[#b83280]">
                    {item.price}
                  </p>

                  <p className="pb-1 text-sm font-bold text-[#8b6f6f]">
                    {item.period}
                  </p>
                </div>

                <p className="mt-4 min-h-[72px] text-sm leading-6 text-[#6b4b4b]">
                  {item.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm leading-6">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-[#b83280]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {item.id === "free" ? (
                  <Link
                    href={item.href}
                    className="mt-8 block rounded-full bg-[#fff0f7] px-5 py-3 text-center text-sm font-bold text-[#b83280]"
                  >
                    Ücretsiz dene
                  </Link>
                ) : isActive ? (
                  <Link
                    href={item.href}
                    className="mt-8 block rounded-full bg-[#b83280] px-5 py-3 text-center text-sm font-bold text-white"
                  >
                    Paketi kullan
                  </Link>
                ) : (
                  <Link
                    href={`/odeme?plan=${item.id}`}
                    className={`mt-8 block w-full rounded-full px-5 py-3 text-center text-sm font-bold ${
                      item.highlight
                        ? "bg-[#b83280] text-white"
                        : "bg-[#fff0f7] text-[#b83280]"
                    }`}
                  >
                    {item.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {activePlan !== "free" && (
          <div className="mt-8 text-center">
            <button
              onClick={cancelPlan}
              className="rounded-full border border-[#e8c4d8] bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
            >
              Demo aboneliği iptal et
            </button>
          </div>
        )}

        <div className="mt-12 rounded-3xl bg-white p-6 text-center shadow-sm">
          <h3 className="text-2xl font-black">Ödeme sistemi notu</h3>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-[#6b4b4b]">
            Bu sayfa şu an demo abonelik mantığıyla çalışır. Gerçek ödeme için
            sonraki aşamada iyzico, Stripe veya Shopier bağlanabilir. Demo
            satın alma localStorage içine kayıt atar ve premium alanları açar.
          </p>
        </div>
      </section>
    </main>
  );
}
