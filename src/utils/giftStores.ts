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

function giftQuery(gift: Gift) {
  return gift.searchQuery || gift.title;
}

function textPool(gift: Gift) {
  return normalize(
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
}

function hasAny(gift: Gift, words: string[]) {
  const haystack = textPool(gift);
  return words.some((word) => haystack.includes(normalize(word)));
}

/**
 * ÖNEMLİ:
 * Burada Google site: araması yok.
 * Mümkün olduğunca sitelerin kendi arama / kategori URL'lerine gidiyoruz.
 * Satma ihtimali düşük olan ürünleri o siteye göndermiyoruz.
 */

export function getStoreLinksForGift(gift: Gift): StoreLink[] {
  const query = giftQuery(gift);
  const encoded = q(query);

  const isSkinCare = hasAny(gift, [
    "cilt bakımı",
    "cilt bakım",
    "bakım seti",
    "serum",
    "tonik",
    "nemlendirici",
    "dermokozmetik",
    "spa",
  ]);

  const isMakeupOrganizer = hasAny(gift, [
    "makyaj organizeri",
    "organizer",
    "takı kutusu",
    "düzenleyici",
    "saklama kutusu",
  ]);

  const isMakeupProduct =
    hasAny(gift, ["makyaj", "kozmetik", "ruj", "maskara", "far", "allık"]) &&
    !isMakeupOrganizer;

  const isPerfume = hasAny(gift, ["parfüm", "koku"]);

  const isJewelry = hasAny(gift, [
    "takı",
    "kolye",
    "bileklik",
    "küpe",
    "yüzük",
  ]);

  const isFashionAccessory = hasAny(gift, [
    "çanta",
    "cüzdan",
    "şal",
    "aksesuar",
  ]);

  const isTechnology = hasAny(gift, [
    "teknoloji",
    "elektronik",
    "kulaklık",
    "mouse",
    "klavye",
    "powerbank",
    "projektör",
    "akıllı bileklik",
    "bluetooth",
  ]);

  const isCoffee = hasAny(gift, [
    "kahve",
    "french press",
    "termos",
    "mug",
    "kupa",
  ]);

  const isBookStationery = hasAny(gift, [
    "kitap",
    "defter",
    "kalem",
    "kırtasiye",
    "ayraç",
  ]);

  const isHomeDecor = hasAny(gift, [
    "ev dekorasyonu",
    "mum",
    "ev kokusu",
    "dekoratif",
    "masa saati",
    "lamba",
    "led",
  ]);

  const isExperience = hasAny(gift, [
    "deneyim",
    "konser",
    "etkinlik",
    "workshop",
    "bilet",
    "akşam yemeği",
    "kahvaltı",
  ]);

  if (isSkinCare) {
    return [
      {
        label: "Yves Rocher",
        href: `https://www.yvesrocher.com.tr/search?text=${encoded}`,
        note: "Cilt bakımı için marka içi arama.",
        priority: "best",
      },
      {
        label: "The Purest",
        href: `https://thepurestsolutions.com/search?q=${encoded}`,
        note: "Serum ve aktif içerikli bakım ürünleri için.",
        priority: "best",
      },
      {
        label: "Dermoeczanem",
        href: `https://www.dermoeczanem.com/arama?q=${encoded}`,
        note: "Dermokozmetik alternatifleri için.",
        priority: "good",
      },
    ];
  }

  if (isMakeupOrganizer) {
    return [
      {
        label: "Trendyol",
        href: `https://www.trendyol.com/sr?q=${encoded}`,
        note: "Organizer gibi ürünler pazar yerlerinde daha kolay bulunur.",
        priority: "best",
      },
      {
        label: "Hepsiburada",
        href: `https://www.hepsiburada.com/ara?q=${encoded}`,
        note: "Makyaj organizeri ve saklama kutuları için.",
        priority: "good",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${encoded}`,
        note: "Yorum ve fiyat karşılaştırması için.",
        priority: "good",
      },
    ];
  }

  if (isMakeupProduct) {
    return [
      {
        label: "Sephora",
        href: `https://www.sephora.com.tr/search?q=${encoded}`,
        note: "Makyaj ürünü ve beauty hediye setleri için.",
        priority: "best",
      },
      {
        label: "Gratis",
        href: `https://www.gratis.com/search?text=${encoded}`,
        note: "Daha ulaşılabilir fiyatlı kozmetik seçenekleri için.",
        priority: "good",
      },
      {
        label: "Watsons",
        href: `https://www.watsons.com.tr/search?text=${encoded}`,
        note: "Kozmetik ve bakım alternatifleri için.",
        priority: "good",
      },
    ];
  }

  if (isPerfume) {
    return [
      {
        label: "Sephora",
        href: `https://www.sephora.com.tr/search?q=${encoded}`,
        note: "Parfüm ve premium koku seçenekleri için.",
        priority: "best",
      },
      {
        label: "Boyner",
        href: `https://www.boyner.com.tr/search?q=${encoded}`,
        note: "Parfüm ve hediye seti alternatifi.",
        priority: "good",
      },
      {
        label: "Yves Rocher",
        href: `https://www.yvesrocher.com.tr/search?text=${encoded}`,
        note: "Daha hafif koku ve bakım setleri için.",
        priority: "good",
      },
    ];
  }

  if (isJewelry) {
    return [
      {
        label: "So Chic",
        href: `https://www.sochic.com.tr/arama?search=${encoded}`,
        note: "Takı için daha hedefli marka araması.",
        priority: "best",
      },
      {
        label: "Atasay",
        href: `https://www.atasay.com/search?q=${encoded}`,
        note: "Daha özel takı seçenekleri için.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${encoded}`,
        note: "Farklı marka karşılaştırması için.",
        priority: "fallback",
      },
    ];
  }

  if (isFashionAccessory) {
    return [
      {
        label: "Trendyol",
        href: `https://www.trendyol.com/sr?q=${encoded}`,
        note: "Çanta, cüzdan, şal gibi ürünlerde bol seçenek için.",
        priority: "best",
      },
      {
        label: "Hepsiburada",
        href: `https://www.hepsiburada.com/ara?q=${encoded}`,
        note: "Fiyat ve stok karşılaştırması için.",
        priority: "good",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${encoded}`,
        note: "Yorum karşılaştırması için.",
        priority: "good",
      },
    ];
  }

  if (isTechnology) {
    return [
      {
        label: "MediaMarkt",
        href: `https://www.mediamarkt.com.tr/tr/search.html?query=${encoded}`,
        note: "Teknoloji ürünleri için daha güvenli arama.",
        priority: "best",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${encoded}`,
        note: "Yorum ve fiyat karşılaştırması için.",
        priority: "good",
      },
      {
        label: "Hepsiburada",
        href: `https://www.hepsiburada.com/ara?q=${encoded}`,
        note: "Alternatif fiyat ve stok kontrolü için.",
        priority: "good",
      },
    ];
  }

  if (isCoffee) {
    return [
      {
        label: "Kahve Dünyası",
        href: `https://www.kahvedunyasi.com/arama?q=${encoded}`,
        note: "Kahve ve tatlı hediye setleri için.",
        priority: "best",
      },
      {
        label: "Tchibo",
        href: `https://www.tchibo.com.tr/search?text=${encoded}`,
        note: "Kahve ekipmanı ve günlük kullanım ürünleri için.",
        priority: "good",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${encoded}`,
        note: "Ekipman ve yorum karşılaştırması için.",
        priority: "fallback",
      },
    ];
  }

  if (isBookStationery) {
    return [
      {
        label: "D&R",
        href: `https://www.dr.com.tr/search?q=${encoded}`,
        note: "Kitap ve kırtasiye için daha doğru arama.",
        priority: "best",
      },
      {
        label: "Amazon",
        href: `https://www.amazon.com.tr/s?k=${encoded}`,
        note: "Kitap ve kırtasiye alternatifleri için.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${encoded}`,
        note: "Genel karşılaştırma için.",
        priority: "fallback",
      },
    ];
  }

  if (isHomeDecor) {
    return [
      {
        label: "English Home",
        href: `https://www.englishhome.com/search?q=${encoded}`,
        note: "Ev hediyeleri için daha uygun arama.",
        priority: "best",
      },
      {
        label: "Madame Coco",
        href: `https://www.madamecoco.com/search?q=${encoded}`,
        note: "Ev dekorasyon ve koku ürünleri için.",
        priority: "good",
      },
      {
        label: "Trendyol",
        href: `https://www.trendyol.com/sr?q=${encoded}`,
        note: "Daha fazla seçenek için.",
        priority: "fallback",
      },
    ];
  }

  if (isExperience) {
    return [
      {
        label: "Biletinial",
        href: `https://www.biletinial.com/tr-tr/arama?search=${encoded}`,
        note: "Etkinlik ve deneyim hediyeleri için.",
        priority: "best",
      },
      {
        label: "Passo",
        href: `https://www.passo.com.tr/tr/arama?q=${encoded}`,
        note: "Konser ve etkinlik bileti için.",
        priority: "good",
      },
      {
        label: "Google",
        href: `https://www.google.com/search?q=${encoded}`,
        note: "Workshop ve deneyim karşılaştırması için.",
        priority: "fallback",
      },
    ];
  }

  return [
    {
      label: "Google",
      href: `https://www.google.com/search?q=${encoded}`,
      note: "Genel arama sonucu.",
      priority: "fallback",
    },
    {
      label: "Amazon",
      href: `https://www.amazon.com.tr/s?k=${encoded}`,
      note: "Yorum ve fiyat karşılaştırması için.",
      priority: "fallback",
    },
    {
      label: "Hepsiburada",
      href: `https://www.hepsiburada.com/ara?q=${encoded}`,
      note: "Alternatif pazar yeri.",
      priority: "fallback",
    },
  ];
}
