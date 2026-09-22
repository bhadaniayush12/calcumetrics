# Research Log: Savings Goal Calculator

## 1. Mathematical Grounding & Formula
A savings goal calculator determines the required periodic (monthly/annual) contribution needed to accumulate a target future sum within a specific horizon, accounting for compound growth on both initial seed savings and recurring contributions.

- **Future Value of Annuity with Initial Principal:**
  $$FV = PV \times (1 + r)^n + PMT \times \frac{(1 + r)^n - 1}{r}$$
  Where:
  - $FV$: Target goal amount.
  - $PV$: Current savings already accumulated (seed capital).
  - $r$: Periodic interest / return rate (for monthly compounding: annual rate $/ 12$).
  - $n$: Total number of periods (years $\times 12$).
  - $PMT$: Required periodic deposit (at end of each period / ordinary annuity).

- **Solving for Required Monthly Contribution ($PMT$):**
  $$PMT = \frac{FV - PV \times (1 + r)^n}{\frac{(1 + r)^n - 1}{r}}$$
  If $r = 0$, $PMT = \frac{FV - PV}{n}$.
  If $PV \times (1 + r)^n \ge FV$, $PMT = 0$ (the goal is already met purely by existing compounding capital).

- **Total Contribution vs Interest Earned:**
  $$\text{Total Contributed} = PV + PMT \times n$$
  $$\text{Total Interest / Return} = FV - \text{Total Contributed}$$

## 2. Default Assumptions & Ranges
- Target Goal: ₹25,00,000 (Slider: 50,000 to 5,00,00,000)
- Current Savings: ₹2,00,000 (Slider: 0 to 1,00,00,000)
- Expected Return: 10% p.a. (equity/balanced mutual fund portfolio standard; Slider: 1% to 25%, step: 0.25%)
- Time Horizon: 5 Years (Slider: 1 to 30 years, step: 1)

## 3. SEO & Structural Plan
- Target Keywords: `savings goal calculator`, `how much to save per month calculator`, `target savings calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
- Architecture: Simple archetype with Phase 4 reactive architecture (`validate`, `result-bus`, `url-state`, idempotency guard).
