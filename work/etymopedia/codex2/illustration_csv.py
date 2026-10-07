"""Preserve assigned CSVs while recording image production and review.

Only the three assigned CSVs and their baseline are writable here. Importing
this module loads validation definitions, never dictionary data or a sidecar.
"""
from __future__ import annotations

import csv
import hashlib
import importlib.util
import io
import json
import os
import re
import sys
import threading
import uuid
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_DIR = ROOT / "codex2"
TODO = Path(r"D:\etymon-source\tools\word-art-todo.csv")
SCENE_FUNCTIONS = Path(r"D:\etymon-source\tools\illustration_scenes.py")
BASELINE = ROOT / "_illust" / ".codex2-csv-baseline.json"
BATCHES = ("028", "029", "030")
LEGACY_COLUMNS = (
    "ファイル名", "語義", "対象語義", "画像生成プロンプト",
    "プロンプト準備状況", "要確認理由", "画風参照画像",
)
ADDITIONAL_COLUMNS = (
    "単語", "語根ID_JSON", "第一英語義", "語義SHA256", "実行プロンプト",
    "解説英語", "解説日本語", "制作状態", "画像SHA256", "画像GitBlobSHA",
    "検品日時", "検品メモ",
)
STATES = {"prompt_ready", "generated", "reviewed", "needs_revision", "error"}
_WRITE_LOCK = threading.RLock()

# This file contains definitions and standard-library imports only. Do not call
# export_scenes or import builders that read app/data/pie/.
_spec = importlib.util.spec_from_file_location("etymopedia_scene_functions", SCENE_FUNCTIONS)
if _spec is None or _spec.loader is None:
    raise ImportError(str(SCENE_FUNCTIONS))
_scenes = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_scenes)
normalize = _scenes.normalize
first_senses = _scenes.first_senses
sense_digest = _scenes.sense_digest
english_word_count = _scenes.english_word_count
includes_headword = _scenes.includes_headword
validate_entry = _scenes.validate_entry


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _batch(value) -> str:
    if isinstance(value, bool):
        raise ValueError("Invalid batch")
    number = str(value)
    if not number.isdecimal():
        raise ValueError("Invalid batch")
    number = f"{int(number):03d}"
    if number not in BATCHES:
        raise ValueError("Only assigned batches 028, 029, 030 are allowed")
    return number


def _csv_path(batch: str) -> Path:
    return CSV_DIR / f"prompt_rows_{_batch(batch)}.csv"


def _decode_csv(data: bytes):
    with io.StringIO(data.decode("utf-8-sig"), newline="") as stream:
        reader = csv.DictReader(stream)
        fields = reader.fieldnames
        if not fields or len(fields) != len(set(fields)):
            raise ValueError("Missing or duplicate CSV columns")
        rows = list(reader)
    if any(None in row or any(value is None for value in row.values()) for row in rows):
        raise ValueError("Malformed CSV record length")
    return list(fields), rows


def _read_assigned(path: Path):
    data = path.read_bytes()
    fields, rows = _decode_csv(data)
    if fields[:len(LEGACY_COLUMNS)] != list(LEGACY_COLUMNS):
        raise ValueError("Original seven columns or their order changed")
    return data, fields, rows


def _encode_csv(fields, rows) -> bytes:
    with io.StringIO(newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, extrasaction="raise", lineterminator="\r\n")
        writer.writeheader()
        writer.writerows(rows)
        return stream.getvalue().encode("utf-8-sig")


def _temporary(path: Path) -> Path:
    return path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")


def _safe_csv_replace(path: Path, original_data: bytes, fields, rows):
    """Read back every value and compare the current bytes before replacement."""
    data = _encode_csv(fields, rows)
    temporary = _temporary(path)
    try:
        with temporary.open("xb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        actual_fields, actual_rows = _decode_csv(temporary.read_bytes())
        if actual_fields != list(fields) or actual_rows != rows:
            raise ValueError("CSV read-back verification failed")
        if path.read_bytes() != original_data:
            raise RuntimeError(f"Concurrent CSV change detected: {path.name}")
        os.replace(temporary, path)
        if path.read_bytes() != data:
            raise RuntimeError(f"CSV changed after replacement: {path.name}")
    finally:
        if temporary.exists():
            temporary.unlink()
    return _sha256(data)


def _read_todo():
    data = TODO.read_bytes()
    fields, rows = _decode_csv(data)
    required = {"ファイル名", "単語", "語根", "語義", "英語"}
    if not required.issubset(fields):
        raise ValueError("Canonical work list is missing identity columns")
    by_filename = defaultdict(list)
    for row in rows:
        roots = row["語根"].split("+") if row["語根"] else []
        ja, en = first_senses({"ja": row["語義"], "en": row["英語"]})
        binding = {
            "word": row["単語"], "roots": roots, "filename": row["ファイル名"],
            "first_ja": ja, "first_en": en,
            "sense_sha256": sense_digest(row["単語"], roots, ja, en),
            "full_ja": row["語義"], "full_en": row["英語"],
        }
        by_filename[row["ファイル名"]].append(binding)
    return data, by_filename


def _unique_binding(by_filename, filename):
    matches = by_filename.get(filename, [])
    if len(matches) != 1:
        raise ValueError(f"Canonical filename has {len(matches)} matches: {filename}")
    result = matches[0]
    if not result["word"] or not result["first_ja"]:
        raise ValueError(f"Canonical word or first Japanese sense missing: {filename}")
    return result


def _same_binding(current, original):
    return all(current[field] == original[field] for field in (
        "word", "roots", "filename", "first_ja", "first_en", "sense_sha256",
    ))


def _new_baseline():
    todo_data, by_filename = _read_todo()
    value = {
        "schema": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "todo_path": str(TODO), "todo_sha256": _sha256(todo_data),
        "definition_source": str(SCENE_FUNCTIONS),
        "legacy_columns": list(LEGACY_COLUMNS),
        "batches": {},
    }
    for batch in BATCHES:
        path = _csv_path(batch)
        data, fields, rows = _read_assigned(path)
        bindings = [_unique_binding(by_filename, row["ファイル名"]) for row in rows]
        value["batches"][batch] = {
            "csv_path": str(path), "original_csv_sha256": _sha256(data),
            "original_columns": fields, "original_rows": rows,
            "bindings": bindings,
        }
    if TODO.read_bytes() != todo_data:
        raise RuntimeError("Canonical work list changed while creating baseline")
    for batch in BATCHES:
        if _sha256(_csv_path(batch).read_bytes()) != value["batches"][batch]["original_csv_sha256"]:
            raise RuntimeError(f"CSV changed while creating baseline: {batch}")
    return value


def _baseline():
    if BASELINE.exists():
        value = json.loads(BASELINE.read_text(encoding="utf-8"))
        if value.get("schema") != 1 or set(value.get("batches", {})) != set(BATCHES):
            raise ValueError("Unsupported CSV baseline")
        return value
    value = _new_baseline()
    data = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    BASELINE.parent.mkdir(parents=True, exist_ok=True)
    temporary = _temporary(BASELINE)
    try:
        with temporary.open("xb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        if json.loads(temporary.read_text(encoding="utf-8")) != value:
            raise ValueError("Baseline read-back verification failed")
        # On Windows rename refuses an existing destination; never replace a
        # baseline from an earlier run or another writer.
        os.rename(temporary, BASELINE)
    finally:
        if temporary.exists():
            temporary.unlink()
    return value


def _check_original_rows(batch_baseline, fields, rows):
    original_fields = batch_baseline["original_columns"]
    original_rows = batch_baseline["original_rows"]
    if fields[:len(original_fields)] != original_fields:
        raise ValueError("Original or unknown CSV column order changed")
    if len(rows) != len(original_rows):
        raise ValueError("Original CSV row count changed")
    for index, (original, row) in enumerate(zip(original_rows, rows), 1):
        for field in LEGACY_COLUMNS:
            if row[field] != original[field]:
                raise ValueError(f"Original CSV value or row order changed: row {index}, {field}")


def _append_note(current: str, note: str) -> str:
    return current if note in current else (current + " | " + note if current else note)


def initialize():
    """Append missing columns and fill only previously empty production cells."""
    with _WRITE_LOCK:
        baseline = _baseline()
        todo_data, by_filename = _read_todo()
        summaries = []
        for batch in BATCHES:
            path = _csv_path(batch)
            old_data, old_fields, old_rows = _read_assigned(path)
            recorded = baseline["batches"][batch]
            _check_original_rows(recorded, old_fields, old_rows)
            fields = old_fields + [field for field in ADDITIONAL_COLUMNS if field not in old_fields]
            rows = [{field: row.get(field, "") for field in fields} for row in old_rows]
            held = []
            for index, (row, binding) in enumerate(zip(rows, recorded["bindings"]), 1):
                current = _unique_binding(by_filename, row["ファイル名"])
                mismatch = normalize(row["対象語義"]) != binding["first_ja"]
                changed = not _same_binding(current, binding)
                initial = {
                    "単語": binding["word"],
                    "語根ID_JSON": json.dumps(binding["roots"], ensure_ascii=False, separators=(",", ":")),
                    "第一英語義": binding["first_en"],
                    "語義SHA256": "" if mismatch else binding["sense_sha256"],
                    "制作状態": "generated" if (ROOT / "_illust" / f"prompt_rows_{batch}" / row["ファイル名"]).is_file() else "prompt_ready",
                }
                for field, value in initial.items():
                    if not row[field]:
                        row[field] = value
                if mismatch or changed:
                    row["制作状態"] = "needs_revision"
                    if mismatch:
                        row["語義SHA256"] = ""
                        note = f"語義照合要確認: CSV対象語義={row['対象語義']}、作業開始時一覧第一語義={binding['first_ja']}、第一英語義={binding['first_en']}。旧7列を保持し、自動変更しない。"
                        row["検品メモ"] = _append_note(row["検品メモ"], note)
                    if changed:
                        row["検品メモ"] = _append_note(row["検品メモ"], "作業開始時から原本作業一覧の識別情報または語義が変更。自動上書きせず要確認。")
                    held.append({"index": index, "filename": row["ファイル名"]})
                if row["制作状態"] not in STATES:
                    raise ValueError(f"Unrecognized or forbidden production state: {row['制作状態']}")
            # Preserve every pre-existing value, including unknown columns.
            for original, migrated in zip(old_rows, rows):
                for field in old_fields:
                    if field in LEGACY_COLUMNS or field not in ADDITIONAL_COLUMNS:
                        if migrated[field] != original[field]:
                            raise ValueError(f"Existing value changed during migration: {field}")
            _check_original_rows(recorded, fields, rows)
            if TODO.read_bytes() != todo_data:
                raise RuntimeError("Canonical work list changed during migration")
            sha = _safe_csv_replace(path, old_data, fields, rows)
            after_data, after_fields, after_rows = _read_assigned(path)
            _check_original_rows(recorded, after_fields, after_rows)
            if after_fields != fields or after_rows != rows or _sha256(after_data) != sha:
                raise ValueError("Final migration verification failed")
            summaries.append({
                "batch": batch, "rows": len(rows), "columns": len(fields),
                "existing_columns_preserved": len(old_fields),
                "all_original_values_and_order_preserved": True,
                "csv_sha256": sha, "needs_revision": held,
                "states": {state: sum(row["制作状態"] == state for row in rows) for state in sorted(STATES)},
            })
        return {"baseline": str(BASELINE), "batches": summaries}


def _check_caption(row):
    english = row["解説英語"]
    if english:
        if not includes_headword(english, row["単語"]):
            raise ValueError("English explanation must include the exact headword")
        if english_word_count(english) > 18:
            raise ValueError("English explanation exceeds 18 words")


def _check_reviewed(row):
    """Check the recorded review without inventing visual inspection evidence."""
    if not row["実行プロンプト"] and "既存画像への解説追加・実行プロンプト不明" not in row["検品メモ"]:
        raise ValueError("Reviewed new production requires the actually sent prompt")
    timestamp = datetime.fromisoformat(row["検品日時"])
    if timestamp.tzinfo is None or timestamp.utcoffset() is None:
        raise ValueError("Review timestamp must include its timezone")
    filename = row["ファイル名"]
    if not filename.endswith(".png") or Path(filename).name != filename:
        raise ValueError("Unsafe or non-PNG formal filename")
    roots = json.loads(row["語根ID_JSON"])
    entry = {
        "w": row["単語"], "p": roots, "art": filename[:-4],
        "sense": {"index": 0, "ja": row["対象語義"], "en": row["第一英語義"], "sha256": row["語義SHA256"]},
        "scene": {"en": row["解説英語"], "ja": row["解説日本語"]},
        "image": {"path": f"assets/word/{filename}", "sha256": row["画像SHA256"], "git_blob_sha": row["画像GitBlobSHA"]},
        "review": {"status": "reviewed", "reviewed_at": row["検品日時"], "method": "検品メモに記録した実画像と日英解説の確認", "notes": row["検品メモ"]},
    }
    validate_entry(entry)
    image_path = ROOT / "_illust" / f"prompt_rows_{_batch(row['_batch'])}" / filename
    data = image_path.read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
    if _sha256(data) != row["画像SHA256"] or blob != row["画像GitBlobSHA"]:
        raise ValueError("Reviewed PNG hashes do not match its current bytes")
    from PIL import Image
    with Image.open(io.BytesIO(data)) as image:
        image.load()
        if image.format != "PNG" or image.size != (512, 512) or image.mode != "RGBA":
            raise ValueError("Reviewed PNG must be 512x512 RGBA")
        low, high = image.getchannel("A").getextrema()
        if low != 0 or high <= 0:
            raise ValueError("Reviewed PNG needs actual transparency and visible content")


def update_row(batch, index, values):
    """Update one CSV record, preserving every other cell and rejecting old fields."""
    batch = _batch(batch)
    if not isinstance(index, int) or isinstance(index, bool) or index < 1:
        raise ValueError("CSV index must be a positive one-based record number")
    if not isinstance(values, dict) or any(not isinstance(key, str) or not isinstance(value, str) for key, value in values.items()):
        raise TypeError("CSV updates must be a dictionary of string cells")
    forbidden = set(values).intersection(LEGACY_COLUMNS)
    if forbidden:
        raise ValueError("Original seven columns cannot be updated: " + ", ".join(sorted(forbidden)))
    with _WRITE_LOCK:
        baseline = _baseline()
        path = _csv_path(batch)
        old_data, fields, old_rows = _read_assigned(path)
        recorded = baseline["batches"][batch]
        _check_original_rows(recorded, fields, old_rows)
        if not set(ADDITIONAL_COLUMNS).issubset(fields):
            raise ValueError("Run initialize before updating rows")
        if index > len(old_rows):
            raise IndexError(index)
        if set(values).difference(fields):
            raise ValueError("Unknown update columns: " + ", ".join(sorted(set(values).difference(fields))))
        rows = [row.copy() for row in old_rows]
        row = rows[index - 1]
        row.update(values)
        if row["制作状態"] not in STATES:
            raise ValueError("Invalid production state; applied is forbidden here")
        binding = recorded["bindings"][index - 1]
        roots = json.loads(row["語根ID_JSON"])
        if (row["単語"], roots, row["ファイル名"]) != (binding["word"], binding["roots"], binding["filename"]):
            raise ValueError("CSV row identity differs from its exact original binding")
        if row["第一英語義"] != binding["first_en"]:
            raise ValueError("Cannot replace the original first English sense")
        if row["語義SHA256"] not in ("", binding["sense_sha256"]):
            raise ValueError("Cannot replace the original sense fingerprint")
        todo_data, by_filename = _read_todo()
        try:
            current = _unique_binding(by_filename, row["ファイル名"])
            changed = not _same_binding(current, binding)
            reason = "作業開始時から原本作業一覧の識別情報または語義が変更。自動上書きせず要確認。"
        except ValueError as error:
            changed = True
            reason = f"原本作業一覧との一意対応が失効: {error}。自動上書きせず要確認。"
        mismatch = normalize(row["対象語義"]) != binding["first_ja"]
        if changed or mismatch:
            row["制作状態"] = "needs_revision"
            if mismatch:
                row["語義SHA256"] = ""
                reason = f"CSV対象語義={row['対象語義']}、作業開始時一覧第一語義={binding['first_ja']}。語義照合要確認。"
            row["検品メモ"] = _append_note(row["検品メモ"], reason)
        _check_caption(row)
        if row["制作状態"] == "reviewed":
            if not row["語義SHA256"]:
                raise ValueError("Reviewed row requires its verified original sense fingerprint")
            _check_reviewed(dict(row, _batch=batch))
        # If reviewed text/prompt/image details change, explicit full review
        # evidence must be supplied again, or the row returns to generated.
        prior = old_rows[index - 1]
        review_inputs = {"実行プロンプト", "解説英語", "解説日本語", "画像SHA256", "画像GitBlobSHA"}
        changed_review_input = any(prior[field] != row[field] for field in review_inputs)
        if prior["制作状態"] == "reviewed" and row["制作状態"] == "reviewed" and changed_review_input:
            proof = {"制作状態", "検品日時", "検品メモ", "画像SHA256", "画像GitBlobSHA"}
            if not proof.issubset(values):
                row["制作状態"] = "generated"
                row["検品メモ"] = _append_note(row["検品メモ"], "解説・プロンプト・画像情報が変更。再検品の記録が必要。")
        for row_number, (before, after) in enumerate(zip(old_rows, rows), 1):
            if row_number != index and before != after:
                raise ValueError("An unrelated CSV row changed")
            if row_number == index:
                allowed = set(values) | {"制作状態", "検品メモ", "語義SHA256"}
                if any(before[field] != after[field] for field in fields if field not in allowed):
                    raise ValueError("An unrelated CSV cell changed")
        _check_original_rows(recorded, fields, rows)
        if TODO.read_bytes() != todo_data:
            raise RuntimeError("Canonical work list changed during row update")
        sha = _safe_csv_replace(path, old_data, fields, rows)
        return {"batch": batch, "index": index, "filename": row["ファイル名"], "state": row["制作状態"], "sense_changed": changed, "csv_sha256": sha}


def verify_row_identity(batch, index):
    """Compare the current work-list identity with the preserved start snapshot.

    Changed or mismatched rows are marked needs_revision in the added columns;
    dictionary data and the original seven CSV cells are never changed.
    """
    batch = _batch(batch)
    if not isinstance(index, int) or isinstance(index, bool) or index < 1:
        raise ValueError("CSV index must be a positive one-based record number")
    with _WRITE_LOCK:
        baseline = _baseline()
        _, fields, rows = _read_assigned(_csv_path(batch))
        recorded = baseline["batches"][batch]
        _check_original_rows(recorded, fields, rows)
        if index > len(rows):
            raise IndexError(index)
        row = rows[index - 1]
        binding = recorded["bindings"][index - 1]
        _, by_filename = _read_todo()
        reason = ""
        try:
            current = _unique_binding(by_filename, row["ファイル名"])
            if not _same_binding(current, binding):
                reason = "作業開始時から見出し語・順序付き語根ID・第一和英語義または語義ハッシュが変更。自動上書きせず要確認。"
        except ValueError as error:
            reason = f"原本作業一覧との一意対応が失効: {error}。自動上書きせず要確認。"
        if normalize(row["対象語義"]) != binding["first_ja"]:
            reason = _append_note(reason, f"CSV対象語義={row['対象語義']}、作業開始時一覧第一語義={binding['first_ja']}。語義照合要確認。")
        try:
            roots = json.loads(row["語根ID_JSON"])
            if (row["単語"], roots, row["ファイル名"], row["第一英語義"]) != (
                binding["word"], binding["roots"], binding["filename"], binding["first_en"],
            ):
                reason = _append_note(reason, "CSVの追加識別列が作業開始時の正確な対応と不一致。")
            if row["語義SHA256"] != binding["sense_sha256"]:
                reason = _append_note(reason, "CSVの語義SHA256が未確定または開始時の第一語義と不一致。")
        except (KeyError, ValueError, TypeError) as error:
            reason = _append_note(reason, f"CSVの追加識別列を確認できない: {error}")
        if reason:
            # Keep even a corrupt added identity cell for investigation. The
            # normal update API correctly rejects it, so recording this hold
            # updates only state and notes without replacing that evidence.
            original_data, current_fields, current_rows = _read_assigned(_csv_path(batch))
            _check_original_rows(recorded, current_fields, current_rows)
            if current_rows[index - 1] != row:
                raise RuntimeError("CSV row changed during identity verification")
            if not {"制作状態", "検品メモ"}.issubset(current_fields):
                raise ValueError("Run initialize before verifying row identities")
            held_rows = [item.copy() for item in current_rows]
            held_rows[index - 1]["制作状態"] = "needs_revision"
            held_rows[index - 1]["検品メモ"] = _append_note(row.get("検品メモ", ""), reason)
            _safe_csv_replace(_csv_path(batch), original_data, current_fields, held_rows)
            return {"ok": False, "reason": reason}
        return {"ok": True, "reason": ""}


if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] != "initialize":
        raise SystemExit("Usage: illustration_csv.py initialize")
    print(json.dumps(initialize(), ensure_ascii=True))
