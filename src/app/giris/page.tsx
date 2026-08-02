import Link from "next/link";

export const metadata = {
  title: "Giriş Yap | NeAlsam Hediye",
  description:
    "NeAlsam Hediye profilini oluştur, hediye tercihlerini kaydet ve daha kişisel öneriler al.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fff7fb]">
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm md:p-10">
          <p className="text-sm font-bold text-pink-600">Profil</p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
            Profilini oluştur
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-[#6b4a4a]">
            Şu an NeAlsam’da hızlı profil sistemi kullanılıyor. Adını, bütçeni
            ve hediye tercihlerini kaydedip önerileri daha kişisel hale
            getirebilirsin.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/hesabim"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
            >
              Profil Oluştur
            </Link>

            <Link
              href="/hediye-bul"
              className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Hediye Bul’a Git
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
            <h2 className="font-black text-amber-900">
              Gerçek üyelik sistemi sonraki adım
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              E-posta/şifre ile giriş, şifre sıfırlama ve cihazlar arası profil
              için Supabase Auth bağlanmalıdır. Şu anki sayfa profil oluşturma
              altyapısının ilk sürümüdür.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
