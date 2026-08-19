import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const siteUrl = "https://www.nealsamhediye.com";

const staticRoutes = [
  "",
  "/hediye-bul",
  "/deneyim",
  "/paketler",
  "/blog",
  "/yardim",
  "/gizlilik-politikasi",
  "/kullanim-sartlari",
  "/kvkk",
  "/iade-iptal",
  "/blog/sevgiliye-ne-hediye-alinir",
  "/blog/anneye-dogum-gunu-hediyesi",
  "/blog/arkadasa-hediye-fikirleri",
  "/blog/500-tl-alti-hediye-onerileri",
  "/blog/kime-ne-hediye-alinir",
];

async function getPublishedBlogRoutes() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) return [];

  try {
    const supabase = createClient(supabaseUrl, anonKey);

    const { data } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at, created_at")
      .eq("status", "published");

    return (data || []).map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicBlogRoutes = await getPublishedBlogRoutes();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...dynamicBlogRoutes,
  ];
}
