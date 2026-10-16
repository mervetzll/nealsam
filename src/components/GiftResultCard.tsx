"use client";

import Link from "next/link";
import GiftStoreLinks from "@/components/GiftStoreLinks";
import { cleanGiftTitle, getRawGiftTitle } from "@/lib/giftPresentation";

type Gift = {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  sub_category?: string;
  price?: string;
  budget?: string;
  price_min?: number;
  price_max?: number;
  description?: string;
  reason?: string;
  note?: string;
  search_query?: string;
  tags?: string[];
  recipients?: string[];
  interests?: string[];
  styles?: string[];
  occasions?: string[];
  urgency?: string[];
  risk_level?: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function arr(value?: string[]) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function getPriceText(gift: Gift) {
  if (gift.price) return gift.price;
  if (gift.budget) return gift.budget;

  const min = Number(gift.price_min ?? 0);
  const max = Number(gift.price_max ?? 0);

  if (min > 0 && max > 0 && max < 999999) return `${min}–${max} TL`;
  if (min > 0) return `${min} TL+`;

  return "Bütçe esnek";
}

function getRiskInfo(gift: Gift) {
  const text = normalize(
    `${gift.title || ""} ${gift.category || ""} ${gift.description || ""} ${gift.reason || ""} ${(gift.tags || []).join(" ")}`
  );

  const level = gift.risk_level || "";

  if (level === "high") {
    return {
      label: "Yüksek risk",
      text: "Zevk, beden, renk veya kişisel tercih gerektirebilir. Kişiyi iyi tanıyorsan tercih edilmeli.",
    };
  }

  if (
    level === "medium" ||
    text.includes("parfum") ||
    text.includes("pijama") ||
    text.includes("giyim") ||
    text.includes("canta") ||
    text.includes("yuzuk")
  ) {
    return {
      label: "Orta risk",
      text: "Kişisel zevk, beden veya koku tercihi etkili olabilir. Fiş/değişim seçeneği varsa daha güvenli olur.",
    };
  }

  return {
    label: "Düşük risk",
    text: "Günlük kullanıma uygun ve genel zevklere daha kolay uyum sağlayan güvenli bir seçim.",
  };
}

function getWhyText(gift: Gift) {
  if (gift.reason) return gift.reason;
  if (gift.description) return gift.description;

  return "Seçtiğin kişi, tarz ve bütçe bilgilerine göre uygun bir hediye alternatifi olduğu için önerildi.";
}

function getAddOns(gift: Gift) {
  const text = normalize(
    `${gift.title || ""} ${gift.category || ""} ${gift.search_query || ""} ${(gift.tags || []).join(" ")}`
  );

  if (text.includes("pijama") || text.includes("sabahlik") || text.includes("battaniye")) {
    return ["Uyku maskesi", "Mum", "Çorap seti", "QR özel not"];
  }

  if (text.includes("body mist") || text.includes("bakim") || text.includes("krem") || text.includes("spa")) {
    return ["El kremi", "Dudak balmı", "Mini çikolata", "Küçük bakım kutusu"];
  }

  if (text.includes("kahve") || text.includes("kupa") || text.includes("termos") || text.includes("french press")) {
    return ["Filtre kahve", "Çikolata", "Küçük not kartı", "Kraft kutu"];
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("kupe") || text.includes("yuzuk") || text.includes("saat")) {
    return ["Çiçek", "Küçük takı kutusu", "QR gizli mesaj", "Romantik not"];
  }

  if (text.includes("kitap") || text.includes("defter") || text.includes("hobi")) {
    return ["Ayraç", "Kalem", "Not kartı", "Küçük atıştırmalık"];
  }

  if (text.includes("kulaklik") || text.includes("powerbank") || text.includes("hoparlor")) {
    return ["Telefon standı", "Kablo düzenleyici", "Kılıf", "Küçük not"];
  }

  return ["Küçük çikolata", "Hediye notu", "Kraft kutu", "QR özel mesaj"];
}

function getPresentationIdea(gift: Gift) {
  const text = normalize(
    `${gift.title || ""} ${gift.category || ""} ${gift.search_query || ""} ${(gift.tags || []).join(" ")}`
  );

  if (gift.note) return gift.note;

  if (text.includes("pijama") || text.includes("cozy")) {
    return "Yumuşak tonlarda bir kutuya yerleştir. Yanına mum, uyku maskesi veya küçük bir not ekleyerek cozy bir paket haline getir.";
  }

  if (text.includes("bakim") || text.includes("body mist") || text.includes("spa")) {
    return "Bakım ürünlerini küçük bir kutuda birlikte sun. İçine ince kağıt, mini çikolata ve kısa bir not ekle.";
  }

  if (text.includes("kahve") || text.includes("kupa")) {
    return "Kupayı merkeze koy, kahveyi ve çikolatayı yanına yerleştir. QR notu kupanın içine koymak tatlı durur.";
  }

  if (text.includes("kolye") || text.includes("bileklik") || text.includes("tak")) {
    return "Küçük bir takı kutusu kullan. Kutunun içine kısa bir not veya QR gizli mesaj ekleyerek daha özel hale getir.";
  }

  return "Sade bir paketleme, kısa bir not ve küçük tamamlayıcı ürünle daha düşünülmüş bir hediye gibi görünür.";
}

function getSuitableFor(gift: Gift) {
  const recipients = arr(gift.recipients);

  if (recipients.length > 0) {
    return recipients.slice(0, 4);
  }

  const text = normalize(
    `${gift.title || ""} ${gift.category || ""} ${(gift.tags || []).join(" ")}`
  );

  if (text.includes("erkek") || text.includes("tisort") || text.includes("kemer")) {
    return ["Erkek arkadaş", "Baba", "Kardeş", "Arkadaş"];
  }

  if (text.includes("pijama") || text.includes("bakim") || text.includes("body mist")) {
    return ["Sevgili", "Anne", "Yakın arkadaş", "Kardeş"];
  }

  return ["Arkadaş", "Sevgili", "Aile", "Yakın çevre"];
}

export default function GiftResultCard({
  gift,
  score,
  budgetNote,
  matchReasons = [],
}: {
  gift: Gift;
  score: number;
  budgetNote?: string;
  matchReasons?: string[];
}) {
  const title = cleanGiftTitle(getRawGiftTitle(gift));
  const risk = getRiskInfo(gift);
  const suitableFor = getSuitableFor(gift);
  const addOns = getAddOns(gift);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="bg-gradient-to-br from-pink-50 to-[#fff4ef] p-6">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-pink-700 shadow-sm">
            {score >= 90 ? "Tercihlerine yakın" : "Değerlendirebileceğin fikir"}
          </span>


          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-[#6b4a4a] shadow-sm">
            {risk.label}
          </span>
        </div>

        <h3 className="mt-5 text-4xl font-black tracking-tight text-[#2b1b1b]">
          {title}
        </h3>

        <p className="mt-3 text-lg font-black text-pink-600">
          {gift.category || "Genel"} · {getPriceText(gift)}
        </p>

        {budgetNote && <p className="mt-3 text-sm font-semibold text-[#6b4a4a]">{budgetNote}</p>}

        <p className="mt-5 max-w-3xl text-sm font-semibold leading-7 text-[#6b4a4a]">
          {gift.description || getWhyText(gift)}
        </p>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="rounded-2xl bg-[#fff4ef] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Neden önerildi?
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
            {matchReasons.length ? matchReasons.join(". ") + "." : "Farklı bir alternatif olarak değerlendirebilirsin; kişisel zevkini ve ürün detaylarını kontrol et."}
          </p>
        </div>

        <div className="rounded-2xl bg-[#fff4ef] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Risk seviyesi
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
            <span className="font-black text-[#2b1b1b]">{risk.label}:</span> {risk.text}
          </p>
        </div>

        <div className="rounded-2xl bg-[#fff4ef] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Kimler için uygun?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {suitableFor.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#6b4a4a]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff4ef] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Yanına ne eklenir?
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {addOns.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#6b4a4a]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#fff4ef] p-5 md:col-span-2">
          <p className="text-xs font-black uppercase tracking-wide text-pink-600">
            Nasıl sunulur?
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-[#6b4a4a]">
            {getPresentationIdea(gift)}
          </p>
        </div>

        <div className="md:col-span-2">
          <GiftStoreLinks gift={gift} />
        </div>

        <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
          <Link
            href={`/deneyim?gift=${encodeURIComponent(title)}`}
            className="flex items-center justify-center rounded-full bg-pink-600 px-5 py-4 text-sm font-black text-white"
          >
            Özel Not Oluştur
          </Link>

          <Link
            href={`/hediye-paketi?gift=${encodeURIComponent(title)}&price=${encodeURIComponent(getPriceText(gift))}`}
            className="flex items-center justify-center rounded-full bg-[#2b1b1b] px-5 py-4 text-sm font-black text-white"
          >
            Pakete Çevir
          </Link>

          <Link
            href={`/hediye-karsilastir?gift=${encodeURIComponent(title)}`}
            className="flex items-center justify-center rounded-full border border-pink-200 bg-white px-5 py-4 text-sm font-black text-pink-700"
          >
            Karşılaştır
          </Link>
        </div>
      </div>
    </article>
  );
}
