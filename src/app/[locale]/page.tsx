import { CarouselSlide, HorizontalCarousel } from "@/components/horizontal-carousel";
import { CTAButton, EmptyState, Panel, Section, StatCard } from "@/components/ui";
import { LabCard, MilestoneCard, SkillCard } from "@/components/public-cards";
import {
  availabilityLabels,
  homeCarouselAria,
  homeRoadmapCurrentFocusLabels,
  homeRoadmapEmptyTitleLabels,
  homeRoadmapNoActiveFocusLabels
} from "@/lib/constants";
import {
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
import type { Locale } from "@/lib/types";

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
  const carousel = homeCarouselAria[typedLocale];
  const roadmapFocus = getRoadmapFocusForHome(roadmap.phases, roadmap.milestones);

  return (
    <div className="space-y-16">
      <Panel className="reveal-up space-y-8 overflow-hidden p-8 md:p-12">
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
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-50 md:text-6xl">{home.heroTitle}</h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">{home.heroSubtitle}</p>
            </div>
            <div className="reveal-up delay-3 flex flex-wrap gap-3">
              <CTAButton href={`/${typedLocale}/labs`}>{home.primaryCtaLabel}</CTAButton>
              <CTAButton href={`/${typedLocale}/contact`} secondary>
                {home.secondaryCtaLabel}
              </CTAButton>
            </div>
          </div>
          <Panel className="interactive-lift reveal-up delay-4 grid gap-4 bg-slate-950/70">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{home.statsHeading}</p>
              <h2 className="text-2xl font-semibold text-slate-50">Professional signal, structured proof</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              <StatCard label="Labs" value={labs.length} />
              <StatCard label="Certifications" value={certifications.length} />
              <StatCard label="Skills" value={skills.length} />
            </div>
            <p className="text-sm text-slate-400">
              Availability: {availabilityLabels[contact.channels.availability]}. Preferred contact: {contact.content.preferredChannel}.
            </p>
          </Panel>
        </div>
      </Panel>

      <Section title={home.featuredLabsHeading} description="Evidence-led work that shows execution, context and what was learned.">
        {featuredLabs.length === 0 ? (
          <EmptyState
            title={typedLocale === "de" ? "Keine hervorgehobenen Case Studies" : "No featured case studies yet"}
            description={
              typedLocale === "de"
                ? "Markiere Labs als Top Case Study im Admin oder besuche die vollständige Labs-Übersicht."
                : "Mark labs as top case studies in the admin, or browse the full labs list."
            }
            action={<CTAButton href={`/${typedLocale}/labs`}>{typedLocale === "de" ? "Alle Labs" : "View all labs"}</CTAButton>}
          />
        ) : (
          <HorizontalCarousel
            ariaLabel={carousel.labsRegion}
            prevLabel={carousel.labsPrev}
            nextLabel={carousel.labsNext}
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

      <Section title={home.skillsHeading} description="Skills are connected to proof, not presented as unsupported claims.">
        {skills.length === 0 ? (
          <EmptyState
            title={typedLocale === "de" ? "Noch keine Skills" : "No skills yet"}
            description={typedLocale === "de" ? "Skills im Admin anlegen." : "Add skills in the admin panel."}
            action={<CTAButton href={`/${typedLocale}/skills`}>{typedLocale === "de" ? "Zu Skills" : "View skills"}</CTAButton>}
          />
        ) : (
          <HorizontalCarousel
            ariaLabel={carousel.skillsRegion}
            prevLabel={carousel.skillsPrev}
            nextLabel={carousel.skillsNext}
          >
            {skills.map((skill) => (
              <CarouselSlide key={skill.id}>
                <SkillCard
                  locale={typedLocale}
                  title={skill.content.name}
                  summary={skill.content.summary}
                  progress={skill.progress}
                  href={`/skills/${skill.slug}`}
                  animateProgressInView
                />
              </CarouselSlide>
            ))}
          </HorizontalCarousel>
        )}
      </Section>

      <Section title={home.roadmapHeading} description="A visible trajectory that connects learning, delivery and formal validation.">
        {roadmapFocus ? (
          <div className="space-y-6">
            <div className="rounded-3xl border border-cyan-400/20 bg-slate-950/50 p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{homeRoadmapCurrentFocusLabels[typedLocale]}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-50 md:text-2xl">{roadmapFocus.phase.content.title}</h3>
              <p className="mt-2 max-w-3xl text-sm text-slate-400 md:text-base">{roadmapFocus.phase.content.summary}</p>
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
          <EmptyState
            title={homeRoadmapEmptyTitleLabels[typedLocale]}
            description={homeRoadmapNoActiveFocusLabels[typedLocale]}
            action={
              <CTAButton href={`/${typedLocale}/roadmap`} secondary>
                {typedLocale === "de" ? "Zur Roadmap" : "View roadmap"}
              </CTAButton>
            }
          />
        )}
      </Section>

      <Panel className="interactive-lift reveal-up space-y-4 p-8">
        <h2 className="max-w-3xl text-3xl font-semibold text-slate-50">{home.closingHeading}</h2>
        <p className="max-w-3xl text-base leading-8 text-slate-300">{home.closingText}</p>
        <CTAButton href={`/${typedLocale}/contact`}>{home.secondaryCtaLabel}</CTAButton>
      </Panel>
    </div>
  );
}
