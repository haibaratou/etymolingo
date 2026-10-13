"""Prepare only canonical, committed Kanji SURVIVOR changes for PR 27.

This local review helper never changes Git history or contacts GitHub.
"""
from __future__ import annotations

import base64
import hashlib
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(r"D:\etymolingo")
SCOPE = "work/etymopedia/kanji/godot/"
PREVIOUS_LOCAL = "b1d80ff75b09ffc0dc21ffefd24e230d8dabb316"
PREVIOUS_REMOTE = "2b1c8a7978bda43e1e67bed276ea4b965be1d8aa"
PREVIOUS_TREE = "75e8ab5bd0d1a739cd164f854052d12a6aafc496"
OUT = REPO / SCOPE / "art/review/github-glyph-blobs.json"


def git(*args: str) -> bytes:
    return subprocess.check_output(["git", "-C", str(REPO), *args])


def main() -> None:
    revision = sys.argv[1] if len(sys.argv) > 1 else "HEAD"
    commit = git("rev-parse", revision).decode().strip()
    tree = git("rev-parse", commit + "^{tree}").decode().strip()
    previous_tree = git("rev-parse", PREVIOUS_LOCAL + "^{tree}").decode().strip()
    if previous_tree != PREVIOUS_TREE:
        raise RuntimeError("Previous local and remote tree evidence disagrees")
    changed = [p.decode("utf-8") for p in git(
        "diff", "--name-only", "-z", PREVIOUS_LOCAL, commit
    ).split(b"\0") if p]
    if not changed:
        raise RuntimeError("No committed glyph changes")
    if any(not p.startswith(SCOPE) for p in changed):
        raise RuntimeError("Final commit includes files outside the game")
    forbidden = ("art/review/", "art/qa/", ".godot/")
    files = []
    for path in changed:
        rel = path[len(SCOPE):]
        if any(rel.startswith(prefix) for prefix in forbidden):
            raise RuntimeError("Review or cache material was committed: " + path)
        entry = git("ls-tree", "-z", commit, "--", path).rstrip(b"\0")
        if not entry:
            files.append({"path": path, "mode": "100644", "type": "blob", "sha": None})
            continue
        identity, observed_path = entry.split(b"\t", 1)
        mode, kind, sha = identity.decode().split(" ")
        if observed_path.decode("utf-8") != path or kind != "blob":
            raise RuntimeError("Unexpected tree entry: " + path)
        content = git("cat-file", "blob", sha)
        files.append({
            "path": path, "mode": mode, "type": kind, "sha": sha,
            "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest(),
            "content": base64.b64encode(content).decode("ascii"), "encoding": "base64",
        })
    result = {
        "repository": "haibaratou/etymolingo",
        "branch": "codex/kanji-survivor-ink-inheritance-20261013",
        "pr_number": 27, "local_commit": commit, "local_tree": tree,
        "previous_local": PREVIOUS_LOCAL, "previous_remote": PREVIOUS_REMOTE,
        "previous_tree": PREVIOUS_TREE, "files": files,
    }
    OUT.write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({k: v for k, v in result.items() if k != "files"}, ensure_ascii=False))
    print(json.dumps({"file_count": len(files), "total_bytes": sum(f.get("bytes", 0) for f in files),
                      "files": [{k: v for k, v in f.items() if k not in ("content", "encoding")} for f in files]},
                     ensure_ascii=False))


if __name__ == "__main__":
    main()
