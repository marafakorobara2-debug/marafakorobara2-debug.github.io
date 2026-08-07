"use client";

import { FormEvent, useState } from "react";

export function RegistrationForm() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setSuccess(false);
    setError("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Inscription impossible.");
      form.reset();
      setSuccess(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="registration-success" role="status">
        <span>✓</span>
        <div><strong>Inscription réussie !</strong><p>Merci. Vos informations ont bien été enregistrées.</p></div>
      </div>
    );
  }

  return (
    <form className="registration-form" onSubmit={submit}>
      <label><span>Nom complet</span><input name="name" required autoComplete="name" placeholder="Votre nom" /></label>
      <label><span>Adresse e-mail</span><input name="email" type="email" required autoComplete="email" placeholder="vous@email.com" /></label>
      <label><span>Téléphone / WhatsApp</span><input name="phone" type="tel" required autoComplete="tel" placeholder="Ex. +223 70 00 00 00" /></label>
      <label className="honey-field" aria-hidden="true"><span>Entreprise</span><input name="company" tabIndex={-1} autoComplete="off" /></label>
      <button type="submit" className="button button-primary" disabled={sending}>{sending ? "Inscription…" : "S’inscrire"} <span>→</span></button>
      {error && <p className="registration-error" role="alert">{error}</p>}
      <small>Aucun compte ChatGPT et aucun mot de passe ne sont nécessaires.</small>
    </form>
  );
}
