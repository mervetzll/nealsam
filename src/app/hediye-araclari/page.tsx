import Link from "next/link";
import { BookOpen, CalendarHeart, Crown, Package, PenLine, QrCode, Scale, Target, Zap } from "lucide-react";

export const metadata = {
  title: "Hediye Araçları | NeAlsam Hediye",
  description:
    "Hediye bulma testi, hediye paketi oluşturucu, son dakika hediye fikirleri, hediye takvimi ve QR not araçları.",
};

const mainTools = [
  {
    title: "Hediye Bul",
    description:
      "Mini testi çöz; kime, bütçeye, tarza ve ilgi alanına göre en uygun hediyeleri gör.",
    href: "/hediye-bul",
    icon: Target,
    badge: "En popüler",
    cta: "Teste Başla",
  },
  {
    title: "Hediye Paketi Oluştur",
    description:
      "Ana hediye, yan ürün, sunum fikri ve nottan oluşan hazır hediye paketi oluştur.",
    href: "/hediye-paketi",
    icon: Package,
    badge: "Yeni",
    cta: "Paket Oluştur",
  },
  {
    title: "QR Not / Deneyim",
    description:
      "Hediyeye özel mesaj, gizli not, mini quiz, sürpriz kutusu veya zaman kilidi ekle.",
    href: "/deneyim",
    icon: QrCode,
    badge: "Premium",
    cta: "Deneyim Oluştur",
  },
];

const otherTools = [
  {
    title: "Son Dakika Hediye",
    description:
      "Bugün, yarın veya 3 gün içinde alınabilecek hızlı ve risksiz hediye fikirleri.",
    href: "/son-dakika-hediye",
    icon: Zap,
  },
  {
    title: "Hediye Takvimi",
    description:
      "Doğum günü, yıl dönümü ve özel günleri kaydet; hediye almayı unutma.",
    href: "/hediye-takvimi",
    icon: CalendarHeart,
  },
  {
    title: "Hediye Karşılaştır",
    description:
      "İki hediye arasında kaldıysan hangisinin daha mantıklı olduğunu karşılaştır.",
    href: "/hediye-karsilastir",
    icon: Scale,
  },
  {
    title: "Hediye Notu",
    description:
      "Hediyenin yanına yazabileceğin kısa, samimi veya romantik not fikirleri üret.",
    href: "/hediye-notu",
    icon: PenLine,
  },
  {
    title: "Rehber / Blog",
    description:
      "Sevgiliye, anneye, arkadaşa veya bütçeye göre hediye rehberlerini oku.",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "Paketler",
    description:
      "Premium özellikleri ve hediye deneyimi paketlerini incele.",
    href: "/paketler",
    icon: Crown,
  },
];

const useCases = [
  "Ne alacağımı hiç bilmiyorum",
  "Bugün hediye almam lazım",
  "Tek ürün değil, paket yapmak istiyorum",
  "Hediyenin yanına özel not yazmak istiyorum",
  "İki hediye arasında kaldım",
  "Doğum günlerini unutmamak istiyorum",
];

export default function GiftToolsPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-4xl pb-10 pt-6 md:pb-14 md:pt-10">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700"><span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
            Hediye Araçları
          </p>

          <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
            Hediye seçimini kolaylaştıran <em>tüm araçlar.</em>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b4a4a]">
            Ne alacağını bilmiyorsan test çöz, paket oluştur, son dakika fikirleri bul,
            hediyene QR not ekle veya özel günleri takvime kaydet.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {useCases.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#6b4a4a] ring-1 ring-pink-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {mainTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 ring-1 ring-pink-100">
                  <tool.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>

                <span className="rounded-full bg-[#fff4ef] px-3 py-2 text-xs font-black text-pink-700">
                  {tool.badge}
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight">
                {tool.title}
              </h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                {tool.description}
              </p>

              <p className="mt-6 text-sm font-black text-pink-700 group-hover:text-pink-800">
                {tool.cta} →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                Diğer Araçlar
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
                Duruma göre hızlı seçim yap
              </h2>
            </div>

            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#1f1212] px-6 py-4 text-center text-sm font-black text-white"
            >
              Hediye Bulmaya Başla
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {otherTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-[1.5rem] bg-[#fff4ef] p-5 transition hover:-translate-y-1 hover:bg-pink-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-pink-600 ring-1 ring-pink-100">
                  <tool.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                <h3 className="mt-4 text-xl font-black">{tool.title}</h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                  {tool.description}
                </p>

                <p className="mt-4 text-sm font-black text-pink-700">
                  Aç →
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-[#1f1212] p-7 text-white md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-300">
              Önerilen Akış
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              En iyi sonuç için böyle ilerle
            </h2>

            <div className="mt-8 grid gap-4">
              {[
                "Önce Hediye Bul testini çöz.",
                "Beğendiğin hediyeyi pakete çevir.",
                "Pakete özel QR not veya gizli mesaj ekle.",
                "Özel günü Hediye Takvimi’ne kaydet.",
              ].map((step, index) => (
                <div key={step} className="flex gap-4 rounded-2xl bg-white/10 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-black">
                    {index + 1}
                  </div>

                  <p className="text-sm font-bold leading-7 text-white/85">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
              Hızlı Başlangıç
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Nereden başlayacağını bilmiyorsan
            </h2>

            <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
              En güvenli yol Hediye Bul testiyle başlamak. Sonuçtan sonra hediyeyi
              pakete çevirebilir, yanına not ekleyebilir veya mağaza linklerinden ürünü arayabilirsin.
            </p>

            <div className="mt-7 grid gap-3 md:grid-cols-2">
              <Link
                href="/hediye-bul"
                className="rounded-full bg-pink-600 px-6 py-4 text-center text-sm font-black text-white"
              >
                Teste Başla
              </Link>

              <Link
                href="/son-dakika-hediye"
                className="rounded-full bg-[#1f1212] px-6 py-4 text-center text-sm font-black text-white"
              >
                Son Dakika Hediye Bul
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
