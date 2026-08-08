import Link from "next/link";

export const metadata = {
  title: "Paketler | NeAlsam Hediye",
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

export default function PackagesPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-wide text-pink-600">
            NeAlsam Paketleri
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-4xl md:text-6xl">
            Hediyeyi daha özel hale getiren paketler
          </h1>

          <p className="mt-5 text-sm leading-7 text-[#6b4a4a] md:text-base">
            Ücretsiz hediye önerileriyle başlayabilir, istersen QR not, özel
            mektup ve premium deneyim özellikleriyle hediyeni daha kişisel hale
            getirebilirsin.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-[1.5rem] md:rounded-[2rem] border border-amber-200 bg-amber-50 p-5 text-center shadow-sm">
          <p className="text-sm font-black text-amber-800">
            Ödeme sistemi şu an hazırlık modunda
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            Bu sayfada paket akışı test ediliyor. Gerçek ödeme sağlayıcı
            bağlanana kadar kart bilgisi alınmaz ve ödeme işlemi tamamlanmaz.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {packages.map((item) => (
            <article
              key={item.id}
              className={`relative rounded-[1.5rem] md:rounded-[2rem] border bg-white p-6 shadow-sm ${
                item.popular
                  ? "border-pink-300 ring-4 ring-pink-100"
                  : "border-pink-100"
              }`}
            >
              {item.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white shadow-sm">
                  En Popüler
                </div>
              )}

              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                {item.tag}
              </p>

              <h2 className="mt-3 text-2xl font-black text-[#2b1b1b]">
                {item.name}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                {item.description}
              </p>

              <div className="mt-5 rounded-2xl bg-[#fff0f7] p-4">
                <p className="text-sm font-bold text-[#6b4a4a]">Paket Fiyatı</p>
                <p className="mt-1 text-4xl font-black text-[#2b1b1b]">
                  {item.price}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-black text-[#2b1b1b]">
                  Pakete dahil:
                </p>

                <ul className="mt-3 space-y-2">
                  {item.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-sm font-semibold leading-6 text-[#6b4a4a]"
                    >
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {item.locked.length > 0 && (
                <div className="mt-5 rounded-2xl border border-pink-100 bg-[#fff4ef] p-4">
                  <p className="text-sm font-black text-[#2b1b1b]">
                    Bu pakette sınırlı:
                  </p>

                  <ul className="mt-3 space-y-2">
                    {item.locked.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm font-semibold leading-6 text-[#6b4a4a]"
                      >
                        ○ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href={item.href}
                className={`mt-6 inline-flex w-full justify-center rounded-full px-5 py-4 text-sm font-black transition ${
                  item.popular
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "bg-[#2b1b1b] text-white hover:opacity-90"
                }`}
              >
                {item.cta}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-[1.5rem] md:rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black text-pink-600">
                Paket Karşılaştırması
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#2b1b1b]">
                Hangi pakette ne var?
              </h2>
            </div>

            <Link
              href="/hediye-bul"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Önce Ücretsiz Dene
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-sm font-black text-[#2b1b1b]">
                    Özellik
                  </th>
                  <th className="px-4 py-3 text-sm font-black text-[#2b1b1b]">
                    Free
                  </th>
                  <th className="px-4 py-3 text-sm font-black text-[#2b1b1b]">
                    Plus
                  </th>
                  <th className="px-4 py-3 text-sm font-black text-[#2b1b1b]">
                    Deneyim
                  </th>
                  <th className="px-4 py-3 text-sm font-black text-[#2b1b1b]">
                    Premium
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="rounded-2xl bg-[#fff4ef]">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className={`px-4 py-4 text-sm ${
                          index === 0
                            ? "font-black text-[#2b1b1b]"
                            : "font-bold text-[#6b4a4a]"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] md:rounded-[2rem] border border-pink-100 bg-[#2b1b1b] p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black text-white">
            Kararsız kaldıysan ücretsiz başla
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-pink-100">
            Önce hediye önerilerini dene. Sonra hediyeyi daha özel hale getirmek
            istersen Plus, Deneyim veya Premium pakete geçebilirsin.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-white px-6 py-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-50"
            >
              Hediye Bul
            </Link>

            <Link
              href="/deneyim"
              className="rounded-full border border-white/30 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10"
            >
              Deneyimi Gör
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
