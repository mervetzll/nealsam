"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { premiumConcepts } from "@/data/premiumConcepts";

export default function PremiumConceptLauncher() {
  const searchParams = useSearchParams();
  const selectedConceptId = searchParams.get("concept");

  const selectedConcept =
    premiumConcepts.find((concept) => concept.id === selectedConceptId) ||
    premiumConcepts[0];

  if (!selectedConceptId) {
    return null;
  }

  return (
    <section className="mx-auto mt-8 max-w-5xl px-5">
      <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
          Seçilen Premium Konsept
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                {selectedConcept.badge}
              </span>

              <span className="rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-black uppercase text-white">
                {selectedConcept.premiumLevel}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
              {selectedConcept.title}
            </h1>

            <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {selectedConcept.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedConcept.bestFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-pink-100 bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#fff0f7] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Örnek mesaj hissi
            </p>

            <p className="mt-3 text-lg font-black leading-8 text-[#2b1b1b]">
              “{selectedConcept.sample}”
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/paketler"
                className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
              >
                Bu Konsepti Kullan
              </Link>

              <Link
                href="/deneyim"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Tüm Konseptler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
