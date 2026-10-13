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

# Make Me a Hanzi にない字（日本の新字体など）は、部品の並びから部首を推す
RIGHT_RADS = set("刀力攴戈欠頁隹犬鳥殳斤阜彡見寸")
def guess_rad(c):
    lv = [nm(x) for x in K.get(c, {}).get("lv", [])]
    if len(lv) < 2:
        return ""
    if lv[-1] in RIGHT_RADS:
        return lv[-1]
    if lv[0] in FAM_OF:
        return lv[0]
    for x in lv:
        if x in FAM_OF:
            return x
    return lv[0]
for c in K:
    if c not in R and len(K[c].get("lv", [])) >= 2:
        g = guess_rad(c)
        if g:
            R[c] = [g, ""]

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

# 字典にない字で、遊びに使いたいもの（朧 = 月＋龍）
EXTRA = {"朧": {"en": "hazy", "jp": "おぼろ", "stk": 20, "g": 0, "op": ["月", "龍"], "lv": ["月", "龍"]}}
for c, v in EXTRA.items():
    if c not in K:
        st = {}
        for x in v["lv"]:
            f = FAM_OF.get(x)
            if f:
                s0 = d["FAM"][f]["stat"]
                st[s0] = st.get(s0, 0) + 1
        K[c] = dict(v, b="光", b0=1, s=st)
        R[c] = [v["op"][0], ""]
        key = v["op"][0] + "+" + v["op"][1]
        if c not in d["REC"].get(key, []):
            d["REC"].setdefault(key, []).append(c)

# 二つに割れない字（獣・流…）にも、部首＋いちばん大きな残りの部品で作れる道を足す
REC = d["REC"]
for c, k in K.items():
    if k.get("op0") is not None:
        k["op"] = k.pop("op0")
for key in list(REC):
    REC[key] = [r for r in REC[key] if not K.get(r, {}).get("op_rad")]
    if not REC[key]:
        del REC[key]
for c, k in K.items():
    k.pop("op_rad", None)
    if k.get("op") or len(k.get("lv", [])) < 2:
        continue
    r = R.get(c)
    rad = nm(r[0]) if r else ""
    if not rad or rad == c or rad not in K:
        continue
    rest = [x for x in k["lv"] if x != rad and x in K and x != c]
    if not rest:
        continue
    rest.sort(key=lambda x: -int(K[x].get("stk", 0)))
    k["op"] = [rad, rest[0]]
    k["op_rad"] = True
    REC.setdefault(rad + "+" + rest[0], []).append(c)

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
# 字ごとの個性: 同じ部首でも、画数・学年・意味で能力値が変わる
#   画数が多い → 威力↑（重い字）、少ない → 速さ↑（軽い字）。学年が上・人名用 → 威力↑（珍しい字）
#   意味（英語）に含まれる語で、範囲・数・持続・貫通・押し・威力・速さが上がる。部品の数 → 数↑
WORDS = {
    "pow": "great big strong power mighty fierce violent destroy kill death war king emperor dragon giant heavy rage fury angry evil demon oppress cruel brave hero master supreme".split(),
    "area": "wide vast broad spread large sea ocean sky heaven world all universal flood overflow field plain lake wave storm cloud fog mist far whole".split(),
    "rate": "fast quick swift speed hurry rapid fly dash run gallop leap jump wind flash instant sudden lightning thunder".split(),
    "count": "many multi crowd forest rain group numerous scatter every swarm flock grove crowd plural various myriad tree bamboo grass sand star".split(),
    "dur": "long eternal ever forever last endure slow stay remain keep old ancient permanent continue lasting stable calm peace".split(),
    "pierce": "pierce through penetrate sharp needle thrust stab arrow spear sword blade cut pin point thorn".split(),
    "knock": "push strike hit blow beat bump ram crush break shock repel drive kick throw explode burst".split(),
}
import re as _re
for c, k in K.items():
    if "s0" not in k:
        k["s0"] = dict(k.get("s", {}))
    st = dict(k["s0"])
    stk = int(k.get("stk", 0) or 0)
    g = int(k.get("g", 0) or 0)
    add = lambda key, v: st.__setitem__(key, st.get(key, 0) + v)
    if stk >= 10:
        add("pow", 1 + (stk - 10) // 4)
    if stk <= 6:
        add("rate", 2 if stk <= 4 else 1)
    if g >= 7 or g == 0:
        add("pow", 1)
    en = (k.get("en") or "").lower()
    toks = set(_re.findall(r"[a-z]+", en))
    for key, ws in WORDS.items():
        for w in ws:
            if w in toks or (len(w) >= 4 and en.startswith(w)):
                add(key, 2)
                break
    nl = len(k.get("lv", []))
    if nl >= 3:
        add("count", 1)
    if nl >= 5:
        add("area", 1)
    for key in list(st):
        st[key] = min(6, st[key])
    k["s"] = st

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(stat)
