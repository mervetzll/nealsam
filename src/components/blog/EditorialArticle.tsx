import Link from "next/link";
import type { EditorialPost } from "@/data/editorialPosts";

export default function EditorialArticle({ post }: { post: EditorialPost }) {
  return <main className="min-h-screen bg-[#fff4ef] px-4 py-8 text-[#2b1b1b]">
    <article className="mx-auto max-w-3xl rounded-3xl border border-pink-100 bg-white p-5 md:p-9">
      <Link href="/blog" className="text-sm font-bold text-pink-700">← Tüm yazılar</Link>
      <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#6b4a4a]"><span>{post.category}</span><span>NeAlsam Editör</span><span>Yaklaşık {post.readingMinutes} dk okuma</span></div>
      <h1 className="mt-4 text-3xl font-black leading-tight">{post.title}</h1>
      <p className="mt-5 text-base leading-8 text-[#6b4a4a]">{post.excerpt}</p>
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-pink-50 to-[#fff4ef] p-7 text-center text-6xl" aria-hidden="true">{post.emoji}</div>
      {post.sections.map(section => <section key={section.title} className="mt-8"><h2 className="text-xl font-bold">{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="mt-4 text-base leading-8 text-[#5a4040]">{paragraph}</p>)}</section>)}
      <aside className="mt-8 rounded-2xl bg-pink-50 p-5"><h2 className="text-xl font-bold">Şimdi senin hikâyeni dinleyelim</h2><p className="mt-3 text-sm leading-7">{post.question}</p><div className="mt-5 flex flex-wrap gap-3"><Link href="/blog/yeni" className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white">Kendi yazımı hazırlayayım</Link><Link href="/giris?mode=register&next=%2Fblog%2Fyeni" className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-bold text-pink-700">Üye ol ve katıl</Link></div><p className="mt-3 text-xs leading-6 text-[#6b4a4a]">Yazılar incelemeden sonra yayımlanır. Gerçek kişilere ait özel bilgileri paylaşmadan kendi deneyimini anlatabilirsin.</p></aside>
      <p className="mt-6 text-xs text-[#6b4a4a]">Bu yazı NeAlsam editöryal içeriğidir. Üye deneyimleri topluluk bölümünde ayrıca yer alır.</p>
    </article>
  </main>;
}
