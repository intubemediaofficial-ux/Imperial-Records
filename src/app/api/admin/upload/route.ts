import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getSession, unauthorized } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/store";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(request: Request) {
  if (!(await getSession())) return unauthorized();
  const form = await request.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return Response.json({ error: "No file" }, { status: 400 });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const ext = ALLOWED[file.type];
    if (!ext) return Response.json({ error: `Unsupported file type: ${file.name}` }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return Response.json({ error: `${file.name} is larger than 15MB` }, { status: 400 });
    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${name}`);
  }
  return Response.json({ urls });
}
