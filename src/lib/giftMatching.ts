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
  recipients?: string[];
  interests?: string[];
  styles?: string[];
  occasions?: string[];
  urgency?: string[];
  risk_level?: string;
  riskLevel?: string;
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

function legacyScore(gift: Gift, answers: Answers) {
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


/* ─────────────────────────────────────────────────────────────
 * Structured matching
 * Catalog entries carry recipients / interests / styles / occasions /
 * urgency / risk. Quiz answers are free-text values, so they are mapped
 * to those labels first.
 * ──────────────────────────────────────────────────────────── */

type Rule = [needle: string, label: string];

const RELATION_RULES: Rule[] = [
  ["sevgili", "Sevgilim"],
  ["anne", "Annem"],
  ["baba", "Babam"],
  ["erkek", "Babam"],
  ["arkadas", "Arkadaşım"],
  ["kardes", "Kardeşim"],
  ["is arkadas", "İş arkadaşım"],
];
const OCCASION_RULES: Rule[] = [
  ["dogum", "Doğum günü"],
  ["yil donum", "Yıl dönümü"],
  ["tesekkur", "Teşekkür"],
  ["yeni is", "Yeni iş"],
  ["ev", "Yeni ev"],
];
const STYLE_RULES: Rule[] = [
  ["cozy", "Rahat"],
  ["rahat", "Rahat"],
  ["bakim", "Bakım"],
  ["romantik", "Romantik"],
  ["kullanisli", "Kullanışlı"],
  ["premium", "Şık"],
  ["sik", "Şık"],
];
const INTEREST_RULES: Rule[] = [
  ["kahve", "Kahve / çay"],
  ["bakim", "Bakım"],
  ["dekor", "Ev / dekor"],
  ["moda", "Moda / aksesuar"],
  ["kitap", "Kitap / kırtasiye"],
  ["hobi", "Hobi / oyun"],
  ["teknoloji", "Teknoloji"],
];

const RELATION_REASON: Record<string, string> = {
  Sevgilim: "Sevgiline uygun",
  Annem: "Annene uygun",
  Babam: "Babana uygun",
  Arkadaşım: "Arkadaşına uygun",
  Kardeşim: "Kardeşine uygun",
  "İş arkadaşım": "İş arkadaşına uygun",
};
const STYLE_REASON: Record<string, string> = {
  Rahat: "Rahat ve samimi",
  Bakım: "Bakım odaklı",
  Romantik: "Romantik bir seçim",
  Kullanışlı: "Her gün işe yarar",
  Şık: "Şık ve özenli",
};

function labelsFor(answer: string, rules: Rule[], firstOnly = false) {
  const text = normalize(answer);
  if (!text) return [];
  const found: string[] = [];
  for (const [needle, label] of rules) {
    if (text.includes(needle) && !found.includes(label)) {
      found.push(label);
      if (firstOnly) break;
    }
  }
  return found;
}

function hasAny(list: string[] | undefined, wanted: string[]) {
  return Boolean(list?.some((item) => wanted.includes(item)));
}

function isStructured(gift: Gift) {
  return Boolean(gift.recipients?.length || gift.interests?.length || gift.styles?.length);
}

function priceBounds(gift: Gift) {
  const text = gift.price || gift.budget || "";
  const values = (text.replace(/(\d)\.(?=\d{3}(?:\D|$))/g, "$1").match(/\d+/g) || []).map(Number);
  const min = values[0] ?? (gift.price_min && gift.price_min > 0 ? gift.price_min : null);
  const max = values[1] ?? (gift.price_max && gift.price_max < 999999 ? gift.price_max : min);
  return min === null || min === undefined ? null : { min, max: max ?? min };
}

function budgetFromAnswer(answer: string) {
  const amount = Number(answer.match(/\d+/)?.[0]);
  return amount > 0 ? amount : null;
}

function wantsToday(answers: Answers) {
  const u = normalize(answers.urgency);
  return u.includes("bugun") || u.includes("acil") || u.includes("yarin");
}

export type MatchDetail = { score: number; reasons: string[] };

/** Score a gift 0–99 and explain the strongest reasons it matched. */
export function matchGift(gift: Gift, answers: Answers): MatchDetail {
  if (!isStructured(gift)) {
    return { score: Math.min(95, Math.max(30, legacyScore(gift, answers) - 10)), reasons: [] };
  }

  const reasons: string[] = [];
  let raw = 0;

  // Who it is for — the strongest signal.
  const relation = labelsFor(answers.relation, RELATION_RULES, true);
  if (relation.length) {
    if (hasAny(gift.recipients, relation)) {
      raw += 16;
      if ((gift.recipients?.length ?? 0) <= 3) raw += 3; // picked specifically for them
      reasons.push(RELATION_REASON[relation[0]] ?? "Seçtiğin kişiye uygun");
    } else {
      raw -= 30;
    }
  }

  // What they are into.
  const interests = labelsFor(answers.interest, INTEREST_RULES);
  if (interests.length) {
    if (hasAny(gift.interests, interests)) {
      raw += 20;
      if (gift.interests && interests.includes(gift.interests[0])) raw += 5; // main theme of the gift
      reasons.push(`${interests[0]} ilgisine uygun`);
    } else {
      raw -= 12;
    }
  }

  // How it should feel.
  const styles = labelsFor(answers.style, STYLE_RULES);
  if (styles.length) {
    if (hasAny(gift.styles, styles)) {
      raw += 12;
      if (gift.styles && styles.includes(gift.styles[0])) raw += 3;
      reasons.push(STYLE_REASON[styles[0]] ?? "Seçtiğin tarza yakın");
    } else {
      raw -= 5;
    }
  }

  // The occasion: occasion-specific ideas beat "fits anything" ones.
  const occasions = labelsFor(answers.occasion, OCCASION_RULES);
  if (occasions.length) {
    const generic = gift.occasions?.includes("Her durum");
    if (hasAny(gift.occasions, occasions)) {
      raw += generic ? 3 : 9;
      if (!generic) reasons.push(`${occasions[0]} için uygun`);
    } else {
      raw -= 8;
    }
  }

  // Budget: reward ranges inside the limit that also use it well.
  const limit = budgetFromAnswer(answers.budget);
  const bounds = priceBounds(gift);
  if (limit && bounds) {
    if (bounds.max <= limit) {
      raw += 8;
      if (bounds.max >= limit * 0.5) raw += 3;
    } else {
      const middle = (bounds.min + bounds.max) / 2;
      raw -= Math.min(18, Math.round(((middle - limit) / limit) * 12));
    }
  }

  // Urgency: prefer things you can buy in a store today.
  if (wantsToday(answers)) {
    if (gift.urgency?.includes("Bugün lazım")) {
      raw += 8;
      reasons.push("Mağazadan hızlıca bulunabilir");
    } else {
      raw -= 14;
    }
  }

  // Risk: size, scent or taste uncertainty.
  const risk = gift.risk_level || gift.riskLevel || "low";
  if (risk === "low") {
    raw += 3;
    if (reasons.length < 3) reasons.push("Zevk riski düşük");
  } else if (risk === "high") {
    raw -= 10;
  }

  // Map to a friendly 20–97 range: a perfect match on every answer lands
  // in the low 90s, so the percentage stays meaningful.
  const score = 45 + raw * 0.55;
  return { score: Math.max(20, Math.min(97, Math.round(score))), reasons: reasons.slice(0, 3) };
}

export function getMatchScore(gift: Gift, answers: Answers) {
  return matchGift(gift, answers).score;
}
