import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-session";
import { listRegistrations, listServices } from "@/lib/content-store";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Administration", description: "Gestion sécurisée des contenus Go Digital." };

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/connexion?return_to=/admin");
  const [services, registrations] = await Promise.all([listServices({ includeUnpublished: true }), listRegistrations()]);
  return (
    <main className="admin-page section-shell">
      <header className="admin-heading">
        <div>
          <div className="eyebrow"><span /> Tableau de bord sécurisé</div>
          <h1>Administration<br /><em>Go Digital</em></h1>
          <p>Modifiez les services et ajoutez vos photos ou vidéos sans toucher au code.</p>
        </div>
        <div className="admin-account">
          <span>Connecté en tant que</span><strong>Administrateur Go Digital</strong><small>Accès privé</small>
          <form action="/api/admin/logout" method="post"><button type="submit">Se déconnecter</button></form>
        </div>
      </header>
      <AdminDashboard initialServices={services} initialRegistrations={registrations} />
    </main>
  );
}
