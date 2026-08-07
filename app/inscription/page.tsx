import type { Metadata } from "next";
import Link from "next/link";
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
} from "../chatgpt-auth";
import { isAdminUser, upsertProfile } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Créez votre compte Go Digital ou accédez à votre espace.",
};

export default async function RegistrationPage() {
  const user = await getChatGPTUser();

  if (!user) {
    return (
      <main className="account-page section-shell">
        <section className="account-card account-card-welcome">
          <div className="account-visual" aria-hidden="true">
            <span className="account-orbit account-orbit-one" />
            <span className="account-orbit account-orbit-two" />
            <strong>GD</strong>
          </div>
          <div className="account-copy">
            <div className="eyebrow"><span /> Espace Go Digital</div>
            <h1>Créez votre compte.<br /><em>Restons connectés.</em></h1>
            <p>
              Inscrivez-vous en toute sécurité avec votre compte ChatGPT pour accéder
              à votre profil Go Digital.
            </p>
            <Link className="button button-primary account-button" href={chatGPTSignInPath("/inscription") }>
              Créer mon compte / Se connecter <span>→</span>
            </Link>
            <small>Aucun mot de passe supplémentaire à retenir.</small>
          </div>
        </section>
      </main>
    );
  }

  await upsertProfile(user);
  const admin = isAdminUser(user);

  return (
    <main className="account-page section-shell">
      <section className="account-card account-profile">
        <div className="profile-avatar" aria-hidden="true">
          {user.displayName.trim().charAt(0).toUpperCase() || "G"}
        </div>
        <div className="profile-copy">
          <span className="status-badge"><i /> Compte actif</span>
          <h1>Bonjour, {user.displayName}</h1>
          <p>{user.email}</p>
          <div className="profile-actions">
            {admin && (
              <Link href="/admin" className="button button-primary">
                Ouvrir l’administration <span>→</span>
              </Link>
            )}
            <Link href={chatGPTSignOutPath("/")} className="button button-ghost">
              Se déconnecter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
