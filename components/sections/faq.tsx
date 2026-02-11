import { FAQ_ITEMS } from "@/lib/constants";
import { SectionHeader, Reveal } from "@/components/ui";
import { ChevronDownIcon } from "@/components/icons";

export function FAQ() {
  return (
    <section id="faq" className="bg-[#f8fafc] py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <SectionHeader tag="FAQ" title="Questions fréquentes" />
        </Reveal>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 60}>
              <details className="group rounded-2xl border border-[#e2e8f0] bg-white">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-[#0f172a]">
                  {faq.question}
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-[#0f172a]/30 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-4 text-sm leading-relaxed text-[#0f172a]/55">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
