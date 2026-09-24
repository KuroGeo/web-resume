// Generated from the public PDFs. The source of truth is the private content catalog.
(function () {
  'use strict';
  var language = 'en';
  try { if (localStorage.getItem('resume-language') === 'zh') language = 'zh'; } catch {}
  var requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh') language = requested;
  var version = {"en": "25d65310320f", "zh": "b4ae93bc8356"}[language];
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
