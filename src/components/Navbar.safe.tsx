"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Hediye Bul", href: "/hediye-bul" },
  { label: "Deneyim", href: "/deneyim" },
  { label: "Paketler", href: "/paketler" },
  { label: "Yardım", href: "/yardim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("nealsam_user")));
  }, [pathname]);

  return (
    <nav className="mx-auto mb-8 flex max-w-6xl flex-col gap-4 px-4 pt-5 text-[#2b1b1b] sm:px-6 md:flex-row md:items-center md:justify-between">
      <Link href="/" className="text-3xl font-black text-[#b83280]">
        NeAlsam
      </Link>

      <div className="flex gap-2 overflow-x-auto pb-2 text-sm font-bold md:flex-wrap md:overflow-visible md:pb-0">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-4 py-3 transition ${
                isActive
                  ? "bg-[#b83280] text-white"
                  : "bg-white text-[#2b1b1b] hover:bg-[#fff0f7]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        <Link
          href={isLoggedIn ? "/hesabim" : "/giris"}
          className={`shrink-0 rounded-full px-4 py-3 transition ${
            pathname.startsWith("/hesabim") || pathname.startsWith("/giris")
              ? "bg-[#2b1b1b] text-white"
              : "bg-[#fff0f7] text-[#b83280] hover:bg-white"
          }`}
        >
          {isLoggedIn ? "Hesabım" : "Giriş Yap"}
        </Link>
      </div>
    </nav>
  );
}
