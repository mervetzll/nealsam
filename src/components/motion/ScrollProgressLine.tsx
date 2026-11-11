"use client";

import { useEffect, useRef } from "react";

/**
 * A line that fills as its parent section scrolls through the viewport.
 * Place inside a `relative` container; it stretches across it.
 */
export default function ScrollProgressLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const container = el?.parentElement;
    if (!el || !container) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section top hits 85% of viewport, 1 when its bottom reaches 55%
      const start = vh * 0.85;
      const end = vh * 0.55;
      const total = start - end + rect.height;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / total));
      el.style.setProperty("--progress", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="h-full w-full rounded-full bg-pink-100" />
      <div
        className="absolute inset-0 origin-left rounded-full bg-pink-600 md:origin-left"
        style={{ transform: "scaleX(var(--progress, 0))" }}
      />
    </div>
  );
}
