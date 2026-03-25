import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getMediaDirectory, readStore } from "@/lib/server/content-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileName: string }> }
) {
  const { fileName } = await params;
  const filePath = path.join(getMediaDirectory(), fileName);

  try {
    const file = await readFile(filePath);
    const store = await readStore();
    const asset = store.media.find((item) => item.fileName === fileName);
    return new NextResponse(file, {
      headers: {
        "Content-Type": asset?.mimeType ?? "application/octet-stream"
      }
    });
  } catch {
    return NextResponse.json({ ok: false, message: "File not found" }, { status: 404 });
  }
}
