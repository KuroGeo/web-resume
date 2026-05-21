const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const treeMap = document.querySelector("[data-tree]");
const treeProgress = document.querySelector("[data-tree-progress]");
const unlockCount = document.querySelector("[data-unlock-count]");
const unlockPercent = document.querySelector("[data-unlock-percent]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const stageItems = Array.from(document.querySelectorAll("[data-stage]"));
const nodes = Array.from(document.querySelectorAll("[data-node]"));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const updateChrome = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pageRatio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const viewportLine = window.innerHeight * 0.48;

  if (header) {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  if (progress) {
    progress.style.width = `${clamp(pageRatio * 100, 0, 100)}%`;
  }

  const currentSection = navSections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.42);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", currentSection && link.getAttribute("href") === `#${currentSection.id}`);
  });

  let litCount = 0;
  let currentNodeId = nodes[0]?.id;

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const isLit = rect.top < viewportLine && rect.bottom > 96;
    const isPassed = rect.top < viewportLine;

    node.classList.toggle("is-lit", isLit);
    node.classList.toggle("is-unlocked", isPassed);

    if (isPassed) {
      litCount += 1;
      currentNodeId = node.dataset.stageKey || node.id;
    }
  });

  stageItems.forEach((item) => {
    item.classList.toggle("is-current", item.dataset.stage === currentNodeId);
  });

  const totalNodes = nodes.length || 1;
  const percent = Math.round((litCount / totalNodes) * 100);

  if (unlockCount) {
    unlockCount.textContent = `${litCount}/${totalNodes}`;
  }

  if (unlockPercent) {
    unlockPercent.textContent = `${percent}%`;
  }

  if (treeMap && treeProgress) {
    const rect = treeMap.getBoundingClientRect();
    const total = rect.height - window.innerHeight * 0.42;
    const passed = window.innerHeight * 0.38 - rect.top;
    const treeRatio = total > 0 ? clamp(passed / total, 0, 1) : 0;
    treeProgress.style.height = `${treeRatio * 100}%`;
  }
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

updateChrome();
