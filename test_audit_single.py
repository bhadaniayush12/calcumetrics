import urllib.request
import ssl
import json
import re
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://www.groww.in/calculators/sip-calculator"
req = urllib.request.Request(
    url,
    headers={
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
)

with urllib.request.urlopen(req, timeout=12, context=ctx) as response:
    html = response.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
title = soup.title.string.strip() if soup.title else ""
meta_desc = ""
desc_tag = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
if desc_tag:
    meta_desc = desc_tag.get('content', '')

canonical = ""
canon_tag = soup.find('link', rel='canonical')
if canon_tag:
    canonical = canon_tag.get('href', '')

h1 = [h.get_text(strip=True) for h in soup.find_all('h1')]
h2 = [h.get_text(strip=True) for h in soup.find_all('h2')]

# Schemas
schemas = []
for s in soup.find_all('script', type='application/ld+json'):
    try:
        data = json.loads(s.string)
        if isinstance(data, list):
            for item in data:
                schemas.append(item.get('@type'))
        elif isinstance(data, dict):
            schemas.append(data.get('@type'))
    except Exception:
        pass

# Text word count
text = soup.get_text(separator=' ', strip=True)
words = len(text.split())

# Check features
has_chart = bool(soup.find_all(['svg', 'canvas']))
has_table = bool(soup.find_all('table'))

print("Competitor:", url)
print("Title:", title)
print("Meta Desc:", meta_desc[:120] + "...")
print("Canonical:", canonical)
print("H1:", h1)
print("H2 count:", len(h2), "H2s:", h2[:5])
print("Schemas:", schemas)
print("Word count:", words)
print("Has Chart:", has_chart, "Has Table:", has_table)
