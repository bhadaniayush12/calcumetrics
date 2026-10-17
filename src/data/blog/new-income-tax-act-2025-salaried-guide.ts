import type { BlogPost } from './types';
import { calcIncomeTax } from '../../lib/calculators/income-tax';
const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const salary = 1275000;
const example = calcIncomeTax(salary).newRegime;
export const NEW_TAX_ACT_POST: BlogPost = {
  slug: 'new-income-tax-act-2025-salaried-guide',
  title: 'Income-tax Act 2025: A Salaried Employee’s Guide from April 2026',
  seoTitle: 'Income-tax Act 2025: Salaried Guide for 2026–27',
  description: 'Understand tax year 2026–27, ten old-to-new section mappings, salary TDS and what stayed unchanged in slabs, standard deduction and rebate.',
  category: 'Taxes', market: 'India-Only', publishDate: '2026-10-17', dateModified: '2026-10-17', readTime: '8 min read', author: 'Calcumetrics Editorial Team', type: 'Hybrid',
  quickAnswer: 'The Income-tax Act, 2025 applies from 1 April 2026. Tax year 2026–27 covers 1 April 2026 to 31 March 2027. Salary provisions have new references, including standard deduction under section 19 and salary TDS under section 392(1), while the existing slabs and rebate framework continue.',
  summary: 'A practical guide to reading payroll documents after the new Act took effect, with ten verified section mappings and a salary-only calculator example.',
  sources: [
    { name: 'Income Tax Department', citation: 'Income-tax Act, 2025, as amended by Finance Act, 2026: sections 1, 11, 19, 123, 124, 126, 129, 156, 202 and 392; Schedules III and XV', url: 'https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf' },
    { name: 'Income Tax Department', citation: 'Updated FAQs on interplay and transitions: tax year and salary TDS transition', url: 'https://www.incometaxindia.gov.in/documents/81799/11848482/Updated-FQAs-on-Interplay%26Transitions.pdf/e10ad2b6-9495-de90-58d3-20606d8954ae?t=1775128640970' },
    { name: 'Income Tax Department', citation: 'Income from salary: legacy HRA and leave travel references', url: 'https://www.incometaxindia.gov.in/w/income-from-salary' },
    { name: 'Income Tax Department', citation: 'Deductions allowable to taxpayer: legacy salary deductions, Chapter VI-A and section 87A', url: 'https://www.incometaxindia.gov.in/w/deductions-allowable-to-tax-payer' },
    { name: 'Business Standard', citation: '2 February 2026: Budget leaves FY 2026–27 income-tax slabs unchanged', url: 'https://www.business-standard.com/finance/personal-finance/tax-slabs-fy27-unchanged-experts-on-which-tax-regime-saves-you-more-now-126020200669_1.html' },
  ],
  relatedCalculators: [
    { name: 'Income Tax Calculator', path: '/in/income-tax-calculator', description: 'Estimate salary tax and compare regimes using your own deductions.' },
    { name: 'Salary CTC Calculator', path: '/in/salary-ctc-calculator', description: 'Separate cost to company from salary and estimated take-home pay.' },
    { name: 'TDS Calculator', path: '/in/tds-calculator', description: 'Check withholding categories; salary TDS needs an annual income-tax calculation.' },
  ],
  relatedArticles: [{ slug: 'old-vs-new-tax-regime', title: 'Old vs New Tax Regime', description: 'Compare the regimes after identifying the right tax year and income inputs.' }],
  faqs: [
    { question: 'What is tax year 2026–27?', answer: 'It is the period from 1 April 2026 to 31 March 2027 under the Income-tax Act, 2025. It identifies the income period directly. Earlier-year matters remain governed by the transition provisions.' },
    { question: 'Did the new Act remove the standard deduction?', answer: 'No. Section 19(1), table serial number 2, provides a salary standard deduction capped at ₹75,000 under the new regime and ₹50,000 otherwise, or salary if lower.' },
    { question: 'What replaced section 192 for salary TDS?', answer: 'Section 392(1) of the Income-tax Act, 2025 is the salary withholding provision. Salary TDS continues to depend on estimated annual taxable salary and applicable rates, rather than a single flat salary percentage.' },
    { question: 'Is the old section 87A rebate now section 156?', answer: 'Yes. Section 156 contains the resident-individual rebate. Under the new regime, eligible total income up to ₹12 lakh can receive a rebate up to ₹60,000, limited to tax at section 202 slab rates. Special-rate income needs separate attention.' },
  ],
  content: `
<p><strong>The Income-tax Act, 2025 took effect on 1 April 2026.</strong> For a salaried employee, the immediate changes are the year terminology and the references used for familiar tax items. A different section number on a payroll worksheet does not, by itself, mean a new deduction or a higher tax bill.</p>
<p>This guide uses the Act as amended by the Finance Act, 2026 and the Income Tax Department’s transition FAQs, checked on 17 October 2026. It focuses on reading salary calculations during the changeover. For a full comparison of deduction choices, use our existing <a href="/blog/old-vs-new-tax-regime">old versus new tax regime guide</a>.</p>
<h2>What “tax year” means for your salary</h2>
<p><strong>Tax year 2026–27 runs from 1 April 2026 to 31 March 2027.</strong> The new term identifies the period in which income is earned, replacing the previous-year and assessment-year pairing for the new Act’s framework. It does not move the salary year to January or give you a second allowance for an overlapping period.</p>
<p>The transition still matters when you look backwards. Income for financial year 2025–26 belongs to the old Act’s assessment year 2026–27 process. A return or query handled after April 2026 can therefore legitimately refer to the 1961 Act if it concerns that earlier income period. Check the income dates before deciding which section reference is appropriate.</p>
<p>Keep earlier-year salary records separate from the current tax-year folder. That small organisational step helps when an employer statement, an investment declaration and a return calculation use different labels. Renaming all older documents with the newest terminology would make reconciliation harder.</p>
<h2>Ten common salary references: old Act to new Act</h2>
<p>The table maps the provision’s location, not automatic eligibility. Each new reference was checked in the amended Act; the old references were checked against the department’s salary and deduction guides, with salary TDS confirmed in its transition FAQs. Schedule entries are included because exemptions are not all standalone sections now.</p>
<div class="overflow-x-auto"><table><caption>Income-tax Act, 1961 references mapped to the Income-tax Act, 2025</caption><thead><tr><th>Salary item</th><th>Old reference</th><th>New reference</th></tr></thead><tbody>
<tr><td>Standard deduction</td><td>16(ia)</td><td>19(1), Table serial 2</td></tr>
<tr><td>Professional tax paid</td><td>16(iii)</td><td>19(1), Table serial 1</td></tr>
<tr><td>House rent allowance exemption</td><td>10(13A)</td><td>11 read with Schedule III, Table serial 11</td></tr>
<tr><td>Leave travel concession / assistance</td><td>10(5)</td><td>11 read with Schedule III, Table serial 8</td></tr>
<tr><td>Eligible savings and payments formerly under 80C</td><td>80C</td><td>123 read with Schedule XV</td></tr>
<tr><td>Employer’s eligible NPS contribution</td><td>80CCD(2)</td><td>124(1) and 124(2)</td></tr>
<tr><td>Health insurance deduction</td><td>80D</td><td>126</td></tr>
<tr><td>Higher-education loan interest deduction</td><td>80E</td><td>129</td></tr>
<tr><td>Resident-individual tax rebate</td><td>87A</td><td>156</td></tr>
<tr><td>TDS on salary</td><td>192</td><td>392(1)</td></tr>
</tbody></table></div>
<p>Read a schedule reference in full. For example, HRA appears in Schedule III with conditions about actual rent and accommodation. Writing only “section 11” loses the specific entry that explains the exemption. Likewise, section 123 points to Schedule XV for the eligible payments; it is not permission to deduct every saving or investment.</p>
<h2>What stayed the same in the tax calculation</h2>
<p>The personal income-tax slab structure continued into 2026–27. Under section 202, the new regime has nil tax up to ₹4 lakh, then rates of 5%, 10%, 15%, 20% and 25% across successive ₹4 lakh bands up to ₹24 lakh, with 30% above ₹24 lakh. These are marginal bands: entering a higher band does not apply that rate to all your income.</p>
<p>The salary standard deduction is ₹75,000 under that regime and ₹50,000 otherwise, limited to salary if salary is lower. Moving it from section 16 to section 19 did not turn it into a reimbursement requiring a matching purchase. Keep the standard deduction distinct from expenses or investments for which eligibility and supporting documents matter.</p>
<p>The familiar resident rebate also continues, now in section 156. Under the new regime, the maximum is ₹60,000 where eligible total income does not exceed ₹12 lakh, with marginal relief provisions above that level. The rebate is limited to tax calculated at section 202 slab rates; it should not be assumed to erase tax on special-rate capital gains.</p>
<p>The old-regime rebate remains capped at ₹12,500 for a resident individual whose total income does not exceed ₹5 lakh. Neither rebate is an amount subtracted from gross salary. A deduction reduces the income used to calculate tax; a rebate reduces eligible tax after that calculation.</p>
<h2>A salary-only example using the site’s engine</h2>
<p>Assume a resident employee has gross salary of <strong>${money(salary)}</strong>, no other income and no special-rate gains. The site’s <strong>calcIncomeTax</strong> engine applies a new-regime standard deduction of <strong>${money(example.standardDeduction)}</strong>, producing taxable income of <strong>${money(example.taxableIncome)}</strong>.</p>
<p>The calculated slab tax is <strong>${money(example.baseTax)}</strong>, followed by a rebate of <strong>${money(example.rebate87A)}</strong>, leaving total tax of <strong>${money(example.totalTax)}</strong>. These values are generated from the calculator function rather than entered as a separate hand-worked example. They demonstrate the rebate mechanism; they do not establish a universal tax-free CTC amount.</p>
<p>CTC can include employer contributions and benefits that do not arrive as monthly cash salary. Other income can also alter the result. Start with the <a href="/in/salary-ctc-calculator">salary CTC calculator</a> to understand the salary breakup, then use the <a href="/in/income-tax-calculator">income tax calculator</a> with the appropriate income and deductions. Do not substitute headline CTC for taxable salary without checking its components.</p>
<h2>A new reference does not make every deduction available</h2>
<p>Regime restrictions still matter. Section 202 excludes the HRA and leave-travel entries cited above, professional tax under the salary table, and most Chapter VIII deductions. The fact that health insurance or eligible savings have a new section number does not make them deductible under the default regime.</p>
<p>Employer NPS contributions are an important distinction: section 202 preserves deductions under section 124(1) and (2), subject to their conditions. Do not confuse an employer contribution with an employee’s own contribution simply because both appear under a pension heading on a statement. Ask payroll which contribution is included and which provision supports the deduction.</p>
<p>If comparing regimes, use only deductions you can substantiate. A calculator can compare the inputs supplied, but it cannot decide whether a rent arrangement, insurance payment or education loan meets every legal condition. The section map is a way to find the relevant provision, not a substitute for those conditions.</p>
<h2>Salary TDS moves to section 392(1)</h2>
<p>The department’s transition FAQs explicitly identify section 392(1) for salary paid from April 2026 onwards for tax year 2026–27, replacing the familiar section 192 reference. The employer estimates the annual salary tax and withholds at the applicable average rate. Salary does not acquire a single flat TDS percentage because the law has been renumbered.</p>
<p>A bonus, job change or revised declaration can change that estimate. Ask for the annual calculation behind a changed monthly deduction: projected salary, eligible exemptions, deductions, rebate and tax already withheld. Looking only at the percentage deducted from one month’s pay can hide the reason for the adjustment.</p>
<p>Our <a href="/in/tds-calculator">TDS calculator</a> is a withholding reference and retains familiar legacy category labels. Use the income-tax tool for a salary estimate; do not read a salary reference row as a complete payroll calculation. For a document concerning the current tax year, check the new Act reference against the table above.</p>
<h2>What to check in your next payroll review</h2>
<p>Confirm the income period first, then the regime used by payroll. Compare the annual salary estimate with your actual compensation, including any changed bonus expectation. Check that a renamed deduction has not been counted twice and that an old section label has not caused a legitimate item to disappear from the worksheet.</p>
<p>Keep the calculation and supporting records together so a difference can be explained. Where earlier-year income, special-rate gains or unusual benefits are involved, get the specific treatment checked rather than extending this simple salary example. <strong>Educational information only; not financial advice.</strong> This guide explains the transition and calculator assumptions; it is not a personalised tax opinion.</p>
`,
};
