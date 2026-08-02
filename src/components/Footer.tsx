import Link from "next/link";
import GiftLogo from "@/components/brand/GiftLogo";

const footerLinks = [
  {
    title: "NeAlsam",
    links: [
      { label: "Ana Sayfa", href: "/" },
      { label: "Hediye Bul", href: "/hediye-bul" },
      { label: "Paketler", href: "/paketler" },
      { label: "Yardım", href: "/yardim" },
    ],
  },
  {
    title: "Hediye Rehberi",
    links: [
      { label: "Kime Ne Hediye Alınır?", href: "/blog/kime-ne-hediye-alinir" },
      { label: "Sevgiliye Hediye", href: "/blog/sevgiliye-ne-hediye-alinir" },
      { label: "Anneye Hediye", href: "/blog/anneye-dogum-gunu-hediyesi" },
      { label: "500 TL Altı Hediye", href: "/blog/500-tl-alti-hediye-onerileri" },
    ],
  },
  {
    title: "Deneyim",
    links: [
      { label: "Deneyim Oluştur", href: "/deneyim" },
      { label: "Premium Paket", href: "/deneyim?plan=premium" },
      { label: "Hediye Notu", href: "/hediye-notu" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <GiftLogo small />

          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6b4a4a]">
            NeAlsam; kime hediye alacağını, bütçeni ve özel günü seçerek daha
            anlamlı, daha risksiz ve daha alınabilir hediye fikirleri bulmana
            yardımcı olur.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-5 inline-flex rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            Hediye Bul’a Başla
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-black text-[#2b1b1b]">
                {group.title}
              </h3>

              <div className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    className="block text-sm font-semibold text-[#6b4a4a] transition hover:text-pink-700"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-pink-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs font-semibold text-[#8a6a6a] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} NeAlsam Hediye</p>
          <p>Hediye fikirleri sunar, doğrudan ürün satışı yapmaz.</p>
        </div>
      </div>
    </footer>
  );
}
