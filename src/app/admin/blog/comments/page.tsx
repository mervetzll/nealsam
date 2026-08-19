import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BlogCommentsAdminClient from "./BlogCommentsAdminClient";

export const metadata = {
  title: "Blog Yorumları | NeAlsam Admin",
  description: "NeAlsam blog yorumlarını yönet.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminBlogCommentsPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <BlogCommentsAdminClient />;
}
