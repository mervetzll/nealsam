"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import GiftLogo from "@/components/brand/GiftLogo";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  { href: "/deneyim", label: "Deneyim" },
  { href: "/paketler", label: "Paketler" },
  { href: "/blog", label: "Rehber / Blog" },
  { href: "/yardim", label: "Yardım" },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(user);
        setLoaded(true);
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoaded(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

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

        <div className="hidden items-center gap-2 md:flex">
          {!loaded ? (
            <span className="rounded-full border border-pink-100 bg-white px-4 py-2 text-sm font-black text-[#6b4a4a] shadow-sm">
              Yükleniyor
            </span>
          ) : user ? (
            <>
              <Link
                href="/hesabim"
                className="rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-black text-pink-700 shadow-sm transition hover:bg-pink-100"
                title={user.email || "Hesabım"}
              >
                Hesabım
              </Link>

              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      <div className="border-t border-pink-50 bg-[#fff4ef] px-5 py-2 md:hidden">
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

          {user ? (
            <>
              <Link
                href="/hesabim"
                className="whitespace-nowrap rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-black text-pink-700 shadow-sm"
              >
                Hesabım
              </Link>

              <button
                type="button"
                onClick={logout}
                className="whitespace-nowrap rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-black text-white shadow-sm"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="whitespace-nowrap rounded-full bg-pink-600 px-4 py-2 text-xs font-black text-white shadow-sm"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
