import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const hashedPassword = await bcrypt.hash(body.password, 12);

  const user = await prisma.user.create({
    data: {
      name: body.name || null,
      email: body.email,
      password: hashedPassword,
      role: body.role || "student",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
