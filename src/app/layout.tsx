import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import AutoReveal from "@/components/motion/AutoReveal";
import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// Body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Headlines (serif, with italic for accent words)
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://nealsamhediye.com"),
  title: {
    default: "NeAlsam Hediye | Kime Ne Hediye Alınır?",
    template: "%s | NeAlsam Hediye",
  },
  description:
    "NeAlsam Hediye ile bütçene, kişiye, özel güne ve ilgi alanlarına göre hediye fikirleri bul. Sevgiliye, anneye, arkadaşa ve kardeşe hediye önerileri.",
  keywords: [
    "ne alsam",
    "hediye ne alsam",
    "ne alsam hediye",
    "hediye önerisi",
    "hediye fikirleri",
    "sevgiliye hediye",
    "anneye hediye",
    "arkadaşa hediye",
    "kime ne hediye alınır",
  ],
  icons: {
    icon: [
      { url: "/favicon-48x48.png?v=3", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=3", sizes: "96x96", type: "image/png" },
      { url: "/icon.png?v=3", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: "/apple-icon.png?v=3",
  },
  openGraph: {
    title: "NeAlsam Hediye | Kime Ne Hediye Alınır?",
    description:
      "Kime, bütçeye ve özel güne göre hediye önerileri. NeAlsam Hediye ile doğru hediyeyi bul.",
    url: "https://nealsamhediye.com",
    siteName: "NeAlsam Hediye",
    images: [
      {
        url: "/gift-icon.svg",
        width: 512,
        height: 512,
        alt: "NeAlsam Hediye Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  verification: {
    google: "3Qw6ADFVVOypwgoB8lHgFdQljuckSmeRAOLr6iWMxOE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NeAlsam Hediye",
              alternateName: ["NeAlsam", "Ne Alsam Hediye"],
              url: "https://nealsamhediye.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nealsamhediye.com/hediye-bul?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
<Navbar />
        {children}
        <Footer />
        <MobileBottomNav />
        <AutoReveal />
      </body>
    </html>
  );
}
