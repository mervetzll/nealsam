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
      badge: "Oyunlu",
      description: "Hediyeyi adım adım ipuçlarıyla bulunan mini bir sürpriz oyununa dönüştürür.",
      bestFor: ["Arkadaş", "Kardeş", "Sevgili", "Eğlenceli ilişkiler"],
      sample: "QR kodu okut, ipuçlarını takip et ve hediyeye ulaş.",
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

function getHuntStyleText(style: string) {
  if (style === "funny") return "tatlı ve eğlenceli";
  if (style === "romantic") return "romantik ve merak uyandıran";
  if (style === "mysterious") return "gizemli ve heyecanlı";
  if (style === "cute") return "sevimli ve yumuşak";
  return "sürprizli ve keyifli";
}

function getDifficultyText(difficulty: string) {
  if (difficulty === "easy") return "kolay";
  if (difficulty === "hard") return "zorlayıcı";
  return "orta zorlukta";
}

function buildHuntClues({
  personName,
  senderName,
  giftName,
  huntLocation,
  huntSteps,
  huntDifficulty,
  huntStyle,
  huntDetail,
}: {
  personName: string;
  senderName: string;
  giftName: string;
  huntLocation: string;
  huntSteps: number;
  huntDifficulty: string;
  huntStyle: string;
  huntDetail: string;
}) {
  const toName = personName.trim() || "sen";
  const fromName = senderName.trim();
  const gift = giftName.trim() || "sürprizin";
  const location = huntLocation.trim() || "hediyenin saklı olduğu yer";
  const detail = huntDetail.trim();
  const steps = Math.min(Math.max(Number(huntSteps || 3), 2), 6);
  const styleText = getHuntStyleText(huntStyle);
  const difficultyText = getDifficultyText(huntDifficulty);

  const clues = [
    `İlk ipucun burada başlıyor: Bugün sıradan bir gün gibi görünebilir ama aslında küçük bir sürprize doğru ilerliyorsun. ${difficultyText} bir av olacak, dikkatli bak.`,
    `İkinci ipucu: ${gift} sana direkt gelmeyecek. Önce etrafında sana tanıdık gelen, günlük hayatında sık gördüğün bir yere odaklan.`,
    `Üçüncü ipucu: Sürpriz, çok uzaklarda değil. Biraz merak, biraz dikkat ve biraz da gülümseme gerekiyor.`,
    `Dördüncü ipucu: ${detail ? `Şunu hatırla: ${detail}` : "Bugün sana özel hazırlanan küçük detaylara dikkat et."}`,
    `Beşinci ipucu: Artık çok yaklaştın. Sürprizi bulduğunda bunun özellikle senin için hazırlandığını anlayacaksın.`,
    `Son ipucu: Şimdi final zamanı. Hediyene ulaşmak için ${location} kısmına bak.`,
  ];

  const selectedClues = clues.slice(0, steps - 1);

  selectedClues.push(`Final: ${location}. Orada seni ${gift} bekliyor.`);

  return `${toName === "sen" ? "Sevgili sen" : `Sevgili ${toName}`},

Sana hediyeni direkt vermek yerine küçük bir Hediye Avı hazırladım.

Bu avın tarzı: ${styleText}.
Zorluk seviyesi: ${difficultyText}.

${selectedClues.map((clue, index) => `${index + 1}. ADIM\n${clue}`).join("\n\n")}

${fromName ? `${fromName}'den küçük bir sürpriz.` : "Bu küçük sürpriz senin için."}`;
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
  huntLocation,
  huntSteps,
  huntDifficulty,
  huntStyle,
  huntDetail,
}: {
  concept: PremiumConcept;
  personName: string;
  senderName: string;
  relation: string;
  giftName: string;
  tone: string;
  noteLength: string;
  specialDetail: string;
  huntLocation: string;
  huntSteps: number;
  huntDifficulty: string;
  huntStyle: string;
  huntDetail: string;
}) {
  if (concept.id === "hediye-avi") {
    return buildHuntClues({
      personName,
      senderName,
      giftName,
      huntLocation,
      huntSteps,
      huntDifficulty,
      huntStyle,
      huntDetail,
    });
  }

  const toName = personName.trim() || "sen";
  const fromName = senderName.trim();
  const gift = giftName.trim() || "bu hediye";
  const relationText = relation.trim();
  const detail = specialDetail.trim();

  const opening = toName === "sen" ? "Sevgili sen," : `Sevgili ${toName},`;
  const signature = fromName ? `\n\n${fromName}'den sevgilerle.` : "";
  const toneText = getToneLabel(tone);
  const lengthText = getLengthInstruction(noteLength);

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

  const [huntLocation, setHuntLocation] = useState("");
  const [huntSteps, setHuntSteps] = useState(4);
  const [huntDifficulty, setHuntDifficulty] = useState("medium");
  const [huntStyle, setHuntStyle] = useState("cute");
  const [huntDetail, setHuntDetail] = useState("");

  const [generatedText, setGeneratedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState("");
  const [message, setMessage] = useState("");

  const selectedConcept = useMemo(() => {
    return concepts.find((concept) => concept.id === selectedConceptId) || concepts[0];
  }, [concepts, selectedConceptId]);

  const isHunt = selectedConcept?.id === "hediye-avi";

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
      huntLocation,
      huntSteps,
      huntDifficulty,
      huntStyle,
      huntDetail,
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
    huntLocation,
    huntSteps,
    huntDifficulty,
    huntStyle,
    huntDetail,
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
          huntLocation,
          huntSteps,
          huntDifficulty,
          huntStyle,
          huntDetail,
        }),
      });

      const data = await response.json();

      if (!data?.ok) {
        setMessage(data?.error || "Deneyim kaydedilemedi.");
        return;
      }

      setSavedId(data.experience?.id || "");
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
                  Özel detay
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
