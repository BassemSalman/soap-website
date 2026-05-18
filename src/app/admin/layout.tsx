import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { requireAdmin } from "@/lib/auth/get-session";

export const metadata = {
  title: "Admin — habibti.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--hbt-cream-soft)",
        fontSize: 13,
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
