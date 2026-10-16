"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { getFallbackConcepts, buildConceptOutput, type PremiumConcept } from "@/lib/conceptContent";

export default function PremiumConceptLauncher() {
  const searchParams = useSearchParams();

  const [concepts, setConcepts] = useState<PremiumConcept[]>(getFallbackConcepts());
  const [selectedConceptId, setSelectedConceptId] = useState(
    searchParams.get("concept") || "kader-bagi"
  );

  const [personName, setPersonName] = useState(searchParams.get("person") || "");
  const [senderName, setSenderName] = useState(searchParams.get("from") || "");
  const [relation, setRelation] = useState(searchParams.get("relation") || "");
  const [giftName, setGiftName] = useState(searchParams.get("gift") || "");
  const [tone, setTone] = useState(searchParams.get("tone") || "emotional");
  const [noteLength, setNoteLength] = useState("medium");
  const [specialDetail, setSpecialDetail] = useState("");

  const [huntLocation, setHuntLocation] = useState("");
  const [huntSteps, setHuntSteps] = useState(4);
  const [huntDifficulty, setHuntDifficulty] = useState("medium");
  const [huntStyle, setHuntStyle] = useState("cute");
  const [huntDetail, setHuntDetail] = useState("");

  const [lockEnabled, setLockEnabled] = useState(false);
  const [lockQuestion, setLockQuestion] = useState("");
  const [lockAnswer, setLockAnswer] = useState("");
  const [unlockAt, setUnlockAt] = useState("");

  const [moodEnabled, setMoodEnabled] = useState(false);
  const [moodHappy, setMoodHappy] = useState("");
  const [moodEmotional, setMoodEmotional] = useState("");
  const [moodRomantic, setMoodRomantic] = useState("");
  const [moodFunny, setMoodFunny] = useState("");
  const [moodNostalgic, setMoodNostalgic] = useState("");

  const [surpriseEnabled, setSurpriseEnabled] = useState(false);
  const [surpriseBox1, setSurpriseBox1] = useState("");
  const [surpriseBox2, setSurpriseBox2] = useState("");
  const [surpriseBox3, setSurpriseBox3] = useState("");
  const [surpriseBox4, setSurpriseBox4] = useState("");

  const [quizEnabled, setQuizEnabled] = useState(false);
  const [quizQ1, setQuizQ1] = useState("");
  const [quizA1, setQuizA1] = useState("");
  const [quizQ2, setQuizQ2] = useState("");
  const [quizA2, setQuizA2] = useState("");
  const [quizQ3, setQuizQ3] = useState("");
  const [quizA3, setQuizA3] = useState("");

  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [memoryTitle, setMemoryTitle] = useState("");
  const [memoryDetail, setMemoryDetail] = useState("");
  const [memoryEmoji, setMemoryEmoji] = useState("💌");

  const [editedNote, setEditedNote] = useState<{ source: string; text: string } | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [message, setMessage] = useState("");

  const selectedConcept = useMemo(() => {
    return concepts.find((concept) => concept.id === selectedConceptId) || concepts[0];
  }, [concepts, selectedConceptId]);

  const isHunt = selectedConcept?.id === "hediye-avi";


  const generatedBase = useMemo(() => {
    if (!selectedConcept) return "";

    const output = buildConceptOutput({
      concept: selectedConcept,
      personName,
      senderName,
      relation,
      giftName,
      tone,
      noteLength,
      specialDetail,
      huntLocation,
      huntSteps,
      huntDifficulty,
      huntStyle,
      huntDetail,
    });

    return output;
  }, [
    selectedConcept,
    personName,
    senderName,
    relation,
    giftName,
    tone,
    noteLength,
    specialDetail,
    huntLocation,
    huntSteps,
    huntDifficulty,
    huntStyle,
    huntDetail,
  ]);

  const generatedText = editedNote?.source === generatedBase ? editedNote.text : generatedBase;
  const savePayload = {
    conceptKey: selectedConcept.id, conceptTitle: selectedConcept.title,
    personName, senderName, relation, giftName, tone, noteLength, specialDetail, generatedText,
    huntLocation, huntSteps, huntDifficulty, huntStyle, huntDetail,
    lockEnabled, lockQuestion: lockEnabled ? lockQuestion : "", lockAnswer: lockEnabled ? lockAnswer : "", unlockAt: unlockAt && Number.isFinite(new Date(unlockAt).getTime()) ? new Date(unlockAt).toISOString() : "",
    moodEnabled, moodHappy, moodEmotional, moodRomantic, moodFunny, moodNostalgic,
    surpriseEnabled, surpriseBoxes: surpriseEnabled ? [surpriseBox1, surpriseBox2, surpriseBox3, surpriseBox4].map(value => value.trim()).filter(Boolean) : [],
    quizEnabled, quizItems: quizEnabled ? [{ question: quizQ1, answer: quizA1 }, { question: quizQ2, answer: quizA2 }, { question: quizQ3, answer: quizA3 }].filter(item => item.question.trim()) : [],
    memoryEnabled, memoryTitle, memoryDetail, memoryEmoji,
  };
  const snapshot = JSON.stringify(savePayload);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/premium-concepts", { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!controller.signal.aborted && data?.ok && Array.isArray(data.concepts) && data.concepts.length) setConcepts(data.concepts);
      } catch { /* The local catalog remains available if the request fails. */ }
    }
    void load();
    return () => controller.abort();
  }, []);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(generatedText);
      setMessage("Metin kopyalandı.");
    } catch {
      setMessage("Kopyalanamadı. Not metnini seçerek kopyalayabilirsin.");
    }
  }

  async function saveExperience() {
    if (!generatedText.trim()) { setMessage("Kaydetmeden önce notunu yaz."); return; }
    if (lockEnabled && (!lockQuestion.trim() || !lockAnswer.trim())) { setMessage("Soru kilidi için soruyu ve cevabı doldur."); return; }
    if (surpriseEnabled && savePayload.surpriseBoxes.length < 2) { setMessage("Sürpriz kutusu için en az iki mesaj ekle."); return; }
    if (quizEnabled && !savePayload.quizItems.length) { setMessage("Mini quiz için en az bir soru ekle."); return; }
    if (memoryEnabled && !memoryDetail.trim()) { setMessage("Anı kartına bir anı yaz."); return; }
    if (isHunt && !huntLocation.trim()) { setMessage("Hediye avının final konumunu yaz."); return; }
    if (unlockAt && (!Number.isFinite(new Date(unlockAt).getTime()) || new Date(unlockAt).getTime() <= Date.now())) { setMessage("Zaman kilidi için ileri bir tarih seç."); return; }
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setMessage("Kaydetmek için önce giriş yapmalısın.");
        return;
      }

      const response = await fetch("/api/save-premium-experience", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: snapshot,
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Deneyim kaydedilemedi.");
        return;
      }

      setSavedId(data.experience?.id || "");
      setSavedSnapshot(snapshot);
      setMessage(
        isHunt
          ? "Hediye Avı kaydedildi. Artık adım adım QR deneyimini oluşturabilirsin."
          : "Deneyim kaydedildi. Artık kartını ve QR kodunu oluşturabilirsin."
      );
    } catch {
      setMessage("Deneyim kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  if (!selectedConcept) return null;

  return (
    <section className="mx-auto mt-10 max-w-7xl px-5">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Premium Deneyim
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#2b1b1b]">
            {isHunt ? "Hediye Avı Oluştur" : "Özel Not Oluştur"}
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
            {isHunt
              ? "Hediyeni direkt vermek yerine QR ile açılan adım adım bir sürpriz oyununa dönüştür."
              : "Kime, kimden ve hangi hediye için olduğunu yaz. Sistem sana daha özel bir hediye notu oluştursun."}
          </p>

          <div className="mt-6 grid gap-4">
            <fieldset>
              <legend className="text-sm font-bold">1. Deneyimini seç</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {concepts.map(concept => <button type="button" key={concept.id} aria-pressed={selectedConcept.id === concept.id} onClick={() => setSelectedConceptId(concept.id)}
                  className={`rounded-2xl border-2 p-4 text-left ${selectedConcept.id === concept.id ? "border-pink-600 bg-pink-50" : "border-pink-100 bg-white"}`}>
                  <span className="block font-bold">{concept.title}</span>
                  <span className="mt-2 block text-xs leading-6 text-[#6b4a4a]">{concept.description}</span>
                </button>)}
              </div>
            </fieldset>
            <p className="rounded-2xl bg-pink-50 p-4 text-sm leading-6">{selectedConcept.sample}</p>
            <h3 className="text-lg font-bold">2. Kişisel detayları ekle</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                Kime?
                <input
                  value={personName}
                  onChange={(event) => setPersonName(event.target.value)}
                  placeholder="Örn: Ayşe"
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                Kimden?
                <input
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="Örn: Merve"
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                Yakınlık / ilişki
                <input
                  value={relation}
                  onChange={(event) => setRelation(event.target.value)}
                  placeholder="Örn: sevgilim, kardeşim, en yakın arkadaşım"
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                Hediye ne?
                <input
                  value={giftName}
                  onChange={(event) => setGiftName(event.target.value)}
                  placeholder="Örn: parfüm, kahve kupası, kolye"
                  className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                />
              </label>
            </div>

            <details className="rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5">
              <summary className="cursor-pointer text-lg font-black text-[#2b1b1b]">
                İsteğe bağlı sürprizler
              </summary>

              <div className="mt-4 grid gap-4">
                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  <input
                    type="checkbox"
                    checked={lockEnabled}
                    onChange={(event) => setLockEnabled(event.target.checked)}
                  />
                  Soruyla açılan sürpriz olsun
                </label>

                {lockEnabled && (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                      Kilit sorusu
                      <input
                        value={lockQuestion}
                        onChange={(event) => setLockQuestion(event.target.value)}
                        placeholder="Örn: İlk kahvemizi nerede içmiştik?"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                      Doğru cevap
                      <input
                        value={lockAnswer}
                        onChange={(event) => setLockAnswer(event.target.value)}
                        placeholder="Örn: Bebek"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </label>
                  </div>
                )}

                <label className="grid gap-2 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  Zaman kilidi
                  <input
                    type="datetime-local"
                    value={unlockAt}
                    onChange={(event) => setUnlockAt(event.target.value)}
                    className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                  />
                  <span className="text-xs font-semibold text-[#8a6a6a]">
                    Boş bırakırsan mesaj hemen açılır.
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  <input
                    type="checkbox"
                    checked={moodEnabled}
                    onChange={(event) => setMoodEnabled(event.target.checked)}
                  />
                  Alıcı duygu seçsin
                </label>

                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  <input
                    type="checkbox"
                    checked={surpriseEnabled}
                    onChange={(event) => setSurpriseEnabled(event.target.checked)}
                  />
                  Sürpriz kutusu modu olsun
                </label>

                {surpriseEnabled && (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <textarea
                      value={surpriseBox1}
                      onChange={(event) => setSurpriseBox1(event.target.value)}
                      placeholder="1. kutu: Minik mesaj..."
                      rows={2}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={surpriseBox2}
                      onChange={(event) => setSurpriseBox2(event.target.value)}
                      placeholder="2. kutu: Anı / ipucu..."
                      rows={2}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={surpriseBox3}
                      onChange={(event) => setSurpriseBox3(event.target.value)}
                      placeholder="3. kutu: Tatlı detay..."
                      rows={2}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={surpriseBox4}
                      onChange={(event) => setSurpriseBox4(event.target.value)}
                      placeholder="4. kutu: Final notu..."
                      rows={2}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  <input
                    type="checkbox"
                    checked={quizEnabled}
                    onChange={(event) => setQuizEnabled(event.target.checked)}
                  />
                  Mini quiz olsun
                </label>

                {quizEnabled && (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={quizQ1}
                        onChange={(event) => setQuizQ1(event.target.value)}
                        placeholder="Soru 1"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                      <input
                        value={quizA1}
                        onChange={(event) => setQuizA1(event.target.value)}
                        placeholder="Cevap 1"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={quizQ2}
                        onChange={(event) => setQuizQ2(event.target.value)}
                        placeholder="Soru 2"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                      <input
                        value={quizA2}
                        onChange={(event) => setQuizA2(event.target.value)}
                        placeholder="Cevap 2"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        value={quizQ3}
                        onChange={(event) => setQuizQ3(event.target.value)}
                        placeholder="Soru 3"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                      <input
                        value={quizA3}
                        onChange={(event) => setQuizA3(event.target.value)}
                        placeholder="Cevap 3"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </div>

                    <p className="text-xs font-semibold text-[#8a6a6a]">
                      Cevaplar oyun hissi içindir. Yanlış cevap verse bile sonunda not açılır.
                    </p>
                  </div>
                )}

                <label className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-black text-[#2b1b1b]">
                  <input
                    type="checkbox"
                    checked={memoryEnabled}
                    onChange={(event) => setMemoryEnabled(event.target.checked)}
                  />
                  Anı kartı eklensin
                </label>

                {memoryEnabled && (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <div className="grid gap-3 md:grid-cols-[100px_1fr]">
                      <input
                        value={memoryEmoji}
                        onChange={(event) => setMemoryEmoji(event.target.value)}
                        placeholder="💌"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-center text-sm font-bold outline-none"
                      />

                      <input
                        value={memoryTitle}
                        onChange={(event) => setMemoryTitle(event.target.value)}
                        placeholder="Anı başlığı: İlk kahvemiz"
                        className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                      />
                    </div>

                    <textarea
                      value={memoryDetail}
                      onChange={(event) => setMemoryDetail(event.target.value)}
                      placeholder="Bu hediye hangi anıyı temsil ediyor?"
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />
                  </div>
                )}

                {moodEnabled && (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <textarea
                      value={moodHappy}
                      onChange={(event) => setMoodHappy(event.target.value)}
                      placeholder="Mutlu seçerse görünecek mesaj..."
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={moodEmotional}
                      onChange={(event) => setMoodEmotional(event.target.value)}
                      placeholder="Duygusal seçerse görünecek mesaj..."
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={moodRomantic}
                      onChange={(event) => setMoodRomantic(event.target.value)}
                      placeholder="Romantik seçerse görünecek mesaj..."
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={moodFunny}
                      onChange={(event) => setMoodFunny(event.target.value)}
                      placeholder="Gülümseten seçerse görünecek mesaj..."
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />

                    <textarea
                      value={moodNostalgic}
                      onChange={(event) => setMoodNostalgic(event.target.value)}
                      placeholder="Nostaljik seçerse görünecek mesaj..."
                      rows={3}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />
                  </div>
                )}
              </div>
            </details>

            {isHunt ? (
              <div className="rounded-[1.5rem] bg-[#fff4ef] p-5">
                <h3 className="text-lg font-black text-[#2b1b1b]">
                  Hediye Avı Ayarları
                </h3>

                <div className="mt-4 grid gap-4">
                  <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                    Hediye nerede saklı / final neresi?
                    <input
                      value={huntLocation}
                      onChange={(event) => setHuntLocation(event.target.value)}
                      placeholder="Örn: çalışma masasının çekmecesi, dolabın üst rafı"
                      className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                      Kaç adım?
                      <select
                        value={huntSteps}
                        onChange={(event) => setHuntSteps(Number(event.target.value))}
                        className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
                      >
                        <option value={2}>2 adım</option>
                        <option value={3}>3 adım</option>
                        <option value={4}>4 adım</option>
                        <option value={5}>5 adım</option>
                        <option value={6}>6 adım</option>
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                      Zorluk
                      <select
                        value={huntDifficulty}
                        onChange={(event) => setHuntDifficulty(event.target.value)}
                        className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
                      >
                        <option value="easy">Kolay</option>
                        <option value="medium">Orta</option>
                        <option value="hard">Zor</option>
                      </select>
                    </label>

                    <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                      Tarz
                      <select
                        value={huntStyle}
                        onChange={(event) => setHuntStyle(event.target.value)}
                        className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold outline-none"
                      >
                        <option value="cute">Sevimli</option>
                        <option value="funny">Eğlenceli</option>
                        <option value="romantic">Romantik</option>
                        <option value="mysterious">Gizemli</option>
                      </select>
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                    Özel ipucu detayı
                    <textarea
                      value={huntDetail}
                      onChange={(event) => setHuntDetail(event.target.value)}
                      placeholder="Örn: İlk kahvemizi içtiğimiz yerle ilgili küçük bir gönderme olsun."
                      rows={4}
                      className="rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-bold leading-6 outline-none"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                    Ton
                    <select
                      value={tone}
                      onChange={(event) => setTone(event.target.value)}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option value="emotional">Duygusal</option>
                      <option value="romantic">Romantik</option>
                      <option value="funny">Tatlı / Eğlenceli</option>
                      <option value="minimal">Sade</option>
                      <option value="premium">Şık / Premium</option>
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                    Not uzunluğu
                    <select
                      value={noteLength}
                      onChange={(event) => setNoteLength(event.target.value)}
                      className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
                    >
                      <option value="short">Kısa</option>
                      <option value="medium">Orta</option>
                      <option value="long">Uzun / Hikayeli</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
                  {selectedConcept.id === "ani-kutusu" ? "Hangi anıyı hatırlatsın?" : selectedConcept.id === "karakterine-gore" ? "Onu anlatan özellik veya sevdiği bir şey" : "Nota katmak istediğin kişisel detay"}
                  <textarea
                    value={specialDetail}
                    onChange={(event) => setSpecialDetail(event.target.value)}
                    placeholder="Örn: İlk kahvemizi beraber içtiğimiz günü hatırlatmak istiyorum."
                    rows={4}
                    className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#6b4a4a]">3. Önizle ve düzenle</p>
              <p className="text-sm font-black text-pink-600">
                {selectedConcept.title}
              </p>

              <h3 className="mt-1 text-2xl font-black text-[#2b1b1b]">
                {isHunt ? "Hediye Avı Akışı" : "Oluşturulan Not"}
              </h3>
            </div>

            <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
              {selectedConcept.badge}
            </span>
          </div>

          <div className="mt-4 rounded-2xl border border-pink-100 p-4 text-sm leading-7">
            <p className="font-bold">Alıcı nasıl ilerleyecek?</p>
            <p>{[unlockAt && "Belirlediğin zamanı bekler", lockEnabled && "Sorunun cevabını girer", quizEnabled && "Mini quizi oynar", surpriseEnabled && "Sürpriz kutularını açar", moodEnabled && "Duygusunu seçer", isHunt ? "İpuçlarını adım adım takip eder" : "Notunu okur", memoryEnabled && "Anı kartını görür"].filter(Boolean).join(" → ")}</p>
          </div>
          <label className="mt-5 block text-sm font-bold">Alıcının okuyacağı metin
            <textarea value={generatedText} onChange={event => setEditedNote({ source: generatedBase, text: event.target.value })} rows={15} maxLength={8000}
              className="mt-3 w-full rounded-3xl border border-pink-100 bg-[#fff4ef] p-5 text-sm font-normal leading-7" />
          </label>
          <p className="mt-3 text-xs leading-6 text-[#6b4a4a]">Detaylarını değiştirirsen yeni bir taslak hazırlanır. Kaydetmeden önce son metni kontrol et.</p>
          {savedId && savedSnapshot !== snapshot && <p role="status" className="mt-3 text-sm text-amber-800">Deneyim değişti. Güncel kart bağlantısı için yeniden kaydet.</p>}

          {message && (
            <p role="status" className="mt-4 rounded-2xl bg-pink-50 p-4 text-sm font-black text-pink-700">
              {message}
            </p>
          )}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <button
              onClick={copyText}
              className="rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
            >
              Metni Kopyala
            </button>

            <button
              onClick={saveExperience}
              disabled={saving}
              className="rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white disabled:opacity-60"
            >
              {saving ? "Kaydediliyor..." : "Hesabıma Kaydet"}
            </button>
          </div>

          {savedId && savedSnapshot === snapshot && (
            <Link
              href={`/deneyim/paylas/${savedId}`}
              className="mt-4 flex w-full items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
            >
              {isHunt ? "Hediye Avı QR / Kart Oluştur" : "Kart Tasarımı / QR Oluştur"}
            </Link>
          )}

          <Link
            href="/hesabim/kaydettiklerim"
            className="mt-3 flex w-full items-center justify-center rounded-full bg-[#fff4ef] px-5 py-4 text-sm font-black text-[#6b4a4a]"
          >
            Kaydettiklerime Git
          </Link>
        </div>
      </div>
    </section>
  );
}
