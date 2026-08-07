import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE, createAdminSessionToken, verifyAdminCredentials } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { username?: string; password?: string; returnTo?: string };
    const username = typeof payload.username === "string" ? payload.username.trim().slice(0, 100) : "";
    const password = typeof payload.password === "string" ? payload.password.slice(0, 200) : "";
    if (!(await verifyAdminCredentials(username, password))) {
      return Response.json({ error: "Nom d’utilisateur ou mot de passe incorrect." }, { status: 401 });
    }
    const response = NextResponse.json({ ok: true, returnTo: safeReturnTo(payload.returnTo) });
    response.cookies.set(ADMIN_COOKIE_NAME, await createAdminSessionToken(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: ADMIN_SESSION_MAX_AGE });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connexion impossible.";
    return Response.json({ error: message }, { status: 500 });
  }
}

function safeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  try {
    const url = new URL(value, "https://app.local");
    return url.origin === "https://app.local" ? `${url.pathname}${url.search}${url.hash}` : "/admin";
  } catch {
    return "/admin";
  }
}
