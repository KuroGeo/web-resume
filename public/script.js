import { getResumeCopy, getResumePageMeta, isSupportedLanguage } from "./resume-content.js?v=resume-third-party-metrics-20260602";
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

const setupMixedLayerInspector = () => {
  const inspector = document.querySelector("[data-mixed-inspector]");
  if (!inspector) {
    return;
  }

  const controls = [...inspector.querySelectorAll("[data-mixed-control]")];
  const triggers = [...inspector.querySelectorAll("[data-mixed-trigger]")];
  const interactiveItems = [...controls, ...triggers];
  const setActiveLayer = (layer) => {
    inspector.dataset.activeLayer = layer;
    interactiveItems.forEach((item) => {
      const itemLayer = item.dataset.mixedControl || item.dataset.mixedTrigger;
      const isActive = itemLayer === layer;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  };

  interactiveItems.forEach((item) => {
    const layer = item.dataset.mixedControl || item.dataset.mixedTrigger;
    item.addEventListener("click", () => setActiveLayer(layer));
    item.addEventListener("focus", () => setActiveLayer(layer));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActiveLayer(layer);
      }
    });
  });
};

const setupAwardPreviews = () => {
  document.querySelectorAll(".award-reveal").forEach((button) => {
    const open = () => button.classList.add("is-open");
    const close = () => button.classList.remove("is-open");

    button.addEventListener("mouseenter", open);
    button.addEventListener("focus", open);
    button.addEventListener("mouseleave", close);
    button.addEventListener("blur", close);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      open();
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        button.blur();
      }
    });
  });
};

applyLanguage(getInitialLanguage(isSupportedLanguage));
setupMixedLayerInspector();
setupAwardPreviews();
createPageChrome({ applyLanguage }).start();
