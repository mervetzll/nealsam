"use client";

import QRCode from "qrcode";
import { useMemo, useState } from "react";
import {
  makeGiftIdeas,
  makeRiddle,
  makeSpecialNotes,
  makeStoreUrl,
  makeStory,
  moods,
  relationships,
  type Mood,
  type Relationship,
} from "@/lib/experienceContent";

export default function ExperienceModes() {
  const [relationship, setRelationship] = useState<Relationship>("Sevgilim");
  const [mood, setMood] = useState<Mood>("Duygusal");
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const notes = useMemo(
    () => makeSpecialNotes(relationship, mood, name, memory),
    [relationship, mood, name, memory]
  );

  const selectedNote = useMemo(() => {
    return notes.find((note) => note.id === selectedNoteId) || notes[0];
  }, [notes, selectedNoteId]);

  const story = useMemo(
    () => makeStory(relationship, mood, name, memory),
    [relationship, mood, name, memory]
  );

  const riddle = useMemo(
    () => makeRiddle(relationship, name),
    [relationship, name]
  );

  const giftIdeas = useMemo(
    () => makeGiftIdeas(relationship, mood),
    [relationship, mood]
  );

  async function createQrForSelectedNote() {
    const origin =
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? window.location.origin
        : "https://nealsamhediye.netlify.app";

    const params = new URLSearchParams({
      title: selectedNote.title,
      note: selectedNote.text,
      from: "NeAlsam Hediye",
    });

    const url = `${origin}/hediye-notu?${params.toString()}`;
    const qr = await QRCode.toDataURL(url, {
      margin: 2,
      width: 260,
    });

    setNoteUrl(url);
    setQrCode(qr);
    setCopied(false);
  }

  async function copySelectedNote() {
    await navigator.clipboard.writeText(selectedNote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 text-[#2b1b1b]">
      <div className="rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Adım 1</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Kime hazırlıyorsun?</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#6b4a4a]">
            Bilgileri değiştirdikçe notlar, hikâye ve bulmaca anında güncellenir.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-[#6b4a4a]">Kime?</span>
            <select
              value={relationship}
              onChange={(event) => setRelationship(event.target.value as Relationship)}
              className="mt-2 w-full rounded-2xl border border-transparent bg-[#fff8f5] px-4 py-3.5 ring-1 ring-pink-100 outline-none transition focus:ring-2 focus:ring-pink-400"
            >
              {relationships.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4a4a]">Tarz</span>
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value as Mood)}
              className="mt-2 w-full rounded-2xl border border-transparent bg-[#fff8f5] px-4 py-3.5 ring-1 ring-pink-100 outline-none transition focus:ring-2 focus:ring-pink-400"
            >
              {moods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4a4a]">Adı</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn: Ayşe"
              className="mt-2 w-full rounded-2xl border border-transparent bg-[#fff8f5] px-4 py-3.5 ring-1 ring-pink-100 outline-none transition focus:ring-2 focus:ring-pink-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4a4a]">Özel anı</span>
            <input
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              placeholder="Örn: ilk kahvemiz"
              className="mt-2 w-full rounded-2xl border border-transparent bg-[#fff8f5] px-4 py-3.5 ring-1 ring-pink-100 outline-none transition focus:ring-2 focus:ring-pink-400"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Özel Notlar</p>
              <h2 className="mt-2 text-3xl">
                Sadece seçtiğin not QR’a gider
              </h2>
            </div>

            <button
              onClick={copySelectedNote}
              className="shrink-0 rounded-full bg-pink-50 px-5 py-3 text-sm font-bold text-pink-700 ring-1 ring-pink-100 transition hover:bg-pink-100"
            >
              {copied ? "Kopyalandı" : "Notu kopyala"}
            </button>
          </div>

          <div className="mt-6 grid gap-4">
            {notes.map((note) => {
              const selected = selectedNote.id === note.id;

              return (
                <button
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setQrCode("");
                    setNoteUrl("");
                  }}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected
                      ? "border-[#db2777] bg-[#fdf2f8]"
                      : "border-[#fce7f3] bg-[#fff4ef] hover:border-[#db2777]"
                  }`}
                >
                  <p className="font-extrabold">{note.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                    {note.text}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl bg-[#fff8f5] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Seçili not</p>
            <p className="mt-3 font-display text-xl italic leading-8">“{selectedNote.text}”</p>
          </div>
        </section>

        <aside className="rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">QR Kodlu Mesaj</p>
          <h2 className="mt-2 text-3xl">Özel not linki</h2>
          <p className="mt-4 text-sm leading-6 text-[#6b4a4a]">
            Bu QR kodu hediyenin içine koyabilirsin. Karşı taraf okuttuğunda
            sadece seçili not açılır.
          </p>

          <button
            onClick={createQrForSelectedNote}
            className="mt-6 w-full rounded-full bg-pink-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-pink-600/20 transition hover:bg-pink-700"
          >
            Seçili not için QR oluştur
          </button>

          {qrCode && (
            <div className="mt-6 rounded-3xl border border-[#fce7f3] bg-[#fff4ef] p-5 text-center">
              <img
                src={qrCode}
                alt="Seçili özel not QR kodu"
                className="mx-auto h-56 w-56 rounded-2xl bg-white p-3"
              />
              {noteUrl && (
                <a
                  href={noteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 block break-words rounded-2xl bg-white p-4 text-xs font-bold text-[#db2777]"
                >
                  Not linkini test et
                </a>
              )}

              <a
                href={qrCode}
                download="nealsam-hediye-notu-qr.png"
                className="mt-5 inline-block rounded-full bg-[#2b1b1b] px-6 py-3 text-sm font-bold text-white"
              >
                QR kodu indir
              </a>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Hikaye Modu</p>
          <h2 className="mt-2 text-3xl">Hediyenin hikayesi</h2>
          <div className="mt-6 rounded-3xl bg-[#fff8f5] p-6">
            <p className="text-base leading-8 text-[#2b1b1b]">{story}</p>
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Bulmaca / Hediye Avı</p>
          <h2 className="mt-2 text-3xl">İpucu kartları</h2>

          <div className="mt-6 rounded-3xl bg-[#fff8f5] p-6">
            <p className="font-extrabold">{riddle.question}</p>
            <div className="mt-4 space-y-3">
              {riddle.clues.map((clue) => (
                <p key={clue} className="rounded-2xl bg-white p-4 text-sm font-semibold">
                  {clue}
                </p>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-pink-50 p-4 text-sm font-bold text-pink-700">
              {riddle.answer}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[1.75rem] bg-white p-7 ring-1 ring-pink-100 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Hediye Fikirleri</p>
        <h2 className="mt-2 text-3xl">Bu kişiye uygun öneriler</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {giftIdeas.map((gift) => (
            <article
              key={gift.title}
              className="rounded-3xl border border-[#fce7f3] bg-[#fff4ef] p-5"
            >
              <span className="rounded-full bg-[#fdf2f8] px-3 py-1 text-xs font-bold text-[#db2777]">
                {gift.tag}
              </span>
              <h3 className="mt-4 text-xl font-extrabold">{gift.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6b4a4a]">
                {gift.reason}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={makeStoreUrl("google", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold ring-1 ring-pink-100 transition hover:bg-pink-50 hover:text-pink-700"
                >
                  Google
                </a>
                <a
                  href={makeStoreUrl("trendyol", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold ring-1 ring-pink-100 transition hover:bg-pink-50 hover:text-pink-700"
                >
                  Trendyol
                </a>
                <a
                  href={makeStoreUrl("amazon", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold ring-1 ring-pink-100 transition hover:bg-pink-50 hover:text-pink-700"
                >
                  Amazon
                </a>
                <a
                  href={makeStoreUrl("hepsiburada", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold ring-1 ring-pink-100 transition hover:bg-pink-50 hover:text-pink-700"
                >
                  Hepsiburada
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
