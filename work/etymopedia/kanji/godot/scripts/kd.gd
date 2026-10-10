## 漢字SURVIVOR のデータ（data/game.json）と、字の構成・進化の計算
class_name KD

static var D: Dictionary = {}
static var JGW: Dictionary = {}
static var STK: Dictionary = {}
static var EN: Dictionary = {}
static var COMP: Dictionary = {}
static var EVO: Dictionary = {}
static var SPAWN_DEFS: Array = []
static var STAGE_DEFS: Array = []
static var loaded = false

# 色（墨・和紙・朱・藍・金・夜）
const WASHI := Color8(235, 232, 225)
const SUMI := Color8(23, 20, 15)
const SHU := Color8(210, 58, 36)
const AI := Color8(31, 63, 110)
const KIN := Color8(198, 160, 70)
const YORU := Color8(14, 13, 18)
const AIN := Color8(130, 170, 230)

const OR_EN := {"人": "person", "魚": "fish", "水": "water", "子": "child", "大": "giant", "女": "woman", "王": "king"}
const ALLY_EN := {"火": "firebug", "矢": "archer", "水": "tide", "木": "rooted", "日": "sunny", "月": "wanderer", "雨": "cloud", "田": "farmer", "刀": "guard", "命": "healer", "力": "cheer", "犬": "hound", "馬": "steed", "鳥": "hawk", "戌": "axeman", "口": "biter", "明": "radiance", "烕": "snuffer", "咸": "chorus", "炎": "blaze", "林": "grove", "沝": "twin", "淼": "flood", "沐": "bather", "淋": "drencher", "泪": "tearful", "江": "river", "淡": "melter", "減": "reducer", "滅": "annihilator"}
const NOBODY := ["火", "矢", "水", "田", "命", "力", "炎", "林"]
const COMPANION := ["犬", "馬", "鳥"]

## 仲間どうしの合体: [できる字, 字A, 字B, 英語, 説明]
static func fuse_rows() -> Array:
	return D.get("ALLY_FUSE", [])

static func fuse_of(ch: String) -> Array:
	for r in fuse_rows():
		if r[0] == ch:
			return r
	return []
const ABIL_OF := {"䲆": "比", "鱻": "从", "䲜": "化", "漁": "付", "魯": "休", "鮮": "花", "鯨": "伐", "鯉": "伏", "鮭": "北", "伽": "信", "俐": "从", "沝": "比", "淼": "伐", "沐": "休", "江": "从", "沖": "北", "清": "付", "泪": "化", "波": "花", "鴻": "伏", "婆": "信"}
const MOTION_ID := {"hop": 0, "gallop": 1, "slither": 2, "swim": 3, "flutter": 4, "flicker": 5, "sway": 6, "rumble": 7, "drip": 8, "drift": 9, "crawl": 10, "chew": 11}

static func load_all() -> void:
	if loaded:
		return
	D = JSON.parse_string(FileAccess.get_file_as_string("res://data/game.json"))
	JGW = JSON.parse_string(FileAccess.get_file_as_string("res://data/jgw.json"))
	JGW["亀"] = JGW["龜"]
	STK = D.STK
	EN = D.EN
	COMP = D.COMP
	for r in D.EVO_ROWS:
		EVO[r[0]] = {"ch": r[0], "parent": r[1], "via": r[2], "en": r[3]}
	for ch in D.SINGLE_POOL:
		SPAWN_DEFS.append({"ch": ch, "lv": leaves(mk_node(ch))})
	for ch in D.COMP_POOL:
		SPAWN_DEFS.append({"ch": ch, "lv": leaves(mk_node(ch))})
	# 景（ステージ）ごとに多く出る字
	for st in D.get("STAGES", []):
		var defs = []
		for ch in st.pool:
			defs.append({"ch": ch, "lv": leaves(mk_node(ch))})
		STAGE_DEFS.append(defs)
	loaded = true

static func strokes(w: String) -> int:
	var n = 0
	for i in w.length():
		n += int(STK.get(w[i], 8))
	return n

static func mk_node(ch: String) -> Dictionary:
	var parts = []
	for p in COMP.get(ch, []):
		parts.append(mk_node(p))
	return {"ch": ch, "en": EN.get(ch, ch), "parts": parts}

static func leaves(n: Dictionary) -> int:
	if n.parts.is_empty():
		return 1
	var s = 0
	for q in n.parts:
		s += leaves(q)
	return s

static func motion_of(ch: String) -> String:
	for k in D.MOTION:
		if String(D.MOTION[k]).contains(ch):
			return k
	return "hop"

static func beh_of(ch: String, stk: int) -> String:
	for k in D.BEH:
		if String(D.BEH[k]).contains(ch):
			return k
	return "tank" if stk >= 16 else "walk"

static func children_of(ch: String) -> Array:
	var out = []
	for r in D.EVO_ROWS:
		# 親は「A|B|C」のように複数書ける（どの形からでもその字へ進化できる）
		if String(r[1]).split("|").has(ch):
			out.append(EVO[r[0]])
	return out

static func comp_of(n: Dictionary) -> String:
	return {"並": "人", "背": "人", "反": "人", "寸": "手"}.get(n.via, n.via)

static func mats_of(n: Dictionary) -> Array:
	if String(n.via).contains("+"):
		return Array(String(n.via).split("+"))
	return [comp_of(n)]

static func hero(ch: String) -> Dictionary:
	for h in D.HEROES:
		if h.ch == ch:
			return h
	return D.HEROES[0]

static func kn(v: float) -> String:
	var n = int(floor(v))
	if n <= 0:
		return "〇"
	if n >= 10000:
		return kn(n / 10000) + "万" + (kn(n % 10000) if n % 10000 else "")
	var d = "〇一二三四五六七八九"
	var s = ""
	for pair in [[1000, "千"], [100, "百"], [10, "十"]]:
		var q = n / int(pair[0])
		if q:
			s += (d[q] if q > 1 else "") + pair[1]
			n %= int(pair[0])
	if n:
		s += d[n]
	return s

static func fmt_t(t: float) -> String:
	var s = int(floor(t))
	return "%d:%02d" % [s / 60, s % 60]
