import { NextResponse } from "next/server";
import { paymentAdmin, paymentUser, paymentConfig, iyzicoRequest, verifyIyzicoSignature } from "@/lib/paymentServer";
import { validateCheckout, type PaymentAttempt } from "@/lib/paymentRules";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const reply = (body: unknown, status = 200) => NextResponse.json(body, {status, headers: {"Cache-Control": "private, no-store"}});
  try {
    const user = await paymentUser(request);
    if (!user) return reply({error: "Giriş yapmalısın."}, 401);
    const id = new URL(request.url).searchParams.get("attempt");
    if (!id || !/^[a-f0-9-]{36}$/i.test(id)) return reply({state: "unverified"});
    const db = paymentAdmin();
    const {data: attempt, error} = await db.from("payment_attempts").select("status,plan").eq("id",id).eq("user_id",user.id).maybeSingle();
    if (error) return reply({error: "Ödeme durumu alınamadı."},503);
    if (!attempt) return reply({state: "unverified"});
    if (attempt.status !== "paid") return reply({state: attempt.status === "failed" || attempt.status === "failed_to_initialize" ? "failed" : "pending"});
    const {data: subscription, error: subscriptionError} = await db.from("user_subscriptions").select("plan").eq("user_id", user.id).eq("status","active").in("plan", attempt.plan === "premium" ? ["premium"] : [attempt.plan, "premium"]).limit(1).maybeSingle();
    if (subscriptionError) return reply({error: "Paket durumu alınamadı."},503);
    return reply({state: subscription ? "active" : "pending", plan: attempt.plan});
  } catch { return reply({error: "Ödeme durumu doğrulanamadı."},503); }
}

// An authenticated owner can reconcile a delayed callback without paying again.
export async function POST(request: Request) {
  try {
    const user = await paymentUser(request);
    if (!user) return NextResponse.json({error:"Giriş yapmalısın."},{status:401});
    const id = new URL(request.url).searchParams.get("attempt");
    if (!id || !/^[a-f0-9-]{36}$/i.test(id)) return NextResponse.json({state:"unverified"});
    const db = paymentAdmin();
    const {data: attempt,error} = await db.from("payment_attempts").select("id,user_id,plan,price,iyzico_token,status,provider_environment").eq("id",id).eq("user_id",user.id).maybeSingle();
    if (error) throw new Error("Database unavailable");
    if (attempt && attempt.status !== "paid" && attempt.iyzico_token && attempt.provider_environment === paymentConfig().mode) {
      const result = await iyzicoRequest("/payment/iyzipos/checkoutform/auth/ecom/detail",{locale:"tr",conversationId:attempt.id,token:attempt.iyzico_token});
      if (verifyIyzicoSignature(result) && validateCheckout(result,attempt as PaymentAttempt)==="approved") {
        const {error: activationError} = await db.rpc("nealsam_activate_payment",{p_attempt_id:attempt.id,p_token:attempt.iyzico_token,p_payment_id:String(result.paymentId),p_price:Number(result.paidPrice),p_currency:"TRY"});
        if (activationError) throw new Error("Activation unavailable");
      }
    }
    return GET(request);
  } catch {return NextResponse.json({error:"Ödeme durumu doğrulanamadı. Yeniden ödeme yapma; daha sonra kontrol et."},{status:503,headers:{"Cache-Control":"no-store"}});}
}
