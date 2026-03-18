import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const result = await prisma.mockExamResult.create({
    data: {
      userId: body.userId,
      subject: body.subject,
      examNumber: body.examNumber,
      score: body.score,
      total: body.total,
      percentage: body.percentage,
      timeSeconds: body.timeSeconds ?? null,
      answers: JSON.stringify(body.answers),
    },
  });

  return NextResponse.json(result, { status: 201 });
}
