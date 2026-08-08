"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type StoreClick = {
  id: string;
  gift_title: string;
  store_name: string;
  target_url: string;
  source_page: string | null;
  created_at: string;
};

type ClickSummary = {
  totalClicks: number;
  topStores: { name: string; count: number }[];
  topGifts: { name: string; count: number }[];
};

export default function AdminClicksPage() {
  const [clicks, setClicks] = useState<StoreClick[]>([]);
  const [summary, setSummary] = useState<ClickSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadClicks();
  }, []);

  async function loadClicks() {
    setLoading(true);

    const response = await fetch("/api/admin-clicks", {
      cache: "no-store",
    });

    const data = await response.json();

    if (data.ok) {
      setClicks(data.clicks);
      setSummary(data.summary);
    } else {
      setMessage(data.error || "Tıklamalar yüklenemedi.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-pink-600">Admin Panel</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Mağaza Tıklamaları
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
              Hangi hediyeden hangi mağazaya gidildiğini buradan takip edebilirsin.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Admin Panele Dön
          </Link>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-4 text-sm font-black text-red-600 shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-[#2b1b1b]">Tıklamalar yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                  Toplam Tıklama
                </p>
                <p className="mt-2 text-4xl font-black text-[#2b1b1b]">
                  {summary?.totalClicks || 0}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                  En Çok Tıklanan Mağaza
                </p>
                <p className="mt-2 text-2xl font-black text-[#2b1b1b]">
                  {summary?.topStores?.[0]?.name || "Henüz yok"}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                  En Çok Tıklanan Hediye
                </p>
                <p className="mt-2 text-2xl font-black text-[#2b1b1b]">
                  {summary?.topGifts?.[0]?.name || "Henüz yok"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-[#2b1b1b]">
                Son tıklamalar
              </h2>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-pink-100">
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Hediye</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Mağaza</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Kaynak</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Tarih</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clicks.map((click) => (
                      <tr key={click.id} className="border-b border-pink-50">
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {click.gift_title}
                        </td>
                        <td className="px-3 py-4 text-sm font-black text-pink-700">
                          {click.store_name}
                        </td>
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {click.source_page || "-"}
                        </td>
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {new Date(click.created_at).toLocaleString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {clicks.length === 0 && (
                  <p className="py-8 text-center text-sm font-bold text-[#6b4a4a]">
                    Henüz mağaza tıklaması yok.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
