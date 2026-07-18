export const metadata = {
  title: "Kime Ne Hediye Alınır? | NeAlsam Hediye",
  description:
    "Kime ne hediye alınır? Sevgiliye, anneye, babaya, arkadaşa ve kardeşe göre hediye seçme rehberi.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <a href="/blog" className="text-sm font-bold text-[#b83280]">
          ← Bloga dön
        </a>

        <h1 className="mt-6 text-4xl font-extrabold">
          Kime Ne Hediye Alınır?
        </h1>

        <p className="mt-5 leading-8 text-[#6b4b4b]">
          Hediye seçerken önce kime hediye alınacağını, sonra özel günü,
          bütçeyi ve kişinin ilgi alanlarını düşünmek gerekir. Herkes için
          doğru hediye aynı değildir. Kullanışlı, duygusal, komik veya kişiye
          özel hediyeler farklı kişilerde farklı etki yaratır.
        </p>

        <h2 className="mt-8 text-2xl font-extrabold">
          Kişiye göre hediye seçimi
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#6b4b4b]">
          <li>Sevgili için romantik veya kişiye özel hediyeler öne çıkar.</li>
          <li>Anne için duygusal ve kullanışlı hediyeler daha anlamlıdır.</li>
          <li>Baba için pratik, kaliteli ve günlük kullanılabilir hediyeler seçilebilir.</li>
          <li>Arkadaş için komik, yaratıcı veya ilgi alanına uygun hediyeler iyi olur.</li>
          <li>Kardeş için oyun, teknoloji, spor veya moda odaklı hediyeler düşünülebilir.</li>
        </ul>

        <h2 className="mt-8 text-2xl font-extrabold">
          Hediye seçerken 4 temel soru
        </h2>

        <p className="mt-4 leading-8 text-[#6b4b4b]">
          Doğru hediyeyi bulmak için “Bu kişi neyi sever?”, “Ne kullanır?”,
          “Hangi tarz hediyeden hoşlanır?” ve “Bütçem ne kadar?” sorularına
          cevap vermek gerekir. NeAlsam Hediye bu cevaplara göre önerileri
          filtreleyerek daha anlamlı fikirler üretir.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
          <h3 className="text-xl font-extrabold">Kime ne hediye alınır?</h3>
          <p className="mt-3 leading-7 text-[#6b4b4b]">
            Kişiyi, bütçeni ve özel günü seçerek sana uygun hediye önerilerini
            hemen görebilirsin.
          </p>
          <a
            href="/hediye-bul"
            className="mt-5 inline-block rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
          >
            Hediye önerisi al
          </a>
        </div>
      </article>
    </main>
  );
}
