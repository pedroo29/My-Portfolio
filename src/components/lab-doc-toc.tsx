"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";
import type { MarkdownHeading } from "@/lib/markdown-headings";

export function LabDocToc({
  locale,
  headings
}: {
  locale: Locale;
  headings: MarkdownHeading[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) return null;

  const labels =
    locale === "de"
      ? {
          button: "Inhaltsverzeichnis",
          title: "Inhaltsverzeichnis",
          close: "Schliessen"
        }
      : {
          button: "Documentation index",
          title: "Documentation index",
          close: "Close"
        };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-[min(24rem,calc(100vw-2.5rem))] flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-[22rem] max-w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border border-slate-700/90 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/60 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">{labels.title}</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="focus-ring rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100"
            >
              {labels.close}
            </button>
          </div>
          <nav className="max-h-[min(60vh,26rem)] overflow-auto pr-1">
            <ul className="space-y-1.5">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "focus-ring block rounded-lg px-2 py-1.5 text-sm text-slate-300 transition hover:bg-slate-900 hover:text-cyan-100",
                      heading.level === 1 && "font-semibold text-slate-100",
                      heading.level === 2 && "pl-3",
                      heading.level === 3 && "pl-5 text-slate-400",
                      heading.level === 4 && "pl-7 text-slate-500"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="focus-ring inline-flex items-center rounded-full border border-cyan-400/40 bg-slate-950/95 px-4 py-3 text-sm font-medium text-cyan-100 shadow-lg shadow-cyan-950/40 backdrop-blur-md hover:border-cyan-300/60 hover:bg-slate-900"
      >
        {labels.button}
      </button>
    </div>
  );
}
