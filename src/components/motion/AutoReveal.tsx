"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Adds scroll-reveal animations to every page automatically, without
 * editing each page:
 *  - children of `.grid` containers fade up with a stagger
 *  - h1 / h2 headings fade in from a blur
 *  - sections / articles without grids fade up as a whole
 *
 * Opt out: put `data-no-reveal` on any element (or its ancestor).
 * Elements already using <Reveal> (class `.reveal`) are left alone.
 * Once revealed, the helper classes are removed so the element's own
 * transitions (hover etc.) work exactly as before.
 */

const SKIP_ROUTES = ["/admin"];
const DONE = "data-auto-reveal";
const SKIP = "[data-no-reveal], .reveal, [data-auto-reveal]";

function collectTargets(main: HTMLElement) {
  const targets: { el: HTMLElement; variant: string; delay: number }[] = [];
  const taken = new Set<HTMLElement>();

  const usable = (el: HTMLElement) => {
    if (el.hasAttribute(DONE) || el.closest(SKIP)) return false;
    // Skip if an ancestor is already being revealed in this pass
    for (let p = el.parentElement; p && p !== main; p = p.parentElement) {
      if (taken.has(p)) return false;
    }
    return true;
  };

  const add = (el: HTMLElement, variant: string, delay = 0) => {
    if (!usable(el)) return;
    taken.add(el);
    targets.push({ el, variant, delay });
  };

  // 1) Headings first so they're not swallowed by a section-level reveal
  main.querySelectorAll<HTMLElement>("h1, h2").forEach((el) => {
    if (!el.closest(".grid")) add(el, "blur");
  });

  // 2) Grid children with stagger
  main.querySelectorAll<HTMLElement>(".grid").forEach((grid) => {
    if (grid.closest(SKIP)) return;
    Array.from(grid.children).forEach((child, i) => {
      if (child instanceof HTMLElement) add(child, "up", Math.min(i, 5) * 90);
    });
  });

  // 3) Plain sections / articles that have no grid inside
  main.querySelectorAll<HTMLElement>("section, article").forEach((el) => {
    if (el.querySelector(".grid")) return;
    if (el.querySelector("h1, h2")) return; // heading already animates
    add(el, "up");
  });

  return targets;
}

export default function AutoReveal() {
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (SKIP_ROUTES.some((r) => pathname.startsWith(r))) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;

    const cleanups = new Set<number>();

    const finish = (el: HTMLElement) => {
      el.classList.remove("reveal", "reveal-up", "reveal-blur", "is-visible");
      el.style.removeProperty("--reveal-delay");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add("is-visible");
          const delay = parseInt(el.style.getPropertyValue("--reveal-delay")) || 0;
          const t = window.setTimeout(() => {
            cleanups.delete(t);
            finish(el);
          }, delay + 900);
          cleanups.add(t);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );

    // On first paint, content already on screen is left as-is (the page-enter
    // fade in globals.css covers it) so nothing flickers after hydration.
    const scan = (initial: boolean) => {
      collectTargets(main).forEach(({ el, variant, delay }) => {
        el.setAttribute(DONE, "");
        if (initial && el.getBoundingClientRect().top < window.innerHeight) return;
        el.classList.add("reveal", `reveal-${variant}`);
        el.style.setProperty("--reveal-delay", `${delay}ms`);
        observer.observe(el);
      });
    };

    scan(true);

    // Pick up content rendered later (quiz steps, fetched lists, …).
    // rAF runs before the next paint, so new content never flashes.
    let pending = 0;
    const mutations = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan(false);
      });
    });
    mutations.observe(main, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      cancelAnimationFrame(pending);
      cleanups.forEach((t) => window.clearTimeout(t));
      // Never leave anything hidden behind
      main.querySelectorAll<HTMLElement>(`[${DONE}]`).forEach((el) => {
        finish(el);
        el.removeAttribute(DONE);
      });
    };
  }, [pathname]);

  return null;
}
