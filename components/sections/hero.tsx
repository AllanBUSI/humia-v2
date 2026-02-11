import { ButtonLink } from "@/components/ui";
import { HERO_STATS, TRAINING_CARDS } from "@/lib/constants";

function TrainingCard({
  card,
}: {
  card: (typeof TRAINING_CARDS)[number];
}) {
  return (
    <div className="card-lift w-72 shrink-0 rounded-lg border border-[#e2e8f0] bg-white p-5 shadow-sm transition-colors hover:border-[#1b17ff]/20">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#1b17ff]" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1b17ff]">
          Syllabus
        </span>
      </div>
      <h4 className="mb-1 text-sm font-semibold text-[#0f172a] leading-snug">
        {card.title}
      </h4>
      <p className="mb-3 text-xs text-[#0f172a]/50">
        {card.duration} &middot; {card.level}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-0.5 text-[10px] text-[#0f172a]/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  // Duplicate cards for seamless loop
  const doubledCards = [...TRAINING_CARDS, ...TRAINING_CARDS];

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* SVG grid background */}
      <div className="hero-grid pointer-events-none absolute inset-0" />

      {/* Floating gradient blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* Badges row */}
        <div className="animate-fade-in-up mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="shimmer inline-flex items-center gap-2 rounded-full border border-[#1b17ff]/15 bg-[#1b17ff]/5 px-4 py-1.5 text-sm font-medium text-[#1b17ff]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1b17ff]/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1b17ff]" />
            </span>
            Propulsé par l&apos;IA
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Conforme Qualiopi
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            RNCP
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Export PDF &amp; Word
          </div>
        </div>

        {/* Heading — full width */}
        <h1 className="animate-fade-in-up delay-100 text-4xl font-bold leading-tight tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
          La pédagogie, c&apos;est d&apos;être avec les humains,{" "}
          <span className="text-[#1b17ff]">pas de faire de la rédaction</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#0f172a]/60">
          Générez des syllabus complets et conformes Qualiopi en quelques
          minutes grâce à l&apos;IA. Concentrez-vous sur ce qui compte.
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/login" size="lg">
            Commencer gratuitement
          </ButtonLink>
          <ButtonLink href="#contact" variant="outline" size="lg">
            Prendre RDV
          </ButtonLink>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-400 mt-14 flex items-center justify-center gap-8 sm:gap-14">
          {HERO_STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8">
              {i > 0 && <div className="h-10 w-px bg-[#e2e8f0]" />}
              <div className="text-center">
                <p className="text-3xl font-bold text-[#1b17ff]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-[#0f172a]/50">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling training cards marquee */}
      <div className="animate-fade-in-up delay-500 mt-20 w-full overflow-hidden">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-[#0f172a]/40">
          Exemples de formations générées par Humia
        </p>
        <div className="marquee-track gap-5">
          {doubledCards.map((card, i) => (
            <div key={`${card.title}-${i}`} className="px-2.5">
              <TrainingCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
