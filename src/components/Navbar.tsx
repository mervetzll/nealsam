import Link from "next/link";
import GiftLogo from "@/components/brand/GiftLogo";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/blog", label: "Rehber" },
  { href: "/yardim", label: "Yardım" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <GiftLogo small />

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-bold text-[#6b4a4a] transition hover:bg-pink-50 hover:text-pink-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href="/hediye-bul"
          className="rounded-full bg-[#2b1b1b] px-4 py-2 text-sm font-black text-white transition hover:opacity-90"
        >
          Başla
        </Link>
      </nav>
    </header>
  );
}
