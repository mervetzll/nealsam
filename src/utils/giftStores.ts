export type StoreSuggestion = {
  name: string;
  url: string;
  reason: string;
};

function q(query: string) {
  return encodeURIComponent(query);
}

export function getStoreSuggestions(gift: {
  title: string;
  category: string;
  subCategory?: string;
  searchQuery?: string;
}): StoreSuggestion[] {
  const text = `${gift.title} ${gift.category} ${gift.subCategory || ""} ${
    gift.searchQuery || ""
  }`.toLowerCase();

  const query = gift.searchQuery || gift.title;

  if (
    text.includes("cilt") ||
    text.includes("bakım") ||
    text.includes("serum") ||
    text.includes("tonik") ||
    text.includes("nemlendirici")
  ) {
    return [
      {
        name: "The Purest",
        url: `https://thepurestsolutions.com/search?q=${q(query)}`,
        reason: "Cilt bakım ürünleri için daha odaklı bir marka.",
      },
      {
        name: "Yves Rocher",
        url: `https://www.yvesrocher.com.tr/search?q=${q(query)}`,
        reason: "Bakım setleri ve kişisel bakım hediyeleri için uygun.",
      },
      {
        name: "Dermoeczanem",
        url: `https://www.dermoeczanem.com/arama?q=${q(query)}`,
        reason: "Dermokozmetik ve bakım ürünlerini karşılaştırmak için iyi.",
      },
    ];
  }

  if (
    text.includes("makyaj") &&
    !text.includes("organizer") &&
    !text.includes("çantası")
  ) {
    return [
      {
        name: "Sephora",
        url: `https://www.sephora.com.tr/search?q=${q(query)}`,
        reason: "Makyaj ve premium güzellik ürünleri için güçlü seçenek.",
      },
      {
        name: "Gratis",
        url: `https://www.gratis.com/arama?q=${q(query)}`,
        reason: "Uygun fiyatlı makyaj ürünleri için bakılabilir.",
      },
      {
        name: "Watsons",
        url: `https://www.watsons.com.tr/search?text=${q(query)}`,
        reason: "Makyaj ve kişisel bakım ürünleri için alternatif.",
      },
    ];
  }

  if (
    text.includes("organizer") ||
    text.includes("takı kutusu") ||
    text.includes("düzenleyici") ||
    text.includes("saklama")
  ) {
    return [
      {
        name: "Trendyol",
        url: `https://www.trendyol.com/sr?q=${q(query)}`,
        reason: "Organizer ve düzenleyici ürünlerde çok seçenek çıkar.",
      },
      {
        name: "Hepsiburada",
        url: `https://www.hepsiburada.com/ara?q=${q(query)}`,
        reason: "Fiyat ve yorum karşılaştırması için iyi.",
      },
      {
        name: "Amazon",
        url: `https://www.amazon.com.tr/s?k=${q(query)}`,
        reason: "Organizer ve pratik ürünlerde alternatif bulmak kolay.",
      },
    ];
  }

  if (
    text.includes("takı") ||
    text.includes("kolye") ||
    text.includes("bileklik") ||
    text.includes("küpe") ||
    text.includes("yüzük")
  ) {
    return [
      {
        name: "So Chic",
        url: `https://www.sochic.com.tr/arama-sonuc?search=${q(query)}`,
        reason: "Takı hediyeleri için daha doğrudan bir mağaza.",
      },
      {
        name: "Atasay",
        url: `https://www.atasay.com/search?q=${q(query)}`,
        reason: "Daha klasik ve özel takı seçenekleri için uygun.",
      },
      {
        name: "Trendyol",
        url: `https://www.trendyol.com/sr?q=${q(query)}`,
        reason: "Farklı fiyat aralıklarını görmek için iyi.",
      },
    ];
  }

  if (
    text.includes("teknoloji") ||
    text.includes("şarj") ||
    text.includes("kulaklık") ||
    text.includes("hoparlör") ||
    text.includes("powerbank")
  ) {
    return [
      {
        name: "MediaMarkt",
        url: `https://www.mediamarkt.com.tr/tr/search.html?query=${q(query)}`,
        reason: "Elektronik ürünlerde güvenilir mağaza seçeneği.",
      },
      {
        name: "Amazon",
        url: `https://www.amazon.com.tr/s?k=${q(query)}`,
        reason: "Teknoloji ürünlerinde yorum ve fiyat karşılaştırması kolay.",
      },
      {
        name: "Hepsiburada",
        url: `https://www.hepsiburada.com/ara?q=${q(query)}`,
        reason: "Elektronik hediyelerde geniş ürün havuzu var.",
      },
    ];
  }

  if (text.includes("kahve") || text.includes("fincan") || text.includes("termos")) {
    return [
      {
        name: "Kahve Dünyası",
        url: `https://www.kahvedunyasi.com/arama?q=${q(query)}`,
        reason: "Kahve ve hediye paketleri için doğrudan uygun.",
      },
      {
        name: "Tchibo",
        url: `https://www.tchibo.com.tr/search?query=${q(query)}`,
        reason: "Kahve ekipmanı ve kupa/termos ürünleri için iyi.",
      },
      {
        name: "Amazon",
        url: `https://www.amazon.com.tr/s?k=${q(query)}`,
        reason: "French press, termos ve kahve ekipmanında bol seçenek var.",
      },
    ];
  }

  if (text.includes("kitap") || text.includes("defter") || text.includes("kalem")) {
    return [
      {
        name: "D&R",
        url: `https://www.dr.com.tr/search?q=${q(query)}`,
        reason: "Kitap ve kırtasiye hediyeleri için en uygun yerlerden biri.",
      },
      {
        name: "Amazon",
        url: `https://www.amazon.com.tr/s?k=${q(query)}`,
        reason: "Kitap ve aksesuar fiyatlarını karşılaştırmak için iyi.",
      },
      {
        name: "Trendyol",
        url: `https://www.trendyol.com/sr?q=${q(query)}`,
        reason: "Defter, kalem ve hediye setlerinde çok seçenek çıkar.",
      },
    ];
  }

  if (
    text.includes("konser") ||
    text.includes("etkinlik") ||
    text.includes("workshop") ||
    text.includes("deneyim")
  ) {
    return [
      {
        name: "Biletinial",
        url: `https://www.biletinial.com/tr-tr/arama?query=${q(query)}`,
        reason: "Konser, tiyatro ve etkinlik hediyeleri için uygun.",
      },
      {
        name: "Passo",
        url: `https://www.passo.com.tr/tr/arama?q=${q(query)}`,
        reason: "Konser ve etkinlik bileti aramak için bakılabilir.",
      },
      {
        name: "Google",
        url: `https://www.google.com/search?q=${q(query)}`,
        reason: "Şehre ve tarihe göre deneyim seçeneklerini bulmak için iyi.",
      },
    ];
  }

  return [
    {
      name: "Trendyol",
      url: `https://www.trendyol.com/sr?q=${q(query)}`,
      reason: "Genel hediye aramaları için geniş ürün seçeneği sunar.",
    },
    {
      name: "Hepsiburada",
      url: `https://www.hepsiburada.com/ara?q=${q(query)}`,
      reason: "Fiyat ve yorum karşılaştırması için iyi bir alternatif.",
    },
    {
      name: "Amazon",
      url: `https://www.amazon.com.tr/s?k=${q(query)}`,
      reason: "Hızlı teslimat ve farklı satıcı seçenekleri için bakılabilir.",
    },
  ];
}

export function getStoreLinksForGift(gift: {
  title: string;
  category: string;
  subCategory?: string;
  searchQuery?: string;
}) {
  return getStoreSuggestions(gift).map((store, index) => ({
    label: store.name,
    href: store.url,
    reason: store.reason,
    note: store.reason,
    priority: index === 0 ? "best" : "normal",
  }));
}
