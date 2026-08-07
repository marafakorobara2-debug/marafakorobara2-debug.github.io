import type { Metadata } from "next";
import Link from "next/link";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import { isAdminUser, listRegistrations, listServices, upsertProfile } from "@/lib/content-store";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  description: "Gestion sécurisée des contenus Go Digital.",
};

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  await upsertProfile(user);

  if (!isAdminUser(user)) {
    return (
      <main className="account-page section-shell">
        <section className="account-card access-denied">
          <span className="status-badge status-danger">Accès refusé</span>
          <h1>Cet espace est réservé à l’administrateur Go Digital.</h1>
          <p>Le compte connecté ({user.email}) n’a pas les droits nécessaires.</p>
          <div className="profile-actions">
            <Link href="/" className="button button-primary">Retour à l’accueil</Link>
            <Link href={chatGPTSignOutPath("/admin")} className="button button-ghost">Changer de compte</Link>
          </div>
        </section>
      </main>
    );
  }

  const [services, registrations] = await Promise.all([
    listServices({ includeUnpublished: true }),
    listRegistrations(),
  ]);

  return (
    <main className="admin-page section-shell">
      <header className="admin-heading">
        <div>
          <div className="eyebrow"><span /> Tableau de bord sécurisé</div>
          <h1>Administration<br /><em>Go Digital</em></h1>
          <p>Modifiez les services et ajoutez vos photos ou vidéos sans toucher au code.</p>
        </div>
        <div className="admin-account">
          <span>Connecté en tant que</span>
          <strong>{user.displayName}</strong>
          <small>{user.email}</small>
          <Link href={chatGPTSignOutPath("/")}>Se déconnecter</Link>
        </div>
      </header>
      <AdminDashboard initialServices={services} initialRegistrations={registrations} />
    </main>
  );
}
