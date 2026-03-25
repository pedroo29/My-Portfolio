import Link from "next/link";

import { LabsPagination } from "@/components/labs-pagination";
import { EmptyState, Section } from "@/components/ui";
import { LabCard } from "@/components/public-cards";
import { getCatalogs, getLabs, resolveCategoryLabel, resolveTagLabels } from "@/lib/content";
import { clampPage, LABS_PAGE_SIZE } from "@/lib/pagination";
import { getQueryParam } from "@/lib/search-params";
import type { Locale } from "@/lib/types";

export const dynamic = "force-dynamic";

function matchesLab(
  lab: Awaited<ReturnType<typeof getLabs>>[number],
  category: string,
  level: string,
  state: string,
  query: string,
  tag: string,
  categoryLabel: string,
  tagLabels: string[]
) {
  const haystack = `${lab.content.title} ${lab.content.summary} ${lab.stack.join(" ")} ${tagLabels.join(" ")}`.toLowerCase();

  return (
    (!category || lab.categoryId === category || categoryLabel.toLowerCase() === category.toLowerCase()) &&
    (!level || lab.level === level) &&
    (!state || lab.state === state) &&
    (!tag || lab.tags.includes(tag) || tagLabels.some((item) => item.toLowerCase() === tag.toLowerCase())) &&
    (!query || haystack.includes(query.toLowerCase()))
  );
}

export default async function LabsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const queryParams = await searchParams;
  const query = getQueryParam(queryParams, "q");
  const category = getQueryParam(queryParams, "category");
  const level = getQueryParam(queryParams, "level");
  const state = getQueryParam(queryParams, "state");
  const tag = getQueryParam(queryParams, "tag");
  const rawPage = getQueryParam(queryParams, "page");

  const [labs, catalogs] = await Promise.all([getLabs(typedLocale), getCatalogs()]);

  const filteredLabs = labs.filter((lab) => {
    const categoryLabel = resolveCategoryLabel(catalogs, lab.categoryId, typedLocale);
    const tagLabels = resolveTagLabels(catalogs, lab.tags, typedLocale);
    return matchesLab(lab, category, level, state, query, tag, categoryLabel, tagLabels);
  });

  const currentPage = clampPage(rawPage, filteredLabs.length, LABS_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredLabs.length / LABS_PAGE_SIZE));
  const pageOffset = (currentPage - 1) * LABS_PAGE_SIZE;
  const pagedLabs = filteredLabs.slice(pageOffset, pageOffset + LABS_PAGE_SIZE);

  const filterParams = { q: query, category, level, state, tag };

  return (
    <div className="space-y-10">
      <Section
        eyebrow="Case studies"
        title="Labs built as structured proof"
        description="Searchable, filterable technical evidence with context, outcomes and learning traceability."
      >
        <form method="get" action={`/${typedLocale}/labs`} className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-5 md:grid-cols-5">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search labs"
            className="focus-ring rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          />
          <select
            name="category"
            defaultValue={category}
            className="focus-ring rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="">All categories</option>
            {catalogs.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label[typedLocale]}
              </option>
            ))}
          </select>
          <select
            name="level"
            defaultValue={level}
            className="focus-ring rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="">All levels</option>
            <option value="foundational">Foundational</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
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
          <div className="flex gap-3">
            <select
              name="tag"
              defaultValue={tag}
              className="focus-ring min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            >
              <option value="">All tags</option>
              {catalogs.tags.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label[typedLocale]}
                </option>
              ))}
            </select>
            <button type="submit" className="focus-ring rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-medium text-slate-950">
              Apply
            </button>
          </div>
        </form>
      </Section>

      {filteredLabs.length === 0 ? (
        <EmptyState
          title="No labs match these filters"
          description="Adjust the current search or clear one of the filters to reveal more technical evidence."
          action={
            <Link href={`/${typedLocale}/labs`} className="focus-ring inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm text-slate-950">
              Clear filters
            </Link>
          }
        />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {pagedLabs.map((lab) => (
              <LabCard
                key={lab.id}
                locale={typedLocale}
                title={lab.content.title}
                summary={lab.content.summary}
                category={resolveCategoryLabel(catalogs, lab.categoryId, typedLocale)}
                level={lab.level}
                state={lab.state}
                stack={lab.stack}
                href={`/labs/${lab.slug}`}
                featured={lab.isTopCaseStudy}
              />
            ))}
          </div>
          <LabsPagination
            locale={typedLocale}
            currentPage={currentPage}
            totalPages={totalPages}
            filters={filterParams}
          />
        </div>
      )}
    </div>
  );
}
