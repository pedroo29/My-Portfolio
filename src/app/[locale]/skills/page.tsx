import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Section } from "@/components/ui";
import { SkillCard } from "@/components/public-cards";
import { getSkills } from "@/lib/content";
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
  const view = typeof query.view === "string" ? query.view : "cards";
  const skills = await getSkills(typedLocale);

  return (
    <div className="space-y-10">
      <Section
        eyebrow="Capability map"
        title="Skills backed by visible evidence"
        description="The skills section is designed as a traceable matrix: level, progress and connected labs all work together."
        action={
          <div className="flex gap-2">
            <a
              href={`/${typedLocale}/skills?view=cards`}
              className={`focus-ring rounded-full border px-3 py-2 text-sm ${view === "cards" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"}`}
            >
              Cards
            </a>
            <a
              href={`/${typedLocale}/skills?view=list`}
              className={`focus-ring rounded-full border px-3 py-2 text-sm ${view === "list" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-slate-700 text-slate-300"}`}
            >
              List
            </a>
          </div>
        }
      >
        {view === "list" ? (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <a href={`/${typedLocale}/skills/${skill.slug}`} className="focus-ring text-lg font-semibold text-cyan-100">
                      {skill.content.name}
                    </a>
                    <p className="text-sm text-slate-400">{skill.content.summary}</p>
                  </div>
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{skill.level}</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <SkillProgressBar progress={skill.progress} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                locale={typedLocale}
                title={skill.content.name}
                summary={skill.content.summary}
                progress={skill.progress}
                href={`/skills/${skill.slug}`}
              />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
