import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { MOCK_EXAM_CONFIG } from "@/lib/mock-exams";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const session = await auth();
  const userId = session?.user?.id as string;

  const NEW_SUBJECT_IDS = ["bookkeeping3", "bookkeeping2", "toeic600", "toeic800"];

  const [
    part1Total, part2Total,
    part1Attempts, part2Attempts,
    part1EssayTotal, part2EssayTotal,
    mockResults,
    recentAttempts,
    ...newSubjectData
  ] = await Promise.all([
    prisma.question.count({ where: { subject: "part1", language: "en" } }),
    prisma.question.count({ where: { subject: "part2", language: "en" } }),
    prisma.userAttempt.findMany({
      where: { userId, question: { subject: "part1" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userAttempt.findMany({
      where: { userId, question: { subject: "part2" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.essayQuestion.count({ where: { subject: "part1" } }),
    prisma.essayQuestion.count({ where: { subject: "part2" } }),
    prisma.mockExamResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userAttempt.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // New subjects: [total, attempts] pairs
    ...NEW_SUBJECT_IDS.flatMap((sid) => [
      prisma.question.count({ where: { subject: sid } }),
      prisma.userAttempt.findMany({ where: { userId, question: { subject: sid } }, orderBy: { createdAt: "desc" } }),
    ]),
  ]);

  const part1Correct = part1Attempts.filter((a) => a.isCorrect).length;
  const part2Correct = part2Attempts.filter((a) => a.isCorrect).length;
  const part1Accuracy = part1Attempts.length > 0 ? Math.round((part1Correct / part1Attempts.length) * 100) : 0;
  const part2Accuracy = part2Attempts.length > 0 ? Math.round((part2Correct / part2Attempts.length) * 100) : 0;

  const NEW_SUBJECT_META: Record<string, { label: string; desc: string; color: string }> = {
    bookkeeping3: { label: "簿記3級", desc: "日商簿記検定 3級", color: "emerald" },
    bookkeeping2: { label: "簿記2級", desc: "日商簿記検定 2級", color: "teal" },
    toeic600: { label: "TOEIC 600点", desc: "TOEIC L&R 600点突破", color: "orange" },
    toeic800: { label: "TOEIC 800点", desc: "TOEIC L&R 800点突破", color: "rose" },
  };

  const newSubjects = NEW_SUBJECT_IDS.map((sid, i) => {
    const total = newSubjectData[i * 2] as number;
    const attempts = newSubjectData[i * 2 + 1] as { isCorrect: boolean }[];
    const correct = attempts.filter((a) => a.isCorrect).length;
    const accuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;
    const meta = NEW_SUBJECT_META[sid];
    return { id: sid, label: meta.label, desc: meta.desc, total, attempted: attempts.length, correct, accuracy, essayTotal: 0, color: meta.color, hasMockExam: false };
  });

  const subjects = [
    { id: "part1", label: t("part1"), desc: t("part1Desc"), total: part1Total, attempted: part1Attempts.length, correct: part1Correct, accuracy: part1Accuracy, essayTotal: part1EssayTotal, color: "blue", hasMockExam: true },
    { id: "part2", label: t("part2"), desc: t("part2Desc"), total: part2Total, attempted: part2Attempts.length, correct: part2Correct, accuracy: part2Accuracy, essayTotal: part2EssayTotal, color: "indigo", hasMockExam: true },
    ...newSubjects,
  ];

  // Best mock exam score per (subject, examNumber)
  const mockBest: Record<string, number> = {};
  for (const r of mockResults) {
    const key = `${r.subject}-${r.examNumber}`;
    if (!(key in mockBest) || r.percentage > mockBest[key]) {
      mockBest[key] = r.percentage;
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {t("welcome")}, {session?.user?.name || session?.user?.email?.split("@")[0]}
        </h1>
        <p className="text-slate-500 mt-1">{t("title")}</p>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const colorMap: Record<string, { bg: string; bar: string }> = {
            blue: { bg: "bg-blue-600", bar: "bg-blue-500" },
            indigo: { bg: "bg-indigo-600", bar: "bg-indigo-500" },
            emerald: { bg: "bg-emerald-600", bar: "bg-emerald-500" },
            teal: { bg: "bg-teal-600", bar: "bg-teal-500" },
            orange: { bg: "bg-orange-500", bar: "bg-orange-400" },
            rose: { bg: "bg-rose-600", bar: "bg-rose-500" },
          };
          const colors = colorMap[subject.color] ?? colorMap.blue;
          return (
            <div key={subject.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`px-6 py-5 ${colors.bg}`}>
                <h2 className="text-xl font-bold text-white">{subject.label}</h2>
                <p className="text-white/80 text-sm mt-1">{subject.desc}</p>
              </div>

              <div className="p-6 space-y-5">
                {/* MCQ Stats */}
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">MCQ Practice</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <p className="text-xl font-bold text-slate-900">{subject.total}</p>
                      <p className="text-xs text-slate-400">{t("totalQuestions")}</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <p className="text-xl font-bold text-slate-900">{subject.attempted}</p>
                      <p className="text-xs text-slate-400">{t("attempted")}</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-xl py-2">
                      <p className={`text-xl font-bold ${subject.accuracy >= 70 ? "text-green-600" : subject.accuracy >= 50 ? "text-yellow-600" : "text-red-500"}`}>
                        {subject.attempted > 0 ? `${subject.accuracy}%` : "—"}
                      </p>
                      <p className="text-xs text-slate-400">{t("accuracy")}</p>
                    </div>
                  </div>
                  {subject.total > 0 && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors.bar}`}
                          style={{ width: `${Math.min((subject.attempted / subject.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className={`grid gap-2 ${subject.hasMockExam ? "grid-cols-2" : "grid-cols-1"}`}>
                  <Link
                    href={`/${locale}/quiz/${subject.id}`}
                    className={`text-center py-2.5 px-3 rounded-xl font-medium text-white text-sm transition-colors ${colors.bg} hover:opacity-90`}
                  >
                    {subject.attempted > 0 ? "Continue MCQ" : "Start MCQ"}
                  </Link>
                  {subject.hasMockExam && (
                    <Link
                      href={`/${locale}/essay/${subject.id}`}
                      className="text-center py-2.5 px-3 rounded-xl font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 text-sm transition-colors"
                    >
                      Essay ({subject.essayTotal})
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mock Exams */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Mock Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.filter((s) => s.hasMockExam).map((subject) => (
            <div key={subject.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{subject.label}</h3>
                  <p className="text-xs text-slate-400">90 min · MCQ + Written</p>
                </div>
                <Link
                  href={`/${locale}/mock/${subject.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  All exams →
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {MOCK_EXAM_CONFIG[subject.id].map((exam) => {
                  const key = `${subject.id}-${exam.examNumber}`;
                  const best = mockBest[key];
                  return (
                    <div key={exam.examNumber} className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{exam.name}</p>
                        {best !== undefined ? (
                          <p className={`text-xs font-semibold mt-0.5 ${best >= 75 ? "text-green-600" : best >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                            Best: {best.toFixed(1)}%
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400">Not attempted</p>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/mock/${subject.id}/${exam.examNumber}`}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white ${subject.color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"} transition-colors`}
                      >
                        {best !== undefined ? "Retake" : "Start"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-900 mb-4">{t("recentActivity")}</h2>
        {recentAttempts.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("noActivity")}</p>
        ) : (
          <div className="space-y-3">
            {recentAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${attempt.isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                  <span className={`text-xs font-bold ${attempt.isCorrect ? "text-green-600" : "text-red-500"}`}>
                    {attempt.isCorrect ? "✓" : "✗"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 line-clamp-1">{attempt.question.content}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {attempt.question.subject.toUpperCase()} · {attempt.question.topic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
