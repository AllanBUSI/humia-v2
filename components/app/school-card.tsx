import Link from "next/link";
import type { School } from "@prisma/client";
import { Building2, ArrowRight, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function SchoolCard({ school }: { school: School }) {
  const location = [school.city, school.postalCode].filter(Boolean).join(" ");

  return (
    <Link href={`/dashboard/schools/${school.id}`}>
      <div className="group rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-primary/20">
        <div className="flex items-start gap-4">
          <Avatar className="size-12 rounded-xl">
            {school.logoUrl ? (
              <AvatarImage src={school.logoUrl} alt={school.name} />
            ) : null}
            <AvatarFallback className="rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {school.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{school.name}</h3>
            {location && (
              <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {location}
              </p>
            )}
          </div>
          <ArrowRight className="size-4 mt-1 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
        </div>
        {school.siret && (
          <div className="mt-3 pt-3 border-t border-border">
            <Badge variant="secondary" className="text-[10px]">
              SIRET {school.siret}
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
}
