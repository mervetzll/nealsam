"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentAttempt = {
  id: string;
  user_id: string | null;
  email: string | null;
  plan: string;
  price: number;
  iyzico_token: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type PaymentSummary = {
  totalPayments: number;
  paidPayments: number;
  failedPayments: number;
  initializedPayments: number;
  totalRevenue: number;
};

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    created: "Oluşturuldu",
    initialized: "Ödeme Başlatıldı",
    paid: "Ödendi",
    failed: "Başarısız",
    failed_to_initialize: "Başlatılamadı",
  };

  return labels[status] || status;
}

function statusClass(status: string) {
  if (status === "paid") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "failed" || status === "failed_to_initialize") return "bg-red-50 text-red-700 border-red-200";
  if (status === "initialized") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-[#fff4ef] text-[#6b4a4a] border-pink-100";
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentAttempt[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin-payments", {
      cache: "no-store",
    });

    const data = await response.json();

    if (data.ok) {
      setPayments(data.payments);
      setSummary(data.summary);
    } else {
      setMessage(data.error || "Ödeme kayıtları yüklenemedi.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-pink-600">Admin Panel</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[#2b1b1b]">
              Ödeme Kayıtları
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
              iyzico ödeme denemelerini, paketleri ve ödeme durumlarını buradan takip edebilirsin.
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
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-black text-red-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-bold text-[#2b1b1b]">Ödeme kayıtları yükleniyor...</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              <Stat title="Toplam Deneme" value={summary?.totalPayments || 0} />
              <Stat title="Başlatılan" value={summary?.initializedPayments || 0} />
              <Stat title="Ödenen" value={summary?.paidPayments || 0} />
              <Stat title="Başarısız" value={summary?.failedPayments || 0} />
              <Stat title="Gelir" value={`${summary?.totalRevenue || 0} TL`} />
            </div>

            <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-black text-[#2b1b1b]">
                  Son ödeme denemeleri
                </h2>

                <button
                  type="button"
                  onClick={loadPayments}
                  className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
                >
                  Yenile
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-pink-100">
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">E-posta</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Paket</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Tutar</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Durum</th>
                      <th className="px-3 py-3 text-sm font-black text-[#2b1b1b]">Tarih</th>
                    </tr>
                  </thead>

                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-pink-50">
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {payment.email || "-"}
                        </td>
                        <td className="px-3 py-4 text-sm font-black uppercase text-[#2b1b1b]">
                          {payment.plan}
                        </td>
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {payment.price} TL
                        </td>
                        <td className="px-3 py-4">
                          <span className={`rounded-full border px-3 py-2 text-xs font-black ${statusClass(payment.status)}`}>
                            {statusLabel(payment.status)}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm font-bold text-[#6b4a4a]">
                          {new Date(payment.created_at).toLocaleString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {payments.length === 0 && (
                  <p className="py-8 text-center text-sm font-bold text-[#6b4a4a]">
                    Henüz ödeme denemesi yok.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-pink-600">
        {title}
      </p>
      <p className="mt-2 text-3xl font-black text-[#2b1b1b]">
        {value}
      </p>
    </div>
  );
}
