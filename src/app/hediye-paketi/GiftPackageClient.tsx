"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Package as PackageIcon, PenLine, QrCode, Sparkles } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ui } from "@/components/ui/styles";

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

function initialStyle(gift: string) {
  const text = gift.toLocaleLowerCase("tr-TR");
  if (/kahve|kupa|çay|termos|french press/.test(text)) return "coffee";
  if (/pijama|sabahlık|terlik|battaniye|uyku/.test(text)) return "cozy";
  if (/bakım|krem|body mist|spa|balm/.test(text)) return "selfcare";
  if (/kolye|bileklik|takı|çiçek/.test(text)) return "romantic";
  return gift ? "simple" : "cozy";
}

const styleOptions = [
  { value: "cozy", label: "Cozy / ev giyim" },
  { value: "selfcare", label: "Bakım / self-care" },
  { value: "coffee", label: "Kahve / çay" },
  { value: "romantic", label: "Romantik" },
  { value: "simple", label: "Küçük ama tatlı" },
];

const budgetOptions = [
  { value: "low", label: "500–1000 TL" },
  { value: "mid", label: "1000–2500 TL" },
  { value: "high", label: "2500 TL+" },
  { value: "flex", label: "Esnek" },
];

function ChoiceGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-[#2b1b1b]">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${
                active
                  ? "bg-[#2b1b1b] text-white"
                  : "bg-[#fff8f5] text-[#6b4a4a] ring-1 ring-pink-100 hover:bg-white hover:ring-pink-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function GiftPackageClient({ initialGift = "", initialPrice = "" }: { initialGift?: string; initialPrice?: string }) {
  const [person, setPerson] = useState("");
  const [relation, setRelation] = useState("");
  const [style, setStyle] = useState(initialStyle(initialGift));
  const [mainGift, setMainGift] = useState(initialGift);
  const [budget, setBudget] = useState("mid");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const base = buildPackage({ person, relation, style, budget });
    if (!mainGift.trim()) return base;
    return {
      ...base,
      title: /paketi$/i.test(mainGift.trim()) ? mainGift.trim() : `${mainGift.trim()} Hediye Paketi`,
      description: `${person.trim() || "Sevdiğin kişi"} için seçtiğin hediyenin etrafında hazırlanan paket fikri.`,
      items: [
        { name: mainGift.trim(), role: "Seçtiğin ana hediye", price: mainGift.trim() === initialGift && initialPrice ? initialPrice : "Fiyatı mağazada kontrol et" },
        ...base.items.slice(1).filter(item => item.name.toLocaleLowerCase("tr-TR") !== mainGift.trim().toLocaleLowerCase("tr-TR")),
      ],
      presentation: "Seçtiğin ana hediyeyi kutunun merkezine yerleştir. Tamamlayıcıları etrafına koy; kişisel notunu en üste ekle.",
    };
  }, [person, relation, style, budget, mainGift, initialGift, initialPrice]);

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
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <PageHero
          eyebrow="Hediye paketi oluşturucu"
          title="Tek hediye yerine"
          accent="hazır bir paket."
          description="Ana hediye, yan ürün, not ve sunum önerisini birlikte hazırla. Seçimlerini değiştirdikçe paket anında güncellenir."
        >
          <Link href="/hediye-bul" className={ui.btnLink}>
            Önce hediye bul
          </Link>
        </PageHero>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className={`${ui.card} p-6 md:p-8`}>
            <h2 className="text-3xl">Paket bilgileri</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">İsim ve yakınlık isteğe bağlı; nota eklenir.</p>

            <div className="mt-7 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-bold">Ana hediye</span>
                <input
                  value={mainGift}
                  onChange={(event) => setMainGift(event.target.value)}
                  placeholder="kupa, kitap, parfüm"
                  className={ui.input}
                />
                {initialGift && (
                  <span className="text-sm leading-6 text-[#6b4a4a]">
                    Hediye sonucundan aktarıldı. Ana hediyeyi değiştirebilir, yanına ekleneceklerin tarzını aşağıdan seçebilirsin.
                  </span>
                )}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold">Kime?</span>
                <input
                  value={person}
                  onChange={(event) => setPerson(event.target.value)}
                  placeholder="Ayşe"
                  className={ui.input}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold">Yakınlığınız</span>
                <input
                  value={relation}
                  onChange={(event) => setRelation(event.target.value)}
                  placeholder="sevgilim, annem, arkadaşım"
                  className={ui.input}
                />
              </label>

              <ChoiceGroup label="Tamamlayıcıların tarzı" options={styleOptions} value={style} onChange={setStyle} />
              <ChoiceGroup label="Bütçe" options={budgetOptions} value={budget} onChange={setBudget} />
            </div>
          </div>

          <div className={`${ui.card} overflow-hidden shadow-xl shadow-pink-900/5 lg:sticky lg:top-28`}>
            <div className="bg-gradient-to-br from-pink-100 via-[#ffe9e0] to-[#fff4ef] px-6 pb-7 pt-6 md:px-8">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-700">
                <PackageIcon className="h-4 w-4" />
                Önerilen paket · {getBudgetText(budget)}
              </p>
              <h2 key={result.title} className="fade-in-up mt-4 text-4xl">
                {result.title}
              </h2>
              <p className="mt-3 leading-7 text-[#6b4a4a]">{result.description}</p>
            </div>

            <div className="px-6 py-6 md:px-8">
              <ol className="divide-y divide-pink-100">
                {result.items.map((item, i) => (
                  <li key={item.name} className="flex items-center gap-4 py-4">
                    <span className="font-display text-2xl italic text-pink-300">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="mt-0.5 text-sm text-[#8a6a6a]">{item.price}</p>
                    </div>
                    <span className={ui.tagAccent}>{item.role}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className={`${ui.inset} p-5`}>
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    Nasıl sunulur?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">{result.presentation}</p>
                </div>
                <div className={`${ui.inset} p-5`}>
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
                    <PenLine className="h-3.5 w-3.5" />
                    Pakete eklenecek not
                  </p>
                  <p className="mt-2 font-display text-lg italic leading-7 text-[#2b1b1b]">“{result.note}”</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={copyPackage} className={`${ui.btnPrimary} flex-1`}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Kopyalandı" : "Paketi kopyala"}
                </button>
                <Link href={`/deneyim?gift=${encodeURIComponent(result.title)}`} className={`${ui.btnDark} flex-1`}>
                  <QrCode className="h-4 w-4" />
                  Bu paket için QR not
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
