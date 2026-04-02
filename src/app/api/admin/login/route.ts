import { NextResponse } from "next/server";

import { setAdminSessionCookieOnResponse, validateAdminCredentials } from "@/lib/server/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  setAdminSessionCookieOnResponse(response, username.trim());
  return response;
}
