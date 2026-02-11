import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // Check role from DB — only admins go through onboarding
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, onboardingCompleted: true },
  });

  if (!dbUser) redirect("/login");

  // Non-admins never see onboarding → straight to dashboard
  if (dbUser.role !== "admin") {
    // Auto-complete onboarding flag if not already done
    if (!dbUser.onboardingCompleted) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { onboardingCompleted: true },
      });
    }
    redirect("/dashboard");
  }

  // Admin who already completed onboarding → dashboard
  if (dbUser.onboardingCompleted) redirect("/dashboard");

  return <>{children}</>;
}
