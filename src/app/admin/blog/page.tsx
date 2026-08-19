import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BlogAdminClient from "./BlogAdminClient";

export const metadata = {
  title: "Blog Yönetimi | NeAlsam Admin",
  description: "NeAlsam blog yazılarını yönet.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <BlogAdminClient />;
}
