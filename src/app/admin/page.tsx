import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/server/auth";
import { getDashboardData } from "@/lib/content";
import { getHealthStatus } from "@/lib/server/content-store";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  const [dashboard, health] = await Promise.all([getDashboardData(), getHealthStatus()]);

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
          <h1 className="text-3xl font-semibold text-slate-50">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            Overview of managed collections, activity feed and self-hosted runtime health.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {Object.entries(dashboard.counts).map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">Quick actions</h2>
                  <p className="mt-1 text-sm text-slate-400">Jump straight into the most frequent editing areas.</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {[
                  { href: "/admin/labs/new", label: "Create lab" },
                  { href: "/admin/skills/new", label: "Create skill" },
                  { href: "/admin/roadmap/milestones/new", label: "Create milestone" },
                  { href: "/admin/media", label: "Open media library" },
                  { href: "/admin/content/home", label: "Edit home" },
                  { href: "/admin/catalogs", label: "Manage catalogs" }
                ].map((item) => (
                  <Link key={item.href} href={item.href} className="focus-ring rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-sm text-slate-200 hover:border-cyan-300/30 hover:text-cyan-100">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <h2 className="text-xl font-semibold text-slate-50">Recent activity</h2>
              <div className="mt-5 space-y-3">
                {dashboard.activity.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
                    <p className="text-sm text-slate-200">{entry.message}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{entry.createdAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <h2 className="text-xl font-semibold text-slate-50">Storage health</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <p>Status: {health.storage}</p>
                <p>Runtime path: {health.runtimePath}</p>
                <p>Content resources: {health.contentFiles}</p>
                <p>Media directory ready: {health.mediaFiles ? "Yes" : "No"}</p>
                <p>Last activity: {health.lastUpdated}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
              <h2 className="text-xl font-semibold text-slate-50">Content status</h2>
              <div className="mt-5 space-y-3">
                {dashboard.recentLabs.map((lab) => (
                  <div key={lab.id} className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
                    <p className="text-sm font-medium text-slate-100">{lab.locales.en.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                      {lab.status} · version {lab.version}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
