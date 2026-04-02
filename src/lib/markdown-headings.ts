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

const MEDIA_SPLIT_PATTERN = /(\{\{media:[^}]+\}\})/g;

function lineStartToSegment(lineStart: number, parts: string[]): number {
  let offset = 0;
  for (let i = 0; i < parts.length; i++) {
    const end = offset + parts[i].length;
    if (lineStart >= offset && lineStart < end) {
      return i;
    }
    offset = end;
  }
  return parts.length > 0 ? parts.length - 1 : 0;
}

/** IDs de encabezados agrupados por el mismo `split` que usa el renderer (tokens {{media:…}}). */
export function groupHeadingIdsByMediaSegments(
  content: string,
  maxLevel: 1 | 2 | 3 | 4 = 4
): string[][] {
  const parts = content.split(MEDIA_SPLIT_PATTERN);
  const queues: string[][] = parts.map(() => []);
  const allHeadings = extractMarkdownHeadings(content, maxLevel);
  let hi = 0;
  let inCodeFence = false;
  let offset = 0;

  for (const line of content.split("\n")) {
    const segIdx = lineStartToSegment(offset, parts);
    offset += line.length + 1;

    if (/^\{\{media:[^}]+\}\}\s*$/.test(line.trim())) {
      continue;
    }

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

    if (hi < allHeadings.length) {
      queues[segIdx].push(allHeadings[hi].id);
      hi += 1;
    }
  }

  return queues;
}
