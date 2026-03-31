import { RoadmapPhaseMinimap } from "@/components/roadmap-phase-minimap";
import { RoadmapStoryBento } from "@/components/roadmap-story-bento";
import { Section } from "@/components/ui";
import { roadmapPageContent } from "@/lib/constants";
import { getRoadmap } from "@/lib/content";
import type { Locale } from "@/lib/types";

export default async function RoadmapPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const roadmap = await getRoadmap(typedLocale);
  const labels = roadmapPageContent[typedLocale];

  return (
    <div className="space-y-10">
      <Section eyebrow={labels.eyebrow} title={labels.title} description={labels.description}>
        <RoadmapStoryBento locale={typedLocale} phases={roadmap.phases} milestones={roadmap.milestones} />
      </Section>
      <RoadmapPhaseMinimap
        locale={typedLocale}
        phases={roadmap.phases.map((phase) => ({
          slug: phase.slug,
          order: phase.order,
          title: phase.content.title
        }))}
      />
    </div>
  );
}
