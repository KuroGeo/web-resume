# 网页版简历

一个纯静态的匿名个人简历网站，适合部署到 GitHub Pages。

## 本地预览

```bash
python3 -m http.server 4173 --directory public
```

打开 `http://localhost:4173` 即可预览。

## 简历 PDF

简历源文件是 `public/assets/docs/George-Ye-Resume.typ`。用 [Typst](https://typst.app/) 同时生成中英文 A4 PDF 与两页网页预览图：

```bash
for edition in en zh; do
  label=$(printf '%s' "$edition" | tr '[:lower:]' '[:upper:]')
  typst compile --input language="$edition" public/assets/docs/George-Ye-Resume.typ "public/assets/docs/George-Ye-Resume-$label.pdf"
  typst compile --format png --ppi 180 --input language="$edition" public/assets/docs/George-Ye-Resume.typ "public/assets/docs/George-Ye-Resume-$label-{p}.png"
done
```

网站根据语言设置选用同一版本的 PDF 和两张预览图。

## GitHub Pages 部署

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 分支后，在 GitHub 仓库的 Pages 设置中选择 GitHub Actions 作为部署来源，之后每次推送都会自动发布 `public/` 目录。

如果你使用个人主页仓库，也可以把仓库命名为 `<github-username>.github.io`，部署完成后访问对应域名。
