import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const trainers = await prisma.trainer.findMany({
    where: { ownerId: session.user.id, status: "active" },
    select: { id: true, firstName: true, lastName: true, specialty: true, schoolId: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return NextResponse.json(trainers);
}
