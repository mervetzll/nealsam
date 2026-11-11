import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Yardım ve SSS | NeAlsam Hediye",
  description:
    "NeAlsam Hediye nasıl çalışır, hediye önerileri nasıl seçilir, premium deneyim ve admin sistemi hakkında sık sorulan sorular.",
};

const faqs = [
  {
    question: "NeAlsam nasıl çalışır?",
    answer:
      "NeAlsam; kime hediye alacağını, bütçeni, özel günü, ilgi alanlarını ve risk tercihlerini dikkate alarak sana daha uygun hediye fikirleri önerir.",
  },
  {
    question: "Öneriler gerçek ürün mü?",
    answer:
      "NeAlsam doğrudan ürün satmaz. Sana uygun hediye fikri verir ve ilgili mağazalarda arama yapabileceğin yönlendirmeler sunar.",
  },
  {
    question: "Hediye önerileri neye göre sıralanıyor?",
    answer:
      "Öneriler kişi, bütçe, özel gün, ilgi alanı, hediye tarzı, aciliyet ve risk tercihlerine göre puanlanır. Daha yüksek eşleşen hediyeler üstte görünür.",
  },
  {
    question: "Risk seviyesi ne demek?",
    answer:
      "Risk seviyesi; beden, renk, koku, cilt uyumu veya kişisel zevk gibi belirsizlikleri ifade eder. Düşük riskli hediyeler genelde daha güvenli seçeneklerdir.",
  },
  {
    question: "Premium deneyim ne işe yarar?",
    answer:
      "Premium deneyim; hediye fikrini daha özel hale getirmek için QR kodlu mesaj, kişiye özel not, deneyim fikri ve indirilebilir kart gibi ekstra özellikler sunar.",
  },
  {
    question: "NeAlsam ödeme veya kart bilgisi alıyor mu?",
    answer:
      "Mevcut sistem ödeme altyapısı için hazırlık durumundadır. Gerçek ödeme sistemi bağlanmadan kart bilgisi alınmaz.",
  },
  {
    question: "Admin panel ne işe yarar?",
    answer:
      "Admin panel, hediye havuzunu yönetmek için kullanılır. Yeni hediye ekleme, aktif/pasif yapma, düzenleme, kategori filtreleme ve sistem durumunu kontrol etme gibi işlemler buradan yapılır.",
  },
  {
    question: "Bir hediye önerisi bana uygun değilse ne yapabilirim?",
    answer:
      "Hediye Bul sonucunda istemediğin hediyeyi veya benzer kategorileri filtreleyebilirsin. Ayrıca cevaplarını değiştirerek daha doğru öneriler alabilirsin.",
  },
];

const supportCards = [
  {
    title: "Hediye bulamıyorum",
    text: "Bütçeyi biraz genişlet, ilgi alanlarını artır ve düşük riskli seçenekleri tercih et.",
  },
  {
    title: "Son dakika hediyesi lazım",
    text: "Bugün lazım seçeneğini işaretle. Dijital hediyeler, çiçek, kahve seti ve organizer gibi seçenekler daha uygun olabilir.",
  },
  {
    title: "Çok özel bir hediye istiyorum",
    text: "Romantik, duygusal veya deneyim hediyesi tarzlarını seç. Premium deneyim bölümünden QR not ve özel mesaj hazırlayabilirsin.",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
            Yardım merkezi
          </p>
          <h1 className="mt-5 text-[2.75rem] text-[#2b1b1b] sm:text-6xl lg:text-7xl">
            NeAlsam hakkında <em>merak edilenler</em>
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#6b4a4a]">
            Hediye önerilerinin nasıl çalıştığını, risk seviyelerini, premium
            deneyimi ve mağaza yönlendirmelerini burada bulabilirsin.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
            >
              Hediye Bul
            </Link>

            <Link
              href="/paketler"
              className="rounded-full bg-white ring-1 ring-pink-200 px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Paketleri İncele
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {supportCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6"
            >
              <h2 className="text-2xl text-[#2b1b1b]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Sık sorulan sorular</p>
            <h2 className="mt-3 text-4xl text-[#2b1b1b] md:text-5xl">
              Kısa cevaplarla <em>NeAlsam</em>
            </h2>
          </div>

          <div className="divide-y divide-pink-100 rounded-[1.75rem] bg-white px-6 ring-1 ring-pink-100 md:px-8">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold text-[#2b1b1b]">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600 transition group-open:rotate-45">
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <p className="mt-3 pr-12 leading-7 text-[#6b4a4a]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="dark-surface mt-20 rounded-[2.5rem] bg-[#2b1b1b] px-8 py-14 text-white md:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300">
            Hâlâ karar veremedin mi?
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl">
            En hızlı yol: <em>testi başlat.</em>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
            Kime hediye alacağını, bütçeni ve özel günü seç; NeAlsam sana daha
            uygun hediye fikirlerini sıralasın.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-50"
          >
            Hediye Bul’a Git
          </Link>
        </section>
      </section>
    </main>
  );
}
