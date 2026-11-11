"use client";

import { useEffect, useRef } from "react";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Endless scrolling strip of words. Speeds up while the page is scrolled,
 * and flips direction when scrolling up.
 */
export default function Marquee({ items, className = "" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastY = window.scrollY;
    let direction = 1;
    let boost = 0;
    let frame = 0;

    const tick = () => {
      const animation = track.getAnimations()[0];
      if (animation) {
        boost *= 0.92; // ease back to normal speed
        animation.playbackRate = direction * (1 + boost);
      }
      frame = boost > 0.02 ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (delta !== 0) direction = delta > 0 ? 1 : -1;
      boost = Math.min(6, boost + Math.abs(delta) / 25);
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Rendered twice so the -50% loop is seamless
  const row = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`} aria-label={items.join(", ")}>
      <div ref={trackRef} className="marquee-track" aria-hidden="true">
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
            <span>{item}</span>
            <span className="text-pink-400">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
