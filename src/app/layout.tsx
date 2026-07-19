import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
  alternates: {
    canonical: "https://nealsamhediye.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "512x512", type: "image/png" }],
  },
  openGraph: {
    title: "NeAlsam Hediye | Kime Ne Hediye Alınır?",
    description:
      "Kime, bütçeye ve özel güne göre hediye önerileri. NeAlsam Hediye ile doğru hediyeyi bul.",
    url: "https://nealsamhediye.com",
    siteName: "NeAlsam Hediye",
    images: [
      {
        url: "/icon.png",
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
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
{children}</body>
    </html>
  );
}
