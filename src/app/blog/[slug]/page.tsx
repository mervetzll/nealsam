import BlogDetailClient from "./BlogDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

  return <BlogDetailClient slug={slug} />;
}
