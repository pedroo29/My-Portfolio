import type { Catalogs, CollectionKey, ContentStore, Locale } from "@/lib/types";

export type SelectOption = {
  value: string;
  label: string;
};

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "checkbox"
  | "date"
  | "select"
  | "stringArray"
  | "multiSelect"
  | "keyValueList";

export interface AdminField {
  label: string;
  path: string;
  type: FieldType;
  placeholder?: string;
  options?: ReadonlyArray<SelectOption>;
  optionsKey?: "tags" | "categories" | "providers" | "labs" | "skills" | "certifications" | "roadmapPhases" | "media";
  description?: string;
  /** Para `multiSelect`: casillas (por defecto) o selector + lista (mejor con muchas opciones). */
  multiSelectUi?: "checkbox" | "picker";
  /** Ocupa todo el ancho del grid del formulario (p. ej. orden dentro de fase). */
  fullWidth?: boolean;
  /** Solo `markdown`: UI compacta (labs — documentación + medios rápidos). */
  markdownUi?: "documentation";
  /** Solo `date`: permite vaciar la fecha (p. ej. hitos planificados sin día concreto). */
  allowEmpty?: boolean;
}

export interface AdminSection {
  title: string;
  description?: string;
  /** Resalta la sección en el formulario (p. ej. documentación del lab). */
  emphasis?: "primary";
  /** Una sola columna: campos a ancho completo apilados (p. ej. documentación EN debajo DE). */
  columnLayout?: "single";
  fields: ReadonlyArray<AdminField>;
}

export interface CollectionSchema {
  title: string;
  singular: string;
  sections: AdminSection[];
}

export const collectionSchemas: Record<CollectionKey, CollectionSchema> = {
  labs: {
    title: "Labs",
    singular: "Lab",
    sections: [
      {
        title: "Identity & publishing",
        description: "IDs, visibility and taxonomy — set these first so the lab appears correctly in listings.",
        fields: [
          { label: "ID", path: "id", type: "text" },
          { label: "Slug", path: "slug", type: "text" },
          {
            label: "Status",
            path: "status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" }
            ]
          },
          {
            label: "Category",
            path: "categoryId",
            type: "select",
            optionsKey: "categories"
          },
          {
            label: "Level",
            path: "level",
            type: "select",
            options: [
              { value: "foundational", label: "Foundational" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" }
            ]
          },
          {
            label: "State",
            path: "state",
            type: "select",
            options: [
              { value: "completed", label: "Completed" },
              { value: "in-progress", label: "In progress" },
              { value: "planned", label: "Planned" }
            ]
          },
          { label: "Date", path: "date", type: "date" },
          { label: "Top case study", path: "isTopCaseStudy", type: "checkbox" }
        ]
      },
      {
        title: "Public summary",
        description: "Short title and blurb for cards and the lab header — keep the long story in Documentation below.",
        fields: [
          { label: "EN Title", path: "locales.en.title", type: "text" },
          { label: "DE Title", path: "locales.de.title", type: "text" },
          { label: "EN Summary", path: "locales.en.summary", type: "textarea" },
          { label: "DE Summary", path: "locales.de.summary", type: "textarea" }
        ]
      },
      {
        title: "Documentation",
        emphasis: "primary",
        columnLayout: "single",
        description:
          "Main case-study body: narrative, screenshots and videos. Link media to this lab (upload or library), then click a thumbnail to insert an embed at the cursor.",
        fields: [
          {
            label: "EN Documentation",
            path: "locales.en.documentation",
            type: "markdown",
            markdownUi: "documentation",
            fullWidth: true
          },
          {
            label: "DE Documentation",
            path: "locales.de.documentation",
            type: "markdown",
            markdownUi: "documentation",
            fullWidth: true
          }
        ]
      },
      {
        title: "Case study details & relations",
        description: "Objectives, outcomes, stack, tags, skills and evidence — supporting material around the documentation.",
        fields: [
          { label: "Stack", path: "stack", type: "stringArray" },
          { label: "Tags", path: "tags", type: "multiSelect", optionsKey: "tags" },
          { label: "Linked skills", path: "skillIds", type: "multiSelect", optionsKey: "skills", multiSelectUi: "picker" },
          { label: "EN Objectives", path: "locales.en.objectives", type: "stringArray" },
          { label: "DE Objectives", path: "locales.de.objectives", type: "stringArray" },
          { label: "EN Results", path: "locales.en.results", type: "stringArray" },
          { label: "DE Results", path: "locales.de.results", type: "stringArray" },
          { label: "EN Lessons learned", path: "locales.en.lessonsLearned", type: "stringArray" },
          { label: "DE Lessons learned", path: "locales.de.lessonsLearned", type: "stringArray" },
          { label: "Evidence links (Label | URL)", path: "evidenceLinks", type: "keyValueList" },
          { label: "Metrics (Label | Value)", path: "metrics", type: "keyValueList" }
        ]
      }
    ]
  },
  skills: {
    title: "Skills",
    singular: "Skill",
    sections: [
      {
        title: "Core metadata",
        fields: [
          { label: "ID", path: "id", type: "text" },
          { label: "Slug", path: "slug", type: "text" },
          {
            label: "Status",
            path: "status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" }
            ]
          },
          {
            label: "Progress (%)",
            path: "progress",
            type: "number",
            description: "Level is auto-calculated on save: 0-39 Foundational, 40-69 Intermediate, 70-100 Advanced."
          }
        ]
      },
      {
        title: "Localized content",
        fields: [
          { label: "EN Name", path: "locales.en.name", type: "text" },
          { label: "DE Name", path: "locales.de.name", type: "text" },
          { label: "EN Summary", path: "locales.en.summary", type: "textarea" },
          { label: "DE Summary", path: "locales.de.summary", type: "textarea" }
        ]
      },
      {
        title: "Relations",
        fields: [
          { label: "Tags", path: "tags", type: "multiSelect", optionsKey: "tags" },
          {
            label: "Linked labs",
            path: "labIds",
            type: "multiSelect",
            optionsKey: "labs",
            multiSelectUi: "picker",
            description: "Add labs from the dropdown; use the filter when the list grows."
          }
        ]
      }
    ]
  },
  certifications: {
    title: "Certifications",
    singular: "Certification",
    sections: [
      {
        title: "Core metadata",
        fields: [
          { label: "ID", path: "id", type: "text" },
          { label: "Slug", path: "slug", type: "text" },
          {
            label: "Status",
            path: "status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" }
            ]
          },
          {
            label: "Provider",
            path: "providerId",
            type: "select",
            optionsKey: "providers"
          },
          {
            label: "State",
            path: "state",
            type: "select",
            options: [
              { value: "completed", label: "Completed" },
              { value: "in-progress", label: "In progress" },
              { value: "planned", label: "Planned" }
            ]
          },
          { label: "Relevant date", path: "relevantDate", type: "date" },
          { label: "Evidence link", path: "evidenceLink", type: "text" }
        ]
      },
      {
        title: "Localized content",
        fields: [
          { label: "EN Name", path: "locales.en.name", type: "text" },
          { label: "DE Name", path: "locales.de.name", type: "text" },
          { label: "EN Note", path: "locales.en.note", type: "textarea" },
          { label: "DE Note", path: "locales.de.note", type: "textarea" }
        ]
      },
      {
        title: "Tags",
        fields: [{ label: "Tags", path: "tags", type: "multiSelect", optionsKey: "tags" }]
      }
    ]
  },
  roadmapPhases: {
    title: "Roadmap phases",
    singular: "Phase",
    sections: [
      {
        title: "Core metadata",
        fields: [
          { label: "ID", path: "id", type: "text" },
          { label: "Slug", path: "slug", type: "text" },
          {
            label: "Status",
            path: "status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" }
            ]
          },
          { label: "Order", path: "order", type: "number" },
          {
            label: "State",
            path: "state",
            type: "select",
            options: [
              { value: "completed", label: "Completed" },
              { value: "active", label: "Active" },
              { value: "planned", label: "Planned" }
            ]
          }
        ]
      },
      {
        title: "Localized content",
        fields: [
          { label: "EN Title", path: "locales.en.title", type: "text" },
          { label: "DE Title", path: "locales.de.title", type: "text" },
          { label: "EN Summary", path: "locales.en.summary", type: "textarea" },
          { label: "DE Summary", path: "locales.de.summary", type: "textarea" }
        ]
      }
    ]
  },
  roadmapMilestones: {
    title: "Roadmap milestones",
    singular: "Milestone",
    sections: [
      {
        title: "Core metadata",
        fields: [
          { label: "ID", path: "id", type: "text" },
          { label: "Slug", path: "slug", type: "text" },
          {
            label: "Status",
            path: "status",
            type: "select",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" }
            ]
          },
          { label: "Phase", path: "phaseId", type: "select", optionsKey: "roadmapPhases" },
          {
            label: "Step order (within phase)",
            path: "order",
            type: "number",
            fullWidth: true,
            description: "Sequence inside this phase: 1 = first step, then 2, 3… Lower numbers appear first on the public roadmap."
          },
          {
            label: "State",
            path: "state",
            type: "select",
            options: [
              { value: "completed", label: "Completed" },
              { value: "active", label: "Active" },
              { value: "planned", label: "Planned" }
            ]
          },
          { label: "Priority", path: "priority", type: "select", options: [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }] },
          {
            label: "Start date",
            path: "startDate",
            type: "date",
            allowEmpty: true,
            description: "Leave as “Not set” when the start day is still unknown; you can set a date later."
          },
          {
            label: "End date",
            path: "endDate",
            type: "date",
            allowEmpty: true,
            description: "Leave as “Not set” when the end day is still unknown; you can set a date later."
          },
          { label: "Estimated effort", path: "estimatedEffort", type: "text" }
        ]
      },
      {
        title: "Localized content",
        fields: [
          { label: "EN Title", path: "locales.en.title", type: "text" },
          { label: "DE Title", path: "locales.de.title", type: "text" },
          { label: "EN Summary", path: "locales.en.summary", type: "textarea" },
          { label: "DE Summary", path: "locales.de.summary", type: "textarea" },
          { label: "EN Outcomes", path: "locales.en.outcomes", type: "stringArray" },
          { label: "DE Outcomes", path: "locales.de.outcomes", type: "stringArray" }
        ]
      },
      {
        title: "Relations",
        fields: [
          { label: "Tags", path: "tags", type: "multiSelect", optionsKey: "tags" },
          { label: "Evidence links (Label | URL)", path: "evidenceLinks", type: "keyValueList" },
          {
            label: "Labs",
            path: "labIds",
            type: "multiSelect",
            optionsKey: "labs",
            multiSelectUi: "picker",
            description: "Link evidence labs via the selector; filter helps with large catalogs."
          },
          { label: "Skills", path: "skillIds", type: "multiSelect", optionsKey: "skills" },
          { label: "Certifications", path: "certificationIds", type: "multiSelect", optionsKey: "certifications" }
        ]
      }
    ]
  }
};

export const globalSchemas = {
  home: {
    title: "Home content",
    sections: [
      {
        title: "English — hero & chips",
        description: "Main headline, supporting line and pill chips above the fold.",
        fields: [
          { label: "Hero title", path: "locales.en.heroTitle", type: "text" },
          { label: "Hero subtitle", path: "locales.en.heroSubtitle", type: "textarea" },
          { label: "Role chip", path: "locales.en.roleChip", type: "text" },
          { label: "Location chip", path: "locales.en.locationChip", type: "text" },
          { label: "Availability chip", path: "locales.en.availabilityChip", type: "text" },
          { label: "Primary CTA", path: "locales.en.primaryCtaLabel", type: "text" },
          { label: "Secondary CTA", path: "locales.en.secondaryCtaLabel", type: "text" },
          { label: "Stats block heading", path: "locales.en.statsHeading", type: "text" },
          { label: "Stats block subtitle", path: "locales.en.statsSubtitle", type: "text" }
        ]
      },
      {
        title: "English — KPI labels & availability sentence",
        description: "Use {{availability}} and {{channel}} in the availability line; they are replaced from Contact settings.",
        fields: [
          { label: "KPI label — Labs", path: "locales.en.kpiLabsLabel", type: "text" },
          { label: "KPI label — Certifications", path: "locales.en.kpiCertificationsLabel", type: "text" },
          { label: "KPI label — Skills", path: "locales.en.kpiSkillsLabel", type: "text" },
          {
            label: "Availability line template",
            path: "locales.en.availabilityLineTemplate",
            type: "textarea",
            description: "Placeholders: {{availability}} {{channel}}"
          }
        ]
      },
      {
        title: "English — sections, empty states, roadmap, closing",
        fields: [
          { label: "Featured labs — section title", path: "locales.en.featuredLabsHeading", type: "text" },
          { label: "Featured labs — description", path: "locales.en.featuredLabsDescription", type: "textarea" },
          { label: "Featured labs — empty title", path: "locales.en.featuredLabsEmptyTitle", type: "text" },
          { label: "Featured labs — empty description", path: "locales.en.featuredLabsEmptyDescription", type: "textarea" },
          { label: "Featured labs — empty CTA", path: "locales.en.featuredLabsEmptyCta", type: "text" },
          { label: "Skills — section title", path: "locales.en.skillsHeading", type: "text" },
          { label: "Skills — description", path: "locales.en.skillsDescription", type: "textarea" },
          { label: "Skills — empty title", path: "locales.en.skillsEmptyTitle", type: "text" },
          { label: "Skills — empty description", path: "locales.en.skillsEmptyDescription", type: "textarea" },
          { label: "Skills — empty CTA", path: "locales.en.skillsEmptyCta", type: "text" },
          { label: "Skills — view all button", path: "locales.en.skillsViewAll", type: "text" },
          { label: "Roadmap — section title", path: "locales.en.roadmapHeading", type: "text" },
          { label: "Roadmap — description", path: "locales.en.roadmapDescription", type: "textarea" },
          { label: "Roadmap — full roadmap button", path: "locales.en.roadmapViewFull", type: "text" },
          { label: "Roadmap — “current focus” label", path: "locales.en.roadmapCurrentFocusLabel", type: "text" },
          { label: "Roadmap — empty title", path: "locales.en.roadmapEmptyTitle", type: "text" },
          { label: "Roadmap — empty description", path: "locales.en.roadmapEmptyDescription", type: "textarea" },
          { label: "Closing — heading", path: "locales.en.closingHeading", type: "text" },
          { label: "Closing — text", path: "locales.en.closingText", type: "textarea" }
        ]
      },
      {
        title: "English — featured labs carousel (accessibility)",
        fields: [
          { label: "Carousel region label", path: "locales.en.carouselLabsRegion", type: "text" },
          { label: "Previous control", path: "locales.en.carouselLabsPrev", type: "text" },
          { label: "Next control", path: "locales.en.carouselLabsNext", type: "text" }
        ]
      },
      {
        title: "German — hero & chips",
        description: "Hauptüberschrift, Untertitel und Chips.",
        fields: [
          { label: "Hero title", path: "locales.de.heroTitle", type: "text" },
          { label: "Hero subtitle", path: "locales.de.heroSubtitle", type: "textarea" },
          { label: "Role chip", path: "locales.de.roleChip", type: "text" },
          { label: "Location chip", path: "locales.de.locationChip", type: "text" },
          { label: "Availability chip", path: "locales.de.availabilityChip", type: "text" },
          { label: "Primary CTA", path: "locales.de.primaryCtaLabel", type: "text" },
          { label: "Secondary CTA", path: "locales.de.secondaryCtaLabel", type: "text" },
          { label: "Stats block heading", path: "locales.de.statsHeading", type: "text" },
          { label: "Stats block subtitle", path: "locales.de.statsSubtitle", type: "text" }
        ]
      },
      {
        title: "German — KPI labels & availability sentence",
        description: "Platzhalter {{availability}} und {{channel}} (aus Kontakt).",
        fields: [
          { label: "KPI label — Labs", path: "locales.de.kpiLabsLabel", type: "text" },
          { label: "KPI label — Certifications", path: "locales.de.kpiCertificationsLabel", type: "text" },
          { label: "KPI label — Skills", path: "locales.de.kpiSkillsLabel", type: "text" },
          {
            label: "Availability line template",
            path: "locales.de.availabilityLineTemplate",
            type: "textarea",
            description: "Platzhalter: {{availability}} {{channel}}"
          }
        ]
      },
      {
        title: "German — sections, empty states, roadmap, closing",
        fields: [
          { label: "Featured labs — section title", path: "locales.de.featuredLabsHeading", type: "text" },
          { label: "Featured labs — description", path: "locales.de.featuredLabsDescription", type: "textarea" },
          { label: "Featured labs — empty title", path: "locales.de.featuredLabsEmptyTitle", type: "text" },
          { label: "Featured labs — empty description", path: "locales.de.featuredLabsEmptyDescription", type: "textarea" },
          { label: "Featured labs — empty CTA", path: "locales.de.featuredLabsEmptyCta", type: "text" },
          { label: "Skills — section title", path: "locales.de.skillsHeading", type: "text" },
          { label: "Skills — description", path: "locales.de.skillsDescription", type: "textarea" },
          { label: "Skills — empty title", path: "locales.de.skillsEmptyTitle", type: "text" },
          { label: "Skills — empty description", path: "locales.de.skillsEmptyDescription", type: "textarea" },
          { label: "Skills — empty CTA", path: "locales.de.skillsEmptyCta", type: "text" },
          { label: "Skills — view all button", path: "locales.de.skillsViewAll", type: "text" },
          { label: "Roadmap — section title", path: "locales.de.roadmapHeading", type: "text" },
          { label: "Roadmap — description", path: "locales.de.roadmapDescription", type: "textarea" },
          { label: "Roadmap — full roadmap button", path: "locales.de.roadmapViewFull", type: "text" },
          { label: "Roadmap — “current focus” label", path: "locales.de.roadmapCurrentFocusLabel", type: "text" },
          { label: "Roadmap — empty title", path: "locales.de.roadmapEmptyTitle", type: "text" },
          { label: "Roadmap — empty description", path: "locales.de.roadmapEmptyDescription", type: "textarea" },
          { label: "Closing — heading", path: "locales.de.closingHeading", type: "text" },
          { label: "Closing — text", path: "locales.de.closingText", type: "textarea" }
        ]
      },
      {
        title: "German — featured labs carousel (accessibility)",
        fields: [
          { label: "Carousel region label", path: "locales.de.carouselLabsRegion", type: "text" },
          { label: "Previous control", path: "locales.de.carouselLabsPrev", type: "text" },
          { label: "Next control", path: "locales.de.carouselLabsNext", type: "text" }
        ]
      }
    ]
  },
  skillsPage: {
    title: "Skills page copy",
    sections: [
      {
        title: "English — hero",
        fields: [
          { label: "Eyebrow", path: "locales.en.eyebrow", type: "text" },
          { label: "Title", path: "locales.en.title", type: "text" },
          { label: "Description", path: "locales.en.description", type: "textarea" }
        ]
      },
      {
        title: "English — matrix, filters, bento",
        fields: [
          { label: "Matrix title", path: "locales.en.matrixTitle", type: "text" },
          { label: "Matrix subtitle", path: "locales.en.matrixSubtitle", type: "textarea" },
          { label: "Filter — all", path: "locales.en.filterAll", type: "text" },
          { label: "Filter by tag label", path: "locales.en.filterByTag", type: "text" },
          { label: "View — matrix", path: "locales.en.viewMatrix", type: "text" },
          { label: "View — list", path: "locales.en.viewList", type: "text" },
          { label: "Labs linked (exactly 1)", path: "locales.en.labsLinkedOne", type: "text" },
          {
            label: "Labs linked (2+)",
            path: "locales.en.labsLinkedMany",
            type: "text",
            description: "Use {{n}} for the count."
          },
          { label: "Open skill CTA", path: "locales.en.openSkill", type: "text" },
          { label: "Bento section title", path: "locales.en.bentoTitle", type: "text" },
          { label: "Bento section subtitle", path: "locales.en.bentoSubtitle", type: "textarea" },
          { label: "Featured badge", path: "locales.en.featured", type: "text" },
          { label: "Empty — filtered", path: "locales.en.emptyFiltered", type: "text" },
          { label: "Empty — no published skills", path: "locales.en.emptyPublished", type: "text" }
        ]
      },
      {
        title: "German — hero",
        fields: [
          { label: "Eyebrow", path: "locales.de.eyebrow", type: "text" },
          { label: "Title", path: "locales.de.title", type: "text" },
          { label: "Description", path: "locales.de.description", type: "textarea" }
        ]
      },
      {
        title: "German — matrix, filters, bento",
        fields: [
          { label: "Matrix title", path: "locales.de.matrixTitle", type: "text" },
          { label: "Matrix subtitle", path: "locales.de.matrixSubtitle", type: "textarea" },
          { label: "Filter — all", path: "locales.de.filterAll", type: "text" },
          { label: "Filter by tag label", path: "locales.de.filterByTag", type: "text" },
          { label: "View — matrix", path: "locales.de.viewMatrix", type: "text" },
          { label: "View — list", path: "locales.de.viewList", type: "text" },
          { label: "Labs linked (exactly 1)", path: "locales.de.labsLinkedOne", type: "text" },
          {
            label: "Labs linked (2+)",
            path: "locales.de.labsLinkedMany",
            type: "text",
            description: "Platzhalter {{n}}."
          },
          { label: "Open skill CTA", path: "locales.de.openSkill", type: "text" },
          { label: "Bento section title", path: "locales.de.bentoTitle", type: "text" },
          { label: "Bento section subtitle", path: "locales.de.bentoSubtitle", type: "textarea" },
          { label: "Featured badge", path: "locales.de.featured", type: "text" },
          { label: "Empty — filtered", path: "locales.de.emptyFiltered", type: "text" },
          { label: "Empty — no published skills", path: "locales.de.emptyPublished", type: "text" }
        ]
      }
    ]
  },
  roadmapPage: {
    title: "Roadmap page copy",
    sections: [
      {
        title: "English — hero",
        fields: [
          { label: "Eyebrow", path: "locales.en.eyebrow", type: "text" },
          { label: "Title", path: "locales.en.title", type: "text" },
          { label: "Description", path: "locales.en.description", type: "textarea" }
        ]
      },
      {
        title: "English — story & phases",
        fields: [
          { label: "Phase label (prefix)", path: "locales.en.phaseLabel", type: "text" },
          { label: "Featured milestone badge", path: "locales.en.featuredBadge", type: "text" },
          { label: "Open milestone CTA", path: "locales.en.openMilestoneCta", type: "text" },
          { label: "Item count suffix", path: "locales.en.itemCountLabel", type: "text" },
          { label: "Empty roadmap", path: "locales.en.emptyRoadmap", type: "text" },
          { label: "Empty phase", path: "locales.en.emptyPhase", type: "text" }
        ]
      },
      {
        title: "English — phase minimap",
        fields: [
          { label: "Floating button", path: "locales.en.minimapButton", type: "text" },
          { label: "Panel title", path: "locales.en.minimapTitle", type: "text" },
          { label: "Close control", path: "locales.en.minimapClose", type: "text" },
          { label: "Nav aria label", path: "locales.en.minimapAriaNav", type: "text" }
        ]
      },
      {
        title: "German — hero",
        fields: [
          { label: "Eyebrow", path: "locales.de.eyebrow", type: "text" },
          { label: "Title", path: "locales.de.title", type: "text" },
          { label: "Description", path: "locales.de.description", type: "textarea" }
        ]
      },
      {
        title: "German — story & phases",
        fields: [
          { label: "Phase label (prefix)", path: "locales.de.phaseLabel", type: "text" },
          { label: "Featured milestone badge", path: "locales.de.featuredBadge", type: "text" },
          { label: "Open milestone CTA", path: "locales.de.openMilestoneCta", type: "text" },
          { label: "Item count suffix", path: "locales.de.itemCountLabel", type: "text" },
          { label: "Empty roadmap", path: "locales.de.emptyRoadmap", type: "text" },
          { label: "Empty phase", path: "locales.de.emptyPhase", type: "text" }
        ]
      },
      {
        title: "German — phase minimap",
        fields: [
          { label: "Floating button", path: "locales.de.minimapButton", type: "text" },
          { label: "Panel title", path: "locales.de.minimapTitle", type: "text" },
          { label: "Close control", path: "locales.de.minimapClose", type: "text" },
          { label: "Nav aria label", path: "locales.de.minimapAriaNav", type: "text" }
        ]
      }
    ]
  },
  certificationsPage: {
    title: "Certifications page copy",
    sections: [
      {
        title: "English — hero",
        fields: [
          { label: "Eyebrow", path: "locales.en.eyebrow", type: "text" },
          { label: "Title", path: "locales.en.title", type: "text" },
          { label: "Description", path: "locales.en.description", type: "textarea" }
        ]
      },
      {
        title: "English — KPIs & filters",
        fields: [
          { label: "KPI — completed", path: "locales.en.kpiCompleted", type: "text" },
          { label: "KPI — in progress", path: "locales.en.kpiInProgress", type: "text" },
          { label: "KPI — planned", path: "locales.en.kpiPlanned", type: "text" },
          { label: "Filter — provider", path: "locales.en.filterByProvider", type: "text" },
          { label: "Filter — state", path: "locales.en.filterByState", type: "text" },
          { label: "Filter — all", path: "locales.en.filterAll", type: "text" }
        ]
      },
      {
        title: "English — views & results",
        fields: [
          { label: "Layout label", path: "locales.en.viewLabel", type: "text" },
          { label: "Timeline view", path: "locales.en.viewTimeline", type: "text" },
          { label: "Browse view", path: "locales.en.viewBrowse", type: "text" },
          { label: "View toggle aria", path: "locales.en.viewToggleAria", type: "text" },
          { label: "Timeline section title", path: "locales.en.timelineTitle", type: "text" },
          { label: "Browse section title", path: "locales.en.browseTitle", type: "text" },
          { label: "Browse description", path: "locales.en.browseDescription", type: "textarea" },
          { label: "Result count (1)", path: "locales.en.resultCountOne", type: "text" },
          { label: "Result count (2+)", path: "locales.en.resultCountMany", type: "text", description: "{{n}}" },
          { label: "Date label (sr-only)", path: "locales.en.dateLabel", type: "text" },
          { label: "Empty title", path: "locales.en.emptyTitle", type: "text" },
          { label: "Empty description", path: "locales.en.emptyDescription", type: "textarea" }
        ]
      },
      {
        title: "English — state chips",
        fields: [
          { label: "State — completed", path: "locales.en.stateChipCompleted", type: "text" },
          { label: "State — in progress", path: "locales.en.stateChipInProgress", type: "text" },
          { label: "State — planned", path: "locales.en.stateChipPlanned", type: "text" }
        ]
      },
      {
        title: "German — hero",
        fields: [
          { label: "Eyebrow", path: "locales.de.eyebrow", type: "text" },
          { label: "Title", path: "locales.de.title", type: "text" },
          { label: "Description", path: "locales.de.description", type: "textarea" }
        ]
      },
      {
        title: "German — KPIs & filters",
        fields: [
          { label: "KPI — completed", path: "locales.de.kpiCompleted", type: "text" },
          { label: "KPI — in progress", path: "locales.de.kpiInProgress", type: "text" },
          { label: "KPI — planned", path: "locales.de.kpiPlanned", type: "text" },
          { label: "Filter — provider", path: "locales.de.filterByProvider", type: "text" },
          { label: "Filter — state", path: "locales.de.filterByState", type: "text" },
          { label: "Filter — all", path: "locales.de.filterAll", type: "text" }
        ]
      },
      {
        title: "German — views & results",
        fields: [
          { label: "Layout label", path: "locales.de.viewLabel", type: "text" },
          { label: "Timeline view", path: "locales.de.viewTimeline", type: "text" },
          { label: "Browse view", path: "locales.de.viewBrowse", type: "text" },
          { label: "View toggle aria", path: "locales.de.viewToggleAria", type: "text" },
          { label: "Timeline section title", path: "locales.de.timelineTitle", type: "text" },
          { label: "Browse section title", path: "locales.de.browseTitle", type: "text" },
          { label: "Browse description", path: "locales.de.browseDescription", type: "textarea" },
          { label: "Result count (1)", path: "locales.de.resultCountOne", type: "text" },
          { label: "Result count (2+)", path: "locales.de.resultCountMany", type: "text", description: "{{n}}" },
          { label: "Date label (sr-only)", path: "locales.de.dateLabel", type: "text" },
          { label: "Empty title", path: "locales.de.emptyTitle", type: "text" },
          { label: "Empty description", path: "locales.de.emptyDescription", type: "textarea" }
        ]
      },
      {
        title: "German — state chips",
        fields: [
          { label: "State — completed", path: "locales.de.stateChipCompleted", type: "text" },
          { label: "State — in progress", path: "locales.de.stateChipInProgress", type: "text" },
          { label: "State — planned", path: "locales.de.stateChipPlanned", type: "text" }
        ]
      }
    ]
  },
  about: {
    title: "About content",
    sections: [
      {
        title: "English",
        fields: [
          { label: "Headline", path: "locales.en.headline", type: "text" },
          { label: "Intro", path: "locales.en.intro", type: "textarea" },
          { label: "Summary", path: "locales.en.summary", type: "textarea" },
          { label: "Location", path: "locales.en.location", type: "text" },
          { label: "Role focus", path: "locales.en.roleFocus", type: "text" },
          { label: "Experience", path: "locales.en.yearsExperience", type: "text" },
          { label: "Core competencies", path: "locales.en.coreCompetencies", type: "stringArray" },
          { label: "Strengths", path: "locales.en.strengths", type: "stringArray" },
          { label: "Working style", path: "locales.en.workingStyle", type: "stringArray" },
          { label: "Goals", path: "locales.en.goals", type: "stringArray" }
        ]
      },
      {
        title: "German",
        fields: [
          { label: "Headline", path: "locales.de.headline", type: "text" },
          { label: "Intro", path: "locales.de.intro", type: "textarea" },
          { label: "Summary", path: "locales.de.summary", type: "textarea" },
          { label: "Location", path: "locales.de.location", type: "text" },
          { label: "Role focus", path: "locales.de.roleFocus", type: "text" },
          { label: "Experience", path: "locales.de.yearsExperience", type: "text" },
          { label: "Core competencies", path: "locales.de.coreCompetencies", type: "stringArray" },
          { label: "Strengths", path: "locales.de.strengths", type: "stringArray" },
          { label: "Working style", path: "locales.de.workingStyle", type: "stringArray" },
          { label: "Goals", path: "locales.de.goals", type: "stringArray" }
        ]
      }
    ]
  },
  contact: {
    title: "Contact content",
    sections: [
      {
        title: "Shared channels",
        fields: [
          { label: "Email", path: "email", type: "text" },
          { label: "LinkedIn", path: "linkedin", type: "text" },
          { label: "GitHub", path: "github", type: "text" },
          {
            label: "Availability",
            path: "availability",
            type: "select",
            options: [
              { value: "open", label: "Open" },
              { value: "selective", label: "Selective" },
              { value: "unavailable", label: "Unavailable" }
            ]
          }
        ]
      },
      {
        title: "English",
        fields: [
          { label: "Headline", path: "locales.en.headline", type: "text" },
          { label: "Intro", path: "locales.en.intro", type: "textarea" },
          { label: "Location", path: "locales.en.location", type: "text" },
          { label: "Response time", path: "locales.en.responseTime", type: "text" },
          { label: "Preferred channel", path: "locales.en.preferredChannel", type: "text" },
          { label: "Primary CTA", path: "locales.en.primaryCtaLabel", type: "text" }
        ]
      },
      {
        title: "German",
        fields: [
          { label: "Headline", path: "locales.de.headline", type: "text" },
          { label: "Intro", path: "locales.de.intro", type: "textarea" },
          { label: "Location", path: "locales.de.location", type: "text" },
          { label: "Response time", path: "locales.de.responseTime", type: "text" },
          { label: "Preferred channel", path: "locales.de.preferredChannel", type: "text" },
          { label: "Primary CTA", path: "locales.de.primaryCtaLabel", type: "text" }
        ]
      }
    ]
  },
  privacy: {
    title: "Privacy content",
    sections: [
      {
        title: "English",
        fields: [
          { label: "Headline", path: "locales.en.headline", type: "text" },
          { label: "Body paragraphs", path: "locales.en.body", type: "stringArray" }
        ]
      },
      {
        title: "German",
        fields: [
          { label: "Headline", path: "locales.de.headline", type: "text" },
          { label: "Body paragraphs", path: "locales.de.body", type: "stringArray" }
        ]
      }
    ]
  }
} as const;

export function getCatalogOptions(catalogs: Catalogs, locale: Locale) {
  return {
    categories: catalogs.categories.map((item) => ({ value: item.id, label: item.label[locale] })),
    providers: catalogs.providers.map((item) => ({ value: item.id, label: item.label[locale] })),
    tags: catalogs.tags.map((item) => ({ value: item.id, label: item.label[locale] }))
  };
}

export function createBaseSeo() {
  return {
    en: {
      title: "",
      description: ""
    },
    de: {
      title: "",
      description: ""
    }
  };
}

export function createBlankEntity(key: CollectionKey) {
  const timestamp = new Date().toISOString();

  if (key === "labs") {
    return {
      id: "",
      slug: "",
      status: "draft",
      version: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      seo: createBaseSeo(),
      categoryId: "",
      level: "foundational",
      state: "planned",
      stack: [],
      tags: [],
      date: timestamp.slice(0, 10),
      isTopCaseStudy: false,
      skillIds: [],
      mediaIds: [],
      evidenceLinks: [],
      metrics: [],
      locales: {
        en: { title: "", summary: "", documentation: "", objectives: [], results: [], lessonsLearned: [] },
        de: { title: "", summary: "", documentation: "", objectives: [], results: [], lessonsLearned: [] }
      }
    };
  }

  if (key === "skills") {
    return {
      id: "",
      slug: "",
      status: "draft",
      version: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      seo: createBaseSeo(),
      level: "foundational",
      progress: 0,
      tags: [],
      labIds: [],
      locales: {
        en: { name: "", summary: "" },
        de: { name: "", summary: "" }
      }
    };
  }

  if (key === "certifications") {
    return {
      id: "",
      slug: "",
      status: "draft",
      version: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      seo: createBaseSeo(),
      providerId: "",
      state: "planned",
      relevantDate: timestamp.slice(0, 10),
      tags: [],
      evidenceLink: "",
      locales: {
        en: { name: "", note: "" },
        de: { name: "", note: "" }
      }
    };
  }

  if (key === "roadmapPhases") {
    return {
      id: "",
      slug: "",
      status: "draft",
      version: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      seo: createBaseSeo(),
      order: 1,
      state: "planned",
      locales: {
        en: { title: "", summary: "" },
        de: { title: "", summary: "" }
      }
    };
  }

  if (key === "roadmapMilestones") {
    return {
      id: "",
      slug: "",
      status: "draft",
      version: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      seo: createBaseSeo(),
      phaseId: "",
      order: 1,
      state: "planned",
      startDate: "",
      endDate: "",
      estimatedEffort: "",
      priority: "medium",
      tags: [],
      evidenceLinks: [],
      labIds: [],
      skillIds: [],
      certificationIds: [],
      locales: {
        en: { title: "", summary: "", outcomes: [] },
        de: { title: "", summary: "", outcomes: [] }
      }
    };
  }

  throw new Error(`createBlankEntity: unsupported collection "${String(key)}"`);
}

export function createEmptyCatalogs(current: ContentStore["catalogs"]) {
  return current;
}
