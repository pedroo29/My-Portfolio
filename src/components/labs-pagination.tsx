import Link from "next/link";

import { buildLabsListHref, getSmartPaginationPages, type PaginationItem } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

const labels = {
  en: {
    nav: "Labs pagination",
    previous: "Previous",
    next: "Next",
    page: "Page",
    ellipsis: "More pages"
  },
  de: {
    nav: "Labs-Seiten",
    previous: "Zurück",
    next: "Weiter",
    page: "Seite",
    ellipsis: "Weitere Seiten"
  }
} as const;

function PageButton({
  locale,
  page,
  active,
  filters
}: {
  locale: Locale;
  page: number;
  active: boolean;
  filters: { q?: string; category?: string; level?: string; state?: string; tag?: string };
}) {
  const href = buildLabsListHref(locale, filters, page);
  const L = labels[locale];

  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex min-w-[2.5rem] items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition",
        active
          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100"
          : "border-slate-700 bg-slate-950/80 text-slate-200 hover:border-cyan-400/30 hover:text-cyan-100"
      )}
      aria-label={`${L.page} ${page}`}
      aria-current={active ? "page" : undefined}
    >
      {page}
    </Link>
  );
}

function Ellipsis({ locale }: { locale: Locale }) {
  return (
    <span
      className="inline-flex min-w-[2.5rem] items-center justify-center px-1 py-2 text-sm text-slate-500"
      aria-hidden
      title={labels[locale].ellipsis}
    >
      …
    </span>
  );
}

export function LabsPagination({
  locale,
  currentPage,
  totalPages,
  filters
}: {
  locale: Locale;
  currentPage: number;
  totalPages: number;
  filters: { q?: string; category?: string; level?: string; state?: string; tag?: string };
}) {
  if (totalPages <= 1) return null;

  const L = labels[locale];
  const items = getSmartPaginationPages(currentPage, totalPages);
  const prevHref = currentPage > 1 ? buildLabsListHref(locale, filters, currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? buildLabsListHref(locale, filters, currentPage + 1) : null;

  return (
    <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between" aria-label={L.nav}>
      <p className="text-sm text-slate-400">
        {locale === "de" ? (
          <>
            Seite <span className="font-medium text-slate-200">{currentPage}</span> von{" "}
            <span className="font-medium text-slate-200">{totalPages}</span>
          </>
        ) : (
          <>
            Page <span className="font-medium text-slate-200">{currentPage}</span> of{" "}
            <span className="font-medium text-slate-200">{totalPages}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
        {prevHref ? (
          <Link
            href={prevHref}
            className="focus-ring inline-flex rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400/30 hover:text-cyan-100"
          >
            {L.previous}
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-600"
            aria-disabled="true"
          >
            {L.previous}
          </span>
        )}

        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          {items.map((item: PaginationItem, index: number) =>
            item === "ellipsis" ? (
              <li key={`e-${index}`}>
                <Ellipsis locale={locale} />
              </li>
            ) : (
              <li key={item}>
                <PageButton locale={locale} page={item} active={item === currentPage} filters={filters} />
              </li>
            )
          )}
        </ul>

        {nextHref ? (
          <Link
            href={nextHref}
            className="focus-ring inline-flex rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400/30 hover:text-cyan-100"
          >
            {L.next}
          </Link>
        ) : (
          <span
            className="inline-flex cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-600"
            aria-disabled="true"
          >
            {L.next}
          </span>
        )}
      </div>
    </nav>
  );
}
