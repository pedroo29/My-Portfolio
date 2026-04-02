import Link from "next/link";

import { CertificationCard } from "@/components/public-cards";
import { EmptyState, Section } from "@/components/ui";
import {
  certificationCardLabelsFromPage,
  formatCertificationResultCount,
  getCatalogs,
  getCertifications,
  getCertificationsPageContent,
  resolveProviderLabel
} from "@/lib/content";
import { cn } from "@/lib/utils";
import { getQueryParam } from "@/lib/search-params";
import type { CertificationState, Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

const CERT_VIEW_MODES = ["timeline", "browse"] as const;
type CertViewMode = (typeof CERT_VIEW_MODES)[number];

function parseCertView(raw: string): CertViewMode {
  return CERT_VIEW_MODES.includes(raw as CertViewMode) ? (raw as CertViewMode) : "timeline";
}

/** `planned` al final; `completed` e `in-progress` arriba, ordenados por fecha descendente. */
function certificationSortRank(state: CertificationState): number {
  return state === "planned" ? 1 : 0;
}

function compareCertificationsForDisplay(
  a: { state: CertificationState; relevantDate: string },
  b: { state: CertificationState; relevantDate: string }
): number {
  const rankDiff = certificationSortRank(a.state) - certificationSortRank(b.state);
  if (rankDiff !== 0) {
    return rankDiff;
  }
  return b.relevantDate.localeCompare(a.relevantDate);
}

function certificationsHref(
  locale: Locale,
  filters: { provider?: string; state?: string; view?: CertViewMode }
) {
  const sp = new URLSearchParams();
  if (filters.provider) sp.set("provider", filters.provider);
  if (filters.state) sp.set("state", filters.state);
  if (filters.view && filters.view !== "timeline") sp.set("view", filters.view);
  const q = sp.toString();
  return `/${locale}/certifications${q ? `?${q}` : ""}`;
}

export default async function CertificationsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const queryParams = await searchParams;
  const provider = getQueryParam(queryParams, "provider");
  const state = getQueryParam(queryParams, "state") as CertificationState | "";
  const viewMode = parseCertView(getQueryParam(queryParams, "view"));

  const [certifications, catalogs, pageCopy] = await Promise.all([
    getCertifications(typedLocale),
    getCatalogs(),
    getCertificationsPageContent(typedLocale)
  ]);
  const certCardLabels = certificationCardLabelsFromPage(pageCopy);
  const filtered = certifications.filter(
    (item) => (!provider || item.providerId === provider) && (!state || item.state === state)
  );
  const sorted = [...filtered].sort(compareCertificationsForDisplay);

  const visual = pageCopy;

  const countFor = (s: CertificationState) => certifications.filter((c) => c.state === s).length;
  const kpiCompleted = countFor("completed");
  const kpiInProgress = countFor("in-progress");
  const kpiPlanned = countFor("planned");

  const chipBase =
    "focus-ring inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition hover:border-slate-600 hover:text-slate-100";
  const chipInactive = "border-slate-700/80 bg-slate-950/60 text-slate-400";
  const chipActive = "border-cyan-400/50 bg-cyan-400/15 text-cyan-100 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]";

  const viewPreserved = viewMode === "browse" ? "browse" : undefined;

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/80 shadow-2xl shadow-slate-950/40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(34,211,238,0.14),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-cyan-950/25" aria-hidden />
        <div className="relative space-y-8 p-6 sm:p-8 md:p-10">
          <Section eyebrow={visual.eyebrow} title={visual.title} description={visual.description}>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: visual.kpiCompleted, value: kpiCompleted, accent: "from-emerald-500/20 to-transparent" },
                { label: visual.kpiInProgress, value: kpiInProgress, accent: "from-cyan-400/20 to-transparent" },
                { label: visual.kpiPlanned, value: kpiPlanned, accent: "from-amber-400/18 to-transparent" }
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className={cn(
                    "rounded-2xl border border-slate-800/90 bg-slate-950/50 p-5 shadow-inner shadow-slate-950/30",
                    "bg-gradient-to-br to-slate-950/40",
                    kpi.accent
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-50">{kpi.value}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <section className="reveal-up space-y-6">
        <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{visual.viewLabel}</p>
          <nav aria-label={visual.viewToggleAria} className="flex flex-wrap gap-2">
            <Link
              href={certificationsHref(typedLocale, {
                provider: provider || undefined,
                state: state || undefined,
                view: undefined
              })}
              className={cn(chipBase, viewMode === "timeline" ? chipActive : chipInactive)}
              aria-current={viewMode === "timeline" ? "true" : undefined}
            >
              {visual.viewTimeline}
            </Link>
            <Link
              href={certificationsHref(typedLocale, {
                provider: provider || undefined,
                state: state || undefined,
                view: "browse"
              })}
              className={cn(chipBase, viewMode === "browse" ? chipActive : chipInactive)}
              aria-current={viewMode === "browse" ? "true" : undefined}
            >
              {visual.viewBrowse}
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{visual.filterByProvider}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={certificationsHref(typedLocale, { state: state || undefined, view: viewPreserved })}
              className={cn(chipBase, !provider ? chipActive : chipInactive)}
            >
              {visual.filterAll}
            </Link>
            {catalogs.providers.map((item) => (
              <Link
                key={item.id}
                href={certificationsHref(typedLocale, { provider: item.id, state: state || undefined, view: viewPreserved })}
                className={cn(chipBase, provider === item.id ? chipActive : chipInactive)}
              >
                {item.label[typedLocale]}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{visual.filterByState}</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={certificationsHref(typedLocale, { provider: provider || undefined, view: viewPreserved })}
              className={cn(chipBase, !state ? chipActive : chipInactive)}
            >
              {visual.filterAll}
            </Link>
            {(["completed", "in-progress", "planned"] as const).map((s) => (
              <Link
                key={s}
                href={certificationsHref(typedLocale, { provider: provider || undefined, state: s, view: viewPreserved })}
                className={cn(chipBase, state === s ? chipActive : chipInactive)}
              >
                {s === "completed"
                  ? visual.stateChipCompleted
                  : s === "in-progress"
                    ? visual.stateChipInProgress
                    : visual.stateChipPlanned}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {sorted.length === 0 ? (
        <EmptyState title={visual.emptyTitle} description={visual.emptyDescription} />
      ) : viewMode === "timeline" ? (
        <section className="space-y-6">
          <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{visual.timelineTitle}</h2>
          <div className="relative">
            <div
              className="pointer-events-none absolute left-[17px] top-8 bottom-8 hidden w-px bg-gradient-to-b from-cyan-500/25 via-slate-700/70 to-slate-800 md:block"
              aria-hidden
            />
            <ul className="space-y-0">
              {sorted.map((item) => (
                <li key={item.id} className="relative pb-12 last:pb-0">
                  <div
                    className={cn(
                      "absolute left-3 top-9 z-10 hidden h-3.5 w-3.5 rounded-full border-2 border-slate-950 md:block",
                      item.state === "completed" && "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.35)]",
                      item.state === "in-progress" && "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]",
                      item.state === "planned" && "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                    )}
                    aria-hidden
                  />
                  <div className="md:pl-10">
                    <CertificationCard
                      locale={typedLocale}
                      title={item.content.name}
                      provider={resolveProviderLabel(catalogs, item.providerId, typedLocale)}
                      state={item.state}
                      date={item.relevantDate}
                      note={item.content.note}
                      cardLabels={certCardLabels}
                      variant="timeline"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{visual.browseTitle}</h2>
              <p className="max-w-2xl text-sm text-slate-500">{visual.browseDescription}</p>
            </div>
            <p className="text-sm tabular-nums text-slate-400">
              {formatCertificationResultCount(visual, sorted.length)}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((item) => (
              <CertificationCard
                key={item.id}
                locale={typedLocale}
                title={item.content.name}
                provider={resolveProviderLabel(catalogs, item.providerId, typedLocale)}
                state={item.state}
                date={item.relevantDate}
                note={item.content.note}
                cardLabels={certCardLabels}
                variant="browse"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
