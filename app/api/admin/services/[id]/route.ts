import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { deleteService, updateService } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const id = Number((await context.params).id);
    if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Service invalide." }, { status: 400 });
    const payload = (await request.json()) as {
      title?: string;
      description?: string;
      tags?: string[];
      tone?: string;
      position?: number;
      isPublished?: boolean;
    };
    const title = clean(payload.title, 120);
    if (!title) return Response.json({ error: "Le titre est obligatoire." }, { status: 400 });
    const updated = await updateService(id, {
      title,
      description: clean(payload.description, 700),
      tags: cleanTags(payload.tags),
      tone: cleanTone(payload.tone),
      position: Number.isInteger(payload.position) ? Math.max(0, Number(payload.position)) : 0,
      isPublished: payload.isPublished !== false,
    });
    return updated
      ? Response.json({ ok: true })
      : Response.json({ error: "Service introuvable." }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const id = Number((await context.params).id);
    if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Service invalide." }, { status: 400 });
    const deleted = await deleteService(id);
    return deleted
      ? Response.json({ ok: true })
      : Response.json({ error: "Service introuvable." }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanTags(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((tag): tag is string => typeof tag === "string").map((tag) => tag.trim().slice(0, 30)).filter(Boolean).slice(0, 10)
    : [];
}

function cleanTone(value: unknown): string {
  const tones = new Set(["orange", "blue", "violet", "cyan", "green"]);
  return typeof value === "string" && tones.has(value) ? value : "orange";
}
