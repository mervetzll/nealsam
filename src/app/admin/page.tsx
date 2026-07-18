import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin Panel | NeAlsam",
  description: "NeAlsam admin yönetim paneli.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}
