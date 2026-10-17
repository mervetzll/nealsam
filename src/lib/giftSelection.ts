export function giftKey(title: string) {
  return title.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").trim();
}

export function excludesGift(gift: { title?: string; name?: string; category?: string; tags?: string[] }, exclusion: string) {
  if (!exclusion) return false;
  const text = giftKey(`${gift.title || gift.name || ""} ${gift.category || ""} ${(gift.tags || []).join(" ")}`);
  return exclusion.split("|").filter(Boolean).some(word => text.includes(giftKey(word)));
}

function family(title: string) {
  const text = giftKey(title);
  for (const [key, words] of Object.entries({
    cup: ["kupa", "kahve kutusu", "kahve hediye"],
    flask: ["termos"], candle: ["mum", "oda kokusu"],
    care: ["krem", "bakim", "body mist"], jewellery: ["kolye", "bileklik", "kupe"],
    book: ["kitap", "ayrac"],
  })) if (words.some(word => text.includes(word))) return key;
  return text;
}

// Keep the best match first, but offer distinct ideas before repeating a product family.
export function diversifyGifts<T extends { gift: { title?: string; name?: string }; score: number }>(ranked: T[]): T[] {
  const seen = new Set<string>();
  const unique = ranked.filter(item => {
    const key = giftKey(item.gift.title || item.gift.name || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const families = new Set<string>();
  const first: T[] = [];
  const rest: T[] = [];
  const threshold = (unique[0]?.score || 0) - 20;
  for (const item of unique) {
    const key = family(item.gift.title || item.gift.name || "");
    if (first.length < 4 && item.score >= threshold && !families.has(key)) {
      families.add(key);
      first.push(item);
    } else rest.push(item);
  }
  return [...first, ...rest];
}
