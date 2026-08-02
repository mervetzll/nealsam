import type { Gift } from "@/types/gift";

export type StoreLink = {
  label: string;
  href: string;
  note?: string;
  priority?: "best" | "good" | "fallback";
};

function normalize(text: string = "") {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .trim();
}

function q(text: string) {
  return encodeURIComponent(text);
}

function siteSearch(domain: string, query: string) {
  return `https://www.google.com/search?q=${q(`site:${domain} ${query}`)}`;
}

function giftQuery(gift: Gift) {
  return gift.searchQuery || gift.title;
}

function hasAny(gift: Gift, words: string[]) {
  const haystack = normalize(
    [
      gift.title,
      gift.category,
      gift.subCategory,
      gift.reason,
      gift.note,
      gift.searchQuery,
      ...gift.interests,
      ...gift.styles,
    ].join(" ")
  );

  return words.some((word) => haystack.includes(normalize(word)));
}

export function getStoreLinksForGift(gift: Gift): StoreLink[] {
  const query = giftQuery(gift);

  if (hasAny(gift, ["cilt bakımı", "bakım seti", "spa", "dermokozmetik"])) {
    return [
      {
        label: "Yves Rocher",
        href: siteSearch("www.yvesrocher.com.tr", query),
        note: "Cilt bakımı için daha markalı ve özenli seçenekler.",
        priority: "best",
      },
      {
        label: "The Purest",
        href: siteSearch("thepurestsolutions.com", query),
        note: "Aktif içerik ve serum odaklı alternatif.",
        priority: "best",
      },
      {
        label: "Dermoeczanem",
        href: `https://www.dermoeczanem.com/arama?q=${q(query)}`,
        note: "Dermokozmetik ürünler için iyi alternatif.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  if (hasAny(gift, ["makyaj", "kozmetik", "ruj", "maskara", "organizer"])) {
    return [
      {
        label: "Sephora",
        href: siteSearch("www.sephora.com.tr", query),
        note: "Makyaj ve güzellik ürünleri için premium seçenekler.",
        priority: "best",
      },
      {
        label: "Gratis",
        href: siteSearch("www.gratis.com", query),
        note: "Daha ulaşılabilir fiyatlı alternatifler.",
        priority: "good",
      },
      {
        label: "Watsons",
        href: siteSearch("www.watsons.com.tr", query),
        note: "Kozmetik ve bakım için yaygın seçenekler.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  if (hasAny(gift, ["parfüm", "koku"])) {
    return [
      {
        label: "Sephora",
        href: siteSearch("www.sephora.com.tr", query),
        note: "Parfümde marka ve koku seçimi için daha iyi.",
        priority: "best",
      },
      {
        label: "Boyner",
        href: siteSearch("www.boyner.com.tr", query),
        note: "Parfüm ve hediye seti alternatifi.",
        priority: "good",
      },
      {
        label: "Yves Rocher",
        href: siteSearch("www.yvesrocher.com.tr", query),
        note: "Daha hafif koku ve bakım setleri.",
        priority: "good",
      },
    ];
  }

  if (hasAny(gift, ["takı", "kolye", "bileklik", "küpe", "saat"])) {
    return [
      {
        label: "So Chic",
        href: siteSearch("www.sochic.com.tr", query),
        note: "Takı için daha hedefli öneri.",
        priority: "best",
      },
      {
        label: "Atasay",
        href: siteSearch("www.atasay.com", query),
        note: "Daha özel ve değerli takı alternatifi.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  if (hasAny(gift, ["teknoloji", "elektronik", "kulaklık", "mouse", "klavye", "powerbank", "projektör", "akıllı bileklik"])) {
    return [
      {
        label: "MediaMarkt",
        href: siteSearch("www.mediamarkt.com.tr", query),
        note: "Teknoloji ürünlerinde daha güvenli arama.",
        priority: "best",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${q(query)}`,
        note: "Yorum ve fiyat karşılaştırması için iyi.",
        priority: "good",
      },
      {
        label: "Hepsiburada",
        href: `https://www.hepsiburada.com/ara?q=${q(query)}`,
        note: "Alternatif fiyat ve stok kontrolü.",
        priority: "good",
      },
    ];
  }

  if (hasAny(gift, ["kahve", "french press", "termos", "mug", "kupa"])) {
    return [
      {
        label: "Kahve Dünyası",
        href: siteSearch("www.kahvedunyasi.com", query),
        note: "Kahve ve tatlı hediye setleri için.",
        priority: "best",
      },
      {
        label: "Tchibo",
        href: siteSearch("www.tchibo.com.tr", query),
        note: "Kahve ekipmanı ve günlük kullanım ürünleri.",
        priority: "good",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  if (hasAny(gift, ["kitap", "defter", "kalem", "kırtasiye", "ayraç"])) {
    return [
      {
        label: "D&R",
        href: siteSearch("www.dr.com.tr", query),
        note: "Kitap ve kırtasiye için daha doğru.",
        priority: "best",
      },
      {
        label: "Pandora Kitap",
        href: siteSearch("www.pandora.com.tr", query),
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  if (hasAny(gift, ["ev dekorasyonu", "mum", "ev kokusu", "dekoratif", "masa saati", "lamba"])) {
    return [
      {
        label: "English Home",
        href: siteSearch("www.englishhome.com", query),
        note: "Ev hediyeleri için daha uygun.",
        priority: "best",
      },
      {
        label: "Madame Coco",
        href: siteSearch("www.madamecoco.com", query),
        priority: "good",
      },
      {
        label: "Zara Home",
        href: siteSearch("www.zarahome.com", query),
        priority: "good",
      },
    ];
  }

  if (hasAny(gift, ["deneyim", "konser", "etkinlik", "workshop", "bilet", "akşam yemeği", "kahvaltı"])) {
    return [
      {
        label: "Biletinial",
        href: siteSearch("www.biletinial.com", query),
        note: "Etkinlik ve deneyim hediyeleri için.",
        priority: "best",
      },
      {
        label: "Passo",
        href: siteSearch("www.passo.com.tr", query),
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${q(query)}`,
        priority: "fallback",
      },
    ];
  }

  return [
    {
      label: "Google",
      href: `https://www.google.com/search?q=${q(query)}`,
      note: "Genel arama sonucu.",
      priority: "fallback",
    },
    {
      label: "Amazon",
      href: `https://www.amazon.com.tr/s?k=${q(query)}`,
      note: "Fiyat ve yorum karşılaştırması.",
      priority: "fallback",
    },
    {
      label: "Hepsiburada",
      href: `https://www.hepsiburada.com/ara?q=${q(query)}`,
      note: "Alternatif pazar yeri.",
      priority: "fallback",
    },
  ];
}
