"use client";

import Link from "next/link";

type PremiumLockProps = {
  title?: string;
  description?: string;
};

export default function PremiumLock({
  title = "Premium özellik",
  description = "Bu özellik Premium paket ile açılır.",
}: PremiumLockProps) {
  return (
    <div className="rounded-[1.5rem] border border-pink-100 bg-[#fff0f7] p-5">
      <p className="text-xs font-black uppercase tracking-wide text-pink-600">
        Premium
      </p>

      <h3 className="mt-2 text-xl font-black text-[#2b1b1b]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
        {description}
      </p>

      <Link
        href="/paketler"
        className="mt-4 inline-flex rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
      >
        Paketleri İncele
      </Link>
    </div>
  );
}
