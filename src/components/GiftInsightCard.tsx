"use client";

type GiftLike = {
  title?: string;
  name?: string;
  category?: string;
  description?: string;
  reason?: string;
  price?: string;
  budget?: string;
  tags?: string[];
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getGiftTitle(gift: GiftLike) {
  return gift.title || gift.name || "Bu hediye";
}

function getGiftCategory(gift: GiftLike) {
  return normalize(`${gift.category || ""} ${gift.title || ""} ${gift.name || ""} ${gift.description || ""}`);
}

function getScores(gift: GiftLike) {
  const text = getGiftCategory(gift);

  let personality = 7;
  let usefulness = 7;
  let emotion = 7;
  let surprise = 7;
  let risk = 4;

  if (text.includes("parfüm") || text.includes("parfum")) {
    personality = 9;
    usefulness = 7;
    emotion = 8;
    surprise = 8;
    risk = 7;
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("takı") || text.includes("taki")) {
    personality = 8;
    usefulness = 7;
    emotion = 9;
    surprise = 8;
    risk = 5;
  }

  if (text.includes("kupa") || text.includes("termos")) {
    personality = 6;
    usefulness = 9;
    emotion = 6;
    surprise = 5;
    risk = 2;
  }

  if (text.includes("kitap")) {
    personality = 8;
    usefulness = 8;
    emotion = 7;
    surprise = 6;
    risk = 4;
  }

  if (text.includes("çiçek") || text.includes("cicek")) {
    personality = 6;
    usefulness = 4;
    emotion = 8;
    surprise = 7;
    risk = 3;
  }

  if (text.includes("çikolata") || text.includes("cikolata") || text.includes("tatlı") || text.includes("tatli")) {
    personality = 5;
    usefulness = 5;
    emotion = 6;
    surprise = 5;
    risk = 2;
  }

  if (text.includes("mum") || text.includes("dekor")) {
    personality = 7;
    usefulness = 7;
    emotion = 7;
    surprise = 6;
    risk = 3;
  }

  if (text.includes("deneyim") || text.includes("bilet") || text.includes("konser") || text.includes("spa")) {
    personality = 9;
    usefulness = 6;
    emotion = 9;
    surprise = 9;
    risk = 5;
  }

  return {
    personality,
    usefulness,
    emotion,
    surprise,
    risk,
  };
}

function getGiftPersonality(gift: GiftLike) {
  const text = getGiftCategory(gift);

  if (text.includes("parfüm") || text.includes("parfum")) {
    return {
      style: "Özel · Etkileyici · Akılda kalıcı",
      meaning:
        "Parfüm, karşı tarafa “seni özel ve akılda kalıcı görüyorum” mesajı verir.",
      risk:
        "Koku zevki kişisel olduğu için biraz risklidir. Daha güvenli yapmak için kişinin kullandığı koku tarzını bilmek iyi olur.",
      give:
        "Küçük bir notla birlikte ver. Direkt kutusuyla vermek yerine QR özel mesaj kartını içine eklemek hediyeyi daha anlamlı yapar.",
    };
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("takı") || text.includes("taki")) {
    return {
      style: "Kalıcı · Zarif · Duygusal",
      meaning:
        "Takı, “sana kalıcı bir hatıra bırakmak istiyorum” hissi verir.",
      risk:
        "Tarz ve renk tercihi önemli olabilir. Altın, gümüş veya minimal tarz sevip sevmediği düşünülmeli.",
      give:
        "Şık bir kutu ve kısa bir notla ver. Romantik ya da duygusal bir bağ kurmak için ideal.",
    };
  }

  if (text.includes("kupa") || text.includes("termos")) {
    return {
      style: "Samimi · Günlük · Güvenli seçim",
      meaning:
        "Kupa veya termos, “günlük hayatında küçük bir yerim olsun” mesajı verir.",
      risk:
        "Risksiz bir hediyedir ama tek başına fazla basit kalabilir.",
      give:
        "Yanına kahve, çay, çikolata veya küçük bir QR not ekleyerek daha dolu bir paket haline getir.",
    };
  }

  if (text.includes("kitap")) {
    return {
      style: "Düşünülmüş · Kişisel · Anlamlı",
      meaning:
        "Kitap, “senin zevklerini ve düşünce dünyanı önemsiyorum” mesajı verir.",
      risk:
        "Kitap türü yanlış seçilirse kişiye hitap etmeyebilir.",
      give:
        "İlk sayfasına küçük bir not yaz veya QR kart ekle. Neden bu kitabı seçtiğini mutlaka belirt.",
    };
  }

  if (text.includes("çiçek") || text.includes("cicek")) {
    return {
      style: "Zarif · Duygusal · Klasik",
      meaning:
        "Çiçek, “bugün seni güzel hissettirmek istedim” mesajı verir.",
      risk:
        "Tek başına çok klasik kalabilir; özel bir notla güçlendirmek gerekir.",
      give:
        "Beklenmedik bir anda gönder. Yanına kısa ama içten bir mesaj ekle.",
    };
  }

  if (text.includes("çikolata") || text.includes("cikolata") || text.includes("tatlı") || text.includes("tatli")) {
    return {
      style: "Tatlı · Küçük mutluluk · Risksiz",
      meaning:
        "Çikolata veya tatlı, “sana küçük bir mutluluk vermek istedim” mesajı verir.",
      risk:
        "Alerji, diyet veya damak zevki önemli olabilir.",
      give:
        "Tek başına değil; kahve, çiçek veya küçük bir notla birlikte ver.",
    };
  }

  if (text.includes("deneyim") || text.includes("bilet") || text.includes("konser") || text.includes("spa")) {
    return {
      style: "Unutulmaz · Sürprizli · Kişisel",
      meaning:
        "Deneyim hediyesi, “sana sadece eşya değil, hatırlanacak bir an vermek istiyorum” mesajı taşır.",
      risk:
        "Tarih, zaman ve kişinin programı uygun olmalı.",
      give:
        "QR kart veya küçük bir davet notuyla ver. Hediyeyi direkt söylemek yerine ipucu şeklinde açıklamak daha etkileyici olur.",
    };
  }

  return {
    style: "Düşünülmüş · Samimi · Kişiye özel",
    meaning:
      "Bu hediye, karşı tarafa “seni düşündüm ve sana uygun bir seçim yapmak istedim” mesajı verir.",
    risk:
      "Kişinin tarzı, zevkleri ve günlük hayatında kullanıp kullanmayacağı düşünülmeli.",
    give:
      "Kısa bir notla birlikte ver. Hediyeyi neden seçtiğini bir cümleyle açıklarsan çok daha özel hissettirir.",
  };
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

export default function GiftInsightCard({ gift }: { gift: GiftLike }) {
  const title = getGiftTitle(gift);
  const scores = getScores(gift);
  const insight = getGiftPersonality(gift);

  return (
    <div className="mt-5 rounded-[1.5rem] border border-pink-100 bg-[#fff4ef] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-600">
            Hediye Analizi
          </p>

          <h3 className="mt-2 text-xl font-black text-[#2b1b1b]">
            {title} ne anlatır?
          </h3>
        </div>

        <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-pink-700">
          Karakter Kartı
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Bu hediyenin tarzı
        </p>

        <p className="mt-2 text-sm font-black text-[#2b1b1b]">
          {insight.style}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ScoreBar label="Kişisellik" value={scores.personality} />
        <ScoreBar label="Kullanışlılık" value={scores.usefulness} />
        <ScoreBar label="Duygusallık" value={scores.emotion} />
        <ScoreBar label="Sürpriz Etkisi" value={scores.surprise} />
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Anlamı
        </p>

        <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
          {insight.meaning}
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Risk Uyarısı
        </p>

        <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
          Risk seviyesi: <strong>{scores.risk}/10</strong>. {insight.risk}
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4">
        <p className="text-xs font-black uppercase tracking-wide text-pink-600">
          Hediyeyi nasıl vermelisin?
        </p>

        <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
          {insight.give}
        </p>
      </div>
    </div>
  );
}
