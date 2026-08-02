import Link from "next/link";

type GiftLogoProps = {
  small?: boolean;
  href?: string;
};

export default function GiftLogo({ small = false, href = "/" }: GiftLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-pink-100 shadow-sm ${
          small ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <img
          src="/gift-icon.svg"
          alt="NeAlsam Hediye logosu"
          className={small ? "h-7 w-7" : "h-8 w-8"}
        />
      </span>

      <span className="leading-tight">
        <span
          className={`block font-black text-[#2b1b1b] ${
            small ? "text-lg" : "text-xl"
          }`}
        >
          NeAlsam
        </span>
        <span className="block text-xs font-semibold text-pink-600">
          Hediye
        </span>
      </span>
    </Link>
  );
}
