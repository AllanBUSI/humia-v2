import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const schoolId = formData.get("schoolId") as string | null;

  if (!file || !schoolId) {
    return NextResponse.json(
      { error: "Fichier et schoolId requis" },
      { status: 400 }
    );
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Type de fichier non supporté" },
      { status: 400 }
    );
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (max 2 Mo)" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "png";
  const fileName = `logo.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "school-logos", schoolId);

  await mkdir(uploadDir, { recursive: true });

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);

  const url = `/uploads/school-logos/${schoolId}/${fileName}`;

  return NextResponse.json({ url });
}
