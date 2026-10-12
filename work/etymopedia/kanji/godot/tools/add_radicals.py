# -*- coding: utf-8 -*-
"""仲間の能力を「部首」から継承させる（data/kanji_db.json に書き足す）。

使い方: python tools/add_radicals.py
  tools/radicals_mmah.json … Make Me a Hanzi の dictionary.txt から 字→[部首, 意符] を抜き出したもの
                              (github.com/skishore/makemeahanzi, Arphic Public License / LGPL — 製品前に確認)

決まり:
  - 仲間になれるのは、二つの部品を合わせた字だけ（op が二つ）。一字だけの字（一・犬・刀…）は材料にしかならない。
  - 能力（本体の系統）は、その字の部首から継承する。部首に系統がなければ意符、それもなければ部品のうち系統のある方。
  - どの部品にも系統がなければ、仲間にはならない。
  書き足す項目: ally（仲間になれるか）・rad（部首）・src（能力をくれた部品）・via（その系統の素）・b（本体の系統）
"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
P = os.path.join(ROOT, "data", "kanji_db.json")
d = json.load(open(P, encoding="utf-8"))
R = json.load(open(os.path.join(HERE, "radicals_mmah.json"), encoding="utf-8"))
NORM = d["NORM"]
FAM_OF = {}
for f, v in d["FAM"].items():
    for c in v["ch"]:
        FAM_OF.setdefault(c, f)
K = d["K"]
nm = lambda c: NORM.get(c, c)

def leaves(p):
    out = [p]
    if p in K:
        out += K[p]["lv"]
    return [nm(x) for x in out]

def holds(p, x):
    if x == nm(p) or x in leaves(p):
        return True
    r = R.get(p)
    return bool(r and nm(r[0]) == x)

stat = {"rad": 0, "sem": 0, "part": 0, "none": 0, "single": 0}
for c, k in K.items():
    for key in ("ally", "rad", "src", "via"):
        k.pop(key, None)
    op = k.get("op") or []
    r = R.get(c, ["", ""])
    rad, sem = nm(r[0]), nm(r[1])
    if rad:
        k["rad"] = rad
    if len(op) != 2:
        stat["single"] += 1
        continue
    got = None
    for how, x in (("rad", rad), ("sem", sem)):
        if x and FAM_OF.get(x):
            for p in op:
                if holds(p, x):
                    got = (how, p, x, FAM_OF[x])
                    break
        if got:
            break
    if not got:
        for p in op:
            for x in leaves(p):
                if FAM_OF.get(x):
                    got = ("part", p, x, FAM_OF[x])
                    break
            if got:
                break
    if not got:
        stat["none"] += 1
        continue
    stat[got[0]] += 1
    k["ally"] = True
    k["src"], k["via"], k["b"] = got[1], got[2], got[3]
json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(stat)
