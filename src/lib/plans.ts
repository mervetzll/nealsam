export type PlanId = "free" | "note" | "experience" | "premium";

export type ExperienceMode =
  | "not"
  | "kader"
  | "anti"
  | "rpg"
  | "av"
  | "gelecek"
  | "gizemli";

export const PLAN_LIMITS: Record<PlanId, number> = {
  free: 5,
  note: 30,
  experience: 20,
  premium: 100,
};

export const PLAN_NAMES: Record<PlanId, string> = {
  free: "Ücretsiz",
  note: "Not Paketi - 49 TL / ay",
  experience: "Deneyim Paketi - 99 TL / ay",
  premium: "Premium Özel Paket - 149 TL / ay",
};

export const PLAN_PERMISSIONS: Record<
  PlanId,
  {
    modes: ExperienceMode[];
    canUseQr: boolean;
    canDownloadCard: boolean;
    canUsePremiumPanel: boolean;
  }
> = {
  free: {
    modes: ["not", "anti", "rpg"],
    canUseQr: true,
    canDownloadCard: false,
    canUsePremiumPanel: false,
  },
  note: {
    modes: ["not", "anti", "rpg"],
    canUseQr: true,
    canDownloadCard: true,
    canUsePremiumPanel: true,
  },
  experience: {
    modes: ["kader", "av", "gelecek", "gizemli", "anti", "rpg"],
    canUseQr: true,
    canDownloadCard: true,
    canUsePremiumPanel: true,
  },
  premium: {
    modes: ["not", "kader", "anti", "rpg", "av", "gelecek", "gizemli"],
    canUseQr: true,
    canDownloadCard: true,
    canUsePremiumPanel: true,
  },
};

export function normalizePlan(plan: string | null): PlanId {
  if (plan === "note" || plan === "experience" || plan === "premium") {
    return plan;
  }

  return "free";
}

export function canUseMode(plan: string | null, mode: ExperienceMode) {
  const normalizedPlan = normalizePlan(plan);

  return PLAN_PERMISSIONS[normalizedPlan].modes.includes(mode);
}

export function canDownloadCard(plan: string | null) {
  const normalizedPlan = normalizePlan(plan);

  return PLAN_PERMISSIONS[normalizedPlan].canDownloadCard;
}

export function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function getUsedCount(plan: string | null) {
  if (typeof window === "undefined") return 0;

  const normalizedPlan = normalizePlan(plan);
  const month = getCurrentMonthKey();
  const usage = JSON.parse(localStorage.getItem("nealsam_usage") || "{}");

  return usage?.[month]?.[normalizedPlan] || 0;
}

export function increaseUsedCount(plan: string | null) {
  if (typeof window === "undefined") return;

  const normalizedPlan = normalizePlan(plan);
  const month = getCurrentMonthKey();
  const usage = JSON.parse(localStorage.getItem("nealsam_usage") || "{}");
  const currentCount = usage?.[month]?.[normalizedPlan] || 0;

  usage[month] = {
    ...(usage[month] || {}),
    [normalizedPlan]: currentCount + 1,
  };

  localStorage.setItem("nealsam_usage", JSON.stringify(usage));
}
