"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Igual que SkillProgressBar pero la animación 0% → valor solo arranca cuando la barra entra en el viewport.
 */
export function SkillProgressBarInView({
  progress,
  thick = false,
  className,
  trackClassName
}: {
  progress: number;
  thick?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, progress));
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = trackRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={trackRef}
      className={cn("overflow-hidden rounded-full bg-slate-800", thick ? "h-3" : "h-2", trackClassName)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-cyan-400",
          !visible && "w-0",
          visible && "skill-progress-fill",
          className
        )}
        style={{ "--skill-progress": `${clamped}%` } as CSSProperties}
      />
    </div>
  );
}
