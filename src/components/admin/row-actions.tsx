"use client";

import { useRouter } from "next/navigation";

export function RowActions({
  duplicateUrl,
  deleteUrl,
  id
}: {
  duplicateUrl: string;
  deleteUrl: string;
  id: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          await fetch(duplicateUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          router.refresh();
        }}
        className="focus-ring rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-200"
      >
        Duplicate
      </button>
      <button
        type="button"
        onClick={async () => {
          if (!window.confirm("Delete this item?")) return;
          await fetch(deleteUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          router.refresh();
        }}
        className="focus-ring rounded-full border border-rose-400/30 px-3 py-2 text-xs text-rose-100"
      >
        Delete
      </button>
    </div>
  );
}
