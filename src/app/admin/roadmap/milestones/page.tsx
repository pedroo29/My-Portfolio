import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionTable } from "@/components/admin/collection-table";
import { collectionSchemas } from "@/lib/admin-schemas";
import { requireAdminSession } from "@/lib/server/auth";
import { readStore } from "@/lib/server/content-store";

export default async function AdminRoadmapMilestonesPage() {
  await requireAdminSession();
  const store = await readStore();
  const phases = store.roadmapPhases.map((item) => ({
    ...item,
    content: item.locales.en
  }));
  const milestones = store.roadmapMilestones.map((item) => ({
    ...item,
    content: item.locales.en
  }));

  return (
    <AdminShell>
      <CollectionTable
        title={collectionSchemas.roadmapMilestones.title}
        description="Milestones connect skills, labs and certifications into a visible progression path."
        createHref="/admin/roadmap/milestones/new"
        columns={["Milestone", "Order", "State", "Phase", "Version"]}
        rows={milestones.map((item) => ({
          id: item.id,
          cells: [
            item.content.title,
            item.order ?? "—",
            item.state,
            phases.find((phase) => phase.id === item.phaseId)?.content.title ?? item.phaseId,
            item.version
          ]
        }))}
        editBasePath="/admin/roadmap/milestones"
        actionsBasePath="/api/admin/collection/roadmapMilestones"
      />
    </AdminShell>
  );
}
