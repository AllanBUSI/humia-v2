import { FEATURES_GRID, FEATURE_DETAILS } from "@/lib/constants";
import { SectionHeader, Reveal } from "@/components/ui";
import { FeatureIcon, CheckIcon } from "@/components/icons";

export function Features() {
  return (
    <section id="fonctionnalites" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Quick overview grid */}
        <Reveal>
          <SectionHeader
            tag="Fonctionnalités"
            title="Tout ce qu'il vous faut pour vos syllabus"
            description="Conçu pour les responsables pédagogiques et directeurs de programme."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES_GRID.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="card-lift gradient-border rounded-2xl border border-[#e2e8f0] bg-white p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1b17ff]/5">
                  <FeatureIcon
                    name={feature.icon}
                    className="h-5 w-5 text-[#1b17ff]"
                  />
                </div>
                <h3 className="mb-1.5 font-semibold text-[#0f172a]">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#0f172a]/55">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Detailed feature sections */}
        <div className="mt-32 space-y-32">
          {FEATURE_DETAILS.map((feature, i) => {
            const isReversed = i % 2 === 1;

            return (
              <div
                key={feature.title}
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Text side */}
                <Reveal
                  direction={isReversed ? "right" : "left"}
                  className="flex-1"
                >
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#1b17ff]/5 px-3 py-1 text-xs font-semibold text-[#1b17ff]">
                    <FeatureIcon
                      name={feature.icon}
                      className="h-3.5 w-3.5"
                    />
                    {feature.tag}
                  </span>
                  <h3 className="mb-4 text-2xl font-bold tracking-tight text-[#0f172a] lg:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-[#0f172a]/60">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-sm text-[#0f172a]/70"
                      >
                        <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#1b17ff]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Visual side */}
                <Reveal
                  direction={isReversed ? "left" : "right"}
                  className="flex-1 w-full"
                >
                  <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1b17ff]/10">
                        <FeatureIcon
                          name={feature.icon}
                          className="h-5 w-5 text-[#1b17ff]"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {feature.tag}
                        </p>
                        <p className="text-xs text-[#0f172a]/40">Humia</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {feature.highlights.map((h, j) => (
                        <div
                          key={h}
                          className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-[#e2e8f0]"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                            {j + 1}
                          </div>
                          <span className="text-sm text-[#0f172a]/70">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
