import { Suspense } from "react";
import AuthClient from "./AuthClient";

export const metadata = { title: "Giriş Yap / Üye Ol", robots: { index: false, follow: false } };

export default function LoginPage() {
  return <Suspense fallback={<p className="p-8 text-center">Hesap ekranı hazırlanıyor…</p>}><AuthClient /></Suspense>;
}
