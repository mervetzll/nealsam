export const metadata = {
  title: "Admin Panel | NeAlsam",
  description: "NeAlsam admin yönetim paneli.",
};

const stats = [
  {
    title: "Toplam Hediye Fikri",
    value: "120+",
    description: "Sistemdeki öneri sayısı",
  },
  {
    title: "Blog Yazısı",
    value: "5",
    description: "SEO için yayınlanan içerikler",
  },
  {
    title: "Aktif Sayfa",
    value: "11",
    description: "Google sitemap içinde görünen sayfalar",
  },
  {
    title: "SEO Durumu",
    value: "Başladı",
    description: "Search Console doğrulandı",
  },
];

const adminSections = [
  {
    title: "Hediye Önerileri",
    description:
      "Hediye fikirlerini, kategorileri, bütçeleri ve arama kelimelerini yönet.",
    button: "Hediyeleri yönet",
  },
  {
    title: "Blog / Hediye Rehberi",
    description:
      "Google’da görünmek için blog yazıları ve SEO içeriklerini düzenle.",
    button: "Blogları yönet",
  },
  {
    title: "Paketler",
    description:
      "Ücretsiz, premium ve deneyim paketi gibi planları kontrol et.",
    button: "Paketleri yönet",
  },
  {
    title: "SEO Kontrol",
    description:
      "Sitemap, başlıklar, açıklamalar ve Google index durumunu takip et.",
    button: "SEO kontrol et",
  },
];

const todos = [
  "Google Search Console’da ana sayfa için index isteği gönder",
  "Blog sayfalarını sitemap üzerinden tekrar kontrol et",
  "Hediye Bul algoritmasında risk sorusunu düzelt",
  "Ana sayfaya daha güçlü SEO metni ekle",
  "Gerçek admin giriş sistemi kur",
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-[#b83280]">NeAlsam Admin</p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Yönetim Paneli
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-[#6b4b4b]">
              Bu panelden NeAlsam sitesinin hediye fikirlerini, blog
              içeriklerini, paketlerini ve SEO durumunu takip edebilirsin.
            </p>
          </div>

          <a
            href="/"
            className="rounded-full bg-[#b83280] px-6 py-3 text-center font-bold text-white"
          >
            Siteye dön
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {stats.map((item) => (
            <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-[#b83280]">{item.title}</p>
              <h2 className="mt-3 text-3xl font-extrabold">{item.value}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#b83280]">
                    Yönetim Alanları
                  </p>
                  <h2 className="mt-2 text-3xl font-extrabold">
                    Ne yönetilecek?
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {adminSections.map((section) => (
                  <div
                    key={section.title}
                    className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-6"
                  >
                    <h3 className="text-xl font-extrabold">
                      {section.title}
                    </h3>

                    <p className="mt-3 min-h-20 text-sm leading-6 text-[#6b4b4b]">
                      {section.description}
                    </p>

                    <button
                      type="button"
                      className="mt-5 rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white opacity-60"
                    >
                      {section.button}
                    </button>

                    <p className="mt-3 text-xs font-semibold text-[#8b6f6f]">
                      Bu özellik sonraki adımda aktif edilecek.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">Yapılacaklar</p>

            <h2 className="mt-2 text-3xl font-extrabold">
              Bugünkü kontrol listesi
            </h2>

            <div className="mt-6 space-y-3">
              {todos.map((todo) => (
                <div
                  key={todo}
                  className="rounded-2xl bg-[#fff0f7] p-4 text-sm font-semibold leading-6 text-[#6b4b4b]"
                >
                  {todo}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Admin Notu</p>

          <h2 className="mt-2 text-3xl font-extrabold">
            Bu sayfa şimdilik gizli yönetim ekranı gibi çalışır.
          </h2>

          <p className="mt-4 leading-7 text-[#6b4b4b]">
            Henüz gerçek giriş koruması yok. Yani linki bilen biri bu sayfayı
            görebilir. Sonraki adımda basit bir admin şifresi, sonra da gerçek
            kullanıcı girişi ekleyebiliriz.
          </p>
        </div>
      </section>
    </main>
  );
}
