"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type SaveGiftResultButtonProps = {
  gift: {
    title: string;
    category?: string;
    reason?: string;
    note?: string;
    searchQuery?: string;
  };
};

export default function SaveGiftResultButton({ gift }: SaveGiftResultButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "login" | "error"
  >("idle");

  async function saveGift() {
    setStatus("saving");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("login");
      return;
    }

    const { error } = await supabase.from("saved_gift_results").insert({
      user_id: user.id,
      gift_title: gift.title,
      gift_category: gift.category || "",
      gift_reason: gift.reason || "",
      gift_note: gift.note || "",
      gift_search_query: gift.searchQuery || gift.title,
    });

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("saved");
  }

  const label = {
    idle: "Kaydet",
    saving: "Kaydediliyor...",
    saved: "Kaydedildi ✓",
    login: "Giriş gerekli",
    error: "Tekrar dene",
  }[status];

  return (
    <button
      type="button"
      onClick={saveGift}
      disabled={status === "saving" || status === "saved"}
      className={`inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-black transition disabled:opacity-70 ${
        status === "saved"
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border border-pink-200 bg-white text-pink-700 hover:bg-pink-50"
      }`}
    >
      <span className="mr-1">＋</span>
      {label}
    </button>
  );
}
