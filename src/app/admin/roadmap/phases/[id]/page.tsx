import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { collectionSchemas, createBlankEntity } from "@/lib/admin-schemas";
import { getAdminOptions } from "@/lib/admin-options";
import { getEntityById } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";
import { decodeAdminRouteId } from "@/lib/admin-route-id";

export default async function AdminRoadmapPhaseEditorPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession();
  const { id: rawId } = await params;
  const id = rawId === "new" ? "new" : decodeAdminRouteId(rawId);
  const initial = id === "new" ? createBlankEntity("roadmapPhases") : await getEntityById("roadmapPhases", id);

  if (!initial) {
    notFound();
  }

  return (
    <AdminShell>
      <StructuredEditor
        title={id === "new" ? "Create roadmap phase" : "Edit roadmap phase"}
        description="Define the visible phase structure that groups milestones in the public roadmap."
        backHref="/admin/roadmap/phases"
        saveUrl="/api/admin/collection/roadmapPhases/save"
        deleteUrl={id === "new" ? undefined : "/api/admin/collection/roadmapPhases/delete"}
        duplicateUrl={id === "new" ? undefined : "/api/admin/collection/roadmapPhases/duplicate"}
        sections={collectionSchemas.roadmapPhases.sections}
        optionsMap={await getAdminOptions("en")}
        initialValue={initial}
        storageKey="admin-editor-roadmap-phases"
      />
    </AdminShell>
  );
}
