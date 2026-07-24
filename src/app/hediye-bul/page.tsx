"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { gifts } from "@/data/gifts";
import { questions } from "@/data/questions";
import type { ScoredGift } from "@/types/gift";
import {
  getGiftResults,
  getPriceText,
  getRiskLabel,
  makeNotePrompt,
  makeResultSummary,
  makeSearchUrl,
} from "@/utils/giftAlgorithm";

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
}: {
  gift: ScoredGift;
  answers: AnswerMap;
}) {
  const notePrompt = makeNotePrompt(gift, answers);

  return (
    <article className="rounded-[2rem] border border-[#f0d7df] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
              %{gift.matchPercent} eşleşme
            </span>
            <span className="rounded-full bg-[#fffaf7] px-3 py-1 text-xs font-bold text-[#6b4b4b]">
              {getRecommendationLabel(gift.matchPercent)}
            </span>
            <span className="rounded-full bg-[#fffaf7] px-3 py-1 text-xs font-bold text-[#6b4b4b]">
              {getRiskLabel(gift.riskLevel)}
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-extrabold text-[#2b1b1b]">
            {gift.title}
          </h3>

          <p className="mt-2 text-sm font-bold text-[#b83280]">
            {gift.category} / {gift.subCategory} · {getPriceText(gift)}
          </p>
        </div>

        <div className="rounded-3xl bg-[#fff0f7] px-5 py-4 text-center">
          <p className="text-xs font-bold text-[#b83280]">Tahmini bütçe</p>
          <p className="mt-1 text-lg font-extrabold text-[#2b1b1b]">
            {getPriceText(gift)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-[#fffaf7] p-5">
          <p className="text-sm font-bold text-[#b83280]">Neden uygun?</p>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
            {gift.reason}
          </p>
        </div>

        <div className="rounded-3xl bg-[#fffaf7] p-5">
          <p className="text-sm font-bold text-[#b83280]">Yanına koyulacak not</p>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
            {gift.note}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {gift.interests.slice(0, 5).map((interest) => (
          <span
            key={interest}
            className="rounded-full border border-[#f0d7df] px-3 py-1 text-xs font-bold text-[#6b4b4b]"
          >
            {interest}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href={makeSearchUrl(gift.searchQuery, "google")}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#2b1b1b] px-4 py-3 text-center text-sm font-bold text-white"
        >
          Google’da ara
        </a>

        <a
          href={makeSearchUrl(gift.searchQuery, "trendyol")}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#fff0f7] px-4 py-3 text-center text-sm font-bold text-[#b83280]"
        >
          Trendyol
        </a>

        <a
          href={makeSearchUrl(gift.searchQuery, "amazon")}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#fff0f7] px-4 py-3 text-center text-sm font-bold text-[#b83280]"
        >
          Amazon
        </a>

        <a
          href={makeSearchUrl(gift.searchQuery, "hepsiburada")}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#fff0f7] px-4 py-3 text-center text-sm font-bold text-[#b83280]"
        >
          Hepsiburada
        </a>
      </div>

      <div className="mt-5 rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5">
        <p className="text-sm font-bold text-[#b83280]">
          Hediyeyi daha özel yapmak ister misin?
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
          Bu fikrin yanına kişisel not, hikaye, bulmaca veya QR kodlu mesaj
          hazırlayabilirsin.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/deneyim?plan=premium&gift=${encodeURIComponent(notePrompt)}`}
            className="rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
          >
            Not / Hikaye / QR hazırla
          </Link>

          <Link
            href="/demo"
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-[#b83280]"
          >
            Demo ile dene
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HediyeBulPage() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[step];
  const answeredCurrent = (answers[step] || []).length > 0;
  const progress = Math.round(((step + 1) / questions.length) * 100);

  const results = useMemo(() => {
    return getGiftResults(gifts, answers);
  }, [answers]);

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
  }

  if (showResults) {
    return (
      <main className="min-h-screen bg-[#fff7f3] px-6 py-14 text-[#2b1b1b]">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
              NeAlsam Hediye Bul
            </p>

            <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-extrabold md:text-5xl">
                  Sana en uygun hediye fikirleri
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
                  {makeResultSummary(answers)}
                </p>
              </div>

              <button
                onClick={restart}
                className="rounded-full border border-[#f0d7df] bg-[#fffaf7] px-6 py-3 text-sm font-bold text-[#b83280]"
              >
                Baştan başla
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            {results.map((gift) => (
              <GiftResultCard key={gift.title} gift={gift} answers={answers} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-14 text-[#2b1b1b]">
      <section className="mx-auto max-w-5xl rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
          Hediye Bul
        </p>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Kime ne hediye alınır?
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b4b4b]">
              Bütçe, ilgi alanı, tarz, aciliyet ve risklere göre sana daha doğru
              hediye fikirleri çıkaralım.
            </p>
          </div>

          <div className="rounded-3xl bg-[#fff0f7] px-5 py-4">
            <p className="text-xs font-bold text-[#b83280]">İlerleme</p>
            <p className="mt-1 text-xl font-extrabold">%{progress}</p>
          </div>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-[#fff0f7]">
          <div
            className="h-full rounded-full bg-[#b83280] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold text-[#b83280]">
            Soru {step + 1} / {questions.length}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold">
            {currentQuestion.title}
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const selected = isSelected(answers, step, option);

              return (
                <button
                  key={option}
                  onClick={() =>
                    setAnswers((current) =>
                      toggleAnswer(current, step, option, currentQuestion.multiple)
                    )
                  }
                  className={`rounded-3xl border px-5 py-4 text-left text-sm font-bold transition ${
                    selected
                      ? "border-[#b83280] bg-[#fff0f7] text-[#b83280]"
                      : "border-[#f0d7df] bg-[#fffaf7] text-[#2b1b1b] hover:border-[#b83280]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="rounded-full border border-[#f0d7df] bg-white px-6 py-3 text-sm font-bold text-[#b83280] disabled:opacity-40"
          >
            Geri
          </button>

          <button
            onClick={goNext}
            disabled={!answeredCurrent || (step === questions.length - 1 && !canShowResults)}
            className="rounded-full bg-[#b83280] px-7 py-4 text-sm font-bold text-white disabled:opacity-40"
          >
            {step === questions.length - 1 ? "Hediyeleri göster" : "Devam et"}
          </button>
        </div>
      </section>
    </main>
  );
}
