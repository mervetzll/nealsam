"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/yardim", label: "Yardım" },
  { href: "/blog", label: "Hediye Rehberi" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-[#eadede] bg-[#f7efec]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-6">
        <Link
          href="/"
          className="text-5xl font-extrabold tracking-tight text-[#b13d86]"
        >
          NeAlsam
        </Link>

        <nav className="ml-6 flex flex-1 items-center gap-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-8 py-5 text-2xl font-bold transition ${
                  isActive
                    ? "bg-[#b13d86] text-white"
                    : "bg-[#f4f1f1] text-[#2d1f1f] hover:bg-[#efe7ea]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/giris"
            className={`ml-auto rounded-full px-8 py-5 text-2xl font-bold transition ${
              pathname === "/giris"
                ? "bg-[#f0d8e9] text-[#b13d86]"
                : "bg-[#f6ebf2] text-[#b13d86] hover:bg-[#f0d8e9]"
            }`}
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
