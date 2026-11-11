import { Suspense } from "react";
import PaymentResult from "./PaymentResult";
export const metadata = {
  title: "Ödeme Durumu | NeAlsam Hediye",
  description: "Ödeme ve paket aktivasyonunu kontrol edin.",
  robots: {index: false, follow: false},
};
export default function PaymentResultPage() {
  return <Suspense fallback={<main className="p-10 text-center">Ödeme durumu kontrol ediliyor…</main>}><PaymentResult /></Suspense>;
}
