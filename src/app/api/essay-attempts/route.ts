import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const attempt = await prisma.essayAttempt.create({
    data: {
      userId: body.userId,
      essayQuestionId: body.essayQuestionId,
      selfScore: body.selfScore,
    },
  });

  return NextResponse.json(attempt, { status: 201 });
}
