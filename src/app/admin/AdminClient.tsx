"use client";

import { useState } from "react";
import GiftManager from "@/components/admin/GiftManager";

type TabId = "dashboard" | "gifts" | "seo" | "plans" | "tasks";

const tabs: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "gifts", label: "Hediyeler" },
  { id: "seo", label: "SEO" },
  { id: "plans", label: "Paketler" },
  { id: "tasks", label: "Yapılacaklar" },
];

const liveLinks = [
  { label: "Canlı site", href: "https://nealsamhediye.com" },
  { label: "Hediye Bul", href: "https://nealsamhediye.com/hediye-bul" },
  { label: "Blog", href: "https://nealsamhediye.com/blog" },
  { label: "Deneyim", href: "https://nealsamhediye.com/deneyim" },
];

const seoPages = [
  "https://nealsamhediye.com/",
  "https://nealsamhediye.com/hediye-bul",
  "https://nealsamhediye.com/blog",
  "https://nealsamhediye.com/blog/kime-ne-hediye-alinir",
  "https://nealsamhediye.com/blog/sevgiliye-ne-hediye-alinir",
  "https://nealsamhediye.com/sitemap.xml",
];

const tasks = [
  {
    title: "Hediye havuzunu büyüt",
    desc: "Kadın, erkek, anne, baba, arkadaş, sevgili ve iş arkadaşı için daha fazla ürün ekle.",
    status: "Devam ediyor",
  },
  {
    title: "Mağaza linklerini test et",
    desc: "Cilt bakımı, makyaj, teknoloji, takı ve ev kategorilerinde doğru mağazaya gidiyor mu kontrol et.",
    status: "Önemli",
  },
  {
    title: "Search Console kontrolü",
    desc: "Ana sayfa, hediye bul ve blog sayfaları index alıyor mu kontrol et.",
    status: "SEO",
  },
  {
    title: "Paketleri netleştir",
    desc: "Not, deneyim ve premium paketlerin kullanıcıya ne verdiğini sadeleştir.",
    status: "Ürün",
  },
];

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    try {
      setLoggingOut(true);
      await fetch("/api/admin-logout", {
        method: "POST",
      });
      window.location.href = "/admin/login";
    } catch {
      setLoggingOut(false);
      alert("Çıkış yapılırken hata oluştu.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-5 py-8 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
                NeAlsam Admin
              </p>
              <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">
                Yönetim paneli
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b4b4b]">
                Hediye fikirlerini, SEO sayfalarını, paketleri ve site kontrollerini
                buradan yönetebilirsin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openUrl("https://nealsamhediye.com")}
                className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white"
              >
                Siteyi Aç
              </button>

              <button
                onClick={logout}
                disabled={loggingOut}
                className="rounded-full border border-[#f0d7df] bg-[#fffaf7] px-5 py-3 text-sm font-bold text-[#b83280] disabled:opacity-50"
              >
                {loggingOut ? "Çıkılıyor..." : "Çıkış Yap"}
              </button>
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto rounded-full bg-[#fff0f7] p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-[#b83280] text-white shadow-sm"
                    : "text-[#6b4b4b] hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="mt-6 grid gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Site durumu</p>
                <h2 className="mt-3 text-3xl font-extrabold">Aktif</h2>
                <p className="mt-2 text-sm text-[#6b4b4b]">
                  Domain ve Vercel yayını çalışıyor.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Ana özellik</p>
                <h2 className="mt-3 text-3xl font-extrabold">Hediye Bul</h2>
                <p className="mt-2 text-sm text-[#6b4b4b]">
                  Filtreleme ve mağaza yönlendirme aktif.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">SEO</p>
                <h2 className="mt-3 text-3xl font-extrabold">Hazır</h2>
                <p className="mt-2 text-sm text-[#6b4b4b]">
                  Blog, sitemap ve Search Console kontrol edilecek.
                </p>
              </div>

              <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Paketler</p>
                <h2 className="mt-3 text-3xl font-extrabold">Test</h2>
                <p className="mt-2 text-sm text-[#6b4b4b]">
                  Ödeme altyapısı gerçek ödeme öncesi hazır durumda.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold">Hızlı linkler</h2>
                  <p className="mt-2 text-sm text-[#6b4b4b]">
                    Canlı sayfaları hızlıca kontrol et.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {liveLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => openUrl(link.href)}
                    className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5 text-left transition hover:bg-[#fff0f7]"
                  >
                    <p className="text-sm font-bold text-[#b83280]">
                      {link.label}
                    </p>
                    <p className="mt-2 break-all text-xs text-[#6b4b4b]">
                      {link.href}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "gifts" && (
          <div className="mt-6 rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold">Hediye yönetimi</h2>
              <p className="mt-2 text-sm text-[#6b4b4b]">
                Hediye ekle, sil, aktif/pasif yap ve sonuç havuzunu yönet.
              </p>
            </div>

            <GiftManager />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-extrabold">SEO kontrol listesi</h2>
              <p className="mt-2 text-sm text-[#6b4b4b]">
                Search Console’da kontrol edilecek önemli sayfalar.
              </p>

              <div className="mt-5 grid gap-3">
                {seoPages.map((page) => (
                  <div
                    key={page}
                    className="flex flex-col gap-3 rounded-3xl bg-[#fffaf7] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <p className="break-all text-sm font-bold text-[#2b1b1b]">
                      {page}
                    </p>

                    <button
                      onClick={() => openUrl(page)}
                      className="rounded-full bg-[#b83280] px-4 py-2 text-sm font-bold text-white"
                    >
                      Aç
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">SEO notları</h2>

              <div className="mt-5 space-y-4 text-sm leading-6 text-[#6b4b4b]">
                <p>
                  Ana hedef kelime: <b>ne alsam hediye</b>
                </p>
                <p>
                  Hediye Bul sayfası ana dönüşüm sayfası olduğu için en önemli
                  sayfalardan biri.
                </p>
                <p>
                  Blog sayfaları Google’dan trafik çekmek için düzenli
                  genişletilmeli.
                </p>
                <p>
                  Admin, ödeme, demo ve kişisel not sayfaları indexlenmemeli.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Not Paketi",
                price: "29 TL",
                desc: "Hediye notu, QR mesaj ve kart indirme odaklı.",
              },
              {
                name: "Deneyim Paketi",
                price: "79 TL",
                desc: "Hikaye, gizemli hediye, kader bağı ve deneyim modları.",
              },
              {
                name: "Premium Paket",
                price: "149 TL",
                desc: "Tüm modlar, daha özel notlar ve kapsamlı deneyim.",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-[#b83280]">{plan.name}</p>
                <h2 className="mt-3 text-4xl font-extrabold">{plan.price}</h2>
                <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                  {plan.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="mt-6 rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-extrabold">Yapılacaklar</h2>
            <p className="mt-2 text-sm text-[#6b4b4b]">
              Siteyi büyütmek için sıradaki işler.
            </p>

            <div className="mt-6 grid gap-4">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold">{task.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                        {task.desc}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#b83280]">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
