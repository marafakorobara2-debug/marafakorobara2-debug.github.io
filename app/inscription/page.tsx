import type { Metadata } from "next";
import { RegistrationForm } from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Inscrivez-vous simplement auprès de Go Digital avec votre nom, votre e-mail et votre téléphone.",
};

export default function RegistrationPage() {
  return (
    <main className="account-page section-shell">
      <section className="account-card account-card-welcome">
        <div className="account-visual" aria-hidden="true">
          <span className="account-orbit account-orbit-one" />
          <span className="account-orbit account-orbit-two" />
          <strong>GD</strong>
        </div>
        <div className="account-copy registration-copy">
          <div className="eyebrow"><span /> Inscription Go Digital</div>
          <h1>Rejoignez-nous.<br /><em>C’est très simple.</em></h1>
          <p>Renseignez uniquement votre nom, votre e-mail et votre téléphone.</p>
          <RegistrationForm />
        </div>
      </section>
    </main>
  );
}
