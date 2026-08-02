"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const packageDetails: Record<
  string,
  {
    name: string;
    price: string;
    description: string;
    items: string[];
  }
> = {
  free: {
    name: "Ücretsiz",
    price: "0 TL",
    description: "Hızlıca temel hediye önerisi almak isteyenler için.",
    items: [
      "Temel hediye önerileri",
      "Bütçeye göre fikirler",
      "Basit mağaza yönlendirmesi",
    ],
  },
  plus: {
    name: "Plus",
    price: "Orta paket",
    description: "Daha detaylı ve açıklamalı hediye önerileri isteyenler için.",
    items: [
      "Daha fazla öneri",
      "Hediye notu fikri",
      "Neden önerildi açıklaması",
      "Daha iyi mağaza yönlendirmesi",
    ],
  },
  premium: {
    name: "Premium",
    price: "En özel paket",
    description: "Hediyeyi küçük bir sürpriz deneyimine dönüştürmek isteyenler için.",
    items: [
      "QR kodlu sürpriz mesaj",
      "Kişiye özel hediye notu",
      "Deneyim hediyesi fikirleri",
      "İndirilebilir hediye kartı",
      "Daha özel ve duygusal öneriler",
    ],
  },
  note: {
    name: "Hediye Notu",
    price: "Mini paket",
    description: "Sadece hediye notu hazırlamak isteyenler için.",
    items: [
      "Kişiye uygun not fikri",
      "Duygusal mesaj önerisi",
      "Kopyalanabilir metin",
    ],
  },
  experience: {
    name: "Deneyim",
    price: "Deneyim paketi",
    description: "Hediye fikrini bir anıya dönüştürmek isteyenler için.",
    items: [
      "Deneyim hediyesi önerileri",
      "QR mesaj fikri",
      "Özel sunum önerisi",
    ],
  },
};

export default function OdemeClient() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "premium";
  const plan = packageDetails[selectedPlan] || packageDetails.premium;

  return (
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold text-pink-600">Ödeme</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            Paketini onayla
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6b4a4a]">
            Seçtiğin paketi kontrol et. Gerçek ödeme altyapısı bağlandığında bu
            sayfa güvenli ödeme adımına yönlendirecek.
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
                  Paket
                </p>
                <p className="mt-1 text-2xl font-black text-[#2b1b1b]">
                  {plan.price}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[1.5rem] bg-[#fff7fb] p-5">
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
                text="Gerçek ödeme altyapısı bağlanmadan kart bilgisi istenmez."
              />
              <InfoCard
                title="Güvenli ödeme"
                text="Canlı ödeme için iyzico veya PayTR gibi sağlayıcılar bağlanabilir."
              />
              <InfoCard
                title="Test modu"
                text="Şu an bu ekran ödeme akışının hazırlık sayfasıdır."
              />
            </div>
          </section>

          <aside className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Sipariş Özeti
            </h2>

            <div className="mt-6 space-y-4">
              <SummaryRow label="Paket" value={plan.name} />
              <SummaryRow label="Durum" value="Hazırlık modu" />
              <SummaryRow label="Ödeme" value="Bağlanacak" />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">
                Gerçek ödeme henüz aktif değil
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800/85">
                Bu sayfa tasarım ve ödeme akışı hazırlığı içindir. Canlı ödeme
                açılmadan kullanıcıdan kart bilgisi alınmaz.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="mt-6 w-full rounded-full bg-slate-300 px-5 py-4 text-sm font-black text-white"
            >
              Ödeme Altyapısı Bağlanacak
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
