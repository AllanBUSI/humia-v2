import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SchoolCard } from "@/components/app/school-card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Sparkles, Zap, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session!.user;

  const userSchools = await prisma.school.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const firstName = user.firstName || "there";

  return (
    <div className="animate-fade-in-up">
      {/* Welcome header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bonjour, {firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos établissements et créez des programmes de formation.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/schools/new">
            <Plus />
            Ajouter un établissement
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: Building2,
            label: "Établissements",
            value: userSchools.length.toString(),
            color: "bg-primary/10 text-primary",
          },
          {
            icon: Sparkles,
            label: "Syllabus générés",
            value: "0",
            color: "bg-amber-500/10 text-amber-600",
          },
          {
            icon: Target,
            label: "Conformité Qualiopi",
            value: "100%",
            color: "bg-emerald-500/10 text-emerald-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Schools section */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="size-4 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Mes établissements</h2>
      </div>

      {userSchools.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-16">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Building2 className="size-6 text-primary" />
          </div>
          <p className="mb-1 text-sm font-semibold">Aucun établissement</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Ajoutez votre premier organisme de formation.
          </p>
          <Button asChild>
            <Link href="/dashboard/schools/new">
              <Plus />
              Ajouter un établissement
            </Link>
          </Button>
        </div>
      )}

      {/* Quick actions */}
      {userSchools.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap className="size-4 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold">Actions rapides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md cursor-pointer">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Générer un syllabus</p>
                <p className="text-xs text-muted-foreground">
                  Créez un programme avec l&apos;IA
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/schools/new"
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Plus className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  Ajouter un établissement
                </p>
                <p className="text-xs text-muted-foreground">
                  Nouvel organisme de formation
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
