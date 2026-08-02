import Link from "next/link";

export default function GiftFinderCTA() {
  return (
    <section className="my-10 rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-pink-600">
        Hâlâ karar veremedin mi?
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-950">
        30 saniyede kişiye özel hediye önerisi al
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        Kime hediye alacağını, bütçeni ve ilgi alanlarını seç; NeAlsam sana
        daha uygun, daha risksiz ve daha anlamlı hediye fikirleri önersin.
      </p>

      <Link
        href="/hediye-bul"
        className="mt-5 inline-flex rounded-full bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
      >
        Hediye Bul’a Git
      </Link>
    </section>
  );
}
