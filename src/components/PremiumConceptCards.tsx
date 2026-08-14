import Link from "next/link";
import { premiumConcepts } from "@/data/premiumConcepts";

export default function PremiumConceptCards() {
  return (
    <section className="mx-auto mt-12 max-w-7xl px-5">
      <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Premium Deneyimler
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
              Hediyeyi sadece ürün değil, hikâye haline getir
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#6b4a4a]">
              Kader Bağı, Hediye Avı, Anı Kutusu ve QR mesaj gibi özel konseptlerle
              hediyeyi daha kişisel, daha unutulmaz ve daha premium hale getirebilirsin.
            </p>
          </div>

          <Link
            href="/paketler"
            className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white transition hover:bg-pink-700"
          >
            Paketleri İncele
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {premiumConcepts.map((concept) => (
            <article
              key={concept.id}
              className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5 transition hover:border-pink-300 hover:bg-[#fff0f7] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-black text-pink-700 shadow-sm">
                    {concept.badge}
                  </p>

                  <h3 className="mt-4 text-2xl font-black text-[#2b1b1b]">
                    {concept.title}
                  </h3>
                </div>

                <span className="rounded-full bg-[#2b1b1b] px-3 py-2 text-xs font-black uppercase text-white">
                  {concept.premiumLevel}
                </span>
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-[#6b4a4a]">
                {concept.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {concept.bestFor.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-pink-100 bg-white px-3 py-2 text-xs font-black text-[#6b4a4a]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                  Örnek his
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
                  “{concept.sample}”
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
