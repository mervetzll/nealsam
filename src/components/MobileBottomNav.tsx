import Link from "next/link";

const items = [
  { href: "/", label: "Ana Sayfa", icon: "⌂" },
  { href: "/hediye-bul", label: "Hediye Bul", icon: "🎁" },
  { href: "/hesabim/favoriler", label: "Favoriler", icon: "♡" },
  { href: "/hesabim", label: "Hesabım", icon: "☻" },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100 bg-white/95 px-3 py-2 shadow-[0_-8px_30px_rgba(43,27,27,0.08)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-center text-[11px] font-black text-[#6b4a4a] transition active:bg-pink-50"
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="mt-1 leading-none">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
