import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@uscma.com" },
    update: {},
    create: {
      email: "admin@uscma.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("Admin user created:", admin.email);

  // Create student user
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@uscma.com" },
    update: {},
    create: {
      email: "student@uscma.com",
      password: studentPassword,
      name: "Student",
      role: "student",
    },
  });
  console.log("Student user created:", student.email);

  // Part 1 Sample Questions
  const part1Questions = [
    // Section A: External Financial Reporting Decisions
    {
      subject: "part1",
      topic: "External Financial Reporting Decisions",
      content:
        "Under U.S. GAAP, which of the following is NOT a component of comprehensive income?",
      optionA: "Net income",
      optionB: "Foreign currency translation adjustments",
      optionC: "Unrealized gains on available-for-sale securities",
      optionD: "Cash dividends paid to shareholders",
      correctAnswer: "D",
      explanation:
        "Cash dividends paid to shareholders are a distribution of equity and are not included in comprehensive income. Comprehensive income includes net income plus other comprehensive income (OCI) items such as foreign currency translation adjustments and unrealized gains/losses on available-for-sale securities.",
      difficulty: "medium",
    },
    {
      subject: "part1",
      topic: "External Financial Reporting Decisions",
      content:
        "Which inventory costing method results in the highest net income during a period of rising prices?",
      optionA: "FIFO (First-In, First-Out)",
      optionB: "LIFO (Last-In, First-Out)",
      optionC: "Weighted average cost",
      optionD: "Specific identification",
      correctAnswer: "A",
      explanation:
        "During periods of rising prices, FIFO assigns the older (lower) costs to cost of goods sold, resulting in lower COGS and higher gross profit/net income compared to LIFO. LIFO assigns the most recent (higher) costs to COGS, resulting in lower net income.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "External Financial Reporting Decisions",
      content:
        "A company leases equipment for 8 years. The equipment has a useful life of 10 years and the lease contains a purchase option that the lessee is reasonably certain to exercise. Under ASC 842, this lease should be classified as:",
      optionA: "An operating lease",
      optionB: "A finance lease",
      optionC: "A short-term lease",
      optionD: "A sale-leaseback transaction",
      correctAnswer: "B",
      explanation:
        "Under ASC 842, a lease is classified as a finance lease if any of five criteria are met. One criterion is that the lease contains a purchase option that the lessee is reasonably certain to exercise. Since the lessee is reasonably certain to exercise the purchase option, this is a finance lease.",
      difficulty: "medium",
    },
    {
      subject: "part1",
      topic: "External Financial Reporting Decisions",
      content:
        "Which of the following best describes the matching principle in accounting?",
      optionA:
        "Revenue should be recognized when cash is received from customers",
      optionB:
        "Expenses should be recognized in the same period as the revenues they help generate",
      optionC:
        "Assets and liabilities should be recorded at their historical cost",
      optionD: "Financial statements should be prepared on a going concern basis",
      correctAnswer: "B",
      explanation:
        "The matching principle requires that expenses be recognized in the same accounting period as the revenues they helped generate. This ensures that the income statement reflects the true profitability of the period by matching related revenues and expenses.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "External Financial Reporting Decisions",
      content:
        "Under IFRS, development costs may be capitalized when certain criteria are met. Under U.S. GAAP, development costs are generally:",
      optionA: "Capitalized and amortized over their useful life",
      optionB: "Expensed as incurred",
      optionC: "Capitalized only if the project will generate future revenue",
      optionD: "Deferred until the product is commercially launched",
      correctAnswer: "B",
      explanation:
        "Under U.S. GAAP (ASC 730), research and development costs are generally expensed as incurred. This is a key difference from IFRS, which allows capitalization of development costs when specific criteria are met (technical feasibility, intention to complete, ability to use/sell, etc.).",
      difficulty: "medium",
    },
    // Section B: Planning, Budgeting, and Forecasting
    {
      subject: "part1",
      topic: "Planning, Budgeting, and Forecasting",
      content:
        "Which type of budget is most appropriate for companies with highly variable activity levels because it adjusts for changes in volume?",
      optionA: "Static budget",
      optionB: "Zero-based budget",
      optionC: "Flexible budget",
      optionD: "Capital budget",
      correctAnswer: "C",
      explanation:
        "A flexible budget adjusts budgeted revenues and costs based on the actual level of activity achieved. This makes it ideal for performance evaluation in companies with variable activity levels, as it allows for a more meaningful comparison between actual and budgeted results at the same activity level.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Planning, Budgeting, and Forecasting",
      content:
        "A company expects to sell 10,000 units next quarter. Beginning inventory is 1,500 units and desired ending inventory is 2,000 units. How many units should be produced?",
      optionA: "8,500 units",
      optionB: "10,500 units",
      optionC: "11,500 units",
      optionD: "9,500 units",
      correctAnswer: "B",
      explanation:
        "Production required = Expected sales + Desired ending inventory - Beginning inventory = 10,000 + 2,000 - 1,500 = 10,500 units.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Planning, Budgeting, and Forecasting",
      content:
        "Which budgeting approach requires managers to justify all expenditures from scratch each period, rather than using the prior year's budget as a starting point?",
      optionA: "Incremental budgeting",
      optionB: "Activity-based budgeting",
      optionC: "Zero-based budgeting",
      optionD: "Rolling budgeting",
      correctAnswer: "C",
      explanation:
        "Zero-based budgeting (ZBB) requires managers to justify every line item from a zero base each period. Unlike incremental budgeting (which starts with last year's budget), ZBB forces a complete re-evaluation of all expenditures, eliminating inefficiencies but requiring more time and resources.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Planning, Budgeting, and Forecasting",
      content:
        "In regression analysis used for cost estimation, the R-squared value of 0.85 indicates that:",
      optionA: "85% of the variation in the dependent variable is explained by the independent variable",
      optionB: "The estimated costs will be within 15% of actual costs",
      optionC: "85% of total costs are variable",
      optionD: "The regression line has a slope of 0.85",
      correctAnswer: "A",
      explanation:
        "R-squared (coefficient of determination) measures the proportion of variance in the dependent variable (cost) that is explained by the independent variable (activity driver). An R-squared of 0.85 means 85% of the variation in costs is explained by the chosen activity driver, indicating a strong relationship.",
      difficulty: "medium",
    },
    // Section C: Performance Management
    {
      subject: "part1",
      topic: "Performance Management",
      content:
        "Which of the following is NOT one of the four perspectives in the Balanced Scorecard framework?",
      optionA: "Financial perspective",
      optionB: "Customer perspective",
      optionC: "Competitive perspective",
      optionD: "Learning and growth perspective",
      correctAnswer: "C",
      explanation:
        "The Balanced Scorecard has four perspectives: (1) Financial, (2) Customer, (3) Internal Business Processes, and (4) Learning and Growth. The 'Competitive perspective' is not one of the four standard BSC perspectives.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Performance Management",
      content:
        "A division has sales of $500,000, operating income of $75,000, and total assets of $400,000. What is the division's Return on Investment (ROI)?",
      optionA: "15.0%",
      optionB: "18.75%",
      optionC: "12.5%",
      optionD: "8.0%",
      correctAnswer: "B",
      explanation:
        "ROI = Operating Income / Total Assets = $75,000 / $400,000 = 18.75%. ROI measures how efficiently a division uses its assets to generate profit.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Performance Management",
      content:
        "A company has a required rate of return of 12%. Division A reports: Sales $1,000,000, Operating Income $150,000, Total Assets $800,000. What is Division A's Residual Income (RI)?",
      optionA: "$54,000",
      optionB: "$18,750",
      optionC: "$150,000",
      optionD: "$96,000",
      correctAnswer: "A",
      explanation:
        "Residual Income = Operating Income - (Required Rate of Return × Total Assets) = $150,000 - (12% × $800,000) = $150,000 - $96,000 = $54,000. A positive RI indicates the division is earning above the minimum required return.",
      difficulty: "medium",
    },
    // Section D: Cost Management
    {
      subject: "part1",
      topic: "Cost Management",
      content:
        "Which costing method assigns overhead costs to products based on the activities that drive those costs?",
      optionA: "Job order costing",
      optionB: "Process costing",
      optionC: "Activity-based costing (ABC)",
      optionD: "Standard costing",
      correctAnswer: "C",
      explanation:
        "Activity-based costing (ABC) assigns overhead costs to products based on the activities that consume resources and drive costs. ABC provides more accurate product costs than traditional methods by using multiple cost drivers that reflect the actual consumption of resources.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Cost Management",
      content:
        "A product has a selling price of $50, variable costs of $30, and fixed costs allocated of $10 per unit. What is the contribution margin ratio?",
      optionA: "20%",
      optionB: "40%",
      optionC: "60%",
      optionD: "80%",
      correctAnswer: "B",
      explanation:
        "Contribution Margin = Selling Price - Variable Costs = $50 - $30 = $20. Contribution Margin Ratio = Contribution Margin / Selling Price = $20 / $50 = 40%. Fixed costs are not included in the contribution margin calculation.",
      difficulty: "easy",
    },
    {
      subject: "part1",
      topic: "Cost Management",
      content:
        "A company has fixed costs of $200,000 and a contribution margin ratio of 40%. What is the break-even point in sales dollars?",
      optionA: "$80,000",
      optionB: "$280,000",
      optionC: "$500,000",
      optionD: "$320,000",
      correctAnswer: "C",
      explanation:
        "Break-even sales = Fixed Costs / Contribution Margin Ratio = $200,000 / 0.40 = $500,000. At this sales level, total contribution margin exactly covers fixed costs, resulting in zero profit.",
      difficulty: "easy",
    },
    // Section E: Internal Controls
    {
      subject: "part1",
      topic: "Internal Controls",
      content:
        "According to COSO's Internal Control - Integrated Framework, which of the following is NOT one of the five components of internal control?",
      optionA: "Control environment",
      optionB: "Risk assessment",
      optionC: "Information and communication",
      optionD: "Segregation of duties",
      correctAnswer: "D",
      explanation:
        "The five components of the COSO Internal Control framework are: (1) Control Environment, (2) Risk Assessment, (3) Control Activities, (4) Information and Communication, and (5) Monitoring Activities. Segregation of duties is a control activity within the Control Activities component, not a separate component.",
      difficulty: "medium",
    },
    // Section F: Technology and Analytics
    {
      subject: "part1",
      topic: "Technology and Analytics",
      content:
        "Which data analytics technique is used to discover hidden patterns and relationships in large datasets without a predefined outcome?",
      optionA: "Descriptive analytics",
      optionB: "Predictive analytics",
      optionC: "Data mining",
      optionD: "Prescriptive analytics",
      correctAnswer: "C",
      explanation:
        "Data mining uses statistical and machine learning techniques to discover hidden patterns, correlations, and insights in large datasets without a predefined outcome. It is exploratory in nature. Descriptive analytics summarizes past data, predictive analytics forecasts future outcomes, and prescriptive analytics recommends actions.",
      difficulty: "hard",
    },
  ];

  // Part 2 Sample Questions
  const part2Questions = [
    // Section A: Financial Statement Analysis
    {
      subject: "part2",
      topic: "Financial Statement Analysis",
      content:
        "A company has current assets of $800,000 and current liabilities of $500,000. Inventory is $200,000. What is the quick ratio?",
      optionA: "1.20",
      optionB: "1.60",
      optionC: "0.80",
      optionD: "2.00",
      correctAnswer: "B",
      explanation:
        "Quick Ratio = (Current Assets - Inventory) / Current Liabilities = ($800,000 - $200,000) / $500,000 = $600,000 / $500,000 = 1.20. Wait - let me recalculate: ($800,000 - $200,000) / $500,000 = 1.20. Actually the answer is A: 1.20. The quick ratio excludes inventory from current assets as it's the least liquid.",
      difficulty: "easy",
    },
    {
      subject: "part2",
      topic: "Financial Statement Analysis",
      content:
        "Which ratio measures a company's ability to pay interest charges using earnings before interest and taxes (EBIT)?",
      optionA: "Debt-to-equity ratio",
      optionB: "Times interest earned ratio",
      optionC: "Current ratio",
      optionD: "Return on assets",
      correctAnswer: "B",
      explanation:
        "The Times Interest Earned (TIE) ratio = EBIT / Interest Expense. It measures how many times a company can cover its interest expense with its operating earnings. A higher ratio indicates greater ability to service debt.",
      difficulty: "easy",
    },
    {
      subject: "part2",
      topic: "Financial Statement Analysis",
      content:
        "A company's Days Sales Outstanding (DSO) increased from 30 days to 45 days. This change most likely indicates:",
      optionA: "Improved collection efficiency",
      optionB: "Customers are paying more slowly",
      optionC: "The company has reduced its credit sales",
      optionD: "The company's revenue has decreased",
      correctAnswer: "B",
      explanation:
        "DSO measures the average number of days it takes to collect receivables after a sale. An increase in DSO from 30 to 45 days means customers are taking longer to pay, which could indicate collection problems, loosened credit standards, or economic difficulties among customers.",
      difficulty: "easy",
    },
    {
      subject: "part2",
      topic: "Financial Statement Analysis",
      content:
        "Which of the following financial leverage ratios measures the proportion of assets financed by debt?",
      optionA: "Return on equity",
      optionB: "Debt-to-assets ratio",
      optionC: "Price-to-earnings ratio",
      optionD: "Asset turnover ratio",
      correctAnswer: "B",
      explanation:
        "The Debt-to-Assets ratio = Total Debt / Total Assets. It measures what percentage of a company's assets are financed through debt. A higher ratio indicates greater financial leverage and higher financial risk.",
      difficulty: "easy",
    },
    // Section B: Corporate Finance
    {
      subject: "part2",
      topic: "Corporate Finance",
      content:
        "A project requires an initial investment of $100,000 and will generate cash flows of $30,000 per year for 5 years. The discount rate is 10%. What is the Net Present Value (NPV)? (PV factor for annuity at 10% for 5 years = 3.791)",
      optionA: "$13,730",
      optionB: "$50,000",
      optionC: "$13,730",
      optionD: "-$13,730",
      correctAnswer: "A",
      explanation:
        "NPV = (Annual Cash Flow × Annuity PV Factor) - Initial Investment = ($30,000 × 3.791) - $100,000 = $113,730 - $100,000 = $13,730. Since NPV > 0, the project creates value and should be accepted.",
      difficulty: "medium",
    },
    {
      subject: "part2",
      topic: "Corporate Finance",
      content:
        "Which capital structure theory suggests that firms in high-tax brackets benefit more from debt financing due to the tax shield on interest payments?",
      optionA: "Pecking order theory",
      optionB: "Modigliani-Miller theorem with taxes",
      optionC: "Signaling theory",
      optionD: "Agency theory",
      correctAnswer: "B",
      explanation:
        "The Modigliani-Miller theorem with taxes (MM with taxes) shows that the value of a leveraged firm equals the value of an unlevered firm plus the present value of the tax shield (PV of interest tax savings). This suggests firms should prefer debt financing due to the tax shield benefit.",
      difficulty: "hard",
    },
    {
      subject: "part2",
      topic: "Corporate Finance",
      content:
        "A company's stock has a beta of 1.3, the risk-free rate is 4%, and the expected market return is 10%. Using CAPM, what is the required return on equity?",
      optionA: "11.8%",
      optionB: "7.8%",
      optionC: "13.0%",
      optionD: "14.0%",
      correctAnswer: "A",
      explanation:
        "Using CAPM: Required Return = Risk-Free Rate + Beta × (Market Return - Risk-Free Rate) = 4% + 1.3 × (10% - 4%) = 4% + 1.3 × 6% = 4% + 7.8% = 11.8%.",
      difficulty: "medium",
    },
    {
      subject: "part2",
      topic: "Corporate Finance",
      content:
        "What does the Weighted Average Cost of Capital (WACC) represent?",
      optionA: "The cost of debt financing only",
      optionB: "The average return required by all capital providers, weighted by their proportion of total capital",
      optionC: "The minimum return required by equity shareholders",
      optionD: "The cost of issuing new shares to the public",
      correctAnswer: "B",
      explanation:
        "WACC is the weighted average of the costs of all sources of capital (debt, equity, preferred stock), where the weights reflect the proportion of each source in the total capital structure. It represents the minimum return a company must earn on its assets to satisfy all its investors.",
      difficulty: "easy",
    },
    // Section C: Decision Analysis
    {
      subject: "part2",
      topic: "Decision Analysis",
      content:
        "A company is deciding whether to make or buy a component. The make option costs $15 per unit in variable costs plus $50,000 fixed costs. The buy option costs $20 per unit. At what volume is the company indifferent between the two options?",
      optionA: "8,000 units",
      optionB: "10,000 units",
      optionC: "12,500 units",
      optionD: "5,000 units",
      correctAnswer: "B",
      explanation:
        "Set make cost = buy cost: $15Q + $50,000 = $20Q. Solving: $50,000 = $5Q, Q = 10,000 units. Below 10,000 units, buying is cheaper; above 10,000 units, making is cheaper.",
      difficulty: "medium",
    },
    {
      subject: "part2",
      topic: "Decision Analysis",
      content:
        "In a decision tree analysis, what does 'Expected Monetary Value (EMV)' represent?",
      optionA: "The most likely monetary outcome",
      optionB: "The maximum possible monetary outcome",
      optionC: "The probability-weighted average of all possible outcomes",
      optionD: "The minimum guaranteed monetary outcome",
      correctAnswer: "C",
      explanation:
        "Expected Monetary Value (EMV) is calculated by multiplying each possible outcome by its probability and summing the results. It represents the long-run average value of a decision if it were made many times under the same probability conditions.",
      difficulty: "easy",
    },
    // Section D: Risk Management
    {
      subject: "part2",
      topic: "Risk Management",
      content:
        "A U.S. company expects to receive €1,000,000 in 90 days. To hedge the exchange rate risk, the company should:",
      optionA: "Buy euros in the forward market",
      optionB: "Sell euros in the forward market",
      optionC: "Buy a call option on euros",
      optionD: "Do nothing, as the risk is minimal",
      correctAnswer: "B",
      explanation:
        "The company will receive euros in 90 days and wants to protect against a fall in the euro/dollar exchange rate. To hedge, the company should sell euros forward (lock in today's forward rate for the future sale of euros). This is a short hedge on euros.",
      difficulty: "medium",
    },
    {
      subject: "part2",
      topic: "Risk Management",
      content:
        "Which of the following is an example of a natural hedge?",
      optionA: "Purchasing a currency option to protect against exchange rate risk",
      optionB: "A multinational company matching revenues and expenses in the same foreign currency",
      optionC: "Entering into an interest rate swap agreement",
      optionD: "Purchasing credit default swaps",
      correctAnswer: "B",
      explanation:
        "A natural hedge occurs when a company offsets its exposure to risk by matching assets, liabilities, revenues, and expenses in the same currency or with similar characteristics. For example, if a company earns revenue in euros and also incurs expenses in euros, the two naturally offset each other.",
      difficulty: "medium",
    },
    // Section E: Investment Decisions
    {
      subject: "part2",
      topic: "Investment Decisions",
      content:
        "A project has an initial outlay of $50,000 and generates the following cash flows: Year 1: $20,000, Year 2: $20,000, Year 3: $20,000. What is the payback period?",
      optionA: "1.5 years",
      optionB: "2.0 years",
      optionC: "2.5 years",
      optionD: "3.0 years",
      correctAnswer: "C",
      explanation:
        "After Year 1: $20,000 recovered, $30,000 remaining. After Year 2: $40,000 recovered, $10,000 remaining. In Year 3: Need $10,000 of the $20,000 cash flow = 0.5 years. Payback period = 2 + 0.5 = 2.5 years.",
      difficulty: "easy",
    },
    {
      subject: "part2",
      topic: "Investment Decisions",
      content:
        "The Internal Rate of Return (IRR) is best described as:",
      optionA: "The discount rate that makes the NPV of a project equal to zero",
      optionB: "The accounting rate of return based on book income",
      optionC: "The required rate of return set by management",
      optionD: "The rate of return on the safest investment available",
      correctAnswer: "A",
      explanation:
        "The IRR is the discount rate that makes the Net Present Value (NPV) of all cash flows from a project equal to zero. When IRR > cost of capital (hurdle rate), the project should be accepted; when IRR < cost of capital, it should be rejected.",
      difficulty: "easy",
    },
    // Section F: Professional Ethics
    {
      subject: "part2",
      topic: "Professional Ethics",
      content:
        "According to the IMA Statement of Ethical Professional Practice, which of the following is NOT one of the four overarching principles?",
      optionA: "Honesty",
      optionB: "Fairness",
      optionC: "Objectivity",
      optionD: "Responsibility",
      correctAnswer: "A",
      explanation:
        "The four overarching principles of the IMA Statement of Ethical Professional Practice are: (1) Honesty, (2) Fairness, (3) Objectivity, and (4) Responsibility. Wait - Honesty IS one of the four principles. The four principles are: Honesty, Fairness, Objectivity, and Responsibility. Let me correct: all four listed are principles. This question tests exact knowledge - all options are principles except one that isn't listed in the actual IMA framework.",
      difficulty: "medium",
    },
    {
      subject: "part2",
      topic: "Professional Ethics",
      content:
        "A management accountant discovers that their company is engaging in fraudulent financial reporting. According to the IMA ethical guidelines, what should the accountant do FIRST?",
      optionA: "Report immediately to the SEC",
      optionB: "Resign from the company",
      optionC: "Discuss the issue with their immediate supervisor",
      optionD: "Ignore it if it does not affect their department",
      correctAnswer: "C",
      explanation:
        "According to the IMA Statement of Ethical Professional Practice, when facing an ethical conflict, the accountant should first discuss the issue with their immediate supervisor. If the issue is not resolved, it should be escalated to higher management. External reporting should only be considered after internal channels have been exhausted (unless legally required).",
      difficulty: "medium",
    },
  ];

  // Fix the quick ratio question
  part2Questions[0].correctAnswer = "A";
  part2Questions[0].explanation =
    "Quick Ratio = (Current Assets - Inventory) / Current Liabilities = ($800,000 - $200,000) / $500,000 = $600,000 / $500,000 = 1.20. The quick ratio excludes inventory because it is the least liquid current asset.";

  // Fix the ethics question
  part2Questions[14].optionA = "Integrity";
  part2Questions[14].content =
    "According to the IMA Statement of Ethical Professional Practice, which of the following is NOT one of the four overarching principles?";
  part2Questions[14].correctAnswer = "A";
  part2Questions[14].explanation =
    "The four overarching principles of the IMA Statement of Ethical Professional Practice are: (1) Honesty, (2) Fairness, (3) Objectivity, and (4) Responsibility. 'Integrity' is a standard used in other frameworks (like AICPA) but is not one of the four IMA overarching principles.";

  // Insert questions
  let part1Count = 0;
  let part2Count = 0;

  for (const q of part1Questions) {
    await prisma.question.create({ data: q });
    part1Count++;
  }

  for (const q of part2Questions) {
    await prisma.question.create({ data: q });
    part2Count++;
  }

  console.log(`Created ${part1Count} Part 1 questions`);
  console.log(`Created ${part2Count} Part 2 questions`);
  console.log("Seeding complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
