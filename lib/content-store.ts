import type { ChatGPTUser } from "@/app/chatgpt-auth";
import { getD1, getMediaBucket } from "@/db";

export const ADMIN_EMAIL = "marafakorobara2@gmail.com";
const ADMIN_USER_IDS = new Set(["7db4f689-49f0-43d8-8b6d-4992a3a72b7b"]);

export type MediaKind = "image" | "video";

export type ServiceMediaItem = {
  id: number;
  serviceId: number;
  kind: MediaKind;
  title: string;
  altText: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  position: number;
  url: string;
};

export type ManagedService = {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  tone: string;
  position: number;
  isPublished: boolean;
  media: ServiceMediaItem[];
};

type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string;
  tone: string;
  position: number;
  is_published: number;
};

type MediaRow = {
  id: number;
  service_id: number;
  kind: MediaKind;
  title: string;
  alt_text: string;
  r2_key: string;
  file_name: string;
  content_type: string;
  size_bytes: number;
  position: number;
};

const DEFAULT_SERVICES = [
  {
    slug: "design-graphique-branding",
    title: "Design graphique & branding",
    description: "Des identités visuelles fortes, cohérentes et prêtes à vivre sur tous vos supports.",
    tags: ["Logo", "Identité", "Print"],
    tone: "orange",
    position: 1,
  },
  {
    slug: "photographie-videographie",
    title: "Photographie & vidéographie",
    description: "Des images qui captent l’attention et racontent votre histoire avec précision.",
    tags: ["Portrait", "Corporate", "Événement"],
    tone: "blue",
    position: 2,
  },
  {
    slug: "production-audiovisuelle",
    title: "Production audiovisuelle",
    description: "Du concept au montage final : spots, clips, voix off et contenus de marque.",
    tags: ["Spot", "Clip", "Audio"],
    tone: "violet",
    position: 3,
  },
  {
    slug: "marketing-digital",
    title: "Marketing digital",
    description: "Une présence digitale claire, régulière et pensée pour générer de l’engagement.",
    tags: ["Contenu", "Campagne", "Conseil"],
    tone: "cyan",
    position: 4,
  },
  {
    slug: "services-numeriques",
    title: "Services numériques",
    description: "Un accompagnement fiable vers des outils et abonnements premium adaptés.",
    tags: ["Solutions", "Premium", "Support"],
    tone: "green",
    position: 5,
  },
] as const;

export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isAdminUser(user: Pick<ChatGPTUser, "userId" | "email">): boolean {
  return isAdminEmail(user.email) || ADMIN_USER_IDS.has(user.userId);
}

export async function upsertProfile(user: ChatGPTUser): Promise<void> {
  const d1 = getD1();
  await d1
    .prepare(
      `INSERT INTO profiles (user_id, email, display_name)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         email = excluded.email,
         display_name = excluded.display_name,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(user.userId, user.email.toLowerCase(), user.displayName)
    .run();
}

async function ensureDefaultServices(): Promise<void> {
  const d1 = getD1();
  const row = await d1.prepare("SELECT COUNT(*) AS count FROM services").first<{ count: number }>();
  if ((row?.count ?? 0) > 0) return;

  await d1.batch(
    DEFAULT_SERVICES.map((service) =>
      d1
        .prepare(
          `INSERT OR IGNORE INTO services
           (slug, title, description, tags, tone, position, is_published)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
        )
        .bind(
          service.slug,
          service.title,
          service.description,
          JSON.stringify(service.tags),
          service.tone,
          service.position,
        ),
    ),
  );
}

export async function listServices(options?: { includeUnpublished?: boolean }): Promise<ManagedService[]> {
  await ensureDefaultServices();
  const d1 = getD1();
  const where = options?.includeUnpublished ? "" : "WHERE is_published = 1";
  const serviceResult = await d1
    .prepare(
      `SELECT id, slug, title, description, tags, tone, position, is_published
       FROM services ${where}
       ORDER BY position ASC, id ASC`,
    )
    .all<ServiceRow>();
  const services = serviceResult.results ?? [];
  if (services.length === 0) return [];

  const mediaResult = await d1
    .prepare(
      `SELECT id, service_id, kind, title, alt_text, r2_key, file_name,
              content_type, size_bytes, position
       FROM service_media
       ORDER BY service_id ASC, position ASC, id ASC`,
    )
    .all<MediaRow>();
  const mediaByService = new Map<number, ServiceMediaItem[]>();

  for (const item of mediaResult.results ?? []) {
    const media = mediaByService.get(item.service_id) ?? [];
    media.push({
      id: item.id,
      serviceId: item.service_id,
      kind: item.kind,
      title: item.title,
      altText: item.alt_text,
      fileName: item.file_name,
      contentType: item.content_type,
      sizeBytes: item.size_bytes,
      position: item.position,
      url: `/api/media/${item.id}`,
    });
    mediaByService.set(item.service_id, media);
  }

  return services.map((service) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    description: service.description,
    tags: parseTags(service.tags),
    tone: service.tone,
    position: service.position,
    isPublished: service.is_published === 1,
    media: mediaByService.get(service.id) ?? [],
  }));
}

export async function createService(input: {
  title: string;
  description: string;
  tags: string[];
  tone: string;
}): Promise<number> {
  const d1 = getD1();
  const positionRow = await d1
    .prepare("SELECT COALESCE(MAX(position), 0) + 1 AS position FROM services")
    .first<{ position: number }>();
  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;
  const result = await d1
    .prepare(
      `INSERT INTO services (slug, title, description, tags, tone, position, is_published)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
    )
    .bind(
      slug,
      input.title,
      input.description,
      JSON.stringify(input.tags),
      input.tone,
      positionRow?.position ?? 1,
    )
    .run();
  return Number(result.meta.last_row_id);
}

export async function updateService(
  id: number,
  input: {
    title: string;
    description: string;
    tags: string[];
    tone: string;
    position: number;
    isPublished: boolean;
  },
): Promise<boolean> {
  const result = await getD1()
    .prepare(
      `UPDATE services SET
         title = ?, description = ?, tags = ?, tone = ?, position = ?,
         is_published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
    .bind(
      input.title,
      input.description,
      JSON.stringify(input.tags),
      input.tone,
      input.position,
      input.isPublished ? 1 : 0,
      id,
    )
    .run();
  return result.meta.changes > 0;
}

export async function deleteService(id: number): Promise<boolean> {
  const d1 = getD1();
  const media = await d1
    .prepare("SELECT r2_key FROM service_media WHERE service_id = ?")
    .bind(id)
    .all<{ r2_key: string }>();
  const bucket = getMediaBucket();
  const keys = (media.results ?? []).map((item) => item.r2_key);
  if (keys.length > 0) await bucket.delete(keys);
  const result = await d1.prepare("DELETE FROM services WHERE id = ?").bind(id).run();
  return result.meta.changes > 0;
}

export async function addServiceMedia(input: {
  serviceId: number;
  file: File;
  title: string;
  altText: string;
}): Promise<number> {
  const kind: MediaKind = input.file.type.startsWith("video/") ? "video" : "image";
  const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-100) || "media";
  const r2Key = `services/${input.serviceId}/${crypto.randomUUID()}-${safeName}`;
  const bucket = getMediaBucket();
  await bucket.put(r2Key, await input.file.arrayBuffer(), {
    httpMetadata: { contentType: input.file.type },
    customMetadata: { serviceId: String(input.serviceId), kind },
  });

  try {
    const positionRow = await getD1()
      .prepare(
        "SELECT COALESCE(MAX(position), 0) + 1 AS position FROM service_media WHERE service_id = ?",
      )
      .bind(input.serviceId)
      .first<{ position: number }>();
    const result = await getD1()
      .prepare(
        `INSERT INTO service_media
         (service_id, kind, title, alt_text, r2_key, file_name, content_type, size_bytes, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        input.serviceId,
        kind,
        input.title,
        input.altText,
        r2Key,
        input.file.name,
        input.file.type,
        input.file.size,
        positionRow?.position ?? 1,
      )
      .run();
    return Number(result.meta.last_row_id);
  } catch (error) {
    await bucket.delete(r2Key);
    throw error;
  }
}

export async function deleteServiceMedia(id: number): Promise<boolean> {
  const d1 = getD1();
  const row = await d1
    .prepare("SELECT r2_key FROM service_media WHERE id = ?")
    .bind(id)
    .first<{ r2_key: string }>();
  if (!row) return false;
  await getMediaBucket().delete(row.r2_key);
  const result = await d1.prepare("DELETE FROM service_media WHERE id = ?").bind(id).run();
  return result.meta.changes > 0;
}

export async function getMediaObject(id: number): Promise<{
  object: R2ObjectBody;
  contentType: string;
  fileName: string;
} | null> {
  const row = await getD1()
    .prepare("SELECT r2_key, content_type, file_name FROM service_media WHERE id = ?")
    .bind(id)
    .first<{ r2_key: string; content_type: string; file_name: string }>();
  if (!row) return null;
  const object = await getMediaBucket().get(row.r2_key);
  if (!object) return null;
  return { object, contentType: row.content_type, fileName: row.file_name };
}

function parseTags(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "service";
}
