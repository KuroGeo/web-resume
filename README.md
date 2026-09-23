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
