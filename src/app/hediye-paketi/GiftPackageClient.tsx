"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PackageItem = {
  name: string;
  role: string;
  price: string;
};

type GiftPackage = {
  title: string;
  description: string;
  items: PackageItem[];
  presentation: string;
  note: string;
};

function getBudgetText(budget: string) {
  if (budget === "low") return "500–1000 TL";
  if (budget === "mid") return "1000–2500 TL";
  if (budget === "high") return "2500 TL+";
  return "Esnek";
}

function buildPackage({
  person,
  relation,
  style,
  budget,
}: {
  person: string;
  relation: string;
  style: string;
  budget: string;
}): GiftPackage {
  const to = person.trim() || "Sevdiğin kişi";
  const rel = relation.trim() || "yakın biri";
  const budgetText = getBudgetText(budget);

  if (style === "cozy") {
    return {
      title: "Cozy Gece Paketi",
      description: `${to} için rahat, sıcak ve evde keyif hissi veren bir paket.`,
      items: [
        { name: "Pijama takımı", role: "Ana hediye", price: budget === "low" ? "500–800 TL" : "800–1800 TL" },
        { name: "Uyku maskesi", role: "Tamamlayıcı", price: "150–500 TL" },
        { name: "Mum", role: "Atmosfer", price: "200–700 TL" },
        { name: "QR özel not", role: "Duygusal detay", price: "Ücretsiz / dijital" },
      ],
      presentation:
        "Yumuşak tonlarda bir kutu kullan. Pijamayı alta yerleştir, mum ve uyku maskesini üstte göster. QR not kartını en üste koy.",
      note: `${to}, bu paket biraz dinlen, biraz gülümse ve kendine vakit ayır diye hazırlandı.`,
    };
  }

  if (style === "selfcare") {
    return {
      title: "Bakım / Self-care Paketi",
      description: `${to} için kendine bakım ve küçük lüks hissi veren bir paket.`,
      items: [
        { name: "Body mist", role: "Ana his", price: "300–1200 TL" },
        { name: "El kremi seti", role: "Kullanışlı detay", price: "200–700 TL" },
        { name: "Dudak balmı", role: "Mini ek", price: "150–500 TL" },
        { name: "Mini çikolata", role: "Tatlı dokunuş", price: "100–400 TL" },
      ],
      presentation:
        "Ürünleri küçük kraft kutuya koy. İçine ince kağıt ser, bakım ürünlerini dik yerleştir. Yanına kısa bir hediye notu ekle.",
      note: `${to}, bu küçük paket kendine biraz daha güzel davranman için.`,
    };
  }

  if (style === "coffee") {
    return {
      title: "Kahve Keyfi Paketi",
      description: `${rel} için günlük hayatta kullanılabilecek sıcak ve samimi bir paket.`,
      items: [
        { name: "Kupa", role: "Ana hediye", price: "200–800 TL" },
        { name: "Filtre kahve / kahve çekirdeği", role: "Tamamlayıcı", price: "250–900 TL" },
        { name: "Çikolata", role: "Tatlı eşlikçi", price: "100–500 TL" },
        { name: "QR not kartı", role: "Kişisel detay", price: "Ücretsiz / dijital" },
      ],
      presentation:
        "Kupayı kutunun merkezine koy. Kahve ve çikolatayı yanına yerleştir. QR kartı kupanın içine veya kutunun kapağına ekle.",
      note: `${to}, her kahve molanda küçük bir gülümseme olsun diye.`,
    };
  }

  if (style === "romantic") {
    return {
      title: "Romantik Hatıra Paketi",
      description: `${to} için daha duygusal ve özel hissettiren bir paket.`,
      items: [
        { name: "Kolye / bileklik", role: "Ana hediye", price: budget === "high" ? "1500–5000 TL" : "500–2000 TL" },
        { name: "Çiçek", role: "Duygusal tamamlayıcı", price: "300–1500 TL" },
        { name: "Gizli QR mesaj", role: "Sürpriz", price: "Ücretsiz / dijital" },
        { name: "Küçük kutu", role: "Sunum", price: "100–500 TL" },
      ],
      presentation:
        "Takıyı küçük kutuda ver. QR gizli mesajı kutunun içine sakla. Çiçeği yanında ayrı bir jest olarak ver.",
      note: `${to}, bu hediye sadece bir eşya değil; seni düşündüğüm bir anın küçük hatırası.`,
    };
  }

  return {
    title: "Tatlı Küçük Hediye Paketi",
    description: `${to} için risksiz, sevimli ve kolay hazırlanabilir bir paket. Bütçe: ${budgetText}.`,
    items: [
      { name: "Kupa", role: "Ana hediye", price: "200–800 TL" },
      { name: "Çorap seti", role: "Sevimli ek", price: "200–700 TL" },
      { name: "Çikolata", role: "Tatlı detay", price: "100–500 TL" },
      { name: "Hediye notu", role: "Kişisel dokunuş", price: "Ücretsiz / dijital" },
    ],
    presentation:
      "Küçük bir kutu veya hediye poşeti kullan. Ürünleri renk uyumuna göre yerleştir. Notu görünür şekilde en üste koy.",
    note: `${to}, bu küçük paket sadece bugün yüzünü güldürsün diye.`,
  };
}

export default function GiftPackageClient() {
  const [person, setPerson] = useState("");
  const [relation, setRelation] = useState("");
  const [style, setStyle] = useState("cozy");
  const [budget, setBudget] = useState("mid");

  const result = useMemo(
    () => buildPackage({ person, relation, style, budget }),
    [person, relation, style, budget]
  );

  async function copyPackage() {
    const text = `${result.title}

${result.description}

Paket İçeriği:
${result.items.map((item) => `- ${item.name} (${item.role}) · ${item.price}`).join("\n")}

Sunum:
${result.presentation}

Not:
${result.note}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Paket kopyalandı.");
    } catch {
      alert("Kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Paketi Oluşturucu
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Tek hediye yerine hazır bir hediye paketi oluştur
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Ana hediye, yan ürün, not ve sunum önerisini birlikte hazırla.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/hediye-bul" className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white">
              Hediye Bul
            </Link>
            <Link href="/deneyim" className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white">
              QR Not Oluştur
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Paket bilgileri</h2>

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
                placeholder="Yakınlık? Örn: sevgilim, annem, arkadaşım"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              />

              <select
                value={style}
                onChange={(event) => setStyle(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              >
                <option value="cozy">Cozy / ev giyim paketi</option>
                <option value="selfcare">Bakım / self-care paketi</option>
                <option value="coffee">Kahve / çay paketi</option>
                <option value="romantic">Romantik paket</option>
                <option value="simple">Küçük ama tatlı paket</option>
              </select>

              <select
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
              >
                <option value="low">500–1000 TL</option>
                <option value="mid">1000–2500 TL</option>
                <option value="high">2500 TL+</option>
                <option value="flex">Esnek</option>
              </select>
            </div>
          </div>

          <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Önerilen Paket
            </p>

            <h2 className="mt-3 text-3xl font-black">{result.title}</h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {result.description}
            </p>

            <div className="mt-5 grid gap-3">
              {result.items.map((item) => (
                <div key={item.name} className="rounded-2xl bg-[#fff4ef] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-black">{item.name}</p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                      {item.role}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#6b4a4a]">{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#fff4ef] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Nasıl sunulur?
              </p>
              <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
                {result.presentation}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-[#fff4ef] p-5">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Pakete eklenecek not
              </p>
              <p className="mt-2 text-sm font-black leading-7 text-[#2b1b1b]">
                {result.note}
              </p>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <button
                onClick={copyPackage}
                className="rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
              >
                Paketi Kopyala
              </button>

              <Link
                href={`/deneyim?gift=${encodeURIComponent(result.title)}`}
                className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
              >
                Bu Paket İçin Not Oluştur
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
