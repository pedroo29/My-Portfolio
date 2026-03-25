import "server-only";

import crypto from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const sessionCookieName = "portfolio_admin_session";

function getSecret() {
  return process.env.ADMIN_SECRET || "change-me-locally";
}

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123"
  };
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function makeToken(username: string) {
  return `${username}.${sign(username)}`;
}

function verifyToken(token?: string) {
  if (!token) return false;
  const [username, signature] = token.split(".");
  return Boolean(username && signature && sign(username) === signature);
}

export async function createSession(username: string, password: string) {
  const valid = getCredentials();

  if (username !== valid.username || password !== valid.password) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, makeToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return true;
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
