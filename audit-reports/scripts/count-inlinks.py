"""Count dofollow internal inlinks per indexable page in dist/.
Usage: python3 -I audit-reports/scripts/count-inlinks.py dist <out.json>"""
import sys, os, re, json
from html.parser import HTMLParser
from urllib.parse import urlparse

DIST, OUT = sys.argv[1], sys.argv[2]
HOSTS = {'calcumetrics.com', 'www.calcumetrics.com', ''}

def norm(href, base):
    if not href or href.startswith(('mailto:', 'tel:', 'javascript:', '#', 'data:')):
        return None
    u = urlparse(href)
    if u.scheme and u.scheme not in ('http', 'https'):
        return None
    if u.netloc not in HOSTS:
        return None
    path = u.path
    if not path.startswith('/'):
        path = os.path.normpath(os.path.join(os.path.dirname(base), path))
    path = re.sub(r'\.html$', '', path)
    path = re.sub(r'/index$', '/', path)
    if len(path) > 1:
        path = path.rstrip('/')
    return path or '/'

class P(HTMLParser):
    CHROME = {'header', 'nav', 'footer'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # chrome depth tracking
        self.chrome = 0
        self.links = []  # (href, rel, in_chrome)
        self.robots = ''
        self.canonical = None
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag in self.CHROME:
            # Breadcrumb trails are in-content navigation, so they count as contextual.
            is_crumb = tag == 'nav' and (a.get('aria-label') or '').lower() == 'breadcrumb'
            self.stack.append((tag, not is_crumb))
            if not is_crumb:
                self.chrome += 1
        if tag == 'meta' and (a.get('name') or '').lower() == 'robots':
            self.robots = (a.get('content') or '').lower()
        if tag == 'link' and (a.get('rel') or '').lower() == 'canonical':
            self.canonical = a.get('href')
        if tag == 'a' and a.get('href'):
            self.links.append((a['href'], (a.get('rel') or '').lower(), self.chrome > 0))
    def handle_endtag(self, tag):
        if tag in self.CHROME and self.stack and self.stack[-1][0] == tag:
            _, counted = self.stack.pop()
            if counted:
                self.chrome -= 1

pages = {}
for root, _, files in os.walk(DIST):
    for f in files:
        if not f.endswith('.html'):
            continue
        fp = os.path.join(root, f)
        rel = '/' + os.path.relpath(fp, DIST)
        url = norm(rel, '/')
        if url.startswith('/embed') or url in ('/404', '/500'):
            pass
        p = P(); p.feed(open(fp, encoding='utf-8').read())
        pages[url] = p

indexable = {u for u, p in pages.items() if 'noindex' not in p.robots and u not in ('/404', '/500')}
inl_all = {u: set() for u in indexable}
inl_ctx = {u: set() for u in indexable}
for src, p in pages.items():
    if src not in indexable:
        continue  # links from noindex pages still pass little; count only indexable sources
    for href, rel, chrome in p.links:
        if 'nofollow' in rel:
            continue
        t = norm(href, src + '.html')
        if t is None or t == src or t not in inl_all:
            continue
        inl_all[t].add(src)
        if not chrome:
            inl_ctx[t].add(src)
res = {u: {'all': len(inl_all[u]), 'contextual': len(inl_ctx[u]), 'ctx_sources': sorted(inl_ctx[u])} for u in sorted(indexable)}
json.dump(res, open(OUT, 'w'), indent=1)
low = [(u, r['all'], r['contextual']) for u, r in res.items() if r['contextual'] < 3]
print(f'indexable pages: {len(indexable)}; contextual<3: {len(low)}; all<3: {sum(1 for r in res.values() if r["all"]<3)}')
for u, a, c in sorted(low, key=lambda x: (x[2], x[0])):
    print(f'{c:3d} ctx {a:4d} all  {u}')
