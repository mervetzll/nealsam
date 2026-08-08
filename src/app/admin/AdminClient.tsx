"use client";

import { useEffect, useMemo, useState } from "react";

import GiftManager from "@/components/admin/GiftManager";

type AdminTab = "dashboard" | "gifts" | "seo" | "packages" | "tasks";

type Gift = {
  id?: string;
  title: string;
  category: string;
  subCategory?: string;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  createdAt?: string;
};

type HealthStatus = {
  ok: boolean;
  supabase: string;
  activeGiftCount: number;
  message: string;
};

const SITE_URL = "https://nealsamhediye.com";


type AdminStats = {
  profiles: number;
  savedGiftResults: number;
  subscriptions: number;
  premiumUsers: number;
  activeGifts: number;
};

export default function AdminClient() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const response = await fetch("/api/admin-stats", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data.ok) {
          setAdminStats(data.stats);
        }
      } catch (error) {
        console.error("Admin stats could not be loaded", error);
      }
    }

    loadAdminStats();
  }, []);


  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadGifts() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin-gifts", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data.gifts)) {
        setGifts(data.gifts);
      }
    } catch (error) {
      console.error("Admin gifts could not be loaded", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadHealth() {
    try {
      const response = await fetch("/api/admin-health", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setHealth(data);
      }
    } catch (error) {
      console.error("Admin health could not be loaded", error);
    }
  }

  useEffect(() => {
    loadGifts();
    loadHealth();
  }, []);

  async function handleLogout() {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    window.location.href = "/admin/login";
  }

  const stats = useMemo(() => {
    const total = gifts.length;
    const active = gifts.filter((gift) => gift.isActive !== false).length;
    const passive = total - active;
    const categories = new Set(gifts.map((gift) => gift.category).filter(Boolean));

    const latest = [...gifts].slice(0, 5);

    return {
      total,
      active,
      passive,
      categoryCount: categories.size,
      latest,
      categories: Array.from(categories),
    };
  }, [gifts]);

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "gifts", label: "Hediyeler" },
    { id: "seo", label: "SEO" },
    { id: "packages", label: "Paketler" },
    { id: "tasks", label: "Yapılacaklar" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Tıklama Takibi
        </p>
        <h2 className="mt-2 text-xl font-black text-[#2b1b1b]">
          Mağaza Tıklamaları
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
          Hangi hediyeden hangi mağazaya gidildiğini takip et.
        </p>
        <a
          href="/admin/clicks"
          className="mt-4 inline-flex rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          Tıklamaları Gör
        </a>
      </div>


      <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Kullanıcı Yönetimi
        </p>
        <h2 className="mt-2 text-xl font-black text-[#2b1b1b]">
          Kullanıcılar ve Paketler
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
          Kullanıcıları görüntüle, paket durumlarını değiştir ve premium erişim ver.
        </p>
        <a
          href="/admin/users"
          className="mt-4 inline-flex rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
        >
          Kullanıcıları Yönet
        </a>
      </div>


      {adminStats && (
        <section className="grid gap-4 md:grid-cols-5">
          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Aktif Hediye
            </p>
            <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
              {adminStats.activeGifts}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Profil
            </p>
            <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
              {adminStats.profiles}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Kayıtlı Öneri
            </p>
            <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
              {adminStats.savedGiftResults}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Paket Kaydı
            </p>
            <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
              {adminStats.subscriptions}
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Premium
            </p>
            <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
              {adminStats.premiumUsers}
            </p>
          </div>
        </section>
      )}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-pink-600">NeAlsam Admin</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Yönetim Paneli
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Hediye önerilerini, SEO durumunu, paketleri ve geliştirme
              listesini buradan takip edebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={SITE_URL}
              target="_blank"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:text-pink-600"
            >
              Siteyi Aç
            </a>

            <a
              href={`${SITE_URL}/hediye-bul`}
              target="_blank"
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-600"
            >
              Hediye Bul Test
            </a>

            <button
              onClick={handleLogout}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-pink-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard
                title="Toplam Hediye"
                value={loading ? "..." : stats.total}
                description="Admin panelde kayıtlı tüm hediyeler"
              />
              <StatCard
                title="Aktif Hediye"
                value={loading ? "..." : stats.active}
                description="Hediye Bul'da gösterilebilenler"
              />
              <StatCard
                title="Pasif Hediye"
                value={loading ? "..." : stats.passive}
                description="Şimdilik yayında olmayanlar"
              />
              <StatCard
                title="Kategori"
                value={loading ? "..." : stats.categoryCount}
                description="Farklı hediye kategorisi"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-pink-600">
                    Sistem Durumu
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    Admin ve Supabase bağlantısı
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Bu alan Supabase ve admin API bağlantısının çalışıp
                    çalışmadığını hızlıca gösterir.
                  </p>
                </div>

                <button
                  onClick={() => {
                    loadGifts();
                    loadHealth();
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Yenile
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    API
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-950">
                    {health?.ok ? "OK" : "Kontrol ediliyor"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Supabase
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-950">
                    {health?.supabase === "connected"
                      ? "Çalışıyor"
                      : "Kontrol ediliyor"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Aktif Hediye
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-950">
                    {health?.activeGiftCount ?? stats.active}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">
                      Son Eklenen Hediyeler
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Supabase üzerinden gelen en güncel hediye kayıtları.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("gifts")}
                    className="rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-100"
                  >
                    Yönet
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {loading && (
                    <p className="text-sm text-slate-500">Yükleniyor...</p>
                  )}

                  {!loading && stats.latest.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Henüz hediye kaydı yok.
                    </p>
                  )}

                  {!loading &&
                    stats.latest.map((gift, index) => (
                      <div
                        key={`${gift.title}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {gift.title}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {gift.category}
                              {gift.subCategory ? ` / ${gift.subCategory}` : ""}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              gift.isActive === false
                                ? "bg-slate-200 text-slate-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {gift.isActive === false ? "Pasif" : "Aktif"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-950">
                  Kategori Özeti
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Hediye havuzunda hangi kategoriler var hızlıca görebilirsin.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {loading && (
                    <p className="text-sm text-slate-500">Yükleniyor...</p>
                  )}

                  {!loading && stats.categories.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Henüz kategori bulunamadı.
                    </p>
                  )}

                  {!loading &&
                    stats.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                      >
                        {category}
                      </span>
                    ))}
                </div>

                <div className="mt-6 rounded-2xl bg-pink-50 p-5">
                  <h3 className="font-bold text-pink-700">Canlı bağlantı</h3>
                  <p className="mt-2 text-sm text-pink-700/80">
                    Hediye Bul artık Supabase/Admin paneldeki aktif hediye
                    kayıtlarından öneri üretir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "gifts" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <GiftManager />
          </div>
        )}

        {activeTab === "seo" && (
          <AdminSection
            title="SEO Kontrol Listesi"
            description="Google'da görünürlük için takip edilecek temel işler."
          >
            <Checklist
              items={[
                "Search Console doğrulaması yapıldı.",
                "Sitemap gönderildi.",
                "Ana sayfa index kontrolü yapılacak.",
                "/hediye-bul index kontrolü yapılacak.",
                "Blog sayfalarına Hediye Bul yönlendirme kutusu eklenecek.",
                "Her blog yazısına güçlü başlık ve açıklama kontrolü yapılacak.",
              ]}
            />
          </AdminSection>
        )}

        {activeTab === "packages" && (
          <AdminSection
            title="Paketler"
            description="Ücretsiz ve premium deneyimlerin genel yapısı."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <PackageCard
                title="Ücretsiz"
                price="0 TL"
                items={[
                  "Temel hediye önerisi",
                  "Sınırlı sonuç",
                  "Basit mağaza yönlendirmesi",
                ]}
              />
              <PackageCard
                title="Plus"
                price="Orta paket"
                items={[
                  "Daha fazla öneri",
                  "Not fikri",
                  "Daha detaylı açıklama",
                ]}
              />
              <PackageCard
                title="Premium"
                price="Gelişmiş paket"
                items={[
                  "QR not deneyimi",
                  "Kişisel hediye kartı",
                  "Deneyim önerileri",
                ]}
              />
            </div>
          </AdminSection>
        )}

        {activeTab === "tasks" && (
          <AdminSection
            title="Yapılacaklar"
            description="Siteyi büyütmek için sıradaki mantıklı adımlar."
          >
            <Checklist
              items={[
                "Hediye Bul sonuç kartlarına rozetler eklenecek.",
                "Blog yazılarına CTA kutuları eklenecek.",
                "Admin panelde kategori ve aktif/pasif filtreleri güçlendirilecek.",
                "Gerçek ödeme altyapısı için iyzico veya PayTR seçilecek.",
                "Google Search Console'da önemli sayfalar tek tek kontrol edilecek.",
              ]}
            />
          </AdminSection>
        )}
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Checklist({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-bold text-white">
            ✓
          </span>
          <p className="text-sm font-medium text-slate-700">{item}</p>
        </div>
      ))}
    </div>
  );
}

function PackageCard({
  title,
  price,
  items,
}: {
  title: string;
  price: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-pink-600">{price}</p>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm text-slate-600">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
