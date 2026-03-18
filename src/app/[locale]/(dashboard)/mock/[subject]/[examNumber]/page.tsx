import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MOCK_EXAM_CONFIG, seededShuffle } from "@/lib/mock-exams";
import MockExamClient from "./MockExamClient";

export default async function MockExamPage({
  params,
}: {
  params: Promise<{ locale: string; subject: string; examNumber: string }>;
}) {
  const { locale, subject, examNumber: examNumberStr } = await params;
  const examNumber = parseInt(examNumberStr);

  if (!["part1", "part2"].includes(subject) || isNaN(examNumber)) notFound();

  const examConfig = MOCK_EXAM_CONFIG[subject]?.find(
    (e) => e.examNumber === examNumber
  );
  if (!examConfig) notFound();

  const session = await auth();
  const userId = session?.user?.id as string;

  // Get all MCQ questions, shuffled deterministically by examNumber seed
  const allQuestions = await prisma.question.findMany({
    where: { subject, language: "en" },
    orderBy: { id: "asc" },
  });
  const questions = seededShuffle(allQuestions, examNumber * 12345);

  // Get essay questions for this exam number
  const essayQuestions = await prisma.essayQuestion.findMany({
    where: { subject, examNumber, language: "en" },
    orderBy: { createdAt: "asc" },
  });

  return (
    <MockExamClient
      questions={questions}
      essayQuestions={essayQuestions}
      userId={userId}
      locale={locale}
      subject={subject}
      examNumber={examNumber}
      examName={examConfig.name}
      timeLimitMinutes={examConfig.timeLimitMinutes}
    />
  );
}
