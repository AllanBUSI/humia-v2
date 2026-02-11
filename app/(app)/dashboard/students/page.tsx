"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Plus,
  Loader2,
  Trash2,
  UserPlus,
  X,
  Phone,
  Mail,
  StickyNote,
  Search,
  School,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClassItem = {
  id: string;
  name: string;
  color: string;
  schoolId: string;
  school: { name: string };
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: string;
  classroomId: string;
  classroom: { name: string; color: string; school: { name: string } };
  createdAt: string;
};

const STATUSES = [
  { value: "active", label: "Actif", color: "text-emerald-600 bg-emerald-500/10" },
  { value: "inactive", label: "Inactif", color: "text-muted-foreground bg-muted" },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
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
  const [notes, setNotes] = useState("");
  const [classroomId, setClassroomId] = useState("");

  const fetchStudents = useCallback(async () => {
    const res = await fetch("/api/students");
    if (res.ok) {
      const data = await res.json();
      setStudents(data);
    }
    setLoading(false);
  }, []);

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/classes/list");
    if (res.ok) {
      const data = await res.json();
      setClasses(data);
      if (data.length > 0 && !classroomId) setClassroomId(data[0].id);
    }
  }, [classroomId]);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [fetchStudents, fetchClasses]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classroomId, firstName, lastName, email, phone, notes }),
    });

    if (res.ok) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setNotes("");
      setShowForm(false);
      fetchStudents();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
    setDeletingId(null);
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      s.classroom.name.toLowerCase().includes(q)
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
          <h1 className="text-2xl font-bold tracking-tight">Mes élèves</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les élèves de vos classes.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus />
          Ajouter un élève
        </Button>
      </div>

      {/* Add student form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <UserPlus className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Ajouter un nouvel élève</h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {classes.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <School className="size-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Vous devez d&apos;abord créer une classe avant d&apos;ajouter des élèves.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAdd} className="space-y-4">
              {/* Class selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Classe</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClassroomId(c.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                        classroomId === c.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <div
                        className="flex size-8 items-center justify-center rounded-lg"
                        style={{ backgroundColor: c.color + "1a" }}
                      >
                        <School className="size-3.5" style={{ color: c.color }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold truncate block">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground truncate block">{c.school.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="student-firstname"
                  label="Prénom"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <FormField
                  id="student-lastname"
                  label="Nom"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  id="student-email"
                  label="Email (optionnel)"
                  type="email"
                  placeholder="jean.dupont@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormField
                  id="student-phone"
                  label="Téléphone (optionnel)"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="student-notes" className="text-sm font-medium">
                  Notes (optionnel)
                </label>
                <textarea
                  id="student-notes"
                  placeholder="Informations complémentaires..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>
                  Annuler
                </Button>
                <Button type="submit" disabled={adding || !firstName || !lastName || !classroomId}>
                  {adding && <Loader2 className="animate-spin" />}
                  Ajouter l&apos;élève
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Search */}
      {students.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un élève ou une classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>
      )}

      {/* Students list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UserRound className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {filtered.length} élève{filtered.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filtered.map((student) => {
            const statusInfo = STATUSES.find((s) => s.value === student.status) || STATUSES[0];
            return (
              <div
                key={student.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-sm"
              >
                {/* Avatar */}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {student.firstName} {student.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: student.classroom.color + "1a", color: student.classroom.color }}
                    >
                      <School className="size-2.5" />
                      {student.classroom.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {student.classroom.school.name}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="hidden sm:flex items-center gap-3">
                  {student.email && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      <span className="truncate max-w-[120px]">{student.email}</span>
                    </span>
                  )}
                  {student.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {student.phone}
                    </span>
                  )}
                </div>

                {/* Notes indicator */}
                {student.notes && (
                  <div className="hidden sm:flex">
                    <StickyNote className="size-3.5 text-amber-500" />
                  </div>
                )}

                {/* Status */}
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold", statusInfo.color)}>
                  {statusInfo.label}
                </span>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(student.id)}
                  disabled={deletingId === student.id}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  {deletingId === student.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <UserRound className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">
              {search ? "Aucun résultat" : "Aucun élève enregistré"}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              {search ? "Essayez une autre recherche." : "Ajoutez vos premiers élèves pour commencer."}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)}>
                <Plus />
                Ajouter un élève
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
