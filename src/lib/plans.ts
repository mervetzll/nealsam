export type PlanId = "free" | "note" | "experience" | "basic" | "plus" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
};

export const PLAN_NAMES: Record<PlanId, string> = {
  free: "Ücretsiz",
  note: "Not Paketi",
  experience: "Deneyim Paketi",
  basic: "Mini Hediye Paketi",
  plus: "Özel Hediye Paketi",
  premium: "Hikâyeli Hediye Paketi",
};

export const PLAN_LIMITS: Record<PlanId, number> = {
  free: 1,
  note: 30,
  experience: 20,
  basic: 3,
  plus: 10,
  premium: 999,
};

export const plans: Plan[] = [
  {
    id: "note",
    name: "Not Paketi",
    price: 29,
    description: "QR kodlu kişisel not ve hediye mesajı hazırlama paketi.",
    features: [
      "Premium notlar",
      "QR kodlu mesaj",
      "WhatsApp metni",
      "Kart olarak indir",
    ],
  },
  {
    id: "experience",
    name: "Deneyim Paketi",
    price: 79,
    description: "Hediye Avı, Kader Bağları, Gizemli Hediye ve yaratıcı deneyim modları.",
    features: [
      "Hediye Avı",
      "Kader Bağları",
      "Gizemli Hediye",
      "Gelecekteki Ben",
    ],
  },
  {
    id: "basic",
    name: "Mini Hediye Paketi",
    price: 49,
    description: "Hızlı hediye fikri ve kısa not önerisi.",
    features: [
      "Kişiye göre hediye fikri",
      "Kısa kişisel not",
      "Ürün arama yönlendirmesi",
    ],
  },
  {
    id: "plus",
    name: "Özel Hediye Paketi",
    price: 99,
    description: "Daha özel fikir, not ve sunum önerisi.",
    features: [
      "Daha detaylı hediye fikri",
      "Kişisel not metni",
      "Sunum önerisi",
      "Alternatif hediye fikirleri",
    ],
  },
  {
    id: "premium",
    name: "Hikâyeli Hediye Paketi",
    price: 149,
    description: "Hediye fikri, mektup ve yaratıcı hikâye sunumu.",
    features: [
      "Özel hediye fikri",
      "Duygusal mektup",
      "Hediye hikâyesi",
      "Sunum konsepti",
      "Alternatif mağaza aramaları",
    ],
  },
];

export function getPlanById(id: string | null) {
  return plans.find((plan) => plan.id === id) || null;
}

export function normalizePlan(plan: string | null | undefined): PlanId {
  if (
    plan === "note" ||
    plan === "experience" ||
    plan === "basic" ||
    plan === "plus" ||
    plan === "premium"
  ) {
    return plan;
  }

  return "free";
}

export function getUsedCount(key = "nealsam_used_count") {
  if (typeof window === "undefined") return 0;

  const value = window.localStorage.getItem(key);
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function canUseMode(plan: string | null | undefined, mode?: string) {
  const normalizedPlan = normalizePlan(plan);

  if (normalizedPlan === "premium") return true;

  if (normalizedPlan === "experience") return true;

  if (normalizedPlan === "plus") {
    return mode !== "gizemli";
  }

  if (normalizedPlan === "basic") {
    return mode === "not" || mode === "kader" || !mode;
  }

  if (normalizedPlan === "note") {
    return mode === "not" || !mode;
  }

  return mode === "not" || !mode;
}

export function canDownloadCard(plan: string | null | undefined) {
  const normalizedPlan = normalizePlan(plan);

  return (
    normalizedPlan === "note" ||
    normalizedPlan === "experience" ||
    normalizedPlan === "basic" ||
    normalizedPlan === "plus" ||
    normalizedPlan === "premium"
  );
}
