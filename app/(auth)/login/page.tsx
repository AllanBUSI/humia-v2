"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    setStep("code");
    setLoading(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }

  async function handleVerifyCode(code: string) {
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });

    if (error) {
      setError("Code invalide ou expiré.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newOtp.join("");
    if (code.length === 6) {
      handleVerifyCode(code);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      handleVerifyCode(pasted);
    }
  }

  if (step === "code") {
    return (
      <>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold">Vérification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entrez le code à 6 chiffres envoyé à{" "}
            <strong className="text-foreground">{email}</strong>
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-4" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="h-12 w-11 rounded-md border border-input bg-background text-center text-lg font-semibold text-foreground outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary disabled:opacity-50"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-destructive">{error}</p>
        )}

        {loading && (
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Vérification...
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-2">
          <Button
            variant="link"
            onClick={() => {
              setStep("email");
              setOtp(["", "", "", "", "", ""]);
              setError("");
            }}
          >
            Changer d&apos;adresse email
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handleSendCode({
                preventDefault: () => {},
              } as React.FormEvent)
            }
          >
            Renvoyer le code
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-5 text-primary" />
        </div>
        <h1 className="text-lg font-semibold">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entrez votre email pour recevoir un code de connexion.
        </p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? <Loader2 className="animate-spin" /> : null}
          Recevoir le code
          {!loading && <ArrowRight />}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Un code à 6 chiffres sera envoyé à votre adresse email.
      </p>
    </>
  );
}
