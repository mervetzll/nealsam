import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUsersClient from "./UsersClient";

export const metadata = {
  title: "Admin Kullanıcılar | NeAlsam",
  description: "NeAlsam admin kullanıcı ve paket yönetimi.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <AdminUsersClient />;
}
