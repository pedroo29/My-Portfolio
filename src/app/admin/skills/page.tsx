import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionTable } from "@/components/admin/collection-table";
import { collectionSchemas } from "@/lib/admin-schemas";
import { requireAdminSession } from "@/lib/server/auth";
import { readStore } from "@/lib/server/content-store";

export default async function AdminSkillsPage() {
  await requireAdminSession();
  const store = await readStore();
  const skills = store.skills.map((skill) => ({
    ...skill,
    content: skill.locales.en
  }));

  return (
    <AdminShell>
      <CollectionTable
        title={collectionSchemas.skills.title}
        description="Track maturity, progress and evidence linkage for each skill."
        createHref="/admin/skills/new"
        columns={["Skill", "Level", "Progress", "Version"]}
        rows={skills.map((skill) => ({
          id: skill.id,
          cells: [skill.content.name, skill.level, `${skill.progress}%`, skill.version]
        }))}
        editBasePath="/admin/skills"
        actionsBasePath="/api/admin/collection/skills"
      />
    </AdminShell>
  );
}
