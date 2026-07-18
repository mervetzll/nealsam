export const metadata = {
  title: "500 TL Altı Hediye Önerileri | NeAlsam Hediye",
  description:
    "500 TL altı uygun fiyatlı, anlamlı ve kullanışlı hediye önerileri. Bütçe dostu hediye fikirleri.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <a href="/blog" className="text-sm font-bold text-[#b83280]">
          ← Bloga dön
        </a>

        <h1 className="mt-6 text-4xl font-extrabold">
          500 TL Altı Hediye Önerileri
        </h1>

        <p className="mt-5 leading-8 text-[#6b4b4b]">
          Uygun fiyatlı hediye almak, hediyenin değersiz olduğu anlamına
          gelmez. Doğru seçilmiş küçük bir hediye, güzel bir not ve özenli bir
          sunumla çok daha anlamlı hale gelebilir.
        </p>

        <h2 className="mt-8 text-2xl font-extrabold">
          500 TL altı alınabilecek hediyeler
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#6b4b4b]">
          <li>Kişiye özel kupa</li>
          <li>Mini kahve veya çay seti</li>
          <li>Kitap ve ayraç</li>
          <li>Defter, kalem veya planlayıcı</li>
          <li>Minimal takı veya aksesuar</li>
          <li>Çorap, mum veya küçük dekoratif ürün</li>
        </ul>

        <h2 className="mt-8 text-2xl font-extrabold">
          Uygun fiyatlı hediyeyi özel gösterme yolları
        </h2>

        <p className="mt-4 leading-8 text-[#6b4b4b]">
          Küçük bir hediye, kişisel bir notla ve özenli paketlemeyle çok daha
          etkileyici olabilir. Hediye seçerken fiyat yerine “bu kişi bunu
          kullanır mı, görünce beni hatırlar mı?” sorularını düşünmek daha
          doğru sonuç verir.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
          <h3 className="text-xl font-extrabold">Bütçene göre hediye bul</h3>
          <p className="mt-3 leading-7 text-[#6b4b4b]">
            Bütçeni seçerek sana uygun hediye fikirlerini görebilirsin.
          </p>
          <a
            href="/hediye-bul"
            className="mt-5 inline-block rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
          >
            500 TL altı hediye bul
          </a>
        </div>
      </article>
    </main>
  );
}
