import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, address, city, postalCode, phone, email, siret, logoUrl } =
    await request.json();

  const school = await prisma.school.create({
    data: {
      id,
      ownerId: session.user.id,
      name,
      address,
      city,
      postalCode,
      phone,
      email,
      siret,
      logoUrl,
    },
  });

  return NextResponse.json(school);
}
