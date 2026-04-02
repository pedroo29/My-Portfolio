import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminRoadmapPageContentPage() {
  await requireAdminSession();
  const roadmapPage = await getSingle("roadmapPage");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit roadmap page copy"
        description="Public /roadmap story layout, phase labels and floating minimap (EN + DE)."
        backHref="/admin"
        saveUrl="/api/admin/global/roadmapPage/save"
        sections={globalSchemas.roadmapPage.sections}
        optionsMap={{}}
        initialValue={roadmapPage}
        storageKey="admin-global-roadmap-page"
      />
    </AdminShell>
  );
}
