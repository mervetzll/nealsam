"use client";

import { useEffect, useMemo, useState } from "react";
import { giftTemplates } from "@/data/giftTemplates";
import ExportGiftsButton from "@/components/admin/ExportGiftsButton";

type RiskLevel = "low" | "medium" | "high";

type Gift = {
  id?: string;
  title: string;
  category: string;
  subCategory: string;
  priceMin: number;
  priceMax: number;
  recipients: string[];
  interests: string[];
  styles: string[];
  occasions: string[];
  urgency: string[];
  riskLevel: RiskLevel;
  reason: string;
  note: string;
  searchQuery: string;
  isActive: boolean;
  createdAt?: string;
};

const emptyGift: Gift = {
  title: "",
  category: "",
  subCategory: "",
  priceMin: 0,
  priceMax: 0,
  recipients: [],
  interests: [],
  styles: [],
  occasions: [],
  urgency: [],
  riskLevel: "low",
  reason: "",
  note: "",
  searchQuery: "",
  isActive: true,
};

function arrayToText(value: string[] | undefined) {
  return value?.join(", ") || "";
}


function getQualityWarnings(gift: Gift): string[] {
  const warnings: string[] = [];

  if (!gift.title.trim()) warnings.push("Hediye adı boş.");
  if (!gift.category.trim()) warnings.push("Kategori boş.");
  if (!gift.subCategory.trim()) warnings.push("Alt kategori boş.");
  if (!gift.searchQuery.trim()) warnings.push("Search query boş.");
  if (!gift.priceMin || !gift.priceMax) warnings.push("Fiyat aralığı eksik.");
  if (gift.priceMax < gift.priceMin) warnings.push("Max fiyat min fiyattan düşük.");
  if (gift.recipients.length === 0) warnings.push("Alıcılar boş.");
  if (gift.interests.length === 0) warnings.push("İlgi alanları boş.");
  if (gift.styles.length === 0) warnings.push("Tarzlar boş.");
  if (gift.occasions.length === 0) warnings.push("Özel günler boş.");
  if (gift.urgency.length === 0) warnings.push("Aciliyet boş.");
  if (gift.reason.trim().length < 40) warnings.push("Neden uygun açıklaması kısa.");
  if (gift.note.trim().length < 15) warnings.push("Not önerisi kısa.");

  return warnings;
}

function textToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function GiftManager() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [form, setForm] = useState<Gift>(emptyGift);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadGifts() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin-gifts", { cache: "no-store" });
      const data = await response.json();

      if (response.ok && Array.isArray(data.gifts)) {
        setGifts(data.gifts);
      } else {
        alert(data.error || "Hediyeler yüklenemedi.");
      }
    } catch (error) {
      console.error(error);
      alert("Hediyeler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGifts();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(gifts.map((gift) => gift.category).filter(Boolean))).sort();
  }, [gifts]);

  const qualityWarnings = useMemo(() => getQualityWarnings(form), [form]);

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) => {
      const q = search.toLowerCase();

      const matchesSearch =
        !q ||
        gift.title.toLowerCase().includes(q) ||
        gift.category.toLowerCase().includes(q) ||
        gift.subCategory.toLowerCase().includes(q) ||
        gift.searchQuery.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "all" || gift.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && gift.isActive !== false) ||
        (statusFilter === "passive" && gift.isActive === false);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [gifts, search, categoryFilter, statusFilter]);

  function resetForm() {
    setForm(emptyGift);
    setEditingId(null);
  }

  function applyTemplate(templateName: string) {
    const template = giftTemplates.find((item) => item.name === templateName);
    if (!template) return;

    setForm({
      ...form,
      category: template.category,
      subCategory: template.subCategory,
      recipients: template.recipients,
      interests: template.interests,
      styles: template.styles,
      occasions: template.occasions,
      urgency: template.urgency,
      riskLevel: template.riskLevel,
      reason: template.reason,
      note: template.note,
      searchQuery: form.title
        ? `${form.title} hediye`
        : `${template.name.toLowerCase()} hediye`,
    });
  }

  function startEdit(gift: Gift) {
    setForm({
      ...gift,
      recipients: gift.recipients || [],
      interests: gift.interests || [],
      styles: gift.styles || [],
      occasions: gift.occasions || [],
      urgency: gift.urgency || [],
      isActive: gift.isActive !== false,
    });
    setEditingId(gift.id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveGift() {
    if (!form.title || !form.category || !form.subCategory) {
      alert("Hediye adı, kategori ve alt kategori zorunlu.");
      return;
    }

    if (!form.priceMin || !form.priceMax || form.priceMax < form.priceMin) {
      alert("Fiyat aralığını doğru gir.");
      return;
    }

    try {
      setSaving(true);

      const method = editingId ? "PUT" : "POST";
      const payload = editingId ? { ...form, id: editingId } : form;

      const response = await fetch("/api/admin-gifts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Kayıt başarısız.");
        return;
      }

      await loadGifts();
      resetForm();
      alert(editingId ? "Hediye güncellendi." : "Hediye eklendi.");
    } catch (error) {
      console.error(error);
      alert("Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteGift(id?: string) {
    if (!id) return;

    const ok = confirm("Bu hediyeyi silmek istediğine emin misin?");
    if (!ok) return;

    try {
      const response = await fetch(`/api/admin-gifts?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Silme başarısız.");
        return;
      }

      await loadGifts();
      if (editingId === id) resetForm();
    } catch (error) {
      console.error(error);
      alert("Silme sırasında hata oluştu.");
    }
  }

  async function toggleActive(gift: Gift) {
    if (!gift.id) return;

    try {
      const response = await fetch("/api/admin-gifts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...gift,
          isActive: gift.isActive === false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Durum değiştirilemedi.");
        return;
      }

      await loadGifts();
    } catch (error) {
      console.error(error);
      alert("Durum değiştirilirken hata oluştu.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              {editingId ? "Hediyeyi Düzenle" : "Yeni Hediye Ekle"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Buraya eklenen aktif hediyeler Hediye Bul sisteminde kullanılır.
            </p>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Yeni kayıt aç
            </button>
          )}
        </div>


        <div className="mt-6 rounded-3xl border border-pink-100 bg-pink-50 p-5">
          <h3 className="text-lg font-bold text-slate-950">
            Hazır hediye şablonları
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Sıfırdan yazmak yerine kategoriye göre alanları otomatik doldur.
            Sonra sadece başlık, fiyat ve arama kelimesini düzenle.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {giftTemplates.map((template) => (
              <button
                key={template.name}
                type="button"
                onClick={() => applyTemplate(template.name)}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm hover:bg-pink-100"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Hediye adı"
            value={form.title}
            onChange={(value) => setForm({ ...form, title: value })}
            placeholder="Örn: Makyaj organizeri"
          />

          <Input
            label="Kategori"
            value={form.category}
            onChange={(value) => setForm({ ...form, category: value })}
            placeholder="Örn: Beauty"
          />

          <Input
            label="Alt kategori"
            value={form.subCategory}
            onChange={(value) => setForm({ ...form, subCategory: value })}
            placeholder="Örn: Organizer"
          />

          <Input
            label="Search query"
            value={form.searchQuery}
            onChange={(value) => setForm({ ...form, searchQuery: value })}
            placeholder="Örn: makyaj organizeri hediye"
          />

          <NumberInput
            label="Min fiyat"
            value={form.priceMin}
            onChange={(value) => setForm({ ...form, priceMin: value })}
          />

          <NumberInput
            label="Max fiyat"
            value={form.priceMax}
            onChange={(value) => setForm({ ...form, priceMax: value })}
          />

          <TextArea
            label="Alıcılar"
            value={arrayToText(form.recipients)}
            onChange={(value) => setForm({ ...form, recipients: textToArray(value) })}
            placeholder="Sevgilim, Annem, Arkadaşım"
          />

          <TextArea
            label="İlgi alanları"
            value={arrayToText(form.interests)}
            onChange={(value) => setForm({ ...form, interests: textToArray(value) })}
            placeholder="Makyaj, Cilt bakımı, Moda"
          />

          <TextArea
            label="Tarzlar"
            value={arrayToText(form.styles)}
            onChange={(value) => setForm({ ...form, styles: textToArray(value) })}
            placeholder="Kullanışlı, Minimal, Lüks"
          />

          <TextArea
            label="Özel günler"
            value={arrayToText(form.occasions)}
            onChange={(value) => setForm({ ...form, occasions: textToArray(value) })}
            placeholder="Doğum günü, Sevgililer Günü, İçimden geldi"
          />

          <TextArea
            label="Aciliyet"
            value={arrayToText(form.urgency)}
            onChange={(value) => setForm({ ...form, urgency: textToArray(value) })}
            placeholder="Bugün lazım, 1–2 gün içinde, 1 hafta içinde"
          />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Risk seviyesi
            </span>
            <select
              value={form.riskLevel}
              onChange={(event) =>
                setForm({ ...form, riskLevel: event.target.value as RiskLevel })
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>

          <TextArea
            label="Neden uygun?"
            value={form.reason}
            onChange={(value) => setForm({ ...form, reason: value })}
            placeholder="Bu hediye neden öneriliyor?"
          />

          <TextArea
            label="Not önerisi"
            value={form.note}
            onChange={(value) => setForm({ ...form, note: value })}
            placeholder="Hediye kartına yazılacak tatlı not"
          />
        </div>


        {qualityWarnings.length > 0 && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-bold text-amber-800">Kalite kontrol uyarıları</h3>
            <ul className="mt-3 space-y-1 text-sm text-amber-800">
              {qualityWarnings.map((warning) => (
                <li key={warning}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
            />
            Aktif olarak yayınla
          </label>

          <div className="flex flex-wrap gap-3">
            {form.searchQuery && (
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  form.searchQuery
                )}`}
                target="_blank"
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Aramayı test et
              </a>
            )}

            <button
              onClick={saveGift}
              disabled={saving}
              className="rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : editingId ? "Güncelle" : "Hediye Ekle"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Hediye Listesi</h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredGifts.length} hediye gösteriliyor. Toplam {gifts.length} kayıt var.
            </p>

            <div className="mt-3">
              <ExportGiftsButton gifts={filteredGifts} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:w-[720px]">
            <Input
              label="Ara"
              value={search}
              onChange={setSearch}
              placeholder="Hediye, kategori veya arama..."
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Kategori</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
              >
                <option value="all">Tüm kategoriler</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Durum</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="passive">Pasif</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {loading && <p className="text-sm text-slate-500">Yükleniyor...</p>}

          {!loading && filteredGifts.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              Filtreye uygun hediye bulunamadı.
            </p>
          )}

          {!loading &&
            filteredGifts.map((gift) => (
              <div
                key={gift.id || gift.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-950">
                        {gift.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          gift.isActive === false
                            ? "bg-slate-200 text-slate-600"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {gift.isActive === false ? "Pasif" : "Aktif"}
                      </span>

                      <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                        {gift.riskLevel}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {gift.category} / {gift.subCategory} · {gift.priceMin} TL -{" "}
                      {gift.priceMax} TL
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                      {gift.reason}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Arama: {gift.searchQuery}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(gift)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => toggleActive(gift)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {gift.isActive === false ? "Aktif yap" : "Pasif yap"}
                    </button>

                    <button
                      onClick={() => deleteGift(gift.id)}
                      className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
      />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-pink-400"
      />
    </label>
  );
}
