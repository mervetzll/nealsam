import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const status = String(formData.get("status") || "");
  const token = String(formData.get("token") || "");

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "premium";

  if (status === "success" && token) {
    const successUrl = new URL("/odeme/basarili", request.url);
    successUrl.searchParams.set("plan", plan);
    return NextResponse.redirect(successUrl, 303);
  }

  const failUrl = new URL("/odeme/basarisiz", request.url);
  failUrl.searchParams.set("plan", plan);
  return NextResponse.redirect(failUrl, 303);
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/odeme/basarisiz", request.url));
}
