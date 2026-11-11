import BloglarimClient from "./BloglarimClient";

export const metadata = {
  title: "Bloglarım",
  description: "Kendi blog yazılarını yönet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BloglarimPage() {
  return <BloglarimClient />;
}
