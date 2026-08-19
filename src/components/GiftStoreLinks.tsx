"use client";

import type { GiftLike } from "@/lib/giftPresentation";
import {
  cleanGiftTitle,
  getGiftStoreLinks,
  getRawGiftTitle,
  inferGiftSearchQuery,
} from "@/lib/giftPresentation";

export default function GiftStoreLinks({ gift }: { gift: GiftLike }) {
  const cleanTitle = cleanGiftTitle(getRawGiftTitle(gift));
  const query = inferGiftSearchQuery(gift);
  const links = getGiftStoreLinks(gift);

  return (
    <div className="mt-5 rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-600">
        Satın Alma Linkleri
      </p>

      <h3 className="mt-2 text-xl font-black text-[#2b1b1b]">
        {cleanTitle} için mağazalarda ara
      </h3>

      <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
        Marka adı hediye önerisinin içinde kullanılmaz. Mağazalarda sadece
        <strong> “{query}” </strong> araması yapılır.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={`${link.store}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
