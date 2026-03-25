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
}

export interface AdminSection {
  title: string;
  description?: string;
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
        title: "Structured content",
        fields: [
          { label: "EN Title", path: "locales.en.title", type: "text" },
          { label: "DE Title", path: "locales.de.title", type: "text" },
          { label: "EN Summary", path: "locales.en.summary", type: "textarea" },
          { label: "DE Summary", path: "locales.de.summary", type: "textarea" },
          { label: "EN Documentation", path: "locales.en.documentation", type: "markdown" },
          { label: "DE Documentation", path: "locales.de.documentation", type: "markdown" }
        ]
      },
      {
        title: "Lists and relations",
        fields: [
          { label: "Stack", path: "stack", type: "stringArray" },
          { label: "Tags", path: "tags", type: "multiSelect", optionsKey: "tags" },
          { label: "Linked skills", path: "skillIds", type: "multiSelect", optionsKey: "skills" },
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
            label: "Level",
            path: "level",
            type: "select",
            options: [
              { value: "foundational", label: "Foundational" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" }
            ]
          },
          { label: "Progress", path: "progress", type: "number" }
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
          { label: "Start date", path: "startDate", type: "date" },
          { label: "End date", path: "endDate", type: "date" },
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
        title: "English content",
        fields: [
          { label: "Hero title", path: "locales.en.heroTitle", type: "text" },
          { label: "Hero subtitle", path: "locales.en.heroSubtitle", type: "textarea" },
          { label: "Role chip", path: "locales.en.roleChip", type: "text" },
          { label: "Location chip", path: "locales.en.locationChip", type: "text" },
          { label: "Availability chip", path: "locales.en.availabilityChip", type: "text" },
          { label: "Primary CTA", path: "locales.en.primaryCtaLabel", type: "text" },
          { label: "Secondary CTA", path: "locales.en.secondaryCtaLabel", type: "text" }
        ]
      },
      {
        title: "German content",
        fields: [
          { label: "Hero title", path: "locales.de.heroTitle", type: "text" },
          { label: "Hero subtitle", path: "locales.de.heroSubtitle", type: "textarea" },
          { label: "Role chip", path: "locales.de.roleChip", type: "text" },
          { label: "Location chip", path: "locales.de.locationChip", type: "text" },
          { label: "Availability chip", path: "locales.de.availabilityChip", type: "text" },
          { label: "Primary CTA", path: "locales.de.primaryCtaLabel", type: "text" },
          { label: "Secondary CTA", path: "locales.de.secondaryCtaLabel", type: "text" }
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
      startDate: timestamp.slice(0, 10),
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
