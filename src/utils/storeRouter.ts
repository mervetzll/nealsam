import type { Gift } from "@/types/gift";

export type SmartStorePlatform =
  | "google"
  | "trendyol"
  | "amazon"
  | "hepsiburada"
  | "sephora"
  | "watsons"
  | "gratis"
  | "rossmann"
  | "thepurest"
  | "nars"
  | "maybelline"
  | "decathlon"
  | "nike"
  | "adidas"
  | "sportive"
  | "dr"
  | "kitapyurdu"
  | "bkmkitap"
  | "idefix"
  | "teknosa"
  | "mediamarkt"
  | "vatan"
  | "ikea"
  | "englishhome"
  | "madamecoco"
  | "karaca"
  | "mudo"
  | "ciceksepeti";

export type SmartStoreLink = {
  label: string;
  platform: SmartStorePlatform;
  query: string;
  reason: string;
};

function normalize(value: string) {
  return value.toLocaleLowerCase("tr");
}

function giftText(gift: Gift) {
  return normalize(
    [
      gift.title,
      gift.category,
      gift.subCategory,
      gift.searchQuery,
      ...gift.interests,
      ...gift.styles,
      ...gift.occasions,
    ].join(" ")
  );
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}

function uniqueStores(stores: SmartStoreLink[]) {
  const map = new Map<string, SmartStoreLink>();

  stores.forEach((store) => {
    map.set(store.platform, store);
  });

  return Array.from(map.values()).slice(0, 6);
}

export function makeSmartStoreUrl(platform: SmartStorePlatform, query: string) {
  const safeQuery = query?.trim() || "hediye";
  return `/go?platform=${platform}&q=${encodeURIComponent(safeQuery)}`;
}

export function getSmartStoreLinks(gift: Gift): SmartStoreLink[] {
  const text = giftText(gift);
  const q =
    gift.searchQuery?.trim() ||
    gift.title?.trim() ||
    gift.subCategory?.trim() ||
    gift.category?.trim() ||
    "hediye";

  const stores: SmartStoreLink[] = [];

  const isMakeup = hasAny(text, [
    "makyaj",
    "maskara",
    "rimel",
    "ruj",
    "allık",
    "fondöten",
    "far",
    "concealer",
    "kapatıcı",
    "eyeliner",
    "lip",
  ]);

  const isSkincare = hasAny(text, [
    "cilt",
    "bakım",
    "serum",
    "nemlendirici",
    "temizleyici",
    "tonik",
    "güneş kremi",
    "spf",
    "the purest",
  ]);

  const isPerfume = hasAny(text, [
    "parfüm",
    "koku",
    "body mist",
    "vücut spreyi",
  ]);

  const isSport = hasAny(text, [
    "spor",
    "fitness",
    "pilates",
    "yoga",
    "mat",
    "dambıl",
    "koşu",
    "antrenman",
  ]);

  const isShoe = hasAny(text, [
    "ayakkabı",
    "sneaker",
    "koşu ayakkabısı",
    "spor ayakkabı",
  ]);

  const isBook = hasAny(text, [
    "kitap",
    "roman",
    "defter",
    "okuma",
    "kitap ayracı",
    "kırtasiye",
  ]);

  const isTech = hasAny(text, [
    "teknoloji",
    "kulaklık",
    "bluetooth",
    "powerbank",
    "şarj",
    "klavye",
    "mouse",
    "hoparlör",
    "akıllı",
  ]);

  const isHome = hasAny(text, [
    "ev",
    "dekorasyon",
    "mum",
    "kupa",
    "fincan",
    "kahve",
    "vazo",
    "battaniye",
    "yastık",
    "mutfak",
  ]);

  const isFlower = hasAny(text, [
    "çiçek",
    "orkide",
    "gül",
    "buket",
  ]);

  if (isMakeup) {
    if (hasAny(text, ["allık", "fondöten", "ruj", "far", "kapatıcı", "concealer"])) {
      stores.push({
        label: "Sephora'da ara",
        platform: "sephora",
        query: q,
        reason: "Makyajda premium ve marka çeşitliliği için iyi.",
      });
    }

    if (hasAny(text, ["allık", "ruj", "fondöten"])) {
      stores.push({
        label: "Nars ürünlerine bak",
        platform: "nars",
        query: q,
        reason: "Allık, ruj ve ten ürünlerinde güçlü marka.",
      });
    }

    if (hasAny(text, ["maskara", "rimel", "eyeliner"])) {
      stores.push({
        label: "Maybelline ürünlerine bak",
        platform: "maybelline",
        query: q,
        reason: "Maskara/rimel tarafında güçlü ve ulaşılabilir marka.",
      });
    }

    stores.push(
      {
        label: "Watsons'ta ara",
        platform: "watsons",
        query: q,
        reason: "Makyaj ve kozmetikte yaygın seçenek.",
      },
      {
        label: "Gratis'te ara",
        platform: "gratis",
        query: q,
        reason: "Uygun fiyatlı kozmetik seçenekleri için iyi.",
      }
    );
  }

  if (isSkincare) {
    stores.push(
      {
        label: "The Purest ürünlerine bak",
        platform: "thepurest",
        query: q,
        reason: "Serum ve cilt bakımında marka odaklı arama.",
      },
      {
        label: "Watsons'ta ara",
        platform: "watsons",
        query: q,
        reason: "Cilt bakımında ulaşılabilir seçenekler.",
      },
      {
        label: "Gratis'te ara",
        platform: "gratis",
        query: q,
        reason: "Cilt bakımında uygun fiyatlı alternatifler.",
      },
      {
        label: "Rossmann'da ara",
        platform: "rossmann",
        query: q,
        reason: "Bakım ürünleri için ek mağaza alternatifi.",
      }
    );
  }

  if (isPerfume) {
    stores.push(
      {
        label: "Sephora'da ara",
        platform: "sephora",
        query: q,
        reason: "Parfüm ve premium koku seçenekleri için iyi.",
      },
      {
        label: "Watsons'ta ara",
        platform: "watsons",
        query: q,
        reason: "Body mist ve ulaşılabilir kokular için iyi.",
      },
      {
        label: "Gratis'te ara",
        platform: "gratis",
        query: q,
        reason: "Uygun fiyatlı koku seçenekleri.",
      }
    );
  }

  if (isSport) {
    stores.push(
      {
        label: "Decathlon'da ara",
        platform: "decathlon",
        query: q,
        reason: "Spor ekipmanı ve başlangıç ürünleri için çok uygun.",
      },
      {
        label: "Sportive'de ara",
        platform: "sportive",
        query: q,
        reason: "Spor giyim ve ekipman tarafında alternatif.",
      }
    );
  }

  if (isShoe) {
    stores.push(
      {
        label: "Nike'ta ara",
        platform: "nike",
        query: q,
        reason: "Spor ayakkabı ve koşu ürünlerinde güçlü marka.",
      },
      {
        label: "Adidas'ta ara",
        platform: "adidas",
        query: q,
        reason: "Spor ayakkabı ve günlük sneaker için güçlü marka.",
      },
      {
        label: "Sportive'de ara",
        platform: "sportive",
        query: q,
        reason: "Farklı spor markalarını birlikte görmek için iyi.",
      }
    );
  }

  if (isBook) {
    stores.push(
      {
        label: "D&R'da ara",
        platform: "dr",
        query: q,
        reason: "Kitap, kırtasiye ve hediye ürünleri için uygun.",
      },
      {
        label: "Kitapyurdu'nda ara",
        platform: "kitapyurdu",
        query: q,
        reason: "Kitap araması için güçlü alternatif.",
      },
      {
        label: "BKM Kitap'ta ara",
        platform: "bkmkitap",
        query: q,
        reason: "Kitap fiyat karşılaştırması için iyi alternatif.",
      },
      {
        label: "İdefix'te ara",
        platform: "idefix",
        query: q,
        reason: "Kitap ve kültür ürünleri için ek alternatif.",
      }
    );
  }

  if (isTech) {
    stores.push(
      {
        label: "Teknosa'da ara",
        platform: "teknosa",
        query: q,
        reason: "Teknoloji ürünlerinde bilinen mağaza.",
      },
      {
        label: "MediaMarkt'ta ara",
        platform: "mediamarkt",
        query: q,
        reason: "Elektronik ürünlerde güçlü alternatif.",
      },
      {
        label: "Vatan'da ara",
        platform: "vatan",
        query: q,
        reason: "Bilgisayar ve elektronik tarafında güçlü alternatif.",
      }
    );
  }

  if (isHome) {
    stores.push(
      {
        label: "IKEA'da ara",
        platform: "ikea",
        query: q,
        reason: "Ev ve dekorasyon ürünleri için uygun.",
      },
      {
        label: "English Home'da ara",
        platform: "englishhome",
        query: q,
        reason: "Ev tekstili ve dekoratif hediye için iyi.",
      },
      {
        label: "Madame Coco'da ara",
        platform: "madamecoco",
        query: q,
        reason: "Dekorasyon ve ev hediyeleri için iyi.",
      },
      {
        label: "Karaca'da ara",
        platform: "karaca",
        query: q,
        reason: "Kahve, fincan, mutfak ve ev ürünleri için iyi.",
      },
      {
        label: "Mudo'da ara",
        platform: "mudo",
        query: q,
        reason: "Dekoratif ve şık ev hediyeleri için iyi.",
      }
    );
  }

  if (isFlower) {
    stores.push({
      label: "ÇiçekSepeti'nde ara",
      platform: "ciceksepeti",
      query: q,
      reason: "Çiçek ve hızlı hediye gönderimi için uygun.",
    });
  }

  stores.push(
    {
      label: "Trendyol'da ara",
      platform: "trendyol",
      query: q,
      reason: "Genel fiyat ve ürün çeşitliliği için.",
    },
    {
      label: "Hepsiburada'da ara",
      platform: "hepsiburada",
      query: q,
      reason: "Genel pazaryeri alternatifi.",
    }
  );

  return uniqueStores(stores);
}
