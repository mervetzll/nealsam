"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { useSearchParams } from "next/navigation";
import { noteThemes } from "@/data/noteThemes";

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

function getDecorations(themeId: string) {
  if (themeId.includes("night")) return ["✨", "🌙", "⭐", "💫", "✨"];
  if (themeId.includes("coffee")) return ["☕", "🤎", "✨", "🍂", "🤍"];
  if (themeId.includes("mint")) return ["🌿", "🤍", "✨", "🍃", "🌸"];
  if (themeId.includes("sky") || themeId.includes("aqua")) return ["☁️", "🫧", "✨", "🤍", "🌙"];
  if (themeId.includes("golden") || themeId.includes("sunset")) return ["🌞", "✨", "💛", "🌸", "⭐"];
  if (themeId.includes("lavender") || themeId.includes("fairy")) return ["🪻", "✨", "🦋", "💜", "🌙"];
  if (themeId.includes("heart") || themeId.includes("rose") || themeId.includes("berry")) return ["💗", "🌹", "✨", "🎀", "💕"];
  return ["🌸", "🎀", "✨", "💗", "🌷"];
}

export default function ShareExperienceClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const searchParams = useSearchParams();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [themeId, setThemeId] = useState("pink-flowers");

  const selectedTheme = useMemo(() => {
    return noteThemes.find((theme) => theme.id === themeId) || noteThemes[0];
  }, [themeId]);

  const decorations = getDecorations(themeId);

  useEffect(() => {
    const bg = searchParams.get("bg");

    if (bg && noteThemes.some((theme) => theme.id === bg)) {
      setThemeId(bg);
    }
  }, [searchParams]);

  useEffect(() => {
    loadExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId]);

  useEffect(() => {
    if (!experience) return;
    generateQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId, experience]);

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
    } catch {
      setMessage("Deneyim yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function generateQr() {
    const currentUrl = `${window.location.origin}/not/${experienceId}?bg=${themeId}`;
    setShareUrl(currentUrl);

    try {
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 240,
        margin: 2,
      });

      setQrUrl(qrDataUrl);
    } catch {
      setQrUrl("");
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
      alert("Not metni kopyalandı.");
    } catch {
      alert("Metin kopyalanamadı.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black">Kart yükleniyor...</p>
          </div>
        </section>
      </main>
    );
  }

  if (message) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black">{message}</p>
          </div>
        </section>
      </main>
    );
  }

  if (!experience) return null;

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article
            className={`relative overflow-hidden rounded-[2.2rem] border border-white/60 p-6 shadow-xl md:p-10 ${selectedTheme.cardClass}`}
          >
            <div className="pointer-events-none absolute inset-0 select-none">
              <span className="absolute left-6 top-6 text-4xl opacity-50 md:text-5xl">
                {decorations[0]}
              </span>

              <span className="absolute right-8 top-10 text-3xl opacity-45 md:text-5xl">
                {decorations[1]}
              </span>

              <span className="absolute bottom-8 left-8 text-3xl opacity-45 md:text-5xl">
                {decorations[2]}
              </span>

              <span className="absolute bottom-10 right-10 text-4xl opacity-50 md:text-6xl">
                {decorations[3]}
              </span>

              <span className="absolute left-1/2 top-8 -translate-x-1/2 text-2xl opacity-35 md:text-4xl">
                {decorations[4]}
              </span>

              <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
              <div className="absolute -right-16 bottom-24 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-black text-pink-700 shadow-sm">
                  {experience.concept_title}
                </span>

                {experience.tone && (
                  <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-black text-[#6b4a4a] shadow-sm">
                    {experience.tone}
                  </span>
                )}
              </div>

              <div className="mt-8 text-center">
                <p
                  className={`text-sm font-black uppercase tracking-[0.25em] ${selectedTheme.accentClass}`}
                >
                  Özel Mesaj
                </p>

                <h1
                  className={`mt-4 text-3xl font-black md:text-5xl ${selectedTheme.accentClass}`}
                >
                  {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
                </h1>

                <p className="mt-4 text-sm font-semibold text-[#6b4a4a]">
                  {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                  {experience.relation ? ` · ${experience.relation}` : ""}
                </p>
              </div>

              <div className="mt-8 rounded-[1.8rem] bg-white/75 p-6 shadow-sm backdrop-blur">
                <pre className="whitespace-pre-wrap text-base font-medium leading-8 text-[#2b1b1b]">
                  {experience.generated_text}
                </pre>
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Kart Tasarımı
            </h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
              İstediğin arka planı seç. QR kod okutulduğunda sadece sade not kartı açılır.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {noteThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    themeId === theme.id
                      ? "border-[#2b1b1b] bg-[#fff0f7] shadow-sm"
                      : "border-pink-100 bg-white hover:bg-pink-50"
                  }`}
                >
                  <div className={`h-12 rounded-xl ${theme.cardClass}`} />

                  <p className="mt-2 text-sm font-black text-[#2b1b1b]">
                    {theme.name}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5">
              <p className="text-sm font-black text-pink-700">QR Kod</p>

              {qrUrl && (
                <img
                  src={qrUrl}
                  alt="QR kod"
                  className="mx-auto mt-4 rounded-2xl border border-pink-100 bg-white p-3"
                />
              )}

              <p className="mt-4 break-all rounded-2xl bg-white p-3 text-xs font-semibold leading-6 text-[#6b4a4a]">
                {shareUrl}
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  onClick={copyShareUrl}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                >
                  Not Linkini Kopyala
                </button>

                <button
                  onClick={copyText}
                  className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
                >
                  Metni Kopyala
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
