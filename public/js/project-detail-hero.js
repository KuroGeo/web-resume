/* Shared first-viewport renderer: the flip surface and real detail page use identical markup/data. */
(function () {
  'use strict';
  window.ProjectDetailHero = {
    render: function (root, index) {
      var project = SCROLLCAROUSEL_PROJECTS[index];
      if (!project) return null;
      var category = SCROLLCAROUSEL_CATEGORY_LABELS[project.category] || project.category;
      function text(id, value) { var el = root.querySelector('#' + id); if (el) el.textContent = value; }
      text('scc-detail-number', 'Project ' + String(index + 1).padStart(2, '0') + ' / ' + SCROLLCAROUSEL_PROJECTS.length);
      text('scc-detail-title', project.title.replace('E-commerce', 'E‑commerce'));
      text('scc-detail-meta', project.year + ' · ' + category + ' · ' + project.company);
      var intro = project.id === 'ai'
        ? (PROFILE_ZH
          ? '把 AI 生成能力接入内容消费与送礼决策，覆盖 App 内容体验、素材管理和导购对话。'
          : 'Bringing AI-generated content into the shopping journey, from an app and content workflows to a conversational gift assistant.')
        : project.id === 'video'
          ? (PROFILE_ZH
            ? '让用户边看短视频，边看懂商品、优惠与购买入口。'
            : 'Helping viewers understand the product, offer and next step without leaving the video.')
          : project.summary + (project.sceneNote ? ' ' + project.sceneNote : '');
      text('scc-detail-summary', intro);
      var section = root.querySelector('.scc-detail-hero');
      if (section) {
        section.dataset.media = project.id === 'ai' || project.id === 'video' ? 'portrait' : 'landscape';
        section.dataset.project = project.id;
      }
      var more = root.querySelector('#scc-detail-more');
      var moreTargets = { ai: './work/bytedance/#ai-innovation', video: './work/bytedance/#video-commerce-card' };
      if (more && moreTargets[project.id]) {
        more.href = moreTargets[project.id];
        more.textContent = PROFILE_ZH ? '查看完整项目 ↗' : 'Explore the full project ↗';
        more.hidden = false;
      }
      var media = root.querySelector('#scc-detail-hero-media');
      var hero = media && (media.querySelector('img') || media.appendChild(media.ownerDocument.createElement('img')));
      if (hero) {
        hero.id = 'scc-detail-hero-image';
        hero.fetchPriority = 'high';
        hero.src = project.hero || project.thumb;
        hero.alt = project.id === 'ai'
          ? (PROFILE_ZH ? 'AI 生成的商品内容与虚拟小人界面' : 'AI-generated product content and virtual assistant screen')
          : project.title;
      }
      return hero;
    }
  };
})();
