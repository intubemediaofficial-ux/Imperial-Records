import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "ir_admin";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return s;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email: string; exp: number };
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(email: string) {
  (await cookies()).set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
