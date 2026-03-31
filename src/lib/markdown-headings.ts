export interface MarkdownHeading {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4;
}

function stripInlineMarkdown(input: string) {
  return input
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .trim();
}

export function slugifyHeading(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMarkdownHeadings(markdown: string, maxLevel: 1 | 2 | 3 | 4 = 3): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const slugCount = new Map<string, number>();
  let inCodeFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) continue;

    const match = line.match(/^(#{1,4})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const level = match[1].length as 1 | 2 | 3 | 4;
    if (level > maxLevel) continue;

    const rawText = stripInlineMarkdown(match[2]);
    if (!rawText) continue;

    const base = slugifyHeading(rawText) || "section";
    const seen = slugCount.get(base) ?? 0;
    slugCount.set(base, seen + 1);
    const id = seen === 0 ? base : `${base}-${seen + 1}`;

    headings.push({ id, text: rawText, level });
  }

  return headings;
}
