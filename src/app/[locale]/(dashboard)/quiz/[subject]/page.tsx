import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getSections, getTopicBySectionCode } from "@/lib/sections";
import SectionSelector from "./SectionSelector";
import QuizClient from "./QuizClient";

interface Props {
  params: Promise<{ locale: string; subject: string }>;
  searchParams: Promise<{ section?: string }>;
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { locale, subject } = await params;
  const { section } = await searchParams;

  const VALID_SUBJECTS = ["part1", "part2", "bookkeeping3", "bookkeeping2", "toeic600", "toeic800"];
  const SUBJECT_LABELS: Record<string, string> = {
    part1: "Part 1", part2: "Part 2",
    bookkeeping3: "簿記3級", bookkeeping2: "簿記2級",
    toeic600: "TOEIC 600点", toeic800: "TOEIC 800点",
  };
  const getSubjectLabel = (s: string) => SUBJECT_LABELS[s] ?? s;
  if (!VALID_SUBJECTS.includes(subject)) {
    notFound();
  }

  const t = await getTranslations("quiz");
  const session = await auth();
  const userId = session?.user?.id as string;
  const sections = getSections(subject);

  // ── No section selected → show section selector ──────────────────────────
  if (!section) {
    // Fetch per-section attempt stats
    const allAttempts = await prisma.userAttempt.findMany({
      where: { userId, question: { subject } },
      include: { question: { select: { topic: true } } },
    });

    const sectionStats = sections.map((sec) => {
      const secAttempts = allAttempts.filter(
        (a) => a.question.topic === sec.topic
      );
      return {
        code: sec.code,
        attempted: secAttempts.length,
        correct: secAttempts.filter((a) => a.isCorrect).length,
      };
    });

    const questionCounts = await Promise.all(
      sections.map((sec) =>
        prisma.question.count({
          where: { subject, topic: sec.topic },
        })
      )
    );

    return (
      <SectionSelector
        subject={subject}
        locale={locale}
        sections={sections}
        sectionStats={sectionStats}
        questionCounts={questionCounts}
        subjectLabel={getSubjectLabel(subject)}
      />
    );
  }

  // ── Section selected → run quiz ───────────────────────────────────────────
  const isAll = section === "all";
  const topicFilter = isAll ? null : getTopicBySectionCode(subject, section);

  // For USCMA subjects use English questions; for others fetch all languages
  const uscmaSubjects = ["part1", "part2"];
  const langFilter = uscmaSubjects.includes(subject) ? { language: "en" } : {};

  const questions = await prisma.question.findMany({
    where: {
      subject,
      ...langFilter,
      ...(topicFilter ? { topic: topicFilter } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const shuffled = [...questions].sort(() => Math.random() - 0.5);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const attemptedToday = await prisma.userAttempt.findMany({
    where: { userId, createdAt: { gte: todayStart } },
    select: { questionId: true },
  });
  const attemptedIds = new Set(attemptedToday.map((a) => a.questionId));
  const unattempted = shuffled.filter((q) => !attemptedIds.has(q.id));
  const attempted = shuffled.filter((q) => attemptedIds.has(q.id));
  const ordered = [...unattempted, ...attempted];

  const sectionLabel = isAll
    ? "All Sections"
    : sections.find((s) => s.code === section)?.labelEn ?? section;

  if (ordered.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">{t("noQuestions")}</p>
      </div>
    );
  }

  const messages = {
    question: t("question"),
    of: t("of"),
    submit: t("submit"),
    next: t("next"),
    correct: t("correct"),
    incorrect: t("incorrect"),
    yourAnswer: t("yourAnswer"),
    correctAnswer: t("correctAnswer"),
    explanation: t("explanation"),
    finish: t("finish"),
    topic: t("topic"),
    difficulty: t("difficulty"),
    easy: t("easy"),
    medium: t("medium"),
    hard: t("hard"),
    sessionComplete: t("sessionComplete"),
    backToDashboard: t("backToDashboard"),
  };

  return (
    <QuizClient
      questions={ordered}
      userId={userId}
      locale={locale}
      subject={subject}
      sectionLabel={sectionLabel}
      messages={messages}
    />
  );
}
