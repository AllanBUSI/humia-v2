import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";
import { ButtonLink } from "@/components/ui";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#e2e8f0] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-28">
        <a href="#">
          <Image
            src="/logo.png"
            alt="Humia"
            width={400}
            height={400}
            className="h-28 w-auto"
            priority
          />
        </a>

        <div className="hidden items-center gap-8 text-sm text-[#0f172a]/60 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#0f172a]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="text-sm font-medium text-[#0f172a]/60 transition-colors hover:text-[#0f172a]"
          >
            Connexion
          </a>
          <ButtonLink href="#contact">Prendre RDV</ButtonLink>
        </div>
      </div>
    </nav>
  );
}
