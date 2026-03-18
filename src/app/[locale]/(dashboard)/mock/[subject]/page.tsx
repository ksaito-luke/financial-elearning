import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MOCK_EXAM_CONFIG } from "@/lib/mock-exams";
import Link from "next/link";

export default async function MockExamListPage({
  params,
}: {
  params: Promise<{ locale: string; subject: string }>;
}) {
  const { locale, subject } = await params;
  if (!["part1", "part2"].includes(subject)) notFound();

  const session = await auth();
  const userId = session?.user?.id as string;
  const exams = MOCK_EXAM_CONFIG[subject];

  const results = await prisma.mockExamResult.findMany({
    where: { userId, subject },
    orderBy: { createdAt: "desc" },
  });

  const subjectLabel = subject === "part1" ? "Part 1" : "Part 2";
  const color = subject === "part1" ? "blue" : "indigo";
  const bgClass = color === "blue" ? "bg-blue-600" : "bg-indigo-600";

  // Best + latest result per exam number
  const examStats: Record<
    number,
    { best: number | null; latest: number | null; count: number }
  > = {};
  for (const ex of exams) {
    const examResults = results.filter((r) => r.examNumber === ex.examNumber);
    examStats[ex.examNumber] = {
      best:
        examResults.length > 0
          ? Math.max(...examResults.map((r) => r.percentage))
          : null,
      latest: examResults[0]?.percentage ?? null,
      count: examResults.length,
    };
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/dashboard`}
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          ← Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 text-sm font-medium">
          {subjectLabel} — Mock Exams
        </span>
      </div>

      {/* Header */}
      <div className={`${bgClass} rounded-2xl p-6 text-white`}>
        <h1 className="text-xl font-bold">{subjectLabel} Mock Exams</h1>
        <p className="text-white/70 text-sm mt-1">
          Timed exam simulation · 90 min · MCQ + Written Questions
        </p>
      </div>

      {/* Exam cards */}
      <div className="space-y-4">
        {exams.map((exam) => {
          const stats = examStats[exam.examNumber];
          const hasTaken = stats.count > 0;

          return (
            <div
              key={exam.examNumber}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    >
                      {exam.examNumber}
                    </span>
                    <h2 className="font-semibold text-slate-900">
                      {exam.name}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500 ml-10">
                    {exam.description}
                  </p>

                  {hasTaken && (
                    <div className="ml-10 mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-slate-400 text-xs">Best score</span>
                        <p
                          className={`font-bold ${
                            (stats.best ?? 0) >= 75
                              ? "text-green-600"
                              : (stats.best ?? 0) >= 60
                                ? "text-yellow-600"
                                : "text-red-500"
                          }`}
                        >
                          {stats.best?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Last score</span>
                        <p className="font-semibold text-slate-700">
                          {stats.latest?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-xs">Attempts</span>
                        <p className="font-semibold text-slate-700">
                          {stats.count}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={`/${locale}/mock/${subject}/${exam.examNumber}`}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-white text-sm font-medium ${bgClass} hover:opacity-90 transition-opacity`}
                >
                  {hasTaken ? "Retake" : "Start"}
                </Link>
              </div>

              {/* Past attempts */}
              {hasTaken && (
                <div className="border-t border-slate-100 px-6 py-3">
                  <details className="group">
                    <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                      View past attempts ({stats.count})
                    </summary>
                    <div className="mt-2 space-y-1.5">
                      {results
                        .filter((r) => r.examNumber === exam.examNumber)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center justify-between text-xs text-slate-600"
                          >
                            <span>
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <div className="flex gap-4">
                              <span>
                                {r.score}/{r.total}
                              </span>
                              <span
                                className={`font-semibold ${
                                  r.percentage >= 75
                                    ? "text-green-600"
                                    : r.percentage >= 60
                                      ? "text-yellow-600"
                                      : "text-red-500"
                                }`}
                              >
                                {r.percentage.toFixed(1)}%
                              </span>
                              {r.timeSeconds && (
                                <span className="text-slate-400">
                                  {Math.floor(r.timeSeconds / 60)}m{" "}
                                  {r.timeSeconds % 60}s
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Passing score: 75% · USCMA exam: 100 MCQ + 2 written questions per part
      </p>
    </div>
  );
}
