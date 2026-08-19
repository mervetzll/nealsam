"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PremiumConcept = {
  id: string;
  title: string;
  badge: string;
  description: string;
  bestFor: string[];
  sample: string;
  premiumLevel: string;
};

function getFallbackConcepts(): PremiumConcept[] {
  return [
    {
      id: "kader-bagi",
      title: "Kader Bağı",
      badge: "Duygusal",
      description: "Hediyeyi anlamlı ve duygusal bir mesaja dönüştürür.",
      bestFor: ["Sevgili", "Eş", "Yakın arkadaş", "Aile"],
      sample: "Bu hediye sadece bir eşya değil, aramızdaki bağın küçük bir hatırası.",
      premiumLevel: "plus",
    },
    {
      id: "hediye-avi",
      title: "Hediye Avı",
      badge: "Eğlenceli",
      description: "Hediyeyi küçük bir oyun ve sürpriz akışına dönüştürür.",
      bestFor: ["Arkadaş", "Kardeş", "Eğlenceli ilişkiler"],
      sample: "Bu hediyeye ulaşmak için küçük bir ipucun var.",
      premiumLevel: "experience",
    },
    {
      id: "ani-kutusu",
      title: "Anı Kutusu",
      badge: "Nostaljik",
      description: "Hediyeyi ortak anılarla bağlayan özel bir not oluşturur.",
      bestFor: ["Aile", "Yakın arkadaş", "Mezuniyet"],
      sample: "Bu hediye bana birlikte yaşadığımız güzel anları hatırlattı.",
      premiumLevel: "plus",
    },
    {
      id: "gizli-mesaj",
      title: "Gizli Mesaj",
      badge: "Sürpriz",
      description: "QR ile açılan daha gizemli ve özel bir mesaj hazırlar.",
      bestFor: ["Sevgili", "Uzakta olan biri", "Sürpriz hediye"],
      sample: "Bu mesajı sadece sen görebilesin istedim.",
      premiumLevel: "premium",
    },
    {
      id: "karakterine-gore",
      title: "Karakterine Göre",
      badge: "Kişisel",
      description: "Kişinin tarzına göre özel ve samimi bir not yazar.",
      bestFor: ["Herkes"],
      sample: "Bunu seçtim çünkü tam senlik olduğunu düşündüm.",
      premiumLevel: "plus",
    },
  ];
}

function getToneLabel(tone: string) {
  if (tone === "romantic") return "romantik ve içten";
  if (tone === "emotional") return "duygusal ve anlamlı";
  if (tone === "funny") return "tatlı, eğlenceli ve samimi";
  if (tone === "minimal") return "sade ve zarif";
  if (tone === "premium") return "şık, özel ve etkileyici";
  return "samimi ve sıcak";
}

function getLengthInstruction(noteLength: string) {
  if (noteLength === "short") return "Kısa ve etkili tut.";
  if (noteLength === "long") return "Biraz daha detaylı, duygulu ve hikayeli yaz.";
  return "Orta uzunlukta, okunması kolay ve etkileyici yaz.";
}

function buildConceptOutput({
  concept,
  personName,
  senderName,
  relation,
  giftName,
  tone,
  noteLength,
  specialDetail,
}: {
  concept: PremiumConcept;
  personName: string;
  senderName: string;
  relation: string;
  giftName: string;
  tone: string;
  noteLength: string;
  specialDetail: string;
}) {
  const toName = personName.trim() || "sen";
  const fromName = senderName.trim();
  const gift = giftName.trim() || "bu hediye";
  const relationText = relation.trim();
  const detail = specialDetail.trim();

  const opening =
    toName === "sen"
      ? "Sevgili sen,"
      : `Sevgili ${toName},`;

  const signature = fromName ? `\n\n${fromName}'den sevgilerle.` : "";

  const toneText = getToneLabel(tone);
  const lengthText = getLengthInstruction(noteLength);

  if (concept.id === "hediye-avi") {
    return `${opening}

Bu sefer hediyene direkt ulaşmanı istemedim; çünkü bazı sürprizler küçük bir heyecanı hak eder.

Senin için hazırladığım bu küçük hediye avında ipucun şu:

“Beni görünce aklına hem ${gift} hem de seni düşündüğüm o an gelsin.”

${relationText ? `Bunu özellikle ${relationText} olduğun için daha özel hissetmeni istedim.` : ""}
${detail ? `Aklımda özellikle şu vardı: ${detail}` : ""}

Bu notun tonu ${toneText} olsun istedim. ${lengthText}

Şimdi hediyeni açma zamanı.${signature}`;
  }

  if (concept.id === "ani-kutusu") {
    return `${opening}

Bazı hediyeler sadece bugünü değil, geçmişte kalan güzel anları da yanında getirir.

Ben ${gift} seçerken sadece güzel bir şey almak istemedim. Bir anıyı, bir gülümsemeyi ve aklıma gelen küçük bir detayı da içine koymak istedim.

${relationText ? `Sen benim için ${relationText} olarak çok ayrı bir yerdesin.` : ""}
${detail ? `Bu hediyeyi seçerken özellikle şunu düşündüm: ${detail}` : ""}

Umarım bu küçük hediye sana sadece mutlu bir an değil, güzel bir hatıra da bırakır.${signature}`;
  }

  if (concept.id === "gizli-mesaj") {
    return `${opening}

Bu mesajı herkes görsün istemedim. Sadece sen aç, sadece sen oku istedim.

Çünkü ${gift} benim için sıradan bir hediye değil; seni düşündüğümü anlatan küçük ve özel bir işaret.

${relationText ? `Seninle olan bağım ${relationText} kelimesinden çok daha fazlasını hissettiriyor.` : ""}
${detail ? `Bu notun içinde saklamak istediğim küçük detay şu: ${detail}` : ""}

Bunu okuduğunda yüzünde küçük bir gülümseme olsun istedim.${signature}`;
  }

  if (concept.id === "karakterine-gore") {
    return `${opening}

Bu hediyeyi seçerken “güzel mi?” diye değil, “sana yakışır mı?” diye düşündüm.

Çünkü bence ${gift}, senin tarzına ve enerjine yakışan küçük ama anlamlı bir seçim.

${relationText ? `Sen benim için ${relationText} olarak çok özel bir yerdesin.` : ""}
${detail ? `Özellikle şunu düşünerek hazırladım: ${detail}` : ""}

Umarım bunu gördüğünde “evet, bu gerçekten bana göre” dersin.${signature}`;
  }

  return `${opening}

Bazı hediyeler sadece alınmaz; bir anlamın içine yerleştirilir.

Ben de ${gift} seçerken sadece güzel bir şey olsun istemedim. Seni düşündüğüm anla aramızdaki bağı birleştiren küçük bir hatıra olsun istedim.

${relationText ? `Sen benim için ${relationText} olarak çok özel bir yerdesin.` : ""}
${detail ? `Bu hediyeyi hazırlarken özellikle şunu düşündüm: ${detail}` : ""}

Bu notun tonu ${toneText} olsun istedim. ${lengthText}

Umarım bu küçük sürpriz sana kendini özel hissettirir.${signature}`;
}

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

  const [generatedText, setGeneratedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [message, setMessage] = useState("");

  const selectedConcept = useMemo(() => {
    return (
      concepts.find((concept) => concept.id === selectedConceptId) ||
      concepts[0]
    );
  }, [concepts, selectedConceptId]);

  useEffect(() => {
    loadConcepts();
  }, []);

  useEffect(() => {
    if (!selectedConcept) return;

    const output = buildConceptOutput({
      concept: selectedConcept,
      personName,
      senderName,
      relation,
      giftName,
      tone,
      noteLength,
      specialDetail,
    });

    setGeneratedText(output);
    setSavedId("");
  }, [
    selectedConcept,
    personName,
    senderName,
    relation,
    giftName,
    tone,
    noteLength,
    specialDetail,
  ]);

  async function loadConcepts() {
    try {
      const response = await fetch("/api/premium-concepts", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data?.ok && Array.isArray(data.concepts) && data.concepts.length > 0) {
        setConcepts(data.concepts);
      }
    } catch {
      setConcepts(getFallbackConcepts());
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(generatedText);
      alert("Metin kopyalandı.");
    } catch {
      alert("Metin kopyalanamadı.");
    }
  }

  async function saveExperience() {
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
        body: JSON.stringify({
          conceptKey: selectedConcept.id,
          conceptTitle: selectedConcept.title,
          personName,
          senderName,
          relation,
          giftName,
          tone,
          noteLength,
          specialDetail,
          generatedText,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Deneyim kaydedilemedi.");
        return;
      }

      setSavedId(data.experience?.id || "");
      setMessage("Deneyim kaydedildi. Artık kartını ve QR kodunu oluşturabilirsin.");
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
            Özel Not Oluştur
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
            Kime, kimden ve hangi hediye için olduğunu yaz. Sistem sana daha
            özel, daha gerçek bir hediye notu oluştursun.
          </p>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-black text-[#2b1b1b]">
              Konsept
              <select
                value={selectedConceptId}
                onChange={(event) => setSelectedConceptId(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              >
                {concepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.title} - {concept.badge}
                  </option>
                ))}
              </select>
            </label>

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
                  placeholder="Örn: en yakın arkadaşım, sevgilim, annem"
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
              Özel detay
              <textarea
                value={specialDetail}
                onChange={(event) => setSpecialDetail(event.target.value)}
                placeholder="Örn: İlk kahvemizi beraber içtiğimiz günü hatırlatmak istiyorum."
                rows={4}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold leading-6 outline-none"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-pink-600">
                {selectedConcept.title}
              </p>

              <h3 className="mt-1 text-2xl font-black text-[#2b1b1b]">
                Oluşturulan Not
              </h3>
            </div>

            <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
              {selectedConcept.badge}
            </span>
          </div>

          <pre className="mt-5 max-h-[540px] overflow-y-auto whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
            {generatedText}
          </pre>

          {message && (
            <p className="mt-4 rounded-2xl bg-pink-50 p-4 text-sm font-black text-pink-700">
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

          {savedId && (
            <Link
              href={`/deneyim/paylas/${savedId}`}
              className="mt-4 flex w-full items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
            >
              Kart Tasarımı / QR Oluştur
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
