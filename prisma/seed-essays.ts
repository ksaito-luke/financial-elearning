import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const part1Essays = [
  // Exam 1 essays
  {
    subject: "part1",
    topic: "Performance Management",
    examNumber: 1,
    content: `Greenfield Manufacturing produces a single product and uses a standard costing system. The following data relates to October:

Standard cost per unit:
- Direct materials: 5 lbs × $4.00 = $20.00
- Direct labor: 2 hours × $15.00 = $30.00
- Variable overhead: 2 hours × $8.00 = $16.00
- Fixed overhead: 2 hours × $5.00 = $10.00
Standard cost per unit: $76.00

Actual results for October:
- Units produced: 4,800 (budgeted: 5,000)
- Direct materials purchased and used: 26,000 lbs at $4.20/lb
- Direct labor: 9,400 hours at $15.50/hour
- Variable overhead incurred: $73,500
- Fixed overhead incurred: $52,000
- Budgeted fixed overhead: $50,000

Required:
(a) Calculate the following variances and indicate whether each is favorable (F) or unfavorable (U):
    i.   Direct materials price variance
    ii.  Direct materials quantity variance
    iii. Direct labor rate variance
    iv.  Direct labor efficiency variance
    v.   Variable overhead spending variance
    vi.  Variable overhead efficiency variance
    vii. Fixed overhead budget variance
    viii.Fixed overhead volume variance

(b) Briefly explain two possible causes of an unfavorable direct labor efficiency variance.`,
    modelAnswer: `(a) Variance Calculations:

i. DM Price Variance = AQ × (AP - SP) = 26,000 × ($4.20 - $4.00) = $5,200 U

ii. DM Quantity Variance = SP × (AQ - SQ) = $4.00 × (26,000 - 4,800×5) = $4.00 × (26,000 - 24,000) = $8,000 U

iii. DL Rate Variance = AH × (AR - SR) = 9,400 × ($15.50 - $15.00) = $4,700 U

iv. DL Efficiency Variance = SR × (AH - SH) = $15.00 × (9,400 - 4,800×2) = $15.00 × (9,400 - 9,600) = $3,000 F

v. VOH Spending Variance = Actual VOH - (AH × SR) = $73,500 - (9,400 × $8.00) = $73,500 - $75,200 = $1,700 F

vi. VOH Efficiency Variance = SR × (AH - SH) = $8.00 × (9,400 - 9,600) = $1,600 F

vii. FOH Budget Variance = Actual FOH - Budgeted FOH = $52,000 - $50,000 = $2,000 U

viii. FOH Volume Variance = Budgeted FOH - (SH allowed × SR) = $50,000 - (4,800×2 × $5.00) = $50,000 - $48,000 = $2,000 U

(b) Possible causes of unfavorable DL efficiency variance:
1. Use of less-skilled or undertrained workers requiring more time per unit
2. Machine downtime or poor scheduling causing workers to be idle or inefficient
3. Poor quality raw materials requiring rework or slower processing
4. Changes in production mix toward more complex products`,
  },
  {
    subject: "part1",
    topic: "Planning, Budgeting, and Forecasting",
    examNumber: 1,
    content: `Apex Technologies is preparing its master budget for the upcoming quarter (Q1). The company manufactures electronic components. The following information is available:

Sales forecast:
- January: 8,000 units at $50/unit
- February: 10,000 units at $50/unit
- March: 12,000 units at $50/unit

Inventory policy:
- Desired ending finished goods inventory = 20% of next month's sales
- Beginning January finished goods = 1,600 units
- April budgeted sales: 10,000 units

Direct materials per unit: 3 lbs of Component X at $6/lb
- Desired ending raw materials = 25% of next month's production needs
- Beginning January raw materials = 5,400 lbs

Direct labor: 0.5 hours per unit at $18/hour
Variable manufacturing overhead: $4 per direct labor hour
Fixed manufacturing overhead: $60,000 per month
Selling & administrative: $3 per unit sold + $25,000 fixed per month

Required:
(a) Prepare the Sales Budget for Q1 (by month and total).
(b) Prepare the Production Budget for Q1 (by month and total).
(c) Prepare the Direct Materials Purchases Budget for January only.
(d) Calculate the budgeted Cost of Goods Manufactured for January.`,
    modelAnswer: `(a) Sales Budget Q1:
                Jan         Feb         Mar         Total
Units sold    8,000      10,000      12,000       30,000
Price         × $50       × $50       × $50
Revenue    $400,000    $500,000    $600,000   $1,500,000

(b) Production Budget Q1:
                        Jan       Feb       Mar
Budgeted sales        8,000    10,000    12,000
+ Desired ending inv  2,000     2,400     2,000   (20% of next month)
= Total needed       10,000    12,400    14,000
- Beginning inv       1,600     2,000     2,400
= Units to produce    8,400    10,400    11,600

(c) DM Purchases Budget - January:
Production needs: 8,400 × 3 lbs = 25,200 lbs
+ Desired ending RM: 10,400 × 3 × 25% = 7,800 lbs
= Total needed: 33,000 lbs
- Beginning RM: 5,400 lbs
= Purchases: 27,600 lbs × $6 = $165,600

(d) Cost of Goods Manufactured - January:
Direct materials used: 8,400 × 3 × $6 = $151,200
Direct labor: 8,400 × 0.5 × $18 = $75,600
Variable OH: 8,400 × 0.5 × $4 = $16,800
Fixed OH: $60,000
Total COGM: $303,600
Cost per unit: $303,600 / 8,400 = $36.14`,
  },

  // Exam 2 essays
  {
    subject: "part1",
    topic: "Internal Controls",
    examNumber: 2,
    content: `Riverside Medical Supplies is a mid-sized distributor of medical equipment. During an internal audit, the following conditions were identified:

1. The same employee (Sarah) opens incoming mail, records accounts receivable, and also makes daily bank deposits.
2. The accounts payable clerk has access to both the vendor master file (for adding new vendors) and the ability to process and approve payments.
3. Physical inventory counts are performed annually, but they are conducted by the same warehouse staff responsible for day-to-day inventory management.
4. The IT department has implemented a new ERP system, but user access rights have not been reviewed or updated since implementation two years ago. Several former employees still have active system credentials.
5. Sales representatives can issue credit memos to customers without supervisory approval for amounts up to $5,000.

Required:
(a) For each of the five conditions identified, describe the specific internal control weakness present.
(b) For conditions 1, 2, and 4, recommend a specific corrective action to address the weakness.
(c) Explain the COSO Internal Control framework component that is most relevant to condition 4 and how it should be applied.`,
    modelAnswer: `(a) Control Weaknesses:
1. Lack of segregation of duties — Sarah has custody of assets (deposits), recording function (A/R), and authorization. This creates opportunity for lapping or embezzlement.
2. Lack of segregation of duties — the A/P clerk can create fictitious vendors and approve fraudulent payments without oversight.
3. Independence violation in inventory counts — personnel with custody of assets should not conduct physical counts; bias and concealment of shortages is possible.
4. Inadequate access controls / failure to remove terminated employees — former employees retaining credentials poses significant unauthorized access and data breach risk.
5. Insufficient authorization controls — unsupervised credit memo issuance can be used to reduce customer balances improperly or fraudulently.

(b) Corrective Actions:
1. Segregate the three functions: assign mail opening to a different person, have a separate A/R clerk record receivables, and have a supervisor or separate cashier make deposits. Implement a remittance log reviewed by management.
2. Separate vendor master file maintenance (IT or a designated administrator) from payment processing. Require dual approval for new vendors and payments above a threshold.
4. Conduct an immediate user access review; disable all accounts of terminated employees. Implement a formal joiner-mover-leaver (JML) process requiring HR to notify IT upon termination. Perform quarterly access recertification.

(c) COSO Component — Control Activities (specifically, Information Technology General Controls):
Control Activities are policies and procedures that help ensure management directives are carried out. For IT systems, this includes logical access controls (user authentication, role-based access, periodic access reviews). The company should implement: (1) a documented access control policy, (2) automatic account deactivation upon employment termination, (3) periodic access reviews by management, and (4) principle of least privilege — users receive only the access necessary for their job functions.`,
  },
  {
    subject: "part1",
    topic: "Cost Management",
    examNumber: 2,
    content: `Cascade Electronics manufactures two products: Model A and Model B. The company currently uses a traditional overhead allocation based on direct labor hours. Management is considering switching to Activity-Based Costing (ABC).

Traditional costing data:
- Total overhead: $900,000
- Total direct labor hours: 60,000
- Overhead rate: $15/DLH

Product data:
                        Model A     Model B
Units produced          10,000       5,000
DL hours per unit          3            6
Direct materials/unit     $20          $35
Direct labor/unit         $45          $90

ABC data — Overhead activity pools:
Activity              Cost Pool     Cost Driver          Model A    Model B
Machine setups        $180,000      # of setups              40        160
Quality inspections   $270,000      # of inspections        300        450
Materials handling    $150,000      # of material moves     600        400
General factory       $300,000      DL hours             30,000     30,000

Required:
(a) Calculate the unit product cost for each product under the traditional costing system.
(b) Calculate the unit product cost for each product under ABC.
(c) Which product is more profitable under each method? What does this suggest about the traditional costing system?`,
    modelAnswer: `(a) Traditional Costing:
Overhead per unit = DLH per unit × $15/DLH
Model A: 3 × $15 = $45 overhead/unit
Model B: 6 × $15 = $90 overhead/unit

Unit cost:              Model A     Model B
Direct materials         $20.00      $35.00
Direct labor             $45.00      $90.00
Overhead                 $45.00      $90.00
Total unit cost         $110.00     $215.00

(b) ABC Costing:
Activity rates:
- Machine setups: $180,000 / 200 setups = $900/setup
- Quality inspections: $270,000 / 750 = $360/inspection
- Materials handling: $150,000 / 1,000 = $150/move
- General factory: $300,000 / 60,000 DLH = $5/DLH

Overhead assigned:
                        Model A              Model B
Setups:              40×$900=$36,000       160×$900=$144,000
Inspections:        300×$360=$108,000      450×$360=$162,000
Materials:          600×$150=$90,000       400×$150=$60,000
General:          30,000×$5=$150,000     30,000×$5=$150,000
Total overhead:        $384,000              $516,000
Per unit (÷units):      $38.40               $103.20

Unit cost (ABC):        Model A     Model B
Direct materials         $20.00      $35.00
Direct labor             $45.00      $90.00
Overhead                 $38.40     $103.20
Total unit cost         $103.40     $228.20

(c) Under traditional: Model A appears cheaper ($110 vs $215). Under ABC: Model A is still lower cost ($103.40 vs $228.20), but the margin difference shifts. Model B consumes a disproportionate share of setup and inspection costs relative to volume. Traditional costing cross-subsidizes Model B by over-allocating overhead to Model A (based on DLH) and under-allocating to Model B's activity-intensive nature. ABC reveals the true cost structure, enabling better pricing and product-mix decisions.`,
  },

  // Exam 3 essays
  {
    subject: "part1",
    topic: "External Financial Reporting Decisions",
    examNumber: 3,
    content: `Horizon Retail Inc. is preparing its annual financial statements under U.S. GAAP. The following events occurred during the fiscal year ended December 31:

1. Revenue Recognition: Horizon entered into a contract to sell customized software to a customer for $500,000. The contract includes: (a) software license ($300,000 standalone price), (b) one year of technical support ($100,000 standalone price), and (c) training services ($100,000 standalone price). The software was delivered on March 1; training was completed on June 30; support runs for 12 months from March 1.

2. Inventory: Horizon uses FIFO. Beginning inventory: 1,000 units @ $40. Purchases: 3,000 units @ $45 in April, 2,000 units @ $50 in September. Ending unit count: 1,500 units. Net realizable value (NRV) at year-end: $43/unit.

3. Lease: On January 1, Horizon signed a 5-year lease for warehouse space. Annual payments: $60,000 (paid at year-end). Implicit rate: 6%. PV of annuity (5 years, 6%): 4.2124. The lease does not transfer ownership, has no purchase option, and the leased asset is not specialized.

Required:
(a) Under ASC 606, how much revenue should Horizon recognize in the fiscal year? Show your allocation and timing.
(b) Calculate the ending inventory balance and explain whether a write-down is required.
(c) Classify the lease and prepare the January 1 journal entry.`,
    modelAnswer: `(a) ASC 606 Revenue Recognition:
Step 1 — Allocate transaction price ($500,000) based on relative standalone prices (total SSP = $500,000, so no adjustment needed; proportions are 60%/20%/20%).
- Software license: $300,000
- Technical support: $100,000
- Training: $100,000

Timing of recognition:
- Software license (point in time — delivered March 1): $300,000 recognized in Year 1
- Training (point in time — completed June 30): $100,000 recognized in Year 1
- Technical support (over time — 10 months in Year 1, Mar–Dec): $100,000 × 10/12 = $83,333 in Year 1; $16,667 in Year 2

Total Year 1 revenue: $300,000 + $100,000 + $83,333 = $483,333

(b) Ending Inventory:
Under FIFO, ending 1,500 units come from most recent purchases:
1,500 units × $50 = $75,000 (at cost)
NRV: 1,500 × $43 = $64,500
Since NRV ($64,500) < Cost ($75,000), write down to NRV.
Write-down: $75,000 − $64,500 = $10,500
Ending inventory reported: $64,500

(c) Lease Classification — Operating Lease:
None of the 5 finance lease criteria are met (no ownership transfer, no purchase option, lease term is not major part of 10+ year economic life, PV test not specified as ≥90%). → Operating lease.

January 1 Journal Entry:
Right-of-Use Asset    252,744
  Lease Liability              252,744
(PV = $60,000 × 4.2124 = $252,744)

Year-end entry (Dec 31):
Interest Expense ($252,744 × 6%)   15,165
Lease Liability (plug)              44,835
  Cash                                     60,000
Amortization of ROU asset: $252,744 / 5 = $50,549
Lease Amortization Expense   50,549
  ROU Asset                              50,549`,
  },
  {
    subject: "part1",
    topic: "Technology and Analytics",
    examNumber: 3,
    content: `DataDriven Corp. is a retail company implementing advanced data analytics to improve decision-making. The CFO has asked the management accounting team to analyze the company's customer data.

Scenario A — Regression Analysis:
The team ran a regression of monthly advertising spend (X) on monthly sales revenue (Y) using 24 months of data:
Y = $450,000 + 8.5X
R² = 0.72, Standard error of estimate = $28,000, t-statistic for slope = 6.8

Scenario B — Data Classification:
The company has the following customer transaction data and wants to predict which customers will churn (stop purchasing) within the next 90 days:
- 500,000 customer records
- 47 variables including purchase history, browsing behavior, demographics
- Last year's churn rate: 8%

The team is considering: (i) logistic regression, (ii) decision tree, (iii) neural network.

Scenario C — Big Data & Ethics:
The company is collecting granular location data from customers' mobile app without prominent disclosure. Marketing wants to sell this data to third parties.

Required:
(a) Interpret the regression results in Scenario A. Is advertising a significant predictor of sales? What are the limitations of this model?
(b) Recommend one predictive modeling technique for Scenario B and justify your choice. What challenge does the 8% churn rate present?
(c) Identify two ethical and/or legal concerns with the data practices in Scenario C and recommend corrective actions.`,
    modelAnswer: `(a) Regression Interpretation:
- The model predicts: for every $1 increase in advertising, sales increase by $8.50.
- R² = 0.72 means 72% of the variation in monthly sales is explained by advertising spend — a reasonably strong relationship.
- t-statistic = 6.8 (typically significant at p < 0.001 for df=22) → advertising is a statistically significant predictor.
- Limitations: (1) Correlation ≠ causation; other factors (seasonality, promotions) may drive sales. (2) Only one independent variable — a multivariate model would be more robust. (3) 24 months is a small sample. (4) The model assumes a linear relationship, which may not hold over all ranges of advertising spend.

(b) Predictive Modeling for Churn:
Recommendation: Logistic regression or gradient-boosted decision tree (e.g., XGBoost).
Logistic regression: interpretable, handles binary outcome (churn/no churn), works well with large datasets, produces probability scores useful for targeted intervention.
Decision tree: highly interpretable for business users, can capture non-linear relationships, but may overfit without pruning.
Neural networks: highest predictive power but "black box" — difficult to explain to management.

Class imbalance challenge: With only 8% churn rate, the dataset is imbalanced. A model predicting "no churn" for everyone achieves 92% accuracy but is useless. Solutions: use SMOTE (oversampling), class weighting, or evaluate with AUC-ROC rather than accuracy.

(c) Ethical/Legal Concerns:
1. Lack of informed consent / transparency: Collecting location data without prominent disclosure likely violates privacy regulations (CCPA, GDPR if applicable). Corrective action: Update privacy policy with clear disclosure, obtain explicit opt-in consent for location tracking.
2. Selling personal data to third parties without consent: This likely violates privacy laws and breaches customer trust. It may expose the company to regulatory fines and reputational damage. Corrective action: Do not sell personal data without explicit customer consent; establish a data governance policy reviewed by legal counsel. If data sharing is desired, anonymize/aggregate data and ensure compliance with applicable regulations.`,
  },
];

const part2Essays = [
  // Exam 1 essays
  {
    subject: "part2",
    topic: "Financial Statement Analysis",
    examNumber: 1,
    content: `Meridian Industries and Coastal Corp. operate in the same industry. The following summarized financial data is available for the most recent fiscal year:

                            Meridian        Coastal
Net sales                $5,200,000     $3,800,000
Cost of goods sold        3,120,000      2,090,000
Operating expenses          780,000        608,000
Interest expense             96,000         19,000
Income tax expense          241,200        256,575
Net income                  962,800        826,425

Total assets (avg)        6,500,000      4,100,000
Total equity (avg)        3,900,000      3,200,000
Total debt                2,400,000        700,000
Current assets            1,950,000      1,640,000
Current liabilities       1,040,000        560,000
Inventory                   650,000        410,000
Accounts receivable         520,000        480,000

Required:
(a) Calculate the following ratios for both companies:
    i.   Gross profit margin
    ii.  Operating profit margin
    iii. Return on assets (ROA)
    iv.  Return on equity (ROE)
    v.   Debt-to-equity ratio
    vi.  Current ratio
    vii. Quick ratio
    viii.Inventory turnover

(b) Based on your calculations, write a comparative analysis (4–5 sentences) identifying which company appears to be the stronger performer and why.`,
    modelAnswer: `(a) Ratio Calculations:

                            Meridian            Coastal
i.  Gross profit margin:
    GP/Sales               ($5.2M-$3.12M)/$5.2M  ($3.8M-$2.09M)/$3.8M
                           = 40.0%               = 45.0%

ii. Operating profit margin:
    EBIT/Sales             ($5.2M-$3.12M-$0.78M)/$5.2M   ($3.8M-$2.09M-$0.608M)/$3.8M
                           = $1.30M/$5.2M = 25.0%          = $1.102M/$3.8M = 29.0%

iii.ROA = Net Income / Avg Assets
                           $962,800/$6,500,000 = 14.8%   $826,425/$4,100,000 = 20.2%

iv. ROE = Net Income / Avg Equity
                           $962,800/$3,900,000 = 24.7%   $826,425/$3,200,000 = 25.8%

v.  Debt-to-equity:        $2,400,000/$3,900,000 = 0.62   $700,000/$3,200,000 = 0.22

vi. Current ratio:         $1,950,000/$1,040,000 = 1.88   $1,640,000/$560,000 = 2.93

vii.Quick ratio:           ($1,950,000-$650,000)/$1,040,000=1.25   ($1,640,000-$410,000)/$560,000=2.20

viii.Inventory turnover:   $3,120,000/$650,000 = 4.8×     $2,090,000/$410,000 = 5.1×

(b) Comparative Analysis:
Coastal Corp. demonstrates stronger overall financial performance across most dimensions. Coastal achieves higher gross (45% vs 40%) and operating (29% vs 25%) profit margins, suggesting better cost control and/or pricing power. Coastal's ROA (20.2%) significantly exceeds Meridian's (14.8%), indicating more efficient use of assets. Although Meridian generates higher absolute net income and revenues, Coastal operates with far less financial leverage (D/E of 0.22 vs 0.62), reducing financial risk and interest burden. Coastal's superior liquidity ratios (current 2.93, quick 2.20) and slightly higher inventory turnover further support its stronger operational efficiency. Meridian's higher leverage amplifies ROE somewhat but introduces greater financial risk.`,
  },
  {
    subject: "part2",
    topic: "Corporate Finance",
    examNumber: 1,
    content: `Vanguard Technologies is evaluating its capital structure and cost of capital. The following information is available:

Capital structure:
- Long-term debt: $4,000,000 (10-year bonds, 6% coupon, currently trading at $950 per $1,000 face value)
- Preferred stock: $1,000,000 (8% annual dividend, $100 par, currently trading at $90)
- Common equity: $5,000,000

Additional data:
- Common stock: current price $40/share, most recent dividend $2.00/share, expected constant growth rate 5%
- Tax rate: 30%
- Beta: 1.2, risk-free rate: 3.5%, market risk premium: 6%
- The company plans to maintain its current capital structure proportions

Required:
(a) Calculate the after-tax cost of debt (use approximate yield-to-maturity method: YTM ≈ [Annual interest + (Par - Price)/n] / [(Par + Price)/2]).
(b) Calculate the cost of preferred stock.
(c) Calculate the cost of common equity using both:
    i.  The Dividend Growth Model (DGM)
    ii. The Capital Asset Pricing Model (CAPM)
(d) Calculate WACC using the DGM cost of equity. Use market values for weights.
(e) Vanguard is considering a new project with an expected return of 9.5%. Should it accept the project? Explain.`,
    modelAnswer: `(a) After-tax Cost of Debt:
Annual interest = $1,000 × 6% = $60
Approximate YTM = [$60 + ($1,000 - $950)/10] / [($1,000 + $950)/2]
= [$60 + $5] / [$975]
= $65 / $975 = 6.67%
After-tax Kd = 6.67% × (1 - 0.30) = 4.67%

(b) Cost of Preferred Stock:
Annual dividend = $100 × 8% = $8
Kps = $8 / $90 = 8.89%

(c) Cost of Common Equity:
i. DGM: Ke = D1/P0 + g = ($2.00 × 1.05)/$40 + 5% = $2.10/$40 + 5% = 5.25% + 5% = 10.25%
ii. CAPM: Ke = Rf + β(Rm - Rf) = 3.5% + 1.2(6%) = 3.5% + 7.2% = 10.7%

(d) WACC Calculation:
Market values:
- Debt: $4,000,000 × ($950/$1,000) = $3,800,000
- Preferred: $1,000,000 × ($90/$100) = $900,000
- Equity: $5,000,000 (book used as proxy)
Total: $9,700,000

Weights: Wd = 39.2%, Wps = 9.3%, We = 51.5%

WACC = (39.2% × 4.67%) + (9.3% × 8.89%) + (51.5% × 10.25%)
= 1.83% + 0.83% + 5.28% = 7.94%

(e) Project Decision:
The project's expected return (9.5%) exceeds the WACC (7.94%). Since the project generates returns above the company's cost of capital, it creates value for shareholders and should be ACCEPTED. The NPV of the project is positive, indicating it earns more than the minimum required return.`,
  },

  // Exam 2 essays
  {
    subject: "part2",
    topic: "Decision Analysis",
    examNumber: 2,
    content: `Pacific Foods is a food manufacturer facing several strategic decisions. Address each scenario independently.

Scenario 1 — Make vs. Buy:
Pacific currently manufactures Component Z at a cost of:
- Direct materials: $8/unit
- Direct labor: $5/unit
- Variable overhead: $3/unit
- Fixed overhead (allocated): $6/unit
Total: $22/unit (current production: 50,000 units/year)

An outside supplier offers to supply Component Z at $18/unit. If Pacific buys externally, 60% of the fixed overhead is avoidable. The freed capacity could be used to produce a new product generating a contribution margin of $80,000/year.

Scenario 2 — Pricing Decision:
Pacific has a special order for 5,000 units of Product Y from a foreign customer who will not affect regular domestic sales. Regular price: $35/unit.
Variable manufacturing cost: $18/unit
Variable selling cost (not incurred on special orders): $3/unit
Fixed manufacturing overhead: $4/unit (total fixed costs won't change)
The foreign customer offers $24/unit.

Scenario 3 — Product Mix (Constrained Resource):
Pacific has 40,000 machine hours available per month. Three products compete for this resource:

Product         Selling price   Variable cost   Machine hrs/unit   Demand (units)
Alpha              $60             $36              2 hrs            8,000
Beta               $45             $27              1 hr            15,000
Gamma              $90             $54              3 hrs           10,000

Required:
(a) For Scenario 1: Should Pacific make or buy? Show full relevant cost analysis.
(b) For Scenario 2: Should Pacific accept the special order? Show the incremental analysis.
(c) For Scenario 3: Determine the optimal production plan to maximize contribution margin.`,
    modelAnswer: `(a) Make vs. Buy Analysis (Scenario 1):
Relevant costs to MAKE (per unit):
- Direct materials: $8
- Direct labor: $5
- Variable overhead: $3
- Avoidable fixed overhead: $6 × 60% = $3.60
- Total relevant cost to make: $19.60/unit

Cost to BUY: $18.00/unit
Savings from buying: $19.60 - $18.00 = $1.60/unit × 50,000 = $80,000

Opportunity benefit of buying (freed capacity): +$80,000
Total annual benefit of buying: $80,000 + $80,000 = $160,000

Decision: BUY from the supplier. Total annual savings = $160,000, which exceeds the $80,000 savings from lower unit cost alone when including the opportunity benefit.

(b) Special Order Analysis (Scenario 2):
Revenue: 5,000 × $24 = $120,000
Relevant costs:
- Variable manufacturing: 5,000 × $18 = (90,000)
- Variable selling: $0 (not incurred)
- Fixed OH: $0 (no change)
Incremental profit: $30,000

Decision: ACCEPT the special order. It generates $30,000 of additional profit. The $35 regular price and $4 fixed OH are irrelevant to this decision.

(c) Constrained Resource — Optimal Mix (Scenario 3):
Contribution margin per unit:
Alpha: $60-$36=$24 ÷ 2hrs = $12/hr
Beta:  $45-$27=$18 ÷ 1hr  = $18/hr ← HIGHEST
Gamma: $90-$54=$36 ÷ 3hrs = $12/hr

Priority: Beta (1st), then Alpha and Gamma tied (produce to demand):

Step 1: Beta — 15,000 units × 1hr = 15,000 hrs used; 25,000 hrs remaining
Step 2: Alpha — 8,000 units × 2hrs = 16,000 hrs; 9,000 hrs remaining
Step 3: Gamma — 9,000 hrs ÷ 3hrs = 3,000 units (limited by capacity)

Optimal plan: Beta 15,000, Alpha 8,000, Gamma 3,000
Total CM: (15,000×$18) + (8,000×$24) + (3,000×$36)
= $270,000 + $192,000 + $108,000 = $570,000`,
  },
  {
    subject: "part2",
    topic: "Risk Management",
    examNumber: 2,
    content: `Global Export Corp. (GEC) is a U.S.-based manufacturer that exports 60% of its production to Europe and Japan. The CFO is concerned about various financial risks and has asked for an analysis.

Situation 1 — Foreign Exchange Risk:
GEC has a receivable of €2,000,000 due in 90 days. Current spot rate: €1 = $1.10.
- 90-day forward rate: €1 = $1.08
- Put options on €2M are available: premium $0.015/€, strike price $1.09/€

Situation 2 — Interest Rate Risk:
GEC has $5,000,000 of floating-rate debt (SOFR + 2%). The CFO expects rates to rise. GEC is considering an interest rate swap: pay fixed 5%, receive SOFR. Current SOFR: 3%.

Situation 3 — Commodity Risk:
GEC uses 100,000 lbs of aluminum per quarter. Current price: $1.20/lb. GEC is concerned prices will rise. Futures contracts are available at $1.25/lb for delivery in 90 days.

Required:
(a) For Situation 1: Compare the forward contract and put option hedges. Calculate the net USD received under each if the spot rate in 90 days is (i) $1.05 and (ii) $1.12.
(b) For Situation 2: Explain how the interest rate swap works and calculate GEC's net interest rate under the swap.
(c) For Situation 3: Explain how a long futures position hedges GEC's aluminum price risk. What is the risk of over-hedging?`,
    modelAnswer: `(a) Hedge Comparison:

Forward Contract: Lock in $1.08/€ regardless of spot rate.
Net receipts = €2,000,000 × $1.08 = $2,160,000 (certain)

Put Option: Premium cost = €2,000,000 × $0.015 = $30,000
Strike price = $1.09/€

(i) If spot = $1.05 (euro weakens):
Forward: $2,160,000
Put: Exercise at $1.09 → €2M × $1.09 - $30,000 = $2,180,000 - $30,000 = $2,150,000
→ Forward slightly better by $10,000

(ii) If spot = $1.12 (euro strengthens):
Forward: $2,160,000 (forgo upside)
Put: Let expire, sell at spot → €2M × $1.12 - $30,000 = $2,240,000 - $30,000 = $2,210,000
→ Put option better by $50,000

Conclusion: Forward provides certainty; put option provides downside protection while allowing upside participation (at the cost of the premium).

(b) Interest Rate Swap:
GEC pays fixed 5% and receives SOFR floating.
Current net payment: Pay 5%, receive 3% SOFR → net fixed cost = 2%
Plus credit spread on debt: +2% → Total effective rate = 4%

If SOFR rises to 4%: GEC still pays net 5% + 2% spread - 4% received = 3% net → capped at 4% effective (lower than unhedged 6%).
The swap converts GEC's floating-rate exposure to a fixed obligation, protecting against rising rates while giving up benefit if rates fall.

(c) Long Futures Hedge (Aluminum):
GEC buys 100,000 lbs of aluminum futures at $1.25/lb.
If prices rise to $1.40: GEC pays more in spot ($1.40) but gains $0.15/lb on futures → effective cost = $1.25/lb ✓
If prices fall to $1.10: GEC pays less in spot but loses $0.15/lb on futures → effective cost = $1.25/lb ✓

Risk of over-hedging: If GEC hedges more than its actual needs (e.g., production decreases due to a lost contract), the excess futures position becomes speculative. GEC would face mark-to-market losses on the excess position if aluminum prices fall, with no corresponding benefit from lower physical purchase costs. Over-hedging transforms a risk management tool into speculation.`,
  },

  // Exam 3 essays
  {
    subject: "part2",
    topic: "Investment Decisions",
    examNumber: 3,
    content: `Pinnacle Corp. is evaluating two mutually exclusive capital investment projects. Both require an initial investment at t=0 and have a 5-year life. The company's cost of capital is 10%. Straight-line depreciation is used, and there is no salvage value.

Project Atlas:
- Initial investment: $300,000
- Annual cash inflows: $90,000 for years 1-5

Project Beacon:
- Initial investment: $300,000
- Cash inflows: $150,000 (Year 1), $120,000 (Year 2), $80,000 (Year 3), $60,000 (Year 4), $40,000 (Year 5)

PV factors at 10%:
Year 1: 0.909, Year 2: 0.826, Year 3: 0.751, Year 4: 0.683, Year 5: 0.621
Annuity factor (5 yrs, 10%): 3.791

Additional information:
- The company has a maximum payback period policy of 3.5 years
- Beacon's IRR has been calculated as 14.0%; Atlas's IRR is 15.2%

Required:
(a) Calculate the Payback Period for both projects.
(b) Calculate the Net Present Value (NPV) for both projects.
(c) Calculate the Accounting Rate of Return (ARR) for Project Atlas only. (Use average investment = Initial investment/2)
(d) Which project should Pinnacle select? Justify your recommendation using NPV, IRR, and payback results. Address any conflicts between the methods.`,
    modelAnswer: `(a) Payback Period:

Project Atlas: $90,000/year
Year 1: $90,000 cumulative; Year 2: $180,000; Year 3: $270,000
Remaining after Year 3: $300,000 - $270,000 = $30,000
Payback = 3 + ($30,000/$90,000) = 3.33 years ✓ (within 3.5-year policy)

Project Beacon:
Year 1: $150,000; Year 2: $270,000; Remaining: $30,000
Year 3: $80,000 available; Payback = 2 + ($30,000/$80,000) = 2.375 years ✓

(b) NPV Calculations:

Project Atlas: $90,000 × 3.791 = $341,190 - $300,000 = $41,190

Project Beacon:
PV of cash flows:
Y1: $150,000 × 0.909 = $136,350
Y2: $120,000 × 0.826 = $99,120
Y3: $80,000 × 0.751 = $60,080
Y4: $60,000 × 0.683 = $40,980
Y5: $40,000 × 0.621 = $24,840
Total PV: $361,370
NPV = $361,370 - $300,000 = $61,370

(c) ARR — Project Atlas:
Average annual net income = Annual cash flow - Depreciation
Depreciation = $300,000/5 = $60,000/year
Average net income = $90,000 - $60,000 = $30,000
Average investment = $300,000/2 = $150,000
ARR = $30,000/$150,000 = 20%

(d) Recommendation — Select Project Beacon:

Summary:
                Atlas       Beacon
NPV            $41,190     $61,370 ← HIGHER
IRR            15.2%       14.0%   ← HIGHER
Payback        3.33 yrs    2.375 yrs ← FASTER

Conflict: Atlas has a higher IRR (15.2% vs 14.0%), but Beacon has a higher NPV ($61,370 vs $41,190). For mutually exclusive projects, NPV is the superior decision criterion because it measures absolute wealth creation in dollars, directly aligned with shareholder value maximization. IRR can give misleading rankings when projects have different cash flow timing patterns (as here — Beacon has front-loaded cash flows).

Select Project Beacon: it creates $20,180 more in shareholder value, recovers investment faster (2.4 vs 3.3 years), and both projects exceed the company's 10% hurdle rate. The higher IRR of Atlas does not compensate for its lower absolute value creation.`,
  },
  {
    subject: "part2",
    topic: "Professional Ethics",
    examNumber: 3,
    content: `Read the following scenarios and address the ethical issues presented. Base your answers on the IMA Statement of Ethical Professional Practice.

Scenario 1:
James Park is a senior management accountant at Westbrook Industries. His supervisor, the Controller, has asked him to change the estimated useful life of certain machinery from 8 years to 15 years — not because the estimate is more accurate, but because it would reduce annual depreciation expense and help the company meet its earnings target for the quarter. The Controller says "everyone does it," and reminds James that his performance bonus depends on the company meeting earnings targets.

Scenario 2:
Maria Santos is a CMA working in the treasury department of a publicly traded company. While preparing a quarterly cash flow analysis, she discovers what appears to be a systematic understatement of operating expenses being reclassified as capital expenditures, inflating reported earnings and operating cash flows. Her immediate supervisor, the CFO, appears to be aware of the scheme and has approved the reclassifications. When Maria raises the issue, the CFO tells her to "let it go" and threatens to give her a poor performance review.

Scenario 3:
David Chen is a management accountant who has been offered a consulting engagement by a former employer. The engagement would provide financial modeling support for a competitor of his current employer. He would use general knowledge and publicly available market data only, but the work overlaps with his current responsibilities.

Required:
(a) For Scenario 1: Identify the specific IMA ethical standards James is being pressured to violate. What steps should he take?
(b) For Scenario 2: What ethical standards are at issue? Given that the CFO is involved, what course of action should Maria take?
(c) For Scenario 3: Identify the ethical concern and explain how David should resolve it.`,
    modelAnswer: `(a) Scenario 1 — James Park:
Standards at risk:
- Credibility: James must not alter estimates to mislead users; financial reports must be prepared in accordance with GAAP, not manipulated for earnings management.
- Integrity: Deliberately changing an estimate without factual basis to meet earnings targets is fraudulent financial reporting.
- Objectivity: External pressure (bonus, supervisor instruction) is compromising his professional judgment.

Steps James should take (IMA escalation process):
1. Decline to make the change; explain to the Controller that the change would misrepresent financial information and violates GAAP (ASC 250 — changes in accounting estimates must be justified).
2. If the Controller insists, escalate to the next level of management (CFO, Audit Committee, or Board).
3. If internal channels fail, consider consulting the IMA Ethics Hotline for confidential guidance.
4. Document all communications. As a last resort, if the fraud cannot be stopped, James may need to consider resignation and, depending on jurisdiction, whistleblower reporting to the SEC.

(b) Scenario 2 — Maria Santos:
Standards at issue:
- Integrity and Credibility: The reclassification scheme constitutes financial statement fraud, artificially inflating earnings (a Sarbanes-Oxley violation for a public company).
- The CFO's involvement means normal internal escalation is compromised.

Course of action:
1. Document the evidence of the reclassifications with specific examples.
2. Since the CFO is complicit, bypass the CFO and report directly to the Audit Committee or Board of Directors (as supported by SOX Section 301, which requires public companies to establish a process for employees to submit concerns directly to the Audit Committee).
3. Consult legal counsel or the IMA Ethics Hotline.
4. As a public company issue, this may require SEC whistleblower reporting under Dodd-Frank. Maria should be aware that SOX and Dodd-Frank provide whistleblower protections against retaliation.
5. Maria must not alter, destroy, or ignore the evidence.

(c) Scenario 3 — David Chen:
Ethical concern: Conflict of interest. Providing financial modeling to a direct competitor, even using public information, creates a conflict between his duty of loyalty to his current employer and the consulting engagement. Even without using confidential information, the appearance of a conflict exists, and competitive intelligence from the general market analysis could inadvertently benefit the competitor.

Resolution:
1. David must disclose the potential conflict to his current employer's management and obtain their written approval before proceeding.
2. If the employer objects or if David cannot ensure complete separation of client/employer interests, he should decline the engagement.
3. David should not use any proprietary knowledge, internal processes, or non-public information from his current employer in any consulting work.
4. The IMA standards require that members refrain from engaging or supporting any activity that would prejudice their employer's legitimate interests.`,
  },
];

async function main() {
  console.log("Seeding essay questions...");

  for (const q of part1Essays) {
    await prisma.essayQuestion.create({ data: q });
  }
  console.log(`Created ${part1Essays.length} Part 1 essay questions`);

  for (const q of part2Essays) {
    await prisma.essayQuestion.create({ data: q });
  }
  console.log(`Created ${part2Essays.length} Part 2 essay questions`);

  console.log("Essay seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
