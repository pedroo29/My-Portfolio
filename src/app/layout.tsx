import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Portfolio Platform",
  description: "Self-hosted bilingual portfolio platform with public evidence and admin editing."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
