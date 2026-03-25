import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminPrivacyContentPage() {
  await requireAdminSession();
  const privacy = await getSingle("privacy");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit privacy content"
        description="Localized legal basics kept consistent with the public design system."
        backHref="/admin"
        saveUrl="/api/admin/global/privacy/save"
        sections={globalSchemas.privacy.sections}
        optionsMap={{}}
        initialValue={privacy}
        storageKey="admin-global-privacy"
      />
    </AdminShell>
  );
}
