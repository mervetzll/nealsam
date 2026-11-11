"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { supabase } from "@/lib/supabase";

const links = [
  { href: "/deneyim", label: "QR Deneyim" },
  { href: "/hediye-paketi", label: "Paket Oluştur" },
  { href: "/hediye-araclari", label: "Araçlar" },
  { href: "/paketler", label: "Premium" },
  { href: "/blog", label: "Rehber" },
  { href: "/yardim", label: "Yardım" },
];

const mobileLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hediye-bul", label: "Hediye Bul" },
  ...links,
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const [loggedIn, setLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The menu belongs to the page it was opened on, so navigating closes it
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const progressRef = useRef<HTMLDivElement>(null);

  // Auth state
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setLoggedIn(Boolean(session));
    });

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

  // Scroll: compact pill, hide on scroll down, reading progress
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > 12);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
      progressRef.current?.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuPath(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const compact = scrolled && !menuOpen;

  return (
    <header
      className={`sticky top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden && !menuOpen ? "-translate-y-[120%]" : ""
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          compact ? "max-w-6xl px-3 pt-3" : "max-w-7xl px-4 pt-4 md:px-5"
        }`}
      >
        <nav
          className={`relative flex items-center justify-between gap-4 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            compact
              ? "rounded-full border border-pink-100/80 bg-white/75 py-2 pl-3 pr-2 shadow-lg shadow-pink-200/30 backdrop-blur-xl"
              : "rounded-3xl border border-transparent bg-transparent py-2 pl-1 pr-1"
          }`}
          aria-label="Ana menü"
        >
          <Logo />

          <DesktopLinks pathname={pathname} />

          <div className="flex items-center gap-2">
            {loggedIn ? (
              <>
                <Link
                  href="/hesabim"
                  className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-[#5a3b3b] transition hover:text-pink-700 sm:inline-flex"
                >
                  Hesabım
                </Link>
                <button
                  onClick={logout}
                  className="hidden rounded-full px-3 py-2.5 text-sm font-bold text-[#8a6a6a] transition hover:text-[#1f1212] lg:inline-flex"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                href="/giris"
                className="hidden rounded-full px-4 py-2.5 text-sm font-bold text-[#5a3b3b] transition hover:text-pink-700 sm:inline-flex"
              >
                Giriş Yap
              </Link>
            )}

            <Link
              href="/hediye-bul"
              className="group inline-flex items-center gap-2 rounded-full bg-[#1f1212] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#1f1212]/20 transition hover:bg-pink-600 hover:shadow-pink-600/30"
            >
              Hediye Bul
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuPath(menuOpen ? null : pathname)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1f1212] shadow-sm ring-1 ring-pink-100 lg:hidden"
            >
              <span
                className={`absolute h-0.5 w-4 rounded bg-current transition-transform duration-300 ${
                  menuOpen ? "rotate-45" : "-translate-y-[5px]"
                }`}
              />
              <span
                className={`absolute h-0.5 w-4 rounded bg-current transition-transform duration-300 ${
                  menuOpen ? "-rotate-45" : "translate-y-[5px]"
                }`}
              />
            </button>
          </div>

          {/* Reading progress */}
          <div
            ref={progressRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-opacity duration-300 ${
              compact ? "opacity-100" : "opacity-0"
            }`}
            style={{ transform: "scaleX(var(--p, 0))" } as CSSProperties}
          />
        </nav>
      </div>

      <MobileMenu
        open={menuOpen}
        pathname={pathname}
        loggedIn={loggedIn}
        onLogout={logout}
      />
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NeAlsam Hediye ana sayfa">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 shadow-sm ring-1 ring-pink-200/60 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-105">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/gift-icon.svg" alt="" className="h-6 w-6" />
      </span>
      <span className="leading-none">
        <span className="block text-[1.15rem] font-black tracking-tight text-[#1f1212]">
          NeAlsam<span className="text-pink-600">.</span>
        </span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-pink-600/80">
          Hediye
        </span>
      </span>
    </Link>
  );
}

/** Desktop links with a pill that slides to the hovered / active item. */
function DesktopLinks({ pathname }: { pathname: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });

  const activeIndex = links.findIndex((l) => isActive(pathname, l.href));
  const target = hovered ?? (activeIndex >= 0 ? activeIndex : null);

  const measure = useCallback(() => {
    const el = target !== null ? itemRefs.current[target] : null;
    if (!el) {
      setPill((p) => ({ ...p, visible: false }));
      return;
    }
    setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
  }, [target]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div
      ref={listRef}
      onMouseLeave={() => setHovered(null)}
      className="relative hidden items-center lg:flex"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0 h-full rounded-full bg-pink-100/70 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          pill.visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: pill.left, width: pill.width }}
      />
      {links.map((link, i) => {
        const active = i === activeIndex;
        return (
          <Link
            key={link.href}
            href={link.href}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onMouseEnter={() => setHovered(i)}
            aria-current={active ? "page" : undefined}
            className={`relative z-10 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${
              active ? "text-pink-700" : "text-[#5a3b3b] hover:text-[#1f1212]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

function MobileMenu({
  open,
  pathname,
  loggedIn,
  onLogout,
}: {
  open: boolean;
  pathname: string;
  loggedIn: boolean;
  onLogout: () => void;
}) {
  return (
    <div
      id="mobile-menu"
      className={`fixed inset-x-0 bottom-0 top-[72px] z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-[#fff4ef]/95 backdrop-blur-xl transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav className="relative mx-auto flex h-full max-w-lg flex-col px-6 pb-28 pt-4" aria-label="Mobil menü">
        <ul className="flex flex-col">
          {mobileLinks.map((link, i) => {
            const active = isActive(pathname, link.href);
            return (
              <li
                key={link.href}
                className={`border-b border-pink-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  className={`flex items-center justify-between py-4 text-2xl font-black tracking-tight ${
                    active ? "text-pink-600" : "text-[#1f1212]"
                  }`}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-base text-pink-400">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div
          className={`mt-8 flex gap-3 transition-all delay-300 duration-500 ${
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {loggedIn ? (
            <>
              <Link
                href="/hesabim"
                tabIndex={open ? 0 : -1}
                className="flex-1 rounded-full bg-white py-3.5 text-center text-sm font-bold text-pink-700 ring-1 ring-pink-100"
              >
                Hesabım
              </Link>
              <button
                onClick={onLogout}
                tabIndex={open ? 0 : -1}
                className="flex-1 rounded-full bg-[#1f1212] py-3.5 text-sm font-bold text-white"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link
              href="/giris"
              tabIndex={open ? 0 : -1}
              className="flex-1 rounded-full bg-pink-600 py-3.5 text-center text-sm font-bold text-white"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
