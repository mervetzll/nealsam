"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (active) {
        setLoggedIn(Boolean(session));
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const links = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/hediye-bul", label: "Hediye Bul" },
    { href: "/deneyim", label: "Deneyim" },
    { href: "/hediye-araclari", label: "Hediye Araçları" },
    { href: "/blog", label: "Rehber / Blog" },
    { href: "/paketler", label: "Paketler" },
    { href: "/yardim", label: "Yardım" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-[#fff4ef]/90 px-4 py-3 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-xl">
            🎁
          </div>

          <div className="leading-tight">
            <p className="text-lg font-black text-[#2b1b1b]">NeAlsam</p>
            <p className="text-xs font-black text-pink-600">Hediye</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-pink-100 bg-white px-4 py-3 text-sm font-black text-[#5a3b3b] shadow-sm transition hover:bg-pink-50 hover:text-pink-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {loggedIn ? (
            <>
              <Link
                href="/hesabim"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 shadow-sm"
              >
                Hesabım
              </Link>

              <button
                onClick={logout}
                className="hidden rounded-full bg-[#1f1212] px-5 py-3 text-sm font-black text-white shadow-sm md:block"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-pink-700"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      <div className="mx-auto mt-3 flex max-w-7xl gap-2 overflow-x-auto pb-1 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-black text-[#5a3b3b]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
