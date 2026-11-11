"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AlertCircle, ArrowLeft, ChevronRight, Heart, Info, Loader2, Pencil, RotateCcw, Sparkles } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ui } from "@/components/ui/styles";
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
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        {showResults ? (
          <header className="pb-8 pt-6 md:pt-10">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
              Hediye bul
            </p>
          </header>
        ) : (
          <PageHero
            eyebrow="Hediye bul"
            title="Birlikte düşünülmüş"
            accent="bir hediye bulalım."
            description="Kime, hangi tarzda ve hangi bütçeyle alacağını seç. Sonuçta mağaza linkleri, risk yorumu ve not önerisi de çıkacak."
          />
        )}

        {loadError && (
          <p className="mb-6 flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-4 text-sm font-bold text-red-700 ring-1 ring-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {loadError}
          </p>
        )}

        <div className="mb-6 flex max-w-4xl items-start gap-3 rounded-2xl bg-white px-5 py-4 text-sm ring-1 ring-pink-100" aria-live="polite">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-pink-600" />
          <div>
            <p className="font-bold text-[#2b1b1b]">
              {access?.paid ? "Plus özelliklerin açık: hediye aramaları ve kişisel hazırlık planı." : access ? `Bu tarayıcıda ${access.remaining} ücretsiz araman kaldı. Sonrasında Plus 49 TL. Üyelik tek başına ek hak vermez.` : "İlk 3 farklı arama ücretsiz. Sonrasında Plus 49 TL."}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#8a6a6a]">Aynı tercihleri yeniden görmek hak tüketmez. Ücretsiz haklar bu tarayıcıdaki çerezle takip edilir.</p>
          </div>
        </div>

        {paywall && (
          <section className="dark-surface mb-6 max-w-4xl rounded-[1.75rem] bg-[#2b1b1b] p-7 text-white md:p-8" role="alert">
            <h2 className="text-3xl">Üç ücretsiz aramanı <em>kullandın.</em></h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/70">Yeni hediye fikirleri ve kişisel hazırlık planı için Plus’a geç. Önceki tercihlerin korunuyor; üye olmak tek başına arama sınırını kaldırmaz.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/odeme?plan=plus" className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-pink-500">
                49 TL’lik Plus paketini incele
              </Link>
              <Link href="/giris?next=%2Fhediye-bul" className="text-sm font-bold text-white underline decoration-pink-400 decoration-2 underline-offset-[6px]">Zaten paketim var, giriş yap</Link>
            </div>
          </section>
        )}

        {!showResults ? (
          <div data-no-reveal className={`${ui.card} max-w-4xl p-6 shadow-xl shadow-pink-900/5 md:p-10`}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-[#8a6a6a]">
                Adım <span className="text-[#2b1b1b]">{step + 1}</span> / {questions.length}
              </p>

              {loading && (
                <span className="inline-flex items-center gap-2 text-xs font-bold text-pink-700">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Hediyeler aranıyor
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${questions.length}, minmax(0, 1fr))` }}>
              {questions.map((q, i) => (
                <span key={q.key} className={`h-1.5 rounded-full transition-colors duration-500 ${i <= step ? "bg-pink-600" : "bg-pink-100"}`} />
              ))}
            </div>
            <span className="sr-only">İlerleme: %{progress}</span>

            <h2 key={`title-${step}`} ref={questionHeading} tabIndex={-1} className="fade-in-up mt-10 text-4xl outline-none md:text-5xl">
              {currentQuestion.title}
            </h2>

            <p key={`sub-${step}`} className="fade-in-up mt-3 leading-7 text-[#6b4a4a]" style={{ "--delay": "80ms" } as CSSProperties}>
              {currentQuestion.subtitle}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, optionIndex) => {
                const selected = answers[currentQuestion.key] === option.value;
                return (
                  <button
                    key={`${currentQuestion.key}-${option.label}`}
                    disabled={loading || !ready}
                    onClick={() => selectOption(option.value)}
                    aria-pressed={selected}
                    style={{ "--delay": `${140 + optionIndex * 60}ms` } as CSSProperties}
                    className={`fade-in-up group flex items-center gap-4 rounded-2xl p-4 text-left transition duration-300 focus-visible:outline-2 focus-visible:outline-pink-600 disabled:opacity-60 ${
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

              <button onClick={() => void finishSearch()} disabled={loading || !ready} className={`${ui.btnLink} disabled:opacity-50`}>
                Testi bitir, sonuçları gör
              </button>
            </div>
          </div>
        ) : (
          <section>
            <div className="flex flex-col gap-6 border-b border-pink-100 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={ui.eyebrow}>Sonuçlar</p>
                <h1 className="mt-3 text-4xl md:text-6xl">
                  Sana en uygun <em>hediyeler</em>
                </h1>
                <p className="mt-3 max-w-2xl leading-7 text-[#6b4a4a]">
                  Seçimlerine göre sıralanan hediye fikirleri. Fiyat aralıkları tahminidir; stok ve güncel fiyat mağazaya göre değişir.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={goBack} className={ui.btnSecondary}>
                  <ArrowLeft className="h-4 w-4" />
                  Tercihleri düzenle
                </button>
                <button onClick={restart} className={ui.btnDark}>
                  <RotateCcw className="h-4 w-4" />
                  Yeniden başlat
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {questions.map((question, index) => {
                const label = question.options.find(option => option.value === answers[question.key])?.label;
                return label ? (
                  <button
                    key={question.key}
                    onClick={() => { setStep(index); setShowResults(false); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-[#6b4a4a] ring-1 ring-pink-100 transition hover:ring-pink-300"
                    aria-label={`${question.title}: ${label}. Değiştir`}
                  >
                    {label}
                    <Pencil className="h-3 w-3 text-pink-600" />
                  </button>
                ) : null;
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-full bg-white p-1 ring-1 ring-pink-100 sm:inline-flex">
              <button
                onClick={() => setSavedOnly(false)}
                aria-pressed={!savedOnly}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${!savedOnly ? "bg-[#2b1b1b] text-white" : "text-[#6b4a4a] hover:text-[#2b1b1b]"}`}
              >
                Öneriler
              </button>
              <button
                onClick={() => setSavedOnly(true)}
                aria-pressed={savedOnly}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition ${savedOnly ? "bg-[#2b1b1b] text-white" : "text-[#6b4a4a] hover:text-[#2b1b1b]"}`}
              >
                <Heart className="h-4 w-4" />
                Kaydettiklerim ({saved.length})
              </button>
            </div>
            <p className="mt-3 text-xs text-[#8a6a6a]">Seçimlerin ve kaydettiklerin bu tarayıcıda saklanır. Tarayıcı verilerini silersen bu kayıtlar da silinir.</p>
            <p role="status" className="mt-2 text-sm font-bold text-pink-700">{notice}</p>

            {savedOnly && saved.length === 0 && (
              <p className={`${ui.card} mt-5 p-6 text-[#6b4a4a]`}>Henüz kaydettiğin bir hediye yok. Önerilerdeki ♡ Kaydet düğmesini kullanabilirsin.</p>
            )}
            {answers.urgency && answers.urgency !== "normal" && (
              <p className="mt-5 flex items-start gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Acil hediye için mağazadan teslim veya dijital seçenekleri değerlendir. Stok ve teslimat süresini doğrulayamıyoruz; siparişten önce mağazada kontrol et.
              </p>
            )}
            {results.length === 0 && !loading && (
              <div className={`${ui.card} mt-6 p-7`} role="status">
                <h3 className="font-display text-2xl font-normal">Bu bütçeye uygun fiyat bilgisi olan hediye bulamadık.</h3>
                <p className="mt-2 leading-7 text-[#6b4a4a]">Testi yeniden başlatıp bütçeni değiştirebilirsin. Bütçeni aşan veya fiyatı bilinmeyen önerileri listelemedik.</p>
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
