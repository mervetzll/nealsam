"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type BlogPost = Record<string, any>;

export default function BlogEditClient({ postId }: { postId: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hediye Fikirleri");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function loadPost() {
    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();

      if (!token) {
        setMessage("Blog yazısını düzenlemek için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/blog-posts?scope=mine", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Blog yazısı alınamadı.");
        return;
      }

      const foundPost = (data.posts || []).find((item: BlogPost) => item.id === postId);

      if (!foundPost) {
        setMessage("Blog yazısı bulunamadı.");
        return;
      }

      setPost(foundPost);
      setTitle(foundPost.title || "");
      setCategory(foundPost.category || "Hediye Fikirleri");
      setExcerpt(foundPost.excerpt || "");
      setCoverImageUrl(foundPost.cover_image_url || "");
      setContent(foundPost.content || "");
    } catch {
      setMessage("Blog yazısı alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function savePost(saveAsDraft: boolean) {
    setSaving(true);
    setMessage("");

    try {
      const token = await getToken();

      if (!token) {
        setMessage("Kaydetmek için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: postId,
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
        setMessage(data?.error || "Blog yazısı güncellenemedi.");
        return;
      }

      setPost(data.post);
      setMessage(
        saveAsDraft
          ? "Yazın taslak olarak güncellendi."
          : "Yazın tekrar admin onayına gönderildi."
      );
    } catch {
      setMessage("Blog yazısı güncellenemedi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="font-black">Blog yazısı yükleniyor...</p>
        </section>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">
            {message || "Blog yazısı bulunamadı."}
          </h1>

          <Link
            href="/hesabim/bloglarim"
            className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
          >
            Bloglarıma Dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
          Blog
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight">
          Blog Yazısını Düzenle
        </h1>

        <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
          Yayındaki bir yazıyı düzenlersen tekrar admin onayına gönderilir.
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
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
            />
          </label>

          <label className="grid gap-2 text-sm font-black">
            Kapak Görseli URL
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
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-7 outline-none"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <button
            disabled={saving}
            onClick={() => savePost(false)}
            className="rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60"
          >
            Tekrar Onaya Gönder
          </button>

          <button
            disabled={saving}
            onClick={() => savePost(true)}
            className="rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white disabled:opacity-60"
          >
            Taslak Kaydet
          </button>

          <Link
            href="/hesabim/bloglarim"
            className="flex items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
          >
            Bloglarıma Dön
          </Link>
        </div>
      </section>
    </main>
  );
}
