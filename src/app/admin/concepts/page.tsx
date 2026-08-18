import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ConceptsAdminClient from "./ConceptsAdminClient";

export const metadata = {
  title: "Premium Konsept Yönetimi | NeAlsam Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminConceptsPage() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("nealsam_admin_session")?.value;

  if (!sessionSecret || sessionCookie !== sessionSecret) {
    redirect("/admin/login");
  }

  return <ConceptsAdminClient />;
}
