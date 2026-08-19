"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type BlogPost = Record<string, any>;
type BlogComment = Record<string, any>;

function formatDate(value?: string) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

export default function BlogDetailClient({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [comment, setComment] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setIsLoggedIn(Boolean(session?.access_token));
    setUserId(session?.user?.id || "");
    setDisplayName(session?.user?.email || "");

    return session?.access_token || "";
  }

  async function loadPage() {
    setLoading(true);
    setMessage("");

    try {
      await getToken();

      const postResponse = await fetch("/api/blog-posts?scope=published", {
        cache: "no-store",
      });

      const postData = await postResponse.json();

      if (!postData?.ok) {
        setMessage(postData?.error || "Blog yazısı alınamadı.");
        return;
      }

      const foundPost = (postData.posts || []).find(
        (item: BlogPost) => item.slug === slug
      );

      if (!foundPost) {
        setMessage("Blog yazısı bulunamadı veya henüz yayında değil.");
        return;
      }

      setPost(foundPost);
      await loadComments(foundPost.id);
    } catch {
      setMessage("Blog yazısı yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function loadComments(postId: string) {
    try {
      const response = await fetch(`/api/blog-comments?postId=${postId}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok) {
        setComments(data.comments || []);
      }
    } catch {
      setComments([]);
    }
  }

  async function submitComment() {
    if (!post) return;

    setCommentLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        alert("Yorum yapmak için giriş yapmalısın.");
        return;
      }

      if (!comment.trim()) {
        alert("Yorum boş olamaz.");
        return;
      }

      const response = await fetch("/api/blog-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: post.id,
          displayName,
          comment,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Yorum kaydedilemedi.");
        return;
      }

      setComment("");
      await loadComments(post.id);
    } catch {
      alert("Yorum kaydedilemedi.");
    } finally {
      setCommentLoading(false);
    }
  }

  async function deleteComment(id: string) {
    const confirmed = confirm("Bu yorumu silmek istediğine emin misin?");
    if (!confirmed) return;

    try {
      const token = await getToken();

      if (!token) {
        alert("Silmek için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/blog-comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Yorum silinemedi.");
        return;
      }

      setComments((items) => items.filter((item) => item.id !== id));
    } catch {
      alert("Yorum silinemedi.");
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

  if (message || !post) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
        <section className="mx-auto max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">
            {message || "Blog yazısı bulunamadı."}
          </h1>

          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
          >
            Rehber / Blog’a Dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <article className="mx-auto max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <Link href="/blog" className="text-sm font-black text-pink-600">
          ← Rehber / Blog
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
            {post.category || "Genel"}
          </span>

          <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
            {formatDate(post.published_at || post.created_at)}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-5 text-lg font-semibold leading-8 text-[#6b4a4a]">
            {post.excerpt}
          </p>
        )}

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-8 max-h-[440px] w-full rounded-[2rem] object-cover"
          />
        )}

        <pre className="mt-8 whitespace-pre-wrap font-sans text-base font-semibold leading-8 text-[#2b1b1b]">
          {post.content}
        </pre>
      </article>

      <section className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Yorumlar
            </p>

            <h2 className="mt-2 text-3xl font-black">Okuyucu yorumları</h2>
          </div>

          <p className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
            {comments.length} yorum
          </p>
        </div>

        {isLoggedIn ? (
          <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5">
            <label className="grid gap-2 text-sm font-black">
              Görünen ad
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Adın veya e-posta adresin"
                className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
              />
            </label>

            <label className="mt-4 grid gap-2 text-sm font-black">
              Yorumun
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                placeholder="Bu yazı hakkında yorumunu yaz..."
                className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold leading-6 outline-none"
              />
            </label>

            <button
              onClick={submitComment}
              disabled={commentLoading}
              className="mt-4 rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white disabled:opacity-60"
            >
              {commentLoading ? "Gönderiliyor..." : "Yorum Yap"}
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5 text-center">
            <p className="text-sm font-black text-[#6b4a4a]">
              Yorum yapmak için giriş yapmalısın.
            </p>

            <Link
              href="/giris"
              className="mt-4 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              Giriş Yap / Üye Ol
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-4">
          {comments.length === 0 ? (
            <p className="rounded-2xl bg-[#fff4ef] p-5 text-center text-sm font-black text-[#6b4a4a]">
              Henüz yorum yok. İlk yorumu sen yazabilirsin.
            </p>
          ) : (
            comments.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-black text-[#2b1b1b]">
                      {item.display_name || "Üye"}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#8a6a6a]">
                      {formatDate(item.created_at)}
                    </p>
                  </div>

                  {userId && item.user_id === userId && (
                    <button
                      onClick={() => deleteComment(item.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-black text-red-600"
                    >
                      Yorumu Sil
                    </button>
                  )}
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm font-semibold leading-7 text-[#6b4a4a]">
                  {item.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
