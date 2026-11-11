import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hediye Bul: Kişiye Özel Hediye Testi",
  description:
    "Birkaç soruya cevap ver; kime, hangi bütçeyle ve hangi tarzda hediye alacağına göre en uygun hediye önerilerini 30 saniyede bul.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
