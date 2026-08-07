import type { Metadata } from "next";
import { QuoteForm } from "../components";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Go Digital ou demandez un devis pour votre prochain projet.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="section-shell contact-page-grid" style={{ paddingTop: 110 }}>
        <aside className="contact-aside">
          <div className="eyebrow"><span /> Contact</div>
          <h1>Parlons de votre <span className="text-gradient">prochain projet.</span></h1>
          <p>Une idée, un besoin ou un objectif à atteindre ? Écrivez-nous. Nous vous répondrons avec une proposition claire et adaptée.</p>
          <div className="contact-methods">
            <a className="contact-method" href="https://wa.me/22378791269" target="_blank" rel="noreferrer"><i>WA</i><div><span>WhatsApp / Téléphone</span><strong>+223 78 79 12 69</strong></div></a>
            <a className="contact-method" href="mailto:godigital@gmail.com"><i>@</i><div><span>E-mail</span><strong>godigital@gmail.com</strong></div></a>
            <div className="contact-method"><i>ML</i><div><span>Localisation</span><strong>Bamako, Mali</strong></div></div>
          </div>
        </aside>
        <QuoteForm />
      </section>
    </main>
  );
}
