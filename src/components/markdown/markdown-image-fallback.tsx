"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

/** Imagen Markdown `![alt](url)` — el alt solo se muestra si la imagen falla al cargar. */
export function MarkdownRawImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="my-6 block rounded-2xl border border-amber-400/30 bg-amber-950/20 px-4 py-4 text-sm text-amber-100/95">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">Image not available</span>
        {alt ? (
          <span className="mt-2 block leading-relaxed text-slate-200">{alt}</span>
        ) : (
          <span className="mt-2 block text-slate-400">This image could not be loaded.</span>
        )}
      </span>
    );
  }

  return (
    <span className="my-6 block overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || ""} alt={alt || ""} className="w-full object-cover" onError={() => setFailed(true)} />
    </span>
  );
}

/** `{{media:…}}` imagen: alt solo accesible / en fallo; leyenda solo si hay caption explícito. */
export function EmbedImageFigure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [failed, setFailed] = useState(false);
  const showCaption = Boolean(caption?.trim());

  if (failed) {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-amber-400/30 bg-amber-950/20">
        <div className="px-4 py-4 text-sm text-amber-100/95">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">Image not available</span>
          {alt ? <span className="mt-2 block leading-relaxed text-slate-200">{alt}</span> : null}
        </div>
        {showCaption ? (
          <figcaption className="border-t border-amber-500/20 px-4 py-3 text-sm text-slate-400">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn("w-full object-cover", showCaption ? "rounded-t-2xl" : "rounded-2xl")}
        onError={() => setFailed(true)}
      />
      {showCaption ? <figcaption className="px-4 py-3 text-sm text-slate-400">{caption}</figcaption> : null}
    </figure>
  );
}

/** Vídeo embebido: sin texto bajo el reproductor salvo caption explícito; mensaje si falla la carga. */
export function EmbedVideoFigure({ src, caption }: { src: string; caption?: string }) {
  const [failed, setFailed] = useState(false);
  const showCaption = Boolean(caption?.trim());

  if (failed) {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-amber-400/30 bg-amber-950/20">
        <div className="px-4 py-4 text-sm text-amber-100/95">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">Video not available</span>
          <span className="mt-2 block text-slate-300">This video could not be loaded.</span>
        </div>
        {showCaption ? (
          <figcaption className="border-t border-amber-500/20 px-4 py-3 text-sm text-slate-400">{caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
      <video
        src={src}
        controls
        className={cn("w-full", showCaption ? "rounded-t-2xl" : "rounded-2xl")}
        onError={() => setFailed(true)}
      />
      {showCaption ? <figcaption className="px-4 py-3 text-sm text-slate-400">{caption}</figcaption> : null}
    </figure>
  );
}
