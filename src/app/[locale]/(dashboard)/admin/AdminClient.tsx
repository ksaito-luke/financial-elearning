"use client";

import { useState } from "react";

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
  language: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Messages {
  title: string;
  questions: string;
  addQuestion: string;
  editQuestion: string;
  deleteQuestion: string;
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
  language: string;
  save: string;
  cancel: string;
  totalQuestions: string;
  part1Questions: string;
  part2Questions: string;
  filter: string;
  all: string;
  confirmDelete: string;
  addUser: string;
  users: string;
  userName: string;
  userEmail: string;
  userPassword: string;
  userRole: string;
  student: string;
  admin: string;
}

const BLANK_QUESTION = {
  id: "",
  subject: "part1",
  topic: "",
  content: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
  explanation: "",
  difficulty: "medium",
  language: "en",
};

export default function AdminClient({
  initialQuestions,
  initialUsers,
  totalCount,
  part1Count,
  part2Count,
  messages: m,
}: {
  initialQuestions: Question[];
  initialUsers: User[];
  totalCount: number;
  part1Count: number;
  part2Count: number;
  messages: Messages;
}) {
  const [tab, setTab] = useState<"questions" | "users">("questions");
  const [questions, setQuestions] = useState(initialQuestions);
  const [users, setUsers] = useState(initialUsers);
  const [filterSubject, setFilterSubject] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState(BLANK_QUESTION);
  const [saving, setSaving] = useState(false);

  // User form
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [savingUser, setSavingUser] = useState(false);

  const filtered =
    filterSubject === "all"
      ? questions
      : questions.filter((q) => q.subject === filterSubject);

  function openAdd() {
    setForm(BLANK_QUESTION);
    setEditingQuestion(null);
    setShowForm(true);
  }

  function openEdit(q: Question) {
    setForm(q);
    setEditingQuestion(q);
    setShowForm(true);
  }

  async function handleSaveQuestion() {
    setSaving(true);
    if (editingQuestion) {
      const res = await fetch(`/api/questions/${editingQuestion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setQuestions((qs) => qs.map((q) => (q.id === updated.id ? updated : q)));
      }
    } else {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setQuestions((qs) => [created, ...qs]);
      }
    }
    setSaving(false);
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(m.confirmDelete)) return;
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setQuestions((qs) => qs.filter((q) => q.id !== id));
    }
  }

  async function handleSaveUser() {
    setSavingUser(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });
    if (res.ok) {
      const created = await res.json();
      setUsers((us) => [created, ...us]);
      setUserForm({ name: "", email: "", password: "", role: "student" });
      setShowUserForm(false);
    }
    setSavingUser(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{m.title}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: m.totalQuestions, value: totalCount + (questions.length - initialQuestions.length > 0 ? questions.length - totalCount : 0) },
          { label: m.part1Questions, value: part1Count },
          { label: m.part2Questions, value: part2Count },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-4 text-center"
          >
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(["questions", "users"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "questions" ? m.questions : m.users}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {tab === "questions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{m.all}</option>
              <option value="part1">Part 1</option>
              <option value="part2">Part 2</option>
            </select>
            <button
              onClick={openAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + {m.addQuestion}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.subject}
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.topic}
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium hidden md:table-cell">
                    {m.content}
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.difficulty}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700 uppercase text-xs">
                      {q.subject}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">
                      {q.topic}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate hidden md:table-cell">
                      {q.content}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          q.difficulty === "easy"
                            ? "bg-green-50 text-green-700"
                            : q.difficulty === "hard"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(q)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          {m.deleteQuestion}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-400 text-sm"
                    >
                      No questions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowUserForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + {m.addUser}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.userName}
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.userEmail}
                  </th>
                  <th className="text-left px-4 py-3 text-slate-600 font-medium">
                    {m.userRole}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">
                      {u.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                {editingQuestion ? m.editQuestion : m.addQuestion}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {m.subject}
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="part1">Part 1</option>
                    <option value="part2">Part 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {m.topic}
                  </label>
                  <input
                    value={form.topic}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, topic: e.target.value }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.content}
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {(["A", "B", "C", "D"] as const).map((key) => {
                const fieldKey = `option${key}` as keyof typeof form;
                return (
                  <div key={key}>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {m[`option${key}` as keyof typeof m]}
                    </label>
                    <input
                      value={form[fieldKey]}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          [fieldKey]: e.target.value,
                        }))
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                );
              })}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {m.correctAnswer}
                  </label>
                  <select
                    value={form.correctAnswer}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, correctAnswer: e.target.value }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["A", "B", "C", "D"].map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {m.difficulty}
                  </label>
                  <select
                    value={form.difficulty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, difficulty: e.target.value }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {m.language}
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, language: e.target.value }))
                    }
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.explanation}
                </label>
                <textarea
                  value={form.explanation}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, explanation: e.target.value }))
                  }
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {m.cancel}
              </button>
              <button
                onClick={handleSaveQuestion}
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "..." : m.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{m.addUser}</h2>
              <button
                onClick={() => setShowUserForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.userName}
                </label>
                <input
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.userEmail}
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.userPassword}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {m.userRole}
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, role: e.target.value }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">{m.student}</option>
                  <option value="admin">{m.admin}</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowUserForm(false)}
                className="px-4 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                {m.cancel}
              </button>
              <button
                onClick={handleSaveUser}
                disabled={savingUser}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {savingUser ? "..." : m.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
