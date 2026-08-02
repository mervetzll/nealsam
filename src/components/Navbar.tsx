import Link from "next/link";
import GiftLogo from "@/components/brand/GiftLogo";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/blog", label: "Rehber" },
  { href: "/yardim", label: "Yardım" },
  { href: "/hesabim", label: "Hesabım" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
        <GiftLogo small />

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-black text-[#6b4a4a] shadow-sm transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/giris"
          className="hidden rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-200 md:inline-flex"
        >
          Giriş Yap
        </Link>
      </nav>

      <div className="border-t border-pink-50 bg-[#fff7fb] px-5 py-2 md:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-black text-[#6b4a4a] shadow-sm"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/giris"
            className="whitespace-nowrap rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white shadow-sm"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </header>
  );
}
