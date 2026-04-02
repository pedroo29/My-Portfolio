import Link from "next/link";

import { Badge, Panel } from "@/components/ui";
import { milestoneStateLabels, milestoneStepPrefix } from "@/lib/constants";
import { indexMilestonesByPhase } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Locale, LocalizedRoadmapPageContent, MilestoneState, RoadmapMilestone, RoadmapPhase } from "@/lib/types";

type PhaseWithContent = RoadmapPhase & { content: { title: string; summary: string } };
type MilestoneWithContent = RoadmapMilestone & { content: { title: string; summary: string } };

const stateRank: Record<MilestoneState, number> = {
  active: 0,
  planned: 1,
  completed: 2
};

function pickHeroMilestone(milestones: MilestoneWithContent[]) {
  return [...milestones].sort((left, right) => {
    const rankDiff = stateRank[left.state] - stateRank[right.state];
    if (rankDiff !== 0) return rankDiff;
    const leftOrder = typeof left.order === "number" ? left.order : Number.MAX_SAFE_INTEGER;
    const rightOrder = typeof right.order === "number" ? right.order : Number.MAX_SAFE_INTEGER;
    return leftOrder - rightOrder;
  })[0];
}

function toneByState(state: MilestoneState): "accent" | "success" | "warning" {
  if (state === "completed") return "success";
  if (state === "active") return "accent";
  return "warning";
}

function accentByIndex(index: number) {
  const accents = [
    {
      border: "border-cyan-400/45",
      text: "text-cyan-200",
      chip: "bg-cyan-400/10 text-cyan-100 border-cyan-300/30",
      glow: "from-cyan-400/20 via-cyan-300/10 to-transparent"
    },
    {
      border: "border-fuchsia-400/45",
      text: "text-fuchsia-200",
      chip: "bg-fuchsia-400/10 text-fuchsia-100 border-fuchsia-300/30",
      glow: "from-fuchsia-400/20 via-fuchsia-300/10 to-transparent"
    },
    {
      border: "border-emerald-400/45",
      text: "text-emerald-200",
      chip: "bg-emerald-400/10 text-emerald-100 border-emerald-300/30",
      glow: "from-emerald-400/20 via-emerald-300/10 to-transparent"
    }
  ] as const;
  return accents[index % accents.length];
}

function stateCardAccent(state: MilestoneState) {
  if (state === "active") return "ring-1 ring-cyan-400/30";
  if (state === "completed") return "ring-1 ring-emerald-400/25";
  return "ring-1 ring-amber-400/20";
}

function PhaseStoryHeader({
  order,
  phaseIndex,
  title,
  summary,
  roadmapCopy
}: {
  order: number;
  phaseIndex: number;
  title: string;
  summary: string;
  roadmapCopy: LocalizedRoadmapPageContent;
}) {
  const labels = roadmapCopy;
  const accent = accentByIndex(phaseIndex);

  return (
    <div className={cn("relative space-y-2 border-l-2 pl-4", accent.border)}>
      <div className={cn("pointer-events-none absolute -left-[2px] top-0 h-12 w-[2px] bg-gradient-to-b", accent.glow)} aria-hidden />
      <p className={cn("text-xs font-semibold uppercase tracking-[0.24em]", accent.text)}>
        {labels.phaseLabel} {order}
      </p>
      <h2 className="text-2xl font-semibold text-slate-50">{title}</h2>
      <p className="max-w-3xl text-sm text-slate-400">{summary}</p>
    </div>
  );
}

function RoadmapPhaseConnector({ phaseIndex }: { phaseIndex: number }) {
  const accent = accentByIndex(phaseIndex);

  return (
    <div
      className={cn("relative mx-auto my-4 h-10 w-px bg-gradient-to-b to-transparent", accent.glow)}
      aria-hidden
    >
      <span className={cn("absolute -left-[3px] top-0 h-2 w-2 rounded-full", accent.border.replace("border", "bg"))} />
    </div>
  );
}

function MilestoneBentoCard({
  locale,
  milestone,
  featured = false,
  phaseIndex,
  roadmapCopy
}: {
  locale: Locale;
  milestone: MilestoneWithContent;
  featured?: boolean;
  phaseIndex: number;
  roadmapCopy: LocalizedRoadmapPageContent;
}) {
  const labels = roadmapCopy;
  const tone = toneByState(milestone.state);
  const accent = accentByIndex(phaseIndex);

  return (
    <Link
      href={`/${locale}/roadmap/${milestone.slug}`}
      className={cn(
        "focus-ring reveal-up group relative block overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/75 p-5 transition",
        "hover:bg-slate-900/80 hover:shadow-[0_0_34px_rgba(34,211,238,0.09)]",
        stateCardAccent(milestone.state),
        featured ? "md:col-span-2 md:row-span-2 md:p-6" : "",
        accent.border
      )}
    >
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b", accent.glow)} aria-hidden />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {typeof milestone.order === "number" ? (
            <Badge>{`${milestoneStepPrefix[locale]} ${milestone.order}`}</Badge>
          ) : null}
          <Badge tone={tone}>{milestoneStateLabels[milestone.state]}</Badge>
          {milestone.priority ? (
            <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase", accent.chip)}>
              {milestone.priority}
            </span>
          ) : null}
          {featured ? <Badge tone="accent">{labels.featuredBadge}</Badge> : null}
        </div>
        {milestone.estimatedEffort ? <span className="text-xs uppercase tracking-[0.16em] text-slate-500">{milestone.estimatedEffort}</span> : null}
      </div>

      <h3 className={featured ? "text-xl font-semibold text-slate-50 md:text-2xl" : "text-lg font-semibold text-slate-50"}>{milestone.content.title}</h3>
      <p
        className={cn(
          featured ? "mt-3 max-w-xl text-sm text-slate-300" : "mt-2 line-clamp-3 text-sm text-slate-400"
        )}
      >
        {milestone.content.summary}
      </p>

      <p className={cn("mt-4 text-sm font-medium transition group-hover:text-slate-100", accent.text)}>{labels.openMilestoneCta}</p>
    </Link>
  );
}

export function RoadmapStoryBento({
  locale,
  phases,
  milestones,
  roadmapCopy
}: {
  locale: Locale;
  phases: PhaseWithContent[];
  milestones: MilestoneWithContent[];
  roadmapCopy: LocalizedRoadmapPageContent;
}) {
  const labels = roadmapCopy;

  if (phases.length === 0) {
    return (
      <Panel className="text-center">
        <p className="text-sm text-slate-400">{labels.emptyRoadmap}</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-8">
      {phases.map((phase, phaseIndex) => {
        const items = indexMilestonesByPhase(milestones, phase.id) as MilestoneWithContent[];
        const hero = items.length > 0 ? pickHeroMilestone(items) : undefined;
        const rest = hero ? items.filter((item) => item.id !== hero.id) : [];
        const accent = accentByIndex(phaseIndex);

        return (
          <section
            key={phase.id}
            id={`roadmap-phase-${phase.slug}`}
            className="scroll-mt-28 space-y-5 rounded-3xl border border-slate-800/80 bg-slate-950/35 p-4 md:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <PhaseStoryHeader
                order={phase.order}
                phaseIndex={phaseIndex}
                title={phase.content.title}
                summary={phase.content.summary}
                roadmapCopy={roadmapCopy}
              />
              <span className={cn("hidden rounded-full border px-3 py-1 text-xs font-medium md:inline-flex", accent.chip)}>
                {items.length} {labels.itemCountLabel}
              </span>
            </div>

            {items.length === 0 ? (
              <Panel>
                <p className="text-sm text-slate-400">{labels.emptyPhase}</p>
              </Panel>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {hero ? (
                  <MilestoneBentoCard
                    locale={locale}
                    phaseIndex={phaseIndex}
                    milestone={hero}
                    featured
                    roadmapCopy={roadmapCopy}
                  />
                ) : null}
                {rest.map((item) => (
                  <MilestoneBentoCard
                    key={item.id}
                    locale={locale}
                    phaseIndex={phaseIndex}
                    milestone={item}
                    roadmapCopy={roadmapCopy}
                  />
                ))}
              </div>
            )}

            {phaseIndex < phases.length - 1 ? <RoadmapPhaseConnector phaseIndex={phaseIndex} /> : null}
          </section>
        );
      })}
    </div>
  );
}
