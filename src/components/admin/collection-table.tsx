"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { RowActions } from "@/components/admin/row-actions";

export function CollectionTable({
  title,
  description,
  createHref,
  columns,
  rows,
  editBasePath,
  actionsBasePath
}: {
  title: string;
  description: string;
  createHref: string;
  columns: string[];
  rows: Array<{ id: string; cells: Array<string | number>; searchText?: string }>;
  editBasePath: string;
  actionsBasePath: string;
}) {
  const [query, setQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    const nextRows = rows.filter((row) => (row.searchText ?? row.cells.join(" ")).toLowerCase().includes(query.toLowerCase()));
    nextRows.sort((left, right) => {
      const leftValue = String(left.cells[0] ?? "");
      const rightValue = String(right.cells[0] ?? "");
      return sortDirection === "asc" ? leftValue.localeCompare(rightValue) : rightValue.localeCompare(leftValue);
    });
    return nextRows;
  }, [query, rows, sortDirection]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-50">{title}</h1>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <Link href={createHref} className="focus-ring inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950">
          Create new
        </Link>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search collection"
            className="focus-ring w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          />
          <button
            type="button"
            onClick={() => setSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
            className="focus-ring rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200"
          >
            Sort {sortDirection === "asc" ? "A-Z" : "Z-A"}
          </button>
        </div>
        <p className="text-sm text-slate-400">
          {filteredRows.length} results · {selectedIds.length} selected
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/50">
        <table className="min-w-full border-collapse text-left">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-[0.24em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Select</th>
              {columns.map((column) => (
                <th key={column} className="px-5 py-4 font-medium">
                  {column}
                </th>
              ))}
              <th className="px-5 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-800/70 last:border-b-0">
                <td className="px-5 py-4 align-top">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={(event) =>
                      setSelectedIds((current) =>
                        event.target.checked ? [...current, row.id] : current.filter((item) => item !== row.id)
                      )
                    }
                  />
                </td>
                {row.cells.map((cell, index) => (
                  <td key={`${row.id}-${index}`} className="px-5 py-4 align-top text-sm text-slate-200">
                    {index === 0 ? (
                      <Link href={`${editBasePath}/${row.id}`} className="focus-ring font-medium text-cyan-200 hover:text-cyan-100">
                        {cell}
                      </Link>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="px-5 py-4 align-top">
                  <RowActions
                    id={row.id}
                    duplicateUrl={`${actionsBasePath}/duplicate`}
                    deleteUrl={`${actionsBasePath}/delete`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
