import type { Metadata } from "next";
import { ContactStrip } from "../components";

export const metadata: Metadata = {
  title: "Services",
  description: "Découvrez les services créatifs, audiovisuels et digitaux de Go Digital.",
};

const details = [
  ["01", "Design graphique & branding", "Nous construisons une identité claire et professionnelle, puis nous la déployons sur tous les points de contact de votre marque.", ["Logos professionnels", "Identité visuelle", "Flyers & affiches", "Brochures", "Bannières sociales", "Cartes de visite", "Banderoles", "Supports d'impression"]],
  ["02", "Photographie & vidéographie", "Portrait, événement ou tournage : nous créons des images soignées qui donnent à votre activité la présence qu'elle mérite.", ["Séances photo", "Portraits", "Shooting corporate", "Événements", "Mariages", "Tournage de clips", "Réalisation vidéo"]],
  ["03", "Production audiovisuelle", "De l'idée à la livraison, nous réunissons image, son et narration pour produire des contenus qui retiennent l'attention.", ["Spots publicitaires", "Clips vidéo", "Montage", "Production audio", "Voix off", "Formats réseaux sociaux"]],
  ["04", "Marketing digital", "Nous vous aidons à organiser votre communication et à produire des contenus cohérents pour mieux toucher votre audience.", ["Stratégie de contenu", "Création visuelle", "Campagnes", "Planning éditorial", "Conseil en communication", "Accompagnement"]],
  ["05", "Services numériques", "Nous facilitons l'accès et la prise en main de solutions numériques premium, dans le respect des conditions de chaque plateforme.", ["Conseil & orientation", "Accès à des services premium", "Accompagnement", "Assistance à la prise en main", "Suivi"]],
] as const;

export default function ServicesPage() {
  return (
    <main>
      <section className="inner-hero section-shell">
        <div className="eyebrow"><span /> Nos expertises</div>
        <h1>Une seule agence.<br /><span>Toutes les compétences pour avancer.</span></h1>
        <p>De votre identité à vos campagnes, Go Digital rassemble les expertises essentielles pour construire une communication cohérente et performante.</p>
      </section>
      <div className="page-band">Des solutions adaptées à votre ambition, votre public et votre budget</div>
      <section className="section section-shell service-detail-list">
        {details.map(([number, title, description, items]) => (
          <article className="service-detail" key={number}>
            <span>{number}</span>
            <h2>{title}</h2>
            <div><p>{description}</p><div className="deliverables">{items.map((item) => <span key={item}>{item}</span>)}</div></div>
          </article>
        ))}
      </section>
      <ContactStrip />
    </main>
  );
}
