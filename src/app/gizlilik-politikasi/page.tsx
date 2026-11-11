import Link from "next/link";

export const metadata = {
  title: "Gizlilik Politikası | NeAlsam Hediye",
  description: "NeAlsam Hediye gizlilik politikası ve kişisel veri bilgilendirmesi.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <article className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 pt-10 text-sm font-bold text-pink-700 md:pt-14">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
          Yasal · Gizlilik
        </p>

        <h1 className="mt-5 text-5xl text-[#2b1b1b] md:text-6xl">
          Gizlilik Politikası
        </h1>

        <p className="mt-6 border-b border-pink-100 pb-10 text-lg leading-8 text-[#6b4a4a]">
          Bu sayfa, NeAlsam Hediye platformunu kullanırken hangi bilgilerin
          işlendiğini ve bu bilgilerin hangi amaçlarla kullanılabileceğini
          açıklamak amacıyla hazırlanmıştır.
        </p>

        <div className="mt-10 space-y-10 text-[16px] leading-8 text-[#5a3b3b]">
          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Toplanan Bilgiler
            </h2>
            <p className="mt-3">
              Kullanıcı hesabı oluşturduğunuzda e-posta adresiniz, profil
              tercihleriniz, hediye bütçesi, ilgi alanları ve hediye tarzı gibi
              bilgiler işlenebilir. Hediye önerisi oluştururken verdiğiniz
              cevaplar, öneri kalitesini artırmak amacıyla kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Kullanım Amacı
            </h2>
            <p className="mt-3">
              Bilgileriniz; hediye önerileri sunmak, hesabınızı yönetmek,
              favori ve kaydedilen önerilerinizi göstermek, premium özellikleri
              çalıştırmak ve kullanıcı deneyimini geliştirmek amacıyla
              kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Ödeme Bilgileri
            </h2>
            <p className="mt-3">
              NeAlsam Hediye kart bilgisi saklamaz. Gerçek ödeme sistemi aktif
              edildiğinde ödeme işlemleri güvenli ödeme sağlayıcısı üzerinden
              yürütülür.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Üçüncü Taraf Bağlantılar
            </h2>
            <p className="mt-3">
              Platformda mağaza yönlendirmeleri bulunabilir. Bu bağlantılar
              üçüncü taraf web sitelerine yönlendirebilir. Bu sitelerin gizlilik
              uygulamalarından ilgili üçüncü taraflar sorumludur.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İletişim
            </h2>
            <p className="mt-3">
              Gizlilik politikasıyla ilgili sorularınız için iletişim
              kanallarımız üzerinden bize ulaşabilirsiniz.
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
