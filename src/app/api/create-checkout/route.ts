import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const Iyzipay = require("iyzipay");

export const dynamic = "force-dynamic";

const plans = {
  plus: {
    name: "NeAlsam Plus",
    price: 49,
  },
  experience: {
    name: "NeAlsam Deneyim",
    price: 79,
  },
  premium: {
    name: "NeAlsam Premium",
    price: 99,
  },
};

type PlanId = keyof typeof plans;

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getIyzicoClient() {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

  if (!apiKey || !secretKey) {
    throw new Error("Iyzico environment variables are missing");
  }

  return new Iyzipay({
    apiKey,
    secretKey,
    uri: baseUrl,
  });
}

function createCheckoutForm(iyzipay: any, request: any) {
  return new Promise<any>((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (error: any, result: any) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

async function getUserFromAuthHeader(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) return null;

  const supabase = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = body.plan as PlanId;

    if (!plan || !plans[plan]) {
      return NextResponse.json(
        { ok: false, error: "Geçersiz paket seçimi." },
        { status: 400 }
      );
    }

    const user = await getUserFromAuthHeader(request);

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Ödeme için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const selectedPlan = plans[plan];
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://nealsamhediye.com";

    const supabaseAdmin = getSupabaseAdmin();

    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from("payment_attempts")
      .insert({
        user_id: user.id,
        email: user.email || "",
        plan,
        price: selectedPlan.price,
        status: "created",
      })
      .select("id")
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { ok: false, error: attemptError?.message || "Ödeme kaydı oluşturulamadı." },
        { status: 500 }
      );
    }

    const iyzipay = getIyzicoClient();

    const price = selectedPlan.price.toFixed(2);

    const checkoutRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: attempt.id,
      price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `nealsam-${attempt.id}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${siteUrl}/api/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: user.id,
        name: user.email?.split("@")[0] || "NeAlsam",
        surname: "Kullanıcı",
        gsmNumber: "+905350000000",
        email: user.email || "test@nealsamhediye.com",
        identityNumber: "11111111111",
        lastLoginDate: "2026-01-01 12:00:00",
        registrationDate: "2026-01-01 12:00:00",
        registrationAddress: "Istanbul",
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },
      shippingAddress: {
        contactName: user.email || "NeAlsam Kullanıcı",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital ürün",
        zipCode: "34000",
      },
      billingAddress: {
        contactName: user.email || "NeAlsam Kullanıcı",
        city: "Istanbul",
        country: "Turkey",
        address: "Dijital ürün",
        zipCode: "34000",
      },
      basketItems: [
        {
          id: plan,
          name: selectedPlan.name,
          category1: "Dijital Hediye Paketi",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price,
        },
      ],
    };

    const result = await createCheckoutForm(iyzipay, checkoutRequest);

    if (result.status !== "success") {
      await supabaseAdmin
        .from("payment_attempts")
        .update({
          status: "failed_to_initialize",
          updated_at: new Date().toISOString(),
        })
        .eq("id", attempt.id);

      return NextResponse.json(
        {
          ok: false,
          error: result.errorMessage || "iyzico ödeme formu başlatılamadı.",
        },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("payment_attempts")
      .update({
        iyzico_token: result.token,
        status: "initialized",
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id);

    return NextResponse.json({
      ok: true,
      paymentPageUrl: result.paymentPageUrl,
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
    });
  } catch (error: any) {
    console.error("create-checkout error", error);

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Ödeme başlatılamadı.",
      },
      { status: 500 }
    );
  }
}
