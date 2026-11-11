import Link from "next/link";
import { ArrowRight, Check, Info, Minus, Sparkles } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ui } from "@/components/ui/styles";

export const metadata = {
  title: "Premium paketler",
  description:
    "NeAlsam Hediye paketlerini karşılaştırın. Ücretsiz hediye önerileri, premium QR not, özel mektup ve deneyim paketleri.",
};

const packages = [
  {
    id: "free",
    name: "Ücretsiz",
    price: "0 TL",
    tag: "Başlangıç",
    description: "Hızlıca hediye fikri bulmak isteyenler için.",
    features: [
      "Temel hediye önerileri",
      "Bütçe ve kişi seçimi",
      "Mağaza yönlendirmeleri",
      "Paylaşma seçeneği",
    ],
    locked: [
      "QR hediye notu",
      "Özel mektup",
      "Premium deneyim akışı",
      "Gelişmiş profil önerileri",
    ],
    cta: "Ücretsiz Başla",
    href: "/hediye-bul",
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: "49 TL",
    tag: "En Dengeli",
    description: "Daha kişisel ve daha özenli hediye önerileri için.",
    features: [
      "Daha güçlü eşleşme önerileri",
      "Kaydetme ve favori sistemi",
      "Profil tercihlerini kullanma",
      "Premium kilitli alanlara temel erişim",
    ],
    locked: ["Tam QR deneyimi", "Tam özel mektup akışı"],
    cta: "Plus Seç",
    href: "/odeme?plan=plus",
    popular: true,
  },
  {
    id: "experience",
    name: "Deneyim",
    price: "79 TL",
    tag: "Duygusal Hediye",
    description: "Hediyeyi sadece ürün değil, özel bir deneyim haline getirmek için.",
    features: [
      "QR kodlu hediye notu",
      "Özel mesaj sayfası",
      "Romantik / komik / duygusal not akışı",
      "Hediye deneyimi önizlemesi",
    ],
    locked: ["Premium paket içindeki tüm gelişmiş seçenekler"],
    cta: "Deneyim Seç",
    href: "/odeme?plan=experience",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "99 TL",
    tag: "Tam Paket",
    description: "NeAlsam’ın tüm premium hediye deneyimi özellikleri.",
    features: [
      "Tüm Plus özellikleri",
      "Tüm Deneyim özellikleri",
      "QR not ve özel mektup",
      "Gelişmiş hediye yönlendirmeleri",
      "Premium rozetli öneriler",
    ],
    locked: [],
    cta: "Premium Seç",
    href: "/odeme?plan=premium",
    popular: false,
  },
];

const comparisonRows = [
  ["Temel hediye önerileri", "✓", "✓", "✓", "✓"],
  ["Profil tercihleri", "Kısıtlı", "✓", "✓", "✓"],
  ["Kaydet / favori", "✓", "✓", "✓", "✓"],
  ["QR hediye notu", "—", "Kısıtlı", "✓", "✓"],
  ["Özel mektup", "—", "—", "✓", "✓"],
  ["Premium deneyim", "—", "—", "✓", "✓"],
  ["Tam erişim", "—", "—", "—", "✓"],
];

function Cell({ value }: { value: string }) {
  if (value === "✓") return <Check className="mx-auto h-5 w-5 text-pink-600" aria-label="Var" />;
  if (value === "—") return <Minus className="mx-auto h-4 w-4 text-[#d9c3c3]" aria-label="Yok" />;
  return <span className={ui.tag}>{value}</span>;
}

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl px-5 pb-24">
        <PageHero
          align="center"
          eyebrow="Premium paketler"
          title="Hediyeyi daha"
          accent="özel kılan paketler."
          description="Ücretsiz önerilerle başla; istersen QR not, özel mektup ve premium deneyimle hediyeni kişiselleştir."
        />

        <p className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="font-bold">Ödeme sistemi hazırlık modunda.</strong> Gerçek ödeme sağlayıcı
            bağlanana kadar kart bilgisi alınmaz ve ödeme tamamlanmaz.
          </span>
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {packages.map((item) => {
            const dark = item.popular;
            return (
              <article
                key={item.id}
                className={`relative flex flex-col rounded-[1.75rem] p-7 ${
                  dark
                    ? "dark-surface bg-[#2b1b1b] text-white shadow-2xl shadow-pink-900/20 lg:-my-3 lg:py-10"
                    : "bg-white ring-1 ring-pink-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-bold uppercase tracking-[0.18em] ${dark ? "text-pink-300" : "text-pink-600"}`}>
                    {item.tag}
                  </p>
                  {item.popular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-pink-600 px-3 py-1 text-xs font-bold text-white">
                      <Sparkles className="h-3 w-3" />
                      En popüler
                    </span>
                  )}
                </div>

                <h2 className="mt-5 text-3xl">{item.name}</h2>

                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl tracking-tight">{item.price.replace(" TL", "")}</span>
                  <span className={`text-sm font-bold ${dark ? "text-white/60" : "text-[#8a6a6a]"}`}>TL</span>
                </p>

                <p className={`mt-3 text-sm leading-6 ${dark ? "text-white/70" : "text-[#6b4a4a]"}`}>{item.description}</p>

                <ul className={`mt-6 space-y-3 border-t pt-6 ${dark ? "border-white/10" : "border-pink-100"}`}>
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm leading-6">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-pink-300" : "text-pink-600"}`} />
                      {feature}
                    </li>
                  ))}
                  {item.locked.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-3 text-sm leading-6 ${dark ? "text-white/40" : "text-[#b39a9a]"}`}
                    >
                      <Minus className="mt-0.5 h-4 w-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={item.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-bold transition ${
                    dark
                      ? "bg-pink-600 text-white hover:bg-pink-500"
                      : "bg-[#fff4ef] text-[#2b1b1b] ring-1 ring-pink-100 hover:bg-[#2b1b1b] hover:text-white"
                  } mt-auto`}
                >
                  {item.cta}
                </Link>
              </article>
            );
          })}
        </div>

        <section className="mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={ui.eyebrow}>Karşılaştırma</p>
              <h2 className="mt-3 text-4xl md:text-5xl">
                Hangi pakette <em>ne var?</em>
              </h2>
            </div>
            <Link href="/hediye-bul" className={ui.btnLink}>
              Önce ücretsiz dene
            </Link>
          </div>

          <div className={`${ui.card} mt-8 overflow-x-auto`}>
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-pink-100">
                  {["Özellik", "Ücretsiz", "Plus", "Deneyim", "Premium"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-6 py-5 text-sm font-bold ${i === 0 ? "" : "text-center"} ${
                        h === "Plus" ? "text-pink-600" : "text-[#2b1b1b]"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="transition hover:bg-[#fff8f5]">
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <th key={index} scope="row" className="px-6 py-4 text-sm font-bold text-[#2b1b1b]">
                          {cell}
                        </th>
                      ) : (
                        <td key={index} className="px-6 py-4 text-center text-sm">
                          <Cell value={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dark-surface mt-24 rounded-[2.5rem] bg-[#2b1b1b] px-8 py-16 text-center text-white">
          <h2 className="mx-auto max-w-2xl text-4xl md:text-5xl">
            Kararsız mısın? <em>Ücretsiz başla.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">
            Önce hediye önerilerini dene. Hediyeyi daha özel yapmak istersen istediğin zaman pakete geçebilirsin.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <Link href="/hediye-bul" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#2b1b1b] transition hover:bg-pink-50">
              Hediye bul
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/deneyim" className="text-sm font-bold text-white underline decoration-pink-400 decoration-2 underline-offset-[6px]">
              Deneyimi gör
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
