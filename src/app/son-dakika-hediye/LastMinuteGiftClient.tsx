"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function getSuggestions(urgency: string, person: string) {
  const to = person.trim() || "bu kişi";

  if (urgency === "today") {
    return {
      title: "Bugün Alınabilecek Hediyeler",
      description: `${to} için hemen hazırlanabilecek risksiz seçenekler.`,
      items: [
        "Çiçek",
        "Çikolata",
        "Body mist",
        "Kupa",
        "Kahve paketi",
        "Dijital QR not",
        "Mini bakım seti",
      ],
      tip: "Bugün alınacak hediyede en önemli şey sunumdur. Basit hediyeyi bile güzel bir notla güçlendir.",
    };
  }

  if (urgency === "tomorrow") {
    return {
      title: "Yarın İçin Hediye Planı",
      description: `${to} için bir gün içinde hazırlanabilecek daha dolu seçenekler.`,
      items: [
        "Pijama takımı",
        "El kremi + body mist seti",
        "Kupa + kahve + çikolata paketi",
        "Kolye / bileklik",
        "Mum + oda kokusu",
        "Kitap + not kartı",
      ],
      tip: "Yarın için küçük bir hediye kutusu hazırlamak mümkün. Ana hediyenin yanına mutlaka küçük bir tamamlayıcı ekle.",
    };
  }

  return {
    title: "3 Gün İçinde Hazırlanabilecek Hediyeler",
    description: `${to} için daha düşünülmüş ve paketlenmiş seçenekler.`,
    items: [
      "Cozy gece paketi",
      "Bakım / self-care paketi",
      "Kahve keyfi paketi",
      "Parfüm discovery set",
      "Takı + QR gizli mesaj",
      "Dekoratif mum + oda kokusu",
      "Hobi seti",
    ],
    tip: "3 gün varsa tek ürün yerine paket hazırlamak daha etkileyici olur.",
  };
}

export default function LastMinuteGiftClient() {
  const [person, setPerson] = useState("");
  const [relation, setRelation] = useState("");
  const [urgency, setUrgency] = useState("today");

  const result = useMemo(() => getSuggestions(urgency, person), [urgency, person]);

  async function copyResult() {
    const text = `${result.title}

${result.description}

Öneriler:
${result.items.map((item) => `- ${item}`).join("\n")}

İpucu:
${result.tip}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Öneriler kopyalandı.");
    } catch {
      alert("Kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-4xl pb-10 pt-6 md:pb-14 md:pt-10">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700"><span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
            Son Dakika Hediye Kurtarıcı
          </p>

          <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
            Az zaman kaldıysa <em>paniğe gerek yok.</em>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b4a4a]">
            Bugün, yarın veya 3 gün içinde alınabilecek hızlı ve risksiz hediye fikirleri.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6">
            <h2 className="text-2xl font-black">Durumu seç</h2>

            <div className="mt-5 grid gap-4">
              <input
                value={person}
                onChange={(event) => setPerson(event.target.value)}
                placeholder="Kime? Örn: Ayşe"
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />

              <input
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
                placeholder="Yakınlık? Örn: arkadaşım, sevgilim, annem"
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />

              <select
                value={urgency}
                onChange={(event) => setUrgency(event.target.value)}
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              >
                <option value="today">Bugün lazım</option>
                <option value="tomorrow">Yarın lazım</option>
                <option value="three-days">3 gün içinde lazım</option>
              </select>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
              Kurtarıcı Liste
            </p>

            <h2 className="mt-3 text-3xl font-black">{result.title}</h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {result.description}
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {result.items.map((item) => (
                <Link
                  key={item}
                  href={`/hediye-bul?quick=${encodeURIComponent(item)}`}
                  className="rounded-2xl bg-[#fff4ef] p-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-100"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff4ef] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                İpucu
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
                {result.tip}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                onClick={copyResult}
                className="rounded-full bg-pink-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
              >
                Listeyi Kopyala
              </button>

              <Link
                href="/hediye-paketi"
                className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-bold text-white transition hover:bg-black"
              >
                Paket Oluştur
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
