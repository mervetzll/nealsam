import BlogEditClient from "./BlogEditClient";

export const metadata = {
  title: "Blog Düzenle | NeAlsam Hediye",
  description: "Blog yazını düzenle.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BlogEditClient postId={id} />;
}
