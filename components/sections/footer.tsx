import Image from "next/image";
import { FOOTER_LINKS, NAV_LINKS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-[#e2e8f0] bg-[#f8fafc]">
      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand column */}
          <div className="md:col-span-1">
            <a href="#">
              <Image
                src="/logo.png"
                alt="Humia"
                width={400}
                height={400}
                className="h-24 w-auto"
              />
            </a>
            <p className="mt-4 text-lg font-semibold text-[#0f172a]">
              Vos formations méritent mieux qu&apos;un fichier Word.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#0f172a]/50">
              L&apos;IA qui génère des syllabus conformes Qualiopi en quelques minutes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#0f172a]/40">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#0f172a]/60 transition-colors hover:text-[#1b17ff]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA + Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#0f172a]/40">
              Commencer
            </h4>
            <p className="mb-4 text-sm text-[#0f172a]/60">
              Essayez Humia gratuitement avec 5 crédits par mois.
            </p>
            <ButtonLink href="#contact" size="lg">
              Prendre RDV
            </ButtonLink>

            <h4 className="mb-3 mt-8 text-sm font-bold uppercase tracking-wider text-[#0f172a]/40">
              Légal
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#0f172a]/40 transition-colors hover:text-[#0f172a]/70"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#e2e8f0]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <p className="text-xs text-[#0f172a]/30">
            &copy; 2026 Humia. Tous droits réservés.
          </p>
          <p className="text-xs text-[#0f172a]/30">
            Fait avec passion en France
          </p>
        </div>
      </div>
    </footer>
  );
}
