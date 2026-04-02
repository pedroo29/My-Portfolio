import "server-only";

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { buildBootstrapContentStore } from "@/lib/content-defaults";
import type {
  ActivityEvent,
  CollectionKey,
  ContentStore,
  GlobalContent,
  HealthStatus,
  Lab,
  LabLevel,
  MediaAsset,
  Skill
} from "@/lib/types";
import { slugify } from "@/lib/utils";

const runtimeDirectory = path.join(process.cwd(), "data", "runtime");
const mediaDirectory = path.join(runtimeDirectory, "media");
const storeFilePath = path.join(runtimeDirectory, "store.json");

async function ensureRuntime() {
  await mkdir(runtimeDirectory, { recursive: true });
  await mkdir(mediaDirectory, { recursive: true });
}

async function writeStore(store: ContentStore) {
  await ensureRuntime();
  await writeFile(storeFilePath, JSON.stringify(store, null, 2), "utf-8");
}

function withDefaultPageSlices(store: ContentStore): ContentStore {
  const boot = buildBootstrapContentStore();
  return {
    ...store,
    skillsPage: store.skillsPage ?? structuredClone(boot.skillsPage),
    roadmapPage: store.roadmapPage ?? structuredClone(boot.roadmapPage),
    certificationsPage: store.certificationsPage ?? structuredClone(boot.certificationsPage)
  };
}

export async function readStore(): Promise<ContentStore> {
  await ensureRuntime();

  try {
    const raw = await readFile(storeFilePath, "utf-8");
    return withDefaultPageSlices(JSON.parse(raw) as ContentStore);
  } catch {
    const initial = buildBootstrapContentStore();
    await writeStore(initial);
    return structuredClone(initial);
  }
}

function createActivityEvent(collection: string, targetId: string, type: ActivityEvent["type"], message: string): ActivityEvent {
  return {
    id: `${collection}-${targetId}-${Date.now()}`,
    collection,
    targetId,
    type,
    message,
    createdAt: new Date().toISOString()
  };
}

function pickSkillLevelFromProgress(progress: number): LabLevel {
  if (progress >= 70) {
    return "advanced";
  }
  if (progress >= 40) {
    return "intermediate";
  }
  return "foundational";
}

function normalizeSkillEntity<T extends { progress?: unknown; level?: LabLevel }>(
  key: CollectionKey,
  entity: T
): T {
  if (key !== "skills") {
    return entity;
  }
  const rawProgress = typeof entity.progress === "number" ? entity.progress : Number(entity.progress);
  const safeProgress = Number.isFinite(rawProgress) ? Math.max(0, Math.min(100, Math.round(rawProgress))) : 0;
  return {
    ...entity,
    progress: safeProgress,
    level: pickSkillLevelFromProgress(safeProgress)
  };
}

function bumpEntityVersion<T extends { version: number; updatedAt: string }>(row: T) {
  row.version += 1;
  row.updatedAt = new Date().toISOString();
}

/** Mantiene `skill.labIds` alineado con `lab.skillIds` (un solo write al store). */
function syncLabToSkills(store: ContentStore, labId: string, previousSkillIds: string[], nextSkillIds: string[]) {
  const prev = new Set(previousSkillIds);
  const next = new Set(nextSkillIds);

  for (const sid of prev) {
    if (next.has(sid)) continue;
    const skill = store.skills.find((s) => s.id === sid);
    if (!skill) continue;
    if (skill.labIds.includes(labId)) {
      skill.labIds = skill.labIds.filter((id) => id !== labId);
      bumpEntityVersion(skill);
    }
  }

  for (const sid of next) {
    const skill = store.skills.find((s) => s.id === sid);
    if (!skill) continue;
    if (!skill.labIds.includes(labId)) {
      skill.labIds = [...skill.labIds, labId];
      bumpEntityVersion(skill);
    }
  }
}

/** Mantiene `lab.skillIds` alineado con `skill.labIds`. */
function syncSkillToLabs(store: ContentStore, skillId: string, previousLabIds: string[], nextLabIds: string[]) {
  const prev = new Set(previousLabIds);
  const next = new Set(nextLabIds);

  for (const lid of prev) {
    if (next.has(lid)) continue;
    const lab = store.labs.find((l) => l.id === lid);
    if (!lab) continue;
    if (lab.skillIds.includes(skillId)) {
      lab.skillIds = lab.skillIds.filter((id) => id !== skillId);
      bumpEntityVersion(lab);
    }
  }

  for (const lid of next) {
    const lab = store.labs.find((l) => l.id === lid);
    if (!lab) continue;
    if (!lab.skillIds.includes(skillId)) {
      lab.skillIds = [...lab.skillIds, skillId];
      bumpEntityVersion(lab);
    }
  }
}

function removeLabFromAllSkills(store: ContentStore, labId: string) {
  for (const skill of store.skills) {
    if (!skill.labIds.includes(labId)) continue;
    skill.labIds = skill.labIds.filter((id) => id !== labId);
    bumpEntityVersion(skill);
  }
}

function removeSkillFromAllLabs(store: ContentStore, skillId: string) {
  for (const lab of store.labs) {
    if (!lab.skillIds.includes(skillId)) continue;
    lab.skillIds = lab.skillIds.filter((id) => id !== skillId);
    bumpEntityVersion(lab);
  }
}

export async function listCollection<T>(key: CollectionKey): Promise<T[]> {
  const store = await readStore();
  return store[key] as unknown as T[];
}

export async function getSingle<
  T extends keyof Pick<
    ContentStore,
    "home" | "skillsPage" | "roadmapPage" | "certificationsPage" | "about" | "contact" | "privacy" | "catalogs"
  >
>(key: T): Promise<ContentStore[T]> {
  const store = await readStore();
  return store[key];
}

export async function getEntityById<T extends { id: string }>(key: CollectionKey, id: string): Promise<T | undefined> {
  const store = await readStore();
  return (store[key] as unknown as T[]).find((item) => item.id === id);
}

export async function getEntityBySlug<T extends { slug: string }>(key: CollectionKey, slug: string): Promise<T | undefined> {
  const store = await readStore();
  return (store[key] as unknown as T[]).find((item) => item.slug === slug);
}

export async function saveCollectionEntity<T extends { id?: string; slug?: string; version?: number; updatedAt?: string }>(
  key: CollectionKey,
  entity: T,
  expectedVersion: number
) {
  const store = await readStore();
  const collection = [...(store[key] as unknown as T[])];
  const normalizedEntity = normalizeSkillEntity(key, entity as T & { progress?: unknown; level?: LabLevel }) as T;
  const safeEntity = {
    ...normalizedEntity,
    id: normalizedEntity.id || `${key}-${Date.now()}`,
    slug:
      "slug" in normalizedEntity && typeof normalizedEntity.slug === "string" && normalizedEntity.slug
        ? normalizedEntity.slug
        : slugify(
            (normalizedEntity as { locales?: { en?: { title?: string; name?: string } } }).locales?.en?.title ??
              (normalizedEntity as { locales?: { en?: { title?: string; name?: string } } }).locales?.en?.name ??
              `${key}-${Date.now()}`
          )
  } as T & { id: string; slug: string };

  const persisted: typeof safeEntity =
    key === "roadmapMilestones" || key === "skills"
      ? { ...safeEntity, slug: slugify(safeEntity.slug) }
      : safeEntity;

  const index = collection.findIndex((item) => item.id === persisted.id);

  let previousLabSkillIds: string[] = [];
  let previousSkillLabIds: string[] = [];

  if (index >= 0) {
    const current = collection[index];
    if (key === "labs") {
      previousLabSkillIds = [...(((current as unknown) as Lab).skillIds ?? [])];
    }
    if (key === "skills") {
      previousSkillLabIds = [...(((current as unknown) as Skill).labIds ?? [])];
    }
    if (current.version !== expectedVersion) {
      return {
        ok: false as const,
        conflict: true as const,
        current
      };
    }

    collection[index] = {
        ...persisted,
      version: current.version + 1,
      updatedAt: new Date().toISOString()
    };
  } else {
    collection.unshift({
      ...persisted,
      version: 1,
      updatedAt: new Date().toISOString()
    });
  }

  ((store as unknown) as Record<string, unknown>)[key] = collection;

  if (key === "labs") {
    const savedLab = collection[index >= 0 ? index : 0] as unknown as Lab;
    syncLabToSkills(store, savedLab.id, previousLabSkillIds, savedLab.skillIds ?? []);
  }
  if (key === "skills") {
    const savedSkill = collection[index >= 0 ? index : 0] as unknown as Skill;
    syncSkillToLabs(store, savedSkill.id, previousSkillLabIds, savedSkill.labIds ?? []);
  }

  store.activity = [
    createActivityEvent(
      key,
      persisted.id,
      index >= 0 ? "update" : "create",
      `${index >= 0 ? "Updated" : "Created"} ${key} entry ${persisted.id}.`
    ),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);

  return {
    ok: true as const,
    data: collection[index >= 0 ? index : 0]
  };
}

export async function deleteCollectionEntity(key: CollectionKey, id: string) {
  const store = await readStore();
  if (key === "labs") {
    removeLabFromAllSkills(store, id);
  }
  if (key === "skills") {
    removeSkillFromAllLabs(store, id);
  }
  ((store as unknown) as Record<string, unknown>)[key] = (store[key] as Array<{ id: string }>).filter((item) => item.id !== id);
  store.activity = [
    createActivityEvent(key, id, "delete", `Deleted ${key} entry ${id}.`),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);
}

export async function duplicateCollectionEntity<T extends { id: string; slug: string; version: number; createdAt: string; updatedAt: string }>(
  key: CollectionKey,
  id: string
) {
  const store = await readStore();
  const collection = store[key] as unknown as T[];
  const source = collection.find((item) => item.id === id);

  if (!source) {
    return;
  }

  const duplicated = {
    ...source,
    id: `${source.id}-copy-${Date.now()}`,
    slug: `${source.slug}-copy`,
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  ((store as unknown) as Record<string, unknown>)[key] = [duplicated, ...collection];

  if (key === "labs") {
    const lab = duplicated as unknown as Lab;
    syncLabToSkills(store, lab.id, [], lab.skillIds ?? []);
  }
  if (key === "skills") {
    const skill = duplicated as unknown as Skill;
    syncSkillToLabs(store, skill.id, [], skill.labIds ?? []);
  }

  store.activity = [
    createActivityEvent(key, duplicated.id, "create", `Duplicated ${key} entry from ${id}.`),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);
}

export async function saveGlobalResource<T extends Partial<GlobalContent<unknown>> & { id?: string; version?: number }>(
  key: "home" | "skillsPage" | "roadmapPage" | "certificationsPage" | "about" | "contact" | "privacy",
  entity: T,
  expectedVersion: number
) {
  const store = await readStore();
  const current = store[key] as T & { id?: string; version?: number };

  if (current.version !== expectedVersion) {
    return {
      ok: false as const,
      conflict: true as const,
      current
    };
  }

  const nextValue = {
    ...entity,
    id: entity.id ?? current.id ?? key,
    version: current.version + 1,
    updatedAt: new Date().toISOString()
  };
  ((store as unknown) as Record<string, unknown>)[key] = nextValue;
  store.activity = [
    createActivityEvent(key, nextValue.id, "update", `Updated global resource ${key}.`),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);

  return { ok: true as const, data: nextValue };
}

export async function saveCatalogs(catalogs: ContentStore["catalogs"]) {
  const store = await readStore();
  store.catalogs = catalogs;
  store.activity = [
    createActivityEvent("catalogs", "catalogs", "update", "Updated catalogs."),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);
}

export async function registerMedia(asset: MediaAsset) {
  const store = await readStore();
  store.media = [asset, ...store.media];
  store.activity = [
    createActivityEvent("media", asset.id, "upload", `Uploaded media ${asset.fileName}.`),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);
}

export async function getHealthStatus(): Promise<HealthStatus> {
  await ensureRuntime();
  const mediaEntries = await readdir(mediaDirectory).catch(() => []);
  const store = await readStore();

  return {
    storage: "healthy",
    contentFiles: Object.keys(store).length,
    mediaFiles: mediaEntries.length,
    runtimePath: runtimeDirectory,
    lastUpdated: store.activity[0]?.createdAt ?? new Date().toISOString()
  };
}

export function getMediaDirectory() {
  return mediaDirectory;
}
