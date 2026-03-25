import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { collectionSchemas, createBlankEntity } from "@/lib/admin-schemas";
import { getAdminOptions } from "@/lib/admin-options";
import { getEntityById } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminRoadmapMilestoneEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const initial = id === "new" ? createBlankEntity("roadmapMilestones") : await getEntityById("roadmapMilestones", id);

  if (!initial) {
    notFound();
  }

  return (
    <AdminShell>
      <StructuredEditor
        title={id === "new" ? "Create roadmap milestone" : "Edit roadmap milestone"}
        description="This editor is designed around progression, outcomes and cross-entity relationships."
        backHref="/admin/roadmap/milestones"
        saveUrl="/api/admin/collection/roadmapMilestones/save"
        deleteUrl={id === "new" ? undefined : "/api/admin/collection/roadmapMilestones/delete"}
        duplicateUrl={id === "new" ? undefined : "/api/admin/collection/roadmapMilestones/duplicate"}
        sections={collectionSchemas.roadmapMilestones.sections}
        optionsMap={await getAdminOptions("en")}
        initialValue={initial}
        storageKey="admin-editor-roadmap-milestones"
      />
    </AdminShell>
  );
}
