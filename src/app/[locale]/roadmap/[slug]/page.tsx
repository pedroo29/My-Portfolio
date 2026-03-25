import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Panel, Section } from "@/components/ui";
import { milestoneStepPrefix } from "@/lib/constants";
import { getMilestoneBySlug, getRoadmap, getSkills, indexMilestonesByPhase } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default async function RoadmapMilestonePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const [milestone, roadmap, skills] = await Promise.all([getMilestoneBySlug(typedLocale, slug), getRoadmap(typedLocale), getSkills(typedLocale)]);

  if (!milestone) {
    notFound();
  }

  const phase = roadmap.phases.find((item) => item.id === milestone.phaseId);
  const relatedMilestones = indexMilestonesByPhase(roadmap.milestones, milestone.phaseId).filter((item) => item.id !== milestone.id);
  const linkedSkills = skills.filter((skill) => milestone.skillIds.includes(skill.id));

  return (
    <div className="space-y-10">
      <Link href={`/${typedLocale}/roadmap`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
        Back to roadmap
      </Link>

      <Panel className="space-y-5 p-8">
        <div className="flex flex-wrap gap-2">
          {phase ? <Badge tone="accent">{phase.content.title}</Badge> : null}
          {typeof milestone.order === "number" && !Number.isNaN(milestone.order) ? (
            <Badge>
              {milestoneStepPrefix[typedLocale]} {milestone.order}
            </Badge>
          ) : null}
          <Badge>{milestone.state}</Badge>
          {milestone.priority ? <Badge tone="warning">{milestone.priority}</Badge> : null}
        </div>
        <h1 className="text-4xl font-semibold text-slate-50">{milestone.content.title}</h1>
        <p className="max-w-3xl text-lg text-slate-300">{milestone.content.summary}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Start</p>
            <p className="text-sm text-slate-200">{formatDate(milestone.startDate)}</p>
          </Panel>
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">End</p>
            <p className="text-sm text-slate-200">{formatDate(milestone.endDate)}</p>
          </Panel>
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Estimated effort</p>
            <p className="text-sm text-slate-200">{milestone.estimatedEffort ?? "Not set"}</p>
          </Panel>
        </div>
      </Panel>

      <Section title="Outcomes" description="This milestone connects expected progress to visible technical proof.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel className="space-y-4">
            <ul className="space-y-3 text-sm text-slate-300">
              {milestone.content.outcomes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </Panel>
          <Panel className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-50">Related skills</h3>
            <div className="flex flex-wrap gap-2">
              {linkedSkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/${typedLocale}/skills/${skill.slug}`}
                  className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-cyan-300/40 hover:text-cyan-100"
                >
                  {skill.content.name}
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </Section>

      {relatedMilestones.length > 0 ? (
        <Section title="Other milestones in this phase" description="Additional work that sits in the same progression phase.">
          <div className="grid gap-6 lg:grid-cols-2">
            {relatedMilestones.map((item) => (
              <Panel key={item.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-50">{item.content.title}</h3>
                <p className="text-sm text-slate-400">{item.content.summary}</p>
                <Link href={`/${typedLocale}/roadmap/${item.slug}`} className="focus-ring text-sm text-cyan-200 hover:text-cyan-100">
                  Open milestone
                </Link>
              </Panel>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
