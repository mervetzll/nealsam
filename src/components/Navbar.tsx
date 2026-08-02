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

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-black text-[#6b4a4a] transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            href="/hediye-bul"
            className="rounded-full bg-[#2b1b1b] px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
          >
            Hediye Bul
          </Link>

          <Link
            href="/hesabim"
            className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Hesabım
          </Link>
        </div>

        <Link
          href="/hediye-bul"
          className="hidden rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90 lg:inline-flex"
        >
          Başla
        </Link>
      </nav>

      <div className="border-t border-pink-50 bg-[#fff7fb] px-5 py-2 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-black text-[#6b4a4a] shadow-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
