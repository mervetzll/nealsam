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
      typeof window !== "undefined"
        ? window.location.origin
        : "https://nealsamhediye.com";

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

    setQrCode(qr);
    setCopied(false);
  }

  async function copySelectedNote() {
    await navigator.clipboard.writeText(selectedNote.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 text-[#2b1b1b]">
      <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#b83280]">
            Deneyim Modları
          </p>
          <h1 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Hediyeyi sadece ürün değil, özel bir deneyim yap.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#6b4b4b]">
            Kişiye özel not, QR mesaj, hikaye, bulmaca ve hediye fikri önerilerini
            tek yerden hazırla. QR kod artık bütün notları değil, sadece seçtiğin
            özel notu açar.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Kime?</span>
            <select
              value={relationship}
              onChange={(event) => setRelationship(event.target.value as Relationship)}
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
            >
              {relationships.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Tarz</span>
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value as Mood)}
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
            >
              {moods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Adı</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn: Ayşe"
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Özel anı</span>
            <input
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              placeholder="Örn: ilk kahvemiz"
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fffaf7] px-4 py-3 outline-none focus:border-[#b83280]"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#b83280]">Özel Notlar</p>
              <h2 className="mt-2 text-3xl font-extrabold">
                Sadece seçtiğin not QR’a gider
              </h2>
            </div>

            <button
              onClick={copySelectedNote}
              className="rounded-full bg-[#fff0f7] px-5 py-3 text-sm font-bold text-[#b83280]"
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
                  }}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected
                      ? "border-[#b83280] bg-[#fff0f7]"
                      : "border-[#f0d7df] bg-[#fffaf7] hover:border-[#b83280]"
                  }`}
                >
                  <p className="font-extrabold">{note.title}</p>
                  <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                    {note.text}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl bg-[#fffaf7] p-5">
            <p className="text-sm font-bold text-[#b83280]">Seçili not</p>
            <p className="mt-3 text-lg leading-8">{selectedNote.text}</p>
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">QR Kodlu Mesaj</p>
          <h2 className="mt-2 text-3xl font-extrabold">Özel not linki</h2>
          <p className="mt-4 text-sm leading-6 text-[#6b4b4b]">
            Bu QR kodu hediyenin içine koyabilirsin. Karşı taraf okuttuğunda
            sadece seçili not açılır.
          </p>

          <button
            onClick={createQrForSelectedNote}
            className="mt-6 w-full rounded-full bg-[#b83280] px-6 py-4 text-sm font-bold text-white"
          >
            Seçili not için QR oluştur
          </button>

          {qrCode && (
            <div className="mt-6 rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5 text-center">
              <img
                src={qrCode}
                alt="Seçili özel not QR kodu"
                className="mx-auto h-56 w-56 rounded-2xl bg-white p-3"
              />
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
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Hikaye Modu</p>
          <h2 className="mt-2 text-3xl font-extrabold">Hediyenin hikayesi</h2>
          <div className="mt-6 rounded-3xl bg-[#fffaf7] p-6">
            <p className="text-base leading-8 text-[#2b1b1b]">{story}</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Bulmaca / Hediye Avı</p>
          <h2 className="mt-2 text-3xl font-extrabold">İpucu kartları</h2>

          <div className="mt-6 rounded-3xl bg-[#fffaf7] p-6">
            <p className="font-extrabold">{riddle.question}</p>
            <div className="mt-4 space-y-3">
              {riddle.clues.map((clue) => (
                <p key={clue} className="rounded-2xl bg-white p-4 text-sm font-semibold">
                  {clue}
                </p>
              ))}
            </div>
            <p className="mt-5 rounded-2xl bg-[#fff0f7] p-4 text-sm font-bold text-[#b83280]">
              {riddle.answer}
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white p-7 shadow-sm">
        <p className="text-sm font-bold text-[#b83280]">Hediye Fikirleri</p>
        <h2 className="mt-2 text-3xl font-extrabold">Bu kişiye uygun öneriler</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {giftIdeas.map((gift) => (
            <article
              key={gift.title}
              className="rounded-3xl border border-[#f0d7df] bg-[#fffaf7] p-5"
            >
              <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b83280]">
                {gift.tag}
              </span>
              <h3 className="mt-4 text-xl font-extrabold">{gift.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">
                {gift.reason}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={makeStoreUrl("google", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold"
                >
                  Google
                </a>
                <a
                  href={makeStoreUrl("trendyol", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold"
                >
                  Trendyol
                </a>
                <a
                  href={makeStoreUrl("amazon", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold"
                >
                  Amazon
                </a>
                <a
                  href={makeStoreUrl("hepsiburada", gift.searchQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-4 py-2 text-xs font-bold"
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
