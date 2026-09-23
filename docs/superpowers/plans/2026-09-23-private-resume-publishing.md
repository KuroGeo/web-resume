# Private Resume Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution, or superpowers:subagent-driven-development if the user selects delegation. Steps use checkbox syntax for tracking.

**Goal:** Maintain resume content privately once and publish only the selected website content and bilingual PDFs.

**Architecture:** The private repository projects an explicit field allowlist into a versioned public JSON contract, then renders both PDFs from that projection. The public repository builds its existing synchronous JavaScript data interfaces from the JSON before Pages deployment. Private variants use the same catalog with separate selection and override configurations.

**Tech Stack:** Existing Python 3.12+, ruamel.yaml, RenderCV/Typst, Node.js built-ins, GitHub Actions and Pages.

**Spec:** ../specs/2026-09-23-private-resume-publishing-design.md

## Global Constraints

- 首次迁移仅将网站已存在的内容作为公开基线。
- 私人资料不因合并而获得公开资格。
- 公开发布包不包含私人版本名称、私人源路径、完整 YAML、Typst 中间文件、调试数据、私有提交记录或凭证。
- 缺字段、缺语言、非法路径、PDF 渲染失败、隐私检查失败，均在公开写入前中止。
- 不改变网站视觉方向，不公开更多私人信息，不增加后台登录、在线简历编辑器或第三方简历服务。
- Preserve the dirty private working directory: no stash, reset, pull, overwrite or automatic commit of its existing user edits. Isolate implementation and migration snapshots outside the public repository.
- Do not copy the local gh credential into Actions. Report missing dedicated publishing credentials independently from successful local generation.

## Review Focus

1. An otherwise public object acquires a new nested private field: projection must omit it (Task 1).
2. Existing private local edits differ from remote main: migration must preserve the local input byte-for-byte and preserve variant semantics (Task 1).
3. Slow or failed public-data loading: keep synchronous consumer ordering through build-time adapters; fail deployment on invalid JSON (Task 3).
4. Pages runs under /web-resume/: language-specific PDF links and nested-page data paths must remain correct (Task 3).
5. One renderer fails, credentials are missing, or a target branch moves concurrently: do not publish a partial bundle or overwrite concurrent work (Tasks 2 and 4).

## Execution boundaries and file map

Use the current web-resume worktree. Create a private sibling checkout on a codex/ branch from the private repository's committed main. Preserve the dirty private source separately, with a private manifest of hashes; use those snapshots to compare current variants, but do not silently commit the user's dirty files. Keep all private migration fixtures and reports inside the private checkout.

Private files to create:

- content/catalog.yaml: stable IDs with bilingual fields, including webpage long text and PDF summaries.
- content/variants/public.yaml: exact selected scalar leaf paths, order and public presentation configuration.
- content/variants/private/: private selection/override configurations, generated from existing variants without publishing their names.
- scripts/resume_content.py: loading, validation, variant resolution, public projection and RenderCV input conversion.
- scripts/build_public_resume.py: atomic construction and validation of the three-file publish bundle.
- scripts/publish_public_resume.py: fixed-path Git update, without force push.
- scripts/migrate_resume_content.py: one-time local migration and equivalence report.
- tests/publishing/test_content.py, test_build.py, test_publish.py: synthetic-only automated fixtures.
- .github/workflows/publish-public-resume.yml: private build and public fixed-path update.
- docs/public-publishing.md: canonical edit workflow, private variant usage and credential setup.

Private files to adapt only in the isolated checkout: scripts/resume_manager.py, generate_resume.sh, generate_all_resumes.sh. Preserve legacy imports as private archival snapshots; generated compatibility YAML is not a second editable source. The manager must prevent silent edits to generated YAML and identify the canonical input location. Existing unrelated management features remain unchanged.

Public files to create:

- public/generated/resume.json and public/downloads/resume-{zh,en}.pdf: the only cross-repository generated artifacts.
- scripts/build-resume-site.mjs: renders existing JS/data and bound HTML facts from public JSON; contains no private-data reader.
- tests/resume-publishing.test.mjs: contract, escaped rendering, locale/download and malformed-input tests.

Public files to adapt: public/js/profile-data.js, public/js/resume-document.js, public/resume-content.js, public/js/profile-locale.js, public/index.html, public/index-resume-embed.html, public/resume.html, tests/validate-site.mjs, .github/workflows/pages.yml and README.md. Audit every HTML/JS consumer before editing; migrate repeated resume facts but retain layout/interaction copy in the website.

## Contract

Public JSON has exactly schemaVersion: 1 and locales: {zh, en}. Each locale includes identity, experience, education, projects, groups, and copy. All entry records have stable id values. Content strings are plain text, or explicitly supported Markdown for the PDF converter; arbitrary HTML is not executable data. projects retain the existing scene order and eight public project IDs. copy keys preserve current translation keys; migration maps them to canonical catalog fields rather than maintaining duplicated prose.

Private projection selects exact scalar leaf paths and constructs a new output object; it never copies a complete source subtree. Public configuration cannot import private-variant overrides. Unknown selection paths and missing language values raise ValueError. Presentation/asset paths are also allowlisted and validated; no local filesystem paths enter public JSON. Site builds reject unsupported schema versions and incomplete locales before writing files.

The following interfaces are implemented in scripts/resume_content.py:

```python
def load_catalog(path: pathlib.Path) -> dict: ...
def resolve_variant(catalog: dict, config: dict) -> dict: ...
def project_public(catalog: dict, config: dict) -> dict: ...
def to_rendercv(public_data: dict, language: str) -> dict: ...
```

project_public does not call resolve_variant on a private variant. to_rendercv receives only projected public data when building a public PDF.

## Task 1: Canonical content and privacy projection

- [ ] Snapshot source hashes and current public content; read private repository instructions before editing. Create the private isolated checkout, then copy dirty source snapshots only into a private ignored migration directory. Record HEADs and do not change the original checkout.
- [ ] Write failing tests in tests/publishing/test_content.py with synthetic fixtures. The core leakage regression must exercise both nested new fields and a wholly private entry:

```python
def test_private_additions_do_not_change_projection(catalog, public_config):
    before = project_public(catalog, public_config)
    catalog['entries']['project-a']['internal'] = {'note': 'PRIVATE_SENTINEL'}
    catalog['entries']['private-only'] = {'zh': {'title': 'PRIVATE_SENTINEL'}}
    assert project_public(catalog, public_config) == before
    assert 'PRIVATE_SENTINEL' not in json.dumps(before)
```

- [ ] Add tests for unknown paths, unsupported locale, duplicate IDs and a private override attempting to enter public configuration; all reject input. Run `uv run --frozen --all-extras pytest tests/publishing/test_content.py -n 0` and verify intended failures.
- [ ] Implement the four interfaces above. Validate before output; extract only selected scalar leaves into new containers. Convert selected stable IDs into ordered RenderCV sections, escape text using the existing renderer's supported conventions.
- [ ] Implement migration: extract the public JS objects in Node VM with controlled stubs, parse HTML resume facts, import legacy private YAML safely, deduplicate only identical fields, and express version-specific differences as explicit overrides. Preserve conflicting public facts. Write a private-only report of unmapped differences, not an automatic public replacement.
- [ ] Add an equivalence test over each resolved private variant's parsed cv/design/locale settings versus its snapshot, and compare source hashes before/after migration. Run it privately; all differences must be accounted for before marking migration complete.
- [ ] Update legacy CLI entry points to resolve variants before rendering. Generated legacy YAML must be labelled and guarded from independent edits in the existing manager. Test that canonical field changes reach generated YAML while private overrides retain precedence, and that saving generated YAML cannot silently fork content.
- [ ] Run projection and migration tests, then commit only task-owned private files; never include dirty user files automatically.

## Task 2: Public bundle and real bilingual PDFs

Interfaces in scripts/build_public_resume.py:

```python
PUBLIC_PATHS = frozenset({
    'public/generated/resume.json',
    'public/downloads/resume-zh.pdf',
    'public/downloads/resume-en.pdf',
})
def build_bundle(catalog_path: pathlib.Path, config_path: pathlib.Path,
                 destination: pathlib.Path) -> None: ...
def validate_bundle(directory: pathlib.Path) -> None: ...
```

- [ ] Write failing tests for extra files, symlinks (including ancestor symlinks), missing PDFs, invalid PDF signatures and invalid JSON. validate_bundle must reject all without changing the target directory.
- [ ] Add a renderer-failure test using a synthetic renderer stub: prepopulate the destination, fail the second language, assert every destination hash is unchanged. Run `uv run --frozen --all-extras pytest tests/publishing/test_build.py -n 0` before implementation.
- [ ] Build in a new private temporary directory; serialize only project_public output. Run the pinned existing RenderCV CLI with `--dont-generate-markdown --dont-generate-html --dont-generate-png` and fixed PDF output paths. Keep intermediate Typst outside the bundle. Validate, then promote the complete bundle, restoring the prior bundle on promotion failure.
- [ ] Ensure deterministic inputs and normalize time-dependent PDF metadata where supported. Test repeated builds do not trigger an unnecessary publish; compare semantic content if renderer byte output cannot be made deterministic.
- [ ] Render both actual PDFs locally. Inspect extracted text and metadata for equality to the public projection and absence of private synthetic sentinels; render page images and inspect Chinese fonts, pagination, clipping and links. Keep screenshots and diagnostic logs private.
- [ ] Run all publishing tests and commit the builder. No public write occurs in this task.

## Task 3: Website adapters and direct PDF download

Exports in scripts/build-resume-site.mjs:

```javascript
export function validatePublicResume(data) { /* throws on invalid contract */ }
export function renderResumeDocument(locale) { /* returns escaped HTML */ }
export function buildSite(root) { /* reads root/public/generated/resume.json */ }
```

- [ ] Add failing Node tests with a minimal synthetic valid locale fixture. Pin HTML escaping and contract rejection:

```javascript
assert.throws(() => validatePublicResume({schemaVersion: 99, locales: {}}));
const html = renderResumeDocument({...locale, identity: {...locale.identity,
  name: '<script>PRIVATE_SENTINEL</script>'}});
assert.ok(!html.includes('<script>'));
assert.ok(html.includes('&lt;script&gt;'));
```

- [ ] Test both language download paths as relative `downloads/resume-zh.pdf` and `downloads/resume-en.pdf`, test an unsupported language falls back to en, and verify education anchor preservation. Test missing locale/invalid JSON aborts the build without updating generated outputs.
- [ ] Implement build-time adapters preserving SCROLLCAROUSEL_PROJECTS, PROFILE_ZH, window.PORTFOLIO_GROUPS, and getResumeCopy/getResumePageMeta interfaces. Generate content files from JSON, leave consumer script order synchronous, and safely escape inline script serialization including `</script>`.
- [ ] Replace repeated hardcoded identity/experience facts with explicit build bindings in HTML. Keep translation UI strings in the public repo; source resume facts from the JSON. Mark generated files and document `node scripts/build-resume-site.mjs` for local preview.
- [ ] Render resume.html and embedded preview from the same public locale content. Add real download links and language controls. Keep browser print as a secondary action and preserve printer completion navigation to resume.html.
- [ ] Run the builder and `node --test tests/resume-publishing.test.mjs`, then `node tests/validate-site.mjs`. Add a repeat-build check and ensure no unexpected changes on the second run.
- [ ] Load jev-browser before interactive Chrome verification. Check 1280x900 and 390x844, both languages, project details, reload, education anchor, printer animation and two real downloads under the /web-resume/ base path. Verify downloaded PDF content, not merely a click event.
- [ ] Commit website integration with all three actual public artifacts together; no placeholder PDFs or broken initial download links.

## Task 4: Private automation and public Pages delivery

Interface in scripts/publish_public_resume.py:

```python
def publish_bundle(bundle: pathlib.Path, checkout: pathlib.Path) -> bool:
    """Validate, commit fixed paths, normal-push; return False for no change."""
```

- [ ] Write local bare-Git tests in tests/publishing/test_publish.py. Verify invalid bundles create no commit, unchanged bundles return False, only PUBLIC_PATHS can change, dirty target paths are rejected, and moved remote main causes push rejection without force or lost remote commits.
- [ ] Implement destination-only copying after validation. Stage explicit PUBLIC_PATHS, inspect staged paths before committing, use a normal fast-forward push. Never use rsync of a private directory, git add ., or force push.
- [ ] Add private workflow with read-only default permissions, trusted main push/manual triggers, serialized publishing, pinned dependencies and a dedicated secret named WEB_RESUME_PUBLISH_TOKEN. No private source artifacts uploaded to the public repository. A missing secret fails with a specific setup instruction before publication.
- [ ] Configure the public Pages workflow to run the JSON adapter and relevant Node tests before uploading public/. Private workflow credentials must have access only to the destination repository and enough permission for contents write, not general account access. If the credential is unavailable, finish local work and document the exact unfulfilled setup step; do not export gh credentials.
- [ ] Update both READMEs with canonical editing commands, public/private generation commands, publish commands and rollback instructions. Public docs contain no private filenames or content; private docs can explain variant management.
- [ ] Run all relevant tests once after the final code changes; review diffs for unintended private files/content. Commit changes on task branches in both repositories. Coordinate first delivery: install the web adapters and complete artifacts before enabling subsequent private publishing, so no new JSON contract races the old website build.
- [ ] Push completed task branches and create reviewable PRs as needed, attaching each created PR to the task. Do not report merged/deployed until verified. Confirm the actual private workflow, destination push, Pages run and both live download URLs individually when credentials and branch delivery are available.

## Self-review and acceptance

Coverage: source unification/private overrides (Task 1), whitelist and leakage checks (Tasks 1–2), PDF layout (Task 2), all current website consumers and language behavior (Task 3), credential handling/atomic publication/concurrency (Task 4). The discovered dirty private checkout is protected by isolation and hash comparisons. Build-time adapters refine the spec's single-public-JSON rule without putting private sources in public builds or introducing browser fetch races.

Recommended execution: Native in the current task, because the four steps share a small projection contract and most care is needed at the cross-repository privacy boundary. A separate final review should check that boundary and the generated artifacts. Implementation awaits review of this plan and selection of execution method under the active writing-plans skill.
