export type PriceGift = { price?: string; budget?: string; price_min?: number; price_max?: number };

export function budgetLimit(answer: string): number | null {
  const amount = Number(answer.match(/\d+/)?.[0]);
  return amount > 0 ? amount : null;
}

export function priceRange(gift: PriceGift): { min: number; max: number | null } | null {
  // Prefer the displayed catalog range: API defaults can contain artificial 0/999999 bounds.
  const text = gift.price || gift.budget || "";
  const values = (text.replace(/(\d)\.(?=\d{3}(?:\D|$))/g, "$1").match(/\d+(?:,\d+)?/g) || []).map(value => Number(value.replace(",", ".")));
  if (values.length) return { min: values[0], max: values[1] ?? (text.includes("+") ? null : values[0]) };
  if (Number.isFinite(gift.price_min) && gift.price_min! > 0) {
    return { min: gift.price_min!, max: gift.price_max && gift.price_max < 999999 ? gift.price_max : null };
  }
  return null;
}

export function fitsBudget(gift: PriceGift, limit: number | null) {
  if (limit === null) return true;
  const range = priceRange(gift);
  return range !== null && range.min <= limit;
}

export function budgetDescription(gift: PriceGift, limit: number | null) {
  const range = priceRange(gift);
  if (!range) return "Fiyat bilgisi doğrulanmalı";
  if (limit === null) return "Fiyatlar tahminidir; mağazada kontrol et";
  if (range.max !== null && range.max <= limit) return "Tahmini fiyat aralığı bütçenin içinde";
  return `${limit.toLocaleString("tr-TR")} TL bütçeyle seçenekleri olabilir; ürün fiyatını kontrol et`;
}
