import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/public-shell";
import { localeLabels } from "@/lib/constants";
import { locales } from "@/lib/types";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const label = localeLabels[locale as keyof typeof localeLabels] ?? "English";

  return {
    title: `Portfolio Platform | ${label}`,
    description: "Bilingual technical portfolio with labs, roadmap and editorial admin."
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  return <PublicShell locale={locale as "en" | "de"}>{children}</PublicShell>;
}
