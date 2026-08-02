"use client";

import { useState } from "react";

type ShareGiftButtonProps = {
  title: string;
  text: string;
};

export default function ShareGiftButton({ title, text }: ShareGiftButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText = `${title}\n\n${text}\n\nNeAlsam Hediye: https://nealsamhediye.com/hediye-bul`;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: shareText,
          url: "https://nealsamhediye.com/hediye-bul",
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Paylaşma işlemi başarısız:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
    >
      {copied ? "Kopyalandı ✓" : "Sonucu Paylaş"}
    </button>
  );
}
