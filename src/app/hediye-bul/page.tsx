"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import GiftInsightCard from "@/components/GiftInsightCard";
import GiftStoreLinks from "@/components/GiftStoreLinks";
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

function SafeGiftInsightCard({ gift }: { gift: Gift }) {
  try {
    return <GiftInsightCard gift={gift} />;
  } catch {
    return null;
  }
}

function SafeGiftStoreLinks({ gift }: { gift: Gift }) {
  try {
    return <GiftStoreLinks gift={gift} />;
  } catch {
    return null;
  }
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
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Bul
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Mini testi çöz, en uygun hediyeleri bulalım
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Kime, hangi tarzda ve hangi bütçeyle hediye alacağını seç. Sonuçta mağaza linkleri, risk yorumu ve özel not önerisi de çıkacak.
          </p>

          {loadError && (
            <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-600">
              {loadError}
            </p>
          )}
        </div>

        {!showResults ? (
          <div className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-black text-pink-600">
                Soru {step + 1} / {questions.length}
              </p>

              {loading && (
                <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-pink-700">
                  Hediyeler yükleniyor...
                </span>
              )}
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-pink-100">
              <div
                className="h-full rounded-full bg-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h2 className="mt-8 text-3xl font-black md:text-5xl">
              {currentQuestion.title}
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {currentQuestion.subtitle}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={`${currentQuestion.key}-${option.label}`}
                  onClick={() => selectOption(option.value)}
                  className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5 text-left transition hover:-translate-y-1 hover:bg-pink-100 hover:shadow-sm"
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <p className="mt-3 text-xl font-black text-[#2b1b1b]">
                    {option.label}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 disabled:opacity-40"
              >
                Geri
              </button>

              <button
                onClick={() => setShowResults(true)}
                className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
              >
                Testi Bitir ve Sonuçları Gör
              </button>
            </div>
          </div>
        ) : (
          <section className="mt-8">
            <div className="flex flex-col gap-4 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between md:p-8">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
                  Sonuçlar
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  Sana en uygun hediyeler
                </h2>

                <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                  Seçimlerine göre en güçlü eşleşmeleri sıraladık.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={goBack}
                  className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
                >
                  Son Soruyu Değiştir
                </button>

                <button
                  onClick={restart}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                >
                  Testi Yeniden Başlat
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              {results.map(({ gift, score }, index) => {
                const title = cleanGiftTitle(getRawGiftTitle(gift));

                return (
                  <article
                    key={gift.id || `${title}-${index}`}
                    className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-black text-pink-700">
                        %{score} eşleşme
                      </span>

                      <span className="rounded-full bg-[#fff8f0] px-4 py-2 text-sm font-black text-[#6b4a4a]">
                        {score >= 90 ? "Çok güçlü eşleşme" : score >= 80 ? "Güçlü eşleşme" : "Uygun seçenek"}
                      </span>

                      <span className="rounded-full bg-[#fff8f0] px-4 py-2 text-sm font-black text-[#6b4a4a]">
                        {getRiskLabel(gift)}
                      </span>
                    </div>

                    <h3 className="mt-5 text-4xl font-black tracking-tight text-[#2b1b1b]">
                      {title}
                    </h3>

                    <p className="mt-3 text-xl font-black text-pink-600">
                      {gift.category || "Genel"}
                      {(gift.price || gift.budget) ? ` · ${gift.price || gift.budget}` : ""}
                    </p>

                    {(gift.description || gift.reason) && (
                      <p className="mt-5 text-sm font-semibold leading-7 text-[#6b4a4a]">
                        {gift.description || gift.reason}
                      </p>
                    )}

                    <SafeGiftInsightCard gift={gift} />
                    <SafeGiftStoreLinks gift={gift} />

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <Link
                        href={`/deneyim?gift=${encodeURIComponent(title)}`}
                        className="flex items-center justify-center rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
                      >
                        Özel Not Oluştur
                      </Link>

                      <Link
                        href={`/hediye-karsilastir?gift=${encodeURIComponent(title)}`}
                        className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
                      >
                        Karşılaştır
                      </Link>

                      <Link
                        href={`/hediye-paketi?gift=${encodeURIComponent(title)}`}
                        className="flex items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
                      >
                        Pakete Çevir
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
