import { Panel, Section } from "@/components/ui";
import { getAboutContent } from "@/lib/content";
import type { Locale } from "@/lib/types";

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const about = await getAboutContent(typedLocale);

  return (
    <div className="space-y-10">
      <Section eyebrow="About" title={about.headline} description={about.intro}>
        <Panel className="space-y-5">
          <p className="max-w-4xl text-base leading-8 text-slate-300">{about.summary}</p>
          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="space-y-2 bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
              <p className="text-sm text-slate-100">{about.location}</p>
            </Panel>
            <Panel className="space-y-2 bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Role focus</p>
              <p className="text-sm text-slate-100">{about.roleFocus}</p>
            </Panel>
            <Panel className="space-y-2 bg-slate-950/70">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Experience</p>
              <p className="text-sm text-slate-100">{about.yearsExperience}</p>
            </Panel>
          </div>
        </Panel>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Core competencies</h2>
          <PillList items={about.coreCompetencies} />
        </Panel>
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Strengths</h2>
          <PillList items={about.strengths} />
        </Panel>
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Working style</h2>
          <PillList items={about.workingStyle} />
        </Panel>
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Goals</h2>
          <PillList items={about.goals} />
        </Panel>
      </div>
    </div>
  );
}
