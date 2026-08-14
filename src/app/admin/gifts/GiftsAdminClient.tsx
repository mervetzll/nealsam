"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type GiftRow = {
  id?: string;
  title: string;
  category: string;
  sub_category: string;
  price_min: number;
  price_max: number;
  recipients: string[];
  interests: string[];
  styles: string[];
  occasions: string[];
  urgency: string[];
  risk_level: string;
  reason: string;
  note: string;
  search_query: string;
  is_active: boolean;
};

const emptyGift: GiftRow = {
  title: "",
  category: "Moda",
  sub_category: "Giyim",
  price_min: 250,
  price_max: 1500,
  recipients: [],
  interests: [],
  styles: [],
  occasions: [],
  urgency: [],
  risk_level: "medium",
  reason: "",
  note: "",
  search_query: "",
  is_active: true,
};

function arrayToText(value: string[]) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function textToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function GiftsAdminClient() {
  const [gifts, setGifts] = useState<GiftRow[]>([]);
  const [form, setForm] = useState<GiftRow>(emptyGift);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    gifts.forEach((gift) => {
      if (gift.category) set.add(gift.category);
    });

    return Array.from(set).sort();
  }, [gifts]);

  async function loadGifts() {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      status,
      category,
    });

    try {
      const response = await fetch(`/api/admin-gifts-manage?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok) {
        setGifts(data.gifts || []);
      } else {
        alert(data?.error || "Hediyeler alınamadı.");
      }
    } catch {
      alert("Hediyeler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, category]);

  function startEdit(gift: GiftRow) {
    setEditingId(gift.id || null);
    setForm({
      ...gift,
      recipients: gift.recipients || [],
      interests: gift.interests || [],
      styles: gift.styles || [],
      occasions: gift.occasions || [],
      urgency: gift.urgency || [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyGift);
  }

  async function saveGift() {
    setSaving(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const payload = {
        ...form,
        id: editingId,
        search_query: form.search_query || form.title,
      };

      const response = await fetch("/api/admin-gifts-manage", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Hediye kaydedilemedi.");
        return;
      }

      alert(editingId ? "Hediye güncellendi." : "Hediye eklendi.");
      resetForm();
      await loadGifts();
    } catch {
      alert("Hediye kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleGift(gift: GiftRow) {
    const updated = {
      ...gift,
      is_active: !gift.is_active,
    };

    try {
      const response = await fetch("/api/admin-gifts-manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Durum değiştirilemedi.");
        return;
      }

      await loadGifts();
    } catch {
      alert("Durum değiştirilemedi.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Admin Panel
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Hediye Yönetimi
            </h1>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Hediyeleri ekle, düzenle, aktif/pasif yap ve kategoriye göre kontrol et.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
          >
            Admin Ana Sayfa
          </Link>
        </div>

        <section className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            {editingId ? "Hediyeyi Düzenle" : "Yeni Hediye Ekle"}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-black text-[#6b4a4a]">
              Hediye adı
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Erkek parfümü"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Kategori
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Kozmetik"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Alt kategori
              <input
                value={form.sub_category}
                onChange={(event) =>
                  setForm({ ...form, sub_category: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Parfüm"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Risk seviyesi
              <select
                value={form.risk_level}
                onChange={(event) =>
                  setForm({ ...form, risk_level: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Min fiyat
              <input
                type="number"
                value={form.price_min}
                onChange={(event) =>
                  setForm({ ...form, price_min: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Max fiyat
              <input
                type="number"
                value={form.price_max}
                onChange={(event) =>
                  setForm({ ...form, price_max: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Kime uygun? Virgülle ayır
              <input
                value={arrayToText(form.recipients)}
                onChange={(event) =>
                  setForm({ ...form, recipients: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Sevgilim, Arkadaşım, Annem"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              İlgi alanları
              <input
                value={arrayToText(form.interests)}
                onChange={(event) =>
                  setForm({ ...form, interests: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Moda, Parfüm, Giyim"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Tarzlar
              <input
                value={arrayToText(form.styles)}
                onChange={(event) =>
                  setForm({ ...form, styles: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Şık, Minimal, Lüks"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Özel günler
              <input
                value={arrayToText(form.occasions)}
                onChange={(event) =>
                  setForm({ ...form, occasions: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Doğum günü, Yıl dönümü"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Aciliyet
              <input
                value={arrayToText(form.urgency)}
                onChange={(event) =>
                  setForm({ ...form, urgency: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Bugün lazım, Birkaç gün içinde, Acil değil"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Önerme nedeni
              <textarea
                value={form.reason}
                onChange={(event) => setForm({ ...form, reason: event.target.value })}
                className="mt-2 min-h-28 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Hediye notu
              <textarea
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                className="mt-2 min-h-24 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Arama kelimesi
              <input
                value={form.search_query}
                onChange={(event) =>
                  setForm({ ...form, search_query: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: erkek parfüm Sevil Boyner Sephora"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-black text-[#6b4a4a]">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm({ ...form, is_active: event.target.checked })
                }
              />
              Aktif hediye
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={saveGift}
              disabled={saving}
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Hediye Ekle"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-full border border-pink-200 bg-white px-6 py-4 text-sm font-black text-pink-700"
              >
                Vazgeç
              </button>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black">Hediye Listesi</h2>
              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Toplam görünen hediye: {gifts.length}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") loadGifts();
                }}
                placeholder="Hediye ara..."
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">Tüm kategoriler</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                onClick={loadGifts}
                className="rounded-2xl bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white md:col-span-3"
              >
                Filtrele
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
              Hediyeler yükleniyor...
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {gifts.map((gift) => (
                <article
                  key={gift.id}
                  className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                          {gift.category}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                          {gift.sub_category}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            gift.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {gift.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-black text-[#2b1b1b]">
                        {gift.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                        {gift.price_min} TL - {gift.price_max} TL
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6b4a4a]">
                        {gift.reason}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(gift)}
                        className="rounded-full bg-pink-600 px-4 py-3 text-sm font-black text-white"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => toggleGift(gift)}
                        className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700"
                      >
                        {gift.is_active ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {gifts.length === 0 && (
                <div className="rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
                  Hediye bulunamadı.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
