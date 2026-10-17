"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { budgetLimit, fitsBudget, budgetDescription } from "@/lib/giftBudget";
import GiftResultCard from "@/components/GiftResultCard";
import { diversifyGifts, excludesGift } from "@/lib/giftSelection";
import { cleanGiftTitle, getRawGiftTitle } from "@/lib/giftPresentation";

type Gift = {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
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
  occasion: string;
  exclude: string;
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
      { label: "Baba", value: "baba aile", emoji: "🧢" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "occasion",
    title: "Hangi gün için?",
    subtitle: "Hediyenin anlamını da düşünelim.",
    options: [
      { label: "Doğum günü", value: "doğum günü", emoji: "🎂" },
      { label: "Yıl dönümü", value: "yıl dönümü romantik", emoji: "💞" },
      { label: "Teşekkür / içimden geldi", value: "teşekkür", emoji: "🌷" },
      { label: "Yeni iş / yeni ev", value: "yeni iş ev", emoji: "🏡" },
      { label: "Diğer", value: "", emoji: "🎁" },
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
      { label: "Kitap / kırtasiye", value: "kitap defter kalem ayraç", emoji: "📚" },
      { label: "Hobi / oyun", value: "hobi puzzle oyun boya", emoji: "🎨" },
      { label: "Teknoloji", value: "teknoloji kulaklık powerbank hoparlör", emoji: "🎧" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "budget",
    title: "Bütçen yaklaşık ne kadar?",
    subtitle: "Başlangıç fiyatı bütçeni aşan fikirleri eleyelim. Fiyatlar tahminidir.",
    options: [
      { label: "En fazla 500 TL", value: "500 düşük küçük", emoji: "💸" },
      { label: "En fazla 1000 TL", value: "1000 orta", emoji: "💳" },
      { label: "En fazla 2500 TL", value: "2500 iyi", emoji: "💎" },
      { label: "Bütçe sınırım yok", value: "premium yüksek", emoji: "👑" },
      { label: "Fark etmez", value: "", emoji: "🎁" },
    ],
  },
  {
    key: "exclude",
    title: "Önermememizi istediğin bir şey var mı?",
    subtitle: "İstersen bir grubu tamamen eleyebilirsin.",
    options: [
      { label: "Koku / parfüm olmasın", value: "parfüm|parfum|body mist|kokulu|oda kokusu", emoji: "🌿" },
      { label: "Giyim / beden gerektirmesin", value: "pijama|tişört|sweatshirt|giyim|terlik|ayakkabı|yüzük", emoji: "👕" },
      { label: "Takı olmasın", value: "takı|kolye|bileklik|küpe|yüzük", emoji: "💍" },
      { label: "Yiyecek olmasın", value: "çikolata|atıştırmalık|kurabiye|tatlı", emoji: "🍫" },
      { label: "Hepsi olabilir", value: "", emoji: "🎁" },
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
  const urgency = normalize(answers.urgency);

  if (relation.includes("sevgili") || relation.includes("romantik")) {
    if (includesAny(text, ["kolye", "bileklik", "parfüm", "pijama", "çiçek", "mum"])) score += 12;
  }

  if (relation.includes("anne")) {
    if (includesAny(text, ["pijama", "bakım", "krem", "dekor", "kahve", "battaniye", "oda kokusu"])) score += 12;
  }

  if (relation.includes("arkadas")) {
    if (includesAny(text, ["kupa", "body mist", "kahve", "çorap", "kitap", "hobi", "çikolata"])) score += 10;
  }

  if (relation.includes("erkek") || relation.includes("baba")) {
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

  if (answers.interest && includesAny(text, answers.interest.split(" "))) score += 15;
  if (answers.occasion.includes("romantik") && includesAny(text, ["romantik", "kolye", "anı", "çiçek"])) score += 8;
  if (answers.occasion.includes("ev") && includesAny(text, ["dekor", "kupa", "vazo", "defter"])) score += 8;

  if (urgency.includes("bugun") || urgency.includes("acil")) {
    if (includesAny(text, ["çiçek", "çikolata", "kupa", "body mist", "el kremi", "kahve", "mum"])) score += 8;
  }

  if (urgency.includes("yarin")) {
    if (includesAny(text, ["pijama", "bakım", "kahve", "kolye", "mum"])) score += 7;
  }

  return score;
}

export default function GiftFinderPage() {
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const [gifts, setGifts] = useState<Gift[]>(fallbackGifts);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [replacements, setReplacements] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Gift[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const [answers, setAnswers] = useState<Answers>({
    relation: "",
    style: "",
    interest: "",
    budget: "",
    urgency: "",
    occasion: "",
    exclude: "",
  });

  useEffect(() => {
    try {
      const draft = JSON.parse(localStorage.getItem("nealsam.finder.v2") || "null");
      if (draft?.answers && typeof draft.answers === "object") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the browser draft after hydration.
        setAnswers(current => Object.fromEntries(Object.keys(current).map(key => [key, typeof draft.answers[key] === "string" ? draft.answers[key] : ""])) as Answers);
        setStep(Math.max(0, Math.min(questions.length - 1, Number(draft.step) || 0)));
        setShowResults(draft.showResults === true);
        if (Array.isArray(draft.hiddenIds)) setHiddenIds(draft.hiddenIds.filter((value: unknown) => typeof value === "string"));
        if (draft.replacements && typeof draft.replacements === "object") setReplacements(Object.fromEntries(Object.entries(draft.replacements).filter(([,value]) => typeof value === "string")) as Record<string,string>);
      }
      const favorites = JSON.parse(localStorage.getItem("nealsam.favorites.v1") || "[]");
      if (Array.isArray(favorites)) setSaved(favorites.filter(g => g && typeof g.title === "string").slice(0, 50));
    } catch { /* A missing or invalid draft starts a fresh test. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("nealsam.finder.v2", JSON.stringify({ answers, step, showResults, hiddenIds, replacements }));
      localStorage.setItem("nealsam.favorites.v1", JSON.stringify(saved));
    } catch { /* The test remains usable when browser storage is unavailable. */ }
  }, [answers, step, showResults, saved, ready, hiddenIds, replacements]);

  function toggleSaved(gift: Gift) {
    const title = cleanGiftTitle(getRawGiftTitle(gift));
    setSaved(current => current.some(item => item.title === title)
      ? current.filter(item => item.title !== title)
      : [...current, { ...gift, title }].slice(-50));
  }

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
              ...gift,
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

  const limit = budgetLimit(answers.budget);

  const results = useMemo(() => {
    return diversifyGifts(gifts
      .filter((gift) => gift && fitsBudget(gift, limit) && !excludesGift(gift, answers.exclude))
      .map((gift) => ({
        gift,
        score: getMatchScore(gift, answers),
      }))
      .sort((a, b) => b.score - a.score));
  }, [gifts, answers, limit]);

  const visibleResults = savedOnly
    ? saved.map(gift => ({ gift, score: getMatchScore(gift, answers) }))
    : results.slice(0, 4).map(item => results.find(candidate => (candidate.gift.id || getRawGiftTitle(candidate.gift)) === replacements[item.gift.id || getRawGiftTitle(item.gift)]) || item);

  function replaceGift(gift: Gift) {
    const next = results.slice(4).find(({ gift: item }) => !hiddenIds.includes(item.id || getRawGiftTitle(item)) && !visibleResults.some(visible => visible.gift.id === item.id));
    if (!next) { setNotice("Bu seçimler için başka öneri kalmadı. Tercihlerini değiştirerek yeni fikirler bulabilirsin."); return; }
    const currentId = gift.id || getRawGiftTitle(gift);
    const originalId = Object.keys(replacements).find(key => replacements[key] === currentId) || currentId;
    setReplacements(current => ({ ...current, [originalId]: next.gift.id || getRawGiftTitle(next.gift) }));
    setHiddenIds(current => [...current, gift.id || getRawGiftTitle(gift)]);
    setNotice("Bir öneri yenilendi; diğer seçimlerin korundu.");
  }

  function selectOption(value: string) {
    setHiddenIds([]);
    setReplacements({});
    setSavedOnly(false);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.key]: value,
    }));

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      requestAnimationFrame(() => questionHeading.current?.focus());
    } else {
      setShowResults(true);
    }
  }

  function goBack() {
    if (showResults) {
      setShowResults(false);
      setStep(0);
      return;
    }

    setStep((current) => Math.max(0, current - 1));
  }

  function restart() {
    setHiddenIds([]);
    setReplacements({});
    setSavedOnly(false);
    setNotice("");
    setAnswers({
      relation: "",
      style: "",
      interest: "",
      budget: "",
      urgency: "",
    occasion: "",
    exclude: "",
    });
    setStep(0);
    setShowResults(false);
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-4 py-6 text-[#2b1b1b] md:py-8">
      <section className="mx-auto max-w-7xl">
        <div className={`rounded-2xl border border-pink-100 bg-white shadow-sm ${showResults ? "p-4 md:p-5" : "p-5 md:p-7"}`}>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Bul
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Birlikte düşünülmüş bir hediye bulalım
          </h1>

          {!showResults && <p className="mt-3 max-w-3xl text-sm font-normal leading-6 text-[#6b4a4a]">
            Kime, hangi tarzda ve hangi bütçeyle hediye alacağını seç. Sonuçta mağaza linkleri, risk yorumu ve özel not önerisi de çıkacak.
          </p>}

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
                Adım {step + 1} / {questions.length}
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

            <h2 ref={questionHeading} tabIndex={-1} className="mt-6 text-3xl font-black outline-none md:text-5xl">
              {currentQuestion.title}
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {currentQuestion.subtitle}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={`${currentQuestion.key}-${option.label}`}
                  onClick={() => selectOption(option.value)}
                  aria-pressed={answers[currentQuestion.key] === option.value}
                  className={`rounded-2xl border p-4 text-left transition hover:bg-pink-100 focus-visible:outline-2 focus-visible:outline-pink-600 ${answers[currentQuestion.key] === option.value ? "border-pink-500 bg-pink-100" : "border-pink-100 bg-[#fff4ef]"}`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <p className="mt-2 text-sm font-bold text-[#2b1b1b] md:text-base">
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
                  Seçimlerine göre sıralanan hediye fikirleri. Fiyat aralıkları tahminidir; stok ve güncel fiyat mağazaya göre değişir.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={goBack}
                  className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
                >
                  Tercihleri Düzenle
                </button>

                <button
                  onClick={restart}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
                >
                  Testi Yeniden Başlat
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {questions.map((question, index) => {
                const label = question.options.find(option => option.value === answers[question.key])?.label;
                return label ? <button key={question.key} onClick={() => { setStep(index); setShowResults(false); }} className="rounded-full border border-pink-200 bg-white px-3 py-2 text-xs font-semibold" aria-label={`${question.title}: ${label}. Değiştir`}>{label} ✎</button> : null;
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setSavedOnly(false)} aria-pressed={!savedOnly} className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-bold">Öneriler</button>
              <button onClick={() => setSavedOnly(true)} aria-pressed={savedOnly} className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-bold">♥ Kaydettiklerim ({saved.length})</button>
            </div>
            <p className="mt-3 text-xs text-[#6b4a4a]">Seçimlerin ve kaydettiklerin bu tarayıcıda saklanır. Tarayıcı verilerini silersen bu kayıtlar da silinir.</p>
            <p role="status" className="mt-3 text-sm text-pink-700">{notice}</p>
            {savedOnly && saved.length === 0 && <p className="mt-5 rounded-2xl bg-white p-5">Henüz kaydettiğin bir hediye yok. Önerilerdeki ♡ Kaydet düğmesini kullanabilirsin.</p>}
            {answers.urgency && answers.urgency !== "normal" && (
              <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                Acil hediye için mağazadan teslim veya dijital seçenekleri değerlendir. Stok ve teslimat süresini doğrulayamıyoruz; siparişten önce mağazada kontrol et.
              </p>
            )}
            {results.length === 0 && !loading && (
              <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-6" role="status">
                <h3 className="text-xl font-bold">Bu bütçeye uygun fiyat bilgisi olan hediye bulamadık.</h3>
                <p className="mt-2 text-sm">Testi yeniden başlatıp bütçeni değiştirebilirsin. Bütçeni aşan veya fiyatı bilinmeyen önerileri listelemedik.</p>
              </div>
            )}
            <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
              {visibleResults.map(({ gift, score }, index) => (
                <GiftResultCard
                  key={gift.id || `${gift.title || gift.name || "gift"}-${index}`}
                  gift={gift}
                  score={score}
                  onReplace={savedOnly ? undefined : () => replaceGift(gift)}
                  onFavorite={() => toggleSaved(gift)}
                  isFavorite={saved.some(item => item.title === cleanGiftTitle(getRawGiftTitle(gift)))}
                  budgetNote={savedOnly ? undefined : budgetDescription(gift, limit)}
                  matchReasons={[
                    ...(answers.interest && includesAny(getGiftText(gift), answers.interest.split(" ")) ? ["Seçtiğin ilgi alanıyla ilişkili"] : []),
                    ...(answers.style && includesAny(getGiftText(gift), answers.style.split(" ")) ? ["Seçtiğin tarza yakın"] : []),
                    ...(!savedOnly && limit ? ["Başlangıç fiyatı bütçe sınırının içinde"] : []),
                  ]}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
