const header = document.querySelector("[data-header]");
const toast = document.querySelector("[data-toast]");
const sectionLinks = Array.from(document.querySelectorAll(".nav-links a, .sticky-rail a"));
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some embedded browsers expose Clipboard API but deny writes.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
};

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.getAttribute("data-copy");

    try {
      await copyText(text);
      showToast("已复制邮箱");
    } catch {
      showToast(text);
    }
  });
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const updateActiveLink = () => {
  const current = sections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 130);

  sectionLinks.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
};

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveLink();
}, { passive: true });

updateHeader();
updateActiveLink();
