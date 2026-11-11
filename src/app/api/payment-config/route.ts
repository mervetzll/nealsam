import { NextResponse } from "next/server";
import { paymentConfig, schemaReady } from "@/lib/paymentServer";
export const dynamic = "force-dynamic";
export async function GET() {
  const config = paymentConfig();
  return NextResponse.json({mode: config.mode, ready: config.ready && await schemaReady()}, {headers: {"Cache-Control": "no-store"}});
}
