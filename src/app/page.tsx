import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Gift,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Wallet,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import WordRise from "@/components/motion/WordRise";
import ScrollProgressLine from "@/components/motion/ScrollProgressLine";
import Marquee from "@/components/motion/Marquee";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

const marqueeItems = [
  "Sevgiliye",
  "Anneye",
  "Babaya",
  "Arkadaşa",
  "Kardeşe",
  "Doğum günü",
  "Yıl dönümü",
  "Sevgililer Günü",
  "Anneler Günü",
  "Yeni yıl",
  "Son dakika hediyesi",
];

const trust = [
  { icon: ShieldCheck, label: "Ücretsiz öneri" },
  { icon: Wallet, label: "Her bütçeye uygun" },
  { icon: Store, label: "Mağaza linkleriyle" },
];

const mainActions = [
  {
    title: "Hediye bul",
    description: "Birkaç soruya cevap ver, kişiye ve bütçeye göre en uygun hediyeleri gör.",
    href: "/hediye-bul",
    icon: Target,
    cta: "Teste başla",
  },
  {
    title: "Hediye paketi oluştur",
    description: "Tek hediye yerine ana hediye, yan ürün, not ve sunumdan oluşan bir paket hazırla.",
    href: "/hediye-paketi",
    icon: Package,
    cta: "Paket oluştur",
  },
  {
    title: "QR not ve deneyim",
    description: "Hediyenin içine özel mesaj, mini quiz, sürpriz kutusu veya zaman kilidi ekle.",
    href: "/deneyim",
    icon: QrCode,
    cta: "Deneyim oluştur",
  },
];

const steps = [
  {
    number: "01",
    title: "Kime aldığını seç",
    text: "Sevgili, anne, arkadaş, kardeş ya da baba; her biri için ayrı öneriler.",
  },
  {
    number: "02",
    title: "Tarzı ve bütçeyi belirle",
    text: "Cozy, romantik, bakım, kullanışlı veya premium; bütçene göre sıralanmış.",
  },
  {
    number: "03",
    title: "Hediyeyi özel hale getir",
    text: "QR not, hediye paketi, mağaza linkleri ve sunum fikriyle tamamla.",
  },
];

export default function HomePage() {
  return (
    <main data-no-reveal className="min-h-screen overflow-x-clip bg-[#fff4ef] text-[#2b1b1b]">
      {/* ───────── Hero ───────── */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-16">
        <div>
          <p style={delay(0)} className="fade-in-up inline-flex items-center gap-2 text-sm font-bold text-pink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
            Kişiye özel hediye rehberi
          </p>

          <h1 className="mt-6 max-w-3xl text-[3.25rem] sm:text-6xl lg:text-[5.25rem]">
            <WordRise text="Doğru hediye," accent="30 saniyede." startDelay={120} stagger={90} />
          </h1>

          <p style={delay(600)} className="fade-in-up mt-7 max-w-xl text-lg leading-8 text-[#6b4a4a]">
            Kime, hangi bütçeyle, hangi gün için? Birkaç soruya cevap ver; daha anlamlı ve daha
            risksiz hediye fikirlerini biz bulalım.
          </p>

          <div style={delay(750)} className="fade-in-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/hediye-bul"
              className="group inline-flex items-center gap-2 rounded-full bg-pink-600 px-7 py-4 text-[15px] font-bold text-white shadow-lg shadow-pink-600/25 transition hover:bg-pink-700"
            >
              Hediye bulmaya başla
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#nasil-calisir"
              className="text-[15px] font-bold text-[#2b1b1b] underline decoration-pink-300 decoration-2 underline-offset-[6px] transition hover:decoration-pink-600"
            >
              Nasıl çalışır?
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trust.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                style={delay(900 + i * 90)}
                className="fade-in-up flex items-center gap-2 text-sm text-[#6b4a4a]"
              >
                <Icon className="h-4 w-4 text-pink-600" strokeWidth={2} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Sample result card */}
        <div style={delay(400)} className="fade-in-up relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="float-soft relative rounded-[2rem] bg-white p-3 shadow-2xl shadow-pink-900/10 ring-1 ring-pink-100">
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-pink-100 via-[#ffe9e0] to-[#fff4ef]">
              <div aria-hidden="true" className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-200/60 blur-2xl" />
              <div aria-hidden="true" className="absolute -bottom-12 right-0 h-44 w-44 rounded-full bg-rose-200/50 blur-2xl" />
              <Gift className="relative h-20 w-20 text-pink-600" strokeWidth={1.25} />
              <span
                style={delay(1200)}
                className="pop-in absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-pink-700 shadow-sm backdrop-blur"
              >
                <Sparkles className="h-3.5 w-3.5" />
                En güvenli seçim
              </span>
            </div>

            <div className="px-4 pb-4 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-pink-600">Örnek sonuç</p>
              <h2 className="mt-2 text-3xl">Cilt bakım organizeri</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                Ürün seçme riski olmadan düzen sağlayan, güvenli ve kullanışlı bir hediye.
              </p>

              <dl className="mt-5 grid grid-cols-3 divide-x divide-pink-100 rounded-2xl bg-[#fff8f5] py-3 text-center">
                {[
                  ["Bütçe", "300–1200 ₺"],
                  ["Zevk riski", "Düşük"],
                  ["Uygunluk", "%94"],
                ].map(([k, v], i) => (
                  <div key={k} style={delay(1350 + i * 120)} className="pop-in px-2">
                    <dt className="text-[11px] text-[#8a6a6a]">{k}</dt>
                    <dd className="mt-0.5 text-sm font-bold text-[#2b1b1b]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div
            style={delay(1700)}
            className="fade-in-up absolute -bottom-6 -left-4 hidden max-w-[15rem] rounded-2xl bg-[#2b1b1b] p-4 text-white shadow-xl sm:block lg:-left-10"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pink-300">Neden önerildi?</p>
            <p className="mt-1.5 text-sm leading-6 text-white/85">
              Kişiye, bütçeye ve düşük risk tercihine uyduğu için.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Marquee ───────── */}
      <section className="overflow-hidden py-8 lg:py-12">
        <div className="-mx-4 -rotate-2 bg-[#2b1b1b] py-5 font-display text-2xl italic text-white md:text-4xl">
          <Marquee items={marqueeItems} />
        </div>
      </section>

      {/* ───────── Main actions ───────── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <Reveal variant="blur">
            <h2 className="max-w-2xl text-4xl md:text-6xl">
              Ne yapmak <em>istersin?</em>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="max-w-sm text-[#6b4a4a]">
              Hediyeyi bulmaktan sunmaya kadar her adım için bir araç var.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {mainActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Reveal key={action.href} delay={i * 140} className="h-full">
                <Link
                  href={action.href}
                  className="group flex h-full flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-900/5 hover:ring-pink-200"
                >
                  <div className="flex items-start justify-between">
                    <span className="bounce-on-reveal flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600 ring-1 ring-pink-100">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-[#c9a9a9] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-600" />
                  </div>

                  <h3 className="mt-8 font-display text-[1.75rem] font-normal leading-tight">{action.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-[#6b4a4a]">{action.description}</p>
                  <p className="mt-6 text-sm font-bold text-pink-700">{action.cta}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section id="nasil-calisir" className="scroll-mt-24 border-y border-pink-100 bg-white/60 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <Reveal variant="left">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-600">Nasıl çalışır?</p>
              <h2 className="mt-4 text-4xl md:text-6xl">
                Üç adımda <em>doğru hediye</em>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="max-w-lg text-lg leading-8 text-[#6b4a4a] lg:justify-self-end">
                Uzun listelerde kaybolma. Sana sadece kişiye uyan, bütçene oturan seçenekleri
                gösterelim.
              </p>
            </Reveal>
          </div>

          <div className="mt-14">
            <ScrollProgressLine className="relative h-px w-full" />
            <div className="grid gap-10 pt-10 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => (
                <Reveal key={step.number} delay={i * 180}>
                  <span className="step-dot inline-flex h-11 w-11 items-center justify-center rounded-full bg-pink-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 max-w-xs leading-7 text-[#6b4a4a]">{step.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Closing CTA ───────── */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <Reveal variant="scale">
          <div className="dark-surface relative isolate overflow-hidden rounded-[2.5rem] bg-[#2b1b1b] px-8 py-16 text-white md:px-16 md:py-20">
            <div
              aria-hidden="true"
              className="glow-spin pointer-events-none absolute -right-1/4 -top-1/2 -z-10 h-[38rem] w-[38rem] rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "conic-gradient(from 0deg, #db2777, transparent 40%, #f472b6, transparent 80%, #db2777)",
              }}
            />
            <Reveal variant="blur" delay={150}>
              <h2 className="max-w-3xl text-4xl md:text-6xl">
                Hediyeyi sadece seçme, <em>özel bir ana</em> dönüştür.
              </h2>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Hediye fikrini bulduktan sonra QR özel not, gizli mesaj, sürpriz kutusu veya hediye
                paketiyle daha kişisel bir deneyim oluştur.
              </p>
            </Reveal>

            <Reveal delay={450}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/hediye-bul"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-[#2b1b1b] transition hover:bg-pink-50"
                >
                  Hediye bul
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/deneyim"
                  className="text-[15px] font-bold text-white underline decoration-pink-400 decoration-2 underline-offset-[6px] transition hover:decoration-white"
                >
                  Deneyim oluştur
                </Link>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
