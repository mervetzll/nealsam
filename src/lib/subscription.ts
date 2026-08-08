import { supabase } from "@/lib/supabase";

export type UserPlan = "free" | "note" | "plus" | "experience" | "premium";

export async function getCurrentUserPlan(): Promise<UserPlan> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "free";

  const { data } = await supabase
    .from("user_subscriptions")
    .select("plan, status, started_at")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.plan as UserPlan) || "free";
}

export function isPremiumPlan(plan: UserPlan) {
  return plan === "plus" || plan === "experience" || plan === "premium";
}

export function getPlanLabel(plan: UserPlan) {
  const labels: Record<UserPlan, string> = {
    free: "Free",
    note: "Hediye Notu",
    plus: "Plus",
    experience: "Deneyim",
    premium: "Premium",
  };

  return labels[plan] || "Free";
}
