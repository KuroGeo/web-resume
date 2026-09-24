"""Generate the reader's two page previews from the public PDFs only."""
import hashlib
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / 'public'
versions = {}
with tempfile.TemporaryDirectory(prefix='resume-previews-') as scratch:
    stage = Path(scratch)
    for language in ('en', 'zh'):
        pdf = ROOT / f'downloads/resume-{language}.pdf'
        versions[language] = hashlib.sha256(pdf.read_bytes()).hexdigest()[:12]
        subprocess.run(['pdftoppm', '-r', '180', '-png', str(pdf), str(stage / f'resume-{language}')], check=True, capture_output=True)
        expected = {f'resume-{language}-1.png', f'resume-{language}-2.png'}
        if {p.name for p in stage.glob(f'resume-{language}-*.png')} != expected:
            raise ValueError('The approved reader expects exactly two pages per language')
    target = ROOT / 'assets/docs'; target.mkdir(parents=True, exist_ok=True)
    for image in stage.glob('*.png'):
        shutil.copyfile(image, target / image.name)
    # Public compatibility aliases keep previously shared links current.
    for language, edition in [('en', 'EN'), ('zh', 'ZH')]:
        shutil.copyfile(ROOT / f'downloads/resume-{language}.pdf', target / f'George-Ye-Resume-{edition}.pdf')
        for page in (1, 2):
            shutil.copyfile(target / f'resume-{language}-{page}.png', target / f'George-Ye-Resume-{edition}-{page}.png')
    runtime = '''// Generated from the public PDFs. The source of truth is the private content catalog.
(function () {
  'use strict';
  var language = 'en';
  try { if (localStorage.getItem('resume-language') === 'zh') language = 'zh'; } catch {}
  var requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh') language = requested;
  var version = VERSIONS[language];
  var pdf = 'downloads/resume-' + language + '.pdf?v=' + version;
  window.resumePdfUrl = pdf;
  window.resumePdfFilename = language === 'zh' ? '叶禹锋_V1.pdf' : 'George_V1.pdf';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-resume-page]').forEach(function (image) {
    image.src = 'assets/docs/resume-' + language + '-' + image.dataset.resumePage + '.png?v=' + version;
  });
  document.querySelectorAll('[data-resume-download]').forEach(function (link) {
    link.href = pdf; link.download = window.resumePdfFilename;
    link.textContent = language === 'zh' ? '下载 PDF ↓' : 'Download PDF ↓';
  });
  document.querySelectorAll('[data-resume-pdf]').forEach(function (link) { link.href = pdf; });
  document.querySelectorAll('[data-resume-language]').forEach(function (button) {
    button.setAttribute('aria-pressed', String(button.dataset.resumeLanguage === language));
    button.addEventListener('click', function () {
      var next = button.dataset.resumeLanguage;
      try { localStorage.setItem('resume-language', next); } catch {}
      var url = new URL(location.href); url.searchParams.set('lang', next); location.href = url.href;
    });
  });
})();
'''.replace('VERSIONS', json.dumps(versions))
    (ROOT / 'js/resume-assets.js').write_text(runtime, encoding='utf-8')
print('Generated two-page reader previews from both public PDFs')
