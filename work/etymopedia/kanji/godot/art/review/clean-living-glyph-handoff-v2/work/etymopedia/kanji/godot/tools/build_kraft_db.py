# -*- coding: utf-8 -*-
"""作字の字典（data/kanji_db.json）を作る。

使い方: python tools/build_kraft_db.py <cjkvi ids.txt> <kanji-data kanji.json>
  ids.txt   … https://github.com/cjkvi/cjkvi-ids （CHISE IDS をもとにした字の組み立て）
  kanji.json… https://github.com/davidluzgouveia/kanji-data （KANJIDIC2 をもとにした英語の意味・画数・学年）

字の性能は「素」の足し算で決まる:
  本体（行動）… 字を組み立てる部品のうち、最初に見つかった「素」の系統（偏・冠・外側を先に見る）
  能力値     … すべての部品（葉まで分解）の系統ごとの能力値の合計
"""
import json, re, sys, os
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# 異体の部首は元の字にそろえる（魂は元の字で数える）
NORM = {"氵": "水", "亻": "人", "扌": "手", "忄": "心", "灬": "火", "犭": "犬", "礻": "示", "衤": "衣",
        "刂": "刀", "訁": "言", "飠": "食", "釒": "金", "糹": "糸", "⺮": "竹", "艹": "艸", "罒": "网",
        "⻌": "辵", "辶": "辵", "⻏": "邑", "⻖": "阜", "阝": "阜", "邑": "阜", "攵": "攴", "爫": "爪", "⺼": "肉", "⺌": "小",
        "⺍": "小", "灭": "火", "戊": "戌", "朩": "木", "𥫗": "竹", "㇀": "一", "⺊": "卜",
        "⺈": "刀", "⺧": "牛", "⺶": "羊", "⺷": "羊", "⺹": "老", "⺺": "聿", "⻊": "足", "𧾷": "足"}

# 系統: 本体の行動と、部品として上がる能力値
FAM = {
    "波": {"stat": "area",   "ch": "水 冫 雨 川 氷 泉 風 气"},
    "炎": {"stat": "pow",    "ch": "火 赤 黒"},
    "樹": {"stat": "dur",    "ch": "木 竹 艸 禾 米 麦 生 屮 耒 瓜 豆 麻 黍 束"},
    "光": {"stat": "count",  "ch": "日 月 白 夕 光 目 見 辰 小 青"},
    "刃": {"stat": "pierce", "ch": "刀 刃 戈 斤 矛 殳 戌 戍 戉 辛 干 斧"},
    "矢": {"stat": "rate",   "ch": "弓 矢 弋 飛 羽 方"},
    "声": {"stat": "count",  "ch": "口 言 音 耳 舌 曰 欠 鼓 文"},
    "獣": {"stat": "pow",    "ch": "犬 馬 鳥 隹 虫 魚 羊 牛 豕 鹿 龍 竜 象 虎 虍 鼠 亀 豸 犮 毛 皮 角"},
    "岩": {"stat": "knock",  "ch": "土 山 石 金 玉 王 田 阜 里 貝 厂 工"},
    "霊": {"stat": "dur",    "ch": "示 心 鬼 申 歹 卜 巫 玄 亡 骨 血"},
    "人": {"stat": "rate",   "ch": "人 手 又 寸 女 子 力 足 止 攴 彳 辵 行 走 大 立 身 爪 父 母 儿 尸 臣 疋 夂 頁 長"},
    "門": {"stat": "area",   "ch": "宀 广 門 囗 冖 戸 衣 糸 巾 网 冂 穴 舟 車 皿 缶 瓦 匚 几 酉 西 襾 勹"},
}
FAM_OF = {}
for f, v in FAM.items():
    for c in v["ch"].split():
        FAM_OF.setdefault(c, f)

BIN = set("⿰⿱⿴⿵⿶⿷⿸⿹⿺⿻")
TRI = set("⿲⿳")


def parse(s, i=0):
    c = s[i]
    if c in BIN:
        a, i = parse(s, i + 1)
        b, i = parse(s, i)
        return [c, a, b], i
    if c in TRI:
        a, i = parse(s, i + 1)
        b, i = parse(s, i)
        d, i = parse(s, i)
        return [c, a, b, d], i
    if c == "&":
        j = s.index(";", i)
        return None, j + 1
    return c, i + 1


def main():
    ids_path, kd_path = sys.argv[1], sys.argv[2]
    IDS = {}
    for line in open(ids_path, encoding="utf-8"):
        if line.startswith("#"):
            continue
        p = line.rstrip("\n").split("\t")
        if len(p) < 3:
            continue
        ch = p[1]
        # 日本の字形（[J]）があればそれを、なければ最初のもの
        cands = p[2:]
        pick = cands[0]
        for c in cands:
            if "J" in (re.findall(r"\[([A-Z]+)\]", c) or [""])[0]:
                pick = c
                break
        pick = re.sub(r"\[[^\]]*\]", "", pick)
        if pick == ch or len(pick) < 2:
            continue
        try:
            tree, _ = parse(pick)
        except Exception:
            continue
        IDS[ch] = tree
    KD = json.load(open(kd_path, encoding="utf-8"))
    game = json.load(open(os.path.join(ROOT, "data", "game.json"), encoding="utf-8"))

    # 描ける字（明朝＋予備の字体）
    cmap = set()
    for f in ["ZenOldMincho-Black.ttf", "FallbackJP-Black.ttf", "FallbackSC-Black.ttf"]:
        t = TTFont(os.path.join(ROOT, "fonts", f))
        cmap |= set(chr(k) for k in t.getBestCmap().keys())

    def norm(c):
        return NORM.get(c, c)

    def en_of(c):
        v = KD.get(c)
        if not v:
            return ""
        ms = (v.get("wk_meanings") or []) + (v.get("meanings") or [])
        for m in ms:
            m = re.sub(r"\(.*?\)", "", m).lower()
            m = re.sub(r"radical.*|katakana.*|no\.\s*\d+|variant", "", m).strip()
            w = re.sub(r"[^a-z ]", "", m).strip()
            if w and not w.startswith("number"):
                return w.split()[0] if len(w) > 12 else w.replace(" ", "")
        return ""

    def jp_of(c):
        v = KD.get(c)
        if not v:
            return ""
        ks = [k.replace(".", "").replace("-", "") for k in (v.get("readings_kun") or [])]
        return ks[0] if ks else ""

    # 葉（素）まで分解する
    memo = {}

    def leaves(c, depth=0):
        if c is None:
            return ["・"]
        if isinstance(c, list):
            out = []
            for x in c[1:]:
                out += leaves(x, depth + 1)
            return out
        c = norm(c)
        if c in FAM_OF or c not in IDS or depth > 8:
            return [c]
        if c in memo:
            return memo[c]
        r = leaves(IDS[c], depth + 1)
        memo[c] = r
        return r

    def body(c, depth=0):
        if c is None:
            return None
        if isinstance(c, list):
            for x in c[1:]:
                b = body(x, depth + 1)
                if b:
                    return b
            return None
        c = norm(c)
        if c in FAM_OF:
            return FAM_OF[c]
        if c in IDS and depth < 8:
            return body(IDS[c], depth + 1)
        return None

    # 字の範囲: 常用・人名用、遊びに出てくる字、その部品
    uni = set(c for c, v in KD.items() if v.get("grade"))
    for k in ["STK", "EN", "PARTS", "JP_GLOSS"]:
        uni |= set(x for x in game.get(k, {}) if len(x) == 1)
    for r in game.get("ALLY_FUSE", []):
        uni |= set(r[0])
    uni |= set(FAM_OF.keys())
    # 部品（組み立てに出てくる字）を足す
    todo = list(uni)
    while todo:
        c = todo.pop()
        t = IDS.get(c)
        if not isinstance(t, list):
            continue
        for x in t[1:]:
            if isinstance(x, str):
                n = norm(x)
                if n not in uni and n in cmap:
                    uni.add(n)
                    todo.append(n)
    uni = sorted(c for c in uni if c in cmap and len(c) == 1 and ord(c) >= 0x2E80)

    K = {}
    REC = {}
    for c in uni:
        t = IDS.get(c)
        lv = leaves(c) if c not in FAM_OF else [c]
        lv = [x for x in lv if x != "・" and not ("\u2460" <= x <= "\u24ff") and x not in "コ"] or [c]
        b0 = FAM_OF.get(c) or body(c)
        b = b0 or "人"
        stats = {}
        for x in lv:
            f = FAM_OF.get(x)
            if f:
                s = FAM[f]["stat"]
                stats[s] = stats.get(s, 0) + 1
        ops = []
        if isinstance(t, list) and t[0] in BIN and c not in FAM_OF:
            a, bb = t[1], t[2]
            if isinstance(a, str) and isinstance(bb, str):
                a, bb = norm(a), norm(bb)
                ok = lambda x: x in cmap and ord(x) >= 0x2E80 and not ("\u2460" <= x <= "\u24ff") and x != c
                if ok(a) and ok(bb):
                    ops = [a, bb]
                    # 左右・上下の順も含めて組み合わせとする（左＝一つ目）
                    key = a + "+" + bb
                    REC.setdefault(key, []).append(c)
        stk = (KD.get(c) or {}).get("strokes") or game.get("STK", {}).get(c, 0)
        K[c] = {"en": en_of(c) or game.get("EN", {}).get(c, "") or game.get("PARTS", {}).get(c, ""),
                "jp": game.get("JP_GLOSS", {}).get(c, "") or jp_of(c),
                "stk": stk, "g": (KD.get(c) or {}).get("grade") or 0,
                "b": b, "b0": 1 if b0 else 0, "s": stats, "lv": lv, "op": ops}
    out = {"FAM": {f: {"stat": v["stat"], "ch": v["ch"].split()} for f, v in FAM.items()},
           "NORM": NORM, "K": K, "REC": REC}
    p = os.path.join(ROOT, "data", "kanji_db.json")
    json.dump(out, open(p, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print("字", len(K), "組み合わせ", len(REC), "→", p, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    main()
