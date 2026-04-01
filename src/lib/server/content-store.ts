import "server-only";

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { seedContentStore } from "@/lib/seed-data";
import type {
  ActivityEvent,
  CollectionKey,
  ContentStore,
  GlobalContent,
  HealthStatus,
  LabLevel,
  MediaAsset
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

export async function readStore(): Promise<ContentStore> {
  await ensureRuntime();

  try {
    const raw = await readFile(storeFilePath, "utf-8");
    return JSON.parse(raw) as ContentStore;
  } catch {
    await writeStore(seedContentStore);
    return structuredClone(seedContentStore);
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

export async function listCollection<T>(key: CollectionKey): Promise<T[]> {
  const store = await readStore();
  return store[key] as unknown as T[];
}

export async function getSingle<T extends keyof Pick<ContentStore, "home" | "about" | "contact" | "privacy" | "catalogs">>(key: T): Promise<ContentStore[T]> {
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

  if (index >= 0) {
    const current = collection[index];
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
  store.activity = [
    createActivityEvent(key, duplicated.id, "create", `Duplicated ${key} entry from ${id}.`),
    ...store.activity
  ].slice(0, 30);
  await writeStore(store);
}

export async function saveGlobalResource<T extends Partial<GlobalContent<unknown>> & { id?: string; version?: number }>(
  key: "home" | "about" | "contact" | "privacy",
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
