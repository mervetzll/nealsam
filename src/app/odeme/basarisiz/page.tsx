import Link from "next/link";

export const metadata = {
  title: "Ödeme Başarısız | NeAlsam Hediye",
  description: "NeAlsam Hediye ödeme başarısız sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-16">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-3xl">
          !
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-wide text-red-600">
          Ödeme Tamamlanamadı
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          İşlem başarısız oldu
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
          Ödeme sırasında bir sorun oluştu veya işlem iptal edildi. Kart bilgisi
          bu sitede tutulmaz. Gerçek ödeme sağlayıcı entegrasyonu aktif olduğunda
          işlem sağlayıcı güvenli sayfasında tamamlanacaktır.
        </p>

        <div className="mt-8 rounded-2xl bg-[#fff0f7] p-5 text-left">
          <p className="text-sm font-black text-[#2b1b1b]">
            Ne yapabilirsin?
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
            Paketi tekrar seçebilir, ödeme sayfasına dönebilir veya ücretsiz
            Hediye Bul özelliğini kullanmaya devam edebilirsin.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/paketler"
            className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
          >
            Paketlere Dön
          </Link>

          <Link
            href="/hediye-bul"
            className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Ücretsiz Hediye Bul
          </Link>
        </div>
      </section>
    </main>
  );
}
