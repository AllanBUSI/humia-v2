"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LogOut,
  ChevronsUpDown,
  Eye,
  Shield,
  Briefcase,
  UserRound,
  Check,
  ClipboardList,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VIEW_MODE_COOKIE, type ViewMode } from "@/lib/view-mode";

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: typeof Shield }[] = [
  { value: "admin", label: "Vue Admin", icon: Shield },
  { value: "responsable", label: "Vue Responsable", icon: Briefcase },
  { value: "coordinateur", label: "Vue Coordinateur", icon: ClipboardList },
  { value: "formateur", label: "Vue Formateur", icon: Eye },
  { value: "eleve", label: "Vue Élève", icon: UserRound },
];

export function AppHeader({
  displayName,
  role = "admin",
  viewMode,
}: {
  displayName: string;
  role?: string;
  viewMode?: string;
}) {
  const router = useRouter();
  const currentView = (viewMode || role) as ViewMode;

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  function switchView(mode: ViewMode) {
    document.cookie = `${VIEW_MODE_COOKIE}=${mode};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  const isAdmin = role === "admin";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">Humia</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {/* View switcher (admin only) */}
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors outline-none">
              <Eye className="size-3.5 text-primary" />
              <span className="hidden sm:inline">
                {VIEW_OPTIONS.find((v) => v.value === currentView)?.label || "Vue Admin"}
              </span>
              {currentView !== "admin" && (
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              )}
              <ChevronsUpDown className="size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Changer de vue
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {VIEW_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => switchView(opt.value)}
                  className="flex items-center gap-3 rounded-lg"
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                    <opt.icon className="size-3.5 text-primary" />
                  </div>
                  <span className="flex-1 text-sm">{opt.label}</span>
                  {currentView === opt.value && (
                    <Check className="size-3.5 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full px-2 py-1.5 text-sm hover:bg-accent transition-colors outline-none">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden font-medium md:inline-block">
              {displayName}
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{displayName}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
