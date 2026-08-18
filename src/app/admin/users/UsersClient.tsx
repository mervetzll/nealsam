"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  name: string;
  defaultBudget: string;
  favoriteInterests: string;
  giftStyle: string;
  plan: string;
  subscriptionStatus: string;
  savedGiftCount: number;
  favoriteGiftCount: number;
};

const plans = ["free", "plus", "experience", "premium"];

export default function AdminUsersClient() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin-users", {
      cache: "no-store",
    });

    const data = await response.json();

    if (data.ok) {
      setUsers(data.users);
    } else {
      setMessage(data.error || "Kullanıcılar yüklenemedi.");
    }

    setLoading(false);
  }

  async function updatePlan(userId: string, plan: string) {
    setMessage("Paket güncelleniyor...");

    const response = await fetch("/api/admin-users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, plan }),
    });

    const data = await response.json();

    if (!data.ok) {
      setMessage(data.error || "Paket güncellenemedi.");
      return;
    }

    setMessage("Paket güncellendi ✓");
    await loadUsers();
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
<p className="text-sm font-bold text-pink-600">Admin Panel</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Kullanıcılar ve Paketler
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
              Kullanıcıların profil bilgilerini, kayıtlı önerilerini ve paket durumlarını buradan görebilirsin.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
          >
            Admin Panele Dön
          </Link>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-4 text-sm font-black text-[#6b4a4a] shadow-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-[#2b1b1b]">Kullanıcılar yükleniyor...</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                      Kullanıcı Hesabı
                    </p>

                    <div className="mt-2 rounded-2xl bg-[#fff0f7] p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                        E-posta
                      </p>
                      <h2 className="mt-1 break-all text-2xl font-black text-[#2b1b1b]">
                        {user.email}
                      </h2>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Info label="Profil Adı" value={user.name || "Henüz profil doldurmadı"} />
                      <Info label="Varsayılan Bütçe" value={user.defaultBudget || "Henüz belirtilmedi"} />
                      <Info label="İlgi Alanları" value={user.favoriteInterests || "Henüz belirtilmedi"} />
                      <Info label="Hediye Tarzı" value={user.giftStyle || "Henüz belirtilmedi"} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                        Kayıtlı öneri: {user.savedGiftCount}
                      </span>

                      <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                        Favori: {user.favoriteGiftCount}
                      </span>

                      <span className="rounded-full bg-[#fff4ef] px-4 py-2 text-xs font-black text-[#6b4a4a]">
                        Kayıt tarihi: {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5">
                    <p className="text-sm font-black text-[#2b1b1b]">
                      Paket Durumu
                    </p>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                        Mevcut Paket
                      </p>
                      <p className="mt-1 text-2xl font-black text-[#2b1b1b]">
                        {user.plan.toUpperCase()}
                      </p>
                    </div>


                    <Link
                      href={`/admin/users/${user.id}`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white transition hover:opacity-90"
                    >
                      Kullanıcı Detayını Aç
                    </Link>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {plans.map((plan) => (
                        <button
                          key={plan}
                          type="button"
                          onClick={() => updatePlan(user.id, plan)}
                          className={`rounded-full px-4 py-3 text-sm font-black transition ${
                            user.plan === plan
                              ? "bg-[#2b1b1b] text-white"
                              : "border border-pink-200 bg-white text-pink-700 hover:bg-pink-50"
                          }`}
                        >
                          {plan.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#fff4ef] p-4">
      <p className="text-xs font-black uppercase tracking-wide text-pink-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-[#6b4a4a]">
        {value}
      </p>
    </div>
  );
}
