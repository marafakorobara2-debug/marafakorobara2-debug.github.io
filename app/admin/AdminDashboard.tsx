"use client";

import { FormEvent, useState } from "react";
import type { ManagedService, VisitorRegistration } from "@/lib/content-store";

const tones = ["orange", "blue", "violet", "cyan", "green"];

export function AdminDashboard({
  initialServices,
  initialRegistrations,
}: {
  initialServices: ManagedService[];
  initialRegistrations: VisitorRegistration[];
}) {
  const [services, setServices] = useState(initialServices);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const response = await fetch("/api/admin/services", { cache: "no-store" });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error || "Impossible d’actualiser les services.");
    setServices(data.services as ManagedService[]);
  }

  async function refreshRegistrations() {
    const response = await fetch("/api/admin/registrations", { cache: "no-store" });
    const data = await readJson(response);
    if (!response.ok) throw new Error(data.error || "Impossible d’actualiser les inscriptions.");
    setRegistrations(data.registrations as VisitorRegistration[]);
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.get("title"),
          description: data.get("description"),
          tags: String(data.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
          tone: data.get("tone"),
        }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Création impossible.");
      form.reset();
      await refresh();
      setNotice("Le nouveau service a été créé.");
    } catch (caught) {
      setError(messageFrom(caught));
    } finally {
      setCreating(false);
    }
  }

  async function removeService(service: ManagedService) {
    if (!window.confirm(`Supprimer « ${service.title} » et tous ses médias ?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, { method: "DELETE" });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Suppression impossible.");
      await refresh();
      setNotice("Le service a été supprimé.");
    } catch (caught) {
      setError(messageFrom(caught));
    }
  }

  async function removeRegistration(registration: VisitorRegistration) {
    if (!window.confirm(`Supprimer l’inscription de ${registration.name} ?`)) return;
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/registrations/${registration.id}`, { method: "DELETE" });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Suppression impossible.");
      await refreshRegistrations();
      setNotice("L’inscription a été supprimée.");
    } catch (caught) {
      setError(messageFrom(caught));
    }
  }

  return (
    <div className="admin-dashboard">
      {(notice || error) && (
        <div className={`admin-notice ${error ? "is-error" : ""}`} role="status">
          {error || notice}
        </div>
      )}

      <section className="admin-panel create-service-panel">
        <div className="admin-panel-heading">
          <div><span>01</span><h2>Ajouter un service</h2></div>
          <p>Le service apparaîtra immédiatement sur le site dès sa création.</p>
        </div>
        <form className="admin-create-form" onSubmit={create}>
          <label><span>Nom du service</span><input name="title" required placeholder="Ex. Impression grand format" /></label>
          <label><span>Couleur</span><select name="tone" defaultValue="orange">{tones.map((tone) => <option value={tone} key={tone}>{tone}</option>)}</select></label>
          <label className="admin-wide"><span>Description</span><textarea name="description" required rows={3} placeholder="Décrivez clairement ce service…" /></label>
          <label className="admin-wide"><span>Mots-clés (séparés par des virgules)</span><input name="tags" placeholder="Logo, Identité, Print" /></label>
          <button type="submit" className="button button-primary" disabled={creating}>{creating ? "Création…" : "Créer le service"} <span>+</span></button>
        </form>
      </section>

      <section className="admin-services-section">
        <div className="admin-panel-heading">
          <div><span>02</span><h2>Gérer les services et médias</h2></div>
          <p>{services.length} service{services.length > 1 ? "s" : ""} enregistré{services.length > 1 ? "s" : ""}</p>
        </div>
        <div className="admin-service-list">
          {services.map((service) => (
            <ServiceEditor
              key={service.id}
              service={service}
              onChanged={async (message) => { await refresh(); setError(""); setNotice(message); }}
              onError={(message) => { setNotice(""); setError(message); }}
              onRemove={() => removeService(service)}
            />
          ))}
        </div>
      </section>

      <section className="admin-services-section admin-registrations-section">
        <div className="admin-panel-heading">
          <div><span>03</span><h2>Personnes inscrites</h2></div>
          <p>{registrations.length} inscription{registrations.length > 1 ? "s" : ""}</p>
        </div>
        {registrations.length === 0 ? (
          <div className="registration-empty">Les nouvelles inscriptions apparaîtront ici.</div>
        ) : (
          <div className="registration-table-wrap">
            <table className="registration-table">
              <thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Date</th><th /></tr></thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td><strong>{registration.name}</strong></td>
                    <td><a href={`mailto:${registration.email}`}>{registration.email}</a></td>
                    <td><a href={`tel:${registration.phone}`}>{registration.phone}</a></td>
                    <td>{formatDate(registration.createdAt)}</td>
                    <td><button type="button" onClick={() => removeRegistration(registration)}>Supprimer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function ServiceEditor({
  service,
  onChanged,
  onError,
  onRemove,
}: {
  service: ManagedService;
  onChanged: (message: string) => Promise<void>;
  onError: (message: string) => void;
  onRemove: () => void;
}) {
  const [title, setTitle] = useState(service.title);
  const [description, setDescription] = useState(service.description);
  const [tags, setTags] = useState(service.tags.join(", "));
  const [tone, setTone] = useState(service.tone);
  const [position, setPosition] = useState(service.position);
  const [published, setPublished] = useState(service.isPublished);
  const [busy, setBusy] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("save");
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          tone,
          position,
          isPublished: published,
        }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Enregistrement impossible.");
      await onChanged(`« ${title} » a été mis à jour.`);
    } catch (caught) {
      onError(messageFrom(caught));
    } finally {
      setBusy("");
    }
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("serviceId", String(service.id));
    setBusy("upload");
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Ajout du média impossible.");
      form.reset();
      await onChanged(`Le média a été ajouté à « ${title} ».`);
    } catch (caught) {
      onError(messageFrom(caught));
    } finally {
      setBusy("");
    }
  }

  async function removeMedia(id: number) {
    if (!window.confirm("Supprimer définitivement ce média ?")) return;
    setBusy(`media-${id}`);
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.error || "Suppression impossible.");
      await onChanged("Le média a été supprimé.");
    } catch (caught) {
      onError(messageFrom(caught));
    } finally {
      setBusy("");
    }
  }

  return (
    <article className={`admin-service-card tone-${tone}`}>
      <div className="admin-service-titlebar">
        <div><span className="service-position">{String(service.position).padStart(2, "0")}</span><h3>{service.title}</h3></div>
        <span className={`publish-state ${published ? "is-live" : ""}`}><i />{published ? "Visible" : "Masqué"}</span>
      </div>

      <form className="admin-edit-form" onSubmit={save}>
        <label><span>Nom</span><input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
        <label><span>Position</span><input type="number" min="0" value={position} onChange={(event) => setPosition(Number(event.target.value))} /></label>
        <label><span>Couleur</span><select value={tone} onChange={(event) => setTone(event.target.value)}>{tones.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label className="admin-wide"><span>Description</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="admin-wide"><span>Mots-clés</span><input value={tags} onChange={(event) => setTags(event.target.value)} /></label>
        <label className="publish-toggle"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>Afficher ce service sur le site</span></label>
        <div className="admin-form-actions">
          <button type="submit" className="button button-primary" disabled={Boolean(busy)}>{busy === "save" ? "Enregistrement…" : "Enregistrer"}</button>
          <button type="button" className="danger-link" onClick={onRemove} disabled={Boolean(busy)}>Supprimer le service</button>
        </div>
      </form>

      <div className="media-manager">
        <div className="media-manager-heading"><h4>Photos et vidéos</h4><span>{service.media.length} média{service.media.length > 1 ? "s" : ""}</span></div>
        {service.media.length > 0 && (
          <div className="admin-media-grid">
            {service.media.map((media) => (
              <figure key={media.id}>
                {media.kind === "video" ? (
                  <video src={media.url} controls preload="metadata" />
                ) : (
                  <img src={media.url} alt={media.altText || media.title || service.title} loading="lazy" />
                )}
                <figcaption><span>{media.title || media.fileName}</span><button type="button" onClick={() => removeMedia(media.id)} disabled={Boolean(busy)}>{busy === `media-${media.id}` ? "…" : "Supprimer"}</button></figcaption>
              </figure>
            ))}
          </div>
        )}
        <form className="media-upload-form" onSubmit={upload}>
          <label className="file-drop"><span>Choisir une photo ou une vidéo</span><input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime" required /></label>
          <label><span>Titre</span><input name="title" placeholder="Ex. Shooting corporate Bamako" /></label>
          <label><span>Texte alternatif de la photo</span><input name="altText" placeholder="Décrivez brièvement l’image" /></label>
          <button type="submit" className="button button-ghost" disabled={Boolean(busy)}>{busy === "upload" ? "Envoi en cours…" : "Ajouter le média"} <span>↑</span></button>
          <small>JPG, PNG, WebP, GIF, MP4, WebM ou MOV — 50 Mo maximum.</small>
        </form>
      </div>
    </article>
  );
}

type ApiPayload = {
  error?: string;
  services?: ManagedService[];
  registrations?: VisitorRegistration[];
  [key: string]: unknown;
};

async function readJson(response: Response): Promise<ApiPayload> {
  try {
    return (await response.json()) as ApiPayload;
  } catch {
    return {};
  }
}

function messageFrom(value: unknown): string {
  return value instanceof Error ? value.message : "Une erreur inattendue est survenue.";
}

function formatDate(value: string): string {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}
