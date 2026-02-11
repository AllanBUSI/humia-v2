import { CheckIcon } from "@/components/icons";

export function Solution() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#1b17ff] p-8 sm:p-12 lg:p-16 text-center text-white">
          <p className="mb-3 text-sm font-semibold tracking-widest text-white/60 uppercase">
            La solution
          </p>
          <h2 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Et si vos syllabus se rédigeaient
            <br />
            <span className="text-white/70">en quelques minutes ?</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Humia utilise l&apos;intelligence artificielle pour transformer vos
            informations de programme en syllabus complets, structurés et conformes
            — prêts à être utilisés ou personnalisés.
          </p>
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur">
            <CheckIcon className="h-5 w-5 text-emerald-300" />
            Plus de 20 heures économisées par programme
          </div>
        </div>
      </div>
    </section>
  );
}
