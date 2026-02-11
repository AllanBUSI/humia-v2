import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ROLE_LABELS: Record<string, string> = {
  responsable: "Responsable pédagogique",
  formateur: "Formateur",
  coordinateur: "Coordinateur pédagogique",
};

const VALID_ROLES = ["responsable", "formateur", "coordinateur"];

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, firstName: true, lastName: true },
  });
  if (!dbUser || dbUser.role !== "admin") {
    return NextResponse.json({ error: "Seuls les administrateurs peuvent inviter" }, { status: 403 });
  }

  const { email, firstName, lastName, role, trainerId } = await request.json();

  if (!email || !role || !VALID_ROLES.includes(role)) {
    return NextResponse.json(
      { error: `Email et rôle (${VALID_ROLES.join(", ")}) requis` },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Un utilisateur avec cet email existe déjà" },
      { status: 409 }
    );
  }

  // Create user account with role
  const newUser = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email,
      firstName: firstName || "",
      lastName: lastName || "",
      role,
      parentId: session.user.id,
      onboardingCompleted: true,
      emailVerified: true,
    },
  });

  // If formateur role and trainerId provided, link the trainer
  if (role === "formateur" && trainerId) {
    await prisma.trainer.update({
      where: { id: trainerId, ownerId: session.user.id },
      data: { userId: newUser.id },
    });
  }

  // Send login invitation email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://humia.app";
  const adminName = `${dbUser.firstName} ${dbUser.lastName}`.trim() || "L'administrateur";
  const roleLabel = ROLE_LABELS[role] || role;
  const userDisplayName = firstName ? firstName : "là";

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `${adminName} vous invite sur Humia`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #0f172a; margin-bottom: 8px;">Bienvenue sur Humia</h2>
          <p style="color: #64748b; line-height: 1.6; margin-bottom: 24px;">
            Bonjour ${userDisplayName},<br/><br/>
            <strong>${adminName}</strong> vous a invité en tant que <strong>${roleLabel}</strong> sur Humia, la plateforme de gestion de formation.
          </p>
          <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">
              Connectez-vous avec votre email <strong>${email}</strong>
            </p>
            <a href="${appUrl}/login" style="display: inline-block; background: #1b17ff; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
              Se connecter
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            Vous recevrez un code de connexion à 6 chiffres par email à chaque connexion. Aucun mot de passe n'est nécessaire.
          </p>
        </div>
      `,
    });
  } catch {
    // Email sending is non-blocking — user is still created
    console.error("Failed to send invitation email to", email);
  }

  return NextResponse.json({ id: newUser.id, email: newUser.email, role: newUser.role });
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invitedUsers = await prisma.user.findMany({
    where: { parentId: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      trainerProfile: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitedUsers);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();

  // Unlink trainer if any
  await prisma.trainer.updateMany({
    where: { userId: id },
    data: { userId: null },
  });

  await prisma.user.deleteMany({
    where: { id, parentId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
