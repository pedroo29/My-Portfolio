import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminAboutContentPage() {
  await requireAdminSession();
  const about = await getSingle("about");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit about content"
        description="Positioning, narrative and competence framing for both public locales."
        backHref="/admin"
        saveUrl="/api/admin/global/about/save"
        sections={globalSchemas.about.sections}
        optionsMap={{}}
        initialValue={about}
        storageKey="admin-global-about"
      />
    </AdminShell>
  );
}
