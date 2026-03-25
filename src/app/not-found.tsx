import Link from "next/link";

import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-screen items-center justify-center py-16">
      <EmptyState
        title="Page not found"
        description="The page you requested could not be found. Return to the portfolio home to continue browsing."
        action={
          <Link href="/en" className="focus-ring inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm text-slate-950">
            Go home
          </Link>
        }
      />
    </main>
  );
}
