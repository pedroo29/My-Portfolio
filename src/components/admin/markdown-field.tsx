"use client";

import { useMemo, useRef, useState, useTransition } from "react";

import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import type { Locale, MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

function ToolbarButton({
  label,
  onClick,
  variant = "default"
}: {
  label: string;
  onClick: () => void;
  variant?: "default" | "compact" | "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-full border text-slate-200",
        variant === "compact" && "border-slate-700 px-2 py-1 text-[11px]",
        variant === "default" && "border-slate-700 px-3 py-2 text-xs",
        variant === "ghost" && "border-slate-700/80 bg-slate-900/40 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/60",
        variant === "primary" && "border-cyan-400/50 bg-cyan-400/15 px-3 py-2 text-xs font-medium text-cyan-50 hover:bg-cyan-400/25"
      )}
    >
      {label}
    </button>
  );
}

function AssetPreview({ asset, locale }: { asset: MediaAsset; locale: Locale }) {
  if (asset.mimeType.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={asset.url} alt={asset.alt[locale] || asset.fileName} className="h-40 w-full rounded-xl object-cover" />
    );
  }

  if (asset.mimeType.startsWith("video/")) {
    return <video src={asset.url} controls className="h-40 w-full rounded-xl bg-slate-950 object-cover" />;
  }

  return (
    <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-sm text-slate-500">
      {asset.mimeType}
    </div>
  );
}

function CompactThumb({ asset, locale }: { asset: MediaAsset; locale: Locale }) {
  if (asset.mimeType.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={asset.url} alt="" className="h-14 w-full object-cover" />
    );
  }
  if (asset.mimeType.startsWith("video/")) {
    return <video src={asset.url} muted playsInline className="h-14 w-full object-cover" aria-hidden />;
  }
  return <div className="flex h-14 items-center justify-center bg-slate-900 text-[9px] text-slate-500">FILE</div>;
}

function collectMediaIdsFromMarkdown(markdown: string): string[] {
  const re = /\{\{media:([^}|]+)/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    const id = m[1]?.trim();
    if (id) out.push(id);
  }
  return out;
}

function insertAtSelection(
  textarea: HTMLTextAreaElement | null,
  value: string,
  onChange: (value: string) => void,
  snippet: string
) {
  if (!textarea) {
    onChange(`${value}${value.endsWith("\n") ? "" : "\n"}${snippet}`);
    return;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
  onChange(next);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursor = start + snippet.length;
    textarea.setSelectionRange(cursor, cursor);
  });
}

const SNIPPETS = [
  { label: "H2", value: "\n## Section title\n" },
  { label: "H3", value: "\n### Subsection title\n" },
  { label: "Bold", value: "**bold text**" },
  { label: "Link", value: "[Label](https://)" },
  { label: "Quote", value: "\n> Quote\n" },
  { label: "Code", value: '\n```\ncode\n```\n' },
  { label: "Table", value: "\n| A | B |\n| --- | --- |\n|  |  |\n" }
] as const;

function MediaLibraryPicker({
  open,
  onClose,
  library,
  linkedIds,
  onAdd,
  locale
}: {
  open: boolean;
  onClose: () => void;
  library: MediaAsset[];
  linkedIds: string[];
  onAdd: (ids: string[]) => void;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const linkedSet = useMemo(() => new Set(linkedIds), [linkedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...library]
      .filter((a) => !linkedSet.has(a.id))
      .filter((a) => !q || a.fileName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q))
      .sort((a, b) => a.fileName.localeCompare(b.fileName));
  }, [library, linkedSet, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div className="relative z-[101] flex max-h-[min(85vh,640px)] w-full max-w-lg flex-col rounded-t-2xl border border-slate-700 bg-slate-950 shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-100">Add from media library</h3>
          <button type="button" className="focus-ring rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-200" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="border-b border-slate-800 p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by file name or ID…"
            className="focus-ring w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <ul className="min-h-0 flex-1 overflow-auto p-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-slate-500">No assets to add (empty or all already linked).</li>
          ) : (
            filtered.map((asset) => (
              <li key={asset.id} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-900/80">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-800">
                  <CompactThumb asset={asset} locale={locale} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-200">{asset.fileName}</p>
                  <p className="truncate text-[10px] text-slate-500">{asset.mimeType}</p>
                </div>
                <button
                  type="button"
                  className="focus-ring shrink-0 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100 hover:bg-cyan-500/20"
                  onClick={() => {
                    onAdd([asset.id]);
                    onClose();
                  }}
                >
                  Add
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export function MarkdownField({
  label,
  value,
  locale,
  onChange,
  mediaAssets,
  markdownUi,
  labMediaIds,
  onLabMediaIdsChange
}: {
  label: string;
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
  mediaAssets: MediaAsset[];
  markdownUi?: "documentation";
  labMediaIds?: string[];
  onLabMediaIdsChange?: (ids: string[]) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const [isPending, startTransition] = useTransition();
  const [sessionUploads, setSessionUploads] = useState<MediaAsset[]>([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [insertAfterUpload, setInsertAfterUpload] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const mergedLibrary = useMemo(() => {
    const map = new Map(mediaAssets.map((a) => [a.id, a]));
    sessionUploads.forEach((a) => map.set(a.id, a));
    return Array.from(map.values());
  }, [mediaAssets, sessionUploads]);

  const sortedAssets = useMemo(
    () => [...mergedLibrary].sort((left, right) => left.fileName.localeCompare(right.fileName)),
    [mergedLibrary]
  );

  const labLinkActive = Boolean(onLabMediaIdsChange && labMediaIds);

  const linkedIds = labMediaIds ?? [];

  const linkedAssets = useMemo(() => {
    if (!labLinkActive) return [];
    const byId = new Map(mergedLibrary.map((a) => [a.id, a]));
    return linkedIds.map((id) => byId.get(id)).filter((a): a is MediaAsset => Boolean(a));
  }, [labLinkActive, linkedIds, mergedLibrary]);

  const previewMediaAssets = useMemo(() => {
    const idSet = new Set<string>();
    linkedIds.forEach((id) => idSet.add(id));
    collectMediaIdsFromMarkdown(value).forEach((id) => idSet.add(id));
    return mergedLibrary.filter((a) => idSet.has(a.id));
  }, [linkedIds, value, mergedLibrary]);

  const appendLabMediaIds = (newIds: string[]) => {
    if (!onLabMediaIdsChange) return;
    const next = [...linkedIds];
    const seen = new Set(next);
    for (const id of newIds) {
      if (!seen.has(id)) {
        seen.add(id);
        next.push(id);
      }
    }
    onLabMediaIdsChange(next);
  };

  const removeLabMediaId = (id: string) => {
    if (!onLabMediaIdsChange) return;
    onLabMediaIdsChange(linkedIds.filter((x) => x !== id));
  };

  const uploadFiles = (files: FileList | File[] | null, shouldInsert: boolean) => {
    if (!files || files.length === 0) {
      return;
    }

    startTransition(async () => {
      const payload = new FormData();
      Array.from(files).forEach((file) => payload.append("files", file));

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: payload
      });

      const result = (await response.json()) as { ok: boolean; data?: MediaAsset[]; message?: string };

      if (!response.ok || !result.ok || !result.data?.length) {
        setUploadMessage(result.message ?? "Upload failed. Try again.");
        setInsertAfterUpload(false);
        return;
      }

      setSessionUploads((prev) => {
        const map = new Map(prev.map((a) => [a.id, a]));
        result.data!.forEach((a) => map.set(a.id, a));
        return Array.from(map.values());
      });

      if (onLabMediaIdsChange) {
        appendLabMediaIds(result.data.map((a) => a.id));
      }

      setUploadMessage(`${result.data.length} file(s) added.`);

      if (shouldInsert) {
        const snippetsToInsert = result.data.map((asset) => `\n{{media:${asset.id}}}\n`).join("");
        insertAtSelection(textareaRef.current, valueRef.current, onChange, snippetsToInsert);
      }

      setInsertAfterUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const isDoc = markdownUi === "documentation";

  if (isDoc) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
          <span className="text-sm font-semibold text-slate-100">{label}</span>
          <span className="text-[11px] text-slate-500">
            GFM · embed{" "}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-[10px] text-cyan-200/90">{`{{media:id}}`}</code>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SNIPPETS.map((snippet) => (
            <ToolbarButton
              key={snippet.label}
              variant="compact"
              label={snippet.label}
              onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, snippet.value)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => uploadFiles(event.target.files, true)}
          />
          <ToolbarButton
            variant="primary"
            label={isPending ? "Uploading…" : "Upload from device"}
            onClick={() => fileInputRef.current?.click()}
          />
          {labLinkActive ? (
            <ToolbarButton variant="ghost" label="Add from library" onClick={() => setLibraryOpen(true)} />
          ) : null}
          <button
            type="button"
            className="focus-ring flex min-h-[40px] min-w-0 flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-600/90 bg-slate-950/40 px-3 text-center text-[11px] text-slate-400 transition hover:border-cyan-500/35 hover:bg-slate-900/50 sm:min-w-[200px]"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              uploadFiles(event.dataTransfer.files, true);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            Drop files here · inserts embed at cursor
          </button>
        </div>

        {labLinkActive && linkedAssets.length > 0 ? (
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/40 px-2 py-2">
            <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Media for this lab · click to insert
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]">
              {linkedAssets.map((asset) => {
                const embed = `\n{{media:${asset.id}}}\n`;
                const caption = `\n{{media:${asset.id}|${asset.caption[locale] || asset.fileName}}}\n`;
                const mdImg =
                  asset.mimeType.startsWith("image/") && `\n![${asset.alt[locale] || asset.fileName}](${asset.url})\n`;

                return (
                  <div
                    key={asset.id}
                    className="w-[5.5rem] shrink-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                  >
                    <button
                      type="button"
                      title={asset.fileName}
                      className="block w-full focus-ring"
                      onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, embed)}
                    >
                      <CompactThumb asset={asset} locale={locale} />
                    </button>
                    <p className="truncate px-1 py-0.5 text-[9px] text-slate-500" title={asset.fileName}>
                      {asset.fileName}
                    </p>
                    <div className="flex flex-wrap gap-0.5 border-t border-slate-800/80 px-1 py-1">
                      <button
                        type="button"
                        className="focus-ring rounded bg-slate-900 px-1 py-0.5 text-[9px] text-cyan-200/90"
                        onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, caption)}
                      >
                        cap
                      </button>
                      {mdImg ? (
                        <button
                          type="button"
                          className="focus-ring rounded bg-slate-900 px-1 py-0.5 text-[9px] text-slate-400"
                          onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, mdImg)}
                        >
                          md
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="focus-ring ml-auto rounded bg-rose-950/50 px-1 py-0.5 text-[9px] text-rose-200/90"
                        title="Remove from lab (does not delete file)"
                        onClick={() => removeLabMediaId(asset.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {uploadMessage ? <p className="text-xs text-cyan-300/90">{uploadMessage}</p> : null}

        <div className="flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="focus-ring min-h-[min(55vh,480px)] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-100"
          />
          <div className="flex min-h-[min(40vh,360px)] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/50">
            <div className="border-b border-slate-800 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
              Live preview
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4">
              <MarkdownRenderer content={value} locale={locale} mediaAssets={previewMediaAssets} />
            </div>
          </div>
        </div>

        {labLinkActive ? (
          <MediaLibraryPicker
            open={libraryOpen}
            onClose={() => setLibraryOpen(false)}
            library={mediaAssets}
            linkedIds={linkedIds}
            locale={locale}
            onAdd={(ids) => {
              appendLabMediaIds(ids);
              const snippets = ids.map((id) => `\n{{media:${id}}}\n`).join("");
              insertAtSelection(textareaRef.current, valueRef.current, onChange, snippets);
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="space-y-3 rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <p className="max-w-4xl text-sm leading-7 text-slate-400">
          Supports GFM: headings, tables, task lists, fenced code blocks, quotes, links, images and media embeds with
          <code className="mx-1 rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-cyan-100">{`{{media:MEDIA_ID}}`}</code>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SNIPPETS.map((snippet) => (
          <ToolbarButton
            key={snippet.label}
            label={snippet.label}
            onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, snippet.value)}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
        <div className="mt-0 flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => uploadFiles(event.target.files, insertAfterUpload)}
          />
          <ToolbarButton
            label={isPending ? "Uploading..." : "Upload media"}
            onClick={() => {
              setInsertAfterUpload(false);
              fileInputRef.current?.click();
            }}
          />
          <ToolbarButton
            label={isPending ? "Uploading..." : "Upload and insert"}
            onClick={() => {
              setInsertAfterUpload(true);
              fileInputRef.current?.click();
            }}
          />
        </div>
        <div
          className="mt-4 rounded-2xl border border-dashed border-slate-700 px-5 py-8 text-center text-sm text-slate-400"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            uploadFiles(event.dataTransfer.files, true);
          }}
        >
          Drag and drop images or videos here to upload and insert them into the documentation.
        </div>
        {uploadMessage ? <p className="mt-3 text-sm text-cyan-200">{uploadMessage}</p> : null}
      </div>

      {sortedAssets.length > 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {sortedAssets.map((asset) => {
              const embedSnippet = `\n{{media:${asset.id}}}\n`;
              const markdownImageSnippet = asset.mimeType.startsWith("image/")
                ? `\n![${asset.alt[locale] || asset.fileName}](${asset.url})\n`
                : "";
              const captionSnippet = `\n{{media:${asset.id}|${asset.caption[locale] || asset.fileName}}}\n`;

              return (
                <div key={asset.id} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
                  <AssetPreview asset={asset} locale={locale} />
                  <p className="truncate text-sm font-medium text-slate-100">{asset.fileName}</p>
                  <p className="mt-1 text-xs text-slate-500">{asset.mimeType}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Asset ID: <code className="rounded bg-slate-900 px-1 py-0.5 text-cyan-100">{asset.id}</code>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ToolbarButton
                      label={asset.mimeType.startsWith("video/") ? "Insert video embed" : "Insert media embed"}
                      onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, embedSnippet)}
                    />
                    <ToolbarButton
                      label="Insert with caption"
                      onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, captionSnippet)}
                    />
                    {markdownImageSnippet ? (
                      <ToolbarButton
                        label="Insert Markdown image"
                        onClick={() => insertAtSelection(textareaRef.current, valueRef.current, onChange, markdownImageSnippet)}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 2xl:grid-cols-[1.15fr_0.85fr]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="focus-ring min-h-[760px] w-full rounded-3xl border border-slate-700 bg-slate-950 px-5 py-5 text-sm leading-7 text-slate-100"
        />
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50">
          <div className="border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-[0.24em] text-slate-500">
            Live preview
          </div>
          <div className="max-h-[760px] overflow-auto p-6">
            <MarkdownRenderer content={value} locale={locale} mediaAssets={mediaAssets} />
          </div>
        </div>
      </div>
    </div>
  );
}
