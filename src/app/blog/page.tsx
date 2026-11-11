import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { ui } from "@/components/ui/styles";
import BlogDynamicPosts from "./BlogDynamicPosts";
import { editorialPosts } from "@/data/editorialPosts";

export const metadata = {
  title: "Rehber / Blog",
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

const covers = [
  "from-pink-200 via-rose-100 to-[#fff4ef]",
  "from-[#ffe1d1] via-[#fff0e8] to-[#fff8f5]",
  "from-rose-200 via-pink-100 to-[#fff4ef]",
  "from-[#f7d9e4] via-[#fcebf1] to-white",
  "from-[#ffd9cc] via-[#ffece4] to-[#fff8f5]",
];

export default function BlogPage() {
  const [featured, ...rest] = guidePosts;

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <PageHero
          eyebrow="Rehber ve blog"
          title="Her hediyenin"
          accent="bir hikâyesi var."
          description="Küçük sürprizleri, işe yarayan fikirleri ve hediye seçerken öğrendiklerimizi paylaşalım. Önce bir yazıya göz at, sonra kendi hikâyeni ekle."
        >
          <Link href="/blog/yeni" className={ui.btnPrimary}>
            <PenLine className="h-4 w-4" />
            Hikâyemi yaz
          </Link>
          <Link href="/hesabim/bloglarim" className={ui.btnLink}>
            Yazılarım
          </Link>
        </PageHero>

        <section className="mb-20" aria-label="Editörden yeni yazılar">
          <div className="flex items-end justify-between gap-4 border-b border-pink-100 pb-5">
            <h2 className="text-3xl md:text-4xl">
              Editörden <em>iki küçük başlangıç</em>
            </h2>
            <p className="hidden text-sm text-[#8a6a6a] sm:block">Sohbeti başlatalım</p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {editorialPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={`${ui.cardInteractive} group flex flex-col p-7 md:p-8`}>
                <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-3xl ring-1 ring-pink-100">{post.emoji}</span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-pink-600">{post.category} · NeAlsam Editör</p>
                <h3 className="mt-3 font-display text-3xl font-normal leading-tight">{post.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-[#6b4a4a]">{post.excerpt}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-pink-700">
                  {post.readingMinutes} dk · Yazıyı oku
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 border-b border-pink-100 pb-5">
            <h2 className="text-3xl md:text-4xl">
              Hediye seçmeye <em>buradan başla</em>
            </h2>
            <p className="hidden text-sm text-[#8a6a6a] sm:block">{guidePosts.length} rehber</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured && (
              <Link
                href={featured.href}
                className={`${ui.cardInteractive} group grid overflow-hidden md:col-span-2 md:grid-cols-2`}
              >
                <div className={`relative flex min-h-56 items-end bg-gradient-to-br ${covers[0]} p-7`}>
                  <span className="font-display text-6xl italic leading-none text-pink-600/80 md:text-7xl">
                    {featured.category}
                  </span>
                </div>
                <div className="flex flex-col p-7 md:p-8">
                  <span className={ui.tagAccent}>Öne çıkan</span>
                  <h3 className="mt-5 font-display text-3xl font-normal leading-tight md:text-4xl">{featured.title}</h3>
                  <p className="mt-4 flex-1 leading-7 text-[#6b4a4a]">{featured.description}</p>
                  <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-pink-700">
                    Yazıyı oku
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            )}

            {rest.map((post, i) => (
              <Link key={post.href} href={post.href} className={`${ui.cardInteractive} group flex flex-col overflow-hidden`}>
                <div className={`flex h-36 items-end bg-gradient-to-br ${covers[(i + 1) % covers.length]} px-6 pb-4`}>
                  <span className="font-display text-3xl italic text-pink-600/80">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-normal leading-snug">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#6b4a4a]">{post.description}</p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-pink-700">
                    Yazıyı oku
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <BlogDynamicPosts />
      </section>
    </main>
  );
}
