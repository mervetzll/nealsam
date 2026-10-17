"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FavoriteGift = {
  id: string;
  gift_title: string;
  gift_category: string | null;
  gift_reason: string | null;
  gift_note: string | null;
  gift_search_query: string | null;
  created_at: string;
};
type BrowserGift = { title: string; category?: string; description?: string; price?: string };

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [browserGifts, setBrowserGifts] = useState<BrowserGift[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
  async function loadFavorites() {
    try {
      const local = JSON.parse(localStorage.getItem("nealsam.favorites.v1") || "[]");
      if (Array.isArray(local)) setBrowserGifts(local.filter(item => typeof item?.title === "string"));
    } catch { /* Local favorites are optional. */ }

    try {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);

    const { data, error } = await supabase
      .from("favorite_gifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    if (error) setError("Hesabındaki favoriler yüklenemedi. Sayfayı yenileyerek tekrar deneyebilirsin.");

    setLoading(false);
    } catch {
      setError("Hesap bağlantısı kurulamadı. Bu tarayıcıdaki kayıtlarını kullanabilirsin.");
      setLoading(false);
    }
  }

    void loadFavorites();
  }, []);

  async function deleteFavorite(id: string) {
    const ok = confirm("Bu favoriyi silmek istiyor musun?");
    if (!ok) return;

    const { error } = await supabase.from("favorite_gifts").delete().eq("id", id);
    if (error) { setError("Favori silinemedi. Tekrar deneyebilirsin."); return; }
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#fff4ef]">
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-pink-600">Hesabım</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Favori hediyelerim
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6b4a4a]">
              Beğendiğin hediye fikirlerini burada saklayabilirsin.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/hesabim"
              className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
            >
              Profilime Dön
            </Link>

            <Link
              href="/hediye-bul"
              className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
            >
              Yeni Hediye Bul
            </Link>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-pink-100 bg-white p-5" aria-label="Bu tarayıcıdaki favoriler">
          <h2 className="text-xl font-bold">Bu tarayıcıda kaydettiklerin ({browserGifts.length})</h2>
          <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">Hediye Bul ekranında kaydettiklerin burada görünür. Bu kayıtlar hesabına otomatik aktarılmaz; tarayıcı verilerini silersen silinir.</p>
          {browserGifts.length === 0 && <p className="mt-4 text-sm">Henüz kayıt yok. Hediye önerilerindeki ♡ Kaydet düğmesini kullanabilirsin.</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{browserGifts.map(gift => <article key={gift.title} className="rounded-xl bg-[#fff4ef] p-4">
            <h3 className="font-bold">{gift.title}</h3>
            <p className="mt-2 text-sm text-[#6b4a4a]">{gift.price ? `Tahmini: ${gift.price}` : gift.category}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/hediye-karsilastir?gift=${encodeURIComponent(gift.title)}`} className="text-sm font-bold text-pink-700 underline">Karşılaştır</Link>
              <Link href={`/deneyim?gift=${encodeURIComponent(gift.title)}`} className="text-sm font-bold text-pink-700 underline">Not oluştur</Link>
              <button type="button" className="text-sm font-bold text-[#6b4a4a] underline" onClick={() => {
                const next = browserGifts.filter(item => item.title !== gift.title);
                try { localStorage.setItem("nealsam.favorites.v1", JSON.stringify(next)); setBrowserGifts(next); } catch { setError("Tarayıcı kaydı değiştirilemedi."); }
              }}>Kaldır</button>
            </div>
          </article>)}</div>
        </section>
        {error && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
        {loading && (
          <div className="mt-10 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-[#2b1b1b]">Favoriler yükleniyor...</p>
          </div>
        )}

        {!loading && !loggedIn && (
          <div className="mt-10 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Hesabındaki favoriler için giriş yap
            </h2>
            <p className="mt-3 text-sm text-[#6b4a4a]">
              Daha önce hesabına kaydettiğin favorileri giriş yaptıktan sonra görebilirsin.
            </p>

            <Link
              href="/giris"
              className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white transition hover:bg-pink-700"
            >
              Giriş Yap
            </Link>
          </div>
        )}

        {!loading && loggedIn && items.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#2b1b1b]">
              Henüz favori hediyen yok
            </h2>
            <p className="mt-3 text-sm text-[#6b4a4a]">
              Hediye Bul sayfasında beğendiğin önerileri favorilerine ekleyebilirsin.
            </p>

            <Link
              href="/hediye-bul"
              className="mt-6 inline-flex rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white transition hover:opacity-90"
            >
              Hediye Bul
            </Link>
          </div>
        )}

        {!loading && loggedIn && items.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      {item.gift_category || "Favori Hediye"}
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#2b1b1b]">
                      {item.gift_title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteFavorite(item.id)}
                    className="rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>

                {item.gift_reason && (
                  <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
                    {item.gift_reason}
                  </p>
                )}

                {item.gift_note && (
                  <div className="mt-4 rounded-2xl bg-[#fff0f7] p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      Not fikri
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
                      {item.gift_note}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      item.gift_search_query || item.gift_title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white transition hover:opacity-90"
                  >
                    İnternette Ara
                  </a>

                  <span className="rounded-full border border-pink-100 bg-[#fff4ef] px-4 py-3 text-xs font-bold text-[#6b4a4a]">
                    {new Date(item.created_at).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
