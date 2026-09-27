'use strict';
const requested = Number(new URLSearchParams(location.search).get('project'));
const index = Number.isInteger(requested) && requested >= 0 && requested < SCROLLCAROUSEL_PROJECTS.length ? requested : 0;
const project = SCROLLCAROUSEL_PROJECTS[index];
ProjectDetailHero.render(document, index);
document.documentElement.lang = PROFILE_ZH ? 'zh-CN' : 'en';
document.title = project.title + ' — George Y.';

const body = document.getElementById('scc-detail-content');
body.replaceChildren();
if (project.id === 'ai') {
  const feature = document.createElement('section');
  feature.className = 'scc-detail-feature';
  const copy = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = PROFILE_ZH ? '从内容到导购对话' : 'From content to conversation';
  const description = document.createElement('p');
  description.textContent = PROFILE_ZH
    ? '负责 AI 内容 App 前端、多 Feed 内容消费链路和 B 端内容管理平台。在送礼助手中维护 Agent 对话与素材管理，接入 Coze 工作流和火山引擎模型；也探索手机智能对比与商品文案改写。'
    : 'Built the AI content app frontend, multi-feed experience and content management platform. For the gift assistant, I maintained Agent conversations and assets, integrated Coze workflows with Volcano Engine models, and explored phone comparisons and AI-written product copy.';
  copy.append(title, description);

  const figure = document.createElement('figure');
  const image = document.createElement('img');
  image.src = 'assets/ai-commerce/gift-assistant-agent.jpeg';
  image.width = 359;
  image.height = 782;
  image.loading = 'lazy';
  image.alt = PROFILE_ZH ? '送礼助手的 Agent 对话界面' : 'Gift assistant Agent conversation screen';
  const caption = document.createElement('figcaption');
  caption.textContent = PROFILE_ZH ? '送礼助手 · Agent 对话' : 'Gift assistant · Agent conversation';
  figure.append(image, caption);
  feature.append(copy, figure);
  body.append(feature);
} else {
  body.hidden = true;
}

const next = document.getElementById('scc-detail-next');
const nextProject = SCROLLCAROUSEL_PROJECTS[(index + 1) % SCROLLCAROUSEL_PROJECTS.length];
next.href = nextProject.url;
next.textContent = (PROFILE_ZH ? '下一个：' : 'Next: ') + nextProject.title + ' →';
