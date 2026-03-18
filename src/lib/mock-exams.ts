export interface MockExamConfig {
  examNumber: number;
  name: string;
  timeLimitMinutes: number;
  description: string;
}

export const MOCK_EXAM_CONFIG: Record<string, MockExamConfig[]> = {
  part1: [
    {
      examNumber: 1,
      name: "Mock Exam 1",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 1 topics",
    },
    {
      examNumber: 2,
      name: "Mock Exam 2",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 1 topics",
    },
    {
      examNumber: 3,
      name: "Mock Exam 3",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 1 topics",
    },
  ],
  part2: [
    {
      examNumber: 1,
      name: "Mock Exam 1",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 2 topics",
    },
    {
      examNumber: 2,
      name: "Mock Exam 2",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 2 topics",
    },
    {
      examNumber: 3,
      name: "Mock Exam 3",
      timeLimitMinutes: 90,
      description: "Full simulation — all Part 2 topics",
    },
  ],
};

/** Seeded shuffle — same examNumber always produces the same order for a given question set */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
