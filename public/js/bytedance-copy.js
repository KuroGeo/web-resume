// Page-specific copy sits outside the generated public résumé bundle.
const innovationCopy = {
  zh: {
    kicker: '2025 · 抖音电商 AI 创新',
    title: '从内容生产到导购对话的 AI 产品探索',
    intro: '参与 AI 创新团队的产品原型，把模型生成能力接入用户看内容、挑商品和运营素材的具体流程。',
    appTitle: 'AI 内容 App',
    appBody: '负责 App 前端与多 Feed 内容消费链路，并建设 B 端内容管理平台，让生成内容有展示、管理和迭代的入口。',
    workflowTitle: '模型与工作流接入',
    workflowBody: '在送礼助手中维护 Agent 对话与素材管理，接入 Coze 工作流和火山引擎模型，生成可用于导购场景的内容素材。',
    exploreTitle: '更多电商场景',
    exploreBody: '探索手机智能对比与商品文案改写，关注 AI 输出如何帮助用户比较商品、理解卖点并继续决策。'
  },
  en: {
    kicker: '2025 · Douyin E-commerce AI Innovation',
    title: 'Exploring AI products from content creation to shopping conversations',
    intro: 'Worked with the AI innovation team on prototypes that brought model-generated content into browsing, shopping decisions, and asset operations.',
    appTitle: 'AI Content App',
    appBody: 'Built the app frontend and multi-feed content experience, plus a content management platform for teams to display, manage, and iterate on generated content.',
    workflowTitle: 'Models and workflows',
    workflowBody: 'Maintained gift-assistant agent conversations and assets, integrating Coze workflows with Volcano Engine models to generate content for shopping use cases.',
    exploreTitle: 'Other commerce ideas',
    exploreBody: 'Explored intelligent phone comparisons and AI-written product copy, focusing on helping shoppers compare options and understand product value.'
  }
};

const applyInnovationCopy = () => {
  const language = document.documentElement.dataset.language === 'en' ? 'en' : 'zh';
  document.querySelectorAll('[data-bytedance-copy]').forEach((element) => {
    element.textContent = innovationCopy[language][element.dataset.bytedanceCopy];
  });
};

new MutationObserver(applyInnovationCopy).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-language']
});
applyInnovationCopy();
