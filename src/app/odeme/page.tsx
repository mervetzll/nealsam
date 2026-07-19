import { Suspense } from "react";
import OdemeClient from "./OdemeClient";

export const metadata = {
  title: "Güvenli Ödeme | NeAlsam Hediye",
  description: "NeAlsam Hediye paketleri için güvenli ödeme sayfası.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OdemePage() {
  return (
    <Suspense fallback={<div>Ödeme sayfası yükleniyor...</div>}>
      <OdemeClient />
    </Suspense>
  );
}
