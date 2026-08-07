import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { listRegistrations } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    return Response.json({ registrations: await listRegistrations() });
  } catch (error) {
    return apiError(error);
  }
}
