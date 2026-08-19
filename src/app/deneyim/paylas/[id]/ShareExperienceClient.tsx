"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

type Experience = {
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

export default function ShareExperienceClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadExperience();
  }, [experienceId]);

  async function loadExperience() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/public-premium-experience/${experienceId}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Deneyim bulunamadı.");
        return;
      }

      setExperience(data.experience);

      const currentUrl = window.location.href;
      setShareUrl(currentUrl);

      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 320,
        margin: 2,
      });

      setQrUrl(qrDataUrl);
    } catch {
      setMessage("Deneyim yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function copyShareUrl() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Paylaşım linki kopyalandı.");
    } catch {
      alert("Link kopyalanamadı.");
    }
  }

  async function copyText() {
    if (!experience) return;

    try {
      await navigator.clipboard.writeText(experience.generated_text);
      alert("Deneyim metni kopyalandı.");
    } catch {
      alert("Metin kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            NeAlsam Hediye Deneyimi
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            QR Kodlu Özel Hediye Mesajı
          </h1>

          <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            Bu sayfa, kişiye özel hazırlanmış hediye deneyimini göstermek için oluşturuldu.
            QR kodu hediyenin içine ekleyebilir veya linki paylaşabilirsin.
          </p>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-5 text-sm font-black text-[#6b4a4a] shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black">Deneyim yükleniyor...</p>
          </div>
        ) : experience ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-black text-pink-600">
                Paylaşım QR Kodu
              </p>

              {qrUrl && (
                <img
                  src={qrUrl}
                  alt="QR kod"
                  className="mx-auto mt-5 rounded-3xl border border-pink-100 bg-white p-3"
                />
              )}

              <p className="mt-4 break-all rounded-2xl bg-[#fff4ef] p-4 text-xs font-semibold leading-6 text-[#6b4a4a]">
                {shareUrl}
              </p>

              <div className="mt-5 grid gap-3">
                <button
                  onClick={copyShareUrl}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                >
                  Linki Kopyala
                </button>

                <button
                  onClick={copyText}
                  className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
                >
                  Metni Kopyala
                </button>

                <Link
                  href="/hesabim/kaydettiklerim"
                  className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
                >
                  Kaydettiklerime Dön
                </Link>
              </div>
            </aside>

            <article className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                  {experience.concept_title}
                </span>

                {experience.tone && (
                  <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
                    {experience.tone}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-3xl font-black text-[#2b1b1b]">
                {experience.gift_name || "Özel Hediye Deneyimi"}
              </h2>

              <p className="mt-3 text-sm font-semibold text-[#6b4a4a]">
                {experience.person_name ? `Kişi: ${experience.person_name}` : "Kişi belirtilmedi"}
                {experience.relation ? ` · ${experience.relation}` : ""}
              </p>

              <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
                Oluşturulma tarihi: {formatDate(experience.created_at)}
              </p>

              <pre className="mt-6 whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
                {experience.generated_text}
              </pre>
            </article>
          </div>
        ) : null}
      </section>
    </main>
  );
}
