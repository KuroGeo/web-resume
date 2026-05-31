const LANGUAGE_STORAGE_KEY = "resume-language";

const pageChromeConfig = {
  home: {
    navSelector: ".side-nav a[href^='#']",
    sectionActivationRatio: 0.38
  },
  "work-bytedance": {
    navSelector: ".detail-topnav a[href^='#']",
    sectionActivationRatio: 0.72
  }
};

const getBrowserLanguage = () => {
  const languages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];

  return languages.some((language) => language.toLowerCase().startsWith("zh")) ? "zh" : "en";
};

const getStoredLanguage = (isSupportedLanguage) => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Storage can be unavailable in private or embedded browsing contexts.
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const scrollToHash = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ block: "start" });
};

export const getInitialLanguage = (isSupportedLanguage) => (
  getStoredLanguage(isSupportedLanguage) || getBrowserLanguage()
);

export const createPageChrome = ({ applyLanguage }) => {
  const pageKey = document.documentElement.dataset.page || "home";
  const config = pageChromeConfig[pageKey] || pageChromeConfig.home;
  const progress = document.querySelector("[data-progress]");
  const languageButtons = Array.from(document.querySelectorAll("[data-language-option]"));
  const navLinks = Array.from(document.querySelectorAll(config.navSelector));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    if (progress) {
      progress.style.width = `${clamp(ratio * 100, 0, 100)}%`;
    }

    const current = sections
      .slice()
      .reverse()
      .find((section) => section.getBoundingClientRect().top <= window.innerHeight * config.sectionActivationRatio);

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
    });
  };

  const bindHashNavigation = () => {
    document.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        const target = document.querySelector(hash);
        if (!target) return;

        event.preventDefault();
        history.pushState(null, "", hash);
        scrollToHash(hash);
      });
    });
  };

  const bindLanguageControls = () => {
    languageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeLanguage = applyLanguage(button.dataset.languageOption);
        storeLanguage(activeLanguage);
        update();
      });
    });
  };

  const alignHashTarget = () => {
    if (!window.location.hash) return;
    scrollToHash(window.location.hash);
  };

  const bindWindowChrome = () => {
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", () => {
      update();
      window.requestAnimationFrame(alignHashTarget);
      window.setTimeout(alignHashTarget, 180);
    });

    window.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    }, { passive: true });
  };

  const start = () => {
    bindHashNavigation();
    bindLanguageControls();
    bindWindowChrome();
    update();
  };

  return { start, update };
};
