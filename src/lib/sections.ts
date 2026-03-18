export interface SectionDef {
  code: string; // "A" | "B" | ...
  topic: string; // matches DB topic field
  weight: number; // exam weight %
  labelEn: string;
  labelJa: string;
}

export const PART1_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "External Financial Reporting Decisions",
    weight: 15,
    labelEn: "External Financial Reporting Decisions",
    labelJa: "外部財務報告の決定",
  },
  {
    code: "B",
    topic: "Planning, Budgeting, and Forecasting",
    weight: 20,
    labelEn: "Planning, Budgeting, and Forecasting",
    labelJa: "計画、予算編成、予測",
  },
  {
    code: "C",
    topic: "Performance Management",
    weight: 20,
    labelEn: "Performance Management",
    labelJa: "パフォーマンス管理",
  },
  {
    code: "D",
    topic: "Cost Management",
    weight: 15,
    labelEn: "Cost Management",
    labelJa: "コスト管理",
  },
  {
    code: "E",
    topic: "Internal Controls",
    weight: 15,
    labelEn: "Internal Controls",
    labelJa: "内部統制",
  },
  {
    code: "F",
    topic: "Technology and Analytics",
    weight: 15,
    labelEn: "Technology and Analytics",
    labelJa: "テクノロジーと分析",
  },
];

export const PART2_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "Financial Statement Analysis",
    weight: 20,
    labelEn: "Financial Statement Analysis",
    labelJa: "財務諸表分析",
  },
  {
    code: "B",
    topic: "Corporate Finance",
    weight: 20,
    labelEn: "Corporate Finance",
    labelJa: "コーポレートファイナンス",
  },
  {
    code: "C",
    topic: "Decision Analysis",
    weight: 25,
    labelEn: "Decision Analysis",
    labelJa: "意思決定分析",
  },
  {
    code: "D",
    topic: "Risk Management",
    weight: 10,
    labelEn: "Risk Management",
    labelJa: "リスク管理",
  },
  {
    code: "E",
    topic: "Investment Decisions",
    weight: 10,
    labelEn: "Investment Decisions",
    labelJa: "投資決定",
  },
  {
    code: "F",
    topic: "Professional Ethics",
    weight: 15,
    labelEn: "Professional Ethics",
    labelJa: "職業倫理",
  },
];

export const BOOKKEEPING3_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "仕訳と帳簿",
    weight: 25,
    labelEn: "Journal Entries and Ledger",
    labelJa: "仕訳と帳簿",
  },
  {
    code: "B",
    topic: "決算整理",
    weight: 25,
    labelEn: "Closing Adjustments",
    labelJa: "決算整理",
  },
  {
    code: "C",
    topic: "財務諸表",
    weight: 25,
    labelEn: "Financial Statements",
    labelJa: "財務諸表",
  },
  {
    code: "D",
    topic: "手形・その他取引",
    weight: 25,
    labelEn: "Bills and Other Transactions",
    labelJa: "手形・その他取引",
  },
];

export const BOOKKEEPING2_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "工業簿記・原価計算",
    weight: 40,
    labelEn: "Cost Accounting",
    labelJa: "工業簿記・原価計算",
  },
  {
    code: "B",
    topic: "株式会社の会計",
    weight: 20,
    labelEn: "Corporate Accounting",
    labelJa: "株式会社の会計",
  },
  {
    code: "C",
    topic: "特殊商品売買",
    weight: 20,
    labelEn: "Special Merchandise Transactions",
    labelJa: "特殊商品売買",
  },
  {
    code: "D",
    topic: "本支店会計",
    weight: 20,
    labelEn: "Head Office and Branch Accounting",
    labelJa: "本支店会計",
  },
];

export const TOEIC600_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "語彙・文法",
    weight: 35,
    labelEn: "Vocabulary and Grammar",
    labelJa: "語彙・文法",
  },
  {
    code: "B",
    topic: "読解",
    weight: 35,
    labelEn: "Reading Comprehension",
    labelJa: "読解",
  },
  {
    code: "C",
    topic: "リスニング",
    weight: 30,
    labelEn: "Listening",
    labelJa: "リスニング",
  },
];

export const TOEIC800_SECTIONS: SectionDef[] = [
  {
    code: "A",
    topic: "高度な語彙・文法",
    weight: 35,
    labelEn: "Advanced Vocabulary and Grammar",
    labelJa: "高度な語彙・文法",
  },
  {
    code: "B",
    topic: "長文読解",
    weight: 35,
    labelEn: "Long Reading Comprehension",
    labelJa: "長文読解",
  },
  {
    code: "C",
    topic: "ビジネスリスニング",
    weight: 30,
    labelEn: "Business Listening",
    labelJa: "ビジネスリスニング",
  },
];

export function getSections(subject: string): SectionDef[] {
  switch (subject) {
    case "part1": return PART1_SECTIONS;
    case "part2": return PART2_SECTIONS;
    case "bookkeeping3": return BOOKKEEPING3_SECTIONS;
    case "bookkeeping2": return BOOKKEEPING2_SECTIONS;
    case "toeic600": return TOEIC600_SECTIONS;
    case "toeic800": return TOEIC800_SECTIONS;
    default: return PART2_SECTIONS;
  }
}

export function getTopicBySectionCode(
  subject: string,
  code: string
): string | null {
  const sections = getSections(subject);
  return sections.find((s) => s.code === code)?.topic ?? null;
}
