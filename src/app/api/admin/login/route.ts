import { checkAdmin } from "@/lib/store";
import { setSessionCookie } from "@/lib/auth";

const attempts = new Map<string, { count: number; until: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const entry = attempts.get(ip);
  if (entry && entry.until > Date.now() && entry.count >= 8) {
    return Response.json({ error: "Too many attempts. Try again in 10 minutes." }, { status: 429 });
  }
  const { email = "", password = "" } = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  if (!(await checkAdmin(String(email), String(password)))) {
    const next = entry && entry.until > Date.now() ? entry.count + 1 : 1;
    attempts.set(ip, { count: next, until: Date.now() + 10 * 60 * 1000 });
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }
  attempts.delete(ip);
  await setSessionCookie(String(email).trim().toLowerCase());
  return Response.json({ ok: true });
}
