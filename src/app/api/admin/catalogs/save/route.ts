import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/server/auth";
import { saveCatalogs } from "@/lib/server/content-store";

export async function POST(request: Request) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await saveCatalogs(body.data);
  return NextResponse.json({ ok: true, data: body.data });
}
