export type Gift = {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  price?: string;
  budget?: string;
  description?: string;
  reason?: string;
  tags?: string[];
};

export type Answers = {
  relation: string;
  style: string;
  interest: string;
  budget: string;
  urgency: string;
  occasion: string;
  exclude: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

export function getGiftText(gift: Gift) {
  return normalize(
    `${gift.title || ""} ${gift.name || ""} ${gift.category || ""} ${gift.description || ""} ${gift.reason || ""} ${(gift.tags || []).join(" ")}`
  );
}

export function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(normalize(word)));
}

export function getMatchScore(gift: Gift, answers: Answers) {
  const text = getGiftText(gift);
  let score = 62;

  const relation = normalize(answers.relation);
  const style = normalize(answers.style);
  const interest = normalize(answers.interest);
  const urgency = normalize(answers.urgency);

  if (relation.includes("sevgili") || relation.includes("romantik")) {
    if (includesAny(text, ["kolye", "bileklik", "parfüm", "pijama", "çiçek", "mum"])) score += 12;
  }

  if (relation.includes("anne")) {
    if (includesAny(text, ["pijama", "bakım", "krem", "dekor", "kahve", "battaniye", "oda kokusu"])) score += 12;
  }

  if (relation.includes("arkadas")) {
    if (includesAny(text, ["kupa", "body mist", "kahve", "çorap", "kitap", "hobi", "çikolata"])) score += 10;
  }

  if (relation.includes("erkek") || relation.includes("baba")) {
    if (includesAny(text, ["polo", "sweatshirt", "cüzdan", "kartlık", "saat", "tıraş", "termos", "kulaklık", "kemer"])) score += 14;
  }

  if (style.includes("cozy") || style.includes("rahat")) {
    if (includesAny(text, ["pijama", "sabahlık", "terlik", "battaniye", "kupa", "mum", "çorap"])) score += 16;
  }

  if (style.includes("bakim") || style.includes("self")) {
    if (includesAny(text, ["body mist", "el kremi", "duş jeli", "losyon", "cilt", "spa", "maske", "bakım"])) score += 16;
  }

  if (style.includes("romantik")) {
    if (includesAny(text, ["kolye", "bileklik", "parfüm", "çiçek", "mum", "takı"])) score += 16;
  }

  if (style.includes("kullanisli")) {
    if (includesAny(text, ["termos", "kupa", "çanta", "cüzdan", "kartlık", "kulaklık", "powerbank", "saat"])) score += 13;
  }

  if (interest.includes("kahve")) {
    if (includesAny(text, ["kahve", "kupa", "termos", "french press", "çay"])) score += 16;
  }

  if (interest.includes("bakim")) {
    if (includesAny(text, ["bakım", "body mist", "krem", "spa", "maske", "losyon"])) score += 16;
  }

  if (interest.includes("dekor") || interest.includes("ev")) {
    if (includesAny(text, ["mum", "oda kokusu", "vazo", "çerçeve", "battaniye", "abajur", "dekor"])) score += 15;
  }

  if (interest.includes("moda") || interest.includes("aksesuar")) {
    if (includesAny(text, ["kolye", "çanta", "saat", "şal", "fular", "cüzdan", "toka", "tişört", "sweatshirt"])) score += 15;
  }

  if (answers.interest && includesAny(text, answers.interest.split(" "))) score += 15;
  if (answers.occasion.includes("romantik") && includesAny(text, ["romantik", "kolye", "anı", "çiçek"])) score += 8;
  if (answers.occasion.includes("ev") && includesAny(text, ["dekor", "kupa", "vazo", "defter"])) score += 8;

  if (urgency.includes("bugun") || urgency.includes("acil")) {
    if (includesAny(text, ["çiçek", "çikolata", "kupa", "body mist", "el kremi", "kahve", "mum"])) score += 8;
  }

  if (urgency.includes("yarin")) {
    if (includesAny(text, ["pijama", "bakım", "kahve", "kolye", "mum"])) score += 7;
  }

  return score;
}

