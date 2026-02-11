"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto max-w-xl px-6">
        <SectionHeader
          tag="Contact"
          title="Prenez rendez-vous"
          description="Une question ? Envie d'une démo ? Écrivez-nous."
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-[#0f172a]"
            >
              Nom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#1b17ff] focus:ring-2 focus:ring-[#1b17ff]/10"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[#0f172a]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#1b17ff] focus:ring-2 focus:ring-[#1b17ff]/10"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-[#0f172a]"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition-colors focus:border-[#1b17ff] focus:ring-2 focus:ring-[#1b17ff]/10"
              placeholder="Décrivez votre besoin..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full bg-[#1b17ff] py-3.5 text-sm font-medium text-white shadow-lg shadow-[#1b17ff]/20 transition-all hover:bg-[#1b17ff]/90 hover:shadow-xl hover:shadow-[#1b17ff]/30 disabled:opacity-60"
          >
            {status === "sending" ? "Envoi en cours..." : "Envoyer"}
          </button>

          {status === "sent" && (
            <p className="text-center text-sm text-emerald-600">
              Message envoyé ! Nous vous répondrons rapidement.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              Une erreur est survenue. Réessayez.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
