# Research Log: Loan Amortization Calculator

## 1. Mathematical Grounding & Formula
A loan amortization calculator models the reducing-balance (French) loan repayment schedule, displaying the breakdown of each periodic payment into principal and interest over time.

- **Equated Monthly Installment (EMI):**
  $$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
  Where:
  - $P$: Initial loan principal.
  - $r$: Monthly interest rate ($\text{annual rate} / 12 / 100$).
  - $n$: Number of monthly installments ($\text{years} \times 12$).

- **Period $t$ Breakdown:**
  $$\text{Interest}_t = \text{Balance}_{t-1} \times r$$
  $$\text{Principal}_t = \text{EMI} - \text{Interest}_t$$
  $$\text{Balance}_t = \text{Balance}_{t-1} - \text{Principal}_t$$

- **Total Metrics:**
  $$\text{Total Repayment} = \text{EMI} \times n$$
  $$\text{Total Interest} = \text{Total Repayment} - P$$

## 2. Default Assumptions & Ranges
- Principal: ₹10,00,000 / $100,000 (Slider: 10,000 to 2,00,00,000)
- Annual Rate: 9.5% (Slider: 1% to 25%, step: 0.1%)
- Tenure: 5 Years (Slider: 1 to 30 years, step: 1)

## 3. SEO & Structured Data
- Target Keywords: `loan amortization calculator`, `amortization schedule calculator`, `loan payment breakdown`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
- Displays both headline metrics and detailed annual amortization summary schedule.
