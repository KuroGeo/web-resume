/* The PDF and both page images come from the same typeset source. */
(function () {
  'use strict';
  var language = 'en';
  try { if (localStorage.getItem('resume-language') === 'zh') language = 'zh'; } catch {}
  var edition = language === 'zh' ? 'ZH' : 'EN';
  var stem = 'assets/docs/George-Ye-Resume-' + edition;
  // Pages caches static files for several minutes. Keep the preview and PDF in
  // sync when a new edition replaces files at the same paths.
  var assetVersion = '?v=20260923-spacing';
  var pdf = stem + '.pdf' + assetVersion;
  window.resumePdfUrl = pdf;
  window.resumePdfFilename = 'George-Ye-Resume-' + edition + '.pdf';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-resume-page]').forEach(function (image) {
    image.src = stem + '-' + image.dataset.resumePage + '.png' + assetVersion;
  });
  document.querySelectorAll('[data-resume-download]').forEach(function (link) {
    link.href = pdf;
    link.download = window.resumePdfFilename;
  });
  document.querySelectorAll('[data-resume-pdf]').forEach(function (link) { link.href = pdf; });
})();
