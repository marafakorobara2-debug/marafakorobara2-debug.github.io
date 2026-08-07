import { apiError } from "@/lib/api-auth";
import { registerVisitor } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    };

    if (clean(payload.company, 100)) return Response.json({ ok: true });

    const name = clean(payload.name, 100);
    const email = clean(payload.email, 160).toLowerCase();
    const phone = clean(payload.phone, 30);

    if (name.length < 2) {
      return Response.json({ error: "Veuillez indiquer votre nom." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Veuillez indiquer une adresse e-mail valide." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 7) {
      return Response.json({ error: "Veuillez indiquer un numéro de téléphone valide." }, { status: 400 });
    }

    await registerVisitor({ name, email, phone });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
