const header = document.querySelector("[data-header]");
const progress = document.querySelector("[data-progress]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const panels = Array.from(document.querySelectorAll("[data-panel]"));
const linkedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const updateChrome = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  header.classList.toggle("is-scrolled", window.scrollY > 24);
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;

  const current = linkedSections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= window.innerHeight * 0.34);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

const scrollToHash = () => {
  if (!window.location.hash) return;

  const target = document.querySelector(window.location.hash);
  if (target) {
    target.scrollIntoView({ block: "start" });
  }
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    target.scrollIntoView({ block: "start" });
  });
});

const panelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-current", entry.isIntersecting);
    });
  },
  { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
);

panels.forEach((panel) => panelObserver.observe(panel));
window.addEventListener("scroll", updateChrome, { passive: true });
window.addEventListener("resize", updateChrome);
window.addEventListener("load", () => {
  window.requestAnimationFrame(scrollToHash);
});
updateChrome();
