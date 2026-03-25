import { NextResponse } from "next/server";

import { createSession } from "@/lib/server/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const success = await createSession(body.username ?? "", body.password ?? "");

  if (!success) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
