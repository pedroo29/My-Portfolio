import { defaultLocale } from "@/lib/constants";
import { readStore } from "@/lib/server/content-store";
import type {
  Catalogs,
  Certification,
  CollectionOption,
  Lab,
  Locale,
  MediaAsset,
  RoadmapMilestone,
  RoadmapPhase,
  Skill
} from "@/lib/types";
import { makeOption, pickLocalized } from "@/lib/utils";

export async function getPublicStore() {
  return readStore();
}

export async function getHomeContent(locale: Locale) {
  const store = await readStore();
  return pickLocalized(store.home.locales, locale);
}

export async function getAboutContent(locale: Locale) {
  const store = await readStore();
  return pickLocalized(store.about.locales, locale);
}

export async function getContactContent(locale: Locale) {
  const store = await readStore();
  return {
    channels: {
      email: store.contact.email,
      linkedin: store.contact.linkedin,
      github: store.contact.github,
      availability: store.contact.availability
    },
    content: pickLocalized(store.contact.locales, locale)
  };
}

export async function getPrivacyContent(locale: Locale) {
  const store = await readStore();
  return pickLocalized(store.privacy.locales, locale);
}

export async function getLabs(locale: Locale) {
  const store = await readStore();
  return store.labs
    .filter((lab) => lab.status === "published")
    .map((lab) => ({
      ...lab,
      content: pickLocalized(lab.locales, locale),
      fallbackContent: pickLocalized(lab.locales, defaultLocale)
    }));
}

export async function getLabBySlug(locale: Locale, slug: string) {
  const store = await readStore();
  const lab = store.labs.find((item) => item.slug === slug && item.status !== "archived");
  if (!lab) return undefined;

  return {
    ...lab,
    content: pickLocalized(lab.locales, locale)
  };
}

export async function getSkills(locale: Locale) {
  const store = await readStore();
  return store.skills
    .filter((skill) => skill.status === "published")
    .map((skill) => ({
      ...skill,
      content: pickLocalized(skill.locales, locale)
    }));
}

export async function getSkillBySlug(locale: Locale, slug: string) {
  const store = await readStore();
  const skill = store.skills.find((item) => item.slug === slug && item.status !== "archived");
  if (!skill) return undefined;

  return {
    ...skill,
    content: pickLocalized(skill.locales, locale)
  };
}

export async function getCertifications(locale: Locale) {
  const store = await readStore();
  return store.certifications
    .filter((certification) => certification.status === "published")
    .map((certification) => ({
      ...certification,
      content: pickLocalized(certification.locales, locale)
    }));
}

function milestoneOrderValue(m: Pick<RoadmapMilestone, "order" | "id">) {
  return typeof m.order === "number" && !Number.isNaN(m.order) ? m.order : 0;
}

export function compareMilestoneOrder(a: Pick<RoadmapMilestone, "order" | "id">, b: Pick<RoadmapMilestone, "order" | "id">) {
  const diff = milestoneOrderValue(a) - milestoneOrderValue(b);
  return diff !== 0 ? diff : a.id.localeCompare(b.id);
}

export async function getRoadmap(locale: Locale) {
  const store = await readStore();
  const phases = store.roadmapPhases
    .filter((phase) => phase.status === "published")
    .sort((left, right) => left.order - right.order)
    .map((phase) => ({
      ...phase,
      content: pickLocalized(phase.locales, locale)
    }));

  const milestones = store.roadmapMilestones
    .filter((milestone) => milestone.status === "published")
    .map((milestone) => ({
      ...milestone,
      content: pickLocalized(milestone.locales, locale)
    }))
    .sort((a, b) => compareMilestoneOrder(a, b));

  return { phases, milestones };
}

/**
 * Primera fase (por orden) que tenga al menos un hito publicado con estado `active`,
 * y solo esos hitos activos de esa fase — para el bloque de roadmap en la home.
 */
export function getRoadmapFocusForHome<
  P extends { id: string; order: number },
  M extends { phaseId: string; state: string; id: string; order?: number }
>(phases: P[], milestones: M[]): { phase: P; milestones: M[] } | null {
  const active = milestones.filter((m) => m.state === "active");
  if (active.length === 0) return null;

  for (const phase of phases) {
    const inPhase = active
      .filter((m) => m.phaseId === phase.id)
      .sort((a, b) => compareMilestoneOrder(a, b));
    if (inPhase.length > 0) {
      return { phase, milestones: inPhase };
    }
  }

  return null;
}

export async function getMilestoneBySlug(locale: Locale, slug: string) {
  const store = await readStore();
  const milestone = store.roadmapMilestones.find((item) => item.slug === slug && item.status !== "archived");
  if (!milestone) return undefined;

  return {
    ...milestone,
    content: pickLocalized(milestone.locales, locale)
  };
}

export async function getCatalogs(): Promise<Catalogs> {
  const store = await readStore();
  return store.catalogs;
}

export async function getRelationOptions(locale: Locale): Promise<Record<string, CollectionOption[]>> {
  const store = await readStore();
  return {
    labs: store.labs.map((item) => makeOption(item.id, pickLocalized(item.locales, locale).title, item.slug)),
    skills: store.skills.map((item) => makeOption(item.id, pickLocalized(item.locales, locale).name, item.slug)),
    certifications: store.certifications.map((item) =>
      makeOption(item.id, pickLocalized(item.locales, locale).name, item.slug)
    ),
    roadmapPhases: store.roadmapPhases.map((item) => makeOption(item.id, pickLocalized(item.locales, locale).title, item.slug)),
    media: store.media.map((item) => makeOption(item.id, item.fileName, item.mimeType))
  };
}

export async function getDashboardData() {
  const store = await readStore();
  return {
    counts: {
      labs: store.labs.length,
      skills: store.skills.length,
      certifications: store.certifications.length,
      roadmapMilestones: store.roadmapMilestones.length,
      roadmapPhases: store.roadmapPhases.length,
      media: store.media.length
    },
    activity: store.activity.slice(0, 8),
    recentLabs: store.labs.slice(0, 3),
    store
  };
}

export function resolveCategoryLabel(catalogs: Catalogs, categoryId: string, locale: Locale) {
  return catalogs.categories.find((item) => item.id === categoryId)?.label[locale] ?? categoryId;
}

export function resolveProviderLabel(catalogs: Catalogs, providerId: string, locale: Locale) {
  return catalogs.providers.find((item) => item.id === providerId)?.label[locale] ?? providerId;
}

export function resolveTagLabels(catalogs: Catalogs, tags: string[], locale: Locale) {
  return tags.map((tagId) => catalogs.tags.find((item) => item.id === tagId)?.label[locale] ?? tagId);
}

export function indexLabsBySkill<T extends Pick<Lab, "skillIds">>(labs: T[], skillId: string) {
  return labs.filter((lab) => lab.skillIds.includes(skillId));
}

export function indexMilestonesByPhase<T extends Pick<RoadmapMilestone, "phaseId" | "order" | "id">>(milestones: T[], phaseId: string) {
  return milestones.filter((milestone) => milestone.phaseId === phaseId).sort(compareMilestoneOrder);
}

export function indexSkillOptions(skills: Skill[], locale: Locale) {
  return skills.map((skill) => makeOption(skill.id, pickLocalized(skill.locales, locale).name));
}

export function indexCertificationOptions(certifications: Certification[], locale: Locale) {
  return certifications.map((certification) => makeOption(certification.id, pickLocalized(certification.locales, locale).name));
}

export function indexPhaseOptions(phases: RoadmapPhase[], locale: Locale) {
  return phases.map((phase) => makeOption(phase.id, pickLocalized(phase.locales, locale).title));
}

export function indexMediaOptions(media: MediaAsset[]) {
  return media.map((asset) => makeOption(asset.id, asset.fileName, asset.mimeType));
}
