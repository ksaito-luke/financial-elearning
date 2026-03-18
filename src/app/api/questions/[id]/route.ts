import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const question = await prisma.question.update({
    where: { id },
    data: {
      subject: body.subject,
      topic: body.topic,
      content: body.content,
      optionA: body.optionA,
      optionB: body.optionB,
      optionC: body.optionC,
      optionD: body.optionD,
      correctAnswer: body.correctAnswer,
      explanation: body.explanation,
      difficulty: body.difficulty,
      language: body.language,
    },
  });

  return NextResponse.json(question);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.question.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
