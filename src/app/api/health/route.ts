import { NextResponse } from "next/server";

import { getHealthStatus } from "@/lib/server/content-store";

export async function GET() {
  const health = await getHealthStatus();
  return NextResponse.json({
    ok: true,
    health
  });
}
