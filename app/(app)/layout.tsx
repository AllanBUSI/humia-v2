import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppSidebar } from "@/components/app/sidebar";
import { AppHeader } from "@/components/app/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getOwnerId } from "@/lib/roles";
import { VIEW_MODE_COOKIE, type ViewMode } from "@/lib/view-mode";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = session.user;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, parentId: true, onboardingCompleted: true },
  });

  if (!dbUser) redirect("/login");

  const role = dbUser.role || "admin";

  // Onboarding: only required for admins
  if (role === "admin" && !dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  // Auto-complete onboarding for sub-users
  if (role !== "admin" && !dbUser.onboardingCompleted) {
    await prisma.user.update({
      where: { id: user.id },
      data: { onboardingCompleted: true },
    });
  }

  // View mode: admin can switch between views
  const cookieStore = await cookies();
  const viewModeCookie = cookieStore.get(VIEW_MODE_COOKIE)?.value as ViewMode | undefined;
  const viewMode = role === "admin" && viewModeCookie ? viewModeCookie : role;
  // effectiveRole is what the sidebar/nav uses for display
  const effectiveRole = viewMode;

  const displayName =
    `${user.firstName} ${user.lastName}`.trim() || user.email || "";

  // Schools: use effective ownerId (parent's for sub-users)
  const ownerId = getOwnerId({ id: user.id, role, parentId: dbUser.parentId });
  const schools = await prisma.school.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, logoUrl: true, city: true },
  });

  return (
    <SidebarProvider>
      <AppSidebar schools={schools} role={effectiveRole} />
      <SidebarInset>
        <AppHeader displayName={displayName} role={role} viewMode={viewMode} />
        <div className="flex-1 min-w-0 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
