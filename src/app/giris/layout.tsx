import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description:
    "NeAlsam Hediye hesabına giriş yap veya kayıt ol; hediye tercihlerini ve kaydettiğin önerileri sakla.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
