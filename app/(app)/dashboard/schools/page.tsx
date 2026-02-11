import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SchoolCard } from "@/components/app/school-card";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";

export default async function SchoolsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userSchools = await prisma.school.findMany({
    where: { ownerId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Mes établissements
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos organismes de formation.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/schools/new">
            <Plus />
            Ajouter
          </Link>
        </Button>
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
    </div>
  );
}
