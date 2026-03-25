import Link from "next/link";

import { SkillProgressBarInView } from "@/components/skill-progress-bar-in-view";
import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Badge, Panel } from "@/components/ui";
import {
  certificationStateLabels,
  labLevelLabels,
  labStateLabels,
  milestoneStateLabels,
  milestoneStepPrefix
} from "@/lib/constants";
import type { Locale } from "@/lib/types";

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

export function CertificationCard({
  title,
  provider,
  state,
  date,
  note
}: {
  title: string;
  provider: string;
  state: keyof typeof certificationStateLabels;
  date: string;
  note: string;
}) {
  return (
    <Panel className="interactive-lift reveal-up space-y-3">
      <div className="flex flex-wrap gap-2">
        <Badge tone="accent">{provider}</Badge>
        <Badge tone={state === "completed" ? "success" : state === "planned" ? "warning" : "accent"}>
          {certificationStateLabels[state]}
        </Badge>
      </div>
      <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      <p className="text-sm text-slate-400">{note}</p>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{date}</p>
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
