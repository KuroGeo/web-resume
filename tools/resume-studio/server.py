"""Loopback-only workbench; imports rendering/content logic from the private checkout."""

from __future__ import annotations
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs

ASSETS = Path(__file__).resolve().parent
LABELS = {
    "name": "姓名 / 名称",
    "headline": "职位方向",
    "role": "职位",
    "connections": "联系方式",
    "title": "标题",
    "label": "标签",
    "date": "时间",
    "place": "地点",
    "paragraphs": "内容",
    "company": "公司",
    "position": "职位",
    "start_date": "开始时间",
    "end_date": "结束时间",
    "location": "地点",
    "highlights": "经历要点",
    "summary": "简介",
    "institution": "学校",
    "area": "专业",
    "degree": "学位",
    "details": "内容",
    "email": "邮箱",
    "phone": "电话",
    "url": "链接",
    "placeholder": "显示文字",
}


class Conflict(ValueError):
    pass


class Store:
    def __init__(self, repo):
        self.repo = Path(repo).resolve()
        sys.path.insert(0, str(self.repo / "scripts"))
        from resume_content import (
            load_catalog,
            project_public,
            resolve_variant,
            validate_public_data,
            write_yaml,
        )
        from ruamel.yaml import YAML

        self.load, self.project, self.resolve, self.validate, self.write = (
            load_catalog,
            project_public,
            resolve_variant,
            validate_public_data,
            write_yaml,
        )
        self.YAML = YAML
        self.lock = threading.Lock()
        self.preview = {}
        self.build = self.repo / ".private-build/studio"
        self.safe(self.build)
        self.build.mkdir(parents=True, exist_ok=True)

    def safe(self, path):
        path = Path(path).absolute()
        if not path.is_relative_to(self.repo):
            raise ValueError("路径必须位于私有仓库。")
        for part in (path, *path.parents):
            if part == self.repo.parent:
                break
            if part.is_symlink():
                raise ValueError("不支持符号链接路径。")
        return path

    def config_path(self, version):
        if version in ("public-en", "public-zh"):
            return self.safe(self.repo / "content/variants/public.yaml")
        if not re.fullmatch(r"resume_[\w-]+", version):
            raise ValueError("无效版本。")
        path = self.safe(self.repo / "content/variants/private" / f"{version}.yaml")
        if not path.is_file():
            raise ValueError("版本不存在。")
        return path

    def load_state(self, version):
        path = self.config_path(version)
        catalog_path = self.safe(self.repo / "content/catalog.yaml")
        catalog, config = self.load(catalog_path), self.load(path)
        revision = hashlib.sha256(
            catalog_path.read_bytes() + path.read_bytes()
        ).hexdigest()
        public = version.startswith("public-")
        if public:
            data = self.project(catalog, config)
            self.validate(data)
            doc = data["locales"][version[-2:]]
        else:
            doc = self.resolve(catalog, config)["cv"]
        return path, catalog, config, revision, doc

    def fields(self, version, catalog, config, doc):
        public = version.startswith("public-")
        root = (
            config["document"]["locales"][version[-2:]]
            if public
            else config["document"]["cv"]
        )
        fields = []

        def walk(value, path, group, context=""):
            ref = isinstance(value, dict) and "ref" in value
            if ref:
                values = config.get("overrides", {}).get(value["ref"], {})
                actual = values.get(
                    value["lang"], catalog["entries"][value["ref"]][value["lang"]]
                )
            else:
                actual = value
            if isinstance(actual, datetime.date):
                actual = actual.isoformat()
            if isinstance(actual, str):
                key = next((p for p in reversed(path) if isinstance(p, str)), "")
                if key in ("id", "fontawesome_icon", "network"):
                    return
                fields.append(
                    {
                        "id": json.dumps(path, ensure_ascii=False),
                        "label": LABELS.get(key, key),
                        "group": group,
                        "context": context,
                        "value": actual,
                        "multiline": key
                        in ("paragraphs", "highlights", "summary", "details")
                        or len(actual) > 90,
                    }
                )
            elif isinstance(actual, dict):
                for key, child in actual.items():
                    walk(child, path + [key], group, context)
            elif isinstance(actual, list):
                for i, child in enumerate(actual):
                    walk(child, path + [i], group, context or f"条目 {i + 1}")

        if public:
            walk(root["identity"], ["identity"], "基本信息")
            for i, section in enumerate(root["sections"]):
                group = doc["sections"][i]["title"]
                for key in ("title",):
                    walk(section[key], ["sections", i, key], group)
                for j, item in enumerate(section["items"]):
                    context = (
                        doc["sections"][i]["items"][j].get("title")
                        or doc["sections"][i]["items"][j].get("label")
                        or f"条目 {j + 1}"
                    )
                    walk(item, ["sections", i, "items", j], group, context)
        else:
            for key, value in root.items():
                if key != "sections":
                    walk(value, [key], "基本信息")
            for group, items in root.get("sections", {}).items():
                walk(items, ["sections", group], group)
        return fields

    def get(self, version):
        path, cat, cfg, rev, doc = self.load_state(version)
        public = version.startswith("public-")
        return {
            "version": version,
            "public": public,
            "name": doc.get("identity", doc).get("name", version),
            "revision": rev,
            "fields": self.fields(version, cat, cfg, doc),
            "source": path.read_text(),
            "preview": self.preview.get(version),
        }

    def versions(self):
        names = ["public-zh", "public-en"] + [
            p.stem
            for p in sorted((self.repo / "content/variants/private").glob("*.yaml"))
        ]
        result = []
        for name in names:
            _, _, _, _, doc = self.load_state(name)
            identity = doc.get("identity", doc)
            result.append(
                {
                    "id": name,
                    "name": (
                        "公开版 · 中文" if name == "public-zh" else "公开版 · English"
                    )
                    if name.startswith("public-")
                    else identity.get("headline", name),
                    "detail": identity.get("name", ""),
                    "public": name.startswith("public-"),
                }
            )
        return result

    def atomic(self, path, data):
        self.safe(path)
        backup = self.safe(self.build / "backups" / f"{secrets.token_hex(12)}.yaml")
        backup.parent.mkdir(exist_ok=True)
        backup.write_bytes(path.read_bytes())
        fd, temp = tempfile.mkstemp(dir=path.parent, suffix=".yaml")
        os.close(fd)
        try:
            self.write(Path(temp), data)
            os.chmod(temp, path.stat().st_mode & 0o777)
            os.replace(temp, path)
        finally:
            if Path(temp).exists():
                Path(temp).unlink()

    def validate_private(self, catalog, config):
        data = self.resolve(catalog, config)
        cv = data.get("cv") if isinstance(data, dict) else None
        if not isinstance(cv, dict) or not isinstance(cv.get("name"), str):
            raise ValueError("私人版本必须包含 cv 对象及文本类型的 name。")
        if "sections" in cv and not isinstance(cv["sections"], dict):
            raise ValueError("cv.sections 必须是章节对象。")
        return data

    def save(self, version, body):
        path, cat, cfg, rev, doc = self.load_state(version)
        if body.get("revision") != rev:
            raise Conflict("文件已被其他窗口修改。请重新载入后再编辑，当前输入仍保留。")
        public = version.startswith("public-")
        if "source" in body:
            updated = self.YAML(typ="safe").load(body["source"])
            if not isinstance(updated, dict):
                raise ValueError("版本配置必须是 YAML 对象。")
            if public:
                self.validate(self.project(cat, updated))
            else:
                self.validate_private(cat, updated)
            self.atomic(path, updated)
        else:
            allowed = {f["id"]: f for f in self.fields(version, cat, cfg, doc)}
            changes = body.get("changes", {})
            if not isinstance(changes, dict) or set(changes) - set(allowed):
                raise ValueError("包含未知字段。")
            root = (
                cfg["document"]["locales"][version[-2:]]
                if public
                else cfg["document"]["cv"]
            )
            catalog_changed = config_changed = False
            assigned = {}
            for key, text in changes.items():
                if not isinstance(text, str) or len(text) > 30000:
                    raise ValueError("文本格式或长度不正确。")
                if text == allowed[key]["value"]:
                    continue
                parts = json.loads(key)
                parent = root
                for part in parts[:-1]:
                    parent = parent[part]
                leaf = parent[parts[-1]]
                if isinstance(leaf, dict) and "ref" in leaf:
                    pair = (leaf["ref"], leaf["lang"])
                    if pair in assigned and assigned[pair] != text:
                        raise ValueError("同一共享字段有不同修改，请统一后保存。")
                    assigned[pair] = text
                    if public:
                        cat["entries"][pair[0]][pair[1]] = text
                        catalog_changed = True
                    else:
                        cfg.setdefault("overrides", {}).setdefault(pair[0], {})[
                            pair[1]
                        ] = text
                        config_changed = True
                else:
                    parent[parts[-1]] = text
                    config_changed = True
            if public:
                self.validate(self.project(cat, cfg))
            else:
                self.validate_private(cat, cfg)
            # Refuse mixed-file changes rather than risking a partial transaction.
            if catalog_changed and config_changed:
                raise ValueError("共享内容和内联配置请分两次保存。")
            if catalog_changed:
                self.atomic(self.repo / "content/catalog.yaml", cat)
            if config_changed:
                self.atomic(path, cfg)
        return self.get(version)

    def render(self, version, revision):
        _, _, _, rev, _ = self.load_state(version)
        if revision != rev:
            raise Conflict("文件已更新，请重新载入后再生成 PDF。")
        directory = self.safe(self.build / secrets.token_hex(12))
        directory.mkdir()
        if version.startswith("public-"):
            subprocess.run(
                [
                    sys.executable,
                    str(self.repo / "scripts/build_public_resume.py"),
                    "--output",
                    str(directory / "bundle"),
                ],
                cwd=self.repo,
                check=True,
                capture_output=True,
                timeout=180,
            )
            pdf = directory / "bundle/public/downloads" / f"resume-{version[-2:]}.pdf"
        else:
            target = self.safe(self.repo / ".private-build" / version)
            if target.exists() and any(p.is_symlink() for p in target.rglob("*")):
                raise ValueError("构建目录含符号链接。")
            subprocess.run(
                [sys.executable, str(self.repo / "scripts/resume_variant.py"), version],
                cwd=self.repo,
                check=True,
                capture_output=True,
                timeout=180,
            )
            pdf = self.safe(target / (version + ".pdf"))
        from pypdf import PdfReader

        pages = len(PdfReader(pdf).pages)
        subprocess.run(
            ["pdftoppm", "-r", "115", "-png", str(pdf), str(directory / "page")],
            check=True,
            capture_output=True,
            timeout=90,
        )
        current = self.load_state(version)[3]
        info = {
            "id": directory.name,
            "pages": pages,
            "revision": rev,
            "stale": current != rev,
        }
        (directory / "document.pdf").write_bytes(pdf.read_bytes())
        self.preview[version] = info
        return info


def authorize(headers, path, port, token):
    if headers.get("Host") != f"127.0.0.1:{port}":
        raise PermissionError("仅限本机访问。")
    origin = headers.get("Origin")
    if origin and origin != f"http://127.0.0.1:{port}":
        raise PermissionError("不允许跨站请求。")
    parsed = urlparse(path)
    query = parse_qs(parsed.query)
    if parsed.path.startswith("/api/") and not secrets.compare_digest(
        headers.get("X-Studio-Token", query.get("token", [""])[0]), token
    ):
        raise PermissionError("会话失效，请刷新页面。")
    return parsed.path, query


def serve(repo, port):
    store = Store(repo)
    token = secrets.token_urlsafe(32)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def send(self, status, data, kind="application/json; charset=utf-8"):
            payload = (
                json.dumps(data, ensure_ascii=False, default=str).encode()
                if isinstance(data, (dict, list))
                else data
            )
            self.send_response(status)
            self.send_header("Content-Type", kind)
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header(
                "Content-Security-Policy",
                "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; frame-ancestors 'none'; connect-src 'self'",
            )
            self.end_headers()
            self.wfile.write(payload)

        def route(self):
            return authorize(self.headers, self.path, port, token)

        def do_GET(self):
            try:
                path, q = self.route()
                if path in ("/", "/style.css", "/app.js"):
                    name = "index.html" if path == "/" else path[1:]
                    data = (ASSETS / name).read_bytes()
                    if path == "/":
                        data = data.replace(b"__TOKEN__", token.encode())
                    return self.send(
                        200,
                        data,
                        {
                            "index.html": "text/html; charset=utf-8",
                            "style.css": "text/css",
                            "app.js": "text/javascript",
                        }[name],
                    )
                if path == "/api/versions":
                    return self.send(200, store.versions())
                if path == "/api/document":
                    return self.send(200, store.get(q.get("version", [""])[0]))
                if path == "/api/artifact":
                    ident = q.get("id", [""])[0]
                    name = q.get("file", [""])[0]
                    if not re.fullmatch("[0-9a-f]{24}", ident) or not re.fullmatch(
                        r"(document\.pdf|page-\d+\.png)", name
                    ):
                        raise ValueError("无效产物。")
                    file = store.safe(store.build / ident / name)
                    return self.send(
                        200,
                        file.read_bytes(),
                        "application/pdf" if name.endswith(".pdf") else "image/png",
                    )
                self.send(404, {"error": "页面不存在。"})
            except PermissionError as e:
                self.send(403, {"error": str(e)})
            except Exception:
                self.send(400, {"error": "无法读取内容。请检查版本或重新生成预览。"})

        def do_POST(self):
            try:
                path, _ = self.route()
                if self.headers.get("Content-Type") != "application/json":
                    raise ValueError("需要 JSON 请求。")
                size = int(self.headers.get("Content-Length", "0"))
                if not 0 < size <= 2000000:
                    raise ValueError("请求过大或为空。")
                body = json.loads(self.rfile.read(size))
                version = body.get("version", "")
                if not store.lock.acquire(blocking=False):
                    return self.send(
                        409, {"error": "另一个保存或生成任务正在进行，请稍后重试。"}
                    )
                try:
                    if path == "/api/save":
                        result = store.save(version, body)
                    elif path == "/api/render":
                        result = store.render(version, body.get("revision"))
                    else:
                        raise ValueError("操作不存在。")
                finally:
                    store.lock.release()
                self.send(200, result)
            except PermissionError as e:
                self.send(403, {"error": str(e)})
            except Conflict as e:
                self.send(409, {"error": str(e)})
            except (ValueError, KeyError) as e:
                self.send(400, {"error": str(e)})
            except Exception:
                self.send(
                    500,
                    {
                        "error": "操作失败。源文件或上次 PDF 不会被渲染结果覆盖；请检查内容格式、uv 和 Poppler 后重试。"
                    },
                )

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Resume Studio: http://127.0.0.1:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", required=True)
    parser.add_argument("--port", type=int, default=8767)
    args = parser.parse_args()
    serve(args.repo, args.port)
