from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, parse_qs
import re

ROOT = Path(__file__).resolve().parents[1]
errors = []

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.ids, self.refs, self.translations = path, set(), [], 0
        self.h1, self.main, self.title, self.labels, self.fields = 0, 0, 0, set(), []
        self.quote_links, self.navs = [], 0
        self.current_anchor = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'nav' and a.get('class') == 'primary-nav': self.navs += 1
        if tag == 'a': self.current_anchor = [a, '']
        if 'id' in a:
            if a['id'] in self.ids: errors.append(f'{self.path}: duplicate id {a["id"]}')
            self.ids.add(a['id'])
        if tag == 'h1': self.h1 += 1
        if tag == 'main': self.main += 1
        if tag == 'title': self.title += 1
        if tag == 'label': self.labels.add(a.get('for'))
        if tag in ('input', 'select', 'textarea'): self.fields.append(a.get('id'))
        if tag == 'img' and 'alt' not in a: errors.append(f'{self.path}: image has no alt')
        if a.get('target') == '_blank' and 'noopener' not in a.get('rel', ''):
            errors.append(f'{self.path}: external link lacks noopener')
        if 'data-es' in a or 'data-en' in a:
            if not a.get('data-es') or not a.get('data-en'): errors.append(f'{self.path}: incomplete translation')
            self.translations += 1
        for attr in ('href', 'src'):
            if attr in a: self.refs.append(a[attr])
    def handle_data(self, data):
        if self.current_anchor is not None: self.current_anchor[1] += data
    def handle_endtag(self, tag):
        if tag == 'a' and self.current_anchor is not None:
            attrs, label = self.current_anchor
            if 'PEDIR PRESUPUESTO' in label: self.quote_links.append(attrs)
            self.current_anchor = None

pages = {}
for path in ROOT.rglob('*.html'):
    page = Page(path.relative_to(ROOT))
    page.feed(path.read_text())
    if (page.h1, page.main, page.title) != (1, 1, 1): errors.append(f'{page.path}: expected one title, h1 and main')
    if page.translations < 20: errors.append(f'{page.path}: missing bilingual content')
    if any(field not in page.labels for field in page.fields): errors.append(f'{page.path}: unlabelled field')
    if page.navs != 1: errors.append(f'{page.path}: horizontal navigation missing')
    if 'menu-dialog' in page.ids: errors.append(f'{page.path}: obsolete popup menu')
    for link in page.quote_links:
        for attr in ('href', 'data-url-es', 'data-url-en'):
            url = urlsplit(link.get(attr, ''))
            if url.netloc != 'wa.me' or url.path != '/34635977484' or not parse_qs(url.query).get('text'):
                errors.append(f'{page.path}: quote link must prepare a WhatsApp message to the confirmed number')
    pages[path.resolve()] = page
if len(pages) != 12: errors.append(f'Expected 12 pages, got {len(pages)}')

for path, page in pages.items():
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = (ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/') else path.parent / unquote(url.path)
        if not url.path: target = path
        elif target.is_dir(): target = target / 'index.html'
        target = target.resolve()
        if not target.exists(): errors.append(f'{page.path}: missing target {ref}')
        if url.fragment and target in pages and url.fragment not in pages[target].ids:
            errors.append(f'{page.path}: missing anchor {ref}')

css = '\n'.join(p.read_text() for p in (ROOT / 'assets').glob('*.css'))
for ref in re.findall(r'url\([\"\']?([^\"\')]+)', css):
    if ref.startswith('/') and not (ROOT / ref.lstrip('/')).exists(): errors.append(f'CSS missing asset: {ref}')
assert css.count('{') == css.count('}'), 'Unbalanced CSS blocks'
assert '(prefers-reduced-motion:reduce)' in css, 'Missing reduced-motion support'
assert 'max-width:760px' in css, 'Missing mobile layout'
if errors:
    raise SystemExit('\n'.join(errors))
assert sum(len(p.quote_links) for p in pages.values()) == 9, 'Expected nine direct quote CTAs'
home = (ROOT / 'index.html').read_text()
assert home.count('class="slide-selector"') == 3, 'Expected three slide controls'
assert 'assets/hero-metallic.png' in home, 'Expected approved metallic hero'
print(f'PASS: {len(pages)} pages, {sum(len(p.refs) for p in pages.values())} references, internal links and fragments, labelled forms, images and bilingual content.')
print('PASS: horizontal navigation, metallic hero, three slide controls and all quote links to WhatsApp +34 635 977 484.')
print('Browser rendering and interaction QA remain unverified: control-browser was unavailable.')
