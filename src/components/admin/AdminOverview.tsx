"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminStats = {
  totalUsers: number;
  totalGifts: number;
  activeGifts: number;
  totalFavorites: number;
  savedResults: number;
  paymentAttempts: number;
  paidPayments: number;
  storeClicks: number;
  topStores: { store: string; count: number }[];
};

const emptyStats: AdminStats = {
  totalUsers: 0,
  totalGifts: 0,
  activeGifts: 0,
  totalFavorites: 0,
  savedResults: 0,
  paymentAttempts: 0,
  paidPayments: 0,
  storeClicks: 0,
  topStores: [],
};

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/admin-stats", {
          cache: "no-store",
        });

        const data = await response.json();

        if (data?.ok && data?.stats) {
          setStats(data.stats);
        }
      } catch {
        setStats(emptyStats);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      label: "Toplam Kullanıcı",
      value: stats.totalUsers,
      note: "Sisteme kayıtlı hesaplar",
    },
    {
      label: "Toplam Hediye",
      value: stats.totalGifts,
      note: "Veritabanındaki tüm hediyeler",
    },
    {
      label: "Aktif Hediye",
      value: stats.activeGifts,
      note: "Kullanıcıya önerilen hediyeler",
    },
    {
      label: "Favoriler",
      value: stats.totalFavorites,
      note: "Kullanıcıların favoriye aldığı hediyeler",
    },
    {
      label: "Kayıtlı Öneriler",
      value: stats.savedResults,
      note: "Hesaba kaydedilen hediye sonuçları",
    },
    {
      label: "Ödeme Denemesi",
      value: stats.paymentAttempts,
      note: "Başlatılan ödeme işlemleri",
    },
    {
      label: "Başarılı Ödeme",
      value: stats.paidPayments,
      note: "Ödemesi tamamlanan işlemler",
    },
    {
      label: "Mağaza Tıklaması",
      value: stats.storeClicks,
      note: "Hediye sonuçlarından mağaza geçişleri",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Admin Özet
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            NeAlsam Yönetim Paneli
          </h1>

          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            Hediye havuzu, kullanıcılar, ödemeler ve mağaza tıklamalarını buradan
            takip edebilirsin.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
          >
            Kullanıcılar
          </Link>

          <Link
            href="/admin/payments"
            className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
          >
            Ödemeler
          </Link>

          <Link
            href="/admin/clicks"
            className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
          >
            Tıklamalar
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
          İstatistikler yükleniyor...
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
              >
                <p className="text-sm font-black text-[#6b4a4a]">
                  {card.label}
                </p>

                <p className="mt-3 text-4xl font-black text-[#2b1b1b]">
                  {card.value}
                </p>

                <p className="mt-2 text-xs font-semibold leading-5 text-[#8a6a6a]">
                  {card.note}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5">
              <h2 className="text-xl font-black text-[#2b1b1b]">
                En Çok Tıklanan Mağazalar
              </h2>

              <div className="mt-4 space-y-3">
                {stats.topStores.length === 0 ? (
                  <p className="text-sm font-semibold text-[#8a6a6a]">
                    Henüz mağaza tıklaması yok.
                  </p>
                ) : (
                  stats.topStores.map((store, index) => (
                    <div
                      key={store.store}
                      className="flex items-center justify-between rounded-2xl bg-[#fff4ef] px-4 py-3"
                    >
                      <span className="text-sm font-black text-[#2b1b1b]">
                        {index + 1}. {store.store}
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                        {store.count} tık
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-pink-100 bg-[#fff0f7] p-5">
              <h2 className="text-xl font-black text-[#2b1b1b]">
                Sıradaki Admin Geliştirmeleri
              </h2>

              <div className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#6b4a4a]">
                <p>1. Hediye ekleme / düzenleme formunu güçlendireceğiz.</p>
                <p>2. Mağaza yönetimi sayfası ekleyeceğiz.</p>
                <p>3. Premium konseptleri admin’den yönetilebilir yapacağız.</p>
              </div>

              <Link
                href="/admin"
                className="mt-5 inline-flex rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
              >
                Hediye Yönetimine Git
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
