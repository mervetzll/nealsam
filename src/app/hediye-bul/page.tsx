"use client";

import ShareGiftButton from "@/components/ShareGiftButton";
import SaveGiftResultButton from "@/components/SaveGiftResultButton";
import FavoriteGiftButton from "@/components/FavoriteGiftButton";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { gifts as fallbackGifts } from "@/data/gifts";
import { questions } from "@/data/questions";
import type { Gift, ScoredGift } from "@/types/gift";
import { supabase } from "@/lib/supabase";
import { getStoreLinksForGift } from "@/utils/giftStores";
import {
  getGiftResults,
  getPriceText,
  getRiskLabel,
  makeNotePrompt,
  makeResultSummary,
} from "@/utils/giftAlgorithm";

type ProfileHint = {
  name: string;
  default_budget: string;
  favorite_interests: string;
  gift_style: string;
};


type AnswerMap = Record<number, string[]>;

function toggleAnswer(
  answers: AnswerMap,
  questionIndex: number,
  option: string,
  multiple?: boolean
): AnswerMap {
  const current = answers[questionIndex] || [];

  if (!multiple) {
    return {
      ...answers,
      [questionIndex]: [option],
    };
  }

  if (option === "Fark etmez") {
    return {
      ...answers,
      [questionIndex]: ["Fark etmez"],
    };
  }

  const withoutNeutral = current.filter((item) => item !== "Fark etmez");

  if (withoutNeutral.includes(option)) {
    return {
      ...answers,
      [questionIndex]: withoutNeutral.filter((item) => item !== option),
    };
  }

  return {
    ...answers,
    [questionIndex]: [...withoutNeutral, option],
  };
}

function isSelected(answers: AnswerMap, questionIndex: number, option: string) {
  return (answers[questionIndex] || []).includes(option);
}

function getRecommendationLabel(match: number) {
  if (match >= 90) return "Çok güçlü eşleşme";
  if (match >= 78) return "Güçlü eşleşme";
  if (match >= 65) return "Uygun alternatif";
  return "Farklı fikir";
}

function GiftResultCard({
  gift,
  answers,
  onBlockTitle,
  onBlockCategory,
}: {
  gift: ScoredGift;
  answers: AnswerMap;
  onBlockTitle: (title: string) => void;
  onBlockCategory: (category: string) => void;
}) {
  const notePrompt = makeNotePrompt(gift, answers);
  const storeLinks = getStoreLinksForGift(gift);
  const bestNote = storeLinks.find((item) => item.note)?.note;

  return (
    <article className="rounded-[1.5rem] md:rounded-[2rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[1.25rem] bg-[#fff0f7] px-3 py-1 text-xs font-bold text-pink-600">
              %{gift.matchPercent} eşleşme
            </span>
            <span className="rounded-[1.25rem] bg-[#fff4ef] px-3 py-1 text-xs font-bold text-[#6b4b4b]">
              {getRecommendationLabel(gift.matchPercent)}
            </span>
            <span className="rounded-[1.25rem] bg-[#fff4ef] px-3 py-1 text-xs font-bold text-[#6b4b4b]">
              {getRiskLabel(gift.riskLevel)}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-extrabold text-[#2b1b1b]">
            {gift.title}
          </h3>

          <p className="mt-2 text-sm font-bold text-pink-600">
            {gift.category} / {gift.subCategory} · {getPriceText(gift)}
          </p>
        </div>

        <div className="rounded-3xl bg-[#fff0f7] px-5 py-4 text-center">
          <p className="text-xs font-bold text-pink-600">Tahmini bütçe</p>
          <p className="mt-1 text-lg font-extrabold text-[#2b1b1b]">
            {getPriceText(gift)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-1 md:grid-cols-2">
        <div className="rounded-3xl bg-[#fff4ef] p-5">
          <p className="text-sm font-bold text-pink-600">Neden uygun?</p>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">{gift.reason}</p>
        </div>

        <div className="rounded-3xl bg-[#fff4ef] p-5">
          <p className="text-sm font-bold text-pink-600">Yanına koyulacak not</p>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">{gift.note}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {gift.interests.slice(0, 5).map((interest) => (
          <span
            key={interest}
            className="rounded-[1.25rem] border border-pink-100 px-3 py-1 text-xs font-bold text-[#6b4b4b]"
          >
            {interest}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-pink-600">
              Bu hediye için daha doğru mağaza önerileri
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              {bestNote || "Bu hediye için en mantıklı arama kaynakları hazırlandı."}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {storeLinks.slice(0, 3).map((link) => (
            <a
              key={`${gift.title}-${link.label}`}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`rounded-[1.25rem] px-4 py-3 text-center text-sm font-bold transition-all duration-200 ${
                link.priority === "best"
                  ? "bg-[#2b1b1b] text-white hover:opacity-90"
                  : "bg-[#fff0f7] text-pink-600 hover:bg-[#fff0f7]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => onBlockTitle(gift.title)}
          className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-5 py-3 text-sm font-bold text-[#6b4b4b] hover:bg-[#fff0f7]"
        >
          Bunu istemiyorum
        </button>

        <button
          onClick={() => onBlockCategory(gift.category)}
          className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-5 py-3 text-sm font-bold text-[#6b4b4b] hover:bg-[#fff0f7]"
        >
          Benzerlerini gösterme
        </button>
      </div>

      <div className="mt-5 rounded-3xl border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md p-5">
        <p className="text-sm font-bold text-pink-600">
          Bu hediyeyi özel bir deneyime dönüştürmek ister misin?
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
          Bu fikrin yanına kişisel not, hikaye, bulmaca veya QR kodlu mesaj
          hazırlayabilirsin.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/deneyim?plan=premium&gift=${encodeURIComponent(notePrompt)}`}
            className="rounded-[1.25rem] bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white"
          >
            Özel Konsept Hazırla
          </Link>

          <Link
            href="/demo"
            className="rounded-[1.25rem] bg-white px-5 py-3 text-sm font-bold text-pink-600"
          >
            Konseptleri Gör
          </Link>
        </div>
      </div>
    
                      <div className="mt-5 rounded-2xl border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="text-sm font-black text-[#2b1b1b]">
                              Bu öneriyi paylaş
                            </p>
                            <p className="mt-1 text-xs font-semibold text-[#6b4a4a]">
                              Hediye fikrini WhatsApp, mesaj veya not olarak paylaşabilirsin.
                            </p>
                          </div>

                          
                          <p className="mt-3 text-xs font-semibold leading-5 text-[#8a6a6a]">
                            Bu öneriyi hesabına kaydedebilir, favorilerine ekleyebilir
                            veya arkadaşınla paylaşabilirsin.
                          </p>

<div className="mt-4 flex flex-wrap items-center gap-2">
                            <ShareGiftButton
                              title={gift.title}
                              text={`${gift.title} — ${gift.reason}`}
                            />

                            <SaveGiftResultButton gift={gift} />

                            <FavoriteGiftButton gift={gift} />
                          </div>
                        </div>
                      </div>

                    </article>
  );
}



function getProfileSuggestionText(profile: ProfileHint | null): string {
  if (!profile) return "";

  const parts: string[] = [];

  if (profile.default_budget) {
    parts.push(`Bütçe sorusunda "${profile.default_budget}" aralığına en yakın seçeneği seç.`);
  }

  if (profile.favorite_interests) {
    parts.push(`İlgi alanlarında "${profile.favorite_interests}" seçeneklerine yakın alanları işaretle.`);
  }

  if (profile.gift_style) {
    parts.push(`Hediye tarzında "${profile.gift_style}" tercihine en yakın seçeneği seç.`);
  }

  if (parts.length === 0) {
    return "Profilinde henüz yeterli tercih yok. Hesabım sayfasından bütçe, ilgi alanı ve tarz ekleyebilirsin.";
  }

  return parts.join(" ");
}

export default function HediyeBulPage() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [blockedTitles, setBlockedTitles] = useState<string[]>([]);
  const [blockedCategories, setBlockedCategories] = useState<string[]>([]);
  const [giftPool, setGiftPool] = useState<Gift[]>(fallbackGifts);
  const [giftSource, setGiftSource] = useState<"supabase" | "fallback" | "loading">("loading");
  const [profileHint, setProfileHint] = useState<ProfileHint | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicGifts() {
      try {
        const response = await fetch("/api/gifts", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!cancelled && Array.isArray(data.gifts) && data.gifts.length > 0) {
          setGiftPool(data.gifts);
          setGiftSource(data.source === "supabase" ? "supabase" : "fallback");
        }
      } catch {
        if (!cancelled) {
          setGiftPool(fallbackGifts);
          setGiftSource("fallback");
        }
      }
    }

    loadPublicGifts();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentQuestion = questions[step];
  const answeredCurrent = (answers[step] || []).length > 0;
  const progress = Math.round(((step + 1) / questions.length) * 100);

  const allResults = useMemo(() => {
    return getGiftResults(giftPool, answers);
  }, [answers, giftPool]);

  const results = useMemo(() => {
    return allResults
      .filter((gift) => !blockedTitles.includes(gift.title))
      .filter((gift) => !blockedCategories.includes(gift.category))
      .slice(0, 8);
  }, [allResults, blockedTitles, blockedCategories]);

  const selectedCount = Object.values(answers).filter((value) => value.length > 0).length;
  const canShowResults = selectedCount >= questions.length;

  function goNext() {
    if (step < questions.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    setShowResults(true);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setShowResults(false);
    setBlockedTitles([]);
    setBlockedCategories([]);
  }

  function blockTitle(title: string) {
    setBlockedTitles((current) =>
      current.includes(title) ? current : [...current, title]
    );
  }

  function blockCategory(category: string) {
    setBlockedCategories((current) =>
      current.includes(category) ? current : [...current, category]
    );
  }

  function undoFilters() {
    setBlockedTitles([]);
    setBlockedCategories([]);
  }

  if (showResults) {
    return (
      <main className="min-h-screen bg-[#fff7f3] px-6 py-14 text-[#2b1b1b]">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-[1.5rem] md:rounded-[2rem] bg-white p-7 shadow-sm md:p-5 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-600">
              NeAlsam Hediye Bul
            </p>

            <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold md:text-4xl md:text-5xl">
                  Sana en uygun hediye fikirleri
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
                  {makeResultSummary(answers)}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {(blockedTitles.length > 0 || blockedCategories.length > 0) && (
                  <button
                    onClick={undoFilters}
                    className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-6 py-3 text-sm font-bold text-pink-600"
                  >
                    Filtreleri sıfırla
                  </button>
                )}

                <button
                  onClick={restart}
                  className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-6 py-3 text-sm font-bold text-pink-600"
                >
                  Baştan başla
                </button>
              </div>
            </div>

            {(blockedTitles.length > 0 || blockedCategories.length > 0) && (
              <div className="mt-6 rounded-3xl bg-[#fff0f7] p-5">
                <p className="text-sm font-bold text-pink-600">
                  Aktif filtreler
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {blockedTitles.map((item) => (
                    <span
                      key={item}
                      className="rounded-[1.25rem] bg-white px-3 py-1 text-xs font-bold text-[#6b4b4b]"
                    >
                      İstenmeyen: {item}
                    </span>
                  ))}
                  {blockedCategories.map((item) => (
                    <span
                      key={item}
                      className="rounded-[1.25rem] bg-white px-3 py-1 text-xs font-bold text-[#6b4b4b]"
                    >
                      Kategori kapalı: {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-6">
            {results.length > 0 ? (
              results.map((gift) => (
                <GiftResultCard
                  key={gift.title}
                  gift={gift}
                  answers={answers}
                  onBlockTitle={blockTitle}
                  onBlockCategory={blockCategory}
                />
              ))
            ) : (
              <div className="rounded-[1.5rem] md:rounded-[2rem] bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-extrabold text-[#2b1b1b]">
                  Bu filtrelerle öneri kalmadı
                </h2>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#8a6a6a]">
                Çok düşünme; aklına en yakın gelen seçeneği işaretle. Emin değilsen “Fark etmez” seçebilirsin.
              </p>

                <p className="mt-3 text-[#6b4b4b]">
                  Birkaç filtreyi sıfırlarsan sana tekrar öneri çıkarabilirim.
                </p>
                <button
                  onClick={undoFilters}
                  className="mt-5 rounded-[1.25rem] bg-pink-600 px-6 py-3 text-sm font-bold text-white"
                >
                  Filtreleri sıfırla
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-14 text-[#2b1b1b]">
      <section className="mx-auto max-w-5xl rounded-[1.5rem] md:rounded-[2rem] bg-white p-7 shadow-sm md:p-5 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-600">
            Hediye Bul
          </p>

          <Link
            href="/"
            className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-5 py-3 text-sm font-bold text-pink-600 transition-all duration-200 hover:bg-[#fff0f7]"
          >
            Ana Sayfa
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold md:text-4xl md:text-5xl">
              Kime ne hediye alınır?
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b4b4b]">
              Bütçe, ilgi alanı, tarz, aciliyet ve risklere göre sana daha doğru
              hediye fikirleri çıkaralım.
            </p>
          </div>

          <div className="rounded-3xl bg-[#fff0f7] px-5 py-4">
            <p className="text-xs font-bold text-pink-600">İlerleme</p>
            <p className="mt-1 text-xl font-extrabold">%{progress}</p>
          </div>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-[1.25rem] bg-[#fff0f7]">
          <div
            className="h-full rounded-[1.25rem] bg-pink-600 transition-all duration-200-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold text-pink-600">
            Soru {step + 1} / {questions.length}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">{currentQuestion.title}</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const selected = isSelected(answers, step, option);

              return (
                <button
                  key={option === "Fark etmez" ? "✨ Fark etmez" : option}
                  onClick={() =>
                    setAnswers((current) =>
                      toggleAnswer(current, step, option, currentQuestion.multiple)
                    )
                  }
                  className={`rounded-3xl border px-5 py-4 text-left text-sm font-bold transition-all duration-200 ${
                    selected
                      ? "border-[#b83280] bg-[#fff0f7] text-pink-600"
                      : "border-pink-100 bg-[#fff4ef] text-[#2b1b1b] hover:border-[#b83280]"
                  }`}
                >
                  {option === "Fark etmez" ? "✨ Fark etmez" : option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="rounded-[1.25rem] border border-pink-100 bg-white shadow-sm hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md px-6 py-3 text-sm font-bold text-pink-600 disabled:opacity-40"
          >
            Geri
          </button>

          <button
            onClick={goNext}
            disabled={!answeredCurrent || (step === questions.length - 1 && !canShowResults)}
            className="rounded-[1.25rem] bg-[#2b1b1b] px-7 py-4 text-sm font-bold text-white disabled:opacity-40"
          >
            {step === questions.length - 1 ? "Hediyeleri göster" : "Devam et →"}
          </button>
        </div>
      </section>
    </main>
  );
}
