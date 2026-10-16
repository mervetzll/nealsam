import Link from "next/link";
import Image from "next/image";

export default function GiftLogo({ small = false, href = "/" }: { small?: boolean; href?: string }) {
  return <Link href={href} aria-label="NeAlsam Hediye ana sayfa" className="inline-flex shrink-0 items-center gap-2">
    <Image src="/gift-icon.svg" alt="" width={small ? 34 : 40} height={small ? 34 : 40} />
    <span className="leading-tight"><span className="block text-base font-bold tracking-tight text-[#38252b]">NeAlsam</span><span className="block text-[10px] font-semibold tracking-wide text-[#b04f70]">Hediye</span></span>
  </Link>;
}
