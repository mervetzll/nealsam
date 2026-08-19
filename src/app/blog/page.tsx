import Link from "next/link";

export const metadata = {
  title: "Hediye Rehberi | NeAlsam Hediye",
  description:
    "Sevgiliye, anneye, arkadaşa ve bütçeye göre hediye fikirleri. NeAlsam hediye rehberiyle doğru hediyeyi daha kolay bul.",
};

const posts = [
  {
    title: "Kime Ne Hediye Alınır?",
    description:
      "Kişiye, ilişkiye ve özel güne göre hediye seçerken dikkat edilmesi gerekenler.",
    href: "/blog/kime-ne-hediye-alinir",
    tag: "Genel rehber",
  },
  {
    title: "Sevgiliye Ne Hediye Alınır?",
    description:
      "Romantik, anlamlı, risksiz ve deneyim odaklı sevgiliye hediye fikirleri.",
    href: "/blog/sevgiliye-ne-hediye-alinir",
    tag: "Sevgili",
  },
  {
    title: "Anneye Doğum Günü Hediyesi",
    description:
      "Anneye alınabilecek kullanışlı, duygusal ve zarif doğum günü hediyeleri.",
    href: "/blog/anneye-dogum-gunu-hediyesi",
    tag: "Anne",
  },
  {
    title: "Arkadaşa Hediye Fikirleri",
    description:
      "Yakın arkadaşa, iş arkadaşına veya kardeş gibi görülen dostlara hediye fikirleri.",
    href: "/blog/arkadasa-hediye-fikirleri",
    tag: "Arkadaş",
  },
  {
    title: "500 TL Altı Hediye Önerileri",
    description:
      "Uygun bütçeli ama düşünülmüş hissettiren hediye seçenekleri.",
    href: "/blog/500-tl-alti-hediye-onerileri",
    tag: "Bütçe",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold text-pink-600">NeAlsam Rehber</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
            Hediye seçmeyi kolaylaştıran rehberler
          </h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/blog/yeni"
          className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
        >
          Blog Yazısı Gönder
        </a>

        <a
          href="/hesabim/bloglarim"
          className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700"
        >
          Bloglarım
        </a>
      </div>

          <p className="mt-5 text-base leading-7 text-[#6b4a4a]">
            Kime ne hediye alacağını bilmiyorsan önce rehberlere göz atabilir,
            sonra Hediye Bul testiyle kişiye özel öneri alabilirsin.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-7 inline-flex rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
          >
            30 Saniyede Hediye Bul
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.href}
              className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-black text-pink-700">
                {post.tag}
              </span>

              <h2 className="mt-4 text-xl font-black text-[#2b1b1b]">
                {post.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {post.description}
              </p>

              <Link
                href={post.href}
                className="mt-5 inline-flex text-sm font-black text-pink-700 hover:text-pink-900"
              >
                Yazıyı oku →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] bg-[#2b1b1b] p-8 text-white">
          <p className="text-sm font-bold text-pink-200">
            Rehber yetmedi mi?
          </p>
          <h2 className="mt-2 text-3xl font-black">
            Kişiye özel hediye önerisini hemen al
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
            Bütçeni, özel günü ve ilgi alanlarını seç; NeAlsam sana daha uygun
            hediye fikirlerini sıralasın.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-6 inline-flex rounded-full bg-white px-6 py-4 text-sm font-black text-[#2b1b1b] transition hover:bg-pink-50"
          >
            Hediye Bul’a Git
          </Link>
        </div>
      </section>
    </main>
  );
}
