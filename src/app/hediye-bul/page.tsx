"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AlertCircle, ArrowLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ui } from "@/components/ui/styles";
import GiftResultCard from "@/components/GiftResultCard";
import { cleanGiftTitle, getRawGiftTitle } from "@/lib/giftPresentation";

type Gift = {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  price?: string;
  budget?: string;
  description?: string;
  reason?: string;
  tags?: string[];
};

type Question = {
  key: keyof Answers;
  title: string;
  subtitle: string;
  options: {
    label: string;
    value: string;
    emoji: string;
  }[];
};

type Answers = {
  relation: string;
  style: string;
  interest: string;
  budget: string;
  urgency: string;
};

const fallbackGifts: Gift[] = [
  {
    id: "fallback-1",
    title: "Pijama takımı",
    category: "Ev Giyim / Rahatlık",
    price: "700–2500 TL",
    description: "Rahat, kullanışlı ve samimi bir hediye.",
    tags: ["pijama", "cozy", "ev giyim"],
  },
  {
    id: "fallback-2",
    title: "Body mist",
    category: "Bakım / Self-care",
    price: "300–1500 TL",
    description: "Parfüme göre daha hafif ve tatlı bir bakım hediyesi.",
    tags: ["body mist", "bakım", "koku"],
  },
  {
    id: "fallback-3",
    title: "Kupa",
    category: "Kahve / Çay / Cozy",
    price: "200–1000 TL",
    description: "Samimi, risksiz ve günlük hayatta kullanılabilecek bir hediye.",
    tags: ["kupa", "kahve", "cozy"],
  },
  {
    id: "fallback-4",
    title: "Kolye",
    category: "Aksesuar",
    price: "400–5000 TL",
    description: "Kalıcı, zarif ve duygusal bir hediye.",
    tags: ["kolye", "takı", "romantik"],
  },
];

const questions: Question[] = [
  {
    key: "relation",
    title: "Kime hediye alıyorsun?",
    subtitle: "Kişiye göre önerileri daha doğru sıralayalım.",
    options: [
      { label: "Sevgili / eş", value: "sevgili eş romantik", emoji: "💘" },
      { label: "Anne", value: "anne aile", emoji: "🌷" },
      { label: "Arkadaş", value: "arkadaş eğlenceli", emoji: "🫶" },
      { label: "Kardeş", value: "kardeş genç", emoji: "✨" },
      { label: "Erkek", value: "erkek baba erkek arkadaş", emoji: "🧢" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "style",
    title: "Hediye nasıl hissettirsin?",
    subtitle: "Hediyenin havasını seç.",
    options: [
      { label: "Cozy / rahat", value: "cozy rahat ev giyim pijama", emoji: "🧸" },
      { label: "Bakım / self-care", value: "bakım self-care spa krem body mist", emoji: "🧴" },
      { label: "Romantik", value: "romantik takı parfüm kolye", emoji: "💌" },
      { label: "Kullanışlı", value: "kullanışlı termos kupa çanta cüzdan", emoji: "👜" },
      { label: "Şık / premium", value: "premium şık saat parfüm aksesuar", emoji: "✨" },
      { label: "Fark etmez", value: "", emoji: "🎀" },
    ],
  },
  {
    key: "interest",
    title: "Neye ilgisi var?",
    subtitle: "İlgi alanı öneriyi güçlendirir.",
    options: [
      { label: "Kahve / çay", value: "kahve çay kupa termos french press", emoji: "☕" },
      { label: "Bakım", value: "bakım krem body mist spa cilt", emoji: "🧖‍♀️" },
      { label: "Ev / dekor", value: "ev dekor mum oda kokusu battaniye", emoji: "🏠" },
      { label: "Moda / aksesuar", value: "moda aksesuar çanta kolye saat", emoji: "🛍️" },
      { label: "Kitap / hobi / teknoloji", value: "kitap hobi kulaklık powerbank teknoloji", emoji: "🎧" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "budget",
    title: "Bütçen yaklaşık ne kadar?",
    subtitle: "Bütçeye uygun önerileri öne çıkaralım.",
    options: [
      { label: "500 TL civarı", value: "500 düşük küçük", emoji: "💸" },
      { label: "1000 TL civarı", value: "1000 orta", emoji: "💳" },
      { label: "2500 TL civarı", value: "2500 iyi", emoji: "💎" },
      { label: "Premium", value: "premium yüksek", emoji: "👑" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "urgency",
    title: "Ne kadar acil?",
    subtitle: "Son dakika hediyelerini de buna göre seçelim.",
    options: [
      { label: "Bugün lazım", value: "bugün acil çiçek çikolata kupa body mist", emoji: "⚡" },
      { label: "Yarın lazım", value: "yarın hızlı pijama bakım kahve", emoji: "🗓️" },
      { label: "3 gün içinde", value: "3 gün paket cozy self-care", emoji: "🎁" },
      { label: "Acelesi yok", value: "normal", emoji: "🌸" },
    ],
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function getGiftText(gift: Gift) {
  return normalize(
    `${gift.title || ""} ${gift.name || ""} ${gift.category || ""} ${gift.description || ""} ${gift.reason || ""} ${(gift.tags || []).join(" ")}`
  );
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(normalize(word)));
}

function getMatchScore(gift: Gift, answers: Answers) {
  const text = getGiftText(gift);
  let score = 62;

  const relation = normalize(answers.relation);
  const style = normalize(answers.style);
  const interest = normalize(answers.interest);
  const budget = normalize(answers.budget);
  const urgency = normalize(answers.urgency);

  if (relation.includes("sevgili") || relation.includes("romantik")) {
    if (includesAny(text, ["kolye", "bileklik", "parfüm", "pijama", "çiçek", "mum"])) score += 12;
  }

  if (relation.includes("anne")) {
    if (includesAny(text, ["pijama", "bakım", "krem", "dekor", "kahve", "battaniye", "oda kokusu"])) score += 12;
  }

  if (relation.includes("arkadaş")) {
    if (includesAny(text, ["kupa", "body mist", "kahve", "çorap", "kitap", "hobi", "çikolata"])) score += 10;
  }

  if (relation.includes("erkek")) {
    if (includesAny(text, ["polo", "sweatshirt", "cüzdan", "kartlık", "saat", "tıraş", "termos", "kulaklık", "kemer"])) score += 14;
  }

  if (style.includes("cozy") || style.includes("rahat")) {
    if (includesAny(text, ["pijama", "sabahlık", "terlik", "battaniye", "kupa", "mum", "çorap"])) score += 16;
  }

  if (style.includes("bakim") || style.includes("self")) {
    if (includesAny(text, ["body mist", "el kremi", "duş jeli", "losyon", "cilt", "spa", "maske", "bakım"])) score += 16;
  }

  if (style.includes("romantik")) {
    if (includesAny(text, ["kolye", "bileklik", "parfüm", "çiçek", "mum", "takı"])) score += 16;
  }

  if (style.includes("kullanisli")) {
    if (includesAny(text, ["termos", "kupa", "çanta", "cüzdan", "kartlık", "kulaklık", "powerbank", "saat"])) score += 13;
  }

  if (interest.includes("kahve")) {
    if (includesAny(text, ["kahve", "kupa", "termos", "french press", "çay"])) score += 16;
  }

  if (interest.includes("bakim")) {
    if (includesAny(text, ["bakım", "body mist", "krem", "spa", "maske", "losyon"])) score += 16;
  }

  if (interest.includes("dekor") || interest.includes("ev")) {
    if (includesAny(text, ["mum", "oda kokusu", "vazo", "çerçeve", "battaniye", "abajur", "dekor"])) score += 15;
  }

  if (interest.includes("moda") || interest.includes("aksesuar")) {
    if (includesAny(text, ["kolye", "çanta", "saat", "şal", "fular", "cüzdan", "toka", "tişört", "sweatshirt"])) score += 15;
  }

  if (interest.includes("hobi") || interest.includes("teknoloji")) {
    if (includesAny(text, ["kitap", "defter", "kalem", "puzzle", "kulaklık", "powerbank", "hoparlör", "hobi"])) score += 15;
  }

  if (urgency.includes("bugun") || urgency.includes("acil")) {
    if (includesAny(text, ["çiçek", "çikolata", "kupa", "body mist", "el kremi", "kahve", "mum"])) score += 8;
  }

  if (urgency.includes("yarin")) {
    if (includesAny(text, ["pijama", "bakım", "kahve", "kolye", "mum"])) score += 7;
  }

  return Math.min(score, 98);
}

function getRiskLabel(gift: Gift) {
  const text = getGiftText(gift);

  if (includesAny(text, ["parfüm", "çanta", "giyim", "tişört", "pijama"])) return "Orta risk";
  if (includesAny(text, ["kolye", "takı", "saat"])) return "Düşük / orta risk";
  if (includesAny(text, ["kupa", "kahve", "mum", "çikolata", "el kremi"])) return "Düşük risk";

  return "Dengeli seçim";
}

export default function GiftFinderPage() {
  const [gifts, setGifts] = useState<Gift[]>(fallbackGifts);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [answers, setAnswers] = useState<Answers>({
    relation: "",
    style: "",
    interest: "",
    budget: "",
    urgency: "",
  });

  useEffect(() => {
    let active = true;

    async function loadGifts() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch("/api/gifts", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!active) return;

        if (data?.ok && Array.isArray(data.gifts) && data.gifts.length > 0) {
          const safeGifts = data.gifts
            .filter(Boolean)
            .map((gift: Gift, index: number) => ({
              id: gift.id || `gift-${index}`,
              title: cleanGiftTitle(getRawGiftTitle(gift)),
              name: cleanGiftTitle(getRawGiftTitle(gift)),
              category: gift.category || "Genel",
              price: gift.price || gift.budget || "",
              budget: gift.budget || gift.price || "",
              description: gift.description || gift.reason || "",
              reason: gift.reason || gift.description || "",
              tags: Array.isArray(gift.tags) ? gift.tags : [],
            }));

          setGifts(safeGifts);
        } else {
          setGifts(fallbackGifts);
        }
      } catch {
        if (!active) return;
        setLoadError("Hediye listesi yüklenemedi, yedek öneriler gösteriliyor.");
        setGifts(fallbackGifts);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadGifts();

    return () => {
      active = false;
    };
  }, []);

  const currentQuestion = questions[step];

  const progress = Math.round(((step + 1) / questions.length) * 100);

  const results = useMemo(() => {
    return gifts
      .filter(Boolean)
      .map((gift) => ({
        gift,
        score: getMatchScore(gift, answers),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [gifts, answers]);

  function selectOption(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.key]: value,
    }));

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
    } else {
      setShowResults(true);
    }
  }

  function goBack() {
    if (showResults) {
      setShowResults(false);
      setStep(questions.length - 1);
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  }

  function restart() {
    setAnswers({
      relation: "",
      style: "",
      interest: "",
      budget: "",
      urgency: "",
    });
    setStep(0);
    setShowResults(false);
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <PageHero
          eyebrow="Hediye bul"
          title="Mini testi çöz,"
          accent="doğru hediyeyi bulalım."
          description="Kime, hangi tarzda ve hangi bütçeyle alacağını seç. Sonuçta mağaza linkleri, risk yorumu ve not önerisi de çıkacak."
        />

        {loadError && (
          <p className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700 ring-1 ring-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {loadError}
          </p>
        )}

        {!showResults ? (
          <div data-no-reveal className={`${ui.card} max-w-4xl p-6 shadow-xl shadow-pink-900/5 md:p-10`}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-[#8a6a6a]">
                Soru <span className="text-[#2b1b1b]">{step + 1}</span> / {questions.length}
              </p>

              {loading && (
                <span className="inline-flex items-center gap-2 text-xs font-bold text-pink-700">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Hediyeler yükleniyor
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))` }}>
              {questions.map((q, i) => (
                <span
                  key={q.key}
                  className={`h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-pink-600" : "bg-pink-100"}`}
                />
              ))}
            </div>
            <span className="sr-only">İlerleme: %{progress}</span>

            <h2 key={`title-${step}`} className="fade-in-up mt-10 text-4xl md:text-5xl">
              {currentQuestion.title}
            </h2>

            <p key={`sub-${step}`} className="fade-in-up mt-3 leading-7 text-[#6b4a4a]" style={{ "--delay": "80ms" } as CSSProperties}>
              {currentQuestion.subtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = answers[currentQuestion.key] === option.value && option.value !== "";
                return (
                  <button
                    key={`${currentQuestion.key}-${option.label}`}
                    onClick={() => selectOption(option.value)}
                    style={{ "--delay": `${140 + optionIndex * 60}ms` } as CSSProperties}
                    className={`fade-in-up group flex items-center gap-4 rounded-2xl p-4 text-left transition duration-300 ${
                      selected
                        ? "bg-pink-50 ring-2 ring-pink-500"
                        : "bg-[#fff8f5] ring-1 ring-pink-100 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-pink-900/5 hover:ring-pink-200"
                    }`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl ring-1 ring-pink-100 transition group-hover:scale-105">
                      {option.emoji}
                    </span>
                    <span className="flex-1 text-[17px] font-bold text-[#2b1b1b]">{option.label}</span>
                    <ChevronRight className="h-5 w-5 text-[#c9a9a9] transition group-hover:translate-x-0.5 group-hover:text-pink-600" />
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-pink-100 pt-6">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6b4a4a] transition hover:text-[#2b1b1b] disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
                Geri
              </button>

              <button onClick={() => setShowResults(true)} className={ui.btnLink}>
                Testi bitir, sonuçları gör
              </button>
            </div>
          </div>
        ) : (
          <section>
            <div className="flex flex-col gap-6 border-b border-pink-100 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={ui.eyebrow}>Sonuçlar</p>
                <h2 className="mt-3 text-4xl md:text-5xl">
                  Sana en uygun <em>hediyeler</em>
                </h2>
                <p className="mt-3 leading-7 text-[#6b4a4a]">
                  Seçimlerine göre en güçlü eşleşmeleri sıraladık.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={goBack} className={ui.btnSecondary}>
                  <ArrowLeft className="h-4 w-4" />
                  Son soruyu değiştir
                </button>

                <button onClick={restart} className={ui.btnDark}>
                  <RotateCcw className="h-4 w-4" />
                  Yeniden başlat
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6">
              {results.map(({ gift, score }, index) => (
                <GiftResultCard
                  key={gift.id || `${gift.title || gift.name || "gift"}-${index}`}
                  gift={gift}
                  score={score}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
