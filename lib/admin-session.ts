import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "gd_admin_session";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;

type AdminAuthEnvironment = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
};

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const config = getConfig();
  const passwordHash = await sha256(password);
  return secureEqual(username, config.username) && secureEqual(passwordHash, config.passwordHash);
}

export async function createAdminSessionToken(): Promise<string> {
  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const payload = `admin.${expiresAt}`;
  const signature = await sign(payload, getConfig().sessionSecret);
  return `${payload}.${signature}`;
}

export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const expiresAt = Number(parts[1]);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = await sign(payload, getConfig().sessionSecret);
  return secureEqual(parts[2], expected);
}

function getConfig(): { username: string; passwordHash: string; sessionSecret: string } {
  const values = env as typeof env & AdminAuthEnvironment;
  const username = values.ADMIN_USERNAME?.trim();
  const passwordHash = values.ADMIN_PASSWORD_HASH?.trim().toLowerCase();
  const sessionSecret = values.ADMIN_SESSION_SECRET?.trim();
  if (!username || !passwordHash || !sessionSecret) {
    throw new Error("La connexion administrateur n’est pas encore configurée.");
  }
  return { username, passwordHash, sessionSecret };
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64Url(new Uint8Array(signature));
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function secureEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < maxLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}
