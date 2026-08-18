"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserDetail = {
  user: {
    id: string;
    email?: string;
    created_at?: string;
    last_sign_in_at?: string;
    email_confirmed_at?: string;
  };
  profile: Record<string, any> | null;
  subscription: Record<string, any> | null;
  favorites: Record<string, any>[];
  savedResults: Record<string, any>[];
  payments: Record<string, any>[];
  clicks: Record<string, any>[];
  adminNote: Record<string, any> | null;
};

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

function shortJson(value: any) {
  if (!value) return "-";

  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return "-";
  }
}

export default function UserDetailClient({ userId }: { userId: string }) {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  async function loadDetail() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin-user-detail?userId=${userId}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Kullanıcı detayı alınamadı.");
        return;
      }

      setDetail(data);
      setNote(data.adminNote?.note || "");
    } catch {
      alert("Kullanıcı detayı alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function saveNote() {
    setSavingNote(true);

    try {
      const response = await fetch("/api/admin-user-detail", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update_note",
          note,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Not kaydedilemedi.");
        return;
      }

      alert("Admin notu kaydedildi.");
      await loadDetail();
    } catch {
      alert("Not kaydedilemedi.");
    } finally {
      setSavingNote(false);
    }
  }

  async function updatePlan(plan: string) {
    const approved = confirm(`Kullanıcının paketini "${plan}" yapmak istiyor musun?`);

    if (!approved) return;

    setSavingPlan(true);

    try {
      const response = await fetch("/api/admin-user-detail", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: "update_plan",
          plan,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Paket güncellenemedi.");
        return;
      }

      alert("Paket güncellendi.");
      await loadDetail();
    } catch {
      alert("Paket güncellenemedi.");
    } finally {
      setSavingPlan(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 font-black">
          Kullanıcı detayı yükleniyor...
        </div>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 font-black">
          Kullanıcı bulunamadı.
        </div>
      </main>
    );
  }

  const currentPlan = detail.subscription?.plan || "free";

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Kullanıcı Detayı
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Sadece destek, ödeme ve üyelik yönetimi için gerekli bilgileri gösteriyoruz.
            </p>
          </div>

          <Link
            href="/admin/users"
            className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
          >
            Kullanıcılara Dön
          </Link>
        </div>

        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">Kullanıcı Bilgisi</h2>

            <div className="mt-5 space-y-4 text-sm font-semibold text-[#6b4a4a]">
              <p>
                <span className="font-black text-[#2b1b1b]">E-posta:</span>{" "}
                {detail.user.email || "-"}
              </p>

              <p className="break-all">
                <span className="font-black text-[#2b1b1b]">User ID:</span>{" "}
                {detail.user.id}
              </p>

              <p>
                <span className="font-black text-[#2b1b1b]">Kayıt tarihi:</span>{" "}
                {formatDate(detail.user.created_at)}
              </p>

              <p>
                <span className="font-black text-[#2b1b1b]">Son giriş:</span>{" "}
                {formatDate(detail.user.last_sign_in_at)}
              </p>

              <p>
                <span className="font-black text-[#2b1b1b]">Email onayı:</span>{" "}
                {detail.user.email_confirmed_at ? "Onaylı" : "Onaysız"}
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
            <h2 className="text-2xl font-black">Paket Durumu</h2>

            <p className="mt-4 text-sm font-semibold text-[#6b4a4a]">
              Mevcut paket:
            </p>

            <p className="mt-2 inline-flex rounded-full bg-[#fff0f7] px-4 py-2 text-sm font-black text-pink-700">
              {currentPlan}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["free", "plus", "experience", "premium"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => updatePlan(plan)}
                  disabled={savingPlan}
                  className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50 disabled:opacity-50"
                >
                  {plan} yap
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">Admin Notu</h2>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#6b4a4a]">
            Bu not kullanıcıya görünmez. Sadece admin destek takibi için.
          </p>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-4 min-h-32 w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
            placeholder="Örn: Bu kullanıcıya manuel premium verildi."
          />

          <button
            onClick={saveNote}
            disabled={savingNote}
            className="mt-4 rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white disabled:opacity-50"
          >
            {savingNote ? "Kaydediliyor..." : "Notu Kaydet"}
          </button>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-2">
          <DataBox
            title="Favoriler"
            count={detail.favorites.length}
            items={detail.favorites}
          />

          <DataBox
            title="Kayıtlı Hediye Önerileri"
            count={detail.savedResults.length}
            items={detail.savedResults}
          />

          <DataBox
            title="Ödeme Geçmişi"
            count={detail.payments.length}
            items={detail.payments}
          />

          <DataBox
            title="Mağaza Tıklamaları"
            count={detail.clicks.length}
            items={detail.clicks}
          />
        </section>
      </div>
    </main>
  );
}

function DataBox({
  title,
  count,
  items,
}: {
  title: string;
  count: number;
  items: Record<string, any>[];
}) {
  return (
    <div className="rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">{title}</h2>

        <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
          {count} kayıt
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl bg-[#fff4ef] p-4 text-sm font-semibold text-[#6b4a4a]">
            Kayıt yok.
          </p>
        ) : (
          items.slice(0, 10).map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-2xl bg-[#fff4ef] p-4 text-sm font-semibold leading-6 text-[#6b4a4a]"
            >
              <p className="font-black text-[#2b1b1b]">
                {item.title ||
                  item.gift_title ||
                  item.store ||
                  item.plan ||
                  item.status ||
                  `Kayıt ${index + 1}`}
              </p>

              <p className="mt-1 text-xs">
                Tarih: {formatDate(item.created_at)}
              </p>

              <p className="mt-2 line-clamp-2 break-all text-xs">
                {shortJson(item)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
