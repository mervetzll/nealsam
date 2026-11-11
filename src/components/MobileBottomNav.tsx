"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, House, User } from "lucide-react";

const items = [
  { href: "/", label: "Ana Sayfa", icon: House },
  { href: "/hediye-bul", label: "Hediye Bul", icon: null },
  { href: "/hesabim/favoriler", label: "Favoriler", icon: Heart },
  { href: "/hesabim", label: "Hesabım", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const activeHref = items
    .filter((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav
      aria-label="Alt menü"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100 bg-white/90 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(43,27,27,0.06)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-bold transition ${
                active ? "text-pink-600" : "text-[#8a6a6a] active:bg-pink-50"
              }`}
            >
              {Icon ? (
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              ) : (
                <Image src="/gift-icon.svg" alt="" width={20} height={20} className="h-5 w-5" />
              )}
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
