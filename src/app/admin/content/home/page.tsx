import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminHomeContentPage() {
  await requireAdminSession();
  const home = await getSingle("home");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit home content"
        description="Manage both locales for the landing page hero, supporting copy and CTA structure."
        backHref="/admin"
        saveUrl="/api/admin/global/home/save"
        sections={globalSchemas.home.sections}
        optionsMap={{}}
        initialValue={home}
        storageKey="admin-global-home"
      />
    </AdminShell>
  );
}
