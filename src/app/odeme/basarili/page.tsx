import Link from "next/link";

export const metadata = {
  title: "Ödeme Başarılı | NeAlsam Hediye",
  description: "NeAlsam Hediye ödeme başarı sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-16">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
          ✓
        </div>

        <p className="mt-6 text-sm font-black uppercase tracking-wide text-emerald-600">
          Ödeme Başarılı
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          Paketiniz aktif edildi
        </h1>

        <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
          Ödeme işleminiz başarılı tamamlandı. Premium özelliklerin hesabınıza
          tanımlanması ödeme sağlayıcı entegrasyonu tamamlandığında otomatik
          yapılacaktır.
        </p>

        <div className="mt-8 rounded-2xl bg-[#fff0f7] p-5 text-left">
          <p className="text-sm font-black text-[#2b1b1b]">
            Şu anda hazırlık modu
          </p>
          <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
            Gerçek ödeme sistemi bağlanana kadar bu sayfa ödeme sonrası akışın
            nasıl görüneceğini göstermek için kullanılır.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/hesabim"
            className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
          >
            Hesabıma Git
          </Link>

          <Link
            href="/deneyim"
            className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Premium Deneyimi Aç
          </Link>
        </div>
      </section>
    </main>
  );
}
