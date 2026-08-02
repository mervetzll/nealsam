"use client";

import { useEffect, useMemo, useState } from "react";

type RiskLevel = "low" | "medium" | "high";

type AdminGift = {
  id: string;
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

type GiftForm = Omit<AdminGift, "id" | "createdAt"> & {
  id?: string;
};

const emptyForm: GiftForm = {
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

function arrayToText(values: string[]) {
  return values.join(", ");
}

function textToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formFromGift(gift: AdminGift): GiftForm {
  return {
    id: gift.id,
    title: gift.title,
    category: gift.category,
    subCategory: gift.subCategory,
    priceMin: gift.priceMin,
    priceMax: gift.priceMax,
    recipients: gift.recipients || [],
    interests: gift.interests || [],
    styles: gift.styles || [],
    occasions: gift.occasions || [],
    urgency: gift.urgency || [],
    riskLevel: gift.riskLevel || "low",
    reason: gift.reason || "",
    note: gift.note || "",
    searchQuery: gift.searchQuery || "",
    isActive: gift.isActive,
  };
}

function getSearchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export default function GiftManager() {
  const [gifts, setGifts] = useState<AdminGift[]>([]);
  const [form, setForm] = useState<GiftForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = Boolean(form.id);

  const filteredGifts = useMemo(() => {
    const q = search.toLocaleLowerCase("tr-TR").trim();

    if (!q) return gifts;

    return gifts.filter((gift) => {
      return [
        gift.title,
        gift.category,
        gift.subCategory,
        gift.searchQuery,
        gift.reason,
        ...gift.recipients,
        ...gift.interests,
        ...gift.styles,
      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(q);
    });
  }, [gifts, search]);

  const activeCount = gifts.filter((gift) => gift.isActive).length;
  const passiveCount = gifts.length - activeCount;

  async function loadGifts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin-gifts", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hediyeler alınamadı.");
      }

      setGifts(data.gifts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGifts();
  }, []);

  function updateForm<K extends keyof GiftForm>(key: K, value: GiftForm[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setError("");
    setSuccess("");
  }

  async function saveGift() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: GiftForm = {
        ...form,
        searchQuery: form.searchQuery.trim() || form.title.trim(),
      };

      const response = await fetch("/api/admin-gifts", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kayıt başarısız.");
      }

      if (isEditing) {
        setGifts((current) =>
          current.map((gift) => (gift.id === data.gift.id ? data.gift : gift))
        );
        setSuccess("Hediye güncellendi.");
      } else {
        setGifts((current) => [data.gift, ...current]);
        setSuccess("Yeni hediye eklendi.");
      }

      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteGift(id: string) {
    const confirmed = window.confirm("Bu hediyeyi silmek istediğine emin misin?");

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin-gifts?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Silme başarısız.");
      }

      setGifts((current) => current.filter((gift) => gift.id !== id));
      setSuccess("Hediye silindi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata oluştu.");
    }
  }

  async function toggleGift(gift: AdminGift) {
    try {
      setError("");
      setSuccess("");

      const response = await fetch("/api/admin-gifts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...gift,
          isActive: !gift.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Durum değiştirilemedi.");
      }

      setGifts((current) =>
        current.map((item) => (item.id === data.gift.id ? data.gift : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bilinmeyen hata oluştu.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[2rem] border border-[#f0d7df] bg-[#fffaf7] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold">
              {isEditing ? "Hediyeyi düzenle" : "Yeni hediye ekle"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#6b4b4b]">
              Search query alanı mağaza yönlendirmelerini etkiler. Örneğin:
              “cilt bakım seti hediye”, “makyaj organizeri”, “erkek deri cüzdan”.
            </p>
          </div>

          {isEditing && (
            <button
              onClick={resetForm}
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#b83280]"
            >
              Yeni ekle
            </button>
          )}
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">Hediye adı</span>
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Cilt bakım başlangıç seti"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Kategori</span>
              <input
                value={form.category}
                onChange={(event) => updateForm("category", event.target.value)}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
                placeholder="Cilt bakımı"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Alt kategori</span>
              <input
                value={form.subCategory}
                onChange={(event) => updateForm("subCategory", event.target.value)}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
                placeholder="Bakım seti"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Min fiyat</span>
              <input
                type="number"
                value={form.priceMin}
                onChange={(event) => updateForm("priceMin", Number(event.target.value))}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Max fiyat</span>
              <input
                type="number"
                value={form.priceMax}
                onChange={(event) => updateForm("priceMax", Number(event.target.value))}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">
              Alıcılar
            </span>
            <input
              value={arrayToText(form.recipients)}
              onChange={(event) => updateForm("recipients", textToArray(event.target.value))}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Sevgilim, Annem, Arkadaşım"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">
              İlgi alanları
            </span>
            <input
              value={arrayToText(form.interests)}
              onChange={(event) => updateForm("interests", textToArray(event.target.value))}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Cilt bakımı, Makyaj, Moda"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">Tarzlar</span>
            <input
              value={arrayToText(form.styles)}
              onChange={(event) => updateForm("styles", textToArray(event.target.value))}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Kullanışlı, Minimal, Lüks"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Özel günler</span>
              <input
                value={arrayToText(form.occasions)}
                onChange={(event) => updateForm("occasions", textToArray(event.target.value))}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
                placeholder="Doğum günü, İçimden geldi"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-[#2b1b1b]">Aciliyet</span>
              <input
                value={arrayToText(form.urgency)}
                onChange={(event) => updateForm("urgency", textToArray(event.target.value))}
                className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
                placeholder="Bugün lazım, 1–2 gün içinde"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">Risk seviyesi</span>
            <select
              value={form.riskLevel}
              onChange={(event) => updateForm("riskLevel", event.target.value as RiskLevel)}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
            >
              <option value="low">Düşük risk</option>
              <option value="medium">Orta risk</option>
              <option value="high">Yüksek risk</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">Neden uygun?</span>
            <textarea
              value={form.reason}
              onChange={(event) => updateForm("reason", event.target.value)}
              rows={3}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Bu hediye neden uygun?"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">Not önerisi</span>
            <textarea
              value={form.note}
              onChange={(event) => updateForm("note", event.target.value)}
              rows={3}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="Yanına koyulacak kısa not"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-[#2b1b1b]">
              Search query / mağaza arama metni
            </span>
            <input
              value={form.searchQuery}
              onChange={(event) => updateForm("searchQuery", event.target.value)}
              className="rounded-2xl border border-[#f0d7df] bg-white px-4 py-3 text-sm outline-none focus:border-[#b83280]"
              placeholder="cilt bakım seti hediye"
            />

            {form.searchQuery && (
              <a
                href={getSearchUrl(form.searchQuery)}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#b83280] underline"
              >
                Bu aramayı test et
              </a>
            )}
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateForm("isActive", event.target.checked)}
            />
            <span className="text-sm font-bold text-[#2b1b1b]">
              Aktif olarak yayınla
            </span>
          </label>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700">
              {success}
            </div>
          )}

          <button
            onClick={saveGift}
            disabled={saving}
            className="rounded-full bg-[#b83280] px-6 py-4 text-sm font-bold text-white disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : isEditing ? "Hediyeyi güncelle" : "Hediye ekle"}
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#f0d7df] bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-extrabold">Hediye listesi</h3>
            <p className="mt-2 text-sm text-[#6b4b4b]">
              Toplam {gifts.length} hediye · {activeCount} aktif · {passiveCount} pasif
            </p>
          </div>

          <button
            onClick={loadGifts}
            className="rounded-full border border-[#f0d7df] bg-[#fffaf7] px-5 py-3 text-sm font-bold text-[#b83280]"
          >
            Yenile
          </button>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mt-5 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 text-sm outline-none focus:border-[#b83280]"
          placeholder="Hediye, kategori, ilgi alanı veya search query ara..."
        />

        {loading ? (
          <div className="mt-6 rounded-3xl bg-[#fffaf7] p-6 text-sm font-bold text-[#6b4b4b]">
            Hediyeler yükleniyor...
          </div>
        ) : (
          <div className="mt-5 max-h-[900px] space-y-4 overflow-y-auto pr-1">
            {filteredGifts.map((gift) => (
              <article
                key={gift.id}
                className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          gift.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {gift.isActive ? "Aktif" : "Pasif"}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#b83280]">
                        {gift.riskLevel}
                      </span>
                    </div>

                    <h4 className="mt-3 text-xl font-extrabold">{gift.title}</h4>
                    <p className="mt-1 text-sm font-bold text-[#b83280]">
                      {gift.category} / {gift.subCategory} · {gift.priceMin}–{gift.priceMax} TL
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                      {gift.reason}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {gift.interests.slice(0, 5).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#6b4b4b]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 break-all text-xs text-[#6b4b4b]">
                      <b>Search:</b> {gift.searchQuery}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 md:justify-end">
                    <button
                      onClick={() => setForm(formFromGift(gift))}
                      className="rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-bold text-white"
                    >
                      Düzenle
                    </button>

                    <button
                      onClick={() => toggleGift(gift)}
                      className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#b83280]"
                    >
                      {gift.isActive ? "Pasifleştir" : "Aktifleştir"}
                    </button>

                    <button
                      onClick={() => deleteGift(gift.id)}
                      className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredGifts.length === 0 && (
              <div className="rounded-3xl bg-[#fffaf7] p-6 text-center text-sm font-bold text-[#6b4b4b]">
                Aramana uygun hediye bulunamadı.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
