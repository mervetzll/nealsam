import Link from "next/link";
import Image from "next/image";

type GiftLogoProps = {
  small?: boolean;
  href?: string;
  /** "light" for dark backgrounds */
  tone?: "dark" | "light";
};

export default function GiftLogo({ small = false, href = "/", tone = "dark" }: GiftLogoProps) {
  const light = tone === "light";
  return (
    <Link href={href} className="group inline-flex shrink-0 items-center gap-2.5" aria-label="NeAlsam Hediye ana sayfa">
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 shadow-sm ring-1 ring-pink-200/60 transition-transform duration-500 group-hover:-rotate-12 ${
          small ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        <Image src="/gift-icon.svg" alt="" width={small ? 24 : 28} height={small ? 24 : 28} />
      </span>

      <span className="leading-none">
        <span className={`block font-black tracking-tight ${light ? "text-white" : "text-[#1f1212]"} ${small ? "text-[1.15rem]" : "text-xl"}`}>
          NeAlsam<span className={light ? "text-pink-400" : "text-pink-600"}>.</span>
        </span>
        <span className={`mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] ${light ? "text-pink-300" : "text-pink-600/80"}`}>
          Hediye
        </span>
      </span>
    </Link>
  );
}
