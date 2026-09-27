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
} else if (project.id === 'video') {
  const section = document.createElement('section');
  section.className = 'scc-detail-video-story';
  const introduction = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = PROFILE_ZH ? '视频不停，购物信息要讲清' : 'Keep the video playing. Make the offer clear.';
  const description = document.createElement('p');
  description.textContent = PROFILE_ZH
    ? '购物卡叠在抖音推荐流的视频上，需要在有限空间里同时说明商品卖点、店铺背书、券后价和行动入口。'
    : 'The shopping card sits over a video in the Douyin feed. In a small space, it needs to show product value, store context, the price after coupons and a clear action.';
  introduction.append(title, description);

  const points = document.createElement('div');
  points.className = 'scc-detail-video-points';
  const details = PROFILE_ZH
    ? [
      ['01 / 信息', '让商品融入画面', '处理视频遮挡、半透明背景和双行动入口，让购物信息与内容同屏。'],
      ['02 / 体验', '守住首屏与弱网体验', '控制样式、动效和图片加载，并为弱网与异常场景准备降级。'],
      ['03 / 验证', '支持灰度与效果衡量', '梳理曝光、点击口径，让实验分层和迭代有可靠依据。']
    ]
    : [
      ['01 / SURFACE', 'Fit commerce into the frame', 'Balance video visibility, translucent layers and two actions within the same screen.'],
      ['02 / EXPERIENCE', 'Protect the feed experience', 'Keep styles, motion and image loading within the first-screen budget, with fallbacks for weak networks.'],
      ['03 / MEASUREMENT', 'Make iteration measurable', 'Define exposure and click tracking so staged experiments have reliable signals.']
    ];
  details.forEach(([label, heading, copy]) => {
    const item = document.createElement('section');
    const eyebrow = document.createElement('span');
    eyebrow.textContent = label;
    const itemTitle = document.createElement('h3');
    itemTitle.textContent = heading;
    const itemCopy = document.createElement('p');
    itemCopy.textContent = copy;
    item.append(eyebrow, itemTitle, itemCopy);
    points.append(item);
  });
  section.append(introduction, points);
  body.append(section);
} else {
  body.hidden = true;
}

const next = document.getElementById('scc-detail-next');
const nextProject = SCROLLCAROUSEL_PROJECTS[(index + 1) % SCROLLCAROUSEL_PROJECTS.length];
next.href = nextProject.url;
next.textContent = (PROFILE_ZH ? '下一个：' : 'Next: ') + nextProject.title + ' →';
