import type { Metadata } from "next";
import { ConnectionForm } from "./ConnectionForm";

export const metadata: Metadata = { title: "Connexion administrateur", description: "Connexion sécurisée à l’administration Go Digital." };

export default function ConnectionPage() {
  return (
    <main className="account-page section-shell">
      <section className="account-card account-card-welcome login-card">
        <div className="account-visual" aria-hidden="true"><span className="account-orbit account-orbit-one" /><span className="account-orbit account-orbit-two" /><strong>GD</strong></div>
        <div className="account-copy login-copy">
          <div className="eyebrow"><span /> Accès privé</div>
          <h1>Connexion<br /><em>administrateur.</em></h1>
          <p>Cette page est réservée à la gestion du site Go Digital.</p>
          <ConnectionForm />
        </div>
      </section>
    </main>
  );
}
