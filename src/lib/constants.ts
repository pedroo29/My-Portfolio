import type { AvailabilityStatus, CertificationState, LabLevel, LabState, Locale, MilestoneState, PhaseState, Priority } from "@/lib/types";

export const defaultLocale: Locale = "en";

/** Detalle público de un milestone (habilidades y certificaciones en destaque). */
export const milestoneDetailLabels: Record<
  Locale,
  {
    backToRoadmap: string;
    heroEyebrow: string;
    outcomesTitle: string;
    outcomesDescription: string;
    metaStart: string;
    metaEnd: string;
    metaEffort: string;
    notSet: string;
    skillsEyebrow: string;
    skillsTitle: string;
    skillsDescription: string;
    skillsEmpty: string;
    certsEyebrow: string;
    certsTitle: string;
    certsDescription: string;
    certsEmpty: string;
    certsViewAll: string;
    otherMilestonesTitle: string;
    otherMilestonesDescription: string;
    otherMilestonesCarouselRegion: string;
    otherMilestonesCarouselPrev: string;
    otherMilestonesCarouselNext: string;
  }
> = {
  en: {
    backToRoadmap: "Back to roadmap",
    heroEyebrow: "Milestone overview",
    outcomesTitle: "Outcomes",
    outcomesDescription: "Expected deliverables and proof points for this milestone.",
    metaStart: "Start",
    metaEnd: "End",
    metaEffort: "Estimated effort",
    notSet: "Not set",
    skillsEyebrow: "Capability focus",
    skillsTitle: "Skills in this milestone",
    skillsDescription: "Competencies you are exercising or validating through this work — each links to the full skill profile.",
    skillsEmpty: "No skills linked yet. Add related skills in the admin to show them here.",
    certsEyebrow: "Formal validation",
    certsTitle: "Certifications in this milestone",
    certsDescription: "Credentials and exams tied to this milestone — progress toward industry-recognized validation.",
    certsEmpty: "No certifications linked yet. Connect certifications in the admin to highlight them here.",
    certsViewAll: "View all certifications",
    otherMilestonesTitle: "Other milestones in this phase",
    otherMilestonesDescription: "Additional work that sits in the same progression phase.",
    otherMilestonesCarouselRegion: "Other milestones in this phase",
    otherMilestonesCarouselPrev: "Previous milestones",
    otherMilestonesCarouselNext: "Next milestones"
  },
  de: {
    backToRoadmap: "Zurück zur Roadmap",
    heroEyebrow: "Meilenstein-Überblick",
    outcomesTitle: "Ergebnisse",
    outcomesDescription: "Erwartete Ergebnisse und Nachweise für diesen Meilenstein.",
    metaStart: "Start",
    metaEnd: "Ende",
    metaEffort: "Geschätzter Aufwand",
    notSet: "Nicht gesetzt",
    skillsEyebrow: "Kompetenzfokus",
    skillsTitle: "Skills in diesem Meilenstein",
    skillsDescription: "Kompetenzen, die du in dieser Arbeit nutzt oder nachweist — jeder Link führt zum vollständigen Skill-Profil.",
    skillsEmpty: "Noch keine Skills verknüpft. Verknüpfe Skills im Admin, um sie hier anzuzeigen.",
    certsEyebrow: "Formale Validierung",
    certsTitle: "Zertifizierungen in diesem Meilenstein",
    certsDescription: "Nachweise und Prüfungen, die zu diesem Meilenstein gehören — Fortschritt zu anerkannten Qualifikationen.",
    certsEmpty: "Noch keine Zertifizierungen verknüpft. Verknüpfe Zertifizierungen im Admin, um sie hier hervorzuheben.",
    certsViewAll: "Alle Zertifizierungen ansehen",
    otherMilestonesTitle: "Weitere Meilensteine in dieser Phase",
    otherMilestonesDescription: "Weitere Arbeiten in derselben Fortschrittsphase.",
    otherMilestonesCarouselRegion: "Weitere Meilensteine in dieser Phase",
    otherMilestonesCarouselPrev: "Vorherige Meilensteine",
    otherMilestonesCarouselNext: "Nächste Meilensteine"
  }
};

/** Detalle /skills/[slug] — rail de evidencias. */
export const skillDetailLabels: Record<
  Locale,
  {
    back: string;
    evidenceTitle: string;
    evidenceDescription: string;
    profileTitle: string;
    profileDescription: string;
  }
> = {
  en: {
    back: "Back to skills",
    evidenceTitle: "Evidence rail",
    evidenceDescription: "Labs connected to this skill — concrete work you can inspect.",
    profileTitle: "Skill profile",
    profileDescription: "Progress is a snapshot; evidence below shows where it comes from."
  },
  de: {
    back: "Zurück zu Skills",
    evidenceTitle: "Evidence-Rail",
    evidenceDescription: "Mit dieser Skill verknüpfte Labs — konkrete Arbeit zum Nachlesen.",
    profileTitle: "Skill-Profil",
    profileDescription: "Fortschritt ist eine Momentaufnahme; die Belege unten zeigen die Herkunft."
  }
};

/** Detalle público /labs/[slug] — documentación destacada y labs relacionados. */
export const labDetailPageLabels: Record<
  Locale,
  {
    back: string;
    docEyebrow: string;
    docTitle: string;
    docDescription: string;
    docBadgeMain: string;
    docBadgeEmpty: string;
    docBadgeChars: (n: number) => string;
    docBadgeMediaNone: string;
    docBadgeMediaCount: (n: number) => string;
    relatedTitle: string;
    relatedDescription: string;
    relatedCarouselRegion: string;
    relatedCarouselPrev: string;
    relatedCarouselNext: string;
    readCaseStudy: string;
    evidenceAndSkillsTitle: string;
    evidenceLinksHeading: string;
    connectedSkillsHeading: string;
    evidenceLinkInvalid: string;
  }
> = {
  en: {
    back: "Back to labs",
    docEyebrow: "Primary narrative",
    docTitle: "Documentation",
    docDescription:
      "The main layer of this lab: context, implementation detail, evidence and technical reasoning in long-form markdown.",
    docBadgeMain: "Main documentation",
    docBadgeEmpty: "Empty",
    docBadgeChars: (n) => `${n} chars`,
    docBadgeMediaNone: "No linked media yet",
    docBadgeMediaCount: (n) => `${n} media assets linked`,
    relatedTitle: "Related labs",
    relatedDescription: "Other published labs that share at least one tag with this case study.",
    relatedCarouselRegion: "Related labs carousel",
    relatedCarouselPrev: "Previous related labs",
    relatedCarouselNext: "Next related labs",
    readCaseStudy: "Read case study",
    evidenceAndSkillsTitle: "Evidence and connected skills",
    evidenceLinksHeading: "Evidence links",
    connectedSkillsHeading: "Connected skills",
    evidenceLinkInvalid: "Invalid or empty URL"
  },
  de: {
    back: "Zurück zu Labs",
    docEyebrow: "Primäre Erzählung",
    docTitle: "Dokumentation",
    docDescription:
      "Die Haupthistorie dieses Labs: Kontext, Umsetzung, Belege und technische Argumentation als ausführliches Markdown.",
    docBadgeMain: "Hauptdokumentation",
    docBadgeEmpty: "Leer",
    docBadgeChars: (n) => `${n} Zeichen`,
    docBadgeMediaNone: "Noch keine Medien verknüpft",
    docBadgeMediaCount: (n) => `${n} Medien verknüpft`,
    relatedTitle: "Verwandte Labs",
    relatedDescription: "Weitere veröffentlichte Labs mit mindestens einem gemeinsamen Tag.",
    relatedCarouselRegion: "Karussell verwandter Labs",
    relatedCarouselPrev: "Vorherige verwandte Labs",
    relatedCarouselNext: "Nächste verwandte Labs",
    readCaseStudy: "Case Study lesen",
    evidenceAndSkillsTitle: "Belege und verknüpfte Skills",
    evidenceLinksHeading: "Evidence-Links",
    connectedSkillsHeading: "Verknüpfte Skills",
    evidenceLinkInvalid: "Ungültige oder leere URL"
  }
};

export const localeLabels: Record<Locale, string> = {
  en: "English",
  de: "Deutsch"
};

export const publicationStatusLabels = {
  draft: "Draft",
  published: "Published",
  archived: "Archived"
} as const;

export const availabilityLabels: Record<AvailabilityStatus, string> = {
  open: "Open to opportunities",
  selective: "Selective opportunities",
  unavailable: "Unavailable"
};

export const labLevelLabels: Record<LabLevel, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

export const labStateLabels: Record<LabState, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned"
};

export const certificationStateLabels: Record<CertificationState, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned"
};

/** Prefijo para el paso dentro de la fase (roadmap). */
export const milestoneStepPrefix: Record<Locale, string> = {
  en: "Step",
  de: "Schritt"
};

export const milestoneStateLabels: Record<MilestoneState, string> = {
  completed: "Completed",
  active: "Active",
  planned: "Planned"
};

export const phaseStateLabels: Record<PhaseState, string> = {
  completed: "Completed",
  active: "Active",
  planned: "Planned"
};

export const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High"
};

export const adminShortcutHints = [
  "Ctrl/Cmd + S to save",
  "Ctrl/Cmd + Enter to create",
  "Esc to discard draft changes"
];
