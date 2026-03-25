import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Locale, MediaAsset } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  locale?: Locale;
  mediaAssets?: MediaAsset[];
  className?: string;
}

function MediaEmbed({
  asset,
  locale,
  captionOverride
}: {
  asset?: MediaAsset;
  locale: Locale;
  captionOverride?: string;
}) {
  if (!asset) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm text-amber-100">
        Media embed not found. Check the media ID used in the documentation.
      </div>
    );
  }

  const caption = captionOverride || asset.caption[locale] || asset.fileName;

  if (asset.mimeType.startsWith("video/")) {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
        <video src={asset.url} controls className="w-full rounded-t-2xl" />
        <figcaption className="px-4 py-3 text-sm text-slate-400">{caption}</figcaption>
      </figure>
    );
  }

  if (asset.mimeType.startsWith("image/")) {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.alt[locale] || asset.fileName} className="w-full rounded-t-2xl object-cover" />
        <figcaption className="px-4 py-3 text-sm text-slate-400">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <a href={asset.url} target="_blank" className="text-sm font-medium text-cyan-200 hover:text-cyan-100">
        Open media file
      </a>
      <figcaption className="mt-3 text-sm text-slate-400">{caption}</figcaption>
    </figure>
  );
}

function MarkdownChunk({
  content,
  className
}: {
  content: string;
  className?: string;
}) {
  if (!content.trim()) {
    return null;
  }

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mt-8 text-4xl font-semibold text-slate-50 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mt-8 text-3xl font-semibold text-slate-50">{children}</h2>,
          h3: ({ children }) => <h3 className="mt-6 text-2xl font-semibold text-slate-100">{children}</h3>,
          h4: ({ children }) => <h4 className="mt-5 text-xl font-semibold text-slate-100">{children}</h4>,
          p: ({ children }) => <p className="my-4 leading-8 text-slate-300">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-cyan-200 underline decoration-cyan-400/30 underline-offset-4 hover:text-cyan-100"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-slate-300">{children}</ul>,
          ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-slate-300">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-cyan-400/40 pl-4 italic text-slate-300">{children}</blockquote>
          ),
          hr: () => <hr className="my-8 border-slate-800" />,
          code: ({ className, children }) =>
            className ? (
              <code className={cn("block overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-200", className)}>
                {children}
              </code>
            ) : (
              <code className="rounded bg-slate-900 px-1.5 py-1 text-sm text-cyan-100">{children}</code>
            ),
          pre: ({ children }) => <pre className="my-6 overflow-x-auto">{children}</pre>,
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-slate-800">
              <table className="min-w-full border-collapse text-left text-sm text-slate-300">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-950/80 text-slate-100">{children}</thead>,
          th: ({ children }) => <th className="border-b border-slate-800 px-4 py-3 font-medium">{children}</th>,
          td: ({ children }) => <td className="border-b border-slate-800 px-4 py-3 align-top">{children}</td>,
          img: ({ src, alt }) => (
            <span className="my-6 block overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src || ""} alt={alt || ""} className="w-full object-cover" />
              {alt ? <span className="block px-4 py-3 text-sm text-slate-400">{alt}</span> : null}
            </span>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function parseMediaToken(token: string) {
  const match = token.trim().match(/^\{\{media:([^}|]+)(?:\|([^}]+))?\}\}$/);

  if (!match) {
    return undefined;
  }

  return {
    mediaId: match[1]?.trim(),
    caption: match[2]?.trim()
  };
}

export function MarkdownRenderer({
  content,
  locale = "en",
  mediaAssets = [],
  className
}: MarkdownRendererProps) {
  const segments = content.split(/(\{\{media:[^}]+\}\})/g);

  return (
    <div className={cn("prose-copy", className)}>
      {segments.map((segment, index) => {
        const embed = parseMediaToken(segment);

        if (embed?.mediaId) {
          return (
            <MediaEmbed
              key={`media-${embed.mediaId}-${index}`}
              asset={mediaAssets.find((asset) => asset.id === embed.mediaId)}
              locale={locale}
              captionOverride={embed.caption}
            />
          );
        }

        return <MarkdownChunk key={`markdown-${index}`} content={segment} />;
      })}
    </div>
  );
}
