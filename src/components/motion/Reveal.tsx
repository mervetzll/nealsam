"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Variant = "up" | "left" | "right" | "scale" | "blur";

type RevealProps = {
  children: ReactNode;
  variant?: Variant;
  /** Delay in ms before the animation starts once visible */
  delay?: number;
  className?: string;
  /** Re-hide when it leaves the viewport so it animates again */
  repeat?: boolean;
};

/**
 * Fades/slides its children in when they scroll into view.
 * Styles live in globals.css (.reveal, .reveal-*, .is-visible).
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          if (!repeat) observer.unobserve(el);
        } else if (repeat) {
          el.classList.remove("is-visible");
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
