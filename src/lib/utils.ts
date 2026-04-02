import { defaultLocale } from "@/lib/constants";
import type { CollectionOption, Locale } from "@/lib/types";

export function cn(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

export function formatDate(value?: string) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinLines(value: string[]) {
  return value.join("\n");
}

export function safeLocale(locale: string): Locale {
  return locale === "de" ? "de" : defaultLocale;
}

export function pickLocalized<T>(value: Record<Locale, T>, locale: Locale) {
  return value[locale] ?? value[defaultLocale];
}

export function makeOption(id: string, label: string, secondary?: string): CollectionOption {
  return { value: id, label, secondary };
}

export function toPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}

const localePrefixedPaths = new Set(["skills", "labs", "certifications", "roadmap", "about", "contact", "privacy"]);

/**
 * Normaliza URLs de evidence links del admin: vacías → null; rutas internas `/skills/...` sin `[locale]` → `/${locale}/...`;
 * dominios sin esquema → `https://...`; `mailto:` / `tel:` sin cambios.
 */
export function resolveEvidenceHref(url: string, locale: Locale): string | null {
  const t = url.trim();
  if (!t) return null;
  if (/^(mailto:|tel:)/i.test(t)) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith("//")) return `https:${t}`;
  if (t.startsWith("/")) {
    const parts = t.split("/").filter(Boolean);
    if (parts[0] === locale) return t;
    if (parts[0] && localePrefixedPaths.has(parts[0])) {
      return `/${locale}${t}`;
    }
    return t;
  }
  if (/^[a-z][\w+.-]*:/i.test(t)) return t;
  if (/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(t)) {
    return `https://${t}`;
  }
  return t;
}

export function isExternalHttpHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}
