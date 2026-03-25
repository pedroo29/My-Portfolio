"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <div className="max-w-xl space-y-5 rounded-3xl border border-rose-400/20 bg-slate-950/70 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-rose-200">Error state</p>
        <h1 className="text-3xl font-semibold text-slate-50">Something went wrong</h1>
        <p className="text-sm text-slate-400">Operational reference: {error.digest ?? "local-runtime-error"}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="focus-ring rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950">
            Retry
          </button>
          <Link href="/en" className="focus-ring rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
