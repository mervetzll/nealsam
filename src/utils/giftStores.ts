import type { Gift } from "@/types/gift";

export type StoreSuggestion = {
  name: string;
  url: string;
  reason: string;
};

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function giftText(gift: Partial<Gift>) {
  return normalize(
    [
      gift.title,
      gift.category,
      gift.subCategory,
      gift.reason,
      gift.note,
      gift.searchQuery,
      gift.recipients?.join(" "),
      gift.interests?.join(" "),
      gift.styles?.join(" "),
      gift.occasions?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(normalize(word)));
}

function searchUrl(site: string, query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${site} ${query}`)}`;
}

export function getStoreSuggestions(gift: Partial<Gift>): StoreSuggestion[] {
  const text = giftText(gift);
  const query = gift.searchQuery || gift.title || "hediye";

  // ÖNEMLİ:
  // "takım / takımı" kelimesi "takı" gibi algılanmasın diye
  // kahve, fincan, ev ürünü gibi kategoriler takıdan önce kontrol edilir.


  if (
    includesAny(text, [
      "tisort",
      "t-shirt",
      "tişört",
      "oversize",
      "polo",
      "sweatshirt",
      "hoodie",
      "gomlek",
      "gömlek",
      "giyim",
      "kazak",
      "pantolon",
    ])
  ) {
    return [
      {
        name: "Mavi",
        url: searchUrl("Mavi", query),
        reason: "Erkek tişört, sweatshirt ve günlük giyim için güçlü ve ulaşılabilir bir marka.",
      },
      {
        name: "Zara",
        url: searchUrl("Zara erkek", query),
        reason: "Daha modern ve şık erkek giyim alternatifleri için uygun.",
      },
      {
        name: "LC Waikiki",
        url: searchUrl("LC Waikiki erkek", query),
        reason: "Daha uygun fiyatlı tişört ve günlük giyim alternatifleri için doğru seçenek.",
      },
    ];
  }

  if (
    includesAny(text, [
      "kahve",
      "fincan",
      "kupa",
      "termos",
      "espresso",
      "filtre kahve",
      "kahve seti",
      "fincan takimi",
      "ev urunu",
      "mutfak",
    ])
  ) {
    return [
      {
        name: "Tchibo",
        url: searchUrl("Tchibo", query),
        reason: "Kahve, fincan, termos ve kahve ekipmanları için daha uygun bir mağaza.",
      },
      {
        name: "Kahve Dünyası",
        url: searchUrl("Kahve Dünyası", query),
        reason: "Kahve temalı hediyeler ve yanında tatlı alternatifleri için uygun.",
      },
      {
        name: "English Home",
        url: searchUrl("English Home", query),
        reason: "Fincan takımı, kupa ve ev sunum ürünleri için daha doğru bir seçenek.",
      },
    ];
  }

  if (
    includesAny(text, [
      "cilt",
      "bakim",
      "serum",
      "tonik",
      "nemlendirici",
      "maske",
      "gunes kremi",
      "vucut losyonu",
    ])
  ) {
    return [
      {
        name: "The Purest Solutions",
        url: searchUrl("The Purest Solutions", query),
        reason: "Cilt bakım ürünleri için daha odaklı ve uygun bir mağaza.",
      },
      {
        name: "Yves Rocher",
        url: searchUrl("Yves Rocher", query),
        reason: "Bakım setleri ve hediye paketleri için güçlü bir seçenek.",
      },
      {
        name: "Dermoeczanem",
        url: searchUrl("Dermoeczanem", query),
        reason: "Dermokozmetik ürünleri karşılaştırmak için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "makyaj",
      "ruj",
      "rimel",
      "maskara",
      "allik",
      "fondoten",
      "parfum",
      "kozmetik",
    ])
  ) {
    return [
      {
        name: "Sephora",
        url: searchUrl("Sephora", query),
        reason: "Makyaj ve parfüm hediyeleri için daha premium bir seçenek.",
      },
      {
        name: "Gratis",
        url: searchUrl("Gratis", query),
        reason: "Daha ulaşılabilir kozmetik ve bakım hediyeleri için uygun.",
      },
      {
        name: "Watsons",
        url: searchUrl("Watsons", query),
        reason: "Kozmetik ve bakım alternatiflerini karşılaştırmak için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "organizer",
      "duzenleyici",
      "saklama",
      "canta ici",
      "taki kutusu",
      "makyaj organizeri",
      "masa duzenleyici",
    ])
  ) {
    return [
      {
        name: "Trendyol",
        url: searchUrl("Trendyol", query),
        reason: "Organizer ve düzenleyici ürünlerde çok seçenek sunduğu için uygun.",
      },
      {
        name: "Hepsiburada",
        url: searchUrl("Hepsiburada", query),
        reason: "Ev düzenleme ürünlerinde fiyat ve yorum karşılaştırması için iyi.",
      },
      {
        name: "Amazon",
        url: searchUrl("Amazon Türkiye", query),
        reason: "Organizer ve saklama ürünlerinde alternatif bulmak için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "kolye",
      "bileklik",
      "kupe",
      "yuzuk",
      "sahmeran",
      "charm",
      "gumus",
      "altin kaplama",
    ])
  ) {
    return [
      {
        name: "So Chic",
        url: searchUrl("So Chic", query),
        reason: "Takı hediyeleri için daha doğrudan bir mağaza.",
      },
      {
        name: "Atasay",
        url: searchUrl("Atasay", query),
        reason: "Daha klasik ve değerli takı hediyeleri için uygun.",
      },
      {
        name: "Trendyol",
        url: searchUrl("Trendyol", query),
        reason: "Farklı bütçelerde takı alternatifi bulmak için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "kulaklik",
      "powerbank",
      "sarj",
      "hoparlor",
      "teknoloji",
      "klavye",
      "mouse",
      "akilli",
      "telefon",
    ])
  ) {
    return [
      {
        name: "MediaMarkt",
        url: searchUrl("MediaMarkt", query),
        reason: "Teknolojik hediyeler için daha doğru bir mağaza.",
      },
      {
        name: "Amazon",
        url: searchUrl("Amazon Türkiye", query),
        reason: "Teknoloji ürünlerinde yorum ve fiyat karşılaştırması için uygun.",
      },
      {
        name: "Hepsiburada",
        url: searchUrl("Hepsiburada", query),
        reason: "Elektronik ürünlerde kampanya ve alternatif bulmak için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "kitap",
      "defter",
      "kalem",
      "ajanda",
      "planner",
      "kirtasiye",
    ])
  ) {
    return [
      {
        name: "D&R",
        url: searchUrl("D&R", query),
        reason: "Kitap, defter ve kırtasiye hediyeleri için daha doğru bir seçenek.",
      },
      {
        name: "Amazon",
        url: searchUrl("Amazon Türkiye", query),
        reason: "Kitap ve kırtasiye ürünlerinde alternatif bulmak için uygun.",
      },
      {
        name: "Trendyol",
        url: searchUrl("Trendyol", query),
        reason: "Farklı fiyatlarda defter, kalem ve setler için uygun.",
      },
    ];
  }

  if (
    includesAny(text, [
      "konser",
      "etkinlik",
      "workshop",
      "deneyim",
      "tiyatro",
      "sinema",
      "bilet",
    ])
  ) {
    return [
      {
        name: "Biletinial",
        url: searchUrl("Biletinial", query),
        reason: "Etkinlik, tiyatro ve konser hediyeleri için uygun.",
      },
      {
        name: "Passo",
        url: searchUrl("Passo", query),
        reason: "Konser ve etkinlik biletleri için iyi bir alternatif.",
      },
      {
        name: "Google",
        url: searchUrl("Google", query),
        reason: "Yakındaki etkinlikleri hızlıca araştırmak için uygun.",
      },
    ];
  }

  return [
    {
      name: "Trendyol",
      url: searchUrl("Trendyol", query),
      reason: "Genel hediye seçenekleri ve fiyat karşılaştırması için uygun.",
    },
    {
      name: "Hepsiburada",
      url: searchUrl("Hepsiburada", query),
      reason: "Ürün yorumları ve alternatifleri görmek için uygun.",
    },
    {
      name: "Amazon",
      url: searchUrl("Amazon Türkiye", query),
      reason: "Farklı ürün seçeneklerini karşılaştırmak için uygun.",
    },
  ];
}

export function getStoreLinksForGift(gift: Partial<Gift>) {
  return getStoreSuggestions(gift).map((store, index) => {
    const giftTitle = gift.title || "Hediye";
    const trackingUrl = `/go?store=${encodeURIComponent(store.name)}&gift=${encodeURIComponent(
      giftTitle
    )}&url=${encodeURIComponent(store.url)}&source=gift-result`;

    return {
      label: store.name,
      href: trackingUrl,
      reason: store.reason,
      note: store.reason,
      priority: index === 0 ? "best" : "normal",
    };
  });
}
