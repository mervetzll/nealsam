import Link from "next/link";

export const metadata = {
  title: "İade ve İptal Politikası | NeAlsam Hediye",
  description: "NeAlsam Hediye iade ve iptal politikası.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-black text-pink-600">NeAlsam Hediye</p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          İade ve İptal Politikası
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6b4a4a]">
          Bu sayfa, NeAlsam Hediye paketleri ve dijital özellikleri için iade ve
          iptal süreçlerini açıklamak amacıyla hazırlanmıştır.
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-[#6b4a4a]">
          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Dijital Hizmet Niteliği
            </h2>
            <p className="mt-2">
              NeAlsam Hediye paketleri dijital hizmet ve içerik niteliğinde
              olabilir. QR not, özel mektup ve premium öneri akışları dijital
              olarak sunulur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İptal
            </h2>
            <p className="mt-2">
              Ödeme sistemi aktif olduğunda iptal talepleri, satın alınan paket
              türüne ve hizmetin kullanılıp kullanılmadığına göre
              değerlendirilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İade
            </h2>
            <p className="mt-2">
              Dijital içerik veya kişiye özel hizmet kullanıma açıldıktan sonra
              iade koşulları sınırlı olabilir. Gerçek ödeme akışı aktif
              edildiğinde iade koşulları ödeme ekranında açıkça belirtilecektir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Hazırlık Modu
            </h2>
            <p className="mt-2">
              Platform şu anda ödeme hazırlık modundaysa kart bilgisi alınmaz ve
              gerçek ücret tahsilatı yapılmaz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İletişim
            </h2>
            <p className="mt-2">
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
      </section>
    </main>
  );
}
