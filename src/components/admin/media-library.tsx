"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { MediaAsset } from "@/lib/types";

export function MediaLibrary({ items }: { items: MediaAsset[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      [...items]
        .sort((left, right) => left.fileName.localeCompare(right.fileName))
        .filter((item) => item.fileName.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
        <h1 className="text-3xl font-semibold text-slate-50">Media library</h1>
        <p className="mt-2 text-sm text-slate-400">Upload, preview and reuse media snippets for labs.</p>
      </div>

      {message ? <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-xl font-semibold text-slate-50">Upload files</h2>
            <p className="mt-2 text-sm text-slate-400">Drag and drop is supported by the file picker. Files are stored locally on disk.</p>
            <form
              className="mt-5 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const files = inputRef.current?.files;
                if (!files?.length) return;

                startTransition(async () => {
                  const payload = new FormData();
                  Array.from(files).forEach((file) => payload.append("files", file));
                  const response = await fetch("/api/admin/media/upload", {
                    method: "POST",
                    body: payload
                  });

                  if (response.ok) {
                    setMessage("Media uploaded.");
                    router.refresh();
                  }
                });
              }}
            >
              <input
                ref={inputRef}
                name="files"
                type="file"
                multiple
                className="focus-ring w-full rounded-2xl border border-dashed border-slate-700 bg-slate-950 px-4 py-10 text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950"
              />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="focus-ring rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950">
                  {isPending ? "Uploading..." : "Upload"}
                </button>
                <button type="button" onClick={() => router.refresh()} className="focus-ring rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200">
                  Refresh list
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <h2 className="text-xl font-semibold text-slate-50">Search and state</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by file name"
              className="focus-ring mt-4 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            />
            <p className="mt-4 text-sm text-slate-400">{filtered.length === 0 ? "No media files yet." : `${filtered.length} media files available.`}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-xl font-semibold text-slate-50">Library preview</h2>
          {filtered.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-700 px-4 py-10 text-center text-sm text-slate-500">
              No files uploaded yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {filtered.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  {item.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt.en} className="mb-4 h-44 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="mb-4 flex h-44 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-500">
                      {item.mimeType}
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="truncate text-sm font-medium text-slate-100">{item.fileName}</p>
                    <p className="text-xs text-slate-500">{item.mimeType}</p>
                    <div className="flex flex-wrap gap-2">
                      <a href={item.url} target="_blank" className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200">
                        Open file
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(`{{media:${item.id}}}`);
                          setMessage(`Embed snippet copied for ${item.fileName}.`);
                        }}
                        className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200"
                      >
                        Copy embed
                      </button>
                      {item.mimeType.startsWith("image/") ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await navigator.clipboard.writeText(`![${item.alt.en}](${item.url})`);
                            setMessage(`Markdown image snippet copied for ${item.fileName}.`);
                          }}
                          className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200"
                        >
                          Copy image
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
