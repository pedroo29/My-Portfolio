import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminCertificationsPageContentPage() {
  await requireAdminSession();
  const certificationsPage = await getSingle("certificationsPage");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit certifications page copy"
        description="Public /certifications: hero KPIs, filters, layouts and card state labels (EN + DE)."
        backHref="/admin"
        saveUrl="/api/admin/global/certificationsPage/save"
        sections={globalSchemas.certificationsPage.sections}
        optionsMap={{}}
        initialValue={certificationsPage}
        storageKey="admin-global-certifications-page"
      />
    </AdminShell>
  );
}
