"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  School,
  Plus,
  Loader2,
  Trash2,
  X,
  GraduationCap,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SchoolItem = { id: string; name: string };

type Classroom = {
  id: string;
  name: string;
  level: string | null;
  year: string | null;
  color: string;
  schoolId: string;
  school: { name: string };
  _count: { students: number; sessions: number };
  createdAt: string;
};

const COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#ec4899", "#8b5cf6", "#0891b2",
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [schoolId, setSchoolId] = useState("");

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/classes");
    if (res.ok) {
      const data = await res.json();
      setClasses(data);
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
    fetchClasses();
    fetchSchools();
  }, [fetchClasses, fetchSchools]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schoolId, name, level, year, color }),
    });

    if (res.ok) {
      setName("");
      setLevel("");
      setYear("");
      setColor(COLORS[0]);
      setShowForm(false);
      fetchClasses();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/classes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
    setDeletingId(null);
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Mes classes</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos classes et groupes de formation.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus />
          Créer une classe
        </Button>
      </div>

      {/* Add class form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <School className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Nouvelle classe</h2>
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

            <FormField
              id="class-name"
              label="Nom de la classe"
              placeholder="Ex: BTS SIO - 1ère année"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="class-level"
                label="Niveau (optionnel)"
                placeholder="Ex: BTS, Licence, Master"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
              <FormField
                id="class-year"
                label="Année (optionnel)"
                placeholder="Ex: 2025-2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            {/* Color picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Couleur</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "size-8 rounded-full transition-all",
                      color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={adding || !name || !schoolId}>
                {adding && <Loader2 className="animate-spin" />}
                Créer la classe
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Classes list */}
      {classes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: cls.color + "1a" }}
                >
                  <School className="size-5" style={{ color: cls.color }} />
                </div>
                <button
                  onClick={() => handleDelete(cls.id)}
                  disabled={deletingId === cls.id}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  {deletingId === cls.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </button>
              </div>

              <h3 className="text-sm font-bold mb-1">{cls.name}</h3>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                {cls.level && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {cls.level}
                  </span>
                )}
                {cls.year && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                    {cls.year}
                  </span>
                )}
              </div>

              {/* Counts */}
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <UserRound className="size-3" />
                  {cls._count.students} élève{cls._count.students > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {cls._count.sessions} séance{cls._count.sessions > 1 ? "s" : ""}
                </span>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <GraduationCap className="size-3" />
                {cls.school.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <School className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">Aucune classe créée</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Créez votre première classe pour organiser vos élèves.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus />
              Créer une classe
            </Button>
          </div>
        )
      )}
    </div>
  );
}
