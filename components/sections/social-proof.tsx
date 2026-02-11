import { HERO_STATS as STATS } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="border-b border-[#0F172A]/10 bg-white py-10">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-[#0F172A]/60 md:flex-row md:gap-16">
        {STATS.map((stat, i) => (
          <div key={stat.value} className="contents">
            {i > 0 && (
              <div className="hidden h-8 w-px bg-[#0F172A]/10 md:block" />
            )}
            <div>
              <span className="text-2xl font-bold text-[#0F172A]">
                {stat.value}
              </span>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
