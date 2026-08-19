"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type BlogPost = Record<string, any>;

type BlogStatus = "all" | "draft" | "pending" | "published" | "rejected";

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

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

export default function BlogAdminClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<BlogStatus>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const filteredPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadPosts() {
    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();

      if (status !== "all") {
        params.set("status", status);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`/api/admin-blog-posts?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Blog yazıları alınamadı.");
        return;
      }

      setPosts(data.posts || []);
      setSummary(data.summary || {});
    } catch {
      setMessage("Blog yazıları alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, nextStatus: "draft" | "pending" | "published" | "rejected") {
    const adminNote =
      nextStatus === "rejected"
        ? prompt("Reddetme sebebi / admin notu yazabilirsin:", "") || ""
        : "";

    try {
      const response = await fetch("/api/admin-blog-posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: nextStatus,
          adminNote,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Blog güncellenemedi.");
        return;
      }

      await loadPosts();
    } catch {
      alert("Blog güncellenemedi.");
    }
  }

  async function deletePost(id: string) {
    const confirmed = confirm("Bu blog yazısını tamamen silmek istediğine emin misin?");
    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin-blog-posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Blog silinemedi.");
        return;
      }

      setPosts((items) => items.filter((item) => item.id !== id));
      alert("Blog silindi.");
    } catch {
      alert("Blog silinemedi.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Blog Yönetimi
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
              Üyelerin gönderdiği blog yazılarını onayla, reddet veya sil.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
            >
              Admin Ana Panel
            </Link>

            <Link
              href="/blog"
              className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
            >
              Blogu Gör
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            ["total", "Toplam"],
            ["pending", "Onay Bekleyen"],
            ["published", "Yayında"],
            ["draft", "Taslak"],
            ["rejected", "Reddedildi"],
          ].map(([key, label]) => (
            <div
              key={key}
              className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                {label}
              </p>
              <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
                {summary[key] || 0}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Başlık, açıklama veya içerikte ara..."
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as BlogStatus)}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Onay Bekleyen</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="rejected">Reddedildi</option>
            </select>

            <button
              onClick={loadPosts}
              className="rounded-2xl bg-pink-600 px-5 py-3 text-sm font-black text-white"
            >
              Ara / Yenile
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-6 rounded-2xl bg-white p-5 text-sm font-black text-pink-700 shadow-sm">
            {message}
          </p>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <p className="font-black">Blog yazıları yükleniyor...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black">Blog yazısı bulunamadı.</h2>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-4 py-2 text-xs font-black ${getStatusClass(post.status)}`}
                      >
                        {getStatusLabel(post.status)}
                      </span>

                      <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                        {post.category || "Genel"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl font-black text-[#2b1b1b]">
                      {post.title}
                    </h2>

                    <p className="mt-2 text-xs font-semibold text-[#8a6a6a]">
                      Yazar: {post.author_email || post.author_id}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
                      Oluşturulma: {formatDate(post.created_at)}
                    </p>

                    {post.excerpt && (
                      <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
                        {post.excerpt}
                      </p>
                    )}

                    <details className="mt-4 rounded-2xl bg-[#fff4ef] p-4">
                      <summary className="cursor-pointer text-sm font-black text-pink-700">
                        Yazı metnini göster
                      </summary>

                      <pre className="mt-4 max-h-80 overflow-y-auto whitespace-pre-wrap text-sm font-semibold leading-7 text-[#2b1b1b]">
                        {post.content}
                      </pre>
                    </details>

                    {post.admin_note && (
                      <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-black text-red-700">
                        Admin notu: {post.admin_note}
                      </p>
                    )}
                  </div>

                  <div className="flex min-w-[220px] flex-col gap-2">
                    {post.status !== "published" && (
                      <button
                        onClick={() => updateStatus(post.id, "published")}
                        className="rounded-full bg-green-600 px-5 py-3 text-sm font-black text-white"
                      >
                        Yayına Al
                      </button>
                    )}

                    {post.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(post.id, "rejected")}
                        className="rounded-full bg-red-600 px-5 py-3 text-sm font-black text-white"
                      >
                        Reddet
                      </button>
                    )}

                    {post.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(post.id, "pending")}
                        className="rounded-full bg-yellow-500 px-5 py-3 text-sm font-black text-white"
                      >
                        Onaya Al
                      </button>
                    )}

                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="rounded-full bg-[#2b1b1b] px-5 py-3 text-center text-sm font-black text-white"
                      >
                        Yayında Gör
                      </Link>
                    )}

                    <button
                      onClick={() => deletePost(post.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-600"
                    >
                      Tamamen Sil
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
