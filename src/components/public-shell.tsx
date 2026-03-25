import Link from "next/link";

import { PublicHeader } from "@/components/public-header";
import type { Locale } from "@/lib/types";

export function PublicShell({
  locale,
  children
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <PublicHeader locale={locale} />
      <main className="container-shell space-y-16 py-10 md:py-14">{children}</main>
      <footer className="border-t border-slate-800/80 py-6 text-sm text-slate-500">
        <div className="container-shell flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>Built as a self-hosted portfolio product with a bilingual public experience and internal admin.</p>
          <Link href={`/${locale}/privacy`} className="focus-ring hover:text-slate-200">
            Privacy
          </Link>
        </div>
      </footer>
    </div>
  );
}
