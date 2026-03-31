import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { collectionSchemas, createBlankEntity } from "@/lib/admin-schemas";
import { getAdminOptions } from "@/lib/admin-options";
import { getEntityById } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";
import { decodeAdminRouteId } from "@/lib/admin-route-id";

export default async function AdminSkillEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id: rawId } = await params;
  const id = rawId === "new" ? "new" : decodeAdminRouteId(rawId);
  const initial = id === "new" ? createBlankEntity("skills") : await getEntityById("skills", id);

  if (!initial) {
    notFound();
  }

  return (
    <AdminShell>
      <StructuredEditor
        title={id === "new" ? "Create skill" : "Edit skill"}
        description="Manage progress, labels and evidence relationships without dropping into raw JSON."
        backHref="/admin/skills"
        saveUrl="/api/admin/collection/skills/save"
        deleteUrl={id === "new" ? undefined : "/api/admin/collection/skills/delete"}
        duplicateUrl={id === "new" ? undefined : "/api/admin/collection/skills/duplicate"}
        sections={collectionSchemas.skills.sections}
        optionsMap={await getAdminOptions("en")}
        initialValue={initial}
        storageKey="admin-editor-skills"
      />
    </AdminShell>
  );
}
