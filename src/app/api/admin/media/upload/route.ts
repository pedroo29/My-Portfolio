import { writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getMediaDirectory, registerMedia } from "@/lib/server/content-store";
import { requireAdminApiSession } from "@/lib/server/auth";

export async function POST(request: Request) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files").filter((entry): entry is File => entry instanceof File);
  const uploadedAssets = [];

  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(getMediaDirectory(), fileName);
    await writeFile(filePath, bytes);

    const asset = {
      id: `media-${Date.now()}-${file.name}`,
      fileName,
      url: `/api/media/${fileName}`,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      alt: {
        en: file.name,
        de: file.name
      },
      caption: {
        en: file.name,
        de: file.name
      },
      labIds: [],
      createdAt: new Date().toISOString()
    };

    await registerMedia(asset);
    uploadedAssets.push(asset);
  }

  return NextResponse.json({ ok: true, data: uploadedAssets });
}
