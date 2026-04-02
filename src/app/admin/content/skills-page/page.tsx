import { AdminShell } from "@/components/admin/admin-shell";
import { StructuredEditor } from "@/components/admin/structured-editor";
import { globalSchemas } from "@/lib/admin-schemas";
import { getSingle } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminSkillsPageContentPage() {
  await requireAdminSession();
  const skillsPage = await getSingle("skillsPage");

  return (
    <AdminShell>
      <StructuredEditor
        title="Edit skills page copy"
        description="Public /skills listing: hero, matrix, filters and empty states (EN + DE)."
        backHref="/admin"
        saveUrl="/api/admin/global/skillsPage/save"
        sections={globalSchemas.skillsPage.sections}
        optionsMap={{}}
        initialValue={skillsPage}
        storageKey="admin-global-skills-page"
      />
    </AdminShell>
  );
}
