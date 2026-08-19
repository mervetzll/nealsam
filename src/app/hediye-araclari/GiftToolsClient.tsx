"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const giftMeanings: Record<string, string> = {
  parfüm:
    "Parfüm, karşı tarafa “seni özel, akılda kalıcı ve etkileyici görüyorum” mesajı verir. Kişisel bir hediye olduğu için romantik ve zarif bir anlam taşır.",
  parfum:
    "Parfüm, karşı tarafa “seni özel, akılda kalıcı ve etkileyici görüyorum” mesajı verir. Kişisel bir hediye olduğu için romantik ve zarif bir anlam taşır.",
  kupa:
    "Kupa, “günlük hayatında küçük de olsa bir yerim olsun” mesajı verir. Sıcak, samimi ve güvenli bir hediyedir.",
  kolye:
    "Kolye, “sana kalıcı bir hatıra bırakmak istiyorum” anlamı taşır. Romantik, değerli ve unutulmaz bir hediye hissi verir.",
  bileklik:
    "Bileklik, “seni düşündüm ve yanında taşıyabileceğin küçük bir anı bırakmak istedim” mesajı verir.",
  kitap:
    "Kitap, “senin dünyanı, zevklerini ve düşüncelerini önemsiyorum” anlamı taşır. Kişisel ve düşünülmüş bir hediyedir.",
  çikolata:
    "Çikolata, “sana küçük bir mutluluk vermek istedim” mesajı taşır. Tatlı, risksiz ve sevimli bir hediyedir.",
  cikolata:
    "Çikolata, “sana küçük bir mutluluk vermek istedim” mesajı taşır. Tatlı, risksiz ve sevimli bir hediyedir.",
  çiçek:
    "Çiçek, “bugün seni güzel hissettirmek istedim” anlamına gelir. Zarif, duygusal ve klasik bir hediyedir.",
  cicek:
    "Çiçek, “bugün seni güzel hissettirmek istedim” anlamına gelir. Zarif, duygusal ve klasik bir hediyedir.",
  mum:
    "Mum, “sana sakin, huzurlu ve sıcak bir an hediye etmek istiyorum” mesajı verir.",
  çanta:
    "Çanta, “tarzını düşündüm ve kullanabileceğin özel bir şey seçtim” anlamı taşır.",
  canta:
    "Çanta, “tarzını düşündüm ve kullanabileceğin özel bir şey seçtim” anlamı taşır.",
  saat:
    "Saat, “seninle geçen zamanı değerli buluyorum” mesajı verir. Şık ve anlamlı bir hediyedir.",
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function buildExcuse({
  person,
  relation,
  mood,
}: {
  person: string;
  relation: string;
  mood: string;
}) {
  const to = person.trim() || "ona";
  const rel = relation.trim() || "sevdiğin kişiye";

  const templates = {
    moral: [
      `${to} için “bugün biraz moral olsun” hediyesi.`,
      `${rel} son zamanlarda yorulduysa, bu hediye küçük bir “yanındayım” bahanesi olabilir.`,
      `${to} için “bu hafta çok uğraştın, bunu hak ettin” hediyesi.`,
    ],
    random: [
      `${to} için “durduk yere seni düşündüm” hediyesi.`,
      `${rel} için “sebepsiz ama içimden geldi” hediyesi.`,
      `${to} için “bugün küçük bir gülümseme bırakmak istedim” hediyesi.`,
    ],
    love: [
      `${to} için “iyi ki varsın” hediyesi.`,
      `${rel} için “bunu görünce aklıma sen geldin” hediyesi.`,
      `${to} için “seni sevdiğimi küçük bir şeyle göstermek istedim” hediyesi.`,
    ],
    funny: [
      `${to} için “bunu almamak ayıp olurdu” hediyesi.`,
      `${rel} için “bahane bulamadım, hediyeyi aldım” hediyesi.`,
      `${to} için “bugünün resmi bahanesi: seni şımartmak” hediyesi.`,
    ],
  };

  const selected = templates[mood as keyof typeof templates] || templates.random;

  return selected.join("\n");
}

function buildAfterGiftMessage({
  person,
  gift,
  tone,
}: {
  person: string;
  gift: string;
  tone: string;
}) {
  const to = person.trim() || "Canım";
  const selectedGift = gift.trim() || "hediyeyi";

  if (tone === "romantic") {
    return `${to},

Umarım ${selectedGift} hoşuna gitmiştir. Bunu seçerken sadece güzel bir hediye olsun istemedim; seni düşündüğümü de hissettirsin istedim.

Küçük bir şey gibi görünse de, benim için anlamı büyük. Umarım her gördüğünde yüzünde küçük bir gülümseme olur.`;
  }

  if (tone === "funny") {
    return `${to},

Umarım ${selectedGift} beğenmişsindir. Açıkçası bunu seçerken “tam ona göre” dedim, sonra da kendimi fazla düşünceli bulup biraz gururlandım.

Beğendiysen ne mutlu bana, beğenmediysen de ben yine iyi niyetliyim.`;
  }

  if (tone === "minimal") {
    return `${to},

Umarım ${selectedGift} hoşuna gitmiştir. Bunu seçerken seni düşündüm.

Güzel günlerde kullanman dileğiyle.`;
  }

  return `${to},

Umarım ${selectedGift} hoşuna gitmiştir. Bunu seçerken gerçekten seni düşündüm ve sana küçük de olsa güzel bir an bırakmasını istedim.

Umarım her gördüğünde mutlu olursun.`;
}

function buildGiftMeaning(gift: string) {
  const key = normalize(gift);

  if (!key) {
    return "Bir hediye adı yazdığında, o hediyenin karşı tarafa ne hissettirdiğini burada görebilirsin.";
  }

  const direct = giftMeanings[key];

  if (direct) return direct;

  if (key.includes("parfüm") || key.includes("parfum")) return giftMeanings.parfüm;
  if (key.includes("kupa")) return giftMeanings.kupa;
  if (key.includes("kolye")) return giftMeanings.kolye;
  if (key.includes("bileklik")) return giftMeanings.bileklik;
  if (key.includes("kitap")) return giftMeanings.kitap;
  if (key.includes("çikolata") || key.includes("cikolata")) return giftMeanings.çikolata;
  if (key.includes("çiçek") || key.includes("cicek")) return giftMeanings.çiçek;
  if (key.includes("mum")) return giftMeanings.mum;
  if (key.includes("çanta") || key.includes("canta")) return giftMeanings.çanta;
  if (key.includes("saat")) return giftMeanings.saat;

  return `${gift}, karşı tarafa “seni düşündüm ve sana özel bir seçim yapmak istedim” mesajı verir. Bu hediye, özellikle kişiye uygun seçildiyse samimi ve düşünülmüş bir anlam taşır.`;
}

export default function GiftToolsClient() {
  const [person, setPerson] = useState("");
  const [relation, setRelation] = useState("");
  const [mood, setMood] = useState("random");

  const [afterPerson, setAfterPerson] = useState("");
  const [afterGift, setAfterGift] = useState("");
  const [afterTone, setAfterTone] = useState("emotional");

  const [meaningGift, setMeaningGift] = useState("");

  const excuseText = useMemo(
    () => buildExcuse({ person, relation, mood }),
    [person, relation, mood]
  );

  const afterText = useMemo(
    () =>
      buildAfterGiftMessage({
        person: afterPerson,
        gift: afterGift,
        tone: afterTone,
      }),
    [afterPerson, afterGift, afterTone]
  );

  const meaningText = useMemo(
    () => buildGiftMeaning(meaningGift),
    [meaningGift]
  );

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      alert("Metin kopyalandı.");
    } catch {
      alert("Metin kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Araçları
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Hediye vermeyi daha eğlenceli ve anlamlı hale getir
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Hediye bahanesi bul, hediye sonrası mesaj hazırla ve seçtiğin
            hediyenin karşı tarafa ne anlattığını öğren.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              Hediye Bul
            </Link>

            <Link
              href="/deneyim"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
            >
              Deneyim Oluştur
            </Link>
          </div>
        </div>


        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Yeni Özellik
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#2b1b1b]">
            Hediye Karakter Kartı
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            Hediye sonuçlarında artık hediyenin ne anlattığını, risk seviyesini,
            kişisellik puanını ve nasıl verilmesi gerektiğini görebilirsin.
          </p>

          <Link
            href="/hediye-bul"
            className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
          >
            Hediye Bul ve Karakter Kartını Gör
          </Link>
        </div>



        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Karar Yardımcısı
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#2b1b1b]">
            Hediye Karşılaştırma
          </h2>

          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
            İki hediye arasında kaldıysan kişisellik, risk, duygusallık,
            kullanışlılık ve sürpriz etkisine göre karşılaştır.
          </p>

          <Link
            href="/hediye-karsilastir"
            className="mt-5 inline-flex rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
          >
            Hediyeleri Karşılaştır
          </Link>
        </div>


        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-pink-600">
              01
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Hediye Bahane Bulucu
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Durduk yere hediye almak istiyorsan ama nasıl söyleyeceğini
              bilmiyorsan sana tatlı bir bahane üretir.
            </p>

            <div className="mt-5 grid gap-3">
              <input
                value={person}
                onChange={(event) => setPerson(event.target.value)}
                placeholder="Kime? Örn: Ayşe"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />

              <input
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
                placeholder="Yakınlık? Örn: sevgilim, arkadaşım"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />

              <select
                value={mood}
                onChange={(event) => setMood(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="random">Sebepsiz / içimden geldi</option>
                <option value="moral">Moral olsun</option>
                <option value="love">İyi ki varsın</option>
                <option value="funny">Komik bahane</option>
              </select>
            </div>

            <pre className="mt-5 min-h-[170px] whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
              {excuseText}
            </pre>

            <button
              onClick={() => copy(excuseText)}
              className="mt-4 w-full rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
            >
              Bahaneleri Kopyala
            </button>
          </article>

          <article className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-pink-600">
              02
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Hediye Sonrası Mesaj
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Hediye verildikten sonra atılacak tatlı, doğal ve düşünceli mesajı hazırlar.
            </p>

            <div className="mt-5 grid gap-3">
              <input
                value={afterPerson}
                onChange={(event) => setAfterPerson(event.target.value)}
                placeholder="Kime? Örn: Canım Ayşe"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />

              <input
                value={afterGift}
                onChange={(event) => setAfterGift(event.target.value)}
                placeholder="Hediye ne? Örn: kolye"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />

              <select
                value={afterTone}
                onChange={(event) => setAfterTone(event.target.value)}
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              >
                <option value="emotional">Duygusal</option>
                <option value="romantic">Romantik</option>
                <option value="funny">Tatlı / komik</option>
                <option value="minimal">Kısa ve sade</option>
              </select>
            </div>

            <pre className="mt-5 min-h-[170px] whitespace-pre-wrap rounded-[1.5rem] bg-[#fff4ef] p-5 text-sm font-semibold leading-7 text-[#2b1b1b]">
              {afterText}
            </pre>

            <button
              onClick={() => copy(afterText)}
              className="mt-4 w-full rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
            >
              Mesajı Kopyala
            </button>
          </article>

          <article className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black text-pink-600">
              03
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Bu Hediye Ne Anlatır?
            </h2>

            <p className="mt-3 text-sm font-semibold leading-7 text-[#6b4a4a]">
              Seçtiğin hediyenin karşı tarafa nasıl bir mesaj verdiğini açıklar.
            </p>

            <div className="mt-5 grid gap-3">
              <input
                value={meaningGift}
                onChange={(event) => setMeaningGift(event.target.value)}
                placeholder="Hediye adı yaz. Örn: parfüm, kupa, kolye"
                className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-3 text-sm font-bold outline-none"
              />
            </div>

            <div className="mt-5 min-h-[260px] rounded-[1.5rem] bg-[#fff4ef] p-5">
              <p className="text-sm font-semibold leading-7 text-[#2b1b1b]">
                {meaningText}
              </p>

              {meaningGift.trim() && (
                <div className="mt-5 rounded-2xl bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-pink-600">
                    Kısa yorum
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#6b4a4a]">
                    Bu hediye, doğru kişiye verildiğinde “seni gerçekten düşündüm”
                    hissini güçlendirir.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => copy(meaningText)}
              className="mt-4 w-full rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
            >
              Anlamı Kopyala
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}
