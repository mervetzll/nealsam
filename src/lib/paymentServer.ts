import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { moneyString, type CheckoutResult } from "./paymentRules";

export function paymentAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key === "[SENSITIVE]") throw new Error("Payment database unavailable");
  return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}
export function paymentConfig() {
  const base = (process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com").replace(/\/$/, "");
  const mode = base === "https://api.iyzipay.com" ? "live" : base === "https://sandbox-api.iyzipay.com" ? "sandbox" : "disabled";
  const credentials = [process.env.IYZICO_API_KEY, process.env.IYZICO_SECRET_KEY].every(value => Boolean(value && value !== "[SENSITIVE]"));
  const testEmails = (process.env.IYZICO_TEST_EMAILS || "").split(",").map(email => email.trim().toLowerCase()).filter(Boolean);
  return {base, mode, testEmails, ready: credentials && ((mode === "sandbox" && testEmails.length > 0) || (mode === "live" && process.env.PAYMENTS_ENABLED === "true"))};
}
export async function paymentUser(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {auth: {persistSession: false}});
  const {data: {user}, error} = await client.auth.getUser(token);
  return error ? null : user;
}
export async function iyzicoRequest(path: string, body: Record<string, unknown>): Promise<CheckoutResult> {
  const {base} = paymentConfig();
  if (!["https://api.iyzipay.com", "https://sandbox-api.iyzipay.com"].includes(base)) throw new Error("Invalid provider URL");
  const random = randomBytes(16).toString("hex");
  const raw = JSON.stringify(body);
  const digest = createHmac("sha256", process.env.IYZICO_SECRET_KEY!).update(random + path + raw).digest("hex");
  const auth = Buffer.from(`apiKey:${process.env.IYZICO_API_KEY}&randomKey:${random}&signature:${digest}`).toString("base64");
  const response = await fetch(`${base}${path}`, {method: "POST", headers: {"Content-Type": "application/json", "x-iyzi-rnd": random, Authorization: `IYZWSv2 ${auth}`}, body: raw, signal: AbortSignal.timeout(20000), cache: "no-store"});
  if (!response.ok) throw new Error("Provider unavailable");
  return response.json();
}
export function verifyIyzicoSignature(result: CheckoutResult, initialize = false) {
  const fields = initialize ? ["conversationId", "token"] : ["paymentStatus", "paymentId", "currency", "basketId", "conversationId", "paidPrice", "price", "token"];
  if (fields.some(field => result[field] === undefined || result[field] === null)) return false;
  const values = fields.map(field => field === "price" || field === "paidPrice" ? moneyString(result[field]) : String(result[field]));
  const expected = createHmac("sha256", process.env.IYZICO_SECRET_KEY!).update(values.join(":")).digest("hex");
  const actual = result.signature;
  return typeof actual === "string" && /^[a-f0-9]{64}$/i.test(actual) && timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}
export function safePaymentPage(value: unknown) {
  if (typeof value !== "string") return false;
  try { const url = new URL(value); return url.protocol === "https:" && ["sandbox-cpp.iyzipay.com", "cpp.iyzipay.com"].includes(url.hostname); } catch { return false; }
}
export async function schemaReady() {
  try { const {data,error} = await paymentAdmin().rpc("nealsam_payment_schema_ready"); return !error && data === true; } catch { return false; }
}
