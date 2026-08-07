import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";
import { isAdminUser } from "@/lib/content-store";

export async function requireAdminForApi(): Promise<
  { user: ChatGPTUser; error?: never } | { user?: never; error: Response }
> {
  const user = await getChatGPTUser();
  if (!user) {
    return {
      error: Response.json({ error: "Connexion requise." }, { status: 401 }),
    };
  }
  if (!isAdminUser(user)) {
    return {
      error: Response.json({ error: "Accès administrateur refusé." }, { status: 403 }),
    };
  }
  return { user };
}

export function apiError(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
  return Response.json({ error: message }, { status: 500 });
}
