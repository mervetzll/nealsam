import { NextResponse } from "next/server";
import { iyzicoRequest, paymentAdmin, paymentConfig, verifyIyzicoSignature } from "@/lib/paymentServer";
import { validateCheckout, type PaymentAttempt } from "@/lib/paymentRules";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
function redirect(path: string) { return NextResponse.redirect(new URL(path, process.env.NEXT_PUBLIC_SITE_URL || "https://www.nealsamhediye.com"), 303); }
async function callback(request: Request) {
  let attemptId = "";
  try {
    const token = request.method === "GET" ? new URL(request.url).searchParams.get("token") : (await request.formData()).get("token");
    if (typeof token !== "string" || !/^[a-zA-Z0-9_-]{10,200}$/.test(token)) return redirect("/odeme/basarisiz");
    const admin = paymentAdmin();
    const {data: attempt, error} = await admin.from("payment_attempts").select("id,user_id,plan,price,iyzico_token,status,provider_environment").eq("iyzico_token", token).maybeSingle();
    if (error || !attempt) return redirect("/odeme/basarisiz");
    attemptId = attempt.id;
    if (attempt.status === "paid") return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
    if (attempt.provider_environment !== paymentConfig().mode) return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
    const result = await iyzicoRequest("/payment/iyzipos/checkoutform/auth/ecom/detail", {locale: "tr", conversationId: attempt.id, token});
    if (!verifyIyzicoSignature(result)) return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
    const verdict = validateCheckout(result, attempt as PaymentAttempt);
    if (verdict === "approved") {
      const {error: activationError} = await admin.rpc("nealsam_activate_payment", {p_attempt_id: attempt.id, p_token: token, p_payment_id: String(result.paymentId), p_price: Number(result.paidPrice), p_currency: "TRY"});
      if (activationError) return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
      return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
    }
    if (verdict === "failed" && result.paymentStatus === "FAILURE") {
      await admin.from("payment_attempts").update({status: "failed", updated_at: new Date().toISOString()}).eq("id", attempt.id).neq("status", "paid");
      return redirect("/odeme/basarisiz");
    }
    return redirect(`/odeme/basarili?attempt=${encodeURIComponent(attempt.id)}`);
  } catch { return redirect(attemptId ? `/odeme/basarili?attempt=${encodeURIComponent(attemptId)}` : "/odeme/basarisiz"); }
}
export const POST = callback;
export const GET = callback;
