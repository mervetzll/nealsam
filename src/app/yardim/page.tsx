import Link from "next/link";

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
          <p className="text-sm font-bold text-pink-600">Yardım Merkezi</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            NeAlsam hakkında merak edilenler
          </h1>
          <p className="mt-5 text-base leading-7 text-[#6b4a4a]">
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
              className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Paketleri İncele
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {supportCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-black text-[#2b1b1b]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {card.text}
              </p>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-bold text-pink-600">Sık Sorulan Sorular</p>
          <h2 className="mt-2 text-3xl font-black text-[#2b1b1b]">
            Kısa cevaplarla NeAlsam
          </h2>

          <div className="mt-7 grid gap-4">
            {faqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] p-5"
              >
                <h3 className="font-black text-[#2b1b1b]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-[#2b1b1b] p-8 text-white">
          <p className="text-sm font-bold text-pink-200">
            Hâlâ karar veremedin mi?
          </p>
          <h2 className="mt-2 text-3xl font-black">
            En hızlı yol testi başlatmak
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
