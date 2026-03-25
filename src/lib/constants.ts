import type { AvailabilityStatus, CertificationState, LabLevel, LabState, Locale, MilestoneState, PhaseState, Priority } from "@/lib/types";

export const defaultLocale: Locale = "en";

/** Etiqueta del bloque “fase con foco activo” en la home (roadmap). */
export const homeRoadmapCurrentFocusLabels: Record<Locale, string> = {
  en: "Current focus",
  de: "Aktueller Fokus"
};

/** Carruseles de la home (case studies y skills). */
export const homeCarouselAria: Record<
  Locale,
  { labsRegion: string; labsPrev: string; labsNext: string; skillsRegion: string; skillsPrev: string; skillsNext: string }
> = {
  en: {
    labsRegion: "Featured case studies carousel",
    labsPrev: "Previous case studies",
    labsNext: "Next case studies",
    skillsRegion: "Skills preview carousel",
    skillsPrev: "Previous skills",
    skillsNext: "Next skills"
  },
  de: {
    labsRegion: "Karussell mit ausgewählten Case Studies",
    labsPrev: "Vorherige Case Studies",
    labsNext: "Weitere Case Studies",
    skillsRegion: "Karussell mit Skills-Vorschau",
    skillsPrev: "Vorherige Skills",
    skillsNext: "Weitere Skills"
  }
};

export const homeRoadmapEmptyTitleLabels: Record<Locale, string> = {
  en: "No active milestone",
  de: "Kein aktiver Meilenstein"
};

export const homeRoadmapNoActiveFocusLabels: Record<Locale, string> = {
  en: "There is no active milestone in any phase right now. Open the roadmap for the full timeline.",
  de: "Aktuell gibt es keinen aktiven Meilenstein in einer Phase. Unter Roadmap siehst du die vollständige Übersicht."
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
