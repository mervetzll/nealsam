"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FavoriteGiftButtonProps = {
  gift: {
    title: string;
    category?: string;
    reason?: string;
    note?: string;
    searchQuery?: string;
  };
};

export default function FavoriteGiftButton({ gift }: FavoriteGiftButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "login" | "error"
  >("idle");

  async function addFavorite() {
    setStatus("saving");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("login");
      return;
    }

    const { error } = await supabase.from("favorite_gifts").insert({
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

  return (
    <button
      type="button"
      onClick={addFavorite}
      disabled={status === "saving" || status === "saved"}
      className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50 disabled:opacity-60"
    >
      {status === "idle" && "♡ Favoriye Ekle"}
      {status === "saving" && "Ekleniyor..."}
      {status === "saved" && "Favorilere eklendi ✓"}
      {status === "login" && "Giriş yapmalısın"}
      {status === "error" && "Tekrar dene"}
    </button>
  );
}
