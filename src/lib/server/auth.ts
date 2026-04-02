import "server-only";

import crypto from "node:crypto";

import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "portfolio_admin_session";

function trimEnv(value: string | undefined, fallback: string): string {
  return (value ?? fallback).trim();
}

function getSecret() {
  return trimEnv(process.env.ADMIN_SECRET, "change-me-locally");
}

function getCredentials() {
  return {
    username: trimEnv(process.env.ADMIN_USERNAME, "admin"),
    password: trimEnv(process.env.ADMIN_PASSWORD, "admin123")
  };
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function makeSessionToken(username: string) {
  return `${username}.${sign(username)}`;
}

function verifyToken(token?: string) {
  if (!token) return false;
  const [username, signature] = token.split(".");
  return Boolean(username && signature && sign(username) === signature);
}

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30
};

/**
 * Comprueba usuario/contraseña (con trim). Usado en el login API.
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  const valid = getCredentials();
  const u = username.trim();
  const p = password.trim();
  return u === valid.username && p === valid.password;
}

/**
 * Fija la cookie de sesión en la respuesta del route handler.
 * Más fiable en Next.js que `cookies().set()` solo desde algunos contextos.
 */
export function setAdminSessionCookieOnResponse(response: NextResponse, username: string) {
  response.cookies.set(sessionCookieName, makeSessionToken(username), sessionCookieOptions);
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!verifyToken(token)) {
    redirect("/admin/login");
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(sessionCookieName)?.value);
}

export async function requireAdminApiSession() {
  const authenticated = await isAdminAuthenticated();
  return authenticated;
}
