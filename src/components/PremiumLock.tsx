"use client";

import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";

type PremiumLockProps = {
  title?: string;
  description?: string;
};

export default function PremiumLock({
  title = "Premium özellik",
  description = "Bu özellik Premium paket ile açılır.",
}: PremiumLockProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[1.75rem] bg-[#2b1b1b] p-6 text-white sm:flex-row sm:items-center md:p-7">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-pink-300">
        <Crown className="h-6 w-6" strokeWidth={1.75} />
      </span>

      <div className="flex-1">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
      </div>

      <Link
        href="/paketler"
        className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#2b1b1b] transition hover:bg-pink-50"
      >
        Paketleri incele
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
