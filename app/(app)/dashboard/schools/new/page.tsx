"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { LogoUpload } from "@/components/ui/logo-upload";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Save,
  Loader2,
  Building2,
  MapPin,
  Phone,
  FileText,
  ArrowLeft,
} from "lucide-react";

export default function NewSchoolPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [schoolId] = useState(() => crypto.randomUUID());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/schools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: schoolId,
        name,
        address,
        city,
        postalCode,
        phone,
        email,
        siret,
        logoUrl: logoUrl || null,
      }),
    });

    if (res.ok) {
      router.push("/dashboard/schools");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-up">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/schools">Établissements</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nouveau</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Nouvel établissement
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ajoutez un nouvel organisme de formation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo */}
        <div className="flex justify-center rounded-2xl border border-border bg-card p-6">
          <LogoUpload schoolId={schoolId} onUploaded={setLogoUrl} />
        </div>

        {/* Informations générales */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-semibold">Informations générales</h3>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <FormField
              id="name"
              label="Nom de l'établissement"
              placeholder="Centre de Formation ABC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Adresse */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <MapPin className="size-3.5 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold">Adresse</h3>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
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
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <Phone className="size-3.5 text-emerald-600" />
            </div>
            <h3 className="text-sm font-semibold">Contact</h3>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <FormField
              id="phone"
              label="Téléphone"
              type="tel"
              placeholder="01 23 45 67 89"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="contact@formation.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Administratif */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10">
              <FileText className="size-3.5 text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold">Administratif</h3>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <FormField
              id="siret"
              label="SIRET"
              placeholder="123 456 789 00012"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/schools">
              <ArrowLeft className="size-4" />
              Retour
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={loading || !name}
            className="flex-1"
            size="lg"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            Créer l&apos;établissement
          </Button>
        </div>
      </form>
    </div>
  );
}
