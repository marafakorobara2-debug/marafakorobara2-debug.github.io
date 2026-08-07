import Link from "next/link";
import { listServices, type ManagedService } from "@/lib/content-store";
import { ContactStrip, PortfolioGrid, ServiceCard } from "./components";

export const dynamic = "force-dynamic";

const services = [
  {
    index: "01",
    title: "Design graphique & branding",
    description:
      "Des identités visuelles fortes, cohérentes et prêtes à vivre sur tous vos supports.",
    tags: ["Logo", "Identité", "Print"],
    tone: "orange",
  },
  {
    index: "02",
    title: "Photo & vidéographie",
    description:
      "Des images qui captent l'attention et racontent votre histoire avec précision.",
    tags: ["Portrait", "Corporate", "Événement"],
    tone: "blue",
  },
  {
    index: "03",
    title: "Production audiovisuelle",
    description:
      "Du concept au montage final : spots, clips, voix off et contenus de marque.",
    tags: ["Spot", "Clip", "Audio"],
    tone: "violet",
  },
  {
    index: "04",
    title: "Marketing digital",
    description:
      "Une présence digitale claire, régulière et pensée pour générer de l'engagement.",
    tags: ["Contenu", "Campagne", "Conseil"],
    tone: "cyan",
  },
  {
    index: "05",
    title: "Services numériques",
    description:
      "Un accompagnement fiable vers des outils et abonnements premium adaptés.",
    tags: ["Solutions", "Premium", "Support"],
    tone: "green",
  },
];

export default async function Home() {
  let managedServices: ManagedService[] = [];
  try {
    managedServices = await listServices();
  } catch {
    // Le contenu statique reste disponible avant la première migration de la base.
  }
  const displayedServices = managedServices.length > 0
    ? managedServices.map((service, index) => ({
        index: String(index + 1).padStart(2, "0"),
        title: service.title,
        description: service.description,
        tags: service.tags,
        tone: service.tone,
        media: service.media,
      }))
    : services;

  return (
    <>
      <main>
        <section className="hero section-shell">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span /> Agence créative • Bamako & partout</div>
            <h1>
              Votre image mérite<br />
              <span className="text-gradient">d&apos;être remarquable.</span>
            </h1>
            <p className="hero-lead">
              Go Digital transforme vos idées en identités, images et expériences
              digitales qui captent l&apos;attention — et la gardent.
            </p>
            <div className="hero-actions">
              <Link href="/contact#devis" className="button button-primary">
                Demander un devis <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/portfolio" className="button button-ghost">
                Voir nos réalisations <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="hero-proof">
              <div><strong>360°</strong><span>Création & communication</span></div>
              <div><strong>5</strong><span>Expertises réunies</span></div>
              <div><strong>1</strong><span>Partenaire unique</span></div>
            </div>
          </div>

          <div className="hero-visual reveal reveal-delay">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="logo-stage founder-stage">
              <div className="logo-stage-shine" />
              <img
                src="/fondateur-go-digital-camera.jpeg"
                alt="Créatif Go Digital tenant un appareil photo"
                fetchPriority="high"
              />
              <div className="founder-vignette" />
              <div className="founder-caption">
                <small>GO DIGITAL • DIRECTION CRÉATIVE</small>
                <strong>L&apos;image au cœur de chaque projet.</strong>
              </div>
            </div>
            <div className="floating-card floating-card-top">
              <span className="floating-dot orange" />
              <div><small>IDENTITÉ</small><strong>qui marque</strong></div>
            </div>
            <div className="floating-card floating-card-bottom">
              <span className="floating-dot blue" />
              <div><small>CONTENU</small><strong>qui convertit</strong></div>
            </div>
          </div>
        </section>

        <div className="ticker" aria-label="Expertises Go Digital">
          <div className="ticker-track">
            <span>BRANDING</span><i>✦</i><span>PHOTOGRAPHIE</span><i>✦</i>
            <span>VIDÉOGRAPHIE</span><i>✦</i><span>MARKETING DIGITAL</span><i>✦</i>
            <span>PRODUCTION AUDIOVISUELLE</span><i>✦</i><span>BRANDING</span><i>✦</i>
          </div>
        </div>

        <section className="section section-shell" id="services">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span /> Notre savoir-faire</div>
              <h2>Tout ce qu&apos;il faut pour<br /><span>faire rayonner votre marque.</span></h2>
            </div>
            <p>
              Une équipe créative, plusieurs disciplines et une même exigence :
              produire des résultats beaux, utiles et mémorables.
            </p>
          </div>
          <div className="services-grid">
            {displayedServices.map((service) => <ServiceCard key={`${service.index}-${service.title}`} {...service} />)}
          </div>
          <div className="center-action">
            <Link href="/services" className="text-link">Découvrir tous nos services <span>→</span></Link>
          </div>
        </section>

        <section className="section work-section">
          <div className="section-shell">
            <div className="section-heading split-heading">
              <div>
                <div className="eyebrow"><span /> Sélection créative</div>
                <h2>Des projets qui<br /><span>parlent d&apos;eux-mêmes.</span></h2>
              </div>
              <Link href="/portfolio" className="button button-ghost">Explorer le portfolio <span>↗</span></Link>
            </div>
            <PortfolioGrid compact />
          </div>
        </section>

        <section className="section section-shell about-preview">
          <div className="about-art about-photo-collage">
            <div className="about-art-grid" />
            <img
              src="/fondateur-go-digital-boubou.jpeg"
              alt="Portrait professionnel Go Digital en tenue bleue"
              loading="lazy"
            />
            <img
              src="/fondateur-go-digital-bureau.png"
              alt="Go Digital au travail dans un espace professionnel"
              loading="lazy"
            />
            <div className="about-art-badge">Créatif<br />& engagé</div>
          </div>
          <div className="about-copy">
            <div className="eyebrow"><span /> À propos</div>
            <h2>Une agence à taille humaine.<br /><span>Des ambitions sans limite.</span></h2>
            <p>
              Nous réunissons stratégie, design et production pour aider les entreprises,
              les marques et les talents à construire une présence qui inspire confiance.
            </p>
            <p>
              Chez Go Digital, chaque projet commence par une écoute attentive et se termine
              par un résultat pensé pour durer.
            </p>
            <Link href="/a-propos" className="text-link">Découvrir notre vision <span>→</span></Link>
          </div>
        </section>

        <section className="section section-shell process-section">
          <div className="section-heading centered-heading">
            <div className="eyebrow"><span /> Notre méthode</div>
            <h2>Simple. Fluide. <span>Efficace.</span></h2>
          </div>
          <div className="process-grid">
            {[
              ["01", "On vous écoute", "Vos besoins, votre ambition et votre public deviennent notre point de départ."],
              ["02", "On imagine", "Nous créons une direction claire, singulière et fidèle à votre identité."],
              ["03", "On produit", "Design, shooting, tournage ou contenu : chaque détail est maîtrisé."],
              ["04", "Vous rayonnez", "Vous repartez avec des supports prêts à créer de l'impact."],
            ].map(([number, title, text]) => (
              <article className="process-card" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <ContactStrip />
      </main>
    </>
  );
}
