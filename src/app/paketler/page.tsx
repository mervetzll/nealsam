import Link from "next/link";

export const metadata = {
  title: "Paketler | NeAlsam Hediye",
  description:
    "NeAlsam ücretsiz ve premium hediye önerisi paketlerini karşılaştır. Hediye notu, QR mesaj ve deneyim fikirleriyle daha özel hediye hazırla.",
};

const packages = [
  {
    name: "Ücretsiz",
    price: "0 TL",
    description: "Hızlıca hediye fikri bulmak isteyenler için.",
    cta: "Ücretsiz Başla",
    href: "/hediye-bul",
    highlighted: false,
    items: [
      "Temel hediye önerileri",
      "Bütçeye göre fikirler",
      "Basit mağaza yönlendirmesi",
      "Risk seviyesi etiketi",
    ],
  },
  {
    name: "Plus",
    price: "Orta paket",
    description: "Daha düşünülmüş ve açıklamalı öneriler isteyenler için.",
    cta: "Plus Deneyimi Gör",
    href: "/deneyim?plan=plus",
    highlighted: false,
    items: [
      "Daha fazla öneri alternatifi",
      "Hediye notu fikri",
      "Neden önerildi açıklaması",
      "Daha uygun mağaza yönlendirmesi",
    ],
  },
  {
    name: "Premium",
    price: "En özel paket",
    description: "Hediyeyi küçük bir sürpriz deneyimine dönüştürmek isteyenler için.",
    cta: "Premium’u İncele",
    href: "/deneyim?plan=premium",
    highlighted: true,
    items: [
      "QR kodlu sürpriz mesaj",
      "Kişiye özel hediye notu",
      "Deneyim hediyesi fikirleri",
      "İndirilebilir hediye kartı",
      "Daha romantik ve duygusal öneriler",
    ],
  },
];

const premiumBenefits = [
  {
    title: "QR sürpriz mesaj",
    text: "Hediyenin yanına açılabilir özel bir mesaj deneyimi ekleyebilirsin.",
  },
  {
    title: "Hediye notu",
    text: "Ne yazacağını bilemediğinde daha tatlı ve kişiye uygun not fikirleri alırsın.",
  },
  {
    title: "Deneyim önerileri",
    text: "Sadece ürün değil; konser, workshop, kahve planı veya anı odaklı fikirler çıkar.",
  },
];

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold text-pink-600">
            NeAlsam Paketleri
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            Hediyeyi sadece fikir olmaktan çıkar, küçük bir deneyime dönüştür
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6b4a4a]">
            Ücretsiz paketle hızlıca öneri alabilir, premium deneyimlerle hediye
            notu, QR mesaj ve daha özel öneriler hazırlayabilirsin.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.name}
              className={`rounded-[2rem] border p-6 shadow-sm ${
                item.highlighted
                  ? "border-pink-300 bg-[#2b1b1b] text-white shadow-xl shadow-pink-100"
                  : "border-pink-100 bg-white text-[#2b1b1b]"
              }`}
            >
              {item.highlighted && (
                <span className="rounded-full bg-pink-500 px-3 py-1 text-xs font-black text-white">
                  En özel seçenek
                </span>
              )}

              <h2 className="mt-4 text-2xl font-black">{item.name}</h2>
              <p
                className={`mt-2 text-sm ${
                  item.highlighted ? "text-white/70" : "text-[#6b4a4a]"
                }`}
              >
                {item.description}
              </p>

              <p className="mt-6 text-3xl font-black">{item.price}</p>

              <ul className="mt-6 space-y-3">
                {item.items.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-3 text-sm ${
                      item.highlighted ? "text-white/85" : "text-[#6b4a4a]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        item.highlighted
                          ? "bg-white text-[#2b1b1b]"
                          : "bg-pink-100 text-pink-700"
                      }`}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={item.href}
                className={`mt-7 inline-flex w-full justify-center rounded-full px-5 py-3 text-sm font-black transition ${
                  item.highlighted
                    ? "bg-white text-[#2b1b1b] hover:bg-pink-50"
                    : "bg-pink-600 text-white hover:bg-pink-700"
                }`}
              >
                {item.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-8">
          <p className="text-sm font-bold text-pink-600">
            Premium neden var?
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#2b1b1b]">
            Hediye önerisini daha kişisel hissettirmek için
          </h2>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {premiumBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[1.5rem] bg-[#fff0f7] p-5"
              >
                <h3 className="font-black text-[#2b1b1b]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
            >
              Önce Ücretsiz Dene
            </Link>

            <Link
              href="/deneyim?plan=premium"
              className="rounded-full border border-pink-200 px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Premium Deneyimi Gör
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
