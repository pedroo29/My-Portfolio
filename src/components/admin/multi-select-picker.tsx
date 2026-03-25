"use client";

import { useMemo, useState } from "react";

import type { SelectOption } from "@/lib/admin-schemas";
import { cn } from "@/lib/utils";

export function MultiSelectPickerField({
  label,
  description,
  values,
  options,
  onChange,
  addPlaceholder = "Choose an item to add…",
  emptyLabel = "Nothing selected yet."
}: {
  label: string;
  description?: string;
  values: string[];
  options: ReadonlyArray<SelectOption>;
  onChange: (next: string[]) => void;
  addPlaceholder?: string;
  emptyLabel?: string;
}) {
  const [filter, setFilter] = useState("");

  const optionByValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of options) map.set(o.value, o.label);
    return map;
  }, [options]);

  const availableOptions = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return options.filter((o) => {
      if (values.includes(o.value)) return false;
      if (!q) return true;
      return o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q);
    });
  }, [options, values, filter]);

  return (
    <fieldset className="space-y-3 md:col-span-2">
      <legend className="text-sm font-medium text-slate-200">{label}</legend>
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 space-y-2">
          <span className="text-xs text-slate-500">Filter list</span>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Type to narrow options…"
            className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600"
            autoComplete="off"
          />
        </label>
        <label className="min-w-0 flex-1 space-y-2">
          <span className="text-xs text-slate-500">Add</span>
          <select
            key={values.join("|")}
            value=""
            onChange={(event) => {
              const id = event.target.value;
              if (id) onChange([...values, id]);
            }}
            className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="">{availableOptions.length === 0 ? "No matches" : addPlaceholder}</option>
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {values.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-500">{emptyLabel}</p>
      ) : (
        <ul className="space-y-2">
          {values.map((id) => (
            <li
              key={id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-200"
            >
              <span className="min-w-0 truncate">{optionByValue.get(id) ?? id}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((v) => v !== id))}
                className={cn(
                  "focus-ring shrink-0 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300",
                  "hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-100"
                )}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}
