"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Briefcase,
  Plus,
  Loader2,
  Trash2,
  UserPlus,
  X,
  Phone,
  Mail,
  GraduationCap,
  Search,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SchoolItem = { id: string; name: string };

type Trainer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  specialty: string | null;
  bio: string | null;
  status: string;
  schoolId: string;
  school: { name: string };
  createdAt: string;
};

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [schoolId, setSchoolId] = useState("");

  const fetchTrainers = useCallback(async () => {
    const res = await fetch("/api/trainers");
    if (res.ok) {
      const data = await res.json();
      setTrainers(data);
    }
    setLoading(false);
  }, []);

  const fetchSchools = useCallback(async () => {
    const res = await fetch("/api/schools/list");
    if (res.ok) {
      const data = await res.json();
      setSchools(data);
      if (data.length > 0 && !schoolId) setSchoolId(data[0].id);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchTrainers();
    fetchSchools();
  }, [fetchTrainers, fetchSchools]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/trainers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, firstName, lastName, email, phone, specialty, bio }),
    });

    if (res.ok) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSpecialty("");
      setBio("");
      setShowForm(false);
      fetchTrainers();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/trainers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTrainers((prev) => prev.filter((t) => t.id !== id));
    }
    setDeletingId(null);
  }

  const filtered = trainers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      (t.email && t.email.toLowerCase().includes(q)) ||
      (t.specialty && t.specialty.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes formateurs</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les formateurs de vos établissements.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus />
          Ajouter un formateur
        </Button>
      </div>

      {/* Add trainer form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <UserPlus className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Ajouter un formateur</h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            {schools.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Établissement</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {schools.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSchoolId(s.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                        schoolId === s.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <GraduationCap className="size-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="trainer-firstname"
                label="Prénom"
                placeholder="Marie"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <FormField
                id="trainer-lastname"
                label="Nom"
                placeholder="Martin"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="trainer-email"
                label="Email (optionnel)"
                type="email"
                placeholder="marie.martin@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormField
                id="trainer-phone"
                label="Téléphone (optionnel)"
                type="tel"
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <FormField
              id="trainer-specialty"
              label="Spécialité (optionnel)"
              placeholder="Ex: Développement web, Marketing digital, Gestion de projet"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />

            <div className="space-y-2">
              <label htmlFor="trainer-bio" className="text-sm font-medium">
                Bio (optionnel)
              </label>
              <textarea
                id="trainer-bio"
                placeholder="Parcours, expérience, certifications..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={adding || !firstName || !lastName || !schoolId}>
                {adding && <Loader2 className="animate-spin" />}
                Ajouter le formateur
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      {trainers.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un formateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>
      )}

      {/* Trainers list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {filtered.length} formateur{filtered.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filtered.map((trainer) => (
            <div
              key={trainer.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-sm"
            >
              {/* Avatar */}
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {trainer.firstName} {trainer.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {trainer.school.name}
                </p>
              </div>

              {/* Specialty */}
              {trainer.specialty && (
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600">
                    <BookOpen className="size-3" />
                    {trainer.specialty}
                  </span>
                </div>
              )}

              {/* Contact */}
              <div className="hidden md:flex items-center gap-3">
                {trainer.email && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="size-3" />
                    <span className="truncate max-w-[120px]">{trainer.email}</span>
                  </span>
                )}
                {trainer.phone && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="size-3" />
                    {trainer.phone}
                  </span>
                )}
              </div>

              {/* Status */}
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                trainer.status === "active"
                  ? "text-emerald-600 bg-emerald-500/10"
                  : "text-muted-foreground bg-muted"
              )}>
                {trainer.status === "active" ? "Actif" : "Inactif"}
              </span>

              {/* Delete */}
              <button
                onClick={() => handleDelete(trainer.id)}
                disabled={deletingId === trainer.id}
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                {deletingId === trainer.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <Briefcase className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">
              {search ? "Aucun résultat" : "Aucun formateur enregistré"}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              {search ? "Essayez une autre recherche." : "Ajoutez vos premiers formateurs."}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)}>
                <Plus />
                Ajouter un formateur
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
