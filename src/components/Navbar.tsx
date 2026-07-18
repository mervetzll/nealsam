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
    <header className="w-full border-b border-[#eadede] bg-[#fff7f3]">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5">
        <Link
          href="/"
          className="text-4xl font-extrabold tracking-tight text-[#b83280]"
        >
          NeAlsam
        </Link>

        <nav className="flex flex-1 items-center gap-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-6 py-3 text-base font-bold transition ${
                  isActive
                    ? "bg-[#b83280] text-white"
                    : "bg-white text-[#2b1b1b] hover:bg-[#fff0f7] hover:text-[#b83280]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/giris"
            className={`ml-auto rounded-full px-6 py-3 text-base font-bold transition ${
              pathname === "/giris"
                ? "bg-[#b83280] text-white"
                : "bg-[#fff0f7] text-[#b83280] hover:bg-[#b83280] hover:text-white"
            }`}
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
