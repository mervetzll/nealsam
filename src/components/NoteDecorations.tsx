type NoteDecorationsProps = {
  variant: string;
};

function getPalette(variant: string) {
  if (variant.includes("night")) {
    return {
      primary: "#F9A8D4",
      secondary: "#FDE68A",
      soft: "rgba(255,255,255,0.22)",
      leaf: "#C4B5FD",
    };
  }

  if (variant.includes("mint")) {
    return {
      primary: "#F9A8D4",
      secondary: "#A7F3D0",
      soft: "rgba(255,255,255,0.45)",
      leaf: "#34D399",
    };
  }

  if (variant.includes("lavender") || variant.includes("fairy")) {
    return {
      primary: "#C084FC",
      secondary: "#F9A8D4",
      soft: "rgba(255,255,255,0.45)",
      leaf: "#A78BFA",
    };
  }

  if (variant.includes("golden") || variant.includes("sunset")) {
    return {
      primary: "#FB7185",
      secondary: "#FBBF24",
      soft: "rgba(255,255,255,0.48)",
      leaf: "#F59E0B",
    };
  }

  if (variant.includes("coffee")) {
    return {
      primary: "#D6A77A",
      secondary: "#F9A8D4",
      soft: "rgba(255,255,255,0.42)",
      leaf: "#A16207",
    };
  }

  return {
    primary: "#F472B6",
    secondary: "#FBCFE8",
    soft: "rgba(255,255,255,0.48)",
    leaf: "#86EFAC",
  };
}

function Flower({
  className,
  primary,
  secondary,
}: {
  className: string;
  primary: string;
  secondary: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      <circle cx="60" cy="26" r="22" fill={secondary} opacity="0.9" />
      <circle cx="60" cy="94" r="22" fill={secondary} opacity="0.9" />
      <circle cx="26" cy="60" r="22" fill={secondary} opacity="0.9" />
      <circle cx="94" cy="60" r="22" fill={secondary} opacity="0.9" />
      <circle cx="36" cy="36" r="18" fill={primary} opacity="0.75" />
      <circle cx="84" cy="36" r="18" fill={primary} opacity="0.75" />
      <circle cx="36" cy="84" r="18" fill={primary} opacity="0.75" />
      <circle cx="84" cy="84" r="18" fill={primary} opacity="0.75" />
      <circle cx="60" cy="60" r="20" fill="#FFF7ED" />
      <circle cx="60" cy="60" r="10" fill={primary} opacity="0.9" />
    </svg>
  );
}

function Heart({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 100 90"
      className={className}
      aria-hidden="true"
    >
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

function Bow({
  className,
  primary,
  secondary,
}: {
  className: string;
  primary: string;
  secondary: string;
}) {
  return (
    <svg
      viewBox="0 0 130 90"
      className={className}
      aria-hidden="true"
    >
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
      <path
        d="M55 57L42 86"
        stroke={primary}
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M75 57L88 86"
        stroke={primary}
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

function Sparkle({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 6L61 38L94 50L61 62L50 94L39 62L6 50L39 38L50 6Z"
        fill={color}
        opacity="0.78"
      />
      <circle cx="24" cy="22" r="6" fill="white" opacity="0.72" />
      <circle cx="78" cy="76" r="5" fill="white" opacity="0.72" />
    </svg>
  );
}

function Leaf({
  className,
  color,
}: {
  className: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 62C40 10 84 4 108 14C98 48 62 76 12 62Z"
        fill={color}
        opacity="0.55"
      />
      <path
        d="M28 58C50 42 74 28 100 16"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

export default function NoteDecorations({ variant }: NoteDecorationsProps) {
  const palette = getPalette(variant);

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

      <Flower
        className="absolute left-5 top-5 h-24 w-24 rotate-[-10deg] opacity-75 md:h-32 md:w-32"
        primary={palette.primary}
        secondary={palette.secondary}
      />

      <Bow
        className="absolute right-5 top-8 h-20 w-28 rotate-[12deg] opacity-70 md:h-24 md:w-36"
        primary={palette.primary}
        secondary={palette.secondary}
      />

      <Heart
        className="absolute bottom-8 right-8 h-20 w-20 rotate-[10deg] opacity-70 md:h-28 md:w-28"
        color={palette.primary}
      />

      <Sparkle
        className="absolute bottom-10 left-10 h-16 w-16 rotate-12 opacity-70 md:h-24 md:w-24"
        color={palette.secondary}
      />

      <Leaf
        className="absolute left-1/2 top-5 h-16 w-28 -translate-x-1/2 rotate-[-8deg] opacity-55 md:h-20 md:w-36"
        color={palette.leaf}
      />

      <div className="absolute left-[18%] top-[38%] h-3 w-3 rounded-full bg-white/70" />
      <div className="absolute right-[22%] top-[34%] h-2.5 w-2.5 rounded-full bg-white/70" />
      <div className="absolute bottom-[28%] left-[28%] h-2 w-2 rounded-full bg-white/70" />
      <div className="absolute bottom-[32%] right-[34%] h-3 w-3 rounded-full bg-white/70" />
    </div>
  );
}
