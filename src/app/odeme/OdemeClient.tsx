"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type PackageDetail = {
  name: string;
  price: number;
  description: string;
  items: string[];
};

const packageDetails: Record<string, PackageDetail> = {
  free: {
    name: "Ücretsiz",
    price: 0,
    description: "Hızlıca temel hediye önerisi almak isteyenler için.",
    items: [
      "Temel hediye önerileri",
      "Bütçeye göre fikirler",
      "Basit mağaza yönlendirmesi",
    ],
  },
  note: {
    name: "Hediye Notu",
    price: 19,
    description: "Sadece hediye notu hazırlamak isteyenler için.",
    items: [
      "Kişiye uygun not fikri",
      "Duygusal mesaj önerisi",
      "Kopyalanabilir metin",
    ],
  },
  plus: {
    name: "Plus",
    price: 49,
    description: "Daha detaylı ve açıklamalı hediye önerileri isteyenler için.",
    items: [
      "Daha fazla öneri",
      "Hediye notu fikri",
      "Neden önerildi açıklaması",
      "Daha iyi mağaza yönlendirmesi",
    ],
  },
  experience: {
    name: "Deneyim",
    price: 79,
    description: "Hediye fikrini bir anıya dönüştürmek isteyenler için.",
    items: [
      "Deneyim hediyesi önerileri",
      "QR mesaj fikri",
      "Özel sunum önerisi",
    ],
  },
  premium: {
    name: "Premium",
    price: 99,
    description:
      "Hediyeyi küçük bir sürpriz deneyimine dönüştürmek isteyenler için.",
    items: [
      "QR kodlu sürpriz mesaj",
      "Kişiye özel hediye notu",
      "Deneyim hediyesi fikirleri",
      "İndirilebilir hediye kartı",
      "Daha özel ve duygusal öneriler",
    ],
  },
};

function formatPrice(value: number) {
  return `${value.toLocaleString("tr-TR")} TL`;
}

export default function OdemeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "premium";
  const plan = packageDetails[selectedPlan] || packageDetails.premium;

  const packagePrice = plan.price;
  const serviceFee = 0;
  const discount = 0;
  const total = packagePrice + serviceFee - discount;

  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-6xl px-5 py-10 md:py-16">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
        >
          ← Geri Dön
        </button>

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold text-pink-600">Ödeme Özeti</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            Paketini kontrol et
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6b4a4a]">
            Devam etmeden önce seçilen paketi, toplam tutarı ve ödeme durumunu
            açıkça görebilirsin. Bu sayfada kart bilgisi alınmaz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold text-pink-600">
                  Seçilen Paket
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#2b1b1b]">
                  {plan.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#6b4a4a]">
                  {plan.description}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fff0f7] px-5 py-4 text-right">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-600">
                  Paket Fiyatı
                </p>
                <p className="mt-1 text-3xl font-black text-[#2b1b1b]">
                  {formatPrice(packagePrice)}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-[#fff4ef] p-5">
              <h3 className="font-black text-[#2b1b1b]">
                Bu pakette neler var?
              </h3>

              <ul className="mt-4 space-y-3">
                {plan.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm font-semibold text-[#6b4a4a]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-black text-white">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <InfoCard
                title="Kart bilgisi alınmaz"
                text="Bu ekranda kart numarası, CVV veya banka bilgisi istenmez."
              />
              <InfoCard
                title="Güvenli sağlayıcı"
                text="Canlı ödeme için iyzico veya PayTR gibi ödeme sağlayıcısı bağlanmalıdır."
              />
              <InfoCard
                title="Şeffaf toplam"
                text="Kullanıcı paket fiyatını ve ödenecek toplamı ayrı ayrı görür."
              />
            </div>


            <div className="mt-8 rounded-[1.5rem] border border-pink-100 bg-white p-5">
              <h3 className="font-black text-[#2b1b1b]">
                Ödeme akışı nasıl olacak?
              </h3>

              <div className="mt-5 grid gap-3">
                {[
                  "Paket seçimini ve toplam tutarı kontrol edersin.",
                  "Gerçek ödeme altyapısı aktif olduğunda güvenli sağlayıcıya yönlendirilirsin.",
                  "Ödeme tamamlanınca premium hediye deneyimi açılır.",
                  "Hediye notu, QR mesaj ve özel önerileri kullanabilirsin.",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-3 rounded-2xl bg-[#fff4ef] p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-600 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold leading-6 text-[#6b4a4a]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-black text-amber-900">
                Ödeme altyapısı henüz test modunda
              </h3>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Bu sayfa şu anda ödeme akışını göstermek için hazırlandı.
                Gerçek ödeme açılmadan kullanıcıdan kart bilgisi alınmaz ve
                ödeme sağlayıcısı bağlanmadan tahsilat yapılmaz.
              </p>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Hesap Özeti
            </h2>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Paket" value={plan.name} />
              <SummaryRow label="Paket bedeli" value={formatPrice(packagePrice)} />
              <SummaryRow label="Hizmet bedeli" value={formatPrice(serviceFee)} />
              <SummaryRow label="İndirim" value={`-${formatPrice(discount)}`} />
            </div>

            <div className="mt-6 rounded-2xl bg-[#2b1b1b] p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-white/75">
                  Ödenecek Toplam
                </span>
                <span className="text-3xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-black text-red-800">
                Bu sayfada kart bilgisi girilmez
              </p>
              <p className="mt-2 text-sm leading-6 text-red-700">
                Ödeme butonu ancak gerçek ödeme altyapısı bağlandığında aktif
                edilmelidir. Şu an kullanıcı sadece paket ve hesap özetini
                görebilir.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-full bg-slate-300 px-5 py-4 text-sm font-black text-white"
            >
              Online Ödeme Yakında Aktif
            </button>

            <Link
              href="/paketler"
              className="mt-3 inline-flex w-full justify-center rounded-full border border-pink-200 px-5 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Paketi Değiştir
            </Link>

            <Link
              href="/hediye-bul"
              className="mt-3 inline-flex w-full justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white transition hover:opacity-90"
            >
              Hediye Bul’a Dön
            </Link>
          </aside>
        </div>
      
            <div className="mt-5 rounded-2xl border border-pink-100 bg-[#fff0f7] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                Test ödeme akışı
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
                Gerçek ödeme sağlayıcı bağlanana kadar bu bağlantılar ödeme
                sonrası ekranları test etmek içindir.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="/odeme/basarili"
                  className="rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white transition hover:opacity-90"
                >
                  Başarılı Ödeme Testi
                </a>

                <a
                  href="/odeme/basarisiz"
                  className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
                >
                  Başarısız Ödeme Testi
                </a>
              </div>
            </div>


            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                Erken erişim modu
              </p>

              <h3 className="mt-2 text-xl font-black text-[#2b1b1b]">
                Manuel premium aktivasyon
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-amber-800">
                Online ödeme altyapısı hazırlık aşamasındadır. Bu süreçte kart
                bilgisi alınmaz. Test veya erken erişim kullanıcıları için paket
                erişimi admin panelden manuel olarak tanımlanır.
              </p>
            </div>
</section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4">
      <h3 className="font-black text-[#2b1b1b]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">{text}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-pink-100 pb-3 text-sm">
      <span className="font-semibold text-[#6b4a4a]">{label}</span>
      <span className="font-black text-[#2b1b1b]">{value}</span>
    </div>
  );
}
