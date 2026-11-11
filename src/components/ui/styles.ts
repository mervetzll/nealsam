/**
 * Shared class names for the site's design language.
 * Colours: blush background (#fff4ef), ink (#2b1b1b), pink accent (pink-600).
 * Headlines use the serif display font automatically (h1/h2 in globals.css).
 */

export const ui = {
  /** Raised white surface */
  card: "rounded-[1.75rem] bg-white ring-1 ring-pink-100",
  /** Card that lifts on hover (for links/buttons) */
  cardInteractive:
    "rounded-[1.75rem] bg-white ring-1 ring-pink-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-900/5 hover:ring-pink-200",
  /** Soft tinted block inside a card */
  inset: "rounded-2xl bg-[#fff8f5]",

  eyebrow: "text-xs font-bold uppercase tracking-[0.2em] text-pink-600",
  muted: "text-[#6b4a4a]",

  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700 disabled:opacity-50",
  btnDark:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#2b1b1b] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#2b1b1b] ring-1 ring-pink-200 transition hover:bg-pink-50 hover:ring-pink-300 disabled:opacity-50",
  btnLink:
    "inline-flex items-center gap-1.5 text-sm font-bold text-[#2b1b1b] underline decoration-pink-300 decoration-2 underline-offset-[6px] transition hover:decoration-pink-600",

  /** Small neutral tag */
  tag: "inline-flex items-center gap-1.5 rounded-full bg-[#fff4ef] px-3 py-1.5 text-xs font-bold text-[#6b4a4a]",
  /** Small accent tag */
  tagAccent: "inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-bold text-pink-700 ring-1 ring-pink-100",

  input:
    "w-full rounded-2xl bg-white px-4 py-3.5 text-[15px] text-[#2b1b1b] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:ring-2 focus:ring-pink-400",
} as const;
