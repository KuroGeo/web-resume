"""Boundary tests use synthetic data; no private repository is needed in CI."""

import datetime
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location(
    "studio", Path(__file__).parents[1] / "tools/resume-studio/server.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class StudioTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name).resolve()
        self.store = module.Store.__new__(module.Store)
        self.store.repo = self.repo
        self.store.build = self.repo / ".private-build/studio"
        self.store.build.mkdir(parents=True)
        self.store.preview = {}
        self.store.load = lambda p: json.loads(p.read_text())
        self.store.write = lambda p, d: p.write_text(json.dumps(d))
        self.store.resolve = lambda cat, cfg: {
            "cv": {
                "name": cfg.get("overrides", {})
                .get("identity", {})
                .get("en", cat["entries"]["identity"]["en"])
            }
        }
        path = self.repo / "content/variants/private"
        path.mkdir(parents=True)
        self.catalog = self.repo / "content/catalog.yaml"
        self.catalog.write_text(
            json.dumps({"entries": {"identity": {"en": "Synthetic Person"}}})
        )
        self.config = path / "resume_example.yaml"
        self.config.write_text(
            json.dumps(
                {
                    "kind": "private",
                    "document": {"cv": {"name": {"ref": "identity", "lang": "en"}}},
                }
            )
        )

    def test_save_private_override_never_changes_shared_catalog(self):
        before = self.catalog.read_bytes()
        doc = self.store.get("resume_example")
        result = self.store.save(
            "resume_example",
            {
                "revision": doc["revision"],
                "changes": {doc["fields"][0]["id"]: "Variant Name"},
            },
        )
        self.assertEqual(result["name"], "Variant Name")
        self.assertEqual(before, self.catalog.read_bytes())
        self.assertEqual(
            json.loads(self.config.read_text())["overrides"]["identity"]["en"],
            "Variant Name",
        )
        self.assertEqual(len(list((self.store.build / "backups").glob("*.yaml"))), 1)

    def test_private_export_filename_and_proof_project_shape(self):
        config = json.loads(self.config.read_text())
        config["document"]["export_filename"] = "叶禹锋_V1.pdf"
        self.config.write_text(json.dumps(config))
        self.assertEqual(self.store.get("resume_example")["exportFilename"], "叶禹锋_V1.pdf")
        collections = self.store.collections(
            "resume_example",
            {"sections": {"精选项目": [{"title": "示例", "paragraphs": ["内容"]}]}},
        )
        self.assertEqual(collections[0]["minimum"], 1)
        self.assertEqual(collections[0]["template"]["title"], "新项目")

    def test_stale_editor_cannot_overwrite_newer_file(self):
        doc = self.store.get("resume_example")
        self.config.write_text(self.config.read_text() + "\n")
        before = self.config.read_bytes()
        with self.assertRaises(module.Conflict):
            self.store.save(
                "resume_example", {"revision": doc["revision"], "changes": {}}
            )
        self.assertEqual(self.config.read_bytes(), before)

    def test_version_rename_copy_and_delete_are_private_and_recoverable(self):
        self.store.version_ids = lambda: [p.stem for p in sorted(self.config.parent.glob("*.yaml"))]
        revision = self.store.get("resume_example")["revision"]
        source = self.config.read_bytes()
        self.store.rename_version("resume_example", revision, "求职版本")
        self.assertEqual(self.store.versions()[-1]["name"], "求职版本")
        self.assertEqual(self.config.read_bytes(), source)
        copied = self.store.copy_version("resume_example", revision)
        self.assertEqual(copied, "resume_example_copy")
        self.assertEqual(self.store.config_path(copied).read_bytes(), source)
        self.assertEqual(self.store.versions()[-1]["name"], "求职版本 · 副本")
        self.assertEqual(self.store.copy_version("resume_example", revision), "resume_example_copy_2")
        self.store.delete_version(copied, self.store.get(copied)["revision"])
        self.assertNotIn(copied, self.store.version_ids())
        backups = list((self.store.build / "backups").glob(f"{copied}-*.yaml"))
        self.assertEqual(len(backups), 1)
        self.assertEqual(backups[0].read_bytes(), source)
        self.assertNotIn(copied, self.store.labels())

    def test_version_operations_reject_public_and_stale_state(self):
        revision = self.store.get("resume_example")["revision"]
        for operation in (
            lambda: self.store.rename_version("public-zh", revision, "bad"),
            lambda: self.store.copy_version("public-zh", revision),
            lambda: self.store.delete_version("public-zh", revision),
        ):
            with self.assertRaises(ValueError):
                operation()
        with self.assertRaises(module.Conflict):
            self.store.delete_version("resume_example", "old")
        with self.assertRaises(ValueError):
            self.store.rename_version("resume_example", revision, " ")
        self.assertTrue(self.config.exists())

    def test_unknown_field_and_traversal_fail_without_write(self):
        doc = self.store.get("resume_example")
        before = self.config.read_bytes()
        with self.assertRaises(ValueError):
            self.store.save(
                "resume_example",
                {"revision": doc["revision"], "changes": {'["design"]': "bad"}},
            )
        for value in ["../resume_example", "--all", "resume_example/../../x"]:
            with self.assertRaises(ValueError):
                self.store.config_path(value)
        self.assertEqual(self.config.read_bytes(), before)

    def test_symlink_source_rejected(self):
        self.config.unlink()
        self.config.symlink_to(self.catalog)
        with self.assertRaises(ValueError):
            self.store.get("resume_example")

    def test_generate_rejects_outdated_editor_revision(self):
        with self.assertRaises(module.Conflict):
            self.store.render("resume_example", "old-revision")

    def test_local_preview_survives_restart_and_checks_artifacts(self):
        _, catalog, config, revision, doc = self.store.load_state("resume_example")
        preview_revision = self.store.preview_revision(
            "resume_example", catalog, config, doc
        )
        ident = "a" * 24
        directory = self.store.build / ident
        directory.mkdir()
        (directory / "document.pdf").write_bytes(b"%PDF-1.7")
        (directory / "page-1.png").write_bytes(b"PNG")
        info = {"id": ident, "pages": 1, "revision": preview_revision}
        self.store.preview["resume_example"] = info
        self.store.save_previews()
        self.store.preview = {}
        self.store.load_previews()
        self.assertEqual(self.store.get("resume_example")["preview"], info)
        self.assertEqual(self.store.render("resume_example", revision), info)
        updated = json.loads(self.config.read_text())
        updated["overrides"] = {"identity": {"en": "Updated Name"}}
        self.config.write_text(json.dumps(updated))
        self.assertIsNone(self.store.get("resume_example")["preview"])
        (directory / "page-1.png").unlink()
        self.assertIsNone(self.store.preview_for("resume_example", preview_revision))

    def test_preparation_builds_only_missing_or_changed_versions(self):
        revision = self.store.load_state("resume_example")[3]
        self.store.version_ids = lambda: ["resume_example"]
        rendered = []

        def render(version, requested_revision):
            rendered.append((version, requested_revision))
            _, catalog, config, _, doc = self.store.load_state(version)
            preview_revision = self.store.preview_revision(
                version, catalog, config, doc
            )
            ident = f"{len(rendered):024x}"
            directory = self.store.build / ident
            directory.mkdir()
            (directory / "document.pdf").write_bytes(b"%PDF-1.7")
            (directory / "page-1.png").write_bytes(b"PNG")
            self.store.preview[version] = {
                "id": ident, "pages": 1, "revision": preview_revision
            }

        self.store.render = render
        self.store.prepare_previews()
        self.store.prepare_previews()
        self.assertEqual(rendered, [("resume_example", revision)])
        updated = json.loads(self.config.read_text())
        updated["overrides"] = {"identity": {"en": "Updated Name"}}
        self.config.write_text(json.dumps(updated))
        new_revision = self.store.load_state("resume_example")[3]
        self.store.prepare_previews()
        self.assertEqual(rendered[-1], ("resume_example", new_revision))
        self.assertEqual(len(rendered), 2)

    def test_unrelated_catalog_entry_does_not_invalidate_preview(self):
        _, catalog, config, raw_revision, doc = self.store.load_state("resume_example")
        preview_revision = self.store.preview_revision(
            "resume_example", catalog, config, doc
        )
        updated = json.loads(self.catalog.read_text())
        updated["entries"]["unused"] = {"en": "Updated public copy"}
        self.catalog.write_text(json.dumps(updated))
        _, catalog, config, new_raw_revision, doc = self.store.load_state(
            "resume_example"
        )
        self.assertNotEqual(raw_revision, new_raw_revision)
        self.assertEqual(
            preview_revision,
            self.store.preview_revision("resume_example", catalog, config, doc),
        )

    def test_public_template_change_invalidates_preview(self):
        self.public_projects()
        _, catalog, config, _, doc = self.store.load_state("public-zh")
        before = self.store.preview_revision("public-zh", catalog, config, doc)
        template = self.repo / "templates/public-resume.typ"
        template.parent.mkdir()
        template.write_text("first template")
        after = self.store.preview_revision("public-zh", catalog, config, doc)
        self.assertNotEqual(before, after)
        template.write_text("updated template")
        self.assertNotEqual(
            after, self.store.preview_revision("public-zh", catalog, config, doc)
        )

    def test_yaml_dates_remain_editable_text(self):
        fields = self.store.fields(
            "resume_example",
            {"entries": {"date": {"value": datetime.date(2020, 9, 1)}}},
            {"document": {"cv": {"start_date": {"ref": "date", "lang": "value"}}}},
            {},
        )
        self.assertEqual(fields[0]["value"], "2020-09-01")
        self.assertEqual(fields[0]["label"], "开始时间")

    def test_bad_private_source_structure_rejected(self):
        self.store.resolve = lambda cat, cfg: cfg.get("document")
        for document in [{}, {"cv": []}, {"cv": {"name": "A", "sections": []}}]:
            with self.assertRaises(ValueError):
                self.store.validate_private({}, {"document": document})

    def public_projects(self):
        def resolve(cat, value):
            if isinstance(value, dict):
                if "ref" in value:
                    return cat["entries"][value["ref"]][value["lang"]]
                return {key: resolve(cat, child) for key, child in value.items()}
            if isinstance(value, list):
                return [resolve(cat, child) for child in value]
            return value

        self.store.project = lambda cat, cfg: resolve(cat, cfg["document"])
        self.store.validate = lambda doc: None
        self.public = self.repo / "content/variants/public.yaml"
        locale = {
            "identity": {"name": "Example"},
            "sections": [
                {
                    "id": "projects",
                    "title": "精选项目",
                    "items": [
                        {
                            "title": {"ref": "identity", "lang": "en"},
                            "paragraphs": ["One"],
                        },
                        {"title": "Second", "paragraphs": ["Two"]},
                    ],
                }
            ],
        }
        self.public.write_text(
            json.dumps({"document": {"locales": {"zh": locale, "en": locale}}})
        )
        doc = self.store.get("public-zh")
        return doc, doc["collections"][0]["id"]

    def test_add_edit_and_remove_use_original_indices_and_preserve_other_locale(self):
        doc, key = self.public_projects()
        english = json.loads(self.public.read_text())["document"]["locales"]["en"]
        before = self.catalog.read_bytes()
        self.store.save(
            "public-zh",
            {
                "revision": doc["revision"],
                "collections": {key: {"add": 1, "remove": [0]}},
                "changes": {
                    json.dumps(["sections", 0, "items", 1, "title"]): "Edited second",
                    json.dumps(["sections", 0, "items", 2, "title"]): "New third",
                    json.dumps(["sections", 0, "items", 0, "title"]): "Discarded edit",
                },
            },
        )
        locales = json.loads(self.public.read_text())["document"]["locales"]
        self.assertEqual(
            [i["title"] for i in locales["zh"]["sections"][0]["items"]],
            ["Edited second", "New third"],
        )
        self.assertEqual(locales["en"], english)
        self.assertEqual(self.catalog.read_bytes(), before)

    def test_optional_fields_remain_editable_after_save(self):
        doc, key = self.public_projects()
        result = self.store.save(
            "public-zh",
            {
                "revision": doc["revision"],
                "collections": {key: {"add": 1, "remove": []}},
            },
        )
        field_id = json.dumps(["sections", 0, "items", 2, "date"])
        self.assertIn(field_id, [f["id"] for f in result["fields"]])
        result = self.store.save(
            "public-zh", {"revision": result["revision"], "changes": {field_id: "2026"}}
        )
        self.assertEqual(
            next(f["value"] for f in result["fields"] if f["id"] == field_id), "2026"
        )

    def test_private_projects_allow_empty_then_add_without_catalog_write(self):
        self.store.resolve = lambda cat, cfg: cfg["document"]
        self.config.write_text(
            json.dumps(
                {
                    "document": {
                        "cv": {
                            "name": "Example",
                            "sections": {
                                "项目经历": [{"name": "First", "summary": "Example"}]
                            },
                        }
                    }
                }
            )
        )
        before = self.catalog.read_bytes()
        doc = self.store.get("resume_example")
        key = doc["collections"][0]["id"]
        result = self.store.save(
            "resume_example",
            {
                "revision": doc["revision"],
                "collections": {key: {"add": 0, "remove": [0]}},
            },
        )
        self.assertEqual(result["collections"][0]["count"], 0)
        result = self.store.save(
            "resume_example",
            {
                "revision": result["revision"],
                "collections": {key: {"add": 1, "remove": []}},
            },
        )
        self.assertEqual(result["collections"][0]["count"], 1)
        self.assertEqual(self.catalog.read_bytes(), before)

    def test_invalid_project_operations_do_not_write(self):
        doc, key = self.public_projects()
        before = self.public.read_bytes()
        for operation in [
            {"add": 0, "remove": [0, 1]},
            {"add": -1, "remove": []},
            {"add": 0, "remove": [8]},
            {"add": 0, "remove": [0, 0]},
        ]:
            with self.assertRaises(ValueError):
                self.store.save(
                    "public-zh",
                    {"revision": doc["revision"], "collections": {key: operation}},
                )
            self.assertEqual(self.public.read_bytes(), before)

    def test_shared_text_and_project_addition_save_together(self):
        doc, key = self.public_projects()
        result = self.store.save(
            "public-zh",
            {
                "revision": doc["revision"],
                "collections": {key: {"add": 1, "remove": []}},
                "changes": {
                    json.dumps(["sections", 0, "items", 0, "title"]): "Updated shared"
                },
            },
        )
        self.assertEqual(result["collections"][0]["count"], 3)
        self.assertEqual(
            json.loads(self.catalog.read_text())["entries"]["identity"]["en"],
            "Updated shared",
        )

    def test_write_failure_restores_both_files(self):
        doc, key = self.public_projects()
        originals = [self.catalog.read_bytes(), self.public.read_bytes()]
        atomic = self.store.atomic

        def fail_second(path, data):
            if path == self.public:
                raise OSError("Synthetic disk error")
            atomic(path, data)

        self.store.atomic = fail_second
        with self.assertRaises(OSError):
            self.store.save(
                "public-zh",
                {
                    "revision": doc["revision"],
                    "collections": {key: {"add": 1, "remove": []}},
                    "changes": {
                        json.dumps(["sections", 0, "items", 0, "title"]): "Changed"
                    },
                },
            )
        self.assertEqual(
            [self.catalog.read_bytes(), self.public.read_bytes()], originals
        )

    def test_host_origin_and_session_required(self):
        valid = {"Host": "127.0.0.1:8767", "X-Studio-Token": "secret"}
        self.assertEqual(
            module.authorize(valid, "/api/versions", 8767, "secret")[0], "/api/versions"
        )
        for headers in [
            {**valid, "Host": "attacker.test:8767"},
            {**valid, "Origin": "https://attacker.test"},
            {"Host": valid["Host"]},
        ]:
            with self.assertRaises(PermissionError):
                module.authorize(headers, "/api/versions", 8767, "secret")
        with self.assertRaises(PermissionError):
            module.authorize(
                {"Host": valid["Host"]}, "/api/artifact?token=wrong", 8767, "secret"
            )


if __name__ == "__main__":
    unittest.main()
