import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Humia — Générez vos Syllabus et Programmes de Formation par IA",
  description:
    "Créez des syllabus professionnels et programmes de formation conformes en quelques minutes grâce à l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="overflow-x-hidden">
      <body className={`${inter.variable} antialiased overflow-x-hidden`}>{children}</body>
    </html>
  );
}
