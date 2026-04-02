import type {
  AvailabilityStatus,
  ContentStore,
  Locale,
  LocalizedCertificationsPageContent,
  LocalizedContactContent,
  LocalizedHomeContent,
  LocalizedRoadmapPageContent,
  LocalizedSkillsPageContent
} from "@/lib/types";

/** Valores por defecto (i18n) si el store aún no tiene campos nuevos de home. */
export const HOME_LOCALE_DEFAULTS: Record<Locale, LocalizedHomeContent> = {
  en: {
    heroTitle: "",
    heroSubtitle: "",
    roleChip: "",
    locationChip: "",
    availabilityChip: "",
    primaryCtaLabel: "",
    secondaryCtaLabel: "",
    statsHeading: "",
    statsSubtitle: "Professional signal, structured proof",
    kpiLabsLabel: "Labs",
    kpiCertificationsLabel: "Certifications",
    kpiSkillsLabel: "Skills",
    availabilityLineTemplate: "Availability: {{availability}}. Preferred contact: {{channel}}.",
    featuredLabsHeading: "",
    featuredLabsDescription: "Evidence-led work that shows execution, context and what was learned.",
    featuredLabsEmptyTitle: "No featured case studies yet",
    featuredLabsEmptyDescription: "Mark labs as top case studies in the admin, or browse the full labs list.",
    featuredLabsEmptyCta: "View all labs",
    skillsHeading: "",
    skillsDescription:
      "Preview of the strongest signals by progress — each skill links to labs as evidence. Open the full capability map for the complete matrix.",
    skillsEmptyTitle: "No skills yet",
    skillsEmptyDescription: "Add skills in the admin panel.",
    skillsEmptyCta: "View skills",
    skillsViewAll: "View all skills",
    roadmapHeading: "",
    roadmapDescription: "A visible trajectory that connects learning, delivery and formal validation.",
    roadmapViewFull: "Full roadmap",
    roadmapCurrentFocusLabel: "Current focus",
    roadmapEmptyTitle: "No active milestone",
    roadmapEmptyDescription:
      "There is no active milestone in any phase right now. Open the roadmap for the full timeline.",
    closingHeading: "",
    closingText: "",
    carouselLabsRegion: "Featured case studies carousel",
    carouselLabsPrev: "Previous case studies",
    carouselLabsNext: "Next case studies"
  },
  de: {
    heroTitle: "",
    heroSubtitle: "",
    roleChip: "",
    locationChip: "",
    availabilityChip: "",
    primaryCtaLabel: "",
    secondaryCtaLabel: "",
    statsHeading: "",
    statsSubtitle: "Profisignal, strukturierte Belege",
    kpiLabsLabel: "Labs",
    kpiCertificationsLabel: "Zertifizierungen",
    kpiSkillsLabel: "Skills",
    availabilityLineTemplate: "Verfügbarkeit: {{availability}}. Bevorzugter Kontakt: {{channel}}.",
    featuredLabsHeading: "",
    featuredLabsDescription: "Evidenzbasierte Arbeit mit Kontext, Umsetzung und Learnings.",
    featuredLabsEmptyTitle: "Keine hervorgehobenen Case Studies",
    featuredLabsEmptyDescription:
      "Markiere Labs als Top Case Study im Admin oder besuche die vollständige Labs-Übersicht.",
    featuredLabsEmptyCta: "Alle Labs",
    skillsHeading: "",
    skillsDescription:
      "Vorschau der stärksten Signale nach Fortschritt — jede Skill verweist auf Labs als Beleg. Die vollständige Matrix findest du unter Skills.",
    skillsEmptyTitle: "Noch keine Skills",
    skillsEmptyDescription: "Skills im Admin anlegen.",
    skillsEmptyCta: "Zu Skills",
    skillsViewAll: "Alle Skills",
    roadmapHeading: "",
    roadmapDescription: "Ein sichtbarer Pfad aus Lernen, Delivery und formaler Validierung.",
    roadmapViewFull: "Vollständige Roadmap",
    roadmapCurrentFocusLabel: "Aktueller Fokus",
    roadmapEmptyTitle: "Kein aktiver Meilenstein",
    roadmapEmptyDescription:
      "Aktuell gibt es keinen aktiven Meilenstein in einer Phase. Unter Roadmap siehst du die vollständige Übersicht.",
    closingHeading: "",
    closingText: "",
    carouselLabsRegion: "Karussell mit ausgewählten Case Studies",
    carouselLabsPrev: "Vorherige Case Studies",
    carouselLabsNext: "Weitere Case Studies"
  }
};

export const SKILLS_PAGE_DEFAULTS: Record<Locale, LocalizedSkillsPageContent> = {
  en: {
    eyebrow: "Capability map",
    title: "Skills backed by visible evidence",
    description:
      "A traceable matrix by depth level: progress reflects practice, and each skill links to labs that prove it.",
    matrixTitle: "Depth matrix",
    matrixSubtitle: "Grouped by level; color intensity reflects self-assessed progress.",
    filterAll: "All",
    filterByTag: "Filter by tag",
    viewMatrix: "Matrix",
    viewList: "List",
    labsLinkedOne: "1 lab linked",
    labsLinkedMany: "{{n}} labs linked",
    openSkill: "Open skill",
    bentoTitle: "Skill cards",
    bentoSubtitle: "Larger tiles highlight the strongest signals; everything links to evidence.",
    featured: "Top signal",
    emptyFiltered: "No skills match this filter.",
    emptyPublished: "No skills published yet."
  },
  de: {
    eyebrow: "Kompetenzlandkarte",
    title: "Skills mit nachvollziehbaren Belegen",
    description:
      "Eine nachvollziehbare Matrix nach Tiefe: Fortschritt spiegelt Praxis wider, jede Skill verweist auf Labs als Nachweis.",
    matrixTitle: "Tiefen-Matrix",
    matrixSubtitle: "Gruppiert nach Level; die Farbintensität spiegelt den Selbsteinschätzungs-Fortschritt wider.",
    filterAll: "Alle",
    filterByTag: "Nach Tag filtern",
    viewMatrix: "Matrix",
    viewList: "Liste",
    labsLinkedOne: "1 verknüpftes Lab",
    labsLinkedMany: "{{n}} verknüpfte Labs",
    openSkill: "Skill öffnen",
    bentoTitle: "Skill-Karten",
    bentoSubtitle: "Größere Karten betonen die stärksten Signale; alles verlinkt zu Belegen.",
    featured: "Top-Signal",
    emptyFiltered: "Keine Skills passen zu diesem Filter.",
    emptyPublished: "Noch keine Skills veröffentlicht."
  }
};

export const ROADMAP_PAGE_DEFAULTS: Record<Locale, LocalizedRoadmapPageContent> = {
  en: {
    eyebrow: "Roadmap",
    title: "Professional progression by phases and milestones",
    description: "A visual journey of execution, learning, and validation across the next phases.",
    phaseLabel: "Phase",
    featuredBadge: "Featured",
    openMilestoneCta: "Open milestone",
    itemCountLabel: "items",
    emptyRoadmap: "No roadmap phases published yet.",
    emptyPhase: "No milestones in this phase yet.",
    minimapButton: "Phase map",
    minimapTitle: "Roadmap phases",
    minimapClose: "Close",
    minimapAriaNav: "Roadmap phase minimap"
  },
  de: {
    eyebrow: "Roadmap",
    title: "Beruflicher Fortschritt in Phasen und Meilensteinen",
    description: "Eine visuelle Entwicklung über Ausführung, Lernen und Validierung entlang der nächsten Phasen.",
    phaseLabel: "Phase",
    featuredBadge: "Hervorgehoben",
    openMilestoneCta: "Meilenstein öffnen",
    itemCountLabel: "Einträge",
    emptyRoadmap: "Noch keine Roadmap-Phasen veröffentlicht.",
    emptyPhase: "In dieser Phase sind noch keine Meilensteine vorhanden.",
    minimapButton: "Phasen-Map",
    minimapTitle: "Roadmap-Phasen",
    minimapClose: "Schliessen",
    minimapAriaNav: "Phasen-Minimap der Roadmap"
  }
};

export const CERTIFICATIONS_PAGE_DEFAULTS: Record<Locale, LocalizedCertificationsPageContent> = {
  en: {
    eyebrow: "Formal learning",
    title: "Certifications and structured learning signals",
    description:
      "A traceable view of completed, in-progress and planned certifications — aligned with your roadmap and easy to filter.",
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
    resultCountOne: "1 certification",
    resultCountMany: "{{n}} certifications",
    dateLabel: "Relevant date",
    emptyTitle: "No certifications match the current filters",
    emptyDescription: "Try another provider or state to explore your learning roadmap.",
    stateChipCompleted: "Completed",
    stateChipInProgress: "In progress",
    stateChipPlanned: "Planned"
  },
  de: {
    eyebrow: "Formales Lernen",
    title: "Zertifizierungen und strukturierte Lernsignale",
    description:
      "Nachvollziehbare Übersicht über abgeschlossene, laufende und geplante Zertifizierungen — filterbar und an die Roadmap gekoppelt.",
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
    resultCountOne: "1 Zertifizierung",
    resultCountMany: "{{n}} Zertifizierungen",
    dateLabel: "Stichtag",
    emptyTitle: "Keine Zertifizierungen mit diesen Filtern",
    emptyDescription: "Wähle einen anderen Anbieter oder Status, um deine Lern-Roadmap zu sehen.",
    stateChipCompleted: "Abgeschlossen",
    stateChipInProgress: "In Bearbeitung",
    stateChipPlanned: "Geplant"
  }
};

/** Valores por defecto (i18n) para textos de contacto si el store tiene campos vacíos. */
export const CONTACT_LOCALE_DEFAULTS: Record<Locale, LocalizedContactContent> = {
  en: {
    headline: "Contact",
    intro:
      "Whether you are hiring, collaborating, or want a technical deep dive — I respond with context and clear next steps.",
    location: "",
    responseTime: "Within 24–48 hours on business days",
    preferredChannel: "Email",
    primaryCtaLabel: "Contact"
  },
  de: {
    headline: "Kontakt",
    intro:
      "Ob du eine Rolle besetzt, zusammenarbeiten willst oder einen technischen Deep Dive brauchst — ich antworte mit Kontext und klaren nächsten Schritten.",
    location: "",
    responseTime: "Innerhalb von 24–48 Stunden an Werktagen",
    preferredChannel: "E-Mail",
    primaryCtaLabel: "Kontakt"
  }
};

export type ContactPageUiLabels = {
  eyebrow: string;
  emailLabel: string;
  linkedinLabel: string;
  githubLabel: string;
  availabilityLabel: string;
  contextHeading: string;
  locationLabel: string;
  responseTimeLabel: string;
  preferredChannelLabel: string;
};

export const CONTACT_PAGE_UI: Record<Locale, ContactPageUiLabels> = {
  en: {
    eyebrow: "Contact",
    emailLabel: "Email",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    availabilityLabel: "Availability",
    contextHeading: "Context",
    locationLabel: "Location",
    responseTimeLabel: "Expected response time",
    preferredChannelLabel: "Preferred channel"
  },
  de: {
    eyebrow: "Kontakt",
    emailLabel: "E-Mail",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    availabilityLabel: "Verfügbarkeit",
    contextHeading: "Kontext",
    locationLabel: "Standort",
    responseTimeLabel: "Erwartete Antwortzeit",
    preferredChannelLabel: "Bevorzugter Kanal"
  }
};

export const AVAILABILITY_LABELS_LOCALE: Record<Locale, Record<AvailabilityStatus, string>> = {
  en: {
    open: "Open to opportunities",
    selective: "Selective opportunities",
    unavailable: "Unavailable"
  },
  de: {
    open: "Offen für neue Möglichkeiten",
    selective: "Selektive Möglichkeiten",
    unavailable: "Nicht verfügbar"
  }
};

export function mergeLocalizedContactContent(
  locale: Locale,
  fromStore: Partial<LocalizedContactContent>
): LocalizedContactContent {
  const defaults = CONTACT_LOCALE_DEFAULTS[locale];
  const out = { ...defaults };
  (Object.keys(defaults) as (keyof LocalizedContactContent)[]).forEach((key) => {
    const v = fromStore[key];
    if (typeof v === "string" && v.trim() !== "") {
      out[key] = v;
    }
  });
  return out;
}

export function formatAvailabilityLabel(locale: Locale, status: AvailabilityStatus): string {
  return AVAILABILITY_LABELS_LOCALE[locale][status];
}

/**
 * Store vacío para el primer arranque sin `data/runtime/store.json`.
 * No incluye datos de demo: catálogos y colecciones en cero; textos globales = defaults + placeholders editables en admin.
 * El dataset grande de prueba solo se genera con `npm run seed:store` (seed-data).
 */
export function buildBootstrapContentStore(): ContentStore {
  const now = new Date().toISOString();

  return {
    catalogs: { categories: [], providers: [], tags: [] },
    labs: [],
    skills: [],
    certifications: [],
    roadmapPhases: [],
    roadmapMilestones: [],
    home: {
      id: "home",
      version: 1,
      updatedAt: now,
      locales: {
        en: HOME_LOCALE_DEFAULTS.en,
        de: HOME_LOCALE_DEFAULTS.de
      }
    },
    skillsPage: {
      id: "skillsPage",
      version: 1,
      updatedAt: now,
      locales: {
        en: SKILLS_PAGE_DEFAULTS.en,
        de: SKILLS_PAGE_DEFAULTS.de
      }
    },
    roadmapPage: {
      id: "roadmapPage",
      version: 1,
      updatedAt: now,
      locales: {
        en: ROADMAP_PAGE_DEFAULTS.en,
        de: ROADMAP_PAGE_DEFAULTS.de
      }
    },
    certificationsPage: {
      id: "certificationsPage",
      version: 1,
      updatedAt: now,
      locales: {
        en: CERTIFICATIONS_PAGE_DEFAULTS.en,
        de: CERTIFICATIONS_PAGE_DEFAULTS.de
      }
    },
    about: {
      id: "about",
      version: 1,
      updatedAt: now,
      locales: {
        en: {
          headline: "About",
          intro: "Edit this page in the admin under Content → About.",
          summary: "",
          location: "",
          roleFocus: "",
          yearsExperience: "",
          coreCompetencies: [],
          strengths: [],
          workingStyle: [],
          goals: []
        },
        de: {
          headline: "Über mich",
          intro: "Bearbeite diese Seite im Admin unter Content → About.",
          summary: "",
          location: "",
          roleFocus: "",
          yearsExperience: "",
          coreCompetencies: [],
          strengths: [],
          workingStyle: [],
          goals: []
        }
      }
    },
    contact: {
      id: "contact",
      version: 1,
      updatedAt: now,
      email: "",
      linkedin: "",
      github: "",
      availability: "selective",
      locales: {
        en: CONTACT_LOCALE_DEFAULTS.en,
        de: CONTACT_LOCALE_DEFAULTS.de
      }
    },
    privacy: {
      id: "privacy",
      version: 1,
      updatedAt: now,
      locales: {
        en: {
          headline: "Privacy",
          body: ["Edit this policy in the admin under Content → Privacy."]
        },
        de: {
          headline: "Datenschutz",
          body: ["Bearbeite diese Richtlinie im Admin unter Content → Privacy."]
        }
      }
    },
    media: [],
    activity: [
      {
        id: "activity-bootstrap",
        type: "create",
        collection: "system",
        targetId: "bootstrap",
        message: "Empty content store initialized. Replace data/runtime with your backup or run npm run seed:store for a demo dataset.",
        createdAt: now
      }
    ]
  };
}
