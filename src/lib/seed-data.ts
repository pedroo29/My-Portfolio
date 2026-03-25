import type { ContentStore } from "@/lib/types";

const now = new Date().toISOString();

/** Store inicial vacío: labs, skills, certificaciones, roadmap y catálogos sin ítems. Rellena desde el admin. */
export const seedContentStore: ContentStore = {
  catalogs: {
    categories: [],
    providers: [],
    tags: []
  },
  skills: [],
  certifications: [],
  roadmapPhases: [],
  roadmapMilestones: [],
  labs: [],
  home: {
    id: "home",
    version: 1,
    updatedAt: now,
    locales: {
      en: {
        heroTitle: "Your name — headline for visitors.",
        heroSubtitle: "Short value proposition. Edit this in Admin → Home content.",
        roleChip: "Your role",
        locationChip: "Location",
        availabilityChip: "Availability",
        primaryCtaLabel: "View labs",
        secondaryCtaLabel: "Contact",
        statsHeading: "At a glance",
        featuredLabsHeading: "Featured case studies",
        skillsHeading: "Skills",
        roadmapHeading: "Roadmap",
        closingHeading: "Closing headline",
        closingText: "Closing paragraph — invite the reader to connect."
      },
      de: {
        heroTitle: "Ihr Name — Überschrift für Besucher.",
        heroSubtitle: "Kurzes Wertversprechen. Bearbeiten unter Admin → Home.",
        roleChip: "Ihre Rolle",
        locationChip: "Standort",
        availabilityChip: "Verfügbarkeit",
        primaryCtaLabel: "Labs ansehen",
        secondaryCtaLabel: "Kontakt",
        statsHeading: "Auf einen Blick",
        featuredLabsHeading: "Vorgestellte Case Studies",
        skillsHeading: "Skills",
        roadmapHeading: "Roadmap",
        closingHeading: "Abschlussüberschrift",
        closingText: "Absatz — Einladung zum Kontakt."
      }
    }
  },
  about: {
    id: "about",
    version: 1,
    updatedAt: now,
    locales: {
      en: {
        headline: "About you",
        intro: "Intro paragraph — who you are and what you focus on.",
        summary: "Longer summary for recruiters and peers.",
        location: "",
        roleFocus: "",
        yearsExperience: "",
        coreCompetencies: [],
        strengths: [],
        workingStyle: [],
        goals: []
      },
      de: {
        headline: "Über Sie",
        intro: "Einleitung — wer Sie sind und worauf Sie sich konzentrieren.",
        summary: "Längere Zusammenfassung.",
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
      en: {
        headline: "Contact",
        intro: "How you prefer to be reached.",
        location: "",
        responseTime: "",
        preferredChannel: "Email",
        primaryCtaLabel: "Send email"
      },
      de: {
        headline: "Kontakt",
        intro: "Wie Sie erreicht werden möchten.",
        location: "",
        responseTime: "",
        preferredChannel: "E-Mail",
        primaryCtaLabel: "E-Mail senden"
      }
    }
  },
  privacy: {
    id: "privacy",
    version: 1,
    updatedAt: now,
    locales: {
      en: {
        headline: "Privacy",
        body: ["Add your privacy policy here."]
      },
      de: {
        headline: "Datenschutz",
        body: ["Datenschutzerklärung hier einfügen."]
      }
    }
  },
  media: [],
  activity: [
    {
      id: "activity-store-reset",
      type: "create",
      collection: "system",
      targetId: "initial-empty",
      message: "Empty content store — add labs, skills and catalogs from the admin.",
      createdAt: now
    }
  ]
};
