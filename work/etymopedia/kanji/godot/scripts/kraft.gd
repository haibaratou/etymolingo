extends RefCounted
## 漢字クラフトの仕様（作字の字典 data/kanji_db.json を読む）
##
## 字の性能は「素」の足し算で決まる。
##   本体（行動）… 字を組み立てる部品のうち、最初に見つかった素の系統（偏・冠・外側を先に見る）
##   能力値     … 字を葉（素）まで分解し、素の系統ごとに能力値を一つずつ足す
##   格         … 素の数（深く組んだ字ほど格が高く、全体が強くなる）
## 字典は tools/build_kraft_db.py で作る（CHISE IDS と KANJIDIC2 から）。

static var K: Dictionary = {}
static var REC: Dictionary = {}
static var FAM: Dictionary = {}
static var USES: Dictionary = {}
static var NORM: Dictionary = {}
static var ALL: Array = []
static var loaded := false

const STATS = ["pow", "area", "rate", "count", "dur", "pierce", "knock"]
const STAT_JP = {"pow": "威力", "area": "範囲", "rate": "速さ", "count": "数", "dur": "持続", "pierce": "貫通", "knock": "押し"}

## 系統: [行動の名前, 説明]。どの系統の素が、どの能力値を上げるかは FAM（字典）にある
const BODY = {
	"波": ["ripple", "波紋", "足元から波紋が広がり、触れた字を削って押し返す。波紋を浴びた字は濡れ、削られると近くの濡れた字へ連鎖する"],
	"炎": ["trail", "燃える道", "主人公のまわりを駆け、通った跡が燃える。炎に触れた字は燃え続け、近くの字へ燃え移る"],
	"樹": ["tree", "木の壁", "まわりに木を植える。木に触れた字は弾かれて削られる。木は何度か受けると折れる"],
	"光": ["orbit", "回る光", "主人公のまわりを光の玉が回り、触れた字を削る"],
	"刃": ["blade", "斬りこみ", "近くの字へ飛びこんで斬る。まわりの字もまとめて斬る"],
	"矢": ["arrow", "矢", "近くの字へ矢を放つ。矢は字を貫いて飛ぶ"],
	"声": ["shout", "叫び", "間をおいて叫び、近くの字をまとめて削る"],
	"獣": ["beast", "獣", "獣が駆けて字に噛みつく"],
	"岩": ["slam", "落石", "字の群れへ岩を落とし、まわりを削って大きく弾き飛ばす"],
	"霊": ["aura", "結界", "主人公のまわりに結界を張る。中の字は鈍り、削られ続ける"],
	"人": ["throw", "投石", "近くの字へ石を投げる。落ちた所の字を削る"],
	"門": ["wall", "囲い", "主人公を囲う壁。触れた字を強く押し返して削る"],
}
const FAM_COL = {
	"波": Color(0.16, 0.36, 0.62), "炎": Color(0.80, 0.22, 0.10), "樹": Color(0.20, 0.45, 0.22), "光": Color(0.78, 0.58, 0.10),
	"刃": Color(0.35, 0.35, 0.42), "矢": Color(0.50, 0.30, 0.15), "声": Color(0.62, 0.20, 0.45), "獣": Color(0.55, 0.36, 0.12),
	"岩": Color(0.38, 0.32, 0.26), "霊": Color(0.42, 0.25, 0.62), "人": Color(0.20, 0.20, 0.20), "門": Color(0.12, 0.42, 0.45),
}

static func load_db() -> void:
	if loaded:
		return
	loaded = true
	var f = FileAccess.open("res://data/kanji_db.json", FileAccess.READ)
	if f == null:
		push_error("kanji_db.json がない")
		return
	var d = JSON.parse_string(f.get_as_text())
	K = d.K
	REC = d.REC
	FAM = d.FAM
	NORM = d.NORM
	for key in REC:
		var ab = String(key).split("+")
		for r in REC[key]:
			for c in ab:
				if not USES.has(c):
					USES[c] = []
				if not USES[c].has(r):
					USES[c].append(r)
	ALL = K.keys()
	ALL.sort_custom(func(a, b): return int(K[a].stk) < int(K[b].stk) if int(K[a].stk) != int(K[b].stk) else a < b)

static func has(ch: String) -> bool:
	return K.has(ch)

## 仲間になれる字: 二つの部品を合わせた字で、部首（なければ意符・部品）に系統がある字だけ。
## 一字だけの字（一・犬・刀…）は材料にしかならない
static func can_ally(ch: String) -> bool:
	return bool(K.get(ch, {}).get("ally", false))

## 能力をくれた部品と、その素（例: 猫 → 犭(犬) から獣）
static func src_of(ch: String) -> Array:
	var k: Dictionary = K.get(ch, {})
	return [String(k.get("src", "")), String(k.get("via", ""))]

static func fam_of(ch: String) -> String:
	for f in FAM:
		if FAM[f].ch.has(ch):
			return f
	return ""

## A（左・上）＋B（右・下）でできる字。逆の並びも許す
static func make(a: String, b: String) -> Array:
	var out: Array = []
	for r in REC.get(a + "+" + b, []):
		if not out.has(r) and can_ally(r):
			out.append(r)
	for r in REC.get(b + "+" + a, []):
		if not out.has(r) and can_ally(r):
			out.append(r)
	return out

## 字の性能（Lv は同じ字を重ねた数）
static func prof(ch: String, lv := 1) -> Dictionary:
	var k: Dictionary = K.get(ch, {"b": "人", "s": {}, "lv": [ch], "en": "", "jp": "", "op": [], "stk": 0})
	var s = {}
	for st in STATS:
		s[st] = float(k.s.get(st, 0))
	var nf = 0
	for x in k.lv:
		if fam_of(x) != "":
			nf += 1
	var T: float = max(1.0, nf + 0.4 * (k.lv.size() - nf))
	var L: float = float(lv - 1)
	# 脇の部品（本体の素を一つ除いた残り）は、その部品の技が小さく付く
	var rid = {}
	var skipped := false
	for x in k.lv:
		var f: String = fam_of(x)
		if f == "":
			continue
		if f == k.b and not skipped:
			skipped = true
			continue
		rid[f] = int(rid.get(f, 0)) + 1
	var p = {"ch": ch, "body": k.b, "kind": BODY[k.b][0], "s": s, "T": T, "lv": lv, "rid": rid}
	p.P = 1 + int((s.pow + T * 0.5 + L) / 2.0)          # 一撃で削る文字数
	p.A = 1.0 + 0.22 * s.area + 0.04 * (T - 1)           # 届く広さ（倍）
	p.R = 1.0 + 0.22 * s.rate + 0.04 * (T - 1) + 0.12 * L  # 技の速さ（倍）
	p.C = min(8, 1 + int(s.count / 1.5) + (1 if T >= 4 else 0))  # 一度に出る数
	p.D = 1.0 + 0.35 * s.dur                             # 残る時間（倍）
	p.X = 1 + int(s.pierce)                              # 一度に当たる字の数
	p.KN = 60.0 + 80.0 * s.knock                         # 押し返す強さ
	return p

## 能力値の説明（数値を、ゲームの中の意味にして返す）
static func stat_meaning(p: Dictionary, st: String) -> String:
	match st:
		"pow": return "一撃で%d文字" % p.P
		"area": return "広さ×%.2f" % p.A
		"rate": return "速さ×%.2f" % p.R
		"count": return "%d個ずつ" % p.C
		"dur": return "残る×%.2f" % p.D
		"pierce": return "%d体まで" % p.X
		"knock": return "押し %d" % int(p.KN)
	return ""
