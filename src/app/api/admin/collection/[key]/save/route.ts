import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/server/auth";
import { saveCollectionEntity } from "@/lib/server/content-store";
import type { CollectionKey } from "@/lib/types";

const allowedKeys: CollectionKey[] = ["labs", "skills", "certifications", "roadmapPhases", "roadmapMilestones"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!allowedKeys.includes(key as CollectionKey)) {
    return NextResponse.json({ ok: false, message: "Invalid collection" }, { status: 400 });
  }

  const body = (await request.json()) as { data: { version?: number }; expectedVersion: number };
  const result = await saveCollectionEntity(key as CollectionKey, body.data, body.expectedVersion);

  if (!result.ok) {
    return NextResponse.json(result, { status: 409 });
  }

  return NextResponse.json({ ok: true, data: result.data });
}
