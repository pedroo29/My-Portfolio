"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/labs", label: "Labs" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/roadmap/phases", label: "Roadmap phases" },
  { href: "/admin/roadmap/milestones", label: "Roadmap milestones" },
  { href: "/admin/content/home", label: "Home" },
  { href: "/admin/content/about", label: "About" },
  { href: "/admin/content/contact", label: "Contact" },
  { href: "/admin/content/privacy", label: "Privacy" },
  { href: "/admin/catalogs", label: "Catalogs" },
  { href: "/admin/media", label: "Media" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] gap-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950/95 p-6">
          <div className="space-y-3">
            <Link href="/admin" className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-100">
              Portfolio Admin
            </Link>
            <p className="text-sm text-slate-500">Fast editing, localized content and self-hosted control.</p>
          </div>

          <nav className="mt-8 space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring block rounded-2xl px-4 py-3 text-sm transition",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-cyan-400/10 text-cyan-100"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3 rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Operational notes</p>
            <p className="text-sm text-slate-400">Admin is English-only by design. Public content is bilingual and defaults to English.</p>
            <Link
              href="/en"
              className="focus-ring inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 hover:border-cyan-300/50 hover:bg-cyan-400/15"
            >
              Back to home
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                router.push("/admin/login");
                router.refresh();
              }}
              className="focus-ring rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200"
            >
              Logout
            </button>
          </div>
        </aside>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
