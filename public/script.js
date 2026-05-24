const LANGUAGE_STORAGE_KEY = "resume-language";
const supportedLanguages = ["zh", "en"];
const translations = {
  zh: {
    meta: {
      htmlLang: "zh-CN",
      title: "George Y. | 前端工程师",
      description: "一名前端工程师的作品集式网页简历，经历聚焦字节跳动抖音电商的核心购物与内容场景、用户体验和 Web 性能。",
      ogDescription: "以作品集方式呈现前端工程经历，聚焦抖音电商、用户体验、电商功能交付和 Web 性能。"
    },
    text: {
      "skipLink": "跳到内容",
      "intro.role": "前端工程师",
      "intro.copy": "我把复杂业务、跨端体验和工程系统，整理成稳定、清晰、可增长的前端产品。",
      "nav.label": "主要导航",
      "nav.about": "关于",
      "nav.experience": "经历",
      "nav.projects": "项目",
      "nav.skills": "技能",
      "nav.contact": "联系",
      "language.label": "语言选择",
      "social.label": "公开链接",
      "about.p1": "我是一名前端工程师，主要经历集中在电商消费者业务。相比单纯完成页面，我更关注如何把业务目标、产品体验、跨端渲染、性能稳定和工程效率放在同一个问题里解决。",
      "about.p2": "过去几年，我参与过店铺与橱窗、短视频电商、异形卡交互、AI 电商 POC、低代码搭建、Lynx 渲染、监控治理和多宿主适配等方向，习惯在真实流量和复杂协作里推进结果。",
      "about.p3": "现在我希望继续投入更具挑战的事情：面对复杂问题、真实用户和高标准协作，把产品判断、体验细节和工程执行一起推进。",
      "experience.bytedance.time": "2021.06 — 2026.04",
      "experience.bytedance.title": "字节跳动 · 抖音电商",
      "experience.bytedance.subtitle": "前端工程师 · 移动端与跨端",
      "experience.bytedance.body": "任职于字节跳动抖音电商，负责核心购物与内容场景的前端开发，专注于用户体验优化、电商功能交付和 Web 性能提升。",
      "experience.edu.time": "2017 — 2021",
      "experience.edu.title": "华南理工大学",
      "experience.edu.subtitle": "信息工程本科",
      "project.shop.kicker": "2023 · 店铺生态",
      "project.shop.title": "店铺首页装修混排",
      "project.shop.body": "把商家组件生态迁移到抖音店铺，完成 C 端渲染容器、B 端调试工具、缓存和性能链路建设。",
      "project.video.kicker": "2024 — 2026 · 内容电商",
      "project.video.title": "短视频电商异形卡",
      "project.video.body": "在高流量短视频场景中持续迭代卡片交互、营销样式、接券体验和价格动效，推动增长指标改善。",
      "project.ai.kicker": "2025 · AI 电商",
      "project.ai.title": "智能素材流与 AI Agent",
      "project.ai.body": "探索 AI 内容产品的前端工程形态，连接模型工作流、对话产品、素材生成与 B 端内容管理。",
      "skills.frontend": "TypeScript, JavaScript, React.js, Node.js, 小程序, 组件体系",
      "skills.mobile": "Android, React Native, Lynx, 多端渲染, 宿主适配",
      "skills.engineering": "前端架构, 性能优化, Monorepo, CI/CD, 微前端, 监控治理",
      "skills.ai": "Codex, Claude Code, OpenClaw, 项目级 vibe coding 实践",
      "contact.prefix": "如果你想找一个能把业务、体验和工程一起推进的人，可以通过我的",
      "contact.or": "或",
      "contact.suffix": "联系我。",
      "tag.contentPlatform": "内容平台",
      "tag.zeroToOne": "产品从 0 到 1",
      "tag.videoCommerce": "短视频电商",
      "tag.interactionPerformance": "交互性能",
      "tag.conversion": "转化链路",
      "tag.lowCode": "低代码",
      "tag.performance": "性能优化",
      "tag.multiHost": "多宿主",
      "tag.grayRelease": "灰度发布",
      "tag.crossPlatformComponents": "跨平台组件",
      "tag.isvDebugging": "ISV 调试",
      "tag.loadOptimization": "加载优化",
      "tag.highTrafficInteraction": "高流量交互",
      "tag.gmvGrowth": "GMV 增长",
      "tag.aiContent": "AI 内容",
      "tag.assetManagement": "素材管理"
    }
  },
  en: {
    meta: {
      htmlLang: "en",
      title: "George Y. | Frontend Engineer",
      description: "A portfolio-style resume for a frontend engineer who built shopping experiences at ByteDance's Douyin E-commerce, with a focus on mobile apps, user experience, and web performance.",
      ogDescription: "A portfolio-style frontend resume focused on Douyin E-commerce, mobile apps, user experience, and web performance."
    },
    text: {
      "skipLink": "Skip to content",
      "intro.role": "Frontend Engineer",
      "intro.copy": "I build fast, reliable shopping experiences across web and mobile apps.",
      "nav.label": "Primary navigation",
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "language.label": "Language selection",
      "social.label": "Public links",
      "about.p1": "I am a frontend engineer with experience building shopping products for large-scale consumer apps. My work sits between product, design, and engineering: turning complex buying flows into fast, reliable interfaces people can use every day.",
      "about.p2": "At Douyin E-commerce, I worked on store pages, product discovery, short-video shopping features, internal tools, and mobile app experiences. Most of this work ran at large scale, so performance, stability, and clear collaboration mattered as much as UI polish.",
      "about.p3": "I want to keep taking on harder problems: work with real users, meaningful product decisions, and enough technical depth to make the outcome better over time.",
      "experience.bytedance.time": "Jun 2021 — Apr 2026",
      "experience.bytedance.title": "ByteDance · Douyin E-commerce",
      "experience.bytedance.subtitle": "Frontend Engineer · Mobile & Web",
      "experience.bytedance.body": "Built frontend features for Douyin E-commerce, the shopping business inside TikTok China. I worked on core shopping and content flows, with a focus on smoother user experiences, reliable feature delivery, and faster pages.",
      "experience.edu.time": "2017 — 2021",
      "experience.edu.title": "South China University of Technology",
      "experience.edu.subtitle": "B.Eng. in Information Engineering",
      "project.shop.kicker": "2023 · Store tools",
      "project.shop.title": "Douyin Store Page Builder",
      "project.shop.body": "Brought merchant-built store modules into Douyin stores, including the mobile rendering layer, a partner debugging tool, caching, and page speed improvements.",
      "project.video.kicker": "2024 — 2026 · Short-video shopping",
      "project.video.title": "Shopping Cards in Short Videos",
      "project.video.body": "Improved shopping cards inside short videos, including interactions, promotion styles, coupon flows, and price animations for high-traffic pages.",
      "project.ai.kicker": "2025 · AI shopping tools",
      "project.ai.title": "AI Shopping Content Tools",
      "project.ai.body": "Prototyped AI-assisted shopping tools that connected model workflows, chat experiences, generated product content, and an internal content management system.",
      "skills.frontend": "TypeScript, JavaScript, React.js, Node.js, Mini Programs, component systems",
      "skills.mobile": "Android, React Native, Lynx, mobile app integration, cross-platform UI",
      "skills.engineering": "Frontend architecture, performance optimization, monorepos, CI/CD, micro-frontends, monitoring",
      "skills.ai": "Codex, Claude Code, OpenClaw, AI-assisted development workflows",
      "contact.prefix": "If you are looking for someone who can connect product thinking with strong frontend execution, reach me on",
      "contact.or": "or",
      "contact.suffix": "for a conversation.",
      "tag.contentPlatform": "Content Platform",
      "tag.zeroToOne": "0-to-1 Product",
      "tag.videoCommerce": "Short-video Shopping",
      "tag.interactionPerformance": "UI Performance",
      "tag.conversion": "Purchase Flow",
      "tag.lowCode": "Low Code",
      "tag.performance": "Performance",
      "tag.multiHost": "Multiple Apps",
      "tag.grayRelease": "Gray Release",
      "tag.crossPlatformComponents": "Reusable Components",
      "tag.isvDebugging": "Partner Debugging",
      "tag.loadOptimization": "Page Speed",
      "tag.highTrafficInteraction": "High-traffic UI",
      "tag.gmvGrowth": "Sales Growth",
      "tag.aiContent": "AI Content",
      "tag.assetManagement": "Content Tools"
    }
  }
};

const getStoredLanguage = () => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return supportedLanguages.includes(stored) ? stored : null;
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

const getBrowserLanguage = () => {
  const languages = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];

  return languages.some((language) => language.toLowerCase().startsWith("zh")) ? "zh" : "en";
};

const getInitialLanguage = () => getStoredLanguage() || getBrowserLanguage();

const setMetaContent = (selector, content) => {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute("content", content);
  }
};

const applyLanguage = (language, { persist = false } = {}) => {
  const activeLanguage = supportedLanguages.includes(language) ? language : "en";
  const copy = translations[activeLanguage];

  document.documentElement.lang = copy.meta.htmlLang;
  document.documentElement.dataset.language = activeLanguage;
  document.title = copy.meta.title;
  setMetaContent("meta[name='description']", copy.meta.description);
  setMetaContent("meta[property='og:title']", copy.meta.title);
  setMetaContent("meta[property='og:description']", copy.meta.ogDescription);

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

  if (persist) {
    storeLanguage(activeLanguage);
  }
};

const progress = document.querySelector("[data-progress]");
const languageButtons = Array.from(document.querySelectorAll("[data-language-option]"));
const navLinks = Array.from(document.querySelectorAll(".side-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const updateChrome = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (progress) {
    progress.style.width = `${clamp(ratio * 100, 0, 100)}%`;
  }

  const current = sections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.38);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

const scrollToHash = (hash) => {
  const target = document.querySelector(hash);
  if (!target) return;
  target.scrollIntoView({ block: "start" });
};

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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.languageOption, { persist: true });
    updateChrome();
  });
});

const alignHashTarget = () => {
  if (!window.location.hash) return;
  scrollToHash(window.location.hash);
};

window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
window.addEventListener("load", () => {
  updateChrome();
  window.requestAnimationFrame(alignHashTarget);
  window.setTimeout(alignHashTarget, 180);
});

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
}, { passive: true });

applyLanguage(getInitialLanguage());
updateChrome();
