import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/server/auth";
import { saveGlobalResource } from "@/lib/server/content-store";

const allowedKeys = ["home", "about", "contact", "privacy"] as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  if (!allowedKeys.includes(key as (typeof allowedKeys)[number])) {
    return NextResponse.json({ ok: false, message: "Invalid resource" }, { status: 400 });
  }

  const body = (await request.json()) as { data: { version?: number }; expectedVersion: number };
  const result = await saveGlobalResource(key as "home" | "about" | "contact" | "privacy", body.data, body.expectedVersion);

  if (!result.ok) {
    return NextResponse.json(result, { status: 409 });
  }

  return NextResponse.json(result);
}
