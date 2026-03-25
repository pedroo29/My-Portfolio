import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge, Panel, Section } from "@/components/ui";
import { getCatalogs, getLabBySlug, getLabs, getSkills, resolveCategoryLabel, resolveTagLabels } from "@/lib/content";
import { readStore } from "@/lib/server/content-store";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default async function LabDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;

  const [lab, catalogs, labs, skills, store] = await Promise.all([
    getLabBySlug(typedLocale, slug),
    getCatalogs(),
    getLabs(typedLocale),
    getSkills(typedLocale),
    readStore()
  ]);

  if (!lab) {
    notFound();
  }

  const relatedLabs = labs.filter((item) => item.id !== lab.id && item.tags.some((tag) => lab.tags.includes(tag))).slice(0, 2);
  const relatedSkills = skills.filter((skill) => lab.skillIds.includes(skill.id));
  const relatedMedia = store.media.filter((asset) => lab.mediaIds.includes(asset.id));

  return (
    <div className="space-y-12">
      <Link href={`/${typedLocale}/labs`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
        Back to labs
      </Link>

      <Panel className="space-y-6 p-8 md:p-10">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{resolveCategoryLabel(catalogs, lab.categoryId, typedLocale)}</Badge>
          <Badge>{lab.level}</Badge>
          <Badge tone={lab.state === "completed" ? "success" : "warning"}>{lab.state}</Badge>
          {lab.isTopCaseStudy ? <Badge tone="accent">Top case study</Badge> : null}
        </div>
        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-semibold text-slate-50">{lab.content.title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300">{lab.content.summary}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Date</p>
            <p className="text-sm text-slate-200">{formatDate(lab.date)}</p>
          </Panel>
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Stack</p>
            <p className="text-sm text-slate-200">{lab.stack.join(", ")}</p>
          </Panel>
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tags</p>
            <p className="text-sm text-slate-200">{resolveTagLabels(catalogs, lab.tags, typedLocale).join(", ")}</p>
          </Panel>
          <Panel className="space-y-2 bg-slate-950/70">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Evidence links</p>
            <p className="text-sm text-slate-200">{lab.evidenceLinks.length}</p>
          </Panel>
        </div>
      </Panel>

      <Section
        eyebrow="Primary case study"
        title="Documentation"
        description="This is the main narrative layer of the lab: context, implementation detail, evidence and technical reasoning in a long-form format."
      >
        <Panel className="prose-copy space-y-8 p-8 md:p-10 xl:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="accent">Main documentation</Badge>
            <Badge>{lab.content.documentation.trim() ? `${lab.content.documentation.length} chars` : "Empty"}</Badge>
            <Badge tone={relatedMedia.length > 0 ? "success" : "warning"}>
              {relatedMedia.length > 0 ? `${relatedMedia.length} media assets linked` : "No linked media yet"}
            </Badge>
          </div>
          <MarkdownRenderer content={lab.content.documentation} locale={typedLocale} mediaAssets={store.media} className="documentation-body" />
        </Panel>
      </Section>

      <div className="grid gap-8 xl:grid-cols-3">
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Objectives</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {lab.content.objectives.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Results</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {lab.content.results.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Panel>
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Lessons learned</h2>
          <ul className="space-y-3 text-sm text-slate-300">
            {lab.content.lessonsLearned.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Impact metrics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {lab.metrics.map((metric) => (
              <Panel key={metric.label} className="space-y-2 bg-slate-950/70">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
                <p className="text-2xl font-semibold text-slate-50">{metric.value}</p>
              </Panel>
            ))}
          </div>
        </Panel>

        <Panel className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-50">Evidence and connected skills</h2>
          <div className="space-y-3 text-sm text-slate-300">
            {lab.evidenceLinks.map((item) => (
              <a key={item.url} href={item.url} className="focus-ring block text-cyan-200 hover:text-cyan-100">
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedSkills.map((skill) => (
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

      {relatedMedia.length > 0 ? (
        <Section title="Associated media" description="Media assets connected to this lab for richer technical storytelling.">
          <div className="grid gap-6 xl:grid-cols-3">
            {relatedMedia.map((item) => (
              <Panel key={item.id} className="space-y-3">
                {item.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.alt[typedLocale]} className="h-56 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-sm text-slate-500">
                    {item.mimeType}
                  </div>
                )}
                <p className="text-sm text-slate-400">{item.caption[typedLocale]}</p>
              </Panel>
            ))}
          </div>
        </Section>
      ) : null}

      {relatedLabs.length > 0 ? (
        <Section title="Related labs" description="Adjacent technical work connected by themes, stack or learning outcomes.">
          <div className="grid gap-6 lg:grid-cols-2">
            {relatedLabs.map((item) => (
              <Panel key={item.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-50">{item.content.title}</h3>
                <p className="text-sm text-slate-400">{item.content.summary}</p>
                <Link href={`/${typedLocale}/labs/${item.slug}`} className="focus-ring text-sm text-cyan-200 hover:text-cyan-100">
                  Read case study
                </Link>
              </Panel>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
