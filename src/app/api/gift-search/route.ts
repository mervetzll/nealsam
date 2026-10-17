import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { GET as getCatalog } from "../gifts/route";
import { allowSearch, readAllowance, searchHash, signAllowance } from "@/lib/searchAllowance";
import { getMatchScore, type Answers, type Gift } from "@/lib/giftMatching";
import { budgetLimit, fitsBudget } from "@/lib/giftBudget";
import { diversifyGifts, excludesGift } from "@/lib/giftSelection";
import { cleanGiftTitle, getRawGiftTitle } from "@/lib/giftPresentation";
import { buildGiftPlan } from "@/lib/giftPlan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const cookieName = "nealsam_search_trial";
const devSecret = randomBytes(32).toString("hex");
function secret() {
  const key = process.env.GIFT_SEARCH_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key && process.env.NODE_ENV === "production") throw new Error("Search signing key missing");
  return key || devSecret;
}
function json(body: unknown, status = 200) { return NextResponse.json(body, {status, headers: {"Cache-Control": "private, no-store"}}); }
async function paidAccess(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization) return false;
  const token = authorization.replace(/^Bearer\s+/i, "");
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {global: {headers: {Authorization: `Bearer ${token}`}}, auth: {persistSession: false}});
  const {data: {user}, error} = await db.auth.getUser(token);
  if (error || !user) throw new Error("AUTH");
  const subscriptionDb = process.env.SUPABASE_SERVICE_ROLE_KEY ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, {auth: {persistSession: false}}) : db;
  const {data, error: subscriptionError} = await subscriptionDb.from("user_subscriptions").select("plan").eq("user_id", user.id).eq("status", "active").in("plan", ["plus", "premium"]).limit(1);
  if (subscriptionError) throw new Error("SUBSCRIPTION");
  return Boolean(data?.length);
}
export async function GET(request: NextRequest) {
  try {
    const paid = await paidAccess(request);
    const hashes = readAllowance(request.cookies.get(cookieName)?.value, secret());
    return json({paid, remaining: Math.max(0, 3 - hashes.length)});
  } catch { return json({error: "Paket bilgisi doğrulanamadı. Tekrar dene."}, 503); }
}
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") && request.headers.get("origin") !== request.nextUrl.origin) return json({error: "Geçersiz istek."}, 403);
  try {
    const body = await request.json();
    const keys = ["relation", "style", "interest", "budget", "urgency", "occasion", "exclude"] as const;
    if (!body.answers || keys.some(key => typeof body.answers[key] !== "string" || body.answers[key].length > 250)) return json({error: "Tercihlerini kontrol et."}, 400);
    const answers = Object.fromEntries(keys.map(key => [key, body.answers[key].trim()])) as Answers;
    const paid = await paidAccess(request);
    const key = secret();
    const hashes = readAllowance(request.cookies.get(cookieName)?.value, key);
    const hash = searchHash(answers);
    const isPlan = body.action === "plan";
    if (isPlan && !paid) return json({error: "Kişisel plan için aktif Plus veya Premium paketi gerekir."}, 402);
    if (!isPlan && !allowSearch(hashes, hash, paid).allowed) return json({error: "Ücretsiz arama hakkın doldu.", checkout: "/odeme?plan=plus"}, 402);
    const catalog = await (await getCatalog()).json();
    const gifts: Gift[] = catalog.gifts.map((gift: Gift) => ({...gift, title: cleanGiftTitle(getRawGiftTitle(gift))}));
    const results = diversifyGifts(gifts.filter(gift => fitsBudget(gift, budgetLimit(answers.budget)) && !excludesGift(gift, answers.exclude)).map(gift => ({gift, score: getMatchScore(gift, answers)})).sort((a,b) => b.score-a.score));
    if (isPlan) {
      const selected = results.find(({gift}) => gift.id === body.giftId);
      if (!selected) return json({error: "Bu tercihlere uygun bir hediye seç."}, 400);
      if (typeof body.recipient !== "string" || body.recipient.length > 80 || typeof body.memory !== "string" || body.memory.length > 400) return json({error: "İsim veya anı çok uzun."}, 400);
      return json({plan: buildGiftPlan(selected.gift, results.slice(0,8).map(item => item.gift), answers, body.recipient.trim(), body.memory.trim())});
    }
    const allowance = allowSearch(hashes, hash, paid, results.length > 0);
    const response = json({results, remaining: allowance.remaining, paid});
    if (!paid && results.length > 0) response.cookies.set(cookieName, signAllowance(allowance.hashes, key), {httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365});
    return response;
  } catch (error) { return json({error: error instanceof SyntaxError ? "Geçersiz arama." : "Arama veya paket kontrolü tamamlanamadı. Hakkın harcanmadı; yeniden dene."}, error instanceof SyntaxError ? 400 : 503); }
}
