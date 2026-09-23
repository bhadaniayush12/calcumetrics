import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { BLOG_POSTS } from '../src/data/blog/posts';

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to wrap text into lines of maxChars length
function wrapText(text: string, maxChars = 34): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

interface OgCardOptions {
  categoryBadge: string;
  title: string;
  subtitle?: string;
  metaRight?: string;
  outPath: string;
}

async function renderCard({ categoryBadge, title, subtitle, metaRight = 'calcumetrics.com', outPath }: OgCardOptions) {
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const titleLines = wrapText(title, 34).slice(0, 3);
  const titleYStart = titleLines.length === 1 ? 280 : (titleLines.length === 2 ? 250 : 220);
  const titleTspans = titleLines
    .map((line, idx) => `<tspan x="96" y="${titleYStart + idx * 56}">${escapeXml(line)}</tspan>`)
    .join('');

  let subtitleSvg = '';
  if (subtitle) {
    const subLines = wrapText(subtitle, 54).slice(0, 2);
    const subYStart = titleYStart + titleLines.length * 56 + 18;
    const subTspans = subLines
      .map((line, idx) => `<tspan x="96" y="${subYStart + idx * 32}">${escapeXml(line)}</tspan>`)
      .join('');
    subtitleSvg = `<text fill="#9BA39E" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="20" font-weight="400">${subTspans}</text>`;
  }

  // Logo glyph SVG path
  const logoGlyph = `<path d="M41.5673 27.13H33.5772C33.4707 26.3097 33.2523 25.5692 32.922 24.9087C32.5918 24.2482 32.155 23.6836 31.6116 23.2148C31.0683 22.7461 30.4238 22.3892 29.678 22.1442C28.943 21.8885 28.128 21.7607 27.2331 21.7607C25.6457 21.7607 24.2768 22.1495 23.1262 22.9272C21.9863 23.7049 21.1074 24.8288 20.4895 26.299C19.8822 27.7692 19.5786 29.5483 19.5786 31.6364C19.5786 33.8097 19.8876 35.6314 20.5055 37.1016C21.134 38.5611 22.0129 39.6637 23.1422 40.4094C24.2821 41.1445 25.6297 41.5121 27.1851 41.5121C28.0587 41.5121 28.8524 41.4002 29.5662 41.1765C30.2906 40.9528 30.9245 40.6278 31.4678 40.2017C32.0218 39.7649 32.4746 39.2376 32.8261 38.6197C33.1883 37.9911 33.4387 37.2827 33.5772 36.4943L41.5673 36.5423C41.4288 37.9911 41.0079 39.4187 40.3048 40.8249C39.6123 42.2312 38.6589 43.5149 37.4444 44.6761C36.2299 45.8267 34.7491 46.7429 33.0019 47.4247C31.2654 48.1065 29.2732 48.4474 27.0253 48.4474C24.0637 48.4474 21.411 47.7976 19.0673 46.4979C16.7342 45.1875 14.8911 43.2805 13.5381 40.777C12.1851 38.2734 11.5087 35.2266 11.5087 31.6364C11.5087 28.0355 12.1958 24.9833 13.5701 22.4798C14.9444 19.9762 16.8034 18.0746 19.1472 16.7749C21.4909 15.4751 24.117 14.8253 27.0253 14.8253C29.0069 14.8253 30.8393 15.1023 32.5225 15.6562C34.2057 16.1996 35.6866 16.9986 36.965 18.0533C38.2434 19.0973 39.2821 20.381 40.0811 21.9045C40.8801 23.4279 41.3755 25.1697 41.5673 27.13Z" fill="white"/>`;

  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <!-- Dark canvas background -->
    <rect width="1200" height="630" fill="#0F1211" />
    
    <!-- Accent radial glow -->
    <circle cx="1060" cy="110" r="320" fill="#176B5B" opacity="0.18" />
    
    <!-- Outer Card Frame -->
    <rect x="48" y="48" width="1104" height="534" rx="20" fill="#171A18" stroke="#2B302D" stroke-width="2" />
    
    <!-- Left Accent Pill -->
    <rect x="48" y="80" width="5" height="100" rx="2.5" fill="#176B5B" />
    
    <!-- Brand Mark (Left) -->
    <g transform="translate(96, 96)">
      <rect width="48" height="48" rx="10" fill="#176B5B" />
      <g transform="translate(-8, -8) scale(1)">
        ${logoGlyph}
      </g>
    </g>
    
    <!-- Brand Name -->
    <text x="160" y="128" fill="#FFFFFF" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="24" font-weight="700" letter-spacing="-0.3">Calcumetrics</text>
    
    <!-- Category Badge (Right) -->
    <g transform="translate(860, 96)">
      <rect width="244" height="42" rx="21" fill="rgba(23,107,91,0.22)" stroke="#176B5B" stroke-width="1.5" />
      <text x="122" y="26" fill="#2EC4A7" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1.5">${escapeXml(categoryBadge.toUpperCase())}</text>
    </g>
    
    <!-- Main Title -->
    <text fill="#FFFFFF" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="44" font-weight="700">
      ${titleTspans}
    </text>
    
    <!-- Subtitle if present -->
    ${subtitleSvg}
    
    <!-- Bottom Footer Row -->
    <line x1="96" y1="490" x2="1104" y2="490" stroke="#2B302D" stroke-width="1" />
    <text x="96" y="528" fill="#8A928D" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="16" font-weight="500">100% Client-Side  ·  Verified Formulas  ·  Zero Sign-Up</text>
    <text x="1104" y="528" fill="#176B5B" font-family="Segoe UI, Inter, -apple-system, sans-serif" font-size="18" font-weight="700" text-anchor="end">${escapeXml(metaRight)}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(outPath);
}

async function main() {
  console.log('Generating OpenGraph images...');

  // 1. Default site-wide card
  await renderCard({
    categoryBadge: 'Financial Tools',
    title: 'Free Online Financial Calculators',
    subtitle: '50+ fast, verified, 100% client-side tools for investments, loans, taxes, business & corporate finance.',
    metaRight: 'calcumetrics.com',
    outPath: 'public/og/default.png',
  });
  console.log('✓ public/og/default.png');

  // 2. Category cards
  const categories = [
    {
      slug: 'investments',
      badge: 'Investments',
      title: 'Investment & Wealth Calculators',
      subtitle: 'SIP, Compound Interest, CAGR, XIRR, FD, RD, PPF, 401(k), and Inflation projections.',
    },
    {
      slug: 'loans',
      badge: 'Loans & Credit',
      title: 'Loan & Mortgage Calculators',
      subtitle: 'EMI calculation, amortization schedules, debt-to-income ratios, and loan prepayment impact.',
    },
    {
      slug: 'taxes',
      badge: 'Tax Compliance',
      title: 'Statutory Tax Calculators',
      subtitle: 'Income Tax (Old vs New Regime), GST, HRA exemption, TDS, and Capital Gains compliance.',
    },
    {
      slug: 'business',
      badge: 'Business Finance',
      title: 'Business & Commercial Metrics',
      subtitle: 'Break-even point, profit margins, markup, inventory turnover, EOQ, and working capital.',
    },
    {
      slug: 'corporate-finance',
      badge: 'Valuation & Advisory',
      title: 'Corporate Finance & Valuation Tools',
      subtitle: 'WACC, Net Present Value (NPV), IRR, DCF valuation, and discounted payback periods.',
    },
    {
      slug: 'blog',
      badge: 'Research & Guides',
      title: 'Financial Intelligence & Guides',
      subtitle: 'In-depth methodology breakdowns, statutory tax rules, and interactive calculation analysis.',
    },
  ];

  for (const cat of categories) {
    await renderCard({
      categoryBadge: cat.badge,
      title: cat.title,
      subtitle: cat.subtitle,
      metaRight: `calcumetrics.com/${cat.slug}`,
      outPath: `public/og/categories/${cat.slug}.png`,
    });
    console.log(`✓ public/og/categories/${cat.slug}.png`);
  }

  // 3. Blog article cards (30 articles)
  for (const post of BLOG_POSTS) {
    await renderCard({
      categoryBadge: post.category,
      title: post.title,
      subtitle: post.description,
      metaRight: `${post.readTime} · Calcumetrics`,
      outPath: `public/og/articles/${post.slug}.png`,
    });
  }
  console.log(`✓ Generated ${BLOG_POSTS.length} article OG cards under public/og/articles/`);
  console.log('All OG images generated successfully!');
}

main().catch((err) => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
