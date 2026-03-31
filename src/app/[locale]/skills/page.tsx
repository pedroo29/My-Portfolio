import { SkillsCapabilityView } from "@/components/skills-capability-view";
import { Section } from "@/components/ui";
import { getCatalogs, getSkills } from "@/lib/content";
import { skillsPageContent } from "@/lib/constants";
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

  const [allSkills, catalogs] = await Promise.all([getSkills(typedLocale), getCatalogs()]);
  const filtered = tagFilter ? allSkills.filter((s) => s.tags.includes(tagFilter)) : allSkills;

  const copy = skillsPageContent[typedLocale];

  return (
    <div className="space-y-10">
      <Section eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
        <SkillsCapabilityView
          locale={typedLocale}
          skills={filtered}
          allSkillsForFilters={allSkills}
          catalogs={catalogs}
          view={view}
          activeTagId={tagFilter}
        />
      </Section>
    </div>
  );
}
