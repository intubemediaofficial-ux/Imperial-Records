import { getSession, unauthorized } from "@/lib/auth";
import { youtubeIdFrom } from "@/lib/siteContent";

export async function GET(request: Request) {
  if (!(await getSession())) return unauthorized();
  const id = youtubeIdFrom(new URL(request.url).searchParams.get("url") || "");
  if (!id) return Response.json({ error: "Not a valid YouTube link" }, { status: 400 });
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`, { cache: "no-store" });
    if (!res.ok) return Response.json({ id, title: "", author: "" });
    const data = (await res.json()) as { title?: string; author_name?: string };
    return Response.json({ id, title: data.title || "", author: data.author_name || "" });
  } catch {
    return Response.json({ id, title: "", author: "" });
  }
}
