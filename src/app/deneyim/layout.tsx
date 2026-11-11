import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Not ve Hediye Deneyimi",
  description:
    "Hediyenin yanına QR kodlu özel not, mektup, hikâye ve bilmece ekle; hediyeni dijital bir sürprize dönüştür.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
