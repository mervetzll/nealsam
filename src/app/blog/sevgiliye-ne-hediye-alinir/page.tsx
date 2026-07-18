export const metadata = {
  title: "Sevgiliye Ne Hediye Alınır? | NeAlsam Hediye",
  description:
    "Sevgiliye romantik, kullanışlı, kişiye özel ve anlamlı hediye fikirleri. Bütçeye göre sevgiliye hediye önerileri.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <a href="/blog" className="text-sm font-bold text-[#b83280]">
          ← Bloga dön
        </a>

        <h1 className="mt-6 text-4xl font-extrabold">
          Sevgiliye Ne Hediye Alınır?
        </h1>

        <p className="mt-5 leading-8 text-[#6b4b4b]">
          Sevgiliye hediye seçerken en önemli şey pahalı bir ürün almak değil,
          hediyenin ilişkiye ve kişiye özel hissettirmesidir. Romantik bir
          hediye seçilebilir ama fazla klasik olmamasına dikkat etmek gerekir.
          Kişinin ilgi alanları, günlük alışkanlıkları ve özel günün anlamı
          doğru hediyeyi bulmayı kolaylaştırır.
        </p>

        <h2 className="mt-8 text-2xl font-extrabold">
          Sevgiliye alınabilecek hediye fikirleri
        </h2>

        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#6b4b4b]">
          <li>Kişiye özel takı veya minimal kolye</li>
          <li>Fotoğraflı anı kutusu</li>
          <li>Spotify kodlu tablo</li>
          <li>Birlikte yapılacak deneyim hediyesi</li>
          <li>El yazısı notla tamamlanan küçük ama anlamlı bir hediye</li>
          <li>Kahve, kitap veya müzik zevkine göre seçilmiş özel set</li>
        </ul>

        <h2 className="mt-8 text-2xl font-extrabold">
          Sevgiliye hediye seçerken nelere dikkat edilmeli?
        </h2>

        <p className="mt-4 leading-8 text-[#6b4b4b]">
          Eğer ilişkiniz yeniyse çok iddialı ve aşırı romantik hediyeler yerine
          daha zarif ve risksiz seçenekler tercih edilebilir. Uzun süreli bir
          ilişkide ise ortak anıları hatırlatan, kişiye özel veya deneyim odaklı
          hediyeler daha etkili olur. Hediye notu da hediyenin etkisini ciddi
          şekilde artırır.
        </p>

        <div className="mt-8 rounded-3xl bg-[#fff0f7] p-6">
          <h3 className="text-xl font-extrabold">Hızlı hediye önerisi al</h3>
          <p className="mt-3 leading-7 text-[#6b4b4b]">
            Kime, hangi bütçeyle ve hangi tarzda hediye alacağını seçerek sana
            özel hediye fikirleri oluşturabilirsin.
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
