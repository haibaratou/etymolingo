## 漢字SURVIVOR（Godot版）
## すべての漢字が生き物になった世界。英単語を打ち切ると主人公がその字へ突っ込み、字の部品を一つずつ崩す。
extends Node

# ---------- 画面の層 ----------
var bg: ColorRect
var bg_mat: ShaderMaterial
var world: Node2D
var ground: DrawLayer
var ents: Node2D
var hero_layer: DrawLayer
var fx_layer: DrawLayer
var label_layer: DrawLayer
var screen_fx: DrawLayer
var scenery: DrawLayer
var ui: DrawLayer
var bank: GlyphBank
var sfx: Sfx
var living_shader: Shader
var GF: FontFile   # 字（明朝）
var UF: FontFile   # 文（ゴシック）
var MF: FontFile   # 英単語（等幅）
var DF: FontFile   # 見出し
var tex_stain: Array = []
var tex_band: Texture2D
var tex_seal: Texture2D
var tex_glow: GradientTexture2D
var tex_dark: GradientTexture2D

var W = 1280.0
var H = 800.0
var SF = 1.0

# ---------- 遊びの状態 ----------
var state = "boot"
var hero_def: Dictionary
var form = "人"
var path: Array = ["人"]
var traits = {}
var HS = {}
var fish_joined = false
var rest_charged = false
var absorbed = {}
var lv_opened = 0
var got: Array = []
var E: Array = []
var P: Array = []
var TX: Array = []
var SL: Array = []
var RG: Array = []
var BOLT: Array = []
var STAMP: Array = []
var PROJ: Array = []
var TRAP: Array = []
var ROOTS: Array = []
var SHARD: Array = []
var STAIN: Array = []
var GEMS: Array = []
var TRAIL: Array = []
var DEBRIS: Array = []
var SPARK: Array = []
var ROT: Array = []
var crescents: Array = []
var wave_rings: Array = []
var time = 0.0
var hp = 10
var max_hp = 10
var level = 1
var xp = 0.0
var pending_lv = 0
var combo = 0
var max_combo = 0
var kills = 0
var typed_ok = 0
var misses = 0
var words = 0
var owned = {}
var timers = {}
var spawn_t = 2.0
var shake = 0.0
var hitstop = 0.0
var flash = 0.0
var flash_col = KD.WASHI
var red_v = 0.0
var night = 0.0
var ts = 1.0
var slow_t = 0.0
var boss = null
var boss_idx = 0
var next_boss = 60.0
var boss_intro = 0.0
var reveal = 0.0
var dying_t = 0.0
var slain = {}
var taiko_t = 0.0
var shield = 0
var rest_t = 0.0
var teaser = null
var teased = -1
var uid = 1
var xp_snd = 0
var hero = {}
var ALLY = {}
var hero_hist: Array = []
var cam = Vector2.ZERO
var cam_off = 0.0
var calm = false
var meta = {"kills": 0, "best": 0.0, "gods": 0}
var hint_text = ""
var hint_t = 0.0
var banner = null
var title_cards: Array = []
var cards: Array = []
var cine = null
var over_info = {}
var buttons: Array = []   # [Rect2, Callable]
var hover_btn = -1
var ui_time = 0.0
var auto_on = false
var auto_t = 0.0
var auto_plan = null
var over_t = 0.0
var auto_lv_open = false
var choose_t = 0.0
var choose_card = null
var test_mode = {}
var tail_absorb = ""
var dbg_eat = 0
var dbg_break = 0
var watch_mode = false
var wave = {}
var chunks = {}
var field_seed = 0
var field_t = 0.0
var mdead = null
var spawn_maxlv = 0
## 敵の出方の緩急: 静（まばら）→ 増（ふえる）→ 群（一方向から押し寄せる）→ 凪（止む）
const WAVES = [["静", "QUIET", 10.0], ["増", "RISING", 20.0], ["群", "SWARM", 7.0], ["凪", "LULL", 7.0]]
## 野に生える字（動かない）。[字, 英単語(空なら字の構成から), 重み]
const PLANTS = [["草", "grass", 30], ["木", "", 26], ["林", "", 15], ["森", "", 8], ["竹", "bamboo", 10], ["花", "flower", 6], ["禾", "grain", 5]]
## 野の名所（打つと主人公がそこまで行き、恵みを受ける）。[英単語, 再び使えるまでの秒, 重み]
const OBJS = {"井": ["well", 70.0, 35], "鐘": ["bell", 45.0, 25], "硯": ["inkstone", 60.0, 25], "祠": ["shrine", 9999.0, 15], "宝": ["treasure", 9999.0, 12]}
## 決戦の闇から襲ってくる字
const DARK = ["闇", "鬼", "魔", "影", "夜", "黒", "呪", "死", "怨", "魂", "暗", "骨", "鬱"]

# ---------- 起動 ----------
func _ready() -> void:
	randomize()
	KD.load_all()
	_load_meta()
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--"):
			var kv = a.substr(2).split("=")
			test_mode[kv[0]] = kv[1] if kv.size() > 1 else "1"
	GF = _font("res://fonts/ZenOldMincho-Black.ttf", ["res://fonts/FallbackJP-Black.ttf", "res://fonts/FallbackSC-Black.ttf"])
	UF = _font("res://fonts/ZenKakuGothicNew-Bold.ttf", ["res://fonts/ZenOldMincho-Black.ttf"])
	MF = _font("res://fonts/JetBrainsMono-ExtraBold.ttf", ["res://fonts/ZenKakuGothicNew-Bold.ttf"])
	DF = _font("res://fonts/DelaGothicOne-Regular.ttf", ["res://fonts/ZenOldMincho-Black.ttf"])
	for i in 6:
		tex_stain.append(load("res://assets/tex/stain%d.png" % i))
	tex_band = load("res://assets/tex/brush_band.png")
	tex_seal = load("res://assets/tex/seal.png")
	tex_glow = GradientTexture2D.new()
	tex_glow.width = 256
	tex_glow.height = 256
	tex_glow.fill = GradientTexture2D.FILL_RADIAL
	tex_glow.fill_from = Vector2(0.5, 0.5)
	tex_glow.fill_to = Vector2(1.0, 0.5)
	var gr = Gradient.new()
	gr.set_color(0, Color(1, 1, 1, 1))
	gr.set_color(1, Color(1, 1, 1, 0))
	gr.add_point(0.35, Color(1, 1, 1, 0.45))
	tex_glow.gradient = gr
	Oracle.glow_tex = tex_glow
	# 決戦の闇（中心が灯り、外へ向かって闇が濃くなる）
	tex_dark = GradientTexture2D.new()
	tex_dark.width = 512
	tex_dark.height = 512
	tex_dark.fill = GradientTexture2D.FILL_RADIAL
	tex_dark.fill_from = Vector2(0.5, 0.5)
	tex_dark.fill_to = Vector2(1.0, 0.5)
	var gd = Gradient.new()
	gd.set_color(0, Color(0.02, 0.01, 0.05, 0.0))
	gd.set_color(1, Color(0.02, 0.01, 0.05, 0.72))
	gd.add_point(0.17, Color(0.02, 0.01, 0.05, 0.0))
	gd.add_point(0.45, Color(0.02, 0.01, 0.05, 0.4))
	gd.add_point(0.75, Color(0.02, 0.01, 0.05, 0.62))
	tex_dark.gradient = gd
	living_shader = load("res://shaders/living.gdshader")
	# 背景（和紙）
	var bgl = CanvasLayer.new()
	bgl.layer = -10
	add_child(bgl)
	bg = ColorRect.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bg_mat = ShaderMaterial.new()
	bg_mat.shader = load("res://shaders/paper.gdshader")
	bg.material = bg_mat
	bgl.add_child(bg)
	var scl = CanvasLayer.new()
	scl.layer = -5
	add_child(scl)
	scenery = _layer(scl, _draw_scenery)
	# 世界（カメラで動く）
	world = Node2D.new()
	add_child(world)
	ground = _layer(world, _draw_ground)
	ents = Node2D.new()
	world.add_child(ents)
	hero_layer = _layer(world, _draw_hero_layer)
	fx_layer = _layer(world, _draw_fx)
	label_layer = _layer(world, _draw_labels)
	# 画面に固定（漢詩の帯・閃光・HUD・各画面）
	var top = CanvasLayer.new()
	top.layer = 5
	add_child(top)
	screen_fx = _layer(top, _draw_screen_fx)
	ui = _layer(top, _draw_ui)
	sfx = Sfx.new()
	add_child(sfx)
	bank = GlyphBank.new()
	bank.font = GF
	add_child(bank)
	_resize()
	get_viewport().size_changed.connect(_resize)
	await bank.build(_glyph_list())
	sfx.start_bgm()
	to_title()
	if test_mode.has("hero"):
		hero_def = KD.hero(test_mode.hero)
	if test_mode.has("unlock"):
		meta.gods = 3
		meta.kills = 200
		meta.best = 200.0
		to_title()
	if test_mode.has("watch"):
		# 自動戦闘で観る: まず主人公を選ぶ画面を出し、始めると自動戦闘になる
		test_mode.nosave = "1"
		watch_mode = true
	if test_mode.has("typekeys"):
		for c in String(test_mode.typekeys):
			var ev = InputEventKey.new()
			ev.pressed = true
			ev.keycode = KEY_A + (c.unicode_at(0) - 97)
			ev.physical_keycode = ev.keycode
			ev.unicode = c.unicode_at(0)
			Input.parse_input_event(ev)
			await get_tree().process_frame
		await get_tree().process_frame
		print("[typekeys] hero=", hero_def.ch, " state=", state)
		var en = InputEventKey.new()
		en.pressed = true
		en.keycode = KEY_ENTER
		Input.parse_input_event(en)
		await get_tree().process_frame
		await get_tree().process_frame
		print("[typekeys] after enter state=", state, " form=", form, " auto=", auto_on)
	if test_mode.has("auto"):
		start()
		set_auto(true)
		if test_mode.has("bossidx"):
			boss_idx = int(test_mode.bossidx)
		if test_mode.has("nextboss"):
			next_boss = float(test_mode.nextboss)
		if test_mode.has("hp"):
			hp = int(test_mode.hp)
		if test_mode.has("allies"):
			for id in String(test_mode.allies).split(","):
				var kv = id.split(":")
				owned[kv[0]] = int(kv[1]) if kv.size() > 1 else 1
		if test_mode.has("idle"):
			auto_on = false
			hp = 99
	elif test_mode.has("hero"):
		hero_def = KD.hero(test_mode.hero)

func _font(p: String, fb: Array) -> FontFile:
	var f: FontFile = load(p)
	var fbs: Array[Font] = []
	for q in fb:
		fbs.append(load(q))
	f.fallbacks = fbs
	return f

func _layer(parent: Node, fn: Callable) -> DrawLayer:
	var l = DrawLayer.new()
	l.fn = fn
	parent.add_child(l)
	return l

func _glyph_list() -> Array:
	var s = {}
	for k in KD.STK:
		s[k] = 1
	for k in KD.EN:
		s[k] = 1
	for k in KD.COMP:
		s[k] = 1
		for p in KD.COMP[k]:
			s[p] = 1
	for r in KD.D.EVO_ROWS:
		s[r[0]] = 1
		for m in String(r[2]).split("+"):
			s[m] = 1
	for k in KD.D.WEAP:
		s[k] = 1
	for k in KD.D.PARTS:
		s[k] = 1
	for j in KD.D.JUKU_ENEMY:
		s[j[0]] = 1
		for c in String(j[0]):
			s[c] = 1
	for x in KD.D.SPECIALS:
		s[x.ch] = 1
	for c in "犬馬鳥癒噛蹴啄福薬魚草井祠鐘硯竹禾宝闇鬼魔影夜黒呪死怨魂暗骨音麻景兄歹云京":
		s[c] = 1
	return s.keys()

func _resize() -> void:
	var r = get_viewport().get_visible_rect().size
	W = r.x
	H = r.y
	SF = clamp(min(W, H) / 760.0, 0.6, 1.05)
	if bg_mat:
		bg_mat.set_shader_parameter("size", Vector2(W, H))
		bg_mat.set_shader_parameter("sf", SF)

# ---------- 保存 ----------
func _load_meta() -> void:
	if FileAccess.file_exists("user://ks_meta.json"):
		var d = JSON.parse_string(FileAccess.get_file_as_string("user://ks_meta.json"))
		if d is Dictionary:
			for k in d:
				meta[k] = d[k]
	calm = bool(meta.get("calm", false))
	hero_def = KD.hero(String(meta.get("hero", "人")))
	if not unlocked(hero_def):
		hero_def = KD.D.HEROES[0]

func save_meta() -> void:
	meta.calm = calm
	meta.hero = hero_def.ch
	if test_mode.has("nosave"):
		return
	var f = FileAccess.open("user://ks_meta.json", FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(meta))

func unlocked(h: Dictionary) -> bool:
	if not h.has("lock"):
		return true
	return float(meta.get(h.lock.k, 0)) >= float(h.lock.n)

# ---------- 小道具 ----------
func rnd(a: float, b: float) -> float:
	return randf_range(a, b)

func L(id: String) -> int:
	return int(owned.get(id, 0))

func J(w: String) -> bool:
	return owned.has(w) and owned[w]

func shake_k() -> float:
	return 0.35 if calm else 1.0

func hero_r() -> float:
	return 24.0 * SF

func dmg_mul() -> float:
	return 1.0 + 0.25 * L("力")

func has_form(ch: String) -> bool:
	for q in path:
		var f: String = q.split("|")[1] if String(q).contains("|") else q
		if f == ch or KD.ABIL_OF.get(f, "") == ch:
			return true
	return false

func on_view(x: float, y: float, m := 0.0) -> bool:
	return abs(x - cam.x) < W / 2 - m and abs(y - cam.y) < H / 2 - m

func edge_r(a: float) -> float:
	var cs: float = max(abs(cos(a)), 0.001)
	var sn: float = max(abs(sin(a)), 0.001)
	return min(W / 2 / cs, H / 2 / sn) + 45 * SF

func tick(id: String, dt: float, iv: float) -> bool:
	timers[id] = timers.get(id, 0.0) - dt
	if timers[id] <= 0:
		timers[id] = iv
		return true
	return false

func ink_col() -> Color:
	return KD.SUMI.lerp(KD.WASHI, night * 0.92)

func paper_col() -> Color:
	return KD.WASHI.lerp(KD.YORU, night)

# ---------- 主人公の性能 ----------
func hero_stats() -> Dictionary:
	var t = traits
	return {
		"stk": int(KD.STK.get(form, 2)),
		"dash": float(hero_def.dash) * pow(0.8, t.get("dash", 0)) * (0.7 if has_form("伏") else 1.0),
		"splash": float(hero_def.get("splash", 0)) + 35 * t.get("splash", 0),
		"crit": 0.08 * t.get("crit", 0),
		"xp": (1 + 0.25 * t.get("xp", 0)) * (1.5 if has_form("貨") else 1.0),
		"regen": 18 * pow(0.75, t.get("regen", 0) - 1) if t.get("regen", 0) else 0.0,
		"knock": pow(1.4, t.get("knock", 0) + t.get("len", 0)),
		"inv": 0.35 * t.get("inv", 0) + (0.4 if has_form("伏") else 0.0),
		"len": t.get("len", 0),
		"dmg": float(hero_def.get("dmg", 0)) + 2 * t.get("dmg", 0),
	}

func reset() -> void:
	for e in E:
		_free_sprite(e)
	for k in ALLY:
		if ALLY[k].has("spr"):
			ALLY[k].spr.queue_free()
	ALLY = {}
	absorbed = {}
	lv_opened = 0
	got = []
	DEBRIS = []; SPARK = []; ROT = []; shield = 0; rest_t = 0; rest_charged = false; teaser = null; teased = -1
	E = []; P = []; TX = []; SL = []; RG = []; BOLT = []; STAMP = []; PROJ = []; TRAP = []; ROOTS = []; SHARD = []; STAIN = []; GEMS = []; TRAIL = []; crescents = []; wave_rings = []
	time = 0; hp = 10; max_hp = 10; level = 1; xp = 0; pending_lv = 0; combo = 0; max_combo = 0; kills = 0; typed_ok = 0; misses = 0; words = 0
	owned = {}; timers = {}; spawn_t = 2; shake = 0; hitstop = 0; flash = 0; red_v = 0; night = 0; ts = 1; slow_t = 0
	boss = null; boss_idx = 0; next_boss = 60; boss_intro = 0; reveal = 0; dying_t = 0; slain = {}
	wave = {"i": 0, "t": 9.0, "dir": 0.0, "warned": false}
	chunks = {}; field_seed = randi(); field_t = 0.0; mdead = null; spawn_maxlv = 0
	form = hero_def.ch; path = [form]; traits = {}; HS = hero_stats()
	hero = {"x": 0.0, "y": 0.0, "state": "idle", "from": Vector2.ZERO, "to": Vector2.ZERO, "t": 0.0, "target": null, "queue": [], "face": 1, "land": 0.0, "dk": 0.0, "inv": 0.0, "last_dir": Vector2(0, -1), "morph": 0.0}
	hero_hist = []
	cam = Vector2.ZERO; cam_off = 0.0
	fish_joined = hero_def.ch == "魚"
	banner = null
	cine = null

# ---------- 敵（生きている字） ----------
func enemy_speed(stk: int, beh: String) -> float:
	return 21 * SF * (1 + time / 480.0) * clamp(1.4 - stk * 0.036, 0.38, 1.35) * rnd(0.9, 1.1) * {"fast": 1.4, "fly": 1.05, "swarmling": 1.25, "gift": 0.55, "heal": 0.55}.get(beh, 1.0)

func set_word(e: Dictionary, w: String) -> void:
	e.word = w
	e.acc = [w]
	e.typed = ""
	e.eat = 0

func size_for(lv: int, chars: int) -> float:
	var whole = (38.0 + min(lv - 1, 6) * 10.0) * SF
	return max(30 * SF, whole * 1.2 / chars) if chars > 1 else whole

func set_node(e: Dictionary, n: Dictionary) -> void:
	e.node = n
	e.ch = n.ch
	e.en = n.en
	e.w = String(n.ch).length()
	e.lv = KD.leaves(n)
	e.size = size_for(e.lv, e.w) * (0.75 if e.beh == "swarmling" else 1.0)
	e.rad = e.size * 0.48 * (min(2.4, 0.6 + e.w * 0.45) if e.w > 1 else 1.0)
	e.mo = KD.motion_of(n.ch)
	e.stk = KD.strokes(n.ch)
	e.spd = enemy_speed(e.stk, "swarmling" if e.beh == "swarmling" else KD.beh_of(n.ch, e.stk))
	set_word(e, n.en)
	e.crack = 0.0
	_make_sprite(e)

func spawn_enemy(def = null, pos = null, force_beh := "") -> Dictionary:
	if def == null:
		if time > 20 and randf() < 0.035:
			def = KD.D.SPECIALS.pick_random()
		elif time > 30 and randf() < 0.16:
			var j = KD.D.JUKU_ENEMY.pick_random()
			def = {"ch": j[0], "juku": j[1]}
		else:
			var cap = 2 + time / 35.0
			var pool: Array
			if spawn_maxlv > 0:
				pool = KD.SPAWN_DEFS.filter(func(d): return d.lv <= spawn_maxlv)
			elif boss != null and randf() < 0.6:
				# 決戦は闇: 闇・鬱・鬼・魔…が襲ってくる
				pool = DARK.map(func(c): return {"ch": c, "lv": KD.leaves(KD.mk_node(c))}).filter(func(d): return d.ch != "鬱" or time > 100)
			elif boss != null and randf() < 0.45:
				pool = KD.SPAWN_DEFS.filter(func(d): return d.lv >= 3)
			elif randf() < 0.2:
				pool = KD.SPAWN_DEFS.filter(func(d): return d.lv == 1)
			else:
				pool = KD.SPAWN_DEFS.filter(func(d): return d.lv >= 2 and d.lv <= cap and (d.ch != "鬱" or time > 150))
			if pool.is_empty():
				pool = KD.SPAWN_DEFS.filter(func(d): return d.lv == 2)
			var used = {}
			for e in E:
				if e.alive and on_view(e.x, e.y, 60):
					used[String(e.word)[0]] = 1
			for i in 7:
				def = pool.pick_random()
				if not used.has(String(KD.EN.get(def.ch, "?"))[0]):
					break
	var n: Dictionary
	if def.has("juku"):
		var parts = []
		for c in String(def.ch):
			parts.append(KD.mk_node(c))
		n = {"ch": def.ch, "en": def.juku, "juku": true, "parts": parts}
	elif def.has("en"):
		n = {"ch": def.ch, "en": def.en, "parts": []}
	else:
		n = KD.mk_node(def.ch)
	var stk = KD.strokes(n.ch)
	var beh: String = force_beh if force_beh != "" else String(def.get("beh", KD.beh_of(n.ch, stk)))
	if beh == "swarm" and pos == null:
		var a0 = rnd(0, TAU)
		var R0 = edge_r(a0) + 20
		for i in 4:
			spawn_enemy(def, Vector2(cam.x + cos(a0) * R0 + rnd(-50, 50), cam.y + sin(a0) * R0 + rnd(-50, 50)), "swarmling")
		return E[E.size() - 1]
	var a = rnd(0, TAU)
	var R = edge_r(a)
	var e = {"id": uid, "beh": beh, "lv0": KD.leaves(n), "crack": 0.0,
		"x": pos.x if pos != null else cam.x + cos(a) * R, "y": pos.y if pos != null else cam.y + sin(a) * R,
		"kx": 0.0, "ky": 0.0, "vx": 0.0, "vy": 0.0, "t": rnd(0, 9), "ph": rnd(0, TAU), "step": rnd(8, 11), "alive": true, "locked": false,
		"flash": 0.0, "pulse": 0.0, "slow": 0.0, "tilt": 0.0, "zig_t": 0.0, "zs": 1, "face": 1, "daze": 0.0, "bq": 0, "bq_t": 0.0,
		"gift": beh == "gift" or beh == "heal", "captive": false, "born": 0.0, "word_len": 0, "is_boss": false}
	uid += 1
	e.dark = boss != null and DARK.has(String(n.ch))
	set_node(e, n)
	E.append(e)
	return e

# 部位破壊: 部品を1つはがす。単体の字なら消える。返り値 true＝倒した
func break_part(e: Dictionary, dx := 0.0, dy := -1.0, how := "type") -> bool:
	if not e.alive:
		return false
	var n: Dictionary = e.node
	if n.parts.is_empty():
		kill_enemy(e, how)
		return true
	if n.get("juku", false):
		var l: Dictionary = n.parts[0]
		var r: Dictionary = n.parts[1]
		var px = -dy
		var py = dx
		var gap: float = e.size * 0.6
		add_text(e.x, e.y - e.size * 0.9, n.ch + " → " + l.ch + " ＋ " + r.ch, 16 * SF + 6, KD.SHU, 1.1)
		shatter(e.x, e.y, n.ch, e.size * 0.6, 0.4, KD.SUMI)
		var ox: float = e.x
		var oy: float = e.y
		set_node(e, l)
		e.x = ox - px * gap; e.y = oy - py * gap; e.kx = -px * 360; e.ky = -py * 360; e.daze = 1.2; e.pulse = 1.0
		var r2 = spawn_enemy({"ch": r.ch}, Vector2(ox + px * gap, oy + py * gap))
		r2.kx = px * 360; r2.ky = py * 360; r2.daze = 1.2; r2.pulse = 1.0
		add_gem(ox, oy, 2 * HS.xp)
		return false
	if n.parts.size() > 2:
		# 鬱のように部品の多い字は、一撃でそれぞれの部品の字にばらける（同じ字を二度打たせない）
		var names = []
		for q in n.parts:
			names.append(q.ch)
		add_text(e.x, e.y - e.size * 0.9, n.ch + " → " + " ".join(names), 16 * SF + 6, KD.SHU, 1.3)
		shatter(e.x, e.y, n.ch, e.size * 0.7, 0.6, KD.SUMI)
		add_stain(e.x, e.y, e.size * 0.5)
		var ox2: float = e.x
		var oy2: float = e.y
		var base = atan2(dy, dx)
		var m: int = n.parts.size()
		var gap2: float = e.size * 0.75
		for k in m:
			var q: Dictionary = n.parts[k]
			var ang = base + (k - (m - 1) / 2.0) * (PI * 1.6 / m)
			var t2: Dictionary
			if k == 0:
				set_node(e, q)
				t2 = e
			else:
				t2 = spawn_enemy({"ch": q.ch}, Vector2(ox2, oy2))
			t2.x = ox2 + cos(ang) * gap2; t2.y = oy2 + sin(ang) * gap2; t2.kx = cos(ang) * 380; t2.ky = sin(ang) * 380; t2.daze = 1.2; t2.pulse = 1.0
		add_gem(ox2, oy2, 3 * HS.xp)
		return false
	var i = randi() % n.parts.size()
	var gone: Dictionary = n.parts[i]
	var rest = []
	for j in n.parts.size():
		if j != i:
			rest.append(n.parts[j])
	DEBRIS.append({"x": e.x, "y": e.y, "ch": gone.ch, "size": e.size * 0.75, "vx": dx * 340 + rnd(-140, 140), "vy": dy * 340 - 220, "r": 0.0, "vr": rnd(-7, 7), "life": 1.0, "max": 1.0})
	shatter(e.x, e.y, gone.ch, e.size * 0.7, 0.55, KD.SUMI)
	add_stain(e.x, e.y, e.size * 0.45)
	if has_form("化") and how == "type":
		SPARK.append({"x": e.x, "y": e.y, "ch": gone.ch, "vx": rnd(-200, 200), "vy": rnd(-260, -120), "t": 0.0, "from": e, "done": false})
	if has_form("腐") and how == "type":
		ROT.append({"x": e.x, "y": e.y, "r": 70 * SF, "life": 5.0, "max": 5.0, "tk": 0.0})
	var nn: Dictionary = rest[0] if rest.size() == 1 else {"ch": "".join(rest.map(func(q): return q.ch)), "en": n.en, "parts": rest}
	set_node(e, nn)
	e.pulse = 1.0
	e.flash = 0.2
	add_gem(e.x, e.y, 1.2 * HS.xp)
	return false

func add_gem(x: float, y: float, v: float, delay := 0.0, gold := false) -> void:
	GEMS.append({"x": x, "y": y, "fx": x, "fy": y, "side": -1 if randf() < 0.5 else 1, "age": -delay, "v": v, "gold": gold, "done": false})

# ---------- 漢詩（ボス）: 古の怪物が近づいて襲ってくる。漢詩の英訳（二句ずつ）を打ち切ると、主人公が突っ込んで反撃する ----------
## 怪物は大きくて単語が長いだけで、雑魚と同じ仕組み。ただしタイピング以外の攻撃（仲間・衝撃）は効かない
func spawn_boss() -> void:
	var pm: Dictionary = KD.D.POEMS[boss_idx % KD.D.POEMS.size()]
	boss = {"id": uid, "is_boss": true, "poem": pm, "li": 0, "ch": pm.title, "x": cam.x, "y": cam.y, "size": 60 * SF, "rad": 40 * SF, "alive": true, "locked": false, "t": 0.0, "flash": 0.0, "pulse": 0.0, "kx": 0.0, "ky": 0.0, "fx_t": 0.0, "typed": "", "word": "", "acc": [], "gift": false, "captive": false, "line_t": 0.0,
		"daze": 0.0, "st": "walk", "st_t": 4.0, "ldir": Vector2.DOWN, "eat": 0, "word_len": 0}
	uid += 1
	set_poem_line()
	E.append(boss)
	# 決戦: 画面はここに固定され、遠くへは行けない
	var lay = poem_layout()
	boss.arena = Vector2(hero.x, hero.y - lay.bottom * 0.5)
	boss.monster = Monster.KINDS[boss_idx % Monster.KINDS.size()]
	boss.mb = 0.0
	boss.mfl = 0.0
	boss.ms = 104.0 * SF
	boss.size = boss.ms
	boss.rad = boss.ms * 0.62
	# 闘いの場の上のほうから現れる
	boss.x = boss.arena.x
	boss.y = boss.arena.y - H / 2 + lay.bottom + boss.ms * 1.05
	var info: Dictionary = Monster.INFO[boss.monster]
	boss_intro = 2.4
	reveal = 0
	show_banner("決戦　" + info.name, "%s — TYPE THE POEM TO STRIKE BACK" % info.en, true)
	sfx.play("boom")
	sfx.play("brush", -2)
	sfx.play("gong", -4)
	# 闇が落ちる
	flash = 0.55 if not calm else 0.3
	flash_col = Color(0.02, 0.01, 0.05)
	var alt: String = ("（%s）" % info.alt) if info.alt != "" else ""
	set_hint("%s%s「%s」— %s。逃げながら、怪物の下の英訳を打ち切って反撃する" % [info.name, alt, info.src, info.say], 11)
	for e in E:
		if e != boss and e.alive and not e.captive and not e.get("still", false):
			kill_enemy(e, "blast")

## 二句ずつ打つ（一句では短すぎる）
func set_poem_line() -> void:
	var lines: Array = boss.poem.lines
	var a: Array = lines[boss.li]
	var b: Array = lines[boss.li + 1] if boss.li + 1 < lines.size() else []
	boss.zh = String(a[0]) + ("，" + String(b[0]) if b.size() else "")
	boss.rows = [String(a[1])] + ([String(b[1])] if b.size() else [])
	boss.phrase = " ".join(boss.rows)
	boss.fx = a[2]
	boss.fx_t = 0.0
	boss.line_t = 0.0
	var w = ""
	for c in String(boss.phrase):
		if c >= "a" and c <= "z":
			w += c
	set_word(boss, w)

func poem_layout() -> Dictionary:
	var ln: String = String(boss.get("zh", "　"))
	var n = ln.length()
	var top = 84.0 if W < 560 else 78.0
	var P0: float = min(W * 0.62 / max(1, n), H * 0.045, 32.0)
	var y = top + 16 + P0 * 0.55
	var x0 = W / 2 - (n - 1) / 2.0 * P0
	var fs = round(15 * max(0.85, SF))
	var ey = y + P0 * 0.55
	return {"P": P0, "y": y, "x0": x0, "n": n, "top": top, "bottom": ey + 16, "fs": fs, "ey": ey}

func boss_hit() -> void:
	var b: Dictionary = boss
	# 打ち切った二句の字が、怪物の体から砕け散る
	var chars: String = String(b.zh).replace("，", "")
	for j in chars.length():
		var an = float(j) / max(1, chars.length()) * TAU
		shatter(b.x + cos(an) * b.ms * 0.45, b.y + sin(an) * b.ms * 0.45, chars[j], 30 * SF, 0.7, KD.KIN)
	shake = 18 * shake_k()
	hitstop = 0.14
	flash = 0.12 if calm else 0.25
	flash_col = KD.KIN
	sfx.play("boom")
	# 反撃: 怪物は大きく吹き飛び、しばらくふらつく
	var u0 = Vector2(b.x - hero.x, b.y - hero.y)
	u0 = u0.normalized() if u0.length() > 0.01 else Vector2.UP
	b.kx = u0.x * 900; b.ky = u0.y * 900
	b.daze = 1.8
	b.st = "walk"
	b.st_t = rnd(3.5, 5.0)
	b.mfl = 1.0
	add_ring(b.x, b.y, b.ms * 1.2, 0.5, KD.SHU, 7)
	for i in 40:
		var an2 = rnd(0, TAU)
		var r0 = rnd(0.1, 0.8) * b.ms
		P.append({"k": "ink", "x": b.x + cos(an2) * r0, "y": b.y + sin(an2) * r0 * 0.9, "vx": cos(an2) * rnd(120, 420), "vy": sin(an2) * rnd(120, 420) - 80, "life": 0.8, "max": 0.8, "s": rnd(2, 5) * SF, "c": ink_col() if i % 3 else KD.SHU})
	# 詩の衝撃（弱め）: 画面の雑魚の単語を末尾から1文字ずつ減らして、押し返す
	var n = 0
	for e in E.duplicate():
		if not e.alive or e.is_boss or e.captive or e.gift or e.locked or e.get("still", false) or not on_view(e.x, e.y, 20):
			continue
		var d = Vector2(e.x - hero.x, e.y - hero.y)
		var u = d.normalized() if d.length() > 0.01 else Vector2.UP
		e.kx += u.x * 300; e.ky += u.y * 300
		e.daze = max(e.daze, 0.5)
		e.eat_cd = 0.0
		eat_letter(e, 1, 1)
		n += 1
	add_ring(hero.x, hero.y, Vector2(W, H).length() * 0.45, 0.5, KD.KIN, 4)
	if n:
		add_text(hero.x, hero.y - 70 * SF, "詩の衝撃 ×%d" % n, 16 * SF + 4, KD.KIN, 0.9)
	b.li += 2
	if b.li >= b.poem.lines.size():
		boss_die()
		return
	set_poem_line()
	sfx.play("brush", -6)

func boss_die() -> void:
	var b: Dictionary = boss
	b.alive = false
	kills += 1
	var had_fish = unlocked(KD.hero("魚"))
	meta.gods = int(meta.get("gods", 0)) + 1
	save_meta()
	if not had_fish:
		later(3.4, func(): show_banner("魚 が目覚めた", "UNLOCKED — 魚でリスタートできる", false, true))
	slow_t = 1.0
	flash = 0.15 if calm else 0.3
	flash_col = KD.KIN
	shake = 18 * shake_k()
	for i in 3:
		add_ring(hero.x, hero.y, max(W, H) * (0.2 + i * 0.12), 0.6 + i * 0.12, KD.KIN if i % 2 else KD.SHU, 8 - i * 0.6)
	var mname: String = Monster.INFO[b.monster].name if b.has("monster") else ""
	later(0.3, func(): show_banner(mname + " 討伐" if mname != "" else "詩を読み解いた", "POEM BROKEN — " + b.poem.title, false, true))
	if b.has("monster"):
		var g = monster_geo()
		mdead = {"kind": b.monster, "c": g[0], "s": g[1], "t": 0.0, "bt": b.t, "k": 0.0}
		sfx.play("gong", -2)
	for i in 10:
		add_gem(hero.x, hero.y - 200 * SF, 6 + boss_idx * 2, i * 0.05, true)
	hp = min(max_hp, hp + 2)
	if not fish_joined and not E.any(func(x): return x.captive):
		# 画面の右上の端に、小さく
		var cp = spawn_enemy({"ch": "魚", "en": "fish", "beh": "gift"}, Vector2(cam.x + W * 0.36, cam.y - H * 0.22))
		cp.captive = true
		cp.size = 32 * SF
		cp.rad = 24 * SF
		if cp.has("spr"):
			cp.spr.visible = false
		later(1.8, func(): show_banner("囚われの魚", "TYPE \"fish\" TO FREE HER", false, true))
	boss = null
	boss_idx += 1
	next_boss = time + 80
	# 決戦のあとは凪から
	wave = {"i": 3, "t": 9.0, "dir": 0.0, "warned": false}

var _later: Array = []
func later(sec: float, fn: Callable) -> void:
	_later.append([sec, fn])

func tick_teaser(dt: float) -> void:
	if not fish_joined and boss == null and teased != boss_idx and time >= next_boss - 9:
		teased = boss_idx
		teaser = {"t": 0.0}
		show_banner("囚われの魚", "A POEM IS COMING FOR HER")
		sfx.play("warn")
	if teaser != null:
		teaser.t += dt
		if teaser.t > 4.5:
			teaser = null

func join_fish(t: Dictionary) -> void:
	t.alive = false
	fish_joined = true
	for i in 4:
		add_ring(t.x, t.y, (60 + i * 50) * SF, 0.5 + i * 0.1, KD.AI if i % 2 else KD.KIN, 5)
	shatter(t.x, t.y, "囗", t.size * 1.4, 0.8, KD.SHU)
	flash = 0.2 if calm else 0.4
	flash_col = KD.KIN
	sfx.play("fuse")
	show_banner("魚を救った", "SHE SWIMS FREE — 次は魚で始められる")

# ---------- 打鍵: 英単語だけ。次の文字が合う単語はすべて1文字進む ----------
func typables() -> Array:
	if state == "title":
		return title_cards.filter(func(t): return t.ok)
	if state == "levelup":
		return cards
	if state != "play" or boss_intro > 0:
		return []
	return E.filter(func(e): return e.alive and not e.locked and e.get("rest", 0.0) <= 0 and (e.is_boss or on_view(e.x, e.y + e.size * 0.9, 8)))

func key(ch: String) -> void:
	var list = typables()
	if list.is_empty():
		return
	var adv = 0
	var fin = []
	for t in list:
		var nb: String = t.typed + ch
		if not t.acc.any(func(a): return String(a).begins_with(nb)):
			if t.typed == "" or t.get("is_boss", false):
				continue
			t.typed = ""
			nb = ch
			if not t.acc.any(func(a): return String(a).begins_with(nb)):
				continue
		t.typed = nb
		adv += 1
		t.pulse = 1.0
		if t.acc.has(nb):
			fin.append(t)
	if state == "title":
		if fin.size():
			select_hero(fin[0].h)
		elif adv:
			sfx.play("tick", -8)
		return
	if state == "levelup":
		if fin.size():
			choose(fin[0].i)
		elif adv:
			sfx.play("tick", -6)
		return
	if state != "play":
		return
	if adv == 0:
		# 仲間に壊された末尾まで打ってしまっても、ミスにはしない
		if tail_absorb != "" and tail_absorb.begins_with(ch):
			tail_absorb = tail_absorb.substr(1)
			sfx.play("tick", -16)
			return
		misses += 1
		if combo >= 5:
			add_text(hero.x, hero.y - 60 * SF, "連撃 途切れ", 18, KD.SUMI)
		combo = 0
		sfx.play("miss", -6)
		shake = max(shake, 4 * shake_k())
		return
	typed_ok += 1
	tail_absorb = ""
	sfx.play("tick", -10, rnd(0.95, 1.08))
	if not rest_charged:
		rest_t = 0
	finish_words(fin)

func finish_words(fin: Array) -> void:
	for t in fin:
		if int(t.get("eat", 0)) > 0:
			tail_absorb = String(t.word).substr(String(t.word).length() - t.eat)
		t.word_len = String(t.word).length()
		t.typed = ""
		t.locked = true
		combo += 1
		max_combo = max(max_combo, combo)
		words += 1
		if [10, 25, 50, 75, 100, 150, 200, 300, 500].has(combo):
			show_banner(KD.kn(combo) + "連撃", "%d COMBO" % combo)
	# 漢詩を打ち切ったら、怪物にも突っ込んで反撃する
	if fin.size():
		queue_attacks(fin)

# ---------- 主人公: 突っ込んで斬り、斬った場所に留まる ----------
func queue_attacks(list: Array) -> void:
	var from = hero.queue[-1].target if hero.queue.size() else (hero.target if hero.state == "dash" and hero.target != null else hero)
	var rest = list.duplicate()
	while rest.size():
		var best = rest[0]
		var bd = 1e18
		for r in rest:
			var d = Vector2(r.x - from.x, r.y - from.y).length_squared()
			if d < bd:
				bd = d
				best = r
		rest.erase(best)
		hero.queue.append({"target": best})
		from = best
	if hero.state == "idle":
		start_dash()

func alive(t) -> bool:
	return t != null and t.alive and (not t.get("is_boss", false) or boss_intro <= 0)

func strike_point(t: Dictionary) -> Vector2:
	var d = Vector2(t.x - hero.x, t.y - hero.y)
	if d.length() < 1:
		d = Vector2(1, 0)
	var r: float = t.rad + hero_r() + 4 * SF
	return Vector2(t.x, t.y) - d.normalized() * r

func start_dash() -> void:
	while hero.queue.size():
		var job: Dictionary = hero.queue.pop_front()
		if not alive(job.target):
			if job.target != null:
				job.target.locked = false
			continue
		hero.target = job.target
		hero.from = Vector2(hero.x, hero.y)
		hero.to = strike_point(job.target)
		hero.state = "dash"
		hero.t = 0.0
		hero.face = 1 if hero.to.x >= hero.x else -1
		sfx.play("dash", -8, rnd(0.9, 1.15))
		return
	hero.state = "idle"
	hero.target = null

func tick_hero(dt: float) -> void:
	hero.inv = max(0.0, hero.inv - dt)
	hero.land = max(0.0, hero.land - dt * 6.5)
	hero.morph = max(0.0, hero.morph - dt)
	hero.dk += ((1.0 if hero.state == "dash" else 0.0) - hero.dk) * min(1.0, dt * (20.0 if hero.state == "dash" else 9.0))
	if hero.state == "dash":
		hero.t += dt / max(0.035, HS.dash)
		var k: float = min(1.0, hero.t)
		if alive(hero.target):
			hero.to = strike_point(hero.target)
		var s = k * k * (3 - 2 * k)
		var p: Vector2 = hero.from.lerp(hero.to, s)
		hero.x = p.x
		hero.y = p.y
		TRAIL.append({"x": hero.x, "y": hero.y, "life": 0.22, "max": 0.22})
		if k >= 1:
			resolve_hit(hero.target)
			hero.state = "linger"
			hero.t = 0.0
			hero.land = 1.0
	elif hero.state == "linger":
		hero.t += dt
		if hero.t >= 0.1:
			if hero.queue.size():
				start_dash()
			else:
				hero.state = "idle"
				hero.target = null
	elif hero.queue.size():
		start_dash()
	if boss != null and boss.has("arena"):
		var lay = poem_layout()
		var A: Vector2 = boss.arena
		var m: float = 36 * SF
		hero.x = clamp(hero.x, A.x - W / 2 + m, A.x + W / 2 - m)
		hero.y = clamp(hero.y, A.y - H / 2 + lay.bottom + m, A.y + H / 2 - m - 30)

func others(t, r := 1e9, origin := Vector2.INF) -> Array:
	var o = Vector2(hero.x, hero.y) if origin == Vector2.INF else origin
	return E.filter(func(x): return x != t and x.alive and not x.is_boss and not x.locked and not x.gift and x.typed == "" and x.get("obj", "") == "" and Vector2(x.x, x.y).distance_to(o) < r)

func resolve_hit(t) -> void:
	if not alive(t):
		if t != null:
			t.locked = false
		return
	t.locked = false
	var dir = Vector2(t.x - hero.from.x, t.y - hero.from.y).normalized()
	if dir == Vector2.ZERO:
		dir = Vector2.UP
	hero.last_dir = dir
	slash(hero.from.x, hero.from.y, t.x, t.y, t.get("is_boss", false))
	hero.inv = max(hero.inv, 0.3)
	if t.captive:
		join_fish(t)
		return
	if t.get("obj", "") != "":
		use_obj(t)
		return
	var charged = rest_charged
	rest_charged = false
	rest_t = 0
	var whole = charged or (has_form("信") and t.word_len >= 6)
	if charged:
		show_banner("休", "RESTED STRIKE")
	var crit = randf() < min(0.5, max(0, combo - 4) * 0.01 + HS.crit)
	hitstop = max(hitstop, 0.08 if crit or charged else 0.05)
	shake = max(shake, (10.0 if crit else 7.0) * shake_k())
	sfx.koto(combo)
	sfx.play("slash", -5, rnd(0.9, 1.1))
	add_ring(t.x, t.y, 70 * SF, 0.28, KD.KIN if crit else KD.SHU, 6)
	if crit:
		add_text(t.x, t.y - t.size * 0.8, "会心", 22 * SF + 6, KD.KIN, 0.6)
	if t.get("is_boss", false):
		boss_hit()
		return
	var killed = break_part(t, dir.x, dir.y)
	if not killed:
		if whole:
			t.bq = KD.leaves(t.node)
			t.bq_t = 0.22
			t.daze = 2.0
		var kb: float = 520 * HS.knock
		t.kx = dir.x * kb
		t.ky = dir.y * kb
		t.daze = max(t.daze, 1.1)
	if not killed and has_form("比"):
		var near = others(t, 200 * SF, Vector2(t.x, t.y))
		if near.size():
			near.sort_custom(func(a, b): return Vector2(a.x - t.x, a.y - t.y).length() < Vector2(b.x - t.x, b.y - t.y).length())
			slash(t.x, t.y, near[0].x, near[0].y, false)
			break_part(near[0], 0, -1, "splash")
	elif has_form("付") and shield < 3:
		shield += 1
		add_text(hero.x, hero.y - 50 * SF, "付", 22 * SF, KD.SHU, 0.6)
	# 着地の衝撃: 周りの字はまとめて吹き飛ぶ（打ちかけの字は巻き込まない）。強化すると巻き込んだ字の部品も崩す
	var cut: bool = HS.splash > 0 or L("刀") > 0 or has_form("伐")
	var R2: float = (110 + HS.splash + L("刀") * 40) * SF
	add_ring(hero.x, hero.y, R2, 0.32, KD.SHU if cut else ink_col(), 6 if cut else 3)
	for o in others(t):
		var od = Vector2(o.x - hero.x, o.y - hero.y)
		var dl = od.length()
		if dl < 0.01:
			od = Vector2.UP
			dl = 1.0
		if dl < R2 + o.rad:
			var kb2: float = (480 + (R2 - dl) * 2) * HS.knock
			o.kx = od.x / dl * kb2
			o.ky = od.y / dl * kb2
			o.daze = 0.8
			if cut:
				break_part(o, od.x / dl, od.y / dl, "splash")
	if has_form("北"):
		for o in others(t, 190 * SF):
			var od2 = Vector2(o.x - hero.x, o.y - hero.y).normalized()
			if od2.dot(dir) < -0.3:
				slash(hero.x, hero.y, o.x, o.y, false)
				break_part(o, od2.x, od2.y, "splash")
	if has_form("从"):
		var near2 = others(t, 230 * SF)
		if near2.size():
			near2.sort_custom(func(a, b): return Vector2(a.x - hero.x, a.y - hero.y).length() < Vector2(b.x - hero.x, b.y - hero.y).length())
			var b2 = near2[0]
			slash(hero.x, hero.y, b2.x, b2.y, false)
			var u = Vector2(b2.x - hero.x, b2.y - hero.y).normalized()
			break_part(b2, u.x, u.y, "splash")
	if killed and has_form("花"):
		for i in 18:
			var a = i / 18.0 * TAU
			P.append({"k": "petal", "x": t.x, "y": t.y, "vx": cos(a) * 300, "vy": sin(a) * 300, "life": 0.9, "max": 0.9, "s": 5 * SF, "c": KD.SHU, "r": rnd(0, TAU)})
		for o in others(null, 140 * SF, Vector2(t.x, t.y)):
			break_part(o, 0, -1, "splash")

# ---------- 戦い ----------
## 仲間の攻撃＝タイピングの1文字。単語の末尾から1文字ずつ壊して（半透明にして）、打つ文字を短くする。
## 先頭から打つプレイヤーの邪魔をしない。最後まで壊せば仲間だけでも字を崩せる（物量戦）
## 仲間の一撃は1文字。レベルが上がると削る速さが上がる（同じ字を続けて削れる間隔が レベル分の1）
func dmg_enemy(e: Dictionary, d: float, id := "") -> void:
	eat_letter(e, 1, max(1, L(id)) if id != "" else 1)

func eat_letter(e: Dictionary, n := 1, lv := 1) -> bool:
	if not e.alive or e.get("is_boss", false) or e.captive or e.locked or e.get("obj", "") != "":
		return false
	if e.get("eat_cd", 0.0) > 0:
		return false
	var aic: Color = KD.AIN if night > 0.5 else KD.AI
	for k in n:
		var w: String = e.word
		# 残り1文字を壊したら、仲間の手でその字を崩す（部品が1つはがれ、単体の字なら倒れる）
		if w.length() - e.eat <= 1:
			add_ring(e.x, e.y, e.rad * 1.6, 0.3, aic, 4)
			break_part(e, 0, -1, "weapon")
			dbg_break += 1
			e.eat_cd = 0.3
			return true
		e.eat += 1
		dbg_eat += 1
		var keep = w.substr(0, w.length() - e.eat)
		e.acc = [keep]
		# 壊れた文字が札から跳ねる
		var fs = 14.0 * max(0.85, SF)
		var lx: float = e.x - tw(MF, w, fs) / 2 + tw(MF, keep, fs)
		var ly: float = e.y + e.size * 0.62
		TX.append({"x": lx + 6, "y": ly - k * 6, "t": w[w.length() - e.eat], "s": fs + 4, "c": aic, "life": 0.6, "max": 0.6, "vy": -90.0 - k * 30, "mono": true})
		for i in 5:
			var an = rnd(0, TAU)
			P.append({"k": "ink", "x": lx + 6, "y": ly + 8, "vx": cos(an) * 90, "vy": sin(an) * 90 - 40, "life": 0.35, "max": 0.35, "s": 2.0 * SF, "c": KD.AI})
		# プレイヤーがすでに残りを打ち終えていたら、その場で打ち切りになる
		if e.typed != "" and e.typed == keep and state == "play":
			finish_words([e])
			break
	e.eat_cd = 0.3 / lv / dmg_mul() * pow(0.9, traits.get("dmg", 0))
	e.flash = 0.1
	return true

# ---------- 緩急: 波 ----------
func wave_name() -> String:
	return WAVES[int(wave.get("i", 1))][0]

func dir_name(a: float) -> Array:
	var names = [["東", "EAST"], ["南東", "SOUTHEAST"], ["南", "SOUTH"], ["南西", "SOUTHWEST"], ["西", "WEST"], ["北西", "NORTHWEST"], ["北", "NORTH"], ["北東", "NORTHEAST"]]
	return names[posmod(int(round(a / (TAU / 8))), 8)]

func tick_wave(dt: float) -> void:
	if boss != null or wave.is_empty():
		return
	wave.t -= dt
	var nx = (int(wave.i) + 1) % WAVES.size()
	if WAVES[nx][0] == "群" and not wave.warned and wave.t < 2.5:
		wave.warned = true
		wave.dir = rnd(0, TAU)
		var dn = dir_name(wave.dir)
		show_banner(dn[0] + "から群れ", "A SWARM FROM THE " + dn[1], false, true)
		sfx.play("warn")
	if wave.t <= 0:
		wave.i = nx
		var nm: String = WAVES[nx][0]
		wave.t = WAVES[nx][2] + (min(6.0, time / 60.0) if nm == "群" else 0.0)
		wave.warned = false
		if nm == "凪":
			add_text(hero.x, hero.y - 70 * SF, "凪 — 風が止んだ", 16 * SF + 4, KD.AI, 1.4)
		elif nm == "群":
			sfx.play("taiko", -3)
			spawn_t = 0.0

func movers() -> int:
	var n = 0
	for e in E:
		if e.alive and not e.is_boss and not e.get("still", false):
			n += 1
	return n

func do_spawn() -> void:
	var n = movers()
	if boss != null:
		spawn_t = max(0.85, 1.9 - time * 0.004)
		if n >= 24:
			return
		var g = monster_geo()
		if randf() < 0.4 and g[0].distance_to(Vector2(hero.x, hero.y)) > 240 * SF:
			# 怪物が字を吐き出す
			var p: Vector2 = g[0] + Vector2.from_angle(rnd(0, TAU)) * rnd(0, g[1] * 0.4)
			spawn_enemy(null, p)
			add_ring(p.x, p.y, 60 * SF, 0.4, KD.SHU, 4)
			for i in 10:
				var an = rnd(0, TAU)
				P.append({"k": "ink", "x": p.x, "y": p.y, "vx": cos(an) * 220, "vy": sin(an) * 220, "life": 0.5, "max": 0.5, "s": 3 * SF, "c": KD.SHU})
		else:
			spawn_enemy()
		return
	match wave_name():
		"静":
			spawn_t = max(2.2, 4.2 - time * 0.004)
			if n < 7:
				spawn_enemy()
		"増":
			spawn_t = max(0.95, 2.7 - time * 0.006)
			if n < 22:
				spawn_enemy()
		"群":
			spawn_t = max(0.22, 0.45 - time * 0.0006)
			if n < 34:
				var a: float = wave.dir + rnd(-0.45, 0.45)
				var R = edge_r(a) + 30
				spawn_maxlv = 2
				spawn_enemy(null, Vector2(cam.x + cos(a) * R + rnd(-40, 40), cam.y + sin(a) * R + rnd(-40, 40)))
				spawn_maxlv = 0
		_:
			spawn_t = 0.5

# ---------- 野: 動かない草木と名所 ----------
func CHS() -> float:
	return 900.0 * SF

func tick_field(dt: float) -> void:
	field_t -= dt
	if field_t > 0:
		return
	field_t = 0.4
	var cc = Vector2i(floori(cam.x / CHS()), floori(cam.y / CHS()))
	for dx in range(-2, 3):
		for dy in range(-2, 3):
			var k = cc + Vector2i(dx, dy)
			if not chunks.has(k):
				gen_chunk(k)
	for k in chunks.keys():
		if max(abs(k.x - cc.x), abs(k.y - cc.y)) > 3:
			chunks.erase(k)
			for e in E:
				if e.alive and e.get("chunk", Vector2i(1 << 30, 0)) == k and e.typed == "" and not e.locked:
					e.alive = false

func _spot_ok(p: Vector2, placed: Array, gap: float) -> bool:
	if p.distance_to(Vector2(hero.x, hero.y)) < 200 * SF:
		return false
	if boss != null and on_view(p.x, p.y, 40):
		return false
	for q in placed:
		if p.distance_to(q) < gap:
			return false
	return true

func _wpick(rng: RandomNumberGenerator, items: Array, wi: int):
	var tot = 0.0
	for it in items:
		tot += it[wi]
	var r = rng.randf() * tot
	for it in items:
		r -= it[wi]
		if r <= 0:
			return it
	return items[0]

func gen_chunk(k: Vector2i) -> void:
	chunks[k] = true
	var rng = RandomNumberGenerator.new()
	rng.seed = hash([field_seed, k.x, k.y])
	var o = Vector2(k.x, k.y) * CHS()
	var placed = []
	if rng.randf() < 0.4:
		var kind = _wpick(rng, OBJS.keys().map(func(c): return [c, OBJS[c][2]]), 1)[0]
		var p = o + Vector2(rng.randf_range(0.2, 0.8), rng.randf_range(0.2, 0.8)) * CHS()
		if _spot_ok(p, placed, 0):
			place_obj(kind, p, k)
			placed.append(p)
	var groves = (1 if rng.randf() < 0.6 else 0) + (1 if rng.randf() < 0.2 else 0)
	for g in groves:
		var c = o + Vector2(rng.randf_range(0.1, 0.9), rng.randf_range(0.1, 0.9)) * CHS()
		for i in rng.randi_range(3, 6):
			var p2 = c + Vector2.from_angle(rng.randf() * TAU) * rng.randf_range(0, 150 * SF)
			if _spot_ok(p2, placed, 64 * SF):
				place_plant(_wpick(rng, PLANTS, 2), p2, k)
				placed.append(p2)
	for i in rng.randi_range(0, 1):
		var p3 = o + Vector2(rng.randf(), rng.randf()) * CHS()
		if _spot_ok(p3, placed, 64 * SF):
			place_plant(_wpick(rng, PLANTS, 2), p3, k)
			placed.append(p3)

func place_plant(pl: Array, p: Vector2, k: Vector2i) -> Dictionary:
	var def = {"ch": pl[0]} if pl[1] == "" else {"ch": pl[0], "en": pl[1]}
	var e = spawn_enemy(def, p, "still")
	e.still = true
	e.chunk = k
	e.spd = 0.0
	e.face = -1 if randf() < 0.5 else 1
	return e

func place_obj(kind: String, p: Vector2, k: Vector2i) -> Dictionary:
	var e = spawn_enemy({"ch": kind, "en": OBJS[kind][0]}, p, "still")
	e.still = true
	e.obj = kind
	e.chunk = k
	e.spd = 0.0
	e.rest = 0.0
	e.rest_max = OBJS[kind][1]
	e.size = 50 * SF
	e.rad = 30 * SF
	return e

## 名所に着いた: 井＝命、鐘＝周りの字を打ち崩す、硯＝墨（経験）、祠＝三択
func use_obj(t: Dictionary) -> void:
	t.rest = t.rest_max
	t.typed = ""
	t.flash = 0.3
	var aic = KD.AIN if night > 0.5 else KD.AI
	hitstop = max(hitstop, 0.06)
	match t.obj:
		"井":
			var heal = min(2, max_hp - hp)
			hp += heal
			add_text(t.x, t.y - 60 * SF, "井 — 命 +%s" % KD.kn(heal) if heal > 0 else "井 — 澄んだ水", 18 * SF + 4, KD.SHU, 1.2)
			for i in 3:
				add_ring(t.x, t.y, (50 + i * 40) * SF, 0.5 + i * 0.12, aic, 4)
			for i in 20:
				var an = rnd(-PI, 0)
				P.append({"k": "ink", "x": t.x, "y": t.y, "vx": cos(an) * 160, "vy": sin(an) * 260, "life": 0.6, "max": 0.6, "s": 3 * SF, "c": aic})
			sfx.play("lv", -6)
		"鐘":
			sfx.play("gong", -2)
			shake = max(shake, 12 * shake_k())
			for i in 4:
				add_ring(t.x, t.y, max(W, H) * (0.25 + i * 0.15), 0.6 + i * 0.12, KD.KIN, 6 - i)
			var n = 0
			for e in E.duplicate():
				if not e.alive or e.is_boss or e.captive or e.gift or e.typed != "" or e.locked or e.get("still", false):
					continue
				if not on_view(e.x, e.y, 40):
					continue
				var u = Vector2(e.x - t.x, e.y - t.y).normalized()
				e.kx += u.x * 420; e.ky += u.y * 420
				e.daze = 2.5
				break_part(e, u.x, u.y, "splash")
				n += 1
			add_text(t.x, t.y - 60 * SF, "鐘の音 ×%d" % n, 18 * SF + 4, KD.KIN, 1.2)
		"硯":
			for i in 10:
				add_gem(t.x + rnd(-30, 30), t.y + rnd(-30, 30), 3.0 * HS.xp, i * 0.05, true)
			add_text(t.x, t.y - 60 * SF, "硯 — 墨が満ちる", 18 * SF + 4, KD.SUMI if night < 0.5 else KD.WASHI, 1.2)
			sfx.play("brush", -4)
		"宝":
			shake = max(shake, 8 * shake_k())
			flash = 0.12 if calm else 0.25
			flash_col = KD.KIN
			for i in 18:
				add_gem(t.x + rnd(-40, 40), t.y + rnd(-40, 40), 4.0 * HS.xp, i * 0.04, true)
			if hp < max_hp:
				hp += 1
			for i in 30:
				var an = rnd(0, TAU)
				P.append({"k": "ink", "x": t.x, "y": t.y, "vx": cos(an) * 340, "vy": sin(an) * 340 - 120, "life": 0.8, "max": 0.8, "s": rnd(2, 4) * SF, "c": KD.KIN})
			show_banner("宝", "TREASURE — 金の墨と命", false, true)
			sfx.play("fuse", -4)
			t.alive = false
		"祠":
			pending_lv += 1
			add_text(t.x, t.y - 60 * SF, "祠 — 字の神が応えた", 18 * SF + 4, KD.KIN, 1.4)
			for i in 3:
				add_ring(t.x, t.y, (60 + i * 50) * SF, 0.6 + i * 0.12, KD.KIN, 5)
			sfx.play("fuse", -4)

## 決戦の怪物の位置と大きさ（漢詩の帯の下の、闘いの場の中ほど）
func monster_geo() -> Array:
	return [Vector2(boss.x, boss.y), float(boss.get("ms", 100.0 * SF))]

func kill_enemy(e: Dictionary, how: String) -> void:
	if not e.alive:
		return
	e.alive = false
	kills += 1
	slain[e.ch] = slain.get(e.ch, 0) + 1
	var typed = how == "type"
	shatter(e.x, e.y, e.ch, e.size, 1.0 if typed else 0.55, KD.KIN if e.gift else KD.SUMI)
	add_stain(e.x, e.y, e.size * (1.0 if typed else 0.6))
	if typed:
		STAMP.append({"x": e.x, "y": e.y, "ch": e.ch, "life": 0.8, "max": 0.8, "rot": rnd(-0.3, 0.3)})
		sfx.play("stamp", -10, rnd(0.9, 1.1))
	elif how == "weapon":
		sfx.play("soft", -8)
	var v: float = (1 + e.lv0 * 0.8) * (1.5 if typed else 1.0) * (1 + floor(combo / 10.0) * 0.15) * HS.xp
	if e.beh == "gift" and typed and not e.captive:
		v *= 8
		show_banner("福", "FORTUNE ×8")
	if e.beh == "heal" and typed:
		hp = min(max_hp, hp + 2)
		add_text(hero.x, hero.y - 50 * SF, "命 +二", 22, KD.SHU, 1.0)
	var n = int(min(8, ceil(v / 1.5)))
	for i in n:
		add_gem(e.x + rnd(-8, 8), e.y + rnd(-8, 8), v / n, i * 0.03)

func hurt(e: Dictionary) -> void:
	if hero.inv > 0 or hero.state == "dash":
		return
	var d = Vector2(e.x - hero.x, e.y - hero.y)
	var u = d.normalized() if d.length() > 0.01 else Vector2.RIGHT
	if shield > 0 and not e.get("is_boss", false):
		shield -= 1
		hero.inv = 0.8
		e.kx = u.x * 640
		e.ky = u.y * 640
		break_part(e, u.x, u.y, "splash")
		add_ring(hero.x, hero.y, 80 * SF, 0.3, KD.SHU, 5)
		return
	hp -= 1
	hero.inv = 1.6 + HS.inv
	red_v = 1.0
	shake = 16 * shake_k()
	sfx.play("hurt", -3)
	if combo >= 5:
		add_text(hero.x, hero.y - 60 * SF, "連撃 途切れ", 18, KD.SUMI)
	combo = 0
	e.kx = u.x * 640
	e.ky = u.y * 640
	add_ring(hero.x + u.x * hero_r(), hero.y + u.y * hero_r(), 85 * SF, 0.3, KD.SHU, 4)
	if hp <= 0:
		hp = 0
		die()

func die() -> void:
	state = "dying"
	dying_t = 1.8
	slow_t = 1.6
	shatter(hero.x, hero.y, form, 70 * SF, 1.4, KD.SHU)
	flash = 0.6
	flash_col = KD.SHU
	sfx.play("boom")

# ---------- 仲間（合体しなかった字）。字の意味どおりに現れて戦う ----------
func ally_ids() -> Array:
	return owned.keys().filter(func(id): return not absorbed.has(id) and KD.D.WEAP.has(id))

func body_ids() -> Array:
	var out = ally_ids().filter(func(id): return not KD.NOBODY.has(id))
	for id in KD.COMPANION:
		if L(id) > 0:
			out.append(id)
	return out

func AP(id: String) -> Vector2:
	if ALLY.has(id):
		return Vector2(ALLY[id].x, ALLY[id].y)
	return Vector2(hero.x, hero.y)

func trail_pos(sec: float) -> Vector2:
	var t = time - sec
	for i in range(hero_hist.size() - 1, -1, -1):
		if hero_hist[i].z <= t:
			return Vector2(hero_hist[i].x, hero_hist[i].y)
	return Vector2(hero.x, hero.y) if hero_hist.is_empty() else Vector2(hero_hist[0].x, hero_hist[0].y)

func bite_target(o: Vector2, R: float):
	var b = null
	var bd = R
	for e in E:
		if not e.alive or e.is_boss or e.gift or e.captive or e.typed != "" or e.locked or e.get("still", false):
			continue
		var d = o.distance_to(Vector2(e.x, e.y))
		if d < bd:
			bd = d
			b = e
	return b

func nearest(o: Vector2, max_d := 1e9):
	var b = null
	var bd = max_d
	for e in E:
		if not e.alive or e.is_boss or e.get("still", false):
			continue
		var d = o.distance_to(Vector2(e.x, e.y))
		if d < bd:
			bd = d
			b = e
	return b

func tick_allies(dt: float) -> void:
	if hero_hist.is_empty() or time - hero_hist[-1].z > 0.04:
		hero_hist.append(Vector3(hero.x, hero.y, time))
		if hero_hist.size() > 60:
			hero_hist.pop_front()
	var ids = body_ids()
	for k in ALLY.keys():
		if not ids.has(k):
			if ALLY[k].has("spr"):
				ALLY[k].spr.queue_free()
			ALLY.erase(k)
	var fd: Vector2 = hero.last_dir
	var i = 0
	for id in ids:
		if not ALLY.has(id):
			ALLY[id] = {"x": hero.x - fd.x * 60 * SF + rnd(-20, 20), "y": hero.y - fd.y * 60 * SF + rnd(-20, 20), "vx": 0.0, "vy": 0.0, "t": rnd(0, 9), "ph": rnd(0, 6), "dash": null, "cd": 1.0, "grow": 0.0, "wilt": 0.0, "hold": null, "latched": false, "bite": 1.2, "dt": 0.0}
			ALLY[id].spr = _ally_sprite(id)
		var a: Dictionary = ALLY[id]
		a.t += dt
		var tx: float = a.x
		var ty: float = a.y
		var k = 12.0
		i += 1
		if id == "木":
			# 根を張る: 動かない。離れすぎたら枯れて、主人公の近くに生え直す
			var far = Vector2(hero.x - a.x, hero.y - a.y).length() > 380 * SF
			if a.wilt > 0:
				a.wilt += dt * 2.5
				if a.wilt >= 1:
					var an = rnd(0, TAU)
					a.x = hero.x + cos(an) * rnd(70, 120) * SF
					a.y = hero.y + sin(an) * rnd(50, 90) * SF
					a.wilt = 0.0
					a.grow = 0.0
			elif far and a.grow >= 1:
				a.wilt = 0.001
			if a.wilt == 0:
				a.grow = min(1.0, a.grow + dt * 1.6)
			a.vx = 0.0
			a.vy = 0.0
			continue
		if id == "日":
			tx = hero.x + 110 * SF + sin(time * 0.3) * 30 * SF; ty = hero.y - 170 * SF; k = 3
		elif id == "雨":
			# 雲は主人公の近くの字の群れの上へ漂っていき、その真下に降らせる
			var best = null
			var bs = 0.0
			for e in E:
				if not e.alive or e.is_boss or e.gift or e.captive or not on_view(e.x, e.y, -20):
					continue
				if Vector2(e.x - hero.x, e.y - hero.y).length() > 460 * SF:
					continue
				var sc = 0.0
				for o in E:
					if o.alive and not o.is_boss and Vector2(o.x - e.x, o.y - e.y).length() < 110 * SF:
						sc += 0.3 if o.get("still", false) else 1.0
				if sc > bs:
					bs = sc
					best = e
			if best != null:
				tx = best.x + sin(time * 0.9) * 24 * SF; ty = best.y - 120 * SF; k = 1.6
			else:
				tx = hero.x - 110 * SF + sin(time * 0.6) * 40 * SF; ty = hero.y - 130 * SF; k = 3
		elif id == "月":
			tx = hero.x + cos(time * 0.5 + a.ph) * 190 * SF; ty = hero.y + sin(time * 0.7 + a.ph) * 110 * SF; k = 2
		elif id == "犬":
			# 一度噛みついたら戻らない。噛みついている字は動けない。0.5秒後に最初の一噛み、以後 0.8秒÷レベル ごと。画面内の字なら追いかける
			var ok = func(e): return e != null and e.alive and not e.is_boss and not e.gift and not e.captive and not e.locked and not e.get("still", false)
			if not ok.call(a.hold):
				a.hold = null
				var bb = null
				var bdd = 1e9
				for e in E:
					if not ok.call(e) or e.typed != "" or not on_view(e.x, e.y, 20):
						continue
					var dd = Vector2(e.x - a.x, e.y - a.y).length()
					if dd < bdd:
						bdd = dd
						bb = e
				if bb != null:
					a.hold = bb
					a.latched = false
					a.bite = 0.5
			if a.hold != null:
				var e: Dictionary = a.hold
				var side = -1.0 if a.x < e.x else 1.0
				var hp2 = Vector2(e.x + side * (e.rad + 20 * SF), e.y + e.rad * 0.3)
				var dv = hp2 - Vector2(a.x, a.y)
				var dl = dv.length()
				if not a.latched:
					var stp = 820 * SF * dt
					var mv = dv.normalized() * min(dl, stp)
					a.x += mv.x; a.y += mv.y
					a.vx = dv.normalized().x * 820; a.vy = 0.0
					if dl < 10 * SF:
						a.latched = true
				else:
					a.x = hp2.x; a.y = hp2.y; a.vx = -side * 60; a.vy = 0.0
					e.daze = max(e.daze, 0.25)
					e.kx *= 0.5; e.ky *= 0.5
					a.bite -= dt
					if a.bite <= 0:
						a.bite = 0.8 / max(1, L("犬"))
						add_text(e.x, e.y - e.rad, "噛", 18 * SF + 4, KD.AI, 0.5)
						add_ring(e.x, e.y, 44 * SF, 0.25, KD.AI, 3)
						sfx.play("bite", -4)
						e.eat_cd = 0.0
						eat_letter(e, 1, max(1, L("犬")))
				continue
			tx = hero.x - fd.x * 48 * SF - hero.face * 22 * SF; ty = hero.y - fd.y * 48 * SF + 22 * SF; k = 9
		elif id == "刀" or id == "馬" or id == "鳥":
			if id == "刀":
				tx = hero.x + hero.face * 46 * SF; ty = hero.y + 4 * SF
			elif id == "馬":
				tx = hero.x + fd.y * 110 * SF; ty = hero.y - fd.x * 110 * SF; k = 5
			else:
				var an2: float = time * 1.3 + a.ph
				tx = hero.x + cos(an2) * 130 * SF; ty = hero.y - 110 * SF + sin(an2) * 50 * SF; k = 6
			var spec: Array = {"刀": [150 + L("刀") * 30, [1.6, 1.3, 1.0][clamp(L("刀") - 1, 0, 2)], 900, 6], "馬": [300, 3.2 / max(1, L("馬")), 1100, 4], "鳥": [320, 2.6 / max(1, L("鳥")), 1000, 4]}[id]
			a.cd -= dt
			if a.dash == null and a.cd <= 0:
				var b = bite_target(Vector2(hero.x, hero.y), spec[0] * SF)
				if b != null:
					a.dash = b
					a.dt = 0.0
				a.cd = spec[1]
			if a.dash != null:
				var e2: Dictionary = a.dash
				a.dt += dt
				var dv2 = Vector2(e2.x - a.x, e2.y - a.y)
				var d2 = dv2.length()
				var u2 = dv2.normalized()
				var mv2 = u2 * min(d2, spec[2] * SF * dt)
				a.x += mv2.x; a.y += mv2.y; a.vx = u2.x * spec[2]; a.vy = u2.y * spec[2]
				if d2 < e2.rad + 12 * SF or not e2.alive or a.dt > 0.7:
					if e2.alive:
						if id == "刀":
							slash(a.x - u2.x * 40, a.y - u2.y * 40, e2.x, e2.y, false)
						else:
							add_text(e2.x, e2.y - e2.rad, "蹴" if id == "馬" else "啄", 18 * SF + 4, KD.AI, 0.5)
							add_ring(e2.x, e2.y, 40 * SF, 0.25, KD.AI, 3)
						var kb = 620.0 if id == "馬" else 380.0
						e2.kx += u2.x * kb; e2.ky += u2.y * kb
						dmg_enemy(e2, spec[3], id)
						sfx.play("soft", -6)
					a.dash = null
				continue
		a.vx += (tx - a.x) * k * dt
		a.vy += (ty - a.y) * k * dt
		a.vx *= pow(0.03, dt)
		a.vy *= pow(0.03, dt)
		a.x += a.vx * dt
		a.y += a.vy * dt

func weapons(dt: float) -> void:
	tick_allies(dt)
	var hx: float = hero.x
	var hy: float = hero.y
	# 火: 主人公が通った後ろでぱっと燃えて消える。突っ込んだ道筋にも火が残る
	if L("火") and tick("hi_fire", dt, [1.2, 0.9, 0.65][min(L("火"), 3) - 1]):
		var p = trail_pos(0.3 + randf() * 0.25)
		if p.distance_to(Vector2(hx, hy)) < 50 * SF:
			p = Vector2(hx - hero.last_dir.x * 62 * SF - hero.face * rnd(10, 30) * SF, hy - hero.last_dir.y * 62 * SF + 14 * SF)
		ROT.append({"x": p.x + rnd(-14, 14) * SF, "y": p.y + rnd(-10, 10) * SF, "r": (38 + L("火") * 6) * SF, "life": 1.3, "max": 1.3, "tk": 0.0, "fire": true})
	if L("火") and hero.state == "dash" and tick("hi_dash", dt, 0.05):
		ROT.append({"x": hx + rnd(-8, 8) * SF, "y": hy + rnd(-8, 8) * SF, "r": (30 + L("火") * 5) * SF, "life": 0.9, "max": 0.9, "tk": 0.0, "fire": true})
	# 矢: 主人公の手から放たれる
	if L("矢") and tick("ya", dt, [1.1, 0.8, 0.55][min(L("矢"), 3) - 1]):
		var t = nearest(Vector2(hx, hy), max(W, H))
		if t != null:
			var ap = AP("矢")
			var an = atan2(t.y - ap.y, t.x - ap.x)
			add_ring(ap.x, ap.y, 26 * SF, 0.18, KD.AI, 3)
			PROJ.append({"k": "ya", "x": ap.x, "y": ap.y, "vx": cos(an) * 560 * SF, "vy": sin(an) * 560 * SF, "dm": 3, "pierce": L("矢") - 1, "hit": [], "life": 1.6})
	# 水: 足元から波紋
	if L("水") and tick("mizu", dt, [4.5, 3.6, 2.8][min(L("水"), 3) - 1]):
		var ap2 = AP("水")
		wave_rings.append({"x": ap2.x, "y": ap2.y, "r": 0.0, "R": (170 + L("水") * 40) * SF, "hit": [], "dm": 2 + L("水")})
		sfx.play("soft", -8)
	for w in wave_rings:
		w.r += dt * 420 * SF
		for e in E:
			if e.alive and not e.is_boss and not w.hit.has(e.id):
				var ev = Vector2(e.x - w.x, e.y - w.y)
				if abs(ev.length() - w.r) < e.rad + 10:
					w.hit.append(e.id)
					var u = ev.normalized()
					e.kx += u.x * 240; e.ky += u.y * 240
					dmg_enemy(e, w.dm, "水")
	wave_rings = wave_rings.filter(func(w): return w.r < w.R)
	# 木: 字の足元から根
	var root_n = L("木") + 1 if L("木") else 0
	if root_n and tick("ki", dt, [3.0, 2.6, 2.2][clamp(L("木") - 1, 0, 2)]):
		var ap3 = AP("木")
		var cands = E.filter(func(e): return e.alive and not e.is_boss and on_view(e.x, e.y) and Vector2(e.x, e.y).distance_to(ap3) < 320 * SF)
		cands.shuffle()
		for j in min(root_n, cands.size()):
			ROOTS.append({"x": cands[j].x, "y": cands[j].y, "t": 0.0, "dm": 5, "done": false, "size": 50 * SF})
	for r in ROOTS:
		r.t += dt
		if not r.done and r.t > 0.35:
			r.done = true
			for e in E:
				if e.alive and Vector2(e.x - r.x, e.y - r.y).length() < r.size * 0.6 + e.rad:
					dmg_enemy(e, r.dm, "木")
			add_stain(r.x, r.y, r.size * 0.4)
	ROOTS = ROOTS.filter(func(r): return r.t < 0.9)
	# 日: 陽光の結界
	if L("日") and tick("hi", dt, 0.5):
		var ap4 = AP("日")
		var R = (70 + L("日") * 18) * SF
		for e in E:
			if e.alive and Vector2(e.x, e.y).distance_to(ap4) < R + e.rad:
				dmg_enemy(e, 1, "日")
	# 月: 三日月を投げる
	if L("月") and tick("tsuki", dt, [2.3, 1.8, 1.4][min(L("月"), 3) - 1]):
		var cnt = 2 if L("月") >= 3 else 1
		for j in cnt:
			var ap5 = AP("月")
			var t5 = nearest(ap5)
			var an5: float = (atan2(t5.y - ap5.y, t5.x - ap5.x) if t5 != null else rnd(0, TAU)) + j * PI
			crescents.append({"ox": ap5.x, "oy": ap5.y, "a": an5, "d": 0.0, "out": true, "hit": [], "dm": 3 + L("月"), "spin": 0.0, "R": (240 + L("月") * 20) * SF, "x": ap5.x, "y": ap5.y})
	for m in crescents:
		m.spin += dt * 14
		if m.out:
			m.d += dt * 520 * SF
			if m.d >= m.R:
				m.out = false
				m.hit = []
		else:
			m.d -= dt * 600 * SF
		m.x = m.ox + cos(m.a) * m.d
		m.y = m.oy + sin(m.a) * m.d
		for e in E:
			if e.alive and not e.is_boss and not m.hit.has(e.id) and Vector2(e.x - m.x, e.y - m.y).length() < e.rad + 18 * SF:
				m.hit.append(e.id)
				dmg_enemy(e, m.dm, "月")
	crescents = crescents.filter(func(m): return m.out or m.d > 0)
	# 雨: 雲の近くの字を狙って降り、濡らす
	if L("雨") and tick("ame", dt, [0.32, 0.2, 0.12][min(L("雨"), 3) - 1]):
		var ap6 = AP("雨")
		# 雲の幅の中から、雲の真下（地面）へ落ちる
		var x6: float = ap6.x + rnd(-38, 38) * SF
		var y6: float = ap6.y + rnd(95, 150) * SF
		P.append({"k": "drop", "x": x6, "y": ap6.y + 12 * SF, "ty": y6, "vx": 0.0, "vy": 760.0, "life": 1.0, "max": 1.0, "s": 2.0, "c": KD.SUMI, "dm": 2})
	# 田: 地面に罠が刻まれる
	if L("田") and tick("ta", dt, 3.4):
		for j in L("田"):
			var vis = E.filter(func(e): return e.alive and not e.is_boss and on_view(e.x, e.y))
			var ap7 = AP("田")
			var t7 = vis.pick_random() if vis.size() else null
			TRAP.append({"x": t7.x if t7 != null else ap7.x + rnd(-150, 150) * SF, "y": t7.y if t7 != null else ap7.y + rnd(-150, 150) * SF, "life": 6.0, "max": 6.0, "s": 64 * SF, "tk": 0.0})
	for tr in TRAP:
		tr.life -= dt
		tr.tk -= dt
		var hit: bool = tr.tk <= 0
		if hit:
			tr.tk = 0.5
		for e in E:
			if e.alive and not e.is_boss and abs(e.x - tr.x) < tr.s / 2 and abs(e.y - tr.y) < tr.s / 2:
				e.slow = 0.3
				if hit:
					dmg_enemy(e, 2, "田")
	TRAP = TRAP.filter(func(t): return t.life > 0)
	for p in PROJ:
		p.x += p.vx * dt
		p.y += p.vy * dt
		p.life -= dt
		for e in E:
			if e.alive and not e.is_boss and not p.hit.has(e.id) and Vector2(e.x - p.x, e.y - p.y).length() < e.rad + 8:
				p.hit.append(e.id)
				dmg_enemy(e, p.dm, "矢")
				p.pierce -= 1
				if p.pierce < 0:
					p.life = 0.0
					break
	PROJ = PROJ.filter(func(p): return p.life > 0)

# ---------- 毎フレーム ----------
func _process(delta: float) -> void:
	var dt: float = min(0.05, delta)
	ui_time += dt
	for i in range(_later.size() - 1, -1, -1):
		_later[i][0] -= dt
		if _later[i][0] <= 0:
			var fn: Callable = _later[i][1]
			_later.remove_at(i)
			fn.call()
	auto_tick(dt)
	if banner != null:
		banner.t += dt
		if banner.t > 1.5:
			banner = null
	if hint_t > 0:
		hint_t -= dt
	if choose_t > 0:
		choose_t -= dt
		if choose_t <= 0:
			_apply_choice()
	if cine != null:
		cine.t += dt
		if cine.t >= cine.dur:
			_end_cine()
	var sdt = dt
	if hitstop > 0:
		hitstop -= dt
		sdt = 0.0
	update(sdt, dt)
	_sync_visuals(dt)
	sfx.set_night(night)
	bg_mat.set_shader_parameter("cam", cam)
	bg_mat.set_shader_parameter("night", night)
	bg_mat.set_shader_parameter("time", ui_time)
	bg_mat.set_shader_parameter("calm", 1.0 if calm else 0.0)
	var sh = Vector2(randf() - 0.5, randf() - 0.5) * shake
	world.position = Vector2(W / 2, H / 2) - cam + sh
	_test_hook(dt)
	for l in [scenery, ground, hero_layer, fx_layer, label_layer, screen_fx, ui]:
		l.queue_redraw()

func update(dt: float, real: float) -> void:
	if state == "title":
		time += dt
		for e in E:
			e.t += dt
			e.x += e.vx * dt
			e.y += e.vy * dt
			e.born += dt
			if e.x < -W / 2 - 80: e.x = W / 2 + 80
			if e.x > W / 2 + 80: e.x = -W / 2 - 80
			if e.y < -H / 2 - 80: e.y = H / 2 + 80
			if e.y > H / 2 + 80: e.y = -H / 2 - 80
			e.face = -1 if e.vx < 0 else 1
		step_fx(dt)
		return
	if state != "play" and state != "dying":
		return
	if slow_t > 0:
		slow_t -= real
		ts = 0.25
	else:
		ts = min(1.0, ts + real * 3)
	dt *= ts
	upd_camera(real)
	if state == "dying":
		dying_t -= real
		step_fx(dt)
		if dying_t <= 0:
			game_over()
		return
	time += dt
	red_v = max(0.0, red_v - dt * 1.5)
	night += ((1.0 if boss != null else 0.0) - night) * min(1.0, dt * 2.2)
	if boss_intro > 0:
		boss_intro -= dt
		reveal = min(1.0, reveal + dt / 2.2)
		if boss != null:
			boss.t += dt
		step_fx(dt)
		return
	if boss == null and time >= next_boss:
		spawn_boss()
	tick_wave(dt)
	tick_field(dt)
	spawn_t -= dt
	if spawn_t <= 0:
		do_spawn()
	if boss != null:
		tick_boss(dt)
	tick_hero(dt)
	if has_form("休") and not rest_charged:
		rest_t += dt
		if rest_t >= 3:
			rest_charged = true
			sfx.play("lv", -8)
			add_text(hero.x, hero.y - 60 * SF, "休 — 力が満ちた", 18 * SF + 6, KD.KIN, 1.0)
	tick_teaser(dt)
	for r in ROT:
		r.life -= dt
		r.tk -= dt
		var now: bool = r.tk <= 0
		if now:
			r.tk = 1.0
		if now:
			for e in E:
				if e.alive and Vector2(e.x - r.x, e.y - r.y).length() < r.r + e.rad:
					dmg_enemy(e, 3, "火" if r.has("fire") else "")
	ROT = ROT.filter(func(r): return r.life > 0)
	for sp in SPARK:
		sp.t += dt
		var tg = null
		var bd = 360 * SF
		for e in E:
			if not e.alive or e.is_boss or e.gift or e.typed != "" or e.locked or e == sp.from or e.get("still", false):
				continue
			var d = Vector2(e.x - sp.x, e.y - sp.y).length()
			if d < bd:
				bd = d
				tg = e
		if tg != null and sp.t > 0.25:
			var an = atan2(tg.y - sp.y, tg.x - sp.x)
			sp.vx += cos(an) * 1800 * dt
			sp.vy += sin(an) * 1800 * dt
		sp.vx *= pow(0.2, dt)
		sp.vy *= pow(0.2, dt)
		sp.x += sp.vx * dt
		sp.y += sp.vy * dt
		if tg != null and bd < tg.rad:
			sp.done = true
			break_part(tg, sp.vx / 600, sp.vy / 600, "splash")
		if sp.t > 2.5:
			sp.done = true
	SPARK = SPARK.filter(func(s): return not s.done)
	if HS.regen and tick("regen", dt, HS.regen) and hp < max_hp:
		hp += 1
		add_text(hero.x, hero.y - 50 * SF, "命 +一", 20, KD.SHU, 1.0)
	for e in E:
		if not e.alive or e.is_boss:
			continue
		e.t += dt
		e.born += dt
		e.flash = max(0.0, e.flash - dt)
		e.pulse = max(0.0, e.pulse - dt * 4)
		e.slow = max(0.0, e.slow - dt)
		e.eat_cd = max(0.0, e.get("eat_cd", 0.0) - dt)
		var dv = Vector2(hero.x - e.x, hero.y - e.y)
		var d = max(dv.length(), 1.0)
		var u = dv / d
		e.daze = max(0.0, e.daze - dt)
		if e.bq > 0:
			e.bq_t -= dt
			if e.bq_t <= 0:
				e.bq -= 1
				e.bq_t = 0.22
				hitstop = max(hitstop, 0.03)
				sfx.play("thud", -6)
				if break_part(e, rnd(-1, 1), -1):
					continue
		if e.get("still", false):
			# 野の字は根を張って動かない
			e.rest = max(0.0, e.get("rest", 0.0) - dt)
			e.kx = 0.0; e.ky = 0.0; e.vx = 0.0; e.vy = 0.0
			continue
		var sp: float = e.spd * (0.45 if e.slow > 0 else 1.0) * (0.3 if e.locked else 1.0) * (0.15 if e.daze > 0 else 1.0)
		var v = u * sp
		if e.beh == "fly" or e.beh == "swarmling":
			var o = cos(e.t * 3.2) * sp * 1.1
			v += Vector2(-u.y, u.x) * o
		if e.beh == "zig":
			e.zig_t -= dt
			if e.zig_t <= 0:
				e.zig_t = rnd(0.4, 0.8)
				e.zs *= -1
			v += Vector2(-u.y, u.x) * sp * 1.4 * e.zs
		if e.captive:
			v = Vector2(0, sin(e.t * 2) * 8)
		elif e.gift:
			v = Vector2(-u.y * sp * 1.6 + u.x * sp * 0.4, u.x * sp * 1.6 + u.y * sp * 0.4)
		e.vx = v.x
		e.vy = v.y
		e.x += (v.x + e.kx) * dt
		e.y += (v.y + e.ky) * dt
		e.kx *= pow(0.07, dt)
		e.ky *= pow(0.07, dt)
		if abs(v.x) > 3:
			e.face = -1 if v.x < 0 else 1
		e.tilt += ((v.x / (sp + 1)) * 0.1 - e.tilt) * min(1.0, dt * 6)
		if not e.gift and d < e.rad + hero_r():
			if hero.inv > 0 or hero.state == "dash":
				var push: float = e.rad + hero_r() - d
				e.x -= u.x * push
				e.y -= u.y * push
			else:
				hurt(e)
		if e.gift and not e.captive and e.t > 24:
			e.alive = false
		if Vector2(e.x - cam.x, e.y - cam.y).length() > max(W, H) * 1.6 and not e.locked and not e.captive:
			e.alive = false
	# 押し合い: 動く字どうし、動く字と草木（林や森は壁になる: 動かない字は押されず、相手だけが回り込む）
	var mv = []
	var st = []
	for e in E:
		if e.alive and not e.is_boss:
			if e.get("still", false):
				if on_view(e.x, e.y, 300):
					st.append(e)
			else:
				mv.append(e)
	for i in mv.size():
		var a: Dictionary = mv[i]
		for j in range(i + 1, mv.size()):
			var b: Dictionary = mv[j]
			var dd = Vector2(b.x - a.x, b.y - a.y)
			var l = dd.length()
			var m: float = (a.rad + b.rad) * 0.85
			if l < m and l > 0.01:
				var p = dd * ((m - l) / l * 0.5)
				a.x -= p.x; a.y -= p.y; b.x += p.x; b.y += p.y
		for b in st:
			var dd2 = Vector2(a.x - b.x, a.y - b.y)
			var m2: float = (a.rad + b.rad) * 0.85
			if abs(dd2.x) > m2 or abs(dd2.y) > m2:
				continue
			var l2 = dd2.length()
			if l2 < m2 and l2 > 0.01:
				var p2 = dd2 * ((m2 - l2) / l2)
				a.x += p2.x; a.y += p2.y
	weapons(dt)
	step_fx(dt)
	for e in E:
		if not e.alive:
			_free_sprite(e)
	E = E.filter(func(e): return e.alive)
	if state == "play" and hero.state == "idle" and slow_t <= 0 and pending_lv > 0:
		open_level_up()

func tick_boss(dt: float) -> void:
	var b: Dictionary = boss
	b.t += dt
	b.fx_t += dt
	b.line_t += dt
	b.flash = max(0.0, b.flash - dt)
	b.pulse = max(0.0, b.pulse - dt * 4)
	b.mb += (float(b.li) / b.poem.lines.size() - b.mb) * min(1.0, dt * 6)
	b.mfl = max(0.0, b.mfl - dt * 2.5)
	b.daze = max(0.0, b.daze - dt)
	var dv = Vector2(hero.x - b.x, hero.y - b.y)
	var d: float = max(1.0, dv.length())
	var u = dv / d
	var v = Vector2.ZERO
	var spd: float = (40.0 + min(boss_idx, 6) * 6) * SF * (1 + time / 600.0)
	b.st_t -= dt
	match b.st:
		"walk":
			# のしのしと近づいてくる
			v = u * spd * (0.15 if b.daze > 0 else 1.0)
			if b.st_t <= 0 and b.daze <= 0 and d < 560 * SF:
				b.st = "wind"
				b.st_t = 0.95
				b.ldir = u
				sfx.play("warn", -6)
		"wind":
			# 身構える（突進の向きが見える）
			if b.st_t > 0.4:
				b.ldir = u
			if b.st_t <= 0:
				b.st = "lunge"
				b.st_t = 0.5
				sfx.play("dash", -2, 0.6)
		"lunge":
			v = b.ldir * 640 * SF
			if b.st_t <= 0:
				b.st = "walk"
				b.st_t = rnd(4.0, 6.5)
	b.x += (v.x + b.kx) * dt
	b.y += (v.y + b.ky) * dt
	b.kx *= pow(0.05, dt)
	b.ky *= pow(0.05, dt)
	# 結界の中に留まる
	var lay = poem_layout()
	var A: Vector2 = b.arena
	b.x = clamp(b.x, A.x - W / 2 + b.ms * 0.6, A.x + W / 2 - b.ms * 0.6)
	b.y = clamp(b.y, A.y - H / 2 + lay.bottom + b.ms * 0.7, A.y + H / 2 - b.ms * 0.9)
	# 雑魚を押しのける
	for e in E:
		if not e.alive or e.is_boss:
			continue
		var od = Vector2(e.x - b.x, e.y - b.y)
		var m: float = b.rad + e.rad * 0.6
		if abs(od.x) < m and abs(od.y) < m:
			var l = od.length()
			if l < m and l > 0.01 and not e.get("still", false):
				e.x += od.x / l * (m - l)
				e.y += od.y / l * (m - l)
	# 襲う: 触れると命が減る（突進中の主人公には当たらない）
	if d < b.rad + hero_r() and state == "play":
		var hp0 = hp
		hurt(b)
		if hp < hp0:
			# 一撃したら少し退いて、続けざまには襲わない
			b.daze = 1.2
			b.st = "walk"
			b.st_t = max(b.st_t, 2.5)
	if b.fx == "frost":
		for e in E:
			if e.alive and not e.is_boss:
				e.slow = 0.2
	taiko_t -= dt
	if taiko_t <= 0:
		taiko_t = 0.7 if b.st != "walk" else 1.4
		sfx.play("taiko", -9)

func upd_camera(dt: float) -> void:
	# 主人公が中央の枠を出たら、少し遅れてついていく
	var dz: float = min(W, H) * (0.24 if calm else 0.14)
	var tau = 0.6 if calm else 0.32
	var target_off: float = poem_layout().bottom * 0.5 if boss != null else 0.0
	cam_off += (target_off - cam_off) * min(1.0, dt * 3)
	if boss != null and boss.has("arena"):
		# 決戦の間は画面が動かない
		var k0 = 1 - exp(-dt / 0.35)
		cam += (boss.arena - cam) * k0
		return
	var dx: float = hero.x - cam.x
	var dy: float = (hero.y - cam_off) - cam.y
	var tx: float = hero.x - sign(dx) * dz if abs(dx) > dz else cam.x
	var ty: float = hero.y - cam_off - sign(dy) * dz if abs(dy) > dz else cam.y
	var k = 1 - exp(-dt / tau)
	cam.x += (tx - cam.x) * k
	cam.y += (ty - cam.y) * k

func step_fx(dt: float) -> void:
	if mdead != null:
		mdead.t += dt
		mdead.k -= dt
		if mdead.k <= 0 and mdead.t < 1.6:
			mdead.k = 0.12
			var an = rnd(0, TAU)
			var r0 = rnd(0.1, 0.7) * mdead.s
			var px: float = mdead.c.x + cos(an) * r0
			var py: float = mdead.c.y + sin(an) * r0
			add_stain(px, py, rnd(20, 50) * SF)
			for i in 8:
				var a2 = rnd(0, TAU)
				P.append({"k": "ink", "x": px, "y": py, "vx": cos(a2) * 260, "vy": sin(a2) * 260 - 120, "life": 0.7, "max": 0.7, "s": rnd(2, 5) * SF, "c": KD.SHU if i % 3 == 0 else ink_col()})
		if mdead.t > 1.9:
			mdead = null
	for p in P:
		if p.k == "drop":
			p.y += p.vy * dt
			if p.y >= p.ty:
				p.life = 0.0
				add_ring(p.x, p.ty, 26 * SF, 0.25, ink_col(), 2)
				for e in E:
					if e.alive and Vector2(e.x - p.x, e.y - p.ty).length() < e.rad + 22 * SF:
						dmg_enemy(e, p.dm, "雨")
						if e.typed == "":
							e.slow = max(e.slow, 0.8)
			continue
		p.x += p.vx * dt
		p.y += p.vy * dt
		var drag = 0.05 if p.k != "petal" else 0.3
		p.vx *= pow(drag, dt)
		p.vy *= pow(drag, dt)
		if p.k == "petal":
			p.vy += 60 * dt
			p.r += dt * 4
		p.life -= dt
	P = P.filter(func(p): return p.life > 0)
	if P.size() > 1400:
		P = P.slice(P.size() - 1400)
	for g in GEMS:
		g.age += dt
		if g.age < 0:
			continue
		var k: float = clamp((g.age - 0.15) / 0.6, 0, 1)
		var c = Vector2(g.fx + (hero.x - g.fx) * 0.35 + g.side * 80 * SF, g.fy + (hero.y - g.fy) * 0.35 - 80 * SF)
		var a = Vector2(g.fx, g.fy).lerp(c, k)
		var b = c.lerp(Vector2(hero.x, hero.y), k)
		var p2 = a.lerp(b, k)
		g.x = p2.x
		g.y = p2.y
		if g.age >= 0.75 and state == "play":
			g.done = true
			gain_xp(g.v)
	GEMS = GEMS.filter(func(g): return not g.done)
	for t in TX:
		t.y += t.vy * dt
		t.vy *= pow(0.2, dt)
		t.life -= dt
	TX = TX.filter(func(t): return t.life > 0)
	for s in SL:
		s.life -= dt
	SL = SL.filter(func(s): return s.life > 0)
	for r in RG:
		r.life -= dt
		r.r = r.R * (1 - pow(max(0.0, r.life / r.max), 3))
	RG = RG.filter(func(r): return r.life > 0)
	for b2 in BOLT:
		b2.life -= dt
	BOLT = BOLT.filter(func(b): return b.life > 0)
	for s in STAMP:
		s.life -= dt
	STAMP = STAMP.filter(func(s): return s.life > 0)
	for s in SHARD:
		s.x += s.vx * dt
		s.y += s.vy * dt
		s.vx *= pow(0.25, dt)
		s.vy *= pow(0.25, dt)
		s.vy += 260 * dt
		s.r += s.vr * dt
		s.life -= dt
	SHARD = SHARD.filter(func(s): return s.life > 0)
	for t in TRAIL:
		t.life -= dt
	TRAIL = TRAIL.filter(func(t): return t.life > 0)
	for d in DEBRIS:
		d.x += d.vx * dt
		d.y += d.vy * dt
		d.vy += 700 * dt
		d.r += d.vr * dt
		d.life -= dt
	DEBRIS = DEBRIS.filter(func(d): return d.life > 0)
	for s in STAIN:
		s.age += dt
	shake *= pow(0.004, dt)
	flash = max(0.0, flash - dt * 1.8)

func need() -> float:
	return 10 + level * 7 + floor(pow(level, 1.5))

func gain_xp(v: float) -> void:
	xp += v
	xp_snd -= 1
	if xp_snd <= 0:
		sfx.play("xp", -14, rnd(0.95, 1.2))
		xp_snd = 3
	while xp >= need():
		xp -= need()
		level += 1
		pending_lv += 1

# ---------- 合体（三択）: 英単語を打ち切って素材を一つ手に入れる ----------
func evo_status(pid: String) -> Array:
	var out = []
	for n in KD.children_of(form):
		var m = KD.mats_of(n)
		if not m.has(pid):
			continue
		var need_d = {}
		for x in m:
			need_d[x] = need_d.get(x, 0) + 1
		var lack = 0
		for k in need_d:
			lack += max(0, need_d[k] - L(k) - (1 if k == pid else 0))
		out.append({"n": n, "m": m, "lack": lack})
	return out

func evo_hits(pid: String) -> Array:
	var out = []
	for n in KD.children_of(form):
		var m = KD.mats_of(n)
		if not m.has(pid):
			continue
		var need_d = {}
		for x in m:
			need_d[x] = need_d.get(x, 0) + 1
		var ok = true
		for k in need_d:
			if L(k) < need_d[k]:
				ok = false
		if ok:
			out.append(n)
	return out

func open_level_up() -> void:
	state = "levelup"
	sfx.play("lv", -4)
	var first_done = lv_opened > 0
	lv_opened += 1
	var cand = []
	for id in KD.D.WEAP:
		if L(id) < int(KD.D.WEAP[id].max):
			cand.append({"t": "w", "id": id, "en": KD.D.WEAP[id].en, "w": 1.4})
	var evo_ids = []
	for n in KD.children_of(form):
		for m in KD.mats_of(n):
			if evo_ids.has(m):
				continue
			if (KD.D.PARTS.has(m) and L(m) < 3) or (KD.D.WEAP.has(m) and L(m) < int(KD.D.WEAP[m].max)):
				evo_ids.append(m)
	var pool = []
	if evo_ids.size():
		var done = evo_ids.filter(func(id): return evo_status(id).any(func(x): return x.lack == 0))
		var id: String = (done if done.size() and randf() < 0.6 else evo_ids).pick_random()
		# 最初の三択では、かならず犬が進化素材として出る
		if not first_done and evo_ids.has("犬"):
			id = "犬"
		if KD.D.PARTS.has(id) and not KD.D.WEAP.has(id):
			pool.append({"t": "p", "id": id, "en": KD.D.PARTS[id]})
		else:
			pool.append({"t": "w", "id": id, "en": KD.D.WEAP[id].en})
	for c0 in cand:
		c0.r = randf() * c0.w
	cand.sort_custom(func(a, b): return a.r > b.r)
	for c0 in cand:
		if pool.size() >= 3:
			break
		if evo_ids.has(c0.id):
			continue
		if not pool.any(func(p): return String(p.en)[0] == String(c0.en)[0]):
			pool.append(c0)
	while pool.size() < 3:
		pool.append({"t": "h", "id": "癒", "en": "heal"})
	pool.shuffle()
	cards = []
	for i in pool.size():
		var p: Dictionary = pool[i].duplicate()
		p.i = i
		p.acc = [p.en]
		p.typed = ""
		p.pulse = 0.0
		cards.append(p)
	choose_card = null

const COMPANION_DESC = {
	"犬": "連れ hound — 足元についてくる。近くの字に噛みついて離さず、噛まれた字は動けない。0.8秒ごとに末尾を1文字壊し、壊し切ったら字を崩して、残りの字も噛み続ける。画面内の字ならどこへでも走る",
	"馬": "連れ steed — 横を並走し、3.2秒ごとに近くの字へ駆けて蹴り飛ばす（末尾を1文字壊す）",
	"鳥": "連れ hawk — 上空を旋回し、2.6秒ごとに急降下して啄む（末尾を1文字壊す）",
}

func card_info(p: Dictionary) -> Dictionary:
	var desc = ""
	if p.t == "h":
		desc = "命を二つ回復する"
	elif p.t == "w":
		var lv = L(p.id)
		var head = ("仲間 %s — " % KD.ALLY_EN.get(p.id, "")) if lv == 0 and KD.ALLY_EN.has(p.id) else ("Lv%d→%d　" % [lv, lv + 1])
		if lv > 0 and not ["命", "力"].has(p.id):
			head += "削る速さ ×%d→×%d　" % [lv, lv + 1]
		desc = head + KD.D.WEAP[p.id].d[min(lv, 2)]
	else:
		# 部品: 連れになる字（犬・馬・鳥）はその性能、本体へのパワーアップは数値で
		var unit = COMPANION_DESC.get(p.id, "")
		var num = KD.D.TRAIT_TXT.get(KD.D.VIA_TRAIT.get(p.id, ""), "")
		if L(p.id) > 0 and unit != "":
			unit = "連れの%sが強くなる（削る速さ ×%d→×%d）" % [p.id, L(p.id), L(p.id) + 1]
		desc = (unit + "\n" + num) if unit != "" else num
	var st = evo_status(p.id)
	var evo = st.filter(func(x): return x.lack == 0).map(func(x): return x.n)
	var part = st.filter(func(x): return x.lack > 0)
	var evo_txt = ""
	if evo.size():
		var lines = []
		for x in evo:
			lines.append(form + " ＋ " + " ＋ ".join(KD.mats_of(x)) + " → " + x.ch)
		evo_txt = "\n".join(lines)
		if evo.size() > 1:
			evo_txt += "（どれかに進化）"
		if evo.any(func(x): return KD.mats_of(x).size() > 1):
			evo_txt += "　複数合体"
	elif part.size():
		var lines2 = []
		for x in part:
			lines2.append(form + " ＋ " + " ＋ ".join(x.m) + " → " + x.n.ch + "（あと%dつ）" % x.lack)
		evo_txt = "\n".join(lines2)
	return {"desc": desc, "evo": evo.size() > 0, "part": part.size() > 0, "evo_txt": evo_txt, "n": L(p.id)}

func choose(i: int) -> void:
	if state != "levelup":
		return
	choose_card = cards[i]
	state = "choosing"
	choose_t = 0.45
	sfx.play("stamp", -2)
	sfx.koto(7)

func _apply_choice() -> void:
	var p: Dictionary = choose_card
	pending_lv -= 1
	if p.t == "h":
		hp = min(max_hp, hp + 2)
	else:
		if not got.has(p.id):
			got.append(p.id)
		owned[p.id] = L(p.id) + 1
		if p.id == "命":
			max_hp += 1
			hp = max_hp
		if p.t == "p":
			var tr: String = KD.D.VIA_TRAIT.get(p.id, "")
			if tr != "":
				traits[tr] = traits.get(tr, 0) + 1
				if tr == "hp":
					max_hp += 1
					hp += 1
			HS = hero_stats()
		# 隠し進化: 今の字＋手に入れた字の組み合わせがあれば、その場で変わる（複数あればランダム）
		var hits = evo_hits(p.id)
		if hits.size():
			evolve(hits.pick_random(), p.id)
			return
		for n in KD.children_of(form):
			var m = KD.mats_of(n)
			if m.size() > 1 and m.has(p.id):
				var need_d = {}
				for q in m:
					need_d[q] = need_d.get(q, 0) + 1
				var lack = 0
				for k in need_d:
					lack += max(0, need_d[k] - L(k))
				later(0.4, func(): show_banner("%s まで あと%dつ" % [n.ch, lack], form + " ＋ " + " ＋ ".join(m) + " → " + n.ch))
				break
	state = "play"

func evolve(n: Dictionary, got_id: String) -> void:
	var prev = form
	var pic = path.size() == 1
	var mats = KD.mats_of(n)
	form = n.ch
	path.append("+".join(mats) + "|" + n.ch)
	# 合体した仲間は主人公に溶け込み、その能力を主人公が継承する
	for id in mats:
		if KD.D.WEAP.has(id):
			absorbed[id] = 1
	HS = hero_stats()
	hero.morph = 1.0
	var how = ""
	var vn: Dictionary = KD.D.VIA_NAME
	if vn.has(n.via) and n.via != "月":
		how = "（" + vn[n.via] + "）"
	var lay = "pair"
	match n.via:
		"背": lay = "back"
		"反": lay = "flip"
		"並": lay = "side"
	if n.ch == "从":
		lay = "follow"
	var abil: String = KD.D.ABIL.get(n.ch, KD.D.TRAIT_TXT.get(KD.D.VIA_TRAIT.get(got_id, ""), ""))
	if mats.size() > 1:
		start_cine(prev, mats, n.ch, prev + " ＋ " + " ＋ ".join(mats) + " ＝ " + n.ch, "複数合体　" + String(n.en).to_upper() + "　—　" + abil, pic, "multi")
	else:
		var inh = "　（" + got_id + "の力を継承）" if KD.D.WEAP.has(got_id) else ""
		start_cine(prev, [got_id], n.ch, prev + " ＋ " + got_id + how + " ＝ " + n.ch, String(n.en).to_upper() + "　—　" + abil + inh, pic, lay)

func start_cine(a: String, b: Array, res: String, cap1: String, cap2: String, pic: bool, lay: String) -> void:
	state = "fusion"
	sfx.play("fuse")
	cine = {"a": a, "b": b, "res": res, "cap1": cap1, "cap2": cap2, "pic": pic, "lay": lay, "t": 0.0, "dur": 2.4}

func _end_cine() -> void:
	cine = null
	state = "play"
	flash = 0.3 if calm else 0.8
	flash_col = KD.KIN
	shake = 14 * shake_k()
	for i in 5:
		add_ring(hero.x, hero.y, (120 + i * 90) * SF, 0.5 + i * 0.1, KD.SHU if i % 2 else KD.KIN, 6)

# ---------- 流れ ----------
func start() -> void:
	reset()
	state = "play"
	for i in 3:
		var a = -1.2 + i * 1.2
		var r: float = min(W, H) * 0.4
		spawn_enemy({"ch": ["林", "休", "明"][i]}, Vector2(cos(a) * r, sin(a) * r))
	# 最初の野: 左下に小さな林、左上に井戸
	var k0 = Vector2i(0, 0)
	var gc = Vector2(-W * 0.3, H * 0.26)
	var lay0 = [["林", "", 0], ["木", "", 0], ["草", "grass", 0], ["森", "", 0], ["草", "grass", 0]]
	for i in lay0.size():
		var an = i * 2.4
		place_plant(lay0[i], gc + Vector2(cos(an), sin(an)) * (20 + i * 26) * SF, k0)
	place_obj("井", Vector2(-W * 0.36, -H * 0.24), k0)
	tick_field(0.0)
	show_banner("開戦", "SURVIVE THE GLYPHS")
	set_hint("字の下の英単語を打つ → 主人公がその字へ突っ込む", 12)
	sfx.play("taiko", -2)

func restart() -> void:
	if not ["play", "paused", "levelup", "over"].has(state):
		return
	var a = auto_on
	start()
	if a:
		set_auto(true)

func to_title() -> void:
	reset()
	state = "title"
	time = 0
	cam = Vector2.ZERO
	night = 0
	title_cards = []
	for h in KD.D.HEROES:
		title_cards.append({"h": h, "ok": unlocked(h), "en": h.en, "acc": [h.en], "typed": "", "pulse": 0.0, "i": title_cards.size()})
	for ch in ["犬", "森", "休", "花", "火", "木", "鬱", "明", "炎", "林", "鳥", "山", "嵐", "秋", "男", "囚"]:
		var e = spawn_enemy({"ch": ch}, Vector2(rnd(-W / 2, W / 2), rnd(-H / 2, H / 2)))
		var a = rnd(0, TAU)
		e.vx = cos(a) * rnd(15, 35)
		e.vy = sin(a) * rnd(15, 35)
		e.born = 5.0

func select_hero(h: Dictionary) -> void:
	hero_def = h
	save_meta()
	sfx.play("stamp", -4)
	for t in title_cards:
		t.typed = ""

func toggle_pause() -> void:
	if state == "play":
		state = "paused"
	elif state == "paused":
		state = "play"

func game_over() -> void:
	state = "over"
	over_t = 0.0
	var before = KD.D.HEROES.filter(func(h): return unlocked(h)).map(func(h): return h.ch)
	meta.kills = int(meta.get("kills", 0)) + kills
	meta.best = max(float(meta.get("best", 0)), time)
	save_meta()
	var fresh = KD.D.HEROES.filter(func(h): return unlocked(h) and not before.has(h.ch)).map(func(h): return h.ch)
	var wpm = int(round(typed_ok / 5.0 / (time / 60.0))) if time > 0 else 0
	var acc = int(round(typed_ok * 100.0 / (typed_ok + misses))) if typed_ok + misses > 0 else 100
	var chain = " → ".join(path.map(func(q): return String(q).split("|")[1] if String(q).contains("|") else q))
	var arms = "".join(owned.keys())
	over_info = {"time": time, "kills": kills, "combo": max_combo, "wpm": wpm, "acc": acc, "level": level, "gods": boss_idx, "chain": chain, "fresh": fresh, "slain": slain.duplicate(), "share": "漢字SURVIVOR｜%s｜%s生存・%d字撃破・最大%s連撃・WPM %d%s%s\n#漢字SURVIVOR #文字の反乱" % [chain.replace(" ", ""), KD.fmt_t(time), kills, KD.kn(max_combo), wpm, ("・装備「" + arms + "」") if arms != "" else "", ("・漢詩%d篇" % boss_idx) if boss_idx else ""], "copied": false}

# ---------- 自動戦闘: ゆっくり打つ（約3文字/秒） ----------
func set_auto(v: bool) -> void:
	auto_on = v
	auto_plan = null
	auto_t = 0.6

func auto_pick():
	if state == "levelup":
		for c in cards:
			if evo_status(c.id).any(func(x): return x.lack == 0):
				return c
		for c in cards:
			if evo_status(c.id).size():
				return c
		return cards.pick_random()
	var list = typables()
	if list.is_empty():
		return null
	for t in list:
		if t.captive:
			return t
	var best = null
	var bd = 1e9
	var objp = null
	var plant = null
	for t in list:
		if t.is_boss:
			continue
		if t.get("still", false):
			if t.get("obj", "") != "":
				if t.obj != "井" or hp < max_hp:
					objp = t
			elif plant == null:
				plant = t
			continue
		var d = Vector2(t.x - hero.x, t.y - hero.y).length()
		if d < bd:
			bd = d
			best = t
	if objp != null and (best == null or bd > min(W, H) * 0.2):
		return objp
	if best == null and plant != null and list.all(func(x): return not x.is_boss):
		return plant
	var b = null
	for t in list:
		if t.is_boss:
			b = t
	if b != null:
		# 怪物が近い・身構えている時は、怪物から遠い字へ突っ込んで逃げる
		var bdist = Vector2(b.x - hero.x, b.y - hero.y).length()
		if bdist < b.rad + 170 * SF or b.st == "wind":
			var far = null
			var fd = 0.0
			for t in list:
				if t.is_boss or t.get("still", false) and t.get("obj", "") == "":
					continue
				var dd = Vector2(t.x - b.x, t.y - b.y).length()
				if dd > fd:
					fd = dd
					far = t
			if far != null and fd > bdist:
				return far
		if best == null or bd > min(W, H) * 0.25:
			return b
	return best if best != null else b

func auto_tick(dt: float) -> void:
	if not auto_on:
		return
	if state == "over":
		over_t += dt
		if over_t > 5:
			over_t = 0
			start()
			set_auto(true)
		return
	if state != "play" and state != "levelup":
		auto_lv_open = false
		return
	if state == "play" and boss_intro > 0:
		return
	if state == "levelup" and not auto_lv_open:
		auto_lv_open = true
		auto_t = 3.5
		auto_plan = null
	if state != "levelup":
		auto_lv_open = false
	auto_t -= dt
	if auto_t > 0:
		return
	var valid = func(t): return t != null and (cards.has(t) if state == "levelup" else (t.alive and not t.locked and typables().has(t)))
	if not valid.call(auto_plan):
		auto_plan = auto_pick()
		if auto_plan == null:
			auto_t = 0.3
			return
	var w: String = auto_plan.acc[0]
	if String(auto_plan.typed).length() >= w.length():
		auto_plan = null
		auto_t = 0.3
		return
	var ch = w[String(auto_plan.typed).length()]
	var tgt = auto_plan
	key(ch)
	var is_card = cards.has(tgt)
	if state == "levelup" and is_card and tgt.typed != "":
		auto_t = rnd(0.42, 0.55)
		return
	if (not is_card and (tgt.locked or not tgt.alive)) or (state != "play" and state != "levelup") or tgt.typed == "":
		auto_plan = null
		auto_t = rnd(0.55, 0.85)
	else:
		auto_t = rnd(0.24, 0.38)
	if auto_plan != null and auto_plan.get("is_boss", false):
		if typables().any(func(t): return not t.is_boss and Vector2(t.x - hero.x, t.y - hero.y).length() < min(W, H) * 0.22):
			auto_plan = null

# ---------- 入力 ----------
func _input(ev: InputEvent) -> void:
	if ev is InputEventKey and ev.pressed:
		var kc: int = ev.keycode
		if kc == KEY_ENTER or kc == KEY_KP_ENTER:
			if state == "title":
				_watch() if watch_mode else start()
			elif state == "over":
				start()
			elif state == "paused":
				toggle_pause()
			return
		if kc == KEY_F6:
			if state != "title":
				set_auto(not auto_on)
			return
		if kc == KEY_ESCAPE:
			if state == "play" or state == "paused":
				toggle_pause()
			return
		if ev.echo:
			return
		var ch = ""
		if ev.unicode >= 65 and ev.unicode <= 122:
			ch = String.chr(ev.unicode).to_lower()
		if ch == "" or ch < "a" or ch > "z":
			var pk: int = ev.physical_keycode
			if pk >= KEY_A and pk <= KEY_Z:
				ch = String.chr(97 + pk - KEY_A)
		if ch != "" and ch >= "a" and ch <= "z" and (state == "play" or state == "levelup" or state == "title"):
			key(ch)
			get_viewport().set_input_as_handled()
	elif ev is InputEventMouseMotion:
		hover_btn = -1
		for i in buttons.size():
			if buttons[i][0].has_point(ev.position):
				hover_btn = i
	elif ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		for b in buttons.duplicate():
			if b[0].has_point(ev.position):
				b[1].call()
				sfx.play("tick", -6)
				return

# ---------- 演出を作る ----------
## 字が砕ける: 字の画像そのものを三角の破片に割って飛ばし、墨の粒も散らす
func shatter(x: float, y: float, t: String, size: float, amt: float, col: Color) -> void:
	var n = int(30 * amt)
	for i in n:
		var a = rnd(0, TAU)
		var sp = rnd(120, 520) * amt
		var r0 = rnd(0, size * 0.35)
		P.append({"k": "ink", "x": x + cos(a) * r0, "y": y + sin(a) * r0, "vx": cos(a) * sp, "vy": sin(a) * sp, "life": rnd(0.35, 0.8), "max": 0.8, "s": rnd(1.6, 3.6) * SF * (size / 46.0), "c": col})
	var tx = bank.get_tex(t)
	if tx == null or amt < 0.5:
		return
	var g = 3 if amt < 1.0 else 4
	var sc = size / 112.0
	var cells = t.length()
	var tw = 160.0 * cells * sc
	var th = 160.0 * sc
	var grid = []
	for gy in g + 1:
		var row = []
		for gx in (g * cells) + 1:
			var u = float(gx) / (g * cells)
			var v = float(gy) / g
			if gx > 0 and gx < g * cells and gy > 0 and gy < g:
				u += rnd(-0.3, 0.3) / (g * cells)
				v += rnd(-0.3, 0.3) / g
			row.append(Vector2(u, v))
		grid.append(row)
	for gy in g:
		for gx in g * cells:
			var q = [grid[gy][gx], grid[gy][gx + 1], grid[gy + 1][gx + 1], grid[gy + 1][gx]]
			for tri in [[q[0], q[1], q[2]], [q[0], q[2], q[3]]]:
				var c: Vector2 = (tri[0] + tri[1] + tri[2]) / 3.0
				var wc = Vector2((c.x - 0.5) * tw, (c.y - 0.5) * th)
				# 字の外側（空白）の破片は飛ばさない
				if abs(c.x - 0.5) > 0.36 and cells == 1 or abs(c.y - 0.5) > 0.36:
					continue
				var pts = PackedVector2Array()
				var uvs = PackedVector2Array()
				for p in tri:
					pts.append(Vector2((p.x - 0.5) * tw, (p.y - 0.5) * th) - wc)
					uvs.append(p)
				var out = wc.normalized() if wc.length() > 0.1 else Vector2.UP
				var spd = rnd(140, 380) * amt
				SHARD.append({"x": x + wc.x, "y": y + wc.y, "vx": out.x * spd + rnd(-60, 60), "vy": out.y * spd - rnd(60, 200), "r": 0.0, "vr": rnd(-7, 7), "life": rnd(0.55, 0.95), "max": 0.95, "pts": pts, "uvs": uvs, "tex": tx, "c": col})

func add_stain(x: float, y: float, s: float) -> void:
	STAIN.append({"x": x, "y": y, "s": s, "tex": tex_stain.pick_random(), "rot": rnd(0, TAU), "age": 0.0})
	if STAIN.size() > 140:
		STAIN.pop_front()

func slash(x1: float, y1: float, x2: float, y2: float, big: bool) -> void:
	var ang = atan2(y2 - y1, x2 - x1)
	var perp = ang + PI / 2
	var bend = rnd(-1, 1) * Vector2(x2 - x1, y2 - y1).length() * 0.2
	SL.append({"a": Vector2(x1, y1), "c": Vector2((x1 + x2) / 2 + cos(perp) * bend, (y1 + y2) / 2 + sin(perp) * bend), "b": Vector2(x2, y2), "life": 0.34, "max": 0.34, "w": (22.0 if big else 13.0) * SF, "boss": big, "cut": false, "seed": randi()})
	var a2 = ang + PI / 2 + rnd(-0.5, 0.5)
	var L2 = (120.0 if big else 42.0) * SF
	var d = Vector2(cos(a2), sin(a2)) * L2
	SL.append({"a": Vector2(x2, y2) - d, "c": Vector2(x2, y2), "b": Vector2(x2, y2) + d, "life": 0.26, "max": 0.26, "w": (18.0 if big else 9.0) * SF, "boss": false, "cut": true, "seed": randi()})

func add_text(x: float, y: float, t: String, s: float, col: Color, life := 0.8) -> void:
	TX.append({"x": x, "y": y, "t": t, "s": s, "c": col, "life": life, "max": life, "vy": -50.0})

func add_ring(x: float, y: float, R: float, life: float, col: Color, w: float) -> void:
	RG.append({"x": x, "y": y, "r": 0.0, "R": R, "life": life, "max": life, "c": col, "w": w})

func show_banner(big: String, sub: String, god := false, small := false) -> void:
	banner = {"big": big, "sub": sub, "god": god, "small": small, "t": 0.0}

func set_hint(t: String, sec: float) -> void:
	hint_text = t
	hint_t = sec

# ---------- 生きている字（スプライト＋シェーダー） ----------
func _new_living(ch: String) -> Sprite2D:
	var s = Sprite2D.new()
	var m = ShaderMaterial.new()
	m.shader = living_shader
	s.material = m
	s.texture = bank.get_tex(ch)
	ents.add_child(s)
	return s

func _make_sprite(e: Dictionary) -> void:
	if not e.has("spr") or not is_instance_valid(e.spr):
		e.spr = _new_living(e.ch)
	else:
		e.spr.texture = bank.get_tex(e.ch)
	var m: ShaderMaterial = e.spr.material
	m.set_shader_parameter("cells", float(String(e.ch).length()))
	m.set_shader_parameter("mo", KD.MOTION_ID.get(e.mo, 0))
	m.set_shader_parameter("ph", e.ph)
	m.set_shader_parameter("st", e.step)

func _free_sprite(e: Dictionary) -> void:
	if e.has("spr") and is_instance_valid(e.spr):
		e.spr.queue_free()
	e.erase("spr")

func _ally_sprite(id: String) -> Sprite2D:
	var s = _new_living(id)
	var m: ShaderMaterial = s.material
	var mo = KD.motion_of(id)
	if id == "雨":
		mo = "drift"
	if id == "犬" or id == "馬":
		mo = "gallop"
	m.set_shader_parameter("mo", KD.MOTION_ID.get(mo, 0))
	m.set_shader_parameter("ph", rnd(0, 6))
	return s

## 字の意味で体ごと動く（跳ねる・駆ける・はばたく・踏みしめる…）。字形のうねりはシェーダー側
func _motion_xf(mo: String, t: float, s: float, face: float, ph: float, st: float, tilt: float) -> Array:
	var tx = 0.0
	var ty = 0.0
	var rot = tilt
	var sx = 1.0
	var sy = 1.0
	var alpha = 1.0
	match mo:
		"gallop":
			var g: float = abs(sin(t * st * 0.9))
			ty = -g * s * 0.16
			rot = face * (0.08 - g * 0.12)
			sx = 1 + (1 - g) * 0.08
			sy = 1 - (1 - g) * 0.08 + g * 0.04
		"swim":
			rot = sin(t * 3) * 0.06
		"flutter":
			ty = sin(t * 7 + ph) * s * 0.14
			sx = 1 + sin(t * 26) * 0.16
			sy = 1 - sin(t * 26) * 0.05
			rot = sin(t * 3.3) * 0.12
		"flicker":
			sy = 1 + sin(t * 11) * 0.07 + sin(t * 23) * 0.03
			ty = -(sy - 1) * s * 0.5
		"rumble":
			var stomp: float = max(0.0, sin(t * 2.4 + ph))
			tx = rnd(-1, 1) * s * 0.012
			sy = 1 - pow(stomp, 8) * 0.12
			sx = 1 + pow(stomp, 8) * 0.08
			ty = s * 0.5 * (1 - sy)
		"drip":
			sy = 1 + sin(t * 3) * 0.04
		"drift":
			alpha = 0.7 + sin(t * 2 + ph) * 0.22
			ty = sin(t * 1.5 + ph) * s * 0.12
		"crawl":
			rot = tilt + sin(t * 30) * 0.07
			tx = sin(t * 25) * s * 0.025
		"chew":
			var b: float = max(0.0, sin(t * 5 + ph))
			sy = 1 - pow(b, 6) * 0.35
			sx = 1 + pow(b, 6) * 0.1
			ty = abs(sin(t * st * 0.5)) * -s * 0.06
		"slither":
			pass
		"sway":
			pass
		_:
			var g2: float = abs(sin(t * st * 0.55))
			ty = -g2 * s * 0.2
			var land = pow(1 - g2, 4)
			sy = 1 - land * 0.14 + g2 * 0.05
			sx = 1 + land * 0.12 - g2 * 0.03
	return [tx, ty, rot, sx, sy, alpha]

func _sync_visuals(dt: float) -> void:
	var ink = ink_col()
	var halo = paper_col()
	halo.a = 0.85
	for e in E:
		if not e.has("spr") or not is_instance_valid(e.spr):
			continue
		var spr: Sprite2D = e.spr
		if not e.alive or e.is_boss or e.captive:
			spr.visible = false
			continue
		spr.visible = true
		var s: float = e.size
		var xf = _motion_xf(e.mo, e.t, s, e.face, e.ph, e.step, e.tilt)
		var flip = 1.0   # 字は反転しない
		var pul: float = 1 + e.pulse * 0.12
		var sc = s / 112.0
		spr.position = Vector2(e.x + xf[0], e.y + xf[1])
		spr.rotation = xf[2]
		spr.scale = Vector2(sc * xf[3] * pul * flip, sc * xf[4] * pul)
		var m: ShaderMaterial = spr.material
		m.set_shader_parameter("t", e.t)
		m.set_shader_parameter("face", e.face)
		m.set_shader_parameter("flash", 1.0 if e.flash > 0 else 0.0)
		var objk: bool = e.get("obj", "") != ""
		var used: bool = e.get("rest", 0.0) > 0
		var ek: Color = ink
		if e.gift or e.get("obj", "") == "宝":
			ek = KD.KIN
		elif objk:
			ek = KD.AIN if night > 0.5 else KD.AI
		elif e.get("dark", false):
			ek = Color(0.78, 0.62, 0.98)
		m.set_shader_parameter("ink", ek)
		m.set_shader_parameter("halo", halo)
		m.set_shader_parameter("reveal", clamp(e.born / 0.55, 0.0, 1.0))
		m.set_shader_parameter("alpha", xf[5] * (0.55 if e.locked else 1.0) * (0.35 if used else 1.0))
		m.set_shader_parameter("glow", 0.6 if e.gift else (0.35 if objk and not used else (0.3 if e.get("dark", false) else 0.0)))
		spr.z_index = 0
		if e.mo == "flicker" and randf() < 0.12 * dt * 60:
			P.append({"k": "ink", "x": e.x + rnd(-s * 0.2, s * 0.2), "y": e.y - s * 0.4, "vx": rnd(-20, 20), "vy": rnd(-90, -40), "life": 0.5, "max": 0.5, "s": rnd(1.5, 3) * SF, "c": KD.SHU})
		if e.mo == "drip" and randf() < 0.04 * dt * 60:
			P.append({"k": "ink", "x": e.x + rnd(-s * 0.2, s * 0.2), "y": e.y + s * 0.45, "vx": 0.0, "vy": 80.0, "life": 0.5, "max": 0.5, "s": 2.2 * SF, "c": KD.SHU if e.ch == "血" else ink})
	var aink = KD.AIN if night > 0.5 else KD.AI
	for id in ALLY:
		var a: Dictionary = ALLY[id]
		var spr2: Sprite2D = a.spr
		var size = 34.0 * SF
		var mo = KD.motion_of(id)
		if id == "雨": mo = "drift"
		if id == "日": size = 52 * SF
		if id == "木": size = 46 * SF
		if id == "犬": size = 38 * SF; mo = "gallop"
		if id == "馬": size = 40 * SF; mo = "gallop"
		if id == "鳥": size = 28 * SF; mo = "flutter"
		var face = -1.0 if a.vx < 0 else 1.0
		var xf2 = _motion_xf(mo, a.t, size, face, a.ph, 9.0, clamp(a.vx / 600.0, -0.3, 0.3))
		var sy = 1.0
		var sx = 1.0
		var alpha: float = xf2[5]
		var yoff = 0.0
		if id == "木":
			var gr: float = (1.0 - a.wilt) if a.wilt > 0 else a.grow
			sy = max(0.02, gr)
			sx = 1 + a.wilt * 0.3 if a.wilt > 0 else 1.0
			alpha = 1 - a.wilt * 0.6 if a.wilt > 0 else 1.0
			yoff = size * 0.5 * (1 - sy)
		var sc2 = size / 112.0
		var flip2 = 1.0   # 字は反転しない
		spr2.position = Vector2(a.x + xf2[0], a.y + xf2[1] + yoff)
		spr2.rotation = xf2[2]
		spr2.scale = Vector2(sc2 * xf2[3] * sx * flip2, sc2 * xf2[4] * sy)
		var m2: ShaderMaterial = spr2.material
		m2.set_shader_parameter("t", a.t)
		m2.set_shader_parameter("face", face)
		m2.set_shader_parameter("ink", aink)
		m2.set_shader_parameter("halo", halo)
		m2.set_shader_parameter("alpha", alpha)
		m2.set_shader_parameter("glow", 0.5 if id == "日" else 0.0)
		spr2.z_index = 2 if id == "犬" else 1

# ---------- 文字を描く道具 ----------
func tw(f: Font, s: String, size: float) -> float:
	return f.get_string_size(s, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size)).x

func txt(ci: CanvasItem, f: Font, x: float, y: float, s: String, size: float, col: Color, align := 0, outline := 0.0, ocol := Color.TRANSPARENT) -> void:
	# align: 0=左 1=中央 2=右。y は文字の上端
	var w = tw(f, s, size)
	var px = x - (w / 2 if align == 1 else (w if align == 2 else 0.0))
	var base = y + f.get_ascent(int(size))
	if outline > 0:
		ci.draw_string_outline(f, Vector2(px, base), s, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), int(outline), ocol)
	ci.draw_string(f, Vector2(px, base), s, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), col)

func wrap_text(ci: CanvasItem, f: Font, x: float, y: float, s: String, width: float, size: float, col: Color, max_lines := -1) -> float:
	var lh = size * 1.6
	var base = y + f.get_ascent(int(size))
	ci.draw_multiline_string(f, Vector2(x, base), s, HORIZONTAL_ALIGNMENT_LEFT, width, int(size), max_lines, col, TextServer.BREAK_MANDATORY | TextServer.BREAK_WORD_BOUND | TextServer.BREAK_GRAPHEME_BOUND | TextServer.BREAK_ADAPTIVE)
	var h = f.get_multiline_string_size(s, HORIZONTAL_ALIGNMENT_LEFT, width, int(size), max_lines, TextServer.BREAK_MANDATORY | TextServer.BREAK_WORD_BOUND | TextServer.BREAK_GRAPHEME_BOUND | TextServer.BREAK_ADAPTIVE).y
	return h

## 字（明朝）を中心座標で描く。縁取り付き
func glyph(ci: CanvasItem, ch: String, c: Vector2, size: float, col: Color, ocol := Color.TRANSPARENT, ow := 0.0, rot := 0.0, sc := Vector2.ONE) -> void:
	ci.draw_set_transform(c, rot, sc)
	var w = tw(GF, ch, size)
	var base = Vector2(-w / 2, size * 0.36)
	if ow > 0:
		ci.draw_string_outline(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), int(ow), ocol)
	ci.draw_string(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), col)
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)

## 主人公の字（進化前は甲骨文、進化後は漢字）
func hero_glyph(ci: CanvasItem, c: Vector2, size: float, col: Color, o := {}) -> void:
	if path.size() == 1 and KD.JGW.has(form):
		var oo = {"lw": 3.0, "glow": 0.8}
		oo.merge(o, true)
		Oracle.draw(ci, form, c, size * 1.15, col, oo)
	else:
		glyph(ci, form, c, size, col, KD.WASHI if night < 0.5 else KD.YORU, size * 0.12, o.get("rot", 0.0), Vector2(abs(o.get("sx", 1.0)), o.get("sy", 1.0)))

func stroke_rect(ci: CanvasItem, r: Rect2, col: Color, w: float) -> void:
	ci.draw_rect(r, col, false, w)

## 筆の線（太さが入り→中→払いで変わる二次ベジェ）
func brush(ci: CanvasItem, a: Vector2, c: Vector2, b: Vector2, w: float, col: Color, head := 1.0, seed := 0) -> void:
	var N = 22
	var left = PackedVector2Array()
	var right = PackedVector2Array()
	var pts = []
	for i in N + 1:
		var f = float(i) / N
		if f > head:
			break
		var u = 1 - f
		pts.append(a * u * u + c * 2 * u * f + b * f * f)
	if pts.size() < 2:
		return
	for i in pts.size():
		var p: Vector2 = pts[i]
		var d: Vector2 = (pts[min(i + 1, pts.size() - 1)] - pts[max(i - 1, 0)]).normalized()
		var n = Vector2(-d.y, d.x)
		var f = float(i) / N
		var ww: float = w * pow(sin(PI * clamp(f, 0.02, 0.98)), 0.7) * 0.5 + 0.5
		left.append(p + n * ww)
		right.append(p - n * ww)
	right.reverse()
	ci.draw_colored_polygon(left + right, col)
	# かすれた毛筋
	var rng = RandomNumberGenerator.new()
	rng.seed = seed
	for k in 4:
		var off = rng.randf_range(-0.55, 0.55)
		var a0 = rng.randf_range(0.0, 0.3)
		var a1 = rng.randf_range(0.7, 1.0)
		var line = PackedVector2Array()
		for i in pts.size():
			var f = float(i) / N
			if f < a0 or f > a1:
				continue
			var p: Vector2 = pts[i]
			var d: Vector2 = (pts[min(i + 1, pts.size() - 1)] - pts[max(i - 1, 0)]).normalized()
			line.append(p + Vector2(-d.y, d.x) * w * off * 1.3)
		if line.size() > 1:
			ci.draw_polyline(line, Color(col.r, col.g, col.b, col.a * 0.45), max(1.0, w * 0.08), true)

# ---------- 地面の層: 墨のにじみ・田の罠・燃える地面・犬の押さえ・陽光 ----------
func _draw_ground(ci: CanvasItem) -> void:
	var ink = ink_col()
	# 決戦の怪物（闘いの場の奥に、古の絵のまま立つ）
	if boss != null and boss.has("monster") and state != "title":
		var g = monster_geo()
		var a: float = clamp(reveal, 0.0, 1.0) * (0.8 if calm else 0.92)
		# 突進の構え: 向かう先に朱の帯
		if boss.st == "wind":
			var L0: float = 640 * SF * 0.5
			var pul = 0.35 + 0.25 * sin(ui_time * 30)
			var c0: Vector2 = g[0]
			var ld: Vector2 = boss.ldir
			var nv = Vector2(-ld.y, ld.x) * boss.rad * 0.8
			ci.draw_colored_polygon(PackedVector2Array([c0 + nv, c0 + ld * (L0 + boss.rad) + nv, c0 + ld * (L0 + boss.rad) - nv, c0 - nv]), Color(KD.SHU, 0.18 * pul + 0.08))
		if boss.monster == "hundun":
			glow(ci, g[0], g[1] * 1.5, Color(KD.SHU, 0.22 * a))
		elif boss.monster == "taotie":
			glow(ci, g[0], g[1] * 1.4, Color(0.3, 0.55, 0.45, 0.2 * a))
		else:
			glow(ci, g[0], g[1] * 1.4, Color(KD.KIN, 0.16 * a))
		var shake_w: float = (0.6 if boss.st == "wind" else 0.0) + boss.mfl
		Monster.draw(ci, boss.monster, g[0] + Vector2(0, (1 - clamp(reveal, 0.0, 1.0)) * 60 * SF), g[1], boss.t * (1.8 if boss.st == "walk" and boss.daze <= 0 else 1.0), boss.mb, ink, a, shake_w)
	if mdead != null:
		var k: float = clamp(mdead.t / 1.8, 0.0, 1.0)
		Monster.draw(ci, mdead.kind, mdead.c + Vector2(0, k * k * 120 * SF), mdead.s * (1 + k * 0.08), mdead.bt, 1.0, ink, 0.9 * (1 - k), 1.0 - k)
	# 草木の根元の影と、名所の台座
	var aic = KD.AIN if night > 0.5 else KD.AI
	for e in E:
		if not e.alive or not e.get("still", false) or not on_view(e.x, e.y, 80):
			continue
		var base = Vector2(e.x, e.y + e.size * 0.42)
		if e.get("obj", "") == "":
			ci.draw_set_transform(base, 0, Vector2(1, 0.28))
			glow(ci, Vector2.ZERO, e.size * 0.6, Color(ink, 0.16))
			ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
			continue
		var ready: bool = e.get("rest", 0.0) <= 0
		if ready:
			glow(ci, Vector2(e.x, e.y), e.size * 1.2, Color(KD.KIN, 0.2 + 0.07 * sin(ui_time * 3 + e.id)))
		_dash_ellipse(ci, base, e.size * 0.8, e.size * 0.24, Color(aic, 0.6 if ready else 0.22), 2.0 * SF)
		if not ready and e.rest < 9000:
			var f: float = 1.0 - e.rest / e.rest_max
			ci.draw_arc(Vector2(e.x, e.y), e.size * 0.72, -PI / 2, -PI / 2 + TAU * f, 48, Color(aic, 0.5), 2.0 * SF, true)
	for s in STAIN:
		var a: float = max(0.0, 1 - s.age / 60.0) * (1 - night * 0.8)
		if a <= 0:
			continue
		var grow: float = min(1.0, 0.35 + s.age / 0.35 * 0.65)
		var R: float = s.s * 1.55 * grow
		ci.draw_set_transform(Vector2(s.x, s.y), s.rot, Vector2.ONE)
		ci.draw_texture_rect(s.tex, Rect2(-R, -R, R * 2, R * 2), false, Color(1, 1, 1, a * 0.75))
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	for tr in TRAP:
		var a2: float = min(1.0, tr.life / tr.max * 3) * 0.6
		var s2: float = tr.s
		var col = Color(KD.SHU, a2)
		glyph(ci, "田", Vector2(tr.x, tr.y), s2 * 1.05, Color(KD.SHU, a2 * 0.55))
		stroke_rect(ci, Rect2(tr.x - s2 / 2, tr.y - s2 / 2, s2, s2), col, 2.0 * SF)
	for r in ROT:
		var k: float = min(1.0, r.life / (r.max * 0.35))
		glow(ci, Vector2(r.x, r.y), r.r * 1.3, Color(KD.SHU, 0.28 * k))
	if ALLY.has("犬"):
		var d: Dictionary = ALLY["犬"]
		if d.hold != null and d.hold.alive:
			var e: Dictionary = d.hold
			_dash_ellipse(ci, Vector2(e.x, e.y + e.rad * 0.75), e.rad * 1.05, e.rad * 0.32, Color(KD.AIN if night > 0.5 else KD.AI, 0.75), 2.5 * SF)
	if L("日") and ALLY.has("日"):
		var ap = AP("日")
		var R2: float = (70 + L("日") * 18) * SF
		glow(ci, ap, R2 * 1.25, Color(KD.KIN, 0.28 + sin(ui_time * 4) * 0.04))
		ci.draw_arc(ap, R2, 0, TAU, 64, Color(KD.KIN, 0.35), 2.0 * SF, true)
	for w in wave_rings:
		var k2: float = 1 - w.r / w.R
		ci.draw_arc(Vector2(w.x, w.y), w.r, 0, TAU, 72, Color(KD.AI, 0.5 * k2), 10 * SF * k2 + 2, true)
		ci.draw_arc(Vector2(w.x, w.y), w.r * 0.86, 0, TAU, 72, Color(KD.AI, 0.25 * k2), 2, true)

func _dash_ellipse(ci: CanvasItem, c: Vector2, rx: float, ry: float, col: Color, w: float) -> void:
	var n = 28
	for i in n:
		if i % 2:
			continue
		var a0 = float(i) / n * TAU
		var a1 = float(i + 1) / n * TAU
		ci.draw_line(c + Vector2(cos(a0) * rx, sin(a0) * ry), c + Vector2(cos(a1) * rx, sin(a1) * ry), col, w, true)

# ---------- 主人公の層 ----------
func _draw_hero_layer(ci: CanvasItem) -> void:
	if hero.is_empty() or state == "boot" or state == "title" or state == "over":
		return
	var ink = ink_col()
	# 囚われの魚
	for e in E:
		if e.alive and e.captive:
			_draw_captive(ci, e.x, e.y, e.size, e.t)
	if teaser != null:
		var k: float = teaser.t
		var rise: float = max(0.0, k - 2.2)
		var x = cam.x + W * 0.4 + sin(k * 2) * 6
		var y = cam.y - H * 0.28 - rise * rise * 90 * SF
		var a: float = min(1.0, k * 2) * max(0.0, 1 - rise / 2.2)
		ci.draw_line(Vector2(x, y - 50 * SF), Vector2(x, cam.y - H / 2 - 20), Color(KD.KIN, 0.7 * a), 2)
		_draw_captive(ci, x, y, 28 * SF, k * 3, a)
		txt(ci, UF, x, y + 28 * SF, "たすけて", 11 * max(0.85, SF), Color(KD.AI, a), 1)
	if state == "dying" and dying_t < 1.5:
		return
	var sz = 62 * SF
	if hero.inv > 0 and hero.state != "dash" and hero.state != "linger" and int(hero.inv * 14) % 2:
		return
	# 突進の残像（墨の尾）
	for t in TRAIL:
		var k3: float = t.life / t.max
		ci.draw_circle(Vector2(t.x, t.y), sz * 0.16 * k3, Color(KD.SHU, 0.18 * k3))
	ci.draw_set_transform(Vector2(hero.x, hero.y + sz * 0.5), 0, Vector2(1, 0.22))
	ci.draw_circle(Vector2.ZERO, sz * 0.32, Color(ink, 0.14))
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	var breath = sin(ui_time * 1.75)
	var rot = 0.0
	var sx = 1.0
	var sy = 1.0
	var ty = 0.0
	if hero.dk > 0.05:
		var dx: float = hero.to.x - hero.from.x
		rot = clamp(dx / (abs(dx) + 60), -1, 1) * 0.3 * hero.dk
		sx = 1 + 0.16 * hero.dk
		sy = 1 - 0.1 * hero.dk
	sy += -hero.land * 0.13 + breath * 0.015
	sx += hero.land * 0.11
	ty = hero.land * sz * 0.06 - breath * 1.2
	if hero.morph > 0:
		var mk = sin(hero.morph * PI)
		sx *= 1 + mk * 0.5
		sy *= 1 + mk * 0.5
	hero_glyph(ci, Vector2(hero.x, hero.y + ty), sz, KD.SHU, {"rot": rot, "sx": sx, "sy": sy, "wob": 0.25, "t": ui_time * 2})
	var m = String(KD.OR_EN.get(form, "")) if path.size() == 1 else String(KD.EVO.get(form, {}).get("en", KD.EN.get(form, "")))
	txt(ci, MF, hero.x, hero.y + sz * 0.56, m, 12 * max(0.85, SF), KD.SHU, 1, 4, paper_col())
	if rest_charged:
		ci.draw_arc(Vector2(hero.x, hero.y), sz * 0.7, 0, TAU, 48, Color(KD.KIN, 0.6 + sin(ui_time * 10) * 0.3), 3, true)
	for i in shield:
		var a4 = ui_time * 2 + i * 2.09
		glyph(ci, "付", Vector2(hero.x + cos(a4) * sz * 0.8, hero.y + sin(a4) * sz * 0.8), 22 * SF, KD.SHU, KD.WASHI, 4)

func _draw_captive(ci: CanvasItem, x: float, y: float, s: float, t: float, a := 1.0) -> void:
	var r = s * 0.75
	var c = Vector2(x, y)
	var n = 8
	for i in range(-3, 4):
		var o = i * r / 3.5
		ci.draw_line(c + Vector2(o, -r), c + Vector2(o, r), Color(paper_col().inverted(), 0.25 * a), 1)
		ci.draw_line(c + Vector2(-r, o), c + Vector2(r, o), Color(paper_col().inverted(), 0.25 * a), 1)
	for side in 4:
		for i in n:
			if i % 2:
				continue
			var p0 = -r + 2 * r * i / n
			var p1 = -r + 2 * r * (i + 1) / n
			var seg = [[Vector2(p0, -r), Vector2(p1, -r)], [Vector2(r, p0), Vector2(r, p1)], [Vector2(p0, r), Vector2(p1, r)], [Vector2(-r, p0), Vector2(-r, p1)]][side]
			ci.draw_line(c + seg[0], c + seg[1], Color(KD.SHU, 0.8 * a), 3 * SF)
	Oracle.draw(ci, "魚", Vector2(x + sin(t * 7) * 3, y), s * 1.1, Color(KD.AIN if night > 0.5 else KD.AI, a), {"rot": sin(t * 3) * 0.25, "lw": 2.4, "wob": 0.6, "t": t * 2, "glow": 0.8})

# ---------- 効果の層 ----------
func _draw_fx(ci: CanvasItem) -> void:
	var ink = ink_col()
	var paper = paper_col()
	# 火: ぱっと燃えて消える
	for r in ROT:
		if not r.has("fire"):
			continue
		var u: float = 1 - r.life / r.max
		var env: float = min(1.0, u / 0.15) * min(1.0, r.life / (r.max * 0.35))
		var fl = 1 + sin(ui_time * 13 + r.x) * 0.1
		glyph(ci, "火", Vector2(r.x, r.y - r.r * 0.2), r.r * 1.15, Color(KD.SHU, env * (0.75 + sin(ui_time * 22 + r.x) * 0.2)), Color(KD.KIN, env * 0.35), 6, 0, Vector2(0.8 + sin(ui_time * 17 + r.y) * 0.08, (0.6 + env * 0.5) * fl))
		if randf() < 0.25 * env:
			P.append({"k": "ink", "x": r.x + rnd(-r.r * 0.4, r.r * 0.4), "y": r.y - r.r * 0.5, "vx": rnd(-20, 20), "vy": rnd(-90, -40), "life": 0.4, "max": 0.4, "s": rnd(1.5, 3) * SF, "c": KD.SHU})
	# 木の根が突き上げる
	for r in ROOTS:
		if r.t < 0.35:
			_dash_ellipse(ci, Vector2(r.x, r.y), r.size * 0.5 * (r.t / 0.35), r.size * 0.18 * (r.t / 0.35), Color(KD.SHU, 0.5), 1.5)
		else:
			var k: float = min(1.0, (r.t - 0.35) / 0.12)
			var f: float = 1 - max(0.0, (r.t - 0.6) / 0.3)
			glyph(ci, "木", Vector2(r.x, r.y - r.size * 0.3 * k), r.size, Color(KD.AIN if night > 0.5 else KD.AI, f), Color(paper, f * 0.8), 5, 0, Vector2(1, k))
	# 水の字が跳ねる
	for w in wave_rings:
		if w.r < w.R * 0.35:
			var k2: float = w.r / (w.R * 0.35)
			glyph(ci, "水", Vector2(w.x, w.y - k2 * 30 * SF), 40 * SF, Color(KD.AIN if night > 0.5 else KD.AI, 1 - k2), Color(paper, (1 - k2) * 0.8), 5)
	for p in PROJ:
		glyph(ci, "矢", Vector2(p.x, p.y), 30 * SF, KD.AIN if night > 0.5 else KD.AI, Color(paper, 0.8), 4, atan2(p.vy, p.vx) + PI / 2)
	for m in crescents:
		glyph(ci, "月", Vector2(m.x, m.y), 34 * SF, KD.KIN, Color(paper, 0.6), 4, m.spin)
	# 墨の粒・雨粒・花びら
	for p in P:
		var a: float = min(1.0, p.life / p.max * 1.5)
		var c: Color = p.c
		if c == KD.SUMI:
			c = ink
		if p.k == "drop":
			ci.draw_line(Vector2(p.x, p.y - 18), Vector2(p.x, p.y), Color(ink, 0.7), 2)
		elif p.k == "petal":
			ci.draw_set_transform(Vector2(p.x, p.y), p.r, Vector2(1, 0.55))
			ci.draw_circle(Vector2.ZERO, p.s * (0.6 + 0.4 * a), Color(KD.SHU, a))
			ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
		else:
			ci.draw_circle(Vector2(p.x, p.y), p.s * (0.4 + 0.6 * a), Color(c, a))
	# はがれた部品（字のまま飛ぶ）
	for d in DEBRIS:
		var a3: float = min(1.0, d.life / d.max * 1.6)
		glyph(ci, d.ch, Vector2(d.x, d.y), d.size, Color(ink, a3), Color(paper, a3 * 0.85), d.size * 0.07, d.r)
	# 字の破片
	for s in SHARD:
		var a4: float = min(1.0, s.life / s.max * 1.4)
		var c4: Color = s.c
		if c4 == KD.SUMI:
			c4 = ink
		ci.draw_set_transform(Vector2(s.x, s.y), s.r, Vector2.ONE)
		ci.draw_colored_polygon(s.pts, Color(c4, a4), s.uvs, s.tex)
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	for sp in SPARK:
		glyph(ci, sp.ch, Vector2(sp.x, sp.y), 26 * SF, KD.SHU, Color(paper, 0.8), 4, sp.t * 8)
	# 斬撃（筆の線）
	for s in SL:
		var k5: float = s.life / s.max
		var col: Color = KD.KIN if s.boss else (KD.SHU if s.cut else ink)
		var head: float = min(1.0, (1 - k5) * 4)
		brush(ci, s.a, s.c, s.b, s.w * (0.4 + k5 * 0.6), Color(col, min(1.0, k5 * 1.6)), head, s.seed)
	for r in RG:
		var c6: Color = r.c
		if c6 == KD.SUMI:
			c6 = ink
		var k6: float = r.life / r.max
		ci.draw_arc(Vector2(r.x, r.y), max(1.0, r.r), 0, TAU, 64, Color(c6, k6), r.w * SF * k6 + 1, true)
	for b in BOLT:
		var pts = PackedVector2Array()
		for p in b.pts:
			pts.append(p + Vector2(rnd(-10, 10), rnd(-10, 10)))
		ci.draw_polyline(pts, Color(KD.KIN, b.life / b.max), 4, true)
	# 落款（倒した字に朱の印）
	for s in STAMP:
		var k7: float = s.life / s.max
		var sc: float = 1 + (k7 - 0.8) * 8 if k7 > 0.8 else 1.0
		var sz: float = 40 * SF * sc
		var a7: float = min(1.0, k7 * 2.5)
		ci.draw_set_transform(Vector2(s.x, s.y - 30 * SF), s.rot, Vector2.ONE)
		ci.draw_texture_rect(tex_seal, Rect2(-sz / 2, -sz / 2, sz, sz), false, Color(KD.SHU, a7))
		var chs: String = s.ch
		var fs: float = sz * 0.62 / (1.7 if chs.length() > 1 else 1.0)
		var w = tw(GF, chs, fs)
		ci.draw_string(GF, Vector2(-w / 2, fs * 0.36), chs, HORIZONTAL_ALIGNMENT_LEFT, -1, int(fs), Color(KD.WASHI, a7))
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	# 墨の粒（経験値）
	for g in GEMS:
		if g.age < 0:
			continue
		var c8: Color = KD.KIN if g.gold else ink
		ci.draw_circle(Vector2(g.x, g.y), (5.0 if g.gold else 3.2) * SF, c8)
		ci.draw_circle(Vector2(g.x - 1, g.y - 1), 1.2 * SF, Color(1, 1, 1, 0.5))
	for t in TX:
		var a9: float = min(1.0, t.life / t.max * 2)
		var c9: Color = t.c
		if c9 == KD.SUMI:
			c9 = ink
		txt(ci, MF if t.get("mono", false) else GF, t.x, t.y - t.s * 0.5, t.t, t.s, Color(c9, a9), 1, 5, Color(paper, a9 * 0.9))

# ---------- 単語札 ----------
func _draw_labels(ci: CanvasItem) -> void:
	if state == "title" or state == "over" or state == "fusion":
		return
	if boss != null:
		_draw_boss_label(ci)
	var ink = ink_col()
	var paper = paper_col()
	for e in E:
		if not e.alive or e.is_boss or not on_view(e.x, e.y, 60):
			continue
		if e.get("rest", 0.0) > 0:
			continue
		var s: float = e.size
		var on: bool = e.typed != ""
		var still: bool = e.get("still", false)
		var objk: bool = e.get("obj", "") != ""
		var fs = (17.0 if on else 14.0) * max(0.85, SF)
		var line: String = e.word
		var w = tw(MF, line, fs)
		var bw = w + 14
		var bh = fs + 9
		var y: float = e.y + (s * 0.62 if not e.captive else s * 0.9)
		var x: float = e.x - bw / 2
		var lock: bool = e.locked
		var la: float = 0.55 if still and not objk and not on else 1.0
		if on:
			ci.draw_rect(Rect2(x, y, bw, bh), ink)
		elif objk:
			ci.draw_rect(Rect2(x, y, bw, bh), Color(paper, 0.92))
			ci.draw_rect(Rect2(x + 0.5, y + 0.5, bw - 1, bh - 1), KD.KIN, false, 1.5)
		else:
			ci.draw_rect(Rect2(x, y, bw, bh), Color(paper, (0.4 if lock else 0.88) * la))
			ci.draw_rect(Rect2(x + 0.5, y + 0.5, bw - 1, bh - 1), Color(ink, 0.35 * la), false, 1)
		var eat: int = int(e.get("eat", 0))
		var keep: String = line.substr(0, line.length() - eat)
		var tail: String = line.substr(line.length() - eat)
		var done: int = String(e.typed).length()
		var a = keep.substr(0, done)
		var b = keep.substr(done)
		txt(ci, MF, e.x - w / 2, y + 3, a, fs, KD.SHU)
		var fg = paper if on else ink
		var bc: Color = KD.KIN if e.gift else ((KD.AIN if night > 0.5 else KD.AI) if objk and not on else fg)
		txt(ci, MF, e.x - w / 2 + tw(MF, a, fs), y + 3, b, fs, Color(bc, (0.4 if lock else 1.0) * la))
		if eat > 0:
			# 仲間が壊した末尾: 半透明で、ひびの線が入る
			var tx0: float = e.x - w / 2 + tw(MF, keep, fs)
			var aic: Color = KD.AIN if night > 0.5 else KD.AI
			txt(ci, MF, tx0, y + 3, tail, fs, Color(aic, 0.28))
			var tw2 = tw(MF, tail, fs)
			ci.draw_line(Vector2(tx0 - 1, y + bh * 0.62), Vector2(tx0 + tw2 * 0.45, y + bh * 0.38), Color(aic, 0.75), 1.5)
			ci.draw_line(Vector2(tx0 + tw2 * 0.45, y + bh * 0.38), Vector2(tx0 + tw2 + 1, y + bh * 0.55), Color(aic, 0.75), 1.5)

## ひび: 仲間の攻撃がどれだけ溜まったかを、字の上に朱の割れ目で見せる（7で崩れる）
func _draw_crack(ci: CanvasItem, e: Dictionary) -> void:
	var n = int(min(6, ceil(e.crack / 7.0 * 6)))
	var R: float = e.size * 0.5
	var seed: int = e.id
	for i in n:
		var a = fmod(seed * 2.399 + i * 2.1, TAU)
		var p = Vector2(e.x, e.y) + Vector2(cos(a), sin(a)) * R * 0.1
		var line = PackedVector2Array([p])
		for j in range(1, 4):
			a += sin(seed + i * 3 + j) * 0.6
			p += Vector2(cos(a), sin(a)) * R * 0.3
			line.append(p)
		ci.draw_polyline(line, Color(KD.SHU, 0.85), max(1.5, 2.2 * SF), true)

# ---------- 画面に固定: 漢詩の帯・閃光・被弾 ----------
func _draw_screen_fx(ci: CanvasItem) -> void:
	var playing = state == "play" or state == "paused" or state == "levelup" or state == "choosing" or state == "dying"
	if playing:
		_draw_field_marks(ci)
	if boss != null and playing:
		_draw_dark(ci)
		_draw_arena(ci)
		_draw_poem_band(ci)
	if flash > 0:
		ci.draw_rect(Rect2(0, 0, W, H), Color(flash_col, min(0.8, flash)))
	if red_v > 0:
		for i in 8:
			var f = i / 8.0
			var m = f * 60.0
			ci.draw_rect(Rect2(m, m, W - m * 2, H - m * 2), Color(KD.SHU, red_v * 0.06 * (1 - f)), false, 60.0 / 8 + 1)

## 画面の外の名所への道しるべと、群れの来る方角
func _draw_field_marks(ci: CanvasItem) -> void:
	var C = Vector2(W / 2, H / 2)
	var aic = KD.AIN if night > 0.5 else KD.AI
	if boss == null:
		# 近い名所を3つまで（HUD と重ならない内側に）
		var cand = []
		for e in E:
			if not e.alive or e.get("obj", "") == "" or e.get("rest", 0.0) > 0 or on_view(e.x, e.y, -10):
				continue
			var dl = Vector2(e.x - cam.x, e.y - cam.y).length()
			if dl < max(W, H) * 1.5:
				cand.append([dl, e])
		cand.sort_custom(func(x, y): return x[0] < y[0])
		for ce in cand.slice(0, 3):
			var e: Dictionary = ce[1]
			var d = Vector2(e.x - cam.x, e.y - cam.y)
			var u = d.normalized()
			var k: float = min((W / 2 - 40) / max(0.001, abs(u.x)), (H / 2 - 40) / max(0.001, abs(u.y)))
			var p = C + u * k
			p.x = clamp(p.x, 30, W - 96)
			p.y = clamp(p.y, 104, H - 100)
			ci.draw_circle(p, 17, Color(paper_col(), 0.9))
			ci.draw_arc(p, 17, 0, TAU, 32, Color(KD.KIN, 0.9), 2, true)
			glyph(ci, e.ch, p + Vector2(0, -1), 19, aic)
			var tip = p + u * 27
			ci.draw_colored_polygon(PackedVector2Array([tip, p + u * 20 + Vector2(-u.y, u.x) * 6, p + u * 20 - Vector2(-u.y, u.x) * 6]), Color(KD.KIN, 0.9))
	if boss == null and not wave.is_empty() and (wave_name() == "群" or wave.warned):
		var u2 = Vector2.from_angle(wave.dir)
		var k2: float = min((W / 2 - 46) / max(0.001, abs(u2.x)), (H / 2 - 46) / max(0.001, abs(u2.y)))
		var p2 = C + u2 * k2
		var pul = 0.6 + 0.4 * sin(ui_time * 10)
		var n2 = Vector2(-u2.y, u2.x)
		for i in 3:
			var q = p2 - u2 * (i * 14) + u2 * 8
			ci.draw_polyline(PackedVector2Array([q - u2 * 10 + n2 * 12, q, q - u2 * 10 - n2 * 12]), Color(KD.SHU, pul * (1 - i * 0.25)), 4, true)
		glyph(ci, dir_name(wave.dir)[0], p2 - u2 * 52, 20, Color(KD.SHU, 0.9))

## 決戦の闇: 主人公のまわりだけが灯り、外は闇に沈む（字が読める濃さまで）
func _draw_dark(ci: CanvasItem) -> void:
	var a: float = clamp(reveal, 0.0, 1.0) * (0.7 if calm else 1.0)
	var hp0 = Vector2(hero.x - cam.x + W / 2, hero.y - cam.y + H / 2)
	var R: float = max(W, H) * 1.25
	ci.draw_texture_rect(tex_dark, Rect2(hp0.x - R, hp0.y - R, R * 2, R * 2), false, Color(1, 1, 1, a))

## 決戦の結界: 画面の縁に金の線と朱の角
func _draw_arena(ci: CanvasItem) -> void:
	var lay = poem_layout()
	var a: float = clamp(reveal, 0.0, 1.0)
	var r = Rect2(10, lay.bottom + 4, W - 20, H - lay.bottom - 14)
	ci.draw_rect(r, Color(KD.KIN, 0.35 * a), false, 1.5)
	ci.draw_rect(r.grow(-5), Color(KD.KIN, 0.18 * a), false, 1.0)
	var L0 = 30.0
	for c in [r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]:
		var sx = 1.0 if c.x < W / 2 else -1.0
		var sy = 1.0 if c.y < H / 2 else -1.0
		ci.draw_polyline(PackedVector2Array([c + Vector2(0, L0 * sy), c, c + Vector2(L0 * sx, 0)]), Color(KD.SHU, 0.85 * a), 4)

func _draw_scenery(ci: CanvasItem) -> void:
	if boss != null and state != "title" and state != "over":
		_draw_poem_scenery(ci)

func _draw_poem_scenery(ci: CanvasItem) -> void:
	var f: String = boss.fx
	var t: float = boss.fx_t
	var a: float = min(1.0, t / 1.2)
	if calm:
		a *= 0.6
	match f:
		"moon":
			var r: float = min(W, H) * 0.2
			var c = Vector2(W * 0.18, H * 0.3 - (1 - a) * 80)
			glow(ci, c, r * 2.6, Color(0.94, 0.92, 0.82, 0.35 * a))
			ci.draw_circle(c, r * 0.55, Color(0.96, 0.94, 0.84, 0.92 * a))
			glow(ci, c + Vector2(r * 0.12, -r * 0.05), r * 0.5, Color(0.85, 0.82, 0.7, 0.25 * a))
		"frost":
			for i in 40:
				var x = fmod(i * 97.3, W)
				var y = H * 0.55 + fmod(i * 53.1, H * 0.45)
				ci.draw_line(Vector2(x - 6, y), Vector2(x + 6, y), Color(0.85, 0.92, 1, 0.25 * a), 1)
				ci.draw_line(Vector2(x, y - 6), Vector2(x, y + 6), Color(0.85, 0.92, 1, 0.25 * a), 1)
		"home":
			glow(ci, Vector2(W / 2, H * 0.95), H * 0.8, Color(0.82, 0.47, 0.2, 0.35 * a))
		"sunset":
			var r2: float = min(W, H) * 0.35
			var y2 = H * 0.8 + t * 10
			ci.draw_circle(Vector2(W * 0.5, y2), r2, Color(0.86, 0.43, 0.16, 0.6 * a))
			var poly = PackedVector2Array([Vector2(0, H)])
			for i in 9:
				var x2 = W * i / 8.0
				poly.append(Vector2(x2, H * 0.8 - abs(sin(x2 * 0.01)) * H * 0.12 * a))
			poly.append(Vector2(W, H))
			ci.draw_colored_polygon(poly, KD.YORU)
		"river":
			for i in 6:
				var pts = PackedVector2Array()
				for x3 in range(0, int(W) + 20, 20):
					pts.append(Vector2(x3, H * 0.62 + i * 18 + sin(x3 * 0.012 + t * 3 + i) * 12))
				ci.draw_polyline(pts, Color(KD.KIN, 0.22 * a), 8, true)
		"far":
			for i in 36:
				var an = i / 36.0 * TAU
				var r0 = 60 + fmod(t * 200 + i * 40, 400)
				ci.draw_line(Vector2(W / 2, H / 2) + Vector2(cos(an), sin(an)) * r0, Vector2(W / 2, H / 2) + Vector2(cos(an), sin(an)) * (r0 + 60), Color(KD.WASHI, 0.12 * a), 2)
		"climb":
			for i in 10:
				var y4 = H - fmod(t * 120 + i * H / 10, H)
				ci.draw_line(Vector2(W * 0.1, y4), Vector2(W * 0.9, y4), Color(KD.KIN, 0.18 * a), 3)
		"mist":
			for i in 10:
				ci.draw_rect(Rect2(0, H * (0.4 + i * 0.06), W, H * 0.06), Color(0.55, 0.31, 0.67, 0.05 * i / 10.0 * a * 4))
		"fall":
			for i in 60:
				var x5 = W * 0.3 + fmod(i * 37, W * 0.4)
				var y5 = fmod(t * 600 + i * 71, H)
				ci.draw_line(Vector2(x5, y5), Vector2(x5, y5 + 40), Color(0.78, 0.86, 1, 0.35 * a), 2)
		"galaxy":
			for i in 140:
				var x6 = fmod(i * 131 + t * 40, W)
				var y6 = H * 0.1 + fmod(i * 67, H * 0.8) + sin(i + t) * 10
				ci.draw_rect(Rect2(x6, y6, 2, 2), Color(KD.WASHI, (0.3 + (i % 5) / 8.0) * a))

func _draw_poem_band(ci: CanvasItem) -> void:
	var lay = poem_layout()
	var b: Dictionary = boss
	var top: float = lay.top - 10
	var hh: float = lay.bottom - lay.top + 22
	vgrad(ci, Rect2(0, top, W, hh * 0.85), Color(KD.YORU, 0.82), Color(KD.YORU, 0.74))
	vgrad(ci, Rect2(0, top + hh * 0.85, W, hh * 0.45), Color(KD.YORU, 0.74), Color(KD.YORU, 0.0))
	ci.draw_line(Vector2(W * 0.1, top), Vector2(W * 0.9, top), Color(KD.KIN, 0.5), 1)
	for i in 30:
		var x = fmod(i * 173.7 + ui_time * (8 + i % 5), W)
		var y: float = top + fmod(i * 37.3, hh)
		ci.draw_rect(Rect2(x, y, 2, 2), Color(KD.KIN, 0.25 + 0.25 * sin(ui_time * 2 + i)))
	var nl: int = b.poem.lines.size()
	var hi: int = min(b.li + 2, nl)
	txt(ci, UF, W / 2, lay.top - 2, "漢詩「%s」%s　第%s・%s句 / %s句　— 怪物の下の英訳を打つ" % [b.poem.title, b.poem.author, KD.kn(b.li + 1), KD.kn(hi), KD.kn(nl)], 13 * max(0.85, SF), Color(KD.WASHI, 0.65), 1)
	var ln: String = b.zh
	var rev: float = reveal if boss_intro > 0 else min(1.0, b.line_t / 0.9 + 0.2)
	for j in ln.length():
		var appear: float = clamp(rev * (ln.length() + 2) - j, 0.0, 1.0)
		if appear <= 0:
			continue
		var c = Vector2(lay.x0 + j * lay.P, lay.y + sin(b.t * 2 + j) * 1.2)
		var s: float = lay.P * 0.88
		var col = KD.SUMI.lerp(KD.KIN, appear)
		glyph(ci, ln[j], c, s, Color(col, appear), Color(KD.KIN, 0.2 * appear), s * 0.12)

## 怪物の下の札: 二句の英訳を二行で。打った分は朱
func _draw_boss_label(ci: CanvasItem) -> void:
	var b: Dictionary = boss
	if boss_intro > 0 or not b.alive:
		return
	var fs: float = 15.0 * max(0.85, SF)
	var rows: Array = b.rows
	var wmax = 0.0
	for r in rows:
		wmax = max(wmax, tw(MF, r, fs))
	var lh: float = fs + 6
	var bw: float = wmax + 20
	var bh: float = lh * rows.size() + 8
	var x0: float = b.x - bw / 2
	var y0: float = b.y + b.ms * 0.95
	var lock: bool = b.locked
	ci.draw_rect(Rect2(x0, y0, bw, bh), Color(KD.YORU, 0.9 if not lock else 0.5))
	ci.draw_rect(Rect2(x0, y0, bw, bh), Color(KD.KIN, 0.9), false, 2)
	var n = String(b.typed).length()
	var yy = y0 + 4
	for r in rows:
		var xx: float = b.x - tw(MF, r, fs) / 2
		for ch in String(r):
			var is_l = ch >= "a" and ch <= "z"
			var c2 = KD.SHU if (is_l and n > 0) else KD.WASHI
			txt(ci, MF, xx, yy, ch, fs, Color(c2, 0.5 if lock else 1.0))
			xx += tw(MF, ch, fs)
			if is_l and n > 0:
				n -= 1
		yy += lh

# ---------- 画面（HUD・見出し・各画面） ----------
func button(ci: CanvasItem, r: Rect2, label: String, fn: Callable, style := "main", on := false) -> void:
	var idx = buttons.size()
	buttons.append([r, fn])
	var hov = hover_btn == idx
	var night_ui = night > 0.5 and (state == "play" or state == "paused" or state == "levelup")
	var fg = KD.WASHI if night_ui else KD.SUMI
	match style:
		"main":
			var o = Vector2(-2, -2) if hov else Vector2.ZERO
			ci.draw_rect(Rect2(r.position + Vector2(5, 5), r.size), KD.SHU)
			ci.draw_rect(Rect2(r.position + o, r.size), KD.SUMI)
			txt(ci, DF, r.get_center().x + o.x, r.position.y + o.y + (r.size.y - 22) / 2 - 2, label, 20, KD.WASHI, 1)
		"ghost":
			ci.draw_rect(r, Color(KD.SUMI, 0.08 if hov else 0.0))
			ci.draw_rect(r, KD.SUMI, false, 2.5)
			txt(ci, UF, r.get_center().x, r.position.y + (r.size.y - 16) / 2 - 2, label, 15, KD.SUMI, 1)
		"hud":
			if on:
				ci.draw_rect(r, KD.SHU)
			elif hov:
				ci.draw_rect(r, Color(fg, 0.1))
			ci.draw_rect(r, KD.SHU if on else fg, false, 2)
			txt(ci, UF, r.get_center().x, r.position.y + (r.size.y - 15) / 2 - 2, label, 14, KD.WASHI if on else fg, 1)

func _draw_ui(ci: CanvasItem) -> void:
	buttons.clear()
	if state == "boot":
		ci.draw_rect(Rect2(0, 0, W, H), KD.WASHI)
		txt(ci, UF, W / 2, H / 2 - 10, "墨を磨っています…", 18, KD.SUMI, 1)
		return
	if state == "title":
		_draw_title(ci)
		return
	if state != "over":
		_draw_hud(ci)
	if state == "levelup" or state == "choosing":
		_draw_fuse(ci)
	if state == "fusion":
		_draw_cine(ci)
	if state == "paused":
		_draw_pause(ci)
	if state == "over":
		_draw_over(ci)
	if banner != null:
		_draw_banner(ci)

func _draw_hud(ci: CanvasItem) -> void:
	var nui = night > 0.5
	var fg = KD.WASHI if nui else KD.SUMI
	var S: float = clamp(W / 1280.0, 0.75, 1.0)
	# 生存時間
	txt(ci, MF, 16, 10, KD.fmt_t(time), 30 * S, fg)
	txt(ci, UF, 16, 10 + 38 * S, "生存 TIME", 11, Color(fg, 0.65))
	# 段位と墨の量
	var bx: float = W * 0.27
	var bw: float = min(420.0, W * 0.33)
	txt(ci, UF, bx, 16, "段位", 11, Color(fg, 0.65))
	txt(ci, DF, bx + 34, 6, KD.kn(level), 22, KD.SHU)
	txt(ci, UF, bx + 34 + tw(DF, KD.kn(level), 22) + 10, 16, "撃破 %d" % kills, 11, Color(fg, 0.65))
	ci.draw_rect(Rect2(bx, 42, bw, 8), Color(fg, 0.12))
	ci.draw_rect(Rect2(bx, 42, bw * clamp(xp / need(), 0, 1), 8), KD.KIN if nui else KD.SUMI)
	# 今の波（静・増・群・凪）
	if boss == null and not wave.is_empty():
		var wv: Array = WAVES[int(wave.i)]
		var wc: Color = KD.SHU if wv[0] == "群" else (KD.AIN if nui else KD.AI)
		glyph(ci, wv[0], Vector2(bx + 9, 66), 17, wc)
		txt(ci, MF, bx + 24, 59, wv[1], 10, Color(fg, 0.6))
		var wf: float = clamp(wave.t / max(1.0, float(wv[2])), 0.0, 1.0)
		ci.draw_rect(Rect2(bx + 84, 64, 60, 3), Color(fg, 0.12))
		ci.draw_rect(Rect2(bx + 84, 64, 60 * wf, 3), wc)
	# 右上のボタン
	var x = W - 16
	var specs = [["一時停止", toggle_pause, false, 84], ["やり直す", restart, false, 76], ["音" if sfx.on else "無", func(): sfx.on = not sfx.on, false, 36], ["自", func(): set_auto(not auto_on), auto_on, 36]]
	for sp in specs:
		x -= sp[3]
		button(ci, Rect2(x, 12, sp[3], 36), sp[0], sp[1], "hud", sp[2])
		x -= 10
	if auto_on:
		var at = "自動戦闘中 — 三択を読んでいます…" if state == "levelup" else "自動戦闘中 — F6 か「自」で手動に戻す"
		var w = tw(UF, at, 12) + 24
		var ay = 62.0 if boss == null else poem_layout().bottom + 14
		ci.draw_rect(Rect2(W / 2 - w / 2, ay, w, 24), KD.SHU)
		txt(ci, UF, W / 2, ay + 4, at, 12, KD.WASHI, 1)
	# 連撃（縦書き）
	if combo >= 2:
		var cs = KD.kn(combo) + "連撃"
		var size: float = clamp(W * 0.032, 24, 40)
		var y = 76.0
		for c in cs:
			glyph(ci, c, Vector2(W - 34, y + size * 0.5), size, KD.SHU, Color(fg, 0.15), 4)
			y += size * 0.95
		txt(ci, MF, W - 34, y + 4, "%d COMBO" % combo, 11, fg, 1)
	# 主人公の字と命
	var my = H - 70
	hero_glyph(ci, Vector2(44, my + 18), 54, KD.SHU, {"lw": 3.0})
	var tag = ("象形文字の「%s」　%s" % [form, KD.OR_EN.get(form, "")]) if path.size() == 1 else ("「%s」　%s" % [form, KD.EVO.get(form, {}).get("en", "")])
	txt(ci, UF, 82, my - 4, tag, 12, fg)
	var hx = 82.0
	for i in max_hp:
		var lost = i >= hp
		if lost:
			glyph(ci, "命", Vector2(hx + 11, my + 30), 22, Color(fg, 0.0), Color(fg, 0.45), 2)
		else:
			glyph(ci, "命", Vector2(hx + 11, my + 30), 22, KD.SHU)
		hx += 25
	# 手に入れた字
	var ax = W - 16
	var ids = owned.keys()
	ids.reverse()
	for id in ids:
		ax -= 42
		var r = Rect2(ax, H - 62, 40, 46)
		var inh = absorbed.has(id)
		ci.draw_rect(r, KD.SUMI if inh else Color(KD.YORU if nui else KD.WASHI, 0.85))
		ci.draw_rect(r, KD.KIN if inh else fg, false, 2)
		glyph(ci, id, r.get_center() + Vector2(0, -6), 22, KD.KIN if inh else fg)
		txt(ci, UF, r.get_center().x, r.position.y + 32, ("継%d" % L(id)) if inh else "●".repeat(L(id)), 8, KD.SHU, 1)
		ax -= 6
	if hint_t > 0 and hint_text != "":
		txt(ci, UF, W / 2, H - 110, hint_text, 13, Color(fg, 0.75 * min(1.0, hint_t)), 1)

func _draw_banner(ci: CanvasItem) -> void:
	var b: Dictionary = banner
	var t: float = b.t
	var k = 0.0
	if t < 0.18:
		k = -(1 - t / 0.18)
	elif t > 1.15:
		k = (t - 1.15) / 0.35
	var a: float = clamp(1 - abs(k) * 1.2, 0, 1)
	var dx: float = k * W * 0.6
	var small: bool = b.small
	var fs = 22.0 if small else 28.0
	var y = H - 170
	var bw = tw(DF, b.big, fs) + fs * 1.6
	var bh = fs * 1.55
	var x = W / 2 - bw / 2 + dx
	var band_col = KD.YORU if b.god else KD.SHU
	ci.draw_texture_rect(tex_band, Rect2(x + 8, y + 8, bw, bh), false, Color(KD.SUMI, 0.5 * a))
	ci.draw_texture_rect(tex_band, Rect2(x, y, bw, bh), false, Color(band_col, a))
	var tc = KD.KIN if b.god else KD.WASHI
	txt(ci, DF, W / 2 + dx, y + bh * 0.5 - fs * 0.62, b.big, fs, Color(tc, a), 1)
	var sw = tw(MF, b.sub, 13) + 24
	ci.draw_rect(Rect2(W / 2 - sw / 2 - dx * 0.3, y + bh + 6, sw, 24), Color(KD.SUMI, a))
	txt(ci, MF, W / 2 - dx * 0.3, y + bh + 10, b.sub, 13, Color(KD.WASHI, a), 1)

# ---------- タイトル ----------
func _draw_title(ci: CanvasItem) -> void:
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.72))
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.7, 1.15)
	var x0: float = max(24.0, (W - 1080 * S) / 2)
	var y = 30.0 * S
	txt(ci, UF, x0, y, "文字の反乱を、文字で制する。", 13 * S, KD.SHU)
	y += 28 * S
	var ls = 96 * S
	ci.draw_rect(Rect2(x0, y, ls * 1.1, ls * 1.1), KD.SUMI)
	txt(ci, DF, x0 + ls * 0.55, y + ls * 0.02, "漢", ls * 0.9, KD.WASHI, 1)
	ci.draw_rect(Rect2(x0 + ls * 1.2, y, ls * 1.1, ls * 1.1), KD.SHU)
	txt(ci, DF, x0 + ls * 1.75, y + ls * 0.02, "字", ls * 0.9, KD.WASHI, 1)
	txt(ci, DF, x0 + ls * 2.45, y + ls * 0.02, "SURVIVOR", ls * 0.9, KD.SUMI)
	y += ls * 1.1 + 18 * S
	var lede = "原稿用紙の上で、すべての漢字が生き物になった。犬は駆け、蛇はうねり、火は揺らめき、木は風にしなる。字の下の英単語を打ち切ると、主人公がその字へ突っ込んで斬る。一撃ごとに字の部品がはがれて別の字になり（森→林→木）、最後の部品を崩すと消える。手に入れた字と組み合わさると、主人公はその場で漢字へ進化する（人＋木＝休）。ヒロインの「魚」は、やがて降りてくる巨大な漢詩に囚われている。"
	y += wrap_text(ci, UF, x0, y, lede, min(W - x0 * 2, 820 * S), 14 * S, KD.SUMI) + 14 * S
	txt(ci, UF, x0, y, "主人公", 12 * S, KD.SUMI)
	txt(ci, UF, x0 + 56 * S, y, "英単語を打つか、クリックで選ぶ", 12 * S, Color(KD.SUMI, 0.7))
	y += 26 * S
	var n = title_cards.size()
	var gap = 10.0 * S
	var cw: float = min(176 * S, (W - x0 * 2 - gap * (n - 1)) / n)
	var ch = 188.0 * S
	for i in n:
		var t: Dictionary = title_cards[i]
		var r = Rect2(x0 + i * (cw + gap), y, cw, ch)
		var sel: bool = t.h.ch == hero_def.ch
		var h: Dictionary = t.h
		var ok: bool = t.ok
		if ok:
			buttons.append([r, func(): select_hero(h)])
		if sel:
			ci.draw_rect(Rect2(r.position + Vector2(5, 5), r.size), KD.SHU)
			ci.draw_rect(r, KD.SUMI)
		else:
			ci.draw_rect(r, KD.WASHI)
			if ok:
				ci.draw_rect(r, KD.SUMI, false, 2.5)
			else:
				_dash_rect(ci, r, Color(KD.SUMI, 0.55))
		var fg = KD.WASHI if sel else (KD.SUMI if ok else Color(KD.SUMI, 0.5))
		Oracle.draw(ci, h.ch, r.position + Vector2(34 * S, 40 * S), 54 * S, KD.SHU if ok else Color(0.54, 0.51, 0.47), {"lw": 3.0, "glow": 0.6 if sel else 0.0, "wob": 0.2 if sel else 0.0, "t": ui_time * 2})
		if ok:
			var d: int = String(t.typed).length()
			txt(ci, MF, r.position.x + 12 * S, r.position.y + 76 * S, String(h.en).substr(0, d), 15 * S, KD.SHU)
			txt(ci, MF, r.position.x + 12 * S + tw(MF, String(h.en).substr(0, d), 15 * S), r.position.y + 76 * S, String(h.en).substr(d), 15 * S, fg)
		var dh = wrap_text(ci, UF, r.position.x + 12 * S, r.position.y + 100 * S, h.d, cw - 24 * S, 11 * S, fg, 4)
		if not ok:
			wrap_text(ci, UF, r.position.x + 12 * S, r.position.y + 104 * S + dh, "鍵 — " + h.lock.t, cw - 24 * S, 10 * S, KD.SHU, 2)
	y += ch + 20 * S
	txt(ci, UF, x0, y + 8 * S, "画面の動き", 12 * S, KD.SUMI)
	var sx = x0 + 80 * S
	for opt in [["標準", false], ["酔いにくい", true]]:
		var w2 = tw(UF, opt[0], 13 * S) + 24 * S
		var r2 = Rect2(sx, y, w2, 32 * S)
		var on: bool = calm == opt[1]
		var v: bool = opt[1]
		buttons.append([r2, _set_calm.bind(v)])
		ci.draw_rect(r2, KD.SUMI if on else KD.WASHI)
		ci.draw_rect(r2, KD.SUMI, false, 2)
		txt(ci, UF, r2.get_center().x, y + 7 * S, opt[0], 13 * S, KD.WASHI if on else KD.SUMI, 1)
		sx += w2
	txt(ci, UF, sx + 16 * S, y + 8 * S, "日本語入力がオンのままでも、キーはそのまま英字として読み取ります", 12 * S, Color(KD.SUMI, 0.75))
	y += 52 * S
	button(ci, Rect2(x0, y, 150 * S, 52 * S), "始める", _watch if watch_mode else start)
	button(ci, Rect2(x0 + 176 * S, y + 4 * S, 170 * S, 44 * S), "自動戦闘で観る", _watch, "ghost")
	if watch_mode:
		var wt = "自動戦闘で観る — 主人公を選んで「始める」か Enter"
		var ww = tw(UF, wt, 13 * S) + 28 * S
		ci.draw_rect(Rect2(x0 + 368 * S, y + 10 * S, ww, 30 * S), KD.SHU)
		txt(ci, UF, x0 + 382 * S, y + 16 * S, wt, 13 * S, KD.WASHI)
	else:
		txt(ci, UF, x0 + 368 * S, y + 16 * S, "Enter で開始　｜　最高記録 " + (KD.fmt_t(meta.best) if float(meta.get("best", 0)) > 0 else "—"), 12 * S, KD.SUMI)
	y += 70 * S
	wrap_text(ci, UF, x0, y, "甲骨文字形: oracle-bone-jgw-1203 — Qing-sheng Li & Yu-lin Bian, github.com/aylqs2025/oracle-bone-jgw-1203, CC BY 4.0（線データを描画用に変形）。フォント: Zen Old Mincho / Zen Kaku Gothic New / Dela Gothic One / JetBrains Mono / Noto Serif（SIL OFL）。プロトタイプ。", min(W - x0 * 2, 900 * S), 10 * S, Color(KD.SUMI, 0.6))

func _dash_rect(ci: CanvasItem, r: Rect2, col: Color) -> void:
	var seg = 8.0
	var pts = [r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y), r.position]
	for i in 4:
		var a: Vector2 = pts[i]
		var b: Vector2 = pts[i + 1]
		var l = a.distance_to(b)
		var k = 0.0
		while k < l:
			ci.draw_line(a.lerp(b, k / l), a.lerp(b, min(l, k + seg * 0.6) / l), col, 2.5)
			k += seg

func _set_calm(v: bool) -> void:
	calm = v
	save_meta()

func _watch() -> void:
	start()
	set_auto(true)

func _hero_card(ci: CanvasItem, r: Rect2, S: float) -> void:
	ci.draw_rect(Rect2(r.position + Vector2(7, 7), r.size), KD.SUMI)
	ci.draw_rect(r, KD.WASHI)
	ci.draw_rect(r, KD.SHU, false, 4)
	txt(ci, UF, r.get_center().x, r.position.y + 14 * S, "いまの字", 12 * S, KD.SHU, 1)
	hero_glyph(ci, Vector2(r.get_center().x, r.position.y + 106 * S), 120 * S, KD.SHU, {"lw": 3.2, "wob": 0.2, "t": ui_time * 2})
	var pic = path.size() == 1
	var meaning = String(KD.OR_EN.get(form, "")) if pic else String(KD.EVO.get(form, {}).get("en", KD.EN.get(form, "")))
	txt(ci, MF, r.get_center().x, r.position.y + 178 * S, meaning, 20 * S, KD.SUMI, 1)
	var abil: String = KD.D.ABIL.get(form, "まっすぐ突っ込んで、字の部品を1つ崩す" if pic else "")
	if pic:
		abil = "象形文字の「%s」　%s" % [form, abil]
	var hh = wrap_text(ci, UF, r.position.x + 16 * S, r.position.y + 210 * S, abil, r.size.x - 32 * S, 13 * S, KD.SUMI, 4)
	if path.size() > 1:
		var chain = " → ".join(path.map(func(q): return String(q).split("|")[1] if String(q).contains("|") else q))
		wrap_text(ci, GF, r.position.x + 16 * S, r.position.y + 218 * S + hh, chain, r.size.x - 32 * S, 15 * S, Color(KD.SUMI, 0.7), 2)

# ---------- 合体（三択） ----------
func _draw_fuse(ci: CanvasItem) -> void:
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.8))
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.7, 1.1)
	var x0: float = max(24.0, (W - 1100 * S) / 2)
	var y0 = 70.0 * S
	txt(ci, DF, x0, y0 - 14 * S, "合体", 54 * S, KD.SHU)
	txt(ci, MF, x0 + 130 * S, y0 + 14 * S, "F U S E", 13 * S, KD.SUMI)
	txt(ci, UF, x0 + 220 * S, y0 + 12 * S, "いまの字に合わせる素材を一つ選ぶ — 英単語を打ち切る。朱の枠は進化素材", 13 * S, KD.SUMI)
	var top = y0 + 70 * S
	var me = Rect2(x0, top + 70 * S, 290 * S, 300 * S)
	_hero_card(ci, me, S)
	txt(ci, DF, x0 + 330 * S, me.get_center().y - 40 * S, "＋", 64 * S, KD.SHU, 1)
	var cx = x0 + 380 * S
	var cw = x0 + 1100 * S - cx
	var chh = 162.0 * S
	for p in cards:
		var r = Rect2(cx, top + p.i * (chh + 14 * S), cw, chh)
		var info = card_info(p)
		var hl: bool = info.evo or info.part
		var on: bool = p.typed != ""
		var chosen: bool = state == "choosing" and choose_card == p
		var lift = Vector2(0, -3) if on else Vector2.ZERO
		if hl or on:
			ci.draw_rect(Rect2(r.position + Vector2(6, 6) + lift, r.size), KD.SHU)
		var bgc = KD.WASHI
		if chosen:
			bgc = KD.WASHI.lerp(KD.SHU, clamp(1 - choose_t / 0.45, 0, 1))
		ci.draw_rect(Rect2(r.position + lift, r.size), bgc)
		ci.draw_rect(Rect2(r.position + lift, r.size), KD.SHU if hl else KD.SUMI, false, 4 if hl else 3)
		var pos = r.position + lift
		var fgc = KD.WASHI if chosen and choose_t < 0.2 else KD.SUMI
		glyph(ci, p.id, pos + Vector2(56 * S, 58 * S), 76 * S, fgc)
		var d: int = String(p.typed).length()
		txt(ci, MF, pos.x + 112 * S, pos.y + 16 * S, String(p.en).substr(0, d), 24 * S, KD.SHU)
		txt(ci, MF, pos.x + 112 * S + tw(MF, String(p.en).substr(0, d), 24 * S), pos.y + 16 * S, String(p.en).substr(d), 24 * S, fgc)
		txt(ci, UF, pos.x + 112 * S, pos.y + 54 * S, "素材" + ("　%d枚目" % (info.n + 1) if info.n else ""), 12 * S, KD.SHU)
		if hl:
			var badge = "進化素材" if info.evo else "合体素材"
			var bw = tw(DF, badge, 12 * S) + 16 * S
			ci.draw_rect(Rect2(pos.x + r.size.x - bw - 12 * S, pos.y + 12 * S, bw, 22 * S), KD.SHU)
			txt(ci, DF, pos.x + r.size.x - bw / 2 - 12 * S, pos.y + 14 * S, badge, 12 * S, KD.WASHI, 1)
		ci.draw_line(pos + Vector2(16 * S, 100 * S), pos + Vector2(r.size.x - 16 * S, 100 * S), Color(KD.SUMI, 0.25), 1)
		var yy = pos.y + 104 * S
		var dx = pos.x + 16 * S
		if info.evo_txt != "":
			var et = String(info.evo_txt).split("\n")[0]
			txt(ci, GF, dx, yy, et, 18 * S, KD.SHU)
			dx += tw(GF, et, 18 * S) + 16 * S
		var lines = String(info.desc).split("\n")
		var ly = yy + 2 * S
		for li in lines.size():
			var col = KD.SUMI if li == 0 else KD.SHU
			ly += wrap_text(ci, UF, dx, ly, lines[li], pos.x + r.size.x - 16 * S - dx, 12 * S, col, 2) + 2 * S
		if chosen:
			var k: float = clamp(1 - choose_t / 0.45, 0, 1)
			var sz = 90 * S * (1.6 - 0.6 * min(1.0, k * 2))
			var c = pos + Vector2(r.size.x - 70 * S, r.size.y / 2)
			ci.draw_set_transform(c, -0.15, Vector2.ONE)
			ci.draw_texture_rect(tex_seal, Rect2(-sz / 2, -sz / 2, sz, sz), false, Color(KD.SHU, min(1.0, k * 3)))
			ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
			glyph(ci, "合", c, sz * 0.6, Color(KD.WASHI, min(1.0, k * 3)), Color.TRANSPARENT, 0, -0.15)

# ---------- 合体の演出 ----------
func _draw_cine(ci: CanvasItem) -> void:
	var c: Dictionary = cine
	var k: float = min(1.0, c.t / 1.5)
	ci.draw_rect(Rect2(0, 0, W, H), KD.YORU)
	# 墨の渦と金の粉
	for i in 70:
		var an = i * 2.399 + c.t * (0.6 + (i % 7) * 0.08)
		var rr: float = (90 + fmod(i * 37.0, 420)) * (1.1 - min(1.0, k) * 0.5)
		var p = Vector2(W / 2, H * 0.42) + Vector2(cos(an), sin(an) * 0.6) * rr
		ci.draw_circle(p, 1.5 + (i % 3), Color(KD.KIN if i % 4 == 0 else KD.WASHI, 0.18 + 0.12 * sin(c.t * 3 + i)))
	var S0: float = min(W, H) * 0.34
	var cx = W / 2
	var cy = H * 0.42
	var m: float = min(1.0, k / 0.5)
	var e = 2 * m * m if m < 0.5 else 1 - pow(-2 * m + 2, 2) / 2
	var heropic: bool = c.pic and KD.JGW.has(c.a)
	if k < 0.62:
		var END = {"pair": [[-0.28, 0, 1, 0], [0.28, 0, 1, 0]], "side": [[-0.2, 0, 1, 0], [0.2, 0, 1, 0]], "follow": [[-0.24, 0.04, 1, 0], [0.2, -0.04, 1, 0]], "back": [[-0.2, 0, 1, 0], [0.2, 0, 1, 0]], "flip": [[-0.22, 0, 1, 0], [0.22, 0, 1, 0]], "multi": [[-0.3, 0, 1, 0], [0.3, 0, 1, 0]]}
		var en: Array = END.get(c.lay, END.pair)
		var ea: Array = en[0]
		var ax = cx + (-0.9 + (ea[0] + 0.9) * e) * S0 * 1.4
		if heropic:
			Oracle.draw(ci, c.a, Vector2(ax, cy + ea[1] * S0), S0, KD.SHU, {"lw": 2.6, "glow": 1.0, "sx": 1 + (ea[2] - 1) * e})
		else:
			glyph(ci, c.a, Vector2(ax, cy + ea[1] * S0), S0 * 0.85, KD.SHU, Color(KD.SHU, 0.25), 18, 0, Vector2(1 + (ea[2] - 1) * e, 1))
		var bs: Array = c.b
		if bs.size() == 1:
			var eb: Array = en[1]
			var bx = cx + (0.9 + (eb[0] - 0.9) * e) * S0 * 1.4
			glyph(ci, bs[0], Vector2(bx, cy + eb[1] * S0), S0 * 0.85, KD.KIN, Color(KD.KIN, 0.25), 18, eb[3] * e, Vector2(1 + (eb[2] - 1) * e, 1))
		else:
			var n = bs.size()
			for i in n:
				var fy = (i - (n - 1) / 2.0) * 0.62
				var ang = float(i) / n * TAU
				var s0 = Vector2(cx + (1.1 + cos(ang) * 0.15) * S0 * 1.4, cy + fy * S0 * 1.7 + sin(ang) * S0 * 0.3)
				var t0 = Vector2(cx + 0.32 * S0 * 1.4, cy + fy * S0 * 0.75)
				var ee: float = clamp((m - i * 0.12) / (1 - 0.12 * (n - 1)), 0, 1)
				var e2 = 2 * ee * ee if ee < 0.5 else 1 - pow(-2 * ee + 2, 2) / 2
				var pp = s0.lerp(t0, e2)
				ci.draw_line(pp, Vector2(ax, cy), Color(KD.KIN, 0.35 * (1 - e2)), 3)
				glyph(ci, bs[i], pp, S0 * 0.52, KD.KIN, Color(KD.KIN, 0.25), 12)
	if k > 0.5 and k < 0.8:
		var f = (k - 0.5) / 0.3
		ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, (1 - f) * 0.85))
		ci.draw_arc(Vector2(cx, cy), S0 * (0.3 + f * 1.6), 0, TAU, 96, Color(KD.KIN, 1 - f), 10 * (1 - f) + 1, true)
		ci.draw_arc(Vector2(cx, cy), S0 * (0.2 + f * 1.1), 0, TAU, 96, Color(KD.SHU, (1 - f) * 0.7), 6 * (1 - f) + 1, true)
	if k >= 0.62:
		var f2: float = min(1.0, (k - 0.62) / 0.2)
		var sc = 1 + (1 - f2) * 1.4
		var rs: String = c.res
		for i in 3:
			glyph(ci, rs, Vector2(cx, cy), S0 * (0.8 if rs.length() > 1 else 1.2) * sc, Color(KD.KIN, 0.0), Color(KD.KIN, 0.10 * f2), 30 + i * 22)
		glyph(ci, rs, Vector2(cx, cy), S0 * (0.8 if rs.length() > 1 else 1.2) * sc, Color(KD.WASHI, f2), Color(KD.KIN, 0.5 * f2), 20)
	# 字幕
	var ca: float = clamp((c.t - 0.6) / 0.5, 0, 1)
	txt(ci, DF, W / 2, H * 0.78, c.cap1, 28, Color(KD.KIN, ca), 1)
	txt(ci, UF, W / 2, H * 0.78 + 46, c.cap2, 14, Color(KD.WASHI, ca), 1)
	# 落款「合」
	if c.t > 1.7:
		var f3: float = min(1.0, (c.t - 1.7) / 0.18)
		var sz = 84 * (1.8 - 0.8 * f3)
		var sp = Vector2(W * 0.5 + 300, H * 0.42 + 120)
		ci.draw_set_transform(sp, -0.12, Vector2.ONE)
		ci.draw_texture_rect(tex_seal, Rect2(-sz / 2, -sz / 2, sz, sz), false, Color(KD.SHU, f3))
		ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
		glyph(ci, "合", sp, sz * 0.62, Color(KD.WASHI, f3), Color.TRANSPARENT, 0, -0.12)

# ---------- 一時停止 ----------
func _draw_pause(ci: CanvasItem) -> void:
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.78))
	var c = Vector2(W / 2, H * 0.36)
	ci.draw_set_transform(c, -0.14, Vector2.ONE)
	ci.draw_texture_rect(tex_seal, Rect2(-50, -50, 100, 100), false, KD.SHU)
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	glyph(ci, "止", c, 64, KD.WASHI, Color.TRANSPARENT, 0, -0.14)
	txt(ci, UF, W / 2, H * 0.36 + 76, "一時停止中", 16, KD.SUMI, 1)
	var bw = 150.0
	var y = H * 0.36 + 120
	button(ci, Rect2(W / 2 - 250, y, bw, 52), "再開する", toggle_pause)
	button(ci, Rect2(W / 2 - 80, y + 4, 170, 44), "最初からやり直す", restart, "ghost")
	button(ci, Rect2(W / 2 + 106, y + 4, 170, 44), "主人公を選び直す", _back_title, "ghost")
	txt(ci, UF, W / 2, y + 78, "Esc で一時停止／再開", 12, KD.SUMI, 1)

# ---------- 結果 ----------
func _draw_over(ci: CanvasItem) -> void:
	var o = over_info
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.86))
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.7, 1.1)
	var x0: float = max(24.0, (W - 900 * S) / 2)
	var y = 40.0 * S
	var sc = Vector2(x0 + 50 * S, y + 50 * S)
	var k: float = min(1.0, over_t / 0.35)
	var ssz = 96 * S * (2.2 - 1.2 * k)
	ci.draw_set_transform(sc, -0.14, Vector2.ONE)
	ci.draw_texture_rect(tex_seal, Rect2(-ssz / 2, -ssz / 2, ssz, ssz), false, Color(KD.SHU, k))
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	glyph(ci, "敗", sc, ssz * 0.62, Color(KD.WASHI, k), Color.TRANSPARENT, 0, -0.14)
	txt(ci, UF, x0 + 120 * S, y + 6 * S, "文字に呑まれた", 12 * S, KD.SHU)
	txt(ci, DF, x0 + 120 * S, y + 26 * S, KD.fmt_t(o.time) + " 生存", 52 * S, KD.SUMI)
	y += 120 * S
	var stats = [[o.kills, "撃破 KILLS"], [o.combo, "最大連撃 COMBO"], [o.wpm, "WPM"], ["%d%%" % o.acc, "正確さ ACC"], [KD.kn(o.level), "段位 LEVEL"], [o.gods, "読み解いた漢詩"]]
	var sw = 900 * S / 6
	for i in 6:
		var x = x0 + i * sw
		ci.draw_line(Vector2(x, y), Vector2(x + sw - 10, y), KD.SUMI, 2)
		txt(ci, MF, x, y + 6 * S, str(stats[i][0]), 28 * S, KD.SUMI)
		txt(ci, UF, x, y + 44 * S, stats[i][1], 11 * S, Color(KD.SUMI, 0.65))
	y += 76 * S
	txt(ci, UF, x0, y, "進化の道すじ", 12 * S, KD.SHU)
	y += 20 * S
	txt(ci, GF, x0, y, o.chain, 30 * S, KD.SUMI)
	y += 46 * S
	if o.fresh.size():
		txt(ci, UF, x0, y, "新しい字が目覚めた：" + "・".join(o.fresh) + "（主人公に選べます）", 14 * S, KD.SHU)
		y += 28 * S
	txt(ci, UF, x0, y, "倒した文字", 12 * S, KD.SHU)
	y += 22 * S
	var keys: Array = o.slain.keys()
	keys.sort_custom(func(a, b): return o.slain[a] > o.slain[b])
	var xx = x0
	var cnt = 0
	for kk in keys:
		if cnt >= 40:
			break
		var w = tw(GF, kk, 22 * S) + 26 * S
		if xx + w > x0 + 900 * S:
			xx = x0
			y += 38 * S
		ci.draw_rect(Rect2(xx, y, w, 32 * S), KD.SUMI, false, 1.5)
		txt(ci, GF, xx + 6 * S, y + 2 * S, kk, 22 * S, KD.SUMI)
		txt(ci, MF, xx + w - 6 * S, y + 2 * S, str(o.slain[kk]), 10 * S, KD.SHU, 2)
		xx += w + 4 * S
		cnt += 1
	y += 50 * S
	ci.draw_rect(Rect2(x0, y, 900 * S, 52 * S), KD.WASHI)
	ci.draw_rect(Rect2(x0, y, 900 * S, 52 * S), KD.SUMI, false, 1.5)
	wrap_text(ci, MF, x0 + 8, y + 6, o.share, 900 * S - 16, 12 * S, KD.SUMI, 3)
	y += 68 * S
	var bx = x0
	button(ci, Rect2(bx, y, 150 * S, 52 * S), "もう一度", start)
	bx += 170 * S
	if unlocked(KD.hero("魚")) and hero_def.ch != "魚":
		button(ci, Rect2(bx, y, 170 * S, 52 * S), "魚で始める", _start_fish)
		bx += 190 * S
	button(ci, Rect2(bx, y + 4 * S, 170 * S, 44 * S), "主人公を選び直す", _back_title, "ghost")
	bx += 186 * S
	button(ci, Rect2(bx, y + 4 * S, 150 * S, 44 * S), "コピーしました" if o.copied else "結果をコピー", _copy_share, "ghost")
	txt(ci, UF, bx + 170 * S, y + 18 * S, "Enter で再挑戦　｜　最高記録 " + KD.fmt_t(meta.best), 12 * S, KD.SUMI)
	over_t += get_process_delta_time()

func _back_title() -> void:
	auto_on = false
	to_title()

func _start_fish() -> void:
	hero_def = KD.hero("魚")
	save_meta()
	start()

func _copy_share() -> void:
	DisplayServer.clipboard_set(over_info.share)
	over_info.copied = true

# ---------- 試験用（コマンドライン: -- --auto --shots=dir --quit=60） ----------
var _shot_t = 0.0
var _shot_n = 0
var _log_t = 0.0
func _test_hook(dt: float) -> void:
	if state == "boot" or not (test_mode.has("quit") or test_mode.has("shots") or test_mode.has("die")):
		return
	_log_t += dt
	if _log_t >= 5.0:
		_log_t = 0.0
		print("[eat=%d brk=%d] " % [dbg_eat, dbg_break], "[t=%.0f] state=%s time=%.1f form=%s path=%s hp=%d kills=%d lv=%d E=%d allies=%s boss=%s" % [ui_time, state, time, form, ",".join(path), hp, kills, level, E.size(), ",".join(ALLY.keys()), str(boss != null)])
	if test_mode.has("die") and state == "play" and time > float(test_mode.die):
		test_mode.erase("die")
		auto_on = false
		hp = 0
		die()
	if test_mode.has("shots"):
		_shot_t += dt
		var every = float(test_mode.get("every", "6"))
		if _shot_t >= every:
			_shot_t = 0.0
			_shot_n += 1
			var img = get_viewport().get_texture().get_image()
			img.save_png("%s/shot_%02d_%s.png" % [test_mode.shots, _shot_n, state])
	if test_mode.has("quit") and ui_time >= float(test_mode.quit):
		print("[done] kills=%d level=%d path=%s best=%.1f" % [kills, level, ",".join(path), float(meta.best)])
		get_tree().quit()

func glow(ci: CanvasItem, c: Vector2, r: float, col: Color) -> void:
	ci.draw_texture_rect(tex_glow, Rect2(c.x - r, c.y - r, r * 2, r * 2), false, col)

## 縦のグラデーションの帯
func vgrad(ci: CanvasItem, r: Rect2, top: Color, bot: Color) -> void:
	ci.draw_polygon(PackedVector2Array([r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]), PackedColorArray([top, top, bot, bot]))
