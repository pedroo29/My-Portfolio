import Link from "next/link";
import { notFound } from "next/navigation";

import { CarouselSlide, HorizontalCarousel } from "@/components/horizontal-carousel";
import { LabDocToc } from "@/components/lab-doc-toc";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { Badge, Panel, Section } from "@/components/ui";
import { labDetailPageLabels, labLevelLabels } from "@/lib/constants";
import { getCatalogs, getLabBySlug, getLabs, getSkills, resolveCategoryLabel, resolveTagLabels } from "@/lib/content";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { readStore } from "@/lib/server/content-store";
import { cn, formatDate, isExternalHttpHref, resolveEvidenceHref } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

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

  const ld = labDetailPageLabels[typedLocale];
  const relatedLabs = labs.filter((item) => item.id !== lab.id && item.tags.some((tag) => lab.tags.includes(tag)));
  const relatedSkills = skills.filter((skill) => lab.skillIds.includes(skill.id));
  const relatedMedia = store.media.filter((asset) => lab.mediaIds.includes(asset.id));
  const documentationHeadings = extractMarkdownHeadings(lab.content.documentation, 3);

  return (
    <div className="space-y-12">
      <Link href={`/${typedLocale}/labs`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
        {ld.back}
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

      <section
        aria-labelledby="lab-documentation-heading"
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-cyan-500/40 bg-slate-950/90 shadow-[0_0_70px_-18px_rgba(34,211,238,0.25)]",
          "ring-1 ring-cyan-400/20"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-30%,rgba(34,211,238,0.22),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-slate-950/80 to-fuchsia-950/25" aria-hidden />
        <div className="relative space-y-6 p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/90">{ld.docEyebrow}</p>
            <h2 id="lab-documentation-heading" className="text-2xl font-semibold text-slate-50 md:text-3xl">
              {ld.docTitle}
            </h2>
            <p className="max-w-3xl text-sm text-slate-300 md:text-base">{ld.docDescription}</p>
          </div>
          <Panel className="prose-copy space-y-8 border border-cyan-500/25 bg-slate-950/80 p-8 shadow-inner shadow-slate-950/50 md:p-10 xl:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="accent">{ld.docBadgeMain}</Badge>
              <Badge>
                {lab.content.documentation.trim() ? ld.docBadgeChars(lab.content.documentation.length) : ld.docBadgeEmpty}
              </Badge>
              <Badge tone={relatedMedia.length > 0 ? "success" : "warning"}>
                {relatedMedia.length > 0 ? ld.docBadgeMediaCount(relatedMedia.length) : ld.docBadgeMediaNone}
              </Badge>
            </div>
            <MarkdownRenderer
              content={lab.content.documentation}
              locale={typedLocale}
              mediaAssets={store.media}
              className="documentation-body"
            />
          </Panel>
        </div>
      </section>

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

        <Panel className="space-y-6 border border-slate-800/80 bg-slate-950/40 p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-50 md:text-2xl">{ld.evidenceAndSkillsTitle}</h2>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{ld.evidenceLinksHeading}</h3>
            <ul className="space-y-2 text-sm">
              {lab.evidenceLinks.map((item, index) => {
                const resolved = resolveEvidenceHref(item.url, typedLocale);
                return (
                  <li key={`${item.label}-${index}`}>
                    {resolved ? (
                      isExternalHttpHref(resolved) ? (
                        <a
                          href={resolved}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring inline-flex items-center gap-2 rounded-lg border border-slate-700/90 bg-slate-900/50 px-3 py-2 text-cyan-200 transition hover:border-cyan-400/35 hover:bg-slate-900 hover:text-cyan-50"
                        >
                          <span>{item.label}</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500" aria-hidden>
                            ↗
                          </span>
                        </a>
                      ) : /^(mailto:|tel:)/i.test(resolved) ? (
                        <a
                          href={resolved}
                          className="focus-ring inline-flex rounded-lg border border-slate-700/90 bg-slate-900/50 px-3 py-2 text-cyan-200 transition hover:border-cyan-400/35 hover:bg-slate-900 hover:text-cyan-50"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={resolved}
                          className="focus-ring inline-flex rounded-lg border border-slate-700/90 bg-slate-900/50 px-3 py-2 text-cyan-200 transition hover:border-cyan-400/35 hover:bg-slate-900 hover:text-cyan-50"
                        >
                          {item.label}
                        </Link>
                      )
                    ) : (
                      <span className="inline-flex rounded-lg border border-dashed border-slate-700 px-3 py-2 text-slate-500" title={ld.evidenceLinkInvalid}>
                        {item.label}
                        <span className="sr-only"> ({ld.evidenceLinkInvalid})</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {relatedSkills.length > 0 ? (
            <div className="space-y-4 border-t border-slate-800/80 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">{ld.connectedSkillsHeading}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedSkills.map((skill) => (
                  <Link
                    key={skill.id}
                    href={`/${typedLocale}/skills/${skill.slug}`}
                    className={cn(
                      "focus-ring group relative block overflow-hidden rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-950/55 via-slate-950/90 to-slate-950 p-4 transition",
                      "hover:-translate-y-0.5 hover:border-cyan-300/55 hover:shadow-[0_12px_36px_-10px_rgba(34,211,238,0.2)]"
                    )}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200/85">{labLevelLabels[skill.level]}</p>
                    <p className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-slate-50 group-hover:text-cyan-50">
                      {skill.content.name}
                    </p>
                    <div className="mt-4 h-0.5 w-10 rounded-full bg-gradient-to-r from-cyan-400/80 to-transparent" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
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
        <Section title={ld.relatedTitle} description={ld.relatedDescription}>
          <HorizontalCarousel
            ariaLabel={ld.relatedCarouselRegion}
            prevLabel={ld.relatedCarouselPrev}
            nextLabel={ld.relatedCarouselNext}
          >
            {relatedLabs.map((item) => (
              <CarouselSlide key={item.id}>
                <Panel className="h-full space-y-3 border border-slate-800/90 p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-50">{item.content.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{item.content.summary}</p>
                  <Link href={`/${typedLocale}/labs/${item.slug}`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
                    {ld.readCaseStudy}
                  </Link>
                </Panel>
              </CarouselSlide>
            ))}
          </HorizontalCarousel>
        </Section>
      ) : null}

      <LabDocToc locale={typedLocale} headings={documentationHeadings} />
    </div>
  );
}
