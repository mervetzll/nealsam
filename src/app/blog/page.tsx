const posts = [
  {
    title: "Sevgiliye Ne Hediye Alınır?",
    description:
      "Romantik, kullanışlı ve kişiye özel sevgili hediyesi fikirleri.",
    href: "/blog/sevgiliye-ne-hediye-alinir",
  },
  {
    title: "Anneye Doğum Günü Hediyesi",
    description:
      "Anneye alınabilecek duygusal, zarif ve kullanışlı hediye önerileri.",
    href: "/blog/anneye-dogum-gunu-hediyesi",
  },
  {
    title: "Arkadaşa Hediye Fikirleri",
    description:
      "Yakın arkadaşa, kız arkadaşa veya iş arkadaşına uygun hediye fikirleri.",
    href: "/blog/arkadasa-hediye-fikirleri",
  },
  {
    title: "500 TL Altı Hediye Önerileri",
    description:
      "Uygun fiyatlı ama düşünülmüş hissettiren hediye fikirleri.",
    href: "/blog/500-tl-alti-hediye-onerileri",
  },
  {
    title: "Kime Ne Hediye Alınır?",
    description:
      "Kişiye, bütçeye ve özel güne göre hediye seçme rehberi.",
    href: "/blog/kime-ne-hediye-alinir",
  },
];

export const metadata = {
  title: "Hediye Rehberi Blog | NeAlsam Hediye",
  description:
    "Sevgiliye, anneye, arkadaşa ve özel günlere göre hediye fikirleri. NeAlsam Hediye blog ile doğru hediyeyi seç.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fffaf7] px-6 py-12 text-[#2b1b1b]">
      <section className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-bold text-[#b83280]">
          ← Ana sayfaya dön
        </a>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">NeAlsam Blog</p>

          <h1 className="mt-3 text-4xl font-extrabold">
            Hediye seçmeyi kolaylaştıran rehberler
          </h1>

          <p className="mt-4 max-w-3xl leading-7 text-[#6b4b4b]">
            Kime ne hediye alınır, hangi özel günde nasıl bir hediye seçilir,
            uygun fiyatlı ama anlamlı hediyeler nasıl bulunur? NeAlsam blog
            sayfaları bu sorulara pratik cevaplar verir.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-sm font-bold text-[#b83280]">Hediye rehberi</p>
              <h2 className="mt-2 text-2xl font-extrabold">{post.title}</h2>
              <p className="mt-3 leading-7 text-[#6b4b4b]">
                {post.description}
              </p>
              <span className="mt-5 inline-block rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white">
                Rehberi oku
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
