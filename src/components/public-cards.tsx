import Link from "next/link";

import { SkillProgressBarInView } from "@/components/skill-progress-bar-in-view";
import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Badge, Panel } from "@/components/ui";
import type { CertificationCardCopy } from "@/lib/content";
import { labLevelLabels, labStateLabels, milestoneStateLabels, milestoneStepPrefix } from "@/lib/constants";
import type { CertificationState, Locale } from "@/lib/types";

export function LabCard({
  locale,
  title,
  summary,
  category,
  level,
  state,
  stack,
  href,
  featured = false
}: {
  locale: Locale;
  title: string;
  summary: string;
  category: string;
  level: keyof typeof labLevelLabels;
  state: keyof typeof labStateLabels;
  stack: string[];
  href: string;
  featured?: boolean;
}) {
  return (
    <Panel className="interactive-lift reveal-up space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">{category}</Badge>
        <Badge>{labLevelLabels[level]}</Badge>
        <Badge tone={state === "completed" ? "success" : "warning"}>{labStateLabels[state]}</Badge>
        {featured ? <Badge tone="accent">Top case study</Badge> : null}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
        <p className="text-sm text-slate-400">{summary}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {stack.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </div>
      <Link
        href={`/${locale}${href}`}
        className="focus-ring inline-flex text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
      >
        Read case study
      </Link>
    </Panel>
  );
}

export function SkillCard({
  locale,
  title,
  summary,
  progress,
  href,
  animateProgressInView = false
}: {
  locale: Locale;
  title: string;
  summary: string;
  progress: number;
  href: string;
  /** Solo en home: la barra anima al entrar en viewport (no al cargar arriba del fold). */
  animateProgressInView?: boolean;
}) {
  const ProgressBar = animateProgressInView ? SkillProgressBarInView : SkillProgressBar;

  return (
    <Panel className="interactive-lift reveal-up space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <span className="text-sm text-cyan-200">{progress}%</span>
      </div>
      <ProgressBar progress={progress} />
      <p className="text-sm text-slate-400">{summary}</p>
      <Link href={`/${locale}${href}`} className="focus-ring text-sm font-medium text-cyan-200 hover:text-cyan-100">
        Explore linked evidence
      </Link>
    </Panel>
  );
}

const certificationTimelineBorder: Record<CertificationState, string> = {
  completed: "border-l-emerald-500/90",
  "in-progress": "border-l-cyan-400/90",
  planned: "border-l-amber-400/85"
};

const certificationBrowseTop: Record<CertificationState, string> = {
  completed: "border-t-emerald-500/95",
  "in-progress": "border-t-cyan-400/95",
  planned: "border-t-amber-400/90"
};

export function CertificationCard({
  locale,
  title,
  provider,
  state,
  date,
  note,
  cardLabels,
  variant = "timeline"
}: {
  locale: Locale;
  title: string;
  provider: string;
  state: CertificationState;
  date: string;
  note: string;
  cardLabels: CertificationCardCopy;
  /** `browse`: tarjeta compacta para rejilla con muchos ítems filtrados. */
  variant?: "timeline" | "browse";
}) {
  const showDate = state !== "planned";
  const formattedDate =
    date && !Number.isNaN(Date.parse(date))
      ? new Date(date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
      : date;

  const isBrowse = variant === "browse";

  return (
    <Panel
      className={
        isBrowse
          ? `interactive-lift reveal-up space-y-3 border border-slate-800/85 bg-slate-950/50 p-5 shadow-lg shadow-slate-950/25 border-t-2 ${certificationBrowseTop[state]}`
          : `interactive-lift reveal-up border-l-4 ${certificationTimelineBorder[state]} space-y-4 bg-slate-950/40 pl-5 shadow-lg shadow-slate-950/30`
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{provider}</Badge>
          <Badge tone={state === "completed" ? "success" : state === "planned" ? "warning" : "accent"}>
            {cardLabels.stateChips[state]}
          </Badge>
        </div>
        {showDate ? (
          <p
            className={
              isBrowse
                ? "shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
                : "shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200/90"
            }
          >
            <span className="sr-only">{cardLabels.dateLabel}: </span>
            {formattedDate}
          </p>
        ) : null}
      </div>
      <h3 className={isBrowse ? "line-clamp-2 text-base font-semibold leading-snug text-slate-50" : "text-lg font-semibold leading-snug text-slate-50"}>
        {title}
      </h3>
      <p className={isBrowse ? "line-clamp-3 text-sm leading-relaxed text-slate-400" : "text-sm leading-relaxed text-slate-400"}>{note}</p>
    </Panel>
  );
}

export function MilestoneCard({
  locale,
  title,
  summary,
  state,
  href,
  stepOrder
}: {
  locale: Locale;
  title: string;
  summary: string;
  state: keyof typeof milestoneStateLabels;
  href: string;
  /** Orden dentro de la fase (paso 1, 2, …). */
  stepOrder?: number;
}) {
  return (
    <Panel className="interactive-lift reveal-up space-y-4">
      {typeof stepOrder === "number" && !Number.isNaN(stepOrder) ? (
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {milestoneStepPrefix[locale]} {stepOrder}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        <Badge tone={state === "completed" ? "success" : state === "active" ? "accent" : "warning"}>
          {milestoneStateLabels[state]}
        </Badge>
      </div>
      <p className="text-sm text-slate-400">{summary}</p>
      <Link href={`/${locale}${href}`} className="focus-ring text-sm font-medium text-cyan-200 hover:text-cyan-100">
        Open milestone
      </Link>
    </Panel>
  );
}
