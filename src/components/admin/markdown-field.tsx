"use client";

import { useMemo, useRef, useState, useTransition } from "react";

import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import type { Locale, MediaAsset } from "@/lib/types";

function ToolbarButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200"
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

export function MarkdownField({
  label,
  value,
  locale,
  onChange,
  mediaAssets
}: {
  label: string;
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
  mediaAssets: MediaAsset[];
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [availableAssets, setAvailableAssets] = useState(mediaAssets);
  const [uploadMessage, setUploadMessage] = useState("");
  const [insertAfterUpload, setInsertAfterUpload] = useState(false);

  const snippets = useMemo(
    () => [
      { label: "H2", value: "\n## Section title\n" },
      { label: "H3", value: "\n### Subsection title\n" },
      { label: "Bold", value: "**bold text**" },
      { label: "Link", value: "[Link label](https://example.com)" },
      { label: "Quote", value: "\n> Important takeaway or context.\n" },
      { label: "Code", value: '\n```bash\ncommand --flag\n```\n' },
      { label: "Table", value: "\n| Column | Value |\n| --- | --- |\n| Item | Detail |\n" }
    ],
    []
  );

  const sortedAssets = useMemo(
    () => [...availableAssets].sort((left, right) => left.fileName.localeCompare(right.fileName)),
    [availableAssets]
  );

  const uploadFiles = (files: FileList | File[] | null, insertAfterUpload = false) => {
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

      setAvailableAssets((current) => {
        const next = [...result.data!, ...current];
        const unique = new Map(next.map((asset) => [asset.id, asset]));
        return Array.from(unique.values());
      });

      setUploadMessage(`${result.data.length} file(s) uploaded successfully.`);

      if (insertAfterUpload) {
        const snippetsToInsert = result.data
          .map((asset) => `\n{{media:${asset.id}}}\n`)
          .join("");

        insertAtSelection(textareaRef.current, value, onChange, snippetsToInsert);
      }

      setInsertAfterUpload(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="space-y-3 rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <p className="max-w-4xl text-sm leading-7 text-slate-400">
          Supports GFM: headings, tables, task lists, fenced code blocks, quotes, links, images and media embeds with
          <code className="mx-1 rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-cyan-100">{`{{media:MEDIA_ID}}`}</code>
        </p>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">
          Primary case-study area: use this field for rich documentation, screenshots, videos and technical narrative.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {snippets.map((snippet) => (
          <ToolbarButton
            key={snippet.label}
            label={snippet.label}
            onClick={() => insertAtSelection(textareaRef.current, value, onChange, snippet.value)}
          />
        ))}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Upload from your machine</p>
          <h3 className="text-lg font-semibold text-slate-50">Add photos and videos directly while writing documentation</h3>
          <p className="text-sm text-slate-400">
            Select files from your computer to upload them immediately and optionally insert them into the documentation.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
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
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Documentation media</p>
            <h3 className="text-lg font-semibold text-slate-50">Insert photos and videos directly into the documentation</h3>
            <p className="text-sm text-slate-400">
              Use embeds for managed media assets. Images can also be inserted as native Markdown image syntax when useful.
            </p>
          </div>
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
                      onClick={() => insertAtSelection(textareaRef.current, value, onChange, embedSnippet)}
                    />
                    <ToolbarButton
                      label="Insert with caption"
                      onClick={() => insertAtSelection(textareaRef.current, value, onChange, captionSnippet)}
                    />
                    {markdownImageSnippet ? (
                      <ToolbarButton
                        label="Insert Markdown image"
                        onClick={() => insertAtSelection(textareaRef.current, value, onChange, markdownImageSnippet)}
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
