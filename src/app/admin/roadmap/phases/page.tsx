import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionTable } from "@/components/admin/collection-table";
import { collectionSchemas } from "@/lib/admin-schemas";
import { requireAdminSession } from "@/lib/server/auth";
import { readStore } from "@/lib/server/content-store";

export default async function AdminRoadmapPhasesPage() {
  await requireAdminSession();
  const store = await readStore();
  const phases = store.roadmapPhases.map((item) => ({
    ...item,
    content: item.locales.en
  }));

  return (
    <AdminShell>
      <CollectionTable
        title={collectionSchemas.roadmapPhases.title}
        description="Manage the roadmap phase structure that anchors the public timeline."
        createHref="/admin/roadmap/phases/new"
        columns={["Phase", "Order", "State", "Version"]}
        rows={phases.map((item) => ({
          id: item.id,
          cells: [item.content.title, item.order, item.state, item.version]
        }))}
        editBasePath="/admin/roadmap/phases"
        actionsBasePath="/api/admin/collection/roadmapPhases"
      />
    </AdminShell>
  );
}
