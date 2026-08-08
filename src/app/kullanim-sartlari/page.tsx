import Link from "next/link";

export const metadata = {
  title: "Kullanım Şartları | NeAlsam Hediye",
  description: "NeAlsam Hediye kullanım şartları.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-black text-pink-600">NeAlsam Hediye</p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          Kullanım Şartları
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6b4a4a]">
          NeAlsam Hediye’yi kullanarak bu kullanım şartlarını kabul etmiş
          sayılırsınız.
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-[#6b4a4a]">
          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Hizmetin Kapsamı
            </h2>
            <p className="mt-2">
              NeAlsam Hediye, kullanıcının verdiği cevaplara göre hediye fikri,
              mağaza yönlendirmesi, hediye notu ve deneyim önerileri sunan bir
              platformdur. Sunulan öneriler tavsiye niteliğindedir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Kullanıcı Sorumluluğu
            </h2>
            <p className="mt-2">
              Kullanıcı, platformu doğru ve hukuka uygun şekilde kullanmakla
              sorumludur. Yanlış, yanıltıcı veya üçüncü kişilerin haklarını
              ihlal eden kullanım kabul edilmez.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Mağaza Yönlendirmeleri
            </h2>
            <p className="mt-2">
              Platformda yer alan mağaza bağlantıları kullanıcıyı üçüncü taraf
              sitelere yönlendirebilir. Ürün fiyatı, stok, teslimat ve iade
              koşulları ilgili mağazanın sorumluluğundadır.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Premium Özellikler
            </h2>
            <p className="mt-2">
              Premium özellikler paket içeriğine göre değişebilir. Ödeme sistemi
              aktif hale getirildiğinde paket kapsamı ödeme ekranında açıkça
              gösterilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Değişiklikler
            </h2>
            <p className="mt-2">
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
      </section>
    </main>
  );
}
