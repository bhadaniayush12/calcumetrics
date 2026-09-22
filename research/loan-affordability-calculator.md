# Research Log: Loan Affordability Calculator

## 1. Mathematical Grounding & Formula
A loan affordability calculator inverts the standard loan amortization formula to determine the maximum loan principal a borrower can borrow given an affordable monthly EMI budget, loan term, and prevailing interest rate.

- **Inverted EMI Formula (Present Value of an Annuity):**
  $$P_{\text{max}} = \text{EMI}_{\text{budget}} \times \frac{(1 + r)^n - 1}{r \times (1 + r)^n}$$
  Where:
  - $\text{EMI}_{\text{budget}}$: Maximum monthly payment the borrower can comfortably allocate.
  - $r$: Monthly interest rate ($\text{annual rate} / 12 / 100$).
  - $n$: Total number of loan monthly payments ($\text{years} \times 12$).
  - If $r = 0$, $P_{\text{max}} = \text{EMI}_{\text{budget}} \times n$.

- **Total Repayment & Total Interest:**
  $$\text{Total Repayment} = \text{EMI}_{\text{budget}} \times n$$
  $$\text{Total Interest} = \text{Total Repayment} - P_{\text{max}}$$

- **Architecture Note (Correction 3):**
  Loan Affordability utilizes `calcAffordability` from `amortization.ts` to compute the maximum principal from the monthly budget, while maintaining simple ratio and budgeting rules for borrower evaluation.

## 2. Default Assumptions & Ranges
- Monthly Payment Budget: ₹40,000 / $2,000 (Slider: 5,000 to 5,00,000)
- Annual Interest Rate: 9.0% (Slider: 3% to 20%, step: 0.1%)
- Loan Tenure: 15 Years (Slider: 1 to 30 years, step: 1)

## 3. SEO & Structured Data
- Target Keywords: `loan affordability calculator`, `how much loan can i get`, `borrowing power calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
