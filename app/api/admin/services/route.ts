import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { createService, listServices } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    return Response.json({ services: await listServices({ includeUnpublished: true }) });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const payload = (await request.json()) as {
      title?: string;
      description?: string;
      tags?: string[];
      tone?: string;
    };
    const title = clean(payload.title, 120);
    if (!title) return Response.json({ error: "Le titre est obligatoire." }, { status: 400 });
    const id = await createService({
      title,
      description: clean(payload.description, 700),
      tags: cleanTags(payload.tags),
      tone: cleanTone(payload.tone),
    });
    return Response.json({ id }, { status: 201 });
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
