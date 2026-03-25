import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { collectionSchemas, createBlankEntity } from "@/lib/admin-schemas";
import { getAdminOptions } from "@/lib/admin-options";
import { getEntityById } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminCertificationEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const initial = id === "new" ? createBlankEntity("certifications") : await getEntityById("certifications", id);

  if (!initial) {
    notFound();
  }

  return (
    <AdminShell>
      <StructuredEditor
        title={id === "new" ? "Create certification" : "Edit certification"}
        description="Edit formal learning status, provider and public note with clear version tracking."
        backHref="/admin/certifications"
        saveUrl="/api/admin/collection/certifications/save"
        deleteUrl={id === "new" ? undefined : "/api/admin/collection/certifications/delete"}
        duplicateUrl={id === "new" ? undefined : "/api/admin/collection/certifications/duplicate"}
        sections={collectionSchemas.certifications.sections}
        optionsMap={await getAdminOptions("en")}
        initialValue={initial}
        storageKey="admin-editor-certifications"
      />
    </AdminShell>
  );
}
