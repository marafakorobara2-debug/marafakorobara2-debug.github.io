import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteFooter, SiteHeader, WhatsAppButton } from "./components";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3001";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "Go Digital — Agence créative à Bamako",
      template: "%s | Go Digital",
    },
    description:
      "Design graphique, photographie, vidéographie, production audiovisuelle et marketing digital à Bamako.",
    icons: {
      icon: "/logo-go-digital.jpeg",
      shortcut: "/logo-go-digital.jpeg",
    },
    openGraph: {
      title: "Go Digital — Créativité. Image. Impact.",
      description: "Votre agence créative 360° à Bamako.",
      type: "website",
      images: [{ url: "/og.png", width: 1730, height: 901, alt: "Go Digital — Créativité. Image. Impact." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Go Digital — Créativité. Image. Impact.",
      description: "Votre agence créative 360° à Bamako.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <div className="site-glow site-glow-one" />
        <div className="site-glow site-glow-two" />
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
