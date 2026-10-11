import { addEnquiry } from "@/lib/store";

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (clean(body.website)) return Response.json({ ok: true });
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 30);
  if (!name || !phone) return Response.json({ error: "Name and phone are required" }, { status: 400 });
  const enquiry = await addEnquiry({
    name,
    phone,
    email: clean(body.email, 160),
    city: clean(body.city, 120),
    subject: clean(body.subject, 120),
    link: clean(body.link, 400),
    message: clean(body.message, 3000),
  });
  return Response.json({ ok: true, id: enquiry.id });
}
