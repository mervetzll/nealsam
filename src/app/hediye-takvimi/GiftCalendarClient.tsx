"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type CalendarEvent = Record<string, any>;

function daysUntil(date: string) {
  const today = new Date();
  const target = new Date(date + "T00:00:00");
  today.setHours(0, 0, 0, 0);

  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(value: string) {
  try {
    return new Date(value + "T00:00:00").toLocaleDateString("tr-TR");
  } catch {
    return value;
  }
}

export default function GiftCalendarClient() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [personName, setPersonName] = useState("");
  const [relation, setRelation] = useState("");
  const [eventTitle, setEventTitle] = useState("Doğum günü");
  const [eventDate, setEventDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      return daysUntil(a.event_date) - daysUntil(b.event_date);
    });
  }, [events]);

  useEffect(() => {
    loadEvents();
  }, []);

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || "";
  }

  async function loadEvents() {
    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();

      if (!token) {
        setMessage("Hediye takvimini kullanmak için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/gift-calendar", {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Takvim alınamadı.");
        return;
      }

      setEvents(data.events || []);
    } catch {
      setMessage("Takvim alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function addEvent() {
    setMessage("");

    try {
      const token = await getToken();

      if (!token) {
        setMessage("Etkinlik eklemek için giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/gift-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          personName,
          relation,
          eventTitle,
          eventDate,
          notes,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Etkinlik eklenemedi.");
        return;
      }

      setEvents((items) => [...items, data.event]);
      setPersonName("");
      setRelation("");
      setEventTitle("Doğum günü");
      setEventDate("");
      setNotes("");
      setMessage("Hediye tarihi eklendi.");
    } catch {
      setMessage("Etkinlik eklenemedi.");
    }
  }

  async function deleteEvent(id: string) {
    const confirmed = confirm("Bu tarihi silmek istiyor musun?");
    if (!confirmed) return;

    try {
      const token = await getToken();

      const response = await fetch("/api/gift-calendar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!data?.ok) {
        alert(data?.error || "Silinemedi.");
        return;
      }

      setEvents((items) => items.filter((item) => item.id !== id));
    } catch {
      alert("Silinemedi.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 pb-24 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-4xl pb-10 pt-6 md:pb-14 md:pt-10">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-pink-700"><span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
            Hediye Takvimi
          </p>

          <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
            Özel günleri kaydet, <em>hediyeyi unutma.</em>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6b4a4a]">
            Doğum günü, yıl dönümü ve önemli tarihleri sakla. Yaklaşan tarihlere göre hızlı hediye fikri üret.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6">
            <h2 className="text-2xl font-black">Yeni tarih ekle</h2>

            <div className="mt-5 grid gap-4">
              <input
                value={personName}
                onChange={(event) => setPersonName(event.target.value)}
                placeholder="Kişi adı"
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />

              <input
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
                placeholder="Yakınlık: sevgilim, annem, arkadaşım"
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />

              <select
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              >
                <option>Doğum günü</option>
                <option>Yıl dönümü</option>
                <option>Mezuniyet</option>
                <option>Anneler günü</option>
                <option>Babalar günü</option>
                <option>Sevgililer günü</option>
                <option>Özel gün</option>
              </select>

              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className="rounded-2xl bg-[#fff8f5] px-4 py-3.5 text-[15px] ring-1 ring-pink-100 outline-none transition placeholder:text-[#b39a9a] focus:bg-white focus:ring-2 focus:ring-pink-400"
              />

              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Not: sevdiği şeyler, alınmayacak hediyeler..."
                rows={4}
                className="rounded-2xl bg-[#fff8f5] ring-1 ring-pink-100 px-4 py-4 text-sm font-bold leading-6 outline-none"
              />

              <button
                onClick={addEvent}
                className="rounded-full bg-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
              >
                Takvime Ekle
              </button>
            </div>

            {message && (
              <p className="mt-4 rounded-2xl bg-[#fff4ef] p-4 text-sm font-black text-pink-700">
                {message}
              </p>
            )}
          </div>

          <div className="rounded-[1.75rem] bg-white ring-1 ring-pink-100 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
              Yaklaşan Tarihler
            </p>

            <h2 className="mt-3 text-3xl font-black">Hediye planın</h2>

            {loading ? (
              <p className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black">
                Takvim yükleniyor...
              </p>
            ) : sortedEvents.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-[#fff4ef] p-5 text-sm font-black">
                Henüz tarih eklenmedi.
              </p>
            ) : (
              <div className="mt-6 grid gap-4">
                {sortedEvents.map((event) => {
                  const left = daysUntil(event.event_date);

                  return (
                    <article key={event.id} className="rounded-[1.5rem] bg-[#fff4ef] p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xl font-black">
                            {event.person_name}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#6b4a4a]">
                            {event.event_title} · {formatDate(event.event_date)}
                          </p>
                          {event.relation && (
                            <p className="mt-1 text-sm font-semibold text-[#8a6a6a]">
                              {event.relation}
                            </p>
                          )}
                        </div>

                        <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-pink-700">
                          {left < 0 ? "Geçti" : left === 0 ? "Bugün" : `${left} gün kaldı`}
                        </span>
                      </div>

                      {event.notes && (
                        <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
                          {event.notes}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/hediye-bul?person=${encodeURIComponent(event.person_name)}`}
                          className="rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
                        >
                          Hediye Bul
                        </Link>

                        <Link
                          href={`/hediye-paketi?person=${encodeURIComponent(event.person_name)}`}
                          className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                        >
                          Paket Oluştur
                        </Link>

                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-600"
                        >
                          Sil
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
