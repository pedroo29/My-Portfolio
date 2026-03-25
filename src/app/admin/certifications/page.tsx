import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionTable } from "@/components/admin/collection-table";
import { collectionSchemas } from "@/lib/admin-schemas";
import { getCatalogs, resolveProviderLabel } from "@/lib/content";
import { requireAdminSession } from "@/lib/server/auth";
import { readStore } from "@/lib/server/content-store";

export default async function AdminCertificationsPage() {
  await requireAdminSession();
  const [store, catalogs] = await Promise.all([readStore(), getCatalogs()]);
  const certifications = store.certifications.map((item) => ({
    ...item,
    content: item.locales.en
  }));

  return (
    <AdminShell>
      <CollectionTable
        title={collectionSchemas.certifications.title}
        description="Keep providers, states and dates structured for fast scanning."
        createHref="/admin/certifications/new"
        columns={["Certification", "Provider", "State", "Version"]}
        rows={certifications.map((item) => ({
          id: item.id,
          cells: [item.content.name, resolveProviderLabel(catalogs, item.providerId, "en"), item.state, item.version]
        }))}
        editBasePath="/admin/certifications"
        actionsBasePath="/api/admin/collection/certifications"
      />
    </AdminShell>
  );
}
