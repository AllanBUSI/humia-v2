"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  Trash2,
  X,
  Search,
  MessageSquareText,
  School,
  AlertTriangle,
  ThumbsUp,
  Info,
  StickyNote,
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

type Correspondence = {
  id: string;
  content: string;
  type: string;
  student: { firstName: string; lastName: string };
  classroom: { name: string; color: string };
  author: { firstName: string; lastName: string };
  createdAt: string;
};

const TYPES = [
  { value: "note", label: "Note", icon: StickyNote, color: "text-blue-600 bg-blue-500/10 border-blue-200" },
  { value: "warning", label: "Avertissement", icon: AlertTriangle, color: "text-amber-600 bg-amber-500/10 border-amber-200" },
  { value: "positive", label: "Positif", icon: ThumbsUp, color: "text-emerald-600 bg-emerald-500/10 border-emerald-200" },
  { value: "info", label: "Information", icon: Info, color: "text-violet-600 bg-violet-500/10 border-violet-200" },
];

export default function CorrespondencesPage() {
  const [correspondences, setCorrespondences] = useState<Correspondence[]>([]);
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
  const [classroomId, setClassroomId] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("note");

  const fetchCorrespondences = useCallback(async () => {
    const params = filterClassId ? `?classroomId=${filterClassId}` : "";
    const res = await fetch(`/api/correspondences${params}`);
    if (res.ok) setCorrespondences(await res.json());
    setLoading(false);
  }, [filterClassId]);

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/classes/list");
    if (res.ok) {
      const data = await res.json();
      setClasses(data);
      if (data.length > 0 && !classroomId) setClassroomId(data[0].id);
    }
  }, [classroomId]);

  const fetchStudents = useCallback(async () => {
    const res = await fetch("/api/students");
    if (res.ok) setStudents(await res.json());
  }, []);

  useEffect(() => {
    fetchCorrespondences();
    fetchClasses();
    fetchStudents();
  }, [fetchCorrespondences, fetchClasses, fetchStudents]);

  const studentsForClass = classroomId
    ? students.filter((s) => s.classroomId === classroomId)
    : students;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/correspondences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, classroomId, content, type }),
    });

    if (res.ok) {
      setContent("");
      setStudentId("");
      setType("note");
      setShowForm(false);
      fetchCorrespondences();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/correspondences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setCorrespondences((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  }

  const filtered = correspondences.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.student.firstName.toLowerCase().includes(q) ||
      c.student.lastName.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      c.classroom.name.toLowerCase().includes(q)
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
          <h1 className="text-2xl font-bold tracking-tight">Cahier de correspondances</h1>
          <p className="mt-1 text-muted-foreground">
            Notes, avertissements et observations pour vos élèves.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus />
          Ajouter
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquareText className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Nouvelle entrée</h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            {/* Class selector */}
            {classes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Classe</label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setClassroomId(c.id); setStudentId(""); }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                        classroomId === c.id
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

            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left transition-all text-xs font-medium",
                      type === t.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/20"
                    )}
                  >
                    <t.icon className="size-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="corr-content" className="text-sm font-medium">
                Contenu
              </label>
              <textarea
                id="corr-content"
                placeholder="Décrivez l'observation, la remarque ou l'avertissement..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>
                Annuler
              </Button>
              <Button type="submit" disabled={adding || !studentId || !content || !classroomId}>
                {adding && <Loader2 className="animate-spin" />}
                Ajouter
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by class */}
      {correspondences.length > 0 && classes.length > 0 && (
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
      {correspondences.length > 0 && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par élève, classe ou contenu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
          />
        </div>
      )}

      {/* Correspondences list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareText className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filtered.map((corr) => {
            const typeInfo = TYPES.find((t) => t.value === corr.type) || TYPES[0];
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={corr.id}
                className={cn(
                  "rounded-2xl border bg-card p-4 transition-all hover:shadow-sm",
                  corr.type === "warning" ? "border-amber-200/50" :
                  corr.type === "positive" ? "border-emerald-200/50" :
                  "border-border"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Type icon */}
                  <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", typeInfo.color)}>
                    <TypeIcon className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">
                        {corr.student.firstName} {corr.student.lastName}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: corr.classroom.color + "1a",
                          color: corr.classroom.color,
                        }}
                      >
                        <School className="size-2.5" />
                        {corr.classroom.name}
                      </span>
                      <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", typeInfo.color)}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                      {corr.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        Par {corr.author.firstName} {corr.author.lastName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(corr.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(corr.id)}
                    disabled={deletingId === corr.id}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    {deletingId === corr.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
              <MessageSquareText className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">
              {search ? "Aucun résultat" : "Aucune correspondance"}
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              {search
                ? "Essayez une autre recherche."
                : "Ajoutez vos premières entrées au cahier de correspondances."}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)}>
                <Plus />
                Ajouter une entrée
              </Button>
            )}
          </div>
        )
      )}
    </div>
  );
}
