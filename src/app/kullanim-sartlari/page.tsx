import Link from "next/link";

export const metadata = {
  title: "Kullanım Şartları | NeAlsam Hediye",
  description: "NeAlsam Hediye kullanım şartları.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <article className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 pt-10 text-sm font-bold text-pink-700 md:pt-14">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
          Yasal · Kullanım şartları
        </p>

        <h1 className="mt-5 text-5xl text-[#2b1b1b] md:text-6xl">
          Kullanım Şartları
        </h1>

        <p className="mt-6 border-b border-pink-100 pb-10 text-lg leading-8 text-[#6b4a4a]">
          NeAlsam Hediye’yi kullanarak bu kullanım şartlarını kabul etmiş
          sayılırsınız.
        </p>

        <div className="mt-10 space-y-10 text-[16px] leading-8 text-[#5a3b3b]">
          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Hizmetin Kapsamı
            </h2>
            <p className="mt-3">
              NeAlsam Hediye, kullanıcının verdiği cevaplara göre hediye fikri,
              mağaza yönlendirmesi, hediye notu ve deneyim önerileri sunan bir
              platformdur. Sunulan öneriler tavsiye niteliğindedir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Kullanıcı Sorumluluğu
            </h2>
            <p className="mt-3">
              Kullanıcı, platformu doğru ve hukuka uygun şekilde kullanmakla
              sorumludur. Yanlış, yanıltıcı veya üçüncü kişilerin haklarını
              ihlal eden kullanım kabul edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Mağaza Yönlendirmeleri
            </h2>
            <p className="mt-3">
              Platformda yer alan mağaza bağlantıları kullanıcıyı üçüncü taraf
              sitelere yönlendirebilir. Ürün fiyatı, stok, teslimat ve iade
              koşulları ilgili mağazanın sorumluluğundadır.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Premium Özellikler
            </h2>
            <p className="mt-3">
              Premium özellikler paket içeriğine göre değişebilir. Ödeme sistemi
              aktif hale getirildiğinde paket kapsamı ödeme ekranında açıkça
              gösterilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Değişiklikler
            </h2>
            <p className="mt-3">
              NeAlsam Hediye, kullanım şartlarında değişiklik yapma hakkını
              saklı tutar. Güncel şartlar bu sayfada yayımlanır.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
        >
          Ana Sayfaya Dön
        </Link>
      </article>
    </main>
  );
}
