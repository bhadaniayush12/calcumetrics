# Research Log: Credit Card Payoff Calculator

## 1. Mathematical Grounding & Formula
A credit card payoff calculator models reducing-balance debt amortization under a fixed monthly payment schedule with compound interest.

- **Interest Accrual & Minimum Solvency Guard:**
  $$I_1 = \text{Balance} \times \left(\frac{\text{APR}}{12 \times 100}\right)$$
  If $\text{Monthly Payment} \le I_1$, the principal is never reduced; the balance compounds indefinitely ($n = \infty$).

- **Payoff Duration Formula:**
  $$n = -\frac{\ln\left(1 - \frac{r \times P}{\text{PMT}}\right)}{\ln(1 + r)}$$
  Where:
  - $P$: Current credit card outstanding balance.
  - $\text{PMT}$: Fixed monthly payment.
  - $r$: Monthly interest rate ($\text{APR} / 12 / 100$).
  - $n$: Total number of months required to extinguish the balance (rounded up to nearest integer).
  - If $r = 0$, $n = \lceil P / \text{PMT} \rceil$.

- **Total Interest & Capital Paid:**
  $$\text{Total Paid} = \text{PMT} \times n$$
  $$\text{Total Interest} = \text{Total Paid} - P$$

## 2. Default Assumptions & Ranges
- Current Card Balance: ₹1,50,000 / $5,000 (Slider: 1,000 to 20,00,000)
- Annual Percentage Rate (APR): 36.0% (typical Indian card APR is ~36-42%; US is ~20-25%; Slider: 5% to 50%, step: 0.5%)
- Monthly Payment: ₹10,000 / $300 (Slider: 500 to 1,00,000)

## 3. SEO & Structured Data
- Target Keywords: `credit card payoff calculator`, `credit card debt payoff calculator`, `card payment calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
