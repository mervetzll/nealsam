import Navbar from "@/components/Navbar";
import Link from "next/link";

const faqs = [
  {
    q: "NeAlsam fiziksel ürün satıyor mu?",
    a: "Hayır. NeAlsam ürün satmaz. Sana hediye fikri, arama linki, kişisel not, QR mesaj, hikâye, mektup ve yaratıcı sunum fikri üretir.",
  },
  {
    q: "Hediyeyi nereden alacağım?",
    a: "Hediyeyi Trendyol, Amazon, Hepsiburada veya istediğin herhangi bir mağazadan kendin alırsın.",
  },
  {
    q: "QR kod ne işe yarıyor?",
    a: "QR kod seçtiğin notu dijital olarak taşır. Hediyenin yanına koyduğunda alıcı QR’ı okutarak özel mesajını görebilir.",
  },
  {
    q: "Paket alınca ne oluyor?",
    a: "Demo sürümde paket hesabına tanımlanır. Gerçek sürümde ödeme sonrası paket veritabanında hesabına bağlanır.",
  },
  {
    q: "Aylık kullanım hakkı nasıl çalışıyor?",
    a: "İçerik oluşturdukça kalan hakkın azalır. Hesabım sayfasından kalan hakkını görebilirsin.",
  },
  {
    q: "E-posta doğrulama neden var?",
    a: "Paket ve ödeme bilgilerini doğru hesaba bağlamak için e-posta doğrulama gerekir.",
  },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#fff7f3] text-[#2b1b1b]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="mb-4 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-bold text-[#b83280]">
            Yardım ve SSS
          </p>

          <h1 className="text-5xl font-black">NeAlsam nasıl çalışır?</h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#6b4b4b]">
            NeAlsam hediyeyi satmaz; hediyenin fikrini, notunu, QR mesajını,
            hikâyesini ve sunumunu hazırlar.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#b83280]">{item.q}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6b4b4b]">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-[#2b1b1b] p-8 text-center text-white">
          <h2 className="text-3xl font-black">Başlamak ister misin?</h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#ffeaf3]">
            Önce hediye fikri bulabilir, sonra seçtiğin hediyenin yanına özel
            not ve QR mesaj oluşturabilirsin.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-white px-6 py-3 font-bold text-[#b83280]"
            >
              Hediye Bul
            </Link>

            <Link
              href="/deneyim?mode=not"
              className="rounded-full bg-[#b83280] px-6 py-3 font-bold text-white"
            >
              Not Oluştur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
