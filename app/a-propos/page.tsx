import type { Metadata } from "next";
import { ContactStrip } from "../components";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez la vision, la méthode et les valeurs de l'agence Go Digital.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="inner-hero section-shell">
        <div className="eyebrow"><span /> Notre histoire</div>
        <h1>La créativité comme moteur.<br /><span>L&apos;impact comme destination.</span></h1>
        <p>Go Digital est une agence créative qui aide les marques, les entreprises et les talents à prendre leur place — avec clarté, caractère et ambition.</p>
      </section>
      <div className="page-band">Stratégie • Création • Production • Accompagnement</div>

      <section className="section section-shell">
        <div className="about-story">
          <div>
            <div className="eyebrow"><span /> Qui sommes-nous ?</div>
            <h2>Bien plus qu&apos;une agence.<br /><span>Un partenaire créatif.</span></h2>
          </div>
          <div className="about-story-copy">
            <p>Go Digital est née d&apos;une conviction simple : une bonne communication ne se contente pas d&apos;être belle. Elle doit être juste, cohérente et capable de faire avancer une marque.</p>
            <p>Nous combinons design graphique, photographie, vidéographie, production audiovisuelle et marketing digital pour proposer un accompagnement complet. Chaque mission est menée avec la même attention, qu&apos;il s&apos;agisse de créer un logo, couvrir un événement ou bâtir tout un univers de marque.</p>
            <p>Notre différence ? Une approche directe, agile et profondément humaine. Nous écoutons avant de créer, nous expliquons avant de produire et nous restons présents jusqu&apos;au résultat final.</p>
          </div>
        </div>
        <div className="stat-row">
          <div><strong>360°</strong><span>Vision créative</span></div>
          <div><strong>05</strong><span>Domaines d&apos;expertise</span></div>
          <div><strong>100%</strong><span>Engagement projet</span></div>
        </div>
      </section>

      <section className="section work-section">
        <div className="section-shell">
          <div className="section-heading centered-heading"><div className="eyebrow"><span /> Nos valeurs</div><h2>Ce qui guide <span>chaque projet.</span></h2></div>
          <div className="values-grid">
            <article className="value-card"><span>01</span><h3>Écoute</h3><p>Comprendre votre réalité pour proposer une réponse qui vous ressemble vraiment.</p></article>
            <article className="value-card"><span>02</span><h3>Exigence</h3><p>Prendre soin du concept comme du dernier détail, sans compromis sur la qualité.</p></article>
            <article className="value-card"><span>03</span><h3>Clarté</h3><p>Des échanges simples, des délais lisibles et un accompagnement sans jargon inutile.</p></article>
            <article className="value-card"><span>04</span><h3>Créativité</h3><p>Refuser les réponses toutes faites pour concevoir des idées qui ont du caractère.</p></article>
            <article className="value-card"><span>05</span><h3>Fiabilité</h3><p>Être présent, réactif et responsable à toutes les étapes de votre projet.</p></article>
            <article className="value-card"><span>06</span><h3>Impact</h3><p>Créer des supports qui servent vos objectifs, pas seulement votre esthétique.</p></article>
          </div>
        </div>
      </section>
      <ContactStrip />
    </main>
  );
}
