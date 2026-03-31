"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function CarouselSlide({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[min(100%,min(28rem,92vw))] min-w-[min(100%,min(28rem,92vw))] max-w-lg flex-shrink-0 snap-start",
        className
      )}
    >
      {children}
    </div>
  );
}

export function HorizontalCarousel({
  children,
  ariaLabel,
  prevLabel,
  nextLabel,
  className
}: {
  children: React.ReactNode;
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 2);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollByPage = useCallback((direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(320, Math.floor(el.clientWidth * 0.88));
    const smooth =
      typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction === "next" ? step : -step, behavior: smooth ? "smooth" : "auto" });
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Degradados más estrechos y suaves para no comerse el contenido de las cards */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-8 bg-gradient-to-r from-[var(--background)] from-15% via-[var(--background)]/50 via-50% to-transparent sm:w-10 md:w-12"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-8 bg-gradient-to-l from-[var(--background)] from-15% via-[var(--background)]/50 via-50% to-transparent sm:w-10 md:w-12"
        aria-hidden
      />

      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollByPage("next");
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollByPage("prev");
          }
        }}
        className={cn(
          "relative z-0 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-3 pt-2 sm:px-6 md:px-8",
          "scroll-pl-4 scroll-pr-4 sm:scroll-pl-6 sm:scroll-pr-6 md:scroll-pl-8 md:scroll-pr-8",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {children}
      </div>

      {/* Mismo padding horizontal que el track + margen extra para separar los botones del área del fade */}
      <div className="mt-6 flex items-center justify-end gap-3 px-4 pb-1 pt-1 sm:px-6 md:px-8 md:pl-10 md:pr-14">
        <button
          type="button"
          aria-label={prevLabel}
          disabled={!canPrev}
          onClick={() => scrollByPage("prev")}
          className={cn(
            "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-lg text-cyan-200 transition",
            "hover:border-cyan-400/30 hover:bg-slate-900 hover:text-cyan-50",
            "disabled:pointer-events-none disabled:opacity-35"
          )}
        >
          ‹
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          disabled={!canNext}
          onClick={() => scrollByPage("next")}
          className={cn(
            "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 text-lg text-cyan-200 transition",
            "hover:border-cyan-400/30 hover:bg-slate-900 hover:text-cyan-50",
            "disabled:pointer-events-none disabled:opacity-35"
          )}
        >
          ›
        </button>
      </div>
    </div>
  );
}
