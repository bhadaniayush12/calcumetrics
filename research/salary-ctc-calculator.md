# Research Log: Salary / CTC Calculator (India Tax & Compensation)

## 1. Statutory Grounding & Structure
Cost to Company (CTC) represents the total expenditure incurred by an employer on an employee over a full financial year. Understanding the conversion from annual CTC to monthly in-hand (take-home) salary requires decomposing gross earnings from statutory employer and employee contributions.

- **Standard Compensation Components:**
  - **Basic Salary:** Constitutes 40%–50% of overall CTC. Forms the statutory base for provident fund (EPF), gratuity, and HRA exemption limits.
  - **House Rent Allowance (HRA):** Typically structured as 40% of Basic (non-metro) or 50% of Basic (metro).
  - **Special Allowance:** Residual taxable allowance completing the gross compensation figure.
  - **Employee Provident Fund (EPF):** Governed by Employees' Provident Funds and Miscellaneous Provisions Act, 1952.
    - Statutory contribution: 12% of Basic.
    - Statutory wage ceiling: ₹15,000/month (i.e. ₹1,800/month cap on mandatory employer and employee contributions).
    - Employer EPF forms part of CTC; Employee EPF is deducted from Gross Salary to derive take-home.
  - **Gratuity:** Calculated under Payment of Gratuity Act, 1972 ($\frac{15}{26} \times \text{Last Drawn Basic} \times \text{Tenure}$).
  - **Professional Tax:** State-level levy (typically capped at ₹2,500/year or ₹200/month across major commercial states such as Maharashtra, Karnataka, Telangana).

- **Formulas:**
  $$\text{Gross Monthly Salary} = \frac{\text{Annual CTC} - \text{Employer EPF}}{12}$$
  $$\text{Take-Home (In-Hand) Salary} = \text{Gross Monthly Salary} - \text{Employee EPF} - \text{Professional Tax} - \text{TDS (Income Tax)}$$

## 2. Default Assumptions & Ranges
- Annual CTC: ₹12,00,000 (Slider: ₹3,00,000 to ₹1,00,00,000)
- Basic Pay: 40% of CTC
- HRA: 40% of Basic
- EPF: 12% capped at ₹15,000 wage ceiling (₹1,800/month each for employer and employee)

## 3. SEO & Structured Data
- Target Keywords: `ctc to in hand salary calculator`, `salary ctc breakdown india`, `take home salary calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
