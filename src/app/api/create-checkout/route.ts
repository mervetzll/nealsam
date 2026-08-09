import { NextResponse } from "next/server";
import Iyzipay from "iyzipay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const planPrices: Record<string, { name: string; price: string }> = {
  plus: { name: "NeAlsam Plus", price: "49.00" },
  experience: { name: "NeAlsam Deneyim", price: "79.00" },
  premium: { name: "NeAlsam Premium", price: "99.00" },
};

function failRedirect(request: Request, reason: string) {
  const failUrl = new URL("/odeme/basarisiz", request.url);
  failUrl.searchParams.set("reason", reason);
  return NextResponse.redirect(failUrl);
}

function getIyzipayClient() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const uri = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    throw new Error("IYZICO_ENV_MISSING");
  }

  return new Iyzipay({
    apiKey,
    secretKey,
    uri,
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const plan = url.searchParams.get("plan") || "premium";
    const selectedPlan = planPrices[plan];

    if (!selectedPlan) {
      return NextResponse.redirect(new URL("/paketler", request.url));
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://nealsamhediye.com";

    const iyzipay = getIyzipayClient();

    const conversationId = `nealsam-${plan}-${Date.now()}`;
    const price = selectedPlan.price;

    const checkoutRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: conversationId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${siteUrl}/api/iyzico/callback?plan=${encodeURIComponent(plan)}`,
      enabledInstallments: [1],
      buyer: {
        id: "nealsam-test-user",
        name: "Gul",
        surname: "Merve",
        gsmNumber: "+905350000000",
        email: "test@nealsamhediye.com",
        identityNumber: "11111111111",
        lastLoginDate: "2026-08-09 18:00:00",
        registrationDate: "2026-08-09 18:00:00",
        registrationAddress: "Istanbul",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },
      shippingAddress: {
        contactName: "Gul Merve",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital hizmet",
        zipCode: "34000",
      },
      billingAddress: {
        contactName: "Gul Merve",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital hizmet",
        zipCode: "34000",
      },
      basketItems: [
        {
          id: plan,
          name: selectedPlan.name,
          category1: "Dijital Hediye Deneyimi",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price,
        },
      ],
    };

    const result = await new Promise<any>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(
        checkoutRequest,
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    if (result?.status !== "success" || !result?.paymentPageUrl) {
      console.error("iyzico checkout error", {
        status: result?.status,
        errorCode: result?.errorCode,
        errorMessage: result?.errorMessage,
      });

      return failRedirect(
        request,
        result?.errorMessage || result?.errorCode || "iyzico_error"
      );
    }

    return NextResponse.redirect(result.paymentPageUrl);
  } catch (error: any) {
    console.error("create-checkout failed", error?.message || error);

    return failRedirect(
      request,
      error?.message || "checkout_failed"
    );
  }
}
