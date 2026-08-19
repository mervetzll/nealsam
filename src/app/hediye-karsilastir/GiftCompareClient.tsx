"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type GiftScore = {
  personality: number;
  usefulness: number;
  emotion: number;
  surprise: number;
  risk: number;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getGiftScore(gift: string): GiftScore {
  const text = normalize(gift);

  let score: GiftScore = {
    personality: 7,
    usefulness: 7,
    emotion: 7,
    surprise: 7,
    risk: 4,
  };

  if (text.includes("parfüm") || text.includes("parfum")) {
    score = {
      personality: 9,
      usefulness: 7,
      emotion: 8,
      surprise: 8,
      risk: 7,
    };
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("takı") || text.includes("taki")) {
    score = {
      personality: 8,
      usefulness: 7,
      emotion: 9,
      surprise: 8,
      risk: 5,
    };
  }

  if (text.includes("kupa") || text.includes("termos")) {
    score = {
      personality: 6,
      usefulness: 9,
      emotion: 6,
      surprise: 5,
      risk: 2,
    };
  }

  if (text.includes("kitap")) {
    score = {
      personality: 8,
      usefulness: 8,
      emotion: 7,
      surprise: 6,
      risk: 4,
    };
  }

  if (text.includes("çiçek") || text.includes("cicek")) {
    score = {
      personality: 6,
      usefulness: 4,
      emotion: 8,
      surprise: 7,
      risk: 3,
    };
  }

  if (text.includes("çikolata") || text.includes("cikolata") || text.includes("tatlı") || text.includes("tatli")) {
    score = {
      personality: 5,
      usefulness: 5,
      emotion: 6,
      surprise: 5,
      risk: 2,
    };
  }

  if (text.includes("mum") || text.includes("dekor")) {
    score = {
      personality: 7,
      usefulness: 7,
      emotion: 7,
      surprise: 6,
      risk: 3,
    };
  }

  if (text.includes("deneyim") || text.includes("bilet") || text.includes("konser") || text.includes("spa")) {
    score = {
      personality: 9,
      usefulness: 6,
      emotion: 9,
      surprise: 9,
      risk: 5,
    };
  }

  if (text.includes("çanta") || text.includes("canta")) {
    score = {
      personality: 7,
      usefulness: 9,
      emotion: 6,
      surprise: 7,
      risk: 6,
    };
  }

  if (text.includes("saat")) {
    score = {
      personality: 8,
      usefulness: 9,
      emotion: 8,
      surprise: 8,
      risk: 5,
    };
  }

  return score;
}

function getMeaning(gift: string) {
  const text = normalize(gift);

  if (!text) return "Hediye adı yazınca anlamı burada görünür.";

  if (text.includes("parfüm") || text.includes("parfum")) {
    return "Parfüm daha kişisel, etkileyici ve akılda kalıcı bir hediye hissi verir. Ama koku zevki kişisel olduğu için risklidir.";
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("takı") || text.includes("taki")) {
    return "Takı daha kalıcı, zarif ve duygusal bir hediye hissi verir. Romantik veya özel bağ kurmak için güçlüdür.";
  }

  if (text.includes("kupa") || text.includes("termos")) {
    return "Kupa veya termos günlük hayatta kullanılabilir, risksiz ve samimi bir hediyedir. Tek başına basit kalabilir ama paketle güçlenir.";
  }

  if (text.includes("kitap")) {
    return "Kitap düşünülmüş ve kişisel bir seçimdir. Karşı tarafın zevkini biliyorsan çok anlamlı olur.";
  }

  if (text.includes("çiçek") || text.includes("cicek")) {
    return "Çiçek zarif, duygusal ve klasik bir hediyedir. Beklenmedik anda verilirse etkisi artar.";
  }

  if (text.includes("deneyim") || text.includes("bilet") || text.includes("konser") || text.includes("spa")) {
    return "Deneyim hediyesi eşya yerine anı bırakır. Daha unutulmaz ve sürprizli hissettirir.";
  }

  return "Bu hediye, doğru kişiye verildiğinde “seni düşündüm” mesajı verir. Kişiye uygunluğu belirleyici olur.";
}

function totalScore(score: GiftScore) {
  return (
    score.personality * 1.2 +
    score.usefulness +
    score.emotion * 1.2 +
    score.surprise -
    score.risk * 0.8
  );
}

function getDecision(giftA: string, giftB: string) {
  if (!giftA.trim() || !giftB.trim()) {
    return "İki hediye adı yazınca burada karar önerisi görünecek.";
  }

  const scoreA = getGiftScore(giftA);
  const scoreB = getGiftScore(giftB);

  const totalA = totalScore(scoreA);
  const totalB = totalScore(scoreB);

  const winner = totalA >= totalB ? giftA : giftB;
  const loser = totalA >= totalB ? giftB : giftA;
  const winnerScore = totalA >= totalB ? scoreA : scoreB;
  const loserScore = totalA >= totalB ? scoreB : scoreA;

  let reason = "";

  if (winnerScore.emotion > loserScore.emotion) {
    reason = "daha duygusal ve anlamlı hissettirdiği için";
  } else if (winnerScore.usefulness > loserScore.usefulness) {
    reason = "günlük kullanım açısından daha güçlü olduğu için";
  } else if (winnerScore.risk < loserScore.risk) {
    reason = "daha risksiz ve güvenli bir seçim olduğu için";
  } else if (winnerScore.surprise > loserScore.surprise) {
    reason = "sürpriz etkisi daha yüksek olduğu için";
  } else {
    reason = "genel olarak daha dengeli bir hediye olduğu için";
  }

  return `${winner} daha mantıklı görünüyor; çünkü ${loser} seçeneğine göre ${reason}.`;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black text-[#2b1b1b]">{label}</p>
        <p className="text-xs font-black text-pink-600">{value}/10</p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-pink-100">
        <div
          className="h-full rounded-full bg-pink-500"
          style={{ width: `${Math.min(Math.max(value, 0), 10) * 10}%` }}
        />
      </div>
    </div>
  );
}

function GiftCard({ title, gift }: { title: string; gift: string }) {
  const score = getGiftScore(gift);

  return (
    <article className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-pink-600">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-black text-[#2b1b1b]">
        {gift.trim() || "Hediye adı"}
      </h2>

      <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
        {getMeaning(gift)}
      </p>

      <div className="mt-5 grid gap-3">
        <ScoreBar label="Kişisellik" value={score.personality} />
        <ScoreBar label="Kullanışlılık" value={score.usefulness} />
        <ScoreBar label="Duygusallık" value={score.emotion} />
        <ScoreBar label="Sürpriz Etkisi" value={score.surprise} />
        <ScoreBar label="Risk" value={score.risk} />
      </div>
    </article>
  );
}

export default function GiftCompareClient() {
  const [giftA, setGiftA] = useState("");
  const [giftB, setGiftB] = useState("");
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("birthday");

  const decision = useMemo(() => getDecision(giftA, giftB), [giftA, giftB]);

  const contextText = useMemo(() => {
    if (context === "birthday") return "Doğum günü için duygusal ve düşünülmüş hissettiren seçimler daha iyi olur.";
    if (context === "anniversary") return "Yıl dönümü için kalıcı, romantik veya anı değeri olan hediyeler daha güçlüdür.";
    if (context === "friend") return "Arkadaş için samimi, eğlenceli ve fazla abartılı olmayan hediyeler daha doğal durur.";
    if (context === "last-minute") return "Son dakika için risksiz, kolay bulunabilir ve yanında notla güçlenen hediyeler daha mantıklıdır.";
    return "Hediye seçerken kişinin tarzı, kullanım alışkanlığı ve hediyenin anlamı birlikte düşünülmeli.";
  }, [context]);

  async function copyDecision() {
    try {
      await navigator.clipboard.writeText(decision);
      alert("Karar metni kopyalandı.");
    } catch {
      alert("Kopyalanamadı.");
    }
  }

  return (
    <main className="min-h-screen bg-[#fff4ef] px-5 py-10 text-[#2b1b1b]">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Hediye Karşılaştırma
          </p>

          <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            İki hediye arasında kaldıysan birlikte karar verelim
          </h1>

          <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a] md:text-base">
            Hediyeleri kişisellik, anlam, risk, kullanışlılık ve sürpriz etkisine göre karşılaştır.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/hediye-bul"
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              Hediye Bul
            </Link>

            <Link
              href="/hediye-araclari"
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
            >
              Hediye Araçları
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={giftA}
              onChange={(event) => setGiftA(event.target.value)}
              placeholder="1. hediye: Örn: parfüm"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={giftB}
              onChange={(event) => setGiftB(event.target.value)}
              placeholder="2. hediye: Örn: kolye"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <input
              value={person}
              onChange={(event) => setPerson(event.target.value)}
              placeholder="Kime alınacak? Örn: sevgilim, annem, arkadaşım"
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            />

            <select
              value={context}
              onChange={(event) => setContext(event.target.value)}
              className="rounded-2xl border border-pink-100 bg-[#fff4ef] px-4 py-4 text-sm font-bold outline-none"
            >
              <option value="birthday">Doğum günü</option>
              <option value="anniversary">Yıl dönümü</option>
              <option value="friend">Arkadaş hediyesi</option>
              <option value="last-minute">Son dakika hediyesi</option>
              <option value="general">Genel</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GiftCard title="Seçenek 1" gift={giftA} />
          <GiftCard title="Seçenek 2" gift={giftB} />
        </div>

        <div className="mt-8 rounded-[2rem] border border-pink-100 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-pink-600">
            Son Karar
          </p>

          <h2 className="mt-3 text-3xl font-black text-[#2b1b1b]">
            Hangisi daha mantıklı?
          </h2>

          <p className="mt-4 rounded-[1.5rem] bg-[#fff4ef] p-5 text-lg font-black leading-8 text-[#2b1b1b]">
            {person.trim() ? `${person} için: ` : ""}
            {decision}
          </p>

          <p className="mt-4 text-sm font-semibold leading-7 text-[#6b4a4a]">
            {contextText}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={copyDecision}
              className="rounded-full bg-pink-600 px-6 py-4 text-sm font-black text-white"
            >
              Kararı Kopyala
            </button>

            <Link
              href={`/deneyim?gift=${encodeURIComponent(giftA || giftB || "hediye")}`}
              className="rounded-full bg-[#2b1b1b] px-6 py-4 text-sm font-black text-white"
            >
              Bu Hediye İçin Not Oluştur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
