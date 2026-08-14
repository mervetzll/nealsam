import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const Iyzipay = require("iyzipay");

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

function retrieveCheckoutForm(iyzipay: any, token: string) {
  return new Promise<any>((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      {
        locale: Iyzipay.LOCALE.TR,
        token,
      },
      (error: any, result: any) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );
  });
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
    const iyzipay = getIyzicoClient();

    const result = await retrieveCheckoutForm(iyzipay, token);

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
