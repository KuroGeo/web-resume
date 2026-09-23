/* The PDF and both page images come from the same typeset source. */
(function () {
  'use strict';
  var language = 'en';
  try { if (localStorage.getItem('resume-language') === 'zh') language = 'zh'; } catch {}
  var edition = language === 'zh' ? 'ZH' : 'EN';
  var stem = 'assets/docs/George-Ye-Resume-' + edition;
  var pdf = stem + '.pdf';
  window.resumePdfUrl = pdf;
  window.resumePdfFilename = 'George-Ye-Resume-' + edition + '.pdf';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-resume-page]').forEach(function (image) {
    image.src = stem + '-' + image.dataset.resumePage + '.png';
  });
  document.querySelectorAll('[data-resume-download]').forEach(function (link) {
    link.href = pdf;
    link.download = window.resumePdfFilename;
  });
  document.querySelectorAll('[data-resume-pdf]').forEach(function (link) { link.href = pdf; });
})();
