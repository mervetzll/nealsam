import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

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

function createAuthorizationHeader({
  uri,
  body,
  randomString,
}: {
  uri: string;
  body: string;
  randomString: string;
}) {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("Iyzico environment variables are missing");
  }

  const payload = randomString + uri + body;
  const encryptedData = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex");

  const authorizationString = `apiKey:${apiKey}&randomKey:${randomString}&signature:${encryptedData}`;

  return `IYZWSv2 ${Buffer.from(authorizationString).toString("base64")}`;
}

async function retrieveCheckoutForm(token: string) {
  const baseUrl =
    process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";

  const endpointPath = "/payment/iyzipos/checkoutform/auth/ecom/detail";
  const endpointUrl = `${baseUrl}${endpointPath}`;

  const requestBody = {
    locale: "tr",
    token,
  };

  const rawBody = JSON.stringify(requestBody);
  const randomString = `${Date.now()}${Math.random()}`;

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-iyzi-rnd": randomString,
      Authorization: createAuthorizationHeader({
        uri: endpointPath,
        body: rawBody,
        randomString,
      }),
    },
    body: rawBody,
  });

  return response.json();
}

async function handleCallback(request: Request) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://nealsamhediye.com";

  try {
    const formData = await request.formData();
    const token = String(formData.get("token") || "");

    if (!token) {
      return NextResponse.redirect(`${siteUrl}/odeme/basarisiz`);
    }

    const supabaseAdmin = getSupabaseAdmin();
    const result = await retrieveCheckoutForm(token);

    const { data: attempt } = await supabaseAdmin
      .from("payment_attempts")
      .select("*")
      .eq("iyzico_token", token)
      .maybeSingle();

    if (!attempt) {
      return NextResponse.redirect(`${siteUrl}/odeme/basarisiz`);
    }

    if (result.status === "success" && result.paymentStatus === "SUCCESS") {
      await supabaseAdmin
        .from("payment_attempts")
        .update({
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", attempt.id);

      await supabaseAdmin
        .from("user_subscriptions")
        .update({ status: "inactive" })
        .eq("user_id", attempt.user_id)
        .eq("status", "active");

      await supabaseAdmin.from("user_subscriptions").insert({
        user_id: attempt.user_id,
        plan: attempt.plan,
        status: "active",
        started_at: new Date().toISOString(),
      });

      return NextResponse.redirect(`${siteUrl}/odeme/basarili`);
    }

    await supabaseAdmin
      .from("payment_attempts")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", attempt.id);

    return NextResponse.redirect(`${siteUrl}/odeme/basarisiz`);
  } catch (error) {
    console.error("iyzico callback error", error);
    return NextResponse.redirect(`${siteUrl}/odeme/basarisiz`);
  }
}

export async function POST(request: Request) {
  return handleCallback(request);
}

export async function GET(request: Request) {
  return handleCallback(request);
}
