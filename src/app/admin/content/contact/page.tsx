import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminContactContentPage() {
  await requireAdminSession();
  const contact = await getSingle("contact");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit contact content"
        description="Shared channels plus localized conversion copy for the contact page."
        backHref="/admin"
        saveUrl="/api/admin/global/contact/save"
        sections={globalSchemas.contact.sections}
        optionsMap={{}}
        initialValue={contact}
        storageKey="admin-global-contact"
      />
    </AdminShell>
  );
}
