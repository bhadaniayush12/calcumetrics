# Research Log: Debt-to-Income (DTI) Ratio Calculator

## 1. Mathematical Grounding & Architecture Note
Architecture Correction 3 explicitly specifies:
"Do NOT force DTI to depend on amortization.ts. DTI should remain a simple ratio calculation."

- **Mathematical Formula:**
  $$\text{DTI} = \left(\frac{\text{Total Monthly Debt Payments}}{\text{Gross Monthly Income}}\right) \times 100\%$$
  Where:
  - $\text{Total Monthly Debt Payments}$: Sum of monthly mortgage/rent, car loan, student loan, minimum credit card payments, and personal loans.
  - $\text{Gross Monthly Income}$: Total pre-tax monthly income from salary, business profits, dividends, or other steady sources.

- **Underwriting Thresholds:**
  - $\le 20\%$: Excellent — Strong financial flexibility, lowest risk.
  - $21\% - 28\%$: Good — Standard benchmark for conventional prime mortgage approval (front-end target).
  - $29\% - 36\%$: Fair — Healthy back-end ratio limit for most conservative lenders.
  - $37\% - 43\%$: Poor / Stretched — Maximum back-end limit for qualified mortgages (Fannie Mae / Freddie Mac benchmark).
  - $> 43\%$: Very Poor / Critical — High financial distress risk; mortgage lenders generally deny conventional loans without strong compensating factors.

## 2. Default Assumptions & Ranges
- Monthly Debt Obligations: ₹30,000 / $1,500 (Slider: 0 to 5,00,000)
- Gross Monthly Income: ₹1,00,000 / $5,000 (Slider: 10,000 to 20,00,000)
- Default DTI: 30.0% ("Fair")

## 3. SEO & Structured Data
- Target Keywords: `debt to income ratio calculator`, `dti calculator`, `mortgage debt ratio`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
