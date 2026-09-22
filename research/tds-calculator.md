# Research Log: TDS Calculator (India Tax)

## 1. Statutory Grounding & Formula
Tax Deducted at Source (TDS) is governed by Chapter XVII-B of the Income-tax Act, 1961. The deductor is required to deduct tax at prescribed rates before releasing payments to the deductee, provided the transaction exceeds statutory exemption thresholds.

- **Formula:**
  - If $\text{Gross Payment} > \text{Statutory Threshold}$:
    $$\text{TDS Deducted} = \frac{\text{Gross Payment} \times \text{Prescribed Rate}}{100}$$
    $$\text{Net Receivable} = \text{Gross Payment} - \text{TDS Deducted}$$
  - If $\text{Gross Payment} \le \text{Statutory Threshold}$:
    $$\text{TDS Deducted} = 0, \quad \text{Net Receivable} = \text{Gross Payment}$$

- **Authoritative Statutory Sections (Finance Act 2024-25 / IT Act 1961):**
  - Section 194A: Interest other than on securities (Bank FDs: ₹40,000 threshold, ₹50,000 for senior citizens; rate: 10%).
  - Section 194C: Payments to contractors/subcontractors (1% for individuals/HUFs, 2% others; single invoice > ₹30,000 or aggregate > ₹1,00,000).
  - Section 194H: Commission or brokerage (5% above ₹15,000 threshold).
  - Section 194I: Rent of land/building (10% above ₹2,40,000 threshold per financial year).
  - Section 194J: Fees for professional or technical services (10% professional services, 2% technical services; threshold ₹30,000).
  - Section 194: Dividend payments by domestic companies (10% above ₹5,000 threshold).
  - Section 194Q: Purchase of goods exceeding ₹50 lakh (0.1% on excess over ₹50 lakh).

- **Jurisdiction & Guardrails:**
  - Locked to INR (₹) strictly; no currency switcher.
  - Surcharge and Cess do not apply to TDS on domestic non-salary payments to resident individuals.

## 2. Default Assumptions & Ranges
- Gross Amount: ₹1,00,000 (Slider: ₹5,000 to ₹50,00,000)
- Section: Section 194J (Professional Services @ 10%)

## 3. SEO & Structured Data
- Target Keywords: `tds calculator`, `calculate tds online`, `tds rate 194j 194c 194i`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
