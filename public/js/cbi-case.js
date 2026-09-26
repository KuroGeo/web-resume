'use strict';

// This case study is site-specific editorial material. Résumé/PDF data stays in the private source.
const copy = {
  en: {
    skip: 'Skip to project', back: 'Back to project index', meta: '2026 · AI ad creation and campaign platform',
    title: 'Make the idea. Shape the video. One canvas.',
    lead: 'Connect reference video, product imagery and text as nodes, then keep refining the script, shots and final cut in one canvas. These demos show the creative production side of the project.',
    explore: 'Explore the demos ↓', visit: 'Visit website ↗', heroCaption: 'Reference-video replication · output clip',
    navReference: 'Reference replication', navProduct: 'Product replacement', navScenes: 'Creative scenarios', navGlobal: 'Global adaptation', navInterface: 'The interface', navRole: 'My role',
    referenceTitle: 'From reference video to new creative',
    referenceIntro: 'Start with a reference video and product image. Break the material into a canvas flow, generate candidate clips and combine them into a new video. The input and result sit together for direct comparison.',
    before: 'Input', after: 'Output', referenceBefore: 'Reference video', referenceAfter: 'New product clip',
    referenceFlow: 'Canvas flow: inputs → replication and candidate generation → video assembly', zoom: 'Open full size ↗',
    productTitle: 'Place a product into an existing shot',
    productIntro: 'A focused example: use product imagery and a person’s reference video to generate a clip with different clothing while retaining the original shot structure.',
    productBefore: 'Original person and shot', productAfter: 'Product outfit replacement',
    productFlow: 'Canvas flow: product image + reference video → replication node → new clip',
    scenesTitle: 'One canvas, different creative paths',
    scenesIntro: 'The same node-based approach combines images, character references, text and video. These three demos show creative range; they do not represent campaign performance.',
    commerceTitle: 'Commerce video', commerceBody: 'Character imagery and copy guide shot generation, then the product-introduction clips are combined.',
    vlogTitle: 'Lifestyle vlog', vlogBody: 'A person reference connects character setup, scene imagery and video segments.',
    filmTitle: 'Cinematic scene', filmBody: 'A miniature character enters an oversized home, using scale, light and a continuous shot to shape the scene.',
    flowLink: 'View canvas flow ↗',
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
    openImage: 'Open full image ↗',
    roleTitle: 'My role',
    roleIntro: 'I led the creative canvas architecture and delivery from the ground up, connecting frontend interaction, backend services and model capabilities while moving requirements forward. The supplied material covers creative demos; it does not show the campaign agent.',
    roleCanvas: 'Canvas and interaction', roleCanvasBody: 'Organized nodes, asset references and creation flows so inputs and generated results could be edited on the same canvas.',
    roleDelivery: 'Generation pipeline', roleDeliveryBody: 'Worked across backend services and model integrations to deliver image, video and creative-replication tasks.',
    roleTeam: 'Product delivery', roleTeamBody: 'Broke down requirements, shaped solutions and coordinated iteration around working demos.'
  }
};

let language = 'zh';
try { language = localStorage.getItem('resume-language') === 'en' ? 'en' : 'zh'; } catch {}

function renderLanguage() {
  const english = language === 'en';
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  document.title = english ? 'CBI · AIGC Canvas — George Y.' : 'CBI · AIGC 无限画布 — George Y.';
  document.querySelectorAll('[data-copy]').forEach(element => {
    if (!element.dataset.zh) element.dataset.zh = element.textContent;
    element.textContent = english ? copy.en[element.dataset.copy] : element.dataset.zh;
  });
  document.querySelectorAll('[data-alt-en]').forEach(image => {
    if (!image.dataset.zhAlt) image.dataset.zhAlt = image.alt;
    image.alt = english ? image.dataset.altEn : image.dataset.zhAlt;
  });
  document.getElementById('cbi-language').textContent = english ? '中文' : 'EN';
}

document.getElementById('cbi-language').addEventListener('click', () => {
  language = language === 'zh' ? 'en' : 'zh';
  try { localStorage.setItem('resume-language', language); } catch {}
  renderLanguage();
});

// Native controls can start any clip independently. Keep playback exclusive across the case study.
document.addEventListener('play', event => {
  if (!(event.target instanceof HTMLVideoElement)) return;
  document.querySelectorAll('video').forEach(video => {
    if (video !== event.target && !video.paused) video.pause();
  });
}, true);
renderLanguage();
