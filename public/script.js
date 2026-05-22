const LANGUAGE_STORAGE_KEY = "resume-language";
const supportedLanguages = ["zh", "en"];
const translations = {
  zh: {
    meta: {
      htmlLang: "zh-CN",
      title: "George Y. | 前端工程师",
      description: "一名前端工程师的作品集式网页简历，经历覆盖字节跳动电商、跨端渲染、Lynx 稳定性、店铺装修、短视频电商与 AI 电商产品落地。",
      ogDescription: "以作品集方式呈现前端工程经历，覆盖 React、Lynx、跨端渲染、性能优化和 AI 电商落地。"
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
      "about.p3": "现在我希望继续做有挑战的前端系统：既能接住业务复杂度，也能把体验和工程质量打磨到让团队长期受益。",
      "experience.ai.time": "2025.04 — 2025.12",
      "experience.ai.title": "AI 电商前端工程 POC",
      "experience.ai.subtitle": "创新探索",
      "experience.ai.body": "负责新型 AI 内容 App 工程化建设，搭建类抖音多 Feed 智能素材流，维护送礼助手 AI Agent 对话产品及素材管理模块。",
      "experience.ai.b1": "推动手机品类智能对比页、商品标题和推荐语 AI 自动改写等场景落地。",
      "experience.ai.b2": "串联 Coze 工作流、火山引擎大模型、AI Agent 与 B 端内容管理平台。",
      "experience.video.time": "2024 — 2026",
      "experience.video.title": "内容电商 · 短视频与异形卡",
      "experience.video.subtitle": "核心链路",
      "experience.video.body": "从千万级日均 GMV 的增长品接手，负责异形卡核心交互、承接链路、营销样式、视频小窗、沉浸式接券和价格动效等能力落地。",
      "experience.video.b1": "推动异形卡日均 GMV 从千万级跃升至亿级。",
      "experience.video.b2": "完善监控告警、埋点口径与订单归因，提升问题定位和数据分析效率。",
      "experience.shop.title": "抖音店铺首页装修混排项目",
      "experience.shop.subtitle": "技术 owner",
      "experience.shop.body": "主导跨平台店铺组件生态建设，覆盖 C 端容器优化、第三方组件缓存、DSL 转 Lynx 渲染、B 端 ISV 调试 App，获得 2023Q1 电商项目奖。",
      "experience.shelf.time": "2021 — 2024",
      "experience.shelf.title": "货架电商 · 店铺与橱窗",
      "experience.shelf.subtitle": "字节跳动电商消费者业务",
      "experience.shelf.body": "负责店铺混排能力、性能优化与商家端低代码搭建，建设店铺内容混排框架，优化 ISV 组件加载体验，并完善全场景店铺入口透出。",
      "experience.shelf.b1": "重构店铺分类页容器，落地商家自定义预览渲染能力。",
      "experience.shelf.b2": "建设店铺&橱窗 SaaS 多端统一渲染能力，支撑头条、西瓜、番茄、懂车帝等宿主。",
      "experience.edu.time": "2017 — 2021",
      "experience.edu.title": "华南理工大学",
      "experience.edu.subtitle": "信息工程本科",
      "metric.shopConversion": "店铺访购率",
      "metric.isvConversion": "ISV 页访购率",
      "metric.iosLoad": "iOS 加载耗时",
      "metric.interactive": "可交互耗时",
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
      "tag.undergraduate": "本科",
      "tag.informationEngineering": "信息工程",
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
      description: "A portfolio-style resume for a frontend engineer with experience across ByteDance e-commerce, cross-platform rendering, Lynx reliability, store tooling, short-video commerce, and AI commerce products.",
      ogDescription: "A portfolio-style frontend resume covering React, Lynx, cross-platform rendering, performance optimization, and AI commerce delivery."
    },
    text: {
      "skipLink": "Skip to content",
      "intro.role": "Frontend Engineer",
      "intro.copy": "I turn complex business flows, cross-platform experiences, and engineering systems into frontend products that feel stable, clear, and ready to grow.",
      "nav.label": "Primary navigation",
      "nav.about": "About",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "language.label": "Language selection",
      "social.label": "Public links",
      "about.p1": "I am a frontend engineer focused on consumer e-commerce. Instead of only shipping pages, I care about solving business goals, product experience, cross-platform rendering, performance, stability, and engineering efficiency as one connected problem.",
      "about.p2": "In recent years I have worked on stores and showcases, short-video commerce, custom commerce cards, AI commerce POCs, low-code tooling, Lynx rendering, observability, and multi-host adaptation, usually in high-traffic and highly collaborative environments.",
      "about.p3": "I want to keep building challenging frontend systems: products that can absorb business complexity while making the experience and engineering quality better for the long run.",
      "experience.ai.time": "Apr 2025 — Dec 2025",
      "experience.ai.title": "AI Commerce Frontend Engineering POC",
      "experience.ai.subtitle": "Innovation exploration",
      "experience.ai.body": "Led frontend engineering for a new AI content app, including a TikTok-like multi-feed intelligent asset stream, a gift-assistant AI Agent chat product, and asset management modules.",
      "experience.ai.b1": "Delivered scenarios such as intelligent phone-category comparison pages plus AI rewriting for product titles and recommendation copy.",
      "experience.ai.b2": "Connected Coze workflows, Volcano Engine models, AI Agent capabilities, and a B-side content management platform.",
      "experience.video.time": "2024 — 2026",
      "experience.video.title": "Content Commerce · Short Video & Custom Cards",
      "experience.video.subtitle": "Core conversion flow",
      "experience.video.body": "Took over a growth product already producing tens of millions in daily GMV, then delivered core custom-card interactions, landing flows, marketing styles, floating video, immersive coupon claiming, and price animation.",
      "experience.video.b1": "Helped grow custom-card daily GMV from tens of millions to the hundred-million level.",
      "experience.video.b2": "Improved monitoring, alerting, event definitions, and order attribution to make debugging and data analysis faster.",
      "experience.shop.title": "Douyin Store Homepage Mixed Layout Builder",
      "experience.shop.subtitle": "Technical owner",
      "experience.shop.body": "Led the cross-platform store component ecosystem, covering C-side container optimization, third-party component caching, DSL-to-Lynx rendering, and a B-side ISV debugging app. The project won the 2023 Q1 e-commerce project award.",
      "experience.shelf.time": "2021 — 2024",
      "experience.shelf.title": "Shelf Commerce · Stores & Showcases",
      "experience.shelf.subtitle": "ByteDance e-commerce consumer business",
      "experience.shelf.body": "Built store mixed-layout capabilities, performance optimizations, and merchant-side low-code tooling, including a store content framework, improved ISV component loading, and store-entry exposure across scenarios.",
      "experience.shelf.b1": "Refactored the store category-page container and shipped custom merchant preview rendering.",
      "experience.shelf.b2": "Built unified multi-platform rendering for store and showcase SaaS, supporting hosts such as Toutiao, Xigua, Tomato Novel, and Dongchedi.",
      "experience.edu.time": "2017 — 2021",
      "experience.edu.title": "South China University of Technology",
      "experience.edu.subtitle": "B.Eng. in Information Engineering",
      "metric.shopConversion": "Store visit-to-purchase",
      "metric.isvConversion": "ISV page conversion",
      "metric.iosLoad": "iOS load time",
      "metric.interactive": "Time to interactive",
      "project.shop.kicker": "2023 · Store ecosystem",
      "project.shop.title": "Store Homepage Mixed Layout Builder",
      "project.shop.body": "Migrated the merchant component ecosystem into Douyin stores, building the C-side rendering container, B-side debugging tool, caching layer, and performance pipeline.",
      "project.video.kicker": "2024 — 2026 · Content commerce",
      "project.video.title": "Short-video Commerce Custom Cards",
      "project.video.body": "Iterated card interactions, marketing styles, coupon experiences, and price animations in high-traffic short-video scenes to improve growth metrics.",
      "project.ai.kicker": "2025 · AI commerce",
      "project.ai.title": "Intelligent Asset Feed & AI Agent",
      "project.ai.body": "Explored frontend engineering patterns for AI content products by connecting model workflows, chat products, asset generation, and B-side content management.",
      "skills.frontend": "TypeScript, JavaScript, React.js, Node.js, Mini Programs, component systems",
      "skills.mobile": "Android, React Native, Lynx, multi-platform rendering, host adaptation",
      "skills.engineering": "Frontend architecture, performance optimization, Monorepo, CI/CD, micro frontends, observability",
      "skills.ai": "Codex, Claude Code, OpenClaw, project-level vibe coding practice",
      "contact.prefix": "If you are looking for someone who can move business, experience, and engineering forward together, reach me on",
      "contact.or": "or",
      "contact.suffix": "for a conversation.",
      "tag.contentPlatform": "Content Platform",
      "tag.zeroToOne": "0-to-1 Product",
      "tag.videoCommerce": "Short-video Commerce",
      "tag.interactionPerformance": "Interaction Performance",
      "tag.conversion": "Conversion Flow",
      "tag.lowCode": "Low Code",
      "tag.performance": "Performance",
      "tag.multiHost": "Multi-host",
      "tag.grayRelease": "Gray Release",
      "tag.undergraduate": "Undergraduate",
      "tag.informationEngineering": "Information Engineering",
      "tag.crossPlatformComponents": "Cross-platform Components",
      "tag.isvDebugging": "ISV Debugging",
      "tag.loadOptimization": "Load Optimization",
      "tag.highTrafficInteraction": "High-traffic Interaction",
      "tag.gmvGrowth": "GMV Growth",
      "tag.aiContent": "AI Content",
      "tag.assetManagement": "Asset Management"
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
