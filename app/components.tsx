"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const phone = "22378791269";
const navItems = [
  ["Accueil", "/"],
  ["À propos", "/a-propos"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="Go Digital — Accueil" onClick={() => setOpen(false)}>
          <span className="brand-mark"><img src="/logo-go-digital.jpeg" alt="" /></span>
          <span className="brand-name">GO <b>DIGITAL</b><small>AGENCE CRÉATIVE</small></span>
        </Link>
        <button
          className={`menu-toggle ${open ? "is-open" : ""}`}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navigation principale">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/contact#devis" className="nav-cta" onClick={() => setOpen(false)}>
            Demander un devis <span>↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand" aria-label="Go Digital — Accueil">
            <span className="brand-mark"><img src="/logo-go-digital.jpeg" alt="" /></span>
            <span className="brand-name">GO <b>DIGITAL</b><small>AGENCE CRÉATIVE</small></span>
          </Link>
          <p>Des idées qui se voient.<br />Des images qui restent.</p>
        </div>
        <div className="footer-links">
          <div><h3>Navigation</h3>{navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
          <div><h3>Contact</h3><a href={`tel:+${phone}`}>+223 78 79 12 69</a><a href="mailto:godigital@gmail.com">godigital@gmail.com</a><span>Bamako, Mali</span></div>
          <div><h3>Parlons de votre projet</h3><a className="footer-whatsapp" href={`https://wa.me/${phone}?text=${encodeURIComponent("Bonjour Go Digital, j'aimerais parler de mon projet.")}`} target="_blank" rel="noreferrer">Écrire sur WhatsApp <span>↗</span></a></div>
        </div>
      </div>
      <div className="section-shell footer-bottom"><span>© 2026 Go Digital. Tous droits réservés.</span><span>Créé pour faire la différence.</span></div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${phone}?text=${encodeURIComponent("Bonjour Go Digital, je souhaite obtenir plus d'informations.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter Go Digital sur WhatsApp"
    >
      <span>WA</span><i>Discutons</i>
    </a>
  );
}

type ServiceCardProps = {
  index: string;
  title: string;
  description: string;
  tags: string[];
  tone: string;
};

export function ServiceCard({ index, title, description, tags, tone }: ServiceCardProps) {
  return (
    <article className={`service-card tone-${tone}`}>
      <div className="service-card-top"><span className="service-index">{index}</span><span className="service-arrow">↗</span></div>
      <div className="service-symbol" aria-hidden="true"><span>{title.charAt(0)}</span></div>
      <h3>{title}</h3><p>{description}</p>
      <div className="tag-row">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  );
}

const projects = [
  { title: "Identité en mouvement", category: "Branding", code: "ID—01", tone: "project-orange", label: "GO / BRAND" },
  { title: "Portraits de leadership", category: "Photographie", code: "PH—02", tone: "project-blue", label: "FOCUS" },
  { title: "Campagne qui connecte", category: "Marketing digital", code: "MK—03", tone: "project-violet", label: "REACH+" },
  { title: "Histoires en grand écran", category: "Vidéo", code: "AV—04", tone: "project-cyan", label: "PLAY ▶" },
  { title: "Packaging à fort impact", category: "Design graphique", code: "DG—05", tone: "project-yellow", label: "BOLD" },
  { title: "Voix, rythme, émotion", category: "Production audio", code: "AU—06", tone: "project-green", label: "WAVE" },
];

export function PortfolioGrid({ compact = false }: { compact?: boolean }) {
  const categories = ["Tout", "Branding", "Photographie", "Vidéo", "Digital"];
  const [filter, setFilter] = useState("Tout");
  const visibleProjects = useMemo(() => {
    if (filter === "Tout") return compact ? projects.slice(0, 4) : projects;
    if (filter === "Digital") return projects.filter((project) => project.category.includes("Marketing"));
    return projects.filter((project) => project.category.includes(filter));
  }, [filter, compact]);

  return (
    <>
      {!compact && (
        <div className="portfolio-filters" role="group" aria-label="Filtrer les projets">
          {categories.map((category) => (
            <button key={category} onClick={() => setFilter(category)} className={filter === category ? "active" : ""}>{category}</button>
          ))}
        </div>
      )}
      <div className={`portfolio-grid ${compact ? "compact" : ""}`}>
        {visibleProjects.map((project, index) => (
          <article className={`project-card ${project.tone}`} key={project.code}>
            <div className="project-visual">
              <span className="project-code">{project.code}</span>
              <div className="project-grid-lines" />
              <strong>{project.label}</strong>
              <span className="project-orb" />
            </div>
            <div className="project-meta"><div><span>{project.category}</span><h3>{project.title}</h3></div><i>{String(index + 1).padStart(2, "0")} ↗</i></div>
          </article>
        ))}
      </div>
    </>
  );
}

export function ContactStrip() {
  return (
    <section className="contact-strip">
      <div className="contact-strip-glow" />
      <div className="section-shell contact-strip-inner">
        <div><span>Vous avez une idée ?</span><h2>Faisons-en quelque chose<br /><em>d&apos;inoubliable.</em></h2></div>
        <div className="contact-strip-actions">
          <Link href="/contact#devis" className="button button-light">Démarrer un projet <span>↗</span></Link>
          <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer">ou nous écrire sur WhatsApp →</a>
        </div>
      </div>
    </section>
  );
}

export function QuoteForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Bonjour Go Digital, je souhaite demander un devis.",
      `Nom : ${data.get("name")}`,
      `Téléphone : ${data.get("phone")}`,
      `Service : ${data.get("service")}`,
      `Projet : ${data.get("message")}`,
    ].join("\n");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} id="devis">
      <div className="form-heading"><span>Parlez-nous de votre projet</span><h2>Demander un devis</h2><p>Quelques informations suffisent. Votre demande sera préparée et ouverte dans WhatsApp.</p></div>
      <div className="form-grid">
        <label><span>Votre nom *</span><input name="name" required placeholder="Ex. Aminata Traoré" /></label>
        <label><span>Téléphone / WhatsApp *</span><input name="phone" type="tel" required placeholder="Ex. +223 70 00 00 00" /></label>
        <label className="form-full"><span>Service souhaité *</span><select name="service" required defaultValue=""><option value="" disabled>Choisir un service</option><option>Design graphique & branding</option><option>Photographie & vidéographie</option><option>Production audiovisuelle</option><option>Marketing digital</option><option>Services numériques</option></select></label>
        <label className="form-full"><span>Décrivez votre projet *</span><textarea name="message" required rows={5} placeholder="Votre objectif, le livrable souhaité, le délai..." /></label>
      </div>
      <button className="button button-primary form-submit" type="submit">Envoyer sur WhatsApp <span>↗</span></button>
      {sent && <p className="form-note" role="status">Votre message est prêt dans WhatsApp.</p>}
    </form>
  );
}
