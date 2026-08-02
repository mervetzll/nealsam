import { Suspense } from "react";
import OdemeClient from "./OdemeClient";

export const metadata = {
  title: "Ödeme | NeAlsam Hediye",
  description:
    "NeAlsam Hediye paket ödeme sayfası. Premium deneyim, QR mesaj ve hediye notu paketlerini onayla.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff4ef] px-5 py-16 text-center">
          <p className="font-bold text-[#2b1b1b]">Ödeme sayfası yükleniyor...</p>
        </main>
      }
    >
      <OdemeClient />
    </Suspense>
  );
}
