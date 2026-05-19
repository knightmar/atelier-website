import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - L'atelier Strasbourg",
  description: "Une question ? Un projet ? Contactez L'atelier, votre espace de fabrication numérique à Strasbourg.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
