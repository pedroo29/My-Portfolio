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
