import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "L'équipe - L'atelier Strasbourg",
  description: "Rencontrez les passionnés qui font vivre L'atelier, le makerlab associatif de Strasbourg.",
};

export default function MembresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
