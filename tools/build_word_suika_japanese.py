#!/usr/bin/env python3
"""日本語ワードスイカ用に、絵のあるひらがな語だけを書き出す。"""
import argparse
import json
import re
from pathlib import Path


def image_name(text):
    text = re.sub(r"^to\s+", "", (text or "").strip(), flags=re.I)
    return re.sub(r"\s+", "_", text.strip("-‐‑‒–—"))


def hiragana(text):
    return "".join(chr(ord(c) - 0x60) if "ァ" <= c <= "ヴ" else c for c in (text or ""))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", type=Path, required=True)
    ap.add_argument("--images", type=Path, required=True)
    ap.add_argument("--output", type=Path, required=True)
    args = ap.parse_args()

    images = {p.stem.lower() for p in args.images.glob("*.png")}
    output, seen = [], set()
    for row in json.loads(args.index.read_text(encoding="utf-8")):
        word, reading, picture, english = row[0], row[1], row[3], row[4]
        # 辞書に複数の読みが「・」で併記される場合は、先頭の主の読みを使う。
        kana = hiragana((reading or word).split("・", 1)[0])
        if not re.fullmatch(r"[ぁ-ゔー]{2,8}", kana) or kana in seen:
            continue
        candidates = [picture, *(english or "").split(";")]
        picture = next((image_name(x) for x in candidates if image_name(x).lower() in images), "")
        if not picture:
            continue
        seen.add(kana)
        output.append({"w": kana, "ja": word, "pic": picture})

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    script = args.output.with_suffix(".js")
    script.write_text(
        "globalThis.WORD_SUIKA_JA_WORDS=" + json.dumps(output, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(output)} Japanese illustrated words -> {args.output}")


if __name__ == "__main__":
    main()
