"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { LogoUpload } from "@/components/ui/logo-upload";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import type { School } from "@prisma/client";

export function SchoolEditForm({ school }: { school: School }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();

  const [name, setName] = useState(school.name);
  const [address, setAddress] = useState(school.address ?? "");
  const [city, setCity] = useState(school.city ?? "");
  const [postalCode, setPostalCode] = useState(school.postalCode ?? "");
  const [phone, setPhone] = useState(school.phone ?? "");
  const [email, setEmail] = useState(school.email ?? "");
  const [siret, setSiret] = useState(school.siret ?? "");
  const [logoUrl, setLogoUrl] = useState(school.logoUrl ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const res = await fetch(`/api/schools/${school.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      setSaved(true);
      router.refresh();
    }
    setLoading(false);
  }

  async function handleDelete() {
    await fetch(`/api/schools/${school.id}`, { method: "DELETE" });
    router.push("/dashboard/schools");
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <LogoUpload
              schoolId={school.id}
              currentUrl={logoUrl}
              onUploaded={setLogoUrl}
            />
          </div>

          <Separator />

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Informations générales</h3>
            <FormField
              id="name"
              label="Nom de l'établissement"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <Separator />

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Adresse</h3>
            <FormField
              id="address"
              label="Adresse"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                id="city"
                label="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <FormField
                id="postalCode"
                label="Code postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contact</h3>
            <FormField
              id="phone"
              label="Téléphone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Separator />

          {/* Administratif */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Administratif</h3>
            <FormField
              id="siret"
              label="SIRET"
              value={siret}
              onChange={(e) => setSiret(e.target.value)}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading} className="flex-1" size="lg">
              {loading ? <Loader2 className="animate-spin" /> : <Save />}
              Enregistrer
            </Button>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="destructive" size="lg">
                  <Trash2 />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer l&apos;établissement</DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. L&apos;établissement &quot;{school.name}&quot; sera définitivement supprimé.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Supprimer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {saved && (
            <div className="flex items-center justify-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm text-success">
              <CheckCircle2 className="size-4" />
              Modifications enregistrées.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
