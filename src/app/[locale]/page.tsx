import { CarouselSlide, HorizontalCarousel } from "@/components/horizontal-carousel";
import { CTAButton, EmptyState, Section } from "@/components/ui";
import { LabCard, MilestoneCard, SkillCard } from "@/components/public-cards";
import { availabilityLabels } from "@/lib/constants";
import {
  formatHomeAvailabilityLine,
  getCatalogs,
  getCertifications,
  getContactContent,
  getHomeContent,
  getLabs,
  getRoadmap,
  getRoadmapFocusForHome,
  getSkills,
  resolveCategoryLabel
} from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Vista previa en home: skills con mayor progreso (señal más fuerte). */
const HOME_SKILLS_PREVIEW = 4;

const roadmapPhaseFocusAccent = [
  {
    border: "border-cyan-400/35",
    label: "text-cyan-300/80",
    glow: "from-cyan-400/14 via-cyan-400/5 to-transparent"
  },
  {
    border: "border-fuchsia-400/35",
    label: "text-fuchsia-300/85",
    glow: "from-fuchsia-400/14 via-fuchsia-400/5 to-transparent"
  },
  {
    border: "border-emerald-400/35",
    label: "text-emerald-300/85",
    glow: "from-emerald-400/14 via-emerald-400/5 to-transparent"
  }
] as const;

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const [home, contact, labs, skills, roadmap, catalogs, certifications] = await Promise.all([
    getHomeContent(typedLocale),
    getContactContent(typedLocale),
    getLabs(typedLocale),
    getSkills(typedLocale),
    getRoadmap(typedLocale),
    getCatalogs(),
    getCertifications(typedLocale)
  ]);

  const featuredLabs = labs.filter((lab) => lab.isTopCaseStudy);
  const roadmapFocus = getRoadmapFocusForHome(roadmap.phases, roadmap.milestones);

  const skillsPreview =
    skills.length === 0 ? [] : [...skills].sort((a, b) => b.progress - a.progress).slice(0, HOME_SKILLS_PREVIEW);
  const showSkillsViewAll = skills.length > skillsPreview.length;

  const phaseFocusIndex = roadmapFocus
    ? Math.max(0, roadmap.phases.findIndex((p) => p.id === roadmapFocus.phase.id))
    : 0;
  const phaseAccent = roadmapPhaseFocusAccent[phaseFocusIndex % roadmapPhaseFocusAccent.length];

  return (
    <div className="space-y-14">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/80 shadow-2xl shadow-slate-950/40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_20%_-10%,rgba(34,211,238,0.12),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-cyan-950/20"
          aria-hidden
        />
        <div className="relative space-y-8 p-6 sm:p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <div className="reveal-up delay-1 flex flex-wrap gap-2">
                <span className="ambient-float rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                  {home.roleChip}
                </span>
                <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">{home.locationChip}</span>
                <span className="ambient-float rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                  {home.availabilityChip}
                </span>
              </div>
              <div className="reveal-up delay-2 space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight leading-tight text-slate-50 md:text-6xl">
                  {home.heroTitle}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-200/95">{home.heroSubtitle}</p>
              </div>
              <div className="reveal-up delay-3 flex flex-wrap gap-3">
                <CTAButton href={`/${typedLocale}/labs`}>{home.primaryCtaLabel}</CTAButton>
                <CTAButton href={`/${typedLocale}/contact`} secondary>
                  {home.secondaryCtaLabel}
                </CTAButton>
              </div>
            </div>

            <div className="reveal-up delay-4 flex flex-col justify-center space-y-4 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-5 shadow-inner shadow-slate-950/30 md:p-6">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{home.statsHeading}</p>
                <h2 className="text-lg font-semibold leading-snug text-slate-50 md:text-xl">{home.statsSubtitle}</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: home.kpiLabsLabel, value: labs.length, accent: "from-cyan-400/18 to-transparent" },
                  { label: home.kpiCertificationsLabel, value: certifications.length, accent: "from-emerald-400/16 to-transparent" },
                  { label: home.kpiSkillsLabel, value: skills.length, accent: "from-fuchsia-400/16 to-transparent" }
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className={cn(
                      "rounded-2xl border border-slate-800/90 bg-slate-950/50 p-4 shadow-inner shadow-slate-950/25",
                      "bg-gradient-to-br to-slate-950/30",
                      kpi.accent
                    )}
                  >
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
                    <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-50 md:text-3xl">{kpi.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                {formatHomeAvailabilityLine(
                  home.availabilityLineTemplate,
                  availabilityLabels[contact.channels.availability],
                  contact.content.preferredChannel
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Section
        className="space-y-5"
        title={home.featuredLabsHeading}
        description={home.featuredLabsDescription}
      >
        {featuredLabs.length === 0 ? (
          <EmptyState
            title={home.featuredLabsEmptyTitle}
            description={home.featuredLabsEmptyDescription}
            action={<CTAButton href={`/${typedLocale}/labs`}>{home.featuredLabsEmptyCta}</CTAButton>}
          />
        ) : (
          <HorizontalCarousel
            ariaLabel={home.carouselLabsRegion}
            prevLabel={home.carouselLabsPrev}
            nextLabel={home.carouselLabsNext}
          >
            {featuredLabs.map((lab) => (
              <CarouselSlide key={lab.id}>
                <LabCard
                  locale={typedLocale}
                  title={lab.content.title}
                  summary={lab.content.summary}
                  category={resolveCategoryLabel(catalogs, lab.categoryId, typedLocale)}
                  level={lab.level}
                  state={lab.state}
                  stack={lab.stack}
                  href={`/labs/${lab.slug}`}
                  featured
                />
              </CarouselSlide>
            ))}
          </HorizontalCarousel>
        )}
      </Section>

      <div className="flex justify-center py-2" aria-hidden>
        <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/80 shadow-2xl shadow-slate-950/40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_85%_0%,rgba(217,70,239,0.1),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-fuchsia-950/15 via-slate-950/90 to-cyan-950/15"
          aria-hidden
        />
        <div className="relative p-6 sm:p-8 md:p-10">
          <Section className="space-y-5" title={home.skillsHeading} description={home.skillsDescription}>
            {skills.length === 0 ? (
              <EmptyState
                title={home.skillsEmptyTitle}
                description={home.skillsEmptyDescription}
                action={<CTAButton href={`/${typedLocale}/skills`}>{home.skillsEmptyCta}</CTAButton>}
              />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {skillsPreview.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      locale={typedLocale}
                      title={skill.content.name}
                      summary={skill.content.summary}
                      progress={skill.progress}
                      href={`/skills/${skill.slug}`}
                      animateProgressInView
                    />
                  ))}
                </div>
                {showSkillsViewAll ? (
                  <div className="flex justify-center pt-4 sm:pt-6">
                    <CTAButton href={`/${typedLocale}/skills`} secondary>
                      {home.skillsViewAll}
                    </CTAButton>
                  </div>
                ) : null}
              </>
            )}
          </Section>
        </div>
      </div>

      <Section
        className="space-y-5"
        title={home.roadmapHeading}
        description={home.roadmapDescription}
        action={
          <CTAButton href={`/${typedLocale}/roadmap`} secondary>
            {home.roadmapViewFull}
          </CTAButton>
        }
      >
        {roadmapFocus ? (
          <div className="space-y-6">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border bg-slate-950/50 p-6 md:p-8",
                phaseAccent.border
              )}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent",
                  phaseAccent.glow
                )}
                aria-hidden
              />
              <div className="relative">
                <p className={cn("text-sm uppercase tracking-[0.24em]", phaseAccent.label)}>
                  {home.roadmapCurrentFocusLabel}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-50 md:text-2xl">{roadmapFocus.phase.content.title}</h3>
                <p className="mt-2 max-w-3xl text-sm text-slate-400 md:text-base">{roadmapFocus.phase.content.summary}</p>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {roadmapFocus.milestones.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  locale={typedLocale}
                  title={milestone.content.title}
                  summary={milestone.content.summary}
                  state={milestone.state}
                  href={`/roadmap/${milestone.slug}`}
                  stepOrder={milestone.order}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title={home.roadmapEmptyTitle} description={home.roadmapEmptyDescription} />
        )}
      </Section>

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/90 bg-slate-950/85 shadow-2xl shadow-slate-950/35">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cyan-950/25 via-transparent to-fuchsia-950/20"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:gap-10 md:p-10">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">{home.closingHeading}</h2>
            <p className="text-base leading-8 text-slate-300">{home.closingText}</p>
          </div>
          <div className="shrink-0">
            <CTAButton href={`/${typedLocale}/contact`}>{home.secondaryCtaLabel}</CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
}
