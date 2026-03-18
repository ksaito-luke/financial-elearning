"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  subject: string;
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

interface Messages {
  question: string;
  of: string;
  submit: string;
  next: string;
  correct: string;
  incorrect: string;
  yourAnswer: string;
  correctAnswer: string;
  explanation: string;
  finish: string;
  topic: string;
  difficulty: string;
  easy: string;
  medium: string;
  hard: string;
  sessionComplete: string;
  backToDashboard: string;
}

interface QuizClientProps {
  questions: Question[];
  userId: string;
  locale: string;
  subject: string;
  sectionLabel: string;
  messages: Messages;
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export default function QuizClient({
  questions,
  userId,
  locale,
  subject,
  sectionLabel,
  messages: m,
}: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const question = questions[currentIndex];

  const options: Record<string, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  const isCorrect = submitted && selected === question.correctAnswer;

  function getDifficultyLabel(d: string) {
    if (d === "easy") return m.easy;
    if (d === "hard") return m.hard;
    return m.medium;
  }

  function getDifficultyColor(d: string) {
    if (d === "easy") return "text-green-600 bg-green-50";
    if (d === "hard") return "text-red-600 bg-red-50";
    return "text-yellow-700 bg-yellow-50";
  }

  async function handleSubmit() {
    if (!selected || submitted) return;
    setSubmitting(true);

    const correct = selected === question.correctAnswer;

    await fetch("/api/attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        questionId: question.id,
        selectedAnswer: selected,
        isCorrect: correct,
      }),
    });

    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    setSubmitted(true);
    setSubmitting(false);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  if (finished) {
    const accuracy = Math.round((score.correct / score.total) * 100);
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
          <div className="text-5xl mb-4">
            {accuracy >= 70 ? "🎉" : accuracy >= 50 ? "📚" : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {m.sessionComplete}
          </h2>
          <p className="text-slate-600 mb-6">
            {score.correct} / {score.total} ({accuracy}%)
          </p>

          <div className="h-3 bg-slate-100 rounded-full mb-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${accuracy >= 70 ? "bg-green-500" : accuracy >= 50 ? "bg-yellow-500" : "bg-red-400"}`}
              style={{ width: `${accuracy}%` }}
            />
          </div>

          <Link
            href={`/${locale}/dashboard`}
            className="inline-block bg-blue-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {m.backToDashboard}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Section label + back link */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${locale}/quiz/${subject}`}
          className="text-sm text-slate-400 hover:text-slate-600"
        >
          ← {subject === "part1" ? "Part 1" : "Part 2"}
        </Link>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {sectionLabel}
        </span>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {m.question} {currentIndex + 1} {m.of} {questions.length}
        </span>
        <span>
          ✓ {score.correct} / {score.total}
        </span>
      </div>
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Meta */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {question.topic}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}
          >
            {getDifficultyLabel(question.difficulty)}
          </span>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-slate-900 font-medium leading-relaxed">
            {question.content}
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-5 space-y-2.5">
          {OPTION_KEYS.map((key) => {
            let style =
              "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50";

            if (submitted) {
              if (key === question.correctAnswer) {
                style = "border-green-400 bg-green-50 text-green-800";
              } else if (key === selected && key !== question.correctAnswer) {
                style = "border-red-400 bg-red-50 text-red-800";
              } else {
                style = "border-slate-200 bg-slate-50 text-slate-400";
              }
            } else if (selected === key) {
              style = "border-blue-500 bg-blue-50 text-blue-900";
            }

            return (
              <button
                key={key}
                onClick={() => !submitted && setSelected(key)}
                disabled={submitted}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${style} ${!submitted ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="font-semibold mr-2">{key}.</span>
                {options[key]}
              </button>
            );
          })}
        </div>

        {/* Explanation (after submit) */}
        {submitted && (
          <div
            className={`mx-6 mb-6 p-4 rounded-xl border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
          >
            <p
              className={`font-semibold mb-2 ${isCorrect ? "text-green-700" : "text-red-700"}`}
            >
              {isCorrect ? `✓ ${m.correct}` : `✗ ${m.incorrect}`}
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              <span className="font-medium">{m.explanation}:</span>{" "}
              {question.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "..." : m.submit}
            </button>
          ) : (
            <>
              <Link
                href={`/${locale}/dashboard`}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                {m.finish}
              </Link>
              <button
                onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                {m.next}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
