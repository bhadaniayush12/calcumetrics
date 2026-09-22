# Research Log: Capital Gains Tax Calculator (India Tax)

## 1. Statutory Grounding & Formula
Capital gains in India are governed by Sections 45 to 55A of the Income-tax Act, 1961, substantially restructured under the Finance (No. 2) Act, 2024 (effective July 23, 2024).

- **Classification:**
  - **Holding Period Thresholds:**
    - Listed Equity Shares and Equity-Oriented Mutual Funds: Short-term if $\le 12$ months, Long-term if $> 12$ months.
    - Immovable Property (Real Estate), Physical Gold, Unlisted Shares: Short-term if $\le 24$ months, Long-term if $> 24$ months (unified under Finance Act 2024).
    - Specified Mutual Funds (Debt Funds): Taxed as short-term capital gains at applicable income tax slab rates regardless of holding period (Finance Act 2023 amendment).

- **Applicable Tax Rates (Post-Budget 2024 / AY 2025-26):**
  - Section 111A (STCG on Equity/Equity MFs): 20% (increased from 15% effective 23 July 2024).
  - Section 112A (LTCG on Equity/Equity MFs): 12.5% on gains exceeding the statutory exemption limit of ₹1,25,000 per financial year (increased from 10% on gains exceeding ₹1,00,000).
  - Section 112 (LTCG on Real Estate / Property): 12.5% without indexation benefit for transfers on or after 23 July 2024 (for properties acquired before 23 July 2024 by resident individuals/HUFs, grandfathered indexation comparison applies under subsequent amendments).
  - Section 112 (LTCG on Gold): 12.5% without indexation.
  - Health & Education Cess: Flat 4% levied on the computed tax liability.

- **Formula:**
  $$\text{Capital Gain} = \text{Sale Price} - \text{Purchase Price}$$
  $$\text{Taxable Gain} = \max(0, \text{Capital Gain} - \text{Exemption})$$
  $$\text{Base Tax} = \text{Taxable Gain} \times \text{Rate}$$
  $$\text{Total Tax} = \text{Base Tax} \times 1.04 \quad (\text{including 4\% cess})$$

## 2. Default Assumptions & Ranges
- Sale Price: ₹5,00,000 (Slider: ₹10,000 to ₹1,00,00,000)
- Purchase Price: ₹3,00,000 (Slider: ₹10,000 to ₹1,00,00,000)
- Holding Period: 24 Months
- Asset Type: Listed Equity / Equity Mutual Fund

## 3. SEO & Structured Data
- Target Keywords: `capital gains tax calculator india`, `ltcg calculator budget 2024`, `stcg 20 percent calculator`.
- Schema: WebApplication, BreadcrumbList, FAQPage (5 questions).
