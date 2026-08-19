import BloglarimClient from "./BloglarimClient";

export const metadata = {
  title: "Bloglarım | NeAlsam Hediye",
  description: "Kendi blog yazılarını yönet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BloglarimPage() {
  return <BloglarimClient />;
}
