/**
 * Decodifica el segmento `[id]` del admin cuando el id contiene `+`, `/`, etc.
 * Las URLs deben generarse con `encodeURIComponent` al enlazar (p. ej. en `collection-table`).
 *
 * Módulo aparte de `utils.ts` para evitar problemas de bundling (Turbopack/RSC) con imports nombrados.
 */
export function decodeAdminRouteId(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
