import { getSession, unauthorized } from "@/lib/auth";
import { checkAdmin, setAdminPassword } from "@/lib/store";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const { current = "", next = "" } = (await request.json().catch(() => ({}))) as { current?: string; next?: string };
  if (!(await checkAdmin(session.email, current))) return Response.json({ error: "Current password is wrong" }, { status: 400 });
  if (next.length < 8) return Response.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  await setAdminPassword(next);
  return Response.json({ ok: true });
}
