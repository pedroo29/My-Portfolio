/** Entrada de la lista de páginas: número o separador visual. */
export type PaginationItem = number | "ellipsis";

/** Tamaño de página por defecto en la lista pública de labs. */
export const LABS_PAGE_SIZE = 12;

/**
 * Genera una lista compacta de páginas con elipsis (p. ej. 1 … 5 6 7 … 20).
 * No repite el 1 ni la última página; incluye vecinos de la página actual.
 */
export function getSmartPaginationPages(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  /** Con pocas páginas se muestran todas; elipsis solo a partir de 10. */
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 2;
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  const range: PaginationItem[] = [1];

  if (left > 2) {
    range.push("ellipsis");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push("ellipsis");
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  return range;
}

/** Ajusta la página solicitada al rango válido según el número de ítems y el tamaño de página. */
export function clampPage(requested: string | number | undefined, itemCount: number, pageSize: number): number {
  const totalPages = Math.max(1, Math.ceil(itemCount / pageSize));
  const p = typeof requested === "number" ? requested : Number.parseInt(String(requested ?? ""), 10);
  if (!Number.isFinite(p) || p < 1) return 1;
  return Math.min(p, totalPages);
}

/**
 * Construye href con query de filtros + `page` solo si page > 1.
 */
export function buildLabsListHref(
  locale: string,
  filters: { q?: string; category?: string; level?: string; state?: string; tag?: string },
  page: number
): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.level) params.set("level", filters.level);
  if (filters.state) params.set("state", filters.state);
  if (filters.tag) params.set("tag", filters.tag);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/${locale}/labs?${qs}` : `/${locale}/labs`;
}
