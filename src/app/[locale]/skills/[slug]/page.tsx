import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillProgressBar } from "@/components/skill-progress-bar";
import { Panel, Section } from "@/components/ui";
import { LabCard } from "@/components/public-cards";
import { getCatalogs, getLabs, getSkillBySlug, resolveCategoryLabel } from "@/lib/content";
import type { Locale } from "@/lib/types";

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

  return (
    <div className="space-y-10">
      <Link href={`/${typedLocale}/skills`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
        Back to skills
      </Link>

      <Panel className="space-y-5 p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-slate-50">{skill.content.name}</h1>
            <p className="max-w-3xl text-lg text-slate-300">{skill.content.summary}</p>
          </div>
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-xl font-semibold text-cyan-100">
            {skill.progress}%
          </div>
        </div>
        <SkillProgressBar progress={skill.progress} thick />
      </Panel>

      <Section title="Evidence linked to this skill" description="Each lab below acts as concrete proof of how this skill is applied.">
        <div className="grid gap-6 lg:grid-cols-2">
          {linkedLabs.map((lab) => (
            <LabCard
              key={lab.id}
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
          ))}
        </div>
      </Section>
    </div>
  );
}
