"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { premiumConcepts } from "@/data/premiumConcepts";

function buildConceptOutput({
  conceptId,
  personName,
  relation,
  giftName,
  tone,
}: {
  conceptId: string;
  personName: string;
  relation: string;
  giftName: string;
  tone: string;
}) {
  const name = personName.trim() || "sen";
  const relationText = relation.trim() || "benim için özel biri";
  const gift = giftName.trim() || "bu hediye";
  const toneText = tone || "duygusal";

  if (conceptId === "hediye-avi") {
    return `🎁 HEDİYE AVI

Hazırlanan kişi: ${name}
Hediye: ${gift}
Ton: ${toneText}

1. İpucu:
Bugün sana sıradan bir hediye vermek istemedim. Çünkü sen ${relationText} olarak benim için özel bir yerdesin.

2. İpucu:
Bu hediye, seni düşündüğüm bir anın küçük bir sonucu. Yaklaştın ama hemen bulmanı istemiyorum.

3. İpucu:
Son ipucu: Bu hediye, hem seni mutlu etsin hem de “beni düşünmüş” dedirtsin diye seçildi.

Son mesaj:
Bu küçük hediye avının sonunda sana ulaşan şey sadece ${gift} değil. Asıl hediye, seni düşünerek hazırladığım bu küçük sürprizdi.`;
  }

  if (conceptId === "kader-bagi") {
    return `💞 KADER BAĞI

Sevgili ${name},

Bazı hediyeler sadece alınmaz, bir anlamın içine yerleştirilir. 
Ben de ${gift} seçerken sadece güzel bir şey olsun istemedim; seni düşündüğüm anla aramızdaki bağı birleştiren küçük bir hatıra olsun istedim.

Sen benim için ${relationText}. 
Bu yüzden bu hediye, sana “aklımdasın” demenin küçük ama içten bir yolu.

Bu hediyenin anlamı:
Bazen bir insanın hayatımızdaki yeri büyük cümlelerle değil, küçük seçimlerle belli olur. Bu da benim küçük seçimim.`;
  }

  if (conceptId === "ani-kutusu") {
    return `📦 ANI KUTUSU

${name} için hazırlanan anı notu

Bu kutunun içinde sadece ${gift} yok.
İçinde biraz hatıra, biraz düşünce ve biraz da “iyi ki varsın” hissi var.

Sen benim için ${relationText}.
Bu yüzden bu hediyenin sadece kullanılmasını değil, hatırlanmasını da istedim.

Küçük not:
Bir gün bu hediyeyi gördüğünde, sadece ne olduğunu değil, kimin seni düşünerek seçtiğini de hatırla.`;
  }

  if (conceptId === "gizli-mesaj") {
    return `🔐 GİZLİ MESAJ

Bu mesajı hediyeden sonra açmanı istedim.

Çünkü ${gift} aslında sadece görünen kısmı.
Asıl söylemek istediğim şey şu:

${name}, sen benim için ${relationText}.
Bu hediyeyi seçerken seni düşündüm; ne seversin, ne hoşuna gider, ne seni mutlu eder diye düşündüm.

Küçük ama içten bir şey olsun istedim.
Umarım bu hediye sana biraz olsun bunu hissettirir.`;
  }

  return `✨ KİŞİYE ÖZEL HEDİYE SUNUMU

${name} için seçilen hediye: ${gift}

Bu hediyeyi seçme sebebim sadece güzel görünmesi değil.
Senin tarzına, hayatımdaki yerine ve bende bıraktığın hisse uygun olmasını istedim.

Sen benim için ${relationText}.
Bu yüzden bu küçük hediyenin, sana özel düşünülmüş gibi hissettirmesini istedim.`;
}

export default function PremiumConceptLauncher() {
  const searchParams = useSearchParams();
  const selectedConceptId = searchParams.get("concept");

  const selectedConcept =
    premiumConcepts.find((concept) => concept.id === selectedConceptId) ||
    premiumConcepts[0];

  const [personName, setPersonName] = useState("");
  const [relation, setRelation] = useState("");
  const [giftName, setGiftName] = useState("");
  const [tone, setTone] = useState("Duygusal");

  const output = useMemo(() => {
    return buildConceptOutput({
      conceptId: selectedConcept.id,
      personName,
      relation,
      giftName,
      tone,
    });
  }, [selectedConcept.id, personName, relation, giftName, tone]);

  if (!selectedConceptId) {
    return null;
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      alert("Metin kopyalandı.");
    } catch {
      alert("Kopyalanamadı. Metni elle seçip kopyalayabilirsin.");
    }
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl px-5">
      <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
          Seçilen Premium Konsept
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-black text-pink-700">
                {selectedConcept.badge}
              </span>

              <span className="rounded-full bg-[#2b1b1b] px-4 py-2 text-xs font-black uppercase text-white">
                {selectedConcept.premiumLevel}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-[#2b1b1b] md:text-5xl">
              {selectedConcept.title}
            </h1>

            <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
              {selectedConcept.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] bg-[#fff4ef] p-5">
              <h2 className="text-xl font-black text-[#2b1b1b]">
                Konsepti hazırla
              </h2>

              <div className="mt-4 grid gap-3">
                <label className="text-sm font-black text-[#6b4a4a]">
                  Kime hazırlanıyor?
                  <input
                    value={personName}
                    onChange={(event) => setPersonName(event.target.value)}
                    placeholder="Örn: Elif, annem, sevgilim..."
                    className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
                  />
                </label>

                <label className="text-sm font-black text-[#6b4a4a]">
                  Senin için kim?
                  <input
                    value={relation}
                    onChange={(event) => setRelation(event.target.value)}
                    placeholder="Örn: en yakın arkadaşım, sevgilim, annem..."
                    className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
                  />
                </label>

                <label className="text-sm font-black text-[#6b4a4a]">
                  Hediye ne?
                  <input
                    value={giftName}
                    onChange={(event) => setGiftName(event.target.value)}
                    placeholder="Örn: parfüm, sweatshirt, kahve fincanı..."
                    className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
                  />
                </label>

                <label className="text-sm font-black text-[#6b4a4a]">
                  Tonu nasıl olsun?
                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-pink-400"
                  >
                    <option>Duygusal</option>
                    <option>Romantik</option>
                    <option>Komik</option>
                    <option>Sade</option>
                    <option>Samimi</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[#fff0f7] p-5">
            <p className="text-xs font-black uppercase tracking-wide text-pink-600">
              Hazırlanan konsept metni
            </p>

            <pre className="mt-4 whitespace-pre-wrap rounded-[1.25rem] bg-white p-5 text-sm font-semibold leading-7 text-[#2b1b1b] shadow-sm">
              {output}
            </pre>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={copyOutput}
                className="rounded-full bg-pink-600 px-5 py-3 text-sm font-black text-white transition hover:bg-pink-700"
              >
                Metni Kopyala
              </button>

              <Link
                href="/paketler"
                className="rounded-full bg-[#2b1b1b] px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                Pakete Geç
              </Link>

              <Link
                href="/deneyim"
                className="rounded-full border border-pink-200 bg-white px-5 py-3 text-sm font-black text-pink-700 transition hover:bg-pink-50"
              >
                Tüm Konseptler
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
