import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hesabım",
  description:
    "NeAlsam Hediye hesabın, paket durumun ve kaydettiğin hediye önerileri.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
