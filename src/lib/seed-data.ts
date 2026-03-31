import type {
  Certification,
  CertificationState,
  ContentStore,
  Lab,
  LabLevel,
  LabState,
  MediaAsset,
  MilestoneState,
  Priority,
  RoadmapMilestone,
  RoadmapPhase,
  Skill
} from "@/lib/types";

const now = new Date().toISOString();

/** Seed inicial vacío: catálogos + textos globales; el contenido se crea vía admin. */
const SKILL_COUNT = 0;
const LAB_COUNT = 0;
const CERT_COUNT = 0;
const PHASE_COUNT = 0;
const MILESTONE_COUNT = 0;
const MEDIA_COUNT = 0;

const levels: LabLevel[] = ["foundational", "intermediate", "advanced"];
const labStates: LabState[] = ["completed", "in-progress", "planned"];
const certStates: CertificationState[] = ["completed", "in-progress", "planned"];
const milestoneStates: MilestoneState[] = ["completed", "active", "planned"];
const priorities: Priority[] = ["low", "medium", "high"];

function seo(enTitle: string, enDescription: string, deTitle: string, deDescription: string) {
  return {
    en: { title: enTitle, description: enDescription },
    de: { title: deTitle, description: deDescription }
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

const catalogs: ContentStore["catalogs"] = {
  categories: [
    { id: "cat-platform", slug: "platform", label: { en: "Platform", de: "Plattform" } },
    { id: "cat-security", slug: "security", label: { en: "Security", de: "Sicherheit" } },
    { id: "cat-automation", slug: "automation", label: { en: "Automation", de: "Automatisierung" } },
    { id: "cat-data", slug: "data", label: { en: "Data", de: "Daten" } },
    { id: "cat-experience", slug: "experience", label: { en: "Developer Experience", de: "Developer Experience" } }
  ],
  providers: [
    { id: "prov-aws", slug: "aws", label: { en: "Amazon Web Services", de: "Amazon Web Services" } },
    { id: "prov-cncf", slug: "cncf", label: { en: "CNCF", de: "CNCF" } },
    { id: "prov-isc2", slug: "isc2", label: { en: "ISC2", de: "ISC2" } },
    { id: "prov-hashicorp", slug: "hashicorp", label: { en: "HashiCorp", de: "HashiCorp" } },
    { id: "prov-google", slug: "google", label: { en: "Google Cloud", de: "Google Cloud" } }
  ],
  tags: [
    { id: "tag-nextjs", slug: "nextjs", label: { en: "Next.js", de: "Next.js" } },
    { id: "tag-devsecops", slug: "devsecops", label: { en: "DevSecOps", de: "DevSecOps" } },
    { id: "tag-observability", slug: "observability", label: { en: "Observability", de: "Observability" } },
    { id: "tag-kubernetes", slug: "kubernetes", label: { en: "Kubernetes", de: "Kubernetes" } },
    { id: "tag-ci", slug: "ci-cd", label: { en: "CI/CD", de: "CI/CD" } },
    { id: "tag-i18n", slug: "i18n", label: { en: "Localization", de: "Lokalisierung" } },
    { id: "tag-typescript", slug: "typescript", label: { en: "TypeScript", de: "TypeScript" } },
    { id: "tag-node", slug: "nodejs", label: { en: "Node.js", de: "Node.js" } },
    { id: "tag-api", slug: "api-design", label: { en: "API Design", de: "API-Design" } },
    { id: "tag-testing", slug: "testing", label: { en: "Testing", de: "Testing" } },
    { id: "tag-ux", slug: "ux", label: { en: "UX", de: "UX" } },
    { id: "tag-performance", slug: "performance", label: { en: "Performance", de: "Performance" } }
  ]
};

const tagIds = catalogs.tags.map((t) => t.id);
const categoryIds = catalogs.categories.map((c) => c.id);
const providerIds = catalogs.providers.map((p) => p.id);

const skills: Skill[] = Array.from({ length: SKILL_COUNT }, (_, i) => {
  const n = i + 1;
  const level = levels[i % levels.length];
  const progress = 35 + ((i * 7) % 61);
  const tags = [tagIds[i % tagIds.length], tagIds[(i + 3) % tagIds.length], tagIds[(i + 7) % tagIds.length]];
  return {
    id: `skill-${pad(n)}`,
    slug: `skill-${pad(n)}`,
    status: "published",
    version: 1,
    createdAt: now,
    updatedAt: now,
    seo: seo(
      `Skill ${pad(n)} profile`,
      `Skill ${pad(n)} with measurable evidence.`,
      `Skill ${pad(n)} Profil`,
      `Skill ${pad(n)} mit messbaren Belegen.`
    ),
    level,
    progress,
    tags,
    labIds: [],
    locales: {
      en: {
        name: `Skill ${pad(n)}`,
        summary: `Capability area ${n}: practical execution, quality standards and measurable delivery outcomes.`
      },
      de: {
        name: `Skill ${pad(n)}`,
        summary: `Kompetenzfeld ${n}: praktische Umsetzung, Qualitätsstandards und messbare Lieferergebnisse.`
      }
    }
  };
});

const labs: Lab[] = Array.from({ length: LAB_COUNT }, (_, i) => {
  const n = i + 1;
  const s1 = skills[i % skills.length];
  const s2 = skills[(i + 9) % skills.length];
  const s3 = skills[(i + 17) % skills.length];
  const state = labStates[i % labStates.length];
  const level = levels[(i + 1) % levels.length];
  const categoryId = categoryIds[i % categoryIds.length];
  const tags = [tagIds[i % tagIds.length], tagIds[(i + 4) % tagIds.length]];
  return {
    id: `lab-${pad(n)}`,
    slug: `lab-${pad(n)}`,
    status: "published",
    version: 1,
    createdAt: now,
    updatedAt: now,
    seo: seo(`Lab ${pad(n)}`, `Case study lab ${n}.`, `Lab ${pad(n)}`, `Case-Study-Lab ${n}.`),
    categoryId,
    level,
    state,
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"].slice(0, 2 + (i % 3)),
    tags,
    date: ymd(2025 + (i % 2), (i % 12) + 1, ((i * 3) % 27) + 1),
    isTopCaseStudy: i % 11 === 0,
    skillIds: [s1.id, s2.id, s3.id],
    mediaIds: [],
    evidenceLinks: [{ label: `Runbook ${n}`, url: `https://example.com/labs/${n}/runbook` }],
    metrics: [
      { label: "Lead time", value: `${2 + (i % 8)}d` },
      { label: "Error rate", value: `${(i % 5) + 1}%` },
      { label: "Coverage", value: `${55 + ((i * 5) % 40)}%` }
    ],
    locales: {
      en: {
        title: `Lab ${pad(n)} — Platform experiment`,
        summary: `Hands-on delivery scenario ${n} with architecture, execution and validation results.`,
        documentation: `## Lab ${n}\n\nThis documentation describes scope, decisions, implementation and outcomes for scenario ${n}.`,
        objectives: [`Define scope ${n}`, `Ship implementation ${n}`, `Measure impact ${n}`],
        results: [`Deployed scenario ${n}`, `Observed baseline metrics ${n}`],
        lessonsLearned: [`Iteration ${n} improved clarity`, `Automation reduced friction in scenario ${n}`]
      },
      de: {
        title: `Lab ${pad(n)} — Plattform-Experiment`,
        summary: `Praktisches Delivery-Szenario ${n} mit Architektur-, Umsetzungs- und Validierungsergebnissen.`,
        documentation: `## Lab ${n}\n\nDiese Dokumentation beschreibt Umfang, Entscheidungen, Umsetzung und Ergebnisse für Szenario ${n}.`,
        objectives: [`Umfang ${n} definieren`, `Umsetzung ${n} liefern`, `Wirkung ${n} messen`],
        results: [`Szenario ${n} ausgerollt`, `Baseline-Metriken ${n} beobachtet`],
        lessonsLearned: [`Iteration ${n} verbesserte Klarheit`, `Automatisierung reduzierte Reibung in Szenario ${n}`]
      }
    }
  };
});

for (const skill of skills) {
  skill.labIds = labs.filter((lab) => lab.skillIds.includes(skill.id)).map((lab) => lab.id);
}

const certifications: Certification[] = Array.from({ length: CERT_COUNT }, (_, i) => {
  const n = i + 1;
  const state = certStates[i % certStates.length];
  return {
    id: `cert-${pad(n)}`,
    slug: `cert-${pad(n)}`,
    status: "published",
    version: 1,
    createdAt: now,
    updatedAt: now,
    seo: seo(`Certification ${n}`, `Certification track ${n}.`, `Zertifizierung ${n}`, `Zertifizierungs-Track ${n}.`),
    providerId: providerIds[i % providerIds.length],
    state,
    relevantDate: ymd(2025 + (i % 3), ((i + 4) % 12) + 1, ((i * 2) % 27) + 1),
    tags: [tagIds[i % tagIds.length], tagIds[(i + 5) % tagIds.length]],
    evidenceLink: `https://example.com/certifications/${n}`,
    locales: {
      en: { name: `Certification ${pad(n)}`, note: `Certification path ${n} focused on delivery, reliability and operations.` },
      de: { name: `Zertifizierung ${pad(n)}`, note: `Zertifizierungsweg ${n} mit Fokus auf Delivery, Zuverlässigkeit und Betrieb.` }
    }
  };
});

const roadmapPhases: RoadmapPhase[] = Array.from({ length: PHASE_COUNT }, (_, i) => {
  const n = i + 1;
  const state: MilestoneState = i < 2 ? "completed" : i < 4 ? "active" : "planned";
  return {
    id: `phase-${pad(n)}`,
    slug: `phase-${pad(n)}`,
    status: "published",
    version: 1,
    createdAt: now,
    updatedAt: now,
    seo: seo(`Phase ${n}`, `Roadmap phase ${n}.`, `Phase ${n}`, `Roadmap-Phase ${n}.`),
    order: n,
    state,
    locales: {
      en: { title: `Phase ${n}`, summary: `Roadmap chapter ${n} with progressive milestones and measurable outcomes.` },
      de: { title: `Phase ${n}`, summary: `Roadmap-Kapitel ${n} mit aufeinander aufbauenden Meilensteinen und messbaren Ergebnissen.` }
    }
  };
});

const milestonesPerPhase = Math.ceil(MILESTONE_COUNT / roadmapPhases.length);

const roadmapMilestones: RoadmapMilestone[] = Array.from({ length: MILESTONE_COUNT }, (_, i) => {
  const n = i + 1;
  const phase = roadmapPhases[Math.floor(i / milestonesPerPhase)] ?? roadmapPhases[roadmapPhases.length - 1];
  const order = (i % milestonesPerPhase) + 1;
  const state = milestoneStates[i % milestoneStates.length];
  const priority = priorities[i % priorities.length];
  const labA = labs[i % labs.length];
  const labB = labs[(i + 13) % labs.length];
  const skillA = skills[i % skills.length];
  const skillB = skills[(i + 5) % skills.length];
  const cert = certifications[i % certifications.length];
  return {
    id: `milestone-${pad(n)}`,
    slug: `milestone-${pad(n)}`,
    status: "published",
    version: 1,
    createdAt: now,
    updatedAt: now,
    seo: seo(`Milestone ${n}`, `Roadmap milestone ${n}.`, `Meilenstein ${n}`, `Roadmap-Meilenstein ${n}.`),
    phaseId: phase.id,
    order,
    state,
    startDate: ymd(2025 + (i % 3), (i % 12) + 1, ((i * 2) % 26) + 1),
    endDate: state === "planned" ? undefined : ymd(2025 + (i % 3), ((i + 1) % 12) + 1, ((i * 2 + 7) % 26) + 1),
    estimatedEffort: `${2 + (i % 7)} weeks`,
    priority,
    tags: [tagIds[i % tagIds.length], tagIds[(i + 2) % tagIds.length]],
    evidenceLinks: [{ label: `Milestone evidence ${n}`, url: `https://example.com/milestones/${n}` }],
    labIds: [labA.id, labB.id],
    skillIds: [skillA.id, skillB.id],
    certificationIds: [cert.id],
    locales: {
      en: {
        title: `Milestone ${pad(n)}`,
        summary: `Milestone ${n} advances delivery quality, operational readiness and reusable platform capabilities.`,
        outcomes: [`Outcome ${n}.1`, `Outcome ${n}.2`, `Outcome ${n}.3`]
      },
      de: {
        title: `Meilenstein ${pad(n)}`,
        summary: `Meilenstein ${n} verbessert Lieferqualität, Betriebsreife und wiederverwendbare Plattformfähigkeiten.`,
        outcomes: [`Ergebnis ${n}.1`, `Ergebnis ${n}.2`, `Ergebnis ${n}.3`]
      }
    }
  };
});

const media: MediaAsset[] = Array.from({ length: MEDIA_COUNT }, (_, i) => {
  const n = i + 1;
  const linkedLabs = [labs[i % labs.length].id, labs[(i + 7) % labs.length].id];
  return {
    id: `media-${pad(n)}`,
    fileName: `asset-${pad(n)}.png`,
    url: `/api/media/asset-${pad(n)}.png`,
    mimeType: "image/png",
    size: 120000 + i * 2100,
    alt: { en: `Media asset ${n}`, de: `Medien-Asset ${n}` },
    caption: { en: `Demo visual asset ${n}`, de: `Demo-Visual-Asset ${n}` },
    labIds: linkedLabs,
    createdAt: now
  };
});

for (const lab of labs) {
  lab.mediaIds = media.filter((m) => m.labIds.includes(lab.id)).map((m) => m.id);
}

export const seedContentStore: ContentStore = {
  catalogs,
  skills,
  certifications,
  roadmapPhases,
  roadmapMilestones,
  labs,
  home: {
    id: "home",
    version: 1,
    updatedAt: now,
    locales: {
      en: {
        heroTitle: "Pedro — Portfolio",
        heroSubtitle: "Product engineering, platforms and delivery—documented with labs, skills and roadmap.",
        roleChip: "Product Engineer",
        locationChip: "Europe (remote-friendly)",
        availabilityChip: "Selective opportunities",
        primaryCtaLabel: "View labs",
        secondaryCtaLabel: "Contact",
        statsHeading: "At a glance",
        featuredLabsHeading: "Featured case studies",
        skillsHeading: "Core skills",
        roadmapHeading: "Roadmap",
        closingHeading: "Build reliable systems",
        closingText: "Populate labs, skills and roadmap from the admin to bring this site to life."
      },
      de: {
        heroTitle: "Pedro — Portfolio",
        heroSubtitle: "Product Engineering, Plattformen und Delivery—dokumentiert mit Labs, Skills und Roadmap.",
        roleChip: "Product Engineer",
        locationChip: "Europa (remote-freundlich)",
        availabilityChip: "Selektive Möglichkeiten",
        primaryCtaLabel: "Labs ansehen",
        secondaryCtaLabel: "Kontakt",
        statsHeading: "Auf einen Blick",
        featuredLabsHeading: "Ausgewählte Case Studies",
        skillsHeading: "Kernkompetenzen",
        roadmapHeading: "Roadmap",
        closingHeading: "Zuverlässige Systeme bauen",
        closingText: "Fülle Labs, Skills und Roadmap im Admin, um diese Seite mit Inhalten zu befüllen."
      }
    }
  },
  about: {
    id: "about",
    version: 1,
    updatedAt: now,
    locales: {
      en: {
        headline: "About",
        intro: "I bridge product strategy and engineering delivery with measurable outcomes.",
        summary:
          "This profile highlights architecture, delivery practices and measurable outcomes—ready to tailor in the admin.",
        location: "Europe",
        roleFocus: "Full-stack product engineering with platform and DevSecOps mindset",
        yearsExperience: "5+ years",
        coreCompetencies: ["Architecture", "Platform reliability", "Security by design", "Delivery systems"],
        strengths: ["Ownership", "Clarity", "Systemic thinking"],
        workingStyle: ["Iterative shipping", "Documentation first", "Metrics-driven improvements"],
        goals: ["Scale engineering impact", "Mentor teams", "Lead platform initiatives"]
      },
      de: {
        headline: "Über mich",
        intro: "Ich verbinde Produktstrategie und Engineering-Umsetzung mit messbaren Ergebnissen.",
        summary:
          "Dieses Profil betont Architektur, Delivery-Praktiken und messbare Ergebnisse—im Admin anpassbar.",
        location: "Europa",
        roleFocus: "Full-Stack Product Engineering mit Plattform- und DevSecOps-Mindset",
        yearsExperience: "5+ Jahre",
        coreCompetencies: ["Architektur", "Plattform-Zuverlässigkeit", "Security by Design", "Delivery-Systeme"],
        strengths: ["Ownership", "Klarheit", "Systemisches Denken"],
        workingStyle: ["Iteratives Liefern", "Dokumentation zuerst", "Metrikgetriebene Verbesserungen"],
        goals: ["Engineering-Wirkung skalieren", "Teams mentorieren", "Plattform-Initiativen führen"]
      }
    }
  },
  contact: {
    id: "contact",
    version: 1,
    updatedAt: now,
    email: "pedro@example.com",
    linkedin: "https://linkedin.com/in/pedro-example",
    github: "https://github.com/pedro-example",
    availability: "selective",
    locales: {
      en: {
        headline: "Contact",
        intro: "The fastest way to reach me is email.",
        location: "Remote / Europe",
        responseTime: "Usually within 24-48 hours",
        preferredChannel: "Email",
        primaryCtaLabel: "Send email"
      },
      de: {
        headline: "Kontakt",
        intro: "Am schnellsten erreichst du mich per E-Mail.",
        location: "Remote / Europa",
        responseTime: "In der Regel innerhalb von 24-48 Stunden",
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
        body: [
          "This demo portfolio stores content data for administrative editing.",
          "No personal tracking cookies are enabled by default in this sample setup."
        ]
      },
      de: {
        headline: "Datenschutz",
        body: [
          "Dieses Demo-Portfolio speichert Content-Daten für die administrative Bearbeitung.",
          "In diesem Beispiel sind standardmäßig keine personenbezogenen Tracking-Cookies aktiviert."
        ]
      }
    }
  },
  media,
  activity: [
    {
      id: "activity-seed-initial-empty",
      type: "create",
      collection: "system",
      targetId: "initial-empty-seed",
      message: `Initial empty seed loaded: ${skills.length} skills, ${labs.length} labs, ${certifications.length} certifications, ${roadmapPhases.length} phases, ${roadmapMilestones.length} milestones, ${media.length} media.`,
      createdAt: now
    }
  ]
};
