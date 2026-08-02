"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GiftLogo from "@/components/brand/GiftLogo";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/yardim", label: "Yardım" },
  { href: "/blog", label: "Rehber" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-[#eadede] bg-[#fff7f3]">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-4">
        <Link href="/" aria-label="NeAlsam ana sayfa" className="shrink-0">
          <GiftLogo small />
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-4 text-sm font-bold transition ${
                  active
                    ? "bg-[#b83280] text-white"
                    : "text-[#6b4b4b] hover:bg-[#fff0f7] hover:text-[#b83280]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/giris"
            className="flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#2b1b1b] px-4 text-sm font-bold text-white transition hover:opacity-90"
          >
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}
