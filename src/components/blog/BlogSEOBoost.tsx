import Link from "next/link";

type BlogSEOBoostProps = {
  topic?: string;
};

const faqs = [
  {
    question: "Hediye seçerken en önemli şey nedir?",
    answer:
      "Hediye seçerken sadece ürünün güzel görünmesine değil, kişinin ilgi alanına, günlük kullanımına, bütçeye ve hediye riskine bakmak gerekir.",
  },
  {
    question: "Risksiz hediye ne demek?",
    answer:
      "Beden, renk, koku, cilt uyumu veya kişisel zevk riski düşük olan hediyeler daha risksiz kabul edilir. Organizer, kahve ekipmanı, kitap aksesuarı ve deneyim hediyeleri buna örnek olabilir.",
  },
  {
    question: "Son dakika hediye alırken ne seçilmeli?",
    answer:
      "Son dakika için hızlı bulunabilen, beden gerektirmeyen ve genel kullanıma uygun hediyeler daha mantıklıdır. Çiçek, kahve seti, hediye kartı, organizer veya dijital hediye seçenekleri tercih edilebilir.",
  },
];

export default function BlogSEOBoost({ topic }: BlogSEOBoostProps) {
  return (
    <section className="my-12 space-y-8">
      <div className="rounded-[2rem] border border-pink-100 bg-[#fff0f7] p-6 md:p-8">
        <p className="text-sm font-bold text-pink-700">
          Daha kişisel öneri ister misin?
        </p>

        <h2 className="mt-2 text-2xl font-black text-[#2b1b1b] md:text-3xl">
          {topic
            ? `${topic} için sana daha uygun hediye fikrini bulalım`
            : "Kime ne hediye alacağını 30 saniyede bul"}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6b4a4a]">
          Bu yazıdaki fikirler genel önerilerdir. Daha doğru sonuç için kime
          hediye alacağını, bütçeni, özel günü ve ilgi alanlarını seçerek
          kişiye özel hediye önerisi alabilirsin.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/hediye-bul"
            className="rounded-full bg-[#2b1b1b] px-6 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            Hediye Bul Testini Başlat
          </Link>

          <Link
            href="/paketler"
            className="rounded-full border border-pink-200 bg-white px-6 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Paketleri Gör
          </Link>
        </div>
      </div>

      <div className="rounded-[2rem] border border-pink-100 bg-white p-6 md:p-8">
        <p className="text-sm font-bold text-pink-600">
          Hediye seçerken sık sorulanlar
        </p>

        <div className="mt-5 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] p-5"
            >
              <h3 className="font-black text-[#2b1b1b]">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
