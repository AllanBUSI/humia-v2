import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const trainers = await prisma.trainer.findMany({
    where: { ownerId: session.user.id },
    include: { school: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(trainers);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { schoolId, firstName, lastName, email, phone, specialty, bio } = await request.json();

  if (!schoolId || !firstName || !lastName) {
    return NextResponse.json(
      { error: "L'établissement, le prénom et le nom sont requis" },
      { status: 400 }
    );
  }

  const school = await prisma.school.findFirst({
    where: { id: schoolId, ownerId: session.user.id },
  });
  if (!school) {
    return NextResponse.json({ error: "Établissement introuvable" }, { status: 404 });
  }

  if (email) {
    const existing = await prisma.trainer.findUnique({
      where: { schoolId_email: { schoolId, email } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un formateur avec cet email existe déjà dans cet établissement" },
        { status: 409 }
      );
    }
  }

  const trainer = await prisma.trainer.create({
    data: {
      ownerId: session.user.id,
      schoolId,
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      specialty: specialty || null,
      bio: bio || null,
    },
  });

  return NextResponse.json(trainer);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await prisma.trainer.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
