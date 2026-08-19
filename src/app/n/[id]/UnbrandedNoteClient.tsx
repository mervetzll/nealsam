"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { noteThemes } from "@/data/noteThemes";
import { noteImageThemes } from "@/data/noteImageThemes";
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

type TemplateMode = "classic" | "image";

function getImageTextColor(templateId: string) {
  if (
    templateId.includes("sport") ||
    templateId.includes("gamer") ||
    templateId.includes("moon") ||
    templateId.includes("travel")
  ) {
    return "#1e293b";
  }

  if (
    templateId.includes("coffee") ||
    templateId.includes("cafe") ||
    templateId.includes("book")
  ) {
    return "#5a3524";
  }

  return "#2b1b1b";
}

export default function UnbrandedNoteClient({
  experienceId,
}: {
  experienceId: string;
}) {
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "1";

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [mode, setMode] = useState<TemplateMode>("image");

  const [themeId, setThemeId] = useState("pink-flowers");
  const [decorType, setDecorType] = useState("auto");
  const [decorColor, setDecorColor] = useState("#F472B6");

  const [templateId, setTemplateId] = useState("peach-blossom");
  const [textColor, setTextColor] = useState("");

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const bg = searchParams.get("bg");
    const decor = searchParams.get("decor");
    const color = searchParams.get("color");
    const tpl = searchParams.get("tpl");
    const text = searchParams.get("text");

    if (urlMode === "classic" || urlMode === "image") {
      setMode(urlMode);
    }

    if (bg && noteThemes.some((theme) => theme.id === bg)) {
      setThemeId(bg);
    }

    if (decor) {
      setDecorType(decor);
    }

    if (color) {
      setDecorColor(`#${color.replace("#", "")}`);
    }

    if (tpl && noteImageThemes.some((theme) => theme.id === tpl)) {
      setTemplateId(tpl);
    }

    if (text) {
      setTextColor(`#${text.replace("#", "")}`);
    }
  }, [searchParams]);

  const selectedTheme = useMemo(() => {
    return noteThemes.find((theme) => theme.id === themeId) || noteThemes[0];
  }, [themeId]);

  const selectedTemplate = useMemo(() => {
    return (
      noteImageThemes.find((theme) => theme.id === templateId) ||
      noteImageThemes[0]
    );
  }, [templateId]);

  useEffect(() => {
    loadExperience();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceId]);

  useEffect(() => {
    if (!experience || !shouldPrint) return;

    const timer = window.setTimeout(() => {
      window.print();
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [experience, shouldPrint]);

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

  const finalTextColor =
    textColor || (mode === "image" ? getImageTextColor(templateId) : "");

  return (
    <main className="print-note-page fixed inset-0 z-[9999] overflow-y-auto bg-[#fff4ef] px-4 py-8 text-[#2b1b1b] md:px-6 md:py-10">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          header,
          nav,
          footer {
            display: none !important;
          }

          .print-note-page {
            position: static !important;
            inset: auto !important;
            z-index: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
            background: #ffffff !important;
            padding: 0 !important;
          }

          .print-note-wrap {
            min-height: 100vh !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .print-note-card {
            width: 760px !important;
            max-width: 92vw !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          .note-message {
            max-height: none !important;
            overflow: visible !important;
            font-size: 12px !important;
            line-height: 1.45 !important;
            padding: 14px !important;
            white-space: pre-wrap !important;
          }
        }
      `}</style>
      <section className="print-note-wrap mx-auto flex min-h-[90vh] max-w-3xl items-center justify-center">
        {mode === "image" ? (
          <article
            className="print-note-card relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <img
              src={selectedTemplate.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-[11%] bottom-[10%] top-[18%] flex flex-col items-center justify-center text-center">
              <p
                className="text-xs font-black uppercase tracking-[0.24em] opacity-80"
                style={{ color: finalTextColor || undefined }}
              >
                Özel Mesaj
              </p>

              <h1
                className="mt-3 text-2xl font-black leading-tight md:text-3xl"
                style={{ color: finalTextColor || undefined }}
              >
                {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
              </h1>

              <p
                className="mt-3 text-xs font-bold leading-6 md:text-sm"
                style={{ color: finalTextColor || undefined }}
              >
                {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                {experience.relation ? ` · ${experience.relation}` : ""}
              </p>

              <pre
                className="note-message mt-5 max-h-[64%] w-full overflow-y-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/55 p-4 text-sm font-semibold leading-7 shadow-sm backdrop-blur-sm md:text-base"
                style={{ color: finalTextColor || undefined }}
              >
                {experience.generated_text}
              </pre>
            </div>
          </article>
        ) : (
          <article
            className={`relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/60 p-8 shadow-2xl ${selectedTheme.cardClass}`}
          >
            <NoteDecorations
              variant={themeId}
              decorType={decorType}
              customColor={decorColor}
            />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <p
                className={`text-xs font-black uppercase tracking-[0.24em] ${selectedTheme.accentClass}`}
                style={textColor ? { color: textColor } : undefined}
              >
                Özel Mesaj
              </p>

              <h1
                className={`mt-3 text-2xl font-black leading-tight md:text-3xl ${selectedTheme.accentClass}`}
                style={textColor ? { color: textColor } : undefined}
              >
                {experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
              </h1>

              <p className="mt-3 text-xs font-bold leading-6 text-[#6b4a4a] md:text-sm">
                {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
                {experience.relation ? ` · ${experience.relation}` : ""}
              </p>

              <pre
                className="note-message mt-5 max-h-[64%] w-full overflow-y-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/70 p-4 text-sm font-semibold leading-7 shadow-sm backdrop-blur-sm md:text-base"
                style={textColor ? { color: textColor } : undefined}
              >
                {experience.generated_text}
              </pre>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
