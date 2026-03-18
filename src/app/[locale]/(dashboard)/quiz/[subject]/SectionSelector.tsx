"use client";

import Link from "next/link";
import { SectionDef } from "@/lib/sections";

interface SectionStats {
  code: string;
  attempted: number;
  correct: number;
}

interface Props {
  subject: string;
  locale: string;
  sections: SectionDef[];
  sectionStats: SectionStats[];
  questionCounts: number[];
  subjectLabel: string;
}

export default function SectionSelector({
  subject,
  locale,
  sections,
  sectionStats,
  questionCounts,
  subjectLabel,
}: Props) {
  const totalQuestions = questionCounts.reduce((a, b) => a + b, 0);
  const totalAttempted = sectionStats.reduce((a, s) => a + s.attempted, 0);
  const totalCorrect = sectionStats.reduce((a, s) => a + s.correct, 0);
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null;

  const color = subject === "part1" ? "blue" : "indigo";
  const bgClass = color === "blue" ? "bg-blue-600" : "bg-indigo-600";
  const textClass = color === "blue" ? "text-blue-600" : "text-indigo-600";
  const borderClass = color === "blue" ? "border-blue-600" : "border-indigo-600";
  const hoverClass = color === "blue" ? "hover:bg-blue-700" : "hover:bg-indigo-700";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/dashboard`}
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          ← Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 text-sm font-medium">{subjectLabel}</span>
      </div>

      <div className={`${bgClass} rounded-2xl p-6 text-white`}>
        <h1 className="text-xl font-bold">{subjectLabel}</h1>
        <div className="flex gap-6 mt-3 text-white/80 text-sm">
          <span>{totalQuestions} questions total</span>
          {overallAccuracy !== null && (
            <span>Overall accuracy: {overallAccuracy}%</span>
          )}
        </div>
      </div>

      {/* Study All button */}
      <Link
        href={`/${locale}/quiz/${subject}?section=all`}
        className={`flex items-center justify-between w-full bg-white border-2 ${borderClass} rounded-xl px-5 py-4 hover:bg-slate-50 transition-colors group`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center`}>
            <span className="text-white text-sm font-bold">★</span>
          </div>
          <div className="text-left">
            <p className={`font-semibold ${textClass}`}>Study All Sections</p>
            <p className="text-xs text-slate-500">{totalQuestions} questions · Random order</p>
          </div>
        </div>
        <span className={`${textClass} font-bold text-lg`}>→</span>
      </Link>

      {/* Section list */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
          Study by Section
        </p>
        {sections.map((sec, i) => {
          const stats = sectionStats.find((s) => s.code === sec.code);
          const count = questionCounts[i];
          const attempted = stats?.attempted ?? 0;
          const correct = stats?.correct ?? 0;
          const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : null;
          const progress = count > 0 ? Math.min((attempted / count) * 100, 100) : 0;

          return (
            <Link
              key={sec.code}
              href={`/${locale}/quiz/${subject}?section=${sec.code}`}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-slate-300 hover:shadow-sm transition-all group"
            >
              {/* Section badge */}
              <div className={`w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:${bgClass} transition-colors`}>
                <span className="text-slate-600 font-bold text-sm group-hover:text-white">
                  {sec.code}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-medium text-slate-800 text-sm truncate">
                    {sec.labelEn}
                  </p>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {sec.weight}%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{sec.labelJa}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bgClass} rounded-full transition-all`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 w-20 text-right">
                    {count > 0
                      ? `${attempted}/${count}${accuracy !== null ? ` · ${accuracy}%` : ""}`
                      : "No questions"}
                  </span>
                </div>
              </div>

              <span className="text-slate-300 group-hover:text-slate-500 text-lg flex-shrink-0">→</span>
            </Link>
          );
        })}
      </div>

      {/* Back button */}
      <div className="pt-2">
        <Link
          href={`/${locale}/dashboard`}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
