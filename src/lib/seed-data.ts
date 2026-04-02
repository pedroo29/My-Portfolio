/**
 * Dataset de demostración / stress-test (miles de líneas). No lo importa el servidor en producción.
 * Uso: `npm run seed:store` escribe `data/runtime/store.json`. Para datos reales, restaura tu copia de `data/`.
 */
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

/** Superpoblación para stress-test (UI, markdown, filtros). Restaurar: copia previa de `data/runtime/`. */
const SKILL_COUNT = 54;
const LAB_COUNT = 48;
const CERT_COUNT = 24;
const PHASE_COUNT = 8;
const MILESTONE_COUNT = 40;
const MEDIA_COUNT = 16;

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

/** Documentación markdown extensa por lab (stress de TOC, renderer y lectura). */
function buildExtensiveLabDocumentation(n: number, locale: "en" | "de"): string {
  const focusIdx = n % 5;
  const focusEn = ["platform reliability", "secure delivery", "data and observability", "developer experience", "cost-aware scaling"][focusIdx];
  const focusDe = ["Plattform-Zuverlässigkeit", "sicheres Delivery", "Daten und Observability", "Developer Experience", "kostenbewusstes Skalieren"][focusIdx];

  if (locale === "en") {
    return [
      `# Lab ${pad(n)} — ${focusEn}`,
      "",
      "## Executive summary",
      `This case study documents scenario **${n}**: a hands-on engagement focused on **${focusEn}**. The work combined architecture decisions, incremental rollout, and measurable validation so stakeholders could trace impact from design through production behaviour.`,
      "",
      "## Problem statement",
      `The organisation needed a repeatable way to ship changes without regressions in scenario ${n}. Constraints included limited change windows, mixed legacy dependencies, and the need for clear evidence that new controls actually reduced operational risk rather than only adding process.`,
      "",
      "## Scope and non-goals",
      `- **In scope:** reference implementation, automation hooks, dashboards, and a concise operational runbook.`,
      `- **Out of scope:** full organisational process redesign, vendor migrations, and long-term licensing negotiations.`,
      "",
      "## Context diagram (narrative)",
      `Traffic flows through an edge layer into application services backed by persistent storage and async workers. For lab ${n}, we treated the edge as the primary enforcement point for authentication metadata and rate limits, while keeping domain logic isolated behind explicit contracts.`,
      "",
      "## Architecture decisions",
      "### ADR-1: Contract-first interfaces",
      `We defined stable JSON schemas for the public API surface and generated types for both server and client. This reduced drift between environments and made contract tests a first-class gate in CI.`,
      "",
      "### ADR-2: Progressive rollout",
      `Feature flags guarded behavioural changes. We rolled out to an internal cohort, then a percentage of production traffic, with automatic rollback on error-budget burn.`,
      "",
      "## Implementation notes",
      `The implementation emphasised small, reviewable changes. Each merge request included: migration plan (if any), observability deltas, and a rollback checklist. Below is a representative pattern used for guarded handlers:`,
      "",
      "```typescript",
      "export async function withGuards<T>(ctx: RequestContext, run: () => Promise<T>): Promise<T> {",
      "  await assertRateLimit(ctx);",
      "  await assertAuth(ctx);",
      "  return run();",
      "}",
      "```",
      "",
      "## Validation strategy",
      `We combined synthetic probes, canary metrics, and structured logs. The table summarises signals monitored during the final rollout window for lab ${n}.`,
      "",
      "| Signal | Source | Threshold |",
      "|--------|--------|-----------|",
      "| p95 latency | Gateway | ≤ baseline + 15% |",
      "| Error rate | App + edge | ≤ 0.5% |",
      "| Saturation | Workers | ≤ 70% sustained |",
      "",
      "## Results",
      `- Met reliability targets for the pilot window.`,
      `- Reduced mean time to detect (MTTD) for the instrumented failure modes.`,
      `- Documented residual risks and owners for the next quarter.`,
      "",
      "## Lessons learned",
      `Automation without ownership decays quickly. Pairing dashboards with named on-call rotations and quarterly review of SLOs kept the system honest. For scenario ${n}, the biggest win was aligning product and platform language around the same success metrics.`,
      "",
      "## Next steps",
      `Harden the runbook with playbooks for dependency failure, expand contract tests to cover edge cases discovered in staging, and schedule a follow-up review after the next major dependency upgrade.`,
      "",
      "## Appendix",
      `- Evidence links and runbooks live alongside this lab entry.`,
      `- Version: seed lab ${n} — generated for portfolio stress testing.`
    ].join("\n");
  }

  return [
    `# Lab ${pad(n)} — ${focusDe}`,
    "",
    "## Kurzfassung",
    `Diese Fallstudie beschreibt Szenario **${n}** mit Schwerpunkt **${focusDe}**. Ziel war es, Architekturentscheidungen, schrittweises Rollout und messbare Validierung so zu dokumentieren, dass Wirkung von der Konzeption bis zum Produktionsverhalten nachvollziehbar bleibt.`,
    "",
    "## Problemstellung",
    `Die Organisation brauchte einen wiederholbaren Weg, Änderungen in Szenario ${n} ohne Regressionen auszuliefern. Rahmenbedingungen: begrenzte Wartungsfenster, gemischte Legacy-Abhängigkeiten und der Bedarf an belastbaren Nachweisen, dass neue Kontrollen das Betriebsrisiko senken.`,
    "",
    "## Umfang und Nicht-Ziele",
    `- **Im Umfang:** Referenzimplementierung, Automatisierung, Dashboards, kompaktes Runbook.`,
    `- **Nicht im Umfang:** vollständige Prozessreorganisation, Vendor-Migrationen, langfristige Lizenzverhandlungen.`,
    "",
    "## Kontext (beschreibend)",
    `Der Datenfluss läuft über eine Edge-Schicht zu Anwendungsdiensten mit Persistenz und asynchronen Workern. Für Lab ${n} setzten wir die Edge als primären Punkt für Authentifizierungsmetadaten und Rate-Limits ein, während Fachlogik hinter expliziten Schnittstellen gekapselt bleibt.`,
    "",
    "## Architekturentscheidungen",
    "### ADR-1: Contract-first",
    `Stabile JSON-Schemas für die öffentliche API und generierte Typen für Server und Client reduzierten Drift zwischen Umgebungen; Vertragstests wurden zum CI-Gate.`,
    "",
    "### ADR-2: Progressives Rollout",
    `Feature-Flags schützten Verhaltensänderungen: interne Kohorte, dann Anteil am Produktivtraffic, mit automatischem Rollback bei Error-Budget-Verbrauch.`,
    "",
    "## Umsetzung",
    `Kleine, reviewbare Änderungen; jedes Merge-Request enthielt Migrationsplan (falls nötig), Observability-Deltas und Rollback-Checkliste. Beispielmuster:`,
    "",
    "```typescript",
    "export async function withGuards<T>(ctx: RequestContext, run: () => Promise<T>): Promise<T> {",
    "  await assertRateLimit(ctx);",
    "  await assertAuth(ctx);",
    "  return run();",
    "}",
    "```",
    "",
    "## Validierung",
    `Kombination aus synthetischen Probes, Canary-Metriken und strukturierten Logs. Übersicht für das finale Rollout-Fenster von Lab ${n}:`,
    "",
    "| Signal | Quelle | Schwellwert |",
    "|--------|--------|-------------|",
    "| p95 Latenz | Gateway | ≤ Basis + 15 % |",
    "| Fehlerrate | App + Edge | ≤ 0,5 % |",
    "| Auslastung | Worker | ≤ 70 % dauerhaft |",
    "",
    "## Ergebnisse",
    `- Zuverlässigkeitsziele im Pilotfenster erreicht.`,
    `- MTTD für instrumentierte Fehlerbilder verbessert.`,
    `- Restrisiken und Verantwortliche fürs nächste Quartal dokumentiert.`,
    "",
    "## Learnings",
    `Automatisierung ohne Ownership verfällt schnell. Dashboards mit klarer On-Call-Rotation und quartalsweiser SLO-Review hielten das System ehrlich. Der größte Gewinn in Szenario ${n}: gemeinsame Erfolgsmetriken für Produkt und Plattform.`,
    "",
    "## Nächste Schritte",
    `Runbook um Playbooks für Abhängigkeitsausfälle erweitern, Vertragstests um Staging-Edge-Cases ergänzen, Review nach dem nächsten Major-Upgrade planen.`,
    "",
    "## Anhang",
    `- Belege und Runbooks sind mit dem Lab-Eintrag verknüpft.`,
    `- Version: Seed-Lab ${n} — generiert für Portfolio-Stresstests.`
  ].join("\n");
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
        documentation: buildExtensiveLabDocumentation(n, "en"),
        objectives: [`Define scope ${n}`, `Ship implementation ${n}`, `Measure impact ${n}`],
        results: [`Deployed scenario ${n}`, `Observed baseline metrics ${n}`],
        lessonsLearned: [`Iteration ${n} improved clarity`, `Automation reduced friction in scenario ${n}`]
      },
      de: {
        title: `Lab ${pad(n)} — Plattform-Experiment`,
        summary: `Praktisches Delivery-Szenario ${n} mit Architektur-, Umsetzungs- und Validierungsergebnissen.`,
        documentation: buildExtensiveLabDocumentation(n, "de"),
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
        heroTitle: "Pedro — High-volume demo portfolio",
        heroSubtitle: "Massive seeded dataset to stress-test UI, markdown docs, filters and editorial workflows.",
        roleChip: "Product Engineer",
        locationChip: "Europe (remote-friendly)",
        availabilityChip: "Selective opportunities",
        primaryCtaLabel: "View labs",
        secondaryCtaLabel: "Contact",
        statsHeading: "At a glance",
        statsSubtitle: "Professional signal, structured proof",
        kpiLabsLabel: "Labs",
        kpiCertificationsLabel: "Certifications",
        kpiSkillsLabel: "Skills",
        availabilityLineTemplate: "Availability: {{availability}}. Preferred contact: {{channel}}.",
        featuredLabsHeading: "Featured case studies",
        featuredLabsDescription: "Evidence-led work that shows execution, context and what was learned.",
        featuredLabsEmptyTitle: "No featured case studies yet",
        featuredLabsEmptyDescription: "Mark labs as top case studies in the admin, or browse the full labs list.",
        featuredLabsEmptyCta: "View all labs",
        skillsHeading: "Core skills",
        skillsDescription:
          "Preview of the strongest signals by progress — each skill links to labs as evidence. Open the full capability map for the complete matrix.",
        skillsEmptyTitle: "No skills yet",
        skillsEmptyDescription: "Add skills in the admin panel.",
        skillsEmptyCta: "View skills",
        skillsViewAll: "View all skills",
        roadmapHeading: "Roadmap",
        roadmapDescription: "A visible trajectory that connects learning, delivery and formal validation.",
        roadmapViewFull: "Full roadmap",
        roadmapCurrentFocusLabel: "Current focus",
        roadmapEmptyTitle: "No active milestone",
        roadmapEmptyDescription:
          "There is no active milestone in any phase right now. Open the roadmap for the full timeline.",
        closingHeading: "Build reliable systems",
        closingText: "This dataset is intentionally dense so labs, skills and roadmap views can be validated under heavy content volume.",
        carouselLabsRegion: "Featured case studies carousel",
        carouselLabsPrev: "Previous case studies",
        carouselLabsNext: "Next case studies"
      },
      de: {
        heroTitle: "Pedro — High-Volume-Demo-Portfolio",
        heroSubtitle: "Massiver Seed-Datensatz zum Stresstest von UI, Markdown-Dokumentation, Filtern und Redaktions-Workflows.",
        roleChip: "Product Engineer",
        locationChip: "Europa (remote-freundlich)",
        availabilityChip: "Selektive Möglichkeiten",
        primaryCtaLabel: "Labs ansehen",
        secondaryCtaLabel: "Kontakt",
        statsHeading: "Auf einen Blick",
        statsSubtitle: "Profisignal, strukturierte Belege",
        kpiLabsLabel: "Labs",
        kpiCertificationsLabel: "Zertifizierungen",
        kpiSkillsLabel: "Skills",
        availabilityLineTemplate: "Verfügbarkeit: {{availability}}. Bevorzugter Kontakt: {{channel}}.",
        featuredLabsHeading: "Ausgewählte Case Studies",
        featuredLabsDescription: "Evidenzbasierte Arbeit mit Kontext, Umsetzung und Learnings.",
        featuredLabsEmptyTitle: "Keine hervorgehobenen Case Studies",
        featuredLabsEmptyDescription:
          "Markiere Labs als Top Case Study im Admin oder besuche die vollständige Labs-Übersicht.",
        featuredLabsEmptyCta: "Alle Labs",
        skillsHeading: "Kernkompetenzen",
        skillsDescription:
          "Vorschau der stärksten Signale nach Fortschritt — jede Skill verweist auf Labs als Beleg. Die vollständige Matrix findest du unter Skills.",
        skillsEmptyTitle: "Noch keine Skills",
        skillsEmptyDescription: "Skills im Admin anlegen.",
        skillsEmptyCta: "Zu Skills",
        skillsViewAll: "Alle Skills",
        roadmapHeading: "Roadmap",
        roadmapDescription: "Ein sichtbarer Pfad aus Lernen, Delivery und formaler Validierung.",
        roadmapViewFull: "Vollständige Roadmap",
        roadmapCurrentFocusLabel: "Aktueller Fokus",
        roadmapEmptyTitle: "Kein aktiver Meilenstein",
        roadmapEmptyDescription:
          "Aktuell gibt es keinen aktiven Meilenstein in einer Phase. Unter Roadmap siehst du die vollständige Übersicht.",
        closingHeading: "Zuverlässige Systeme bauen",
        closingText: "Dieser Datensatz ist bewusst dicht, damit Labs-, Skills- und Roadmap-Ansichten unter hoher Content-Last geprüft werden können.",
        carouselLabsRegion: "Karussell mit ausgewählten Case Studies",
        carouselLabsPrev: "Vorherige Case Studies",
        carouselLabsNext: "Weitere Case Studies"
      }
    }
  },
  skillsPage: {
    id: "skillsPage",
    version: 1,
    updatedAt: now,
    locales: {
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
    }
  },
  roadmapPage: {
    id: "roadmapPage",
    version: 1,
    updatedAt: now,
    locales: {
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
    }
  },
  certificationsPage: {
    id: "certificationsPage",
    version: 1,
    updatedAt: now,
    locales: {
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
          "This super-seeded profile demonstrates scalability in content modeling, long-form lab documentation, and editorial operations under dense datasets.",
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
          "Dieses super-seeded Profil zeigt Skalierbarkeit bei Content-Modellierung, langen Lab-Dokumenten und redaktionellen Abläufen unter hoher Datendichte.",
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
      id: "activity-seed-superpopulated",
      type: "create",
      collection: "system",
      targetId: "super-seed",
      message: `Super-seed loaded: ${skills.length} skills, ${labs.length} labs, ${certifications.length} certifications, ${roadmapPhases.length} phases, ${roadmapMilestones.length} milestones, ${media.length} media.`,
      createdAt: now
    }
  ]
};
