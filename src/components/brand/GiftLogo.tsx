import Link from "next/link";

type GiftLogoProps = {
  small?: boolean;
  href?: string;
};

export default function GiftLogo({ small = false, href = "/" }: GiftLogoProps) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5" aria-label="NeAlsam Hediye ana sayfa">
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 shadow-sm ring-1 ring-pink-200/60 transition-transform duration-500 group-hover:-rotate-12 ${
          small ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/gift-icon.svg" alt="" className={small ? "h-6 w-6" : "h-7 w-7"} />
      </span>

      <span className="leading-none">
        <span className={`block font-black tracking-tight text-[#1f1212] ${small ? "text-[1.15rem]" : "text-xl"}`}>
          NeAlsam<span className="text-pink-600">.</span>
        </span>
        <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.28em] text-pink-600/80">
          Hediye
        </span>
      </span>
    </Link>
  );
}
