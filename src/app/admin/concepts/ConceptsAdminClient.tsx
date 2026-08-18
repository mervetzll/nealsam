"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConceptRow = {
  id?: string;
  concept_key: string;
  title: string;
  badge: string;
  description: string;
  best_for: string[];
  sample: string;
  premium_level: string;
  is_active: boolean;
  usage_count?: number;
};

const emptyConcept: ConceptRow = {
  concept_key: "",
  title: "",
  badge: "",
  description: "",
  best_for: [],
  sample: "",
  premium_level: "plus",
  is_active: true,
  usage_count: 0,
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

export default function ConceptsAdminClient() {
  const [concepts, setConcepts] = useState<ConceptRow[]>([]);
  const [form, setForm] = useState<ConceptRow>(emptyConcept);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadConcepts() {
    setLoading(true);

    const params = new URLSearchParams({
      search,
      status,
    });

    try {
      const response = await fetch(`/api/admin-concepts?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok) {
        setConcepts(data.concepts || []);
      } else {
        alert(data?.error || "Konseptler alınamadı.");
      }
    } catch {
      alert("Konseptler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConcepts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function startEdit(concept: ConceptRow) {
    setEditingId(concept.id || null);
    setForm({
      ...concept,
      best_for: concept.best_for || [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyConcept);
  }

  async function saveConcept() {
    setSaving(true);

    try {
      const method = editingId ? "PATCH" : "POST";

      const payload = {
        ...form,
        id: editingId,
      };

      const response = await fetch("/api/admin-concepts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Konsept kaydedilemedi.");
        return;
      }

      alert(editingId ? "Konsept güncellendi." : "Konsept eklendi.");
      resetForm();
      await loadConcepts();
    } catch {
      alert("Konsept kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleConcept(concept: ConceptRow) {
    const updated = {
      ...concept,
      is_active: !concept.is_active,
    };

    try {
      const response = await fetch("/api/admin-concepts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Durum değiştirilemedi.");
        return;
      }

      await loadConcepts();
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
              Premium Konsept Yönetimi
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Kader Bağı, Hediye Avı, Anı Kutusu ve Gizli Mesaj gibi premium
              deneyimleri buradan düzenleyebilirsin.
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
            {editingId ? "Konsepti Düzenle" : "Yeni Konsept Ekle"}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-black text-[#6b4a4a]">
              Konsept key
              <input
                value={form.concept_key}
                onChange={(event) =>
                  setForm({ ...form, concept_key: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: kader-bagi"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Başlık
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Kader Bağı"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Rozet
              <input
                value={form.badge}
                onChange={(event) =>
                  setForm({ ...form, badge: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Örn: Duygusal bağ"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a]">
              Paket seviyesi
              <select
                value={form.premium_level}
                onChange={(event) =>
                  setForm({ ...form, premium_level: event.target.value })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              >
                <option value="plus">plus</option>
                <option value="experience">experience</option>
                <option value="premium">premium</option>
              </select>
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Kimler için uygun?
              <input
                value={arrayToText(form.best_for)}
                onChange={(event) =>
                  setForm({ ...form, best_for: textToArray(event.target.value) })
                }
                className="mt-2 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
                placeholder="Sevgili, Arkadaş, Aile, Yıl dönümü"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Açıklama
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                className="mt-2 min-h-28 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
              />
            </label>

            <label className="text-sm font-black text-[#6b4a4a] md:col-span-2">
              Örnek mesaj / örnek his
              <textarea
                value={form.sample}
                onChange={(event) =>
                  setForm({ ...form, sample: event.target.value })
                }
                className="mt-2 min-h-28 w-full rounded-2xl border border-pink-100 px-4 py-3 font-semibold outline-none focus:border-pink-400"
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
              Aktif konsept
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={saveConcept}
              disabled={saving}
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Konsept Ekle"}
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
              <h2 className="text-2xl font-black">Konsept Listesi</h2>

              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Toplam görünen konsept: {concepts.length}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") loadConcepts();
                }}
                placeholder="Konsept ara..."
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

              <button
                onClick={loadConcepts}
                className="rounded-2xl bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white"
              >
                Filtrele
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
              Konseptler yükleniyor...
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {concepts.map((concept) => (
                <article
                  key={concept.id}
                  className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                      {concept.badge}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                      {concept.premium_level}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        concept.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {concept.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-black text-[#2b1b1b]">
                    {concept.title}
                  </h3>

                  <p className="mt-2 text-xs font-black text-pink-700">
                    key: {concept.concept_key}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[#6b4a4a]">
                    {concept.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {concept.best_for?.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(concept)}
                      className="rounded-full bg-pink-600 px-4 py-3 text-sm font-black text-white"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => toggleConcept(concept)}
                      className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700"
                    >
                      {concept.is_active ? "Pasif Yap" : "Aktif Yap"}
                    </button>

                    <Link
                      href={`/deneyim?concept=${concept.concept_key}`}
                      className="rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white"
                    >
                      Önizle
                    </Link>
                  </div>
                </article>
              ))}

              {concepts.length === 0 && (
                <div className="rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
                  Konsept bulunamadı.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
