import { SkillsCapabilityView } from "@/components/skills-capability-view";
import { Section } from "@/components/ui";
import { getCatalogs, getSkills, getSkillsPageContent } from "@/lib/content";
import type { Locale } from "@/lib/types";

export default async function SkillsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const query = await searchParams;
  const view = typeof query.view === "string" && query.view === "list" ? "list" : "matrix";
  const tagFilter = typeof query.tag === "string" ? query.tag : undefined;

  const [allSkills, catalogs, pageCopy] = await Promise.all([
    getSkills(typedLocale),
    getCatalogs(),
    getSkillsPageContent(typedLocale)
  ]);
  const filtered = tagFilter ? allSkills.filter((s) => s.tags.includes(tagFilter)) : allSkills;

  return (
    <div className="space-y-10">
      <Section eyebrow={pageCopy.eyebrow} title={pageCopy.title} description={pageCopy.description}>
        <SkillsCapabilityView
          locale={typedLocale}
          skills={filtered}
          allSkillsForFilters={allSkills}
          catalogs={catalogs}
          view={view}
          activeTagId={tagFilter}
          pageCopy={pageCopy}
        />
      </Section>
    </div>
  );
}
