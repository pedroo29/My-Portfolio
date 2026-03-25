import { AdminShell } from "@/components/admin/admin-shell";
import { CatalogsEditor } from "@/components/admin/catalogs-editor";
import { getCatalogs } from "@/lib/content";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminCatalogsPage() {
  await requireAdminSession();
  const catalogs = await getCatalogs();

  return (
    <AdminShell>
      <CatalogsEditor initialValue={catalogs} />
    </AdminShell>
  );
}
