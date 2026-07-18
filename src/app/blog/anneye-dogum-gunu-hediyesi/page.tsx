export const metadata = {
  title: "Anneye Doğum Günü Hediyesi | NeAlsam Hediye",
  description:
    "Anneye doğum günü için anlamlı, duygusal, kullanışlı ve zarif hediye önerileri.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <a href="/blog" className="text-sm font-bold text-[#b83280]">
          ← Bloga dön
        </a>

        <h1 className="mt-6 text-4xl font-extrabold">
          Anneye Doğum Günü Hediyesi
        </h1>

        <p className="mt-5 leading-8 text-[#6b4b4b]">
          Anneye doğum günü hediyesi seçerken hediyenin duygusal değeri çoğu
          zaman fiyatından daha önemlidir. Günlük hayatta kullanabileceği,
          kendini özel hissettirecek veya anı değeri taşıyan hediyeler daha
          anlamlı olur.
        </p>

        <h2 className="mt-8 text-2xl font-extrabold">
          Anneye alınabilecek hediye fikirleri
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#6b4b4b]">
          <li>Kişiye özel kupa veya kahve seti</li>
          <li>Şık bir şal veya zarif aksesuar</li>
          <li>Fotoğraflı aile anı kutusu</li>
          <li>Cilt bakım seti</li>
          <li>Ev dekorasyonu ürünü</li>
          <li>El yazısı mektup ile tamamlanan anlamlı hediye</li>
        </ul>

        <h2 className="mt-8 text-2xl font-extrabold">
          Anneye hediye seçerken öneri
        </h2>

        <p className="mt-4 leading-8 text-[#6b4b4b]">
          Annenin tarzını, sevdiği renkleri, günlük alışkanlıklarını ve ihtiyaç
          duyabileceği küçük detayları düşünmek doğru hediyeyi seçmeyi
          kolaylaştırır. Hediyenin yanına yazılacak içten bir not, hediyeyi çok
          daha özel hale getirir.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
          <h3 className="text-xl font-extrabold">Anneye özel hediye bul</h3>
          <p className="mt-3 leading-7 text-[#6b4b4b]">
            Bütçeni ve annenin ilgi alanlarını seçerek daha kişisel öneriler
            görebilirsin.
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
