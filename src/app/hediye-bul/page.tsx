"use client";

import { useEffect, useRef, useState } from "react";
import { budgetLimit, budgetDescription } from "@/lib/giftBudget";
import GiftResultCard from "@/components/GiftResultCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getMatchScore, getGiftText, includesAny, type Gift, type Answers } from "@/lib/giftMatching";
import GiftPlanPanel from "@/components/GiftPlanPanel";
import { cleanGiftTitle, getRawGiftTitle } from "@/lib/giftPresentation";

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

export default function GiftFinderPage() {
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const [results, setResults] = useState<{gift: Gift; score: number}[]>([]);
  const [access, setAccess] = useState<{remaining: number; paid: boolean} | null>(null);
  const [paywall, setPaywall] = useState(false);
  const searching = useRef(false);
  const [loading, setLoading] = useState(false);
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
        // Results are re-authorized by the server; local storage cannot grant searches.
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

  async function authHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) };
  }

  useEffect(() => {
    let active = true;
    async function refreshAccess() {
      try {
        const response = await fetch("/api/gift-search", { headers: await authHeaders(), cache: "no-store" });
        const data = await response.json();
        if (active && response.ok) setAccess(data);
      } catch { /* A search will retry the access check and show any error. */ }
    }
    void refreshAccess();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { void refreshAccess(); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function finishSearch(nextAnswers: Answers = answers) {
    if (searching.current) return;
    searching.current = true;
    setLoading(true);
    setLoadError("");
    setPaywall(false);
    try {
      const response = await fetch("/api/gift-search", { method: "POST", headers: await authHeaders(), body: JSON.stringify({ answers: nextAnswers }) });
      const data = await response.json();
      if (response.status === 402) { setAccess({remaining: 0, paid: false}); setPaywall(true); return; }
      if (!response.ok) throw new Error(data.error || "Arama tamamlanamadı. Yeniden deneyebilirsin.");
      setAccess({remaining: data.remaining, paid: data.paid});
      setResults(data.results);
      setShowResults(true);
      setSavedOnly(false);
      setHiddenIds([]);
      setReplacements({});
    } catch (error) { setLoadError(error instanceof Error ? error.message : "Arama tamamlanamadı."); }
    finally { searching.current = false; setLoading(false); }
  }

  const currentQuestion = questions[step];

  const progress = Math.round(((step + 1) / questions.length) * 100);

  const limit = budgetLimit(answers.budget);

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
      void finishSearch({ ...answers, [currentQuestion.key]: value });
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

          <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight md:text-4xl">
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

        <div className="mt-4 rounded-2xl border border-pink-100 bg-white p-4 text-sm" aria-live="polite">
          {access?.paid ? "Plus özelliklerin açık: hediye aramaları ve kişisel hazırlık planı." : access ? `Bu tarayıcıda ${access.remaining} ücretsiz araman kaldı. Sonrasında Plus 49 TL. Üyelik tek başına ek hak vermez.` : "İlk 3 farklı arama ücretsiz. Sonrasında Plus 49 TL."}
          <p className="mt-1 text-xs text-[#6b4a4a]">Aynı tercihleri yeniden görmek hak tüketmez. Ücretsiz haklar bu tarayıcıdaki çerezle takip edilir.</p>
        </div>
        {paywall && <section className="mt-5 rounded-2xl border border-pink-300 bg-pink-50 p-6" role="alert">
          <h2 className="text-2xl font-black">Üç ücretsiz aramanı kullandın 🎁</h2>
          <p className="mt-3 text-sm leading-6">Yeni hediye fikirleri ve kişisel hazırlık planı için Plus’a geç. Önceki tercihlerin korunuyor; üye olmak tek başına arama sınırını kaldırmaz.</p>
          <Link href="/odeme?plan=plus" className="mt-4 inline-block rounded-full bg-pink-600 px-6 py-3 font-bold text-white">49 TL’lik Plus paketini incele</Link>
          <Link href="/giris?next=%2Fhediye-bul" className="ml-4 inline-block py-3 text-sm underline">Zaten paketim var, giriş yap</Link>
        </section>}
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
                  disabled={loading || !ready}
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
                onClick={() => void finishSearch()} disabled={loading || !ready}
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
            {!savedOnly && results.length > 0 && <GiftPlanPanel gifts={visibleResults.map(item => item.gift)} answers={answers} paid={access?.paid === true} />}
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
