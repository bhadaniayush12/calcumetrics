# Research Log: Mortgage Calculator

## 1. Mathematical Grounding & Formula
A mortgage calculator determines the regular monthly payment on a home loan, including principal, interest, and optional housing expenses (PITI: Principal, Interest, Taxes, Insurance).

- **Loan Principal:**
  $$P = \text{Home Price} - \text{Down Payment}$$

- **Monthly Principal & Interest (P&I):**
  $$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
  Where:
  - $r = \frac{\text{Annual Interest Rate}}{12 \times 100}$
  - $n = \text{Loan Tenure in Years} \times 12$

- **Total Monthly Payment (PITI):**
  $$\text{Total Monthly} = \text{P\&I} + \frac{\text{Annual Property Tax}}{12} + \frac{\text{Annual Home Insurance}}{12} + \text{Monthly HOA / PMI}$$

- **Total Interest & Total Cost:**
  $$\text{Total Interest} = (\text{P\&I} \times n) - P$$
  $$\text{Total Repayment} = P + \text{Total Interest}$$

## 2. Default Assumptions & Ranges
- Home Value: ₹50,00,000 / $350,000 (Slider: 5,00,000 to 5,00,00,000)
- Down Payment: 20% (₹10,00,000) (Slider: 0% to 50%)
- Interest Rate: 8.5% (Slider: 3% to 15%, step: 0.1%)
- Loan Term: 20 Years (Slider: 5 to 30 years, step: 1)
- Optional property tax: 1.2% / ₹0
- Optional home insurance: ₹0 / $1,200/yr

## 3. SEO & Compliance
- Target Keywords: `mortgage calculator`, `home loan payment calculator`, `piti mortgage calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
- Architecture: Simple/Standard archetype with reactive Phase 4 architecture.
