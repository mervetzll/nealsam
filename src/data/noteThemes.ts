export type NoteTheme = {
  id: string;
  name: string;
  cardClass: string;
  accentClass: string;
};

export const noteThemes: NoteTheme[] = [
  {
    id: "pink-flowers",
    name: "Pembe Çiçek",
    cardClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(255,182,193,0.45),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,192,203,0.35),_transparent_28%),linear-gradient(135deg,#fff8fb,#ffeef5,#fff9fc)]",
    accentClass: "text-pink-700",
  },
  {
    id: "soft-rose",
    name: "Soft Gül",
    cardClass:
      "bg-[linear-gradient(135deg,#fff5f7_0%,#ffe3ec_50%,#fff7fa_100%)]",
    accentClass: "text-rose-700",
  },
  {
    id: "lavender-dream",
    name: "Lavanta",
    cardClass:
      "bg-[linear-gradient(135deg,#f8f4ff_0%,#efe4ff_45%,#fff8ff_100%)]",
    accentClass: "text-purple-700",
  },
  {
    id: "peach-blush",
    name: "Şeftali",
    cardClass:
      "bg-[linear-gradient(135deg,#fff7f1_0%,#ffe5d6_50%,#fffaf5_100%)]",
    accentClass: "text-orange-700",
  },
  {
    id: "sky-love",
    name: "Gökyüzü",
    cardClass:
      "bg-[linear-gradient(135deg,#f3fbff_0%,#dff4ff_50%,#f9fdff_100%)]",
    accentClass: "text-sky-700",
  },
  {
    id: "mint-breeze",
    name: "Mint",
    cardClass:
      "bg-[linear-gradient(135deg,#f3fff9_0%,#daf7ea_50%,#fbfffd_100%)]",
    accentClass: "text-emerald-700",
  },
  {
    id: "golden-light",
    name: "Altın Işık",
    cardClass:
      "bg-[linear-gradient(135deg,#fffdf4_0%,#fff1c9_45%,#fffaf0_100%)]",
    accentClass: "text-amber-700",
  },
  {
    id: "romantic-heart",
    name: "Romantik",
    cardClass:
      "bg-[radial-gradient(circle_at_20%_20%,_rgba(255,182,193,0.35),_transparent_24%),radial-gradient(circle_at_80%_30%,_rgba(255,105,180,0.18),_transparent_22%),linear-gradient(135deg,#fff7fb,#ffe8f2,#fff9fc)]",
    accentClass: "text-pink-800",
  },
  {
    id: "clean-white",
    name: "Temiz Beyaz",
    cardClass:
      "bg-[linear-gradient(135deg,#ffffff_0%,#fff8fb_50%,#ffffff_100%)]",
    accentClass: "text-neutral-700",
  },
  {
    id: "night-love",
    name: "Gece Işığı",
    cardClass:
      "bg-[linear-gradient(135deg,#2e2236_0%,#4f3458_50%,#6d4b76_100%)]",
    accentClass: "text-pink-100",
  },
  {
    id: "berry",
    name: "Berry",
    cardClass:
      "bg-[linear-gradient(135deg,#fff0f6_0%,#ffd7eb_50%,#fff8fb_100%)]",
    accentClass: "text-fuchsia-700",
  },
  {
    id: "aqua-soft",
    name: "Aqua",
    cardClass:
      "bg-[linear-gradient(135deg,#f2ffff_0%,#d9fbff_50%,#f8ffff_100%)]",
    accentClass: "text-cyan-700",
  },
  {
    id: "coffee-note",
    name: "Kahve",
    cardClass:
      "bg-[linear-gradient(135deg,#fff8f3_0%,#f0dfd1_50%,#fffdfb_100%)]",
    accentClass: "text-stone-700",
  },
  {
    id: "sunset",
    name: "Gün Batımı",
    cardClass:
      "bg-[linear-gradient(135deg,#fff3f0_0%,#ffd9cc_45%,#fff7f2_100%)]",
    accentClass: "text-red-700",
  },
  {
    id: "fairy",
    name: "Masalsı",
    cardClass:
      "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_20%),linear-gradient(135deg,#fff7ff_0%,#f4e8ff_45%,#fffafd_100%)]",
    accentClass: "text-violet-700",
  },

  {
    id: "navy-minimal",
    name: "Lacivert Minimal",
    cardClass:
      "bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#334155_100%)]",
    accentClass: "text-sky-100",
  },
  {
    id: "black-gold",
    name: "Siyah Gold",
    cardClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.22),_transparent_30%),linear-gradient(135deg,#111827_0%,#1f2937_55%,#030712_100%)]",
    accentClass: "text-amber-100",
  },
  {
    id: "forest-calm",
    name: "Orman",
    cardClass:
      "bg-[linear-gradient(135deg,#052e2b_0%,#14532d_50%,#064e3b_100%)]",
    accentClass: "text-emerald-100",
  },
  {
    id: "tech-neon",
    name: "Tech Neon",
    cardClass:
      "bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.28),_transparent_28%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#111827_100%)]",
    accentClass: "text-cyan-100",
  },
  {
    id: "ocean-deep",
    name: "Derin Deniz",
    cardClass:
      "bg-[linear-gradient(135deg,#082f49_0%,#075985_45%,#0c4a6e_100%)]",
    accentClass: "text-blue-100",
  },
  {
    id: "graphite",
    name: "Grafit",
    cardClass:
      "bg-[linear-gradient(135deg,#27272a_0%,#3f3f46_50%,#18181b_100%)]",
    accentClass: "text-zinc-100",
  },
  {
    id: "leather-brown",
    name: "Deri Kahve",
    cardClass:
      "bg-[linear-gradient(135deg,#3f2415_0%,#7c4a2d_50%,#2b1710_100%)]",
    accentClass: "text-orange-100",
  },
  {
    id: "sport-red",
    name: "Sportif",
    cardClass:
      "bg-[linear-gradient(135deg,#111827_0%,#7f1d1d_48%,#1f2937_100%)]",
    accentClass: "text-red-100",
  },
  {
    id: "space-blue",
    name: "Uzay",
    cardClass:
      "bg-[radial-gradient(circle_at_20%_20%,_rgba(147,197,253,0.24),_transparent_22%),radial-gradient(circle_at_80%_30%,_rgba(196,181,253,0.18),_transparent_24%),linear-gradient(135deg,#020617_0%,#1e1b4b_50%,#0f172a_100%)]",
    accentClass: "text-indigo-100",
  },
  {
    id: "premium-cream",
    name: "Premium Sade",
    cardClass:
      "bg-[linear-gradient(135deg,#f8f4ed_0%,#e7d8c9_50%,#fffaf3_100%)]",
    accentClass: "text-stone-800",
  },
];
