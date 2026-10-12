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

## ---- 部首が「効果」、字の意味が「動き」 ----
## 効果: 部首（の系統）が決める。当たった字に何が起きるか・どう見えるか
const EFFECT_JP = {
	"波": "濡らす（濡れた字は連鎖して削れる）", "炎": "燃やす（燃え移る）", "樹": "根で絡めて鈍らせる", "光": "光で焼く",
	"刃": "斬る（貫く）", "矢": "射抜く", "声": "響かせて怯ませる", "獣": "噛み傷を残す（あとで裂ける）",
	"岩": "打ちのめして止める", "霊": "祟って鈍らせる", "人": "打ちすえる", "門": "強く押し返す",
}
## 動き: 字の意味（英語）から決める。表にない字は部首の素の動き
const MOTION_JP = {
	"lamp": ["照らす", "字そのものが主人公のそばに灯り、まわりを照らし続ける。照らされた字に効果"],
	"spread": ["広がる", "字そのものがでたらめに飛びまわり、降りた所から災いが次々と広がる"],
	"fall": ["降る", "この字が上から降ってきて、落ちた所にしばらく溜まり、踏んだ字を削りつづける（聖水のように）"],
	"guard": ["守る", "主人公のまわりを巡り、近づく字を押し返す"],
	"rush": ["駆ける", "字そのものが駆けて噛みつき・体当たりし、戻る"],
	"rampage": ["暴れる", "字そのものが縦横無尽に暴れまわり、触れた字を大きく弾き飛ばす"],
	"flow": ["流れる", "主人公から字の群れへ、帯になって流れる"],
	"orbit": ["巡る", "字そのものが主人公のまわりを巡って当たる"],
	"burst": ["響く", "まわりへ一気に広がる"],
	"bind": ["縛る", "近くの字に絡みついて動きを止める"],
	"shoot": ["放つ", "この字を近くの字へ飛ばす"],
	"river": ["流す", "主人公の足もとから、川の字の三筋のように下へ流れを放ちつづける"],
	"scatter": ["溢れる", "あらゆる方向へ、でたらめにこの字を放つ"],
	"frost": ["凍らせる", "まわりへ大量のこの字を、ゆっくりと放つ。触れた字は凍えて遅くなる"],
	"annihilate": ["滅ぼす", "全方位へすさまじい連射。ただし次まで長く休む"],
	"dragon": ["龍のように", "龍のように連なり、うねりながら主人公のまわりを巡って暴れ、ときに字へ食らいつく"],
	"laser": ["射す", "光線を放ち、一直線に並んだ字をまとめて焼き貫く"],
	"garlic": ["寄せつけない", "主人公のまわりにいつも漂い、近づいた字を削って押し返す"],
	"": ["", ""],
}
## 意味に動きがない字は、部首の動き（日は光線、月は巡る、雨は降る、水は寄せつけない…）
const RAD_MOTION = {
	"日": "laser", "光": "laser", "白": "laser", "月": "orbit", "夕": "orbit", "雨": "fall", "冫": "frost", "川": "river",
	"水": "garlic", "犬": "rush", "馬": "rush", "牛": "rush", "豕": "rampage", "虎": "rampage", "虍": "rampage",
	"弓": "shoot", "矢": "shoot", "口": "burst", "言": "burst", "音": "burst", "糸": "bind", "網": "bind", "网": "bind",
	"宀": "guard", "門": "guard", "囗": "guard", "土": "fall", "石": "fall", "山": "fall", "鳥": "scatter", "隹": "scatter", "羽": "scatter",
	"心": "lamp", "示": "lamp", "鬼": "spread", "歹": "spread",
}
const MOTION_CH = {"雨": "fall", "雫": "fall", "露": "fall", "滴": "fall", "川": "river", "州": "river", "順": "river", "氾": "scatter", "氷": "frost", "滅": "annihilate", "灯": "lamp", "燈": "lamp", "照": "lamp", "燭": "lamp", "炬": "lamp", "蛍": "lamp", "災": "spread", "禍": "spread", "疫": "spread"}
const MOTION_EN = [
	["river", ["river", "brook", "creek", "canal"]],
	["scatter", ["overflow", "spreadout", "spill", "gush", "spray", "splash", "scatter", "sprinkle", "flood", "inundate"]],
	["frost", ["ice", "freeze", "frozen", "cold", "cool", "frost", "chill", "icicle", "hail", "snow"]],
	["annihilate", ["destroy", "annihilate", "perish", "ruin", "extinct", "exterminate", "destruction", "demolish", "obliterate", "break", "explode"]],
	["lamp", ["lamp", "lantern", "torch", "candle", "illuminate", "light", "shine", "glow", "bright", "firefly", "lighthouse", "brilliant", "dawn"]],
	["spread", ["disaster", "calamity", "plague", "epidemic", "spread", "scatter", "chaos", "riot", "evil", "misfortune", "curse", "ruin", "disorder", "infect", "rampant", "bewitch"]],
	["fall", ["fall", "drop", "descend", "drip", "rain", "snow", "hail", "thunder", "lightning", "dew", "frost", "sink", "drown", "shower"]],
	["guard", ["protect", "defend", "guard", "shield", "surround", "fence", "wall", "castle", "fort", "enclose", "shelter", "prevent", "barrier", "keep", "roof", "armor", "armour", "obstruct"]],
	["rampage", ["beast", "animal", "violence", "violent", "rage", "rampage", "storm", "rough", "savage", "brute", "monster", "frenzy", "lunatic", "mad", "crazy", "wild", "fierce", "tempest", "typhoon", "war", "fury", "angry"]],
	["rush", ["run", "rush", "hunt", "chase", "charge", "gallop", "pursue", "attack", "raid", "assault", "dash", "race", "fight", "battle", "strike", "kill", "bite", "hurry", "leap", "jump", "advance", "invade", "cat", "dog", "hound"]],
	["flow", ["stream", "flow", "swim", "wave", "current", "pour", "river", "flood", "tide", "sail", "wash", "bathe", "float", "drift", "overflow", "flush"]],
	["orbit", ["loop", "circle", "round", "turn", "rotate", "revolve", "wheel", "spin", "return", "patrol", "around", "times", "whirl", "eddy"]],
	["burst", ["explode", "burst", "shout", "cry", "roar", "bark", "call", "sing", "chirp", "sound", "voice", "yell", "scream", "echo", "howl", "song", "music", "drum", "erupt"]],
	["bind", ["bind", "tie", "tangle", "net", "netting", "catch", "trap", "seize", "hold", "capture", "grasp", "rope", "string", "thread", "knot", "weave", "sew", "wrap", "arrest", "embrace"]],
	["shoot", ["shoot", "throw", "launch", "release", "send", "emit", "shot", "arrow", "fling", "toss", "cast", "spit", "dispatch", "fire"]],
]

## 部首ごとの色（火は朱、水は藍…）。表にない部首は系統の色
const RAD_COL = {
	"火": Color(0.86, 0.16, 0.08), "赤": Color(0.86, 0.16, 0.08), "黒": Color(0.15, 0.12, 0.12),
	"水": Color(0.12, 0.36, 0.72), "冫": Color(0.35, 0.68, 0.86), "雨": Color(0.32, 0.45, 0.62), "川": Color(0.12, 0.40, 0.70), "氷": Color(0.45, 0.75, 0.90), "風": Color(0.40, 0.58, 0.58),
	"木": Color(0.18, 0.48, 0.20), "艸": Color(0.38, 0.62, 0.22), "竹": Color(0.25, 0.55, 0.32), "禾": Color(0.70, 0.60, 0.22), "米": Color(0.75, 0.68, 0.45),
	"日": Color(0.92, 0.62, 0.08), "月": Color(0.78, 0.74, 0.45), "白": Color(0.62, 0.62, 0.66), "目": Color(0.42, 0.30, 0.62), "青": Color(0.15, 0.42, 0.55), "夕": Color(0.85, 0.42, 0.22),
	"刀": Color(0.40, 0.44, 0.52), "戈": Color(0.36, 0.38, 0.46), "斤": Color(0.42, 0.40, 0.44), "弓": Color(0.55, 0.32, 0.14), "矢": Color(0.50, 0.30, 0.15), "羽": Color(0.48, 0.52, 0.66),
	"口": Color(0.78, 0.18, 0.30), "言": Color(0.55, 0.22, 0.55), "耳": Color(0.72, 0.42, 0.40), "音": Color(0.62, 0.28, 0.56),
	"犬": Color(0.60, 0.38, 0.14), "馬": Color(0.50, 0.30, 0.12), "鳥": Color(0.25, 0.30, 0.58), "隹": Color(0.30, 0.34, 0.58), "虫": Color(0.45, 0.50, 0.15), "魚": Color(0.15, 0.50, 0.55), "羊": Color(0.70, 0.66, 0.55), "牛": Color(0.45, 0.32, 0.22),
	"土": Color(0.55, 0.40, 0.22), "山": Color(0.30, 0.38, 0.28), "石": Color(0.45, 0.45, 0.45), "金": Color(0.82, 0.66, 0.18), "玉": Color(0.30, 0.62, 0.50), "田": Color(0.55, 0.45, 0.20), "貝": Color(0.72, 0.55, 0.35), "阜": Color(0.48, 0.38, 0.28),
	"示": Color(0.50, 0.25, 0.62), "心": Color(0.82, 0.30, 0.42), "鬼": Color(0.32, 0.12, 0.38), "歹": Color(0.30, 0.22, 0.28),
	"人": Color(0.20, 0.20, 0.20), "手": Color(0.30, 0.24, 0.20), "女": Color(0.75, 0.32, 0.45), "子": Color(0.85, 0.50, 0.35), "力": Color(0.62, 0.25, 0.15), "足": Color(0.35, 0.28, 0.22), "攴": Color(0.40, 0.30, 0.25),
	"宀": Color(0.20, 0.40, 0.45), "門": Color(0.12, 0.42, 0.45), "糸": Color(0.70, 0.20, 0.50), "衣": Color(0.45, 0.30, 0.55), "車": Color(0.35, 0.35, 0.40), "舟": Color(0.30, 0.42, 0.52), "囗": Color(0.20, 0.35, 0.40), "穴": Color(0.25, 0.22, 0.20),
}

static func col_of(ch: String) -> Color:
	var r: String = rad_of(ch)
	if RAD_COL.has(r):
		return RAD_COL[r]
	return FAM_COL.get(String(K.get(ch, {}).get("b", "人")), Color(0.2, 0.2, 0.2))

static func motion_of(ch: String) -> String:
	if MOTION_CH.has(ch):
		return MOTION_CH[ch]
	# 龍を含む字は、龍のように連なって暴れる（朧・瀧・襲…）
	var lv0: Array = K.get(ch, {}).get("lv", [])
	if lv0.size() >= 2 and (lv0.has("龍") or lv0.has("竜")):
		return "dragon"
	var en: String = String(K.get(ch, {}).get("en", "")).to_lower()
	if en != "":
		for m in MOTION_EN:
			for w in m[1]:
				if en == w or en == w + "s" or en == w + "ing" or en == w + "ed":
					return m[0]
	return RAD_MOTION.get(rad_of(ch), "")

## 部首（能力をくれた素）。表示用
static func rad_of(ch: String) -> String:
	var v: String = src_of(ch)[1]
	return v if v != "" else ch

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
	var p = {"ch": ch, "body": k.b, "kind": BODY[k.b][0], "s": s, "T": T, "lv": lv, "rid": rid, "motion": motion_of(ch), "rad": String(k.get("via", "")), "col": col_of(ch)}
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
