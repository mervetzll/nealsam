import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GiftLogo from "@/components/brand/GiftLogo";

const columns = [
  {
    title: "Keşfet",
    links: [
      { href: "/hediye-bul", label: "Hediye Bul" },
      { href: "/hediye-paketi", label: "Paket Oluştur" },
      { href: "/deneyim", label: "QR Deneyim" },
      { href: "/hediye-araclari", label: "Araçlar" },
    ],
  },
  {
    title: "NeAlsam",
    links: [
      { href: "/paketler", label: "Premium" },
      { href: "/blog", label: "Rehber" },
      { href: "/yardim", label: "Yardım" },
      { href: "/hesabim", label: "Hesabım" },
    ],
  },
  {
    title: "Yasal",
    links: [
      { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
      { href: "/kvkk", label: "KVKK" },
      { href: "/iade-iptal", label: "İade ve İptal" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="dark-surface relative overflow-hidden bg-[#2b1b1b] text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 md:pt-20">
        {/* Closing line */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl text-4xl md:text-6xl">
            Doğru hediye, <em>bir test uzağında.</em>
          </h2>
          <Link
            href="/hediye-bul"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-pink-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-pink-500 md:self-auto"
          >
            Hediye bulmaya başla
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <GiftLogo small tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/60">
              Kişiye, bütçeye ve özel güne göre hediye fikri bulmayı kolaylaştıran hediye rehberi.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-white/70 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} NeAlsam Hediye. Tüm hakları saklıdır.</p>
          <p className="max-w-xl md:text-right">
            Ödeme altyapısı aktif edilene kadar kart bilgisi alınmaz. Yasal metinler taslak bilgilendirme niteliğindedir.
          </p>
        </div>
      </div>
    </footer>
  );
}
