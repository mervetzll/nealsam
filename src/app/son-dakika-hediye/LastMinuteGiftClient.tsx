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
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Son Dakika Hediye Kurtarıcı
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Az zaman kaldıysa paniğe gerek yok
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Bugün, yarın veya 3 gün içinde alınabilecek hızlı ve risksiz hediye fikirleri.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Durumu seç</h2>

            <div className="mt-5 grid gap-4">
              <input
                value={person}
                onChange={(event) => setPerson(event.target.value)}
                placeholder="Kime? Örn: Ayşe"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              />

              <input
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
                placeholder="Yakınlık? Örn: arkadaşım, sevgilim, annem"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              />

              <select
                value={urgency}
                onChange={(event) => setUrgency(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              >
                <option value="today">Bugün lazım</option>
                <option value="tomorrow">Yarın lazım</option>
                <option value="three-days">3 gün içinde lazım</option>
              </select>
            </div>
          </div>

          <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
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
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                İpucu
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
                {result.tip}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                onClick={copyResult}
                className="rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
              >
                Listeyi Kopyala
              </button>

              <Link
                href="/hediye-paketi"
                className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
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
