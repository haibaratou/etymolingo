"""Reuse verified 028-030 artwork in explicitly selected 031-035 CSVs.

This does not generate images or perform a new visual review. It carries forward
the source's actual prompt, captions, image bytes, and original review evidence.
Generation state and dictionary files are never written.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import sys
import time
import uuid
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from PIL import Image
import illustration_csv as csv_io


SOURCE_BATCHES = ("028", "029", "030")
TARGET_BATCHES = ("031", "032", "033", "034", "035")
ROOT = Path(__file__).resolve().parent.parent
ILLUST = ROOT / "_illust"
OLD_BASELINE = ILLUST / ".codex2-csv-baseline.json"
RECORDS = ILLUST / ".codex2-generation-records.jsonl"
PRODUCTION_FIELDS = (
    "実行プロンプト", "解説英語", "解説日本語", "画像SHA256",
    "画像GitBlobSHA", "検品日時", "検品メモ",
)


def hashes(data):
    return (
        hashlib.sha256(data).hexdigest(),
        hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest(),
    )


def emit(value):
    print(json.dumps(value, ensure_ascii=True), flush=True)


def identity(row):
    roots = json.loads(row["語根ID_JSON"])
    if (not isinstance(roots, list)
            or any(not isinstance(root, str) or not root for root in roots)):
        raise ValueError("Ordered roots must be a string array, including a valid empty array")
    if not row["単語"] or not row["語義SHA256"]:
        raise ValueError("Missing exact headword or verified sense fingerprint")
    expected = csv_io.sense_digest(
        row["単語"], roots, csv_io.normalize(row["対象語義"]), row["第一英語義"],
    )
    if row["語義SHA256"] != expected:
        raise ValueError("Sense fingerprint differs from the recorded first senses")
    return (
        row["ファイル名"], row["単語"], tuple(roots),
        csv_io.normalize(row["対象語義"]), row["第一英語義"], row["語義SHA256"],
    )


def check_binding(row, binding):
    actual = identity(row)
    expected = (
        binding["filename"], binding["word"], tuple(binding["roots"]),
        binding["first_ja"], binding["first_en"], binding["sense_sha256"],
    )
    if actual != expected:
        raise ValueError("Exact filename, ordered roots, or first-sense baseline mismatch")


def image_path(batch, filename):
    csv_io._check_assigned_filename(filename)
    folder = ILLUST / f"prompt_rows_{batch}"
    path = folder / filename
    if path.resolve().parent != folder.resolve():
        raise ValueError("Image path resolves outside its batch directory")
    return path


def validate_image(data, row):
    sha, blob = hashes(data)
    if (sha, blob) != (row["画像SHA256"], row["画像GitBlobSHA"]):
        raise ValueError("Source PNG bytes disagree with one or both recorded hashes")
    with Image.open(io.BytesIO(data)) as image:
        image.load()
        if (image.format, image.size, image.mode) != ("PNG", (512, 512), "RGBA"):
            raise ValueError("Source PNG is not 512x512 RGBA")
        if image.getchannel("A").getextrema() != (0, 255):
            raise ValueError("Source PNG must contain fully transparent and opaque pixels")
    return sha, blob


def validate_proof(row):
    if row["制作状態"] != "reviewed":
        raise ValueError("Source has not been reviewed")
    if any(not row[field].strip() for field in PRODUCTION_FIELDS):
        raise ValueError("Actual prompt, bilingual captions, hashes, or review evidence missing")
    stamp = datetime.fromisoformat(row["検品日時"])
    if stamp.tzinfo is None or stamp.utcoffset() is None:
        raise ValueError("Original review timestamp needs its timezone")
    if not csv_io.includes_headword(row["解説英語"], row["単語"]):
        raise ValueError("English caption lacks the exact headword")
    if csv_io.english_word_count(row["解説英語"]) > 18:
        raise ValueError("English caption exceeds 18 words")


def load_sources(canonical):
    baseline = json.loads(OLD_BASELINE.read_text(encoding="utf-8"))
    if baseline.get("schema") != 1 or set(baseline.get("batches", {})) != set(SOURCE_BATCHES):
        raise ValueError("Missing or unsupported original 028-030 baseline")
    candidates = defaultdict(list)
    problems = defaultdict(list)
    for batch in SOURCE_BATCHES:
        path = csv_io.CSV_DIR / f"prompt_rows_{batch}.csv"
        _, fields, rows = csv_io._read_assigned(path)
        recorded = baseline["batches"][batch]
        csv_io._check_original_rows(recorded, fields, rows)
        if not set(csv_io.ADDITIONAL_COLUMNS).issubset(fields):
            raise ValueError(f"Source CSV is not initialized: {batch}")
        if len(recorded["bindings"]) != len(rows):
            raise ValueError(f"Source baseline binding count differs: {batch}")
        for index, (row, binding) in enumerate(zip(rows, recorded["bindings"]), 1):
            if row["制作状態"] != "reviewed":
                continue
            name = row["ファイル名"]
            try:
                check_binding(row, binding)
                current = csv_io._row_binding(canonical, row)
                if not csv_io._same_binding(current, binding):
                    raise ValueError("Canonical identity or first sense changed after source review")
                validate_proof(row)
                source = image_path(batch, name)
                data = source.read_bytes()
                sha, blob = validate_image(data, row)
                candidates[name].append({
                    "batch": batch, "index": index, "row": row.copy(),
                    "path": source, "data": data, "sha256": sha, "git_blob_sha": blob,
                })
            except Exception as error:
                problems[name].append(f"{batch}/{index}: {type(error).__name__}: {error}")
    confirmed = {}
    for name, matches in candidates.items():
        # A bad reviewed duplicate must not silently disappear from selection.
        if problems.get(name):
            continue
        first = matches[0]
        signature = (identity(first["row"]), tuple(first["row"][field] for field in PRODUCTION_FIELDS))
        if any((identity(item["row"]), tuple(item["row"][field] for field in PRODUCTION_FIELDS))
               != signature for item in matches[1:]):
            problems[name].append("Reviewed duplicate sources disagree in identity or production evidence")
            continue
        confirmed[name] = first
    return confirmed, problems


def load_target(batch, baseline):
    path = csv_io._csv_path(batch)
    _, fields, rows = csv_io._read_assigned(path)
    recorded = baseline["batches"][batch]
    csv_io._check_original_rows(recorded, fields, rows)
    if not set(csv_io.ADDITIONAL_COLUMNS).issubset(fields):
        raise ValueError("Run initialize before reuse")
    if len(recorded["bindings"]) != len(rows):
        raise ValueError("Target baseline binding count differs")
    return rows, recorded


def copy_without_overwrite(target, data):
    if os.name != "nt":
        raise RuntimeError("This no-overwrite os.rename operation requires Windows")
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        if target.read_bytes() != data:
            raise ValueError("Existing target PNG differs; it has been retained without overwrite")
        return False
    temporary = target.with_name(f".{target.name}.{uuid.uuid4().hex}.tmp")
    try:
        with temporary.open("xb") as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        if temporary.read_bytes() != data:
            raise ValueError("Temporary PNG byte verification failed")
        try:
            # Windows rename fails if the target was created concurrently.
            os.rename(temporary, target)
            created = True
        except FileExistsError:
            if target.read_bytes() != data:
                raise ValueError("Concurrently created target differs; it has been retained")
            created = False
        if target.read_bytes() != data:
            raise ValueError("Saved target bytes changed during reuse")
        return created
    finally:
        if temporary.exists():
            temporary.unlink()


def existing_record_keys():
    keys = set()
    if not RECORDS.exists():
        raise ValueError("The existing generation record journal is missing")
    with RECORDS.open(encoding="utf-8") as stream:
        for line in stream:
            if not line.strip():
                continue
            record = json.loads(line)
            if not record.get("reused_from"):
                continue
            row = record.get("row", {})
            keys.add((row.get("batch"), row.get("index"), row.get("name"), record.get("sha256")))
    return keys


def append_record(record):
    # One binary append keeps each JSON line together between cooperating runs.
    data = (json.dumps(record, ensure_ascii=False) + "\n").encode("utf-8")
    descriptor = os.open(RECORDS, os.O_APPEND | os.O_WRONLY | os.O_BINARY)
    try:
        if os.write(descriptor, data) != len(data):
            raise RuntimeError("Generation journal append was incomplete")
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def process_row(batch, index, row, binding, source, canonical, record_keys):
    check_binding(row, binding)
    if identity(row) != identity(source["row"]):
        raise ValueError("Target and old reviewed row do not share the exact identity and first senses")
    current = csv_io._row_binding(canonical, row)
    if not csv_io._same_binding(current, binding):
        raise ValueError("Canonical target identity or first sense changed after initialize")
    if row["制作状態"] in {"needs_revision", "error", "applied"}:
        raise ValueError("Existing hold/error/applied state retained")
    old = source["row"]
    # Re-read the source immediately before writing; do not copy cached stale bytes.
    data = source["path"].read_bytes()
    sha, blob = validate_image(data, old)
    target = image_path(batch, row["ファイル名"])
    values = {field: old[field] for field in PRODUCTION_FIELDS}
    values["制作状態"] = "reviewed"
    reuse_note = f"旧prompt_rows_{source['batch']}から検品済み画像を再利用。元の実物照合・検品証跡を保持。"
    values["検品メモ"] = reuse_note + " " + old["検品メモ"]
    for field in PRODUCTION_FIELDS:
        if field == "検品メモ":
            continue
        if row[field] and row[field] != values[field]:
            raise ValueError(f"Existing target production value differs and is retained: {field}")
    if row["検品メモ"] and row["検品メモ"] not in {old["検品メモ"], values["検品メモ"]}:
        raise ValueError("Existing target review notes differ and are retained")
    if row["制作状態"] not in {"prompt_ready", "generated", "reviewed"}:
        raise ValueError("Unrecognized target production state")
    created = copy_without_overwrite(target, data)
    validate_image(target.read_bytes(), old)
    metadata_needed = any(row[field] != value for field, value in values.items())
    if metadata_needed:
        result = csv_io.update_row(batch, index, values)
        if result["state"] != "reviewed" or result["sense_changed"]:
            raise ValueError("CSV update detected semantic drift; image retained and row requires confirmation")
    _, _, after_rows = csv_io._read_assigned(csv_io._csv_path(batch))
    after = after_rows[index - 1]
    if any(after[field] != value for field, value in values.items()):
        raise ValueError("CSV production values differ after reuse save")
    check_binding(after, binding)
    csv_io._check_reviewed(dict(after, _batch=batch))
    key = (batch, index, row["ファイル名"], sha)
    if key not in record_keys:
        append_record({
            "row": {"batch": batch, "index": index, "name": row["ファイル名"],
                    "prompt": row["画像生成プロンプト"], "word": row["単語"],
                    "sense": row["対象語義"], "roots_json": row["語根ID_JSON"],
                    "sense_sha256": row["語義SHA256"]},
            "row_key": {"batch": batch, "index": index, "filename": row["ファイル名"]},
            "source": str(source["path"]), "target": str(target),
            "reused_from": {"batch": source["batch"], "index": source["index"],
                            "filename": old["ファイル名"]},
            "sha256": sha, "git_blob_sha": blob,
            "actual_prompt": old["実行プロンプト"],
            "caption": {"en": old["解説英語"], "ja": old["解説日本語"]},
            "saved_at": time.time(), "reviewed_at": old["検品日時"],
            "review_note": values["検品メモ"], "new_visual_review": False,
        })
        record_keys.add(key)
    return "reused" if created or metadata_needed else "already_reused"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--batches", nargs="+", required=True, choices=TARGET_BATCHES,
                        help="Explicit target batch subset; there is no default")
    args = parser.parse_args()
    if len(args.batches) != len(set(args.batches)):
        parser.error("Duplicate batches are not allowed")
    if csv_io.BATCHES != TARGET_BATCHES or not csv_io.BASELINE.exists():
        raise ValueError("Initialize the complete 031-035 assignment before reuse")
    baseline = json.loads(csv_io.BASELINE.read_text(encoding="utf-8"))
    if baseline.get("schema") != 1 or set(baseline.get("batches", {})) != set(TARGET_BATCHES):
        raise ValueError("Unsupported 031-035 baseline")
    _, canonical = csv_io._read_todo()
    sources, source_problems = load_sources(canonical)
    targets = {batch: load_target(batch, baseline) for batch in args.batches}
    record_keys = existing_record_keys()
    emit({"phase": "preflight", "batches": args.batches,
          "validated_source_filenames": len(sources),
          "source_problem_filenames": len(source_problems)})
    summaries = []
    for batch in sorted(args.batches):
        rows, recorded = targets[batch]
        counts = {"reused": 0, "already_reused": 0, "no_reviewed_source": 0, "errors": 0}
        errors = []
        for index, row in enumerate(rows, 1):
            name = row["ファイル名"]
            try:
                if name in source_problems:
                    raise ValueError("; ".join(source_problems[name]))
                source = sources.get(name)
                if source is None:
                    counts["no_reviewed_source"] += 1
                    continue
                status = process_row(batch, index, row, recorded["bindings"][index - 1],
                                     source, canonical, record_keys)
                counts[status] += 1
                if (counts["reused"] + counts["already_reused"]) % 25 == 0:
                    emit({"phase": "progress", "batch": batch, "index": index, **counts})
            except Exception as error:
                counts["errors"] += 1
                detail = {"batch": batch, "index": index, "filename": name,
                          "error": f"{type(error).__name__}: {error}"}
                errors.append(detail)
                emit({"phase": "row_error", **detail})
        _, fields, final_rows = csv_io._read_assigned(csv_io._csv_path(batch))
        csv_io._check_original_rows(recorded, fields, final_rows)
        summary = {"batch": batch, **counts, "errors_detail": errors,
                   "original_columns_and_order_preserved": True}
        summaries.append(summary)
        emit({"phase": "batch_complete", **summary})
    emit({"phase": "complete", "batches": summaries, "generation_state_modified": False})
    return 1 if any(summary["errors"] for summary in summaries) else 0


if __name__ == "__main__":
    sys.exit(main())
