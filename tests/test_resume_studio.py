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

    def test_stale_editor_cannot_overwrite_newer_file(self):
        doc = self.store.get("resume_example")
        self.config.write_text(self.config.read_text() + "\n")
        before = self.config.read_bytes()
        with self.assertRaises(module.Conflict):
            self.store.save(
                "resume_example", {"revision": doc["revision"], "changes": {}}
            )
        self.assertEqual(self.config.read_bytes(), before)

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
