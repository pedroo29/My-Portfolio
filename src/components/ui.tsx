import Link from "next/link";

import { cn } from "@/lib/utils";

export function Section({
  eyebrow,
  title,
  description,
  action,
  children
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="reveal-up space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          {eyebrow ? <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">{eyebrow}</p> : null}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-50 md:text-3xl">{title}</h2>
            {description ? <p className="max-w-3xl text-sm text-slate-400 md:text-base">{description}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Panel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("panel rounded-3xl p-6 shadow-2xl shadow-slate-950/20", className)}>{children}</div>;
}

export function Badge({
  children,
  tone = "default"
}: {
  children: React.ReactNode;
  tone?: "default" | "accent" | "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "accent"
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      : tone === "success"
        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
        : tone === "warning"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-100"
          : tone === "danger"
            ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
            : "border-slate-700 bg-slate-900/70 text-slate-300";

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs font-medium", toneClass)}>{children}</span>;
}

export function CTAButton({
  href,
  children,
  secondary = false
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring interactive-lift inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition",
        secondary
          ? "border border-slate-700 bg-slate-900/70 text-slate-100 hover:border-cyan-300/40 hover:text-cyan-100"
          : "soft-glow bg-cyan-400 text-slate-950 hover:bg-cyan-300"
      )}
    >
      {children}
    </Link>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Panel className="space-y-2">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="text-3xl font-semibold text-slate-50">{value}</p>
    </Panel>
  );
}

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Panel className="space-y-3 text-center">
      <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      {action}
    </Panel>
  );
}

export function StatusBanner({
  title,
  description,
  tone = "accent"
}: {
  title: string;
  description: string;
  tone?: "accent" | "success" | "warning" | "danger";
}) {
  return (
    <Panel
      className={cn(
        "space-y-2 border",
        tone === "success" && "border-emerald-400/20",
        tone === "warning" && "border-amber-400/20",
        tone === "danger" && "border-rose-400/20",
        tone === "accent" && "border-cyan-400/20"
      )}
    >
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </Panel>
  );
}
