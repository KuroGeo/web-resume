# 网页版简历

一个纯静态的匿名个人简历网站，适合部署到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173 --directory public
```

打开 `http://localhost:4173` 即可预览。

## 简历 PDF

保留现有双语两页 PDF 与阅读预览。公开 PDF 由私有内容源生成；网站预览图由同一份 PDF 渲染，避免两份内容不同步。

## GitHub Pages 部署

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 分支后，在 GitHub 仓库的 Pages 设置中选择 GitHub Actions 作为部署来源，之后每次推送都会自动发布 `public/` 目录。

如果你使用个人主页仓库，也可以把仓库命名为 `<github-username>.github.io`，部署完成后访问对应域名。

## 简历内容与 PDF

网页和公开中英文 PDF 由私有内容源统一生成。本仓库只接收允许公开的三个文件：

- `public/generated/resume.json`
- `public/downloads/resume-zh.pdf`
- `public/downloads/resume-en.pdf`

**不要手改生成数据或向 `public/` 放置私人版本。** 这里的所有源码和部署文件都可公开访问；隐藏链接不是权限控制。

网站的精选项目直接使用公开简历 `sections.projects.items` 的标题和描述；`scripts/build-resume-site.mjs` 只负责补充网站图片、分组和站内详情链接。这样私有源下次重新发布 PDF 时，首页项目会继续跟随公开简历的三项内容。

更新公开数据后，先生成网站适配文件，再预览：

```bash
node scripts/build-resume-site.mjs
python3 scripts/build-resume-previews.py  # 需要 Poppler 的 pdftoppm
node --test tests/resume-publishing.test.mjs
node tests/validate-site.mjs
python3 -m http.server 4173 --directory public
```

Pages 工作流也会执行构建和校验。现有项目交互保持同步加载，简历页提供当前语言 PDF 下载及可选择文本的 PDF 阅读。私人源文件、其他版本与渲染中间文件不进入本仓库。

首次上线顺序：先合入本仓库的网站适配与完整公开产物，再启用私有内容源的发布工作流。后续内容修改从私有仓库发布，网站接收三个产物后自动部署。

## 在本仓库编写、生成私有简历

需要 Node.js 22+、uv，以及已在本机授权访问的私有 `KuroGeo/resume` checkout（需包含 `content/catalog.yaml` 和 `scripts/resume_variant.py`）。无需安装 npm 依赖。

```bash
npm run resume:setup -- /absolute/path/to/private/resume
npm run resume:list
npm run resume:edit                     # 打开共享内容源
npm run resume:edit -- <版本名>         # 同时打开该版本的选取/覆盖配置
npm run resume:pdf -- <版本名>
npm run resume:preview -- <版本名>      # 重新生成，再用本机 PDF 阅读器打开
npm run resume:pdf -- public-zh         # 生成公开两页版，不发布
npm run resume:preview -- public-en
```

版本名以 `resume:list` 的本机输出为准。共享文本在私有 `content/catalog.yaml` 中；仅针对某一岗位的修改放在该版本配置的 `overrides` 中，避免改变其他版本。编辑后的保存由编辑器完成。

本地配置写入被 Git 忽略的 `.resume-local/config.json`；也可通过 `RESUME_REPO` 指定源目录。新 checkout 需要单独配置。命令不会自动 clone、pull、commit 或 push，不会覆盖已有私有工作区的编辑。

macOS 默认用文本编辑器编辑 YAML、默认 PDF 阅读器预览；Linux 使用 `xdg-open`。可用 `RESUME_EDITOR` 指定编辑器可执行文件（例如 `RESUME_EDITOR=code npm run resume:edit`；不接受包含参数的 shell 命令）。其他平台可按命令打印的路径打开文件。

输出留在私有 checkout：私人版本位于 `.private-build/<版本名>/`，公开版位于 `.public-build/bundle/`。内容、版本名和 PDF 不复制到本仓库；不要将私有仓库放入 `web-resume/` 内。公开版的发布仍需在私有仓库按现有流程提交白名单内容。

## 浏览器简历工作台

```bash
npm run resume:studio
```

打开 `http://127.0.0.1:8767`。需先完成 `resume:setup`，并安装 Poppler（macOS: `brew install poppler`，用于实际 PDF 页面预览）。

- 左侧选择版本，中间按章节编辑表单，右侧查看生成的 PDF。
- 启动时检查每份简历的本地 PDF 缓存，仅内容版本变化或产物缺失时预生成；切换版本直接读取已备好的 PDF。再次启动会复用未过期的产物。
- 私人版本的表单修改写入该版本 `overrides`；公开版修改写入公开内容引用的共享字段，保存不会自动提交或发布。
- “源码”编辑版本配置 YAML；切换编辑方式前需先保存。保存时检测文件版本，拒绝覆盖其他窗口的新修改。
- 保存后仅重新生成受改动影响的版本（共享内容变化会影响多份简历），并刷新真实页面；未保存和待生成状态会明确显示。可翻页和下载。
- 每次保存前的备份、渲染产物都留在私有仓库的 `.private-build/studio/`。
- 服务只绑定回环地址，校验 Host、Origin 和会话令牌；工作台代码位于 `tools/`，不会随 `public/` 部署。

这是本地工作台，不是公开网站的后台；关闭终端进程即停止服务。
