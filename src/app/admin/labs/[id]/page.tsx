import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { collectionSchemas, createBlankEntity } from "@/lib/admin-schemas";
import { getAdminOptions } from "@/lib/admin-options";
import { getEntityById, readStore } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminLabEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const initial = id === "new" ? createBlankEntity("labs") : await getEntityById("labs", id);

  if (!initial) {
    notFound();
  }

  const [options, store] = await Promise.all([getAdminOptions("en"), readStore()]);

  return (
    <AdminShell>
      <StructuredEditor
        title={id === "new" ? "Create lab" : "Edit lab"}
        description="Use the structured form for normal editing, preview to inspect the public shape and JSON as an advanced fallback."
        backHref="/admin/labs"
        saveUrl="/api/admin/collection/labs/save"
        deleteUrl={id === "new" ? undefined : "/api/admin/collection/labs/delete"}
        duplicateUrl={id === "new" ? undefined : "/api/admin/collection/labs/duplicate"}
        sections={collectionSchemas.labs.sections}
        optionsMap={options}
        initialValue={initial}
        storageKey="admin-editor-labs"
        mediaAssets={store.media}
      />
    </AdminShell>
  );
}
