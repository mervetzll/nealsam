"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogPost = Record<string, any>;

function formatDate(value?: string) {
  if (!value) return "";

  try {
    return new Date(value).toLocaleDateString("tr-TR");
  } catch {
    return value;
  }
}

export default function BlogDynamicPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);

    try {
      const response = await fetch("/api/blog-posts?scope=published", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok) {
        setPosts(data.posts || []);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Topluluk Blogları
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Üyelerden gelen yazılar
          </h2>
        </div>

        <Link
          href="/blog/yeni"
          className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
        >
          Ben de Yazmak İstiyorum
        </Link>
      </div>

      {loading ? (
        <div className="mt-6 rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <p className="font-black text-[#6b4a4a]">
            Topluluk yazıları yükleniyor...
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
          <h3 className="text-2xl font-black text-[#2b1b1b]">
            Henüz onaylanmış topluluk yazısı yok.
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            İlk blog yazısını sen gönderebilirsin. Yazın admin onayından sonra
            burada yayınlanır.
          </p>

          <Link
            href="/blog/yeni"
            className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
          >
            Blog Yazısı Gönder
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt=""
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-[#fff0f7]">
                  <span className="text-5xl">🎁</span>
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                    {post.category || "Genel"}
                  </span>

                  <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-black text-[#2b1b1b]">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                    {post.excerpt}
                  </p>
                )}

                <p className="mt-5 text-sm font-black text-pink-600">
                  Yazıyı Oku →
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
