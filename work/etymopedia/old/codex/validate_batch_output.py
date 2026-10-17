#!/usr/bin/env python3
"""Audit illustration PNGs and completion metadata for a prompt_rows batch range."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

from PIL import Image


BASE = Path(__file__).resolve().parents[1]
COL_FILE = "ファイル名"
COL_WORD = "単語"
COL_EN = "解説英語"
COL_JA = "解説日本語"
COL_STATE = "制作状態"
COL_PROMPT = "実行プロンプト"
COL_DIGEST = "画像SHA256"
COMPLETE_STATES = {"generated", "reviewed"}
HOLD_STATES = {"error", "needs_revision"}


def has_headword(text: str, word: str) -> bool:
    """Require the headword as its own English token, case-insensitively."""
    word = word.strip()
    if not word:
        return False
    pattern = rf"(?<![A-Za-z0-9]){re.escape(word)}(?![A-Za-z0-9])"
    return re.search(pattern, text, flags=re.IGNORECASE) is not None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=20, help="first batch number (default: 20)")
    parser.add_argument("--end", type=int, default=27, help="last batch number (default: 27)")
    args = parser.parse_args()
    if args.start < 0 or args.end < args.start:
        parser.error("invalid batch range")

    failures: list[str] = []
    warnings: list[str] = []
    totals = {"rows": 0, "png": 0, "complete": 0, "held": 0, "unstarted": 0}

    for number in range(args.start, args.end + 1):
        batch = f"{number:03d}"
        csv_path = BASE / "codex" / f"prompt_rows_{batch}.csv"
        output_dir = BASE / "_illust" / f"prompt_rows_{batch}"
        if not csv_path.is_file():
            failures.append(f"{batch}: missing CSV {csv_path}")
            continue
        if not output_dir.is_dir():
            failures.append(f"{batch}: missing output directory {output_dir}")
            continue

        with csv_path.open(encoding="utf-8-sig", newline="") as stream:
            reader = csv.DictReader(stream)
            rows = list(reader)
            columns = set(reader.fieldnames or [])
        required = {COL_FILE, COL_WORD, COL_EN, COL_JA, COL_STATE, COL_PROMPT, COL_DIGEST}
        absent = required - columns
        if absent:
            failures.append(f"{batch}: missing CSV columns: {', '.join(sorted(absent))}")
            continue

        seen: set[str] = set()
        declared_pngs: set[str] = set()
        for row_number, row in enumerate(rows, start=2):
            totals["rows"] += 1
            filename = (row.get(COL_FILE) or "").strip()
            word = (row.get(COL_WORD) or "").strip()
            state = (row.get(COL_STATE) or "").strip()
            if not filename:
                failures.append(f"{batch}:{row_number}: empty filename")
                continue
            if filename in seen:
                failures.append(f"{batch}:{row_number}: duplicate filename {filename}")
            seen.add(filename)
            path = output_dir / filename
            exists = path.is_file()
            if exists:
                declared_pngs.add(filename)
                totals["png"] += 1

            if state in COMPLETE_STATES:
                totals["complete"] += 1
                if not exists:
                    failures.append(f"{batch}:{row_number}: {state} but PNG missing: {filename}")
                    continue
                if not (row.get(COL_EN) or "").strip():
                    failures.append(f"{batch}:{row_number}: {filename} has no English explanation")
                elif not has_headword(row[COL_EN], word):
                    failures.append(f"{batch}:{row_number}: English explanation omits exact headword {word!r} ({filename})")
                if not (row.get(COL_JA) or "").strip():
                    failures.append(f"{batch}:{row_number}: {filename} has no Japanese explanation")
                if not (row.get(COL_DIGEST) or "").strip():
                    failures.append(f"{batch}:{row_number}: {filename} has no image SHA256")
                try:
                    with Image.open(path) as image:
                        if image.format != "PNG" or image.size != (512, 512) or image.mode != "RGBA":
                            failures.append(f"{batch}:{row_number}: invalid PNG format/size/mode: {filename}")
                        elif image.getchannel("A").getextrema() != (0, 255):
                            failures.append(f"{batch}:{row_number}: alpha is not genuinely transparent: {filename}")
                except Exception as exc:  # report corrupt or unreadable image data
                    failures.append(f"{batch}:{row_number}: cannot inspect {filename}: {exc}")
            elif state in HOLD_STATES:
                totals["held"] += 1
                warnings.append(f"{batch}:{row_number}: held as {state}: {filename}")
            else:
                totals["unstarted"] += 1
                if exists:
                    failures.append(f"{batch}:{row_number}: PNG exists but row is not marked complete ({state or 'blank'}): {filename}")

        for path in output_dir.iterdir():
            if path.is_file() and path.suffix.lower() == ".png" and path.name not in seen:
                failures.append(f"{batch}: PNG has no matching CSV filename: {path.name}")

    print("Batches:", f"{args.start:03d}-{args.end:03d}")
    print("Rows:", totals["rows"], "PNG files:", totals["png"], "complete rows:", totals["complete"])
    print("Held rows:", totals["held"], "unstarted rows:", totals["unstarted"])
    for item in warnings:
        print("HOLD:", item)
    for item in failures:
        print("FAIL:", item)
    print("RESULT:", "FAIL" if failures or warnings or totals["unstarted"] else "PASS")
    return 1 if failures or warnings or totals["unstarted"] else 0


if __name__ == "__main__":
    sys.exit(main())
