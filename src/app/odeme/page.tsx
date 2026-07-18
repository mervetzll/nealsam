import { Suspense } from "react";
import OdemeClient from "./OdemeClient";

export default function OdemePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#fffaf7] px-6 py-10 text-[#2b1b1b]">
          <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-bold text-[#b83280]">NeAlsam</p>
            <h1 className="mt-3 text-3xl font-extrabold">Ödeme sayfası yükleniyor...</h1>
          </div>
        </main>
      }
    >
      <OdemeClient />
    </Suspense>
  );
}
