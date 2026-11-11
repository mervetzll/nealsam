import BlogNewClient from "./BlogNewClient";

export const metadata = {
  title: "Blog Yazısı Gönder",
  description: "NeAlsam Hediye topluluğuna blog yazısı gönder.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BlogNewPage() {
  return <BlogNewClient />;
}
