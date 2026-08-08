import Link from "next/link";

export const metadata = {
  title: "Gizlilik Politikası | NeAlsam Hediye",
  description: "NeAlsam Hediye gizlilik politikası ve kişisel veri bilgilendirmesi.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-black text-pink-600">NeAlsam Hediye</p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          Gizlilik Politikası
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6b4a4a]">
          Bu sayfa, NeAlsam Hediye platformunu kullanırken hangi bilgilerin
          işlendiğini ve bu bilgilerin hangi amaçlarla kullanılabileceğini
          açıklamak amacıyla hazırlanmıştır.
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-[#6b4a4a]">
          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Toplanan Bilgiler
            </h2>
            <p className="mt-2">
              Kullanıcı hesabı oluşturduğunuzda e-posta adresiniz, profil
              tercihleriniz, hediye bütçesi, ilgi alanları ve hediye tarzı gibi
              bilgiler işlenebilir. Hediye önerisi oluştururken verdiğiniz
              cevaplar, öneri kalitesini artırmak amacıyla kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Kullanım Amacı
            </h2>
            <p className="mt-2">
              Bilgileriniz; hediye önerileri sunmak, hesabınızı yönetmek,
              favori ve kaydedilen önerilerinizi göstermek, premium özellikleri
              çalıştırmak ve kullanıcı deneyimini geliştirmek amacıyla
              kullanılabilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Ödeme Bilgileri
            </h2>
            <p className="mt-2">
              NeAlsam Hediye kart bilgisi saklamaz. Gerçek ödeme sistemi aktif
              edildiğinde ödeme işlemleri güvenli ödeme sağlayıcısı üzerinden
              yürütülür.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Üçüncü Taraf Bağlantılar
            </h2>
            <p className="mt-2">
              Platformda mağaza yönlendirmeleri bulunabilir. Bu bağlantılar
              üçüncü taraf web sitelerine yönlendirebilir. Bu sitelerin gizlilik
              uygulamalarından ilgili üçüncü taraflar sorumludur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İletişim
            </h2>
            <p className="mt-2">
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
      </section>
    </main>
  );
}
