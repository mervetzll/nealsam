"use client";

import { useEffect, useMemo, useState } from "react";

type AdminGift = {
  id: string;
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
  created_at: string;
};

const emptyForm = {
  title: "",
  category: "Kahve",
  sub_category: "",
  price_min: "",
  price_max: "",
  recipients: "Sevgilim,Annem,Arkadaşım,Kardeşim",
  interests: "",
  styles: "Kullanışlı,Minimal",
  occasions: "Doğum günü,İçimden geldi",
  urgency: "1–2 gün içinde,1 hafta içinde",
  risk_level: "low",
  reason: "",
  note: "",
  search_query: "",
};

function splitValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function GiftManager() {
  const [gifts, setGifts] = useState<AdminGift[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  const filteredGifts = useMemo(() => {
    return gifts.filter((gift) =>
      `${gift.title} ${gift.category} ${gift.sub_category}`
        .toLocaleLowerCase("tr")
        .includes(search.toLocaleLowerCase("tr"))
    );
  }, [gifts, search]);

  async function loadGifts() {
    setIsLoading(true);

    const response = await fetch("/api/admin-gifts");
    const data = await response.json();

    setGifts(data.gifts || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadGifts();
  }, []);

  async function addGift(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const payload = {
      title: form.title,
      category: form.category,
      sub_category: form.sub_category,
      price_min: Number(form.price_min),
      price_max: Number(form.price_max),
      recipients: splitValues(form.recipients),
      interests: splitValues(form.interests),
      styles: splitValues(form.styles),
      occasions: splitValues(form.occasions),
      urgency: splitValues(form.urgency),
      risk_level: form.risk_level,
      reason: form.reason,
      note: form.note,
      search_query: form.search_query,
    };

    const response = await fetch("/api/admin-gifts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Hediye eklenemedi.");
      return;
    }

    setMessage("Hediye başarıyla eklendi.");
    setForm(emptyForm);
    setIsFormOpen(false);
    loadGifts();
  }

  async function toggleGift(gift: AdminGift) {
    await fetch("/api/admin-gifts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: gift.id,
        is_active: !gift.is_active,
      }),
    });

    loadGifts();
  }

  async function deleteGift(gift: AdminGift) {
    const confirmed = confirm(`${gift.title} silinsin mi?`);

    if (!confirmed) return;

    await fetch("/api/admin-gifts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: gift.id,
      }),
    });

    loadGifts();
  }

  return (
    <div className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold text-[#b83280]">Hediye Yönetimi</p>
          <h2 className="mt-2 text-3xl font-extrabold">Supabase hediye havuzu</h2>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
            Buradan yeni hediye ekleyebilir, hediyeleri aktif/pasif yapabilir veya silebilirsin.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen((value) => !value)}
          className="rounded-full bg-[#b83280] px-6 py-3 text-sm font-bold text-white"
        >
          {isFormOpen ? "Formu kapat" : "Yeni hediye ekle"}
        </button>
      </div>

      {message && (
        <div className="mt-5 rounded-2xl bg-[#fff0f7] p-4 text-sm font-bold text-[#b83280]">
          {message}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={addGift} className="mt-6 rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border p-4" placeholder="Hediye adı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="rounded-2xl border p-4" placeholder="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <input className="rounded-2xl border p-4" placeholder="Alt kategori" value={form.sub_category} onChange={(e) => setForm({ ...form, sub_category: e.target.value })} required />
            <input className="rounded-2xl border p-4" placeholder="Arama kelimesi" value={form.search_query} onChange={(e) => setForm({ ...form, search_query: e.target.value })} required />
            <input className="rounded-2xl border p-4" placeholder="Min fiyat" type="number" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} required />
            <input className="rounded-2xl border p-4" placeholder="Max fiyat" type="number" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} required />

            <input className="rounded-2xl border p-4" placeholder="Alıcılar, virgülle ayır" value={form.recipients} onChange={(e) => setForm({ ...form, recipients: e.target.value })} />
            <input className="rounded-2xl border p-4" placeholder="İlgi alanları, virgülle ayır" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
            <input className="rounded-2xl border p-4" placeholder="Tarzlar, virgülle ayır" value={form.styles} onChange={(e) => setForm({ ...form, styles: e.target.value })} />
            <input className="rounded-2xl border p-4" placeholder="Özel günler, virgülle ayır" value={form.occasions} onChange={(e) => setForm({ ...form, occasions: e.target.value })} />
            <input className="rounded-2xl border p-4" placeholder="Acil durumlar, virgülle ayır" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} />

            <select className="rounded-2xl border p-4" value={form.risk_level} onChange={(e) => setForm({ ...form, risk_level: e.target.value })}>
              <option value="low">Düşük risk</option>
              <option value="medium">Orta risk</option>
              <option value="high">Yüksek risk</option>
            </select>
          </div>

          <textarea className="mt-4 w-full rounded-2xl border p-4" placeholder="Neden öneriliyor?" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          <textarea className="mt-4 w-full rounded-2xl border p-4" placeholder="Hediye notu" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} required />

          <button className="mt-5 rounded-full bg-[#b83280] px-6 py-3 text-sm font-bold text-white">
            Hediyeyi kaydet
          </button>
        </form>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Hediye ara..."
          className="w-full rounded-full border border-[#f0d7df] bg-[#fffaf7] px-5 py-3 outline-none focus:border-[#b83280]"
        />

        <span className="shrink-0 rounded-full bg-[#fff0f7] px-5 py-3 text-sm font-bold text-[#b83280]">
          {filteredGifts.length} hediye
        </span>
      </div>

      {isLoading ? (
        <div className="mt-6 rounded-3xl bg-[#fffaf7] p-6 text-sm font-bold text-[#b83280]">
          Hediyeler yükleniyor...
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl border border-[#f0d7df]">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#fff0f7] text-[#b83280]">
              <tr>
                <th className="p-4">Hediye</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Durum</th>
                <th className="p-4">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {filteredGifts.map((gift) => (
                <tr key={gift.id} className="border-t border-[#f0d7df]">
                  <td className="p-4 font-bold">{gift.title}</td>
                  <td className="p-4">{gift.category} / {gift.sub_category}</td>
                  <td className="p-4">{gift.price_min}–{gift.price_max} TL</td>
                  <td className="p-4">
                    <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                      {gift.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="flex gap-2 p-4">
                    <button
                      onClick={() => toggleGift(gift)}
                      className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#b83280]"
                    >
                      {gift.is_active ? "Pasifleştir" : "Aktifleştir"}
                    </button>

                    <button
                      onClick={() => deleteGift(gift)}
                      className="rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-bold text-white"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
