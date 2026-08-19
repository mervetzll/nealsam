import Link from "next/link";
import BlogDynamicPosts from "./BlogDynamicPosts";

export const metadata = {
  title: "Rehber / Blog | NeAlsam Hediye",
  description:
    "Hediye fikirleri, özel gün rehberleri ve NeAlsam topluluğundan blog yazıları.",
};

const guidePosts = [
  {
    title: "Sevgiliye Ne Hediye Alınır?",
    description:
      "Romantik, anlamlı ve kişisel sevgili hediyesi fikirleri.",
    href: "/blog/sevgiliye-ne-hediye-alinir",
    category: "Sevgiliye Hediye",
  },
  {
    title: "Anneye Doğum Günü Hediyesi",
    description:
      "Annen için duygusal, kullanışlı ve zarif hediye önerileri.",
    href: "/blog/anneye-dogum-gunu-hediyesi",
    category: "Anneye Hediye",
  },
  {
    title: "Arkadaşa Hediye Fikirleri",
    description:
      "Yakın arkadaş, okul arkadaşı veya iş arkadaşı için hediye önerileri.",
    href: "/blog/arkadasa-hediye-fikirleri",
    category: "Arkadaşa Hediye",
  },
  {
    title: "500 TL Altı Hediye Önerileri",
    description:
      "Bütçe dostu ama özenli görünen hediye fikirleri.",
    href: "/blog/500-tl-alti-hediye-onerileri",
    category: "Bütçe Dostu",
  },
  {
    title: "Kime Ne Hediye Alınır?",
    description:
      "Kişiye, bütçeye ve özel güne göre hediye seçme rehberi.",
    href: "/blog/kime-ne-hediye-alinir",
    category: "Genel Rehber",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Rehber / Blog
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Hediye fikirleri, rehberler ve topluluk yazıları
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            NeAlsam Hediye’de özel günlere, kişilere ve bütçeye göre hediye
            fikirlerini okuyabilir; üye olarak kendi blog yazını da
            gönderebilirsin.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog/yeni"
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              Blog Yazısı Gönder
            </Link>

            <Link
              href="/hesabim/bloglarim"
              className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700"
            >
              Bloglarım
            </Link>

            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
            >
              Hediye Bul
            </Link>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
                Rehber Yazıları
              </p>

              <h2 className="mt-2 text-3xl font-black">
                En çok okunan hediye rehberleri
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guidePosts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                  {post.category}
                </span>

                <h3 className="mt-5 text-2xl font-black text-[#2b1b1b]">
                  {post.title}
                </h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
                  {post.description}
                </p>

                <p className="mt-5 text-sm font-black text-pink-600">
                  Yazıyı Oku →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <BlogDynamicPosts />
      </section>
    </main>
  );
}
