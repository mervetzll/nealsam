import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nealsamhediye.com";

  const routes = [
    "",
    "/hediye-bul",
    "/deneyim",
    "/paketler",
    "/yardim",
    "/blog",
    "/blog/sevgiliye-ne-hediye-alinir",
    "/blog/anneye-dogum-gunu-hediyesi",
    "/blog/arkadasa-hediye-fikirleri",
    "/blog/500-tl-alti-hediye-onerileri",
    "/blog/kime-ne-hediye-alinir",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : route === "/hediye-bul" ? 0.9 : 0.7,
  }));
}
