import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Badge, Panel, Section } from "@/components/ui";
import { LabCard } from "@/components/public-cards";
import { labLevelLabels, skillDetailLabels } from "@/lib/constants";
import { getCatalogs, getLabs, getSkillBySlug, resolveCategoryLabel } from "@/lib/content";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SkillDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const [skill, labs, catalogs] = await Promise.all([getSkillBySlug(typedLocale, slug), getLabs(typedLocale), getCatalogs()]);

  if (!skill) {
    notFound();
  }

  const linkedLabs = labs.filter((lab) => skill.labIds.includes(lab.id));
  const t = skillDetailLabels[typedLocale];

  return (
    <div className="space-y-10">
      <Link href={`/${typedLocale}/skills`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
        {t.back}
      </Link>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
          <Panel className="space-y-5 p-8">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/75">{t.profileTitle}</p>
              <h1 className="text-4xl font-semibold text-slate-50">{skill.content.name}</h1>
              <p className="text-sm text-slate-400">{t.profileDescription}</p>
            </div>
            <p className="text-lg text-slate-300">{skill.content.summary}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>{labLevelLabels[skill.level]}</Badge>
              <Badge tone="accent">{skill.progress}%</Badge>
            </div>
            <SkillProgressBar progress={skill.progress} thick />
          </Panel>
        </div>

        <div className="lg:col-span-7">
          <Section title={t.evidenceTitle} description={t.evidenceDescription}>
            {linkedLabs.length === 0 ? (
              <Panel>
                <p className="text-sm text-slate-400">—</p>
              </Panel>
            ) : (
              <div className="relative border-l border-slate-800 pl-6 md:pl-8">
                <div className="space-y-8">
                  {linkedLabs.map((lab, index) => (
                    <div key={lab.id} className="relative">
                      <span
                        className="absolute -left-[29px] top-6 hidden h-3 w-3 rounded-full border-2 border-cyan-400/50 bg-slate-950 md:block md:-left-[33px]"
                        aria-hidden
                      />
                      <div className={index === 0 ? "pt-0" : ""}>
                        <LabCard
                          locale={typedLocale}
                          title={lab.content.title}
                          summary={lab.content.summary}
                          category={resolveCategoryLabel(catalogs, lab.categoryId, typedLocale)}
                          level={lab.level}
                          state={lab.state}
                          stack={lab.stack}
                          href={`/labs/${lab.slug}`}
                          featured={lab.isTopCaseStudy}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
