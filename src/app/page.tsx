import Link from "next/link";
import Image from "next/image";

const mainActions = [
  {
    title: "Hediye Bul",
    description: "Birkaç soruya cevap ver, kişiye ve bütçeye göre en uygun hediyeleri gör.",
    href: "/hediye-bul",
    emoji: "🎯",
    cta: "Teste Başla",
  },
  {
    title: "Hediye Paketi Oluştur",
    description: "Tek hediye yerine ana hediye, yan ürün, not ve sunumdan oluşan paket hazırla.",
    href: "/hediye-paketi",
    emoji: "🎁",
    cta: "Paket Oluştur",
  },
  {
    title: "QR Not / Deneyim",
    description: "Hediyenin içine özel mesaj, mini quiz, sürpriz kutusu veya zaman kilidi ekle.",
    href: "/deneyim",
    emoji: "💌",
    cta: "Deneyim Oluştur",
  },
];

const features = [
  "Kişiye göre öneri",
  "Bütçeye göre sıralama",
  "Risk seviyesi açıklaması",
  "Mağaza yönlendirmesi",
  "Hediye notu fikri",
  "Premium QR deneyimi",
];

const steps = [
  {
    number: "1",
    title: "Kime aldığını seç",
    text: "Sevgili, anne, arkadaş, kardeş veya erkek hediyeleri için farklı öneriler gör.",
  },
  {
    number: "2",
    title: "Tarz ve bütçeyi belirle",
    text: "Cozy, romantik, bakım, kullanışlı veya premium hediye seçeneklerini filtrele.",
  },
  {
    number: "3",
    title: "Hediyeyi özel hale getir",
    text: "QR not, hediye paketi, mağaza linkleri ve sunum fikriyle hediyeyi tamamla.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] text-[#2b1b1b]">
      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-12">
        <div>
          <p className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-sm font-black text-pink-700">
            Ne alsam diye düşünme
          </p>

          <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl">
            30 saniyede kişiye özel hediye önerisi bul
          </h1>

          <p className="mt-4 max-w-xl text-sm font-normal leading-7 text-[#6b4a4a] md:text-base">
            Kime hediye alacağını, bütçeni ve ilgi alanlarını seç. Sana uygun fikirleri bul, küçük bir notla kişiselleştir.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#1f1212] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-1"
            >
              Hediye Bul
            </Link>

            <Link
              href="/hediye-paketi"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-pink-700 shadow-sm transition hover:-translate-y-1"
            >
              Paket Oluştur
            </Link>

            <Link
              href="/deneyim"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-1"
            >
              QR Not Oluştur
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#6b4a4a] shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-pink-50 to-[#fff4ef] p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-pink-600">
              Örnek sonuç
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Seramik kahve kupası
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Kahve molalarını seven biri için renk ve desenle kişiselleştirebileceğin, günlük kullanıma uygun bir hediye.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-pink-700">
                En güvenli seçim
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-pink-700">
                Zevk riski düşük
              </span>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-pink-700">
                300–1200 TL
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Neden önerildi?
              </p>
              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Seçilen kişiye, bütçeye ve düşük risk tercihine uyduğu için.
              </p>
            </div>

            <div className="rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Mağaza önerisi
              </p>
              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Kupa koleksiyonları için Starbucks, Tchibo, Madame Coco, English Home ve Karaca’ya göz atabilirsin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {mainActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-3xl">
                {action.emoji === "🎁" ? <Image src="/gift-icon.svg" alt="" width={36} height={36} /> : action.emoji}
              </div>

              <h2 className="mt-5 text-2xl font-black">{action.title}</h2>

              <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                {action.description}
              </p>

              <p className="mt-5 text-sm font-black text-pink-700">
                {action.cta} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Nasıl çalışır?
          </p>

          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Hediye seçimini kolaylaştıran 3 adım
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[1.5rem] bg-[#fff4ef] p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-sm font-black text-white">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-black">{step.title}</h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[2rem] bg-[#1f1212] p-8 text-white shadow-xl md:p-12">
          <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            Hediyeyi sadece seçme, özel bir ana dönüştür.
          </h2>

          <p className="mt-5 max-w-2xl text-sm font-semibold leading-7 text-white/75 md:text-base">
            Hediye fikrini bulduktan sonra QR özel not, gizli mesaj, sürpriz kutusu veya hediye paketi ile daha kişisel bir deneyim oluşturabilirsin.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#1f1212]"
            >
              Hediye Bul
            </Link>

            <Link
              href="/deneyim"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
            >
              Deneyim Oluştur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
