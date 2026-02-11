"use client";

import { useState } from "react";
import { PRICING } from "@/lib/constants";
import { SectionHeader, ButtonLink, Reveal } from "@/components/ui";
import { CheckIcon } from "@/components/icons";

type Plan = (typeof PRICING)[number];

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const highlighted = plan.highlighted;
  const price = annual ? plan.annualPrice : plan.monthlyPrice;
  const period = annual ? "/mois" : "/mois";

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-8 transition-all ${
        highlighted
          ? "glow-card border-[#1b17ff]/20 bg-[#1b17ff]/[0.02]"
          : "card-lift border-[#e2e8f0] bg-white"
      }`}
    >
      {/* Badge area — fixed height for uniformity */}
      <div className="mb-4 h-7">
        {plan.badge && (
          <span className="inline-block rounded-full bg-[#1b17ff] px-3 py-1 text-xs font-bold text-white">
            {plan.badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-[#0f172a]">{plan.name}</h3>
      <p className="mb-6 text-sm text-[#0f172a]/50">{plan.subtitle}</p>

      {/* Price */}
      <div className="mb-1 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-[#0f172a]">{price}</span>
        <span className="text-[#0f172a]/50">/mois</span>
        {annual && plan.monthlyPrice !== "0 €" && (
          <span className="ml-2 text-sm text-[#0f172a]/40 line-through">
            {plan.monthlyPrice}
          </span>
        )}
      </div>

      {annual && plan.annualTotal && (
        <p className="mb-1 text-xs font-medium text-emerald-600">
          Soit {plan.annualTotal} facturé en une fois
        </p>
      )}

      <p className="mb-8 text-sm font-medium text-[#1b17ff]">
        {plan.credits}
      </p>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-sm text-[#0f172a]/70"
          >
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#1b17ff]" />
            {feature}
          </li>
        ))}
      </ul>

      <ButtonLink
        href="/login"
        variant={highlighted ? "default" : "outline"}
        size="lg"
        className="w-full justify-center"
      >
        {plan.cta}
      </ButtonLink>
    </div>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="tarifs" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            tag="Tarifs"
            title="Choisissez votre plan"
            description="Commencez gratuitement, évoluez selon vos besoins."
          />
        </Reveal>

        {/* Toggle mensuel / annuel */}
        <Reveal>
          <div className="mb-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!annual ? "text-[#0f172a]" : "text-[#0f172a]/40"}`}
            >
              Mensuel
            </span>
            <button
              type="button"
              onClick={() => setAnnual(!annual)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                annual ? "bg-[#1b17ff]" : "bg-[#e2e8f0]"
              }`}
              aria-label="Basculer entre mensuel et annuel"
            >
              <span
                className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow-sm transition-transform ${
                  annual ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ width: "1.375rem", height: "1.375rem", marginTop: "0.0625rem" }}
              />
            </button>
            <span
              className={`text-sm font-medium ${annual ? "text-[#0f172a]" : "text-[#0f172a]/40"}`}
            >
              Annuel
            </span>
            {annual && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                -50%
              </span>
            )}
          </div>
        </Reveal>

        <div className="grid items-stretch gap-8 lg:grid-cols-3">
          {PRICING.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 120}>
              <PlanCard plan={plan} annual={annual} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
