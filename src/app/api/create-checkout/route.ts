import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Online ödeme altyapısı şu anda hazırlık modunda. Premium erişim şimdilik admin panelden manuel tanımlanır.",
    },
    { status: 503 }
  );
}
