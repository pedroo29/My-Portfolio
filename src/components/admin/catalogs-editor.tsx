"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Catalogs } from "@/lib/types";
import { parseLines } from "@/lib/utils";

function serialize(items: Array<{ id: string; slug: string; label: { en: string; de: string } }>) {
  return items.map((item) => `${item.id} | ${item.slug} | ${item.label.en} | ${item.label.de}`).join("\n");
}

function parse(value: string) {
  return parseLines(value).map((line) => {
    const [id, slug, en, de] = line.split("|").map((item) => item.trim());
    return {
      id,
      slug,
      label: {
        en,
        de
      }
    };
  });
}

export function CatalogsEditor({ initialValue }: { initialValue: Catalogs }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState(serialize(initialValue.categories));
  const [providers, setProviders] = useState(serialize(initialValue.providers));
  const [tags, setTags] = useState(serialize(initialValue.tags));
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const id = requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [message]);

  const preview = useMemo(
    () => ({
      categories: parse(categories),
      providers: parse(providers),
      tags: parse(tags)
    }),
    [categories, providers, tags]
  );

  return (
    <div ref={rootRef} className="space-y-6 scroll-mt-6">
      {message ? (
        <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
        <h1 className="text-3xl font-semibold text-slate-50">Catalogs manager</h1>
        <p className="mt-2 text-sm text-slate-400">
          Edit category, provider and tag catalogs with legible labels for relation pickers.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {[
            { label: "Categories", value: categories, setValue: setCategories },
            { label: "Providers", value: providers, setValue: setProviders },
            { label: "Tags", value: tags, setValue: setTags }
          ].map((section) => (
            <div key={section.label} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <h2 className="text-xl font-semibold text-slate-50">{section.label}</h2>
              <p className="mt-2 text-sm text-slate-400">Use one line per item: `id | slug | English label | German label`.</p>
              <textarea
                value={section.value}
                onChange={(event) => section.setValue(event.target.value)}
                className="focus-ring mt-4 min-h-[180px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
              />
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
          <h2 className="text-xl font-semibold text-slate-50">Preview</h2>
          <pre className="mt-4 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
        <button
          type="button"
          onClick={async () => {
            const response = await fetch("/api/admin/catalogs/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: {
                  categories: parse(categories),
                  providers: parse(providers),
                  tags: parse(tags)
                }
              })
            });

            if (response.ok) {
              setMessage("Catalogs saved.");
            }
          }}
          className="focus-ring rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950"
        >
          Save catalogs
        </button>
      </div>
    </div>
  );
}
