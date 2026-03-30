"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LocaleSwitcher } from "@/components/locale-switcher";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "", label: "Home" },
  { href: "/labs", label: "Labs" },
  { href: "/skills", label: "Skills" },
  { href: "/certifications", label: "Certifications" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

function isActivePath(pathname: string, locale: Locale, href: string) {
  const target = `/${locale}${href}`;

  if (href === "") {
    return pathname === `/${locale}`;
  }

  return pathname === target || pathname.startsWith(`${target}/`);
}

function NavItem({
  locale,
  href,
  label,
  pathname,
  mobile = false,
  onNavigate
}: {
  locale: Locale;
  href: string;
  label: string;
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const active = isActivePath(pathname, locale, href);

  return (
    <Link
      href={`/${locale}${href}`}
      onClick={onNavigate}
      className={cn(
        "focus-ring transition",
        mobile
          ? "block rounded-2xl border px-4 py-3 text-sm"
          : "rounded-full px-3 py-2 text-sm",
        active
          ? "soft-glow border-cyan-400/30 bg-cyan-400/10 font-medium text-cyan-100"
          : mobile
            ? "border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-100"
            : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

export function PublicHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const mobileNavId = useId();
  const checkboxId = `mobile-nav-${mobileNavId.replace(/:/g, "")}`;
  /** Checkbox controlado + <label htmlFor>: el SO maneja el toque (fiable en iOS); el estado sincroniza panel y scroll. */
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const activeLabel = useMemo(
    () => navigation.find((item) => isActivePath(pathname, locale, item.href))?.label ?? "Home",
    [locale, pathname]
  );

  return (
    <header className="sticky top-0 z-50 isolate border-b border-slate-800/80 bg-slate-950/95 max-lg:bg-slate-950 max-lg:backdrop-blur-none lg:bg-slate-950/80 lg:backdrop-blur lg:reveal-up">
      <div className="container-shell py-4">
        <input
          key={pathname}
          id={checkboxId}
          type="checkbox"
          className="sr-only"
          aria-controls="mobile-navigation"
          checked={mobileNavOpen}
          onChange={(e) => setMobileNavOpen(e.target.checked)}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link href={`/${locale}`} className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-100">
              Portfolio Platform
            </Link>
            <span className="ambient-float hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100 md:inline-flex">
              {activeLabel}
            </span>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LocaleSwitcher locale={locale} />
            <Link
              href="/admin"
              className="focus-ring interactive-lift soft-glow inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-cyan-100 hover:border-cyan-300/50 hover:bg-cyan-400/15"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Admin
            </Link>
          </div>

          <div className="relative h-11 min-w-[5.75rem] shrink-0 lg:hidden">
            <label
              htmlFor={checkboxId}
              className={cn(
                "focus-ring absolute inset-0 flex cursor-pointer touch-manipulation select-none items-center justify-center gap-2 rounded-full border border-slate-700 px-4 text-sm text-slate-200",
                mobileNavOpen && "pointer-events-none invisible"
              )}
            >
              Menu
              <span className="text-cyan-200" aria-hidden>
                ≡
              </span>
            </label>
            <label
              htmlFor={checkboxId}
              className={cn(
                "focus-ring absolute inset-0 flex cursor-pointer touch-manipulation select-none items-center justify-center gap-2 rounded-full border border-slate-700 px-4 text-sm text-slate-200",
                !mobileNavOpen && "pointer-events-none invisible"
              )}
            >
              Close
              <span className="text-cyan-200" aria-hidden>
                ×
              </span>
            </label>
          </div>
        </div>

        <div className="mt-4 hidden border-t border-slate-800/80 pt-4 lg:block">
          <nav className="flex flex-wrap items-center justify-center gap-3 xl:gap-4">
            {navigation.map((item) => (
              <NavItem key={item.href || "home"} locale={locale} href={item.href} label={item.label} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile"
          aria-hidden={!mobileNavOpen}
          className={cn(
            "mt-4 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/95 p-4 lg:hidden",
            !mobileNavOpen && "hidden"
          )}
        >
          <div className="grid gap-3">
            {navigation.map((item) => (
              <NavItem
                key={`mobile-${item.href || "home"}`}
                locale={locale}
                href={item.href}
                label={item.label}
                pathname={pathname}
                mobile
                onNavigate={() => setMobileNavOpen(false)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <LocaleSwitcher locale={locale} />
            <Link
              href="/admin"
              onClick={() => setMobileNavOpen(false)}
              className="focus-ring interactive-lift inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-100 hover:border-cyan-300/50 hover:bg-cyan-400/15"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
