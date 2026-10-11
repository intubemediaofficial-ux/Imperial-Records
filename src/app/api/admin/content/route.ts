import { revalidatePath } from "next/cache";
import { getSession, unauthorized } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/store";
import type { SiteContent } from "@/lib/siteContent";

export async function GET() {
  if (!(await getSession())) return unauthorized();
  return Response.json(await getContent());
}

export async function PUT(request: Request) {
  if (!(await getSession())) return unauthorized();
  const body = (await request.json().catch(() => null)) as SiteContent | null;
  if (!body || typeof body !== "object" || !body.settings || !Array.isArray(body.releases) || !Array.isArray(body.categories)) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }
  await saveContent(body);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
