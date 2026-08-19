"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { noteThemes } from "@/data/noteThemes";
import NoteDecorations from "@/components/NoteDecorations";

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


export default function UnbrandedNoteClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const searchParams = useSearchParams();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [themeId, setThemeId] = useState("pink-flowers");
  const [decorType, setDecorType] = useState("auto");
  const [decorColor, setDecorColor] = useState("#F472B6");
  const [textColor, setTextColor] = useState("");

  useEffect(() => {
    const bg = searchParams.get("bg");
    const decor = searchParams.get("decor");
    const color = searchParams.get("color");
    const text = searchParams.get("text");

    if (bg && noteThemes.some((theme) => theme.id === bg)) {
      setThemeId(bg);
    }

    if (decor) {
      setDecorType(decor);
    }

    if (color) {
      setDecorColor(`#${color.replace("#", "")}`);
    }

    if (text) {
      setTextColor(`#${text.replace("#", "")}`);
    }
  }, [searchParams]);

  const selectedTheme = useMemo(() => {
    return noteThemes.find((theme) => theme.id === themeId) || noteThemes[0];
  }, [themeId]);


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
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <p className="rounded-3xl bg-white px-6 py-4 text-sm font-black shadow-sm">
          Not açılıyor...
        </p>
      </main>
    );
  }

  if (message || !experience) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <p className="rounded-3xl bg-white px-6 py-4 text-sm font-black shadow-sm">
          {message || "Not bulunamadı."}
        </p>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-[9999] overflow-y-auto bg-[#fff4ef] px-4 py-8 text-[#2b1b1b] md:px-6 md:py-12">
      <section className="mx-auto flex min-h-[85vh] max-w-4xl items-center justify-center">
        <article
          className={`relative w-full overflow-hidden rounded-[2.5rem] border border-white/60 p-6 shadow-2xl md:p-12 ${selectedTheme.cardClass}`}
        >
            <NoteDecorations
            variant={themeId}
            decorType={decorType}
            customColor={decorColor}
          />

          <div className="relative z-10">
            <div className="text-center">
              <p
                className={`text-sm font-black uppercase tracking-[0.25em] ${selectedTheme.accentClass}`}
                style={textColor ? { color: textColor } : undefined}
              >
                Özel Mesaj
              </p>

              <h1
                className={`mt-4 text-3xl font-black leading-tight md:text-5xl ${selectedTheme.accentClass}`}
                style={textColor ? { color: textColor } : undefined}
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
