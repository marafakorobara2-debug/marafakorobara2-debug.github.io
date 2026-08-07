import { getMediaObject } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const id = Number((await context.params).id);
  if (!Number.isInteger(id) || id < 1) return new Response("Média invalide", { status: 400 });
  try {
    const result = await getMediaObject(id);
    if (!result) return new Response("Média introuvable", { status: 404 });
    const headers = new Headers({
      "content-type": result.contentType,
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
      "content-disposition": `inline; filename="${result.fileName.replace(/["\r\n]/g, "")}"`,
    });
    if (result.object.httpEtag) headers.set("etag", result.object.httpEtag);
    return new Response(result.object.body, { headers });
  } catch {
    return new Response("Média indisponible", { status: 503 });
  }
}
