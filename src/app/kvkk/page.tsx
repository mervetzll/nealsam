import Link from "next/link";

export const metadata = {
  title: "KVKK Aydınlatma Metni | NeAlsam Hediye",
  description: "NeAlsam Hediye KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-14">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-black text-pink-600">NeAlsam Hediye</p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
          KVKK Aydınlatma Metni
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#6b4a4a]">
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
          kullanıcıları bilgilendirmek amacıyla hazırlanmış taslak bir
          aydınlatma metnidir.
        </p>

        <div className="mt-8 space-y-7 text-sm leading-7 text-[#6b4a4a]">
          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İşlenen Kişisel Veriler
            </h2>
            <p className="mt-2">
              E-posta adresi, profil tercihleri, hediye arama cevapları,
              favoriler, kaydedilen öneriler ve platform kullanım bilgileri
              işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              İşleme Amaçları
            </h2>
            <p className="mt-2">
              Kişisel veriler; kullanıcı hesabı oluşturmak, hediye önerilerini
              kişiselleştirmek, premium erişimi yönetmek, destek sunmak ve
              hizmet kalitesini artırmak amacıyla işlenebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Saklama Süresi
            </h2>
            <p className="mt-2">
              Veriler, kullanım amacı devam ettiği sürece veya mevzuatta
              öngörülen süreler boyunca saklanabilir. Kullanıcı hesabı
              silindiğinde ilgili verilerin silinmesi veya anonimleştirilmesi
              değerlendirilebilir.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Haklarınız
            </h2>
            <p className="mt-2">
              KVKK kapsamında kişisel verilerinizin işlenip işlenmediğini
              öğrenme, düzeltilmesini isteme, silinmesini talep etme ve ilgili
              diğer haklara sahipsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#2b1b1b]">
              Başvuru
            </h2>
            <p className="mt-2">
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
      </section>
    </main>
  );
}
