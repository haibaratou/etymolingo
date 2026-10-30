"""Explicit static manager routes. No sockets, API requests, or selection writes."""
import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch
ROOT = Path(__file__).resolve().parents[3]
SERVER = ROOT / "work/wildwordopia/production/history_server.py"
with patch("http.server.ThreadingHTTPServer", side_effect=AssertionError("No test sockets")):
    spec = importlib.util.spec_from_file_location("character_history_routes", SERVER)
    server = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(server)
class StaticRoutes(unittest.TestCase):
    def test_manager_selection_modules_on_both_existing_prefixes(self):
        for prefix in ("/support/", "/app/support/"):
            for name in ("site-selection.js", "site-image-selections.js", "latest-site-images.js"):
                relative = "character-manager/" + name
                with self.subTest(url=prefix + relative):
                    self.assertEqual(server.static_path(prefix + relative), ROOT / "app/support" / relative)
    def test_only_explicit_shared_image_modules_are_exposed(self):
        for prefix in ("/shared/", "/app/shared/"):
            for name in ("manager-site-image-store.js", "manager-site-images.js"):
                with self.subTest(url=prefix + name):
                    self.assertEqual(server.static_path(prefix + name), ROOT / "app/shared" / name)
    def test_unlisted_paths_and_traversal_stay_unavailable(self):
        for url in ("/shared/english-paraphrases.js", "/shared/../data/private.json", "/app/shared/../../work/private.json", "/support/character-manager/../private.js", "/support/character-manager/site-selection.js/extra", "/work/private.json", "/api/wildwordopia/review", "/api/site-images"):
            with self.subTest(url=url):self.assertIsNone(server.static_path(url))
    def test_existing_manager_and_history_routes_remain(self):
        for prefix in ("/", "/app/"):
            self.assertEqual(server.static_path(prefix + "character-manager.html"), ROOT / "app/character-manager.html")
        for prefix in ("/support/", "/app/support/"):
            self.assertEqual(server.static_path(prefix + "wildwordopia-history/wildwordopia-history.js"), ROOT / "app/support/wildwordopia-history/wildwordopia-history.js")
if __name__ == "__main__":unittest.main()
