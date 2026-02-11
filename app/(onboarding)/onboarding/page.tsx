"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { LogoUpload } from "@/components/ui/logo-upload";
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Loader2,
  Rocket,
  GraduationCap,
  Target,
  BookOpen,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Steps definition ── */

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { num: 0 as Step, label: "Bienvenue", icon: Sparkles },
  { num: 1 as Step, label: "Votre profil", icon: User },
  { num: 2 as Step, label: "Établissement", icon: Building2 },
  { num: 3 as Step, label: "C'est parti !", icon: Rocket },
];

const TIPS = [
  {
    icon: Zap,
    text: "Humia vous accompagne pour créer des programmes de formation conformes et professionnels.",
  },
  {
    icon: Target,
    text: "Vos syllabus seront automatiquement alignés avec les exigences Qualiopi et RNCP.",
  },
  {
    icon: BookOpen,
    text: "Ajoutez votre établissement pour personnaliser vos exports PDF et Word.",
  },
  {
    icon: GraduationCap,
    text: "Vous êtes prêt à révolutionner la création de vos programmes de formation !",
  },
];

/* ── Confetti celebration ── */

function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }, (_, i) => (
        <div
          key={i}
          className="animate-confetti absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
            width: `${4 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 10}px`,
            backgroundColor: [
              "#6d28d9",
              "#7c3aed",
              "#10b981",
              "#f59e0b",
              "#ef4444",
              "#3b82f6",
              "#ec4899",
            ][i % 7],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ── */

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  // Step 1 — Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2 — School
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [schoolPhone, setSchoolPhone] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [siret, setSiret] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [schoolId] = useState(() => crypto.randomUUID());

  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, jobTitle, phone }),
    });
    if (res.ok) setStep(2);
    setLoading(false);
  }

  async function handleSchool(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/onboarding/school", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: schoolId,
        name: schoolName,
        address,
        city,
        postalCode,
        phone: schoolPhone,
        email: schoolEmail,
        siret,
        logoUrl: logoUrl || null,
      }),
    });
    if (res.ok) {
      setShowConfetti(true);
      setStep(3);
    }
    setLoading(false);
  }

  async function finishOnboarding() {
    setLoading(true);
    const res = await fetch("/api/onboarding/complete", { method: "POST" });
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  const tip = TIPS[step];
  const TipIcon = tip.icon;

  return (
    <div className="flex min-h-screen">
      {showConfetti && <Confetti />}

      {/* ══════════════════════════════════════════════════════
          LEFT PANEL — Branding, stepper & tips (desktop only)
          ══════════════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[440px] xl:w-[480px] shrink-0 flex-col bg-primary text-white p-8 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-32 -right-32 size-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -left-24 size-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-16 size-32 rounded-full bg-white/5" />
        <div className="absolute top-1/4 left-1/3 size-20 rounded-full bg-white/[0.03]" />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Humia"
            width={1200}
            height={360}
            className="h-72 w-auto brightness-0 invert"
          />
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/70">
              Progression
            </span>
            <span className="text-sm font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Vertical stepper */}
        <nav className="relative z-10 mt-10 flex-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isCompleted = s.num < step;
            const isActive = s.num === step;
            return (
              <div key={s.num}>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl transition-all duration-500",
                      isCompleted &&
                        "bg-white text-primary shadow-lg shadow-white/20",
                      isActive &&
                        "bg-white/20 text-white ring-2 ring-white/30 shadow-lg shadow-white/10",
                      !isCompleted &&
                        !isActive &&
                        "bg-white/10 text-white/30"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold transition-colors duration-300",
                      isActive && "text-white",
                      isCompleted && "text-white/80",
                      !isActive && !isCompleted && "text-white/30"
                    )}
                  >
                    {s.label}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="ml-[18px] my-1.5">
                    <div className="w-0.5 h-8 bg-white/15 rounded-full relative overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-x-0 top-0 w-full rounded-full bg-white/60 transition-all duration-700",
                          s.num < step ? "h-full" : "h-0"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Tip card */}
        <div className="relative z-10 mt-auto">
          <div
            key={step}
            className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5 animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <TipIcon className="size-4 text-white" />
              </div>
              <p className="text-sm text-white/75 leading-relaxed">
                {tip.text}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          RIGHT PANEL — Forms & content
          ══════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col bg-background">
        {/* Mobile header */}
        <div className="lg:hidden p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between mb-3">
            <Image
              src="/logo.png"
              alt="Humia"
              width={100}
              height={32}
              className="h-6 w-auto"
            />
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  s.num < step && "bg-primary",
                  s.num === step && "bg-primary/50",
                  s.num > step && "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16">
          <div className="w-full max-w-lg">
            <div key={step} className="animate-fade-in-up">
              {/* ── Step 0: Welcome ── */}
              {step === 0 && (
                <div className="text-center">
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 animate-scale-up">
                    <Sparkles className="size-9 text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Bienvenue sur{" "}
                    <span className="text-primary">Humia</span>
                  </h1>
                  <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Configurons votre espace en quelques étapes pour que vous
                    puissiez créer des programmes de formation professionnels.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 mb-8">
                    {[
                      {
                        icon: Zap,
                        label: "Génération IA",
                        desc: "Syllabus en 30 secondes",
                      },
                      {
                        icon: Target,
                        label: "Conformité",
                        desc: "Qualiopi & RNCP",
                      },
                      {
                        icon: GraduationCap,
                        label: "Export pro",
                        desc: "PDF & Word",
                      },
                    ].map((f, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 animate-fade-in-up",
                          i === 0 && "delay-100",
                          i === 1 && "delay-200",
                          i === 2 && "delay-300"
                        )}
                      >
                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                          <f.icon className="size-4 text-primary" />
                        </div>
                        <p className="text-sm font-semibold">{f.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {f.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => setStep(1)}
                    size="lg"
                    className="w-full sm:w-auto px-8"
                  >
                    Commencer la configuration
                    <ArrowRight />
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Cela ne prendra que 2 minutes
                  </p>
                </div>
              )}

              {/* ── Step 1: Profile ── */}
              {step === 1 && (
                <form onSubmit={handleProfile}>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                      <User className="size-3" />
                      Étape 1 sur 2
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Parlez-nous de vous
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Ces informations permettent de personnaliser votre
                      expérience.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        id="firstName"
                        label="Prénom"
                        placeholder="Jean"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                      <FormField
                        id="lastName"
                        label="Nom"
                        placeholder="Dupont"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <FormField
                      id="jobTitle"
                      label="Fonction"
                      placeholder="Responsable pédagogique"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                    <FormField
                      id="phone"
                      label="Téléphone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(0)}
                      className="gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !firstName || !lastName}
                      className="flex-1"
                      size="lg"
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      Continuer
                      {!loading && <ArrowRight />}
                    </Button>
                  </div>
                </form>
              )}

              {/* ── Step 2: School ── */}
              {step === 2 && (
                <form onSubmit={handleSchool}>
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                      <Building2 className="size-3" />
                      Étape 2 sur 2
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                      Votre établissement
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                      Ajoutez votre premier organisme de formation.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-center">
                      <LogoUpload
                        schoolId={schoolId}
                        onUploaded={setLogoUrl}
                      />
                    </div>

                    <div className="h-px bg-border" />

                    <FormField
                      id="schoolName"
                      label="Nom de l'établissement"
                      placeholder="Centre de Formation ABC"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                    />
                    <FormField
                      id="address"
                      label="Adresse"
                      placeholder="12 rue de la Formation"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        id="city"
                        label="Ville"
                        placeholder="Paris"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <FormField
                        id="postalCode"
                        label="Code postal"
                        placeholder="75001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>

                    <div className="h-px bg-border" />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        id="schoolPhone"
                        label="Téléphone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={schoolPhone}
                        onChange={(e) => setSchoolPhone(e.target.value)}
                      />
                      <FormField
                        id="schoolEmail"
                        label="Email"
                        type="email"
                        placeholder="contact@formation.fr"
                        value={schoolEmail}
                        onChange={(e) => setSchoolEmail(e.target.value)}
                      />
                    </div>
                    <FormField
                      id="siret"
                      label="SIRET"
                      placeholder="123 456 789 00012"
                      value={siret}
                      onChange={(e) => setSiret(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="gap-2"
                    >
                      <ArrowLeft className="size-4" />
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !schoolName}
                      className="flex-1"
                      size="lg"
                    >
                      {loading && <Loader2 className="animate-spin" />}
                      Terminer la configuration
                      {!loading && <ArrowRight />}
                    </Button>
                  </div>
                </form>
              )}

              {/* ── Step 3: Complete ── */}
              {step === 3 && (
                <div className="text-center py-6">
                  <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-success/15 animate-scale-up">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/25">
                      <Rocket className="size-7" />
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Tout est prêt !
                  </h1>
                  <p className="mt-3 text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Votre compte et votre établissement sont configurés. Vous
                    pouvez maintenant générer vos premiers syllabus avec
                    l&apos;IA.
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-8 mb-8">
                    <div className="rounded-xl border border-border bg-card p-4 text-left animate-fade-in-up delay-100">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 mb-2">
                        <User className="size-4 text-primary" />
                      </div>
                      <p className="text-sm font-semibold">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {jobTitle || "Responsable"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 text-left animate-fade-in-up delay-200">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 mb-2">
                        <Building2 className="size-4 text-primary" />
                      </div>
                      <p className="text-sm font-semibold">{schoolName}</p>
                      <p className="text-xs text-muted-foreground">
                        {city || "Organisme de formation"}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={finishOnboarding}
                    disabled={loading}
                    size="lg"
                    className="w-full sm:w-auto px-8"
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Accéder au tableau de bord
                    {!loading && <ArrowRight />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
