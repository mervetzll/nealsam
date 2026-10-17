import BlogDetailClient from "./BlogDetailClient";
import { getEditorialPost } from "@/data/editorialPosts";
import EditorialArticle from "@/components/blog/EditorialArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getEditorialPost(slug);
  if (post) return { title: post.title, description: post.excerpt, alternates: { canonical: `https://www.nealsamhediye.com/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article" } };

  return {
    title: "Blog Yazısı | NeAlsam Hediye",
    description: `NeAlsam Hediye blog yazısı: ${slug}`,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getEditorialPost(slug);
  if (post) return <EditorialArticle post={post} />;

  return <BlogDetailClient slug={slug} />;
}
