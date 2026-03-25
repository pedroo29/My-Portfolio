"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { defaultLocale, localeLabels } from "@/lib/constants";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

function swapLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${locale}`;
  }

  if (segments[0] === "en" || segments[0] === "de") {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  const result = `/${segments.join("/")}`;
  return locale === defaultLocale ? result : result;
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-2 py-2">
      <span className="hidden px-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500 xl:inline-flex">
        Lang
      </span>
      {Object.entries(localeLabels).map(([code, label]) => {
        const targetLocale = code as Locale;
        return (
          <Link
            key={code}
            href={swapLocale(pathname, targetLocale)}
            className={cn(
              "focus-ring rounded-full border px-3 py-2 text-xs transition",
              targetLocale === locale
                ? "border-cyan-400/50 bg-cyan-400/15 font-medium text-cyan-100"
                : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
