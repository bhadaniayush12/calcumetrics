# Research Log: Interest Rate Calculator (Implied Loan Rate)

## 1. Mathematical Grounding & Formula
When borrowers know their loan amount ($P$), monthly payment ($\text{EMI}$), and loan term ($n$), solving for the underlying annual interest rate cannot be expressed in closed algebraic form and requires a numerical root-finding algorithm.

- **Objective Function:**
  $$f(r) = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1} - \text{EMI} = 0$$
  Where:
  - $r$: Monthly interest rate to solve for.
  - $n$: Number of months ($\text{years} \times 12$).
  - $\text{Annual Rate} = r \times 12 \times 100\%$.

- **Solvency Guard:**
  - If $\text{EMI} \le \frac{P}{n}$, the payment does not even cover the zero-interest principal amortization; no positive rate exists.
  - Solver employs the Newton-Raphson method with 200 max iterations, numerical derivative estimation, multiple initial seed points, and a tolerance of $10^{-10}$.
  - Explicit error handling ensures no `NaN` or `Infinity` is surfaced to the client.

## 2. Default Assumptions & Ranges
- Loan Principal: ₹5,00,000 / $25,000 (Slider: 10,000 to 1,00,00,000)
- Monthly Payment (EMI): ₹12,000 / $600 (Slider: 500 to 5,00,000)
- Loan Term: 5 Years (Slider: 1 to 30 years, step: 1)

## 3. SEO & Structured Data
- Target Keywords: `interest rate calculator`, `find loan interest rate`, `solve for interest rate`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
