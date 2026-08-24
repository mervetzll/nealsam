"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Gift = {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  sub_category?: string;
  price_min?: number;
  price_max?: number;
  price?: string;
  budget?: string;
  recipients?: string[];
  interests?: string[];
  styles?: string[];
  occasions?: string[];
  urgency?: string[];
  risk_level?: string;
  reason?: string;
  note?: string;
  search_query?: string;
  description?: string;
  tags?: string[];
  is_active?: boolean;
};

const emptyForm = {
  title: "",
  category: "Genel",
  sub_category: "Genel",
  price_min: "0",
  price_max: "999999",
  recipients: "",
  interests: "",
  styles: "",
  occasions: "",
  urgency: "",
  risk_level: "low",
  reason: "",
  note: "",
  search_query: "",
  description: "",
  tags: "",
  is_active: true,
};

function arrayToText(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (!value) return "";
  return String(value);
}

function normalizeGift(item: any): Gift {
  return {
    id: item?.id,
    title: item?.title || item?.name || "Hediye",
    name: item?.name || item?.title || "Hediye",
    category: item?.category || "Genel",
    sub_category: item?.sub_category || item?.subCategory || item?.category || "Genel",
    price_min: Number(item?.price_min ?? item?.priceMin ?? 0),
    price_max: Number(item?.price_max ?? item?.priceMax ?? 999999),
    price: item?.price || "",
    budget: item?.budget || "",
    recipients: Array.isArray(item?.recipients) ? item.recipients : [],
    interests: Array.isArray(item?.interests) ? item.interests : [],
    styles: Array.isArray(item?.styles) ? item.styles : [],
    occasions: Array.isArray(item?.occasions) ? item.occasions : [],
    urgency: Array.isArray(item?.urgency) ? item.urgency : [],
    risk_level: item?.risk_level || item?.riskLevel || "low",
    reason: item?.reason || "",
    note: item?.note || "",
    search_query: item?.search_query || item?.searchQuery || item?.title || "hediye",
    description: item?.description || item?.reason || "",
    tags: Array.isArray(item?.tags) ? item.tags : [],
    is_active: item?.is_active !== false,
  };
}

export default function AdminGiftsClient() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGifts();
  }, []);

  async function loadGifts() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin-gifts", {
        cache: "no-store",
      });

      const data = await response.json();

      const list = Array.isArray(data?.gifts)
        ? data.gifts
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
            ? data.data
            : [];

      if (!data?.ok && list.length === 0) {
        setMessage(data?.error || "Hediyeler alınamadı.");
        setGifts([]);
        return;
      }

      setGifts(list.map(normalizeGift));
    } catch (error) {
      setMessage("Hediyeler alınamadı.");
      setGifts([]);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return Array.from(new Set(gifts.map((gift) => gift.category || "Genel"))).sort();
  }, [gifts]);

  const filteredGifts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return gifts.filter((gift) => {
      const active = gift.is_active !== false;

      if (statusFilter === "active" && !active) return false;
      if (statusFilter === "passive" && active) return false;
      if (categoryFilter !== "all" && gift.category !== categoryFilter) return false;

      if (!q) return true;

      const text = [
        gift.title,
        gift.category,
        gift.sub_category,
        gift.reason,
        gift.note,
        gift.search_query,
        gift.description,
        arrayToText(gift.tags),
        arrayToText(gift.recipients),
        arrayToText(gift.interests),
        arrayToText(gift.styles),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [gifts, search, statusFilter, categoryFilter]);

  function updateForm(key: keyof typeof emptyForm, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function startEdit(gift: Gift) {
    setEditingId(gift.id || null);

    setForm({
      title: gift.title || "",
      category: gift.category || "Genel",
      sub_category: gift.sub_category || gift.category || "Genel",
      price_min: String(gift.price_min ?? 0),
      price_max: String(gift.price_max ?? 999999),
      recipients: arrayToText(gift.recipients),
      interests: arrayToText(gift.interests),
      styles: arrayToText(gift.styles),
      occasions: arrayToText(gift.occasions),
      urgency: arrayToText(gift.urgency),
      risk_level: gift.risk_level || "low",
      reason: gift.reason || gift.description || "",
      note: gift.note || "",
      search_query: gift.search_query || gift.title || "",
      description: gift.description || gift.reason || "",
      tags: arrayToText(gift.tags),
      is_active: gift.is_active !== false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveGift() {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        id: editingId,
        price_min: Number(form.price_min || 0),
        price_max: Number(form.price_max || 999999),
      };

      const response = await fetch("/api/admin-gifts-manage", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Hediye kaydedilemedi.");
        return;
      }

      setMessage(editingId ? "Hediye güncellendi." : "Hediye eklendi.");
      resetForm();
      await loadGifts();
    } catch {
      setMessage("Hediye kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function deactivateGift(id?: string) {
    if (!id) return;

    const confirmed = confirm("Bu hediyeyi pasife almak istiyor musun?");
    if (!confirmed) return;

    try {
      const response = await fetch("/api/admin-gifts-manage", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Hediye pasife alınamadı.");
        return;
      }

      await loadGifts();
    } catch {
      alert("Hediye pasife alınamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between md:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Admin
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              Hediye Yönetimi
            </h1>

            <p className="mt-4 text-sm font-semibold text-[#6b4a4a]">
              Hediyeleri ekle, düzenle, pasife al ve kategoriye göre kontrol et.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full bg-[#2b1b1b] px-6 py-4 text-center text-sm font-black text-white"
          >
            Admin Ana Sayfa
          </Link>
        </div>

        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">
            {editingId ? "Hediyeyi Düzenle" : "Yeni Hediye Ekle"}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Hediye başlığı"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.category}
              onChange={(event) => updateForm("category", event.target.value)}
              placeholder="Kategori"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.sub_category}
              onChange={(event) => updateForm("sub_category", event.target.value)}
              placeholder="Alt kategori"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.search_query}
              onChange={(event) => updateForm("search_query", event.target.value)}
              placeholder="Arama kelimesi"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              type="number"
              value={form.price_min}
              onChange={(event) => updateForm("price_min", event.target.value)}
              placeholder="Min fiyat"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              type="number"
              value={form.price_max}
              onChange={(event) => updateForm("price_max", event.target.value)}
              placeholder="Max fiyat"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.recipients}
              onChange={(event) => updateForm("recipients", event.target.value)}
              placeholder="Kime? Örn: sevgili, anne, arkadaş"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.interests}
              onChange={(event) => updateForm("interests", event.target.value)}
              placeholder="İlgi alanları: kahve, bakım, dekor"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.styles}
              onChange={(event) => updateForm("styles", event.target.value)}
              placeholder="Stiller: cozy, romantik, kullanışlı"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.occasions}
              onChange={(event) => updateForm("occasions", event.target.value)}
              placeholder="Özel günler: doğum günü, yıl dönümü"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.urgency}
              onChange={(event) => updateForm("urgency", event.target.value)}
              placeholder="Acil durum: bugün lazım, yarın lazım"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <select
              value={form.risk_level}
              onChange={(event) => updateForm("risk_level", event.target.value)}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            >
              <option value="low">Düşük risk</option>
              <option value="medium">Orta risk</option>
              <option value="high">Yüksek risk</option>
            </select>
          </div>

          <div className="mt-4 grid gap-4">
            <textarea
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="Açıklama"
              rows={3}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <textarea
              value={form.reason}
              onChange={(event) => updateForm("reason", event.target.value)}
              placeholder="Neden öneriliyor?"
              rows={3}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <textarea
              value={form.note}
              onChange={(event) => updateForm("note", event.target.value)}
              placeholder="Hediye notu / sunum önerisi"
              rows={3}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={form.tags}
              onChange={(event) => updateForm("tags", event.target.value)}
              placeholder="Etiketler: pijama, cozy, bakım"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <label className="flex items-center gap-3 text-sm font-black">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => updateForm("is_active", event.target.checked)}
              />
              Aktif hediye
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
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

          {message && (
            <p className="mt-5 rounded-2xl bg-[#fff4ef] p-4 text-sm font-black text-pink-700">
              {message}
            </p>
          )}
        </div>

        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-black">Hediye Listesi</h2>
              <p className="mt-2 text-sm font-black text-[#6b4a4a]">
                Toplam görünen hediye: {filteredGifts.length}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Hediye ara..."
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="all">Tüm kategoriler</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black">
              Hediyeler yükleniyor...
            </p>
          ) : filteredGifts.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black">
              Hediye bulunamadı.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredGifts.map((gift) => (
                <article
                  key={gift.id}
                  className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                          {gift.is_active === false ? "Pasif" : "Aktif"}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                          {gift.category}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                          {gift.price_min}–{gift.price_max} TL
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-black">{gift.title}</h3>

                      <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
                        {gift.reason || gift.description || "Açıklama yok."}
                      </p>

                      <p className="mt-2 text-xs font-black text-pink-700">
                        Arama: {gift.search_query || gift.title}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(gift)}
                        className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => deactivateGift(gift.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-600"
                      >
                        Pasife Al
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
