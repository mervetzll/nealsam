export const PAYMENT_PLANS = {
  plus: {name: "Plus", price: 49},
  experience: {name: "Deneyim", price: 79},
  premium: {name: "Premium", price: 99},
} as const;
export type PaymentPlan = keyof typeof PAYMENT_PLANS;
export function isPaymentPlan(value: unknown): value is PaymentPlan {
  return typeof value === "string" && Object.hasOwn(PAYMENT_PLANS, value);
}
export type BuyerDetails = {name: string; surname: string; phone: string; identityNumber: string; address: string; city: string};
export function parseBuyer(value: unknown): BuyerDetails | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const keys = ["name", "surname", "phone", "identityNumber", "address", "city"] as const;
  if (keys.some(key => typeof source[key] !== "string" || (source[key] as string).length > 500)) return null;
  const result = Object.fromEntries(keys.map(key => [key, (source[key] as string).trim()])) as BuyerDetails;
  result.phone = result.phone.replace(/[\s()-]/g, "");
  if (result.phone.startsWith("05")) result.phone = `+9${result.phone}`;
  if (result.phone.startsWith("5")) result.phone = `+90${result.phone}`;
  return result.name.length >= 2 && result.surname.length >= 2 && result.city.length >= 2 && result.address.length >= 10 && /^\+\d{10,15}$/.test(result.phone) && /^\d{11}$/.test(result.identityNumber) ? result : null;
}
export type PaymentAttempt = {id: string; user_id: string; plan: string; price: number | string; iyzico_token: string; status: string};
export type CheckoutResult = Record<string, unknown>;
export function moneyString(value: unknown): string {
  if ((typeof value !== "string" && typeof value !== "number") || !/^\d+(\.\d+)?$/.test(String(value))) return "";
  return String(value).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
}
export function validateCheckout(result: CheckoutResult, attempt: PaymentAttempt) {
  if (!isPaymentPlan(attempt.plan) || moneyString(attempt.price) !== String(PAYMENT_PLANS[attempt.plan].price)) return "invalid_order";
  if (result.token !== attempt.iyzico_token || result.conversationId !== attempt.id || result.basketId !== `nealsam-${attempt.id}` || result.currency !== "TRY") return "mismatch";
  if (moneyString(result.price) !== moneyString(attempt.price) || moneyString(result.paidPrice) !== moneyString(attempt.price)) return "amount_mismatch";
  if (result.status !== "success" || result.paymentStatus !== "SUCCESS") return "failed";
  if (Number(result.fraudStatus) !== 1) return "review";
  if (typeof result.paymentId !== "string" || !result.paymentId) return "invalid_payment";
  return "approved";
}
