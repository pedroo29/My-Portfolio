import { EmptyState, Section } from "@/components/ui";
import { CertificationCard } from "@/components/public-cards";
import { getCatalogs, getCertifications, resolveProviderLabel } from "@/lib/content";
import { getQueryParam } from "@/lib/search-params";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CertificationsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const queryParams = await searchParams;
  const provider = getQueryParam(queryParams, "provider");
  const state = getQueryParam(queryParams, "state");

  const [certifications, catalogs] = await Promise.all([getCertifications(typedLocale), getCatalogs()]);
  const filtered = certifications.filter((item) => (!provider || item.providerId === provider) && (!state || item.state === state));

  return (
    <div className="space-y-10">
      <Section
        eyebrow="Formal learning"
        title="Certifications and structured learning signals"
        description="A filtered view of completed, active and planned certifications that reinforce your professional roadmap."
      >
        <form method="get" action={`/${typedLocale}/certifications`} className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-5 md:grid-cols-3">
          <select
            name="provider"
            defaultValue={provider}
            className="focus-ring rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="">All providers</option>
            {catalogs.providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label[typedLocale]}
              </option>
            ))}
          </select>
          <select
            name="state"
            defaultValue={state}
            className="focus-ring rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="">All states</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In progress</option>
            <option value="planned">Planned</option>
          </select>
          <button type="submit" className="focus-ring rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">
            Apply filters
          </button>
        </form>
      </Section>

      {filtered.length === 0 ? (
        <EmptyState
          title="No certifications match the current filters"
          description="Try another provider or certification state to explore your learning roadmap."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {filtered.map((item) => (
            <CertificationCard
              key={item.id}
              title={item.content.name}
              provider={resolveProviderLabel(catalogs, item.providerId, typedLocale)}
              state={item.state}
              date={item.relevantDate}
              note={item.content.note}
            />
          ))}
        </div>
      )}
    </div>
  );
}
