import { Panel, Section } from "@/components/ui";
import { MilestoneCard } from "@/components/public-cards";
import { getRoadmap, indexMilestonesByPhase } from "@/lib/content";
import type { Locale } from "@/lib/types";

export default async function RoadmapPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const roadmap = await getRoadmap(typedLocale);

  return (
    <div className="space-y-10">
      <Section
        eyebrow="Roadmap"
        title="Professional progression by phases and milestones"
        description="The roadmap makes growth legible by showing how execution, learning and validation connect over time."
      >
        <div className="space-y-8">
          {roadmap.phases.map((phase) => {
            const milestones = indexMilestonesByPhase(roadmap.milestones, phase.id);
            return (
              <Panel key={phase.id} className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">Phase {phase.order}</p>
                  <h2 className="text-2xl font-semibold text-slate-50">{phase.content.title}</h2>
                  <p className="max-w-3xl text-sm text-slate-400">{phase.content.summary}</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  {milestones.map((milestone) => (
                    <MilestoneCard
                      key={milestone.id}
                      locale={typedLocale}
                      title={milestone.content.title}
                      summary={milestone.content.summary}
                      state={milestone.state}
                      href={`/roadmap/${milestone.slug}`}
                      stepOrder={milestone.order}
                    />
                  ))}
                </div>
              </Panel>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
