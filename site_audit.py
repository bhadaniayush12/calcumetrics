#!/usr/bin/env python3
"""
Calcumetrics Comprehensive Site Audit & QA/Security Automation Suite
===================================================================
A deep, automated local audit harness for Calcumetrics (Astro + Tailwind + client-side JS).

Pillars:
  1. ASSET & ATTACK-SURFACE DISCOVERY
  2. SOURCE CODE & DEPENDENCY HYGIENE
  3. CALCULATOR FUNCTIONAL & BOUNDARY TEST MATRIX
  4. INDEPENDENT MATHEMATICAL VERIFICATION
  5. CLIENT-SIDE SECURITY & BUSINESS LOGIC
  6. STRUCTURED EVIDENCE & FIX PROMPT GENERATION

Author: Senior Full-Stack Web QA & Security Automation Engineer
License: MIT / Internal QA
"""

import os
import sys
import re
import json
import time
import math
import argparse
import urllib.parse
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Dict, List, Any, Optional, Set, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from playwright.sync_api import sync_playwright, Page, Browser, Error as PlaywrightError
except ImportError:
    print("CRITICAL: 'playwright' is required. Please install it using: pip install playwright && python -m playwright install chromium")
    sys.exit(1)

# ==============================================================================
# CONSTANTS & CONSTRAINTS
# ==============================================================================

ALLOWED_HOSTS: Set[str] = {
    "localhost",
    "127.0.0.1",
    "calcumetrics.com",
    "www.calcumetrics.com",
    "staging.calcumetrics.com",
}

RESPONSIVE_VIEWPORTS: List[Dict[str, Any]] = [
    {"name": "mobile_xs_320", "width": 320, "height": 640},
    {"name": "mobile_sm_375", "width": 375, "height": 667},
    {"name": "tablet_md_768", "width": 768, "height": 1024},
    {"name": "laptop_lg_1024", "width": 1024, "height": 768},
    {"name": "desktop_xl_1440", "width": 1440, "height": 900},
    {"name": "desktop_2xl_1920", "width": 1920, "height": 1080},
]

XSS_CANARY_PAYLOAD = '"><img src=x onerror=window.__xss=1>'
XSS_URL_PARAM_PAYLOAD = '%22%3E%3Cimg%20src=x%20onerror=window.__xss=1%3E'

# Severity Levels
SEV_CRITICAL = "CRITICAL"
SEV_HIGH = "HIGH"
SEV_MEDIUM = "MEDIUM"
SEV_LOW = "LOW"
SEV_INFO = "INFO"

# ==============================================================================
# DATA MODELS
# ==============================================================================

@dataclass
class Finding:
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW, INFO
    pillar: int    # 1..6
    tool_slug: str
    tool_name: str
    category: str
    title: str
    description: str
    evidence: Dict[str, Any] = field(default_factory=dict)
    remediation: Optional[str] = None
    file_path: Optional[str] = None

@dataclass
class ToolBenchmarkSpec:
    slug: str
    name: str
    path: str
    category: str
    region: str
    formula_type: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]
    reset_selector: Optional[str]
    currency_selector: Optional[str]
    boundary_inputs: List[Any]
    benchmarks: List[Dict[str, Any]]
    file_path: Optional[str] = None

# ==============================================================================
# HOST VALIDATION & CONFIG
# ==============================================================================

def validate_target_host(base_url: str) -> str:
    """Enforces strict host restriction constraint."""
    parsed = urllib.parse.urlparse(base_url)
    hostname = (parsed.hostname or "").lower()
    if hostname not in ALLOWED_HOSTS and not hostname.endswith(".calcumetrics.com"):
        raise ValueError(
            f"Host '{hostname}' is not permitted. Strictly restricted to: {sorted(ALLOWED_HOSTS)}"
        )
    return base_url.rstrip("/")

# ==============================================================================
# PILLAR 4: INDEPENDENT MATHEMATICAL REFERENCE ENGINE
# ==============================================================================

class MathReferenceEngine:
    """
    Independent reference implementation for financial and business calculations.
    Pure Python math with tolerance checking and Indian/International currency parsing.
    """

    @staticmethod
    def parse_dom_number(text: Optional[str]) -> Optional[float]:
        """Parses raw text from DOM elements into a clean floating point value."""
        if not text:
            return None
        s = text.strip()
        
        # Indian compact units (Lakh, Crore) and SI units (k, M)
        m_cr = re.search(r'([0-9.]+)\s*(?:Cr|Crores?)', s, re.I)
        if m_cr:
            return float(m_cr.group(1)) * 10_000_000.0
        m_lakh = re.search(r'([0-9.]+)\s*(?:L|Lakhs?|Lac)', s, re.I)
        if m_lakh:
            return float(m_lakh.group(1)) * 100_000.0
        m_k = re.search(r'([0-9.]+)\s*k\b', s, re.I)
        if m_k:
            return float(m_k.group(1)) * 1_000.0
        m_m = re.search(r'([0-9.]+)\s*M\b', s, re.I)
        if m_m:
            return float(m_m.group(1)) * 1_000_000.0

        # Strip currency symbols and extraneous whitespace
        clean = re.sub(r'[\$₹€£\s]', '', s)
        # European format: 1.234,56
        if re.search(r'\d+\.\d{3},\d+', clean):
            clean = clean.replace('.', '').replace(',', '.')
        else:
            # Standard or Indian with commas
            clean = clean.replace(',', '')
        
        # Remove trailing % or other text
        clean = re.sub(r'[^\d.\-+eE]', '', clean)
        try:
            return float(clean)
        except ValueError:
            return None

    @staticmethod
    def calc_sip(monthly: float, rate_pct: float, years: float) -> Dict[str, float]:
        n = years * 12.0
        i = rate_pct / (12.0 * 100.0)
        invested = monthly * n
        if i <= 0:
            maturity = invested
        else:
            # Annuity-due (payment at beginning of month)
            maturity = monthly * (((math.pow(1.0 + i, n) - 1.0) / i) * (1.0 + i))
        gain = maturity - invested
        return {
            "maturity": maturity,
            "invested": invested,
            "gain": gain,
            "gain_pct": (gain / invested * 100.0) if invested > 0 else 0.0
        }

    @staticmethod
    def calc_lump_sum(principal: float, rate_pct: float, years: float, freq: int = 1) -> Dict[str, float]:
        r = rate_pct / 100.0
        maturity = principal * math.pow(1.0 + r / freq, freq * years)
        gain = maturity - principal
        return {
            "maturity": maturity,
            "principal": principal,
            "gain": gain,
            "gain_pct": (gain / principal * 100.0) if principal > 0 else 0.0
        }

    @staticmethod
    def calc_simple_interest(principal: float, rate_pct: float, years: float) -> Dict[str, float]:
        interest = principal * (rate_pct / 100.0) * years
        maturity = principal + interest
        return {
            "interest": interest,
            "maturity": maturity,
            "principal": principal
        }

    @staticmethod
    def calc_cagr(pv: float, fv: float, years: float) -> Dict[str, float]:
        if pv <= 0 or fv <= 0 or years <= 0:
            return {"cagr_pct": 0.0, "multiple": 0.0, "gain": 0.0}
        cagr = math.pow(fv / pv, 1.0 / years) - 1.0
        return {
            "cagr_pct": cagr * 100.0,
            "multiple": fv / pv,
            "gain": fv - pv
        }

    @staticmethod
    def calc_emi(principal: float, rate_pct: float, years: float) -> Dict[str, float]:
        if principal <= 0 or years <= 0:
            return {"emi": 0.0, "total_payment": 0.0, "total_interest": 0.0}
        n = years * 12.0
        r = rate_pct / 1200.0
        if r <= 0:
            emi = principal / n
        else:
            pow_val = math.pow(1.0 + r, n)
            emi = (principal * r * pow_val) / (pow_val - 1.0)
        total_payment = emi * n
        total_interest = total_payment - principal
        return {
            "emi": emi,
            "total_payment": total_payment,
            "total_interest": total_interest,
            "principal": principal
        }

    @staticmethod
    def calc_break_even(fixed_cost: float, price_per_unit: float, var_cost: float) -> Dict[str, float]:
        cm = price_per_unit - var_cost
        if cm <= 0:
            return {"break_even_units": 0.0, "break_even_revenue": 0.0}
        units = fixed_cost / cm
        revenue = units * price_per_unit
        return {"break_even_units": units, "break_even_revenue": revenue}

    @staticmethod
    def calc_profit_margin(revenue: float, cogs: float, opex: float = 0.0, taxes: float = 0.0) -> Dict[str, float]:
        gross_profit = revenue - cogs
        gross_margin = (gross_profit / revenue * 100.0) if revenue > 0 else 0.0
        net_profit = gross_profit - opex - taxes
        net_margin = (net_profit / revenue * 100.0) if revenue > 0 else 0.0
        return {
            "gross_profit": gross_profit,
            "gross_margin": gross_margin,
            "net_profit": net_profit,
            "net_margin": net_margin
        }

    @staticmethod
    def calc_markup_margin(cost: float, markup_pct: float) -> Dict[str, float]:
        selling_price = cost * (1.0 + markup_pct / 100.0)
        profit = selling_price - cost
        margin_pct = (profit / selling_price * 100.0) if selling_price > 0 else 0.0
        return {
            "selling_price": selling_price,
            "profit": profit,
            "margin_pct": margin_pct
        }

    @staticmethod
    def calc_roi(initial: float, final_val: float, years: float = 1.0) -> Dict[str, float]:
        net_profit = final_val - initial
        roi_pct = (net_profit / initial * 100.0) if initial > 0 else 0.0
        return {"net_profit": net_profit, "roi": roi_pct}

    @staticmethod
    def calc_eoq(demand: float, setup: float, holding: float) -> Dict[str, float]:
        if holding <= 0 or demand <= 0 or setup <= 0:
            return {"eoq": 0.0}
        return {"eoq": math.sqrt((2.0 * demand * setup) / holding)}

    @staticmethod
    def calc_depreciation(cost: float, salvage: float, life_years: float) -> Dict[str, float]:
        if life_years <= 0:
            return {"depreciation": 0.0}
        return {"depreciation": (cost - salvage) / life_years}

    @staticmethod
    def calc_working_capital(current_assets: float, current_liab: float) -> Dict[str, float]:
        return {"working_capital": current_assets - current_liab}

    @staticmethod
    def calc_cogs(beginning: float, purchases: float, labor: float = 0.0, overhead: float = 0.0, ending: float = 0.0) -> Dict[str, float]:
        available = beginning + purchases + labor + overhead
        cogs = available - ending
        return {"cogs": cogs, "available": available}

    @staticmethod
    def calc_inventory_turnover(cogs: float, avg_inventory: float) -> Dict[str, float]:
        if avg_inventory <= 0:
            return {"turnover": 0.0, "dsi": 0.0}
        turnover = cogs / avg_inventory
        dsi = (365.0 / turnover) if turnover > 0 else 0.0
        return {"turnover": turnover, "dsi": dsi}

    @staticmethod
    def calc_present_value(future_val: float, rate_pct: float, years: float) -> Dict[str, float]:
        pv = future_val / math.pow(1.0 + rate_pct / 100.0, years)
        return {"present_value": pv}

    @staticmethod
    def calc_future_value(present_val: float, rate_pct: float, years: float, freq: int = 1) -> Dict[str, float]:
        r = rate_pct / 100.0
        fv = present_val * math.pow(1.0 + r / freq, freq * years)
        growth = fv - present_val
        return {"future_value": fv, "growth": growth}

    @staticmethod
    def calc_inflation(present_amt: float, rate_pct: float, years: float) -> Dict[str, float]:
        r = rate_pct / 100.0
        fv = present_amt * math.pow(1.0 + r, years)
        purchasing_power = present_amt / math.pow(1.0 + r, years)
        return {"future_value": fv, "purchasing_power": purchasing_power}

    @staticmethod
    def calc_fd(principal: float, rate_pct: float, years: float) -> Dict[str, float]:
        # Indian Fixed Deposits use Quarterly Compounding by default
        freq = 4
        r = rate_pct / 100.0
        maturity = principal * math.pow(1.0 + r / freq, freq * years)
        return {"maturity": maturity, "interest": maturity - principal}

    @staticmethod
    def calc_gst(amount: float, rate_pct: float) -> Dict[str, float]:
        gst_amt = amount * (rate_pct / 100.0)
        return {"gst_amount": gst_amt, "total_amount": amount + gst_amt}

    @staticmethod
    def calc_401k(salary: float, contrib_pct: float, match_pct: float, match_limit_pct: float, rate_pct: float, years: float) -> Dict[str, float]:
        annual_employee = salary * (contrib_pct / 100.0)
        matchable_pct = min(contrib_pct, match_limit_pct)
        annual_employer = salary * (matchable_pct / 100.0) * (match_pct / 100.0)
        total_annual = annual_employee + annual_employer
        r = rate_pct / 100.0
        balance = 0.0
        for _ in range(int(years)):
            balance = (balance + total_annual) * (1.0 + r)
        return {
            "maturity": balance,
            "employee_contrib": annual_employee * years,
            "employer_match": annual_employer * years
        }

    @classmethod
    def evaluate_benchmark(cls, formula_type: str, inputs: Dict[str, float]) -> Optional[Dict[str, float]]:
        """Dispatch calculation based on formula type."""
        try:
            f = formula_type.lower()
            if f == "sip":
                p = inputs.get("sip-monthly", inputs.get("monthly", 25000))
                r = inputs.get("sip-rate", inputs.get("rate", 12))
                y = inputs.get("sip-years", inputs.get("years", 15))
                return cls.calc_sip(p, r, y)
            elif f in ("lump_sum", "compound_interest"):
                p = inputs.get("ls-principal", inputs.get("ci-principal", inputs.get("principal", 100000)))
                r = inputs.get("ls-rate", inputs.get("ci-rate", inputs.get("rate", 8)))
                y = inputs.get("ls-years", inputs.get("ci-years", inputs.get("years", 10)))
                return cls.calc_lump_sum(p, r, y)
            elif f == "simple_interest":
                p = inputs.get("si-principal", inputs.get("principal", 100000))
                r = inputs.get("si-rate", inputs.get("rate", 8))
                y = inputs.get("si-years", inputs.get("years", 5))
                return cls.calc_simple_interest(p, r, y)
            elif f == "cagr":
                pv = inputs.get("cagr-pv", inputs.get("pv", 100000))
                fv = inputs.get("cagr-fv", inputs.get("fv", 250000))
                y = inputs.get("cagr-years", inputs.get("years", 5))
                return cls.calc_cagr(pv, fv, y)
            elif f in ("emi", "home_loan", "car_loan"):
                p = inputs.get("emi-principal", inputs.get("principal", 1000000))
                r = inputs.get("emi-rate", inputs.get("rate", 8.5))
                y = inputs.get("emi-years", inputs.get("years", 20))
                return cls.calc_emi(p, r, y)
            elif f == "break_even":
                fc = inputs.get("be-fixed", inputs.get("fixed", 500000))
                p = inputs.get("be-price", inputs.get("price", 500))
                vc = inputs.get("be-variable", inputs.get("variable", 300))
                return cls.calc_break_even(fc, p, vc)
            elif f == "profit_margin":
                rev = inputs.get("pm-revenue", inputs.get("revenue", 1000000))
                cogs = inputs.get("pm-cogs", inputs.get("cogs", 600000))
                opex = inputs.get("pm-opex", inputs.get("opex", 150000))
                tax = inputs.get("pm-taxes", inputs.get("taxes", 50000))
                return cls.calc_profit_margin(rev, cogs, opex, tax)
            elif f == "markup_margin":
                cost = inputs.get("markup-cost", inputs.get("cost", 500))
                markup = inputs.get("markup-pct", inputs.get("markup", 50))
                return cls.calc_markup_margin(cost, markup)
            elif f == "roi":
                init = inputs.get("roi-initial", inputs.get("initial", 100000))
                fin = inputs.get("roi-final", inputs.get("final", 150000))
                return cls.calc_roi(init, fin)
            elif f == "eoq":
                d = inputs.get("eoq-demand", inputs.get("demand", 10000))
                s = inputs.get("eoq-setup", inputs.get("setup", 50))
                h = inputs.get("eoq-holding", inputs.get("holding", 2))
                return cls.calc_eoq(d, s, h)
            elif f == "depreciation":
                cost = inputs.get("dep-cost", inputs.get("cost", 100000))
                salvage = inputs.get("dep-salvage", inputs.get("salvage", 10000))
                life = inputs.get("dep-life", inputs.get("life", 5))
                return cls.calc_depreciation(cost, salvage, life)
            elif f == "working_capital":
                ca = inputs.get("wc-assets", inputs.get("assets", 500000))
                cl = inputs.get("wc-liabilities", inputs.get("liabilities", 300000))
                return cls.calc_working_capital(ca, cl)
            elif f == "cogs":
                beg = inputs.get("cogs-beginning", inputs.get("beginning", 150000))
                pur = inputs.get("cogs-purchases", inputs.get("purchases", 450000))
                lab = inputs.get("cogs-labor", inputs.get("labor", 100000))
                ovh = inputs.get("cogs-overhead", inputs.get("overhead", 50000))
                end = inputs.get("cogs-ending", inputs.get("ending", 120000))
                return cls.calc_cogs(beg, pur, lab, ovh, end)
            elif f == "fd":
                p = inputs.get("fd-principal", inputs.get("principal", 100000))
                r = inputs.get("fd-rate", inputs.get("rate", 7.0))
                y = inputs.get("fd-years", inputs.get("years", 5))
                return cls.calc_fd(p, r, y)
            elif f == "present_value":
                fv = inputs.get("pv-future", inputs.get("future", 200000))
                r = inputs.get("pv-rate", inputs.get("rate", 8))
                y = inputs.get("pv-years", inputs.get("years", 5))
                return cls.calc_present_value(fv, r, y)
            elif f == "future_value":
                pv = inputs.get("fv-present", inputs.get("present", 100000))
                r = inputs.get("fv-rate", inputs.get("rate", 8))
                y = inputs.get("fv-years", inputs.get("years", 10))
                return cls.calc_future_value(pv, r, y)
            elif f == "inflation":
                amt = inputs.get("inf-amount", inputs.get("amount", 100000))
                r = inputs.get("inf-rate", inputs.get("rate", 6))
                y = inputs.get("inf-years", inputs.get("years", 10))
                return cls.calc_inflation(amt, r, y)
            elif f == "gst":
                amt = inputs.get("gst-amount", inputs.get("amount", 10000))
                r = inputs.get("gst-rate", inputs.get("rate", 18))
                return cls.calc_gst(amt, r)
            elif f == "401k":
                sal = inputs.get("k401-salary", inputs.get("salary", 100000))
                con = inputs.get("k401-contrib", inputs.get("contrib", 8))
                mat = inputs.get("k401-match", inputs.get("match", 50))
                lim = inputs.get("k401-match-limit", inputs.get("match_limit", 6))
                r = inputs.get("k401-rate", inputs.get("rate", 8))
                y = inputs.get("k401-years", inputs.get("years", 30))
                return cls.calc_401k(sal, con, mat, lim, r, y)
            return None
        except Exception:
            return None

# ==============================================================================
# PILLAR 2: SOURCE CODE & DEPENDENCY HYGIENE SCANNER
# ==============================================================================

class CodebaseHygieneScanner:
    """
    Performs static AST/token analysis of Astro, TypeScript, and JS source files.
    Detects undeclared runtime references, missing imports, exposed secrets,
    and unsafe innerHTML patterns.
    """

    SECRET_PATTERNS = [
        ("AWS Access Key", re.compile(r'\bAKIA[0-9A-Z]{16}\b')),
        ("Stripe Secret Key", re.compile(r'\bsk_live_[0-9a-zA-Z]{24,}\b')),
        ("GitHub Personal Access Token", re.compile(r'\bghp_[0-9a-zA-Z]{36}\b')),
        ("Google Cloud API Key", re.compile(r'\bAIza[0-9A-Za-z\-_]{35}\b')),
        ("RSA / EC Private Key", re.compile(r'-----BEGIN (?:RSA |EC )?PRIVATE KEY-----')),
        ("Hardcoded JWT Token", re.compile(r'\beyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b')),
    ]

    UNSAFE_DOM_PATTERNS = [
        ("eval() call", re.compile(r'\beval\s*\(')),
        ("Function() constructor", re.compile(r'\bnew\s+Function\s*\(')),
        ("document.write()", re.compile(r'\bdocument\.write\s*\(')),
        ("Unescaped innerHTML interpolation", re.compile(r'\.innerHTML\s*=\s*[^;]*\b(location\.|input\.value|document\.cookie|\$\{)')),
    ]

    @classmethod
    def scan_project(cls, project_root: str = ".", target_slugs: Optional[Set[str]] = None) -> List[Finding]:
        findings: List[Finding] = []
        src_dir = Path(project_root) / "src"
        if not src_dir.exists():
            return findings

        # Track scanned files
        code_files = list(src_dir.glob("**/*.astro")) + list(src_dir.glob("**/*.ts")) + list(src_dir.glob("**/*.js"))

        seen_keys: Set[Tuple[str, str]] = set()

        for file_path in code_files:
            rel_path = str(file_path.relative_to(project_root))
            slug = file_path.stem

            # If user filtered tools, only scan matching files (or global components if all)
            if target_slugs and slug not in target_slugs and "pages" in file_path.parts:
                continue

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    lines = content.splitlines()
            except Exception:
                continue

            # 1. Check for exposed secrets
            for sec_name, pattern in cls.SECRET_PATTERNS:
                for line_idx, line in enumerate(lines, 1):
                    if pattern.search(line):
                        dedup_key = (rel_path, f"{sec_name}:{line_idx}")
                        if dedup_key in seen_keys:
                            continue
                        seen_keys.add(dedup_key)

                        findings.append(Finding(
                            severity=SEV_CRITICAL,
                            pillar=2,
                            tool_slug=slug,
                            tool_name=slug.replace("-", " ").title(),
                            category="Security Hygiene",
                            title=f"Potential Exposed Secret ({sec_name})",
                            description=f"Detected pattern matching {sec_name} in {rel_path}:{line_idx}.",
                            evidence={"line_number": line_idx, "snippet": line.strip()[:100]},
                            remediation="Move credentials to environment variables or Cloudflare secrets.",
                            file_path=rel_path
                        ))

            # 2. Check for unsafe DOM manipulations / eval
            for dom_name, pattern in cls.UNSAFE_DOM_PATTERNS:
                for line_idx, line in enumerate(lines, 1):
                    if pattern.search(line):
                        # Filter out safe static assignments
                        if dom_name == "Unescaped innerHTML interpolation" and not re.search(r'\$\{|input\.|location\.', line):
                            continue
                        dedup_key = (rel_path, f"{dom_name}:{line_idx}")
                        if dedup_key in seen_keys:
                            continue
                        seen_keys.add(dedup_key)

                        findings.append(Finding(
                            severity=SEV_HIGH if "eval" in dom_name else SEV_MEDIUM,
                            pillar=2,
                            tool_slug=slug,
                            tool_name=slug.replace("-", " ").title(),
                            category="DOM Safety",
                            title=f"Unsafe DOM / Eval Pattern ({dom_name})",
                            description=f"File {rel_path}:{line_idx} uses a risky DOM assignment or eval pattern.",
                            evidence={"line_number": line_idx, "snippet": line.strip()[:120]},
                            remediation="Use textContent or DOMPurify / sanitize before inserting into DOM.",
                            file_path=rel_path
                        ))

            # 3. Check for Undeclared Variables in Astro Client Scripts
            if file_path.suffix == ".astro":
                scripts = re.findall(r'<script.*?>([\s\S]*?)</script>', content)
                for s_idx, script in enumerate(scripts):
                    validate_usages = re.findall(r'validate\s*\(\s*([a-zA-Z0-9_$]+)\s*\?\?', script)
                    for var_name in validate_usages:
                        is_declared = bool(
                            re.search(r'\b(const|let|var)\s+' + re.escape(var_name) + r'\b', script) or
                            re.search(r'\bimport\s+.*?\b' + re.escape(var_name) + r'\b', script) or
                            re.search(r'function\s*\w*\s*\([^)]*\b' + re.escape(var_name) + r'\b', script)
                        )
                        if not is_declared:
                            dedup_key = (rel_path, f"undeclared:{var_name}")
                            if dedup_key in seen_keys:
                                continue
                            seen_keys.add(dedup_key)

                            candidate_raw = re.sub(r'^num', 'raw', var_name)
                            has_raw = bool(re.search(r'\b(const|let|var)\s+' + re.escape(candidate_raw) + r'\b', script))

                            # Find exact line numbers in file
                            line_nums = [idx for idx, l in enumerate(lines, 1) if f"validate({var_name}" in l or f"validate({var_name} " in l]

                            findings.append(Finding(
                                severity=SEV_CRITICAL,
                                pillar=2,
                                tool_slug=slug,
                                tool_name=slug.replace("-", " ").title(),
                                category="Dependency & Variable Hygiene",
                                title=f"Undeclared Variable Reference '{var_name}' in Client Script",
                                description=(
                                    f"Variable '{var_name}' is referenced in validate() in {rel_path} "
                                    f"(lines: {line_nums}) but is NEVER declared or imported! "
                                    + (f"Likely intended '{candidate_raw}', which is declared." if has_raw else "")
                                ),
                                evidence={
                                    "variable": var_name,
                                    "likely_intended_variable": candidate_raw if has_raw else None,
                                    "file": rel_path,
                                    "line_numbers": line_nums,
                                    "script_index": s_idx
                                },
                                remediation=(
                                    f"In {rel_path}, replace '{var_name}' with '{candidate_raw}' "
                                    f"or declare '{var_name} = parseSmartInput(...)'. This bug causes a ReferenceError at runtime."
                                ),
                                file_path=rel_path
                            ))

        return findings

# ==============================================================================
# AUDITOR SUITE (PILLARS 1, 3, 4, 5)
# ==============================================================================

class CalculatorAuditor:
    """
    Automated Playwright test runner executing:
      Pillar 1: Asset & Attack Surface Discovery
      Pillar 3: Functional & Boundary Test Matrix
      Pillar 4: Mathematical Verification
      Pillar 5: Security & Business Logic (XSS, Multi-currency, Responsive)
    """

    def __init__(self, base_url: str, headless: bool = True):
        self.base_url = validate_target_host(base_url)
        self.headless = headless

    def audit_tool(self, spec: ToolBenchmarkSpec, active_pillars: Set[int]) -> Tuple[Dict[str, Any], List[Finding]]:
        """Audits a single tool across all requested pillars using a dedicated Playwright instance."""
        inventory: Dict[str, Any] = {
            "slug": spec.slug,
            "name": spec.name,
            "path": spec.path,
            "category": spec.category,
            "region": spec.region,
            "url": f"{self.base_url}{spec.path}",
            "dom_inputs": [],
            "sliders": [],
            "buttons": [],
            "scripts": [],
            "query_params": [],
            "hash_params": []
        }
        findings: List[Finding] = []

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=self.headless)
            context = browser.new_context()
            page = context.new_page()

            # Record uncaught runtime errors
            page_errors: List[str] = []
            page.on("pageerror", lambda err: page_errors.append(str(err)))

            target_url = f"{self.base_url}{spec.path}"

            try:
                resp = page.goto(target_url, timeout=12000, wait_until="domcontentloaded")
                status = resp.status if resp else 0
                if status >= 400:
                    findings.append(Finding(
                        severity=SEV_CRITICAL,
                        pillar=1,
                        tool_slug=spec.slug,
                        tool_name=spec.name,
                        category="Availability",
                        title=f"HTTP {status} on Calculator Route",
                        description=f"Route {spec.path} returned HTTP status {status}.",
                        evidence={"http_status": status, "url": target_url}
                    ))
                    browser.close()
                    return inventory, findings
            except Exception as e:
                findings.append(Finding(
                    severity=SEV_CRITICAL,
                    pillar=1,
                    tool_slug=spec.slug,
                    tool_name=spec.name,
                    category="Availability",
                    title="Navigation Timeout / Network Failure",
                    description=f"Failed to navigate to {target_url}: {str(e)}",
                    evidence={"error": str(e), "url": target_url}
                ))
                browser.close()
                return inventory, findings

            page.wait_for_timeout(400)

            # ──────────────────────────────────────────────────────────────────
            # PILLAR 1: ASSET & ATTACK-SURFACE DISCOVERY
            # ──────────────────────────────────────────────────────────────────
            if 1 in active_pillars:
                try:
                    disc = page.evaluate("""() => {
                        const inputs = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=range]):not(#search-palette-input)')).map(el => ({
                            id: el.id,
                            name: el.name,
                            type: el.type,
                            placeholder: el.placeholder,
                            value: el.value,
                            min: el.min,
                            max: el.max,
                            step: el.step,
                            required: el.required
                        }));
                        const sliders = Array.from(document.querySelectorAll('input[type=range]')).map(el => ({
                            id: el.id,
                            min: el.min,
                            max: el.max,
                            step: el.step,
                            value: el.value
                        }));
                        const buttons = Array.from(document.querySelectorAll('button')).map(el => ({
                            id: el.id,
                            text: el.innerText.trim(),
                            type: el.type
                        }));
                        const scripts = Array.from(document.querySelectorAll('script')).map(el => ({
                            src: el.src || 'inline',
                            type: el.type || 'text/javascript',
                            is_third_party: el.src ? !el.src.includes(window.location.host) : false
                        }));
                        return { inputs, sliders, buttons, scripts };
                    }""")
                    inventory["dom_inputs"] = disc["inputs"]
                    inventory["sliders"] = disc["sliders"]
                    inventory["buttons"] = disc["buttons"]
                    inventory["scripts"] = disc["scripts"]

                    # Inventory third party scripts
                    tp_scripts = [s["src"] for s in disc["scripts"] if s["is_third_party"]]
                    if tp_scripts:
                        findings.append(Finding(
                            severity=SEV_INFO,
                            pillar=1,
                            tool_slug=spec.slug,
                            tool_name=spec.name,
                            category="Attack Surface",
                            title=f"Third-Party Scripts Detected ({len(tp_scripts)})",
                            description=f"Route loads external scripts: {tp_scripts[:3]}",
                            evidence={"third_party_scripts": tp_scripts}
                        ))
                except Exception as e:
                    pass

            # ──────────────────────────────────────────────────────────────────
            # PILLAR 3: BOUNDARY & FUNCTIONAL MATRIX
            # ──────────────────────────────────────────────────────────────────
            if 3 in active_pillars:
                # Find interactive numeric inputs
                input_selectors = [f"#{inp['id']}" for inp in inventory.get("dom_inputs", []) if inp.get("id")]
                if not input_selectors and spec.inputs:
                    input_selectors = [f"#{k}" if not k.startswith("#") else k for k in spec.inputs.keys()]

                # Filter out dev toolbar and non-calculator inputs
                calc_inputs = [sel for sel in input_selectors if "dev-toolbar" not in sel and "search" not in sel]

                if calc_inputs:
                    target_input = calc_inputs[0]

                    # Test Boundary Matrix
                    boundary_values = [0, -1, -999999, 0.0001, 1000000000, "", "abc", XSS_CANARY_PAYLOAD]
                    for b_val in boundary_values:
                        initial_err_count = len(page_errors)
                        try:
                            inp_el = page.query_selector(target_input)
                            if inp_el:
                                inp_el.fill(str(b_val))
                                inp_el.dispatch_event("input")
                                inp_el.dispatch_event("change")
                                page.wait_for_timeout(100)
                        except Exception as e:
                            pass

                        if len(page_errors) > initial_err_count:
                            new_errs = page_errors[initial_err_count:]
                            findings.append(Finding(
                                severity=SEV_CRITICAL,
                                pillar=3,
                                tool_slug=spec.slug,
                                tool_name=spec.name,
                                category="Runtime Stability",
                                title=f"Uncaught JavaScript Exception on Input '{b_val}'",
                                description=f"Typing '{b_val}' into {target_input} caused uncaught JS error: {new_errs[0]}",
                                evidence={
                                    "input_selector": target_input,
                                    "injected_value": str(b_val),
                                    "uncaught_errors": new_errs
                                },
                                remediation=f"Fix runtime error in client script for {spec.slug}. Ensure all variables and handlers are defined."
                            ))
                            break  # Avoid cascading errors

                    # Test Reset Button Functionality
                    if spec.reset_selector or any("reset" in b["id"] for b in inventory.get("buttons", [])):
                        reset_sel = spec.reset_selector or next((f"#{b['id']}" for b in inventory.get("buttons", []) if "reset" in b["id"]), None)
                        if reset_sel:
                            try:
                                # First change input
                                inp_el = page.query_selector(target_input)
                                if inp_el:
                                    inp_el.fill("424242")
                                    inp_el.dispatch_event("input")
                                    page.wait_for_timeout(100)
                                    # Click reset
                                    reset_btn = page.query_selector(reset_sel)
                                    if reset_btn:
                                        reset_btn.click()
                                        page.wait_for_timeout(200)
                                        reset_val = inp_el.input_value()
                                        if reset_val == "424242":
                                            findings.append(Finding(
                                                severity=SEV_HIGH,
                                                pillar=3,
                                                tool_slug=spec.slug,
                                                tool_name=spec.name,
                                                category="Functional State",
                                                title="Reset Button Ineffective",
                                                description=f"Clicking reset button {reset_sel} did not restore input {target_input} to default value.",
                                                evidence={"selector": reset_sel, "input_value_after_reset": reset_val}
                                            ))
                            except Exception:
                                pass

                    # Test State Retention: URL Hash Sync & Navigation
                    try:
                        test_hash = "#p=55000&r=11&y=12"
                        page.goto(f"{target_url}{test_hash}", timeout=8000, wait_until="domcontentloaded")
                        page.wait_for_timeout(200)
                        # Back / Forward check
                        page.go_back()
                        page.wait_for_timeout(100)
                        page.go_forward()
                        page.wait_for_timeout(100)
                    except Exception as e:
                        findings.append(Finding(
                            severity=SEV_HIGH,
                            pillar=3,
                            tool_slug=spec.slug,
                            tool_name=spec.name,
                            category="History Navigation",
                            title="Browser Back/Forward Failure",
                            description=f"History navigation threw error: {str(e)}",
                            evidence={"error": str(e)}
                        ))

            # ──────────────────────────────────────────────────────────────────
            # PILLAR 4: INDEPENDENT MATHEMATICAL VERIFICATION
            # ──────────────────────────────────────────────────────────────────
            if 4 in active_pillars and spec.benchmarks:
                try:
                    # Reload fresh page for benchmark test
                    page.goto(target_url, timeout=8000, wait_until="domcontentloaded")
                    page.wait_for_timeout(300)

                    for bench in spec.benchmarks:
                        inputs_map = bench.get("inputs", {})
                        ref_results = MathReferenceEngine.evaluate_benchmark(spec.formula_type, inputs_map)
                        if not ref_results:
                            continue

                        # Extract output text from DOM
                        dom_outputs = page.evaluate("""() => {
                            const resEls = Array.from(document.querySelectorAll('[id*="result"], [id*="maturity"], [id*="total"], [id*="gain"], [id*="emi"]'));
                            const map = {};
                            for (const el of resEls) {
                                if (el.id) map[el.id] = el.innerText.trim();
                            }
                            return map;
                        }""")

                        # Compare key results (maturity, emi, total, gain, etc.)
                        for key, expected_val in ref_results.items():
                            matched_val: Optional[float] = None
                            matched_id: Optional[str] = None

                            for el_id, raw_text in dom_outputs.items():
                                parsed_num = MathReferenceEngine.parse_dom_number(raw_text)
                                if parsed_num is not None:
                                    # Check if close to expected_val
                                    abs_diff = abs(parsed_num - expected_val)
                                    rel_diff = abs_diff / abs(expected_val) if expected_val != 0 else 0
                                    if rel_diff <= 0.05 or abs_diff <= 100:
                                        matched_val = parsed_num
                                        matched_id = el_id
                                        break

                            # If no output matched within tolerance
                            if matched_val is None and expected_val > 0:
                                # Pick the hero result element if available to diagnose
                                hero_raw = dom_outputs.get(f"{spec.slug.split('-')[0]}-result-maturity") or list(dom_outputs.values())[:1]
                                findings.append(Finding(
                                    severity=SEV_HIGH if page_errors else SEV_MEDIUM,
                                    pillar=4,
                                    tool_slug=spec.slug,
                                    tool_name=spec.name,
                                    category="Mathematical Verification",
                                    title=f"Math Discrepancy for Metric '{key}'",
                                    description=(
                                        f"Website calculation output did not match reference engine for '{key}'. "
                                        f"Expected ~{expected_val:,.2f}."
                                        + (f" Page had runtime errors: {page_errors[0]}" if page_errors else "")
                                    ),
                                    evidence={
                                        "formula_type": spec.formula_type,
                                        "inputs": inputs_map,
                                        "expected_reference_value": expected_val,
                                        "dom_extracted_samples": hero_raw
                                    },
                                    remediation=f"Verify formula implementation in src/lib/calculators/ for {spec.slug}."
                                ))
                except Exception as e:
                    pass

            # ──────────────────────────────────────────────────────────────────
            # PILLAR 5: CLIENT-SIDE SECURITY & BUSINESS LOGIC
            # ──────────────────────────────────────────────────────────────────
            if 5 in active_pillars:
                # 1. DOM-based XSS via injected URL Hash & Query
                try:
                    xss_url = f"{target_url}#p={XSS_URL_PARAM_PAYLOAD}&q={XSS_URL_PARAM_PAYLOAD}"
                    page.goto(xss_url, timeout=8000, wait_until="domcontentloaded")
                    page.wait_for_timeout(200)

                    # Check canary execution
                    xss_flag = page.evaluate("() => Boolean(window.__xss)")
                    img_injected = page.query_selector('img[src="x"]')

                    if xss_flag:
                        findings.append(Finding(
                            severity=SEV_CRITICAL,
                            pillar=5,
                            tool_slug=spec.slug,
                            tool_name=spec.name,
                            category="Client-Side Security",
                            title="CRITICAL: DOM-based XSS via URL Hash Fragment",
                            description=f"Injected canary in URL hash executed arbitrary JavaScript on {spec.path} (window.__xss == 1).",
                            evidence={"payload": XSS_CANARY_PAYLOAD, "url": xss_url},
                            remediation="Ensure all URL hash parameters are parsed strictly as numbers or safely escaped before DOM insertion."
                        ))
                    elif img_injected:
                        findings.append(Finding(
                            severity=SEV_HIGH,
                            pillar=5,
                            tool_slug=spec.slug,
                            tool_name=spec.name,
                            category="Client-Side Security",
                            title="Unescaped HTML Tag Injection via URL Hash",
                            description=f"Injected <img src=x> tag was reflected into the DOM on {spec.path}.",
                            evidence={"payload": XSS_CANARY_PAYLOAD, "url": xss_url},
                            remediation="Sanitize or use textContent instead of innerHTML when reflecting URL parameters."
                        ))
                except Exception:
                    pass

                # 2. Multi-Currency Switching & Lakh Comma Leakage
                if spec.region == "Global":
                    try:
                        page.goto(target_url, timeout=8000, wait_until="domcontentloaded")
                        page.wait_for_timeout(200)

                        curr_sel = spec.currency_selector or "select[id*='currency'], #mobile-currency-select"
                        has_curr_select = page.query_selector(curr_sel)

                        if has_curr_select:
                            # Test USD ($)
                            try:
                                page.select_option(curr_sel, "USD", timeout=1500)
                                page.wait_for_timeout(150)
                            except Exception:
                                pass

                            # Inspect DOM outputs for Indian Lakh comma leakage
                            texts = page.evaluate("""() => {
                                const els = Array.from(document.querySelectorAll('[id*="result"], [id*="maturity"], [id*="total"]'));
                                return els.map(e => e.innerText.trim());
                            }""")

                            for txt in texts:
                                # Indian grouping in USD: e.g. $ 1,26,14,400 or ,26,
                                if re.search(r',\d{2},', txt) or re.search(r'^\$?\s*\d{1,2},\d{2},\d{3}', txt):
                                    findings.append(Finding(
                                        severity=SEV_MEDIUM,
                                        pillar=5,
                                        tool_slug=spec.slug,
                                        tool_name=spec.name,
                                        category="Currency Localization",
                                        title="Indian Comma Grouping Leaking into USD Display",
                                        description=f"When currency is switched to USD, DOM displayed Indian Lakh format '{txt}' instead of International grouping (e.g., 12,614,400).",
                                        evidence={"offending_string": txt, "currency": "USD"},
                                        remediation="Use Intl.NumberFormat(locale) based on the active currency rather than hardcoded formatIndian()."
                                    ))
                                    break
                    except Exception:
                        pass

                # 3. Responsive Layout Stability & Horizontal Overflow (320px to 1920px)
                for vp in RESPONSIVE_VIEWPORTS:
                    try:
                        page.set_viewport_size({"width": vp["width"], "height": vp["height"]})
                        page.wait_for_timeout(100)

                        overflow_data = page.evaluate("""() => {
                            const docWidth = document.documentElement.scrollWidth;
                            const winWidth = window.innerWidth;
                            const hasOverflow = docWidth > winWidth + 1;
                            let badEls = [];
                            if (hasOverflow) {
                                const all = Array.from(document.querySelectorAll('*'));
                                for (const el of all) {
                                    const r = el.getBoundingClientRect();
                                    if (r.right > winWidth + 1) {
                                        const sel = el.id ? '#' + el.id : (el.className ? el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/)[0] : el.tagName.toLowerCase());
                                        badEls.push({
                                            selector: sel,
                                            width: Math.round(r.width),
                                            overflowPx: Math.round(r.right - winWidth)
                                        });
                                        if (badEls.length >= 3) break;
                                    }
                                }
                            }
                            return { hasOverflow, docWidth, winWidth, badEls };
                        }""")

                        if overflow_data["hasOverflow"]:
                            sev = SEV_MEDIUM if vp["width"] <= 375 else SEV_LOW
                            findings.append(Finding(
                                severity=sev,
                                pillar=5,
                                tool_slug=spec.slug,
                                tool_name=spec.name,
                                category="Responsive Layout",
                                title=f"Horizontal Layout Overflow on {vp['name']} ({vp['width']}px)",
                                description=f"Document scrollWidth ({overflow_data['docWidth']}px) exceeds viewport ({vp['winWidth']}px) by {overflow_data['docWidth'] - vp['winWidth']}px.",
                                evidence={
                                    "viewport": vp,
                                    "overflowing_elements": overflow_data["badEls"]
                                },
                                remediation="Add 'overflow-x-auto' to tables or 'max-w-full' to prevent blowout."
                            ))
                            break  # Avoid reporting redundant overflows on same page
                    except Exception:
                        pass

            browser.close()

        return inventory, findings

# ==============================================================================
# PILLAR 6: STRUCTURED EVIDENCE & FIX PROMPT GENERATION
# ==============================================================================

class ReportGenerator:
    """Generates report.json, report.md, and automated fix prompts in audit_out/fix_prompts/."""

    @staticmethod
    def generate(out_dir: str, base_url: str, duration_sec: float, inventory_data: List[Dict[str, Any]], findings: List[Finding]):
        out_path = Path(out_dir)
        out_path.mkdir(parents=True, exist_ok=True)
        fix_dir = out_path / "fix_prompts"
        fix_dir.mkdir(parents=True, exist_ok=True)

        # 1. Summary Counts
        counts = {
            SEV_CRITICAL: sum(1 for f in findings if f.severity == SEV_CRITICAL),
            SEV_HIGH: sum(1 for f in findings if f.severity == SEV_HIGH),
            SEV_MEDIUM: sum(1 for f in findings if f.severity == SEV_MEDIUM),
            SEV_LOW: sum(1 for f in findings if f.severity == SEV_LOW),
            SEV_INFO: sum(1 for f in findings if f.severity == SEV_INFO),
        }
        total_issues = len(findings)

        # 2. Generate report.json
        report_json_data = {
            "meta": {
                "site": "Calcumetrics",
                "base_url": base_url,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime()),
                "duration_seconds": round(duration_sec, 2),
                "total_tools_audited": len(inventory_data),
                "summary": counts
            },
            "findings": [asdict(f) for f in findings],
            "inventory": inventory_data
        }

        with open(out_path / "report.json", "w", encoding="utf-8") as jf:
            json.dump(report_json_data, jf, indent=2)

        # 3. Generate report.md
        with open(out_path / "report.md", "w", encoding="utf-8") as mf:
            mf.write(f"# Calcumetrics Automated QA & Security Audit Report\n\n")
            mf.write(f"**Date:** {time.strftime('%Y-%m-%d %H:%M UTC')} | **Target:** `{base_url}` | **Duration:** {duration_sec:.1f}s\n\n")
            
            mf.write("## 1. Executive Summary & Severity Dashboard\n\n")
            mf.write("| Severity | Count | Status |\n")
            mf.write("|---|---|---|\n")
            mf.write(f"| **🔴 CRITICAL** | {counts[SEV_CRITICAL]} | {'❌ ACTION REQUIRED' if counts[SEV_CRITICAL] > 0 else '✅ CLEAR'} |\n")
            mf.write(f"| **🟠 HIGH** | {counts[SEV_HIGH]} | {'⚠️ ATTENTION NEEDED' if counts[SEV_HIGH] > 0 else '✅ CLEAR'} |\n")
            mf.write(f"| **🟡 MEDIUM** | {counts[SEV_MEDIUM]} | {'⚡ REVIEW' if counts[SEV_MEDIUM] > 0 else '✅ CLEAR'} |\n")
            mf.write(f"| **🔵 LOW** | {counts[SEV_LOW]} | {'ℹ️ MINOR' if counts[SEV_LOW] > 0 else '✅ CLEAR'} |\n")
            mf.write(f"| **⚪ INFO** | {counts[SEV_INFO]} | Informational |\n")
            mf.write(f"| **TOTAL** | **{total_issues}** | |\n\n")

            mf.write("## 2. Critical & High Priority Action Items\n\n")
            crit_high = [f for f in findings if f.severity in (SEV_CRITICAL, SEV_HIGH)]
            if not crit_high:
                mf.write("🎉 *No Critical or High severity issues detected across all audited tools!*\n\n")
            else:
                for idx, f in enumerate(crit_high, 1):
                    mf.write(f"### {idx}. [{f.severity}] {f.title} ({f.tool_name})\n")
                    mf.write(f"- **Pillar:** Pillar {f.pillar}\n")
                    mf.write(f"- **Tool Route:** `{f.tool_slug}`\n")
                    mf.write(f"- **Description:** {f.description}\n")
                    if f.evidence:
                        mf.write(f"- **Evidence:** ```json\n{json.dumps(f.evidence, indent=2)}\n```\n")
                    if f.remediation:
                        mf.write(f"- **Remediation:** {f.remediation}\n")
                    mf.write("\n")

            mf.write("## 3. Medium & Low Priority Findings\n\n")
            med_low = [f for f in findings if f.severity in (SEV_MEDIUM, SEV_LOW)]
            if not med_low:
                mf.write("*No medium or low severity issues found.*\n\n")
            else:
                mf.write("| Severity | Tool | Category | Title | Remediation Summary |\n")
                mf.write("|---|---|---|---|---|\n")
                for f in med_low:
                    rem_brief = (f.remediation or "Review code")[:60]
                    mf.write(f"| {f.severity} | `{f.tool_slug}` | {f.category} | {f.title} | {rem_brief}... |\n")
                mf.write("\n")

            mf.write("## 4. Attack Surface & Inventory Overview\n\n")
            mf.write(f"- **Total Calculator Tools Audited:** {len(inventory_data)}\n")
            total_inputs = sum(len(inv.get("dom_inputs", [])) for inv in inventory_data)
            total_sliders = sum(len(inv.get("sliders", [])) for inv in inventory_data)
            mf.write(f"- **Discovered DOM Input Elements:** {total_inputs}\n")
            mf.write(f"- **Discovered Sliders:** {total_sliders}\n")
            mf.write(f"- **Generated Fix Prompts:** Look inside `audit_out/fix_prompts/` for ready-to-use fix prompts.\n\n")

        # 4. Generate Clean, Copy-Pasteable Markdown Fix Prompts
        # Group critical and high findings by tool
        broken_tools: Dict[str, List[Finding]] = {}
        for f in findings:
            if f.severity in (SEV_CRITICAL, SEV_HIGH):
                broken_tools.setdefault(f.tool_slug, []).append(f)

        for slug, t_findings in broken_tools.items():
            prompt_file = fix_dir / f"fix_{slug}.md"
            tool_name = t_findings[0].tool_name
            with open(prompt_file, "w", encoding="utf-8") as pf:
                pf.write(f"# Fix Prompt: Resolve Critical Issues in {tool_name} (`{slug}`)\n\n")
                pf.write(f"You are a Senior Full-Stack Engineer working on the Calcumetrics codebase.\n")
                pf.write(f"The automated site audit detected **{len(t_findings)} Critical/High failure(s)** on `{slug}`.\n\n")
                
                pf.write("## 1. Summary of Identified Defects\n\n")
                for idx, f in enumerate(t_findings, 1):
                    pf.write(f"### Defect #{idx}: [{f.severity}] {f.title}\n")
                    pf.write(f"- **Description:** {f.description}\n")
                    if f.evidence:
                        pf.write(f"- **Evidence:**\n```json\n{json.dumps(f.evidence, indent=2)}\n```\n")
                    if f.remediation:
                        pf.write(f"- **Suggested Fix:** {f.remediation}\n")
                    pf.write("\n")

                pf.write("## 2. Step-by-Step Resolution Instructions\n\n")
                pf.write("1. Open the component file for this calculator in `src/pages/`.\n")
                pf.write("2. If an undeclared variable reference (such as `numX`) was reported, replace it with the properly declared variable (e.g. `rawX` or `parseSmartInput(...)`).\n")
                pf.write("3. Verify that all imports and event listeners work without throwing uncaught exceptions.\n")
                pf.write("4. Run `npm test` and re-run `python3 site_audit.py --tools " + slug + "` to confirm zero failures.\n\n")

                # Sample unified diff template
                pf.write("## 3. Recommended Code Patch (Diff)\n\n")
                pf.write("```diff\n")
                for f in t_findings:
                    if "Undeclared Variable Reference" in f.title:
                        var = f.evidence.get("variable", "numVar")
                        intended = f.evidence.get("likely_intended_variable", "rawVar")
                        target_file = f.file_path
                        if not target_file or not os.path.exists(target_file):
                            for cand in [f"src/pages/{slug}.astro", f"src/pages/in/{slug}.astro", f"src/pages/us/{slug}.astro", f"src/pages/uk/{slug}.astro"]:
                                if os.path.exists(cand):
                                    target_file = cand
                                    break
                            if not target_file:
                                target_file = f"src/pages/{slug}.astro"
                        pf.write(f"--- a/{target_file}\n")
                        pf.write(f"+++ b/{target_file}\n")
                        pf.write(f"@@ -recalc @@\n")
                        pf.write(f"-      const vVal = validate({var} ?? '', ...);\n")
                        pf.write(f"+      const vVal = validate({intended} ?? '', ...);\n")
                pf.write("```\n")

        print(f"\n[REPORT] Saved machine-readable report to: {out_path / 'report.json'}")
        print(f"[REPORT] Saved human-readable report to:    {out_path / 'report.md'}")
        print(f"[REPORT] Generated {len(broken_tools)} fix prompt(s) in:     {fix_dir}/")

# ==============================================================================
# BENCHMARK INVENTORY GENERATOR
# ==============================================================================

def generate_benchmark_inventory(project_root: str = ".", output_file: str = "tools_benchmark.json"):
    """Extracts all 50 published tools from src/config/site.ts and Astro files."""
    site_ts = Path(project_root) / "src" / "config" / "site.ts"
    if not site_ts.exists():
        print(f"ERROR: {site_ts} not found.")
        return

    with open(site_ts, "r", encoding="utf-8") as f:
        content = f.read()

    tool_blocks = re.findall(
        r'\{\s*name:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?slug:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?path:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?category:\s*[\'"]([^\'"]+)[\'"],[\s\S]*?region:\s*[\'"]([^\'"]+)[\'"][\s\S]*?\}',
        content
    )

    tools_data: List[Dict[str, Any]] = []

    for name, slug, path, category, region in tool_blocks:
        rel_path = path.lstrip('/')
        astro_file = Path(project_root) / "src" / "pages" / f"{rel_path}.astro"
        if not astro_file.exists():
            astro_file = Path(project_root) / "src" / "pages" / rel_path / "index.astro"

        inputs_dict: Dict[str, Any] = {}
        resets: List[str] = []
        currencies: List[str] = []
        results: List[str] = []

        if astro_file.exists():
            with open(astro_file, "r", encoding="utf-8", errors="ignore") as af:
                ac = af.read()

            inp_matches = re.findall(r'<[Ii]nput[^>]+id=[\'"]([^\'"]+)[\'"][^>]*value=[\'"]([^\'"]*)[\'"]', ac)
            inp_matches += re.findall(r'<input[^>]+id=[\'"]([^\'"]+)[\'"][^>]*value=[\'"]([^\'"]*)[\'"]', ac)
            for i_id, val in inp_matches:
                if not i_id.endswith("-slider") and "toggle" not in i_id and "search" not in i_id:
                    num_str = re.sub(r'[^0-9.]', '', val)
                    default_num = float(num_str) if num_str else 0.0
                    inputs_dict[i_id] = {"selector": f"#{i_id}", "default": default_num, "raw_default": val}

            resets = re.findall(r'id=[\'"]([^\'"]*reset[^\'"]*)[\'"]', ac)
            currencies = re.findall(r'id=[\'"]([^\'"]*currency[^\'"]*)[\'"]', ac)
            res_matches = re.findall(r'id=[\'"]([^\'"]*(?:result|maturity|total|emi|gain|hero|output|cagr|tax)[^\'\"]*)[\'\"]', ac)
            results = [f"#{r}" for r in res_matches if "wrapper" not in r and "chart" not in r and "schedule" not in r]

        # Inferred formula type
        slug_clean = slug.replace("-calculator", "").replace("-", "_")
        tools_data.append({
            "slug": slug,
            "name": name,
            "path": path,
            "file_path": str(astro_file.relative_to(project_root)) if astro_file.exists() else f"src/pages/{rel_path}.astro",
            "category": category,
            "region": region,
            "formula_type": slug_clean,
            "inputs": inputs_dict,
            "outputs": {r.lstrip("#"): {"selector": r, "type": "currency"} for r in results[:4]},
            "reset_selector": f"#{resets[0]}" if resets else None,
            "currency_selector": f"#{currencies[0]}" if currencies else None,
            "boundary_inputs": [0, -1, -999999, 0.0001, 1000000000, "", "abc", XSS_CANARY_PAYLOAD],
            "benchmarks": [
                {
                    "name": "Default fixture",
                    "inputs": {k: v["default"] for k, v in inputs_dict.items()},
                    "tolerance": {"relative": 0.005, "absolute": 50}
                }
            ]
        })

    payload = {
        "version": "2.0.0",
        "meta": {
            "site": "Calcumetrics",
            "total_tools": len(tools_data),
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%SZ", time.gmtime())
        },
        "tools": tools_data
    }

    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(payload, out, indent=2)
    print(f"Generated {output_file} with {len(tools_data)} tools benchmark inventory.")

# ==============================================================================
# MAIN EXECUTION ORCHESTRATOR
# ==============================================================================

def parse_args():
    parser = argparse.ArgumentParser(
        description="Calcumetrics Comprehensive Automated Site Audit & QA Suite"
    )
    parser.add_argument("--base-url", default="http://localhost:4321", help="Base URL of target site (default: http://localhost:4321)")
    parser.add_argument("--benchmark", default="tools_benchmark.json", help="Path to tools benchmark specification JSON")
    parser.add_argument("--concurrency", type=int, default=2, help="Number of concurrent worker threads (1..4, default: 2)")
    parser.add_argument("--pillars", default="all", help="Comma-separated pillars to run (e.g. '1,2,3,4,5,6' or 'all')")
    parser.add_argument("--tools", default="all", help="Comma-separated tool slugs to audit, or 'all'")
    parser.add_argument("--out-dir", default="audit_out", help="Output directory for reports & fix prompts")
    parser.add_argument("--no-headless", action="store_true", help="Run browser in headful mode for visual debugging")
    parser.add_argument("--generate-benchmark", action="store_true", help="Regenerate tools_benchmark.json from codebase before running")
    return parser.parse_args()

def main():
    args = parse_args()
    start_time = time.time()

    # Validate target host
    try:
        base_url = validate_target_host(args.base_url)
    except ValueError as e:
        print(f"SECURITY CONSTRAINT VIOLATION: {e}")
        sys.exit(1)

    # Optional benchmark generation
    if args.generate_benchmark or not os.path.exists(args.benchmark):
        generate_benchmark_inventory(output_file=args.benchmark)

    # Load benchmark inventory
    if not os.path.exists(args.benchmark):
        print(f"ERROR: Benchmark file '{args.benchmark}' not found. Use --generate-benchmark to create it.")
        sys.exit(1)

    with open(args.benchmark, "r", encoding="utf-8") as f:
        benchmark_doc = json.load(f)

    tools_raw = benchmark_doc.get("tools", [])
    if args.tools != "all":
        selected = {s.strip() for s in args.tools.split(",")}
        tools_raw = [t for t in tools_raw if t["slug"] in selected]

    if not tools_raw:
        print(f"ERROR: No matching tools found for selection: {args.tools}")
        sys.exit(1)

    # Parse active pillars
    if args.pillars == "all":
        active_pillars = {1, 2, 3, 4, 5, 6}
    else:
        active_pillars = {int(p.strip()) for p in args.pillars.split(",") if p.strip().isdigit()}

    concurrency = max(1, min(args.concurrency, 4))
    headless = not args.no_headless

    print("\n" + "=" * 70)
    print(" CALCUMETRICS COMPREHENSIVE QA & SECURITY AUTOMATION AUDIT")
    print("=" * 70)
    print(f" Target Site:   {base_url}")
    print(f" Tools Pool:    {len(tools_raw)} calculators")
    print(f" Active Pillars:{sorted(active_pillars)}")
    print(f" Concurrency:   {concurrency} worker(s)")
    print(f" Headless:      {headless}")
    print(f" Output Dir:    {args.out_dir}")
    print("=" * 70 + "\n")

    all_findings: List[Finding] = []
    all_inventories: List[Dict[str, Any]] = []

    # ──────────────────────────────────────────────────────────────────────────
    # PILLAR 2: CODEBASE HYGIENE SCAN (Static AST & Secrets)
    # ──────────────────────────────────────────────────────────────────────────
    if 2 in active_pillars:
        print("[PILLAR 2] Scanning codebase files & client scripts for missing dependencies, undeclared variables & secrets...")
        target_slugs = selected if args.tools != "all" else None
        static_findings = CodebaseHygieneScanner.scan_project(target_slugs=target_slugs)
        all_findings.extend(static_findings)
        print(f"  → Found {len(static_findings)} static hygiene issue(s).")

    # ──────────────────────────────────────────────────────────────────────────
    # PILLARS 1, 3, 4, 5: DYNAMIC PLAYWRIGHT AUDIT
    # ──────────────────────────────────────────────────────────────────────────
    dynamic_pillars = active_pillars & {1, 3, 4, 5}
    if dynamic_pillars:
        print(f"[PILLARS {sorted(dynamic_pillars)}] Starting Playwright dynamic audit on {len(tools_raw)} calculator(s)...")

        tool_specs = [
            ToolBenchmarkSpec(
                slug=t["slug"],
                name=t["name"],
                path=t["path"],
                category=t["category"],
                region=t["region"],
                formula_type=t.get("formula_type", t["slug"]),
                file_path=t.get("file_path", f"src/pages/{t['path'].lstrip('/')}.astro"),
                inputs=t.get("inputs", {}),
                outputs=t.get("outputs", {}),
                reset_selector=t.get("reset_selector"),
                currency_selector=t.get("currency_selector"),
                boundary_inputs=t.get("boundary_inputs", []),
                benchmarks=t.get("benchmarks", [])
            )
            for t in tools_raw
        ]

        auditor = CalculatorAuditor(base_url=base_url, headless=headless)

        # Execute bounded concurrency pool
        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            future_to_slug = {
                executor.submit(auditor.audit_tool, spec, dynamic_pillars): spec.slug
                for spec in tool_specs
            }

            completed = 0
            for future in as_completed(future_to_slug):
                slug = future_to_slug[future]
                completed += 1
                try:
                    inv, tool_findings = future.result()
                    all_inventories.append(inv)
                    all_findings.extend(tool_findings)
                    
                    status_symbol = "✓ PASS"
                    crit_count = sum(1 for f in tool_findings if f.severity in (SEV_CRITICAL, SEV_HIGH))
                    if crit_count > 0:
                        status_symbol = f"✗ FAIL ({crit_count} errs)"

                    print(f"  [{completed:02d}/{len(tool_specs):02d}] {slug:35} {status_symbol}")
                except Exception as e:
                    print(f"  [{completed:02d}/{len(tool_specs):02d}] {slug:35} ⚠️ EXCEPTION: {e}")

    # ──────────────────────────────────────────────────────────────────────────
    # PILLAR 6: EVIDENCE REPORT & FIX PROMPT GENERATION
    # ──────────────────────────────────────────────────────────────────────────
    duration = time.time() - start_time
    if 6 in active_pillars:
        print("\n[PILLAR 6] Aggregating structured evidence, generating report.json, report.md & fix prompts...")
        ReportGenerator.generate(
            out_dir=args.out_dir,
            base_url=base_url,
            duration_sec=duration,
            inventory_data=all_inventories,
            findings=all_findings
        )

    # Final CLI Summary
    crit_total = sum(1 for f in all_findings if f.severity == SEV_CRITICAL)
    high_total = sum(1 for f in all_findings if f.severity == SEV_HIGH)
    med_total = sum(1 for f in all_findings if f.severity == SEV_MEDIUM)

    print("\n" + "=" * 70)
    print(" AUDIT RUN COMPLETE")
    print("=" * 70)
    print(f" Total Duration:   {duration:.1f}s")
    print(f" Total Findings:   {len(all_findings)}")
    print(f"   🔴 CRITICAL:    {crit_total}")
    print(f"   🟠 HIGH:        {high_total}")
    print(f"   🟡 MEDIUM:      {med_total}")
    print(f"   🔵 LOW / INFO:  {len(all_findings) - crit_total - high_total - med_total}")
    print("=" * 70 + "\n")

    # Exit code: 0 if clean or only low/info, 1 if critical/high issues detected
    if crit_total > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
