"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Plus,
  Loader2,
  Trash2,
  X,
  Search,
  Star,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ClassItem = {
  id: string;
  name: string;
  color: string;
  school: { name: string };
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  classroomId: string;
};

type Grade = {
  id: string;
  value: number;
  maxValue: number;
  subject: string | null;
  comment: string | null;
  date: string;
  student: {
    firstName: string;
    lastName: string;
    classroom: { name: string; color: string };
  };
  author: { firstName: string; lastName: string };
  createdAt: string;
};

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterClassId, setFilterClassId] = useState("");

  // Form
  const [studentId, setStudentId] = useState("");
  const [value, setValue] = useState("");
  const [maxValue, setMaxValue] = useState("20");
  const [subject, setSubject] = useState("");
  const [comment, setComment] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [formClassId, setFormClassId] = useState("");

  const fetchGrades = useCallback(async () => {
    const params = filterClassId ? `?classroomId=${filterClassId}` : "";
    const res = await fetch(`/api/grades${params}`);
    if (res.ok) setGrades(await res.json());
    setLoading(false);
  }, [filterClassId]);

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/classes/list");
    if (res.ok) setClasses(await res.json());
  }, []);

  const fetchStudents = useCallback(async () => {
    const res = await fetch("/api/students");
    if (res.ok) setStudents(await res.json());
  }, []);

  useEffect(() => {
    fetchGrades();
    fetchClasses();
    fetchStudents();
  }, [fetchGrades, fetchClasses, fetchStudents]);

  const studentsForClass = formClassId
    ? students.filter((s) => s.classroomId === formClassId)
    : students;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        value: parseFloat(value),
        maxValue: parseFloat(maxValue),
        subject: subject || null,
        comment: comment || null,
        date,
      }),
    });

    if (res.ok) {
      setValue("");
      setMaxValue("20");
      setSubject("");
      setComment("");
      setStudentId("");
      setShowForm(false);
      fetchGrades();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/grades", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setGrades((prev) => prev.filter((g) => g.id !== id));
    setDeletingId(null);
  }

  const filtered = grades.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.student.firstName.toLowerCase().includes(q) ||
      g.student.lastName.toLowerCase().includes(q) ||
      (g.subject && g.subject.toLowerCase().includes(q)) ||
      g.student.classroom.name.toLowerCase().includes(q)
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
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les notes de vos élèves.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus />
          Ajouter une note
        </Button>
      </div>

      {/* Add grade form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <Star className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Ajouter une note</h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            {/* Class filter for student selection */}
            {classes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrer par classe</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setFormClassId(""); setStudentId(""); }}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      !formClassId
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/20"
                    )}
                  >
                    Toutes
                  </button>
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setFormClassId(c.id); setStudentId(""); }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        formClassId === c.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/20"
                      )}
                    >
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Student selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Élève</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sélectionner un élève...</option>
                {studentsForClass.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                id="grade-value"
                label="Note"
                type="number"
                placeholder="15"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <FormField
                id="grade-max"
                label="Sur (max)"
                type="number"
                placeholder="20"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
              <FormField
                id="grade-date"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <FormField
              id="grade-subject"
              label="Matière (optionnel)"
              placeholder="Mathématiques, Français..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <div className="space-y-2">
              <label htmlFor="grade-comment" className="text-sm font-medium">
                Commentaire (optionnel)
              </label>
              <textarea
                id="grade-comment"
                placeholder="Commentaire sur la note..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={adding || !studentId || !value}>
                {adding && <Loader2 className="animate-spin" />}
                Ajouter la note
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by class */}
      {grades.length > 0 && classes.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterClassId("")}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              !filterClassId
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/20"
            )}
          >
            Toutes les classes
          </button>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterClassId(c.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                filterClassId === c.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/20"
              )}
            >
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      {grades.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par élève, matière ou classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>
      )}

      {/* Grades list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Star className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {filtered.length} note{filtered.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filtered.map((grade) => {
            const pct = (grade.value / grade.maxValue) * 100;
            const color =
              pct >= 80
                ? "text-emerald-600 bg-emerald-500/10"
                : pct >= 50
                ? "text-amber-600 bg-amber-500/10"
                : "text-red-600 bg-red-500/10";

            return (
              <div
                key={grade.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-sm"
              >
                {/* Grade badge */}
                <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold", color)}>
                  {grade.value}/{grade.maxValue}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {grade.student.firstName} {grade.student.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: grade.student.classroom.color + "1a",
                        color: grade.student.classroom.color,
                      }}
                    >
                      <School className="size-2.5" />
                      {grade.student.classroom.name}
                    </span>
                    {grade.subject && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {grade.subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date */}
                <span className="hidden sm:block text-xs text-muted-foreground">
                  {new Date(grade.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                {/* Comment indicator */}
                {grade.comment && (
                  <span className="hidden sm:block text-[10px] text-muted-foreground max-w-[150px] truncate">
                    {grade.comment}
                  </span>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(grade.id)}
                  disabled={deletingId === grade.id}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  {deletingId === grade.id ? (
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
              <Star className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">
              {search ? "Aucun résultat" : "Aucune note enregistrée"}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              {search
                ? "Essayez une autre recherche."
                : "Ajoutez vos premières notes pour commencer."}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)}>
                <Plus />
                Ajouter une note
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
