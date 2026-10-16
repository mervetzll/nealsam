"use client";

import QRCode from "qrcode";
import Image from "next/image";
import { createNoteLink } from "@/lib/sharedNote";
import { useMemo, useState } from "react";
import {
  makeRiddle,
  makeSpecialNotes,
  makeStory,
  moods,
  relationships,
  type Mood,
  type Relationship,
} from "@/lib/experienceContent";

export default function ExperienceModes({ mode = "qr" }: { mode?: "note" | "qr" | "hunt" }) {
  const [relationship, setRelationship] = useState<Relationship>("Sevgilim");
  const [mood, setMood] = useState<Mood>("Duygusal");
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [customNote, setCustomNote] = useState<string | null>(null);
  const [sender, setSender] = useState("");
  const [qrSignature, setQrSignature] = useState("");
  const [generating, setGenerating] = useState(false);
  const [qrError, setQrError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [huntStatus, setHuntStatus] = useState("");

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

  const noteText = customNote ?? selectedNote.text;
  const signature = JSON.stringify([selectedNote.title, noteText, sender]);
  const currentQr = qrSignature === signature ? qrCode : "";

  async function createQrForSelectedNote() {
    setGenerating(true);
    setQrError("");
    setLinkCopied(false);
    try {
      const url = createNoteLink(window.location.origin, { title: selectedNote.title, note: noteText, from: sender });
      const qr = await QRCode.toDataURL(url, { margin: 4, width: 768, errorCorrectionLevel: "M" });
      setNoteUrl(url);
      setQrCode(qr);
      setQrSignature(signature);
    } catch {
      setQrError("QR oluşturulamadı. Notu kısaltıp tekrar dene.");
    } finally {
      setGenerating(false);
    }
  }

  async function copySelectedNote() {
    try {
      await navigator.clipboard.writeText(noteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setQrError("Kopyalanamadı. Not metnini seçerek kopyalayabilirsin.");
    }
  }

  async function copyHunt() {
    try {
      await navigator.clipboard.writeText([riddle.question, ...riddle.clues, riddle.answer].join("\n\n"));
      setHuntStatus("İpucu kartları kopyalandı.");
    } catch {
      setHuntStatus("Kopyalanamadı. Kartlardaki metni seçerek kopyalayabilirsin.");
    }
  }

  async function copyNoteLink() {
    try {
      await navigator.clipboard.writeText(noteUrl);
      setLinkCopied(true);
    } catch {
      setQrError("Bağlantı kopyalanamadı. Önizleme bağlantısını kullanabilirsin.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-4 text-[#2b1b1b]">
      <div className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold text-pink-600">1. Kişiselleştir</p>
          <h2 className="mt-2 text-2xl font-extrabold">Kimin için hazırlıyorsun?</h2>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">Kişiyi ve tonu seç. İstersen adını ve birlikte yaşadığınız bir anıyı ekle.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Kime?</span>
            <select
              value={relationship}
              onChange={(event) => setRelationship(event.target.value as Relationship)}
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fff4ef] px-4 py-3 outline-none focus:border-[#b83280]"
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
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fff4ef] px-4 py-3 outline-none focus:border-[#b83280]"
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
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fff4ef] px-4 py-3 outline-none focus:border-[#b83280]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#6b4b4b]">Özel anı</span>
            <input
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              placeholder="Örn: ilk kahvemiz"
              className="mt-2 w-full rounded-2xl border border-[#f0d7df] bg-[#fff4ef] px-4 py-3 outline-none focus:border-[#b83280]"
            />
          </label>
        </div>
      </div>

      {mode !== "hunt" && <div className={`mt-6 grid gap-6 ${mode === "qr" ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#b83280]">2. Notunu hazırla</p>
              <h2 className="mt-2 text-3xl font-extrabold">
                Bir not seç, kendine göre düzenle
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
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setCustomNote(null);
                    setQrError("");
                    setLinkCopied(false);
                    setQrCode("");
                    setNoteUrl("");
                  }}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected
                      ? "border-[#b83280] bg-[#fff0f7]"
                      : "border-[#f0d7df] bg-[#fff4ef] hover:border-[#b83280]"
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

          <div className="mt-6 rounded-3xl bg-[#fff4ef] p-5">
            <p className="text-sm font-bold text-[#b83280]">Seçili not</p>
            <label className="mt-3 block text-sm font-bold">Notunu düzenle
              <textarea value={noteText} onChange={event => { setCustomNote(event.target.value); setCopied(false); }} maxLength={1200}
                rows={7} className="mt-2 w-full rounded-2xl border border-pink-200 bg-white p-4 text-base leading-7 font-normal" />
            </label>
            <p className="mt-2 text-xs text-[#6b4b4b]">{noteText.length}/1200 karakter</p>
            <label className="mt-4 block text-sm font-bold">Kimden? (isteğe bağlı)
              <input value={sender} onChange={event => setSender(event.target.value)} maxLength={100} placeholder="Adın"
                className="mt-2 w-full rounded-2xl border border-pink-200 bg-white p-4 font-normal" />
            </label>
          </div>
        </section>

        {mode === "qr" && <aside className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">QR Kodlu Mesaj</p>
          <h2 className="mt-2 text-3xl font-extrabold">Özel not linki</h2>
          <p className="mt-4 text-sm leading-6 text-[#6b4b4b]">
            Bu QR kodu hediyenin içine koyabilirsin. Karşı taraf okuttuğunda
            sadece seçili not açılır.
          </p>

          <button
            onClick={createQrForSelectedNote}
            disabled={generating || !noteText.trim()}
            className="mt-6 w-full rounded-full bg-[#b83280] px-6 py-4 text-sm font-bold text-white"
          >
            {generating ? "QR hazırlanıyor…" : "Seçili not için QR oluştur"}
          </button>

          <p className="mt-4 text-xs leading-6 text-[#6b4b4b]">Bağlantıyı alan herkes notu okuyabilir. Not bu bağlantıda taşınır; sonradan düzenlemek yeni bir QR oluşturur.</p>
          {qrCode && qrSignature !== signature && <p role="status" className="mt-4 text-sm text-amber-800">Not değişti. Güncel not için QR’ı yeniden oluştur.</p>}
          {qrError && <p role="alert" className="mt-4 text-sm text-red-700">{qrError}</p>}
          {currentQr && (
            <div className="mt-6 rounded-3xl border border-[#f0d7df] bg-[#fff4ef] p-5 text-center">
              <Image
                unoptimized
                src={currentQr}
                alt="Seçili özel not QR kodu"
                width={768}
                height={768}
                className="mx-auto h-auto w-full max-w-64 bg-white"
              />
              {noteUrl && (
                <a
                  href={noteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 block break-words rounded-2xl bg-white p-4 text-xs font-bold text-[#b83280]"
                >
                  Alıcının göreceği notu aç
                </a>
              )}

              <a
                href={currentQr}
                download="nealsam-hediye-notu-qr.png"
                className="mt-5 inline-block rounded-full bg-[#2b1b1b] px-6 py-3 text-sm font-bold text-white"
              >
                QR kodu indir
              </a>
              <button onClick={copyNoteLink} className="mt-4 block w-full rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-bold text-pink-700">{linkCopied ? "Bağlantı kopyalandı" : "Not bağlantısını kopyala"}</button>
              {noteUrl.startsWith("http://localhost") && <p className="mt-4 text-left text-sm leading-6 text-amber-900">Bu QR yerel deneme içindir ve bu bilgisayarda açılır. Telefonla paylaşmak için siteyi yayınladıktan sonra QR’ı canlı sitede yeniden oluştur.</p>}
            </div>
          )}
        </aside>}
      </div>}

      {mode === "hunt" && <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Hikaye Modu</p>
          <h2 className="mt-2 text-3xl font-extrabold">Hediyenin hikayesi</h2>
          <div className="mt-6 rounded-3xl bg-[#fff4ef] p-6">
            <p className="text-base leading-8 text-[#2b1b1b]">{story}</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-[#b83280]">Bulmaca / Hediye Avı</p>
          <h2 className="mt-2 text-3xl font-extrabold">İpucu kartları</h2>
          <p className="mt-3 text-sm leading-6 text-[#6b4b4b]">Kartları ayrı ayrı yazıp seçtiğin yerlere saklayabilirsin. Son kartı hediyenin yanına koy.</p>
          <button onClick={copyHunt} className="mt-4 rounded-full bg-pink-600 px-5 py-3 font-bold text-white">İpucu kartlarını kopyala</button>
          {huntStatus && <p role="status" className="mt-3 text-sm">{huntStatus}</p>}

          <div className="mt-6 rounded-3xl bg-[#fff4ef] p-6">
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
      </div>}

    </section>
  );
}
