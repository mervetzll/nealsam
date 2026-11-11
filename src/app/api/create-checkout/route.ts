import { NextResponse } from "next/server";
import { isPaymentPlan, PAYMENT_PLANS, parseBuyer } from "@/lib/paymentRules";
import { paymentUser, paymentAdmin, paymentConfig, iyzicoRequest, verifyIyzicoSignature, safePaymentPage, schemaReady } from "@/lib/paymentServer";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
function json(body: unknown, status = 200) { return NextResponse.json(body, {status, headers: {"Cache-Control": "private, no-store"}}); }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = body.plan as unknown;
    if (!isPaymentPlan(plan)) return json({ok: false, error: "Geçersiz paket seçimi."}, 400);
    const user = await paymentUser(request);
    if (!user?.email) return json({ok: false, error: "Ödeme için giriş yapmalısın."}, 401);
    const config = paymentConfig();
    if (!config.ready || !await schemaReady()) return json({ok: false, error: "Ödeme henüz kullanıma açılmadı. Daha sonra tekrar kontrol edebilirsin."}, 503);
    if (config.mode === "sandbox" && !config.testEmails.includes(user.email.toLowerCase())) return json({ok: false, error: "Test ödemesi yalnızca izin verilen test hesabına açıktır."}, 403);
    const buyer = parseBuyer(body.buyer);
    if (!buyer) return json({ok: false, error: "Ad, soyad, telefon, T.C. kimlik numarası ve fatura adresini kontrol et."}, 400);
    const admin = paymentAdmin();
    const selected = PAYMENT_PLANS[plan];
    const {data: attempt, error} = await admin.from("payment_attempts").insert({user_id: user.id, email: user.email, plan: body.plan, price: selected.price, status: "created", provider_environment: config.mode}).select("id").single();
    if (error || !attempt) return json({ok: false, error: "Ödeme kaydı oluşturulamadı."}, 503);
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.nealsamhediye.com";
    const result = await iyzicoRequest("/payment/iyzipos/checkoutform/initialize/auth/ecom", {
      locale: "tr", conversationId: attempt.id, price: selected.price.toFixed(2), paidPrice: selected.price.toFixed(2), currency: "TRY", basketId: `nealsam-${attempt.id}`, paymentGroup: "PRODUCT", callbackUrl: new URL("/api/iyzico/callback", site).toString(), enabledInstallments: [1],
      buyer: {id: user.id, name: buyer.name, surname: buyer.surname, gsmNumber: buyer.phone, email: user.email, identityNumber: buyer.identityNumber, registrationAddress: buyer.address, ip: request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1", city: buyer.city, country: "Turkey"},
      billingAddress: {contactName: `${buyer.name} ${buyer.surname}`, city: buyer.city, country: "Turkey", address: buyer.address},
      basketItems: [{id: body.plan, name: `NeAlsam ${selected.name}`, category1: "Dijital Hediye Paketi", itemType: "VIRTUAL", price: selected.price.toFixed(2)}],
    });
    if (result.status !== "success" || result.conversationId !== attempt.id || typeof result.token !== "string" || !verifyIyzicoSignature(result, true) || !safePaymentPage(result.paymentPageUrl)) {
      await admin.from("payment_attempts").update({status: "failed_to_initialize", updated_at: new Date().toISOString()}).eq("id", attempt.id);
      return json({ok: false, error: "Ödeme sağlayıcısı bağlantıyı başlatamadı. Ücret alınmadı; daha sonra tekrar deneyebilirsin."}, 502);
    }
    const {error: saveError} = await admin.from("payment_attempts").update({iyzico_token: result.token, status: "initialized", updated_at: new Date().toISOString()}).eq("id", attempt.id);
    if (saveError) return json({ok: false, error: "Ödeme bağlantısı kaydedilemedi. İşlem başlatılmadı."}, 503);
    return json({ok: true, paymentPageUrl: result.paymentPageUrl});
  } catch { return json({ok: false, error: "Ödeme bağlantısı kurulamadı. Yeniden dene."}, 503); }
}
