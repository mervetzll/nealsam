import Link from "next/link";
import { premiumConcepts } from "@/data/premiumConcepts";

const conceptVisuals: Record<
  string,
  {
    emoji: string;
    when: string;
    color: string;
    button: string;
  }
> = {
  "kader-bagi": {
    emoji: "💞",
    when: "Romantik, duygusal ve anlamlı hediyelerde seç.",
    color: "from-pink-50 to-rose-100",
    button: "Kader Bağı Oluştur",
  },
  "hediye-avi": {
    emoji: "🕵️‍♀️",
    when: "Eğlenceli, oyunlu ve sürprizli hediye vermek istediğinde seç.",
    color: "from-orange-50 to-pink-100",
    button: "Hediye Avı Başlat",
  },
  "ani-kutusu": {
    emoji: "📦",
    when: "Aile, yakın arkadaş, mezuniyet ve nostaljik hediyelerde seç.",
    color: "from-amber-50 to-orange-100",
    button: "Anı Kutusu Hazırla",
  },
  "gizli-mesaj": {
    emoji: "🔐",
    when: "QR kodlu özel mesaj, gizli not veya uzaktan hediye için seç.",
    color: "from-purple-50 to-pink-100",
    button: "Gizli Mesaj Yaz",
  },
  "karakterine-gore": {
    emoji: "✨",
    when: "Kararsızsan ve kişiye göre en güvenli sunumu istiyorsan seç.",
    color: "from-pink-50 to-fuchsia-100",
    button: "Kişisel Konsept Hazırla",
  },
};

export default function PremiumConceptCards() {
  return (
    <section className="mx-auto mt-10 max-w-7xl px-5">
      <div className="rounded-[2.5rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Premium Deneyim Seç
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-6xl">
            Hediyeyi sadece vermek yerine, unutulmaz bir ana dönüştür
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-8 text-[#6b4a4a]">
            NeAlsam’ın premium deneyimleri hediyenin yanına özel hikâye, ipucu,
            gizli mesaj veya anı kurgusu ekler. Aşağıdan hediye verme tarzını seç.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {premiumConcepts.map((concept) => {
            const visual = conceptVisuals[concept.id] || conceptVisuals["karakterine-gore"];

            return (
              <article
                key={concept.id}
                className={`group overflow-hidden rounded-[2rem] border border-pink-100 bg-gradient-to-br ${visual.color} p-5 shadow-sm transition hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl`}
              >
                <div className="rounded-[1.5rem] bg-white/75 p-5 backdrop-blur">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-5xl">{visual.emoji}</div>

                      <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-pink-700 shadow-sm">
                        {concept.badge}
                      </p>

                      <h3 className="mt-4 text-3xl font-black text-[#2b1b1b]">
                        {concept.title}
                      </h3>
                    </div>

                    <span className="rounded-full bg-[#2b1b1b] px-3 py-2 text-xs font-black uppercase text-white">
                      {concept.premiumLevel}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
                    {concept.description}
                  </p>

                  <div className="mt-5 rounded-2xl bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      Ne zaman seçilmeli?
                    </p>
                    <p className="mt-2 text-sm font-black leading-6 text-[#2b1b1b]">
                      {visual.when}
                    </p>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      Uygun olduğu kişiler
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {concept.bestFor.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-pink-100 bg-white px-3 py-2 text-xs font-black text-[#6b4a4a]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      Örnek his
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
                      “{concept.sample}”
                    </p>
                  </div>

                  <Link
                    href={`/deneyim?concept=${concept.id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white transition hover:bg-pink-700"
                  >
                    {visual.button} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-[#fff4ef] p-5 text-center">
          <h3 className="text-2xl font-black text-[#2b1b1b]">
            Kararsız kaldıysan önce Hediye Bul’u kullan
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            Hediye sonucuna göre sana otomatik olarak en uygun premium konsepti
            öneriyoruz: Kader Bağı, Hediye Avı, Anı Kutusu veya Gizli Mesaj.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-5 inline-flex rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
          >
            Hediye Bul’a Git →
          </Link>
        </div>
      </div>
    </section>
  );
}
