"use client";

import { useState } from "react";
import Link from "next/link";

interface EssayQuestion {
  id: string;
  subject: string;
  topic: string;
  content: string;
  modelAnswer: string;
  examNumber: number | null;
}

interface Props {
  questions: EssayQuestion[];
  selfScores: Record<string, number>;
  userId: string;
  locale: string;
  subject: string;
}

const SELF_SCORE_LABELS = [
  { value: 0, label: "Didn't know", color: "bg-red-100 text-red-700 border-red-300" },
  { value: 1, label: "Partially knew", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: 2, label: "Knew it well", color: "bg-green-100 text-green-700 border-green-300" },
];

export default function EssayClient({
  questions,
  selfScores: initialScores,
  userId,
  locale,
  subject,
}: Props) {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState<string | null>(null);

  const subjectLabel = subject === "part1" ? "Part 1" : "Part 2";
  const color = subject === "part1" ? "blue" : "indigo";
  const bgClass = color === "blue" ? "bg-blue-600" : "bg-indigo-600";

  const question = questions[selectedIndex];

  const reviewedCount = Object.keys(scores).filter(
    (id) => questions.some((q) => q.id === id)
  ).length;

  async function handleSelfScore(qId: string, score: number) {
    setSaving(qId);
    await fetch("/api/essay-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, essayQuestionId: qId, selfScore: score }),
    });
    setScores((s) => ({ ...s, [qId]: score }));
    setSaving(null);
  }

  function getScoreStyle(score: number) {
    return SELF_SCORE_LABELS[score]?.color ?? "";
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        No essay questions available yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/dashboard`}
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          ← Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600 text-sm font-medium">
          {subjectLabel} — Essay Practice
        </span>
      </div>

      <div className={`${bgClass} rounded-2xl p-5 text-white flex items-center justify-between`}>
        <div>
          <h1 className="text-lg font-bold">{subjectLabel} — Written Questions</h1>
          <p className="text-white/70 text-sm mt-0.5">
            Read each scenario, draft your answer mentally or on paper, then reveal the model answer.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold">{reviewedCount}/{questions.length}</p>
          <p className="text-white/70 text-xs">Reviewed</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar: question list */}
        <div className="w-56 flex-shrink-0 space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Questions
          </p>
          {questions.map((q, i) => {
            const score = scores[q.id];
            return (
              <button
                key={q.id}
                onClick={() => setSelectedIndex(i)}
                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                  selectedIndex === i
                    ? `border-${color === "blue" ? "blue" : "indigo"}-500 bg-${color === "blue" ? "blue" : "indigo"}-50`
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Exam {q.examNumber ?? "—"}
                    </p>
                    <p className="text-xs font-medium text-slate-700 truncate mt-0.5">
                      {q.topic}
                    </p>
                  </div>
                  {score !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                        score === 2
                          ? "bg-green-100 text-green-700"
                          : score === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {score === 2 ? "✓" : score === 1 ? "△" : "✗"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main: question + answer */}
        <div className="flex-1 space-y-4">
          {/* Question */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {question.topic}
                </span>
                {question.examNumber && (
                  <span className="text-xs text-slate-400">
                    Exam {question.examNumber}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                {selectedIndex + 1} / {questions.length}
              </span>
            </div>

            <div className="px-6 py-5">
              <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
                Scenario & Required
              </h2>
              <pre className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {question.content}
              </pre>
            </div>
          </div>

          {/* Reveal button */}
          {!revealed[question.id] ? (
            <button
              onClick={() =>
                setRevealed((r) => ({ ...r, [question.id]: true }))
              }
              className={`w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-${color === "blue" ? "blue" : "indigo"}-400 hover:text-${color === "blue" ? "blue" : "indigo"}-600 transition-colors font-medium text-sm`}
            >
              Reveal Model Answer
            </button>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Model Answer
                </h2>
              </div>
              <div className="px-6 py-5">
                <pre className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {question.modelAnswer}
                </pre>
              </div>

              {/* Self-assessment */}
              <div className="px-6 pb-6 border-t border-slate-100 pt-4">
                <p className="text-xs font-medium text-slate-500 mb-3">
                  How well did you know this?
                </p>
                <div className="flex gap-2">
                  {SELF_SCORE_LABELS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSelfScore(question.id, s.value)}
                      disabled={saving === question.id}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        scores[question.id] === s.value
                          ? s.color + " border-current"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedIndex((i) => Math.max(0, i - 1));
                setRevealed({});
              }}
              disabled={selectedIndex === 0}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                setSelectedIndex((i) => Math.min(questions.length - 1, i + 1));
                setRevealed({});
              }}
              disabled={selectedIndex === questions.length - 1}
              className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium ${bgClass} hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
