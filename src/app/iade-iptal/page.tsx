import Link from "next/link";

export const metadata = {
  title: "İade ve İptal Politikası | NeAlsam Hediye",
  description: "NeAlsam Hediye iade ve iptal politikası.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <article className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 pt-10 text-sm font-bold text-pink-700 md:pt-14">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
          Yasal · İade ve iptal
        </p>

        <h1 className="mt-5 text-5xl text-[#2b1b1b] md:text-6xl">
          İade ve İptal Politikası
        </h1>

        <p className="mt-6 border-b border-pink-100 pb-10 text-lg leading-8 text-[#6b4a4a]">
          Bu sayfa, NeAlsam Hediye paketleri ve dijital özellikleri için iade ve
          iptal süreçlerini açıklamak amacıyla hazırlanmıştır.
        </p>

        <div className="mt-10 space-y-10 text-[16px] leading-8 text-[#5a3b3b]">
          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Dijital Hizmet Niteliği
            </h2>
            <p className="mt-3">
              NeAlsam Hediye paketleri dijital hizmet ve içerik niteliğinde
              olabilir. QR not, özel mektup ve premium öneri akışları dijital
              olarak sunulur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İptal
            </h2>
            <p className="mt-3">
              Ödeme sistemi aktif olduğunda iptal talepleri, satın alınan paket
              türüne ve hizmetin kullanılıp kullanılmadığına göre
              değerlendirilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İade
            </h2>
            <p className="mt-3">
              Dijital içerik veya kişiye özel hizmet kullanıma açıldıktan sonra
              iade koşulları sınırlı olabilir. Gerçek ödeme akışı aktif
              edildiğinde iade koşulları ödeme ekranında açıkça belirtilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Hazırlık Modu
            </h2>
            <p className="mt-3">
              Platform şu anda ödeme hazırlık modundaysa kart bilgisi alınmaz ve
              gerçek ücret tahsilatı yapılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İletişim
            </h2>
            <p className="mt-3">
              İade veya iptal talepleri için iletişim kanallarımız üzerinden
              bize ulaşabilirsiniz.
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
