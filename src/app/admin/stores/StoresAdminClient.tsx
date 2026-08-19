"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type StoreRule = {
  id?: string;
  store_name: string;
  category: string;
  budget_level: string;
  keywords: string[];
  search_prefix: string;
  affiliate_url: string | null;
  priority: number;
  is_active: boolean;
};

const emptyRule: StoreRule = {
  store_name: "",
  category: "Giyim",
  budget_level: "all",
  keywords: [],
  search_prefix: "",
  affiliate_url: "",
  priority: 1,
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

export default function StoresAdminClient() {
  const [rules, setRules] = useState<StoreRule[]>([]);
  const [form, setForm] = useState<StoreRule>(emptyRule);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();

    rules.forEach((rule) => {
      if (rule.category) set.add(rule.category);
    });

    return Array.from(set).sort();
  }, [rules]);

  async function loadRules() {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      category,
      status,
    });

    try {
      const response = await fetch(`/api/admin-store-rules?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok) {
        setRules(data.rules || []);
      } else {
        alert(data?.error || "Mağaza kuralları alınamadı.");
      }
    } catch {
      alert("Mağaza kuralları alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyRule);
  }

  function startEdit(rule: StoreRule) {
    setEditingId(rule.id || null);
    setForm({
      ...rule,
      keywords: rule.keywords || [],
      affiliate_url: rule.affiliate_url || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveRule() {
    setSaving(true);

    try {
      const method = editingId ? "PATCH" : "POST";
      const payload = {
        ...form,
        id: editingId,
      };

      const response = await fetch("/api/admin-store-rules", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Mağaza kuralı kaydedilemedi.");
        return;
      }

      alert(editingId ? "Mağaza kuralı güncellendi." : "Mağaza kuralı eklendi.");
      resetForm();
      await loadRules();
    } catch {
      alert("Mağaza kuralı kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleRule(rule: StoreRule) {
    const updated = {
      ...rule,
      is_active: !rule.is_active,
    };

    try {
      const response = await fetch("/api/admin-store-rules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Durum değiştirilemedi.");
        return;
      }

      await loadRules();
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
              Mağaza Yönetimi
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Kategoriye, bütçeye ve anahtar kelimelere göre hangi mağazaların
              önerileceğini buradan yönetebilirsin.
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
            {editingId ? "Mağaza Kuralını Düzenle" : "Yeni Mağaza Kuralı Ekle"}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-black text-[#6b4a4a]">
              Mağaza adı
              <input
                value={form.store_name}
                onChange={(event) =>
                  setForm({ ...form, store_name: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Boyner"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Kategori
              <input
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Giyim, Parfüm, Teknoloji"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Bütçe seviyesi
              <select
                value={form.budget_level}
                onChange={(event) =>
                  setForm({ ...form, budget_level: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">all</option>
                <option value="budget">budget</option>
                <option value="mid">mid</option>
                <option value="premium">premium</option>
                <option value="luxury">luxury</option>
              </select>
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Öncelik
              <input
                type="number"
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: Number(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Anahtar kelimeler
              <input
                value={arrayToText(form.keywords)}
                onChange={(event) =>
                  setForm({ ...form, keywords: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="tişört, sweatshirt, hoodie, giyim"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Google arama prefixi
              <input
                value={form.search_prefix}
                onChange={(event) =>
                  setForm({ ...form, search_prefix: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Boyner Tommy Hilfiger"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Affiliate / özel link
              <input
                value={form.affiliate_url || ""}
                onChange={(event) =>
                  setForm({ ...form, affiliate_url: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Varsa özel link, yoksa boş bırak"
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
              Aktif kural
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={saveRule}
              disabled={saving}
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Kural Ekle"}
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
              <h2 className="text-2xl font-black">Mağaza Kuralları</h2>

              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Toplam görünen kural: {rules.length}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") loadRules();
                }}
                placeholder="Mağaza ara..."
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              />

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

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>

              <button
                onClick={loadRules}
                className="rounded-2xl bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white md:col-span-3"
              >
                Filtrele
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
              Mağaza kuralları yükleniyor...
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {rules.map((rule) => (
                <article
                  key={rule.id}
                  className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                          {rule.category}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                          {rule.budget_level}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                          Öncelik: {rule.priority}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            rule.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {rule.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-2xl font-black text-[#2b1b1b]">
                        {rule.store_name}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                        Arama prefixi: {rule.search_prefix || "-"}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#6b4a4a]">
                        Anahtar kelimeler:{" "}
                        {rule.keywords?.length ? rule.keywords.join(", ") : "-"}
                      </p>

                      {rule.affiliate_url && (
                        <p className="mt-2 break-all text-xs font-semibold text-pink-700">
                          Link: {rule.affiliate_url}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => startEdit(rule)}
                        className="rounded-full bg-pink-600 px-4 py-3 text-sm font-black text-white"
                      >
                        Düzenle
                      </button>

                      <button
                        onClick={() => toggleRule(rule)}
                        className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700"
                      >
                        {rule.is_active ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {rules.length === 0 && (
                <div className="rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
                  Mağaza kuralı bulunamadı.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
