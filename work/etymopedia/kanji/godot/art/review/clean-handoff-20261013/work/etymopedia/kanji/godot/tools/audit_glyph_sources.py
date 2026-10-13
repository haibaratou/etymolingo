"""Audit source identity/provenance and verify approved game data stays unchanged.

No files in the source dataset are written. No glyph is redrawn or converted.
"""
from __future__ import annotations

import argparse
import collections
import csv
import hashlib
import json
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = PROJECT.parent / "oracle-bone-jgw-1203-main" / "oracle-bone-jgw-1203-main"
PROTECTED = ("scripts/oracle.gd", "data/jgw.json", "data/kanji_db.json", "data/game.json")


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest().upper()


def audit(source: Path, baseline: Path | None) -> dict:
    glyph_file = source / "data/jgw_1203_labeled.json"
    glyphs = json.loads(glyph_file.read_text(encoding="utf-8"))
    ids = [row["glyph_id"] for row in glyphs]
    labels = collections.Counter(row.get("modern_char", "") for row in glyphs if row.get("modern_char"))
    glyph_identity_ok = len(ids) == 1203 and sorted(ids) == list(range(1, 1204))
    unicode_mismatches = [
        row["glyph_id"]
        for row in glyphs
        if row.get("modern_char") and row.get("unicode")
        and (len(row["modern_char"]) != 1 or ord(row["modern_char"]) != int(row["unicode"], 16))
    ]
    with (source / "data/provenance_manifest.csv").open(encoding="utf-8-sig", newline="") as stream:
        provenance = list(csv.DictReader(stream))
    game_glyphs = json.loads((PROJECT / "data/jgw.json").read_text(encoding="utf-8"))
    hashes = {name: sha256(PROJECT / name) for name in PROTECTED}
    changed = []
    if baseline is not None:
        previous = json.loads(baseline.read_text(encoding="utf-8-sig"))
        if isinstance(previous, dict):
            previous_hashes = previous.get("protected_game_sha256", previous)
        else:
            # The original PowerShell snapshot contains absolute paths. Match
            # the known project-relative suffix so another PC can use it too.
            previous_hashes = {}
            for item in previous:
                normalized = item["Path"].replace("\\", "/")
                for relative in PROTECTED:
                    if normalized.endswith("/" + relative):
                        previous_hashes[relative] = item["Hash"]
        for relative in PROTECTED:
            if relative not in previous_hashes or hashes[relative] != previous_hashes[relative].upper():
                changed.append(relative)
    provenance_ids = {int(row.get("glyph_id", "0")) for row in provenance}
    return {
        "source": str(source),
        "glyph_forms": len(glyphs),
        "stable_unique_glyph_id": glyph_identity_ok,
        "unique_modern_char_labels": len(labels),
        "modern_chars_with_multiple_glyph_forms": sum(count > 1 for count in labels.values()),
        "unidentified_forms": sum(not row.get("modern_char") for row in glyphs),
        "supplementary_plane_forms": [row["glyph_id"] for row in glyphs if row.get("modern_char") and ord(row["modern_char"][0]) > 65535],
        "unicode_identity_mismatches": unicode_mismatches,
        "provenance_rows": len(provenance),
        "provenance_covers_all_glyph_ids": provenance_ids == set(ids),
        "polyline_svg_files": len(list((source / "data/svg_polyline").glob("*.svg"))),
        "parametric_svg_files": len(list((source / "data/svg_parametric").glob("*.svg"))),
        "game_glyph_entries": len(game_glyphs),
        "game_hero_glyphs_present": {ch: ch in game_glyphs for ch in ("人", "魚", "水", "子", "大", "女", "王")},
        "shape_data_sha256": sha256(glyph_file),
        "data_license_sha256": sha256(source / "LICENSE-DATA"),
        "protected_game_sha256": hashes,
        "protected_game_changed_since_baseline": changed,
        "note": "The game uses a curated glyph subset. Modern-character labels are not unique source identities. Keep approved shapes unchanged; identify source variants by glyph_id.",
        "ok": glyph_identity_ok and not unicode_mismatches and provenance_ids == set(ids) and not changed,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()
    report = audit(args.source, args.baseline)
    rendered = json.dumps(report, ensure_ascii=True, indent=2)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(rendered + "\n", encoding="utf-8")
    print("[glyph-audit] forms=%d provenance=%d game_glyphs=%d protected_changed=%s ok=%s" % (
        report["glyph_forms"], report["provenance_rows"], report["game_glyph_entries"],
        report["protected_game_changed_since_baseline"], report["ok"],
    ))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
