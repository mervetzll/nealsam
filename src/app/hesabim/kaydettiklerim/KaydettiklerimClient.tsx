"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SavedExperience = {
  id: string;
  concept_key: string;
  concept_title: string;
  person_name: string | null;
  relation: string | null;
  gift_name: string | null;
  tone: string | null;
  generated_text: string;
  created_at: string;
};

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

export default function KaydettiklerimClient() {
  const [experiences, setExperiences] = useState<SavedExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadExperiences();
  }, []);

  async function loadExperiences() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMessage("Kaydettiklerini görmek için giriş yapmalısın.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/my-premium-experiences", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Kaydedilenler alınamadı.");
        return;
      }

      setExperiences(data.experiences || []);
    } catch {
      setMessage("Kaydedilenler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Metin kopyalandı.");
    } catch {
      alert("Kopyalanamadı. Metni elle seçip kopyalayabilirsin.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Hesabım
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Kaydettiklerim
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
              Hediye Avı, Kader Bağı, Anı Kutusu ve Gizli Mesaj gibi oluşturduğun
              premium deneyimleri burada görebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/deneyim"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
            >
              Yeni Deneyim Oluştur
            </Link>

            <Link
              href="/hesabim"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
            >
              Hesabıma Dön
            </Link>
          </div>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-5 text-sm font-black text-[#6b4a4a] shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black text-[#2b1b1b]">Kaydedilenler yükleniyor...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Henüz kaydedilmiş premium deneyimin yok.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#6b4a4a]">
              Bir Kader Bağı, Hediye Avı veya Gizli Mesaj oluşturup “Hesabıma
              Kaydet” butonuna bastığında burada görünecek.
            </p>

            <Link
              href="/deneyim"
              className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              İlk Deneyimini Oluştur
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {experiences.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-7"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                        {item.concept_title}
                      </span>

                      {item.tone && (
                        <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
                          {item.tone}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-[#2b1b1b]">
                      {item.gift_name || "Premium deneyim"}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                      {item.person_name ? `Kişi: ${item.person_name}` : "Kişi belirtilmedi"}
                      {item.relation ? ` · ${item.relation}` : ""}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
                      Kaydedilme tarihi: {formatDate(item.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/deneyim/paylas/${item.id}`}
                      className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
                    >
                      QR Kod / Paylaş
                    </Link>

                    <button
                      onClick={() => copyText(item.generated_text)}
                      className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                    >
                      Metni Kopyala
                    </button>
                  </div>
                </div>

                <pre className="mt-5 whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
                  {item.generated_text}
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
