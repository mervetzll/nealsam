"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PaymentRow = Record<string, any>;

type Summary = {
  total: number;
  paid: number;
  failed: number;
  pending: number;
};

const emptySummary: Summary = {
  total: 0,
  paid: 0,
  failed: 0,
  pending: 0,
};

function formatDate(value?: string) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("tr-TR");
  } catch {
    return value;
  }
}

function getStatusClass(status?: string) {
  if (status === "paid" || status === "success") {
    return "bg-green-100 text-green-700";
  }

  if (status === "failed" || status === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getAmount(payment: PaymentRow) {
  return (
    payment.amount ||
    payment.price ||
    payment.paid_price ||
    payment.paidPrice ||
    payment.total_price ||
    payment.totalPrice ||
    "-"
  );
}

function getToken(payment: PaymentRow) {
  return (
    payment.iyzico_token ||
    payment.token ||
    payment.payment_id ||
    payment.paymentId ||
    "-"
  );
}

export default function PaymentsAdminClient() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [plan, setPlan] = useState("all");
  const [message, setMessage] = useState("");

  const plans = useMemo(() => {
    const set = new Set<string>();

    payments.forEach((payment) => {
      if (payment.plan) set.add(payment.plan);
    });

    return Array.from(set).sort();
  }, [payments]);

  async function loadPayments() {
    setLoading(true);
    setMessage("");

    const params = new URLSearchParams({
      search,
      status,
      plan,
    });

    try {
      const response = await fetch(`/api/admin-payments?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Ödemeler alınamadı.");
        return;
      }

      setPayments(data.payments || []);
      setSummary(data.summary || emptySummary);
    } catch {
      setMessage("Ödemeler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, plan]);

  const cards = [
    { label: "Toplam", value: summary.total },
    { label: "Başarılı", value: summary.paid },
    { label: "Başarısız", value: summary.failed },
    { label: "Bekleyen", value: summary.pending },
  ];

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-8 text-[#2b1b1b]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
              Admin Panel
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Ödeme Yönetimi
            </h1>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Iyzico ödeme denemelerini, başarılı ödemeleri ve paket durumlarını buradan takip edebilirsin.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white"
          >
            Admin Ana Sayfa
          </Link>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-pink-100 bg-white p-4 text-sm font-black text-[#6b4a4a] shadow-sm">
            {message}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.5rem] border border-pink-100 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-black text-[#6b4a4a]">{card.label}</p>
              <p className="mt-3 text-4xl font-black text-[#2b1b1b]">
                {card.value}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-pink-100 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-black">Ödeme Kayıtları</h2>
              <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                Toplam görünen ödeme: {payments.length}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") loadPayments();
                }}
                placeholder="Kullanıcı, token, paket ara..."
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400 md:col-span-2"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">Tüm durumlar</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="failed">failed</option>
              </select>

              <select
                value={plan}
                onChange={(event) => setPlan(event.target.value)}
                className="rounded-2xl border border-pink-100 px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
              >
                <option value="all">Tüm paketler</option>
                {plans.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                onClick={loadPayments}
                className="rounded-2xl bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white md:col-span-4"
              >
                Filtrele
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
              Ödemeler yükleniyor...
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {payments.map((payment, index) => {
                const amount = getAmount(payment);
                const token = getToken(payment);

                return (
                  <article
                    key={payment.id || index}
                    className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status || "unknown"}
                          </span>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-pink-700">
                            {payment.plan || "plansız"}
                          </span>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6b4a4a]">
                            {amount} TL
                          </span>
                        </div>

                        <h3 className="mt-4 break-all text-xl font-black text-[#2b1b1b]">
                          {payment.user_email || payment.user_id || "Kullanıcı bilinmiyor"}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-[#6b4a4a]">
                          Tarih: {formatDate(payment.created_at)}
                        </p>

                        <p className="mt-2 break-all text-xs font-semibold text-[#8a6a6a]">
                          Token / Payment ID: {token}
                        </p>

                        {payment.error_message && (
                          <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-semibold text-red-700">
                            Hata: {payment.error_message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {payment.user_id && (
                          <Link
                            href={`/admin/users/${payment.user_id}`}
                            className="rounded-full bg-[#2b1b1b] px-4 py-3 text-sm font-black text-white"
                          >
                            Kullanıcı Detayı
                          </Link>
                        )}

                        <Link
                          href="/admin/users"
                          className="rounded-full border border-pink-200 bg-white px-4 py-3 text-sm font-black text-pink-700"
                        >
                          Kullanıcılar
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}

              {payments.length === 0 && (
                <div className="rounded-2xl bg-[#fff4ef] p-5 text-sm font-black text-[#6b4a4a]">
                  Ödeme kaydı bulunamadı.
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
