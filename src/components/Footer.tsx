import Link from "next/link";
import GiftLogo from "@/components/brand/GiftLogo";

const footerLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/blog", label: "Rehber" },
  { href: "/yardim", label: "Yardım" },
];

const legalLinks = [
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
  { href: "/kvkk", label: "KVKK" },
  { href: "/iade-iptal", label: "İade ve İptal" },
];

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <GiftLogo small />

          <p className="mt-4 max-w-md text-sm leading-6 text-[#6b4a4a]">
            NeAlsam Hediye, kişiye ve bütçeye göre hediye fikri bulmayı
            kolaylaştıran dijital hediye öneri platformudur.
          </p>

          <p className="mt-4 text-xs font-semibold text-[#8a6a6a]">
            © {new Date().getFullYear()} NeAlsam Hediye. Tüm hakları saklıdır.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black text-[#2b1b1b]">Site</h3>

          <div className="mt-4 grid gap-2">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-[#6b4a4a] transition hover:text-pink-700"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-[#2b1b1b]">Yasal</h3>

          <div className="mt-4 grid gap-2">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-[#6b4a4a] transition hover:text-pink-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="mt-5 rounded-2xl bg-[#fff4ef] p-4 text-xs font-semibold leading-5 text-[#6b4a4a]">
            Ödeme altyapısı aktif edilene kadar kart bilgisi alınmaz. Yasal
            metinler taslak bilgilendirme niteliğindedir.
          </p>
        </div>
      </div>
    </footer>
  );
}
