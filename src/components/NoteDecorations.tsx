type NoteDecorationsProps = {
  variant: string;
};

function isBoldTheme(variant: string) {
  return [
    "navy",
    "black",
    "forest",
    "tech",
    "ocean",
    "graphite",
    "leather",
    "sport",
    "space",
    "premium",
  ].some((item) => variant.includes(item));
}

function getPalette(variant: string) {
  if (variant.includes("navy") || variant.includes("ocean") || variant.includes("space")) {
    return {
      primary: "#38BDF8",
      secondary: "#93C5FD",
      soft: "rgba(255,255,255,0.14)",
      line: "rgba(255,255,255,0.36)",
    };
  }

  if (variant.includes("black") || variant.includes("graphite")) {
    return {
      primary: "#FBBF24",
      secondary: "#FDE68A",
      soft: "rgba(255,255,255,0.12)",
      line: "rgba(255,255,255,0.30)",
    };
  }

  if (variant.includes("forest")) {
    return {
      primary: "#34D399",
      secondary: "#A7F3D0",
      soft: "rgba(255,255,255,0.13)",
      line: "rgba(255,255,255,0.30)",
    };
  }

  if (variant.includes("tech")) {
    return {
      primary: "#22D3EE",
      secondary: "#A78BFA",
      soft: "rgba(34,211,238,0.18)",
      line: "rgba(125,211,252,0.42)",
    };
  }

  if (variant.includes("leather")) {
    return {
      primary: "#FDBA74",
      secondary: "#FED7AA",
      soft: "rgba(255,255,255,0.14)",
      line: "rgba(255,237,213,0.34)",
    };
  }

  if (variant.includes("sport")) {
    return {
      primary: "#F87171",
      secondary: "#FCA5A5",
      soft: "rgba(255,255,255,0.12)",
      line: "rgba(254,202,202,0.36)",
    };
  }

  if (variant.includes("premium")) {
    return {
      primary: "#A16207",
      secondary: "#D6A77A",
      soft: "rgba(255,255,255,0.44)",
      line: "rgba(120,113,108,0.28)",
    };
  }

  if (variant.includes("night")) {
    return {
      primary: "#F9A8D4",
      secondary: "#FDE68A",
      soft: "rgba(255,255,255,0.22)",
      line: "rgba(255,255,255,0.34)",
    };
  }

  if (variant.includes("mint")) {
    return {
      primary: "#F9A8D4",
      secondary: "#A7F3D0",
      soft: "rgba(255,255,255,0.45)",
      line: "rgba(244,114,182,0.25)",
    };
  }

  if (variant.includes("lavender") || variant.includes("fairy")) {
    return {
      primary: "#C084FC",
      secondary: "#F9A8D4",
      soft: "rgba(255,255,255,0.45)",
      line: "rgba(192,132,252,0.25)",
    };
  }

  if (variant.includes("golden") || variant.includes("sunset")) {
    return {
      primary: "#FB7185",
      secondary: "#FBBF24",
      soft: "rgba(255,255,255,0.48)",
      line: "rgba(251,113,133,0.25)",
    };
  }

  if (variant.includes("coffee")) {
    return {
      primary: "#D6A77A",
      secondary: "#F9A8D4",
      soft: "rgba(255,255,255,0.42)",
      line: "rgba(161,98,7,0.25)",
    };
  }

  return {
    primary: "#F472B6",
    secondary: "#FBCFE8",
    soft: "rgba(255,255,255,0.48)",
    line: "rgba(244,114,182,0.25)",
  };
}

function CuteFlower({
  className,
  primary,
  secondary,
}: {
  className: string;
  primary: string;
  secondary: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="26" r="22" fill={secondary} opacity="0.9" />
      <circle cx="60" cy="94" r="22" fill={secondary} opacity="0.9" />
      <circle cx="26" cy="60" r="22" fill={secondary} opacity="0.9" />
      <circle cx="94" cy="60" r="22" fill={secondary} opacity="0.9" />
      <circle cx="36" cy="36" r="18" fill={primary} opacity="0.72" />
      <circle cx="84" cy="36" r="18" fill={primary} opacity="0.72" />
      <circle cx="36" cy="84" r="18" fill={primary} opacity="0.72" />
      <circle cx="84" cy="84" r="18" fill={primary} opacity="0.72" />
      <circle cx="60" cy="60" r="20" fill="#FFF7ED" />
      <circle cx="60" cy="60" r="10" fill={primary} opacity="0.9" />
    </svg>
  );
}

function CuteHeart({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 100 90" className={className} aria-hidden="true">
      <path
        d="M50 82C18 56 8 41 8 25C8 12 18 4 30 4C39 4 46 10 50 18C54 10 61 4 70 4C82 4 92 12 92 25C92 41 82 56 50 82Z"
        fill={color}
        opacity="0.82"
      />
      <path
        d="M32 19C25 19 20 24 20 31"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function CuteBow({
  className,
  primary,
  secondary,
}: {
  className: string;
  primary: string;
  secondary: string;
}) {
  return (
    <svg viewBox="0 0 130 90" className={className} aria-hidden="true">
      <path
        d="M60 45C35 12 12 15 8 35C4 58 34 66 60 45Z"
        fill={secondary}
        opacity="0.88"
      />
      <path
        d="M70 45C95 12 118 15 122 35C126 58 96 66 70 45Z"
        fill={secondary}
        opacity="0.88"
      />
      <circle cx="65" cy="45" r="13" fill={primary} />
      <path d="M55 57L42 86" stroke={primary} strokeWidth="9" strokeLinecap="round" opacity="0.8" />
      <path d="M75 57L88 86" stroke={primary} strokeWidth="9" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function BoldRing({
  className,
  primary,
  secondary,
}: {
  className: string;
  primary: string;
  secondary: string;
}) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden="true">
      <circle cx="70" cy="70" r="48" fill="none" stroke={primary} strokeWidth="12" opacity="0.7" />
      <circle cx="70" cy="70" r="24" fill="none" stroke={secondary} strokeWidth="8" opacity="0.55" />
      <circle cx="110" cy="35" r="9" fill={secondary} opacity="0.75" />
    </svg>
  );
}

function BoldGrid({
  className,
  line,
}: {
  className: string;
  line: string;
}) {
  return (
    <svg viewBox="0 0 220 140" className={className} aria-hidden="true">
      <path d="M10 25H210M10 70H210M10 115H210" stroke={line} strokeWidth="3" />
      <path d="M35 10V130M85 10V130M135 10V130M185 10V130" stroke={line} strokeWidth="3" />
    </svg>
  );
}

function BoldBolt({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <path
        d="M58 4L18 70H48L38 126L84 52H54L58 4Z"
        fill={color}
        opacity="0.72"
      />
    </svg>
  );
}

function BoldWave({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg viewBox="0 0 260 90" className={className} aria-hidden="true">
      <path
        d="M8 48C38 10 68 10 98 48C128 86 158 86 188 48C210 20 232 12 252 22"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.58"
      />
      <path
        d="M12 68C42 38 74 38 104 68C134 98 164 98 194 68C216 46 236 42 252 48"
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

function Sparkle({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M50 6L61 38L94 50L61 62L50 94L39 62L6 50L39 38L50 6Z"
        fill={color}
        opacity="0.72"
      />
      <circle cx="24" cy="22" r="6" fill="white" opacity="0.58" />
      <circle cx="78" cy="76" r="5" fill="white" opacity="0.58" />
    </svg>
  );
}

function CuteDecorations({
  palette,
}: {
  palette: ReturnType<typeof getPalette>;
}) {
  return (
    <>
      <CuteFlower
        className="absolute left-5 top-5 h-24 w-24 rotate-[-10deg] opacity-75 md:h-32 md:w-32"
        primary={palette.primary}
        secondary={palette.secondary}
      />

      <CuteBow
        className="absolute right-5 top-8 h-20 w-28 rotate-[12deg] opacity-70 md:h-24 md:w-36"
        primary={palette.primary}
        secondary={palette.secondary}
      />

      <CuteHeart
        className="absolute bottom-8 right-8 h-20 w-20 rotate-[10deg] opacity-70 md:h-28 md:w-28"
        color={palette.primary}
      />

      <Sparkle
        className="absolute bottom-10 left-10 h-16 w-16 rotate-12 opacity-70 md:h-24 md:w-24"
        color={palette.secondary}
      />
    </>
  );
}

function BoldDecorations({
  palette,
}: {
  palette: ReturnType<typeof getPalette>;
}) {
  return (
    <>
      <BoldGrid
        className="absolute -right-10 top-8 h-36 w-56 rotate-6 opacity-50 md:h-44 md:w-72"
        line={palette.line}
      />

      <BoldRing
        className="absolute -left-6 top-8 h-32 w-32 rotate-12 opacity-75 md:h-44 md:w-44"
        primary={palette.primary}
        secondary={palette.secondary}
      />

      <BoldBolt
        className="absolute bottom-8 right-10 h-24 w-20 rotate-12 opacity-65 md:h-32 md:w-28"
        color={palette.primary}
      />

      <BoldWave
        className="absolute bottom-6 left-8 h-20 w-56 opacity-60 md:h-24 md:w-72"
        color={palette.secondary}
      />

      <Sparkle
        className="absolute left-1/2 top-6 h-14 w-14 -translate-x-1/2 rotate-12 opacity-60 md:h-20 md:w-20"
        color={palette.secondary}
      />
    </>
  );
}

export default function NoteDecorations({ variant }: NoteDecorationsProps) {
  const palette = getPalette(variant);
  const bold = isBoldTheme(variant);

  return (
    <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      <div
        className="absolute -left-20 top-16 h-56 w-56 rounded-full blur-3xl"
        style={{ background: palette.soft }}
      />

      <div
        className="absolute -right-24 bottom-14 h-64 w-64 rounded-full blur-3xl"
        style={{ background: palette.soft }}
      />

      {bold ? (
        <BoldDecorations palette={palette} />
      ) : (
        <CuteDecorations palette={palette} />
      )}

      <div className="absolute left-[18%] top-[38%] h-3 w-3 rounded-full bg-white/60" />
      <div className="absolute right-[22%] top-[34%] h-2.5 w-2.5 rounded-full bg-white/60" />
      <div className="absolute bottom-[28%] left-[28%] h-2 w-2 rounded-full bg-white/60" />
      <div className="absolute bottom-[32%] right-[34%] h-3 w-3 rounded-full bg-white/60" />
    </div>
  );
}
