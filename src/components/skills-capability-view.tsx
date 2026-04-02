import Link from "next/link";

import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Badge, Panel } from "@/components/ui";
import { labLevelLabels } from "@/lib/constants";
import { formatLabsLinked, resolveTagLabels } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Catalogs, LabLevel, Locale, LocalizedSkillContent, LocalizedSkillsPageContent, Skill } from "@/lib/types";

/** Resultado de `getSkills(locale)` — `content` ya resuelto al locale. */
export type SkillWithContent = Skill & { content: LocalizedSkillContent };

const LEVEL_ORDER: LabLevel[] = ["foundational", "intermediate", "advanced"];

function buildQuery(locale: string, view: "matrix" | "list", tag?: string) {
  const params = new URLSearchParams();
  if (view === "list") params.set("view", "list");
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return qs ? `/${locale}/skills?${qs}` : `/${locale}/skills`;
}

function progressShell(progress: number) {
  if (progress >= 80) return "border-cyan-400/45 bg-gradient-to-br from-cyan-400/20 to-slate-950/90";
  if (progress >= 55) return "border-cyan-400/25 bg-cyan-400/10";
  if (progress >= 30) return "border-slate-600/80 bg-slate-950/80";
  return "border-slate-700/80 bg-slate-950/70";
}

function groupByLevel(skills: SkillWithContent[]) {
  const map: Record<LabLevel, SkillWithContent[]> = {
    foundational: [],
    intermediate: [],
    advanced: []
  };
  for (const s of skills) {
    map[s.level].push(s);
  }
  for (const level of LEVEL_ORDER) {
    map[level].sort((a, b) => b.progress - a.progress);
  }
  return map;
}

function pickFeaturedIds(skills: SkillWithContent[], max = 2) {
  return new Set(
    [...skills]
      .sort((a, b) => b.progress - a.progress)
      .slice(0, max)
      .map((s) => s.id)
  );
}

function SkillMatrixCell({
  locale,
  skill,
  catalogs,
  pageCopy
}: {
  locale: Locale;
  skill: SkillWithContent;
  catalogs: Catalogs;
  pageCopy: LocalizedSkillsPageContent;
}) {
  const labels = pageCopy;
  const tagLabels = resolveTagLabels(catalogs, skill.tags.slice(0, 2), locale);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      className={cn(
        "focus-ring block rounded-xl border p-3 transition hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(34,211,238,0.08)]",
        progressShell(skill.progress)
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-50">{skill.content.name}</p>
        <span className="shrink-0 text-xs font-semibold text-cyan-200">{skill.progress}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800/80">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500/80 to-emerald-400/70"
          style={{ width: `${Math.min(100, Math.max(0, skill.progress))}%` }}
        />
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-400">{skill.content.summary}</p>
      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.14em] text-slate-500">
        {formatLabsLinked(labels, skill.labIds.length)}
      </p>
      {tagLabels.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {tagLabels.map((t) => (
            <span key={t} className="rounded-md border border-slate-700/80 px-2 py-0.5 text-[0.65rem] text-slate-400">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

function SkillBentoCard({
  locale,
  skill,
  catalogs,
  featured,
  pageCopy
}: {
  locale: Locale;
  skill: SkillWithContent;
  catalogs: Catalogs;
  featured: boolean;
  pageCopy: LocalizedSkillsPageContent;
}) {
  const labels = pageCopy;
  const tagLabels = resolveTagLabels(catalogs, skill.tags, locale);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      className={cn(
        "focus-ring reveal-up group relative block overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/75 p-5 transition",
        "hover:border-cyan-400/40 hover:bg-slate-900/80 hover:shadow-[0_0_34px_rgba(34,211,238,0.09)]",
        featured ? "md:col-span-2 md:row-span-2 md:p-6" : "",
        progressShell(skill.progress)
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-400/10 to-transparent" aria-hidden />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge>{labLevelLabels[skill.level]}</Badge>
          {featured ? <Badge tone="accent">{labels.featured}</Badge> : null}
        </div>
        <span className="text-sm font-semibold text-cyan-200">{skill.progress}%</span>
      </div>
      <h3 className={cn("relative mt-3 font-semibold text-slate-50", featured ? "text-xl md:text-2xl" : "text-lg")}>
        {skill.content.name}
      </h3>
      <p className={cn("relative text-slate-400", featured ? "mt-3 max-w-2xl text-sm leading-relaxed" : "mt-2 text-sm")}>
        {skill.content.summary}
      </p>
      <div className="relative mt-4 space-y-2">
        <SkillProgressBar progress={skill.progress} thick={featured} />
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {tagLabels.map((t) => (
          <span key={t} className="rounded-full border border-slate-700/80 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300">
            {t}
          </span>
        ))}
      </div>
      <p className="relative mt-4 text-sm font-medium text-cyan-200 transition group-hover:text-cyan-100">
        {labels.openSkill} →
      </p>
      <p className="relative mt-1 text-xs text-slate-500">{formatLabsLinked(labels, skill.labIds.length)}</p>
    </Link>
  );
}

function SkillsListView({
  locale,
  skills,
  catalogs,
  pageCopy
}: {
  locale: Locale;
  skills: SkillWithContent[];
  catalogs: Catalogs;
  pageCopy: LocalizedSkillsPageContent;
}) {
  return (
    <div className="space-y-4">
      {skills.map((skill) => {
        const labels = pageCopy;
        return (
          <div key={skill.id} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge>{labLevelLabels[skill.level]}</Badge>
                  {resolveTagLabels(catalogs, skill.tags, locale).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <Link href={`/${locale}/skills/${skill.slug}`} className="focus-ring text-lg font-semibold text-cyan-100">
                  {skill.content.name}
                </Link>
                <p className="text-sm text-slate-400">{skill.content.summary}</p>
                <p className="text-xs text-slate-500">{formatLabsLinked(labels, skill.labIds.length)}</p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{skill.progress}%</span>
                </div>
                <SkillProgressBar progress={skill.progress} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillsViewToolbar({
  locale,
  catalogs,
  view,
  activeTagId,
  tagIds,
  pageCopy
}: {
  locale: Locale;
  catalogs: Catalogs;
  view: "matrix" | "list";
  activeTagId?: string;
  tagIds: string[];
  pageCopy: LocalizedSkillsPageContent;
}) {
  const labels = pageCopy;

  return (
    <div className="flex flex-col gap-4 border-b border-slate-800/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-2">
        <Link
          href={buildQuery(locale, "matrix", activeTagId)}
          className={cn(
            "focus-ring rounded-full border px-3 py-2 text-sm",
            view === "matrix" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"
          )}
        >
          {labels.viewMatrix}
        </Link>
        <Link
          href={buildQuery(locale, "list", activeTagId)}
          className={cn(
            "focus-ring rounded-full border px-3 py-2 text-sm",
            view === "list" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"
          )}
        >
          {labels.viewList}
        </Link>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{labels.filterByTag}</span>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQuery(locale, view, undefined)}
            className={cn(
              "focus-ring rounded-full border px-3 py-1.5 text-sm",
              !activeTagId ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"
            )}
          >
            {labels.filterAll}
          </Link>
          {tagIds.map((tagId) => {
            const label = catalogs.tags.find((t) => t.id === tagId)?.label[locale] ?? tagId;
            const active = activeTagId === tagId;
            return (
              <Link
                key={tagId}
                href={buildQuery(locale, view, tagId)}
                className={cn(
                  "focus-ring rounded-full border px-3 py-1.5 text-sm",
                  active ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SkillsCapabilityView({
  locale,
  skills,
  allSkillsForFilters,
  catalogs,
  view,
  activeTagId,
  pageCopy
}: {
  locale: Locale;
  skills: SkillWithContent[];
  /** Skills sin filtrar por tag — para mostrar todas las etiquetas en la barra. */
  allSkillsForFilters: SkillWithContent[];
  catalogs: Catalogs;
  view: "matrix" | "list";
  activeTagId?: string;
  pageCopy: LocalizedSkillsPageContent;
}) {
  const labels = pageCopy;
  const tagOptions = Array.from(new Set(allSkillsForFilters.flatMap((s) => s.tags)));

  if (allSkillsForFilters.length === 0) {
    return (
      <Panel className="text-center">
        <p className="text-sm text-slate-400">{labels.emptyPublished}</p>
      </Panel>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="space-y-6">
        <SkillsViewToolbar
          locale={locale}
          catalogs={catalogs}
          view={view}
          activeTagId={activeTagId}
          tagIds={tagOptions}
          pageCopy={pageCopy}
        />
        <Panel className="text-center">
          <p className="text-sm text-slate-400">{labels.emptyFiltered}</p>
        </Panel>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-8">
        <SkillsViewToolbar
          locale={locale}
          catalogs={catalogs}
          view={view}
          activeTagId={activeTagId}
          tagIds={tagOptions}
          pageCopy={pageCopy}
        />
        <SkillsListView locale={locale} skills={skills} catalogs={catalogs} pageCopy={pageCopy} />
      </div>
    );
  }

  const byLevel = groupByLevel(skills);
  const featuredIds = pickFeaturedIds(skills, 2);

  return (
    <div className="space-y-10">
      <SkillsViewToolbar
        locale={locale}
        catalogs={catalogs}
        view={view}
        activeTagId={activeTagId}
        tagIds={tagOptions}
        pageCopy={pageCopy}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-50">{labels.matrixTitle}</h3>
        <p className="max-w-2xl text-sm text-slate-400">{labels.matrixSubtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LEVEL_ORDER.map((level) => (
          <div
            key={level}
            className="flex min-h-0 flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4"
          >
            <div className="flex shrink-0 items-center justify-between gap-2">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">{labLevelLabels[level]}</h4>
              <span className="text-xs text-slate-500">{byLevel[level].length}</span>
            </div>
            <div className="min-h-0 max-h-[min(52vh,26rem)] overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]">
              <div className="space-y-3">
                {byLevel[level].length === 0 ? (
                  <p className="text-xs text-slate-500">—</p>
                ) : (
                  byLevel[level].map((skill) => (
                    <SkillMatrixCell key={skill.id} locale={locale} skill={skill} catalogs={catalogs} pageCopy={pageCopy} />
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">{labels.bentoTitle}</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">{labels.bentoSubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {skills.map((skill) => (
            <SkillBentoCard
              key={skill.id}
              locale={locale}
              skill={skill}
              catalogs={catalogs}
              featured={featuredIds.has(skill.id)}
              pageCopy={pageCopy}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
