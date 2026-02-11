"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Route,
  ClipboardCheck,
  Presentation,
  Settings,
  CreditCard,
  Zap,
  Users,
  Briefcase,
  ChevronsUpDown,
  Building2,
  MapPin,
  Check,
  Plus,
  CalendarDays,
  UserRound,
  School,
  Star,
  MessageSquareText,
  BotMessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { href: string; label: string; icon: LucideIcon };

type SchoolItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  city: string | null;
};

// ─── Navigation configs per role ─────────────────────

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/schools", label: "Mes établissements", icon: GraduationCap },
  { href: "/dashboard/students", label: "Mes élèves", icon: UserRound },
  { href: "/dashboard/classes", label: "Mes classes", icon: School },
  { href: "/dashboard/trainers", label: "Mes formateurs", icon: Briefcase },
  { href: "/dashboard/planning", label: "Planification", icon: CalendarDays },
  { href: "/dashboard/grades", label: "Notes", icon: Star },
  { href: "/dashboard/correspondences", label: "Correspondances", icon: MessageSquareText },
  { href: "/dashboard/assistant", label: "Assistant IA", icon: BotMessageSquare },
  { href: "/dashboard/team", label: "Mon équipe", icon: Users },
];

const RESPONSABLE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Élèves", icon: UserRound },
  { href: "/dashboard/classes", label: "Classes", icon: School },
  { href: "/dashboard/trainers", label: "Formateurs", icon: Briefcase },
  { href: "/dashboard/planning", label: "Planification", icon: CalendarDays },
  { href: "/dashboard/grades", label: "Notes", icon: Star },
  { href: "/dashboard/correspondences", label: "Correspondances", icon: MessageSquareText },
  { href: "/dashboard/team", label: "Équipe", icon: Users },
];

const COORDINATEUR_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Élèves", icon: UserRound },
  { href: "/dashboard/classes", label: "Classes", icon: School },
  { href: "/dashboard/trainers", label: "Formateurs", icon: Briefcase },
  { href: "/dashboard/planning", label: "Planification", icon: CalendarDays },
  { href: "/dashboard/grades", label: "Notes", icon: Star },
  { href: "/dashboard/correspondences", label: "Correspondances", icon: MessageSquareText },
];

const FORMATEUR_NAV: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/planning", label: "Mon calendrier", icon: CalendarDays },
  { href: "/dashboard/students", label: "Mes élèves", icon: UserRound },
  { href: "/dashboard/grades", label: "Notes", icon: Star },
  { href: "/dashboard/correspondences", label: "Correspondances", icon: MessageSquareText },
];

const ELEVE_NAV: NavItem[] = [
  { href: "/dashboard/assistant", label: "Assistant IA", icon: BotMessageSquare },
  { href: "/dashboard/planning", label: "Mon planning", icon: CalendarDays },
  { href: "/dashboard/grades", label: "Mes notes", icon: Star },
];

const ADMIN_CREATION: NavItem[] = [
  { href: "/dashboard/programs", label: "Programme de formation", icon: BookOpen },
  { href: "/dashboard/syllabus", label: "Création de syllabus", icon: FileText },
  { href: "/dashboard/paths", label: "Parcours de formation", icon: Route },
  { href: "/dashboard/quizzes", label: "Création d'un QCM", icon: ClipboardCheck },
  { href: "/dashboard/presentations", label: "Création de présentation", icon: Presentation },
];

const FORMATEUR_CREATION: NavItem[] = [
  { href: "/dashboard/quizzes", label: "Création d'un QCM", icon: ClipboardCheck },
  { href: "/dashboard/presentations", label: "Création de présentation", icon: Presentation },
  { href: "/dashboard/syllabus", label: "Support de cours", icon: FileText },
];

const ADMIN_BOTTOM: NavItem[] = [
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
  { href: "/dashboard/billing", label: "Abonnement", icon: CreditCard },
];

const FORMATEUR_BOTTOM: NavItem[] = [
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

function getNavForRole(role: string) {
  switch (role) {
    case "responsable":
      return { main: RESPONSABLE_NAV, creation: ADMIN_CREATION, bottom: ADMIN_BOTTOM };
    case "coordinateur":
      return { main: COORDINATEUR_NAV, creation: ADMIN_CREATION, bottom: FORMATEUR_BOTTOM };
    case "formateur":
      return { main: FORMATEUR_NAV, creation: FORMATEUR_CREATION, bottom: FORMATEUR_BOTTOM };
    case "eleve":
      return { main: ELEVE_NAV, creation: [], bottom: [] };
    default:
      return { main: ADMIN_NAV, creation: ADMIN_CREATION, bottom: ADMIN_BOTTOM };
  }
}

// ─── Components ──────────────────────────────────────

function NavGroup({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar({
  schools,
  role = "admin",
}: {
  schools: SchoolItem[];
  role?: string;
}) {
  const pathname = usePathname();
  const [activeSchool, setActiveSchool] = useState<SchoolItem | null>(
    schools[0] ?? null
  );
  const nav = getNavForRole(role);
  const showSchoolSwitcher = !["formateur", "eleve"].includes(role) && schools.length > 0;
  const showCredits = role === "admin";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex justify-center py-3 overflow-hidden group-data-[collapsible=icon]:py-2">
          <Link href="/dashboard" className="flex justify-center max-w-full">
            <Image
              src="/logo.png"
              alt="Humia"
              width={320}
              height={160}
              className="h-28 max-w-full w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>
        </div>

        {/* Credits display (admin only) */}
        {showCredits && (
          <>
            <div className="mx-2 mt-2 rounded-xl bg-primary/10 p-3 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    Crédits
                  </span>
                </div>
                <span className="text-xs font-bold tabular-nums">5 / 5</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-primary/20 overflow-hidden">
                <div className="h-full w-full rounded-full bg-primary transition-all duration-500" />
              </div>
            </div>
            <div className="mx-auto mt-2 hidden group-data-[collapsible=icon]:flex">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="size-3.5 text-primary" />
              </div>
            </div>
          </>
        )}

        {/* Role badge (non-admin) */}
        {role !== "admin" && (
          <div className="mx-2 mt-2 rounded-xl bg-primary/10 p-2.5 group-data-[collapsible=icon]:hidden">
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
              {role === "responsable" ? "Responsable pédagogique" : role === "coordinateur" ? "Coordinateur pédagogique" : role === "eleve" ? "Élève" : "Formateur"}
            </span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavGroup items={nav.main} pathname={pathname} />
          </SidebarGroupContent>
        </SidebarGroup>

        {nav.creation.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Création</SidebarGroupLabel>
              <SidebarGroupContent>
                <NavGroup items={nav.creation} pathname={pathname} />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        {/* School switcher (admin & responsable only) */}
        {showSchoolSwitcher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full border border-border hover:border-primary/20 rounded-xl"
                tooltip={activeSchool?.name ?? "Établissement"}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="size-4 text-primary" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-xs font-semibold">
                    {activeSchool?.name ?? "Établissement"}
                  </span>
                  {activeSchool?.city && (
                    <span className="truncate text-[10px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="size-2.5" />
                      {activeSchool.city}
                    </span>
                  )}
                </div>
                <ChevronsUpDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-64 rounded-xl">
              {schools.map((school) => (
                <DropdownMenuItem
                  key={school.id}
                  onClick={() => setActiveSchool(school)}
                  className="flex items-center gap-3 rounded-lg p-2"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{school.name}</p>
                    {school.city && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {school.city}
                      </p>
                    )}
                  </div>
                  {activeSchool?.id === school.id && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
              {role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg p-2">
                    <Link href="/dashboard/schools/new" className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg border border-dashed border-border">
                        <Plus className="size-3.5 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Ajouter un établissement
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {nav.bottom.length > 0 && (
          <>
            <SidebarSeparator />
            <NavGroup items={nav.bottom} pathname={pathname} />
          </>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
