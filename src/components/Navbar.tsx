"use client";

import Link from "next/link";
import GiftLogo from "@/components/brand/GiftLogo";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-[#fff4ef]/90 px-4 py-2 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <GiftLogo small />

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-[#5a3b3b] transition hover:bg-pink-50 hover:text-pink-700"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-pink-200 px-3 py-2 text-xs font-semibold lg:hidden">{menuOpen ? "Kapat ×" : "Menü ☰"}</button>
          {loggedIn ? (
            <>
              <Link
                href="/hesabim"
                className="rounded-full border border-pink-200 bg-white px-4 py-2 text-xs font-semibold text-pink-700 shadow-sm"
              >
                Hesabım
              </Link>

              <button
                onClick={logout}
                className="hidden rounded-full bg-[#1f1212] px-4 py-2 text-xs font-semibold text-white shadow-sm md:block"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              className="rounded-full bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-pink-700"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>

      {menuOpen && <div id="mobile-menu" className="mx-auto mt-3 grid max-w-7xl grid-cols-2 gap-2 pb-2 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-xl border border-pink-100 bg-white px-4 py-2 text-xs font-black text-[#5a3b3b]"
          >
            {link.label}
          </Link>
        ))}
      </div>}
    </header>
  );
}
