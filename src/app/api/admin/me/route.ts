import { getSession, unauthorized } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  return Response.json({ email: session.email });
}
