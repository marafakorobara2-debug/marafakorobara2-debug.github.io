import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { deleteServiceMedia } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const id = Number((await context.params).id);
    if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Média invalide." }, { status: 400 });
    const deleted = await deleteServiceMedia(id);
    return deleted
      ? Response.json({ ok: true })
      : Response.json({ error: "Média introuvable." }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
