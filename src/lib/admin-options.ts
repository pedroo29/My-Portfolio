import { getCatalogOptions } from "@/lib/admin-schemas";
import { getCatalogs, getRelationOptions } from "@/lib/content";
import type { Locale } from "@/lib/types";

export async function getAdminOptions(locale: Locale = "en") {
  const [catalogs, relations] = await Promise.all([getCatalogs(), getRelationOptions(locale)]);
  return {
    ...getCatalogOptions(catalogs, locale),
    ...relations
  };
}
