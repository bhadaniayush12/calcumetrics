# Research Log: Inflation Calculator

## 1. Mathematical Grounding & Formula
Inflation measures the rate at which the purchasing power of a currency decreases over time, resulting in a general increase in the price of goods and services.

- **Future Cost of Current Goods:**
  $$FV = PV \times (1 + i)^t$$
  Where:
  - $PV$: Current cost or present value of goods/services.
  - $i$: Annual inflation rate (decimal: $\text{rate} / 100$).
  - $t$: Time horizon in years.

- **Future Purchasing Power of Today's Currency:**
  $$\text{Purchasing Power} = \frac{PV}{(1 + i)^t}$$
  This represents what ₹100,000 / $100,000 saved under the mattress will effectively buy $t$ years from now in today's money.

- **Loss in Purchasing Power:**
  $$\Delta = PV - \text{Purchasing Power}$$

- **Cumulative Inflation:**
  $$\text{Cumulative Rate} = \left((1 + i)^t - 1\right) \times 100\%$$

## 2. Default Assumptions & Ranges
- Current Amount: ₹1,00,000 (Slider: 10,000 to 1,00,00,000)
- Annual Inflation Rate: 6.0% (historical long-run CPI average in India is ~5.5-6.5%; US long-run ~2.5-3.5%; default slider: 1% to 20%, step: 0.1%)
- Time Horizon: 10 Years (Slider: 1 to 40 years, step: 1)

## 3. SEO & Competitive Parity
- Target Keywords: `inflation calculator`, `future purchasing power calculator`, `cost of living inflation calculator`.
- Inputs: Current Amount, Inflation Rate (%), Number of Years.
- Outputs: Future Cost, Future Purchasing Power, Purchasing Power Loss, Cumulative Inflation %, and Composition/Year-by-year summary.
