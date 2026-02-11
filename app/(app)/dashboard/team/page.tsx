"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Users,
  Plus,
  Loader2,
  Mail,
  Trash2,
  UserPlus,
  Crown,
  Eye,
  UserCheck,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TeamMember = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  createdAt: string;
};

const ROLES = [
  { value: "admin", label: "Admin", icon: Crown, color: "text-amber-600 bg-amber-500/10" },
  { value: "member", label: "Membre", icon: UserCheck, color: "text-primary bg-primary/10" },
  { value: "viewer", label: "Lecteur", icon: Eye, color: "text-emerald-600 bg-emerald-500/10" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Form
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");

  const fetchMembers = useCallback(async () => {
    const res = await fetch("/api/team");
    if (res.ok) {
      const data = await res.json();
      setMembers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    setError("");

    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, role }),
    });

    if (res.ok) {
      setEmail("");
      setName("");
      setRole("member");
      setShowForm(false);
      fetchMembers();
    } else {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
    }
    setAdding(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
    setDeletingId(null);
  }

  function getRoleInfo(roleValue: string) {
    return ROLES.find((r) => r.value === roleValue) || ROLES[1];
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
          <h1 className="text-2xl font-bold tracking-tight">Mon équipe</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez les membres de votre équipe et leurs rôles.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus />
          Ajouter un membre
        </Button>
      </div>

      {/* Add member form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <UserPlus className="size-4 text-primary" />
              </div>
              <h2 className="text-sm font-semibold">
                Inviter un nouveau membre
              </h2>
            </div>
            <button
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
              className="flex size-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="member-email"
                label="Email"
                type="email"
                placeholder="collegue@formation.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FormField
                id="member-name"
                label="Nom (optionnel)"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rôle</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                      role === r.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        r.color
                      )}
                    >
                      <r.icon className="size-3.5" />
                    </div>
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={adding || !email}>
                {adding && <Loader2 className="animate-spin" />}
                <Mail className="size-4" />
                Envoyer l&apos;invitation
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Members list */}
      {members.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Users className="size-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">
              {members.length} membre{members.length > 1 ? "s" : ""}
            </h2>
          </div>

          {members.map((member) => {
            const roleInfo = getRoleInfo(member.role);
            const RoleIcon = roleInfo.icon;
            return (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-sm"
              >
                {/* Avatar */}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {(member.name || member.email).charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {member.name || member.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.email}
                  </p>
                </div>

                {/* Status */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {member.status === "pending" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600">
                      <Clock className="size-3" />
                      En attente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                      <UserCheck className="size-3" />
                      Actif
                    </span>
                  )}
                </div>

                {/* Role badge */}
                <div
                  className={cn(
                    "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1",
                    roleInfo.color
                  )}
                >
                  <RoleIcon className="size-3" />
                  <span className="text-[10px] font-semibold">
                    {roleInfo.label}
                  </span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  {deletingId === member.id ? (
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
              <Users className="size-6 text-primary" />
            </div>
            <p className="mb-1 text-sm font-semibold">
              Aucun membre dans votre équipe
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Invitez des collaborateurs pour travailler ensemble.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus />
              Ajouter un membre
            </Button>
          </div>
        )
      )}
    </div>
  );
}
