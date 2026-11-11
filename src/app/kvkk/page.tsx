import Link from "next/link";

export const metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "NeAlsam Hediye KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <article className="mx-auto max-w-3xl">
        <p className="inline-flex items-center gap-2 pt-10 text-sm font-bold text-pink-700 md:pt-14">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
          Yasal · KVKK
        </p>

        <h1 className="mt-5 text-5xl text-[#2b1b1b] md:text-6xl">
          KVKK Aydınlatma Metni
        </h1>

        <p className="mt-6 border-b border-pink-100 pb-10 text-lg leading-8 text-[#6b4a4a]">
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
          kullanıcıları bilgilendirmek amacıyla hazırlanmış taslak bir
          aydınlatma metnidir.
        </p>

        <div className="mt-10 space-y-10 text-[16px] leading-8 text-[#5a3b3b]">
          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İşlenen Kişisel Veriler
            </h2>
            <p className="mt-3">
              E-posta adresi, profil tercihleri, hediye arama cevapları,
              favoriler, kaydedilen öneriler ve platform kullanım bilgileri
              işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              İşleme Amaçları
            </h2>
            <p className="mt-3">
              Kişisel veriler; kullanıcı hesabı oluşturmak, hediye önerilerini
              kişiselleştirmek, premium erişimi yönetmek, destek sunmak ve
              hizmet kalitesini artırmak amacıyla işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Saklama Süresi
            </h2>
            <p className="mt-3">
              Veriler, kullanım amacı devam ettiği sürece veya mevzuatta
              öngörülen süreler boyunca saklanabilir. Kullanıcı hesabı
              silindiğinde ilgili verilerin silinmesi veya anonimleştirilmesi
              değerlendirilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Haklarınız
            </h2>
            <p className="mt-3">
              KVKK kapsamında kişisel verilerinizin işlenip işlenmediğini
              öğrenme, düzeltilmesini isteme, silinmesini talep etme ve ilgili
              diğer haklara sahipsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl text-[#2b1b1b] md:text-3xl">
              Başvuru
            </h2>
            <p className="mt-3">
              Kişisel verilerinizle ilgili taleplerinizi iletişim kanallarımız
              üzerinden iletebilirsiniz.
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
