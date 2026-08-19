"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogComment = Record<string, any>;
type StatusFilter = "all" | "published" | "hidden";

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

function getStatusLabel(status: string) {
  if (status === "published") return "Yayında";
  if (status === "hidden") return "Gizli";
  return status;
}

function getStatusClass(status: string) {
  if (status === "published") return "bg-green-50 text-green-700 border-green-100";
  if (status === "hidden") return "bg-red-50 text-red-700 border-red-100";
  return "bg-[#fff4ef] text-[#6b4a4a] border-pink-100";
}

export default function BlogCommentsAdminClient() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadComments() {
    setLoading(true);
    setMessage("");

    try {
      const params = new URLSearchParams();

      if (status !== "all") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const response = await fetch(`/api/admin-blog-comments?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Yorumlar alınamadı.");
        return;
      }

      setComments(data.comments || []);
      setSummary(data.summary || {});
    } catch {
      setMessage("Yorumlar alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, nextStatus: "published" | "hidden") {
    try {
      const response = await fetch("/api/admin-blog-comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Yorum güncellenemedi.");
        return;
      }

      await loadComments();
    } catch {
      alert("Yorum güncellenemedi.");
    }
  }

  async function deleteComment(id: string) {
    const confirmed = confirm("Bu yorumu tamamen silmek istediğine emin misin?");
    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin-blog-comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Yorum silinemedi.");
        return;
      }

      setComments((items) => items.filter((item) => item.id !== id));
      alert("Yorum silindi.");
    } catch {
      alert("Yorum silinemedi.");
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
              Blog Yorumları
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
              Blog yorumlarını gizle, yayına al veya tamamen sil.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/blog"
              className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
            >
              Blog Yönetimi
            </Link>

            <Link
              href="/admin"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700"
            >
              Admin Ana Panel
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["total", "Toplam"],
            ["published", "Yayında"],
            ["hidden", "Gizli"],
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
              placeholder="Yorum veya kullanıcı adında ara..."
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="all">Tüm Yorumlar</option>
              <option value="published">Yayında</option>
              <option value="hidden">Gizli</option>
            </select>

            <button
              onClick={loadComments}
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
            <p className="font-black">Yorumlar yükleniyor...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="mt-8 rounded-[2rem] bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black">Yorum bulunamadı.</h2>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-black ${getStatusClass(comment.status)}`}
                      >
                        {getStatusLabel(comment.status)}
                      </span>

                      {comment.post_title && (
                        <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                          {comment.post_title}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm font-black text-[#2b1b1b]">
                      {comment.display_name || comment.user_email || "Üye"}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
                      {formatDate(comment.created_at)}
                    </p>

                    <p className="mt-4 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#6b4a4a]">
                      {comment.comment}
                    </p>

                    {comment.post_slug && (
                      <Link
                        href={`/blog/${comment.post_slug}`}
                        className="mt-4 inline-flex text-sm font-black text-pink-600"
                      >
                        Yazıyı Gör →
                      </Link>
                    )}
                  </div>

                  <div className="flex min-w-[180px] flex-col gap-2">
                    {comment.status !== "published" && (
                      <button
                        onClick={() => updateStatus(comment.id, "published")}
                        className="rounded-full bg-green-600 px-5 py-3 text-sm font-black text-white"
                      >
                        Yayına Al
                      </button>
                    )}

                    {comment.status !== "hidden" && (
                      <button
                        onClick={() => updateStatus(comment.id, "hidden")}
                        className="rounded-full bg-yellow-500 px-5 py-3 text-sm font-black text-white"
                      >
                        Gizle
                      </button>
                    )}

                    <button
                      onClick={() => deleteComment(comment.id)}
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
