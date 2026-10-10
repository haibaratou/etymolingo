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
var PF: Font       # 漢詩の英訳（読みやすいセリフ体 Lora）
var DF: FontFile   # 見出し
var tex_stain: Array = []
var tex_band: Texture2D
var tex_seal: Texture2D
var tex_glow: GradientTexture2D
var tex_dark: GradientTexture2D
## 水墨画の素材（Codex で生成し、白地を透明にしたもの。assets/art）
var ART = {}
var tex_stroke: Array = []
var mon_spr: Sprite2D
var mon_halo: Sprite2D
var mon_mat: ShaderMaterial

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
var GROVE: Array = []
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
var shake_off = Vector2.ZERO
## 字ごとの与えたダメージ（削った文字の数）
var dmg_by = {}
## 倒した漢字の魂（三択には、魂を手に入れた字しか出ない）
var souls = {}
var SOULFX: Array = []
## 字魂転生: 倒した字を墨の淵からよみがえらせる
var REVIVE: Array = []
var dmg_tag = ""
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
var intro_t = 0.0
## 東西南北: 画面の上下左右に出る方角の字。打つとその方角へ移動する
var DIRS: Array = []
var intro_snd = {}
var wave = {}
var chunks = {}
var field_seed = 0
var field_t = 0.0
var mdead = null
## 決戦で追ってくる無敵の蚩尤
var oni = null
var spawn_maxlv = 0
## 敵の出方の緩急: 静（まばら）→ 増（ふえる）→ 群（一方向から押し寄せる）→ 凪（止む）
const WAVES = [["静", "QUIET", 10.0], ["増", "RISING", 20.0], ["群", "SWARM", 7.0], ["凪", "LULL", 7.0]]
## 野に生える字（動かない）。[字, 英単語(空なら字の構成から), 重み]
const PLANTS = [["草", "grass", 30], ["木", "", 26], ["林", "", 15], ["森", "", 8], ["竹", "bamboo", 10], ["花", "flower", 6], ["禾", "grain", 5], ["松", "", 8], ["杉", "", 8]]
## 野の名所（打つと主人公がそこまで行き、恵みを受ける）。[英単語, 再び使えるまでの秒, 重み]
const OBJS = {"宝": ["treasure", 9999.0, 12]}
## 名所の恵み（札の下に出す）
const OBJ_TXT = {"宝": "宝 — 金の墨と命 +1", "kana": "囚われのひらがな — 打って解き放つ"}
## 囚われのひらがな（後半の景）: [かな, ローマ字]。解き放つと主人公のまわりを舞って戦う
const KANA_WORDS = [["さくら", "sakura"], ["ひかり", "hikari"], ["こころ", "kokoro"], ["そら", "sora"], ["うみ", "umi"], ["ほし", "hoshi"], ["かぜ", "kaze"], ["ゆめ", "yume"], ["はな", "hana"], ["みらい", "mirai"], ["なみだ", "namida"], ["つばさ", "tsubasa"]]
## ひらがなの生まれた漢字（草書をくずしたもと）
const KANA_ORIGIN = {"あ": "安", "い": "以", "う": "宇", "か": "加", "き": "幾", "く": "久", "こ": "己", "さ": "左", "し": "之", "そ": "曽", "た": "太", "だ": "太", "つ": "川", "な": "奈", "は": "波", "ば": "波", "ひ": "比", "ほ": "保", "み": "美", "め": "女", "ゆ": "由", "ら": "良", "り": "利", "ろ": "呂", "ぜ": "世", "せ": "世"}
var KANA: Array = []
## 字で解く仕掛け: 水墨画の川（橋の仲間がいれば渡れる）
var RIVERS: Array = []
## 決戦の闇から襲ってくる字
const DARK = ["闇", "鬼", "魔", "影", "夜", "黒", "呪", "死", "怨", "魂", "暗", "骨", "鬱"]

# ---------- 起動 ----------
func _ready() -> void:
	randomize()
	KD.load_all()
	JP_GLOSS = KD.D.get("JP_GLOSS", {})
	_load_meta()
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--"):
			var kv = a.substr(2).split("=")
			test_mode[kv[0]] = kv[1] if kv.size() > 1 else "1"
	GF = _font("res://fonts/ZenOldMincho-Black.ttf", ["res://fonts/FallbackJP-Black.ttf", "res://fonts/FallbackSC-Black.ttf"])
	UF = _font("res://fonts/ZenKakuGothicNew-Bold.ttf", ["res://fonts/ZenOldMincho-Black.ttf", "res://fonts/FallbackJP-Black.ttf"])
	MF = _font("res://fonts/JetBrainsMono-ExtraBold.ttf", ["res://fonts/ZenKakuGothicNew-Bold.ttf"])
	var pfv = FontVariation.new()
	pfv.base_font = load("res://fonts/Lora-Variable.ttf")
	pfv.variation_opentype = {TextServerManager.get_primary_interface().name_to_tag("wght"): 650}
	PF = pfv
	DF = _font("res://fonts/DelaGothicOne-Regular.ttf", ["res://fonts/ZenOldMincho-Black.ttf", "res://fonts/FallbackJP-Black.ttf"])
	# 墨の染みとしぶき（水墨画の素材）
	for i in 9:
		tex_stain.append(art("blot%d" % i))
		tex_stain.append(art("splash%d" % i))
	for i in 4:
		tex_stroke.append(art("stroke%d" % i))
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
	gd.set_color(1, Color(0.02, 0.01, 0.05, 0.42))
	gd.add_point(0.3, Color(0.02, 0.01, 0.05, 0.0))
	gd.add_point(0.6, Color(0.02, 0.01, 0.05, 0.16))
	gd.add_point(0.85, Color(0.02, 0.01, 0.05, 0.32))
	tex_dark.gradient = gd
	living_shader = load("res://shaders/living.gdshader")
	mon_mat = ShaderMaterial.new()
	mon_mat.shader = load("res://shaders/monster.gdshader")
	var nz = NoiseTexture2D.new()
	nz.width = 256
	nz.height = 256
	nz.seamless = true
	var fn = FastNoiseLite.new()
	fn.frequency = 0.02
	fn.fractal_octaves = 4
	nz.noise = fn
	mon_mat.set_shader_parameter("noise_tex", nz)
	# 背景（和紙）
	var bgl = CanvasLayer.new()
	bgl.layer = -10
	add_child(bgl)
	bg = ColorRect.new()
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	bg.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bg_mat = ShaderMaterial.new()
	bg_mat.shader = load("res://shaders/paper.gdshader")
	bg_mat.set_shader_parameter("paper_tex", load("res://assets/tex/washi_tile.png"))
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
	# 決戦の怪物（水墨画）: 地面の上、字の下
	mon_halo = Sprite2D.new()
	mon_halo.visible = false
	world.add_child(mon_halo)
	mon_spr = Sprite2D.new()
	mon_spr.material = mon_mat
	mon_spr.visible = false
	world.add_child(mon_spr)
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
	# 起動するとまずオープニング（試験・観戦の起動では飛ばす）
	if test_mode.is_empty() or test_mode.has("intro"):
		start_intro()
	else:
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
	if test_mode.has("playkeys"):
		if state != "play":
			start()
		await get_tree().create_timer(1.0).timeout
		print("[playkeys] before hero=", Vector2(hero.x, hero.y), " cam=", cam)
		for c in String(test_mode.playkeys):
			var ev2 = InputEventKey.new()
			ev2.pressed = true
			ev2.keycode = KEY_A + (c.unicode_at(0) - 97)
			ev2.physical_keycode = ev2.keycode
			ev2.unicode = c.unicode_at(0)
			Input.parse_input_event(ev2)
			await get_tree().process_frame
		await get_tree().create_timer(1.0).timeout
		print("[playkeys] after hero=", Vector2(hero.x, hero.y), " cam=", cam)
	if test_mode.has("river"):
		if state != "play":
			start()
		time = 30.0
		spawn_river()
		await get_tree().create_timer(1.0).timeout
		var r0 = RIVERS[0]
		# 橋なしで川へ踏み込む → 岸で止まる
		hero.y = r0.y + (40 if hero.y > r0.y else -40)
		await get_tree().process_frame
		print("[river] no bridge hero.y=", hero.y, " river=", r0.y)
		souls["木"] = true; souls["喬"] = true
		owned["木"] = 1
		owned["橋"] = 1
		await get_tree().create_timer(1.5).timeout
		hero.y = r0.y
		await get_tree().process_frame
		print("[river] bridge bx=", r0.bx, " hero.y=", hero.y)
	if test_mode.has("fusetest"):
		if state != "play":
			start()
		souls["日"] = true; souls["月"] = true
		owned["日"] = 1
		await get_tree().create_timer(1.0).timeout
		print("[fz] before ALLY=", ALLY.keys())
		pending_lv = 1
		choose_card = {"t": "w", "id": "月", "en": "moon"}
		_apply_choice()
		await get_tree().create_timer(3.0).timeout
		print("[fz] after owned=", owned, " ALLY=", ALLY.keys())
		for k in ALLY:
			print("   ", k, " vis=", ALLY[k].spr.visible, " pos=", Vector2(ALLY[k].x, ALLY[k].y), " hero=", Vector2(hero.x, hero.y))
	if test_mode.has("kana"):
		if state != "play":
			start()
		boss_idx = 1
		spawn_kana_cage()
		await get_tree().create_timer(1.5).timeout
		for e in E:
			if e.alive and e.get("obj", "") == "kana":
				use_obj(e)
				break
	if test_mode.has("revive"):
		if state != "play":
			start()
		await get_tree().create_timer(0.8).timeout
		souls["火"] = true
		owned["火"] = 1
		start_revive("日")
		owned["日"] = 1
	if test_mode.has("metsu"):
		# 試験: 水→沝→淼 の主人公に、火と戌の仲間が合体して烕 → 主人公が滅へ
		if state != "play":
			start()
		form = "淼"
		path.append("水|沝")
		path.append("水|淼")
		owned["火"] = 1
		owned["戌"] = 1
		await get_tree().create_timer(1.0).timeout
		var fz = find_ally_fuse("戌")
		print("[metsu] fuse=", fz)
		do_ally_fuse(fz)
		await get_tree().create_timer(4.0).timeout
		print("[metsu] form=", form, " owned=", owned, " absorbed=", absorbed)
	if test_mode.has("chain"):
		if state != "play":
			start()
		boss_idx = 1
		var cs = []
		var i0 = 0
		for c in ["河", "海", "池", "泳", "洗", "泡", "沼"]:
			var an = i0 * 0.9
			var u1 = spawn_enemy({"ch": c}, Vector2(hero.x + cos(an) * 260, hero.y + sin(an) * 200))
			u1.born = 1.0
			cs.append(u1)
			i0 += 1
		await get_tree().create_timer(1.2).timeout
		break_part(cs[0], 0.0, -1.0, "type")
	if test_mode.has("split"):
		if state != "play":
			start()
		var u0 = spawn_enemy({"ch": "鬱"}, Vector2(hero.x + 200, hero.y))
		u0.born = 1.0
		await get_tree().create_timer(1.5).timeout
		break_part(u0, -1.0, 0.0, "type")
	if test_mode.has("form"):
		if state != "play":
			start()
		for c in String(test_mode.form):
			spawn_enemy({"ch": c, "en": FORMS[c].w})
	if test_mode.has("steps"):
		if state != "play":
			start()
		await get_tree().create_timer(0.5).timeout
		print("[steps] before ", Vector2(hero.x, hero.y))
		for i in 3:
			var ev3 = InputEventKey.new()
			ev3.pressed = true
			ev3.keycode = KEY_RIGHT
			Input.parse_input_event(ev3)
			await get_tree().create_timer(0.3).timeout
		print("[steps] after ", Vector2(hero.x, hero.y))
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

func art(n: String) -> Texture2D:
	if not ART.has(n):
		ART[n] = load("res://assets/art/%s.png" % n)
	return ART[n]

## 怪物の水墨画を、今の位置・崩れ具合で置く
func _sync_monster() -> void:
	var on = false
	var kind = ""
	var pos = Vector2.ZERO
	var ms = 100.0
	var dis = 0.0
	var a = 1.0
	var t = 0.0
	var fl = 0.0
	var rot = 0.0
	var sc = Vector2.ONE
	if oni != null and state != "title" and state != "over":
		on = true
		kind = "chiyou"
		ms = oni.ms
		t = oni.t
		var r: float = clamp(reveal, 0.0, 1.0) if boss_intro > 0 else 1.0
		a = r * 0.42
		# 画面いっぱいの背景として立つ。詩を読むほど墨が焼けて欠ける
		ms = H * 0.4
		var prog: float = float(boss.li) / boss.poem.lines.size() if boss != null else 1.0
		dis = (1.0 - r) * 0.5 + prog * 0.35
		if oni.has("dead"):
			dis = 0.35 + clamp(oni.dead / 1.8, 0.0, 1.0) * 0.8
			a = 0.42
		fl = oni.fl * 0.4
		# 背景なので揺らさない（画面の揺れも打ち消して、奥に静かに立たせる）
		pos = Vector2(cam.x, cam.y + poem_layout().bottom * 0.25) - shake_off
		rot = 0.0
	elif false:
		on = true
		kind = boss.monster
		ms = boss.ms
		t = boss.t
		var r: float = clamp(reveal, 0.0, 1.0)
		a = r
		dis = boss.mb * 0.42 + (1.0 - r) * 0.5
		fl = max(boss.flash, boss.mfl * 0.45)
		var bob = sin(t * 2.4) * ms * 0.05
		pos = Vector2(boss.x, boss.y + bob)
		rot = sin(t * 1.1) * 0.035
		var br = 1.0 + sin(t * 2.4) * 0.02
		sc = Vector2(br, 2.0 - br)
		if boss.st == "wind":
			pos += Vector2(rnd(-1, 1), rnd(-1, 1)) * ms * 0.04
			sc *= 1.06
		elif boss.st == "lunge":
			rot += clamp(boss.ldir.x, -1.0, 1.0) * 0.12
		if boss.daze > 0:
			rot += sin(t * 9) * 0.06
		pos += Vector2(rnd(-1, 1), rnd(-1, 1)) * boss.mfl * ms * 0.05
	elif false:
		on = true
		kind = mdead.kind
		ms = mdead.s
		var k: float = clamp(mdead.t / 1.8, 0.0, 1.0)
		pos = mdead.c + Vector2(0, k * k * 60 * SF)
		dis = 0.42 + k * 0.62
		t = mdead.bt + mdead.t
		fl = (1.0 - k) * 0.3
	mon_spr.visible = on
	mon_halo.visible = false
	if not on:
		return
	var tex = art("monster_" + kind)
	if mon_spr.texture != tex:
		mon_spr.texture = tex
	var px: float = ms * 2.5 * 1.4 / float(tex.get_width())
	mon_spr.position = pos
	mon_spr.rotation = rot
	mon_spr.scale = sc * px
	# 夜（決戦の闇）は、ほかの字と同じく白黒を反転して描く
	mon_mat.set_shader_parameter("inv_k", night)
	mon_mat.set_shader_parameter("alpha", a)
	mon_mat.set_shader_parameter("dissolve", dis)
	mon_mat.set_shader_parameter("flash", fl)
	mon_mat.set_shader_parameter("t", t)

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
	for pm in KD.D.POEMS:
		for ln in pm.lines:
			for c in String(ln[0]):
				s[c] = 1
	for c in "犬馬鳥癒噛蹴啄福薬魚草井祠鐘硯竹禾宝闇鬼魔影夜黒呪死怨魂暗骨音麻景兄歹云京歌舞丹炎刀矛斧矢兵戈牙食呑餓":
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

## 武器の実効レベル（仲間どうしの合体で生まれた字が上乗せする: 炎→火、林→木、明→日・月）
func Lw(id: String) -> int:
	var v: int = L(id)
	if id == "火":
		v += 4 * L("炎")
	elif id == "木":
		for k in WOOD_TIER:
			if L(k) > 0:
				v += WOOD_TIER[k]
	elif id == "日" or id == "月":
		v += 3 * L("明")
	elif id == "水":
		for k in WATER_TIER:
			if L(k) > 0:
				v += WATER_TIER[k]
	return v

## 木の系統: 木だけでは最弱。いろいろな字と結びついて強くなる
const WOOD_TIER = {"林": 4, "休": 2, "相": 3, "東": 3, "果": 3, "村": 3, "森": 8, "焚": 5, "禁": 5}

## 水の系統（仲間の合体で育つ）。水の力への上乗せ
const WATER_TIER = {"沝": 2, "沐": 2, "泪": 2, "江": 3, "淼": 4, "淋": 4, "淡": 4, "減": 5, "滅": 7}

## いまの水の仲間（波紋はこの字から広がる）
func water_id() -> String:
	var best = "水"
	var bv = 0
	for k in WATER_TIER:
		if L(k) > 0 and WATER_TIER[k] > bv:
			best = k
			bv = WATER_TIER[k]
	return best

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
	E = []; P = []; TX = []; SL = []; RG = []; BOLT = []; STAMP = []; PROJ = []; TRAP = []; ROOTS = []; GROVE = []; SHARD = []; STAIN = []; GEMS = []; TRAIL = []; crescents = []; wave_rings = []
	time = 0; hp = 10; max_hp = 10; level = 1; xp = 0; pending_lv = 0; combo = 0; max_combo = 0; kills = 0; typed_ok = 0; misses = 0; words = 0
	owned = {}; dmg_by = {}; souls = {}; SOULFX = []; REVIVE = []; KANA = []; RIVERS = []; timers = {}; spawn_t = 2; shake = 0; hitstop = 0; flash = 0; red_v = 0; night = 0; ts = 1; slow_t = 0
	boss = null; boss_idx = 0; next_boss = 60; boss_intro = 0; reveal = 0; dying_t = 0; slain = {}
	wave = {"i": 0, "t": 9.0, "dir": 0.0, "warned": false}
	DIRS = []
	chunks = {}; field_seed = randi(); field_t = 0.0; mdead = null; spawn_maxlv = 0; oni = null
	form = hero_def.ch; path = [form]; traits = {}; HS = hero_stats()
	hero = {"x": 0.0, "y": 0.0, "state": "idle", "from": Vector2.ZERO, "to": Vector2.ZERO, "t": 0.0, "target": null, "queue": [], "face": 1, "land": 0.0, "dk": 0.0, "inv": 0.0, "last_dir": Vector2(0, -1), "morph": 0.0, "step_t": 0.0, "step_v": Vector2.ZERO, "step_cd": 0.0}
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
	# 部品が多いほど大きい。部品5つ以上（鬱など）は化物のように巨大
	var whole = (36.0 + min(lv - 1, 6) * 17.0) * SF
	if lv >= 5:
		whole *= 1.7
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
			var si: int = stage_i()
			var sdefs: Array = KD.STAGE_DEFS[si] if si >= 0 and si < KD.STAGE_DEFS.size() else []
			var sw: float = float(KD.D.STAGES[si].w) if sdefs.size() else 0.0
			if boss == null and sdefs.size() and randf() < sw:
				# 景の字（第一景は森林: 森の生きものや木偏の字）
				var mx: float = float(spawn_maxlv) if spawn_maxlv > 0 else cap
				pool = sdefs.filter(func(d): return d.lv <= max(1.0, mx) and (d.lv >= 2 or randf() < 0.5))
			elif spawn_maxlv > 0:
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
	if beh == "swarm" and FORMS.has(String(n.ch)):
		beh = "fast"
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
	if pos == null and force_beh == "" and FORMS.has(String(n.ch)):
		_spawn_formation(e)
	return e

## 字ごとの群れ方。蛇は長い行列、虫は大群、鳥は雁行、馬は横一列の暴走。頭の単語を打つと群れ全員を斬る
const FORMS = {
	"巳": {"kind": "snake", "n": 8, "ls": 1.0, "ms": 0.82, "w": "serpent"},
	"兵": {"kind": "stampede", "n": 5, "ls": 1.0, "ms": 0.9, "w": "soldier"},
	"蛇": {"kind": "snake", "n": 8, "ls": 1.0, "ms": 0.82, "w": "snake"},
	"竜": {"kind": "snake", "n": 10, "ls": 1.2, "ms": 0.9, "w": "dragon"},
	"虫": {"kind": "swarm", "n": 12, "ls": 0.8, "ms": 0.5, "w": "bug"},
	"蟻": {"kind": "swarm", "n": 14, "ls": 0.75, "ms": 0.45, "w": "ant"},
	"蜂": {"kind": "swarm", "n": 10, "ls": 0.8, "ms": 0.5, "w": "bee"},
	"鳥": {"kind": "flock", "n": 6, "ls": 1.0, "ms": 0.75, "w": "bird"},
	"鶴": {"kind": "flock", "n": 6, "ls": 1.0, "ms": 0.75, "w": "crane"},
	"馬": {"kind": "stampede", "n": 4, "ls": 1.0, "ms": 0.95, "w": "horse"},
	"牛": {"kind": "stampede", "n": 3, "ls": 1.05, "ms": 1.0, "w": "cow"},
}

func _spawn_formation(e: Dictionary) -> void:
	var f: Dictionary = FORMS[String(e.ch)]
	e.grp = e.id
	e.lead = true
	e.fkind = f.kind
	e.size *= f.ls
	e.rad = e.size * 0.48
	e.trail = [Vector2(e.x, e.y)]
	var n: int = f.n + int(min(6.0, time / 50.0))
	var to = Vector2(hero.x - e.x, hero.y - e.y).normalized()
	match f.kind:
		"snake":
			e.beh = "zig"
			e.spd *= 1.15
		"swarm":
			e.spd *= 1.4
		"flock":
			e.fmove = true
			e.fv = to * 115.0 * SF
		"stampede":
			e.fmove = true
			e.fv = to * 150.0 * SF
	e.gsize = n + 1
	for i in n:
		var m = spawn_enemy({"ch": e.ch, "en": e.word}, Vector2(e.x, e.y) - to * (i + 1) * 30 * SF, "member")
		m.grp = e.grp
		m.lead = false
		m.idx = i + 1
		m.fmove = true
		m.fkind = f.kind
		m.size *= f.ms
		m.rad = m.size * 0.42
		m.ang = rnd(0, TAU)
		m.orb = rnd(0.5, 1.0)

## 群れの動き（頭の動きに、残りがついていく）
func tick_groups(dt: float) -> void:
	var leaders = {}
	for e in E:
		if e.alive and e.get("lead", false):
			leaders[e.grp] = e
	for e in E:
		if not e.alive or not e.has("grp"):
			continue
		if e.get("lead", false):
			if e.fkind == "snake":
				var last: Vector2 = e.trail[-1]
				if Vector2(e.x, e.y).distance_to(last) > 4.0 * SF:
					e.trail.append(Vector2(e.x, e.y))
					if e.trail.size() > 400:
						e.trail.pop_front()
			elif e.fkind == "flock" or e.fkind == "stampede":
				e.x += e.fv.x * dt
				e.y += e.fv.y * dt
				e.face = -1 if e.fv.x < 0 else 1
			continue
		var L = leaders.get(e.grp, null)
		if L == null:
			# 頭がいなくなった群れは、ばらばらに襲ってくる
			e.erase("grp")
			e.fmove = false
			continue
		var tp = Vector2(e.x, e.y)
		match e.fkind:
			"snake":
				var k: int = L.trail.size() - 1 - e.idx * int(round(8.0))
				var q: Vector2 = L.trail[max(0, k)]
				tp = q
				e.x = q.x
				e.y = q.y
			"swarm":
				e.ang += dt * (2.0 + e.idx * 0.13)
				var r: float = (40.0 + e.orb * 60.0) * SF
				tp = Vector2(L.x, L.y) + Vector2(cos(e.ang), sin(e.ang * 1.3)) * r + Vector2(rnd(-1, 1), rnd(-1, 1)) * 6 * SF
				e.x += (tp.x - e.x) * min(1.0, dt * 6)
				e.y += (tp.y - e.y) * min(1.0, dt * 6)
			"flock":
				var dir: Vector2 = L.fv.normalized()
				var side = 1.0 if e.idx % 2 else -1.0
				var row: int = (e.idx + 1) / 2
				tp = Vector2(L.x, L.y) - dir * row * 38 * SF + Vector2(-dir.y, dir.x) * side * row * 34 * SF
				e.x += (tp.x - e.x) * min(1.0, dt * 8)
				e.y += (tp.y - e.y) * min(1.0, dt * 8)
			"stampede":
				var dir2: Vector2 = L.fv.normalized()
				var side2 = 1.0 if e.idx % 2 else -1.0
				var col: int = (e.idx + 1) / 2
				tp = Vector2(L.x, L.y) + Vector2(-dir2.y, dir2.x) * side2 * col * 58 * SF - dir2 * col * 10 * SF
				e.x += (tp.x - e.x) * min(1.0, dt * 8)
				e.y += (tp.y - e.y) * min(1.0, dt * 8)
		e.face = L.face

# 部位破壊: 部品を1つはがす。単体の字なら消える。返り値 true＝倒した
func break_part(e: Dictionary, dx := 0.0, dy := -1.0, how := "type", pick := "") -> bool:
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
		for t3 in [e, r2]:
			t3.pop_t0 = time; t3.pop_from = gap * 1.2; t3.shield_t = time + 0.8
			t3.born = max(float(t3.born), 0.6)
		add_gem(ox, oy, 2 * HS.xp)
		return false
	if n.parts.size() > 2:
		# 鬱のように部品の多い字は、一撃でそれぞれの部品の字にばらける（同じ字を二度打たせない）
		var names = []
		for q in n.parts:
			names.append(q.ch)
		add_text(e.x, e.y - e.size * 0.75, n.ch + " → " + " ".join(names), 22 * SF + 8, KD.SHU, 2.2)
		shatter(e.x, e.y, n.ch, e.size * 0.7, 0.35, KD.SUMI)
		add_stain(e.x, e.y, e.size * 0.3)
		# ばらける瞬間: 少し止まって、朱の輪と十字の裂け目
		hitstop = max(hitstop, 0.12)
		shake = max(shake, 12 * shake_k())
		add_ring(e.x, e.y, e.size * 1.1, 0.5, KD.SHU, 8)
		add_ring(e.x, e.y, e.size * 0.7, 0.35, KD.KIN, 4)
		sfx.play("boom", -6, 1.3)
		var big_sz: float = e.size
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
			# 大きな字の体から、部品の字が大きいまま飛び出して縮む（しばらく武器が効かない）
			t2.x = ox2 + cos(ang) * big_sz * 0.2; t2.y = oy2 + sin(ang) * big_sz * 0.2
			t2.kx = cos(ang) * 520; t2.ky = sin(ang) * 520; t2.daze = 1.4; t2.pulse = 1.0
			t2.pop_t0 = time; t2.pop_from = big_sz * 0.6
			t2.shield_t = time + 1.0
			t2.born = max(float(t2.born), 0.6)
			SL.append({"a": Vector2(ox2, oy2), "c": Vector2(ox2, oy2) + Vector2(cos(ang), sin(ang)) * gap2 * 0.6, "b": Vector2(ox2, oy2) + Vector2(cos(ang), sin(ang)) * gap2 * 1.3, "life": 0.4, "max": 0.4, "w": 10.0 * SF, "boss": false, "cut": true, "seed": randi()})
		add_gem(ox2, oy2, 3 * HS.xp)
		return false
	var i = randi() % n.parts.size()
	# 景の部首（森林は木、大河は水…）があれば、まずそれがはがれる
	var rads: Array = stage_radicals()
	for j in n.parts.size():
		var pc: String = n.parts[j].ch
		if (pick != "" and pc == pick) or (pick == "" and rads.has(pc)):
			i = j
			break
	var gone: Dictionary = n.parts[i]
	if KD.leaves(gone) == 1:
		take_soul(String(gone.ch), e.x, e.y)
	if rads.has(gone.ch) and how != "chain":
		later(0.05, func(): chain_radical(gone.ch, e))
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
## 決戦: ボスは画面の上端に張り付いた漢詩。英訳（二句ずつ）を打ち切るたびに詩が変わる。
## 画面は暗くなり、雑魚は闇の字に変わる。無敵の蚩尤が追ってくるので、逃げながら打つ
func spawn_boss() -> void:
	var pm: Dictionary = KD.D.POEMS[boss_idx % KD.D.POEMS.size()]
	boss = {"id": uid, "is_boss": true, "poem": pm, "li": 0, "ch": pm.title, "x": cam.x, "y": cam.y, "size": 40 * SF, "rad": 20 * SF, "alive": true, "locked": false, "t": 0.0, "flash": 0.0, "pulse": 0.0, "kx": 0.0, "ky": 0.0, "fx_t": 0.0, "typed": "", "word": "", "acc": [], "gift": false, "captive": false, "line_t": 0.0,
		"daze": 0.0, "eat": 0, "word_len": 0, "slow": 0.0, "born": 0.0, "lv0": 1, "st": "walk"}
	uid += 1
	set_poem_line()
	E.append(boss)
	# 蚩尤は画面の端から現れる
	var a = rnd(0, TAU)
	var R = edge_r(a) + 60 * SF
	oni = {"x": cam.x + cos(a) * R, "y": cam.y + sin(a) * R, "t": 0.0, "st": "walk", "st_t": 3.0, "ldir": Vector2.ZERO, "kx": 0.0, "ky": 0.0, "daze": 0.0, "bite_t": 0.0, "ms": 100.0 * SF, "rad": 52.0 * SF, "fl": 0.0, "is_boss": true}
	boss_intro = 2.4
	reveal = 0
	show_banner("漢詩　" + pm.title, "TYPE THE POEM", true)
	sfx.play("boom")
	sfx.play("brush", -2)
	sfx.play("gong", -4)
	flash = 0.55 if not calm else 0.3
	flash_col = Color(0.02, 0.01, 0.05)
	set_hint("上の漢詩の英文を打ち切るたびに詩が変わる。全句を読み解けば、奥に立つ蚩尤も墨に還る", 9)
	for e in E:
		if e != boss and e.alive and not e.captive and not e.get("still", false):
			kill_enemy(e, "blast")

## 二句ずつ打つ（上端の帯に漢字、そのすぐ下に英文）
func set_poem_line() -> void:
	var lines: Array = boss.poem.lines
	var a: Array = lines[boss.li]
	var b: Array = lines[boss.li + 1] if boss.li + 1 < lines.size() else []
	boss.zh = String(a[0]) + ("，" + String(b[0]) if b.size() else "")
	boss.en = String(a[1]) + (", " + String(b[1]) if b.size() else "")
	boss.fx = a[2]
	boss.fx_t = 0.0
	boss.line_t = 0.0
	var w = ""
	for c in boss.en:
		if c >= "a" and c <= "z":
			w += c
	set_word(boss, w)

func poem_layout() -> Dictionary:
	var ln: String = String(boss.get("zh", "　")) if boss != null else "　"
	var n = max(1, ln.length())
	var top = 84.0 if W < 560 else 78.0
	var P0: float = min(W * 0.72 / n, H * 0.07, 50.0)
	var y = top + 20 + P0 * 0.55
	var x0 = W / 2 - (n - 1) / 2.0 * P0
	var fs = round(21 * max(0.85, SF))
	var ey = y + P0 * 0.6 + 8
	return {"P": P0, "y": y, "x0": x0, "n": n, "top": top, "bottom": ey + fs * 1.45 + 26, "fs": fs, "ey": ey}

## 英文を打ち切った: 帯の詩が砕けて次の二句に変わる。蚩尤は怯んで止まる
func boss_hit() -> void:
	var b: Dictionary = boss
	var lay = poem_layout()
	var chars: String = b.zh
	for j in chars.length():
		if chars[j] == "，":
			continue
		var sx: float = lay.x0 + j * lay.P
		shatter(cam.x + sx - W / 2, cam.y + lay.y - H / 2, chars[j], lay.P * 0.9, 0.7, KD.KIN)
	shake = 14 * shake_k()
	hitstop = 0.1
	flash = 0.1 if calm else 0.22
	flash_col = KD.KIN
	sfx.play("boom", -2)
	# 詩の衝撃（弱め）: 画面の雑魚の単語が末尾から1文字減り、押し返される
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
	if n:
		add_text(hero.x, hero.y - 70 * SF, "詩の衝撃 ×%d" % n, 16 * SF + 4, KD.KIN, 0.9)
	# 蚩尤が怯む
	if oni != null:
		var uo = Vector2(oni.x - hero.x, oni.y - hero.y).normalized()
		oni.kx += uo.x * 600; oni.ky += uo.y * 600
		oni.daze = 2.2
		oni.st = "walk"
		oni.st_t = 3.5
		oni.fl = 1.0
		add_text(oni.x, oni.y - oni.ms, "怯", 22 * SF + 4, KD.KIN, 0.9)
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
	later(0.3, func(): show_banner("詩を読み解いた", "POEM BROKEN — " + b.poem.title, false, true))
	# 詩が読み解かれると、蚩尤は墨に還る
	if oni != null:
		oni.dead = 0.0
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
	enter_stage()
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
	var out = E.filter(func(e): return e.alive and not e.locked and e.get("rest", 0.0) <= 0 and (e.is_boss or on_view(e.x, e.y + e.size * 0.9, 8)))
	return out

## 移動の字の組。上・下・左・右の4つは、いつも同じ仲間の一文字の字（方角だけは向きどおり）
const DIR_GROUPS = [
	["方角", [["北", "north"], ["南", "south"], ["西", "west"], ["東", "east"]]],
	["四季", [["春", "spring"], ["夏", "summer"], ["秋", "autumn"], ["冬", "winter"]]],
	["動物", [["犬", "dog"], ["猫", "cat"], ["馬", "horse"], ["羊", "sheep"]]],
	["果物", [["桃", "peach"], ["梅", "plum"], ["柿", "persimmon"], ["栗", "chestnut"]]],
	["色", [["赤", "red"], ["青", "blue"], ["白", "white"], ["金", "gold"]]],
	["天気", [["雨", "rain"], ["雪", "snow"], ["風", "wind"], ["雷", "thunder"]]],
	["空", [["日", "sun"], ["月", "moon"], ["星", "star"], ["雲", "cloud"]]],
	["体", [["目", "eye"], ["耳", "ear"], ["口", "mouth"], ["手", "hand"]]],
	["鳥", [["鶴", "crane"], ["鷹", "hawk"], ["鳩", "dove"], ["雀", "sparrow"]]],
	["魚", [["鯉", "carp"], ["鮫", "shark"], ["鯛", "bream"], ["鮪", "tuna"]]],
	["虫", [["蜂", "bee"], ["蟻", "ant"], ["蝶", "butterfly"], ["蚊", "mosquito"]]],
	["数", [["一", "one"], ["二", "two"], ["三", "three"], ["四", "four"]]],
]
const DIR_CD = 3.5
var dir_group = ""

func _make_dirs() -> void:
	DIRS = []
	for v in [Vector2(0, -1), Vector2(0, 1), Vector2(-1, 0), Vector2(1, 0)]:
		DIRS.append({"ch": "", "word": "", "acc": [""], "typed": "", "dirv": v, "dirm": true, "alive": true, "locked": false, "is_boss": false, "captive": false, "gift": false, "pulse": 0.0, "x": 0.0, "y": 0.0, "eat": 0, "word_len": 0, "rad": 0.0, "cd": 0.0})
	_reroll_dirs("方角")

## 4つの字を、別の仲間の組に入れ替える
func _reroll_dirs(force := "") -> void:
	var g = null
	if force != "":
		for gg in DIR_GROUPS:
			if gg[0] == force:
				g = gg
	else:
		var pool = DIR_GROUPS.filter(func(x): return x[0] != dir_group)
		g = pool.pick_random()
	dir_group = g[0]
	var items: Array = g[1].duplicate()
	if dir_group != "方角":
		items.shuffle()
	for i in 4:
		DIRS[i].ch = items[i][0]
		DIRS[i].word = items[i][1]
		DIRS[i].acc = [items[i][1]]
		DIRS[i].typed = ""

## 方角の字の画面上の位置（上・下・左・右の端）
func dir_screen(d: Dictionary) -> Vector2:
	var v: Vector2 = d.dirv
	if v.y < 0:
		return Vector2(W / 2, (poem_layout().bottom + 34) if boss != null else 150.0)
	if v.y > 0:
		return Vector2(W / 2, H - 52)
	if v.x < 0:
		return Vector2(46, H * 0.52)
	return Vector2(W - 92, H * 0.52)

## 方角の字を打ち切った: 主人公がその方角の画面の端まで駆ける
func move_dir(d: Dictionary) -> void:
	d.typed = ""
	# 使った字はしばらく使えない。4つの字は別の仲間の組に入れ替わる
	_reroll_dirs()
	d.cd = DIR_CD
	var sp: Vector2 = dir_screen(d)
	var wp = Vector2(cam.x + sp.x - W / 2, cam.y + sp.y - H / 2)
	# 端の字の少し手前まで
	var v: Vector2 = d.dirv
	wp -= v * 60 * SF
	var tgt = {"x": wp.x, "y": wp.y, "alive": true, "locked": false, "rad": 0.0, "is_boss": false, "captive": false, "dirmove": true}
	for j in hero.queue:
		if j.target != null and j.target is Dictionary:
			j.target.locked = false
	hero.queue.clear()
	hero.queue.append({"target": tgt})
	if hero.state != "dash":
		start_dash()
	d.pulse = 1.0
	sfx.play("dash", -4, 0.8)

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
	# 方角の字は移動だけ（連撃にも数えない）
	for d in fin.filter(func(x): return x.get("dirm", false)):
		move_dir(d)
	fin = fin.filter(func(x): return not x.get("dirm", false))
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
	# 撃たれた字は、その場で斬り落とす（突っ込まない）
	for t in fin.filter(func(x): return x.get("shot", false)):
		t.locked = false
		slash(hero.x, hero.y, t.x, t.y, false)
		sfx.play("slash", -6, 1.3)
		kill_enemy(t, "type")
	# 漢詩（上端の帯）を打ち切ったら、その場で詩が変わる
	for t in fin.filter(func(x): return x.get("is_boss", false)):
		t.locked = false
		boss_hit()
	var rest2 = fin.filter(func(x): return not x.get("shot", false) and not x.get("is_boss", false))
	if rest2.size():
		queue_attacks(rest2)

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

const STEP_DIST = 110.0
const STEP_T = 0.14
const STEP_CD = 0.16

## 十字キーで上下左右に少しステップ（攻撃ではない）
func step_hero(v: Vector2) -> void:
	if state != "play" or hero.state == "dash" or hero.step_cd > 0:
		return
	hero.step_v = v * STEP_DIST * SF
	hero.step_t = STEP_T
	hero.step_cd = STEP_CD
	if v.x != 0:
		hero.face = 1 if v.x > 0 else -1
	sfx.play("dash", -14, 1.3)

func tick_hero(dt: float) -> void:
	var prev = Vector2(hero.x, hero.y)
	_tick_hero(dt)
	if not RIVERS.is_empty():
		river_block(prev)

func _tick_hero(dt: float) -> void:
	hero.inv = max(0.0, hero.inv - dt)
	hero.land = max(0.0, hero.land - dt * 6.5)
	hero.morph = max(0.0, hero.morph - dt)
	hero.dk += ((1.0 if hero.state == "dash" else 0.0) - hero.dk) * min(1.0, dt * (20.0 if hero.state == "dash" else 9.0))
	hero.step_cd = max(0.0, hero.step_cd - dt)
	if hero.step_cd <= 0 and state == "play":
		# 押しっぱなしなら続けてステップ（斜めも可）
		var hv = Vector2(float(Input.is_key_pressed(KEY_RIGHT)) - float(Input.is_key_pressed(KEY_LEFT)), float(Input.is_key_pressed(KEY_DOWN)) - float(Input.is_key_pressed(KEY_UP)))
		if hv != Vector2.ZERO:
			step_hero(hv.normalized())
	if hero.step_t > 0 and hero.state != "dash":
		# 十字キーのステップ: ただの移動。攻撃ではないので、敵に触れれば傷を負う
		var k0: float = hero.step_t / STEP_T
		hero.step_t = max(0.0, hero.step_t - dt)
		var k1: float = hero.step_t / STEP_T
		var d0: float = 1.0 - k0 * k0
		var d1: float = 1.0 - k1 * k1
		var mv: Vector2 = hero.step_v * (d1 - d0)
		hero.x += mv.x
		hero.y += mv.y
		if int(time * 60) % 2 == 0:
			TRAIL.append({"x": hero.x, "y": hero.y, "life": 0.14, "max": 0.14})
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

func others(t, r := 1e9, origin := Vector2.INF) -> Array:
	var o = Vector2(hero.x, hero.y) if origin == Vector2.INF else origin
	return E.filter(func(x): return x != t and x.alive and not x.is_boss and not x.locked and not x.gift and x.typed == "" and x.get("obj", "") == "" and Vector2(x.x, x.y).distance_to(o) < r)

func resolve_hit(t) -> void:
	if t != null and t.get("dirmove", false):
		# 移動しただけ。着地で墨が少し跳ねる
		add_ring(hero.x, hero.y, 40 * SF, 0.25, ink_col(), 2)
		return
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
	var whole = charged or (has_form("信") and t.word_len >= 6) or has_form("滅")
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
	if has_form("滅"):
		# 滅: 周りの字も丸ごと滅びる
		for o in others(t, 170 * SF, Vector2(t.x, t.y)):
			slash(t.x, t.y, o.x, o.y, false)
			o.bq = KD.leaves(o.node)
			o.bq_t = 0.1
			o.daze = 2.0
	elif has_form("減"):
		# 減: 周りの字の英単語が1文字ずつ減る
		for o in others(t, 220 * SF, Vector2(t.x, t.y)):
			eat_letter(o, 1, 2, "減")
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
	var R2: float = (85 + HS.splash + min(L("刀"), 4) * 20) * SF
	pass  # 出どころの分からない輪は出さない
	for o in others(t):
		var od = Vector2(o.x - hero.x, o.y - hero.y)
		var dl = od.length()
		if dl < 0.01:
			od = Vector2.UP
			dl = 1.0
		if dl < R2 + o.rad:
			var kb2: float = (220 + (R2 - dl) * 0.8) * HS.knock
			o.kx = od.x / dl * kb2
			o.ky = od.y / dl * kb2
			o.daze = 0.8
			# 斬った勢いの墨の風が、そばの字を押しのけたことを見せる
			for k in 4:
				var an: float = atan2(od.y, od.x) + rnd(-0.25, 0.25)
				P.append({"k": "ink", "x": hero.x + cos(an) * hero_r(), "y": hero.y + sin(an) * hero_r(), "vx": cos(an) * 520, "vy": sin(an) * 520, "life": 0.22, "max": 0.22, "s": 2.2 * SF, "c": KD.SUMI})
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
## 武器の一撃: 武器ごとに別の間隔で削る（武器を重ねるほど速く崩れる）。Lvが上がると一度に何文字も削る
func dmg_enemy(e: Dictionary, d: float, id := "") -> void:
	var lv: int = max(1, Lw(id)) if id != "" else 1
	var n: int = 1 + int(lv / 3) + (1 if d >= 5 else 0)
	eat_letter(e, n, lv, id)

func eat_letter(e: Dictionary, n := 1, lv := 1, src := "") -> bool:
	if not e.alive or e.get("is_boss", false) or e.captive or e.locked or e.get("obj", "") != "":
		return false
	if time < float(e.get("shield_t", -1.0)):
		return false
	if src != "":
		if not e.has("cdt"):
			e.cdt = {}
		if time < float(e.cdt.get(src, -1.0)):
			return false
		e.cdt[src] = time + 0.11 / (1.0 + 0.3 * (lv - 1)) / dmg_mul() * pow(0.9, traits.get("dmg", 0))
		# 仲間の一撃はかならず字を弾き飛ばす（仲間がいればその位置から、いなければ主人公から）
		var src_p: Vector2 = AP(src)
		var ku: Vector2 = (Vector2(e.x, e.y) - src_p).normalized()
		if ku == Vector2.ZERO:
			ku = Vector2(randf() - 0.5, randf() - 0.5).normalized()
		# 弾き飛ばすのは一撃型の字だけ（日・月・火・雨・田のような常時の攻撃では動かさない）。小さく押す程度
		if ["犬", "馬", "鳥", "矢"].has(src) and not e.get("still", false):
			e.kx += ku.x * 110; e.ky += ku.y * 110
		e.flash = 0.15
		if ALLY.has(src):
			ALLY[src].hitp = 1.0
			# 日・月は字へ光の筋を落とす
			if (src == "日" or src == "月") and randf() < 0.5:
				BOLT.append({"pts": [src_p, Vector2(e.x, e.y)], "life": 0.18, "max": 0.18, "ray": true, "w": 0.35, "c": KD.KIN if src == "日" else Color(0.82, 0.88, 1.0)})
		# どの武器が当たったか: 当たった所に武器の字が小さく跳ねる
		if true:
			TX.append({"x": e.x + rnd(-e.rad, e.rad) * 0.6, "y": e.y - e.rad * 0.4, "t": src, "s": 16.0 * max(0.85, SF) + 2, "c": KD.KIN if night > 0.5 else KD.AI, "life": 0.45, "max": 0.45, "vy": -70.0})
	elif e.get("eat_cd", 0.0) > 0:
		return false
	var aic: Color = KD.AIN if night > 0.5 else KD.AI
	for k in n:
		var w: String = e.word
		# 残り1文字を壊したら、仲間の手でその字を崩す（部品が1つはがれ、単体の字なら倒れる）
		var tg: String = src if src != "" else dmg_tag
		if tg != "":
			dmg_by[tg] = dmg_by.get(tg, 0) + 1
		if w.length() - e.eat <= 1:
			pass  # 出どころの分からない輪は出さない
			break_part(e, 0, -1, "weapon")
			dbg_break += 1
			if src == "":
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
	if src == "":
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
		# 決戦は闇の字が絶えず押し寄せる（2〜3体ずつ）
		spawn_t = max(0.45, 0.9 - time * 0.002)
		if n >= 24:
			return
		for j in randi_range(1, 2):
			spawn_enemy()
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
				if time > 15 and randf() < 0.16:
					# 群れで来る字（巳の行列・虫の大群・鳥の雁行・馬の暴走）。群れは部品に分かれない易しい字だけ
					var c = [["巳", "巳", "虫", "虫", "鳥", "馬", "牛"], ["巳", "虫", "虫", "鳥", "鳥"], ["兵", "兵", "馬", "馬", "鳥"]][stage_i()].pick_random()
					spawn_enemy({"ch": c, "en": FORMS[c].w})
				else:
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
	if test_mode.has("nofield"):
		return
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
	rng.seed = hash([field_seed, k.x, k.y, stage_i()])
	var o = Vector2(k.x, k.y) * CHS()
	var placed = []
	if rng.randf() < 0.18:
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
				place_plant(_wpick(rng, plants_now(), 2), p2, k)
				placed.append(p2)
	for i in rng.randi_range(0, 1):
		var p3 = o + Vector2(rng.randf(), rng.randf()) * CHS()
		if _spot_ok(p3, placed, 64 * SF):
			place_plant(_wpick(rng, plants_now(), 2), p3, k)
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
## ---- 水墨画の川: 字で解く仕掛け ----
func spawn_river() -> void:
	var up: float = -1.0 if randf() < 0.5 else 1.0
	var y: float = hero.y + up * H * 0.32
	var r = {"y": y, "h": 90 * SF, "x0": cam.x - W * 1.6, "x1": cam.x + W * 1.6, "bx": null, "bt": 0.0, "t": 0.0}
	RIVERS.append(r)
	# 向こう岸に宝
	for k in 2:
		var tp = Vector2(hero.x + (k - 0.5) * 220 * SF, y + up * 170 * SF)
		place_obj("宝", tp, Vector2i(1 << 20, 0))
	add_text(hero.x, y - up * 70 * SF, "川 — 向こう岸に宝。橋があれば渡れる", 15 * SF + 4, KD.AI, 2.6)

func tick_rivers(dt: float) -> void:
	if boss == null and tick("river_ev", dt, 55.0 if stage_i() >= 1 else 90.0) and RIVERS.is_empty() and time > 20:
		spawn_river()
	for r in RIVERS:
		r.t += dt
		if r.bx != null:
			r.bt += dt
		# 橋の仲間がいて、川の近くにいれば、橋が架かる
		elif L("橋") > 0 and abs(hero.y - r.y) < 260 * SF and hero.x > r.x0 and hero.x < r.x1:
			r.bx = hero.x
			r.bt = 0.0
			sfx.play("thud", -4, 0.8)
			sfx.play("koto", -6)
			add_text(hero.x, r.y - r.h, "橋", 34 * SF, KD.KIN, 1.2)
	RIVERS = RIVERS.filter(func(r): return abs(r.y - cam.y) < max(W, H) * 2.2)

## 川は渡れない（橋の上だけ渡れる）
func river_block(prev: Vector2) -> void:
	for r in RIVERS:
		var top: float = r.y - r.h / 2
		var bot: float = r.y + r.h / 2
		if hero.y > top and hero.y < bot and hero.x > r.x0 and hero.x < r.x1:
			if r.bx != null and r.bt > 0.8 and abs(hero.x - float(r.bx)) < 70 * SF:
				continue
			hero.y = (top - 1.0) if prev.y <= r.y else (bot + 1.0)

func _draw_rivers(ci: CanvasItem) -> void:
	for r in RIVERS:
		var x0: float = max(r.x0, cam.x - W)
		var x1: float = min(r.x1, cam.x + W)
		var top: float = r.y - r.h / 2
		var aic: Color = KD.AIN if night > 0.5 else KD.AI
		# 水面（淡い藍のにじみ）と流れの筆線
		ci.draw_rect(Rect2(x0, top, x1 - x0, r.h), Color(aic, 0.16))
		for k in 5:
			var pts = PackedVector2Array()
			var yy: float = top + r.h * (0.15 + k * 0.17)
			var x: float = x0
			while x <= x1:
				pts.append(Vector2(x, yy + sin(x * 0.02 + r.t * 2.2 + k) * 4 * SF))
				x += 24
			ci.draw_polyline(pts, Color(aic, 0.35 - k * 0.04), 2.0 + (k % 2), true)
		# 岸の墨
		ci.draw_line(Vector2(x0, top), Vector2(x1, top), Color(KD.SUMI, 0.5), 3)
		ci.draw_line(Vector2(x0, top + r.h), Vector2(x1, top + r.h), Color(KD.SUMI, 0.5), 3)
		if r.bx != null:
			# 橋の字が川に架かる（根元から伸びるように）
			var k2: float = _ease(clamp(r.bt / 0.8, 0.0, 1.0))
			var bxx: float = r.bx
			ci.draw_rect(Rect2(bxx - 60 * SF, top - 10 * SF, 120 * SF, (r.h + 20 * SF) * k2), Color(KD.WASHI, 0.95))
			for j in 6:
				var py: float = top - 10 * SF + j * (r.h + 20 * SF) / 5.0
				if py < top - 10 * SF + (r.h + 20 * SF) * k2:
					ci.draw_line(Vector2(bxx - 60 * SF, py), Vector2(bxx + 60 * SF, py), Color(KD.SUMI, 0.6), 2)
			ci.draw_line(Vector2(bxx - 60 * SF, top - 10 * SF), Vector2(bxx - 60 * SF, top - 10 * SF + (r.h + 20 * SF) * k2), Color(KD.SUMI, 0.9), 4)
			ci.draw_line(Vector2(bxx + 60 * SF, top - 10 * SF), Vector2(bxx + 60 * SF, top - 10 * SF + (r.h + 20 * SF) * k2), Color(KD.SUMI, 0.9), 4)
			if k2 > 0.05:
				glyph(ci, "橋", Vector2(bxx, r.y), r.h * 0.8 * k2, KD.KIN, Color(KD.SUMI, 0.8), 5)
		else:
			# 渡れる字の手がかり
			glyph(ci, "川", Vector2(cam.x, r.y), r.h * 0.7, Color(aic, 0.45), Color.TRANSPARENT, 0)

func spawn_kana_cage() -> void:
	var kw: Array = KANA_WORDS.pick_random()
	var an: float = rnd(0, TAU)
	var p = Vector2(cam.x + cos(an) * W * 0.3, cam.y + sin(an) * H * 0.26)
	var e = spawn_enemy({"ch": kw[0], "en": kw[1]}, p, "still")
	e.still = true
	e.obj = "kana"
	e.spd = 0.0
	e.rest = 0.0
	e.rest_max = 9999.0
	e.size = 46 * SF
	e.rad = 40 * SF
	e.born = 1.0
	add_text(p.x, p.y - 70 * SF, "囚われのひらがな", 14 * SF + 4, KD.SHU, 1.6)

func use_obj(t: Dictionary) -> void:
	t.rest = t.rest_max
	t.typed = ""
	t.flash = 0.3
	var aic = KD.AIN if night > 0.5 else KD.AI
	hitstop = max(hitstop, 0.06)
	match t.obj:
		"kana":
			# 囚われのひらがなを解き放つ: 檻が砕け、かなが一字ずつ主人公のまわりへ舞う
			var word: String = t.ch
			var orig = []
			for i in word.length():
				var c: String = word[i]
				KANA.append({"ch": c, "a": rnd(0, TAU), "t": -i * 0.15, "x": t.x + (i - word.length() / 2.0) * 34 * SF, "y": t.y})
				if KANA_ORIGIN.has(c):
					orig.append(c + "←" + KANA_ORIGIN[c])
			hp = min(max_hp, hp + 1)
			shatter(t.x, t.y, "囚", t.size * 1.2, 0.8, KD.SUMI)
			for i in 24:
				var an = rnd(0, TAU)
				P.append({"k": "petal", "x": t.x, "y": t.y, "vx": cos(an) * 200, "vy": sin(an) * 200 - 80, "life": 1.0, "max": 1.0, "s": rnd(3, 5) * SF, "c": KD.SHU, "r": rnd(0, TAU)})
			if orig.size():
				add_text(t.x, t.y - 70 * SF, "　".join(orig), 15 * SF + 4, KD.AI, 1.6)
			later(0.3, func(): show_banner("かな解放　「" + word + "」", "", false, true))
			add_gem(t.x, t.y, 4 * HS.xp, 0.0, true)
			sfx.play("lv", -4, 1.2)
			t.alive = false
			if t.has("spr") and is_instance_valid(t.spr):
				t.spr.visible = false
			return
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
			# 怪物も鐘の音に怯む
			if oni != null and not oni.has("dead") and on_view(oni.x, oni.y, 120):
				oni.daze = 3.5
				oni.st = "walk"
				oni.st_t = 4.0
				var ub = Vector2(oni.x - t.x, oni.y - t.y).normalized()
				oni.kx += ub.x * 500; oni.ky += ub.y * 500
				oni.fl = 1.0
				add_text(oni.x, oni.y - oni.ms, "怯んだ", 18 * SF + 4, KD.KIN, 1.2)
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
			t.alive = false

## 決戦の怪物の位置と大きさ（漢詩の帯の下の、闘いの場の中ほど）
func monster_geo() -> Array:
	if oni != null:
		# 背景の蚩尤から字が湧く場所: 画面の端寄り
		var a = rnd(0, TAU)
		return [Vector2(cam.x + cos(a) * W * 0.42, cam.y + sin(a) * H * 0.38), 40.0 * SF]
	return [Vector2(boss.x, boss.y), float(boss.get("ms", 100.0 * SF))]

## 漢字を壊すと、その魂が主人公のもとへ飛んでくる（使役できる字の魂だけ）
## 魂はバラバラにした最小の字（部品）でしか手に入らない（鬱をそのまま得ることはできない）
func take_souls_of(n: Dictionary, x: float, y: float) -> void:
	if n.get("parts", []).is_empty():
		take_soul(String(n.ch), x, y)
		return
	for q in n.parts:
		take_souls_of(q, x, y)

func take_soul(ch: String, x: float, y: float) -> void:
	if ch.length() != 1 or KD.D.COMP.has(ch) or not KD.fuse_of(ch).is_empty():
		return
	if souls.has(ch):
		return
	if not (KD.D.WEAP.has(ch) or KD.D.PARTS.has(ch)):
		return
	souls[ch] = true
	SOULFX.append({"ch": ch, "x": x, "y": y, "t": 0.0})
	sfx.play("soft", -8, 1.6)

func kill_enemy(e: Dictionary, how: String) -> void:
	if not e.alive:
		return
	e.alive = false
	take_souls_of(e.node if e.has("node") else {"ch": e.ch, "parts": []}, e.x, e.y)
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
## 夜（決戦の闇）では、藍・墨・朱の演出を明るい色に置きかえて見えるようにする
func nc(c: Color) -> Color:
	if night < 0.5:
		return c
	if c.r == KD.AI.r and c.g == KD.AI.g and c.b == KD.AI.b:
		return Color(KD.AIN.lightened(0.35), c.a)
	if c.r == KD.SUMI.r and c.g == KD.SUMI.g and c.b == KD.SUMI.b:
		return Color(KD.WASHI, c.a)
	if c.r == KD.SHU.r and c.g == KD.SHU.g and c.b == KD.SHU.b:
		return Color(KD.SHU.lightened(0.3), c.a)
	return c

func grove_max() -> int:
	return 4 + Lw("木") * 2

## 木・林・森は植えた時に決まる（強化すると林が、さらに強化すると森が生まれる）
func grove_stage(g: Dictionary) -> int:
	return int(g.get("st", 0))

func grove_r(g: Dictionary) -> float:
	var grow: float = min(1.0, g.t / 0.9)
	return [24.0, 38.0, 54.0][grove_stage(g)] * SF * (1.0 + Lw("木") * 0.05) * grow

func plant_tree(p: Vector2) -> void:
	var lk: int = Lw("木")
	var st: int = 0
	# 林と合わさっていれば林、森と合わさっていれば森が生まれる
	if L("森") > 0:
		st = 2 if randf() < 0.6 else 1
	elif (L("林") > 0 or L("焚") > 0 or L("禁") > 0) and randf() < 0.6:
		st = 1
	GROVE.append({"x": p.x, "y": p.y, "t": 0.0, "life": 26.0 + lk * 5.0, "spread": false, "hitp": 0.0, "st": st})
	# 植えすぎたら古い木から枯れる
	var lim: int = grove_max()
	while GROVE.size() > lim:
		GROVE.pop_front()
	pass  # 出どころの分からない輪は出さない

## いまの景（ステージ）: 0 森林 → 1 大河 → 2 王城
## 景の部首: これがはがれると、同じ部首を持つ字へ連鎖する
func stage_radicals() -> Array:
	var st = KD.D.get("STAGES", [])
	if st.is_empty():
		return []
	return st[stage_i()].get("radicals", [])

## 部首の連鎖: 画面の中で同じ部首を持つ字を、近い順に次々と崩す
func chain_radical(rad: String, from: Dictionary) -> void:
	var o = Vector2(from.x, from.y)
	var list = E.filter(func(x): return x.alive and x != from and not x.is_boss and not x.locked and x.typed == "" and on_view(x.x, x.y, 20) and x.node.parts.any(func(q): return q.ch == rad))
	if list.is_empty():
		return
	list.sort_custom(func(a, b): return Vector2(a.x, a.y).distance_squared_to(o) < Vector2(b.x, b.y).distance_squared_to(o))
	var prev = o
	var n = 0
	for x in list.slice(0, 14):
		var pp = prev
		var dl: float = 0.07 * n
		later(dl, _chain_hit.bind(x, pp, rad, n))
		prev = Vector2(x.x, x.y)
		n += 1
	var cnt: int = n
	later(0.07 * n, func(): add_text(o.x, o.y - 70 * SF, rad + " 連鎖 ×%d" % (cnt + 1), 20 * SF + 6, KD.SHU, 1.2))
	combo += n
	max_combo = max(max_combo, combo)

func _chain_hit(x: Dictionary, pp: Vector2, rad: String, n: int) -> void:
	if not x.alive:
		return
	slash(pp.x, pp.y, x.x, x.y, false)
	break_part(x, 0.0, -1.0, "chain", rad)
	sfx.play("slash", -10, 1.2 + n * 0.04)

func stage_i() -> int:
	return min(boss_idx, KD.D.get("STAGES", []).size() - 1)

func plants_now() -> Array:
	var st = KD.D.get("STAGES", [])
	if st.size() and st[stage_i()].has("plants"):
		return st[stage_i()].plants
	return PLANTS

## 次の景へ: 野の草木を入れかえ、景の名を出す
func enter_stage() -> void:
	var st = KD.D.get("STAGES", [])
	if boss_idx >= st.size():
		return
	for e in E:
		if e.alive and e.get("still", false) and e.get("obj", "") == "" and not on_view(e.x, e.y, 80):
			e.alive = false
			if e.has("spr") and is_instance_valid(e.spr):
				e.spr.visible = false
	# 見えている所の草木はそのまま、これから行く所は新しい景の草木になる
	var cc = Vector2i(floori(cam.x / CHS()), floori(cam.y / CHS()))
	chunks = {}
	for dx in range(-1, 2):
		for dy in range(-1, 2):
			chunks[cc + Vector2i(dx, dy)] = true
	var sd: Dictionary = st[boss_idx]
	later(3.6, func(): show_banner(sd.title, sd.en))

func sun_r() -> float:
	return (90 + Lw("日") * 24) * SF

func blade_n() -> int:
	return 1 + int(L("刀") / 2)

func blade_r() -> float:
	return (50 + L("刀") * 2) * SF

func blade_a(j: int, nb: int) -> float:
	return time * (3.0 + L("刀") * 0.25) + TAU * j / nb

func moon_r() -> float:
	return (72.0 + Lw("月") * 14) * SF

func ally_ids() -> Array:
	return owned.keys().filter(func(id): return not absorbed.has(id) and (KD.D.WEAP.has(id) or not KD.fuse_of(id).is_empty()))

func body_ids() -> Array:
	var out = ally_ids().filter(func(id): return not KD.NOBODY.has(id))
	for id in KD.COMPANION:
		if L(id) > 0:
			out.append(id)
	return out

func AP(id: String) -> Vector2:
	if ALLY.has(id):
		return Vector2(ALLY[id].x, ALLY[id].y)
	if (id == "日" or id == "月") and ALLY.has("明"):
		return Vector2(ALLY["明"].x, ALLY["明"].y)
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
	# 刀は飛んでいかない。主人公の体に沿って回る刀（weapons）だけになる
	var ids = body_ids().filter(func(x): return x != "刀" and x != "木")
	for k in ALLY.keys():
		if not ids.has(k):
			if ALLY[k].has("spr"):
				ALLY[k].spr.queue_free()
			ALLY.erase(k)
	var fd: Vector2 = hero.last_dir
	var i = 0
	for id in ids:
		if not ALLY.has(id):
			var rv0 = REVIVE.filter(func(r): return r.ch == id)
			var sp0: Vector2 = rv0[0].p if rv0.size() else Vector2(hero.x - fd.x * 60 * SF + rnd(-20, 20), hero.y - fd.y * 60 * SF + rnd(-20, 20))
			ALLY[id] = {"x": sp0.x, "y": sp0.y, "vx": 0.0, "vy": 0.0, "t": rnd(0, 9), "ph": rnd(0, 6), "dash": null, "cd": 1.0, "grow": 0.0, "wilt": 0.0, "hold": null, "latched": false, "bite": 1.2, "dt": 0.0}
			ALLY[id].spr = _ally_sprite(id)
		var a: Dictionary = ALLY[id]
		a.t += dt
		a.hitp = max(0.0, a.get("hitp", 0.0) - dt * 4.0)
		if reviving(id):
			continue
		# 仲間は主人公のまわりの決まった位置について回る（主人公とは重ならない）
		var sang: float = TAU * i / max(1, ids.size()) + time * 0.25
		var tx: float = hero.x + cos(sang) * 125 * SF
		var ty: float = hero.y - 20 * SF + sin(sang) * 75 * SF
		var k = 5.0
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
		if id == "日" or id == "明":
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
			tx = hero.x + cos(time * 0.9 + a.ph) * 46 * SF; ty = hero.y - 18 * SF + sin(time * 0.9 + a.ph) * 30 * SF; k = 7
		elif id == "犬":
			# 一度噛みついたら戻らない。噛みついている字は動けない。0.5秒後に最初の一噛み、以後 0.8秒÷レベル ごと。画面内の字なら追いかける
			var ok = func(e): return e != null and e.alive and not e.is_boss and not e.gift and not e.captive and not e.locked and not e.get("still", false) and not e.get("shot", false)
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
						pass  # 出どころの分からない輪は出さない
						if randf() < 0.5:
							sfx.play("soft", -20, rnd(1.5, 1.8))
						e.eat_cd = 0.0
						a.hitp = 1.0
						var du = Vector2(e.x - a.x, e.y - a.y).normalized()
						e.kx += du.x * 320; e.ky += du.y * 320
						dmg_tag = "犬"
						eat_letter(e, 1, max(1, L("犬")))
						dmg_tag = ""
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
			var spec: Array = {"刀": [150 + min(L("刀"), 5) * 30, 1.5 * pow(0.85, L("刀") - 1), 1000, 6], "馬": [300, 3.2 / max(1, L("馬")), 1100, 4], "鳥": [320, 2.6 / max(1, L("鳥")), 1000, 4]}[id]
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
							pass  # 出どころの分からない輪は出さない
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
	# 火: 主人公の通った軌跡がそのまま燃え続ける（突っ込んだ道筋は火の帯になる）
	var lf: int = Lw("火")
	if lf:
		var cur = Vector2(hx, hy)
		if not hero.has("fire_last"):
			hero.fire_last = cur
		var seg: Vector2 = cur - hero.fire_last
		# Lv1は火がまばらで短命。強化するほど密に、長く燃える
		var stp: float = max(30.0, 56.0 - lf * 4.0) * SF
		var nseg: int = int(seg.length() / stp)
		if seg.length() > 600 * SF:
			hero.fire_last = cur
			nseg = 0
		for j in min(nseg, 40):
			var fp: Vector2 = hero.fire_last + seg.normalized() * stp * (j + 1)
			# 軌跡の火は長く燃え残り、追ってくる字が踏み込む
			var lfx: float = 2.6 + lf * 0.4
			ROT.append({"x": fp.x + rnd(-6, 6) * SF, "y": fp.y + rnd(-6, 6) * SF, "r": (24 + lf * 4) * SF, "life": lfx, "max": lfx, "tk": 0.0, "fire": true, "trail": true})
		if nseg > 0:
			hero.fire_last += seg.normalized() * stp * nseg
	if lf >= 4 and tick("hi_ring", dt, 3.6 - lf * 0.2):
		var nf: int = 6 + lf
		var Rf: float = (110 + lf * 12) * SF
		for j in nf:
			var an = TAU * j / nf + time
			ROT.append({"x": hx + cos(an) * Rf, "y": hy + sin(an) * Rf * 0.8, "r": (46 + lf * 6) * SF, "life": 1.2, "max": 1.2, "tk": 0.0, "fire": true})
		pass  # 出どころの分からない輪は出さない
		sfx.play("soft", -6, 0.7)
	# 燃えている字: 0.5秒ごとに末尾を焼き、近くの字へ燃え移る
	if lf and tick("hi_burn", dt, 0.5):
		var burning = E.filter(func(e): return e.alive and e.get("burn", 0.0) > 0)
		for e in burning:
			dmg_enemy(e, 1, "火")
			if randf() < 0.3 + lf * 0.04:
				for o in E:
					if o.alive and o != e and not o.is_boss and not o.get("still", false) and o.get("burn", 0.0) <= 0 and Vector2(o.x - e.x, o.y - e.y).length() < (80 + lf * 6) * SF:
						o.burn = 1.6 + lf * 0.2
						BOLT.append({"pts": [Vector2(e.x, e.y), Vector2(o.x, o.y)], "life": 0.2, "max": 0.2, "ray": true, "w": 0.3, "c": KD.SHU})
						break
	for e in E:
		if e.get("burn", 0.0) > 0:
			e.burn = max(0.0, e.burn - dt)
	# 矢: 狙わない。左・右と順番に、真横へ放つ（Lvが上がると本数が増えて縦に並ぶ）
	var ly: int = L("矢")
	if ly and tick("ya", dt, 0.6 * pow(0.88, ly - 1)):
		var ap = AP("矢")
		var sd: float = -1.0 if int(timers.get("ya_side", 0.0)) % 2 == 0 else 1.0
		timers["ya_side"] = timers.get("ya_side", 0.0) + 1.0
		var na: int = 1 + int((ly - 1) / 2) + (1 if ly >= 8 else 0)
		pass  # 出どころの分からない輪は出さない
		sfx.play("tick", -8, 1.4)
		for j in na:
			var oy: float = (j - (na - 1) / 2.0) * 22 * SF
			PROJ.append({"k": "ya", "x": ap.x + sd * 18 * SF, "y": ap.y + oy, "vx": sd * 900 * SF, "vy": 0.0, "dm": 3, "pierce": 1 + int(ly / 2), "hit": [], "life": 1.1})
	# 水: 足元から波紋。字を押し返して守る
	var lw: int = Lw("水")
	if lw and tick("mizu", dt, 4.5 * pow(0.86, lw - 1)):
		var ap2 = AP(water_id())
		wave_rings.append({"x": ap2.x, "y": ap2.y, "r": 0.0, "R": (200 + lw * 45) * SF, "hit": [], "dm": 2 + lw})
		# 足元から水しぶきが跳ねる
		for k in 14:
			var an = rnd(PI * 1.05, PI * 1.95)
			P.append({"k": "ink", "x": ap2.x + rnd(-12, 12) * SF, "y": ap2.y + 10 * SF, "vx": cos(an) * rnd(80, 220), "vy": sin(an) * rnd(160, 320), "life": 0.5, "max": 0.5, "s": rnd(2.0, 3.5) * SF, "c": KD.AI})
		if lw >= 5:
			wave_rings.append({"x": hx, "y": hy, "r": -60.0 * SF, "R": (200 + lw * 45) * SF, "hit": [], "dm": 2 + lw})
		sfx.play("soft", -6)
	for w in wave_rings:
		w.r += dt * 480 * SF
		for e in E:
			if e.alive and not e.is_boss and not w.hit.has(e.id):
				var ev = Vector2(e.x - w.x, e.y - w.y)
				if w.r > 0 and abs(ev.length() - w.r) < e.rad + 14:
					w.hit.append(e.id)
					var u = ev.normalized()
					e.kx += u.x * (140 + lw * 15); e.ky += u.y * (140 + lw * 15)
					e.slow = max(e.slow, 0.6)
					dmg_enemy(e, w.dm, "水")
	wave_rings = wave_rings.filter(func(w): return w.r < w.R)
	# 木: 攻撃しない。主人公と字の群れの間に木を植え、長く残る壁にする。木は育って林・森になり、森は隣に苗を伸ばす
	var lk: int = Lw("木")
	if lk and tick("ki", dt, max(1.6, 6.0 - lk * 0.5) * (0.6 if L("村") > 0 else 1.0)):
		var tgt = nearest(Vector2(hx, hy), 600 * SF)
		var dirk: Vector2 = (Vector2(tgt.x, tgt.y) - Vector2(hx, hy)).normalized() if tgt != null else Vector2.from_angle(rnd(0, TAU))
		for tries in 4:
			var pp: Vector2 = Vector2(hx, hy) + dirk.rotated(rnd(-0.6, 0.6)) * rnd(90, 140) * SF
			if GROVE.all(func(g): return pp.distance_to(Vector2(g.x, g.y)) > 70 * SF):
				plant_tree(pp)
				break
	for g in GROVE:
		g.t += dt
		if g.t > 6.0 and not g.spread:
			# 木は勝手に育たない。かわりに、しばらくすると隣に木がもう一本生える（だんだん増える）
			g.spread = true
			# 縦に伸びる: 上か下に次の木が生え、縦の並木になる
			var sp2 = Vector2(g.x + rnd(-8, 8) * SF, g.y + (-1.0 if randf() < 0.5 else 1.0) * (grove_r(g) * 2.0 + 26 * SF))
			plant_tree(sp2)
		var R: float = grove_r(g)
		if g.t > g.life - 2.0:
			continue   # 枯れかけの木は字を止めない
		for e in E:
			if not e.alive or e.is_boss or e.get("still", false) or e.captive:
				continue
			var dv = Vector2(e.x - g.x, e.y - g.y)
			var dd: float = dv.length()
			var lim: float = R + e.rad * 0.8
			if dd < lim:
				# 木に触れた字は大きく弾き飛ばされ、木は身代わりに砕けて消える（傷はつけない）
				var u = dv / max(dd, 0.01) if dd > 0.01 else Vector2.RIGHT
				e.kx = u.x * 320; e.ky = u.y * 320
				e.daze = max(e.daze, 0.6)
				# 結びついた字の力
				if L("禁") > 0:
					e.daze = max(e.daze, 2.5)
					e.slow = max(e.slow, 3.0)
				if L("焚") > 0:
					e.burn = max(e.get("burn", 0.0), 3.0)
				if L("東") > 0:
					dmg_enemy(e, 1, "東")
				if L("相") > 0:
					for o in others(e, 110 * SF, Vector2(e.x, e.y)):
						var uo = (Vector2(o.x, o.y) - Vector2(g.x, g.y)).normalized()
						o.kx += uo.x * 220; o.ky += uo.y * 220
				g.hits = g.get("hits", 0) + 1
				if L("禁") > 0 and g.hits < 3:
					break
				if L("果") > 0:
					add_gem(g.x, g.y, 2.0 * HS.xp)
				g.life = min(g.life, g.t)
				pass  # 出どころの分からない輪は出さない
				shatter(g.x, g.y, ["木", "林", "森"][grove_stage(g)], R * 2.0, 0.6, KD.AI)
				sfx.play("thud", -8, 1.2)
				break
	for g in GROVE:
		g.hitp = max(0.0, g.get("hitp", 0.0) - dt * 3)
	GROVE = GROVE.filter(func(g): return g.t < g.life)
	# 日: 陽光の結界。広く焼き、Lv5から陽の光線が四方に走る
	var ls: int = Lw("日")
	if ls and tick("hi", dt, 0.4 * pow(0.9, ls - 1)):
		var ap4 = AP("日")
		var R = sun_r()
		for e in E:
			if e.alive and Vector2(e.x, e.y).distance_to(Vector2(hx, hy)) < R + e.rad:
				dmg_enemy(e, 1, "日")
	if ls >= 5 and tick("hi_ray", dt, 2.2 - ls * 0.1):
		var ap8 = AP("日")
		var nr: int = 3 + int((ls - 5) / 1)
		for j in nr:
			var an = TAU * j / nr + time * 0.7
			var d8 = Vector2(cos(an), sin(an))
			BOLT.append({"pts": [ap8, ap8 + d8 * max(W, H)], "life": 0.3, "max": 0.3, "ray": true})
			for e in E:
				if e.alive and not e.is_boss and on_view(e.x, e.y):
					var rel = Vector2(e.x, e.y) - ap8
					if rel.dot(d8) > 0 and abs(rel.cross(d8)) < e.rad + 18 * SF:
						dmg_enemy(e, 5, "日")
		sfx.play("soft", -8, 1.5)
	# 月: 主人公のそばに浮かび、月光の小さな輪の中の字を素早く削り続ける（日より狭く、ずっと速い）
	if Lw("月") and tick("tsuki", dt, 0.12 * pow(0.92, Lw("月") - 1)):
		var ap5 = AP("月")
		var Rm: float = moon_r()
		for e in E:
			if e.alive and not e.is_boss and Vector2(e.x, e.y).distance_to(ap5) < Rm + e.rad * 0.6:
				dmg_enemy(e, 1, "月")
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
	# 刀: 主人公の周りを刀が回り、触れた字を斬る（主人公を守る）
	var lb: int = L("刀")
	if lb:
		var nb: int = blade_n()
		var Rb: float = blade_r()
		for j in nb:
			var an = blade_a(j, nb)
			var bp = Vector2(hx + cos(an) * Rb, hy + sin(an) * Rb)
			for e in E:
				if e.alive and not e.is_boss and Vector2(e.x - bp.x, e.y - bp.y).length() < e.rad + 30 * SF:
					if not e.has("cdt") or time >= float(e.cdt.get("刀", -1.0)):
						var u3 = (Vector2(e.x, e.y) - Vector2(hx, hy)).normalized()
						e.kx += u3.x * 90; e.ky += u3.y * 90
						dmg_enemy(e, 4, "刀")
						if randf() < 0.5:
							SL.append({"a": Vector2(e.x - u3.y * 44 * SF, e.y + u3.x * 44 * SF), "c": Vector2(e.x + u3.x * 10 * SF, e.y + u3.y * 10 * SF), "b": Vector2(e.x + u3.y * 44 * SF, e.y - u3.x * 44 * SF), "life": 0.2, "max": 0.2, "w": 9.0 * SF, "boss": false, "cut": true, "seed": randi()})
	# 戌: 鉞（まさかり）を振り下ろす
	var lj: int = L("戌")
	if lj and tick("jutsu", dt, 1.8 * pow(0.8, lj - 1)):
		var apj = AP("戌")
		var tj = nearest(apj, 280 * SF)
		if tj != null:
			slash(apj.x, apj.y - 30 * SF, tj.x, tj.y, false)
			dmg_enemy(tj, 5, "戌")
			sfx.play("slash", -9, 0.8)
	# 口: かみつく
	var lq: int = L("口")
	if lq and tick("kuchi", dt, 1.3 * pow(0.8, lq - 1)):
		var apq = AP("口")
		var tq = nearest(apq, 230 * SF)
		if tq != null:
			BOLT.append({"pts": [apq, Vector2(tq.x, tq.y)], "life": 0.15, "max": 0.15, "ray": true, "w": 0.25, "c": KD.SHU})
			dmg_enemy(tq, 1, "口")
	# 明: 日と月がひとつに。5秒ごとに画面中の字を照らす
	if L("明") and tick("mei", dt, 5.0):
		flash = max(flash, 0.35)
		flash_col = KD.KIN
		for e in E:
			if e.alive and not e.is_boss and on_view(e.x, e.y):
				dmg_enemy(e, 1, "明")
		sfx.play("zap", -8, 1.4)
	# 烕: 火が消える。2.5秒ごとに一番近い字を丸ごと消し去る
	if L("烕") and tick("metsu", dt, 2.5):
		var ape = AP("烕")
		var te = nearest(ape, 420 * SF)
		if te != null and not te.is_boss and te.get("obj", "") == "" and not te.captive:
			BOLT.append({"pts": [ape, Vector2(te.x, te.y)], "life": 0.3, "max": 0.3, "ray": true, "w": 0.4, "c": KD.SHU})
			for k in 16:
				var an = rnd(0, TAU)
				P.append({"k": "ink", "x": te.x, "y": te.y, "vx": cos(an) * 60, "vy": sin(an) * 60 - 80, "life": 0.9, "max": 0.9, "s": rnd(3, 6) * SF, "c": KD.SUMI})
			add_text(te.x, te.y - te.size * 0.6, "烕", 26 * SF, KD.SHU, 0.8)
			dmg_by["烕"] = dmg_by.get("烕", 0) + String(te.word).length()
			kill_enemy(te, "weapon")
			sfx.play("boom", -12, 1.6)
	# 咸: 「みな」。4秒ごとに画面中のすべての字の末尾を1文字削る
	if L("咸") and tick("kan", dt, 4.0):
		add_text(hx, hy - 90 * SF, "咸", 34 * SF, KD.KIN, 0.8)
		for e in E:
			if e.alive and not e.is_boss and on_view(e.x, e.y):
				dmg_enemy(e, 1, "咸")
		sfx.play("gong", -14, 1.3)
	# 解き放ったひらがな: 戦わない。舞い上がって空へ帰っていく
	for kv in KANA:
		kv.t += dt
		kv.x += sin(kv.t * 3 + kv.a) * 30 * dt
		kv.y -= (40 + kv.t * 60) * SF * dt
	KANA = KANA.filter(func(kv): return kv.t < 3.0)
	# 休: 木のそばで休むと命が戻る
	if L("休") and tick("kyu", dt, 20.0) and hp < max_hp and GROVE.any(func(g): return Vector2(g.x - hx, g.y - hy).length() < 180 * SF):
		hp += 1
		add_text(hx, hy - 60 * SF, "休", 24 * SF, KD.AI, 0.8)
	# 減: 3秒ごとに画面中の字の英単語を1文字ずつ減らす
	if L("減") and tick("gen", dt, 3.0):
		add_text(AP("減").x, AP("減").y - 50 * SF, "減", 28 * SF, KD.AI, 0.7)
		for e in E:
			if e.alive and not e.is_boss and on_view(e.x, e.y):
				dmg_enemy(e, 1, "減")
	# 滅: 1.4秒ごとに一番近い字を丸ごと滅ぼし、周りの字も崩す
	if L("滅") and tick("metsu2", dt, 1.4):
		var apm2 = AP("滅")
		var tm = nearest(apm2, 460 * SF)
		if tm != null and not tm.is_boss and tm.get("obj", "") == "" and not tm.captive:
			BOLT.append({"pts": [apm2, Vector2(tm.x, tm.y)], "life": 0.3, "max": 0.3, "ray": true, "w": 0.6, "c": KD.AIN})
			add_text(tm.x, tm.y - tm.size * 0.6, "滅", 30 * SF, KD.SHU, 0.8)
			for o in others(tm, 150 * SF, Vector2(tm.x, tm.y)):
				break_part(o, 0.0, -1.0, "weapon")
			dmg_by["滅"] = dmg_by.get("滅", 0) + String(tm.word).length()
			kill_enemy(tm, "weapon")
			shake = max(shake, 6 * shake_k())
			sfx.play("boom", -10, 1.2)
	# 雨: 雲の近くの字を狙って降り、濡らす
	var lr: int = L("雨")
	if lr and tick("ame", dt, 0.24 * pow(0.82, lr - 1)):
		var ap6 = AP("雨")
		for j in 1 + int(lr / 3):
			var x6: float = ap6.x + rnd(-38 - lr * 8, 38 + lr * 8) * SF
			var y6: float = ap6.y + rnd(95, 160) * SF
			P.append({"k": "drop", "x": x6, "y": ap6.y + 12 * SF, "ty": y6, "vx": 0.0, "vy": 760.0, "life": 1.0, "max": 1.0, "s": 2.0, "c": KD.SUMI, "dm": 2})
	# 田: 地面に罠が刻まれる
	var lt: int = L("田")
	if lt and tick("ta", dt, 3.2 * pow(0.9, lt - 1)):
		for j in 1 + int(lt / 2):
			var vis = E.filter(func(e): return e.alive and not e.is_boss and on_view(e.x, e.y))
			var ap7 = AP("田")
			var t7 = vis.pick_random() if vis.size() else null
			TRAP.append({"x": t7.x if t7 != null else ap7.x + rnd(-150, 150) * SF, "y": t7.y if t7 != null else ap7.y + rnd(-150, 150) * SF, "life": 6.0, "max": 6.0, "s": (64 + lt * 8) * SF, "tk": 0.0})
	for tr in TRAP:
		tr.life -= dt
		tr.tk -= dt
		var hit: bool = tr.tk <= 0
		if hit:
			tr.tk = 0.35
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
	if state == "intro":
		intro_t += dt
		_intro_sounds()
		if intro_t > INTRO_LEN:
			to_title()
	for f in FUSE_FX:
		f.t += dt
	for rv in REVIVE:
		rv.t += dt
	REVIVE = REVIVE.filter(func(rv): return rv.t < 1.5)
	for so in SOULFX:
		so.t += dt
	SOULFX = SOULFX.filter(func(so): return so.t < 1.3)
	FUSE_FX = FUSE_FX.filter(func(f): return f.t < 1.6)
	if cine != null:
		cine.t += dt
		if cine.t >= cine.dur:
			_end_cine()
	var sdt = dt
	if hitstop > 0:
		hitstop -= dt
		sdt = 0.0
	if test_mode.has("nopaper"):
		bg.visible = false
	var _t0 = Time.get_ticks_usec()
	update(sdt, dt)
	var _t1 = Time.get_ticks_usec()
	var sh = Vector2(randf() - 0.5, randf() - 0.5) * shake
	shake_off = sh
	_sync_visuals(dt)
	_sync_monster()
	DrawLayer.prof["update"] = DrawLayer.prof.get("update", 0) + _t1 - _t0
	DrawLayer.prof["sync"] = DrawLayer.prof.get("sync", 0) + Time.get_ticks_usec() - _t1
	DrawLayer.prof["frames"] = DrawLayer.prof.get("frames", 0) + 1
	sfx.set_night(night)
	bg_mat.set_shader_parameter("cam", cam)
	bg_mat.set_shader_parameter("night", night)
	bg_mat.set_shader_parameter("time", ui_time)
	bg_mat.set_shader_parameter("calm", 1.0 if calm else 0.0)
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
	# 後半の景（大河・王城）では、ときどき囚われのひらがなの檻が現れる
	tick_rivers(dt)
	# （囚われのひらがなは、物語の終盤の分岐イベントで使う。野には出さない）
	if false and boss == null and stage_i() >= 1 and tick("kana_ev", dt, 38.0) and not E.any(func(e): return e.alive and e.get("obj", "") == "kana"):
		spawn_kana_cage()
	for d in DIRS:
		d.cd = max(0.0, d.cd - dt)
	spawn_t -= dt
	if spawn_t <= 0:
		do_spawn()
	if boss != null:
		tick_boss(dt)
	tick_oni(dt)
	tick_hero(dt)
	if has_form("休") and not rest_charged:
		rest_t += dt
		if rest_t >= 3:
			rest_charged = true
			sfx.play("lv", -8)
			add_text(hero.x, hero.y - 60 * SF, "休 — 力が満ちた", 18 * SF + 6, KD.KIN, 1.0)
	tick_teaser(dt)
	tick_groups(dt)
	for r in ROT:
		r.life -= dt
		r.tk -= dt
		var now: bool = r.tk <= 0
		if now:
			r.tk = 0.25 if r.has("fire") else 1.0
		if now:
			for e in E:
				if e.alive and Vector2(e.x - r.x, e.y - r.y).length() < r.r + e.rad:
					dmg_enemy(e, 3, "火" if r.has("fire") else "")
					if r.has("fire") and not e.is_boss:
						# 火に触れた字は燃え移る（しばらく燃え続け、近くの字へ延焼する）
						e.burn = max(e.get("burn", 0.0), 2.0 + Lw("火") * 0.3)
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
		if e.get("shot", false):
			# 怪物が撃った字: まっすぐ飛び、だんだん速くなる
			e.sv = min(230.0 * SF, e.sv + 120.0 * SF * dt)
			var sm: float = 0.45 if e.slow > 0 else 1.0
			e.x += (e.svx * e.sv * sm + e.kx) * dt
			e.y += (e.svy * e.sv * sm + e.ky) * dt
			e.kx *= pow(0.07, dt)
			e.ky *= pow(0.07, dt)
			e.tilt = sin(e.t * 6) * 0.15
			if Vector2(hero.x - e.x, hero.y - e.y).length() < e.rad + hero_r():
				if hero.inv <= 0 and hero.state != "dash":
					hurt(e)
					e.alive = false
					shatter(e.x, e.y, e.ch, e.size, 0.6, KD.SHU)
			if e.t > 10:
				e.alive = false
			continue
		if e.get("still", false):
			# 野の字は根を張って動かない
			e.rest = max(0.0, e.get("rest", 0.0) - dt)
			e.kx = 0.0; e.ky = 0.0; e.vx = 0.0; e.vy = 0.0
			continue
		var sp: float = e.spd * (0.45 if e.slow > 0 else 1.0) * (0.3 if e.locked else 1.0) * (0.15 if e.daze > 0 else 1.0)
		var v = u * sp
		if e.beh == "root" and not e.has("grp"):
			# 草木は歩かない: 根を張ってじっとし、地にもぐっては一歩先に生え直す
			var C: float = 2.4
			e.rc = e.get("rc", rnd(0.0, C)) + dt * (0.45 if e.slow > 0 else 1.0)
			var ph: float = fmod(e.rc, C)
			e.sink = 0.0
			if ph > 1.6 and ph < 1.9:
				e.sink = (ph - 1.6) / 0.3
			elif ph >= 1.9 and ph < 2.2:
				e.sink = 1.0 - (ph - 1.9) / 0.3
			if ph >= 1.9 and not e.get("moved", false):
				e.moved = true
				var stp: float = min(e.spd * C * 1.1, max(0.0, d - e.rad - hero_r() - 10 * SF))
				if not e.locked and e.daze <= 0:
					e.x += u.x * stp
					e.y += u.y * stp
				pass  # 出どころの分からない輪は出さない
				for k in 6:
					var an = rnd(PI, TAU)
					P.append({"k": "ink", "x": e.x + rnd(-1, 1) * e.size * 0.3, "y": e.y + e.size * 0.4, "vx": cos(an) * 80, "vy": sin(an) * 120, "life": 0.4, "max": 0.4, "s": 2.4 * SF, "c": KD.SUMI})
			elif ph < 1.9:
				e.moved = false
			v = Vector2.ZERO
		if e.beh == "fly" or e.beh == "swarmling":
			var o = cos(e.t * 3.2) * sp * 1.1
			v += Vector2(-u.y, u.x) * o
		if e.beh == "zig":
			e.zig_t -= dt
			if e.zig_t <= 0:
				e.zig_t = rnd(0.4, 0.8)
				e.zs *= -1
			v += Vector2(-u.y, u.x) * sp * 1.4 * e.zs
		if e.get("fmove", false):
			v = Vector2.ZERO
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
	if b.fx == "frost":
		for e in E:
			if e.alive and not e.is_boss:
				e.slow = 0.2
	taiko_t -= dt
	if taiko_t <= 0:
		taiko_t = 0.7 if oni != null and oni.st != "walk" else 1.4
		sfx.play("taiko", -9)

## 無敵の蚩尤: 追いかけ、ときどき身構えて突進する。触れると命が減る。林や森は通れない
func tick_oni(dt: float) -> void:
	if oni == null:
		return
	var o: Dictionary = oni
	o.t += dt
	o.fl = max(0.0, o.fl - dt * 2)
	if o.has("dead"):
		o.dead += dt
		if o.dead > 1.9:
			oni = null
		return
	# 蚩尤は攻撃しない。画面の奥に立つ巨大な背景（画面に張り付く）
	o.x = cam.x
	o.y = cam.y + poem_layout().bottom * 0.25
	o.st = "walk"
	return
	if boss_intro > 0:
		return
	o.daze = max(0.0, o.daze - dt)
	o.bite_t = max(0.0, o.bite_t - dt)
	var dv = Vector2(hero.x - o.x, hero.y - o.y)
	var d: float = max(1.0, dv.length())
	var u = dv / d
	var spd: float = (60.0 + min(boss_idx, 5) * 6) * SF * (1 + time / 900.0)
	var v = Vector2.ZERO
	o.st_t -= dt
	match o.st:
		"walk":
			v = u * spd * (0.1 if o.daze > 0 else 1.0)
			if o.st_t <= 0 and o.daze <= 0 and d < 540 * SF:
				o.st = "wind"
				o.st_t = 0.8
				o.ldir = u
				sfx.play("warn", -6)
		"wind":
			if o.st_t > 0.35:
				o.ldir = u
			if o.st_t <= 0:
				o.st = "lunge"
				o.st_t = 0.45
				sfx.play("dash", -2, 0.6)
		"lunge":
			v = o.ldir * 600 * SF
			if o.st_t <= 0:
				o.st = "walk"
				o.st_t = rnd(3.5, 5.5)
	o.x += (v.x + o.kx) * dt
	o.y += (v.y + o.ky) * dt
	o.kx *= pow(0.05, dt)
	o.ky *= pow(0.05, dt)
	# 木・林・森・竹は通さない（突進もそこで止まる）。草・花・禾は踏みつぶす
	for e in E:
		if not e.alive or e.is_boss:
			continue
		var pd = Vector2(o.x - e.x, o.y - e.y)
		var mm: float = o.rad * 0.8 + e.rad
		if abs(pd.x) > mm or abs(pd.y) > mm:
			continue
		var pl = pd.length()
		if pl >= mm or pl < 0.01:
			continue
		if e.get("still", false) and e.get("obj", "") == "":
			if ["草", "花", "禾"].has(String(e.ch)):
				e.alive = false
				shatter(e.x, e.y, e.ch, e.size, 0.5, ink_col())
			else:
				o.x += pd.x / pl * (mm - pl)
				o.y += pd.y / pl * (mm - pl)
				if o.st == "lunge":
					o.st = "walk"
					o.st_t = rnd(3.0, 4.5)
					o.daze = 0.7
					shake = max(shake, 6 * shake_k())
					sfx.play("thud", -4)
		elif not e.get("still", false):
			e.x -= pd.x / pl * (mm - pl)
			e.y -= pd.y / pl * (mm - pl)
	# 触れると命が減る（駆けている間は当たらない）
	if d < o.rad + hero_r() and o.bite_t <= 0 and state == "play":
		var hp0 = hp
		hurt(o)
		if hp < hp0:
			o.bite_t = 1.5
			o.daze = 1.2
			o.st = "walk"
			o.st_t = max(o.st_t, 2.5)

func upd_camera(dt: float) -> void:
	# 主人公が中央の枠を出たら、少し遅れてついていく
	var dz: float = min(W, H) * (0.24 if calm else 0.14)
	var tau = 0.6 if calm else 0.32
	var target_off: float = poem_layout().bottom * 0.5 if boss != null else 0.0
	cam_off += (target_off - cam_off) * min(1.0, dt * 3)
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
	return []
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
	return []
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
		# 魂を手に入れた字（倒した字）だけを使役できる。命は例外
		if L(id) < int(KD.D.WEAP[id].max) and (souls.has(id) or id == "命"):
			cand.append({"t": "w", "id": id, "en": KD.D.WEAP[id].en, "w": 1.4})
	# 合体の素材: 持っている仲間の字と合わさる字（あと一つで合体できる字）を出やすくする
	var evo_ids = []
	for r in KD.fuse_rows():
		if L(r[0]) > 0:
			continue
		var ha: String = fuse_have(r[1])
		var hb: String = fuse_have(r[2])
		var need: Array = []
		if r[1] == r[2]:
			if L(r[1]) == 1:
				need.append(r[1])
		elif ha != "" and hb == "":
			need = Array(String(r[2]).split("|"))
		elif hb != "" and ha == "":
			need = Array(String(r[1]).split("|"))
		for m in need:
			if evo_ids.has(m) or not KD.fuse_of(m).is_empty():
				continue
			if not souls.has(m):
				continue
			if (KD.D.PARTS.has(m) and L(m) < 3) or (KD.D.WEAP.has(m) and L(m) < int(KD.D.WEAP[m].max)):
				evo_ids.append(m)
	var pool = []
	if evo_ids.size():
		var id: String = evo_ids.pick_random()
		# 最初の三択では、かならず犬が進化素材として出る
		pass
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
	# 犬（純粋な仲間。合体しない）も、倒して魂を手に入れたら三択に出る。最初に魂を得たら優先して出す
	if souls.has("犬") and L("犬") == 0 and not pool.any(func(q): return q.id == "犬"):
		if pool.size() >= 3:
			pool.pop_back()
		pool.insert(0, {"t": "p", "id": "犬", "en": "dog"})
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
		var head = ("%sの魂を使役 — " % p.id) if lv == 0 else ("Lv%d→%d　" % [lv, lv + 1])
		if lv > 0 and not ["命", "力"].has(p.id):
			head += "削る速さ ×%d→×%d　" % [lv, lv + 1]
		desc = head + KD.D.WEAP[p.id].d[min(lv, KD.D.WEAP[p.id].d.size() - 1)]
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
	# 仲間の合体の見込み
	var fz_lines = []
	for r in KD.fuse_rows():
		if L(r[0]) > 0:
			continue
		var sa: String = r[1]
		var sb: String = r[2]
		var other = ""
		if sa.split("|").has(p.id):
			other = fuse_have(sb) if sa != sb else (p.id if L(p.id) >= 1 else "")
		elif sb.split("|").has(p.id):
			other = fuse_have(sa)
		if other != "":
			fz_lines.append("仲間の合体: %s ＋ %s → %s（%s）" % [other, p.id, r[0], r[3]])
	if fz_lines.size():
		return {"desc": desc, "evo": true, "part": false, "evo_txt": "\n".join(fz_lines), "n": L(p.id)}
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
		if L(p.id) == 1 and p.id != "命" and (KD.D.WEAP.has(p.id) or KD.COMPANION.has(p.id)):
			start_revive(p.id)
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
		# 仲間どうしの合体（主人公の進化とは別の場面）: 手に入れた字と仲間の字が合わさる
		var fz: Array = find_ally_fuse(p.id)
		if fz.size():
			# よみがえりを見せてから合体する
			if reviving(p.id):
				later(1.4, do_ally_fuse.bind(fz))
			else:
				do_ally_fuse(fz)
			state = "play"
			return
		# 主人公は進化しない（ずっと象形文字）。育つのは仲間の字の合体だけ
	state = "play"

## ---- 字魂転生: 魂を得た字を、墨の淵から仲間としてよみがえらせる ----
func start_revive(ch: String) -> void:
	var an: float = rnd(0, TAU)
	var p = Vector2(hero.x + cos(an) * 110 * SF, hero.y + 40 * SF + sin(an) * 40 * SF)
	REVIVE.append({"ch": ch, "p": p, "t": 0.0})
	slow_t = max(slow_t, 0.8)
	sfx.play("gong", -6, 0.6)
	later(0.5, func(): sfx.play("brush", -4, 0.7))

func reviving(ch: String) -> bool:
	return REVIVE.any(func(r): return r.ch == ch and r.t < 1.4)

func _draw_revive(ci: CanvasItem) -> void:
	for r in REVIVE:
		var t: float = r.t
		var p: Vector2 = r.p
		var sz: float = 56 * SF
		# 墨の淵が地面に広がる
		var pool: float = _ease(clamp(t / 0.35, 0.0, 1.0)) * (1.0 - clamp((t - 1.2) / 0.3, 0.0, 1.0))
		var bt = art("blot%d" % (int(abs(p.x)) % 9))
		var pw: float = sz * 1.9 * pool
		ci.draw_texture_rect(bt, Rect2(p.x - pw / 2, p.y + sz * 0.35 - pw * 0.18, pw, pw * 0.36), false, Color(1, 1, 1, 0.9 * pool))
		# 淵の縁に、字を縛る朱の環がめぐる
		_dash_ellipse(ci, Vector2(p.x, p.y + sz * 0.42), sz * 1.0 * pool, sz * 0.22 * pool, Color(KD.SHU, 0.8 * pool), 2.5 * SF)
		# 字が淵から這い上がる（下から縦に伸びる）。罅（ひび）の入った黒い字
		var rise: float = _ease(clamp((t - 0.3) / 0.75, 0.0, 1.0))
		if rise > 0:
			var gy: float = p.y + sz * 0.42 - sz * 0.5 * rise
			glow(ci, Vector2(p.x, gy), sz * 1.1, Color(0.45, 0.2, 0.55, 0.35 * rise))
			glyph(ci, r.ch, Vector2(p.x, gy), sz, Color(0.12, 0.08, 0.14, 1.0), Color(KD.SHU, 0.8), 4, 0.0, Vector2(1.0, max(0.02, rise)))
			_draw_cracks(ci, Vector2(p.x, gy), sz * 0.5 * rise, hash(r.ch), 0.8 * rise)
		if t > 0.2 and t < 1.3:
			txt(ci, UF, p.x, p.y - sz * 1.15, "字魂転生", 12 * max(0.85, SF), Color(KD.SHU, 0.9 * min(1.0, (t - 0.2) / 0.2) * (1.0 - clamp((t - 1.1) / 0.2, 0.0, 1.0))), 1)
		if t > 1.05 and t < 1.3:
			glow(ci, Vector2(p.x, p.y - sz * 0.1), sz * 2.0, Color(0.6, 0.3, 0.75, (1.3 - t) / 0.25 * 0.5))

## よみがえった字の罅: 決まった形の稲妻のような朱の線
func _draw_cracks(ci: CanvasItem, c: Vector2, r: float, seed: int, a: float) -> void:
	var rng = RandomNumberGenerator.new()
	rng.seed = seed
	for k in 3:
		var an: float = rng.randf() * TAU
		var pts = PackedVector2Array([c + Vector2(cos(an), sin(an)) * r * 0.15])
		var pp: Vector2 = pts[0]
		for j in 3:
			an += rng.randf_range(-0.8, 0.8)
			pp += Vector2(cos(an), sin(an)) * r * 0.32
			pts.append(pp)
		ci.draw_polyline(pts, Color(KD.SHU, a), 1.6, true)

## ---- 仲間どうしの合体 ----
var FUSE_FX: Array = []

func fuse_have(spec: String) -> String:
	# 「A|B|C」のうち、いま持っている字（合体でできた字も含む）を返す
	for c in spec.split("|"):
		if L(c) > 0 and not absorbed.has(c):
			return c
	return ""

func find_ally_fuse(pid: String) -> Array:
	var best = []
	for r in KD.fuse_rows():
		var sa: String = r[1]
		var sb: String = r[2]
		if not sa.split("|").has(pid) and not sb.split("|").has(pid):
			continue
		if L(r[0]) > 0:
			continue
		var a: String = fuse_have(sa)
		var b: String = fuse_have(sb)
		if a == "" or b == "":
			continue
		if a == b and L(a) < 2:
			continue
		# 後ろの行ほど深い合体（水の系統など）。より深いものを選ぶ
		best = [r[0], a, b, r[3], r[4]]
	return best

func do_ally_fuse(r: Array) -> void:
	var a: String = r[1]
	var b: String = r[2]
	var pa: Vector2 = AP(a) if ALLY.has(a) else Vector2(hero.x - 140 * SF, hero.y - 60 * SF)
	var pb: Vector2 = AP(b) if ALLY.has(b) else Vector2(hero.x + 140 * SF, hero.y - 60 * SF)
	if a == b:
		pb = pa + Vector2(90 * SF, 0)
	# 合体は二つの仲間のあいだで起きる（主人公からは離れた所で）
	var mid: Vector2 = (pa + pb) / 2
	var away: Vector2 = mid - Vector2(hero.x, hero.y)
	if away.length() < 150 * SF:
		mid = Vector2(hero.x, hero.y) + (away.normalized() if away.length() > 1 else Vector2(0.6, -0.8)) * 150 * SF
	owned.erase(a)
	owned.erase(b)
	owned[r[0]] = 1
	if not got.has(r[0]):
		got.append(r[0])
	FUSE_FX.append({"a": a, "b": b, "res": r[0], "pa": pa, "pb": pb, "c": mid, "t": 0.0})
	# できた仲間はその場に生まれる
	later(0.9, _place_fused.bind(r[0], mid))
	slow_t = 1.1
	sfx.play("fuse", -6, 1.3)
	later(1.0, func(): show_banner(a + "＋" + b + "＝" + r[0], String(r[3]).to_upper() + " — " + r[4], false, true))
	# 合体でできた字が、主人公の進化の素材ならそのまま進化へ
	later(1.6, _after_fuse.bind(r[0]))

func _place_fused(id: String, p: Vector2) -> void:
	if ALLY.has(id):
		ALLY[id].x = p.x
		ALLY[id].y = p.y

func _after_fuse(res: String) -> void:
	# 主人公は進化しない。合体した字がさらに合体できるなら続けて合体する
	var fz: Array = find_ally_fuse(res)
	if fz.size() and state == "play":
		do_ally_fuse(fz)

func _draw_fuse_fx(ci: CanvasItem) -> void:
	_draw_revive(ci)
	# 囚われのひらがなの檻
	for e in E:
		if e.alive and e.get("obj", "") == "kana" and on_view(e.x, e.y, 20):
			var w: float = e.ch.length() * e.size + 30 * SF
			var h: float = e.size * 1.5
			var r = Rect2(e.x - w / 2, e.y - h * 0.55, w, h)
			ci.draw_rect(r, Color(KD.WASHI, 0.85))
			# 中で震えるひらがな
			for j in e.ch.length():
				var jx: float = e.x - (e.ch.length() - 1) * e.size * 0.5 + j * e.size + sin(ui_time * 13 + j) * 1.5
				glyph(ci, e.ch[j], Vector2(jx, e.y - e.size * 0.1), e.size * 0.95, KD.SHU, Color(KD.WASHI, 0.9), 4)
			for i in 7:
				var x: float = r.position.x + r.size.x * i / 6.0
				ci.draw_line(Vector2(x, r.position.y), Vector2(x, r.end.y), Color(KD.SUMI, 0.75), 3 * SF)
			ci.draw_rect(r, Color(KD.SUMI, 0.85), false, 4 * SF)
			glyph(ci, "囚", Vector2(e.x, r.position.y - 16 * SF), 22 * SF, KD.SHU, Color(paper_col(), 0.9), 3)
	# 解き放ったひらがな
	for kv in KANA:
		var bob: float = sin(ui_time * 3 + kv.a) * 3
		var fa: float = 1.0 - clamp((kv.t - 2.0) / 1.0, 0.0, 1.0)
		glyph(ci, kv.ch, Vector2(kv.x, kv.y + bob), 30 * SF, Color(KD.SHU, fa), Color(paper_col(), 0.9 * fa), 4)
	# よみがえった仲間には罅が残る
	for id in ALLY:
		if reviving(id):
			continue
		var a: Dictionary = ALLY[id]
		_draw_cracks(ci, Vector2(a.x, a.y), 22 * SF, hash(id), 0.55)
	# 魂: 壊した字から白い字が抜け出し、揺れながら主人公へ吸い込まれる
	for so in SOULFX:
		var k: float = clamp(so.t / 1.3, 0.0, 1.0)
		var up: float = _ease(clamp(k / 0.35, 0.0, 1.0))
		var go: float = _ease(clamp((k - 0.35) / 0.65, 0.0, 1.0))
		var p0 = Vector2(so.x, so.y - up * 60 * SF)
		var p = p0.lerp(Vector2(hero.x, hero.y), go) + Vector2(sin(so.t * 9) * 8 * (1 - go), 0)
		var a: float = (1.0 - go * 0.6)
		glow(ci, p, 40 * SF, Color(0.85, 0.92, 1.0, 0.35 * a))
		glyph(ci, so.ch, p, 34 * SF * (1.0 - go * 0.5), Color(0.92, 0.96, 1.0, 0.85 * a), Color(KD.AI, 0.5 * a), 4)
		if k < 0.35:
			txt(ci, UF, p.x, p.y - 40 * SF, "魂", 13, Color(KD.AI, 0.9 * (1.0 - k / 0.35)), 1)
	# 主人公の進化（全画面の場面）とは別: その場で二つの仲間が寄り添い、回って、ひとつの字になる
	for f in FUSE_FX:
		var t: float = f.t
		var c: Vector2 = f.c
		var sz: float = 54 * SF
		if t < 0.9:
			var k: float = _ease(clamp(t / 0.45, 0.0, 1.0))
			var spin: float = clamp((t - 0.35) / 0.55, 0.0, 1.0)
			var rr: float = lerp(70.0, 0.0, spin * spin) * SF
			var an: float = spin * TAU * 1.5
			var qa: Vector2 = f.pa.lerp(c + Vector2(cos(an), sin(an) * 0.6) * rr, k)
			var qb: Vector2 = f.pb.lerp(c - Vector2(cos(an), sin(an) * 0.6) * rr, k)
			ci.draw_line(qa, qb, Color(KD.KIN, 0.4 * spin), 2)
			glow(ci, c, sz * (0.6 + spin), Color(KD.KIN, 0.3 * spin))
			glyph(ci, f.a, qa, sz, KD.AI, Color(paper_col(), 0.9), 5)
			glyph(ci, f.b, qb, sz, KD.AI, Color(paper_col(), 0.9), 5)
		else:
			var u: float = clamp((t - 0.9) / 0.6, 0.0, 1.0)
			if t < 1.0:
				glow(ci, c, sz * 3, Color(KD.KIN, (1.0 - (t - 0.9) / 0.1) * 0.8))
			var sc: float = 1.6 - 0.6 * _ease(u)
			glow(ci, c, sz * 1.6, Color(KD.KIN, 0.4 * (1.0 - u * 0.5)))
			glyph(ci, f.res, c, sz * 1.2 * sc, KD.KIN, Color(KD.SUMI, 0.9), 6)
			ci.draw_arc(c, sz * (0.8 + u * 1.8), 0, TAU, 48, Color(KD.KIN, 1.0 - u), 3, true)

func evolve(n: Dictionary, got_id: String) -> void:
	var prev = form
	var pic = path.size() == 1
	var mats = KD.mats_of(n)
	form = n.ch
	path.append("+".join(mats) + "|" + n.ch)
	# 合体した仲間は主人公に溶け込み、その能力を主人公が継承する
	for id in mats:
		if KD.D.WEAP.has(id) or not KD.fuse_of(id).is_empty():
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

## 進化した字の日本語の意味（訓読み）は data/game.json の JP_GLOSS で直せる
var JP_GLOSS: Dictionary = {}

## 字の英語の意味（部品・主人公・進化の字）
func en_of(ch: String) -> String:
	if KD.D.EN.has(ch):
		return KD.D.EN[ch]
	if KD.D.PARTS.has(ch):
		return KD.D.PARTS[ch]
	for r in KD.D.EVO_ROWS:
		if r[0] == ch:
			return r[3]
	for h in KD.D.HEROES:
		if h.ch == ch:
			return h.en
	return ""

func start_cine(a: String, b: Array, res: String, cap1: String, cap2: String, pic: bool, lay: String) -> void:
	state = "fusion"
	sfx.play("fuse")
	cine = {"a": a, "b": b, "res": res, "cap1": cap1, "cap2": cap2, "pic": pic, "lay": lay, "t": 0.0, "dur": 3.6}

func _end_cine() -> void:
	show_banner(cine.res + "　" + en_of(cine.res) + ("　「" + JP_GLOSS[cine.res] + "」" if JP_GLOSS.has(cine.res) else ""), "", false, true)
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
		spawn_enemy({"ch": ["林", "犬", "明"][i]}, Vector2(cos(a) * r, sin(a) * r))
	# 最初の野: 左下に小さな林
	var k0 = Vector2i(0, 0)
	var gc = Vector2(-W * 0.3, H * 0.26)
	var lay0 = [["林", "", 0], ["木", "", 0], ["草", "grass", 0], ["森", "", 0], ["草", "grass", 0]]
	for i in lay0.size():
		var an = i * 2.4
		place_plant(lay0[i], gc + Vector2(cos(an), sin(an)) * (20 + i * 26) * SF, k0)
	tick_field(0.0)
	if KD.D.has("STAGES") and KD.D.STAGES.size():
		show_banner(KD.D.STAGES[0].title, KD.D.STAGES[0].en)
	else:
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
	var list = typables().filter(func(t): return not t.get("dirm", false))
	if list.is_empty():
		return null
	for t in list:
		if t.captive:
			return t
	# 撃たれた字は、近いものから斬り落とす
	var sh = null
	var sd = 1e9
	for t in list:
		if t.get("shot", false):
			var dd0 = Vector2(t.x - hero.x, t.y - hero.y).length()
			if dd0 < sd:
				sd = dd0
				sh = t
	if sh != null and sd < 380 * SF:
		return sh
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
		# 蚩尤が近い・身構えている時は、蚩尤から遠い字へ突っ込んで逃げる
		if false:
			var odist = Vector2(oni.x - hero.x, oni.y - hero.y).length()
			if odist < oni.rad + 180 * SF or oni.st == "wind":
				var far = null
				var fd = 0.0
				for t in list:
					if t.is_boss or t.get("still", false) and t.get("obj", "") == "":
						continue
					var dd = Vector2(t.x - oni.x, t.y - oni.y).length()
					if dd > fd:
						fd = dd
						far = t
				if far != null and fd > odist:
					return far
		if b.typed != "" or best == null or bd > min(W, H) * 0.18 or randf() < 0.5:
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
		if typables().any(func(t): return not t.is_boss and (t.get("shot", false) or Vector2(t.x - hero.x, t.y - hero.y).length() < min(W, H) * 0.1)):
			auto_plan = null

# ---------- 入力 ----------
func _input(ev: InputEvent) -> void:
	if state == "intro":
		if (ev is InputEventKey and ev.pressed) or (ev is InputEventMouseButton and ev.pressed):
			to_title()
		return
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
		var sv = {KEY_UP: Vector2.UP, KEY_DOWN: Vector2.DOWN, KEY_LEFT: Vector2.LEFT, KEY_RIGHT: Vector2.RIGHT}
		if sv.has(kc):
			step_hero(sv[kc])
			get_viewport().set_input_as_handled()
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
	if not test_mode.has("noliving"):
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
		if not e.alive or e.is_boss or e.captive or not on_view(e.x, e.y, e.size):
			# 画面の外の字は描かない（処理を軽くする）
			spr.visible = false
			continue
		spr.visible = e.get("obj", "") != "kana"   # 檻の中のかなは檻と一緒に描く
		var s: float = e.size
		if e.has("pop_t0"):
			var pk: float = clamp((time - float(e.pop_t0)) / 0.7, 0.0, 1.0)
			if pk >= 1.0:
				e.erase("pop_t0")
			else:
				s = lerp(float(e.pop_from), e.size, 1.0 - pow(1.0 - pk, 3))
		var xf = _motion_xf(e.mo, e.t, s, e.face, e.ph, e.step, e.tilt)
		var flip = 1.0   # 字は反転しない
		var pul: float = 1 + e.pulse * 0.12
		var sc = s / 112.0
		var sink: float = e.get("sink", 0.0)
		spr.position = Vector2(e.x + xf[0], e.y + xf[1] + s * 0.5 * sink)
		spr.rotation = xf[2]
		spr.scale = Vector2(sc * xf[3] * pul * flip, sc * xf[4] * pul * max(0.02, 1.0 - sink))
		var m: ShaderMaterial = spr.material
		m.set_shader_parameter("t", e.t)
		m.set_shader_parameter("face", e.face)
		m.set_shader_parameter("flash", 1.0 if e.flash > 0 else 0.0)
		var objk: bool = e.get("obj", "") != ""
		var used: bool = e.get("rest", 0.0) > 0
		var ek: Color = ink
		if time < float(e.get("shield_t", -1.0)):
			# ばらけたばかりの部品は朱く光る（どこから来た字かわかるように）
			ek = KD.SHU
		elif e.gift or e.get("obj", "") == "宝":
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
		spr2.visible = not reviving(id) and not FUSE_FX.any(func(f): return f.res == id and f.t < 1.4)
		var size = 44.0 * SF
		var mo = KD.motion_of(id)
		if id == "雨" or id == "日" or id == "月" or id == "明" or id == "咸" or WATER_TIER.has(id): mo = "drift"
		if id == "烕": mo = "flicker"   # 天のものは跳ねずに浮かぶ
		if id == "日": size = 70 * SF
		if id == "木": size = 56 * SF
		if id == "犬": size = 50 * SF; mo = "gallop"
		if id == "馬": size = 52 * SF; mo = "gallop"
		if id == "鳥": size = 38 * SF; mo = "flutter"
		if not KD.fuse_of(id).is_empty():
			size = 58 * SF   # 合体でできた仲間は大きく、金色
		size *= 1.0 + a.get("hitp", 0.0) * 0.35
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
		m2.set_shader_parameter("ink", KD.KIN if not KD.fuse_of(id).is_empty() else aink)
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
	ci.draw_set_transform_matrix(Oracle.BASE * Transform2D(rot, sc, 0.0, c))
	var w = tw(GF, ch, size)
	var base = Vector2(-w / 2, size * 0.36)
	if ow > 0:
		ci.draw_string_outline(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), int(ow), ocol)
	ci.draw_string(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(size), col)
	ci.draw_set_transform_matrix(Oracle.BASE)

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
	if state != "title" and state != "over" and state != "intro":
		_draw_rivers(ci)
	# 決戦の怪物（闘いの場の奥に、古の絵のまま立つ）
	if boss != null and state != "title" and state != "over":
		pass
	if false:
		var g = monster_geo()
		var a: float = clamp(reveal, 0.0, 1.0) * (0.8 if calm else 0.92)
		if false:
			var L0: float = 640 * SF * 0.5
			var pul = 0.35 + 0.25 * sin(ui_time * 30)
			var c0: Vector2 = g[0]
			var ld: Vector2 = boss.ldir
			var nv = Vector2(-ld.y, ld.x) * boss.rad * 0.8
			ci.draw_colored_polygon(PackedVector2Array([c0 + nv, c0 + ld * (L0 + boss.rad) + nv, c0 + ld * (L0 + boss.rad) - nv, c0 - nv]), Color(KD.SHU, 0.18 * pul + 0.08))

	# 蚩尤の突進の構え: 向かう先に朱の帯
	if false:
		var L0: float = 600 * SF * 0.45
		var pul = 0.35 + 0.25 * sin(ui_time * 30)
		var c0 = Vector2(oni.x, oni.y)
		var ld: Vector2 = oni.ldir
		var nv = Vector2(-ld.y, ld.x) * oni.rad * 0.8
		ci.draw_colored_polygon(PackedVector2Array([c0 + nv, c0 + ld * (L0 + oni.rad) + nv, c0 + ld * (L0 + oni.rad) - nv, c0 - nv]), Color(KD.SHU, 0.18 * pul + 0.08))
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
		var tsz: Vector2 = s.tex.get_size()
		var kk: float = R * 2 / max(tsz.x, tsz.y)
		ci.draw_texture_rect(s.tex, Rect2(-tsz * kk / 2, tsz * kk), false, Color(1, 1, 1, a * 0.6))
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
	# 雨の雲（水墨画）: 雲の真下に降る
	if ALLY.has("雨"):
		var rc: Vector2 = AP("雨")
		var ct = art("cloud2")
		var cw: float = (150 + L("雨") * 14) * SF
		var chh: float = cw * ct.get_height() / ct.get_width()
		ci.draw_texture_rect(ct, Rect2(rc.x - cw / 2, rc.y - chh * 0.42, cw, chh), false, Color(1, 1, 1, 0.82 * (1 - night * 0.5)))
	if Lw("月") and (ALLY.has("月") or ALLY.has("明")):
		var apm = AP("月")
		var Rm2: float = moon_r()
		glow(ci, apm, Rm2 * 1.2, Color(0.82, 0.88, 1.0, 0.22 + sin(ui_time * 9) * 0.04))
		ci.draw_arc(apm, Rm2, 0, TAU, 48, Color(0.82, 0.88, 1.0, 0.45), 1.5 * SF, true)
	if Lw("日") and (ALLY.has("日") or ALLY.has("明")):
		var ap = Vector2(hero.x, hero.y)
		var R2: float = sun_r()
		# 空の日から主人公の周りへ光が降りている（結界の出どころを見せる）
		var sp0: Vector2 = AP("日")
		var dv0: Vector2 = (ap - sp0)
		var nrm: Vector2 = Vector2(-dv0.y, dv0.x).normalized()
		ci.draw_colored_polygon(PackedVector2Array([sp0 + nrm * 10, sp0 - nrm * 10, ap - nrm * R2 * 0.95, ap + nrm * R2 * 0.95]), Color(KD.KIN, 0.07 + sin(ui_time * 3) * 0.015))
		glow(ci, ap, R2 * 1.25, Color(KD.KIN, 0.28 + sin(ui_time * 4) * 0.04))
		ci.draw_arc(ap, R2, 0, TAU, 64, Color(KD.KIN, 0.35), 2.0 * SF, true)
	if L("刀") and state == "play":
		var nb: int = blade_n()
		var Rb: float = blade_r()
		var bc: Color = KD.AIN if night > 0.5 else KD.AI
		for j in nb:
			var an = blade_a(j, nb)
			# 刀の軌跡（弧）
			ci.draw_arc(Vector2(hero.x, hero.y), Rb, an - 0.9, an, 16, Color(nc(KD.AI), 0.35 + night * 0.3), 9 * SF, true)
			ci.draw_arc(Vector2(hero.x, hero.y), Rb, an - 0.35, an, 8, Color(KD.SHU, 0.5), 4 * SF, true)
			var bp = Vector2(hero.x + cos(an) * Rb, hero.y + sin(an) * Rb)
			glyph(ci, "刀", bp, (46 + L("刀") * 2) * SF, bc, Color(paper_col(), 0.85), 5, 0.25 * sin(an))
	for w in wave_rings:
		if w.r <= 0:
			continue
		# 水面の波紋: 細い揺らぐ輪が三重に広がる（衝撃波ではなく水）
		var k2: float = 1 - w.r / w.R
		for ring in 3:
			var rr: float = w.r - ring * 14 * SF
			if rr <= 0:
				continue
			var pts = PackedVector2Array()
			for i in 65:
				var an: float = TAU * i / 64.0
				var wob: float = sin(an * 9 + ui_time * 6 + ring) * 3 * SF
				pts.append(Vector2(w.x, w.y) + Vector2(cos(an), sin(an) * 0.82) * (rr + wob))
			ci.draw_polyline(pts, Color(nc(KD.AI), (0.45 - ring * 0.12) * k2), 2.0, true)

## 巨大な漢詩（ボスの体）: 残っている句を縦に積む。いま打つ句は金に光り、ほかは墨（夜は白）
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
	# 吊るされた漁網（水墨画）の中に、甲骨文の魚
	var nt = art("net")
	var nw: float = s * 2.4
	var nh: float = nw * nt.get_height() / nt.get_width()
	ci.draw_set_transform(Vector2(x, y), sin(t * 1.3) * 0.05, Vector2.ONE)
	ci.draw_texture_rect(nt, Rect2(-nw / 2, -nh * 0.62, nw, nh), false, Color(1, 1, 1, a * (1 - night * 0.4)))
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	Oracle.draw(ci, "魚", Vector2(x + sin(t * 7) * 3, y), s * 1.1, Color(KD.AIN if night > 0.5 else KD.AI, a), {"rot": sin(t * 3) * 0.25, "lw": 2.4, "wob": 0.6, "t": t * 2, "glow": 0.8})

# ---------- 効果の層 ----------
func _draw_fx(ci: CanvasItem) -> void:
	var ink = ink_col()
	var paper = paper_col()
	_draw_fuse_fx(ci)
	# 燃えている字に小さな火
	for e in E:
		if e.alive and e.get("burn", 0.0) > 0 and on_view(e.x, e.y, 40):
			var fb: float = min(1.0, e.burn)
			for k in 2:
				var fl = 1.0 + sin(ui_time * 17 + k * 2 + e.x) * 0.15
				glyph(ci, "火", Vector2(e.x + (k - 0.5) * e.rad * 0.9, e.y - e.size * 0.45 - k * 4), e.size * 0.38 * fl, Color(KD.SHU, 0.85 * fb), Color(KD.KIN, 0.3 * fb), 3)
	# 火: ぱっと燃えて消える
	for r in ROT:
		if not r.has("fire"):
			continue
		var u: float = 1 - r.life / r.max
		var env: float = min(1.0, u / 0.15) * min(1.0, r.life / (r.max * 0.35))
		var fl = 1 + sin(ui_time * 13 + r.x) * 0.1
		glyph(ci, "火", Vector2(r.x, r.y - r.r * 0.2), r.r * 1.15, Color(KD.SHU, env * (0.75 + sin(ui_time * 22 + r.x) * 0.2)), Color(KD.KIN, env * 0.35), 6, 0, Vector2(0.8 + sin(ui_time * 17 + r.y) * 0.08, (0.6 + env * 0.5) * fl))
		if randf() < (0.06 if r.has("trail") else 0.25) * env:
			P.append({"k": "ink", "x": r.x + rnd(-r.r * 0.4, r.r * 0.4), "y": r.y - r.r * 0.5, "vx": rnd(-20, 20), "vy": rnd(-90, -40), "life": 0.4, "max": 0.4, "s": rnd(1.5, 3) * SF, "c": KD.SHU})
	# 木の壁: 木 → 林 → 森 と育つ。根元に結界の楕円
	for g in GROVE:
		var st: int = grove_stage(g)
		var R: float = grove_r(g)
		var fade: float = clamp((g.life - g.t) / 2.0, 0.0, 1.0)
		var gk: float = clamp(g.t / 0.9, 0.0, 1.0)
		var grow: float = 1.0 + sin(gk * PI) * 0.12 if gk < 1 else 1.0
		grow *= _ease(gk)
		var gc: Color = KD.AIN if night > 0.5 else KD.AI
		_dash_ellipse(ci, Vector2(g.x, g.y + R * 0.55), R * 1.15, R * 0.36, Color(gc, 0.55 * fade), 2.0 * SF)
		if g.hitp > 0:
			ci.draw_arc(Vector2(g.x, g.y), R * 1.1, 0, TAU, 40, Color(KD.KIN, 0.5 * g.hitp), 3 * SF, true)
		var ch: String = ["木", "林", "森"][st]
		var sz: float = R * 2.1 * (1.0 + g.hitp * 0.06)
		# 根元から縦に伸びる
		glyph(ci, ch, Vector2(g.x, g.y + sz * 0.5 * (1.0 - grow)), sz, Color(gc, fade), Color(paper, 0.85 * fade), 6, 0.0, Vector2(1.0 - (1.0 - grow) * 0.3, max(0.02, grow)))
	# 水の字が跳ねる
	for w in wave_rings:
		if w.r < w.R * 0.35:
			var k2: float = w.r / (w.R * 0.35)
			glyph(ci, "水", Vector2(w.x, w.y - 40 * SF - k2 * 30 * SF), 50 * SF, Color(KD.AIN if night > 0.5 else KD.AI, 1 - k2), Color(paper, (1 - k2) * 0.8), 5)
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
		if s.cut:
			brush(ci, s.a, s.c, s.b, s.w * (0.4 + k5 * 0.6), Color(col, min(1.0, k5 * 1.6)), head, s.seed)
		else:
			# 筆の一閃（水墨画の素材を、突っ込んだ道筋に沿って引く）
			var st: Texture2D = tex_stroke[abs(int(s.seed)) % tex_stroke.size()]
			var dv: Vector2 = s.b - s.a
			var Ls: float = dv.length() * 1.12
			var hs: float = s.w * 3.2 * (0.5 + k5 * 0.5)
			var tsz2: Vector2 = st.get_size()
			ci.draw_set_transform(s.a - dv.normalized() * Ls * 0.05, dv.angle(), Vector2.ONE)
			ci.draw_texture_rect_region(st, Rect2(0, -hs / 2, Ls * head, hs), Rect2(0, 0, tsz2.x * head, tsz2.y), Color(col, min(1.0, k5 * 1.6)))
			ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	for r in RG:
		var c6: Color = nc(r.c)
		if c6 == KD.SUMI:
			c6 = ink
		var k6: float = r.life / r.max
		ci.draw_arc(Vector2(r.x, r.y), max(1.0, r.r), 0, TAU, 64, Color(c6, k6), r.w * SF * k6 + 1, true)
	for b in BOLT:
		if b.has("ray"):
			var kr: float = b.life / b.max
			var bw: float = b.get("w", 1.0)
			ci.draw_line(b.pts[0], b.pts[1], Color(b.get("c", KD.KIN), 0.3 * kr), 34 * SF * kr * bw, true)
			ci.draw_line(b.pts[0], b.pts[1], Color(1, 0.97, 0.8, 0.85 * kr), 7 * SF * kr * max(bw, 0.5), true)
			continue
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
		var c9: Color = nc(t.c)
		if c9 == KD.SUMI:
			c9 = ink
		txt(ci, MF if t.get("mono", false) else GF, t.x, t.y - t.s * 0.5, t.t, t.s, Color(c9, a9), 1, 5, Color(paper, a9 * 0.9))

# ---------- 単語札 ----------
func _draw_labels(ci: CanvasItem) -> void:
	if state == "title" or state == "over" or state == "fusion":
		return

	var ink = ink_col()
	var paper = paper_col()
	for e in E:
		if not e.alive or e.is_boss or not on_view(e.x, e.y, 60):
			continue
		# 群れは同じ単語なので、札は頭にだけ出す（打てば群れ全員へ順に斬りかかる）
		if e.has("grp") and not e.get("lead", false):
			continue
		if e.get("rest", 0.0) > 0:
			# 使った名所: 名前と、また使えるまでの秒数を小さく
			var aic0 = KD.AIN if night > 0.5 else KD.AI
			txt(ci, UF, e.x, e.y + e.size * 0.62, "%s — あと%d秒" % [OBJ_TXT.get(e.obj, "").split(" — ")[0], ceil(e.rest)], 11 * max(0.85, SF), Color(aic0, 0.55), 1)
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
		if objk:
			# 名所の恵みを札の下に
			txt(ci, UF, e.x, y + bh + 2, OBJ_TXT.get(e.obj, ""), 11 * max(0.85, SF), Color(KD.KIN if night < 0.5 else KD.KIN, 0.95), 1)
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

## 句の景色（水墨画を、紺紙金泥のように夜の闇へ淡く浮かべる）
func _draw_poem_scenery(ci: CanvasItem) -> void:
	var f: String = boss.fx
	var t: float = boss.fx_t
	var a: float = min(1.0, t / 1.6)
	if calm:
		a *= 0.7
	var tex = art("scene_" + f)
	if tex == null:
		return
	var top: float = poem_layout().bottom * 0.6
	var k: float = max(W / 1280.0, (H - top) / 853.0)
	var w: float = 1280.0 * k
	var h: float = 853.0 * k
	var tint = Color(0.9, 0.86, 0.74)
	if f == "sunset":
		tint = Color(0.95, 0.72, 0.6)
	elif f == "mist":
		tint = Color(0.85, 0.76, 0.95)
	elif f == "galaxy" or f == "moon":
		tint = Color(0.93, 0.92, 0.86)
	ci.draw_texture_rect(tex, Rect2((W - w) / 2, top + (H - top - h) / 2 + (1 - a) * 24, w, h), false, Color(tint, 0.62 * a))

func _draw_poem_band(ci: CanvasItem) -> void:
	# 上端に張り付いた漢詩（二句）と、そのすぐ下の英文。打った字は朱
	var lay = poem_layout()
	var b: Dictionary = boss
	var top: float = lay.top - 10
	var hh: float = lay.bottom - lay.top + 24
	vgrad(ci, Rect2(0, top, W, hh * 0.85), Color(KD.YORU, 0.84), Color(KD.YORU, 0.76))
	vgrad(ci, Rect2(0, top + hh * 0.85, W, hh * 0.4), Color(KD.YORU, 0.76), Color(KD.YORU, 0.0))
	ci.draw_line(Vector2(W * 0.1, top), Vector2(W * 0.9, top), Color(KD.KIN, 0.5), 1)
	for i in 24:
		var x = fmod(i * 173.7 + ui_time * (8 + i % 5), W)
		var y: float = top + fmod(i * 37.3, hh)
		ci.draw_rect(Rect2(x, y, 2, 2), Color(KD.KIN, 0.25 + 0.25 * sin(ui_time * 2 + i)))
	var nl: int = b.poem.lines.size()
	txt(ci, UF, W / 2, lay.top - 4, "漢詩「%s」%s　第%s・%s句 / %s句" % [b.poem.title, b.poem.author, KD.kn(b.li + 1), KD.kn(min(b.li + 2, nl)), KD.kn(nl)], 13 * max(0.85, SF), Color(KD.WASHI, 0.65), 1)
	var ln: String = b.zh
	var rev: float = reveal if boss_intro > 0 else min(1.0, b.line_t / 0.9 + 0.2)
	for j in ln.length():
		var appear: float = clamp(rev * (ln.length() + 2) - j, 0.0, 1.0)
		if appear <= 0:
			continue
		var c = Vector2(lay.x0 + j * lay.P, lay.y + sin(b.t * 2 + j) * 1.2)
		var s: float = lay.P * 0.88
		var col = KD.SUMI.lerp(KD.KIN, appear)
		glow(ci, c, s * 0.9, Color(KD.KIN, 0.16 * appear * (0.8 + 0.2 * sin(ui_time * 3 + j))))
		glyph(ci, ln[j], c, s * (1.2 - 0.2 * appear), Color(col, appear), Color(KD.YORU, 0.9 * appear), s * 0.12)
	if boss_intro <= 0:
		var fs: float = lay.fs + 3
		var ph: String = b.en
		var w = tw(PF, ph, fs)
		var x0: float = W / 2 - w / 2
		var y0: float = lay.ey + 4
		var th: float = PF.get_height(int(fs))
		# 打つ英文: 明るい札で目立たせる（字の高さに合わせて枠を取る）
		var pul = 0.6 + 0.4 * sin(ui_time * 4)
		ci.draw_rect(Rect2(x0 - 22, y0 - 9, w + 44, th + 18), Color(KD.KIN, 0.25 * pul))
		ci.draw_rect(Rect2(x0 - 18, y0 - 6, w + 36, th + 12), Color(KD.YORU, 0.97))
		ci.draw_rect(Rect2(x0 - 18, y0 - 6, w + 36, th + 12), KD.KIN, false, 2.5)
		var n = String(b.typed).length()
		var xx = x0
		for ch in ph:
			var is_l = ch >= "a" and ch <= "z"
			var c2 = KD.SHU if (is_l and n > 0) else KD.WASHI
			txt(ci, PF, xx, y0, ch, fs, c2)
			xx += tw(PF, ch, fs)
			if is_l and n > 0:
				n -= 1
	# 蚩尤が画面の外にいる時は、縁に朱の印で方角を示す
	if false:
		var C = Vector2(W / 2, H / 2)
		var u = Vector2(oni.x - cam.x, oni.y - cam.y).normalized()
		var k: float = min((W / 2 - 40) / max(0.001, abs(u.x)), (H / 2 - 40) / max(0.001, abs(u.y)))
		var p = C + u * k
		p.y = clamp(p.y, lay.bottom + 30, H - 90)
		ci.draw_circle(p, 22, Color(KD.SHU, 0.9))
		glyph(ci, "蚩", p + Vector2(0, -1), 24, KD.WASHI)

## 怪物の下の札: 二句の英訳を二行で。打った分は朱
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
	if state == "intro":
		_draw_intro(ci)
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

func _draw_dirs(ci: CanvasItem) -> void:
	if state != "play" and state != "paused":
		return
	if DIRS.is_empty():
		_make_dirs()
	var nui = night > 0.5
	var fg = KD.WASHI if nui else KD.SUMI
	var bgc = KD.YORU if nui else KD.WASHI
	for d in DIRS:
		d.pulse = max(0.0, d.pulse - 0.05)
		var p: Vector2 = dir_screen(d)
		var on: bool = d.typed != ""
		var gs = 30.0 * (1.0 + d.pulse * 0.3)
		# 移動の字は四角で囲み、行き先の向きに矢印
		var box = Rect2(p - Vector2(26, 26), Vector2(52, 52))
		var v: Vector2 = d.dirv
		var tip: Vector2 = p + v * 40
		var nv = Vector2(-v.y, v.x) * 8
		ci.draw_rect(box, Color(bgc, 0.85))
		if d.cd > 0:
			# 使ったばかり: 薄く、戻るまで下から金がたまる
			var f: float = 1.0 - d.cd / DIR_CD
			ci.draw_rect(Rect2(box.position.x, box.end.y - box.size.y * f, box.size.x, box.size.y * f), Color(KD.KIN, 0.25))
			ci.draw_rect(box, Color(fg, 0.3), false, 2)
			glyph(ci, d.ch, p + Vector2(0, -1), gs, Color(fg, 0.22))
			continue
		ci.draw_rect(box, KD.SHU if on else Color(fg, 0.85), false, 3)
		ci.draw_colored_polygon(PackedVector2Array([tip, p + v * 30 + nv, p + v * 30 - nv]), KD.SHU if on else Color(fg, 0.85))
		glyph(ci, d.ch, p + Vector2(0, -1), gs, KD.SHU if on else Color(fg, 0.9))
		var fs = 13.0
		var w = tw(MF, d.word, fs)
		var lx: float = p.x - w / 2
		var ly: float = p.y + 30
		if d.dirv.y > 0:
			ly = p.y - 52
		ci.draw_rect(Rect2(lx - 6, ly, w + 12, fs + 8), Color(bgc, 0.85))
		var n = String(d.typed).length()
		txt(ci, MF, lx, ly + 3, d.word.substr(0, n), fs, KD.SHU)
		txt(ci, MF, lx + tw(MF, d.word.substr(0, n), fs), ly + 3, d.word.substr(n), fs, Color(fg, 0.8))

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
		# 右上のボタンの下に（移動の字や漢詩と重ならないように）
		var ay = 56.0
		ci.draw_rect(Rect2(W - 16 - w, ay, w, 24), KD.SHU)
		txt(ci, UF, W - 16 - w / 2, ay + 4, at, 12, KD.WASHI, 1)
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
		# この字が与えたダメージの合計（小さく）
		var dv: int = int(dmg_by.get(id, 0))
		if dv > 0:
			var ds: String = ("%.1fk" % (dv / 1000.0)) if dv >= 1000 else str(dv)
			txt(ci, MF, r.get_center().x, r.position.y - 13, ds, 10, Color(fg, 0.7), 1)
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
	if String(b.sub) != "":
		var sw = tw(MF, b.sub, 13) + 24
		ci.draw_rect(Rect2(W / 2 - sw / 2 - dx * 0.3, y + bh + 6, sw, 24), Color(KD.SUMI, a))
		txt(ci, MF, W / 2 - dx * 0.3, y + bh + 10, b.sub, 13, Color(KD.WASHI, a), 1)

# ---------- タイトル ----------
func _draw_title(ci: CanvasItem) -> void:
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.72))
	var tl = art("title_landscape")
	var tw0: float = W * 0.78
	ci.draw_texture_rect(tl, Rect2(W - tw0, 0, tw0, tw0 * 853.0 / 1280.0), false, Color(1, 1, 1, 0.5))
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

## 三択の左: 使役している仲間の一覧（主人公は合体しないので出さない）
func _allies_card(ci: CanvasItem, r: Rect2, S: float) -> void:
	ci.draw_rect(Rect2(r.position + Vector2(7, 7), r.size), KD.SUMI)
	ci.draw_rect(r, KD.WASHI)
	ci.draw_rect(r, KD.SUMI, false, 3)
	txt(ci, UF, r.get_center().x, r.position.y + 14 * S, "使役している仲間", 12 * S, KD.SUMI, 1)
	var ids = owned.keys().filter(func(id): return id != "命" and not absorbed.has(id))
	if ids.is_empty():
		txt(ci, UF, r.get_center().x, r.position.y + 130 * S, "まだいない", 14 * S, Color(KD.SUMI, 0.5), 1)
		return
	var cols = 3
	var cw: float = (r.size.x - 24 * S) / cols
	for i in ids.size():
		var id: String = ids[i]
		var c = Vector2(r.position.x + 12 * S + cw * (i % cols + 0.5), r.position.y + 70 * S + int(i / cols) * 74 * S)
		var fused: bool = not KD.fuse_of(id).is_empty()
		glyph(ci, id, c, 48 * S, KD.KIN if fused else KD.AI, Color(KD.WASHI, 0.9), 3)
		txt(ci, UF, c.x, c.y + 26 * S, "●".repeat(L(id)) if not fused else "合体", 8 * S, KD.SHU, 1)

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
	txt(ci, DF, x0, y0 - 14 * S, "字魂転生", 54 * S, KD.SHU)
	txt(ci, UF, x0 + 250 * S, y0 + 12 * S, "倒した字の魂を一つ選んで、仲間としてよみがえらせる — 英単語を打ち切る。朱の枠は仲間どうしの合体素材", 13 * S, KD.SUMI)
	var top = y0 + 70 * S
	var me = Rect2(x0, top + 70 * S, 290 * S, 300 * S)
	_allies_card(ci, me, S)
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
		txt(ci, UF, pos.x + 112 * S, pos.y + 54 * S, ("強める　%d枚目" % (info.n + 1)) if info.n else "の魂", 12 * S, KD.SHU)
		if hl:
			var badge = "合体素材"
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
## 合体の字の配置: それぞれの部品が、できあがる字のどの位置に入るか（単位正方形 -0.5..0.5 の矩形）
const FUSE_TOP = "艹竹髟草"
const FUSE_ENC = "广門囗"
const FUSE_LEFT = "木米土女石口豸月手阜足馬魚衣水糸禾虫彳言革人"
const FUSE_BOTTOM = {"婆": "女", "背": "肉", "腐": "肉", "貨": "貝", "慫": "心", "聳": "耳", "垡": "土", "魯": "日"}
func fuse_layout(res: String, a: String, bs: Array) -> Array:
	var L0 = 0.42
	if bs.size() > 1:
		var out = [[a, Rect2(-0.5, -0.5, L0, 1.0), true]]
		var n = bs.size()
		for i in n:
			if res == "鯉" or res == "鮭":
				out.append([bs[i], Rect2(-0.5 + L0, -0.5 + float(i) / n, 1.0 - L0, 1.0 / n), false])
			else:
				out.append([bs[i], Rect2(-0.5 + L0 + (1.0 - L0) * i / n, -0.5, (1.0 - L0) / n, 1.0), false])
		return out
	var b: String = bs[0]
	if res == "鱻" or res == "淼":
		return [[a, Rect2(-0.5, 0.0, 1.0, 0.5), true], [b, Rect2(-0.25, -0.5, 0.5, 0.5), false]]
	if FUSE_BOTTOM.get(res, "") == b:
		return [[a, Rect2(-0.5, -0.5, 1.0, 0.56), true], [b, Rect2(-0.5, 0.06, 1.0, 0.44), false]]
	if FUSE_TOP.contains(b):
		return [[b, Rect2(-0.5, -0.5, 1.0, 0.36), false], [a, Rect2(-0.5, -0.14, 1.0, 0.64), true]]
	if FUSE_ENC.contains(b):
		if b == "广":
			return [[b, Rect2(-0.5, -0.5, 1.0, 1.0), false], [a, Rect2(-0.24, -0.2, 0.72, 0.68), true]]
		return [[b, Rect2(-0.5, -0.5, 1.0, 1.0), false], [a, Rect2(-0.3, -0.3, 0.6, 0.6), true]]
	# 主人公が人・魚なら主人公が偏（左）。それ以外は、偏になる部品が左
	var hero_left = a == "人" or a == "魚" or a == "䲆" or a == "水" or a == "沝"
	if res == "漁":
		hero_left = false
	if not hero_left and FUSE_LEFT.contains(b):
		return [[b, Rect2(-0.5, -0.5, L0, 1.0), false], [a, Rect2(-0.5 + L0, -0.5, 1.0 - L0, 1.0), true]]
	return [[a, Rect2(-0.5, -0.5, L0, 1.0), true], [b, Rect2(-0.5 + L0, -0.5, 1.0 - L0, 1.0), false]]

func _ease(x: float) -> float:
	x = clamp(x, 0.0, 1.0)
	return 2 * x * x if x < 0.5 else 1 - pow(-2 * x + 2, 2) / 2

## 合体の演出: 部品が、できあがる字の中の自分の位置へ飛び込み、押し合って一つの字になる
func _draw_cine(ci: CanvasItem) -> void:
	var c: Dictionary = cine
	var t: float = c.t
	ci.draw_rect(Rect2(0, 0, W, H), KD.YORU)
	var cx = W / 2
	var cy = H * 0.42
	var S: float = min(W, H) * 0.44
	# 墨の渦と金の粉（中心へ吸い込まれる）
	for i in 80:
		var an = i * 2.399 + t * (0.9 + (i % 7) * 0.1)
		var rr: float = (60 + fmod(i * 37.0 + t * 120.0 * (1 + i % 3), 460)) * (1.2 - min(1.0, t / 1.0) * 0.6)
		var p = Vector2(cx, cy) + Vector2(cos(an), sin(an) * 0.6) * rr
		ci.draw_circle(p, 1.5 + (i % 3), Color(KD.KIN if i % 4 == 0 else KD.WASHI, 0.16 + 0.12 * sin(t * 3 + i)))
	# 仕上がる字の升目（原稿用紙の一マス）
	var fa: float = clamp(t / 0.3, 0.0, 1.0) * (1.0 - clamp((t - 1.2) / 0.4, 0.0, 1.0))
	ci.draw_rect(Rect2(cx - S / 2, cy - S / 2, S, S), Color(KD.SHU, 0.35 * fa), false, 2)
	ci.draw_line(Vector2(cx, cy - S / 2), Vector2(cx, cy + S / 2), Color(KD.SHU, 0.15 * fa), 1)
	ci.draw_line(Vector2(cx - S / 2, cy), Vector2(cx + S / 2, cy), Color(KD.SHU, 0.15 * fa), 1)
	var lay: Array = fuse_layout(c.res, c.a, c.b)
	var fly: float = _ease(t / 0.6)           # 飛び込む
	var press: float = clamp((t - 0.6) / 0.25, 0.0, 1.0)  # 押し合う
	var melt: float = clamp((t - 0.85) / 0.4, 0.0, 1.0)   # 溶けて一つの字に
	var squeeze: float = sin(press * PI) * 0.06
	if melt < 1.0:
		var nb = 0
		for k in lay.size():
			var ch: String = lay[k][0]
			var r: Rect2 = lay[k][1]
			var is_hero: bool = lay[k][2]
			# 置き場所（押し合う瞬間は中心へ少し寄る）
			var tc = Vector2(cx + (r.position.x + r.size.x / 2) * S, cy + (r.position.y + r.size.y / 2) * S)
			tc = tc.lerp(Vector2(cx, cy), squeeze)
			var tsc = Vector2(r.size.x, r.size.y) * (1.0 - squeeze * 0.5)
			# 出発点: 主人公は左から、素材は右から
			var sc0 = Vector2(cx - S * 1.05, cy) if is_hero else Vector2(cx + S * 1.05, cy + (nb - (c.b.size() - 1) / 2.0) * S * 0.55)
			if not is_hero:
				nb += 1
			var pos: Vector2 = sc0.lerp(tc, fly)
			var scl: Vector2 = Vector2(0.62, 0.62).lerp(tsc, fly)
			var col: Color = KD.SHU if is_hero else KD.KIN
			var al: float = 1.0 - melt
			# 飛び込む軌跡
			if fly < 1.0:
				ci.draw_line(sc0, pos, Color(col, 0.25 * (1 - fly)), 6 * (1 - fly) + 1)
			if is_hero and c.pic and KD.JGW.has(ch):
				Oracle.draw(ci, ch, pos, S * 0.95, Color(col, al), {"lw": 2.6, "glow": 0.8 * al, "sx": scl.x, "sy": scl.y})
			else:
				glyph(ci, ch, pos, S * 0.92, Color(col, al), Color(col, 0.22 * al), 14, 0.0, scl)
		# 押し合った継ぎ目に金の火花と墨しぶき
		if press > 0 and press < 1:
			for i in 14:
				var an2 = i * 0.45 + t * 3
				var rr2 = S * (0.1 + press * 0.5) * (0.6 + 0.4 * sin(i * 2.3))
				ci.draw_circle(Vector2(cx, cy) + Vector2(cos(an2), sin(an2)) * rr2, 3 + (i % 3) * 1.5, Color(KD.KIN if i % 2 else KD.WASHI, (1 - press) * 0.9))
	# 溶けて、できあがる字が同じ升目に現れる
	if melt > 0:
		var rs: String = c.res
		var gs: float = S * (0.92 if rs.length() == 1 else 0.6)
		var pul: float = 1.0 + (1.0 - melt) * 0.06
		for i in 3:
			glyph(ci, rs, Vector2(cx, cy), gs * pul, Color(KD.KIN, 0.0), Color(KD.KIN, 0.09 * melt), 26 + i * 20)
		glyph(ci, rs, Vector2(cx, cy), gs * pul, Color(KD.WASHI, melt), Color(KD.KIN, 0.5 * melt), 16)
		# 墨のにじみが外へ広がる
		var ring: float = clamp((t - 0.85) / 0.6, 0.0, 1.0)
		ci.draw_arc(Vector2(cx, cy), S * (0.5 + ring * 0.9), 0, TAU, 96, Color(KD.KIN, (1 - ring) * 0.8), 8 * (1 - ring) + 1, true)
		ci.draw_arc(Vector2(cx, cy), S * (0.4 + ring * 0.6), 0, TAU, 96, Color(KD.SHU, (1 - ring) * 0.5), 5 * (1 - ring) + 1, true)
	if t > 0.85 and t < 1.0:
		ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, (1.0 - (t - 0.85) / 0.15) * 0.5))
	# 字幕: 部品 ＋ 部品 ＝ できた字。字の下に意味を出す
	var ca: float = clamp((t - 1.0) / 0.4, 0, 1)
	var items: Array = [c.a] + c.b
	var cw: float = 120.0
	var ow: float = 44.0
	var rw: float = 230.0
	var tot: float = items.size() * cw + items.size() * ow + rw
	var x0: float = W / 2 - tot / 2
	var y0: float = H * 0.755
	for k in items.size():
		var ch2: String = items[k]
		var px: float = x0 + cw / 2
		glyph(ci, ch2, Vector2(px, y0), 54, Color(KD.WASHI, ca), Color(KD.WASHI, 0.15 * ca), 6)
		txt(ci, UF, px, y0 + 36, en_of(ch2), 16, Color(KD.WASHI, 0.85 * ca), 1)
		x0 += cw
		txt(ci, DF, x0 + ow / 2, y0 - 18, "＝" if k == items.size() - 1 else "＋", 30, Color(KD.KIN, ca), 1)
		x0 += ow
	var rx: float = x0 + rw / 2
	glyph(ci, c.res, Vector2(rx, y0 - 4), 84, Color(KD.KIN, ca), Color(KD.KIN, 0.3 * ca), 10)
	txt(ci, UF, rx, y0 + 40, en_of(c.res).to_upper(), 26, Color(KD.KIN, ca), 1)
	if JP_GLOSS.has(c.res):
		txt(ci, GF, rx, y0 + 74, "「" + JP_GLOSS[c.res] + "」", 20, Color(KD.WASHI, ca), 1)
	txt(ci, UF, W / 2, H * 0.94, c.cap2.split("　—　")[-1], 15, Color(KD.WASHI, 0.8 * clamp((t - 1.4) / 0.4, 0, 1)), 1)
	# 落款「合」
	if t > 1.6:
		var f3: float = min(1.0, (t - 1.6) / 0.18)
		var sz = 72 * (1.8 - 0.8 * f3)
		var sp = Vector2(cx + S * 0.62, cy + S * 0.42)
		ci.draw_set_transform(sp, -0.12, Vector2.ONE)
		ci.draw_texture_rect(tex_seal, Rect2(-sz / 2, -sz / 2, sz, sz), false, Color(KD.SHU, f3))
		ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
		glyph(ci, "合", sp, sz * 0.62, Color(KD.WASHI, f3), Color.TRANSPARENT, 0, -0.12)

# ---------- オープニング: 人と魚の恋を、魔が引き裂く ----------
const INTRO_LEN = 27.8
func start_intro() -> void:
	state = "intro"
	intro_t = 0.0
	intro_snd = {}

func _intro_sounds() -> void:
	var tau: float = intro_tau(intro_t)
	var cues = [[0.1, "koto"], [1.2, "koto"], [2.4, "koto"], [3.4, "koto"], [4.6, "warn"], [5.0, "boom"], [6.55, "slash"], [7.05, "slash"], [7.7, "slash"], [8.4, "slash"], [8.7, "hurt"], [9.05, "dash"], [9.5, "thud"], [10.6, "warn"], [11.0, "boom"], [11.5, "gong"], [14.4, "brush"], [16.0, "warn"], [16.6, "fuse"], [17.6, "stamp"], [18.3, "dash"]]
	for i in cues.size():
		if tau >= cues[i][0] and not intro_snd.has(i):
			intro_snd[i] = true
			if cues[i][1] == "koto":
				sfx.koto(i * 2)
			else:
				sfx.play(cues[i][1], -4)
	# 暗転の一撃
	if intro_t > 15.4 and not intro_snd.has("blk"):
		intro_snd["blk"] = true
		sfx.play("boom", -2, 0.7)
	# 行進の太鼓
	if tau > IA_RAID and tau < IA_KING:
		var b: int = int((tau - IA_RAID) / IA_BEAT)
		if not intro_snd.has("b%d" % b):
			intro_snd["b%d" % b] = true
			sfx.play("taiko", -10 if b % 2 else -6, 1.0 if b % 2 else 0.85)
	if tau > 12.6 and tau < 14.0:
		var b2: int = int((tau - 12.6) / (IA_BEAT * 0.8))
		if not intro_snd.has("c%d" % b2):
			intro_snd["c%d" % b2] = true
			sfx.play("taiko", -14, 0.9)

func _cap(ci: CanvasItem, t: float, t0: float, t1: float, s: String, col: Color) -> void:
	var a: float = clamp((t - t0) / 0.5, 0.0, 1.0) * clamp((t1 - t) / 0.5, 0.0, 1.0)
	if a > 0:
		txt(ci, GF, W / 2, H * 0.86, s, 24, Color(col, a), 1)

## ---- オープニング: 字に命を吹き込む。説明の文章は出さない ----
## 時刻: 平和 → 異変 4.6 → 襲撃 5.8 → 王 10.4 → 復讐 13.8 → 題字 17.6
const IA_ALARM = 4.6
const IA_RAID = 5.8
const IA_KING = 10.4
const IA_REV = 13.8
const IA_BEAT = 0.42
## 襲われる者: [字, 初めの位置, 斬られる時刻, 斬る兵の番号, 大きさ]
const VICTIMS = {"牛": [0.86, 6.6, 0, 0.82], "羊": [0.75, 7.1, 1, 0.66], "犬": [0.64, 7.75, 3, 0.62], "女": [0.52, 8.4, 4, 0.9]}
const ARMY = "鬼兵刃戈殺魔斬賊矛兇刀鬼兵戈殺"

func _ih(x: float) -> float:
	# 0..1 の山なり
	return sin(clamp(x, 0.0, 1.0) * PI)

## 跳ねる: 周期 per、高さ h。[上下のずれ, 横の伸び, 縦の伸び]
func _hop(t: float, per: float, h: float) -> Array:
	var f: float = fposmod(t / per, 1.0)
	var y: float = -_ih(f) * h
	var land: float = 1.0 - clamp(min(f, 1.0 - f) / 0.12, 0.0, 1.0)
	return [y, 1.0 + land * 0.18, 1.0 - land * 0.2 + _ih(f) * 0.12]

## 兵の位置（足踏みで行進し、斬りかかる）
func _soldier(i: int, t: float, S: float, gy: float, victims: Dictionary) -> Dictionary:
	var row: int = i % 3
	var colm: int = int(i / 3)
	var x0: float = W * 1.08 + colm * S * 1.0 + row * S * 0.42
	var y0: float = gy - S * 0.05 + (row - 1) * S * 0.5
	var o = {"p": Vector2(x0, y0), "sx": 1.0, "sy": 1.0, "rot": 0.0, "a": 1.0}
	# 地平から現れる
	var rise: float = clamp((t - IA_ALARM - 0.2 - i * 0.04) / 0.6, 0.0, 1.0)
	o.p.y += (1.0 - _ease(rise)) * S * 0.9
	o.a = rise
	# 足踏みの行進（太鼓に合わせて一歩ずつ）
	var u: float = max(0.0, min(t, IA_KING) - IA_RAID)
	var step: float = S * 0.6
	var nb: float = u / IA_BEAT
	var prog: float = (floor(nb) + _ease(fposmod(nb, 1.0))) * step
	var lim: float = x0 - W * (0.42 + row * 0.05 + colm * 0.1)
	o.p.x -= min(prog, lim)
	if t > IA_RAID and t < IA_KING and prog < lim:
		var hp = _hop(u, IA_BEAT, S * 0.12)
		o.p.y += hp[0]; o.sx = hp[1]; o.sy = hp[2]
		o.rot = -0.1
	# 斬りかかる
	for k in victims:
		var v: Array = victims[k]
		if int(v[2]) == i:
			var te: float = v[1]
			var lu: float = clamp((t - (te - 0.3)) / 0.3, 0.0, 1.0) * (1.0 - clamp((t - te - 0.15) / 0.45, 0.0, 1.0))
			if lu > 0:
				var vp: Vector2 = v[4]
				o.p = o.p.lerp(vp + Vector2(S * 0.55, 0), _ease(lu))
				o.sx = 1.0 + lu * 0.35; o.sy = 1.0 - lu * 0.18; o.rot = -0.35 * lu
	# 王の前でひれ伏す（波のように順に）
	var bow: float = clamp((t - IA_KING - 0.9 - colm * 0.08) / 0.3, 0.0, 1.0) * (1.0 - clamp((t - 12.4) / 0.4, 0.0, 1.0))
	o.sy *= 1.0 - bow * 0.3
	o.rot += bow * 0.35
	# 王に続いて去る（右へ足踏み）
	var go: float = max(0.0, t - 12.6 - colm * 0.05)
	if go > 0:
		var hp2 = _hop(go, IA_BEAT * 0.8, S * 0.1)
		o.p.x += go * W * 0.42
		o.p.y += hp2[0]; o.sx = hp2[1]; o.sy = hp2[2]
		o.rot = 0.1
	o.p.y += (1.0 - o.sy) * S * 0.3
	return o


## ---- 映画のカット割り: [始, 終, 物語の時刻(始), (終), 注目点, 寄り(始), (終)] ----
## 注目点: Vector2 は画面比の位置、文字列はその字を追う
var ipos = {}
const CUTS = [
	[0.0, 3.0, 0.0, 1.8, Vector2(0.5, 0.45), 1.0, 1.1],      # 遠景: 山あいの村
	[3.0, 5.4, 1.8, 3.96, Vector2(0.355, 0.61), 2.5, 2.7],   # 人と魚
	[5.4, 6.6, 3.96, 4.56, Vector2(0.56, 0.61), 2.2, 2.3],   # 子と犬と女
	[6.6, 7.8, 4.56, 5.28, "人", 3.4, 3.8],                  # 人が異変に気づく
	[7.8, 9.6, 5.28, 6.54, Vector2(0.82, 0.56), 1.5, 1.35],  # 地平に軍勢
	[9.6, 10.4, 6.54, 6.68, "鬼", 4.2, 4.6],                 # 鬼の顔（スロー）
	[10.4, 12.0, 6.68, 8.1, Vector2(0.56, 0.56), 1.2, 1.25], # 襲撃
	[12.0, 13.2, 8.1, 8.46, "女", 2.6, 3.0],                 # 女が子をかばう（スロー）
	[13.2, 14.6, 8.46, 9.09, "子", 2.3, 2.6],                # 子がさらわれる（スロー）
	[14.6, 15.4, 9.09, 9.57, "人", 1.9, 2.2],                # 人が飛び込む
	[15.4, 15.9, 9.57, 10.3, null, 1.0, 1.0],                # 暗転
	[15.9, 17.4, 10.3, 11.5, Vector2(0.62, 0.44), 1.0, 1.08], # 王が落ちてくる（あおり）
	[17.4, 18.6, 11.5, 12.4, Vector2(0.42, 0.55), 1.6, 1.7],  # 伏した人ごしに王
	[18.6, 20.4, 12.4, 13.3, Vector2(0.72, 0.48), 1.3, 1.2],  # 連れ去られる
	[20.4, 21.6, 13.3, 13.55, "魚", 3.2, 3.6],                # 振り返る魚
	[21.6, 24.6, 13.55, 16.6, "人", 3.2, 1.8],                # 灰の中から
	[24.6, 26.2, 16.6, 17.6, "人", 1.7, 1.35],                # 覚醒
	[26.2, 27.8, 17.6, 19.0, Vector2(0.5, 0.5), 1.0, 1.0],   # 題字
]

func _cut_of(t: float) -> Array:
	for c in CUTS:
		if t < c[1]:
			return c
	return CUTS[-1]

func intro_tau(t: float) -> float:
	var c = _cut_of(t)
	var k: float = clamp((t - c[0]) / (c[1] - c[0]), 0.0, 1.0)
	return lerp(float(c[2]), float(c[3]), k)

func _draw_intro(ci: CanvasItem) -> void:
	var t: float = intro_t
	var c = _cut_of(t)
	var k: float = clamp((t - c[0]) / (c[1] - c[0]), 0.0, 1.0)
	var tau: float = lerp(float(c[2]), float(c[3]), k)
	ci.draw_rect(Rect2(0, 0, W, H), Color.BLACK)
	if c[4] != null:
		var z: float = lerp(float(c[5]), float(c[6]), _ease(k))
		var foc = Vector2(W / 2, H / 2)
		if c[4] is Vector2:
			foc = Vector2(c[4].x * W, c[4].y * H)
		elif ipos.has(c[4]):
			foc = ipos[c[4]] + Vector2(0, -min(W, H) * 0.01)
		# ゆっくり流れる手持ちのゆれ
		foc += Vector2(sin(t * 0.7) * 6, cos(t * 0.53) * 4) / z
		var base = Transform2D(0.0, Vector2(z, z), 0.0, Vector2(W / 2, H / 2) - foc * z)
		Oracle.BASE = base
		ci.draw_set_transform_matrix(base)
		_draw_intro_scene(ci, tau)
		# 振り返る魚の涙
		if c[4] is String and c[4] == "魚" and k > 0.35 and ipos.has("魚"):
			var tk: float = (k - 0.35) / 0.65
			var fp: Vector2 = ipos["魚"]
			ci.draw_circle(fp + Vector2(min(W, H) * 0.03, -min(W, H) * 0.02 + tk * min(W, H) * 0.12), 2.5, Color(KD.AIN, 1.0 - tk * 0.5))
		Oracle.BASE = Transform2D.IDENTITY
		ci.draw_set_transform_matrix(Transform2D.IDENTITY)
	# カットの頭は一瞬だけ暗く（切り替わりの呼吸）
	var since: float = t - c[0]
	if since < 0.08 and c[0] > 0:
		ci.draw_rect(Rect2(0, 0, W, H), Color(0, 0, 0, 1.0 - since / 0.08))
	# 打撃の白い閃光
	if tau > 8.4 and tau < 8.46:
		ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.6))
	# 映画の黒帯
	var bar: float = H * 0.1
	ci.draw_rect(Rect2(0, 0, W, bar), Color.BLACK)
	ci.draw_rect(Rect2(0, H - bar, W, bar), Color.BLACK)
	# 題字（判を押すように落ちる）
	if tau > 17.6:
		var ta2: float = clamp((tau - 17.6) / 0.15, 0.0, 1.0)
		var tsz = 56.0 * (1.0 + (1.0 - ta2) * 0.6)
		var ty0 = H * 0.14
		ci.draw_rect(Rect2(W / 2 - tsz * 2.6, ty0, tsz * 1.1, tsz * 1.1), Color(KD.WASHI, ta2))
		txt(ci, DF, W / 2 - tsz * 2.05, ty0, "漢", tsz * 0.9, Color(KD.SUMI, ta2), 1)
		ci.draw_rect(Rect2(W / 2 - tsz * 1.4, ty0, tsz * 1.1, tsz * 1.1), Color(KD.SHU, ta2))
		txt(ci, DF, W / 2 - tsz * 0.85, ty0, "字", tsz * 0.9, Color(KD.WASHI, ta2), 1)
		txt(ci, DF, W / 2 - tsz * 0.15, ty0, "SURVIVOR", tsz * 0.9, Color(KD.WASHI, ta2))
	txt(ci, UF, W - 20, H - bar * 0.62, "キーかクリックで飛ばす", 12, Color(KD.WASHI, 0.35), 2)

func _draw_intro_scene(ci: CanvasItem, t: float) -> void:
	var S: float = min(W, H) * 0.2
	var gy: float = H * 0.64
	var dark: float = clamp((t - IA_ALARM) / 0.8, 0.0, 1.0)
	# 王の着地・目覚めの揺れ
	var shk: float = 0.0
	if t > 11.0 and t < 11.6:
		shk = (11.6 - t) / 0.6 * 14
	if t > 16.6 and t < 17.1:
		shk = (17.1 - t) / 0.5 * 10
	if t > 17.6 and t < 17.9:
		shk = (17.9 - t) / 0.3 * 12
	var sh = Vector2(sin(t * 91) , cos(t * 73)) * shk
	# 背景: 山あいの村（水墨画）。夜になり、村が燃える
	ci.draw_rect(Rect2(-W, -H, W * 3, H * 3), KD.WASHI)
	var home = art("scene_home")
	var fin: float = clamp(t / 1.0, 0.0, 1.0)
	ci.draw_texture_rect(home, Rect2(sh.x, sh.y, W, W * 853.0 / 1280.0), false, Color(KD.SUMI, 0.5 * fin))
	ci.draw_rect(Rect2(-W, -H, W * 3, H * 3), Color(KD.YORU, dark * 0.9))
	var burn: float = clamp((t - 7.0) / 2.0, 0.0, 1.0) * (1.0 - clamp((t - 15.0) / 2.0, 0.0, 1.0))
	if dark > 0:
		ci.draw_texture_rect(home, Rect2(sh.x, sh.y, W, W * 853.0 / 1280.0), false, Color(KD.WASHI, 0.1 * dark))
		glow(ci, Vector2(W * 0.17, H * 0.24), W * 0.3, Color(KD.SHU, 0.4 * burn + sin(t * 9) * 0.04 * burn))
		glow(ci, Vector2(W * 0.95, gy), W * 0.4, Color(KD.SHU, 0.2 * dark * (1.0 - clamp((t - 13.0) / 1.5, 0.0, 1.0))))
	var ink: Color = KD.SUMI.lerp(KD.WASHI, dark)
	ci.draw_line(Vector2(0, gy + S * 0.48) + sh, Vector2(W, gy + S * 0.48) + sh, Color(ink, 0.22), 2)
	# 日が沈む／鳥が逃げる
	if dark < 1:
		Oracle.draw(ci, "日", Vector2(W * 0.84, H * 0.15 + dark * 90), S * 0.45, Color(KD.SHU, 0.75 * (1 - dark) * fin), {"lw": 2.4, "rot": sin(t * 0.7) * 0.05})
	var bx: float = W * (-0.1 + t * 0.11)
	var by: float = H * 0.22 + sin(t * 2.6) * 12
	if t > IA_ALARM:
		var fl: float = t - IA_ALARM
		bx += fl * fl * W * 0.15
		by -= fl * fl * H * 0.12
	if bx < W * 1.1 and by > -50:
		Oracle.draw(ci, "鳥", Vector2(bx, by), S * 0.42, Color(ink, 0.8 * fin), {"lw": 2.2, "sy": 1.0 + sin(t * 15) * 0.22, "rot": -0.1 + sin(t * 15) * 0.05})
	# ---- 村の者たち ----
	var vp = {}   # 斬られる瞬間の位置
	var peace: float = 1.0 - dark
	var flee: float = max(0.0, t - (IA_ALARM + 0.7))
	# 子は犬を追って跳ね回り、異変で女の後ろへ隠れる
	var wx: float = W * 0.52
	var cx: float = W * 0.58 + sin(t * 1.4) * S * 0.7 * peace
	var hc = _hop(t, 0.34, S * 0.22 * (0.3 + peace * 0.7))
	var dx: float = cx + S * 0.6 * (1.0 if cos(t * 1.4) > 0 else -0.2)
	# 女は揺れながら子を見守り、異変で子をかばう
	var hide: float = clamp((t - IA_ALARM - 0.4) / 0.6, 0.0, 1.0)
	cx = lerp(cx, wx - S * 0.45, hide)
	wx += _ease(clamp((t - IA_ALARM - 0.4) / 0.6, 0.0, 1.0)) * S * 0.25
	# 逃げる者は少しずつ左へ
	var fl2: float = min(flee, 3.0) * S * 0.18
	var actors = [["牛", W * 0.86 - fl2 * 1.2], ["羊", W * 0.75 - fl2 * 1.4], ["犬", dx], ["女", wx - fl2 * 0.5]]
	for a in actors:
		var ch: String = a[0]
		var v: Array = VICTIMS[ch]
		var te: float = v[1]
		var x: float = a[1]
		var sz: float = S * v[3]
		var p = Vector2(x, gy)
		var sx = 1.0
		var sy = 1.0
		var rot = 0.0
		var al = fin
		var tremble: float = clamp((t - IA_ALARM) / 0.3, 0.0, 1.0) * (1.0 if t < te else 0.0)
		match ch:
			"牛", "羊":
				# 草を食む: 頭を下げては上げる
				rot = pow(max(0.0, sin(t * 1.2 + x)), 6) * 0.3 * peace
				p.y += abs(sin(t * 0.9 + x)) * -3
				if t > IA_ALARM:
					var hp = _hop(t + x, 0.26, S * 0.12)
					p.y += hp[0] * min(1.0, flee * 2); sx = hp[1]; sy = hp[2]
					rot = 0.15   # 振り返って怯える
			"犬":
				var hd = _hop(t, 0.3, S * 0.2 * (0.4 + peace))
				p.y += hd[0]; sx = hd[1]; sy = hd[2]
				rot = sin(t * 13) * 0.12 * peace
				if t > IA_ALARM:
					# 吠えかかる: 前のめりに跳ね、兵へ飛びかかる
					rot = 0.2 + sin(t * 20) * 0.08
					var lunge: float = clamp((t - (te - 0.45)) / 0.4, 0.0, 1.0)
					p.x += lunge * S * 0.9
					p.y -= _ih(lunge) * S * 0.5
			"女":
				rot = sin(t * 1.6) * 0.07 * peace
				if peace > 0.5 and fmod(t, 3.0) > 2.2:
					rot += 0.18 * _ih((fmod(t, 3.0) - 2.2) / 0.8)   # 子へ会釈
				if t > IA_ALARM:
					sx = 1.12   # 腕を広げてかばう
		p += Vector2(rnd(-1, 1), rnd(-1, 1)) * 2.5 * tremble
		vp[ch] = p
		ipos[ch] = p
		if t >= te:
			# 斬られて宙を舞い、倒れて墨に還る
			var u: float = t - te
			var k: float = clamp(u / 0.7, 0.0, 1.0)
			var hit = p
			var land = hit + Vector2(-S * 1.3, S * 0.2)
			p = hit.lerp(land, k) + Vector2(0, -S * 1.1 * _ih(k))
			rot = -k * 5.6 if k < 1 else -1.5
			sx = 1.0; sy = 1.0
			al = fin * (1.0 - clamp((u - 2.0) / 1.5, 0.0, 1.0))
			if u < 0.2:
				ci.draw_line(hit + Vector2(S * 0.7, -S * 0.6), hit + Vector2(-S * 0.6, S * 0.5), Color(KD.WASHI, 1.0 - u / 0.2), 7)
				glow(ci, hit, S * 0.8, Color(KD.SHU, 0.6 * (1.0 - u / 0.2)))
			if k >= 1:
				var spt = art("splashw%d" % (int(x) % 9))
				var ss: float = sz * (1.2 + clamp(u - 0.7, 0.0, 0.25) * 2.4)
				ci.draw_texture_rect(spt, Rect2(land.x - ss / 2 + sh.x, land.y - ss * 0.35 + sh.y, ss, ss * 0.7), false, Color(KD.SHU, 0.75 * (1.0 - clamp((t - 15.5) / 1.5, 0.0, 1.0))))
		if al > 0:
			Oracle.draw(ci, ch, p + sh + Vector2(0, (1 - sy) * sz * 0.4), sz, Color(ink, al), {"lw": 2.8, "sx": sx, "sy": sy, "rot": rot, "wob": 0.25, "t": t * 2})
	# 魚: 池から跳ねる。網ですくわれる
	var px: float = W * 0.4
	_dash_ellipse(ci, Vector2(px, gy + S * 0.35) + sh, S * 0.7, S * 0.15, Color(KD.AIN if dark > 0.5 else KD.AI, 0.5 * fin), 2)
	var fcol: Color = KD.AIN if dark > 0.5 else KD.AI
	var fp = Vector2(px, gy + S * 0.15)
	var frot = 0.0
	if t < IA_ALARM:
		var jf: float = fposmod(t / 1.7, 1.0)
		if jf < 0.45:
			var k2: float = jf / 0.45
			fp += Vector2((k2 - 0.5) * S * 0.9, -_ih(k2) * S * 1.1)
			frot = (k2 - 0.5) * 2.2
			if k2 > 0.9:
				_dash_ellipse(ci, Vector2(px + S * 0.45, gy + S * 0.3), S * 0.3 * (k2 - 0.9) * 10, S * 0.06, Color(fcol, 0.6), 2)
		else:
			fp.y += S * 0.15
	else:
		fp += Vector2(sin(t * 18) * 3, -S * 0.05)   # 怯えて震える
	# 子
	var cp = Vector2(cx, gy + hc[0] * (1.0 - hide))
	var csx: float = hc[1] if hide < 1 else 1.0
	var csy: float = hc[2] if hide < 1 else 1.0
	if hide >= 1:
		cp += Vector2(rnd(-1, 1), rnd(-1, 1)) * 3.0
	vp["子"] = cp
	ipos["子"] = cp
	# 網にかけられ、鬼に担がれる（子 8.7、魚 9.0）
	var caps = [["子", cp, 8.7, S * 0.6, ink, Vector2(csx, csy), 0.0], ["魚", fp, 9.0, S * 0.75, fcol, Vector2.ONE, frot]]
	for c in caps:
		var tn: float = c[2]
		var pos: Vector2 = c[1]
		var net_k: float = clamp((t - (tn - 0.35)) / 0.35, 0.0, 1.0)
		var up: float = clamp((t - tn) / 0.5, 0.0, 1.0)
		var carry = Vector2(W * (0.47 if c[0] == "子" else 0.55), gy - S * 1.15)
		if t > tn:
			pos = pos.lerp(carry, _ease(up)) + Vector2(sin(t * 16) * 4, 0)   # もがく
		var go: float = max(0.0, t - 12.6)
		pos.x += go * W * 0.42
		pos.y += -abs(sin(go * 7.5)) * S * 0.08
		ipos[c[0]] = pos
		if pos.x > W * 1.15:
			continue
		Oracle.draw(ci, c[0], pos + sh, c[3], Color(c[4], fin), {"lw": 2.8, "sx": c[5].x, "sy": c[5].y, "rot": c[6] + (sin(t * 14) * 0.2 if t > tn else 0.0), "wob": 0.4, "t": t * 3})
		if net_k > 0:
			var nt = art("net")
			var nw: float = c[3] * 1.7
			var nh: float = nw * nt.get_height() / nt.get_width()
			var np: Vector2 = pos + Vector2(0, -H * 0.4 * (1.0 - _ease(net_k)))
			ci.draw_texture_rect(nt, Rect2(np.x - nw / 2 + sh.x, np.y - nh * 0.6 + sh.y, nw, nh), false, Color(KD.WASHI, 0.85))
			if t > tn:
				# 担ぐ鬼
				var hp3 = _hop(t, IA_BEAT * 0.8, S * 0.06)
				glyph(ci, "鬼", pos + sh + Vector2(0, -c[3] * 0.95 + hp3[0]), S * 0.75, Color(0.06, 0.05, 0.05), Color(KD.SHU, 0.85), 5, 0.08, Vector2(hp3[1], hp3[2]))
	# ---- 人（主人公）: 助けに飛び込み、殴り飛ばされ、灰の中から立ち上がる ----
	var hx0: float = W * 0.31
	var hp_ = Vector2(hx0, gy)
	var hrot = 0.0
	var hsx = 1.0
	var hsy = 1.0
	var hs: float = S
	var hcol: Color = ink
	var hglow = 0.0
	if t < IA_ALARM:
		# 池の魚を見つめ、跳ねるたびに身を乗り出す
		var jf2: float = fposmod(t / 1.7, 1.0)
		hrot = 0.12 * _ih(jf2 / 0.45) if jf2 < 0.45 else 0.0
		hp_.y += sin(t * 2.0) * 2
	elif t < 9.05:
		# 驚いて跳ね上がり、震えながら身構える
		var jump: float = clamp((t - IA_ALARM) / 0.35, 0.0, 1.0)
		hp_.y -= _ih(jump) * S * 0.35
		hsy = 1.0 + _ih(jump) * 0.15
		hp_ += Vector2(rnd(-1, 1), rnd(-1, 1)) * 2.0 * clamp((t - 5.0) / 0.3, 0.0, 1.0)
		hrot = 0.08 + clamp((t - 8.4) / 0.2, 0.0, 1.0) * 0.15   # 女が斬られ、前へ
	elif t < 9.45:
		# 子を助けに飛び込む
		var dk: float = (t - 9.05) / 0.4
		hp_.x = lerp(hx0, W * 0.47, _ease(dk))
		hsx = 1.0 + _ih(dk) * 0.45; hsy = 1.0 - _ih(dk) * 0.2
		hrot = 0.35
	else:
		# 大きな鬼に殴り飛ばされ、地に伏す
		var kk: float = clamp((t - 9.45) / 0.75, 0.0, 1.0)
		var hit2 = Vector2(W * 0.47, gy)
		var land2 = Vector2(W * 0.24, gy + S * 0.28)
		hp_ = hit2.lerp(land2, _ease(kk)) + Vector2(0, -S * 1.3 * _ih(kk))
		hrot = -kk * 6.8 if kk < 1 else -1.45
		if t < 9.65:
			glow(ci, hit2 + sh, S, Color(KD.WASHI, (9.65 - t) / 0.2 * 0.6))
		if kk >= 1:
			# 立ち上がる: ぴくりと動き、這い、膝をつき、立つ
			var twitch: float = 1.0 if t > IA_REV + 0.3 and t < IA_REV + 0.9 and fmod(t, 0.3) < 0.08 else 0.0
			var push: float = clamp((t - (IA_REV + 1.0)) / 0.8, 0.0, 1.0)
			var slip: float = _ih(clamp((t - (IA_REV + 1.8)) / 0.4, 0.0, 1.0)) * 0.35   # 一度くずおれる
			var stand: float = _ease(clamp((t - (IA_REV + 2.2)) / 0.6, 0.0, 1.0))
			hrot = -1.45 + push * 0.8 + stand * 0.65 - slip + twitch * 0.12
			hp_.y = land2.y - stand * S * 0.28
			# 怒りに震え、朱に燃える
			var ire: float = clamp((t - 16.0) / 0.6, 0.0, 1.0)
			hp_ += Vector2(rnd(-1, 1), rnd(-1, 1)) * (2 + ire * 5) * clamp((t - 15.8) / 0.4, 0.0, 1.0) * (1.0 - clamp((t - 16.6) / 0.2, 0.0, 1.0))
			hcol = ink.lerp(KD.SHU, ire)
			hglow = ire
			# 覚醒: 大きく、中央へ
			var awk: float = _ease(clamp((t - 16.6) / 0.7, 0.0, 1.0))
			hs = S * (1.0 + awk * 0.9)
			hp_ = hp_.lerp(Vector2(W * 0.42, gy - S * 0.45), awk)
			if t > 16.6 and t < 17.4:
				var rk: float = (t - 16.6) / 0.8
				ci.draw_arc(hp_ + sh, S * (0.5 + rk * 3.5), 0, TAU, 72, Color(KD.SHU, 1.0 - rk), 10 * (1.0 - rk) + 1, true)
			# 去った軍勢の方へ身を乗り出す
			hrot += _ease(clamp((t - 17.3) / 0.4, 0.0, 1.0)) * 0.22
			var dash: float = clamp((t - 18.3) / 0.5, 0.0, 1.0)
			if dash > 0:
				hp_.x += _ease(dash) * W * 0.7
				hsx = 1.0 + _ih(dash) * 0.6; hsy = 1.0 - _ih(dash) * 0.2
	if hglow > 0:
		glow(ci, hp_ + sh, hs * 1.4, Color(KD.SHU, 0.5 * hglow + sin(t * 9) * 0.05))
		for k in 18:
			var ph = fposmod(t * 0.9 + k * 0.137, 1.0)
			var fx2: float = hp_.x + sin(k * 7.3) * hs * 0.55
			ci.draw_circle(Vector2(fx2, hp_.y + hs * 0.45 - ph * hs * 1.7) + sh, (1.0 - ph) * 6 * hglow, Color(KD.SHU.lerp(KD.KIN, ph), (1.0 - ph) * hglow))
	ipos["人"] = hp_
	Oracle.draw(ci, "人", hp_ + sh + Vector2(0, (1 - hsy) * hs * 0.4), hs, Color(hcol, fin), {"lw": 3.2, "glow": 0.3 + hglow, "rot": hrot, "sx": hsx, "sy": hsy, "wob": 0.25, "t": t * 2})
	# ---- 漢字の軍勢 ----
	var vtgt = {}
	for k in VICTIMS:
		var v2: Array = VICTIMS[k].duplicate()
		v2.append(vp.get(k, Vector2(W * v2[0], gy)))
		vtgt[k] = v2
	if t > IA_ALARM:
		for i in ARMY.length():
			var o = _soldier(i, t, S, gy, vtgt)
			if i == 0:
				ipos["鬼"] = o.p
			if o.a <= 0 or o.p.x > W * 1.3:
				continue
			var gsz: float = S * (0.95 if i == 0 else 0.62)
			if i == 0 and t > 9.2 and t < 9.7:
				# 大鬼が人を殴る
				var sw: float = (t - 9.2) / 0.5
				o.p = o.p.lerp(Vector2(W * 0.5, gy - S * 0.1), _ih(sw))
				o.rot = -0.5 * _ih(sw); o.sx = 1.0 + _ih(sw) * 0.3
			glyph(ci, ARMY[i], o.p + sh, gsz, Color(0.06, 0.05, 0.05, o.a), Color(KD.SHU, 0.8 * o.a), 5, o.rot, Vector2(o.sx, o.sy))
	# ---- 悪の王: 天から落ちてきて、笑い、去る ----
	if t > IA_KING and t < 14.2:
		var kp = Vector2(W * 0.66, H * 0.36)
		var fall: float = clamp((t - IA_KING) / 0.6, 0.0, 1.0)
		kp.y = lerp(-H * 0.5, H * 0.36, fall * fall)
		var ksx = 1.0
		var ksy = 1.0
		var krot = 0.0
		if t > 11.0:
			var sq: float = clamp((t - 11.0) / 0.35, 0.0, 1.0)
			ksy = 1.0 - _ih(sq) * 0.22; ksx = 1.0 + _ih(sq) * 0.15
			if t > 11.4 and t < 12.4:
				# 地に伏す人を見下ろし、笑う（身を揺する）
				krot = -0.07 * _ease((t - 11.4) / 0.4)
				ksy = 1.0 + sin(t * 26) * 0.035
				ksx = 1.0 - sin(t * 26) * 0.02
			if t >= 12.4:
				# 背を向けて去る
				var lv2: float = (t - 12.4) / 1.8
				kp.x += _ease(lv2) * W * 0.55
				kp.y -= _ease(lv2) * H * 0.1
				ksx *= 1.0 - lv2 * 0.4; ksy *= 1.0 - lv2 * 0.4
		if t > 11.0 and t < 11.8:
			var dr: float = (t - 11.0) / 0.8
			_dash_ellipse(ci, Vector2(W * 0.66, gy + S * 0.4) + sh, W * 0.15 + dr * W * 0.3, S * 0.2 + dr * S * 0.3, Color(ink, 0.6 * (1.0 - dr)), 3)
		var ka: float = 1.0 - clamp((t - 13.6) / 0.6, 0.0, 1.0)
		var ks: float = H * 0.62
		glow(ci, kp + sh, ks * 0.85, Color(KD.SHU, 0.32 * ka))
		for i in 3:
			glyph(ci, "王", kp + sh, ks, Color(0, 0, 0, 0), Color(KD.KIN, 0.09 * ka), 26 + i * 22, krot, Vector2(ksx, ksy))
		glyph(ci, "王", kp + sh, ks, Color(0.05, 0.04, 0.04, ka), Color(KD.KIN, 0.9 * ka), 8, krot, Vector2(ksx, ksy))
	# 灰が降る
	if t > 12.0:
		var aa: float = clamp((t - 12.0) / 1.5, 0.0, 1.0) * (1.0 - clamp((t - 16.6) / 0.6, 0.0, 1.0))
		for k in 40:
			var ph2 = fposmod(t * 0.07 + k * 0.173, 1.0)
			var ax: float = fposmod(k * 97.3 + sin(t * 0.8 + k) * 30, W)
			ci.draw_circle(Vector2(ax, ph2 * H), 1.5 + k % 3, Color(KD.WASHI, 0.35 * aa))

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
		var pf = DrawLayer.prof
		var fr = max(1, pf.get("frames", 1))
		var ps = []
		for k in pf:
			if k != "frames":
				ps.append("%s=%.2f" % [k, pf[k] / 1000.0 / fr])
		print("[perf fps=%d] " % Engine.get_frames_per_second(), " ".join(ps), " P=%d STAIN=%d TX=%d GEMS=%d" % [P.size(), STAIN.size(), TX.size(), GEMS.size()])
		DrawLayer.prof = {}
		print("[eat=%d brk=%d] " % [dbg_eat, dbg_break], "[t=%.0f] state=%s time=%.1f form=%s path=%s hp=%d kills=%d lv=%d E=%d allies=%s boss=%s mv=%d" % [ui_time, state, time, form, ",".join(path), hp, kills, level, E.size(), ",".join(ALLY.keys()), str(boss != null), movers()])
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
		print("[slain] ", slain)
		print("[owned] ", owned, " souls=", souls.keys())
		get_tree().quit()

func glow(ci: CanvasItem, c: Vector2, r: float, col: Color) -> void:
	ci.draw_texture_rect(tex_glow, Rect2(c.x - r, c.y - r, r * 2, r * 2), false, col)

## 縦のグラデーションの帯
func vgrad(ci: CanvasItem, r: Rect2, top: Color, bot: Color) -> void:
	ci.draw_polygon(PackedVector2Array([r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]), PackedColorArray([top, top, bot, bot]))
