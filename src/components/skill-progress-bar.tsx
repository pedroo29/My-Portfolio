import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Barra de progreso de skill: anima de 0% al valor indicado al montarse (CSS).
 */
export function SkillProgressBar({
  progress,
  thick = false,
  className,
  trackClassName
}: {
  progress: number;
  /** Barra más alta (p. ej. detalle de skill) */
  thick?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={cn("overflow-hidden rounded-full bg-slate-800", thick ? "h-3" : "h-2", trackClassName)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("skill-progress-fill h-full rounded-full bg-cyan-400", className)}
        style={{ "--skill-progress": `${clamped}%` } as CSSProperties}
      />
    </div>
  );
}
