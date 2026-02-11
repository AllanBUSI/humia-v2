"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  CalendarDays,
  Plus,
  Loader2,
  Trash2,
  X,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  School,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

type ClassItem = {
  id: string;
  name: string;
  color: string;
  schoolId: string;
  school: { name: string };
};

type TrainerItem = {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string | null;
  schoolId: string;
};

type PlanningSession = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  color: string;
  status: string;
  classroomId: string;
  trainerId: string;
  classroom: { name: string; color: string };
  trainer: { firstName: string; lastName: string };
  school: { name: string };
};

type ViewMode = "jour" | "semaine" | "mois";

/* ─── Constants ─── */

const COLORS = [
  "#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#ec4899", "#8b5cf6", "#0891b2",
];

const WEEK_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 22; h++) {
  for (let m = 0; m < 60; m += 15) {
    if (h === 22 && m > 0) break;
    TIME_SLOTS.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7..22

/* ─── Date helpers ─── */

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function addDays(d: Date, n: number) {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/* ─── Main component ─── */

export default function PlanningPage() {
  const now = new Date();
  const todayStr = fmtDate(now);

  const [sessions, setSessions] = useState<PlanningSession[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [trainers, setTrainers] = useState<TrainerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [view, setView] = useState<ViewMode>("semaine");
  const [currentDate, setCurrentDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [classroomId, setClassroomId] = useState("");
  const [trainerId, setTrainerId] = useState("");

  // Compute fetch range based on view
  const fetchRange = useMemo(() => {
    if (view === "jour") {
      return fmtDate(currentDate);
    }
    if (view === "semaine") {
      const mon = getMonday(currentDate);
      return `${fmtDate(mon)}/${fmtDate(addDays(mon, 5))}`;
    }
    // mois
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return `${y}-${String(m + 1).padStart(2, "0")}`;
  }, [view, currentDate]);

  const fetchSessions = useCallback(async () => {
    let url = "/api/planning";
    if (view === "mois") {
      url += `?month=${fetchRange}`;
    } else if (view === "semaine") {
      const [start, end] = fetchRange.split("/");
      url += `?start=${start}&end=${end}`;
    } else {
      url += `?start=${fetchRange}&end=${fetchRange}`;
    }
    const res = await fetch(url);
    if (res.ok) setSessions(await res.json());
    setLoading(false);
  }, [fetchRange, view]);

  const fetchClasses = useCallback(async () => {
    const res = await fetch("/api/classes/list");
    if (res.ok) {
      const data = await res.json();
      setClasses(data);
      if (data.length > 0 && !classroomId) setClassroomId(data[0].id);
    }
  }, [classroomId]);

  const fetchTrainers = useCallback(async () => {
    const res = await fetch("/api/trainers/list");
    if (res.ok) {
      const data = await res.json();
      setTrainers(data);
      if (data.length > 0 && !trainerId) setTrainerId(data[0].id);
    }
  }, [trainerId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, [fetchClasses, fetchTrainers]);

  /* Navigation */
  function goPrev() {
    const d = new Date(currentDate);
    if (view === "jour") d.setDate(d.getDate() - 1);
    else if (view === "semaine") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  }
  function goNext() {
    const d = new Date(currentDate);
    if (view === "jour") d.setDate(d.getDate() + 1);
    else if (view === "semaine") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  function openFormForDate(dateStr: string) {
    setDate(dateStr);
    setShowForm(true);
    setSelectedDate(dateStr);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");
    const res = await fetch("/api/planning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classroomId, trainerId, title, description, date, startTime, endTime, location, color }),
    });
    if (res.ok) {
      setTitle(""); setDescription(""); setDate(""); setStartTime("09:00"); setEndTime("10:00");
      setLocation(""); setColor(COLORS[0]); setShowForm(false); setSelectedDate(null);
      fetchSessions();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/planning", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setSessions((prev) => prev.filter((s) => s.id !== id));
    setDeletingId(null);
  }

  /* Derived data */
  const weekMonday = getMonday(currentDate);
  const weekDates = Array.from({ length: 6 }, (_, i) => addDays(weekMonday, i));

  function sessionsForDate(dateStr: string) {
    return sessions.filter((s) => s.date.startsWith(dateStr));
  }

  /* Header label */
  function headerLabel() {
    if (view === "jour") {
      return currentDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    }
    if (view === "semaine") {
      const sat = addDays(weekMonday, 5);
      const mStr = weekMonday.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      const sStr = sat.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
      return `${mStr} — ${sStr}`;
    }
    return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  const selectedSessions = selectedDate ? sessionsForDate(selectedDate) : [];

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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planification</h1>
          <p className="mt-1 text-muted-foreground">
            Organisez vos séances de formation.
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setDate(todayStr); }}>
          <Plus />
          Nouvelle séance
        </Button>
      </div>

      {/* View toggle + navigation */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View toggle */}
        <div className="flex rounded-lg border border-border p-0.5 bg-muted/50 w-fit">
          {(["jour", "semaine", "mois"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Date nav */}
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors">
            Aujourd&apos;hui
          </button>
          <button onClick={goPrev} className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-semibold min-w-[180px] text-center capitalize">{headerLabel()}</span>
          <button onClick={goNext} className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">Nouvelle séance</h2>
            </div>
            <button onClick={() => { setShowForm(false); setError(""); }} className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {classes.length === 0 || trainers.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CalendarDays className="size-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {classes.length === 0 && trainers.length === 0
                  ? "Vous devez d'abord créer une classe et un formateur."
                  : classes.length === 0 ? "Vous devez d'abord créer une classe." : "Vous devez d'abord ajouter un formateur."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Classe</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {classes.map((c) => (
                    <button key={c.id} type="button" onClick={() => setClassroomId(c.id)}
                      className={cn("flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                        classroomId === c.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/20")}>
                      <div className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: c.color + "1a" }}>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Formateur</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {trainers.map((t) => (
                    <button key={t.id} type="button" onClick={() => setTrainerId(t.id)}
                      className={cn("flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                        trainerId === t.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/20")}>
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                        <Briefcase className="size-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold truncate block">{t.firstName} {t.lastName}</span>
                        {t.specialty && <span className="text-[10px] text-muted-foreground truncate block">{t.specialty}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <FormField id="session-title" label="Titre de la séance" placeholder="Ex: Module 1 - Introduction" value={title} onChange={(e) => setTitle(e.target.value)} required />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField id="session-date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <div className="space-y-2">
                  <label htmlFor="session-start" className="text-sm font-medium">Début</label>
                  <select id="session-start" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="session-end" className="text-sm font-medium">Fin</label>
                  <select id="session-end" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {TIME_SLOTS.filter((t) => t > startTime).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <FormField id="session-location" label="Lieu (optionnel)" placeholder="Salle 201, Bâtiment A" value={location} onChange={(e) => setLocation(e.target.value)} />

              <div className="space-y-2">
                <label htmlFor="session-desc" className="text-sm font-medium">Description (optionnel)</label>
                <textarea id="session-desc" placeholder="Détails de la séance..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)}
                      className={cn("size-8 rounded-full transition-all", color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105")}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(""); }}>Annuler</Button>
                <Button type="submit" disabled={adding || !title || !date || !startTime || !endTime || !classroomId || !trainerId}>
                  {adding && <Loader2 className="animate-spin" />}
                  Créer la séance
                </Button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ═══ VIEWS ═══ */}

      {view === "mois" && (
        <MonthView
          currentDate={currentDate}
          sessions={sessions}
          todayStr={todayStr}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onDoubleClickDate={openFormForDate}
          selectedSessions={selectedSessions}
          onDelete={handleDelete}
          deletingId={deletingId}
          onAdd={openFormForDate}
        />
      )}

      {view === "semaine" && (
        <WeekView
          weekDates={weekDates}
          sessions={sessions}
          todayStr={todayStr}
          onDoubleClickSlot={openFormForDate}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {view === "jour" && (
        <DayView
          currentDate={currentDate}
          sessions={sessionsForDate(fmtDate(currentDate))}
          todayStr={todayStr}
          onDoubleClickSlot={() => openFormForDate(fmtDate(currentDate))}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MONTH VIEW
   ═══════════════════════════════════════════════════════ */

function MonthView({
  currentDate, sessions, todayStr, selectedDate, onSelectDate, onDoubleClickDate, selectedSessions, onDelete, deletingId, onAdd,
}: {
  currentDate: Date; sessions: PlanningSession[]; todayStr: string; selectedDate: string | null;
  onSelectDate: (d: string) => void; onDoubleClickDate: (d: string) => void;
  selectedSessions: PlanningSession[]; onDelete: (id: string) => void; deletingId: string | null;
  onAdd: (d: string) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  function sessionsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return sessions.filter((s) => s.date.startsWith(dateStr));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {MONTH_DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="aspect-square" />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const daySessions = sessionsForDay(day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            return (
              <button key={day} onClick={() => onSelectDate(dateStr)} onDoubleClick={() => onDoubleClickDate(dateStr)}
                className={cn("aspect-square rounded-xl p-1 text-sm transition-all relative flex flex-col items-center",
                  isToday && "bg-primary/10 font-bold", isSelected && "ring-2 ring-primary bg-primary/5",
                  !isToday && !isSelected && "hover:bg-accent")}>
                <span className={cn("text-xs", isToday && "text-primary font-bold")}>{day}</span>
                {daySessions.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                    {daySessions.slice(0, 3).map((s) => <div key={s.id} className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
              : "Sélectionnez un jour"}
          </h3>
          {selectedDate && (
            <button onClick={() => onAdd(selectedDate)} className="flex size-7 items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
              <Plus className="size-3.5 text-primary" />
            </button>
          )}
        </div>
        {selectedDate ? (
          selectedSessions.length > 0 ? (
            <div className="space-y-3">
              {selectedSessions.map((session) => (
                <SessionCard key={session.id} session={session} onDelete={onDelete} deletingId={deletingId} />
              ))}
            </div>
          ) : (
            <EmptyDay onAdd={() => onAdd(selectedDate)} />
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="size-8 text-muted-foreground/30 mb-3" />
            <p className="text-xs text-muted-foreground">Cliquez sur un jour du calendrier</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   WEEK VIEW (Mon–Sat, 7h–22h)
   ═══════════════════════════════════════════════════════ */

function WeekView({
  weekDates, sessions, todayStr, onDoubleClickSlot, onDelete, deletingId,
}: {
  weekDates: Date[]; sessions: PlanningSession[]; todayStr: string;
  onDoubleClickSlot: (d: string) => void; onDelete: (id: string) => void; deletingId: string | null;
}) {
  const ROW_H = 48; // px per hour

  function sessionsForDate(dateStr: string) {
    return sessions.filter((s) => s.date.startsWith(dateStr));
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "60px repeat(6, 1fr)" }}>
        <div className="border-r border-border" />
        {weekDates.map((d, i) => {
          const ds = fmtDate(d);
          const isToday = ds === todayStr;
          return (
            <div key={i} className={cn("text-center py-3 border-r border-border last:border-r-0", isToday && "bg-primary/5")}>
              <p className="text-[10px] font-medium text-muted-foreground uppercase">{WEEK_DAYS[i]}</p>
              <p className={cn("text-lg font-bold", isToday ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="relative overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
        <div className="grid" style={{ gridTemplateColumns: "60px repeat(6, 1fr)" }}>
          {/* Hours column */}
          <div className="border-r border-border">
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-end pr-2 border-b border-border" style={{ height: ROW_H }}>
                <span className="text-[10px] text-muted-foreground -mt-1.5 tabular-nums">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((d, colIdx) => {
            const ds = fmtDate(d);
            const isToday = ds === todayStr;
            const daySessions = sessionsForDate(ds);

            return (
              <div key={colIdx} className={cn("relative border-r border-border last:border-r-0", isToday && "bg-primary/[0.02]")}
                onDoubleClick={() => onDoubleClickSlot(ds)}>
                {/* Hour lines */}
                {HOURS.map((h) => (
                  <div key={h} className="border-b border-border" style={{ height: ROW_H }} />
                ))}

                {/* Session blocks */}
                {daySessions.map((s) => {
                  const startMin = timeToMinutes(s.startTime) - 7 * 60;
                  const endMin = timeToMinutes(s.endTime) - 7 * 60;
                  const top = (startMin / 60) * ROW_H;
                  const height = Math.max(((endMin - startMin) / 60) * ROW_H, 20);

                  return (
                    <div
                      key={s.id}
                      className="absolute left-0.5 right-0.5 rounded-lg px-1.5 py-1 overflow-hidden cursor-default group transition-shadow hover:shadow-md z-10"
                      style={{ top, height, backgroundColor: s.color + "20", borderLeft: `3px solid ${s.color}` }}
                    >
                      <p className="text-[10px] font-semibold truncate" style={{ color: s.color }}>{s.title}</p>
                      <p className="text-[9px] text-muted-foreground truncate">{s.startTime}–{s.endTime}</p>
                      {height > 40 && (
                        <p className="text-[9px] text-muted-foreground truncate mt-0.5">
                          {s.classroom.name} · {s.trainer.firstName} {s.trainer.lastName.charAt(0)}.
                        </p>
                      )}
                      <button onClick={() => onDelete(s.id)} disabled={deletingId === s.id}
                        className="absolute top-1 right-1 hidden group-hover:flex size-5 items-center justify-center rounded bg-background/80 text-muted-foreground hover:text-destructive transition-colors">
                        {deletingId === s.id ? <Loader2 className="size-2.5 animate-spin" /> : <Trash2 className="size-2.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DAY VIEW (single day, 7h–22h)
   ═══════════════════════════════════════════════════════ */

function DayView({
  currentDate, sessions, todayStr, onDoubleClickSlot, onDelete, deletingId,
}: {
  currentDate: Date; sessions: PlanningSession[]; todayStr: string;
  onDoubleClickSlot: () => void; onDelete: (id: string) => void; deletingId: string | null;
}) {
  const ROW_H = 60;
  const ds = fmtDate(currentDate);
  const isToday = ds === todayStr;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Day header */}
      <div className="grid border-b border-border" style={{ gridTemplateColumns: "60px 1fr" }}>
        <div className="border-r border-border" />
        <div className={cn("text-center py-3", isToday && "bg-primary/5")}>
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {currentDate.toLocaleDateString("fr-FR", { weekday: "long" })}
          </p>
          <p className={cn("text-2xl font-bold", isToday ? "text-primary" : "text-foreground")}>{currentDate.getDate()}</p>
        </div>
      </div>

      {/* Time grid */}
      <div className="relative overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
        <div className="grid" style={{ gridTemplateColumns: "60px 1fr" }}>
          {/* Hours */}
          <div className="border-r border-border">
            {HOURS.map((h) => (
              <div key={h} className="flex items-start justify-end pr-2 border-b border-border" style={{ height: ROW_H }}>
                <span className="text-[10px] text-muted-foreground -mt-1.5 tabular-nums">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {/* Column */}
          <div className={cn("relative", isToday && "bg-primary/[0.02]")} onDoubleClick={onDoubleClickSlot}>
            {HOURS.map((h) => (
              <div key={h} className="border-b border-border" style={{ height: ROW_H }} />
            ))}

            {sessions.map((s) => {
              const startMin = timeToMinutes(s.startTime) - 7 * 60;
              const endMin = timeToMinutes(s.endTime) - 7 * 60;
              const top = (startMin / 60) * ROW_H;
              const height = Math.max(((endMin - startMin) / 60) * ROW_H, 28);

              return (
                <div
                  key={s.id}
                  className="absolute left-1 right-1 rounded-xl px-3 py-2 overflow-hidden group transition-shadow hover:shadow-md z-10"
                  style={{ top, height, backgroundColor: s.color + "18", borderLeft: `4px solid ${s.color}` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: s.color }}>{s.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{s.startTime} – {s.endTime}</span>
                      </div>
                      {height > 55 && (
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: s.classroom.color + "1a", color: s.classroom.color }}>
                            <School className="size-2.5" />{s.classroom.name}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            <Briefcase className="size-2.5" />{s.trainer.firstName} {s.trainer.lastName}
                          </span>
                        </div>
                      )}
                      {height > 80 && s.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" /><span className="truncate">{s.location}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => onDelete(s.id)} disabled={deletingId === s.id}
                      className="hidden group-hover:flex size-6 shrink-0 items-center justify-center rounded-lg bg-background/80 text-muted-foreground hover:text-destructive transition-colors">
                      {deletingId === s.id ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Shared small components
   ═══════════════════════════════════════════════════════ */

function SessionCard({ session, onDelete, deletingId }: { session: PlanningSession; onDelete: (id: string) => void; deletingId: string | null }) {
  return (
    <div className="rounded-xl border border-border p-3 transition-all hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 size-3 shrink-0 rounded-full" style={{ backgroundColor: session.color }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{session.title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>{session.startTime} - {session.endTime}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: session.classroom.color + "1a", color: session.classroom.color }}>
              <School className="size-2.5" />{session.classroom.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              <Briefcase className="size-2.5" />{session.trainer.firstName} {session.trainer.lastName}
            </span>
          </div>
          {session.location && (
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /><span className="truncate">{session.location}</span>
            </div>
          )}
        </div>
        <button onClick={() => onDelete(session.id)} disabled={deletingId === session.id}
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
          {deletingId === session.id ? <Loader2 className="size-3 animate-spin" /> : <Trash2 className="size-3" />}
        </button>
      </div>
    </div>
  );
}

function EmptyDay({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CalendarDays className="size-8 text-muted-foreground/30 mb-3" />
      <p className="text-xs text-muted-foreground mb-3">Aucune séance ce jour</p>
      <Button size="sm" variant="outline" onClick={onAdd}>
        <Plus className="size-3" />
        Ajouter
      </Button>
    </div>
  );
}
