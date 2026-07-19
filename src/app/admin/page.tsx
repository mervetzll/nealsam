import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin Panel | NeAlsam",
  description: "NeAlsam admin yönetim paneli.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <AdminClient />;
}
