export type GiftLike = {
  title?: string;
  name?: string;
  category?: string;
  description?: string;
  reason?: string;
  tags?: string[];
};

type StoreLink = {
  label: string;
  store: string;
  href: string;
};

function normalizeTurkish(value: string) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

function enc(value: string) {
  return encodeURIComponent(value);
}

export function getRawGiftTitle(gift: GiftLike) {
  return gift.title || gift.name || "Hediye";
}

export function cleanGiftTitle(value?: string) {
  if (!value) return "Hediye";

  let title = value.trim();

  const removePatterns = [
    /victoria'?s\s+secret\s*/gi,
    /calvin\s+klein\s*/gi,
    /tommy\s+hilfiger\s*/gi,
    /jack\s*&?\s*jones\s*/gi,
    /ralph\s+lauren\s*/gi,
    /polo\s+ralph\s+lauren\s*/gi,
    /lacoste\s*/gi,
    /penti\s*/gi,
    /dagi\s*/gi,
    /zara\s+home\s*/gi,
    /zara\s*/gi,
    /mango\s*/gi,
    /bershka\s*/gi,
    /pull\s*&?\s*bear\s*/gi,
    /stradivarius\s*/gi,
    /h&m\s*/gi,
    /hm\s*/gi,
    /massimo\s+dutti\s*/gi,
    /madame\s+coco\s*/gi,
    /english\s+home\s*/gi,
    /karaca\s+home\s*/gi,
    /karaca\s*/gi,
    /ikea\s*/gi,
    /mudo\s*/gi,
    /gratis\s*/gi,
    /watsons\s*/gi,
    /sephora\s*/gi,
    /yves\s+rocher\s*/gi,
    /the\s+body\s+shop\s*/gi,
    /bath\s*&?\s*body\s+works\s*/gi,
    /rossmann\s*/gi,
    /boyner\s*/gi,
    /beymen\s*/gi,
    /so\s+chic\s*/gi,
    /atasay\s*/gi,
    /altınbaş\s*/gi,
    /altinbas\s*/gi,
    /swarovski\s*/gi,
    /accessorize\s*/gi,
    /starbucks\s*/gi,
    /tchibo\s*/gi,
    /kahve\s+dünyası\s*/gi,
    /kahve\s+dunyasi\s*/gi,
    /d&r\s*/gi,
    /remzi\s+kitabevi\s*/gi,
    /amazon\s*/gi,
    /teknosa\s*/gi,
    /mediamarkt\s*/gi,
    /damat\s*/gi,
    /kiğılı\s*/gi,
    /kigili\s*/gi,
    /mavi\s*/gi,
    /decathlon\s*/gi,
    /premium\s*/gi,
    /marka\s*/gi,
    /tarz[ıi]\s*/gi,
  ];

  for (const pattern of removePatterns) {
    title = title.replace(pattern, "");
  }

  title = title
    .replace(/\s+/g, " ")
    .replace(/^\-+|\-+$/g, "")
    .trim();

  if (!title) return "Hediye";

  return title.charAt(0).toLocaleUpperCase("tr-TR") + title.slice(1);
}

export function inferGiftSearchQuery(gift: GiftLike) {
  const raw = `${gift.title || ""} ${gift.name || ""} ${gift.category || ""} ${gift.description || ""} ${(gift.tags || []).join(" ")}`;
  const text = normalizeTurkish(raw);

  if (text.includes("saten pijama")) return "saten pijama";
  if (text.includes("pijama")) return "pijama takımı";
  if (text.includes("pelus sabahlik")) return "peluş sabahlık";
  if (text.includes("sabahlik")) return "sabahlık";
  if (text.includes("ev terligi")) return "ev terliği";
  if (text.includes("uyku maskesi")) return "uyku maskesi";
  if (text.includes("corap")) return "çorap seti";
  if (text.includes("battaniye")) return "yumuşak battaniye";
  if (text.includes("termal iclik")) return "termal içlik";

  if (text.includes("vucut spreyi")) return "vücut spreyi";
  if (text.includes("body mist")) return "body mist";
  if (text.includes("el kremi")) return "el kremi seti";
  if (text.includes("dus jeli")) return "duş jeli seti";
  if (text.includes("vucut losyonu")) return "vücut losyonu";
  if (text.includes("cilt bakim")) return "cilt bakım seti";
  if (text.includes("dudak balmi")) return "dudak balmı";
  if (text.includes("yuz maskesi")) return "yüz maskesi seti";
  if (text.includes("sac bakim yagi")) return "saç bakım yağı";
  if (text.includes("sac maskesi")) return "saç maskesi";
  if (text.includes("banyo tuzu")) return "banyo tuzu";
  if (text.includes("aromaterapi")) return "aromaterapi seti";
  if (text.includes("spa")) return "spa seti";

  if (text.includes("mini parfum")) return "mini parfüm seti";
  if (text.includes("parfum discovery")) return "parfüm discovery set";
  if (text.includes("parfum")) return "parfüm";
  if (text.includes("oda kokusu")) return "oda kokusu";
  if (text.includes("arac kokusu")) return "araç kokusu";
  if (text.includes("difuzor")) return "aromaterapi difüzör";
  if (text.includes("mum")) return "mum";

  if (text.includes("kolye")) return "kolye";
  if (text.includes("bileklik")) return "bileklik";
  if (text.includes("kupe")) return "küpe";
  if (text.includes("yuzuk")) return "yüzük";
  if (text.includes("saat")) return "saat";
  if (text.includes("sal")) return "şal";
  if (text.includes("fular")) return "fular";
  if (text.includes("canta")) return "çanta";
  if (text.includes("cuzdan")) return "cüzdan";
  if (text.includes("kartlik")) return "kartlık";
  if (text.includes("anahtarlik")) return "anahtarlık";
  if (text.includes("sac tokasi")) return "saç tokası seti";
  if (text.includes("klips toka")) return "klips toka";

  if (text.includes("french press")) return "french press";
  if (text.includes("kahve cekirdegi")) return "kahve çekirdeği";
  if (text.includes("filtre kahve")) return "filtre kahve seti";
  if (text.includes("bitki cayi")) return "bitki çayı seti";
  if (text.includes("cay kutusu")) return "çay kutusu";
  if (text.includes("kahve seti")) return "kahve seti";
  if (text.includes("kupa")) return "kupa";
  if (text.includes("termos")) return "termos";

  if (text.includes("cerceve")) return "çerçeve";
  if (text.includes("abajur")) return "mini abajur";
  if (text.includes("vazo")) return "vazo";
  if (text.includes("kirlent")) return "kırlent";
  if (text.includes("taki kutusu")) return "takı kutusu";
  if (text.includes("makyaj organizeri")) return "makyaj organizeri";
  if (text.includes("masa lambasi")) return "masa lambası";
  if (text.includes("led isik")) return "led ışık";

  if (text.includes("kitap")) return "kitap";
  if (text.includes("defter")) return "defter";
  if (text.includes("kalem seti")) return "kalem seti";
  if (text.includes("puzzle")) return "puzzle";
  if (text.includes("boyama seti")) return "boyama seti";
  if (text.includes("hobi seti")) return "hobi seti";
  if (text.includes("resim malzemeleri")) return "resim malzemeleri";
  if (text.includes("kamera aksesuari")) return "kamera aksesuarı";
  if (text.includes("telefon aksesuari")) return "telefon aksesuarı";
  if (text.includes("kulaklik")) return "kulaklık";
  if (text.includes("powerbank")) return "powerbank";
  if (text.includes("bluetooth hoparlor")) return "bluetooth hoparlör";

  if (text.includes("polo") && (text.includes("tisort") || text.includes("t-shirt") || text.includes("tshirt"))) return "polo yaka tişört";
  if (text.includes("basic tisort")) return "basic tişört";
  if (text.includes("tisort") || text.includes("t-shirt") || text.includes("tshirt")) return "tişört";
  if (text.includes("gomlek")) return "gömlek";
  if (text.includes("sweatshirt")) return "sweatshirt";
  if (text.includes("spor cantasi")) return "spor çantası";
  if (text.includes("sapka")) return "şapka";
  if (text.includes("kemer")) return "kemer";
  if (text.includes("tiras bakim")) return "tıraş bakım seti";

  return cleanGiftTitle(getRawGiftTitle(gift)).toLowerCase();
}

function store(label: string, storeName: string, href: string): StoreLink {
  return {
    label,
    store: storeName,
    href,
  };
}

function buildStoreLinksForCategory(category: string, query: string): StoreLink[] {
  const q = enc(query);

  const common = [
    store("Trendyol’da Ara", "Trendyol", `https://www.trendyol.com/sr?q=${q}`),
    store("Hepsiburada’da Ara", "Hepsiburada", `https://www.hepsiburada.com/ara?q=${q}`),
  ];

  if (category === "homewear") {
    return [
      store("Penti’de Ara", "Penti", `https://www.penti.com/tr/search?q=${q}`),
      store("Dagi’de Ara", "Dagi", `https://www.dagi.com.tr/arama?q=${q}`),
      store("Victoria’s Secret’ta Ara", "Victoria’s Secret", `https://www.victoriassecret.com.tr/search?q=${q}`),
      store("LC Waikiki’de Ara", "LC Waikiki", `https://www.lcwaikiki.com/tr-TR/TR/arama?q=${q}`),
      store("Mango’da Ara", "Mango", `https://shop.mango.com/tr/tr/search?q=${q}`),
      store("Boyner’de Ara", "Boyner", `https://www.boyner.com.tr/search?q=${q}`),
      ...common,
    ];
  }

  if (category === "selfcare") {
    return [
      store("Gratis’te Ara", "Gratis", `https://www.gratis.com/search?q=${q}`),
      store("Watsons’ta Ara", "Watsons", `https://www.watsons.com.tr/search?text=${q}`),
      store("Sephora’da Ara", "Sephora", `https://www.sephora.com.tr/search?q=${q}`),
      store("Yves Rocher’de Ara", "Yves Rocher", `https://www.yvesrocher.com.tr/search?q=${q}`),
      store("The Body Shop’ta Ara", "The Body Shop", `https://www.thebodyshop.com.tr/search?q=${q}`),
      store("Bath & Body Works’te Ara", "Bath & Body Works", `https://www.bathandbodyworks.com.tr/search?q=${q}`),
      store("Rossmann’da Ara", "Rossmann", `https://www.rossmann.com.tr/search?q=${q}`),
      common[0],
    ];
  }

  if (category === "fragrance") {
    return [
      store("Sephora’da Ara", "Sephora", `https://www.sephora.com.tr/search?q=${q}`),
      store("Boyner’de Ara", "Boyner", `https://www.boyner.com.tr/search?q=${q}`),
      store("Beymen’de Ara", "Beymen", `https://www.beymen.com/search?q=${q}`),
      store("Gratis’te Ara", "Gratis", `https://www.gratis.com/search?q=${q}`),
      store("Watsons’ta Ara", "Watsons", `https://www.watsons.com.tr/search?text=${q}`),
      store("Madame Coco’da Ara", "Madame Coco", `https://www.madamecoco.com/search?q=${q}`),
      store("English Home’da Ara", "English Home", `https://www.englishhome.com/search?q=${q}`),
      store("Bath & Body Works’te Ara", "Bath & Body Works", `https://www.bathandbodyworks.com.tr/search?q=${q}`),
    ];
  }

  if (category === "accessory") {
    return [
      store("So Chic’te Ara", "So Chic", `https://www.sochic.com.tr/arama?q=${q}`),
      store("Atasay’da Ara", "Atasay", `https://www.atasay.com/arama?q=${q}`),
      store("Altınbaş’ta Ara", "Altınbaş", `https://www.altinbas.com/arama?q=${q}`),
      store("Swarovski’de Ara", "Swarovski", `https://www.swarovski.com/tr-TR/search/?text=${q}`),
      store("Accessorize’da Ara", "Accessorize", `https://www.accessorize.com.tr/search?q=${q}`),
      store("Mango’da Ara", "Mango", `https://shop.mango.com/tr/tr/search?q=${q}`),
      store("Zara’da Ara", "Zara", `https://www.zara.com/tr/tr/search?searchTerm=${q}`),
      store("Pull&Bear’da Ara", "Pull&Bear", `https://www.pullandbear.com/tr/search?searchTerm=${q}`),
      store("Stradivarius’ta Ara", "Stradivarius", `https://www.stradivarius.com/tr/search?searchTerm=${q}`),
      store("Boyner’de Ara", "Boyner", `https://www.boyner.com.tr/search?q=${q}`),
    ];
  }

  if (category === "coffee") {
    return [
      store("Starbucks’ta Ara", "Starbucks", `https://www.starbucks.com.tr/search?q=${q}`),
      store("Tchibo’da Ara", "Tchibo", `https://www.tchibo.com.tr/search?q=${q}`),
      store("Kahve Dünyası’nda Ara", "Kahve Dünyası", `https://www.kahvedunyasi.com/arama?q=${q}`),
      store("Karaca’da Ara", "Karaca", `https://www.karaca.com/arama?search=${q}`),
      store("English Home’da Ara", "English Home", `https://www.englishhome.com/search?q=${q}`),
      store("Madame Coco’da Ara", "Madame Coco", `https://www.madamecoco.com/search?q=${q}`),
      ...common,
    ];
  }

  if (category === "decor") {
    return [
      store("Madame Coco’da Ara", "Madame Coco", `https://www.madamecoco.com/search?q=${q}`),
      store("English Home’da Ara", "English Home", `https://www.englishhome.com/search?q=${q}`),
      store("IKEA’da Ara", "IKEA", `https://www.ikea.com.tr/arama/?k=${q}`),
      store("Karaca Home’da Ara", "Karaca Home", `https://www.karaca.com/arama?search=${q}`),
      store("Home’da Ara", "Home", `https://www.zarahome.com/tr/search?searchTerm=${q}`),
      store("Mudo’da Ara", "Mudo", `https://www.mudo.com.tr/arama?q=${q}`),
      ...common,
    ];
  }

  if (category === "hobby") {
    return [
      store("D&R’da Ara", "D&R", `https://www.dr.com.tr/search?q=${q}`),
      store("Remzi Kitabevi’nde Ara", "Remzi Kitabevi", `https://www.remzi.com.tr/arama?q=${q}`),
      store("Amazon’da Ara", "Amazon", `https://www.amazon.com.tr/s?k=${q}`),
      store("Teknosa’da Ara", "Teknosa", `https://www.teknosa.com/arama/?s=${q}`),
      store("MediaMarkt’ta Ara", "MediaMarkt", `https://www.mediamarkt.com.tr/tr/search.html?query=${q}`),
      ...common,
    ];
  }

  if (category === "menswear") {
    return [
      store("Boyner’de Ara", "Boyner", `https://www.boyner.com.tr/search?q=${q}`),
      store("Damat’ta Ara", "Damat", `https://www.damat.com.tr/arama?q=${q}`),
      store("Kiğılı’da Ara", "Kiğılı", `https://www.kigili.com/arama?q=${q}`),
      store("Mavi’de Ara", "Mavi", `https://www.mavi.com/arama?q=${q}`),
      store("Jack & Jones’ta Ara", "Jack & Jones", `https://www.jackjones.com.tr/search?q=${q}`),
      store("Calvin Klein’da Ara", "Calvin Klein", `https://tr.calvinklein.com/search?q=${q}`),
      store("Tommy Hilfiger’da Ara", "Tommy Hilfiger", `https://tr.tommy.com/search?q=${q}`),
      store("Lacoste’ta Ara", "Lacoste", `https://www.lacoste.com.tr/arama?q=${q}`),
      store("Decathlon’da Ara", "Decathlon", `https://www.decathlon.com.tr/search?Ntt=${q}`),
      common[0],
    ];
  }

  return common;
}

function detectCategory(gift: GiftLike) {
  const raw = `${gift.title || ""} ${gift.name || ""} ${gift.category || ""} ${gift.description || ""} ${(gift.tags || []).join(" ")}`;
  const text = normalizeTurkish(raw);

  if (
    text.includes("pijama") ||
    text.includes("sabahlik") ||
    text.includes("ev terligi") ||
    text.includes("uyku maskesi") ||
    text.includes("battaniye") ||
    text.includes("corap") ||
    text.includes("cozy") ||
    text.includes("termal iclik") ||
    text.includes("ev giyim")
  ) return "homewear";

  if (
    text.includes("vucut spreyi") ||
    text.includes("body mist") ||
    text.includes("el kremi") ||
    text.includes("dus jeli") ||
    text.includes("vucut losyonu") ||
    text.includes("cilt bakim") ||
    text.includes("dudak balmi") ||
    text.includes("yuz maskesi") ||
    text.includes("sac bakim") ||
    text.includes("banyo tuzu") ||
    text.includes("spa") ||
    text.includes("self-care") ||
    text.includes("bakim")
  ) return "selfcare";

  if (
    text.includes("parfum") ||
    text.includes("oda kokusu") ||
    text.includes("arac kokusu") ||
    text.includes("difuzor") ||
    text.includes("mum") ||
    text.includes("koku")
  ) return "fragrance";

  if (
    text.includes("kolye") ||
    text.includes("bileklik") ||
    text.includes("kupe") ||
    text.includes("yuzuk") ||
    text.includes("saat") ||
    text.includes("sal") ||
    text.includes("fular") ||
    text.includes("canta") ||
    text.includes("cuzdan") ||
    text.includes("kartlik") ||
    text.includes("anahtarlik") ||
    text.includes("toka") ||
    text.includes("aksesuar")
  ) return "accessory";

  if (
    text.includes("kupa") ||
    text.includes("termos") ||
    text.includes("french press") ||
    text.includes("kahve") ||
    text.includes("bitki cayi") ||
    text.includes("cay kutusu") ||
    text.includes("cikolata paketi")
  ) return "coffee";

  if (
    text.includes("dekor") ||
    text.includes("cerceve") ||
    text.includes("abajur") ||
    text.includes("vazo") ||
    text.includes("kirlent") ||
    text.includes("taki kutusu") ||
    text.includes("makyaj organizeri") ||
    text.includes("masa lambasi") ||
    text.includes("led isik")
  ) return "decor";

  if (
    text.includes("kitap") ||
    text.includes("defter") ||
    text.includes("kalem") ||
    text.includes("puzzle") ||
    text.includes("boyama") ||
    text.includes("hobi") ||
    text.includes("resim malzemeleri") ||
    text.includes("kamera") ||
    text.includes("telefon aksesuari") ||
    text.includes("kulaklik") ||
    text.includes("powerbank") ||
    text.includes("bluetooth hoparlor")
  ) return "hobby";

  if (
    text.includes("basic tisort") ||
    text.includes("polo") ||
    text.includes("sweatshirt") ||
    text.includes("tiras") ||
    text.includes("spor cantasi") ||
    text.includes("sapka") ||
    text.includes("kemer") ||
    text.includes("erkek") ||
    text.includes("giyim")
  ) return "menswear";

  return "general";
}

export function getGiftStoreLinks(gift: GiftLike) {
  const query = inferGiftSearchQuery(gift);
  const category = detectCategory(gift);
  return buildStoreLinksForCategory(category, query);
}
