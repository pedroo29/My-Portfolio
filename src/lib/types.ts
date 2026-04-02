export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export type PublicationStatus = "draft" | "published" | "archived";
export type AvailabilityStatus = "open" | "selective" | "unavailable";
export type LabLevel = "foundational" | "intermediate" | "advanced";
export type LabState = "completed" | "in-progress" | "planned";
export type CertificationState = "completed" | "in-progress" | "planned";
export type MilestoneState = "completed" | "active" | "planned";
export type PhaseState = "completed" | "active" | "planned";
export type Priority = "low" | "medium" | "high";
export type RoleFocus = "security" | "backend" | "fullstack" | "automation";

export type Localized<T> = Record<Locale, T>;

export interface SeoFields {
  title: string;
  description: string;
}

export interface LocalizedSeoFields {
  en: SeoFields;
  de: SeoFields;
}

export interface BaseEntity {
  id: string;
  slug: string;
  status: PublicationStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
  seo: LocalizedSeoFields;
}

export interface LocalizedLabContent {
  title: string;
  summary: string;
  documentation: string;
  objectives: string[];
  results: string[];
  lessonsLearned: string[];
}

export interface LabMetric {
  label: string;
  value: string;
}

export interface EvidenceLink {
  label: string;
  url: string;
}

export interface Lab extends BaseEntity {
  categoryId: string;
  level: LabLevel;
  state: LabState;
  stack: string[];
  tags: string[];
  date: string;
  isTopCaseStudy: boolean;
  skillIds: string[];
  mediaIds: string[];
  evidenceLinks: EvidenceLink[];
  metrics: LabMetric[];
  locales: Localized<LocalizedLabContent>;
}

export interface LocalizedSkillContent {
  name: string;
  summary: string;
}

export interface Skill extends BaseEntity {
  level: LabLevel;
  progress: number;
  tags: string[];
  labIds: string[];
  locales: Localized<LocalizedSkillContent>;
}

export interface LocalizedCertificationContent {
  name: string;
  note: string;
}

export interface Certification extends BaseEntity {
  providerId: string;
  state: CertificationState;
  relevantDate: string;
  tags: string[];
  evidenceLink?: string;
  locales: Localized<LocalizedCertificationContent>;
}

export interface LocalizedPhaseContent {
  title: string;
  summary: string;
}

export interface RoadmapPhase extends BaseEntity {
  order: number;
  state: PhaseState;
  locales: Localized<LocalizedPhaseContent>;
}

export interface LocalizedMilestoneContent {
  title: string;
  summary: string;
  outcomes: string[];
}

export interface RoadmapMilestone extends BaseEntity {
  /**
   * Orden dentro de la fase (1 = primer paso). Obligatorio en contenido nuevo;
   * datos antiguos sin campo se tratan como 0 al ordenar.
   */
  order?: number;
  phaseId: string;
  state: MilestoneState;
  startDate: string;
  endDate?: string;
  estimatedEffort?: string;
  priority?: Priority;
  tags: string[];
  evidenceLinks: EvidenceLink[];
  labIds: string[];
  skillIds: string[];
  certificationIds: string[];
  locales: Localized<LocalizedMilestoneContent>;
}

export interface LocalizedHomeContent {
  heroTitle: string;
  heroSubtitle: string;
  roleChip: string;
  locationChip: string;
  availabilityChip: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  statsHeading: string;
  /** Subtítulo bajo el bloque de estadísticas del hero. */
  statsSubtitle: string;
  /** Etiquetas KPI (hero): Labs, Certifications, Skills. */
  kpiLabsLabel: string;
  kpiCertificationsLabel: string;
  kpiSkillsLabel: string;
  /**
   * Texto con marcadores `{{availability}}` y `{{channel}}` (sustituidos con datos de contacto).
   */
  availabilityLineTemplate: string;
  featuredLabsHeading: string;
  featuredLabsDescription: string;
  featuredLabsEmptyTitle: string;
  featuredLabsEmptyDescription: string;
  featuredLabsEmptyCta: string;
  skillsHeading: string;
  skillsDescription: string;
  skillsEmptyTitle: string;
  skillsEmptyDescription: string;
  skillsEmptyCta: string;
  skillsViewAll: string;
  roadmapHeading: string;
  roadmapDescription: string;
  roadmapViewFull: string;
  roadmapCurrentFocusLabel: string;
  roadmapEmptyTitle: string;
  roadmapEmptyDescription: string;
  closingHeading: string;
  closingText: string;
  carouselLabsRegion: string;
  carouselLabsPrev: string;
  carouselLabsNext: string;
}

/** Textos de la página pública `/[locale]/skills`. */
export interface LocalizedSkillsPageContent {
  eyebrow: string;
  title: string;
  description: string;
  matrixTitle: string;
  matrixSubtitle: string;
  filterAll: string;
  filterByTag: string;
  viewMatrix: string;
  viewList: string;
  /** Cuando hay exactamente 1 lab vinculado (sin `{{n}}`). */
  labsLinkedOne: string;
  /** Para más de un lab; usar marcador `{{n}}`. */
  labsLinkedMany: string;
  openSkill: string;
  bentoTitle: string;
  bentoSubtitle: string;
  featured: string;
  emptyFiltered: string;
  emptyPublished: string;
}

/** Textos de la página pública `/[locale]/roadmap` (incl. minimapa). */
export interface LocalizedRoadmapPageContent {
  eyebrow: string;
  title: string;
  description: string;
  phaseLabel: string;
  featuredBadge: string;
  openMilestoneCta: string;
  itemCountLabel: string;
  emptyRoadmap: string;
  emptyPhase: string;
  minimapButton: string;
  minimapTitle: string;
  minimapClose: string;
  minimapAriaNav: string;
}

/** Textos de la página pública `/[locale]/certifications`. */
export interface LocalizedCertificationsPageContent {
  eyebrow: string;
  title: string;
  description: string;
  kpiCompleted: string;
  kpiInProgress: string;
  kpiPlanned: string;
  filterByProvider: string;
  filterByState: string;
  filterAll: string;
  viewLabel: string;
  viewTimeline: string;
  viewBrowse: string;
  viewToggleAria: string;
  timelineTitle: string;
  browseTitle: string;
  browseDescription: string;
  resultCountOne: string;
  /** Plural con marcador `{{n}}`. */
  resultCountMany: string;
  dateLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  stateChipCompleted: string;
  stateChipInProgress: string;
  stateChipPlanned: string;
}

export interface LocalizedAboutContent {
  headline: string;
  intro: string;
  summary: string;
  location: string;
  roleFocus: string;
  yearsExperience: string;
  coreCompetencies: string[];
  strengths: string[];
  workingStyle: string[];
  goals: string[];
}

export interface LocalizedContactContent {
  headline: string;
  intro: string;
  location: string;
  responseTime: string;
  preferredChannel: string;
  primaryCtaLabel: string;
}

export interface LocalizedPrivacyContent {
  headline: string;
  body: string[];
}

export interface GlobalContent<T> {
  id: string;
  version: number;
  updatedAt: string;
  locales: Localized<T>;
}

export interface ContactChannels {
  email: string;
  linkedin: string;
  github: string;
  availability: AvailabilityStatus;
}

export interface HomeContent extends GlobalContent<LocalizedHomeContent> {}
export interface SkillsPageContent extends GlobalContent<LocalizedSkillsPageContent> {}
export interface RoadmapPageContent extends GlobalContent<LocalizedRoadmapPageContent> {}
export interface CertificationsPageContent extends GlobalContent<LocalizedCertificationsPageContent> {}
export interface AboutContent extends GlobalContent<LocalizedAboutContent> {}
export interface ContactContent extends GlobalContent<LocalizedContactContent>, ContactChannels {}
export interface PrivacyContent extends GlobalContent<LocalizedPrivacyContent> {}

export interface LocalizedLabel {
  en: string;
  de: string;
}

export interface Category {
  id: string;
  slug: string;
  label: LocalizedLabel;
}

export interface Provider {
  id: string;
  slug: string;
  label: LocalizedLabel;
}

export interface Tag {
  id: string;
  slug: string;
  label: LocalizedLabel;
}

export interface Catalogs {
  categories: Category[];
  providers: Provider[];
  tags: Tag[];
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: LocalizedLabel;
  caption: LocalizedLabel;
  labIds: string[];
  createdAt: string;
}

export interface ActivityEvent {
  id: string;
  type: "create" | "update" | "delete" | "upload";
  collection: string;
  targetId: string;
  message: string;
  createdAt: string;
}

export interface ContentStore {
  labs: Lab[];
  skills: Skill[];
  certifications: Certification[];
  roadmapPhases: RoadmapPhase[];
  roadmapMilestones: RoadmapMilestone[];
  home: HomeContent;
  skillsPage: SkillsPageContent;
  roadmapPage: RoadmapPageContent;
  certificationsPage: CertificationsPageContent;
  about: AboutContent;
  contact: ContactContent;
  privacy: PrivacyContent;
  catalogs: Catalogs;
  media: MediaAsset[];
  activity: ActivityEvent[];
}

export type CollectionKey =
  | "labs"
  | "skills"
  | "certifications"
  | "roadmapPhases"
  | "roadmapMilestones";

export interface CollectionOption {
  value: string;
  label: string;
  secondary?: string;
}

export interface HealthStatus {
  storage: "healthy" | "warning";
  contentFiles: number;
  mediaFiles: number;
  runtimePath: string;
  lastUpdated: string;
}
