import type { Answers, Gift } from "./giftMatching";
export type GiftPlan = { title: string; note: string; presentation: string; budget: string; alternatives: string[]; checklist: string[] };
export function buildGiftPlan(gift: Gift, alternatives: Gift[], answers: Answers, recipient: string, memory: string): GiftPlan {
  const title = gift.title || gift.name || "Hediyen";
  const coffee = /kahve|çay|kupa|termos/i.test(title);
  const book = /kitap|defter|kalem/i.test(title);
  const romantic = /sevgili|romantik|eş/.test(answers.relation);
  const greeting = recipient ? `${recipient}, ` : "";
  const note = `${greeting}${memory ? `${memory} Benim için çok kıymetli. ` : ""}${romantic ? "Seninle paylaştığım küçük anlar günümü güzelleştiriyor." : "Hayatımda olman bana iyi geliyor."} ${coffee ? "Bu hediyeyi her kullandığında birlikte vereceğimiz keyifli molaları hatırla." : book ? "Yeni sayfalarda sana eşlik edecek küçük bir hediye seçtim." : "Sana ayırdığım bu küçük sürpriz yüzünde bir gülümseme olsun."}${answers.occasion.includes("doğum") ? " İyi ki doğdun!" : " İyi ki varsın!"}`;
  const ceiling = /2500/.test(answers.budget) ? 2500 : /1000/.test(answers.budget) ? 1000 : /500/.test(answers.budget) ? 500 : null;
  return {
    title: `${title} için hazırlık planın`, note,
    presentation: coffee ? "Kupayı veya termosu sade kâğıda sar; notunu sapına ya da paketin kurdelesine iliştir. Evde varsa küçük bir kahve molasıyla sun." : book ? "İlk sayfaya yazmak yerine çıkarılabilir bir not kartı ekle. İnce bir kurdele ve sade kâğıtla paketle." : "Ürünü koruyacak uygun bir kutuya yerleştir. Sade kâğıt ve tek renk kurdele kullan; kişisel notunu en üste koy.",
    budget: ceiling ? `${ceiling} TL toplam sınırın için ürün alışverişine en fazla ${Math.floor(ceiling * .9)} TL, paketlemeye en fazla ${Math.floor(ceiling * .1)} TL ayırabilirsin. Bunlar önerilen üst sınırlar; ürünün gerçek fiyatını mağazada kontrol et. Fiyat yükselirse ek ürün alma.` : "Önce toplam sınırını belirle. Yaklaşık %90’ını hediyeye, %10’unu paketlemeye ayır; evdeki malzemelerle paketleme maliyetini azaltabilirsin.",
    alternatives: alternatives.filter(g => (g.title || g.name) !== title).slice(0, 3).map(g => `${g.title || g.name}${g.price ? ` — katalog tahmini: ${g.price}` : ""}`),
    checklist: ["Mağazada güncel fiyatı ve stok durumunu kontrol et.", answers.urgency.includes("bugün") ? "Bugün teslim veya mağazadan alım seçeneğini mağazaya sor." : "Teslim tarihini hediye gününden önce olacak şekilde doğrula.", "İade/değişim koşullarını ve varsa beden, koku veya alerji hassasiyetini kontrol et.", "Notu kendi anınla düzenle, paketle ve vermeden önce son kez kontrol et."],
  };
}
