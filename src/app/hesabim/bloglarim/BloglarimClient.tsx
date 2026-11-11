"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type BlogPost = Record<string, any>;

function getStatusLabel(status: string) {
  if (status === "draft") return "Taslak";
  if (status === "pending") return "Onay Bekliyor";
  if (status === "published") return "Yayında";
  if (status === "rejected") return "Reddedildi";
  return status;
}

function getStatusClass(status: string) {
  if (status === "published") return "bg-green-50 text-green-700 border-green-100";
  if (status === "pending") return "bg-yellow-50 text-yellow-700 border-yellow-100";
  if (status === "rejected") return "bg-red-50 text-red-700 border-red-100";
  return "bg-[#fff4ef] text-[#6b4a4a] border-pink-100";
}

export default function BloglarimClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function loadPosts() {
    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();

      if (!token) {
        setMessage("Bloglarını görmek için giriş yapmalısın.");
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
        setMessage(data?.error || "Blog yazıları alınamadı.");
        return;
      }

      setPosts(data.posts || []);
    } catch {
      setMessage("Blog yazıları alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string) {
    const confirmed = confirm("Bu blog yazısını silmek istediğine emin misin?");
    if (!confirmed) return;

    try {
      const token = await getToken();

      if (!token) {
        alert("Silmek için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/blog-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Blog silinemedi.");
        return;
      }

      setPosts((items) => items.filter((item) => item.id !== id));
      alert("Blog yazısı silindi.");
    } catch {
      alert("Blog silinemedi.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
              Hesabım
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Bloglarım
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Gönderdiğin blog yazılarını buradan takip edebilir ve silebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog/yeni"
              className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
            >
              Yeni Blog Yaz
            </Link>

            <Link
              href="/hesabim"
              className="rounded-full bg-white ring-1 ring-pink-200 px-5 py-3 text-sm font-bold text-pink-700 transition hover:bg-pink-50"
            >
              Hesabıma Dön
            </Link>
          </div>
        </div>

        {message && (
          <p className="mt-6 rounded-2xl bg-white p-5 text-sm font-black text-pink-700">
            {message}
          </p>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center">
            <p className="font-black">Bloglar yükleniyor...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center">
            <h2 className="text-2xl font-black">Henüz blog yazın yok.</h2>

            <Link
              href="/blog/yeni"
              className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
            >
              İlk Blogunu Yaz
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <span
                      className={`inline-flex rounded-full border px-4 py-2 text-xs font-black ${getStatusClass(post.status)}`}
                    >
                      {getStatusLabel(post.status)}
                    </span>

                    <h2 className="mt-4 text-2xl font-black">
                      {post.title}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                      {post.category}
                    </p>

                    {post.excerpt && (
                      <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                        {post.excerpt}
                      </p>
                    )}

                    {post.admin_note && (
                      <p className="mt-3 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700">
                        Admin notu: {post.admin_note}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                      >
                        Gör
                      </Link>
                    )}

                    <Link
                      href={`/blog/duzenle/${post.id}`}
                      className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
                    >
                      Düzenle
                    </Link>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
