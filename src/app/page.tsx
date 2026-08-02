import Link from "next/link";

export const metadata = {
  title: "NeAlsam Hediye | Kişiye Özel Hediye Önerileri",
  description:
    "Kime hediye alacağını bilmiyorsan NeAlsam ile 30 saniyede bütçene, kişiye ve özel güne göre hediye önerisi bul.",
};

const steps = [
  {
    title: "Kime alacağını seç",
    text: "Sevgili, anne, baba, arkadaş, kardeş veya iş arkadaşı gibi kişiye göre başla.",
  },
  {
    title: "Bütçeni ve özel günü gir",
    text: "Doğum günü, yıl dönümü, mezuniyet veya içimden geldi gibi durumlara göre öneri al.",
  },
  {
    title: "Daha risksiz öneriler gör",
    text: "Beden, zevk veya cilt uyumu gibi risklerden kaçınan daha mantıklı fikirler seç.",
  },
];

const examples = [
  {
    title: "Makyaj organizeri",
    tag: "En güvenli seçim",
    text: "Makyaj seven biri için renk veya cilt uyumu riski olmadan kullanılabilir bir hediye.",
  },
  {
    title: "Kahve + kitap paketi",
    tag: "Duygusal seçim",
    text: "Kahve ve kitap seven biri için sıcak, uygun bütçeli ve düşünülmüş bir öneri.",
  },
  {
    title: "Konser bileti",
    tag: "Deneyim hediyesi",
    text: "Eşya yerine birlikte hatırlanacak bir anı bırakmak isteyenler için güçlü bir seçenek.",
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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-700">
            Ne alsam diye düşünme
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-[#2b1b1b] md:text-6xl">
            30 saniyede kişiye özel hediye önerisi bul
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b4a4a]">
            NeAlsam; kime hediye alacağını, bütçeni, özel günü ve ilgi
            alanlarını analiz ederek daha anlamlı, daha risksiz ve daha
            alınabilir hediye fikirleri önerir.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-bold text-white transition hover:opacity-90"
            >
              Hediye Bul
            </Link>

            <Link
              href="/paketler"
              className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-bold text-pink-700 transition hover:bg-pink-50"
            >
              Paketleri İncele
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-semibold text-[#6b4a4a]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-xl shadow-pink-100/50">
          <div className="rounded-[1.5rem] bg-[#fff0f7] p-5">
            <p className="text-sm font-bold text-pink-700">Örnek sonuç</p>
            <h2 className="mt-2 text-2xl font-black text-[#2b1b1b]">
              Cilt bakım organizeri
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
              Cilt bakım ürünlerini seven biri için ürün seçme riski olmadan
              düzen sağlayan, güvenli ve kullanışlı bir hediye.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-700">
                En güvenli seçim
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-700">
                Zevk riski düşük
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pink-700">
                300-1200 TL
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-pink-500">
                Neden önerildi?
              </p>
              <p className="mt-2 text-sm text-[#6b4a4a]">
                Seçilen kişiye, bütçeye ve düşük risk tercihine uyduğu için.
              </p>
            </div>

            <div className="rounded-2xl border border-pink-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-pink-500">
                Mağaza önerisi
              </p>
              <p className="mt-2 text-sm text-[#6b4a4a]">
                Organizer ürünleri için Trendyol, Hepsiburada ve Amazon daha
                uygun mağaza seçenekleri olabilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-sm font-black text-white">
                {index + 1}
              </span>
              <h2 className="mt-5 text-xl font-black text-[#2b1b1b]">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-pink-600">
              Örnek hediye fikirleri
            </p>
            <h2 className="mt-2 text-3xl font-black text-[#2b1b1b]">
              Sadece ürün değil, mantıklı öneri
            </h2>
          </div>

          <Link
            href="/hediye-bul"
            className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
          >
            Kendi önerini al
          </Link>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {examples.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
            >
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-pink-700">
                {item.tag}
              </span>
              <h3 className="mt-4 text-xl font-black text-[#2b1b1b]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="rounded-[2rem] bg-[#2b1b1b] p-8 text-white md:p-10">
          <p className="text-sm font-bold text-pink-200">
            Hemen deneyebilirsin
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black md:text-4xl">
            Kime ne hediye alacağını bilmiyorsan testi başlat.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
            Ücretsiz öneri alabilir, istersen premium deneyimlerle hediye notu,
            QR sürpriz mesaj ve daha özel fikirleri kullanabilirsin.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-50"
          >
            Hediye Bul’a Başla
          </Link>
        </div>
      </section>
    </main>
  );
}
