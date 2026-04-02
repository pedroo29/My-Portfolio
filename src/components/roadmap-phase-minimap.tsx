"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { LocalizedRoadmapPageContent } from "@/lib/types";

export type RoadmapMinimapPhase = {
  slug: string;
  order: number;
  title: string;
};

const nodeAccents = [
  {
    ring: "ring-cyan-400/35",
    border: "border-cyan-400/40",
    bg: "bg-cyan-400/10",
    text: "text-cyan-200",
    path: "from-cyan-400/50 to-fuchsia-400/40"
  },
  {
    ring: "ring-fuchsia-400/35",
    border: "border-fuchsia-400/40",
    bg: "bg-fuchsia-400/10",
    text: "text-fuchsia-200",
    path: "from-fuchsia-400/50 to-emerald-400/40"
  },
  {
    ring: "ring-emerald-400/35",
    border: "border-emerald-400/40",
    bg: "bg-emerald-400/10",
    text: "text-emerald-200",
    path: "from-emerald-400/50 to-cyan-400/40"
  }
] as const;

function scrollToPhase(slug: string) {
  const el = document.getElementById(`roadmap-phase-${slug}`);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function RoadmapPhaseMinimap({
  phases,
  roadmapCopy
}: {
  phases: RoadmapMinimapPhase[];
  roadmapCopy: LocalizedRoadmapPageContent;
}) {
  const [open, setOpen] = useState(false);
  const phaseWord = roadmapCopy.phaseLabel;
  const shellRef = useRef<HTMLDivElement | null>(null);

  if (phases.length === 0) return null;

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!open) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (shellRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={shellRef} className="fixed bottom-6 right-6 z-50 flex max-w-[min(22rem,calc(100vw-2.5rem))] flex-col items-end gap-3">
      {open ? (
        <div
          id="roadmap-phase-minimap-panel"
          className="reveal-up w-full overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-950/95 shadow-2xl shadow-slate-950/60 backdrop-blur-md transition-all duration-300 ease-out"
          role="dialog"
          aria-label={roadmapCopy.minimapTitle}
        >
          <div className="relative border-b border-slate-800/90 px-4 py-3">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
                backgroundSize: "18px 18px"
              }}
              aria-hidden
            />
            <div className="relative flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-100">{roadmapCopy.minimapTitle}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="focus-ring cursor-pointer rounded-lg border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-slate-100"
              >
                {roadmapCopy.minimapClose}
              </button>
            </div>
          </div>

          <nav aria-label={roadmapCopy.minimapAriaNav} className="max-h-[min(55vh,22rem)] overflow-auto p-4">
            {/* Desktop: camino horizontal */}
            <div className="hidden flex-wrap items-center justify-center gap-y-4 md:flex">
              {phases.map((phase, index) => {
                const accent = nodeAccents[index % nodeAccents.length];
                return (
                  <Fragment key={phase.slug}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        requestAnimationFrame(() => scrollToPhase(phase.slug));
                      }}
                      className={cn(
                        "focus-ring cursor-pointer max-w-[10.5rem] rounded-2xl border px-3 py-3 text-left shadow-lg transition-all duration-300",
                        "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-cyan-950/40",
                        accent.border,
                        accent.bg,
                        accent.ring,
                        "ring-1"
                      )}
                    >
                      <p className={cn("text-[10px] font-semibold uppercase tracking-[0.2em]", accent.text)}>
                        {phaseWord} {phase.order}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-slate-100">{phase.title}</p>
                    </button>
                    {index < phases.length - 1 ? (
                      <div
                        className={cn("mx-1 h-0.5 w-6 shrink-0 rounded-full bg-gradient-to-r md:w-8 animate-pulse", accent.path)}
                        aria-hidden
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>

            {/* Mobile: camino vertical tipo mapa */}
            <ol className="relative flex flex-col gap-0 md:hidden">
              <div
                className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/40 via-fuchsia-500/30 to-emerald-500/35"
                aria-hidden
              />
              {phases.map((phase, index) => {
                const accent = nodeAccents[index % nodeAccents.length];
                return (
                  <li key={phase.slug} className="relative flex gap-3 pl-1">
                    <span
                      className={cn(
                        "relative z-10 mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                        accent.border,
                        accent.bg,
                        accent.text
                      )}
                      aria-hidden
                    >
                      {phase.order}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        requestAnimationFrame(() => scrollToPhase(phase.slug));
                      }}
                      className={cn(
                        "focus-ring cursor-pointer mb-4 min-w-0 flex-1 rounded-2xl border px-3 py-2.5 text-left transition-all duration-300",
                        "hover:-translate-y-0.5 hover:bg-slate-900/80",
                        accent.border,
                        accent.bg
                      )}
                    >
                      <p className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", accent.text)}>
                        {phaseWord} {phase.order}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-100">{phase.title}</p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "focus-ring cursor-pointer inline-flex items-center gap-2 rounded-full border border-fuchsia-300/55 bg-slate-950/95 px-4 py-3 text-sm font-semibold text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.28)] backdrop-blur-md transition-all duration-300",
          "hover:-translate-y-0.5 hover:scale-[1.03] hover:border-fuchsia-200/70 hover:bg-slate-900 hover:shadow-[0_0_32px_rgba(217,70,239,0.42)]",
          open ? "ring-1 ring-fuchsia-200/55 levitate-soft shadow-[0_0_34px_rgba(217,70,239,0.45)]" : "soft-glow levitate-soft"
        )}
        aria-expanded={open}
        aria-controls="roadmap-phase-minimap-panel"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={cn("h-4 w-4 transition-transform duration-300", open ? "rotate-90" : "")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 18L10 12L14 15L20 7" />
          <circle cx="4" cy="18" r="1.5" />
          <circle cx="10" cy="12" r="1.5" />
          <circle cx="14" cy="15" r="1.5" />
          <circle cx="20" cy="7" r="1.5" />
        </svg>
        {roadmapCopy.minimapButton}
      </button>
    </div>
  );
}
