"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ConnectionForm() {
  const searchParams = useSearchParams();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password"), returnTo: searchParams.get("return_to") || "/admin" }),
      });
      const payload = (await response.json()) as { error?: string; returnTo?: string };
      if (!response.ok) throw new Error(payload.error || "Connexion impossible.");
      window.location.assign(payload.returnTo || "/admin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Connexion impossible.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="registration-form admin-login-form" onSubmit={submit}>
      <label><span>Nom d’utilisateur</span><input name="username" required autoComplete="username" placeholder="Votre nom d’utilisateur" /></label>
      <label><span>Mot de passe</span><input name="password" type="password" required autoComplete="current-password" placeholder="Votre mot de passe" /></label>
      <button type="submit" className="button button-primary" disabled={sending}>{sending ? "Connexion…" : "Se connecter"} <span>→</span></button>
      {error && <p className="registration-error" role="alert">{error}</p>}
      <small>Accès réservé à l’administrateur Go Digital.</small>
    </form>
  );
}
