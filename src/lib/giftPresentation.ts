export type GiftLike = {
  title?: string;
  name?: string;
  category?: string;
  description?: string;
  reason?: string;
  tags?: string[];
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

export function getRawGiftTitle(gift: GiftLike) {
  return gift.title || gift.name || "Hediye";
}

export function cleanGiftTitle(value?: string) {
  if (!value) return "Hediye";

  let title = value.trim();

  const brandPatterns = [
    /zara\s*tarz[ıi]\s*/gi,
    /mango\s*tarz[ıi]\s*/gi,
    /calvin\s*tarz[ıi]\s*/gi,
    /calvin\s+klein\s*tarz[ıi]\s*/gi,
    /bershka\s*tarz[ıi]\s*/gi,
    /pull\s*&?\s*bear\s*tarz[ıi]\s*/gi,
    /stradivarius\s*tarz[ıi]\s*/gi,
    /hm\s*tarz[ıi]\s*/gi,
    /h&m\s*tarz[ıi]\s*/gi,
    /marka\s*tarz[ıi]\s*/gi,
  ];

  for (const pattern of brandPatterns) {
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

  if (text.includes("tisort") || text.includes("t-shirt") || text.includes("tshirt")) return "tişört";
  if (text.includes("gomlek")) return "gömlek";
  if (text.includes("sweatshirt")) return "sweatshirt";
  if (text.includes("kazak")) return "kazak";
  if (text.includes("elbise")) return "elbise";
  if (text.includes("canta")) return "çanta";
  if (text.includes("parfum")) return "parfüm";
  if (text.includes("kolye")) return "kolye";
  if (text.includes("bileklik")) return "bileklik";
  if (text.includes("saat")) return "saat";
  if (text.includes("kupa")) return "kupa";
  if (text.includes("termos")) return "termos";
  if (text.includes("kitap")) return "kitap";
  if (text.includes("cikolata")) return "çikolata";
  if (text.includes("cicek")) return "çiçek";
  if (text.includes("mum")) return "mum";

  return cleanGiftTitle(getRawGiftTitle(gift)).toLowerCase();
}

function enc(value: string) {
  return encodeURIComponent(value);
}

export function getGiftStoreLinks(gift: GiftLike) {
  const query = inferGiftSearchQuery(gift);
  const text = normalizeTurkish(`${gift.title || ""} ${gift.category || ""} ${gift.description || ""}`);

  const links = [
    {
      label: "Trendyol’da Ara",
      store: "Trendyol",
      href: `https://www.trendyol.com/sr?q=${enc(query)}`,
    },
    {
      label: "Hepsiburada’da Ara",
      store: "Hepsiburada",
      href: `https://www.hepsiburada.com/ara?q=${enc(query)}`,
    },
  ];

  const isFashion =
    text.includes("tisort") ||
    text.includes("t-shirt") ||
    text.includes("tshirt") ||
    text.includes("gomlek") ||
    text.includes("sweatshirt") ||
    text.includes("kazak") ||
    text.includes("elbise") ||
    text.includes("canta") ||
    text.includes("moda") ||
    text.includes("giyim");

  const isPremiumFashion =
    isFashion ||
    text.includes("calvin") ||
    text.includes("zara") ||
    text.includes("mango");

  if (isFashion) {
    links.unshift(
      {
        label: "Zara’da Ara",
        store: "Zara",
        href: `https://www.zara.com/tr/tr/search?searchTerm=${enc(query)}`,
      },
      {
        label: "Mango’da Ara",
        store: "Mango",
        href: `https://shop.mango.com/tr/tr/search?q=${enc(query)}`,
      }
    );
  }

  if (isPremiumFashion) {
    links.push({
      label: "Calvin Klein’da Ara",
      store: "Calvin Klein",
      href: `https://tr.calvinklein.com/search?q=${enc(query)}`,
    });
  }

  return links;
}
