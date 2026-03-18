import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const userRole = (session?.user as { role?: string })?.role;

  if (userRole !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations("admin");

  const [questions, users, part1Count, part2Count] = await Promise.all([
    prisma.question.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.count({ where: { subject: "part1" } }),
    prisma.question.count({ where: { subject: "part2" } }),
  ]);

  const messages = {
    title: t("title"),
    questions: t("questions"),
    addQuestion: t("addQuestion"),
    editQuestion: t("editQuestion"),
    deleteQuestion: t("deleteQuestion"),
    subject: t("subject"),
    topic: t("topic"),
    content: t("content"),
    optionA: t("optionA"),
    optionB: t("optionB"),
    optionC: t("optionC"),
    optionD: t("optionD"),
    correctAnswer: t("correctAnswer"),
    explanation: t("explanation"),
    difficulty: t("difficulty"),
    language: t("language"),
    save: t("save"),
    cancel: t("cancel"),
    totalQuestions: t("totalQuestions"),
    part1Questions: t("part1Questions"),
    part2Questions: t("part2Questions"),
    filter: t("filter"),
    all: t("all"),
    confirmDelete: t("confirmDelete"),
    addUser: t("addUser"),
    users: t("users"),
    userName: t("userName"),
    userEmail: t("userEmail"),
    userPassword: t("userPassword"),
    userRole: t("userRole"),
    student: t("student"),
    admin: t("admin"),
  };

  return (
    <AdminClient
      initialQuestions={questions}
      initialUsers={users}
      totalCount={questions.length}
      part1Count={part1Count}
      part2Count={part2Count}
      messages={messages}
    />
  );
}
