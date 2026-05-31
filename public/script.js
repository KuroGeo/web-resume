import { getResumeCopy, getResumePageMeta, isSupportedLanguage } from "./resume-content.js";
import { createPageChrome, getInitialLanguage } from "./site-chrome.js";

const setMetaContent = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute("content", content);
  }
};

const applyLanguage = (language) => {
  const activeLanguage = isSupportedLanguage(language) ? language : "en";
  const pageKey = document.documentElement.dataset.page || "home";
  const copy = getResumeCopy(activeLanguage);
  const pageMeta = getResumePageMeta(activeLanguage, pageKey);

  document.documentElement.lang = pageMeta.htmlLang;
  document.documentElement.dataset.language = activeLanguage;
  document.title = pageMeta.title;
  setMetaContent("meta[name='description']", pageMeta.description);
  setMetaContent("meta[property='og:title']", pageMeta.title);
  setMetaContent("meta[property='og:description']", pageMeta.ogDescription);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy.text[element.dataset.i18n];
    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = copy.text[element.dataset.i18nAria];
    if (value) {
      element.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll("[data-language-option]").forEach((button) => {
    const isActive = button.dataset.languageOption === activeLanguage;
    button.setAttribute("aria-pressed", String(isActive));
  });

  return activeLanguage;
};

applyLanguage(getInitialLanguage(isSupportedLanguage));
createPageChrome({ applyLanguage }).start();
