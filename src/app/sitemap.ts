import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pages = [
    "",
    "/hediye-bul",
    "/deneyim",
    "/paketler",
    "/yardim",
    "/hediye-fikirleri",
    "/hediye-fikirleri/sevgiliye-ne-hediye-alinir",
    "/hediye-fikirleri/arkadasa-ne-hediye-alinir",
    "/hediye-fikirleri/anneye-ne-hediye-alinir",
    "/hediye-fikirleri/babaya-ne-hediye-alinir",
    "/hediye-fikirleri/dogum-gunu-hediyesi",
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page === "" ? 1 : 0.8,
  }));
}
