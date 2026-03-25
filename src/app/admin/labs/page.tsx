import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionTable } from "@/components/admin/collection-table";
import { collectionSchemas } from "@/lib/admin-schemas";
import { getCatalogs, resolveCategoryLabel } from "@/lib/content";
import { requireAdminSession } from "@/lib/server/auth";
import { readStore } from "@/lib/server/content-store";

export default async function AdminLabsPage() {
  await requireAdminSession();
  const [store, catalogs] = await Promise.all([readStore(), getCatalogs()]);
  const labs = store.labs.map((lab) => ({
    ...lab,
    content: lab.locales.en
  }));

  return (
    <AdminShell>
      <CollectionTable
        title={collectionSchemas.labs.title}
        description="Searchable collection for technical case studies and labs."
        createHref="/admin/labs/new"
        columns={["Title", "Category", "State", "Version"]}
        rows={labs.map((lab) => ({
          id: lab.id,
          cells: [lab.content.title, resolveCategoryLabel(catalogs, lab.categoryId, "en"), lab.state, lab.version]
        }))}
        editBasePath="/admin/labs"
        actionsBasePath="/api/admin/collection/labs"
      />
    </AdminShell>
  );
}
