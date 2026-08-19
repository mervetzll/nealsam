"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { noteThemes } from "@/data/noteThemes";
import { noteImageThemes } from "@/data/noteImageThemes";
import NoteDecorations from "@/components/NoteDecorations";

type QuizItem = {
  question?: string;
  answer?: string;
};

type Experience = {
  id: string;
  concept_key: string;
  concept_title: string;
  person_name: string | null;
  sender_name: string | null;
  relation: string | null;
  gift_name: string | null;
  tone: string | null;
  note_length: string | null;
  special_detail: string | null;
  generated_text: string;
  hunt_location: string | null;
  hunt_steps: number | null;
  hunt_difficulty: string | null;
  hunt_style: string | null;
  hunt_detail: string | null;
  lock_enabled: boolean | null;
  lock_question: string | null;
  lock_answer: string | null;
  unlock_at: string | null;
  mood_enabled: boolean | null;
  mood_happy: string | null;
  mood_emotional: string | null;
  mood_romantic: string | null;
  mood_funny: string | null;
  mood_nostalgic: string | null;
  surprise_enabled: boolean | null;
  surprise_boxes: string[] | null;
  quiz_enabled: boolean | null;
  quiz_items: QuizItem[] | null;
  memory_enabled: boolean | null;
  memory_title: string | null;
  memory_detail: string | null;
  memory_emoji: string | null;
  created_at: string;
};

type TemplateMode = "classic" | "image";

function normalizeAnswer(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, " ");
}

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

function parseHuntSteps(text: string) {
  const parts = text
    .split(/\n(?=\d+\.\s*ADIM)/g)
    .map((item) => item.trim())
    .filter(Boolean);

  if (parts.length <= 1) return [text];

  return [parts[0], ...parts.slice(1)];
}

function formatCountdown(target: string) {
  const targetTime = new Date(target).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) return "";

  const totalMinutes = Math.floor(diff / 1000 / 60);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return `${days} gün ${hours} saat ${minutes} dakika`;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "")).filter(Boolean);
}

function asQuizArray(value: unknown): QuizItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      question: String(item?.question || ""),
      answer: String(item?.answer || ""),
    }))
    .filter((item) => item.question || item.answer);
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

  const [huntIndex, setHuntIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());

  const [boxIndex, setBoxIndex] = useState(-1);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTick(Date.now());
    }, 30000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    const bg = searchParams.get("bg");
    const decor = searchParams.get("decor");
    const color = searchParams.get("color");
    const tpl = searchParams.get("tpl");
    const text = searchParams.get("text");

    if (urlMode === "classic" || urlMode === "image") setMode(urlMode);
    if (bg && noteThemes.some((theme) => theme.id === bg)) setThemeId(bg);
    if (decor) setDecorType(decor);
    if (color) setDecorColor(`#${color.replace("#", "")}`);
    if (tpl && noteImageThemes.some((theme) => theme.id === tpl)) setTemplateId(tpl);
    if (text) setTextColor(`#${text.replace("#", "")}`);
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

  const isHunt = experience?.concept_key === "hediye-avi";

  const huntSteps = useMemo(() => {
    if (!experience) return [];
    return parseHuntSteps(experience.generated_text);
  }, [experience]);

  const surpriseBoxes = useMemo(() => {
    return asStringArray(experience?.surprise_boxes);
  }, [experience]);

  const quizItems = useMemo(() => {
    return asQuizArray(experience?.quiz_items);
  }, [experience]);

  const isTimeLocked = useMemo(() => {
    if (!experience?.unlock_at) return false;
    return new Date(experience.unlock_at).getTime() > nowTick;
  }, [experience, nowTick]);

  const countdown = useMemo(() => {
    if (!experience?.unlock_at) return "";
    return formatCountdown(experience.unlock_at);
  }, [experience, nowTick]);

  const moodText = useMemo(() => {
    if (!experience || !selectedMood) return "";

    if (selectedMood === "happy") return experience.mood_happy || "";
    if (selectedMood === "emotional") return experience.mood_emotional || "";
    if (selectedMood === "romantic") return experience.mood_romantic || "";
    if (selectedMood === "funny") return experience.mood_funny || "";
    if (selectedMood === "nostalgic") return experience.mood_nostalgic || "";

    return "";
  }, [experience, selectedMood]);

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

      if (!data.experience?.lock_enabled) {
        setIsUnlocked(true);
      }
    } catch {
      setMessage("Not yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  function checkAnswer() {
    if (!experience?.lock_answer) {
      setIsUnlocked(true);
      return;
    }

    if (normalizeAnswer(answer) === normalizeAnswer(experience.lock_answer)) {
      setIsUnlocked(true);
      setUnlockError("");
    } else {
      setUnlockError("Cevap doğru değil gibi. Bir daha dene 💌");
    }
  }

  function finishQuiz() {
    setQuizDone(true);
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

  if (isTimeLocked) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <section className="max-w-xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Zaman Kilitli Mesaj
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Bu sürpriz henüz açılmadı
          </h1>

          <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
            Mesajın açılmasına:
          </p>

          <p className="mt-3 rounded-2xl bg-[#fff4ef] px-5 py-4 text-2xl font-black text-pink-700">
            {countdown}
          </p>

          <p className="mt-4 text-xs font-semibold text-[#8a6a6a]">
            Zamanı gelince bu QR kodu tekrar açabilirsin.
          </p>
        </section>
      </main>
    );
  }

  if (experience.lock_enabled && !isUnlocked) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <section className="max-w-xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Gizli Mesaj
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Bu mesajı açmak için cevabı bilmelisin
          </h1>

          <p className="mt-5 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black leading-7 text-[#2b1b1b]">
            {experience.lock_question || "Bu mesajın şifresi ne?"}
          </p>

          <input
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") checkAnswer();
            }}
            placeholder="Cevabı yaz..."
            className="mt-5 w-full rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-center text-sm font-bold outline-none"
          />

          {unlockError && (
            <p className="mt-3 text-sm font-black text-pink-700">
              {unlockError}
            </p>
          )}

          <button
            onClick={checkAnswer}
            className="mt-5 w-full rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
          >
            Mesajı Aç
          </button>
        </section>
      </main>
    );
  }

  if (experience.quiz_enabled && quizItems.length > 0 && !quizDone) {
    return (
      <main className="fixed inset-0 z-[9999] overflow-y-auto bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Mini Quiz
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Beni ne kadar tanıyorsun?
          </h1>

          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
            Hediyeye ulaşmadan önce küçük bir oyun var. Cevaplar eğlence amaçlıdır.
          </p>

          {!quizStarted ? (
            <button
              onClick={() => setQuizStarted(true)}
              className="mt-6 rounded-full bg-pink-600 px-8 py-4 text-sm font-black text-white"
            >
              Quiz’e Başla
            </button>
          ) : (
            <div className="mt-6 grid gap-4 text-left">
              {quizItems.map((item, index) => (
                <div key={index} className="rounded-2xl bg-[#fff4ef] p-5">
                  <p className="text-sm font-black text-[#2b1b1b]">
                    {index + 1}. {item.question || "Soru"}
                  </p>

                  <input
                    value={quizAnswers[index] || ""}
                    onChange={(event) =>
                      setQuizAnswers((current) => ({
                        ...current,
                        [index]: event.target.value,
                      }))
                    }
                    placeholder="Cevabını yaz..."
                    className="mt-3 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
                  />

                  {quizAnswers[index] && item.answer && (
                    <p className="mt-3 text-xs font-bold text-[#8a6a6a]">
                      Cevap: {item.answer}
                    </p>
                  )}
                </div>
              ))}

              <button
                onClick={finishQuiz}
                className="rounded-full bg-pink-600 px-8 py-4 text-sm font-black text-white"
              >
                Sürprizi Aç
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (experience.surprise_enabled && surpriseBoxes.length > 0 && boxIndex < surpriseBoxes.length - 1) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <section className="max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Sürpriz Kutusu
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Küçük kutuları sırayla aç
          </h1>

          {boxIndex >= 0 ? (
            <div className="mt-6 rounded-[2rem] bg-[#fff4ef] p-6">
              <p className="text-5xl">🎁</p>
              <p className="mt-4 whitespace-pre-wrap text-sm font-black leading-7 text-[#2b1b1b]">
                {surpriseBoxes[boxIndex]}
              </p>
            </div>
          ) : (
            <p className="mt-5 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Bu sürpriz tek parça değil. Önce küçük kutuları aç, sonra final mesajına ulaş.
            </p>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {surpriseBoxes.map((box, index) => (
              <button
                key={index}
                onClick={() => setBoxIndex(index)}
                disabled={index > boxIndex + 1}
                className="rounded-2xl bg-[#fff4ef] px-5 py-4 text-sm font-black text-[#2b1b1b] disabled:opacity-40"
              >
                {index < boxIndex ? "Açıldı" : index === boxIndex ? "Açık" : `${index + 1}. Kutuyu Aç`}
              </button>
            ))}
          </div>

          {boxIndex >= surpriseBoxes.length - 1 && (
            <button
              onClick={() => setBoxIndex(surpriseBoxes.length)}
              className="mt-5 rounded-full bg-pink-600 px-8 py-4 text-sm font-black text-white"
            >
              Final Mesajına Geç
            </button>
          )}
        </section>
      </main>
    );
  }

  if (experience.mood_enabled && !selectedMood && !isHunt) {
    return (
      <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff4ef] px-5 text-[#2b1b1b]">
        <section className="max-w-2xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Duygu Seçimli Not
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Bugün nasıl hissetmek istiyorsun?
          </h1>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              ["happy", "Mutlu"],
              ["emotional", "Duygusal"],
              ["romantic", "Romantik"],
              ["funny", "Gülümseten"],
              ["nostalgic", "Nostaljik"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedMood(key)}
                className="rounded-2xl bg-[#fff4ef] px-5 py-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-100"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const finalTextColor =
    textColor || (mode === "image" ? getImageTextColor(templateId) : "");

  const huntText = huntSteps[huntIndex] || experience.generated_text;
  const isLastHuntStep = huntIndex >= huntSteps.length - 1;

  const visibleMessage =
    experience.mood_enabled && moodText && !isHunt
      ? moodText
      : isHunt
        ? huntText
        : experience.generated_text;

  const CardContent = (
    <div className="absolute inset-x-[11%] bottom-[10%] top-[18%] flex flex-col items-center justify-center text-center">
      <p
        className="text-xs font-black uppercase tracking-[0.24em] opacity-80"
        style={{ color: finalTextColor || undefined }}
      >
        {isHunt ? "Hediye Avı" : experience.mood_enabled ? "Duygu Notu" : "Özel Mesaj"}
      </p>

      <h1
        className="mt-3 text-2xl font-black leading-tight md:text-3xl"
        style={{ color: finalTextColor || undefined }}
      >
        {isHunt
          ? isLastHuntStep
            ? "Finale Geldin!"
            : `İpucu ${huntIndex + 1}`
          : experience.gift_name || "Sana Küçük Bir Sürprizim Var"}
      </h1>

      <p
        className="mt-3 text-xs font-bold leading-6 md:text-sm"
        style={{ color: finalTextColor || undefined }}
      >
        {experience.person_name ? `İçin: ${experience.person_name}` : "Senin için"}
        {experience.sender_name ? ` · ${experience.sender_name}'den` : ""}
      </p>

      {experience.memory_enabled && (
        <div className="mt-4 w-full rounded-[1.4rem] bg-white/70 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-3xl">{experience.memory_emoji || "💌"}</p>
          <p
            className="mt-2 text-sm font-black"
            style={{ color: finalTextColor || undefined }}
          >
            {experience.memory_title || "Bizim Anımız"}
          </p>
          <p
            className="mt-1 text-xs font-semibold leading-5"
            style={{ color: finalTextColor || undefined }}
          >
            {experience.memory_detail || "Bu hediye küçük bir anıyı temsil ediyor."}
          </p>
        </div>
      )}

      <pre
        className="note-message mt-5 max-h-[50%] w-full overflow-y-auto whitespace-pre-wrap rounded-[1.4rem] bg-white/60 p-4 text-sm font-semibold leading-7 shadow-sm backdrop-blur-sm md:text-base"
        style={{ color: finalTextColor || undefined }}
      >
        {visibleMessage}
      </pre>

      {isHunt && !shouldPrint && huntSteps.length > 1 && (
        <div className="mt-4 flex w-full flex-wrap justify-center gap-2">
          <button
            type="button"
            disabled={huntIndex === 0}
            onClick={() => setHuntIndex((value) => Math.max(0, value - 1))}
            className="rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-xs font-black text-pink-700 disabled:opacity-40"
          >
            Önceki
          </button>

          <button
            type="button"
            onClick={() =>
              setHuntIndex((value) => Math.min(huntSteps.length - 1, value + 1))
            }
            className="rounded-full bg-pink-600 px-5 py-2 text-xs font-black text-white"
          >
            {isLastHuntStep ? "Av Tamamlandı" : "Sonraki İpucu"}
          </button>
        </div>
      )}
    </div>
  );

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
          <article className="print-note-card relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <img
              src={selectedTemplate.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {CardContent}
          </article>
        ) : (
          <article
            className={`print-note-card relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/60 p-8 shadow-2xl ${selectedTheme.cardClass}`}
          >
            <NoteDecorations
              variant={themeId}
              decorType={decorType}
              customColor={decorColor}
            />
            {CardContent}
          </article>
        )}
      </section>
    </main>
  );
}
