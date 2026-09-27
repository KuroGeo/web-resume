'use strict';

// This case study is site-specific editorial material. Résumé/PDF data stays in the private source.
const copy = {
  en: {
    skip: 'Skip to project', back: 'Back to project index', meta: '2026 · AI ad creation and campaign platform',
    title: 'From creative canvas to ad assistant.',
    lead: 'Connect reference video, product imagery and text on a canvas to refine scripts, shots and finished clips. The ad assistant screens show another side of the project, from task templates to diagnostics and change approval.',
    explore: 'Explore the demos ↓', visit: 'Visit website ↗',
    heroOverview: 'Creative canvas · project overview', heroAdAgent: 'Ad assistant · template entry', heroReference: 'Reference replication · output clip',
    heroProduct: 'Product replacement · output clip', heroCommerce: 'Creative scenarios · commerce',
    heroVlog: 'Creative scenarios · lifestyle vlog', heroFilm: 'Creative scenarios · cinematic scene',
    heroGlobal: 'Global adaptation · output clip', heroDetails: 'See details ↗',
    navReference: 'Reference replication', navProduct: 'Product replacement', navScenes: 'Creative scenarios', navGlobal: 'Global adaptation', navInterface: 'The interface', navAdAgent: 'Ad assistant', navRole: 'My role',
    referenceTitle: 'From reference video to new creative',
    referenceIntro: 'Start with a reference video and product image. Break the material into a canvas flow, generate candidate clips and combine them into a new video. The input and result sit together for direct comparison.',
    before: 'Input', after: 'Output', swipeCompare: 'Swipe to compare input and output →', referenceBefore: 'Reference video', referenceAfter: 'New product clip',
    referenceFlow: 'Canvas flow: inputs → replication and candidate generation → video assembly', zoom: 'Enlarge image',
    productTitle: 'Place a product into an existing shot',
    productIntro: 'A focused example: use product imagery and a person’s reference video to generate a clip with different clothing while retaining the original shot structure.',
    productBefore: 'Original person and shot', productAfter: 'Product outfit replacement',
    productFlow: 'Canvas flow: product image + reference video → replication node → new clip',
    scenesTitle: 'One canvas, different creative paths',
    scenesIntro: 'The same node-based approach combines images, character references, text and video. These three demos show creative range; they do not represent campaign performance.',
    commerceTitle: 'Commerce video', commerceBody: 'Character imagery and copy guide shot generation, then the product-introduction clips are combined.',
    vlogTitle: 'Lifestyle vlog', vlogBody: 'A person reference connects character setup, scene imagery and video segments.',
    filmTitle: 'Cinematic scene', filmBody: 'A miniature character enters an oversized home, using scale, light and a continuous shot to shape the scene.',
    flowLink: 'View canvas flow',
    globalTitle: 'Adapt one video for a new audience',
    globalIntro: 'Split a reference video into workable shots, generate candidate content and return to the assembly node. The two clips show changes to the people and product presentation.',
    globalBefore: 'Original clip', globalAfter: 'Adapted clip', globalFlow: 'Canvas flow: reference shot → candidate clips → video assembly',
    interfaceTitle: 'Inside the creative canvas',
    interfaceIntro: 'Beyond the finished clips, these interface captures show how assets enter the canvas, video nodes connect, and creators choose models, templates and character references. Open any image for a closer look.',
    shotCanvasTitle: 'Canvas overview', shotCanvasBody: 'Keep assets, references, generation nodes and results in one workspace.',
    shotVideoTitle: 'Video workflow', shotVideoBody: 'Connect a reference clip, shots and text instructions, then inspect the generated result.',
    shotModelsTitle: 'Choose a model for the task', shotModelsBody: 'Switch image models and set the frame and output format within an image node.',
    shotToolboxTitle: 'Reusable creative tools', shotToolboxBody: 'Pick a template from the toolbox and continue editing it on the canvas.',
    shotCharacterTitle: 'Character library', shotCharacterBody: 'Browse full-body, expression and multi-view references together.',
    adAgentTitle: 'From creative work to ad tasks',
    adAgentIntro: 'Two ad assistant interface captures: start with templates for ROAS monitoring, creative fatigue or budget pacing, then review diagnostic evidence, a change preview and actions awaiting approval. The figures and suggestions shown are examples in the screenshots, not measured campaign outcomes.',
    adAgentHomeTitle: 'Start with a task or template', adAgentHomeBody: 'Describe an advertising problem or choose a template to open a task.',
    adAgentDetailTitle: 'Review evidence before approval', adAgentDetailBody: 'Diagnostics, proposed changes and execution confirmation share one task view.',
    openImage: 'Enlarge image',
    roleTitle: 'My role',
    roleIntro: 'I led the creative canvas architecture and delivery from the ground up, connecting frontend interaction, backend services and model capabilities while moving requirements forward. The ad assistant screenshots also show the project’s campaign-task interface.',
    roleCanvas: 'Canvas and interaction', roleCanvasBody: 'Organized nodes, asset references and creation flows so inputs and generated results could be edited on the same canvas.',
    roleDelivery: 'Generation pipeline', roleDeliveryBody: 'Worked across backend services and model integrations to deliver image, video and creative-replication tasks.',
    roleTeam: 'Product delivery', roleTeamBody: 'Broke down requirements, shaped solutions and coordinated iteration around working demos.'
  }
};

let language = 'zh';
try { language = localStorage.getItem('resume-language') === 'en' ? 'en' : 'zh'; } catch {}
let heroSwiper;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let userPausedAutoplay = false;
let heroInView = true;
const hoverPreviews = new Map();
const imageDialog = document.querySelector('.cbi-lightbox');
const enlargedImage = imageDialog.querySelector('img');

document.querySelectorAll('a[href^="../../assets/cbi/"][href$=".png"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    enlargedImage.src = link.href;
    enlargedImage.alt = link.closest('figure')?.querySelector('img')?.alt || link.textContent.trim();
    imageDialog.showModal();
    imageDialog.querySelector('.cbi-lightbox-close').focus();
    syncHeroAutoplay();
  });
});
imageDialog.querySelector('.cbi-lightbox-close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  if (event.target === imageDialog || event.target.classList.contains('cbi-lightbox-stage')) imageDialog.close();
});
imageDialog.addEventListener('close', syncHeroAutoplay);

function soundHintText() {
  return language === 'en' ? 'Click play to enable sound' : '点击播放以开启声音';
}

function showSoundHint(video) {
  let hint = video.parentElement.querySelector(':scope > .cbi-sound-hint');
  if (!hint) {
    hint = document.createElement('span');
    hint.className = 'cbi-sound-hint';
    video.insertAdjacentElement('afterend', hint);
  }
  hint.textContent = soundHintText();
  hint.hidden = false;
}

function stopHoverPreview(video) {
  const previous = hoverPreviews.get(video);
  if (!previous) return false;
  hoverPreviews.delete(video);
  video.pause();
  video.muted = previous.muted;
  video.loop = previous.loop;
  return true;
}

function updateAutoplayButton() {
  const button = document.querySelector('.cbi-hero-auto');
  button.hidden = reducedMotion;
  button.textContent = userPausedAutoplay ? '▶' : 'Ⅱ';
  button.setAttribute('aria-pressed', String(userPausedAutoplay));
  const label = language === 'en'
    ? (userPausedAutoplay ? 'Resume automatic slideshow' : 'Pause automatic slideshow')
    : (userPausedAutoplay ? '继续自动轮播' : '暂停自动轮播');
  button.setAttribute('aria-label', label);
  button.title = label;
}

function syncHeroAutoplay() {
  if (!heroSwiper?.autoplay || reducedMotion) return;
  const activeVideo = heroSwiper.slides[heroSwiper.activeIndex]?.querySelector('video');
  const hovering = matchMedia('(hover: hover)').matches && heroSwiper.el.matches(':hover');
  const focused = heroSwiper.el.contains(document.activeElement);
  if (userPausedAutoplay) heroSwiper.autoplay.stop();
  else if (imageDialog.open || !heroInView || document.hidden || hovering || focused || (activeVideo && !activeVideo.paused && !activeVideo.ended)) heroSwiper.autoplay.pause();
  else if (!heroSwiper.autoplay.running) heroSwiper.autoplay.start();
  else if (heroSwiper.autoplay.paused) heroSwiper.autoplay.resume();
}

function updateHeroControls() {
  if (!heroSwiper) return;
  const slides = [...document.querySelectorAll('.cbi-hero-slide')];
  document.querySelector('.cbi-hero-count').textContent = `${String(heroSwiper.activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  slides.forEach((slide, index) => {
    slide.inert = index !== heroSwiper.activeIndex;
    if (index !== heroSwiper.activeIndex) {
      const video = slide.querySelector('video');
      if (video && !stopHoverPreview(video)) video.pause();
    }
  });
  document.querySelectorAll('.cbi-hero-pagination .swiper-pagination-bullet').forEach((bullet, index) => {
    bullet.setAttribute('aria-label', language === 'en' ? `Go to demo ${index + 1}` : `查看第 ${index + 1} 个演示`);
  });
  syncHeroAutoplay();
}

function renderLanguage() {
  const english = language === 'en';
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  document.title = english ? 'CBI · AI Ad Creation & Campaigns — George Y.' : 'CBI · AI 广告创作与投放 — George Y.';
  document.querySelectorAll('[data-copy]').forEach(element => {
    if (!element.dataset.zh) element.dataset.zh = element.textContent;
    element.textContent = english ? copy.en[element.dataset.copy] : element.dataset.zh;
  });
  document.querySelectorAll('[data-alt-en]').forEach(image => {
    if (!image.dataset.zhAlt) image.dataset.zhAlt = image.alt;
    image.alt = english ? image.dataset.altEn : image.dataset.zhAlt;
  });
  document.querySelectorAll('[data-aria-en]').forEach(element => {
    if (!element.dataset.zhAria) element.dataset.zhAria = element.getAttribute('aria-label');
    const label = english ? element.dataset.ariaEn : element.dataset.zhAria;
    element.setAttribute('aria-label', label);
    if (element.hasAttribute('title')) element.title = label;
  });
  document.querySelectorAll('.cbi-sound-hint').forEach(hint => { hint.textContent = soundHintText(); });
  document.getElementById('cbi-language').textContent = english ? '中文' : 'EN';
  updateAutoplayButton();
  updateHeroControls();
}

document.getElementById('cbi-language').addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  try { localStorage.setItem('resume-language', language); } catch {}
  renderLanguage();
});

// Native controls can start any clip independently. Keep playback exclusive across the case study.
document.addEventListener('play', event => {
  if (!(event.target instanceof HTMLVideoElement)) return;
  const hint = event.target.parentElement.querySelector(':scope > .cbi-sound-hint');
  if (hint) hint.hidden = true;
  document.querySelectorAll('video').forEach(video => {
    if (video !== event.target && !video.paused && !stopHoverPreview(video)) video.pause();
  });
  if (event.target.closest('.cbi-hero-swiper')) syncHeroAutoplay();
}, true);
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse' || reducedMotion || !video.paused) return;
    hoverPreviews.set(video, { muted: video.muted, loop: video.loop });
    video.muted = false;
    video.loop = true;
    video.play().catch(error => {
      if (!stopHoverPreview(video)) return;
      if (error.name === 'NotAllowedError') showSoundHint(video);
    });
  });
  video.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse') stopHoverPreview(video);
  });
});
document.addEventListener('pause', event => {
  if (event.target instanceof HTMLVideoElement && event.target.closest('.cbi-hero-swiper')) syncHeroAutoplay();
}, true);
document.addEventListener('ended', event => {
  if (event.target instanceof HTMLVideoElement && event.target.closest('.cbi-hero-swiper')) syncHeroAutoplay();
}, true);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) [...hoverPreviews.keys()].forEach(stopHoverPreview);
  syncHeroAutoplay();
});
document.querySelector('.cbi-hero-auto').addEventListener('click', () => {
  userPausedAutoplay = !userPausedAutoplay;
  updateAutoplayButton();
  syncHeroAutoplay();
});
heroSwiper = new Swiper('.cbi-hero-swiper', {
  slidesPerView: 1,
  speed: reducedMotion ? 0 : 420,
  rewind: true,
  autoplay: reducedMotion ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
  keyboard: { enabled: true, onlyInViewport: true },
  navigation: { prevEl: '.cbi-hero-prev', nextEl: '.cbi-hero-next' },
  pagination: { el: '.cbi-hero-pagination', clickable: true, bulletElement: 'button' },
  a11y: { enabled: false },
  on: { slideChange: updateHeroControls }
});
heroSwiper.el.addEventListener('focusin', syncHeroAutoplay);
heroSwiper.el.addEventListener('focusout', () => queueMicrotask(syncHeroAutoplay));
new IntersectionObserver(entries => {
  heroInView = entries[0].isIntersecting;
  syncHeroAutoplay();
}, { threshold: 0.25 }).observe(document.querySelector('.cbi-hero-media'));
renderLanguage();
