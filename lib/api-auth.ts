import { hasAdminSession } from "@/lib/admin-session";

export async function requireAdminForApi(): Promise<
  { authenticated: true; error?: never } | { authenticated?: never; error: Response }
> {
  if (!(await hasAdminSession())) {
    return {
      error: Response.json({ error: "Connexion requise." }, { status: 401 }),
    };
  }
  return { authenticated: true };
}

export function apiError(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
  return Response.json({ error: message }, { status: 500 });
}
