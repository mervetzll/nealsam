"use client";

import { useMemo, useState } from "react";

const ADMIN_PASSWORD = "nealsam2026";

const stats = [
  {
    title: "Toplam Hediye Fikri",
    value: "120+",
    change: "+ yeni fikir eklenebilir",
  },
  {
    title: "Blog Yazısı",
    value: "5",
    change: "SEO içerikleri başladı",
  },
  {
    title: "Sitemap Sayfası",
    value: "11",
    change: "Google keşif için hazır",
  },
  {
    title: "Google Durumu",
    value: "Doğrulandı",
    change: "Search Console aktif",
  },
];

const gifts = [
  {
    title: "Kişiye Özel Kupa",
    category: "Kahve",
    budget: "250–500 TL",
    status: "Aktif",
  },
  {
    title: "Mini Parfüm Seti",
    category: "Beauty",
    budget: "500–1000 TL",
    status: "Kontrol",
  },
  {
    title: "Kablosuz Kulaklık",
    category: "Teknoloji",
    budget: "1000–2500 TL",
    status: "Aktif",
  },
  {
    title: "Okuma Lambası Seti",
    category: "Kitap",
    budget: "250–500 TL",
    status: "Aktif",
  },
];

const blogPosts = [
  {
    title: "Sevgiliye Ne Hediye Alınır?",
    url: "/blog/sevgiliye-ne-hediye-alinir",
    keyword: "sevgiliye hediye",
    status: "Yayında",
  },
  {
    title: "Anneye Doğum Günü Hediyesi",
    url: "/blog/anneye-dogum-gunu-hediyesi",
    keyword: "anneye hediye",
    status: "Yayında",
  },
  {
    title: "500 TL Altı Hediye Önerileri",
    url: "/blog/500-tl-alti-hediye-onerileri",
    keyword: "500 tl altı hediye",
    status: "Yayında",
  },
  {
    title: "Kime Ne Hediye Alınır?",
    url: "/blog/kime-ne-hediye-alinir",
    keyword: "kime ne hediye alınır",
    status: "Yayında",
  },
];

const seoTasks = [
  "Google Search Console’da ana sayfa için index isteği gönder",
  "Blog sayfaları için URL Inspection yap",
  "Sitemap discovered pages sayısını kontrol et",
  "Ana sayfa title ve description metinlerini düzenli kontrol et",
  "Blog yazılarına iç link ekle",
  "Hediye Bul sayfasına SEO açıklama alanı ekle",
];

const todos = [
  {
    title: "Hediye Bul risk sorusunu düzelt",
    priority: "Yüksek",
    status: "Bekliyor",
  },
  {
    title: "Ana sayfaya daha güçlü SEO metni ekle",
    priority: "Yüksek",
    status: "Bekliyor",
  },
  {
    title: "Paketler sayfasını ticari modele göre düzenle",
    priority: "Orta",
    status: "Planlandı",
  },
  {
    title: "Gerçek admin giriş sistemi kur",
    priority: "Yüksek",
    status: "Sonraki aşama",
  },
];

const quickLinks = [
  { label: "Canlı Site", href: "https://nealsamhediye.netlify.app/" },
  { label: "Hediye Bul", href: "/hediye-bul" },
  { label: "Blog", href: "/blog" },
  { label: "Paketler", href: "/paketler" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const tabs = [
  "Dashboard",
  "Hediyeler",
  "Blog",
  "SEO",
  "Paketler",
  "Yapılacaklar",
];

export default function AdminClient() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [giftSearch, setGiftSearch] = useState("");

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) =>
      `${gift.title} ${gift.category} ${gift.budget}`
        .toLocaleLowerCase("tr")
        .includes(giftSearch.toLocaleLowerCase("tr"))
    );
  }, [giftSearch]);

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      return;
    }

    alert("Şifre yanlış.");
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#fff7f3] px-6 py-12 text-[#2b1b1b]">
        <section className="mx-auto flex min-h-[70vh] max-w-xl items-center">
          <div className="w-full rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">NeAlsam Admin</p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Yönetim paneli girişi
            </h1>

            <p className="mt-4 leading-7 text-[#6b4b4b]">
              Admin paneline devam etmek için şifre gir.
            </p>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleLogin();
              }}
              placeholder="Admin şifresi"
              className="mt-6 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-5 py-4 outline-none focus:border-[#b83280]"
            />

            <button
              onClick={handleLogin}
              className="mt-5 w-full rounded-full bg-[#b83280] px-6 py-4 font-bold text-white"
            >
              Admin paneline gir
            </button>

            <a
              href="/"
              className="mt-5 block text-center text-sm font-bold text-[#b83280]"
            >
              Ana sayfaya dön
            </a>

            <p className="mt-6 rounded-2xl bg-[#fff0f7] p-4 text-xs leading-6 text-[#6b4b4b]">
              Geçici admin şifresi: <strong>nealsam2026</strong>. Sonraki
              aşamada bunu gerçek kullanıcı girişiyle değiştireceğiz.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fff7f3] px-6 py-8 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-[#b83280]">NeAlsam Admin</p>
            <h1 className="mt-2 text-4xl font-extrabold">Yönetim Paneli</h1>
            <p className="mt-3 max-w-3xl leading-7 text-[#6b4b4b]">
              Hediye önerilerini, blog içeriklerini, SEO durumunu ve site
              geliştirme adımlarını buradan takip edebilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full bg-[#fff0f7] px-5 py-3 text-sm font-bold text-[#b83280]"
            >
              Siteye dön
            </a>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
            >
              Çıkış yap
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto rounded-full bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-bold transition ${
                activeTab === tab
                  ? "bg-[#b83280] text-white"
                  : "bg-[#fffaf7] text-[#6b4b4b] hover:text-[#b83280]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Dashboard" && (
          <>
            <div className="mt-6 grid gap-5 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-bold text-[#b83280]">
                    {stat.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-extrabold">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-sm text-[#6b4b4b]">{stat.change}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-[2rem] bg-white p-6 shadow-sm lg:col-span-2">
                <p className="text-sm font-bold text-[#b83280]">Genel Durum</p>
                <h2 className="mt-2 text-3xl font-extrabold">
                  Bugünkü odak noktaları
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {todos.slice(0, 4).map((todo) => (
                    <div
                      key={todo.title}
                      className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-extrabold">{todo.title}</h3>
                        <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                          {todo.priority}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-[#6b4b4b]">
                        {todo.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Hızlı Linkler</p>
                <h2 className="mt-2 text-3xl font-extrabold">Kontrol et</h2>

                <div className="mt-5 space-y-3">
                  {quickLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : "_self"}
                      className="block rounded-2xl bg-[#fff0f7] px-4 py-3 text-sm font-bold text-[#b83280]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </>
        )}

        {activeTab === "Hediyeler" && (
          <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-[#b83280]">
                  Hediye Yönetimi
                </p>
                <h2 className="mt-2 text-3xl font-extrabold">
                  Öneri havuzu
                </h2>
              </div>

              <input
                value={giftSearch}
                onChange={(event) => setGiftSearch(event.target.value)}
                placeholder="Hediye ara..."
                className="rounded-full border border-[#f0d7df] bg-[#fffaf7] px-5 py-3 outline-none focus:border-[#b83280]"
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-[#f0d7df]">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#fff0f7] text-[#b83280]">
                  <tr>
                    <th className="p-4">Hediye</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Bütçe</th>
                    <th className="p-4">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGifts.map((gift) => (
                    <tr key={gift.title} className="border-t border-[#f0d7df]">
                      <td className="p-4 font-bold">{gift.title}</td>
                      <td className="p-4">{gift.category}</td>
                      <td className="p-4">{gift.budget}</td>
                      <td className="p-4">
                        <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                          {gift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6b4b4b]">
              Bu tablo şimdilik örnek veri gösteriyor. Sonraki aşamada
              <code className="mx-1 rounded bg-[#fff0f7] px-2 py-1">
                src/data/gifts.ts
              </code>
              dosyasındaki gerçek hediyeleri buraya bağlayabiliriz.
            </p>
          </div>
        )}

        {activeTab === "Blog" && (
          <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">Blog Yönetimi</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Hediye rehberi yazıları
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {blogPosts.map((post) => (
                <div
                  key={post.url}
                  className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-extrabold">{post.title}</h3>
                    <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                      {post.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-[#6b4b4b]">
                    Hedef kelime: <strong>{post.keyword}</strong>
                  </p>

                  <a
                    href={post.url}
                    className="mt-4 inline-block rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white"
                  >
                    Yazıyı aç
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "SEO" && (
          <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">SEO Kontrol</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Google görünürlüğü
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {seoTasks.map((task) => (
                <div
                  key={task}
                  className="rounded-3xl bg-[#fffaf7] p-5 text-sm font-semibold leading-6 text-[#6b4b4b]"
                >
                  {task}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-[#fff0f7] p-5">
              <h3 className="text-xl font-extrabold">Search Console Notu</h3>
              <p className="mt-3 leading-7 text-[#6b4b4b]">
                Google doğrulaması tamamlandı. Sitemap gönderildi. Index isteği
                için kota dolarsa ertesi gün tekrar denenmeli.
              </p>
            </div>
          </div>
        )}

        {activeTab === "Paketler" && (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {["Ücretsiz", "Premium", "Deneyim Paketi"].map((plan) => (
              <div key={plan} className="rounded-[2rem] bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-[#b83280]">Paket</p>
                <h2 className="mt-2 text-3xl font-extrabold">{plan}</h2>
                <p className="mt-4 leading-7 text-[#6b4b4b]">
                  Bu paketin açıklaması, fiyatı ve içerikleri sonraki aşamada
                  buradan yönetilebilir.
                </p>
                <button className="mt-5 rounded-full bg-[#b83280] px-5 py-3 text-sm font-bold text-white opacity-60">
                  Yakında düzenlenebilir
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Yapılacaklar" && (
          <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">Roadmap</p>
            <h2 className="mt-2 text-3xl font-extrabold">
              NeAlsam geliştirme listesi
            </h2>

            <div className="mt-6 space-y-4">
              {todos.map((todo) => (
                <div
                  key={todo.title}
                  className="flex flex-col gap-3 rounded-3xl bg-[#fffaf7] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-extrabold">{todo.title}</h3>
                    <p className="mt-1 text-sm text-[#6b4b4b]">
                      Durum: {todo.status}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#b83280]">
                    {todo.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
