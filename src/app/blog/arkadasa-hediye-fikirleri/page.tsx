export const metadata = {
  title: "Arkadaşa Hediye Fikirleri | NeAlsam Hediye",
  description:
    "Yakın arkadaşa, kız arkadaşa, erkek arkadaşa veya iş arkadaşına alınabilecek eğlenceli ve kullanışlı hediye fikirleri.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <a href="/blog" className="text-sm font-bold text-[#b83280]">
          ← Bloga dön
        </a>

        <h1 className="mt-6 text-4xl font-extrabold">
          Arkadaşa Hediye Fikirleri
        </h1>

        <p className="mt-5 leading-8 text-[#6b4b4b]">
          Arkadaşa hediye seçerken en iyi yaklaşım, onun karakterine ve günlük
          hayatına uygun küçük ama düşünülmüş bir seçim yapmaktır. Komik,
          kullanışlı veya ilgi alanına özel hediyeler arkadaşlar için genelde
          daha başarılı olur.
        </p>

        <h2 className="mt-8 text-2xl font-extrabold">
          Arkadaşa alınabilecek hediyeler
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#6b4b4b]">
          <li>Kahve termosu veya kupa</li>
          <li>Kitap ve ayraç seti</li>
          <li>Masaüstü dekor ürünü</li>
          <li>Komik not kartı veya anı kutusu</li>
          <li>Oyun veya teknoloji aksesuarı</li>
          <li>Konser, etkinlik veya deneyim hediyesi</li>
        </ul>

        <h2 className="mt-8 text-2xl font-extrabold">
          Arkadaşa hediye seçerken riskler
        </h2>

        <p className="mt-4 leading-8 text-[#6b4b4b]">
          Kıyafet, parfüm veya çok kişisel ürünler bazen riskli olabilir.
          Bunun yerine ilgi alanına göre seçilmiş, kullanımı kolay ve anlamlı
          hediyeler daha güvenli bir tercih olur.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
          <h3 className="text-xl font-extrabold">Arkadaşına uygun hediye bul</h3>
          <p className="mt-3 leading-7 text-[#6b4b4b]">
            Arkadaşının ilgi alanlarını seç, NeAlsam sana uygun fikirleri
            listelesin.
          </p>
          <a
            href="/hediye-bul"
            className="mt-5 inline-block rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
          >
            Hediye bul
          </a>
        </div>
      </article>
    </main>
  );
}
