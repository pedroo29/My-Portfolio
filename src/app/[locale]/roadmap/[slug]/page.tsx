import Link from "next/link";
import { notFound } from "next/navigation";

import { CarouselSlide, HorizontalCarousel } from "@/components/horizontal-carousel";
import { CertificationCard } from "@/components/public-cards";
import { Badge, Panel, Section } from "@/components/ui";
import { labLevelLabels, milestoneDetailLabels, milestoneStepPrefix } from "@/lib/constants";
import {
  certificationCardLabelsFromPage,
  getCatalogs,
  getCertifications,
  getCertificationsPageContent,
  getMilestoneBySlug,
  getRoadmap,
  getRoadmapPageContent,
  getSkills,
  indexMilestonesByPhase,
  resolveProviderLabel
} from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RoadmapMilestonePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const labels = milestoneDetailLabels[typedLocale];

  const [milestone, roadmap, skills, certifications, catalogs, roadmapCopy, certPageCopy] = await Promise.all([
    getMilestoneBySlug(typedLocale, slug),
    getRoadmap(typedLocale),
    getSkills(typedLocale),
    getCertifications(typedLocale),
    getCatalogs(),
    getRoadmapPageContent(typedLocale),
    getCertificationsPageContent(typedLocale)
  ]);
  const certCardLabels = certificationCardLabelsFromPage(certPageCopy);

  if (!milestone) {
    notFound();
  }

  const phase = roadmap.phases.find((item) => item.id === milestone.phaseId);
  const relatedMilestones = indexMilestonesByPhase(roadmap.milestones, milestone.phaseId).filter((item) => item.id !== milestone.id);

  const linkedSkills = milestone.skillIds
    .map((id) => skills.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const linkedCerts = milestone.certificationIds
    .map((id) => certifications.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="space-y-12">
      <section
        aria-labelledby="milestone-hero-heading"
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-fuchsia-400/35 bg-slate-950/85 shadow-[0_0_70px_-16px_rgba(217,70,239,0.22)]",
          "ring-1 ring-fuchsia-500/15"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_60%_at_50%_-25%,rgba(217,70,239,0.18),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-950/40 via-slate-950/75 to-cyan-950/30"
          aria-hidden
        />
        <div className="relative space-y-6 p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <Link
              href={`/${typedLocale}/roadmap`}
              className="focus-ring inline-flex w-fit shrink-0 rounded-full border border-fuchsia-400/35 bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-100 transition hover:border-fuchsia-300/50 hover:bg-fuchsia-400/15"
            >
              {labels.backToRoadmap}
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-fuchsia-200/90 sm:text-right">{labels.heroEyebrow}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {phase ? <Badge tone="accent">{phase.content.title}</Badge> : null}
            {typeof milestone.order === "number" && !Number.isNaN(milestone.order) ? (
              <Badge>
                {milestoneStepPrefix[typedLocale]} {milestone.order}
              </Badge>
            ) : null}
            <Badge>{milestone.state}</Badge>
            {milestone.priority ? <Badge tone="warning">{milestone.priority}</Badge> : null}
          </div>

          <h1 id="milestone-hero-heading" className="max-w-4xl text-3xl font-semibold leading-tight text-slate-50 sm:text-4xl md:text-5xl">
            {milestone.content.title}
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg md:leading-relaxed">
            {milestone.content.summary}
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="space-y-2 border border-cyan-500/20 bg-slate-950/70 shadow-inner shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">{labels.metaStart}</p>
              <p className="text-sm font-medium text-slate-100">{formatDate(milestone.startDate)}</p>
            </Panel>
            <Panel className="space-y-2 border border-cyan-500/20 bg-slate-950/70 shadow-inner shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">{labels.metaEnd}</p>
              <p className="text-sm font-medium text-slate-100">{formatDate(milestone.endDate)}</p>
            </Panel>
            <Panel className="space-y-2 border border-fuchsia-400/25 bg-slate-950/70 shadow-inner shadow-slate-950/40">
              <p className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/80">{labels.metaEffort}</p>
              <p className="text-sm font-medium text-slate-100">{milestone.estimatedEffort ?? labels.notSet}</p>
            </Panel>
          </div>
        </div>
      </section>

      {/* Skills — bloque destacado */}
      <section
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-cyan-500/35 bg-slate-950/80 p-6 shadow-[0_0_60px_-12px_rgba(34,211,238,0.18)] sm:p-8 md:p-10"
        )}
        aria-labelledby="milestone-skills-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_20%_-10%,rgba(34,211,238,0.16),transparent)]"
          aria-hidden
        />
        <div className="relative space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/90">{labels.skillsEyebrow}</p>
            <h2 id="milestone-skills-heading" className="text-2xl font-semibold text-slate-50 md:text-3xl">
              {labels.skillsTitle}
            </h2>
            <p className="max-w-2xl text-sm text-slate-400 md:text-base">{labels.skillsDescription}</p>
          </div>
          {linkedSkills.length === 0 ? (
            <Panel className="border border-slate-800/90 bg-slate-950/60 p-6 text-center text-sm text-slate-500">{labels.skillsEmpty}</Panel>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {linkedSkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/${typedLocale}/skills/${skill.slug}`}
                  className={cn(
                    "focus-ring group relative block overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-950/50 via-slate-950/90 to-slate-950 p-5 transition",
                    "hover:-translate-y-0.5 hover:border-cyan-300/55 hover:shadow-[0_12px_40px_-8px_rgba(34,211,238,0.22)]"
                  )}
                >
                  <span className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/70 opacity-80 group-hover:opacity-100">
                    →
                  </span>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">{labLevelLabels[skill.level]}</p>
                  <p className="mt-2 text-lg font-semibold leading-snug text-slate-50 group-hover:text-cyan-50">{skill.content.name}</p>
                  <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-cyan-400/80 to-cyan-500/20" aria-hidden />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Certificaciones — bloque destacado */}
      <section
        className={cn(
          "relative overflow-hidden rounded-[2rem] border border-emerald-500/35 bg-slate-950/80 p-6 shadow-[0_0_60px_-12px_rgba(52,211,153,0.16)] sm:p-8 md:p-10"
        )}
        aria-labelledby="milestone-certs-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_80%_-10%,rgba(52,211,153,0.14),transparent)]"
          aria-hidden
        />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/90">{labels.certsEyebrow}</p>
              <h2 id="milestone-certs-heading" className="text-2xl font-semibold text-slate-50 md:text-3xl">
                {labels.certsTitle}
              </h2>
              <p className="max-w-2xl text-sm text-slate-400 md:text-base">{labels.certsDescription}</p>
            </div>
            <Link
              href={`/${typedLocale}/certifications`}
              className="focus-ring shrink-0 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-400/15"
            >
              {labels.certsViewAll}
            </Link>
          </div>
          {linkedCerts.length === 0 ? (
            <Panel className="border border-slate-800/90 bg-slate-950/60 p-6 text-center text-sm text-slate-500">{labels.certsEmpty}</Panel>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {linkedCerts.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  locale={typedLocale}
                  title={cert.content.name}
                  provider={resolveProviderLabel(catalogs, cert.providerId, typedLocale)}
                  state={cert.state}
                  date={cert.relevantDate}
                  note={cert.content.note}
                  cardLabels={certCardLabels}
                  variant="browse"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Section title={labels.outcomesTitle} description={labels.outcomesDescription}>
        <Panel className="space-y-4 p-6 md:p-8">
          <ul className="space-y-3 text-sm leading-relaxed text-slate-300 md:text-base">
            {milestone.content.outcomes.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-cyan-400/90" aria-hidden>
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </Section>

      {relatedMilestones.length > 0 ? (
        <Section title={labels.otherMilestonesTitle} description={labels.otherMilestonesDescription}>
          <HorizontalCarousel
            ariaLabel={labels.otherMilestonesCarouselRegion}
            prevLabel={labels.otherMilestonesCarouselPrev}
            nextLabel={labels.otherMilestonesCarouselNext}
          >
            {relatedMilestones.map((item) => (
              <CarouselSlide key={item.id}>
                <Panel className="h-full space-y-3 p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-50">{item.content.title}</h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{item.content.summary}</p>
                  <Link href={`/${typedLocale}/roadmap/${item.slug}`} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
                    {roadmapCopy.openMilestoneCta}
                  </Link>
                </Panel>
              </CarouselSlide>
            ))}
          </HorizontalCarousel>
        </Section>
      ) : null}
    </div>
  );
}
