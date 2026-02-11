import { STEPS } from "@/lib/constants";
import { SectionHeader, Reveal } from "@/components/ui";

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="bg-[#f8fafc] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader
            tag="Comment ça marche"
            title="3 étapes. C'est tout."
          />
        </Reveal>

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div className="pointer-events-none absolute top-7 left-[16.67%] right-[16.67%] hidden md:block">
            <div className="h-0 border-b-2 border-dashed border-[#1b17ff]/15" />
          </div>

          {STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 150}>
              <div className="relative text-center">
                <div className="step-pulse relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1b17ff] text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-[#0f172a]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#0f172a]/55">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
