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

function getBudgetLevel(gift: Partial<Gift>) {
  const max = gift.priceMax || 0;

  if (max >= 3000) return "luxury";
  if (max >= 1500) return "premium";
  if (max >= 750) return "mid";
  return "budget";
}

export function getStoreSuggestions(gift: Partial<Gift>): StoreSuggestion[] {
  const text = giftText(gift);
  const query = gift.searchQuery || gift.title || "hediye";
  const budget = getBudgetLevel(gift);

  // 1. PARFÜM / KOKU
  // Cilt bakımından önce kontrol edilir. Böylece "Erkek Parfümü" The Purest'e gitmez.
  if (
    includesAny(text, [
      "parfum",
      "koku",
      "edt",
      "edp",
      "erkek parfumu",
      "kadin parfumu",
      "vucut spreyi",
    ])
  ) {
    if (budget === "luxury" || budget === "premium") {
      return [
        {
          name: "Sevil",
          url: searchUrl("Sevil Parfümeri", query),
          reason: "Orijinal parfüm ve marka çeşitliliği için daha doğru bir mağaza.",
        },
        {
          name: "Sephora",
          url: searchUrl("Sephora", query),
          reason: "Premium parfüm ve özel koku seçenekleri için uygun.",
        },
        {
          name: "Boyner",
          url: searchUrl("Boyner parfüm", query),
          reason: "Erkek parfümü ve bilinen markaları karşılaştırmak için mantıklı.",
        },
      ];
    }

    return [
      {
        name: "Sevil",
        url: searchUrl("Sevil Parfümeri", query),
        reason: "Parfüm hediyeleri için doğrudan ve güvenilir bir seçenek.",
      },
      {
        name: "Boyner",
        url: searchUrl("Boyner parfüm", query),
        reason: "Farklı bütçelerde erkek ve kadın parfümlerini karşılaştırmak için uygun.",
      },
      {
        name: "Gratis",
        url: searchUrl("Gratis parfüm", query),
        reason: "Daha ulaşılabilir fiyatlı parfüm ve vücut kokuları için uygun.",
      },
    ];
  }

  // 2. GİYİM / TİŞÖRT / SWEATSHIRT
  if (
    includesAny(text, [
      "tisort",
      "t-shirt",
      "tshirt",
      "sweat",
      "sweatshirt",
      "hoodie",
      "gomlek",
      "polo",
      "kazak",
      "giyim",
      "kiyafet",
      "oversize",
      "basic",
      "moda",
      "erkek giyim",
      "kadin giyim",
    ])
  ) {
    if (budget === "luxury" || includesAny(text, ["luks", "premium", "gant", "lacoste", "tommy", "calvin"])) {
      return [
        {
          name: "Boyner",
          url: searchUrl("Boyner Gant", query),
          reason: "Calvin Klein, Tommy Hilfiger, ve gibi markaları karşılaştırmak için uygun.",
        },
        {
          name: "Calvin Klein",
          url: searchUrl("Türkiye", query),
          reason: "Premium basic tişört ve sweatshirt hediyesi için güçlü bir marka.",
        },
        {
          name: "Gant",
          url: searchUrl("Türkiye", query),
          reason: "Daha klasik ve kaliteli giyim hediyesi için uygun.",
        },
      ];
    }

    if (budget === "premium" || budget === "mid") {
      return [
        {
          name: "Zara",
          url: searchUrl("Zara", query),
          reason: "Modern ve kolay kombinlenebilir giyim hediyeleri için iyi bir seçenek.",
        },
        {
          name: "Mango",
          url: searchUrl("Mango", query),
          reason: "Şık, sade ve kaliteli tişört/sweatshirt hediyeleri için uygun.",
        },
        {
          name: "Boyner",
          url: searchUrl("Boyner", query),
          reason: "Markalı giyim seçeneklerini karşılaştırmak için mantıklı.",
        },
      ];
    }

    return [
      {
        name: "Trendyol",
        url: searchUrl("Trendyol tişört sweatshirt", query),
        reason: "Farklı bütçelerde çok fazla giyim alternatifi sunduğu için uygun.",
      },
      {
        name: "Koton",
        url: searchUrl("Koton", query),
        reason: "Ulaşılabilir fiyatlı tişört, sweatshirt ve günlük giyim için uygun.",
      },
      {
        name: "LC Waikiki",
        url: searchUrl("LC Waikiki", query),
        reason: "Daha ekonomik giyim hediyeleri için uygun.",
      },
    ];
  }

  // 3. AYAKKABI / ÇANTA / AKSESUAR
  if (
    includesAny(text, [
      "ayakkabi",
      "sneaker",
      "spor ayakkabi",
      "canta",
      "cuzdan",
      "kemer",
      "aksesuar",
    ])
  ) {
    return [
      {
        name: "Boyner",
        url: searchUrl("Boyner", query),
        reason: "Ayakkabı, çanta ve aksesuar kategorilerinde markalı seçenekler için uygun.",
      },
      {
        name: "Zara",
        url: searchUrl("Zara", query),
        reason: "Şık aksesuar ve çanta hediyeleri için iyi bir alternatif.",
      },
      {
        name: "Trendyol",
        url: searchUrl("Trendyol", query),
        reason: "Farklı bütçe ve marka alternatifleri için uygun.",
      },
    ];
  }

  // 4. CİLT BAKIMI
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
      "dermokozmetik",
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

  // 5. MAKYAJ / KOZMETİK
  if (
    includesAny(text, [
      "makyaj",
      "ruj",
      "rimel",
      "maskara",
      "allik",
      "fondoten",
      "far paleti",
      "kozmetik",
    ])
  ) {
    return [
      {
        name: "Sephora",
        url: searchUrl("Sephora", query),
        reason: "Makyaj ve premium kozmetik hediyeleri için uygun.",
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

  // 6. TAKI
  // "fincan takımı" gibi kelimeler takı sanılmasın diye sadece gerçek takı kelimeleri.
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
      "taki kutusu",
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
        url: searchUrl("Trendyol takı", query),
        reason: "Farklı bütçelerde takı alternatifi bulmak için uygun.",
      },
    ];
  }

  // 7. KAHVE / FİNCAN / EV SUNUM
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
      "mutfak",
      "sunum",
    ])
  ) {
    return [
      {
        name: "Tchibo",
        url: searchUrl("Tchibo", query),
        reason: "Kahve, fincan, termos ve kahve ekipmanları için uygun.",
      },
      {
        name: "Kahve Dünyası",
        url: searchUrl("Kahve Dünyası", query),
        reason: "Kahve temalı hediyeler ve yanında tatlı alternatifleri için uygun.",
      },
      {
        name: "English Home",
        url: searchUrl("English Home", query),
        reason: "Fincan takımı, kupa ve ev sunum ürünleri için doğru bir seçenek.",
      },
    ];
  }

  // 8. EV DEKORASYONU / ORGANIZER
  if (
    includesAny(text, [
      "organizer",
      "duzenleyici",
      "saklama",
      "ev dekorasyonu",
      "dekoratif",
      "mum",
      "vazo",
      "cerceve",
      "masa duzenleyici",
    ])
  ) {
    return [
      {
        name: "English Home",
        url: searchUrl("English Home", query),
        reason: "Ev dekorasyonu ve küçük yaşam alanı hediyeleri için uygun.",
      },
      {
        name: "Madame Coco",
        url: searchUrl("Madame Coco", query),
        reason: "Dekoratif ve ev hediyeleri için iyi bir alternatif.",
      },
      {
        name: "Trendyol",
        url: searchUrl("Trendyol ev dekorasyon", query),
        reason: "Organizer ve dekoratif ürünlerde çok seçenek sunduğu için uygun.",
      },
    ];
  }

  // 9. TEKNOLOJİ
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

  // 10. KİTAP / KIRTASİYE
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
        reason: "Kitap, defter ve kırtasiye hediyeleri için doğru bir seçenek.",
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

  // 11. DENEYİM / ETKİNLİK
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
