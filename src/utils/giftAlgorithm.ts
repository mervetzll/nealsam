import type { Gift, RiskLevel, ScoredGift } from "@/types/gift";

type AnswerMap = Record<number, string[]>;

type BudgetRange = {
  label: string;
  min: number;
  max: number;
};

const budgetRanges: BudgetRange[] = [
  { label: "0–250 TL", min: 0, max: 250 },
  { label: "250–500 TL", min: 250, max: 500 },
  { label: "500–1000 TL", min: 500, max: 1000 },
  { label: "1000–2500 TL", min: 1000, max: 2500 },
  { label: "2500 TL+", min: 2500, max: 999999 },
];

const interestCategoryMap: Record<string, string[]> = {
  Kahve: ["Kahve", "Mutfak", "Ev"],
  Kitap: ["Kitap", "Kırtasiye", "Hobi"],
  Makyaj: ["Makyaj", "Kozmetik", "Beauty"],
  "Cilt bakımı": ["Cilt bakımı", "Kozmetik", "Beauty"],
  Teknoloji: ["Teknoloji", "Elektronik"],
  Oyun: ["Oyun", "Teknoloji"],
  Spor: ["Spor", "Fitness"],
  Moda: ["Moda", "Giyim", "Aksesuar"],
  Takı: ["Takı", "Aksesuar"],
  "Ev dekorasyonu": ["Ev dekorasyonu", "Dekorasyon", "Ev"],
  Seyahat: ["Seyahat", "Outdoor"],
  Müzik: ["Müzik", "Hobi"],
};

const feminineSignals = [
  "makyaj",
  "kozmetik",
  "beauty",
  "cilt bakımı",
  "takı",
  "kolye",
  "bileklik",
  "küpe",
  "çanta",
  "bakım seti",
  "parfüm",
  "çiçek",
  "mum",
  "dekoratif",
];

const masculineSignals = [
  "erkek",
  "teknoloji",
  "elektronik",
  "oyun",
  "gaming",
  "spor",
  "fitness",
  "cüzdan",
  "saat",
  "traş",
  "tıraş",
  "araba",
  "aksesuar",
  "kamp",
  "outdoor",
];

const neutralSignals = [
  "kahve",
  "kitap",
  "defter",
  "mug",
  "termos",
  "deneyim",
  "anı",
  "kişiye özel",
  "fotoğraf",
  "çikolata",
  "kutu",
  "ev",
  "müzik",
];

const riskRules: Record<string, (gift: Gift) => number> = {
  "Beden/numara riski olmasın": (gift) =>
    includesAny(gift, ["Giyim", "Ayakkabı", "Moda"]) ? -35 : 8,

  "Koku seçimi gerektirmesin": (gift) =>
    includesAny(gift, ["Parfüm", "Koku"]) ? -35 : 6,

  "Renk/ton seçimi gerektirmesin": (gift) =>
    includesAny(gift, ["Makyaj", "Kozmetik", "Beauty"]) ? -25 : 5,

  "Kırılabilir olmasın": (gift) =>
    includesAny(gift, ["Cam", "Seramik", "Ev dekorasyonu", "Dekorasyon"]) ? -25 : 5,

  "Çok romantik olmasın": (gift) =>
    gift.styles.includes("Romantik") || gift.recipients.includes("Sevgilim") ? -25 : 5,

  "Kişiye özel olmasın": (gift) =>
    gift.styles.includes("Kişiye özel") || includesAny(gift, ["Kişiye özel"]) ? -25 : 5,

  "Son dakika alınabilir olsun": (gift) =>
    gift.urgency.includes("Bugün lazım") || gift.urgency.includes("1–2 gün içinde") ? 15 : -15,

  "Fark etmez": () => 0,
};

function includesAny(gift: Gift, words: string[]) {
  const haystack = [
    gift.title,
    gift.category,
    gift.subCategory,
    gift.reason,
    gift.note,
    gift.searchQuery,
    ...gift.styles,
    ...gift.interests,
    ...gift.recipients,
  ]
    .join(" ")
    .toLocaleLowerCase("tr");

  return words.some((word) => haystack.includes(word.toLocaleLowerCase("tr")));
}

function getBudgetRange(label?: string) {
  return budgetRanges.find((range) => range.label === label) || null;
}

function getBudgetScore(gift: Gift, budgetLabel?: string) {
  const budget = getBudgetRange(budgetLabel);

  if (!budget) return 0;

  const giftMid = (gift.priceMin + gift.priceMax) / 2;
  const budgetMid = (budget.min + budget.max) / 2;

  const overlaps = gift.priceMax >= budget.min && gift.priceMin <= budget.max;

  if (overlaps) {
    if (gift.priceMin >= budget.min && gift.priceMax <= budget.max) return 35;
    return 26;
  }

  if (gift.priceMin > budget.max) {
    const difference = gift.priceMin - budget.max;

    if (difference <= 150) return 10;
    if (difference <= 400) return -10;

    return -30;
  }

  if (gift.priceMax < budget.min) {
    const difference = budget.min - gift.priceMax;

    if (difference <= 150) return 14;
    if (giftMid < budgetMid * 0.35) return -6;

    return 4;
  }

  return 0;
}

function getGenderScore(gift: Gift, gender?: string) {
  if (!gender || gender === "Fark etmez") {
    if (includesAny(gift, neutralSignals)) return 8;
    return 0;
  }

  const feminine = includesAny(gift, feminineSignals);
  const masculine = includesAny(gift, masculineSignals);
  const neutral = includesAny(gift, neutralSignals);

  if (gender === "Kadın") {
    if (feminine) return 20;
    if (masculine && !neutral) return -18;
    if (neutral) return 8;
  }

  if (gender === "Erkek") {
    if (masculine) return 20;
    if (feminine && !neutral) return -18;
    if (neutral) return 8;
  }

  return 0;
}

function getRiskPenalty(riskLevel: RiskLevel) {
  if (riskLevel === "low") return 10;
  if (riskLevel === "medium") return 0;
  return -12;
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function getAnswer(answers: AnswerMap, index: number) {
  return answers[index]?.[0];
}

function getAnswers(answers: AnswerMap, index: number) {
  return answers[index] || [];
}

export function getPriceText(gift: Pick<Gift, "priceMin" | "priceMax">) {
  if (gift.priceMin === gift.priceMax) return `${gift.priceMin} TL`;
  return `${gift.priceMin}–${gift.priceMax} TL`;
}

export function getRiskLabel(riskLevel: RiskLevel) {
  if (riskLevel === "low") return "Düşük risk";
  if (riskLevel === "medium") return "Orta risk";
  return "Yüksek risk";
}

export function makeSearchUrl(
  query: string,
  store: "google" | "trendyol" | "amazon" | "hepsiburada" = "google"
) {
  const encoded = encodeURIComponent(query);

  if (store === "trendyol") return `https://www.trendyol.com/sr?q=${encoded}`;
  if (store === "amazon") return `https://www.amazon.com.tr/s?k=${encoded}`;
  if (store === "hepsiburada") return `https://www.hepsiburada.com/ara?q=${encoded}`;

  return `https://www.google.com/search?q=${encoded}`;
}

export function getGiftResults(gifts: Gift[], answers: AnswerMap): ScoredGift[] {
  const recipient = getAnswer(answers, 0);
  const gender = getAnswer(answers, 1);
  const budget = getAnswer(answers, 2);
  const occasion = getAnswer(answers, 3);
  const interests = getAnswers(answers, 4);
  const style = getAnswer(answers, 5);
  const urgency = getAnswer(answers, 6);
  const riskAvoidance = getAnswers(answers, 7);

  const scored = gifts.map((gift) => {
    let score = 0;

    if (recipient && gift.recipients.includes(recipient)) score += 32;
    if (recipient === "Diğer") score += 8;

    score += getGenderScore(gift, gender);
    score += getBudgetScore(gift, budget);

    if (occasion && gift.occasions.includes(occasion)) score += 18;
    if (occasion === "İçimden geldi" && gift.styles.includes("Kullanışlı")) score += 6;

    interests.forEach((interest) => {
      if (gift.interests.includes(interest)) score += 16;

      const mappedCategories = interestCategoryMap[interest] || [];
      if (mappedCategories.some((category) => includesAny(gift, [category]))) {
        score += 8;
      }
    });

    if (style && gift.styles.includes(style)) score += 22;
    if (style === "Deneyim hediyesi" && includesAny(gift, ["Deneyim", "Etkinlik", "Anı"])) {
      score += 16;
    }

    if (urgency && gift.urgency.includes(urgency)) score += 16;
    if (urgency === "Bugün lazım" && gift.urgency.includes("Bugün lazım")) score += 10;

    score += getRiskPenalty(gift.riskLevel);

    riskAvoidance.forEach((risk) => {
      const rule = riskRules[risk];
      if (rule) score += rule(gift);
    });

    if (score < 0) score = 0;

    const matchPercent = Math.max(42, Math.min(98, Math.round(score)));

    return {
      ...gift,
      score,
      matchPercent,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export function makeResultSummary(answers: AnswerMap) {
  const recipient = getAnswer(answers, 0) || "seçilen kişi";
  const gender = getAnswer(answers, 1) || "fark etmez";
  const budget = getAnswer(answers, 2) || "seçilen bütçe";
  const occasion = getAnswer(answers, 3) || "özel gün";
  const style = getAnswer(answers, 5) || "uygun tarz";

  return `${recipient} için ${gender.toLocaleLowerCase("tr")} seçimine uygun, ${budget} aralığında, ${occasion.toLocaleLowerCase("tr")} odaklı ve ${style.toLocaleLowerCase("tr")} tarzına yakın öneriler hazırladık.`;
}

export function makeNotePrompt(gift: Gift, answers: AnswerMap) {
  const recipient = getAnswer(answers, 0) || "özel biri";
  const gender = getAnswer(answers, 1) || "Fark etmez";
  const style = getAnswer(answers, 5) || "Duygusal";

  return uniq([recipient, gender, style, gift.title]).join(" - ");
}
