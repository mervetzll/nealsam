"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogNewClient() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hediye Fikirleri");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function submitPost(saveAsDraft: boolean) {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMessage("Blog yazısı göndermek için önce giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/blog-posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          coverImageUrl,
          content,
          saveAsDraft,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Blog yazısı kaydedilemedi.");
        return;
      }

      setMessage(
        saveAsDraft
          ? "Yazın taslak olarak kaydedildi."
          : "Yazın admin onayına gönderildi."
      );

      setTitle("");
      setExcerpt("");
      setCoverImageUrl("");
      setContent("");
    } catch {
      setMessage("Blog yazısı kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
          Blog
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Blog Yazısı Gönder
        </h1>

        <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
          Yazın önce admin onayına düşer. Onaylandıktan sonra blogda yayınlanır.
        </p>

        {message && (
          <p className="mt-5 rounded-2xl bg-[#fff4ef] p-4 text-sm font-black text-pink-700">
            {message}
          </p>
        )}

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-black">
            Başlık
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Örn: Sevgiliye alınabilecek anlamlı hediyeler"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-black">
            Kategori
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            >
              <option>Hediye Fikirleri</option>
              <option>Sevgiliye Hediye</option>
              <option>Anneye Hediye</option>
              <option>Arkadaşa Hediye</option>
              <option>Özel Günler</option>
              <option>Deneyim Hediyeleri</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-black">
            Kısa Açıklama
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              placeholder="Yazının kısa özeti..."
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-black">
            Kapak Görseli URL opsiyonel
            <input
              value={coverImageUrl}
              onChange={(event) => setCoverImageUrl(event.target.value)}
              placeholder="https://..."
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-black">
            Blog Metni
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={14}
              placeholder="Blog yazını buraya yaz..."
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-7 outline-none"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <button
            disabled={saving}
            onClick={() => submitPost(false)}
            className="rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60"
          >
            Onaya Gönder
          </button>

          <button
            disabled={saving}
            onClick={() => submitPost(true)}
            className="rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white disabled:opacity-60"
          >
            Taslak Kaydet
          </button>

          <Link
            href="/hesabim/bloglarim"
            className="flex items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
          >
            Bloglarım
          </Link>
        </div>
      </section>
    </main>
  );
}
