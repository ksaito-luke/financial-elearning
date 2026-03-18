import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const language = searchParams.get("language") || "en";

  const questions = await prisma.question.findMany({
    where: {
      ...(subject ? { subject } : {}),
      language,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const question = await prisma.question.create({
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
      difficulty: body.difficulty || "medium",
      language: body.language || "en",
    },
  });

  return NextResponse.json(question, { status: 201 });
}
