import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StoresAdminClient from "./StoresAdminClient";

export const metadata = {
  title: "Mağaza Yönetimi | NeAlsam Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminStoresPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <StoresAdminClient />;
}
