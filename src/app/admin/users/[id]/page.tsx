import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserDetailClient from "./UserDetailClient";

export const metadata = {
  title: "Kullanıcı Detayı | NeAlsam Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  const { id } = await params;

  return <UserDetailClient userId={id} />;
}
