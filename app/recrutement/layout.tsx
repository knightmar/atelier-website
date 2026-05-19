import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recrutement - Rejoignez L'atelier",
  description: "Devenez membre de L'atelier à Strasbourg. Apprenez, partagez et fabriquez vos projets avec notre communauté.",
};

export default function RecrutementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
