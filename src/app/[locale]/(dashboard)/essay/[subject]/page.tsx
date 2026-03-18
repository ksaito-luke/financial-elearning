import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EssayClient from "./EssayClient";

export default async function EssayPage({
  params,
}: {
  params: Promise<{ locale: string; subject: string }>;
}) {
  const { locale, subject } = await params;

  if (!["part1", "part2"].includes(subject)) notFound();

  const session = await auth();
  const userId = session?.user?.id as string;

  const questions = await prisma.essayQuestion.findMany({
    where: { subject, language: "en" },
    orderBy: [{ examNumber: "asc" }, { createdAt: "asc" }],
  });

  const attempts = await prisma.essayAttempt.findMany({
    where: { userId },
    select: { essayQuestionId: true, selfScore: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // Keep latest attempt per question
  const latestAttempt: Record<string, number> = {};
  for (const a of attempts) {
    if (!(a.essayQuestionId in latestAttempt)) {
      latestAttempt[a.essayQuestionId] = a.selfScore;
    }
  }

  return (
    <EssayClient
      questions={questions}
      selfScores={latestAttempt}
      userId={userId}
      locale={locale}
      subject={subject}
    />
  );
}
