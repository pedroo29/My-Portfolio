"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { MultiSelectPickerField } from "@/components/admin/multi-select-picker";
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer";
import { MarkdownField } from "@/components/admin/markdown-field";
import type { AdminSection, SelectOption } from "@/lib/admin-schemas";
import { adminShortcutHints } from "@/lib/constants";
import type { MediaAsset } from "@/lib/types";
import { cn, joinLines, parseLines } from "@/lib/utils";

type SaveResponse = {
  ok: boolean;
  data?: unknown;
  current?: unknown;
  message?: string;
};

function getNestedValue(source: unknown, path: string) {
  return path.split(".").reduce<unknown>((carry, key) => (carry && typeof carry === "object" ? (carry as Record<string, unknown>)[key] : undefined), source);
}

function setNestedValue<T>(source: T, path: string, value: unknown): T {
  const clone = structuredClone(source) as Record<string, unknown>;
  const segments = path.split(".");
  let cursor: Record<string, unknown> = clone;

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      cursor[segment] = value;
      return;
    }

    if (!cursor[segment] || typeof cursor[segment] !== "object") {
      cursor[segment] = {};
    }

    cursor = cursor[segment] as Record<string, unknown>;
  });

  return clone as T;
}

function stringifyKeyValueList(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return "";
      const record = entry as Record<string, unknown>;
      return `${record.label ?? ""} | ${record.url ?? record.value ?? ""}`;
    })
    .filter(Boolean)
    .join("\n");
}

function parseKeyValueList(value: string, path: string) {
  return parseLines(value).map((line) => {
    const [label, secondary] = line.split("|").map((item) => item.trim());
    if (path === "metrics") {
      return { label, value: secondary ?? "" };
    }
    return { label, url: secondary ?? "" };
  });
}

function PreviewValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return <p className="text-sm text-slate-300">{value.join(", ") || "Empty"}</p>;
  }
  if (typeof value === "boolean") {
    return <p className="text-sm text-slate-300">{value ? "Yes" : "No"}</p>;
  }
  if (typeof value === "object" && value) {
    return <pre className="overflow-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-slate-300">{JSON.stringify(value, null, 2)}</pre>;
  }
  return <p className="text-sm text-slate-300">{String(value ?? "") || "Empty"}</p>;
}

function inferLocaleFromPath(path: string) {
  return path.includes(".de.") ? "de" : "en";
}

export function StructuredEditor<T extends { id?: string; version?: number }>({
  title,
  description,
  backHref,
  saveUrl,
  deleteUrl,
  duplicateUrl,
  sections,
  optionsMap,
  initialValue,
  storageKey,
  mediaAssets = []
}: {
  title: string;
  description: string;
  backHref: string;
  saveUrl: string;
  deleteUrl?: string;
  duplicateUrl?: string;
  sections: ReadonlyArray<AdminSection>;
  optionsMap: Record<string, SelectOption[]>;
  initialValue: T;
  storageKey: string;
  mediaAssets?: MediaAsset[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<T>(initialValue);
  const [jsonDraft, setJsonDraft] = useState(JSON.stringify(initialValue, null, 2));
  const [mode, setMode] = useState<"form" | "preview" | "json">("form");
  const [message, setMessage] = useState<{ tone: "success" | "warning" | "danger"; text: string } | null>(null);
  const [baseline, setBaseline] = useState(JSON.stringify(initialValue));

  const isDirty = useMemo(() => JSON.stringify(draft) !== baseline, [baseline, draft]);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(storageKey);
    if (savedMode === "form" || savedMode === "preview" || savedMode === "json") {
      setMode(savedMode);
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, mode);
  }, [mode, storageKey]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [isDirty]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }

      if (event.key === "Escape" && isDirty) {
        event.preventDefault();
        if (window.confirm("Discard unsaved changes?")) {
          setDraft(JSON.parse(baseline));
          setJsonDraft(JSON.stringify(JSON.parse(baseline), null, 2));
          setMessage({ tone: "warning", text: "Unsaved changes discarded." });
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [baseline, isDirty]);

  const submit = async () => {
    let payload = draft;

    if (mode === "json") {
      try {
        payload = JSON.parse(jsonDraft) as T;
      } catch {
        setMessage({ tone: "danger", text: "JSON fallback is invalid. Fix it before saving." });
        return;
      }
    }

    const response = await fetch(saveUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: payload,
        expectedVersion: draft.version ?? 0
      })
    });

    const result = (await response.json()) as SaveResponse;

    if (!result.ok) {
      const conflictText = result.current
        ? "A newer version exists. Reload the latest content or merge your changes manually."
        : result.message ?? "Save failed.";
      setMessage({ tone: "danger", text: conflictText });

      if (result.current) {
        setDraft(result.current as T);
        setJsonDraft(JSON.stringify(result.current, null, 2));
        setBaseline(JSON.stringify(result.current));
      }

      return;
    }

    const savedData = result.data as T;
    setDraft(savedData);
    setJsonDraft(JSON.stringify(savedData, null, 2));
    setBaseline(JSON.stringify(savedData));
    setMessage({ tone: "success", text: "Changes saved successfully." });

    if (pathname.endsWith("/new") && savedData.id) {
      router.replace(pathname.replace(/\/new$/, `/${savedData.id}`));
    } else {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!deleteUrl || !draft.id) return;
    if (!window.confirm("Delete this item? This action cannot be undone.")) return;

    const response = await fetch(deleteUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: draft.id })
    });

    if (response.ok) {
      router.push(backHref);
      router.refresh();
    }
  };

  const handleDuplicate = async () => {
    if (!duplicateUrl || !draft.id) return;

    const response = await fetch(duplicateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: draft.id })
    });

    if (response.ok) {
      setMessage({ tone: "success", text: "Item duplicated. Return to the list to open the copy." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <a href={backHref} className="focus-ring inline-flex text-sm text-cyan-200 hover:text-cyan-100">
            Back to list
          </a>
          <h1 className="text-3xl font-semibold text-slate-50">{title}</h1>
          <p className="max-w-3xl text-sm text-slate-400">{description}</p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["form", "preview", "json"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={cn(
                  "focus-ring rounded-full border px-4 py-2 text-sm",
                  item === mode
                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
                    : "border-slate-700 text-slate-300"
                )}
              >
                {item === "json" ? "JSON fallback" : item[0].toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <div className="text-right text-xs text-slate-500">
            {adminShortcutHints.map((hint) => (
              <p key={hint}>{hint}</p>
            ))}
          </div>
        </div>
      </div>

      {message ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            message.tone === "success" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
            message.tone === "warning" && "border-amber-400/20 bg-amber-400/10 text-amber-100",
            message.tone === "danger" && "border-rose-400/20 bg-rose-400/10 text-rose-100"
          )}
        >
          {message.text}
        </div>
      ) : null}

      <form
        ref={formRef}
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(() => {
            void submit();
          });
        }}
      >
        {mode === "json" ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <textarea
              value={jsonDraft}
              onChange={(event) => setJsonDraft(event.target.value)}
              className="focus-ring min-h-[560px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-100"
            />
          </div>
        ) : null}

        {mode === "preview" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <div key={section.title} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
                <div className="mb-4 space-y-1">
                  <h2 className="text-lg font-semibold text-slate-50">{section.title}</h2>
                  {section.description ? <p className="text-sm text-slate-400">{section.description}</p> : null}
                </div>
                <div className="space-y-4">
                  {section.fields.map((field) => (
                    <div key={`${section.title}::${field.path}`} className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{field.label}</p>
                      {field.type === "markdown" ? (
                        <MarkdownRenderer
                          content={String(getNestedValue(draft, field.path) ?? "")}
                          locale={inferLocaleFromPath(field.path)}
                          mediaAssets={mediaAssets}
                        />
                      ) : (
                        <PreviewValue value={getNestedValue(draft, field.path)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {mode === "form" ? (
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
                <div className="mb-5 space-y-1">
                  <h2 className="text-lg font-semibold text-slate-50">{section.title}</h2>
                  {section.description ? <p className="text-sm text-slate-400">{section.description}</p> : null}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {section.fields.map((field) => {
                    const fieldKey = `${section.title}::${field.path}`;
                    const value = getNestedValue(draft, field.path);
                    const options = field.options ?? (field.optionsKey ? optionsMap[field.optionsKey] : undefined) ?? [];

                    if (field.type === "markdown") {
                      return (
                        <MarkdownField
                          key={fieldKey}
                          label={field.label}
                          value={String(value ?? "")}
                          locale={inferLocaleFromPath(field.path)}
                          mediaAssets={mediaAssets}
                          onChange={(nextValue) => setDraft((current) => setNestedValue(current, field.path, nextValue))}
                        />
                      );
                    }

                    if (field.type === "textarea" || field.type === "stringArray" || field.type === "keyValueList") {
                      const textValue =
                        field.type === "stringArray"
                          ? joinLines(Array.isArray(value) ? (value as string[]) : [])
                          : field.type === "keyValueList"
                            ? stringifyKeyValueList(value)
                            : String(value ?? "");

                      return (
                        <label key={fieldKey} className="space-y-2 md:col-span-2">
                          <span className="text-sm font-medium text-slate-200">{field.label}</span>
                          <textarea
                            value={textValue}
                            onChange={(event) => {
                              const nextValue =
                                field.type === "stringArray"
                                  ? parseLines(event.target.value)
                                  : field.type === "keyValueList"
                                    ? parseKeyValueList(event.target.value, field.path)
                                    : event.target.value;
                              setDraft((current) => setNestedValue(current, field.path, nextValue));
                            }}
                            className="focus-ring min-h-[144px] w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                          />
                        </label>
                      );
                    }

                    if (field.type === "select") {
                      return (
                        <label
                          key={fieldKey}
                          className={cn("space-y-2", field.fullWidth && "md:col-span-2")}
                        >
                          <span className="text-sm font-medium text-slate-200">{field.label}</span>
                          <select
                            value={String(value ?? "")}
                            onChange={(event) => setDraft((current) => setNestedValue(current, field.path, event.target.value))}
                            className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                          >
                            <option value="">Select</option>
                            {options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    }

                    if (field.type === "multiSelect") {
                      const values = Array.isArray(value) ? (value as string[]) : [];

                      if (field.multiSelectUi === "picker") {
                        return (
                          <MultiSelectPickerField
                            key={fieldKey}
                            label={field.label}
                            description={field.description}
                            values={values}
                            options={options}
                            onChange={(nextValues) => setDraft((current) => setNestedValue(current, field.path, nextValues))}
                          />
                        );
                      }

                      return (
                        <fieldset key={fieldKey} className="space-y-3 md:col-span-2">
                          <legend className="text-sm font-medium text-slate-200">{field.label}</legend>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {options.map((option, index) => {
                              const checked = values.includes(option.value);
                              return (
                                <label
                                  key={`${field.path}-${option.value}-${index}`}
                                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-slate-200"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                      const nextValues = event.target.checked
                                        ? [...values, option.value]
                                        : values.filter((item) => item !== option.value);
                                      setDraft((current) => setNestedValue(current, field.path, nextValues));
                                    }}
                                  />
                                  <span>{option.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </fieldset>
                      );
                    }

                    if (field.type === "checkbox") {
                      return (
                        <label
                          key={fieldKey}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200",
                            field.fullWidth && "md:col-span-2"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(event) => setDraft((current) => setNestedValue(current, field.path, event.target.checked))}
                          />
                          <span>{field.label}</span>
                        </label>
                      );
                    }

                    return (
                      <label
                        key={fieldKey}
                        className={cn(
                          "space-y-2",
                          field.fullWidth && "md:col-span-2 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.06] p-4"
                        )}
                      >
                        <span className="text-sm font-medium text-slate-200">{field.label}</span>
                        {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}
                        <input
                          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                          value={String(value ?? "")}
                          min={field.type === "number" && field.path === "order" ? 1 : undefined}
                          step={field.type === "number" && field.path === "order" ? 1 : undefined}
                          onChange={(event) =>
                            setDraft((current) =>
                              setNestedValue(current, field.path, field.type === "number" ? Number(event.target.value) : event.target.value)
                            )
                          }
                          className="focus-ring w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
          <button
            type="submit"
            disabled={isPending}
            className="focus-ring rounded-full bg-cyan-400 px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isDirty || window.confirm("Discard unsaved changes?")) {
                const next = JSON.parse(baseline) as T;
                setDraft(next);
                setJsonDraft(JSON.stringify(next, null, 2));
                setMessage({ tone: "warning", text: "Unsaved changes discarded." });
              }
            }}
            className="focus-ring rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200"
          >
            Discard
          </button>
          {duplicateUrl ? (
            <button type="button" onClick={handleDuplicate} className="focus-ring rounded-full border border-slate-700 px-5 py-3 text-sm text-slate-200">
              Duplicate
            </button>
          ) : null}
          {deleteUrl ? (
            <button
              type="button"
              onClick={handleDelete}
              className="focus-ring rounded-full border border-rose-400/30 px-5 py-3 text-sm text-rose-100"
            >
              Delete
            </button>
          ) : null}
          {isDirty ? <span className="self-center text-sm text-amber-200">Unsaved changes detected.</span> : null}
        </div>
      </form>
    </div>
  );
}
