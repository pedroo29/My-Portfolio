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

/** Home: KPIs del hero, copy de stats y descripciones de secciones (EN/DE). */
export const homePageVisualLabels: Record<
  Locale,
  {
    statsSubtitle: string;
    kpiLabs: string;
    kpiCertifications: string;
    kpiSkills: string;
    availabilityLine: (availability: string, channel: string) => string;
    featuredLabsDescription: string;
    skillsDescription: string;
    skillsViewAll: string;
    roadmapDescription: string;
    roadmapViewFull: string;
  }
> = {
  en: {
    statsSubtitle: "Professional signal, structured proof",
    kpiLabs: "Labs",
    kpiCertifications: "Certifications",
    kpiSkills: "Skills",
    availabilityLine: (availability, channel) =>
      `Availability: ${availability}. Preferred contact: ${channel}.`,
    featuredLabsDescription: "Evidence-led work that shows execution, context and what was learned.",
    skillsDescription:
      "Preview of the strongest signals by progress — each skill links to labs as evidence. Open the full capability map for the complete matrix.",
    skillsViewAll: "View all skills",
    roadmapDescription: "A visible trajectory that connects learning, delivery and formal validation.",
    roadmapViewFull: "Full roadmap"
  },
  de: {
    statsSubtitle: "Profisignal, strukturierte Belege",
    kpiLabs: "Labs",
    kpiCertifications: "Zertifizierungen",
    kpiSkills: "Skills",
    availabilityLine: (availability, channel) =>
      `Verfügbarkeit: ${availability}. Bevorzugter Kontakt: ${channel}.`,
    featuredLabsDescription:
      "Evidenzbasierte Arbeit mit Kontext, Umsetzung und Learnings.",
    skillsDescription:
      "Vorschau der stärksten Signale nach Fortschritt — jede Skill verweist auf Labs als Beleg. Die vollständige Matrix findest du unter Skills.",
    skillsViewAll: "Alle Skills",
    roadmapDescription: "Ein sichtbarer Pfad aus Lernen, Delivery und formaler Validierung.",
    roadmapViewFull: "Vollständige Roadmap"
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

export const roadmapPageContent: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  en: {
    eyebrow: "Roadmap",
    title: "Professional progression by phases and milestones",
    description: "A visual journey of execution, learning, and validation across the next phases."
  },
  de: {
    eyebrow: "Roadmap",
    title: "Beruflicher Fortschritt in Phasen und Meilensteinen",
    description: "Eine visuelle Entwicklung über Ausführung, Lernen und Validierung entlang der nächsten Phasen."
  }
};

export const roadmapVisualLabels: Record<
  Locale,
  {
    phaseLabel: string;
    featuredBadge: string;
    openMilestoneCta: string;
    itemCountLabel: string;
    emptyRoadmap: string;
    emptyPhase: string;
  }
> = {
  en: {
    phaseLabel: "Phase",
    featuredBadge: "Featured",
    openMilestoneCta: "Open milestone",
    itemCountLabel: "items",
    emptyRoadmap: "No roadmap phases published yet.",
    emptyPhase: "No milestones in this phase yet."
  },
  de: {
    phaseLabel: "Phase",
    featuredBadge: "Hervorgehoben",
    openMilestoneCta: "Meilenstein öffnen",
    itemCountLabel: "Einträge",
    emptyRoadmap: "Noch keine Roadmap-Phasen veröffentlicht.",
    emptyPhase: "In dieser Phase sind noch keine Meilensteine vorhanden."
  }
};

/** Minimapa flotante en /roadmap (saltar a fases). */
export const roadmapMinimapLabels: Record<Locale, { button: string; title: string; close: string; ariaNav: string }> = {
  en: {
    button: "Phase map",
    title: "Roadmap phases",
    close: "Close",
    ariaNav: "Roadmap phase minimap"
  },
  de: {
    button: "Phasen-Map",
    title: "Roadmap-Phasen",
    close: "Schliessen",
    ariaNav: "Phasen-Minimap der Roadmap"
  }
};

/** Página pública /skills — Capability Matrix + Evidence (listado). */
export const skillsPageContent: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  en: {
    eyebrow: "Capability map",
    title: "Skills backed by visible evidence",
    description:
      "A traceable matrix by depth level: progress reflects practice, and each skill links to labs that prove it."
  },
  de: {
    eyebrow: "Kompetenzlandkarte",
    title: "Skills mit nachvollziehbaren Belegen",
    description:
      "Eine nachvollziehbare Matrix nach Tiefe: Fortschritt spiegelt Praxis wider, jede Skill verweist auf Labs als Nachweis."
  }
};

export const skillsVisualLabels: Record<
  Locale,
  {
    matrixTitle: string;
    matrixSubtitle: string;
    filterAll: string;
    filterByTag: string;
    viewMatrix: string;
    viewList: string;
    labsLinked: (n: number) => string;
    openSkill: string;
    bentoTitle: string;
    bentoSubtitle: string;
    featured: string;
    emptyFiltered: string;
    emptyPublished: string;
  }
> = {
  en: {
    matrixTitle: "Depth matrix",
    matrixSubtitle: "Grouped by level; color intensity reflects self-assessed progress.",
    filterAll: "All",
    filterByTag: "Filter by tag",
    viewMatrix: "Matrix",
    viewList: "List",
    labsLinked: (n) => (n === 1 ? "1 lab linked" : `${n} labs linked`),
    openSkill: "Open skill",
    bentoTitle: "Skill cards",
    bentoSubtitle: "Larger tiles highlight the strongest signals; everything links to evidence.",
    featured: "Top signal",
    emptyFiltered: "No skills match this filter.",
    emptyPublished: "No skills published yet."
  },
  de: {
    matrixTitle: "Tiefen-Matrix",
    matrixSubtitle: "Gruppiert nach Level; die Farbintensität spiegelt den Selbsteinschätzungs-Fortschritt wider.",
    filterAll: "Alle",
    filterByTag: "Nach Tag filtern",
    viewMatrix: "Matrix",
    viewList: "Liste",
    labsLinked: (n) => (n === 1 ? "1 verknüpftes Lab" : `${n} verknüpfte Labs`),
    openSkill: "Skill öffnen",
    bentoTitle: "Skill-Karten",
    bentoSubtitle: "Größere Karten betonen die stärksten Signale; alles verlinkt zu Belegen.",
    featured: "Top-Signal",
    emptyFiltered: "Keine Skills passen zu diesem Filter.",
    emptyPublished: "Noch keine Skills veröffentlicht."
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

/** Página pública /certifications — hero KPIs, chips y timeline. */
export const certificationsPageContent: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  en: {
    eyebrow: "Formal learning",
    title: "Certifications and structured learning signals",
    description:
      "A traceable view of completed, in-progress and planned certifications — aligned with your roadmap and easy to filter."
  },
  de: {
    eyebrow: "Formales Lernen",
    title: "Zertifizierungen und strukturierte Lernsignale",
    description:
      "Nachvollziehbare Übersicht über abgeschlossene, laufende und geplante Zertifizierungen — filterbar und an die Roadmap gekoppelt."
  }
};

export const certificationsVisualLabels: Record<
  Locale,
  {
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
    resultCount: (n: number) => string;
    dateLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    stateChips: Record<CertificationState, string>;
  }
> = {
  en: {
    kpiCompleted: "Completed",
    kpiInProgress: "In progress",
    kpiPlanned: "Planned",
    filterByProvider: "Provider",
    filterByState: "State",
    filterAll: "All",
    viewLabel: "Layout",
    viewTimeline: "Timeline",
    viewBrowse: "Browse",
    viewToggleAria: "Choose certification layout",
    timelineTitle: "Learning timeline",
    browseTitle: "Browse results",
    browseDescription: "Dense grid: scan and compare filtered certifications faster.",
    resultCount: (n) => (n === 1 ? "1 certification" : `${n} certifications`),
    dateLabel: "Relevant date",
    emptyTitle: "No certifications match the current filters",
    emptyDescription: "Try another provider or state to explore your learning roadmap.",
    stateChips: {
      completed: "Completed",
      "in-progress": "In progress",
      planned: "Planned"
    }
  },
  de: {
    kpiCompleted: "Abgeschlossen",
    kpiInProgress: "In Bearbeitung",
    kpiPlanned: "Geplant",
    filterByProvider: "Anbieter",
    filterByState: "Status",
    filterAll: "Alle",
    viewLabel: "Ansicht",
    viewTimeline: "Timeline",
    viewBrowse: "Übersicht",
    viewToggleAria: "Darstellung der Zertifizierungen wählen",
    timelineTitle: "Lern-Timeline",
    browseTitle: "Gefilterte Ergebnisse",
    browseDescription: "Kompaktes Raster: gefilterte Zertifizierungen schneller vergleichen.",
    resultCount: (n) => (n === 1 ? "1 Zertifizierung" : `${n} Zertifizierungen`),
    dateLabel: "Stichtag",
    emptyTitle: "Keine Zertifizierungen mit diesen Filtern",
    emptyDescription: "Wähle einen anderen Anbieter oder Status, um deine Lern-Roadmap zu sehen.",
    stateChips: {
      completed: "Abgeschlossen",
      "in-progress": "In Bearbeitung",
      planned: "Geplant"
    }
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
