import { Suspense } from "react";
import OdemeClient from "./OdemeClient";

export const metadata = {
  title: "Ödeme | NeAlsam Hediye",
  description: "NeAlsam Hediye paket ödeme sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fff4ef] px-5 py-16">
          <section className="mx-auto max-w-3xl rounded-[2rem] border border-pink-100 bg-white p-8 text-center shadow-sm">
            <p className="font-black text-[#2b1b1b]">Ödeme sayfası yükleniyor...</p>
          </section>
        </main>
      }
    >
      <OdemeClient />
    </Suspense>
  );
}
