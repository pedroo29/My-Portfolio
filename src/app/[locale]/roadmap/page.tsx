import { RoadmapPhaseMinimap } from "@/components/roadmap-phase-minimap";
import { RoadmapStoryBento } from "@/components/roadmap-story-bento";
import { Section } from "@/components/ui";
import { getRoadmap, getRoadmapPageContent } from "@/lib/content";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RoadmapPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const [roadmap, roadmapCopy] = await Promise.all([getRoadmap(typedLocale), getRoadmapPageContent(typedLocale)]);

  return (
    <div className="space-y-10">
      <Section eyebrow={roadmapCopy.eyebrow} title={roadmapCopy.title} description={roadmapCopy.description}>
        <RoadmapStoryBento
          locale={typedLocale}
          phases={roadmap.phases}
          milestones={roadmap.milestones}
          roadmapCopy={roadmapCopy}
        />
      </Section>
      <RoadmapPhaseMinimap
        phases={roadmap.phases.map((phase) => ({
          slug: phase.slug,
          order: phase.order,
          title: phase.content.title
        }))}
        roadmapCopy={roadmapCopy}
      />
    </div>
  );
}
