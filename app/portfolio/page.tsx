import type { Metadata } from "next";
import { ContactStrip, PortfolioGrid } from "../components";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explorez les univers créatifs et les domaines de réalisation de Go Digital.",
};

export default function PortfolioPage() {
  return (
    <main>
      <section className="inner-hero compact section-shell">
        <div className="eyebrow"><span /> Nos réalisations</div>
        <h1>Les idées prennent vie.<br /><span>Et laissent une trace.</span></h1>
        <p>Découvrez un aperçu de nos univers de création. Vos photos, vidéos, logos et projets réels pourront ensuite remplacer ou compléter cette sélection.</p>
      </section>
      <section className="section section-shell" style={{ paddingTop: 30 }}>
        <PortfolioGrid />
      </section>
      <ContactStrip />
    </main>
  );
}
