import asyncio
import json
import time
import os
import re
from urllib.parse import urlparse
from playwright.async_api import async_playwright

BENCHMARK_FILE = "tools_benchmark.json"
RESULTS_FILE = "competitive_audit_results.json"

async def inspect_page(page, url, is_local=False):
    info = {
        "url": url,
        "title": "",
        "meta_desc": "",
        "canonical": "",
        "h1s": [],
        "h2s": [],
        "schemas": [],
        "word_count": 0,
        "inputs": [],
        "has_chart": False,
        "has_table": False,
        "has_presets": False,
        "has_share": False,
        "has_pdf_or_csv": False,
        "has_currency_toggle": False,
        "currency_symbols": [],
        "status": 0,
        "error": None
    }
    
    try:
        resp = await page.goto(url, wait_until="domcontentloaded", timeout=20000)
        await page.wait_for_timeout(1000)
        info["status"] = resp.status if resp else 200
        
        info["title"] = await page.title()
        
        meta_desc = await page.evaluate('''() => {
            const el = document.querySelector('meta[name="description"], meta[property="og:description"]');
            return el ? el.getAttribute('content') : '';
        }''')
        info["meta_desc"] = (meta_desc or "").strip()
        
        canonical = await page.evaluate('''() => {
            const el = document.querySelector('link[rel="canonical"]');
            return el ? el.getAttribute('href') : '';
        }''')
        info["canonical"] = (canonical or "").strip()
        
        info["h1s"] = await page.evaluate('''() => Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean)''')
        info["h2s"] = await page.evaluate('''() => Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()).filter(Boolean)''')
        
        # Schemas
        info["schemas"] = await page.evaluate('''() => {
            const types = [];
            document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
                try {
                    const data = JSON.parse(s.innerText);
                    const extract = (obj) => {
                        if (!obj) return;
                        if (Array.isArray(obj)) obj.forEach(extract);
                        else if (typeof obj === 'object') {
                            if (obj['@type']) types.push(obj['@type']);
                            if (obj['@graph']) extract(obj['@graph']);
                        }
                    };
                    extract(data);
                } catch(e) {}
            });
            return Array.from(new Set(types));
        }''')
        
        # Word count
        body_text = await page.evaluate('''() => document.body ? document.body.innerText : ""''')
        words = body_text.split()
        info["word_count"] = len(words)
        
        # Feature checks
        info["has_chart"] = await page.evaluate('''() => !!document.querySelector('svg:not([class*="icon"]), canvas, [class*="chart"], [id*="chart"], [class*="bar"]')''')
        info["has_table"] = await page.evaluate('''() => !!document.querySelector('table, [class*="schedule"], [class*="amortization"]')''')
        
        # Presets (buttons like +5k, 5Y, etc.)
        info["has_presets"] = await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.some(b => /\\+?\\d+k|\\+?\\d+L|\\+?\\d+yr|\\+?\\d+y|preset/i.test(b.innerText));
        }''')
        
        # Share button / URL state
        info["has_share"] = await page.evaluate('''() => {
            const text = document.body.innerText;
            return /share|copy link|embed/i.test(text) || !!document.querySelector('[id*="share"], [class*="share"], [id*="copy-link"]');
        }''')
        
        # PDF / CSV export
        info["has_pdf_or_csv"] = await page.evaluate('''() => {
            const text = document.body.innerText;
            return /download pdf|export csv|print schedule|print report/i.test(text) || !!document.querySelector('[id*="pdf"], [id*="csv"], [id*="print"]');
        }''')
        
        # Currency switch / symbols
        currency_info = await page.evaluate('''() => {
            const text = document.body.innerText;
            const hasToggle = !!document.querySelector('[data-currency-dropdown], select[id*="currency"], [class*="currency-select"], button[id*="currency"]');
            const syms = [];
            if (text.includes('$')) syms.push('$');
            if (text.includes('₹')) syms.push('₹');
            if (text.includes('€')) syms.push('€');
            if (text.includes('£')) syms.push('£');
            return { hasToggle, syms };
        }''')
        info["has_currency_toggle"] = currency_info["hasToggle"]
        info["currency_symbols"] = currency_info["syms"]
        
        # Inputs summary
        info["inputs"] = await page.evaluate('''() => {
            return Array.from(document.querySelectorAll('input:not([type="hidden"]), select')).map(el => {
                let lbl = "";
                if (el.id) {
                    const l = document.querySelector(`label[for="${el.id}"]`);
                    if (l) lbl = l.innerText.trim();
                }
                return {
                    type: el.type,
                    id: el.id,
                    name: el.name,
                    label: lbl,
                    min: el.min || "",
                    max: el.max || "",
                    val: el.value || ""
                };
            }).slice(0, 15);
        }''')
        
    except Exception as e:
        info["error"] = str(e)
        
    return info

async def main():
    with open(BENCHMARK_FILE) as f:
        data = json.load(f)
        
    tools = data.get("tools_benchmark", [])
    print(f"Loaded {len(tools)} tools from {BENCHMARK_FILE}")
    
    results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Create context with realistic UA
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        for i, tool in enumerate(tools):
            name = tool["tool_name"]
            your_url = tool["your_url"]
            comp_url = tool["competitor_url"]
            
            # Map your_url to local dev server
            parsed_your = urlparse(your_url)
            local_path = parsed_your.path
            if parsed_your.fragment:
                local_url = f"http://localhost:4321{local_path}#{parsed_your.fragment}"
            else:
                local_url = f"http://localhost:4321{local_path}"
                
            print(f"[{i+1}/{len(tools)}] Auditing: {name}...")
            print(f"   Local:      {local_url}")
            print(f"   Competitor: {comp_url}")
            
            # 1. Audit Local Calcumetrics
            local_data = await inspect_page(page, local_url, is_local=True)
            
            # 2. Audit Competitor (Polite delay)
            await asyncio.sleep(0.8)
            comp_data = await inspect_page(page, comp_url, is_local=False)
            
            # Determine market scope
            is_in_route = "/in/" in local_path or "/in/" in comp_url or ".in" in comp_url
            is_us_route = "/us/" in local_path or "us" in local_path
            
            tool_res = {
                "tool_name": name,
                "calcumetrics_url": your_url,
                "local_url": local_url,
                "competitor_url": comp_url,
                "market_scope": "India (Locked)" if is_in_route else ("US (Locked)" if is_us_route else "Global"),
                "calcumetrics": local_data,
                "competitor": comp_data
            }
            results.append(tool_res)
            
            # Print quick progress indicator
            c_title = (comp_data.get('title') or 'No Title')[:35]
            l_words = local_data.get('word_count', 0)
            c_words = comp_data.get('word_count', 0)
            print(f"   ✓ Done. Words: Calcumetrics={l_words} vs Comp={c_words} | CompTitle='{c_title}'")
            
        await browser.close()
        
    with open(RESULTS_FILE, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"\n=======================================================")
    print(f"AUDIT COMPLETE! Results saved to {RESULTS_FILE}")
    print(f"=======================================================")

if __name__ == "__main__":
    asyncio.run(main())
