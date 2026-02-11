import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // format: "2026-02"
  const start = searchParams.get("start"); // format: "2026-02-09"
  const end = searchParams.get("end"); // format: "2026-02-14"

  const where: Record<string, unknown> = { ownerId: session.user.id };
  if (start && end) {
    where.date = {
      gte: new Date(start),
      lte: new Date(end),
    };
  } else if (month) {
    const [year, m] = month.split("-").map(Number);
    where.date = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    };
  }

  const sessions = await prisma.planningSession.findMany({
    where,
    include: {
      school: { select: { name: true } },
      classroom: { select: { name: true, color: true } },
      trainer: { select: { firstName: true, lastName: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { classroomId, trainerId, title, description, date, startTime, endTime, location, color } =
    await request.json();

  if (!classroomId || !trainerId || !title || !date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "La classe, le formateur, le titre, la date et les horaires sont requis" },
      { status: 400 }
    );
  }

  // Validate time range 07:00 - 22:00
  const startHour = parseInt(startTime.split(":")[0], 10);
  const endHour = parseInt(endTime.split(":")[0], 10);
  const endMin = parseInt(endTime.split(":")[1], 10);
  if (startHour < 7 || endHour > 22 || (endHour === 22 && endMin > 0)) {
    return NextResponse.json(
      { error: "Les horaires doivent être entre 07:00 et 22:00" },
      { status: 400 }
    );
  }
  if (startTime >= endTime) {
    return NextResponse.json(
      { error: "L'heure de fin doit être après l'heure de début" },
      { status: 400 }
    );
  }

  const classroom = await prisma.classroom.findFirst({
    where: { id: classroomId, ownerId: session.user.id },
  });
  if (!classroom) {
    return NextResponse.json({ error: "Classe introuvable" }, { status: 404 });
  }

  const trainer = await prisma.trainer.findFirst({
    where: { id: trainerId, ownerId: session.user.id },
  });
  if (!trainer) {
    return NextResponse.json({ error: "Formateur introuvable" }, { status: 404 });
  }

  const planningSession = await prisma.planningSession.create({
    data: {
      ownerId: session.user.id,
      schoolId: classroom.schoolId,
      classroomId,
      trainerId,
      title,
      description: description || null,
      date: new Date(date),
      startTime,
      endTime,
      location: location || null,
      color: color || "#7c3aed",
    },
  });

  return NextResponse.json(planningSession);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await prisma.planningSession.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
