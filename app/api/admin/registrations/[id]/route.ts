import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { deleteRegistration } from "@/lib/content-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const id = Number((await context.params).id);
    if (!Number.isInteger(id) || id < 1) {
      return Response.json({ error: "Inscription invalide." }, { status: 400 });
    }
    const deleted = await deleteRegistration(id);
    return deleted
      ? Response.json({ ok: true })
      : Response.json({ error: "Inscription introuvable." }, { status: 404 });
  } catch (error) {
    return apiError(error);
  }
}
