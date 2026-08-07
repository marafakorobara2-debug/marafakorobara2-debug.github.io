import { apiError, requireAdminForApi } from "@/lib/api-auth";
import { addServiceMedia } from "@/lib/content-store";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request: Request) {
  const auth = await requireAdminForApi();
  if (auth.error) return auth.error;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const serviceId = Number(formData.get("serviceId"));
    if (!(file instanceof File) || file.size === 0) {
      return Response.json({ error: "Choisissez une photo ou une vidéo." }, { status: 400 });
    }
    if (!Number.isInteger(serviceId) || serviceId < 1) {
      return Response.json({ error: "Service invalide." }, { status: 400 });
    }
    if (!ACCEPTED_TYPES.has(file.type)) {
      return Response.json({ error: "Format non accepté. Utilisez JPG, PNG, WebP, GIF, MP4, WebM ou MOV." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: "Le fichier dépasse la limite de 50 Mo." }, { status: 400 });
    }
    const id = await addServiceMedia({
      serviceId,
      file,
      title: clean(formData.get("title"), 120),
      altText: clean(formData.get("altText"), 180),
    });
    return Response.json({ id, url: `/api/media/${id}` }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

function clean(value: FormDataEntryValue | null, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
