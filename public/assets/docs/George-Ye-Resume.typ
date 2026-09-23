#let language = sys.inputs.at("language", default: "en")
#let chinese = language == "zh"

#set page(paper: "a4", margin: (left: 13mm, right: 13mm, top: 24mm, bottom: 18mm))
#set text(font: ("New Computer Modern", "Songti SC"), size: 10pt, fill: rgb("191919"))
#set par(justify: true, leading: 0.38em)

#let section(title) = [
  #v(9pt)
  #text(size: 12pt, smallcaps(title))
  #v(1pt)
  #line(length: 100%, stroke: 0.55pt)
  #v(3pt)
]

#let entry(title, place, role, date, body) = [
  #grid(columns: (1fr, auto), gutter: 8pt,
    [#strong(title)], [#place],
    [#emph(role)], [#emph(date)])
  #v(2pt)
  #body
  #v(7pt)
]

#let bullet(label, body) = [
  #show grid: set block(spacing: 4pt)
  #grid(columns: (9pt, 1fr), gutter: 3pt,
    [•], [#strong(label) #body])
  #v(3pt)
]

#let project(title, date, role, body, first: false) = [
  #if not first [#line(length: 100%, stroke: 0.45pt)]
  #v(13pt)
  #grid(columns: (1fr, auto), gutter: 8pt,
    [#strong(title)], [#date])
  #emph(role)
  #v(6pt)
  #body
  #v(19pt)
]

#grid(columns: (1fr, auto), gutter: 10pt,
  [#text(size: 19pt, weight: "bold")[George Y.] \
   #link("https://github.com/KuroGeo")[github.com/KuroGeo]],
  [#align(right)[#link("https://www.linkedin.com/in/george-y-2303572b2/")[LinkedIn ↗] \
   AI Application Engineer]])

#if chinese [
  #section("教育背景")
  #entry("华南理工大学", "中国 · 广州", "信息工程，本科", "2017 — 2021", [])

  #section("能力概览")
  #bullet([方向：], [高流量电商体验、移动端与跨端开发、AI 应用原型、交互与性能优化。])
  #bullet([技术：], [Web 前端、React Native、Lynx、多宿主适配、实时语音与 AI Agent 产品集成。])

  #section("工作经历")
  #entry("ByteDance · 抖音电商", "中国", "前端工程师 · 移动端与跨端", "2021.06 — 2026.04", [
    围绕购物、店铺与短视频内容场景开发前端产品。在复杂的跨端和多宿主环境中，兼顾用户体验、渲染性能、灰度发布与稳定性。
  ])
  #bullet([店铺与流量入口：], [建设可复用的进店组件与店铺基础体验，覆盖商品、搜索、直播、账号主页和分享等场景。])
  #bullet([跨端混排：], [参与 Native 列表与 Lynx 楼层的混排框架，让商家模块在店铺橱窗里稳定呈现与快速迭代。])
  #bullet([第三方组件：], [参与小程序 DSL 到 Lynx 的组件迁移、调试工具与缓存链路建设，提升店铺楼层的渲染效率。])
  #bullet([多宿主电商：], [参与将商品、店铺和交易能力接入今日头条、番茄小说、西瓜视频、悟空浏览器、懂车帝等内容 App。])
  #bullet([内容与 AI：], [迭代推荐流购物卡；参与 AI 送礼助手 POC，将生成内容、虚拟导购、实时语音与 Agent 问答组成可用体验。])

  #section("工作方式")
  在高流量场景中，我关注从用户目标到工程落地的完整链路：清楚表达信息、复用跨端能力、记录曝光与点击、控制性能预算，并为弱网和异常场景准备降级路径。

  #pagebreak()
  #section("精选项目")
  #project("AI 送礼助手", "2025 · ByteDance", "AI 应用 / 产品原型", [
    面向礼物选择场景，使用 AI 生成商品卖点与推荐话术，以虚拟导购承接介绍；用户可通过实时语音或文字继续追问，Agent 围绕商品和适用人群作答。重点探索内容生成、角色化表达与对话入口如何组成连续体验。
  ], first: true)
  #project("店铺首页 Native × 跨端混排", "2023 · ByteDance", "跨端渲染 / 店铺体验", [
    店铺信息区由 Native 保持稳定，猜你喜欢、直播爆款和排行榜等楼层由跨端组件承接配置与复用。参与图层边界、列表协作、数据协议、性能与异常兜底的设计和实现。
  ])
  #project("第三方店铺组件迁移", "2023 · ByteDance", "Lynx 组件生态 / 调试工具", [
    参与将依赖 H5 容器的第三方店铺模块迁移到 Lynx 渲染链路，建设组件调试与预览能力，并处理样式一致性、缓存策略和宿主差异。
  ])
  #project("多宿主电商 SaaS", "2022 · ByteDance", "商品、店铺与交易链路", [
    把电商能力以可配置、可观测的方式接入多个内容 App。针对不同宿主处理入口展示、数据协议、页面表现与工程边界，让同一套能力在不同消费场景中稳定复用。
  ])
  #project("短视频电商异形卡", "2025 — 2026 · ByteDance", "推荐流 / 商业表达", [
    在短视频画面上承接商品卖点、店铺背书、优惠券与价格信息，持续优化卡片交互、营销样式和动效，同时关注首屏性能、实验灰度、曝光点击口径及弱网降级。
  ])
] else [
  #section("Education")
  #entry("South China University of Technology", "Guangzhou, China", "B.Eng. in Electronic and Communication Engineering", "2017 — 2021", [])

  #section("Skills Summary")
  #bullet([Focus:], [High-traffic commerce, mobile and cross-platform interfaces, AI product prototypes, interaction and performance.])
  #bullet([Tools:], [Web frontend, React Native, Lynx, multi-host integration, realtime voice and AI agent experiences.])

  #section("Professional Experience")
  #entry("ByteDance, Douyin E-commerce", "China", "Frontend Engineer · Mobile & Cross-platform", "Jun 2021 — Apr 2026", [
    Built shopping, storefront and short-video experiences. Worked across Native, web and cross-platform surfaces while balancing interface quality, rendering speed, release safety and reliability.
  ])
  #bullet([Storefront and discovery:], [Built reusable store-entry components and core browsing experiences across products, search, livestreams, profiles and sharing.])
  #bullet([Mixed rendering:], [Helped combine Native lists with Lynx-driven merchant sections, making storefront modules both stable and fast to iterate.])
  #bullet([Partner components:], [Worked on the migration of third-party store modules to Lynx, plus debugging, preview and caching workflows.])
  #bullet([Commerce across hosts:], [Adapted product, store and transaction capabilities for Toutiao, Fanqie Novel, Xigua Video, Wukong Browser and Dongchedi.])
  #bullet([Content and AI:], [Improved in-feed shopping cards and prototyped an AI gift assistant with generated content, a virtual guide, realtime voice and agent Q&A.])

  #section("Approach")
  I work across the full path from user intent to implementation: clear information design, reusable cross-platform components, measurable exposure and click flows, performance budgets, and graceful fallback under weak networks or partial failure.

  #pagebreak()
  #section("Selected Projects")
  #project("AI Gift Assistant", "2025 · ByteDance", "AI application / Product prototype", [
    Explored gift selection through AI-generated product highlights and recommendation copy. A virtual guide introduced products; users could continue through realtime voice or text, while an agent answered questions about products, recipients and reasons to buy. The prototype tested how generated content, character and conversation can form one continuous shopping experience.
  ], first: true)
  #project("Native × Cross-platform Storefront", "2023 · ByteDance", "Rendering architecture / Store experience", [
    Kept the store identity area Native for reliable app behavior, while recommendations, livestream products and rankings used configurable cross-platform sections. Worked on the boundaries between layers, list behavior, data contracts, performance and graceful fallback.
  ])
  #project("Third-party Store Components", "2023 · ByteDance", "Lynx ecosystem / Developer tools", [
    Helped move merchant-built store sections from H5 containers into the Lynx rendering path. The work covered component debugging and preview, visual consistency, caching policy and differences between host apps.
  ])
  #project("Multi-host Commerce SaaS", "2022 · ByteDance", "Product, store and transaction surfaces", [
    Packaged commerce capabilities for several content apps as configurable, observable surfaces. Adapted entry points, data contracts and interface behavior to each host while keeping the underlying user experience and engineering boundaries consistent.
  ])
  #project("Shopping Cards in Short Videos", "2025 — 2026 · ByteDance", "In-feed commerce / Interaction", [
    Brought product value, store context, coupons and pricing into short-video viewing. Improved card interactions, promotional styles and motion while accounting for first-screen performance, experiment rollout, measurement and weak-network fallback.
  ])
]
