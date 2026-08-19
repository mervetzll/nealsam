"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function PublicNoteClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const searchParams = useSearchParams();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [themeId, setThemeId] = useState("pink-flowers");

  useEffect(() => {
    const bg = searchParams.get("bg");

    if (bg && noteThemes.some((theme) => theme.id === bg)) {
      setThemeId(bg);
    }
  }, [searchParams]);

  const selectedTheme = useMemo(() => {
    return noteThemes.find((theme) => theme.id === themeId) || noteThemes[0];
  }, [themeId]);

  const decorations = getDecorations(themeId);

  useEffect(() => {
    loadExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setMessage("Bu not bulunamadı.");
        return;
      }

      setExperience(data.experience);
    } catch {
      setMessage("Not yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <p className="rounded-3xl bg-white px-6 py-4 text-sm font-black shadow-sm">
          Not açılıyor...
        </p>
      </main>
    );
  }

  if (message || !experience) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <p className="rounded-3xl bg-white px-6 py-4 text-sm font-black shadow-sm">
          {message || "Not bulunamadı."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-4 py-8 text-[#2b1b1b] md:px-6 md:py-12">
      <section className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <article
          className={`relative w-full overflow-hidden rounded-[2.5rem] border border-white/60 p-6 shadow-2xl md:p-12 ${selectedTheme.cardClass}`}
        >
          <div className="pointer-events-none absolute inset-0 select-none">
            <span className="absolute left-6 top-6 text-4xl opacity-50 md:text-6xl">
              {decorations[0]}
            </span>

            <span className="absolute right-8 top-10 text-3xl opacity-45 md:text-6xl">
              {decorations[1]}
            </span>

            <span className="absolute bottom-8 left-8 text-3xl opacity-45 md:text-6xl">
              {decorations[2]}
            </span>

            <span className="absolute bottom-10 right-10 text-4xl opacity-50 md:text-7xl">
              {decorations[3]}
            </span>

            <span className="absolute left-1/2 top-8 -translate-x-1/2 text-2xl opacity-35 md:text-5xl">
              {decorations[4]}
            </span>

            <div className="absolute -left-16 top-24 h-40 w-40 rounded-full bg-white/25 blur-3xl" />
            <div className="absolute -right-16 bottom-24 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="text-center">
              <p
                className={`text-sm font-black uppercase tracking-[0.25em] ${selectedTheme.accentClass}`}
              >
                Özel Mesaj
              </p>

              <h1
                className={`mt-4 text-3xl font-black leading-tight md:text-5xl ${selectedTheme.accentClass}`}
              >
                {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-7 text-[#6b4a4a]">
                {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                {experience.relation ? ` · ${experience.relation}` : ""}
              </p>
            </div>

            <div className="mt-8 rounded-[2rem] bg-white/75 p-6 shadow-sm backdrop-blur md:p-8">
              <pre className="whitespace-pre-wrap text-base font-medium leading-8 text-[#2b1b1b] md:text-lg md:leading-9">
                {experience.generated_text}
              </pre>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
