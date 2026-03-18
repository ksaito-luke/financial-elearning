"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  topic: string;
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

interface EssayQuestion {
  id: string;
  topic: string;
  content: string;
  modelAnswer: string;
}

interface Props {
  questions: Question[];
  essayQuestions: EssayQuestion[];
  userId: string;
  locale: string;
  subject: string;
  examNumber: number;
  examName: string;
  timeLimitMinutes: number;
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

type Phase = "intro" | "mcq" | "essay" | "results";

export default function MockExamClient({
  questions,
  essayQuestions,
  userId,
  locale,
  subject,
  examNumber,
  examName,
  timeLimitMinutes,
}: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId → answer
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<{
    score: number;
    total: number;
    percentage: number;
    timeSeconds: number;
    details: { q: Question; selected: string; isCorrect: boolean }[];
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [essayIndex, setEssayIndex] = useState(0);
  const [essayRevealed, setEssayRevealed] = useState<Record<string, boolean>>({});

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "mcq" && startTime) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitMCQ(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startTime]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function startExam() {
    setStartTime(Date.now());
    setPhase("mcq");
  }

  function toggleFlag(id: string) {
    setFlagged((f) => {
      const n = new Set(f);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function handleSubmitMCQ(timeExpired = false) {
    if (timerRef.current) clearInterval(timerRef.current);

    const elapsed = startTime
      ? Math.round((Date.now() - startTime) / 1000)
      : timeLimitMinutes * 60;

    const details = questions.map((q) => ({
      q,
      selected: answers[q.id] ?? "",
      isCorrect: answers[q.id] === q.correctAnswer,
    }));
    const score = details.filter((d) => d.isCorrect).length;
    const total = questions.length;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    setSaving(true);
    await fetch("/api/mock-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        subject,
        examNumber,
        score,
        total,
        percentage,
        timeSeconds: timeExpired ? timeLimitMinutes * 60 : elapsed,
        answers,
      }),
    });
    setSaving(false);

    setResults({ score, total, percentage, timeSeconds: elapsed, details });

    if (essayQuestions.length > 0) {
      setPhase("essay");
    } else {
      setPhase("results");
    }
  }

  const color = subject === "part1" ? "blue" : "indigo";
  const bgClass = color === "blue" ? "bg-blue-600" : "bg-indigo-600";
  const subjectLabel = subject === "part1" ? "Part 1" : "Part 2";

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/mock/${subject}`}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            ← {subjectLabel} Mock Exams
          </Link>
        </div>

        <div className={`${bgClass} rounded-2xl p-8 text-white text-center`}>
          <p className="text-white/70 text-sm mb-1">{subjectLabel}</p>
          <h1 className="text-2xl font-bold">{examName}</h1>
          <p className="text-white/70 mt-2">Timed simulation exam</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="font-semibold text-slate-900">Exam Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["MCQ Questions", `${questions.length} questions`],
              ["Written Questions", `${essayQuestions.length} questions`],
              ["Time Limit", `${timeLimitMinutes} minutes`],
              ["Passing Score", "75%"],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 text-xs">{label}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="font-medium text-amber-800 mb-1">Instructions</p>
            <ul className="space-y-1 text-amber-700">
              <li>• The timer starts when you click Start Exam</li>
              <li>• You can flag questions for review and navigate freely</li>
              <li>• Submit when finished — results are saved automatically</li>
              <li>• Written questions appear after the MCQ section</li>
            </ul>
          </div>

          <button
            onClick={startExam}
            className={`w-full py-3 rounded-xl text-white font-semibold ${bgClass} hover:opacity-90 transition-opacity`}
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // ── MCQ ──────────────────────────────────────────────────────────────────
  if (phase === "mcq") {
    const question = questions[currentQ];
    const answered = answers[question.id];
    const answeredCount = Object.keys(answers).length;

    const options: Record<string, string> = {
      A: question.optionA,
      B: question.optionB,
      C: question.optionC,
      D: question.optionD,
    };

    const urgent = timeLeft < 300; // < 5 min

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Top bar */}
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">{examName}</span>
            <span className="text-slate-400 mx-2">·</span>
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
          <div
            className={`font-mono text-lg font-bold ${
              urgent ? "text-red-600 animate-pulse" : "text-slate-900"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Question navigator (sidebar) */}
          <div className="w-40 flex-shrink-0">
            <p className="text-xs text-slate-400 mb-2 font-medium">Questions</p>
            <div className="grid grid-cols-5 gap-1">
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isFlagged = flagged.has(q.id);
                const isCurrent = i === currentQ;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQ(i)}
                    className={`h-7 rounded text-xs font-medium transition-colors ${
                      isCurrent
                        ? `${bgClass} text-white`
                        : isFlagged
                          ? "bg-amber-200 text-amber-800"
                          : isAnswered
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-green-100" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-200" /> Flagged
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-slate-100" /> Unanswered
              </div>
            </div>
          </div>

          {/* Question card */}
          <div className="flex-1 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {question.topic}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      question.difficulty === "easy"
                        ? "bg-green-50 text-green-700"
                        : question.difficulty === "hard"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>
                <button
                  onClick={() => toggleFlag(question.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    flagged.has(question.id)
                      ? "bg-amber-100 border-amber-300 text-amber-700"
                      : "border-slate-200 text-slate-400 hover:border-amber-300"
                  }`}
                >
                  {flagged.has(question.id) ? "★ Flagged" : "☆ Flag"}
                </button>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs text-slate-400 mb-2">
                  Question {currentQ + 1} of {questions.length}
                </p>
                <p className="text-slate-900 font-medium leading-relaxed">
                  {question.content}
                </p>
              </div>

              <div className="px-6 pb-5 space-y-2.5">
                {OPTION_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() =>
                      setAnswers((a) => ({ ...a, [question.id]: key }))
                    }
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                      answered === key
                        ? `${color === "blue" ? "border-blue-500 bg-blue-50 text-blue-900" : "border-indigo-500 bg-indigo-50 text-indigo-900"}`
                        : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-semibold mr-2">{key}.</span>
                    {options[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 text-sm hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              {currentQ < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQ((q) => Math.min(questions.length - 1, q + 1))
                  }
                  className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium ${bgClass} hover:opacity-90`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => handleSubmitMCQ()}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : `Submit (${answeredCount}/${questions.length} answered)`}
                </button>
              )}
            </div>

            {currentQ === questions.length - 1 && answeredCount < questions.length && (
              <p className="text-xs text-amber-600 text-center">
                {questions.length - answeredCount} question(s) unanswered
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ESSAY ────────────────────────────────────────────────────────────────
  if (phase === "essay" && essayQuestions.length > 0) {
    const eq = essayQuestions[essayIndex];

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">
            Written Questions — {examName}
          </span>
          <span className="text-xs text-slate-400">
            {essayIndex + 1} / {essayQuestions.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {eq.topic}
            </span>
          </div>
          <div className="px-6 py-5">
            <pre className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {eq.content}
            </pre>
          </div>
        </div>

        {!essayRevealed[eq.id] ? (
          <button
            onClick={() =>
              setEssayRevealed((r) => ({ ...r, [eq.id]: true }))
            }
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400 text-sm font-medium"
          >
            Reveal Model Answer
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Model Answer
              </p>
            </div>
            <div className="px-6 py-5">
              <pre className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {eq.modelAnswer}
              </pre>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {essayIndex > 0 && (
            <button
              onClick={() => setEssayIndex((i) => i - 1)}
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 text-sm"
            >
              ← Prev
            </button>
          )}
          {essayIndex < essayQuestions.length - 1 ? (
            <button
              onClick={() => setEssayIndex((i) => i + 1)}
              className={`flex-1 py-2.5 rounded-xl text-white text-sm font-medium ${bgClass}`}
            >
              Next Essay →
            </button>
          ) : (
            <button
              onClick={() => setPhase("results")}
              className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              View MCQ Results →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────────────
  if (phase === "results" && results) {
    const passed = results.percentage >= 75;
    const mins = Math.floor(results.timeSeconds / 60);
    const secs = results.timeSeconds % 60;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Score card */}
        <div
          className={`rounded-2xl p-8 text-center ${passed ? "bg-green-600" : "bg-red-500"} text-white`}
        >
          <p className="text-white/70 mb-1">{examName} Results</p>
          <p className="text-6xl font-bold mb-2">
            {results.percentage.toFixed(1)}%
          </p>
          <p className="text-xl font-semibold mb-4">
            {results.score} / {results.total} correct
          </p>
          <div className="inline-block bg-white/20 rounded-xl px-4 py-2 text-sm">
            {passed ? "PASSED ✓" : "NOT PASSED"} · Passing: 75%
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            [
              "Time taken",
              `${mins}m ${secs.toString().padStart(2, "0")}s`,
            ],
            ["Correct", `${results.score}`],
            ["Incorrect", `${results.total - results.score}`],
          ].map(([label, val]) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center"
            >
              <p className="text-2xl font-bold text-slate-900">{val}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Answer review */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Answer Review</h2>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {results.details.map((d, i) => (
              <div key={d.q.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      d.isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {d.isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">
                      Q{i + 1} · {d.q.topic}
                    </p>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {d.q.content}
                    </p>
                    {!d.isCorrect && (
                      <div className="mt-1.5 flex gap-3 text-xs">
                        <span className="text-red-500">
                          Your answer: {d.selected || "(unanswered)"}
                        </span>
                        <span className="text-green-600">
                          Correct: {d.q.correctAnswer}
                        </span>
                      </div>
                    )}
                    {!d.isCorrect && (
                      <p className="mt-1.5 text-xs text-slate-500 bg-slate-50 rounded p-2">
                        {d.q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/${locale}/mock/${subject}`}
            className="flex-1 text-center py-2.5 border border-slate-300 rounded-xl text-slate-700 text-sm hover:bg-slate-50"
          >
            ← Back to Exams
          </Link>
          <Link
            href={`/${locale}/mock/${subject}/${examNumber}`}
            className={`flex-1 text-center py-2.5 rounded-xl text-white text-sm font-medium ${bgClass} hover:opacity-90`}
          >
            Retake Exam
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
