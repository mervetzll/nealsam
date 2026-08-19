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

function getMatchScore(gift: Gift, answers: Record<string, string>) {
  const text = normalize(
    `${gift.title || ""} ${gift.name || ""} ${gift.category || ""} ${gift.description || ""} ${(gift.tags || []).join(" ")}`
  );

  let score = 70;

  const relation = normalize(answers.relation || "");
  const style = normalize(answers.style || "");
  const interest = normalize(answers.interest || "");
  const budget = normalize(answers.budget || "");

  if (relation.includes("sevgili") || relation.includes("es")) {
    if (text.includes("kolye") || text.includes("parfum") || text.includes("pijama") || text.includes("romantik")) score += 12;
  }

  if (relation.includes("anne")) {
    if (text.includes("bakim") || text.includes("pijama") || text.includes("dekor") || text.includes("kahve")) score += 12;
  }

  if (relation.includes("arkadas")) {
    if (text.includes("kupa") || text.includes("body mist") || text.includes("kahve") || text.includes("cozy")) score += 10;
  }

  if (style.includes("rahat") || style.includes("cozy")) {
    if (text.includes("pijama") || text.includes("battaniye") || text.includes("kupa") || text.includes("kahve")) score += 14;
  }

  if (style.includes("bakim") || style.includes("self")) {
    if (text.includes("bakim") || text.includes("body mist") || text.includes("krem") || text.includes("spa")) score += 14;
  }

  if (style.includes("romantik")) {
    if (text.includes("kolye") || text.includes("parfum") || text.includes("cicek") || text.includes("takı") || text.includes("taki")) score += 14;
  }

  if (interest.includes("kahve")) {
    if (text.includes("kahve") || text.includes("kupa") || text.includes("termos")) score += 14;
  }

  if (interest.includes("bakim")) {
    if (text.includes("bakim") || text.includes("body mist") || text.includes("krem")) score += 14;
  }

  if (budget.includes("500") && ((gift.price || gift.budget || "").includes("200") || (gift.price || gift.budget || "").includes("300"))) {
    score += 5;
  }

  return Math.min(score, 98);
}

function getRiskLabel(gift: Gift) {
  const text = normalize(`${gift.title || ""} ${gift.category || ""} ${gift.description || ""}`);

  if (text.includes("parfum") || text.includes("canta") || text.includes("giyim")) return "Orta risk";
  if (text.includes("kolye") || text.includes("takı") || text.includes("taki")) return "Düşük / orta risk";
  if (text.includes("kupa") || text.includes("kahve") || text.includes("mum")) return "Düşük risk";

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

  const [answers, setAnswers] = useState({
    relation: "",
    gender: "",
    budget: "",
    style: "",
    interest: "",
    occasion: "",
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

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Bul
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Kime ne hediye alınır birlikte bulalım
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Kişiye, tarza, bütçeye ve ilgi alanına göre daha mantıklı hediye önerileri gör.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">
              Hediye bilgileri
            </h2>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-black">
                Kime alınacak?
                <select
                  value={answers.relation}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, relation: event.target.value }))
                  }
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
                >
                  <option value="">Fark etmez</option>
                  <option value="sevgili">Sevgili / eş</option>
                  <option value="anne">Anne</option>
                  <option value="arkadaş">Arkadaş</option>
                  <option value="kardeş">Kardeş</option>
                  <option value="erkek">Erkek arkadaş / baba / erkek</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black">
                Tarz nasıl olsun?
                <select
                  value={answers.style}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, style: event.target.value }))
                  }
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
                >
                  <option value="">Fark etmez</option>
                  <option value="cozy rahat">Cozy / rahat</option>
                  <option value="bakım self-care">Bakım / self-care</option>
                  <option value="romantik">Romantik</option>
                  <option value="kullanışlı">Kullanışlı</option>
                  <option value="premium">Şık / premium</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black">
                İlgi alanı
                <select
                  value={answers.interest}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, interest: event.target.value }))
                  }
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
                >
                  <option value="">Fark etmez</option>
                  <option value="kahve">Kahve / çay</option>
                  <option value="bakım">Bakım</option>
                  <option value="ev">Ev / dekor</option>
                  <option value="moda">Moda / aksesuar</option>
                  <option value="hobi">Kitap / hobi / teknoloji</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-black">
                Bütçe
                <select
                  value={answers.budget}
                  onChange={(event) =>
                    setAnswers((current) => ({ ...current, budget: event.target.value }))
                  }
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
                >
                  <option value="">Fark etmez</option>
                  <option value="500">500 TL civarı</option>
                  <option value="1000">1000 TL civarı</option>
                  <option value="2500">2500 TL civarı</option>
                  <option value="premium">Premium</option>
                </select>
              </label>
            </div>

            {loadError && (
              <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-600">
                {loadError}
              </p>
            )}

            <div className="mt-6 grid gap-3">
              <Link
                href="/hediye-paketi"
                className="rounded-full bg-pink-600 px-5 py-4 text-center text-sm font-black text-white"
              >
                Hediye Paketi Oluştur
              </Link>

              <Link
                href="/son-dakika-hediye"
                className="rounded-full bg-[#2b1b1b] px-5 py-4 text-center text-sm font-black text-white"
              >
                Son Dakika Hediye
              </Link>
            </div>
          </aside>

          <section>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
                  Öneriler
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  En uygun hediyeler
                </h2>
              </div>

              {loading && (
                <p className="rounded-full bg-white px-4 py-2 text-xs font-black text-pink-700">
                  Yükleniyor...
                </p>
              )}
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
                        {score >= 90 ? "Çok güçlü eşleşme" : "Güçlü eşleşme"}
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

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <Link
                        href={`/deneyim?gift=${encodeURIComponent(title)}`}
                        className="flex items-center justify-center rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
                      >
                        Bu Hediye İçin Özel Not Oluştur
                      </Link>

                      <Link
                        href={`/hediye-karsilastir?gift=${encodeURIComponent(title)}`}
                        className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
                      >
                        Karşılaştır
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
