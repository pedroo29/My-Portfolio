import { AdminShell } from "@/components/admin/admin-shell";
import { MediaLibrary } from "@/components/admin/media-library";
import { readStore } from "@/lib/server/content-store";
import { requireAdminSession } from "@/lib/server/auth";

export default async function AdminMediaPage() {
  await requireAdminSession();
  const media = (await readStore()).media;

  return (
    <AdminShell>
      <MediaLibrary items={media} />
    </AdminShell>
  );
}
