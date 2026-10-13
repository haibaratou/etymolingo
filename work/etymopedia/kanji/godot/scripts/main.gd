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
## 字の状態: 氷（炎がないと攻撃を弾く）・毒（打つと自分も傷つく。清が浄める）・闇（出ると全体が闇に溶ける。光が照らして倒す）
var dark_k = 0.0
var seen_react = {}
var cursed = false
## 試験場（起動画面から）: 相性と仲間の効果をその場で試す
var lab_on = false
## 開発用の全体マップ（M キー）と、景ごとの配置（data/game.json の MAPS）
var devmap = false
var devmap_z = 1.0
var map_done = {}
var stage_origin = Vector2.ZERO
var lab_mode = 0      # 0 相性 / 1 仲間
var lab_i = 0
var lab_flag = 0      # 相性: 0 仲間なし 1 あり / 仲間: レベル（合体の字は 0 素材 1 合体）
var EFIRE: Array = []
var THUNDER: Array = []
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
	_setup_dof()
	ui = _layer(top, _draw_ui)
	sfx = Sfx.new()
	add_child(sfx)
	bank = GlyphBank.new()
	bank.font = GF
	add_child(bank)
	_resize()
	get_viewport().size_changed.connect(_resize)
	Kraft.load_db()
	await bank.build(_glyph_list())
	sfx.bgm_on = bool(meta.get("bgm", true))
	sfx.start_bgm()
	# 起動するとまずオープニング（試験・観戦の起動では飛ばす）
	if test_mode.is_empty() or test_mode.has("intro"):
		start_intro()
	else:
		to_title()
	if test_mode.has("hero"):
		hero_def = KD.hero(test_mode.hero)
	if test_mode.has("introshots"):
		# 試験: オープニングの決まった時刻の絵を撮る
		start_intro()
		for ts in String(test_mode.introshots).split(","):
			intro_hold = float(ts)
			for q in 4:
				await get_tree().process_frame
			var img = get_viewport().get_texture().get_image()
			img.save_png("%s/intro_%05.1f.png" % [test_mode.get("shotdir", "/tmp"), float(ts)])
		intro_hold = -1.0
		get_tree().quit()
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
	if test_mode.has("kl"):
		start_kl()
		if test_mode.has("kllv"):
			kl.lv = int(test_mode.kllv)
		if test_mode.has("klch"):
			kl.cur = String(test_mode.klch)
			kl_party_set(Array(String(test_mode.klch).split(",")).map(func(x): return String(x)))
			kl.cur = kl.party[0]
		if test_mode.has("klsc"):
			kl_set_sc(int(test_mode.klsc))
		await get_tree().create_timer(float(test_mode.get("klwait", "6"))).timeout
		print("[kl] foes=", E.filter(func(e): return e.alive and not e.get("still", false)).map(func(e): return e.ch).slice(0, 8))
		print("[kl] party=", kl.party, " sc=", kl.sc, " t=%.1f done=%.1f eat=%d left=%d touch=%d" % [kl.t, kl.done, kl_eaten(), movers(), kl.touch], " fx=", KFX.size(), " semfx=", semantic_combat.fx.size(), " hits=", semantic_combat.hits)
	if test_mode.has("kcraft"):
		# 作字台の試験: --kcraft=犬,草,隹,又（魂を置いて順に台へ）
		if state != "play":
			start()
		await get_tree().create_timer(0.5).timeout
		state = "play"
		var ms: Array = Array(String(test_mode.kcraft).split(","))
		for m in ms:
			souls[m] = int(souls.get(m, 0)) + 1
		open_craft()
		for m in ms:
			craft_put(m)
			print("[kcraft] put ", m, " parts=", craft_parts(), " pending=", craft.pending, " msg=", craft.msg)
		if craft.pending != "":
			craft_make(craft.pending, craft_parts())
		print("[kcraft] made=", craft.made, " KU=", KU.map(func(u): return u.ch), " list=", craft_list().map(func(r): return r[0]))
	if test_mode.has("fusetest"):
		start_kl()
		for ch in String(test_mode.fusetest).split(","):
			kl_fuse_show(ch)
			print("[fuse] ", ch, " parts=", FUSE_FX[-1].ps.map(func(q): return q[0]))
			await get_tree().create_timer(1.8).timeout
	if test_mode.has("rocktest"):
		# 岩を斬って弾き返されるか: --rocktest
		if state != "play":
			start()
		await get_tree().create_timer(0.5).timeout
		state = "play"
		var rk = spawn_enemy({"ch": "岩", "en": "rock"}, Vector2(hero.x + 200 * SF, hero.y), "still")
		var h0 := Vector2(hero.x, hero.y)
		hero.queue.append({"target": rk})
		start_dash()
		for q in 30:
			await get_tree().process_frame
		print("[rock] from=", h0, " now=", Vector2(hero.x, hero.y), " rock=", Vector2(rk.x, rk.y), " alive=", rk.alive, " recoil=", hero.recoil)
	if test_mode.has("probe"):
		if state != "play":
			start()
		for q in 8:
			await get_tree().create_timer(1.0).timeout
			print("[probe] t=%.1f KU=%s KFX=%d PROJ=%d SPARK=%d ALLY=%s owned=%s form=%s" % [time, KU.map(func(u): return u.ch), KFX.size(), PROJ.size(), SPARK.size(), ALLY.keys(), owned, form])
	if test_mode.has("facetest"):
		if state != "play":
			start()
		await get_tree().create_timer(2.0).timeout
		for k in 4:
			var ens = E.filter(func(e): return e.alive and on_view(e.x, e.y, 0) and not e.get("still", false)).map(func(e): return e.ch + "/" + e.word)
			print("[face] ", k, " face=", hero.face, " ", ens)
			get_viewport().get_texture().get_image().save_png("%s/face_%d.png" % [test_mode.get("shotdir", "/tmp"), k])
			step_hero(Vector2.LEFT if k % 2 == 0 else Vector2.RIGHT)
			await get_tree().create_timer(0.4).timeout
	if test_mode.has("onitest"):
		if state != "play":
			start()
		await get_tree().create_timer(0.5).timeout
		spawn_boss()
		for q in int(float(test_mode.get("oniwait", "4")) * 4):
			await get_tree().create_timer(0.25).timeout
			if state == "levelup":
				state = "play"
			pending_lv = 0
			xp = 0
		print("[oni] hero=", Vector2(hero.x, hero.y), " oni=", Vector2(oni.x, oni.y) if oni != null else null, " hp=", hp)
	if test_mode.has("lvtest"):
		if state != "play":
			start()
		await get_tree().create_timer(1.0).timeout
		souls["木"] = 2
		pending_lv = 1
		open_level_up()
		await get_tree().create_timer(1.0).timeout
		print("[lv] cards=", cards.map(func(c): return c.t + ":" + c.id))
	if test_mode.has("craft"):
		if state != "play":
			start()
		await get_tree().create_timer(0.8).timeout
		souls = {"木": 3, "火": 2, "戌": 1, "水": 2, "日": 1, "月": 1, "兆": 1}
		owned["火"] = 1
		open_craft()
		await get_tree().create_timer(0.5).timeout
		for w in String(test_mode.get("ckeys", "treetree")):
			var ev = InputEventKey.new()
			ev.pressed = true
			ev.keycode = KEY_A + (w.unicode_at(0) - 97)
			ev.unicode = w.unicode_at(0)
			craft_key(ev)
		await get_tree().create_timer(1.2).timeout
		print("[craft] list=", craft_list().map(func(q): return q[1] + "+" + q[2] + "=" + q[0]), " souls=", souls, " owned=", owned, " made=", craft.made, " msg=", craft.msg)
		if test_mode.has("cclose"):
			close_craft()
			await get_tree().create_timer(2.0).timeout
			print("[craft] after close ALLY=", ALLY.keys(), " state=", state)
	if test_mode.has("devmap"):
		if state != "play":
			start()
		if test_mode.has("dmstage"):
			boss_idx = int(test_mode.dmstage)
			enter_stage()
		await get_tree().create_timer(float(test_mode.get("dmwait", "3"))).timeout
		var gs = E.filter(func(e): return e.alive and e.has("guard")).map(func(e): return e.ch)
		print("[devmap] placed=", map_done.size(), " guards=", gs, " rivers=", RIVERS.size())
		devmap = true
		if test_mode.has("dmz"):
			devmap_z = float(test_mode.dmz)
	if test_mode.has("lab"):
		start_lab()
		if test_mode.has("labstart"):
			lab_i = int(test_mode.labstart)
			lab_apply()
		if test_mode.has("labmode"):
			for q in int(test_mode.get("labmode", "1")) if String(test_mode.labmode) != "" else 1:
				lab_switch()
		var n = int(test_mode.get("labn", "10"))
		for i in n:
			await get_tree().create_timer(1.2).timeout
			print("[lab] ", lab_mode, " ", lab_i, " flag=", lab_flag, " E=", E.filter(func(e): return e.alive and not e.get("still", false)).map(func(e): return e.ch))
			lab_toggle()
			await get_tree().create_timer(2.6).timeout
			print("[lab]   after toggle: ", E.filter(func(e): return e.alive and not e.get("still", false)).map(func(e): return e.ch), " owned=", owned)
			lab_next(1)
	if test_mode.has("behtest"):
		if state != "play":
			start()
		var es = []
		for c in ["休", "海", "蛇", "犬", "鳥", "鬼", "人", "水", "口"]:
			es.append(spawn_enemy({"ch": c}, Vector2(hero.x + rnd(-300, 300), hero.y + rnd(-250, 250))))
		print("[beh] ", es.map(func(e): return e.ch + ":" + e.beh))
		var e0 = es[0]
		break_part(e0, 0, -1, "type")
		var e1 = es[1]
		break_part(e1, 0, -1, "type")
		print("[beh] after break ", e0.ch, ":", e0.beh, "  ", e1.ch, ":", e1.beh)
		var p1 = Vector2(e1.x, e1.y)
		await get_tree().create_timer(2.0).timeout
		print("[beh] water moved ", int(p1.distance_to(Vector2(e1.x, e1.y))), " person dist to hero ", int(Vector2(e0.x, e0.y).distance_to(Vector2(hero.x, hero.y))))
	if test_mode.has("firetest"):
		if state != "play":
			start()
		var f1 = spawn_enemy({"ch": "炎"}, Vector2(hero.x + 300 * SF, hero.y - 60 * SF)); f1.born = 1.0
		var f2 = spawn_enemy({"ch": "灯"}, Vector2(hero.x - 300 * SF, hero.y + 80 * SF)); f2.born = 1.0
		await get_tree().create_timer(3.2).timeout
		print("[fire] EFIRE=", EFIRE.map(func(f): return f.ch + ("飛" if f.fly < f.fly_t else "燃")))
		get_viewport().get_texture().get_image().save_png("%s/fire.png" % test_mode.get("shotdir", "/tmp"))
	if test_mode.has("snake"):
		if state != "play":
			start()
		var hd = spawn_enemy({"ch": "蛇"}, Vector2(hero.x + 420 * SF, hero.y - 120 * SF))
		_spawn_formation(hd)
		await get_tree().create_timer(2.0).timeout
		var g = E.filter(func(e): return e.alive and e.get("grp", -9) == hd.get("grp", -8))
		print("[snake] group=", g.size(), " chars=", g.map(func(e): return e.ch), " spread=", g.map(func(e): return int(Vector2(e.x, e.y).distance_to(Vector2(hd.x, hd.y)))))
		get_viewport().get_texture().get_image().save_png("%s/snake_a.png" % test_mode.get("shotdir", "/tmp"))
		for e in g:
			e.typed = e.word
		finish_words(g)
		await get_tree().create_timer(1.6).timeout
		get_viewport().get_texture().get_image().save_png("%s/snake_b.png" % test_mode.get("shotdir", "/tmp"))
		await get_tree().create_timer(0.9).timeout
		var after = E.filter(func(e): return e.alive and not e.get("still", false))
		print("[snake] after=", after.map(func(e): return e.ch + ("G" if e.has("grp") else "")))
	if test_mode.has("yami"):
		if state != "play":
			start()
		for q in 3:
			spawn_enemy({"ch": "闇"}, Vector2(hero.x + 120 + q * 90, hero.y + 160)).born = 1.0
		await get_tree().create_timer(2.5).timeout
		print("[yami] count=", E.filter(func(e): return e.alive and e.ch == "闇").size(), " dark_k=", dark_k)
	if test_mode.has("states"):
		if state != "play":
			start()
		var e1 = spawn_enemy({"ch": "氷"}, Vector2(hero.x + 220, hero.y - 80)); e1.born = 1.0
		var e2 = spawn_enemy({"ch": "毒"}, Vector2(hero.x - 220, hero.y - 60)); e2.born = 1.0
		var e3 = spawn_enemy({"ch": "闇"}, Vector2(hero.x + 60, hero.y + 200)); e3.born = 1.0
		await get_tree().create_timer(1.6).timeout
		dmg_enemy(e1, 3, "月")
		print("[states] ice after hit=", e1.ch, " alive=", e1.alive)
		owned["炎"] = 1; owned["清"] = 1; owned["明"] = 1
		await get_tree().create_timer(0.6).timeout
		dmg_enemy(e1, 3, "月")
		await get_tree().create_timer(2.8).timeout
		print("[states] ice->", e1.ch, " poison alive=", e2.alive, " dark alive=", e3.alive, " dark_k=", dark_k)
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
		souls["木"] = 1; souls["喬"] = 1
		owned["木"] = 1
		owned["橋"] = 1
		await get_tree().create_timer(1.5).timeout
		hero.y = r0.y
		await get_tree().process_frame
		print("[river] bridge bx=", r0.bx, " hero.y=", hero.y)
	if test_mode.has("fusetest"):
		if state != "play":
			start()
		souls["日"] = 1; souls["月"] = 1
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
		souls["火"] = 1
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
		var path: String = "res://assets/art/%s.png" % n
		ART[n] = load(path) if ResourceLoader.exists(path) else null
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
		a = r
		# 野に立って迫ってくる。詩を読むほど墨が焼けて欠ける
		var prog: float = float(boss.li) / boss.poem.lines.size() if boss != null else 1.0
		dis = (1.0 - r) * 0.5 + prog * 0.35
		if oni.has("dead"):
			dis = 0.35 + clamp(oni.dead / 1.8, 0.0, 1.0) * 0.8
		fl = max(oni.fl, 0.6 if oni.bite_t > 1.2 else 0.0) * 0.6
		var bob: float = sin(t * 3.2) * ms * 0.04
		pos = Vector2(oni.x, oni.y + bob)
		rot = sin(t * 1.6) * 0.04
		if oni.daze > 0:
			rot += sin(t * 9) * 0.06
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
const WATER_TIER = {"清": 2, "沝": 2, "沐": 2, "泪": 2, "江": 3, "淼": 4, "淋": 4, "淡": 4, "減": 5, "滅": 7}

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
	glyph_gimmicks.clear()
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
	owned = {}; dmg_by = {}; souls = {}; SOULFX = []; NOTES = []; REVIVE = []; KANA = []; RIVERS = []; map_done = {}; stage_origin = Vector2.ZERO; dark_k = 0.0; EFIRE = []; THUNDER = []; PUDDLE = []; cursed = false; timers = {}; spawn_t = 2; shake = 0; hitstop = 0; flash = 0; red_v = 0; night = 0; ts = 1; slow_t = 0
	boss = null; boss_idx = 0; next_boss = 60; boss_intro = 0; reveal = 0; dying_t = 0; slain = {}
	wave = {"i": 0, "t": 9.0, "dir": 0.0, "warned": false}
	DIRS = []
	chunks = {}; field_seed = randi(); field_t = 0.0; mdead = null; spawn_maxlv = 0; oni = null
	form = hero_def.ch; path = [form]; traits = {}; HS = hero_stats()
	hero = {"x": 0.0, "y": 0.0, "state": "idle", "from": Vector2.ZERO, "to": Vector2.ZERO, "t": 0.0, "target": null, "queue": [], "face": 1, "land": 0.0, "dk": 0.0, "inv": 0.0, "last_dir": Vector2(0, -1), "morph": 0.0, "step_t": 0.0, "step_v": Vector2.ZERO, "step_cd": 0.0, "recoil": 0.0, "rv": Vector2.ZERO}
	hero_hist = []
	cam = Vector2.ZERO; cam_off = 0.0
	fish_joined = hero_def.ch == "魚"
	banner = null
	cine = null

# ---------- 敵（生きている字） ----------
## 字ごとの動きの個性（まっすぐ来るだけではない）
func beh_move(e: Dictionary, u: Vector2, d: float, sp: float, v: Vector2, dt: float) -> Vector2:
	var side = Vector2(-u.y, u.x)
	match e.beh:
		"charge":
			# 近づくと身構えて震え、一直線に突進して通り過ぎる
			var cs: String = e.get("cs", "go")
			e.ct = e.get("ct", 0.0) - dt
			if cs == "go":
				if d < 250 * SF and e.ct <= 0:
					e.cs = "wind"
					e.ct = 0.8
				return v
			elif cs == "wind":
				e.tilt = sin(e.t * 40) * 0.12
				if e.ct <= 0:
					e.cs = "dash"
					e.ct = 0.7
					e.cd_dir = u
					add_text(e.x, e.y - e.size * 0.6, "突", 16 * SF, KD.SHU, 0.4)
				return Vector2.ZERO
			else:
				if e.ct <= 0:
					e.cs = "go"
					e.ct = 1.5
				return e.cd_dir * sp * 5.0
		"kite":
			# 間合いを取って横に回り込む（撃ってくる字）
			var want: float = 300 * SF
			var rad_v: float = (1.0 if d > want + 50 * SF else (-1.0 if d < want - 50 * SF else 0.0))
			return u * sp * rad_v + side * sp * 0.8 * sin(e.t * 0.6 + e.ph)
		"leap":
			# 間をおいて大きく跳ぶ
			var lp: float = fmod(e.t + e.ph, 1.4)
			if lp < 0.4:
				e.tilt = -0.2
				return u * sp * 3.6
			return Vector2.ZERO
		"spiral":
			# 渦を巻きながら近づく
			return side * sp * 1.4 + u * sp * 0.45
		"burrow":
			# 地にもぐって速く近づき、顔を出して止まる
			var bp: float = fmod(e.t + e.ph, 3.0)
			e.hidden = bp < 1.8
			e.sink = 1.0 if bp < 1.8 else max(0.0, 1.0 - (bp - 1.8) / 0.25)
			if bp < 1.8 and tick("dirt%d" % e.id, dt, 0.15):
				P.append({"k": "ink", "x": e.x + rnd(-8, 8), "y": e.y + e.size * 0.3, "vx": rnd(-30, 30), "vy": rnd(-60, -20), "life": 0.4, "max": 0.4, "s": 2.5 * SF, "c": KD.SUMI})
			return u * sp * 2.2 if bp < 1.8 else Vector2.ZERO
		"flee":
			# 人は逃げていく（近づいてこない。打って突っ込めば斬れる）
			if d < 420 * SF:
				return -u * sp * 1.25 + side * sp * 0.4 * sin(e.t * 2 + e.ph)
			return side * sp * 0.3 * sin(e.t * 0.7 + e.ph)
		"stay":
			# 水はその場に留まる（動かない）
			return Vector2.ZERO
		"blink":
			# ふっと消えて、近くに現れる
			e.bt = e.get("bt", rnd(1.0, 2.5)) - dt
			if e.bt <= 0 and d > 140 * SF:
				e.bt = 2.6
				for k in 10:
					var an = rnd(0, TAU)
					P.append({"k": "ink", "x": e.x, "y": e.y, "vx": cos(an) * 90, "vy": sin(an) * 90, "life": 0.5, "max": 0.5, "s": 3 * SF, "c": Color(0.5, 0.35, 0.6)})
				var jump: float = min(d - 120 * SF, 170 * SF)
				e.x += u.x * jump + side.x * rnd(-50, 50) * SF
				e.y += u.y * jump + side.y * rnd(-50, 50) * SF
			return u * sp * 0.35
	return v

func enemy_speed(stk: int, beh: String) -> float:
	return 21 * SF * (1 + time / 480.0) * clamp(1.4 - stk * 0.036, 0.38, 1.35) * rnd(0.9, 1.1) * {"fast": 1.4, "fly": 1.05, "swarmling": 1.25, "gift": 0.55, "heal": 0.55}.get(beh, 1.0)

func set_word(e: Dictionary, w: String) -> void:
	e.word = w
	e.acc = [w]
	e.typed = ""
	e.eat = 0
	# 命（HP）: タイピング以外の攻撃はここを削る。英単語の文字は、打つ時だけ減る
	# 命の量は字の強さで決める（言語によって単語の長さは変わるので、単語には頼らない）
	e.hp_max = hp_of(e)
	e.hp = e.hp_max

## 字の命: 敵の格（data/game.json の RANK）で決まる。1 雑魚・2 中堅・3 強敵・4 精鋭・5 王。命の量は RANK_HP
func hp_of(e: Dictionary) -> float:
	var hp: Array = KD.D.get("RANK_HP", [3, 3, 6, 12, 24, 40])
	return float(hp[clampi(rank_of(String(e.get("ch", ""))), 1, hp.size() - 1)])

func rank_of(ch: String) -> int:
	var rk: Dictionary = KD.D.get("RANK", {})
	for r in rk:
		if String(rk[r]).contains(ch):
			return int(r)
	return 1

func hp_letters(w: String) -> int:
	var n = 0
	for c in w:
		if c >= "a" and c <= "z":
			n += 1
	return n

func size_for(lv: int, chars: int) -> float:
	# 部品が多いほど大きい。部品5つ以上（鬱など）は化物のように巨大
	var whole = (36.0 + min(lv - 1, 6) * 17.0) * SF
	if lv >= 5:
		whole *= 1.7
	return max(30 * SF, whole * 1.2 / chars) if chars > 1 else whole

func set_node(e: Dictionary, n: Dictionary) -> void:
	var changed: bool = e.has("node")
	e.node = n
	e.ch = n.ch
	e.en = n.en
	e.w = String(n.ch).length()
	e.lv = KD.leaves(n)
	e.size = size_for(e.lv, e.w) * (0.75 if e.beh == "swarmling" else 1.0)
	e.rad = e.size * 0.48 * (min(2.4, 0.6 + e.w * 0.45) if e.w > 1 else 1.0)
	e.mo = KD.motion_of(n.ch)
	e.stk = KD.strokes(n.ch)
	# 崩れて字が変われば、動きもその字（部首）の決まりに変わる（蛇 → 虫は散って這う、休 → 人は逃げる）
	if changed and not ["swarmling", "member", "still", "gift", "heal", "shot"].has(String(e.get("beh", ""))) and not e.get("still", false) and not e.has("grp"):
		e.beh = KD.beh_of(n.ch, KD.strokes(n.ch))
		e.hidden = false
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
	# 巳（へび）は蛇の長い行列として出す
	if String(def.get("ch", "")) == "巳":
		def = {"ch": "蛇"}
	# 闇は一体だけ（二体目は夜・影など別の闇の字にする）
	if String(def.get("ch", "")) == "闇" and E.any(func(q): return q.alive and q.ch == "闇"):
		def = {"ch": ["夜", "影", "黒", "暗"].pick_random()}
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
	if f.kind == "snake":
		# 頭の後ろに通り道をあらかじめ敷いて、生まれた時から長い列にする
		e.trail = []
		for k in range(n * 8 + 8, -1, -1):
			e.trail.append(Vector2(e.x, e.y) - to * k * 4.5 * SF)
	for i in n:
		var spread: Vector2 = Vector2(-to.y, to.x) * rnd(-1, 1) * 120 * SF - to * rnd(20, 200) * SF if f.kind != "snake" else -to * (i + 1) * 30 * SF
		var m = spawn_enemy({"ch": e.ch}, Vector2(e.x, e.y) + spread, "member")
		m.grp = e.grp
		m.lead = false
		m.idx = i + 1
		m.fmove = true
		m.fkind = f.kind
		m.size *= f.ms
		m.rad = m.size * 0.42
		m.ang = rnd(0, TAU)
		m.orb = rnd(0.5, 1.0)
		# 群れの中の持ち場はばらばら（隊列にしない）
		m.off = rnd(-1, 1)
		m.lag = rnd(0.15, 1.0)
		m.fol = rnd(1.6, 4.0)

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
			"flock", "stampede":
				# ばらばらに散って、それぞれの間合いで頭を追う（揺れながら）
				var dir: Vector2 = L.fv.normalized()
				var nrm: Vector2 = Vector2(-dir.y, dir.x)
				var wide: float = (150.0 if e.fkind == "stampede" else 110.0) * SF
				var wob: Vector2 = Vector2(sin(time * 1.7 + e.idx * 2.1), cos(time * 1.3 + e.idx * 1.7)) * 26 * SF
				tp = Vector2(L.x, L.y) + nrm * float(e.get("off", 0.0)) * wide - dir * float(e.get("lag", 0.5)) * 180 * SF + wob
				var kf: float = min(1.0, dt * float(e.get("fol", 3.0)))
				e.x += (tp.x - e.x) * kf
				e.y += (tp.y - e.y) * kf
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
	# 部首は残る（はがれるのは部首でない方）。蛇 → 虫、海 → 水
	var rad: String = Kraft.rad_of(String(n.ch)) if Kraft.has(String(n.ch)) else ""
	var kept_j: int = -1
	for j in n.parts.size():
		var pc0: String = n.parts[j].ch
		if rad != "" and (pc0 == rad or Kraft.NORM.get(pc0, pc0) == rad or Kraft.NORM.get(rad, rad) == pc0):
			kept_j = j
			break
	if kept_j >= 0 and n.parts.size() == 2:
		i = 1 - kept_j
	if pick != "":
		for j in n.parts.size():
			if n.parts[j].ch == pick and j != kept_j:
				i = j
	var gone: Dictionary = n.parts[i]
	if KD.leaves(gone) == 1:
		take_soul(String(gone.ch), e.x, e.y)
	# 景の部首（森林は木、大河は水…）が残ったら、画面の同じ部首の字へ連鎖する
	var rads: Array = stage_radicals()
	if kept_j >= 0 and rads.has(n.parts[kept_j].ch) and how != "chain":
		var kc: String = n.parts[kept_j].ch
		later(0.05, func(): chain_radical(kc, e))
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
	# 蚩尤は右から迫ってくる（触れると命が減る。逃げながら詩を打つ）
	var oms: float = 120.0 * SF
	oni = {"x": cam.x + W / 2 + oms * 1.6, "y": hero.y, "t": 0.0, "st": "walk", "st_t": 3.0, "ldir": Vector2.ZERO, "kx": 0.0, "ky": 0.0, "daze": 0.0, "bite_t": 0.0, "ms": oms, "rad": oms * 0.62, "fl": 0.0, "is_boss": true}
	boss_intro = 2.4
	reveal = 0
	show_banner("漢詩　" + pm.title, "TYPE THE POEM", true)
	sfx.play("boom")
	sfx.play("brush", -2)
	sfx.play("gong", -4)
	flash = 0.55 if not calm else 0.3
	flash_col = Color(0.02, 0.01, 0.05)
	set_hint("右から蚩尤が迫る。触れると命が減る。字へ突っ込んで逃げながら、上の漢詩の英文を打ち切れ", 9)
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
	var out = E.filter(func(e): return e.alive and not e.locked and not e.get("hidden", false) and e.get("rest", 0.0) <= 0 and (e.is_boss or on_view(e.x, e.y + e.size * 0.9, 8)))
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
	# 蛇の列は頭だけを斬る（頭を斬れば列が一撃で連鎖して崩れる）
	var heads = {}
	for x in rest2:
		if x.get("lead", false) and x.get("fkind", "") == "snake":
			heads[x.grp] = true
	for x in rest2.duplicate():
		if x.has("grp") and not x.get("lead", false) and x.get("fkind", "") == "snake" and heads.has(x.grp):
			x.locked = false
			x.typed = ""
			rest2.erase(x)
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
		if not glyph_gimmicks.can_reach(self, Vector2(hero.x, hero.y), strike_point(job.target)):
			job.target.locked = false
			job.target.typed = ""
			set_hint("壁の向こうには届かない。門の字を打って道を開く", 3.0)
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
	hero.last_dir = v.normalized()
	hero.move_t = time
	hero.step_t = STEP_T
	hero.step_cd = STEP_CD
	if v.x != 0:
		hero.face = 1 if v.x > 0 else -1
	sfx.play("dash", -14, 1.3)

func tick_hero(dt: float) -> void:
	var prev = Vector2(hero.x, hero.y)
	_tick_hero(dt)
	var fixed: Vector2 = glyph_gimmicks.block(self, prev, Vector2(hero.x, hero.y), hero_r() * 0.8)
	if fixed.distance_squared_to(Vector2(hero.x, hero.y)) > 0.01:
		hero.x = fixed.x
		hero.y = fixed.y
		hero.step_t = 0.0
		if hero.state == "dash":
			if hero.target != null:
				hero.target.locked = false
			hero.target = null
			hero.state = "idle"
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
	if float(hero.get("recoil", 0.0)) > 0:
		hero.recoil -= dt
		hero.x += hero.rv.x * dt
		hero.y += hero.rv.y * dt
		hero.rv *= pow(0.0006, dt)
		hero.face = 1 if hero.rv.x < 0 else -1
		if int(time * 60) % 2 == 0:
			TRAIL.append({"x": hero.x, "y": hero.y, "life": 0.14, "max": 0.14})
		return
	if hero.state == "dash":
		hero.t += dt / max(0.035, HS.dash * (2.0 if cursed else 1.0))
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

## 壊せない字（岩・炎のない時の氷）を斬ると、主人公が大きく弾き返される。硬さを体で示す
func hero_recoil(t: Dictionary, dir: Vector2) -> void:
	hero.rv = -dir * 1100 * SF
	hero.recoil = 0.32
	hero.inv = max(hero.inv, 0.5)
	hitstop = max(hitstop, 0.1)
	shake = max(shake, 11.0 * shake_k())
	t.flash = 0.25
	t.wob = 1.0
	# 当たった所に火花（硬い物に刃が当たった）
	var hp: Vector2 = Vector2(t.x, t.y) - dir * t.rad
	for k in 16:
		var an: float = (-dir).angle() + rnd(-1.1, 1.1)
		var sp: float = rnd(220, 520)
		P.append({"k": "ink", "x": hp.x, "y": hp.y, "vx": cos(an) * sp, "vy": sin(an) * sp, "life": 0.28, "max": 0.28, "s": rnd(2.0, 3.5) * SF, "c": Color(1.0, 0.92, 0.6)})
	add_ring(hp.x, hp.y, 46 * SF, 0.2, Color(1.0, 0.95, 0.75), 4)
	sfx.play("thud", -2, 1.6)
	sfx.play("tick", -2, 2.4)

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
	hero.move_t = time
	slash(hero.from.x, hero.from.y, t.x, t.y, t.get("is_boss", false))
	hero.inv = max(hero.inv, 0.3)
	if t.captive:
		join_fish(t)
		return
	if t.get("obj", "") != "":
		use_obj(t)
		return
	if t.ch == "氷":
		if has_counter("氷"):
			melt_ice(t)
		else:
			# 炎がなければ、氷は斬撃を弾く（主人公が弾き返される）
			ice_bounce(t, true)
			hero_recoil(t, dir)
			return
	if t.ch == "岩" and not has_counter("岩"):
		# 岩はまだ壊せない（戌＝鉞を手に入れると割れるようになる）
		ice_bounce(t, true)
		first_react("岩固", "岩は固くて壊せない", Vector2(t.x, t.y))
		hero_recoil(t, dir)
		return
	if t.ch == "毒" and not has_counter("毒"):
		# 毒の字を斬ると、毒を浴びる
		poison_splash(t)
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
	var was_snake: bool = t.get("lead", false) and t.get("fkind", "") == "snake"
	var killed = break_part(t, dir.x, dir.y)
	if was_snake:
		_snake_chain(t)
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
	if e.ch == "氷":
		if has_counter("氷"):
			melt_ice(e)
			return true
		ice_bounce(e)
		return false
	if e.ch == "岩" and not has_counter("岩"):
		ice_bounce(e)
		return false
	if e.get("hidden", false):
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
			TX.append({"x": e.x + rnd(-e.rad, e.rad) * 0.6, "y": e.y - e.rad * 0.4, "t": src.trim_prefix("K:"), "s": 16.0 * max(0.85, SF) + 2, "c": KD.KIN if night > 0.5 else KD.AI, "life": 0.45, "max": 0.45, "vy": -70.0})
	elif e.get("eat_cd", 0.0) > 0:
		return false
	# タイピング以外の攻撃は、単語の文字ではなく命（HP）を削る。命が尽きると部品が一つ消える
	var tg: String = src if src != "" else dmg_tag
	if tg != "":
		dmg_by[tg] = dmg_by.get(tg, 0) + n
	if not e.has("hp"):
		e.hp_max = hp_of(e)
		e.hp = e.hp_max
	e.hp -= float(n)
	e.hp_t = time
	dbg_eat += n
	if e.hp <= 0.0:
		# 命が尽きると部品が一つ消える（残った部品は新しい命を持つ。部品が一つだけの字なら消える）
		break_part(e, 0, -1, "weapon")
		dbg_break += 1
		if src == "":
			e.eat_cd = 0.3
		return true
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
	if lab_on:
		spawn_t = 1.0
		return
	_do_spawn()

func _do_spawn() -> void:
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
	place_map_items(k)
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

## 景の配置（レベルデザイン）: その区画に入った時に置く
func map_items() -> Array:
	var m = KD.D.get("MAPS", [])
	return m[stage_i()] if stage_i() < m.size() else []

func map_pos(it: Dictionary) -> Vector2:
	return stage_origin + Vector2(float(it.x), float(it.y)) * CHS()

func place_map_items(k: Vector2i) -> void:
	if lab_on:
		return
	var items: Array = map_items()
	for i in items.size():
		var it: Dictionary = items[i]
		var key = "%d:%d" % [stage_i(), i]
		if map_done.has(key):
			continue
		var p: Vector2 = map_pos(it)
		var kk = Vector2i(floori(p.x / CHS()), floori(p.y / CHS()))
		if it.kind == "river":
			# 川は出発の区画から近ければ置く
			if abs(kk.y - k.y) > 0:
				continue
		elif kk != k:
			continue
		map_done[key] = true
		match it.kind:
			"guard":
				var e = spawn_enemy({"ch": it.ch}, p)
				e.guard = true
				e.born = 1.0
			"obj":
				place_obj(it.ch, p, Vector2i(1 << 20, 0))
			"rock":
				for j in int(it.get("n", 4)):
					var e2 = spawn_enemy({"ch": "岩"}, p + Vector2((j - it.n / 2.0) * 70 * SF, sin(j * 1.7) * 20 * SF))
					e2.guard = true
					e2.wall = true
					e2.born = 1.0
			"grove":
				for j in int(it.get("n", 5)):
					place_plant([it.ch, "", 1], p + Vector2.from_angle(j * 2.4) * (30 + j * 22) * SF, Vector2i(1 << 20, 1))
			"river":
				RIVERS.append({"y": p.y, "h": 90 * SF, "x0": stage_origin.x + float(it.x) * CHS(), "x1": stage_origin.x + float(it.x1) * CHS(), "bx": null, "bt": 0.0, "t": 0.0, "map": true})

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
## ---- 字の状態 ----
func first_react(key: String, txt_s: String, p: Vector2) -> void:
	if seen_react.has(key):
		add_text(p.x, p.y - 50 * SF, txt_s, 16 * SF + 4, KD.SHU, 0.8)
		return
	seen_react[key] = true
	slow_t = max(slow_t, 0.7)
	add_text(p.x, p.y - 60 * SF, txt_s, 24 * SF + 6, KD.SHU, 1.6)

func ice_bounce(e: Dictionary, loud := false) -> void:
	if time < float(e.get("bounce_t", -1.0)) and not loud:
		return
	e.bounce_t = time + 0.6
	add_text(e.x, e.y - e.size * 0.6, "弾", (24 if loud else 16) * SF, Color(0.75, 0.9, 1.0), 0.5)
	for k in 8:
		var an = rnd(0, TAU)
		P.append({"k": "ink", "x": e.x, "y": e.y, "vx": cos(an) * 180, "vy": sin(an) * 180, "life": 0.3, "max": 0.3, "s": 2.5 * SF, "c": Color(0.75, 0.9, 1.0)})
	sfx.play("tick", -4 if loud else -12, 1.8)

## 氷は炎で溶けて水になる（点が溶ける）
func melt_ice(e: Dictionary) -> void:
	for k in 18:
		var an = rnd(PI * 1.1, PI * 1.9)
		P.append({"k": "ink", "x": e.x + rnd(-1, 1) * e.rad, "y": e.y, "vx": cos(an) * 60, "vy": sin(an) * 140, "life": 0.9, "max": 0.9, "s": rnd(4, 7) * SF, "c": Color(0.92, 0.94, 0.96)})
	first_react("氷水", "氷 → 水　炎で溶けた", Vector2(e.x, e.y))
	set_node(e, KD.mk_node("水"))
	e.flash = 0.3
	sfx.play("soft", -6, 0.6)

func poison_splash(e: Dictionary) -> void:
	first_react("毒", "毒を浴びた", Vector2(hero.x, hero.y))
	if hero.inv <= 0.35:
		hp -= 1
		red_v = 1.0
		shake = max(shake, 10 * shake_k())
		sfx.play("hurt", -6)
		if hp <= 0:
			hp = 0
			die()

## 相性: 困った字（敵）と、それを自動で解く仲間の字。仲間がいれば光の筋を当てて解く
const COUNTERS = [
	{"foe": "氷", "by": ["炎"], "into": "水", "say": "氷 → 水　炎で溶けた", "d": "氷の殻。炎がないと攻撃を弾く", "c": Color(0.95, 0.35, 0.2)},
	{"foe": "毒", "by": ["清"], "into": "", "say": "清 → 毒を浄めた", "d": "毒の墨。斬ると自分も毒を浴びる", "c": Color(0.5, 0.75, 1.0)},
	{"foe": "闇", "by": ["明", "日"], "into": "", "say": "光が闇を照らし消した", "d": "現れると全体が闇に沈む", "c": Color(1.0, 0.85, 0.4)},
	{"foe": "霧", "by": ["嵐"], "into": "雨", "say": "霧 → 雨　嵐が吹き払った", "d": "まわりの字の英単語を隠す", "c": Color(0.8, 0.85, 0.9)},
	{"foe": "鬼", "by": ["桃"], "into": "", "say": "桃が鬼を祓った", "d": "ときどき姿を消して狙えない", "c": Color(1.0, 0.6, 0.7)},
	{"foe": "呪", "by": ["祝"], "into": "", "say": "呪 → 祝　呪いが祝いに変わった（命 +1）", "d": "いるあいだ、主人公の踏み込みが鈍る", "c": Color(1.0, 0.75, 0.3)},
	{"foe": "炎", "by": ["水"], "into": "火", "say": "炎 → 火　水で鎮めた", "d": "通った跡に火を残す", "c": Color(0.4, 0.6, 1.0)},
	{"foe": "枯", "by": ["雨"], "into": "木", "say": "枯 → 木　雨でよみがえった", "d": "近くの仲間の木を枯らす", "c": Color(0.45, 0.55, 0.9)},
	{"foe": "雷", "by": ["金"], "into": "", "say": "金が雷を引き受けた", "d": "主人公めがけて雷を落とす", "c": Color(1.0, 0.9, 0.3)},
	{"foe": "岩", "by": ["戌"], "into": "石", "say": "岩 → 石　鉞で割った", "d": "固くて、斬撃も仲間の攻撃も弾く。戌（もとは鉞）を手に入れると割れるようになる", "c": Color(0.85, 0.8, 0.7)},
	{"foe": "蛇", "by": ["清"], "into": "", "say": "清 → 毒の跡を浄めた", "d": "通った跡に毒溜まりを残す（踏むと命が減る）", "c": Color(0.5, 0.75, 1.0), "passive": true},
	{"foe": "弓", "by": ["刀"], "into": "", "say": "刀が矢を斬り落とした", "d": "矢を撃ってくる（矢も英単語を打てば斬れる）", "c": Color(0.6, 0.7, 0.9), "passive": true},
	{"foe": "雲", "by": ["嵐"], "into": "", "say": "嵐が雲を吹き払った", "d": "雨粒を撃ってくる", "c": Color(0.8, 0.85, 0.9)},
	{"foe": "砲", "by": ["刀"], "into": "", "say": "刀が石を斬り落とした", "d": "石を撃ってくる", "c": Color(0.6, 0.7, 0.9), "passive": true},
]
## 一字を弾のように撃ってくる字: 撃つ字 → 弾の字
const SHOOTERS = {"弓": ["矢", "arrow", 2.6], "砲": ["石", "stone", 3.4], "雲": ["雨", "rain", 2.0]}
var PUDDLE: Array = []

## 霧のそばの字は英単語が隠れる
func fogged(e: Dictionary) -> bool:
	if e.ch == "霧" or has_counter("霧"):
		return false
	for f in E:
		if f.alive and f.ch == "霧" and Vector2(f.x - e.x, f.y - e.y).length() < 230 * SF:
			return true
	return false

func counter_of(foe: String) -> Dictionary:
	for c in COUNTERS:
		if c.foe == foe:
			return c
	return {}

## その困った字を解ける仲間がいるか（水は水の系統も含む）
func has_counter(foe: String) -> bool:
	var c = counter_of(foe)
	if c.is_empty():
		return false
	for k in c.by:
		if (Lw(k) if k == "水" else L(k)) > 0:
			return true
	return false

func counter_src(foe: String) -> Vector2:
	var c = counter_of(foe)
	for k in c.by:
		if ALLY.has(k):
			return AP(k)
		if k == "水" and ALLY.has(water_id()):
			return AP(water_id())
	return Vector2(hero.x, hero.y - 40 * SF)

## 明るい仲間がいるか（日・明の仲間、または作った字のうち光・火の系統）
func any_light() -> bool:
	if has_counter("闇"):
		return true
	for u in KU:
		if ["光", "炎"].has(String(u.pr.get("body", ""))) or ["日", "月", "光", "火", "白"].has(Kraft.rad_of(u.ch)):
			return true
	return false

## 相性のある字: 困った振る舞いと、仲間による自動の解決
func tick_states(dt: float) -> void:
	# 闇: 画面にいるあいだ、全体が闇に溶ける
	var darks = E.filter(func(e): return e.alive and e.ch == "闇" and not e.is_boss and Vector2(e.x - cam.x, e.y - cam.y).length() < max(W, H) * 0.9)
	dark_k += ((1.0 if darks.size() and boss == null else 0.0) - dark_k) * min(1.0, dt * 2.0)
	cursed = false
	for e in E:
		if not e.alive or e.is_boss or e.captive:
			continue
		var near: bool = on_view(e.x, e.y, 10)
		# 火の字（火・炎・灬の字）は、自分の字を火の玉にして放つ。落ちた所でめらめらと燃え残り、やがて消える
		if near and not kl_on and not e.get("still", false) and _is_fire(e.ch) and tick("enfire%d" % e.id, dt, 2.4):
			var to: Vector2 = Vector2(hero.x - e.x, hero.y - e.y)
			if to.length() < 520 * SF:
				var tgt: Vector2 = Vector2(hero.x, hero.y) + Vector2(rnd(-40, 40), rnd(-40, 40)) * SF
				EFIRE.append({"x": e.x, "y": e.y, "x0": e.x, "y0": e.y, "tx": tgt.x, "ty": tgt.y, "fly": 0.0, "fly_t": 0.7, "life": 3.0, "max": 3.0, "ch": e.ch, "s": e.size * 0.6})
				sfx.play("dash", -14, 0.7)
		var c = counter_of(e.ch)
		if c.is_empty():
			continue
		# ---- 困った振る舞い ----
		match e.ch:
			"鬼":
				# 3秒ごとに1.2秒だけ姿を消す
				e.ph_t = e.get("ph_t", rnd(0, 3)) + dt
				e.hidden = fmod(e.ph_t, 3.0) > 1.8 and not has_counter("鬼")
			"呪":
				if near:
					cursed = true
			"枯":
				if tick("kare%d" % e.id, dt, 1.0):
					for g in GROVE:
						if Vector2(g.x - e.x, g.y - e.y).length() < 220 * SF and g.t < g.life - 2.0:
							g.life = g.t + 1.0
			"弓", "砲", "雲":
				if near and not lab_hold():
					e.sh_t = e.get("sh_t", rnd(0.5, 1.5)) - dt
					if e.sh_t <= 0:
						e.sh_t = SHOOTERS[e.ch][2]
						fire_glyph(e, SHOOTERS[e.ch][0], SHOOTERS[e.ch][1])
			"雷":
				if near and not has_counter("雷"):
					e.th = e.get("th", 2.0) - dt
					if e.th <= 0:
						e.th = 4.0
						THUNDER.append({"x": hero.x, "y": hero.y, "t": 0.0, "hit": false})
		# ---- 仲間による解決: 光の筋を当て続けて解く ----
		if near and has_counter(e.ch) and not c.get("passive", false):
			e.res = e.get("res", 0.0) + dt
			if e.res > 1.2:
				resolve_counter(e, c)
	# 雷が落ちる（金がいれば金が引き受ける）
	for th in THUNDER:
		th.t += dt
		if th.t > 1.0 and not th.hit:
			th.hit = true
			flash = max(flash, 0.2)
			flash_col = Color(1, 1, 0.8)
			sfx.play("zap", -4, 0.8)
			if Vector2(hero.x - th.x, hero.y - th.y).length() < 70 * SF and hero.inv <= 0:
				hp -= 1
				hero.inv = 1.0
				red_v = 1.0
				if hp <= 0:
					hp = 0
					die()
	THUNDER = THUNDER.filter(func(th): return th.t < 1.4)
	# 炎の残り火
	for f in EFIRE:
		# 飛んでいる間は弧を描いて落ちる。落ちてから燃え残る
		if f.has("fly_t") and f.fly < f.fly_t:
			f.fly += dt
			var kf: float = clamp(f.fly / f.fly_t, 0.0, 1.0)
			f.x = lerp(float(f.x0), float(f.tx), kf)
			f.y = lerp(float(f.y0), float(f.ty), kf) - sin(kf * PI) * 70 * SF
			# 主人公に当たったら、そこで落ちて燃え残る
			if kf > 0.3 and Vector2(hero.x - f.x, hero.y - f.y).length() < 34 * SF:
				f.fly = f.fly_t
			else:
				continue
		f.life -= dt
		if Vector2(hero.x - f.x, hero.y - f.y).length() < 30 * SF and hero.inv <= 0 and hero.state != "dash":
			hp -= 1
			hero.inv = 1.0
			red_v = 1.0
			add_text(hero.x, hero.y - 50 * SF, "火傷", 18 * SF, KD.SHU, 0.6)
			if hp <= 0:
				hp = 0
				die()
	if has_counter("炎"):
		EFIRE.clear()
	# 毒溜まり（清がいれば浄められて消える）
	for pd in PUDDLE:
		pd.life -= dt
		if has_counter("蛇") and pd.life > 0.5:
			pd.life = 0.5
			pd.clean = true
		elif not pd.get("clean", false) and Vector2(hero.x - pd.x, hero.y - pd.y).length() < pd.r + 10 * SF and hero.inv <= 0 and hero.state != "dash":
			first_react("毒跡", "毒の跡を踏んだ", Vector2(hero.x, hero.y))
			hp -= 1
			hero.inv = 1.0
			red_v = 1.0
			if hp <= 0:
				hp = 0
				die()
	PUDDLE = PUDDLE.filter(func(pd): return pd.life > 0)
	# 刀がいれば、飛んでくる字を斬り落とす
	if L("刀") > 0:
		for b in E:
			if b.alive and b.get("shot", false) and Vector2(b.x - hero.x, b.y - hero.y).length() < blade_r() + 34 * SF:
				first_react("刀弾", "刀が飛んでくる字を斬り落とした", Vector2(b.x, b.y))
				slash(b.x - 20 * SF, b.y - 20 * SF, b.x + 20 * SF, b.y + 20 * SF, false)
				b.alive = false
				if b.has("spr") and is_instance_valid(b.spr):
					b.spr.visible = false
	EFIRE = EFIRE.filter(func(f): return f.life > 0)
	# 闇がときどき現れる
	if boss == null and not lab_on and time > 70 and tick("yami_ev", dt, 80.0) and not E.any(func(e): return e.alive and e.ch == "闇"):
		var an = rnd(0, TAU)
		spawn_enemy({"ch": "闇"}, Vector2(cam.x + cos(an) * W * 0.6, cam.y + sin(an) * H * 0.6))

## ---- 試験場 ----
## 試験場「個性」: 字ごとの動き
const LAB_BEH = [["charge", "牛", "近づくと身構えて震え、一直線に突進して通り過ぎる（牛・虎・猪・鹿・象・熊）"], ["kite", "弓", "間合いを取って回り込み、一字を撃ってくる（弓→矢・砲→石・雲→雨）"], ["leap", "蛙", "間をおいて大きく跳ぶ（蛙・猿）"], ["spiral", "風", "渦を巻きながら近づく（風・嵐・渦）"], ["burrow", "鼠", "地にもぐって速く近づき、顔を出して止まる（鼠・蟻）"], ["flee", "羊", "臆病で、近づかれると逃げる（羊・兎・狐）"], ["blink", "霊", "ふっと消えて近くに現れる（霊・鬼・幽）"], ["zig", "影", "左右にゆれながら来る（蛇・影）"], ["fly", "鳥", "はばたいて波打ちながら来る（鳥・蝶・鷹…）"], ["root", "木", "歩かず、地にもぐって一歩先に生え直す（草木）"], ["trail", "蛇", "通った跡に毒溜まりを残す（蛇）"], ["fast", "犬", "速く駆けてくる（犬・馬・猫）"]]

func lab_allies() -> Array:
	var out = []
	for id in KD.D.WEAP:
		if id != "命":
			out.append(id)
	for r in KD.fuse_rows():
		out.append(r[0])
	return out

func _open_devmap() -> void:
	start()
	devmap = true

func start_lab() -> void:
	start()
	lab_on = true
	next_boss = 1e9
	banner = null
	lab_mode = 0
	lab_i = 0
	lab_flag = 0
	lab_apply()

func lab_clear() -> void:
	for e in E:
		if e.alive and not e.get("still", false):
			e.alive = false
			if e.has("spr") and is_instance_valid(e.spr):
				e.spr.visible = false
	for k in ALLY.keys():
		if ALLY[k].has("spr"):
			ALLY[k].spr.queue_free()
	ALLY.clear()
	owned = {}
	absorbed = {}
	EFIRE.clear(); THUNDER.clear(); GROVE.clear(); ROT.clear(); PROJ.clear(); wave_rings.clear(); FUSE_FX.clear(); REVIVE.clear()
	dark_k = 0.0
	seen_react = {}
	timers = {}

func lab_apply() -> void:
	lab_clear()
	var hp0 = Vector2(hero.x, hero.y)
	if lab_mode == 2:
		var bb = LAB_BEH[lab_i % LAB_BEH.size()]
		for k in 3:
			var an: float = -0.6 + k * 0.6
			var f2 = spawn_enemy({"ch": bb[1]}, hp0 + Vector2(cos(an) * 330 * SF, sin(an) * 220 * SF))
			f2.born = 1.0
		return
	if lab_mode == 0:
		var c = COUNTERS[lab_i % COUNTERS.size()]
		if lab_flag == 1:
			owned[c.by[0]] = 1
		if c.foe == "枯":
			owned["木"] = 3
		var f = spawn_enemy({"ch": c.foe}, hp0 + Vector2(240 * SF, -70 * SF))
		f.born = 1.0
		f.spd *= 0.4
		if c.foe == "霧":
			for k in 4:
				var o = spawn_enemy(null, hp0 + Vector2(240 * SF + cos(k * 1.6) * 120 * SF, -70 * SF + sin(k * 1.6) * 90 * SF))
				o.born = 1.0
				o.spd *= 0.3
	else:
		var id: String = lab_allies()[lab_i % lab_allies().size()]
		var fr: Array = KD.fuse_of(id)
		if fr.is_empty():
			owned[id] = max(1, lab_flag)
		elif lab_flag == 0:
			# 素材をそろえておく（合体ボタンで合体）
			for part in [fr[1], fr[2]]:
				var pc: String = String(part).split("|")[0]
				owned[pc] = L(pc) + 1
		else:
			owned[id] = 1

func lab_next(d: int) -> void:
	var n: int = COUNTERS.size() if lab_mode == 0 else (lab_allies().size() if lab_mode == 1 else LAB_BEH.size())
	lab_i = (lab_i + d + n) % n
	lab_flag = 0 if lab_mode == 0 else 1
	if lab_mode == 1 and not KD.fuse_of(lab_allies()[lab_i]).is_empty():
		lab_flag = 0
	lab_apply()

func lab_toggle() -> void:
	if lab_mode == 2:
		lab_apply()
		return
	if lab_mode == 0:
		lab_flag = 1 - lab_flag
		lab_apply()
		return
	var id: String = lab_allies()[lab_i]
	var fr: Array = KD.fuse_of(id)
	if fr.is_empty():
		lab_flag = lab_flag % int(KD.D.WEAP[id].max) + 1
		owned[id] = lab_flag
	elif lab_flag == 0:
		lab_flag = 1
		var a: String = String(fr[1]).split("|")[0]
		var b: String = String(fr[2]).split("|")[0]
		do_ally_fuse([fr[0], a, b, fr[3], fr[4]])
	else:
		lab_flag = 0
		lab_apply()

func lab_switch() -> void:
	lab_mode = (lab_mode + 1) % 3
	lab_i = 0
	lab_flag = 0 if lab_mode == 0 else 1
	if lab_mode == 1 and not KD.fuse_of(lab_allies()[0]).is_empty():
		lab_flag = 0
	lab_apply()

func lab_quit() -> void:
	lab_on = false
	lab_clear()
	to_title()

func tick_lab(dt: float) -> void:
	if kl_on:
		kl_tick(dt)
		return
	hp = max_hp
	pending_lv = 0
	xp = 0
	# 仲間の試験では、まわりに字を絶やさない
	if lab_mode == 2 and movers() == 0 and tick("lab_sp2", dt, 1.0):
		lab_apply()
	if lab_mode == 1 and movers() < 9 and tick("lab_sp", dt, 0.4):
		var an = rnd(0, TAU)
		var e = spawn_enemy(null, Vector2(hero.x + cos(an) * 320 * SF, hero.y + sin(an) * 220 * SF))
		e.spd *= 0.35

func _draw_lab(ci: CanvasItem) -> void:
	var S: float = clamp(W / 1280.0, 0.75, 1.0)
	var pw: float = min(W - 40, 760 * S)
	var r = Rect2(W / 2 - pw / 2, H - 150 * S, pw, 120 * S)
	ci.draw_rect(r, Color(KD.WASHI, 0.95))
	ci.draw_rect(r, KD.SUMI, false, 2)
	var title = ""
	var desc = ""
	var stat = ""
	if lab_mode == 2:
		var bb = LAB_BEH[lab_i]
		title = "試験場・個性 %d/%d　「%s」" % [lab_i + 1, LAB_BEH.size(), bb[1]]
		desc = bb[2]
		stat = "主人公は倒れない。字の動きを見る（「出し直す」でもう一度）"
	elif lab_mode == 0:
		var c = COUNTERS[lab_i]
		title = "試験場・相性 %d/%d　「%s」" % [lab_i + 1, COUNTERS.size(), c.foe]
		desc = c.foe + " — " + c.d + "　／　解く仲間: " + "・".join(c.by)
		stat = ("仲間: " + c.by[0] + "（自動で解く → " + c.say + "）") if lab_flag == 1 else "仲間: なし（困った振る舞いを見る）"
	else:
		var id: String = lab_allies()[lab_i]
		var fr: Array = KD.fuse_of(id)
		title = "試験場・仲間 %d/%d　「%s」" % [lab_i + 1, lab_allies().size(), id]
		if fr.is_empty():
			var dl: Array = KD.D.WEAP[id].d
			desc = dl[min(lab_flag - 1, dl.size() - 1)]
			stat = "Lv %d / %d" % [lab_flag, int(KD.D.WEAP[id].max)]
		else:
			desc = "%s ＋ %s ＝ %s　%s" % [fr[1].replace("|", "／"), fr[2], fr[0], fr[4]]
			stat = "合体した" if lab_flag == 1 else "素材をそろえた（「合体」で合体を見る）"
	txt(ci, UF, r.position.x + 14, r.position.y + 8, title, 14 * S, KD.SHU)
	wrap_text(ci, UF, r.position.x + 14, r.position.y + 32 * S, desc, pw - 28, 12 * S, KD.SUMI, 2)
	txt(ci, UF, r.position.x + 14, r.position.y + 70 * S, stat, 12 * S, KD.AI)
	var by: float = r.end.y - 34 * S
	var bx: float = r.position.x + 14
	var tog = "出し直す" if lab_mode == 2 else ("仲間あり／なし" if lab_mode == 0 else ("Lv を上げる" if KD.fuse_of(lab_allies()[lab_i]).is_empty() else ("合体" if lab_flag == 0 else "素材に戻す")))
	var modes = ["相性", "仲間", "個性"]
	for bb in [["◀ 前", lab_next.bind(-1)], ["次 ▶", lab_next.bind(1)], [tog, lab_toggle], ["→ " + modes[(lab_mode + 1) % 3], lab_switch], ["終わる", lab_quit]]:
		var bw: float = tw(UF, bb[0], 13 * S) + 26
		button(ci, Rect2(bx, by, bw, 28 * S), bb[0], bb[1], "hud")
		bx += bw + 8
	txt(ci, UF, r.end.x - 14, by + 6 * S, "Tab 次へ　Space 切り替え　F1 相性・仲間・個性", 11 * S, Color(KD.SUMI, 0.6), 2)

func lab_hold() -> bool:
	return false

## 一字を弾のように撃つ（弾の字も英単語を打てば、その場で斬り落とせる）
func fire_glyph(e: Dictionary, ch: String, en: String) -> void:
	var b = spawn_enemy({"ch": ch, "en": en}, Vector2(e.x, e.y), "shot")
	var u = (Vector2(hero.x, hero.y) - Vector2(e.x, e.y)).normalized()
	b.shot = true
	b.svx = u.x
	b.svy = u.y
	b.sv = 110.0 * SF
	b.born = 1.0
	b.t = 0.0
	b.size = 30 * SF
	b.rad = 14 * SF
	add_text(e.x, e.y - e.size * 0.6, "放", 14 * SF, KD.SHU, 0.4)
	sfx.play("tick", -10, 0.7)

func resolve_counter(e: Dictionary, c: Dictionary) -> void:
	first_react(c.foe, c.say, Vector2(e.x, e.y))
	flash = max(flash, 0.15)
	flash_col = c.c
	for k in 20:
		var an = rnd(0, TAU)
		P.append({"k": "ink", "x": e.x, "y": e.y, "vx": cos(an) * 200, "vy": sin(an) * 200, "life": 0.6, "max": 0.6, "s": rnd(3, 5) * SF, "c": c.c})
	if c.foe == "呪":
		hp = min(max_hp, hp + 1)
	if c.into != "":
		set_node(e, KD.mk_node(c.into))
		e.res = 0.0
		e.flash = 0.3
		sfx.play("soft", -4, 0.7)
	else:
		kill_enemy(e, "weapon")
		sfx.play("lv", -8, 1.5)

func _draw_states(ci: CanvasItem) -> void:
	for pd in PUDDLE:
		var pa: float = clamp(pd.life / 1.0, 0.0, 1.0)
		if pd.get("clean", false):
			glow(ci, Vector2(pd.x, pd.y), pd.r * 2, Color(0.6, 0.85, 1.0, 0.5 * pa))
		else:
			glow(ci, Vector2(pd.x, pd.y), pd.r * 1.8, Color(0.3, 0.08, 0.35, 0.45 * pa))
			_dash_ellipse(ci, Vector2(pd.x, pd.y), pd.r, pd.r * 0.45, Color(0.35, 0.1, 0.4, 0.7 * pa), 2)
	# 炎の残り火
	for f in EFIRE:
		# 燃え残った字: めらめら揺れながら、立ちのぼって薄れていく
		var k: float = clamp(f.life / float(f.get("max", 2.5)), 0.0, 1.0)
		if f.has("fly_t") and f.fly < f.fly_t:
			# 飛んでいる火の玉: 尾を引く炎の玉（敵の字そのものとは見分けがつくよう、小さく燃えている）
			var kf2: float = clamp(f.fly / f.fly_t, 0.0, 1.0)
			for q in 4:
				var kq: float = max(0.0, kf2 - q * 0.06)
				var pq = Vector2(lerp(float(f.x0), float(f.tx), kq), lerp(float(f.y0), float(f.ty), kq) - sin(kq * PI) * 70 * SF)
				glow(ci, pq, f.s * (0.7 - q * 0.12), Color(1.0, 0.45 - q * 0.05, 0.1, 0.45 - q * 0.09))
			ci.draw_circle(Vector2(f.x, f.y), f.s * 0.28, Color(1.0, 0.75, 0.3, 0.9))
			glyph(ci, String(f.ch), Vector2(f.x, f.y), f.s * 0.45, Color(KD.SHU, 0.95))
			continue
		var fl: float = sin(ui_time * 17 + f.x * 0.1) * 0.12 + sin(ui_time * 29 + f.y) * 0.06
		var sz: float = float(f.get("s", 22 * SF)) * (0.55 + 0.45 * k)
		var p = Vector2(f.x + sin(ui_time * 9 + f.y) * 2, f.y - (1.0 - k) * 26 * SF)
		glow(ci, p, sz * 1.1, Color(1.0, 0.45, 0.1, 0.35 * k))
		var col: Color = Color(1.0, 0.55, 0.12).lerp(KD.SHU, 1.0 - k)
		glyph(ci, String(f.get("ch", "火")), p, sz, Color(col, 0.85 * k), Color(KD.KIN, 0.35 * k), 3, fl * 0.3, Vector2(1.0 - fl * 0.3, 1.0 + fl))
	# 雷の予兆と落雷
	for th in THUNDER:
		var p = Vector2(th.x, th.y)
		if th.t < 1.0:
			_dash_ellipse(ci, p, 70 * SF, 26 * SF, Color(1, 0.9, 0.3, 0.5 + 0.5 * sin(th.t * 30)), 2.5)
		else:
			var tgt: Vector2 = p
			if has_counter("雷"):
				tgt = Vector2(hero.x + 60 * SF, hero.y - 30 * SF)
				glyph(ci, "金", tgt, 34 * SF, KD.KIN, Color(KD.SUMI, 0.8), 4)
			var pts = PackedVector2Array([tgt + Vector2(0, -H)])
			for k in 6:
				pts.append(tgt + Vector2(rnd(-25, 25) * SF, -H + H * (k + 1) / 6.0))
			ci.draw_polyline(pts, Color(1, 0.95, 0.6, 1.4 - th.t), 5 * SF, true)
	# 呪われている
	if cursed:
		for k in 3:
			var an = ui_time * 2 + k * TAU / 3
			glyph(ci, "呪", Vector2(hero.x + cos(an) * 50 * SF, hero.y + sin(an) * 30 * SF), 16 * SF, Color(0.55, 0.25, 0.65, 0.7), Color.TRANSPARENT, 0)
	for e in E:
		if not e.alive or not on_view(e.x, e.y, 30):
			continue
		var c = counter_of(e.ch)
		if c.is_empty():
			continue
		match e.ch:
			"毒":
				glow(ci, Vector2(e.x, e.y), e.size * 1.3, Color(0.35, 0.12, 0.4, 0.35 + sin(ui_time * 5 + e.x) * 0.08))
				for k in 4:
					var ph = fposmod(ui_time * 0.7 + k * 0.25 + e.x * 0.01, 1.0)
					var a: float = ph * TAU + k
					ci.draw_circle(Vector2(e.x + cos(a) * e.size * 0.55, e.y + e.size * 0.3 + ph * 20 * SF), (1.0 - ph) * 6 * SF, Color(0.2, 0.05, 0.22, 0.7 * (1.0 - ph)))
			"氷":
				ci.draw_arc(Vector2(e.x, e.y), e.size * 0.62, 0, TAU, 6, Color(0.75, 0.9, 1.0, 0.8), 3 * SF, true)
				ci.draw_arc(Vector2(e.x, e.y), e.size * 0.5, 0.5, TAU + 0.5, 6, Color(0.85, 0.95, 1.0, 0.45), 1.5 * SF, true)
			"岩":
				ci.draw_arc(Vector2(e.x, e.y), e.size * 0.6, 0, TAU, 5, Color(0.45, 0.4, 0.35, 0.8), 4 * SF, true)
				if has_counter("岩"):
					_draw_cracks(ci, Vector2(e.x, e.y), e.size * 0.55, e.id, 0.8)
			"霧":
				if not has_counter("霧"):
					for k in 5:
						var an2 = ui_time * 0.3 + k * 1.3
						glow(ci, Vector2(e.x + cos(an2) * 120 * SF, e.y + sin(an2) * 70 * SF), 150 * SF, Color(0.85, 0.87, 0.9, 0.35))
			"鬼":
				if e.get("hidden", false):
					glow(ci, Vector2(e.x, e.y), e.size, Color(0.6, 0.3, 0.7, 0.2 + sin(ui_time * 12) * 0.08))
			"枯":
				glow(ci, Vector2(e.x, e.y), e.size * 1.4, Color(0.5, 0.35, 0.15, 0.25))
			"雷":
				if randf() < 0.3:
					ci.draw_line(Vector2(e.x, e.y), Vector2(e.x + rnd(-30, 30) * SF, e.y + rnd(-30, 30) * SF), Color(1, 0.95, 0.5, 0.8), 2)
		# 仲間が光の筋を当てて解いているところ
		if e.get("res", 0.0) > 0 and has_counter(e.ch):
			var src: Vector2 = counter_src(e.ch)
			var k2: float = clamp(e.res / 1.2, 0.0, 1.0)
			ci.draw_line(src, Vector2(e.x, e.y), Color(c.c, 0.35 + 0.4 * k2), (3 + 6 * k2) * SF, true)
			glow(ci, Vector2(e.x, e.y), e.size * (0.8 + k2), Color(c.c, 0.35 * k2))
			glyph(ci, c.by[0], src + Vector2(0, -34 * SF), 20 * SF, c.c, Color(KD.SUMI, 0.7), 3)

func _draw_darkness(ci: CanvasItem) -> void:
	if dark_k < 0.02:
		return
	var c = Vector2(W / 2, H / 2) + (Vector2(hero.x, hero.y) - cam)
	if any_light():
		# 明るい仲間がいれば、主人公のまわりだけ灯る
		var r_in: float = 150 * SF
		var r_out: float = max(W, H) * 1.5
		ci.draw_arc(c, (r_in + r_out) / 2, 0, TAU, 64, Color(0.02, 0.02, 0.05, 0.82 * dark_k), r_out - r_in)
		ci.draw_arc(c, r_in + 20 * SF, 0, TAU, 64, Color(0.02, 0.02, 0.05, 0.4 * dark_k), 40 * SF)
	else:
		# 明るい仲間がいなければ、画面はすべて闇（自分の字だけはかすかに見える）
		ci.draw_rect(Rect2(0, 0, W, H), Color(0.02, 0.02, 0.05, 0.96 * dark_k))
		hero_glyph(ci, c, 46 * SF, Color(KD.SHU, 0.75 * dark_k))
	# 闇の字だけは闇の中に浮かぶ。光があればそこへ光が射す
	for e in E:
		if e.alive and e.ch == "闇":
			var sp = Vector2(W / 2, H / 2) + (Vector2(e.x, e.y) - cam)
			if any_light():
				var src = Vector2(W / 2, H / 2) + (AP("明" if ALLY.has("明") else "日") - cam)
				var nrm = (sp - src).orthogonal().normalized()
				ci.draw_colored_polygon(PackedVector2Array([src + nrm * 6, src - nrm * 6, sp - nrm * e.size * 0.8, sp + nrm * e.size * 0.8]), Color(KD.KIN, 0.25 * dark_k))
				glow(ci, sp, e.size * 1.2, Color(KD.KIN, 0.45 * min(1.0, e.get("res", 0.0))))
			glyph(ci, "闇", sp, e.size, Color(0.6, 0.45, 0.8, dark_k), Color(0, 0, 0, 0.8 * dark_k), 4)
			# 闇の札（打つ英単語）は闇に沈めない。打てなければ倒せないため
			var fs: float = (17.0 if e.typed != "" else 14.0) * max(0.85, SF)
			var wd: String = String(e.word)
			var tw0: float = tw(MF, wd, fs)
			var ly: float = sp.y + e.size * 0.62
			ci.draw_rect(Rect2(sp.x - tw0 / 2 - 7, ly, tw0 + 14, fs + 9), Color(KD.WASHI, 0.92))
			ci.draw_rect(Rect2(sp.x - tw0 / 2 - 6.5, ly + 0.5, tw0 + 13, fs + 8), Color(0.6, 0.45, 0.8, 0.9), false, 1.5)
			var dn: int = String(e.typed).length()
			txt(ci, MF, sp.x - tw0 / 2, ly + 3, wd.substr(0, dn), fs, KD.SHU)
			txt(ci, MF, sp.x - tw0 / 2 + tw(MF, wd.substr(0, dn), fs), ly + 3, wd.substr(dn), fs, KD.SUMI)

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
	if false and boss == null and tick("river_ev", dt, 55.0 if stage_i() >= 1 else 90.0) and RIVERS.is_empty() and time > 20:
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
	RIVERS = RIVERS.filter(func(r): return r.get("map", false) or abs(r.y - cam.y) < max(W, H) * 2.2)

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
	if glyph_gimmicks.use(self, t):
		return
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
			# 字の神が、持っている魂を一つずつ増やす（作字台の材料）
			for sk in souls.keys().slice(0, 4):
				souls[sk] = int(souls[sk]) + 1
				soul_note(sk, false)
			add_text(t.x, t.y - 60 * SF, "祠 — 魂が増えた", 18 * SF + 4, KD.KIN, 1.4)
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
	if not (KD.D.WEAP.has(ch) or KD.D.PARTS.has(ch)):
		return
	# 魂は数で貯まる（作字台の材料）。初めての字は大きく見せる
	var first: bool = not souls.has(ch)
	souls[ch] = int(souls.get(ch, 0)) + 1
	# 吸い込む演出はやめ、画面の隅に入手を知らせる（初めての字は NEW）
	soul_note(ch, first)

## 入手の知らせ（左の隅に積む。同じ字は数をまとめる）
var NOTES: Array = []
func soul_note(ch: String, first: bool) -> void:
	for nt in NOTES:
		if nt.ch == ch and not nt.first and nt.t < 1.6:
			nt.n += 1
			nt.t = min(nt.t, 0.3)
			nt.pop = 1.0
			return
	NOTES.push_front({"ch": ch, "first": first, "t": 0.0, "n": 1, "pop": 1.0})
	if NOTES.size() > 6:
		NOTES.resize(6)
	if first:
		sfx.play("stamp", -6, 1.3)
		sfx.koto(5)
	else:
		sfx.play("tick", -18, 1.6)

func _draw_notes(ci: CanvasItem) -> void:
	if NOTES.is_empty():
		return
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.75, 1.2)
	var x0: float = 14 * S
	var y: float = H * 0.30
	for nt in NOTES:
		var life: float = 4.0 if nt.first else 1.8
		var a: float = clamp(min(nt.t / 0.15, (life - nt.t) / 0.4), 0.0, 1.0)
		var slide: float = (1.0 - clamp(nt.t / 0.18, 0.0, 1.0)) * -60 * S
		var h: float = (64 if nt.first else 40) * S
		var w: float = (230 if nt.first else 128) * S
		var r = Rect2(x0 + slide, y, w, h)
		ci.draw_rect(r, Color(KD.WASHI, 0.92 * a))
		ci.draw_rect(r, Color(KD.SHU if nt.first else KD.SUMI, (0.9 if nt.first else 0.35) * a), false, (2.5 if nt.first else 1.0) * S)
		var gs: float = h * 0.72 * (1.0 + 0.25 * nt.pop)
		glyph(ci, nt.ch, Vector2(r.position.x + h * 0.5, r.get_center().y), gs, Color(KD.SUMI, a), Color(KD.WASHI, 0.8 * a), 3)
		var w2: String = craft_word(nt.ch)
		if nt.first:
			# NEW の朱印
			var sr = Rect2(r.end.x - 52 * S, r.position.y - 10 * S, 48 * S, 22 * S)
			ci.draw_rect(sr, Color(KD.SHU, a))
			txt(ci, UF, sr.get_center().x, sr.position.y + 2 * S, "NEW", 13 * S, Color(KD.WASHI, a), 1)
			txt(ci, UF, r.position.x + h + 4 * S, r.position.y + 8 * S, "新しい魂", 12 * S, Color(KD.SHU, a))
			txt(ci, PF, r.position.x + h + 4 * S, r.position.y + 28 * S, w2, 18 * S, Color(KD.SUMI, a))
		else:
			txt(ci, PF, r.position.x + h + 2 * S, r.position.y + 11 * S, "×%d" % nt.n, 15 * S, Color(KD.SUMI, 0.85 * a))
		y += h + 8 * S

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
	if semantic_combat.protect(self, e):
		return
	if kl_on:
		kl.touch += 1
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

func _is_fire(ch: String) -> bool:
	if ch == "火" or ch == "炎":
		return true
	return Kraft.has(ch) and (Kraft.rad_of(ch) == "火" or Kraft.NORM.get(Kraft.rad_of(ch), "") == "火")

## 蛇の列: 頭を斬ると、列が尾まで一撃で連鎖して崩れる。崩れた蛇は部首の虫になり、ばらばらに襲ってくる
func _snake_chain(head: Dictionary) -> void:
	var g = head.get("grp", -1)
	var mem = E.filter(func(m): return m.alive and m.get("grp", -2) == g and not m.get("lead", false))
	mem.sort_custom(func(a, b): return int(a.idx) < int(b.idx))
	var prev = Vector2(head.x, head.y)
	for i in mem.size():
		later(0.05 * (i + 1), _snake_hit.bind(mem[i], prev, i))
		prev = Vector2(mem[i].x, mem[i].y)
	head.erase("grp")
	head.lead = false
	head.fmove = false
	if mem.size():
		later(0.05 * mem.size() + 0.1, func(): add_text(head.x, head.y - 70 * SF, "蛇 連鎖 ×%d" % (mem.size() + 1), 20 * SF + 6, KD.SHU, 1.2))
		combo += mem.size()
		max_combo = max(max_combo, combo)

func _snake_hit(m: Dictionary, pp: Vector2, i: int) -> void:
	if not m.alive:
		return
	m.erase("grp")
	m.fmove = false
	m.beh = "walk"
	m.locked = false
	m.typed = ""
	slash(pp.x, pp.y, m.x, m.y, false)
	sfx.play("slash", -12, 1.1 + i * 0.03)
	break_part(m, 0.0, -1.0, "chain")
	# 散る
	var a: float = rnd(0, TAU)
	m.kx += cos(a) * 260
	m.ky += sin(a) * 260
	m.daze = max(float(m.get("daze", 0.0)), 0.4)

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
	break_part(x, 0.0, -1.0, "chain")
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
		if e.alive and (e.get("still", false) and e.get("obj", "") == "" or e.has("guard")) and not on_view(e.x, e.y, -80):
			e.alive = false
			if e.has("spr") and is_instance_valid(e.spr):
				e.spr.visible = false
	# 見えている所の草木はそのまま、これから行く所は新しい景の草木になる
	var cc = Vector2i(floori(cam.x / CHS()), floori(cam.y / CHS()))
	chunks = {}
	for dx in range(-1, 2):
		for dy in range(-1, 2):
			chunks[cc + Vector2i(dx, dy)] = true
	stage_origin = Vector2(hero.x, hero.y)
	# 前の景の川は流れ去り、新しい景の配置をいま見えている区画にも置く
	RIVERS = RIVERS.filter(func(r): return not r.get("map", false))
	for k in chunks:
		place_map_items(k)
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
	if id.begins_with("K:"):
		for u in KU:
			if "K:" + u.ch == id:
				return Vector2(u.x, u.y)
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
					# 水は押し返さない（押し返すと近寄れず、無敵になってしまう）
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
	# 嵐: 3秒ごとに突風で近くの字を吹き払う
	if L("嵐") and tick("arashi", dt, 3.0):
		var apa = AP("嵐")
		for e in E:
			if e.alive and not e.is_boss and not e.get("still", false) and Vector2(e.x - hx, e.y - hy).length() < 260 * SF:
				var ua = (Vector2(e.x, e.y) - Vector2(hx, hy)).normalized()
				e.kx += ua.x * 260; e.ky += ua.y * 260
		for k in 30:
			var an = rnd(0, TAU)
			P.append({"k": "ink", "x": apa.x, "y": apa.y, "vx": cos(an) * 420, "vy": sin(an) * 260, "life": 0.5, "max": 0.5, "s": 2.0 * SF, "c": Color(0.6, 0.65, 0.7)})
		sfx.play("soft", -8, 0.5)
	# 桃: 2.5秒ごとに近くの字へ桃を投げる
	if L("桃") and tick("momo", dt, 2.5):
		var apm3 = AP("桃")
		var tmo = nearest(apm3, 300 * SF)
		if tmo != null:
			BOLT.append({"pts": [apm3, Vector2(tmo.x, tmo.y)], "life": 0.25, "max": 0.25, "ray": true, "w": 0.3, "c": Color(1.0, 0.6, 0.7)})
			dmg_enemy(tmo, 2, "桃")
	# 祝: 40秒ごとに命が戻る
	if L("祝") and tick("iwai", dt, 40.0) and hp < max_hp:
		hp += 1
		add_text(hx, hy - 60 * SF, "祝", 26 * SF, KD.KIN, 0.8)
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
		# 試験: --introdt=0.5 で一コマごとに 0.5 秒ずつ進める（カットの見本を撮る）
		intro_t += float(test_mode.introdt) if test_mode.has("introdt") else dt
		if intro_hold >= 0:
			intro_t = intro_hold
		_intro_sounds()
		if intro_t > INTRO_LEN:
			to_title()
	if craft.fx != null:
		craft.fx.t += dt
	if craft.msg_t > 0:
		craft.msg_t -= dt
	for f in FUSE_FX:
		f.t += dt
	for rv in REVIVE:
		rv.t += dt
	REVIVE = REVIVE.filter(func(rv): return rv.t < 1.5)
	for nt in NOTES:
		nt.t += dt
		nt.pop = max(0.0, nt.pop - dt * 5)
	NOTES = NOTES.filter(func(nt): return nt.t < (4.0 if nt.first else 1.8))
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
	# 決戦（漢詩の怪物）の間は恐ろしい曲に
	var bk: float = 1.0 if (boss != null or oni != null) and state != "title" else 0.0
	sfx.set_boss(lerp(sfx.boss_mix, bk, min(1.0, get_process_delta_time() * 1.5)))
	bg_mat.set_shader_parameter("cam", cam)
	bg_mat.set_shader_parameter("night", night)
	bg_mat.set_shader_parameter("time", ui_time)
	bg_mat.set_shader_parameter("calm", 1.0 if calm else 0.0)
	world.position = Vector2(W / 2, H / 2) - cam + sh
	_test_hook(dt)
	_tick_dof()
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
	if devmap:
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
	if lab_on:
		tick_lab(dt)
	else:
		tick_rivers(dt)
	tick_states(dt)
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
	kraft_tick(dt)
	_k_separate(Vector2(hero.x, hero.y))
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
			# 飛んでくる字は、画面の外へ出てから消える（画面の中で長く残ったものは砕けて消える）
			if e.t > 10 and not on_view(e.x, e.y, -40):
				e.alive = false
			elif e.t > 16 and e.alive:
				e.alive = false
				shatter(e.x, e.y, e.ch, e.size, 0.6, KD.SUMI)
			continue
		if e.get("still", false):
			# 野の字は根を張って動かない
			e.rest = max(0.0, e.get("rest", 0.0) - dt)
			e.kx = 0.0; e.ky = 0.0; e.vx = 0.0; e.vy = 0.0
			continue
		if e.get("guard", false):
			# 配置された字: 主人公が近づくまでその場で待つ（壁の岩は動かない）
			if e.get("wall", false) or d > 480 * SF:
				e.kx *= 0.5; e.ky *= 0.5
				e.x += e.kx * dt
				e.y += e.ky * dt
				continue
			e.guard = false
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
		v = beh_move(e, u, d, sp, v, dt)
		if e.get("fmove", false):
			v = Vector2.ZERO
		if e.captive:
			v = Vector2(0, sin(e.t * 2) * 8)
		elif e.gift:
			v = Vector2(-u.y * sp * 1.6 + u.x * sp * 0.4, u.x * sp * 1.6 + u.y * sp * 0.4)
			# 時間がたつと、画面の外へ歩み去る（画面の中で消えはしない）
			if e.t > 24:
				v = -u * sp * 2.6
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
		if e.gift and not e.captive and e.t > 24 and not on_view(e.x, e.y, -80):
			e.alive = false
		if Vector2(e.x - cam.x, e.y - cam.y).length() > max(W, H) * 1.6 and not e.locked and not e.captive and not e.has("guard"):
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
	glyph_gimmicks.tick(self, dt)
	weapons(dt)
	step_fx(dt)
	for e in E:
		if not e.alive:
			_free_sprite(e)
	E = E.filter(func(e): return e.alive)
	# 字魂転生の三択はやめた（仲間は作字台で作る）。段位が上がると命が一つ戻るだけ
	if state == "play" and pending_lv > 0:
		level_reward()

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
	if boss_intro > 0:
		return
	o.daze = max(0.0, o.daze - dt)
	o.bite_t = max(0.0, o.bite_t - dt)
	var dv = Vector2(hero.x - o.x, hero.y - o.y)
	var d: float = max(1.0, dv.length())
	var u = dv / d
	var spd: float = (58.0 + min(boss_idx, 5) * 6) * SF * (1 + time / 900.0)
	var v = Vector2.ZERO
	o.st_t -= dt
	match o.st:
		"walk":
			v = u * spd * (0.1 if o.daze > 0 else 1.0)
			# 突進はしない。ただ迫ってくる
			if false:
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

func level_reward() -> void:
	while pending_lv > 0:
		pending_lv -= 1
		hp = min(max_hp, hp + 1)
	add_text(hero.x, hero.y - 70 * SF, "段位 %s — 命 +一" % KD.kn(level), 18 * SF + 4, KD.KIN, 1.2)
	sfx.play("lv", -8)

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
	if false and souls.has("犬") and L("犬") == 0 and not pool.any(func(q): return q.id == "犬"):
		if pool.size() >= 3:
			pool.pop_back()
		pool.insert(0, {"t": "p", "id": "犬", "en": "dog"})
	# 自機の字: 最初の三択にはかならず出る（以後もときどき）。選ぶとその字が仲間になる
	var hc: String = hero_ch()
	# 自機の字は「自機の字」の札だけで出す（部品の札では出さない）
	if hc != "" and not KD.D.WEAP.has(hc):
		pool = pool.filter(func(q): return q.id != hc)
	# 自機の字は一字のままでは仲間にならない（作字台の材料にだけなる）
	if false and hc != "" and not KD.D.WEAP.has(hc) and Kraft.has(hc) and not pool.any(func(q): return q.id == hc) and (not first_done or randf() < 0.3):
		var hen: String = String(hero_def.get("en", hc))
		pool = pool.filter(func(q): return String(q.en)[0] != hen[0])
		if pool.size() >= 3:
			pool.pop_back()
		pool.insert(0, {"t": "k", "id": hc, "en": hen})
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

## 自機の字（作字台ではいつでも材料にできる）
func hero_ch() -> String:
	return String(hero_def.get("ch", "")) if not hero_def.is_empty() else ""

func card_info(p: Dictionary) -> Dictionary:
	var desc = ""
	if p.t == "k":
		var lv: int = k_lv(p.id)
		var pr: Dictionary = Kraft.prof(p.id, lv + 1)
		var head: String = ("自機の字 %sを使役 — " % p.id) if lv == 0 else ("Lv%d→%d　" % [lv, lv + 1])
		desc = head + k_desc(p.id)
		var ex: Array = []
		for r in Kraft.USES.get(p.id, []):
			var op: Array = Kraft.K[r].op
			var other: String = op[1] if op[0] == p.id else op[0]
			if craft_avail(other) > 0 and other != p.id:
				ex.append("%s＋%s＝%s" % [op[0], op[1], r])
			if ex.size() >= 4:
				break
		var nu: int = Kraft.USES.get(p.id, []).size()
		var et: String = ex[0] if ex.size() else "%d字に組める" % nu
		desc += "\n作字台では自機の字がいつでも材料になる（%d字に組める）" % nu + ("。いま作れる: " + "　".join(ex) if ex.size() else "")
		return {"desc": desc, "evo": true, "part": false, "evo_txt": et, "n": lv}
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
			fz_lines.append("作字の素材: %s ＋ %s → %s" % [other, p.id, (r[0] + "（" + r[3] + "）") if rec_known(r[0]) else "？"])
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
	elif p.t == "k":
		kraft_add(p.id)
		if k_lv(p.id) == 1:
			start_revive(p.id)
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
		# 合体は自動では起きない。作字台（Tab）で自分の意思で合体させる
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

## ---- 作字台: 魂を二つ重ねて、自分の意思で字を作る（Tab で開く。時は止まる） ----
var craft = {"a": "", "b": "", "more": [], "pending": "", "typed": "", "cur": 0, "msg": "", "msg_t": 0.0, "fx": null, "made": [], "rows": []}

func rec_known(res: String) -> bool:
	return meta.get("rec", {}).has(res) or craft.made.has(res)

## 作った字の仲間の Lv（いなければ 0）
func k_lv(ch: String) -> int:
	for u in KU:
		if u.ch == ch:
			return int(u.lv)
	return 0

## 材料として使える数: 箱の魂＋仲間の Lv（犬・命は材料にならない）
func craft_avail(ch: String) -> int:
	if ch == hero_ch() and state != "title":
		return 99
	var n: int = int(souls.get(ch, 0)) + k_lv(ch)
	if not ["犬", "命", "力"].has(ch):
		n += L(ch)
	return n

## 台に置いた材料（三つ目・四つ目も）
func craft_parts() -> Array:
	var out: Array = []
	for c in [craft.a, craft.b] + craft.more:
		if c != "":
			out.append(c)
	return out

## 材料が箱に足りているか（同じ字を何度使うかも数える）
func craft_enough(parts: Array) -> bool:
	# 自機の字だけでは作れない（何も倒さずに仲間が増えてしまうため）。魂を一つは使う
	if not parts.any(func(c): return c != hero_ch()):
		return false
	var need = {}
	for c in parts:
		need[c] = int(need.get(c, 0)) + 1
	for c in need:
		if c == hero_ch():
			continue
		if craft_avail(c) < int(need[c]):
			return false
	return true

## 箱の字で、部品（leaf）を何個ずつ持っているか: {部品: [箱の字, 数]}
func craft_leaf_stock(box: Array) -> Dictionary:
	var st = {}
	for c in box:
		var m: String = Kraft.mat(c)
		var n: int = 99 if c == hero_ch() else craft_avail(c)
		if not st.has(m) or int(st[m][1]) < n:
			st[m] = [c, n]
	return st

## 三つ・四つの部品でできる字のうち、いまの箱で作れるもの: [[字, [材料...]], ...]
var _multi_cache_key := ""
var _multi_cache: Array = []
func craft_multi(box: Array) -> Array:
	var sig: String = str(souls) + str(KU.map(func(u): return [u.ch, u.lv])) + str(owned)
	if sig == _multi_cache_key:
		return _multi_cache
	_multi_cache_key = sig
	_multi_cache = []
	var st: Dictionary = craft_leaf_stock(box)
	for key in Kraft.SETREC:
		var need = {}
		for x in String(key).split("|"):
			need[x] = int(need.get(x, 0)) + 1
		var ok := true
		var mats: Array = []
		for x in need:
			if not st.has(x) or int(st[x][1]) < int(need[x]):
				ok = false
				break
			for q in int(need[x]):
				mats.append(st[x][0])
		if ok:
			for r in Kraft.SETREC[key]:
				_multi_cache.append([r, mats])
	return _multi_cache

## いまの材料に足していけば、まだ作れる字があるか
func craft_can_extend(parts: Array, box: Array) -> String:
	var have = {}
	for c in parts:
		var m: String = Kraft.mat(c)
		have[m] = int(have.get(m, 0)) + 1
	for row in craft_multi(box):
		var lv: Array = Kraft.K[row[0]].lv
		if lv.size() <= parts.size():
			continue
		var cnt = {}
		for x in lv:
			cnt[x] = int(cnt.get(x, 0)) + 1
		var ok := true
		for m in have:
			if int(cnt.get(m, 0)) < int(have[m]):
				ok = false
				break
		if ok:
			return row[0]
	return ""

## 箱に並ぶ字: 魂があるもの、または材料になる仲間
func craft_box() -> Array:
	Kraft.load_db()
	var out: Array = []
	# 自機の字はいつでも箱にある（減らない）
	if hero_ch() != "" and Kraft.USES.has(hero_ch()):
		out.append(hero_ch())
	for ch in souls:
		if int(souls[ch]) > 0 and not out.has(ch):
			out.append(ch)
	var al: Array = owned.keys() + KU.map(func(u): return u.ch)
	for ch in al:
		if out.has(ch) or craft_avail(ch) <= 0 or ["犬", "命", "力"].has(ch):
			continue
		if Kraft.USES.has(ch):
			out.append(ch)
	return out

## 仲間の字の説明: 部首が効果、意味が動き（例: 灯 — 部首 火・燃やす／照らす）
func k_desc(ch: String) -> String:
	var pr: Dictionary = Kraft.prof(ch, max(1, k_lv(ch)))
	var mv: String = String(pr.get("motion", ""))
	var how: String = Kraft.MOTION_JP[mv][0] if mv != "" else Kraft.BODY[pr.body][1]
	var inherited: Array = []
	for material in pr.get("traits", []):
		inherited.append("%s:%s" % [material.source, Kraft.EFFECT_JP.get(material.effect, material.family).split("（")[0]])
	var extra: String = " ＋ " + "・".join(inherited) if not inherited.is_empty() else ""
	var rare: String = "【転義】" if pr.get("transform", false) else ""
	return "%s%s／部首 %s・%s%s" % [rare, how, Kraft.rad_of(ch), Kraft.effect_jp(ch).split("（")[0], extra]

func _craft_growth(ch: String) -> String:
	var pr: Dictionary = Kraft.prof(ch, max(1, k_lv(ch)))
	var basis: String = String(pr.get("transform_note", "")) if pr.get("transform", false) else String(pr.get("semantic_note", ""))
	return basis + "　重ねる → " + String(pr.get("growth_next", "範囲・数・持続が育つ"))

## 字典の一行: [字, 一つ目, 二つ目, 英語, 技の説明]
func k_row(res: String, a: String, b: String) -> Array:
	var pr: Dictionary = Kraft.prof(res)
	var d: String = k_desc(res)
	return [res, a, b, String(Kraft.K.get(res, {}).get("en", "")), d]

func craft_row(a: String, b: String) -> Array:
	var rs: Array = Kraft.make(a, b)
	if rs.is_empty():
		return []
	return k_row(rs[0], a, b)

## いま作れる組み合わせ（箱の字を二つ選んで字になるもの）
var _craft_cache_key := -1
var _craft_cache_rows: Array = []
func craft_list() -> Array:
	var cache_key: int = hash([souls, owned, KU.map(func(u): return [u.ch, u.lv]), hero_ch()])
	if cache_key == _craft_cache_key:
		return _craft_cache_rows.duplicate()
	var out: Array = []
	var seen = {}
	var box: Array = craft_box()
	for a in box:
		for b in box:
			if a == b and (craft_avail(a) < 2 or a == hero_ch()):
				continue
			for r in Kraft.REC.get(a + "+" + b, []):
				if not seen.has(r) and Kraft.can_ally(r):
					seen[r] = 1
					out.append(k_row(r, a, b))
	for row in craft_multi(box):
		if seen.has(row[0]) or not Array(row[1]).any(func(c): return c != hero_ch()):
			continue
		seen[row[0]] = 1
		var ms: Array = row[1]
		var rw: Array = k_row(row[0], "＋".join(ms.slice(0, 2)), "＋".join(ms.slice(2)))
		rw.append(ms)
		out.append(rw)
	_craft_cache_key = cache_key
	_craft_cache_rows = out.duplicate()
	return out

## 字典に並べる字: いま作れる字と、これまでに作った字
func craft_dict_rows() -> Array:
	var out: Array = craft_list()
	var seen = {}
	for r in out:
		seen[r[0]] = 1
	for c in meta.get("rec", {}):
		if seen.has(c) or not Kraft.K.has(c):
			continue
		var op: Array = Kraft.K[c].op
		if op.size() == 2:
			out.append(k_row(c, op[0], op[1]))
	return out

func open_craft() -> void:
	if state != "play" or lab_on:
		return
	state = "craft"
	craft.a = ""
	craft.b = ""
	craft.more = []
	craft.pending = ""
	craft.typed = ""
	craft.msg = ""
	craft.fx = null
	craft.made = []
	sfx.play("brush", -8, 1.2)

func close_craft() -> void:
	if state != "craft":
		return
	state = "play"
	var i = 0
	for res in craft.made:
		if k_lv(res) == 1:
			later(0.15 + i * 0.5, start_revive.bind(res))
			i += 1
	if craft.made.size():
		var r = craft.made[craft.made.size() - 1]
		var row = k_row(r, "", "")
		later(0.3, show_banner.bind(r, (String(row[3]).to_upper() + " — " + String(row[4])) if row.size() > 4 else "", false, true))
	craft.made = []

func craft_put(ch: String) -> void:
	if craft.fx != null and craft.fx.t < 0.6:
		return
	if craft.a == "":
		craft.a = ch
	elif craft.b == "":
		craft.b = ch
	elif craft.more.size() < 2:
		craft.more.append(ch)
	else:
		craft.a = ch
		craft.b = ""
		craft.more = []
	craft.pending = ""
	sfx.play("tick", -4)
	if craft.a != "" and craft.b != "":
		craft_try()

## 材料を置くたびに: 字になれば作る。まだ足せば別の字になるなら待つ（Enter で今の字を作る）
func craft_try() -> void:
	var parts: Array = craft_parts()
	if parts.size() > 2 or Kraft.make_set(parts).size() > 0 and craft_can_extend(parts, craft_box()) != "":
		_craft_try_set(parts)
		return
	if parts.size() == 2 and Kraft.make(parts[0], parts[1]).is_empty():
		_craft_try_set(parts)
		return
	_craft_try2()

func _craft_try_set(parts: Array) -> void:
	if not craft_enough(parts):
		_craft_msg("魂が足りない")
		_craft_pop()
		return
	var exact: Array = Kraft.make_set(parts)
	var more: String = craft_can_extend(parts, craft_box()) if parts.size() < 4 else ""
	if exact.is_empty():
		if more != "":
			_craft_msg("まだ足りない ─ 部品をもう一つ置く")
			return
		_craft_msg("%s では字にならない" % " ＋ ".join(parts))
		sfx.play("thud", -10, 1.4)
		_craft_pop()
		return
	if more != "":
		craft.pending = exact[0]
		_craft_msg("Enter で %s を作る ／ 部品を足すと別の字になる" % exact[0])
		return
	craft_make(exact[0], parts)

func _craft_pop() -> void:
	if craft.more.size():
		craft.more.pop_back()
	else:
		craft.b = ""

## 材料を使って字を作る
func craft_make(res: String, parts: Array) -> void:
	for c in parts:
		craft_use(c)
	var fresh: bool = not rec_known(res)
	kraft_add(res)
	if not craft.made.has(res):
		craft.made.append(res)
	var rec: Dictionary = meta.get("rec", {})
	rec[res] = true
	meta.rec = rec
	save_meta()
	var row: Array = k_row(res, "", "")
	craft.fx = {"a": parts[0], "b": parts[1] if parts.size() > 1 else parts[0], "res": res, "en": row[3], "d": row[4], "t": 0.0, "new": fresh}
	craft.a = ""
	craft.b = ""
	craft.more = []
	craft.pending = ""
	craft.msg = ""
	sfx.play("fuse", -6, 1.3)
	later(0.35, func(): sfx.play("stamp", -2))

func _craft_try2() -> void:
	var a: String = craft.a
	var b: String = craft.b
	if a == b and a == hero_ch():
		_craft_msg("自機の字だけでは作れない。倒して得た魂をもう一つ置く")
		craft.b = ""
		return
	if a == b and craft_avail(a) < 2:
		_craft_msg("%sの魂が二つ要る" % a)
		craft.b = ""
		return
	var r: Array = craft_row(a, b)
	if r.is_empty():
		_craft_msg("%s ＋ %s では字にならない" % [a, b])
		sfx.play("thud", -10, 1.4)
		craft.b = ""
		return
	craft_use(a)
	craft_use(b)
	var res: String = r[0]
	var fresh: bool = not rec_known(res)
	kraft_add(res)
	if not craft.made.has(res):
		craft.made.append(res)
	var rec: Dictionary = meta.get("rec", {})
	rec[res] = true
	meta.rec = rec
	save_meta()
	craft.fx = {"a": a, "b": b, "res": res, "en": r[3], "d": r[4], "t": 0.0, "new": fresh}
	craft.a = ""
	craft.b = ""
	craft.msg = ""
	sfx.play("fuse", -6, 1.3)
	later(0.35, func(): sfx.play("stamp", -2))

func craft_use(ch: String) -> void:
	if ch == hero_ch():
		return
	# 箱の魂から先に使う。足りなければ仲間を使う（Lv が下がる）
	if int(souls.get(ch, 0)) > 0:
		souls[ch] = int(souls[ch]) - 1
	elif k_lv(ch) > 0:
		for u in KU:
			if u.ch == ch:
				u.lv -= 1
				if u.lv <= 0:
					KU.erase(u)
				else:
					u.pr = Kraft.prof(ch, u.lv)
					_k_make_subs(u)
				break
	elif L(ch) > 0:
		owned[ch] = L(ch) - 1
		if owned[ch] <= 0:
			owned.erase(ch)

func _craft_msg(m: String) -> void:
	craft.msg = m
	craft.msg_t = 1.6

func craft_key(ev: InputEventKey) -> void:
	var kc: int = ev.keycode
	var box: Array = craft_box()
	if kc == KEY_TAB or kc == KEY_ESCAPE:
		close_craft()
		return
	if (kc == KEY_ENTER or kc == KEY_KP_ENTER) and craft.pending != "":
		craft_make(craft.pending, craft_parts())
		return
	if kc == KEY_BACKSPACE:
		craft.pending = ""
		if craft.typed != "":
			craft.typed = craft.typed.substr(0, craft.typed.length() - 1)
		elif craft.more.size():
			craft.more.pop_back()
		elif craft.b != "":
			craft.b = ""
		else:
			craft.a = ""
		return
	if kc >= KEY_1 and kc <= KEY_9:
		var lst: Array = craft_list()
		var i: int = kc - KEY_1
		if i < lst.size():
			if lst[i].size() > 5:
				craft_make(lst[i][0], lst[i][5])
				return
			craft.a = lst[i][1]
			craft.b = lst[i][2]
			craft.more = []
			_craft_try2()
		return
	var cols: int = craft.get("cols", 6)
	var mv = {KEY_LEFT: -1, KEY_RIGHT: 1, KEY_UP: -cols, KEY_DOWN: cols}
	if mv.has(kc) and box.size():
		craft.cur = clampi(craft.cur + mv[kc], 0, box.size() - 1)
		return
	if (kc == KEY_SPACE or kc == KEY_ENTER or kc == KEY_KP_ENTER) and box.size():
		craft_put(box[clampi(craft.cur, 0, box.size() - 1)])
		return
	var ch = ""
	if ev.unicode >= 65 and ev.unicode <= 122:
		ch = String.chr(ev.unicode).to_lower()
	if ch == "" or ch < "a" or ch > "z":
		return
	# 英単語を打つと、その字を台に置く
	var t: String = craft.typed + ch
	var hit = box.filter(func(c): return craft_word(c).begins_with(t))
	if hit.is_empty():
		t = ch
		hit = box.filter(func(c): return craft_word(c).begins_with(t))
		if hit.is_empty():
			t = ""
	craft.typed = t
	for c in hit:
		if craft_word(c) == t:
			craft.cur = box.find(c)
			craft.typed = ""
			craft_put(c)
			return

func craft_word(ch: String) -> String:
	var w: String = en_of(ch).to_lower()
	if w == "":
		w = String(Kraft.K.get(ch, {}).get("en", ""))
	if w == "" and KD.D.WEAP.has(ch):
		w = String(KD.D.WEAP[ch].en).to_lower()
	var o = ""
	for c in w:
		if c >= "a" and c <= "z":
			o += c
	return o

func jp_of(ch: String) -> String:
	if JP_GLOSS.has(ch):
		return String(JP_GLOSS[ch])
	return String(Kraft.K.get(ch, {}).get("jp", ""))

## 字典の各行が、いま作れるか（作れるなら使う二字を返す）
func craft_pair(r: Array) -> Array:
	for a in String(r[1]).split("|"):
		for b in String(r[2]).split("|"):
			if a == b:
				if craft_avail(a) >= 2:
					return [a, b]
			elif craft_avail(a) >= 1 and craft_avail(b) >= 1:
				return [a, b]
	return []

## 材料の書き方（「沝|沐|泪」は「沝などの水の字」）
func mat_label(spec: String) -> String:
	var opts = spec.split("|")
	if opts.size() == 1:
		return spec
	for o in opts:
		if craft_avail(o) > 0:
			return o
	return opts[0] + "など"

func _draw_craft(ci: CanvasItem) -> void:
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.7, 1.2)
	ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.97))
	var mouse: Vector2 = get_viewport().get_mouse_position()
	var x0: float = 36 * S
	txt(ci, UF, x0, 18 * S, "作字台", 30 * S, KD.SHU)
	txt(ci, UF, x0 + 108 * S, 22 * S, "部品の属性を継いで、新しい字を作る。同じ字を重ねて技を育てる。", 15 * S, KD.SUMI)
	txt(ci, UF, x0 + 108 * S, 44 * S, "選び方: 字の下の英単語を打つ／クリック／矢印＋Space　　Tab で戦いに戻る（作っている間は時が止まる）", 11 * S, Color(KD.SUMI, 0.6))
	# ---- 左上: 魂の箱 ----
	var box: Array = craft_box()
	var by: float = 100 * S
	var cw: float = 82 * S
	var chh: float = 96 * S
	var bw: float = W * 0.48
	var cols: int = max(3, int(bw / cw))
	craft.cols = cols
	txt(ci, UF, x0, by - 26 * S, "魂の箱", 15 * S, KD.SUMI)
	txt(ci, UF, x0 + 64 * S, by - 23 * S, "字を壊すと、その部品の魂がたまる（×の数）。仲間の字も材料にできる（使うと Lv が下がる）", 10 * S, Color(KD.SUMI, 0.55))
	if box.is_empty():
		txt(ci, UF, x0, by + 10 * S, "まだ魂がない。字を壊すと、その部品の魂が手に入る", 13 * S, Color(KD.SUMI, 0.6))
	var hov_ch = ""
	for i in box.size():
		var ch: String = box[i]
		var r = Rect2(x0 + (i % cols) * cw, by + (i / cols) * chh, cw - 6 * S, chh - 6 * S)
		if r.end.y > H * 0.43:
			break
		var sel: bool = craft.a == ch or craft.b == ch
		var cur: bool = i == craft.cur
		if r.has_point(mouse):
			hov_ch = ch
		ci.draw_rect(r, Color(KD.SHU, 0.12) if sel else Color(1, 1, 1, 0.6))
		ci.draw_rect(r, Color(KD.SHU, 0.9) if (cur or sel) else Color(KD.SUMI, 0.25), false, (2.5 if (cur or sel) else 1.0) * S)
		glyph(ci, ch, r.position + Vector2(r.size.x / 2, 34 * S), 42 * S, KD.SUMI)
		var ns: int = int(souls.get(ch, 0))
		if ch == hero_ch():
			txt(ci, UF, r.end.x - 5 * S, r.position.y + 3 * S, "∞", 13 * S, KD.SHU, 2)
			txt(ci, UF, r.position.x + 4 * S, r.position.y + 3 * S, "自機", 10 * S, KD.SHU)
		elif ns > 0:
			txt(ci, UF, r.end.x - 5 * S, r.position.y + 3 * S, "×%d" % ns, 12 * S, KD.SUMI, 2)
		if (L(ch) > 0 or k_lv(ch) > 0) and not ["犬", "命", "力"].has(ch) and ch != hero_ch():
			txt(ci, UF, r.position.x + 4 * S, r.position.y + 3 * S, "仲間", 10 * S, KD.KIN)
		txt(ci, UF, r.position.x + r.size.x / 2, r.end.y - 34 * S, jp_of(ch).split("・")[0].split("（")[0], 10 * S, Color(KD.SUMI, 0.7), 1)
		var w: String = craft_word(ch)
		var n: int = craft.typed.length() if (craft.typed != "" and w.begins_with(craft.typed)) else 0
		var fs: float = 12 * S
		var wx: float = r.position.x + r.size.x / 2 - tw(PF, w, fs) / 2
		txt(ci, PF, wx, r.end.y - 20 * S, w.substr(0, n), fs, KD.SHU)
		txt(ci, PF, wx + tw(PF, w.substr(0, n), fs), r.end.y - 20 * S, w.substr(n), fs, KD.SUMI)
		buttons.append([r, craft_put.bind(ch)])
	# ---- 右上: 台（A ＋ B ＝ ？） ----
	var rx: float = W * 0.53
	var ry: float = 82 * S
	var sz: float = 96 * S
	var ra = Rect2(rx, ry, sz, sz)
	var rb = Rect2(rx + sz + 44 * S, ry, sz, sz)
	var rr = Rect2(rb.end.x + 44 * S, ry - 6 * S, sz + 12 * S, sz + 12 * S)
	for q in [[ra, craft.a, "一つ目"], [rb, craft.b, "二つ目"]]:
		ci.draw_rect(q[0], Color(1, 1, 1, 0.75))
		ci.draw_rect(q[0], Color(KD.SUMI, 0.5), false, 2 * S)
		if q[1] != "":
			glyph(ci, q[1], q[0].get_center(), 66 * S, KD.SUMI)
		else:
			txt(ci, UF, q[0].get_center().x, q[0].get_center().y - 8 * S, q[2], 12 * S, Color(KD.SUMI, 0.35), 1)
		buttons.append([q[0], _craft_clear.bind(q[1])])
	txt(ci, UF, ra.end.x + 22 * S, ry + sz / 2 - 16 * S, "＋", 28 * S, KD.SUMI, 1)
	# 三つ目・四つ目の部品（獲 = 犬＋艸＋隹＋又 のように）
	for mi in craft.more.size():
		var mp: Vector2 = Vector2(rb.position.x + 24 * S + mi * 48 * S, rb.end.y + 22 * S)
		txt(ci, UF, mp.x - 22 * S, mp.y - 12 * S, "＋", 18 * S, KD.SUMI, 1)
		ci.draw_rect(Rect2(mp - Vector2(20, 20) * S, Vector2(40, 40) * S), Color(1, 1, 1, 0.75))
		glyph(ci, craft.more[mi], mp, 30 * S, KD.SUMI)
	txt(ci, UF, rb.end.x + 22 * S, ry + sz / 2 - 16 * S, "＝", 28 * S, KD.SUMI, 1)
	ci.draw_rect(rr, Color(KD.SHU, 0.06))
	ci.draw_rect(rr, Color(KD.SHU, 0.7), false, 2.5 * S)
	# 台の下の説明
	var ex: float = rx
	var ey: float = ry + sz + 16 * S
	var ew: float = W - rx - 30 * S
	var f = craft.fx
	if f != null:
		var t: float = f.t
		var k: float = _ease(clamp(t / 0.35, 0.0, 1.0))
		if t < 0.4:
			glyph(ci, f.a, ra.get_center().lerp(rr.get_center(), k), 66 * S * (1 - k * 0.3), Color(KD.SUMI, 1 - k * 0.5))
			glyph(ci, f.b, rb.get_center().lerp(rr.get_center(), k), 66 * S * (1 - k * 0.3), Color(KD.SUMI, 1 - k * 0.5))
		else:
			var st: float = _ease(clamp((t - 0.35) / 0.25, 0.0, 1.0))
			glow(ci, rr.get_center(), sz * 1.5, Color(KD.KIN, 0.5 * (1 - clamp((t - 0.6) / 1.0, 0.0, 0.7))))
			glyph(ci, f.res, rr.get_center(), 80 * S * (1.6 - 0.6 * st), KD.KIN, Color(KD.SUMI, 0.9), 5 * S)
			if f.new:
				txt(ci, UF, rr.end.x, rr.position.y - 20 * S, "新しい字！", 13 * S, KD.SHU, 2)
			txt(ci, UF, ex, ey, "%s ＋ %s ＝ %s　「%s」　%s" % [f.a, f.b, f.res, jp_of(f.res), String(f.en).to_upper()], 17 * S, KD.SUMI)
			ey += 28 * S
			ey += wrap_text(ci, UF, ex, ey, String(f.d), ew, 12 * S, Color(KD.SUMI, 0.85), 3) + 6 * S
			txt(ci, UF, ex, ey, ("→ 仲間になった。Tab で戦いに戻ると、受け継いだ技が動き出す" if k_lv(f.res) == 1 else "→ 仲間の%sが Lv%d になった" % [f.res, k_lv(f.res)]), 12 * S, KD.SHU)
	else:
		var focus: String = hov_ch if hov_ch != "" else craft.a
		if craft.msg != "" and craft.msg_t > 0:
			txt(ci, UF, ex, ey, craft.msg, 15 * S, KD.SHU)
			ey += 26 * S
		if focus != "":
			txt(ci, UF, ex, ey, "%s　「%s」　%s" % [focus, jp_of(focus), craft_word(focus)], 16 * S, KD.SUMI)
			ey += 26 * S
			var uses: Array = []
			for r in Kraft.USES.get(focus, []).slice(0, 24):
				var op: Array = Kraft.K[r].op
				uses.append("%s＋%s＝%s" % [op[0], op[1], r])
			ey += wrap_text(ci, UF, ex, ey, ("この字から作れる: " + "　".join(uses)) if uses.size() else "この字は材料にならない", ew, 12 * S, Color(KD.SUMI, 0.8), 3)
		else:
			txt(ci, UF, ex, ey, "① 箱から字を一つ選ぶ　② もう一つ選ぶ　③ 字になれば仲間になる", 13 * S, KD.SUMI)
			txt(ci, UF, ex, ey + 22 * S, "下の字典から、作れる字を選んでもよい（数字キー）", 12 * S, Color(KD.SUMI, 0.65))
	# ---- 下: 字典（すべての合体） ----
	var rows: Array = craft_dict_rows()
	var rec: Dictionary = meta.get("rec", {})
	var dy: float = H * 0.46
	ci.draw_line(Vector2(x0, dy - 10 * S), Vector2(W - x0, dy - 10 * S), Color(KD.SUMI, 0.2), 1)
	txt(ci, UF, x0, dy, "字典", 15 * S, KD.SUMI)
	txt(ci, UF, x0 + 48 * S, dy + 3 * S, "作った字 %d／%d　　朱の枠＝いま作れる（数字キーかクリックで作る）　灰＝前に作った字（足りない材料は朱）" % [rec.size(), Kraft.K.size()], 11 * S, Color(KD.SUMI, 0.6))
	dy += 26 * S
	var dcols: int = 6
	var dw: float = (W - x0 * 2) / dcols
	var dh: float = 60 * S
	var maxn: int = int((H - dy - 12 * S) / dh) * dcols
	if rows.size() > maxn:
		rows = rows.slice(0, maxn)
	var num: int = 0
	var detail = null
	for i in rows.size():
		var r: Array = rows[i]
		var cell = Rect2(x0 + (i % dcols) * dw, dy + (i / dcols) * dh, dw - 6 * S, dh - 5 * S)
		var pair: Array = craft_pair(r)
		var made: bool = rec.has(r[0]) or craft.made.has(r[0])
		var can: bool = pair.size() > 0
		if can:
			num += 1
		ci.draw_rect(cell, Color(1, 1, 1, 0.7) if can else Color(KD.SUMI, 0.05))
		ci.draw_rect(cell, Color(KD.SHU, 0.85) if can else Color(KD.SUMI, 0.18), false, (2.0 if can else 1.0) * S)
		var gc = Vector2(cell.position.x + 30 * S, cell.get_center().y)
		glyph(ci, r[0], gc, 40 * S, (KD.KIN if k_lv(r[0]) > 0 else KD.SUMI) if (can or made) else Color(KD.SUMI, 0.35))
		var tx: float = cell.position.x + 60 * S
		var ty: float = cell.position.y + 6 * S
		# 式: 足りない材料は朱
		var xx: float = tx
		var parts = [mat_label(r[1]), "＋", mat_label(r[2])]
		for j in parts.size():
			var pc: String = parts[j]
			var col: Color = KD.SUMI
			if j != 1 and not can:
				var spec: String = r[1] if j == 0 else r[2]
				var need: int = 2 if r[1] == r[2] else 1
				var have: bool = Array(String(spec).split("|")).any(func(o): return craft_avail(o) >= need)
				col = Color(KD.SUMI, 0.7) if have else KD.SHU
			txt(ci, UF, xx, ty, pc, 15 * S, col)
			xx += tw(UF, pc, 15 * S)
		txt(ci, UF, tx, ty + 22 * S, jp_of(r[0]) if jp_of(r[0]) != "" else String(r[3]), 10 * S, Color(KD.SUMI, 0.6))
		if can and num <= 9:
			txt(ci, UF, cell.end.x - 6 * S, cell.position.y + 4 * S, "%d" % num, 14 * S, KD.SHU, 2)
		if k_lv(r[0]) > 0:
			txt(ci, UF, cell.end.x - 6 * S, cell.end.y - 18 * S, "仲間Lv%d" % k_lv(r[0]), 9 * S, KD.KIN, 2)
		elif made:
			txt(ci, UF, cell.end.x - 6 * S, cell.end.y - 18 * S, "作った", 9 * S, Color(KD.SUMI, 0.5), 2)
		if cell.has_point(mouse):
			detail = r
		buttons.append([cell, _craft_row_click.bind(r)])
	# 字典の字に触れると、その説明を台の下に出す
	if detail != null and craft.fx == null and hov_ch == "":
		var ddy: float = ry + sz + 16 * S
		ci.draw_rect(Rect2(rx - 8 * S, ddy - 6 * S, W - rx - 22 * S, H * 0.46 - ddy - 10 * S), Color(KD.WASHI, 1))
		txt(ci, UF, rx, ddy, "%s　「%s」　%s　＝ %s ＋ %s" % [detail[0], jp_of(detail[0]), String(detail[3]).to_upper(), String(detail[1]).replace("|", "・"), detail[2]], 16 * S, KD.SUMI)
		var detail_h: float = wrap_text(ci, UF, rx, ddy + 28 * S, String(detail[4]), W - rx - 30 * S, 12 * S, Color(KD.SUMI, 0.85), 2)
		wrap_text(ci, UF, rx, ddy + 34 * S + detail_h, _craft_growth(String(detail[0])), W - rx - 30 * S, 11 * S, KD.SHU, 3)

func _craft_row_click(r: Array) -> void:
	if r.size() > 5:
		craft_make(r[0], r[5])
		return
	var pair: Array = craft_pair(r)
	if pair.is_empty():
		var miss = []
		for spec in [r[1], r[2]]:
			var need: int = 2 if r[1] == r[2] else 1
			if not Array(String(spec).split("|")).any(func(o): return craft_avail(o) >= need):
				miss.append(mat_label(spec))
		_craft_msg("材料が足りない: " + "・".join(miss))
		return
	_craft_pick(pair[0], pair[1])

## 遊んでいる時の、作字台への入口（右上のボタンの並び）
func _draw_craft_btn(ci: CanvasItem) -> void:
	var n: int = craft_list().size()
	var r = Rect2(W - 296 - 172, 12, 160, 38)
	button(ci, r, "作字台  Tab" + ("（%d）" % n if n > 0 else ""), open_craft, "main" if n > 0 else "ghost")

func _craft_clear(ch: String) -> void:
	if craft.a == ch and craft.b != ch:
		craft.a = craft.b
	craft.b = ""
	if craft.a == ch:
		craft.a = ""

func _craft_pick(a: String, b: String) -> void:
	craft.a = a
	craft.b = b
	craft_try()

## ======== 漢字クラフトの仲間（性能は scripts/kraft.gd の足し算で決まる） ========
const Kraft = preload("res://scripts/kraft.gd")
const SemanticCombat = preload("res://scripts/semantic_combat.gd")
const InkWorld = preload("res://scripts/ink_world.gd")
const GlyphGimmicks = preload("res://scripts/glyph_gimmicks.gd")
var semantic_combat = SemanticCombat.new()
var ink_world = InkWorld.new()
var glyph_gimmicks = GlyphGimmicks.new()
var KU: Array = []      # 作った字の仲間
var KFX: Array = []     # その技（波紋・炎・木・矢・岩…）
var ku_id := 0
var _k_chain := false

func kraft_add(ch: String, lv := 1) -> Dictionary:
	Kraft.load_db()
	# 部首・冠などと合わさった字だけが仲間になる（一字だけの字は材料）
	if not Kraft.can_ally(ch):
		return {}
	for u in KU:
		if u.ch == ch:
			u.lv += lv
			u.pr = Kraft.prof(ch, u.lv)
			_k_make_subs(u)
			return u
	ku_id += 1
	var u = {"id": ku_id, "ch": ch, "lv": lv, "pr": Kraft.prof(ch, lv), "x": hero.x, "y": hero.y, "cd": 0.6, "t": 0.0,
		"dash": null, "mins": [], "ang": rnd(0, TAU), "hitp": 0.0, "subs": []}
	# 能力をくれた部首の素（猫なら犬）
	u.ach = Kraft.src_of(ch)[1] if Kraft.src_of(ch)[1] != "" else ch
	_k_make_subs(u)
	KU.append(u)
	return u

## 脇の部品の技（その部品の技が、小さく付く）
func _k_make_subs(u: Dictionary) -> void:
	# 技は部首から一つだけ。ほかの部品は能力値に足されるだけ（脇の技・分身は出さない）
	u.subs = []
	return
	for f in u.pr.rid:
		var cnt: int = int(u.pr.rid[f])
		ku_id += 1
		var q: Dictionary = u.pr.duplicate()
		q.kind = Kraft.BODY[f][0]
		q.body = f
		var m: float = min(1.0, 0.55 + 0.2 * (cnt - 1))
		q.R = u.pr.R * m
		q.P = max(1, int(u.pr.P) - 1 + int((cnt - 1) / 2))
		q.C = 1 + int((cnt - 1) / 2)
		q.A = u.pr.A * 0.8
		q.rid = {}
		q.sub = true
		var ach: String = u.ch
		for x in Kraft.K.get(u.ch, {}).get("lv", []):
			if Kraft.fam_of(x) == f:
				ach = x
				break
		u.subs.append({"id": ku_id, "ch": u.ch, "ach": ach, "par": u, "lv": u.lv, "pr": q, "x": u.x, "y": u.y, "cd": rnd(0.3, 1.2), "t": 0.0,
			"dash": null, "mins": [], "ang": rnd(0, TAU), "hitp": 0.0, "cnt": cnt})

## 字そのものが場に出て動く技か（灯・災・暴れる・駆ける・巡る・守る・龍…）。
## それ以外（放つ・光線・溢れる・凍らせる・滅ぼす・降る・流す・寄せつけない…）は主人公から出る
const K_BODY_MOTION = ["laser", "lamp", "spread", "guard", "rush", "rampage", "orbit", "dragon"]
const K_BODY_KIND = ["trail", "orbit", "blade", "beast"]
func k_is_body(u: Dictionary) -> bool:
	var m: String = String(u.pr.get("motion", ""))
	if m != "":
		return K_BODY_MOTION.has(m)
	return K_BODY_KIND.has(String(u.pr.kind))

func kraft_clear() -> void:
	KU.clear()
	KFX.clear()
	semantic_combat.clear()

func ku_tag(u: Dictionary) -> String:
	return "K:" + u.ch

## 近くの字（植物や宝は除く）を近い順に
func k_targets(p: Vector2, r: float, n := 99) -> Array:
	var out: Array = []
	for e in E:
		if not e.alive or e.is_boss or e.get("still", false) or e.get("obj", "") != "" or e.captive:
			continue
		var d: float = Vector2(e.x, e.y).distance_to(p)
		if d < r:
			out.append([d, e])
	out.sort_custom(func(a, b): return a[0] < b[0])
	return out.slice(0, n).map(func(q): return q[1])

## 当てる: 文字を削り、押し返す。同じ技が同じ字に当たる間隔は cd 秒。rid=false なら脇の効果は起きない
func k_hit(u: Dictionary, e: Dictionary, from: Vector2, kn: float, cd := 0.0, key := "", rid := true, n := -1) -> bool:
	if not e.alive:
		return false
	if cd > 0:
		if not e.has("kc"):
			e.kc = {}
		var kk = str(u.id) + key
		if time < float(e.kc.get(kk, -1.0)):
			return false
		e.kc[kk] = time + cd
	if not e.has("cdt"):
		e.cdt = {}
	e.cdt.erase(ku_tag(u))
	var nn: int = int(u.pr.P) if n < 0 else n
	if time < float(e.get("kcurse", -1.0)):
		nn += int(e.get("kcurse_n", 1))
	var ok: bool = eat_letter(e, nn, 1, ku_tag(u))
	# 濡れた字が削られたら、近くの濡れた字も一緒に削られる（水の連鎖）
	if time < float(e.get("kwet", -1.0)) and not _k_chain:
		_k_chain = true
		var cnt = 0
		for o in k_targets(Vector2(e.x, e.y), 230 * SF):
			if o != e and time < float(o.get("kwet", -1.0)):
				if o.has("cdt"):
					o.cdt.erase(ku_tag(u))
				eat_letter(o, 1, 1, ku_tag(u))
				BOLT.append({"pts": [Vector2(e.x, e.y), Vector2(o.x, o.y)], "life": 0.18, "max": 0.18, "ray": true, "w": 0.3, "c": Kraft.FAM_COL["波"]})
				cnt += 1
				if cnt >= 8:
					break
		_k_chain = false
	var v: Vector2 = (Vector2(e.x, e.y) - from)
	v = v.normalized() if v.length() > 0.1 else Vector2.from_angle(rnd(0, TAU))
	if kn > 0 and not e.get("still", false):
		e.kx += v.x * kn
		e.ky += v.y * kn
	u.hitp = 1.0
	return ok

func _k_live(u) -> bool:
	if u == null:
		return false
	return KU.has(u.get("par", u))

## 燃える・噛まれ続ける字（脇の部品の効果の続き）
func _k_status(dt: float) -> void:
	for e in E:
		if not e.alive:
			continue
		if float(e.get("kburn", 0.0)) > 0:
			e.kburn -= dt
			e.burn = max(float(e.get("burn", 0.0)), 0.3)
			if tick("kb%d" % e.id, dt, 0.5) and _k_live(e.kburn_u):
				k_hit(e.kburn_u, e, Vector2(e.x, e.y), 0.0, 0.0, "", false, 1)
				# 燃え移る
				if randf() < 0.35:
					for o in k_targets(Vector2(e.x, e.y), 90 * SF, 3):
						if o != e and float(o.get("kburn", 0.0)) <= 0:
							o.kburn = 1.6
							o.kburn_u = e.kburn_u
							BOLT.append({"pts": [Vector2(e.x, e.y), Vector2(o.x, o.y)], "life": 0.2, "max": 0.2, "ray": true, "w": 0.3, "c": KD.SHU})
							break
		if int(e.get("kbleed", 0)) > 0 and time >= float(e.kbleed_t):
			var bu = e.kbleed_u
			var nb: int = int(e.kbleed)
			e.kbleed = 0
			if _k_live(bu):
				k_hit(bu, e, Vector2(e.x, e.y), 0.0, 0.0, "", false, nb)

func kraft_tick(dt: float) -> void:
	if KU.is_empty() and KFX.is_empty():
		return
	var hp0 = Vector2(hero.x, hero.y)
	var n: int = KU.size()
	var nb: int = KU.filter(func(q): return k_is_body(q)).size()
	var body_i: int = 0
	for i in n:
		var u: Dictionary = KU[i]
		var pr: Dictionary = u.pr
		u.t += dt
		u.hitp = max(0.0, u.hitp - dt * 3)
		u.haste = max(0.0, float(u.get("haste", 0.0)) - dt * 0.08)
		u.cd -= dt * pr.R * (1.0 + u.haste)
		# 撃つ技（放つ・光線・溢れる…）は字を出さず、主人公から放つ（ヴァンサバの武器のように）
		if not k_is_body(u):
			u.x = hp0.x; u.y = hp0.y
			_k_run(u, dt, hp0)
			continue
		# 字そのものが動く技だけ、主人公のまわりの決まった位置へ
		var bi: int = body_i
		body_i += 1
		var sa: float = TAU * bi / max(1, nb) - PI / 2 + time * 0.25
		var slot: Vector2 = hp0 + Vector2.from_angle(sa) * 78 * SF
		u.slot = slot
		if u.dash == null and not u.get("free", false):
			var k: float = 1.0 - pow(0.002, dt)
			u.x = lerp(float(u.x), slot.x, k)
			u.y = lerp(float(u.y), slot.y, k)
		_k_run(u, dt, hp0)
		for sb in u.subs:
			sb.t += dt
			sb.hitp = max(0.0, sb.hitp - dt * 3)
			sb.cd -= dt * sb.pr.R
			sb.slot = slot
			if sb.dash == null:
				sb.x = u.x
				sb.y = u.y
			_k_run(sb, dt, hp0)
	_k_fx(dt)
	semantic_combat.tick(self, dt)
	_k_status(dt)

## 当たり判定のある字どうしは重ならない（仲間と敵・仲間どうし・仲間と主人公）
func _k_separate(hp0: Vector2) -> void:
	var ar: float = 20 * SF
	# 魂の仲間（刀・日…）や連れも、敵の字と重ならない
	for id in ALLY:
		var a: Dictionary = ALLY[id]
		var ap: Vector2 = Vector2(a.x, a.y)
		for e in k_targets(ap, 110 * SF, 10):
			var d0: Vector2 = Vector2(e.x, e.y) - ap
			var need0: float = ar + float(e.rad) * 0.9
			if d0.length() < need0:
				var n0: Vector2 = d0.normalized() if d0.length() > 0.1 else Vector2.from_angle(rnd(0, TAU))
				e.x = ap.x + n0.x * need0
				e.y = ap.y + n0.y * need0
	for i in KU.size():
		var u: Dictionary = KU[i]
		if semantic_combat.handles(String(u.pr.get("motion", ""))):
			continue
		if not k_is_body(u):
			continue
		var me: Vector2 = Vector2(u.x, u.y)
		for e in k_targets(me, 120 * SF, 12):
			var ep: Vector2 = Vector2(e.x, e.y)
			var d: Vector2 = ep - me
			var need: float = ar + float(e.rad) * 0.9
			var L: float = d.length()
			if L < need:
				var n: Vector2 = d / L if L > 0.1 else Vector2.from_angle(rnd(0, TAU))
				var push: float = need - L
				# 敵を押し出し、仲間も少し下がる
				e.x += n.x * push * 0.75
				e.y += n.y * push * 0.75
				u.x -= n.x * push * 0.25
				u.y -= n.y * push * 0.25
				me = Vector2(u.x, u.y)
		for j in range(i + 1, KU.size()):
			var o: Dictionary = KU[j]
			if not k_is_body(o):
				continue
			var d2: Vector2 = Vector2(o.x, o.y) - me
			var L2: float = d2.length()
			if L2 < ar * 2:
				var n2: Vector2 = d2 / L2 if L2 > 0.1 else Vector2.from_angle(rnd(0, TAU))
				var h: float = (ar * 2 - L2) * 0.5
				o.x += n2.x * h; o.y += n2.y * h
				u.x -= n2.x * h; u.y -= n2.y * h
				me = Vector2(u.x, u.y)
		var d3: Vector2 = me - hp0
		if u.get("free", false) or u.dash != null:
			continue
		if d3.length() < ar * 2.2:
			var n3: Vector2 = d3.normalized() if d3.length() > 0.1 else Vector2.UP
			u.x = hp0.x + n3.x * ar * 2.2
			u.y = hp0.y + n3.y * ar * 2.2

func _k_run(u: Dictionary, dt: float, hp0: Vector2) -> void:
		if semantic_combat.run(self, u, dt, hp0):
			return
		var pr: Dictionary = u.pr
		match String(pr.get("motion", "")):
			"lamp": _m_lamp(u, dt, hp0); return
			"spread": _m_spread(u, dt, hp0); return
			"fall": _m_fall(u, dt, hp0); return
			"guard": _m_guard(u, dt, hp0); return
			"rush": _k_beast(u, dt, hp0); return
			"rampage": _m_rampage(u, dt, hp0); return
			"river": _m_river(u, dt, hp0); return
			"laser": _m_laser(u, dt, hp0); return
			"slash": _m_slash(u, dt, hp0); return
			"dragon": _m_dragon(u, dt, hp0); return
			"garlic": _m_garlic(u, dt, hp0); return
			"scatter": _m_scatter(u, dt, hp0); return
			"frost": _m_frost(u, dt, hp0); return
			"annihilate": _m_annihilate(u, dt, hp0); return
			"flow": _m_flow(u, dt, hp0); return
			"orbit": _m_orbit(u, dt, hp0); return
			"burst": _m_burst(u, dt, hp0); return
			"bind": _m_bind(u, dt, hp0); return
			"shoot": _m_shoot(u, dt, hp0); return
		match pr.kind:
			"ripple": _k_ripple(u, dt)
			"trail": _k_trail(u, dt, hp0)
			"tree": _k_tree(u, dt, hp0)
			"orbit": _k_orbit(u, dt, hp0)
			"blade": _k_blade(u, dt, hp0)
			"arrow": _k_arrow(u, dt)
			"shout": _k_shout(u, dt)
			"beast": _k_beast(u, dt, hp0)
			"slam": _k_slam(u, dt, hp0)
			"aura": _k_aura(u, dt, hp0)
			"throw": _k_throw(u, dt)
			"wall": _k_wall(u, dt, hp0)


## ======== 部首の効果（当たった時の作用と、見た目）========
func _k_eff_hit(u: Dictionary, e: Dictionary, from: Vector2, kn: float, cd := 0.0, key := "") -> bool:
	var f: String = String(u.pr.get("eff", u.pr.body))
	var k2: float = kn
	if f == "門":
		k2 *= 1.6
	elif f == "claw" or f == "trample" or f == "horn":
		k2 = k2 * 1.8 + 120
	var ok: bool = k_hit(u, e, from, k2, cd, key)
	if not e.alive:
		return ok
	match f:
		"炎":
			e.kburn = max(float(e.get("kburn", 0.0)), 1.8 * u.pr.D)
			e.kburn_u = u
		"波":
			e.kwet = time + 3.0 * u.pr.D
		"樹":
			e.kroot = time + 1.0 * u.pr.D
			e.slow = max(float(e.get("slow", 0.0)), 1.0 * u.pr.D)
		"霊":
			e.slow = max(float(e.get("slow", 0.0)), 1.6 * u.pr.D)
		"岩":
			e.daze = max(float(e.daze), 0.5 * u.pr.D)
		"声":
			e.daze = max(float(e.daze), 0.25)
		"claw":
			if int(e.get("kbleed", 0)) <= 0:
				e.kbleed = 2
				e.kbleed_t = time + 0.6
				e.kbleed_u = u
		"trample", "horn":
			e.daze = max(float(e.daze), 0.6)
		"sting":
			e.daze = max(float(e.daze), 0.5)
			e.slow = max(float(e.get("slow", 0.0)), 1.2)
		"bubble":
			e.slow = max(float(e.get("slow", 0.0)), 2.0)
		"獣", "bite":
			if int(e.get("kbleed", 0)) <= 0:
				e.kbleed = 1
				e.kbleed_t = time + 0.8
				e.kbleed_u = u
	return ok

func _k_mark(u: Dictionary, x: float, y: float, r := 0.0) -> void:
	KFX.append({"k": "mark", "u": u, "x": x, "y": y, "t": 0.0, "r": (r if r > 0 else 30 * SF)})

## 部首の見た目を p に描く（字は出さない。a は濃さ、r は大きさ）
func _k_eff_draw(ci: CanvasItem, fam: String, p: Vector2, r: float, a: float, seed := 0.0, cc := Color.TRANSPARENT) -> void:
	if a <= 0.01:
		return
	var ink_names = {"炎": "flame", "波": "wave", "樹": "root", "光": "sun", "刃": "slash", "矢": "feather", "獣": "claw", "claw": "claw", "bite": "claw", "horn": "rock", "trample": "rock", "peck": "feather", "岩": "rock", "霊": "cloud", "声": "wind", "sting": "slash", "bubble": "wave"}
	if ink_names.has(fam):
		var tex: Texture2D = art("fx_semantic_" + ink_names[fam])
		if tex != null:
			var wh = Vector2(r * 2, r * 2 * float(tex.get_height()) / tex.get_width())
			ci.draw_set_transform(p, sin(time * 3 + seed) * 0.06, Vector2.ONE)
			ci.draw_texture_rect(tex, Rect2(-wh * 0.5, wh), false, Color(1, 1, 1, a))
			ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
			return
	var col: Color = cc if cc.a > 0 else Kraft.FAM_COL.get(fam, KD.SUMI)
	match fam:
		"炎":
			glow(ci, p, r * 1.7, Color(1.0, 0.45, 0.1, 0.32 * a))
			for j in 3:
				var off := Vector2((j - 1) * r * 0.42, 0)
				var h: float = r * (1.25 - abs(j - 1) * 0.35) * (1.0 + 0.16 * sin(time * 17 + seed + j * 2.1))
				_flame(ci, p + off + Vector2(0, r * 0.45), r * (0.55 - abs(j - 1) * 0.12), h, Color(0.92, 0.28 + 0.1 * j, 0.06, 0.85 * a))
			_flame(ci, p + Vector2(0, r * 0.45), r * 0.26, r * 0.7, Color(1.0, 0.85, 0.35, 0.8 * a))
		"波":
			ci.draw_arc(p, r * 0.9, PI * 0.1, PI * 0.9, 18, Color(col, 0.8 * a), 3 * SF, true)
			ci.draw_arc(p + Vector2(0, -r * 0.25), r * 0.55, PI * 0.15, PI * 0.85, 14, Color(col, 0.6 * a), 2 * SF, true)
			for j in 3:
				var dp := p + Vector2((j - 1) * r * 0.5, -r * 0.2 + fmod(time * 60 + j * 13 + seed, r * 0.8))
				ci.draw_circle(dp, 2.6 * SF, Color(col, 0.85 * a))
		"樹":
			for j in 5:
				var an: float = seed + j * TAU / 5 + sin(time * 2 + j) * 0.2
				var lp := p + Vector2.from_angle(an) * r * 0.6
				_leaf(ci, lp, r * 0.42, an, Color(col, 0.8 * a))
		"光":
			glow(ci, p, r * 1.9, Color(1.0, 0.85, 0.4, 0.4 * a))
			for j in 6:
				var an2: float = seed + time * 0.8 + j * TAU / 6
				ci.draw_line(p + Vector2.from_angle(an2) * r * 0.35, p + Vector2.from_angle(an2) * r * 1.05, Color(1.0, 0.82, 0.3, 0.75 * a), 2.5 * SF, true)
			ci.draw_circle(p, r * 0.28, Color(1.0, 0.95, 0.75, 0.95 * a))
		"刃":
			ci.draw_line(p + Vector2(-r, -r * 0.7), p + Vector2(r, r * 0.7), Color(col, 0.85 * a), 3.5 * SF, true)
			ci.draw_line(p + Vector2(-r * 0.8, r * 0.75), p + Vector2(r * 0.8, -r * 0.75), Color(col, 0.6 * a), 2 * SF, true)
		"矢":
			var v := Vector2.from_angle(seed)
			ci.draw_line(p - v * r, p + v * r * 0.6, Color(col, 0.9 * a), 3 * SF, true)
			ci.draw_line(p + v * r * 0.6, p + v * r * 0.6 - v.rotated(0.5) * r * 0.4, Color(col, 0.9 * a), 3 * SF, true)
			ci.draw_line(p + v * r * 0.6, p + v * r * 0.6 - v.rotated(-0.5) * r * 0.4, Color(col, 0.9 * a), 3 * SF, true)
		"声":
			for j in 3:
				var rr: float = r * (0.4 + 0.3 * j + 0.2 * fmod(time * 2 + seed, 1.0))
				ci.draw_arc(p, rr, -0.9, 0.9, 12, Color(col, (0.8 - 0.22 * j) * a), 2.5 * SF, true)
				ci.draw_arc(p, rr, PI - 0.9, PI + 0.9, 12, Color(col, (0.8 - 0.22 * j) * a), 2.5 * SF, true)
		"claw":
			# 虎の爪: 長い三本の裂き傷
			for j in 3:
				var o2 := Vector2((j - 1) * r * 0.45, 0)
				ci.draw_line(p + o2 + Vector2(-r * 0.6, -r * 0.9), p + o2 + Vector2(r * 0.5, r * 0.9), Color(col, 0.9 * a), 4 * SF, true)
				ci.draw_line(p + o2 + Vector2(-r * 0.55, -r * 0.85), p + o2 + Vector2(r * 0.45, r * 0.85), Color(KD.SUMI, 0.5 * a), 1.5 * SF, true)
		"peck":
			for j in 3:
				var pp := p + Vector2.from_angle(seed + j * 2.1) * r * 0.5
				ci.draw_line(pp + Vector2(-r * 0.2, -r * 0.2), pp, Color(col, 0.85 * a), 2.5 * SF, true)
				ci.draw_line(pp + Vector2(r * 0.2, -r * 0.2), pp, Color(col, 0.85 * a), 2.5 * SF, true)
		"sting":
			for j in 6:
				var an4: float = seed + j * TAU / 6
				ci.draw_line(p + Vector2.from_angle(an4) * r * 0.2, p + Vector2.from_angle(an4) * r * 0.8, Color(col, 0.8 * a), 2 * SF, true)
		"bubble":
			for j in 4:
				var bp2 := p + Vector2(sin(seed + j * 1.9) * r * 0.5, -fmod(time * 40 + j * 9 + seed, r))
				ci.draw_arc(bp2, r * (0.15 + 0.06 * j), 0, TAU, 14, Color(col, 0.8 * a), 1.8 * SF, true)
		"trample", "horn":
			for j in 5:
				var an5: float = -PI + j * PI / 4 + seed * 0.1
				ci.draw_arc(p, r * (0.5 + 0.15 * j), an5 - 0.3, an5 + 0.3, 6, Color(col, (0.8 - 0.12 * j) * a), 3 * SF, true)
			ci.draw_circle(p, r * 0.25, Color(col, 0.5 * a))
		"獣", "bite":
			for j in 3:
				var o := Vector2((j - 1) * r * 0.38, 0)
				ci.draw_line(p + o + Vector2(-r * 0.3, -r * 0.6), p + o + Vector2(r * 0.2, r * 0.6), Color(0.62, 0.12, 0.05, 0.85 * a), 3 * SF, true)
		"岩":
			var pts := PackedVector2Array()
			for j in 7:
				var an3: float = j * TAU / 7 + seed
				pts.append(p + Vector2.from_angle(an3) * r * (0.6 + 0.25 * sin(j * 2.7 + seed)))
			ci.draw_colored_polygon(pts, Color(col, 0.75 * a))
			pts.append(pts[0])
			ci.draw_polyline(pts, Color(KD.SUMI, 0.6 * a), 2 * SF, true)
		"霊":
			glow(ci, p, r * 1.5, Color(col, 0.3 * a))
			_dash_ellipse(ci, p, r * 0.9, r * 0.9, Color(col, 0.7 * a), 2 * SF)
			for j in 3:
				var wp := p + Vector2(sin(time * 3 + j * 2 + seed) * r * 0.5, -fmod(time * 30 + j * 11 + seed, r))
				ci.draw_circle(wp, 3 * SF, Color(col, 0.7 * a))
		"門":
			var hr: float = r * 0.8
			ci.draw_rect(Rect2(p - Vector2(hr, hr), Vector2(hr, hr) * 2), Color(col, 0.75 * a), false, 3 * SF)
		_:
			ci.draw_circle(p, r * 0.5, Color(KD.SUMI, 0.6 * a))
			for j in 5:
				ci.draw_circle(p + Vector2.from_angle(seed + j * 1.3) * r * 0.75, 2.5 * SF, Color(KD.SUMI, 0.5 * a))

func _flame(ci: CanvasItem, base: Vector2, w: float, h: float, col: Color) -> void:
	var tex: Texture2D = art("fx_semantic_flame")
	if tex != null:
		ci.draw_texture_rect(tex, Rect2(base.x - w, base.y - h, w * 2, h), false, Color(1, 1, 1, col.a))


func _dedupe(pts: PackedVector2Array) -> PackedVector2Array:
	var out := PackedVector2Array()
	for q in pts:
		if out.is_empty() or out[out.size() - 1].distance_to(q) > 0.5:
			out.append(q)
	if out.size() > 2 and out[0].distance_to(out[out.size() - 1]) < 0.5:
		out.remove_at(out.size() - 1)
	return out

func _leaf(ci: CanvasItem, c: Vector2, l: float, an: float, col: Color) -> void:
	var d := Vector2.from_angle(an)
	var n := d.orthogonal()
	var pts := PackedVector2Array([c - d * l * 0.5, c + n * l * 0.22, c + d * l * 0.5, c - n * l * 0.22])
	ci.draw_colored_polygon(pts, col)

## ======== 字の意味の動き ========
## 灯: 主人公のそばに灯り、まわりを照らし続ける。照らされた字に部首の効果
func _m_lamp(u: Dictionary, dt: float, hp0: Vector2) -> void:
	var R: float = 165 * SF * u.pr.A
	u.lampR = R
	if u.cd > 0:
		return
	u.cd = 0.7
	for e in k_targets(hp0, R, 3 + u.pr.X * 2):
		_k_eff_hit(u, e, hp0, 0.0)

## この字そのものを弾にして飛ばす（v は速さ・向き、slow は凍えさせる）
func _k_gp(u: Dictionary, p: Vector2, v: Vector2, life: float, sz: float, n := 1, slow := false) -> void:
	KFX.append({"k": "gp", "u": u, "x": p.x, "y": p.y, "vx": v.x, "vy": v.y, "life": life, "max": life, "n": n, "hit": {}, "sz": sz, "slow": slow})

## 龍を含む字: 龍のように連なり、うねりながら主人公のまわりを巡って暴れる
func _m_dragon(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.free = true
	if not u.has("trail"):
		u.trail = []
	u.ang += dt * 1.7 * u.pr.R
	var R: float = (135 + 55 * sin(time * 1.6 + u.id)) * SF * u.pr.A
	var goal: Vector2 = hp0 + Vector2.from_angle(u.ang) * R
	# ときどき近くの字へ食らいつく
	u.lt = float(u.get("lt", 0.0)) - dt
	if u.lt <= 0:
		u.lt = rnd(1.0, 2.0)
		var tg = k_targets(goal, 280 * SF, 1)
		u.lunge = tg[0] if tg.size() else null
		u.lg = 0.45
	u.lg = float(u.get("lg", 0.0)) - dt
	if u.get("lunge") != null and u.lg > 0 and u.lunge.alive:
		goal = Vector2(u.lunge.x, u.lunge.y)
	var me: Vector2 = Vector2(u.x, u.y)
	var d: Vector2 = goal - me
	me += d.normalized() * min(d.length(), 640 * SF * dt) if d.length() > 0.5 else Vector2.ZERO
	u.x = me.x; u.y = me.y
	var tr: Array = u.trail
	if tr.is_empty() or tr[0].distance_to(me) > 4 * SF:
		tr.push_front(me)
	var n: int = 6 + u.pr.C * 2
	var gap: float = 24 * SF
	# 胴の節: 通った跡を一定の間隔でたどる
	var segs: Array = []
	var acc: float = 0.0
	for i in range(1, tr.size()):
		acc += tr[i].distance_to(tr[i - 1])
		if acc >= gap * (segs.size() + 1):
			segs.append(tr[i])
			if segs.size() >= n:
				tr.resize(i + 1)
				break
	u.segs = segs
	for i in segs.size() + 1:
		var sp: Vector2 = me if i == 0 else segs[i - 1]
		for e in k_targets(sp, 50 * SF, 3):
			if sp.distance_to(Vector2(e.x, e.y)) < e.rad + 18 * SF:
				_k_eff_hit(u, e, sp, u.pr.KN * 1.6 + 160, 0.45, "dr%d" % i)

## 刀の字（切・刻・剣…）: 主人公のまわりを、一定の間隔で順に斬りつける
## 斤・斧・戉は重く遅い大振り、戈・矛は長い薙ぎ、刀は速く小さく
## 仲間の自動攻撃の音: 同じ音は0.6秒に一度まで、音量は控えめに
var _ksfx_t := {}
func ksfx(n: String, vol := 0.0, pitch := 1.0) -> void:
	if time - float(_ksfx_t.get(n, -9.0)) < 0.6:
		return
	_ksfx_t[n] = time
	sfx.play(n, vol - 6.0, pitch)

func _m_slash(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var rad: String = String(u.pr.get("rad", ""))
	var heavy: bool = ["斤", "斧", "戉", "戌", "殳"].has(rad)
	var long: bool = ["戈", "矛", "戍"].has(rad)
	u.cd = 1.2 if heavy else (0.75 if long else 0.5)
	var R: float = (125 if heavy else (150 if long else 100)) * SF * u.pr.A
	var span: float = 2.2 if heavy else (1.8 if long else 1.3)
	# 斬る向きは一定の間隔で回っていく
	var step: float = TAU / float(3 + u.pr.C)
	u.ang = float(u.get("ang", 0.0)) + step
	for j in u.pr.C:
		var an: float = u.ang + TAU * j / u.pr.C
		for e in k_targets(hp0, R + 40 * SF, 12):
			var d: Vector2 = Vector2(e.x, e.y) - hp0
			if d.length() > R + e.rad:
				continue
			if abs(angle_difference(an, d.angle())) > span * 0.5 + 0.2:
				continue
			_k_eff_hit(u, e, hp0, u.pr.KN * (1.8 if heavy else 1.0))
		KFX.append({"k": "arc", "u": u, "x": hp0.x, "y": hp0.y, "an": an, "span": span, "R": R, "t": 0.0, "w": (16 if heavy else 10) * SF})
	ksfx("slash", -10, 0.8 if heavy else rnd(1.1, 1.3))

## 日: 光線。いちばん近い字へ一直線に放ち、並んだ字をまとめて焼き貫く
func _m_laser(u: Dictionary, dt: float, hp0: Vector2) -> void:
	# 日: 主人公の頭上に字が昇り、一定の間隔でそのまわりに光の結界を張る（敵を狙わない・押し返さない）
	u.free = true
	var top: Vector2 = hp0 + Vector2(0, -100 * SF)
	var me: Vector2 = Vector2(u.x, u.y).lerp(top, min(1.0, dt * 10.0))
	u.x = me.x; u.y = me.y
	if u.cd <= 0:
		u.cd = 2.0
		var R: float = 175 * SF * u.pr.A
		for e in k_targets(me, R, 24):
			_k_eff_hit(u, e, me, 0.0)
		KFX.append({"k": "sunring", "u": u, "x": me.x, "y": me.y, "t": 0.0, "R": R, "sd": rnd(0, TAU)})
		ksfx("soft", -16, 1.8)
	# 強化（2段階目から）: 主人公の向いている方へ光線。敵を追わない
	if int(u.lv) < 2:
		return
	u.lz = float(u.get("lz", 0.8)) - dt
	if u.lz > 0:
		return
	u.lz = 1.6
	var dir: Vector2 = hero.get("last_dir", Vector2.ZERO)
	if dir.length() < 0.1:
		dir = Vector2(float(hero.face), 0.0)
	dir = dir.normalized()
	var n: int = int(u.pr.C) + int(u.lv) - 2
	for j in n:
		var d: Vector2 = dir.rotated((j - (n - 1) * 0.5) * 0.22)
		var L: float = 680 * SF * u.pr.A
		var b: Vector2 = me + d * L
		for e in k_targets(me, L, 30):
			var ep: Vector2 = Vector2(e.x, e.y)
			var q: Vector2 = Geometry2D.get_closest_point_to_segment(ep, me, b)
			if q.distance_to(ep) < e.rad + 10 * SF * u.pr.A:
				_k_eff_hit(u, e, q, 0.0)
		KFX.append({"k": "beam", "u": u, "a": me, "b": b, "t": 0.0, "w": 12 * SF * u.pr.A})
	ksfx("dash", -12, 2.0)

## 水: 主人公のまわりにいつも漂い、近づいた字を削って押し返す（にんにくのように）
func _m_garlic(u: Dictionary, dt: float, hp0: Vector2) -> void:
	var R: float = 105 * SF * u.pr.A
	u.garR = R
	for e in k_targets(hp0, R + 20 * SF, 12):
		# 寄せつけない（バリア）: 押し返さない。押し返すと敵が近寄れず、無敵になる
		_k_eff_hit(u, e, hp0, 0.0, 0.55, "gl")

## 川: 主人公の足もとから、三筋の流れを下へ放ちつづける（川の字の三本の線のように）
func _m_river(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	u.cd = 0.09
	for j in 3:
		var x0: float = (j - 1) * 26 * SF * u.pr.A
		# 川の字のように、左の筋は少し払って曲がる
		var bend: float = -0.12 if j == 0 else 0.0
		KFX.append({"k": "rv", "u": u, "x": hp0.x + x0, "y": hp0.y + 20 * SF, "vx": bend * 420 * SF, "vy": 420 * SF, "life": 1.1 * u.pr.A, "max": 1.1 * u.pr.A, "hit": {}, "j": j})

## 氾: あらゆる方向へ、でたらめにこの字を放つ
func _m_scatter(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	if k_targets(hp0, 460 * SF, 1).is_empty():
		return
	u.cd = 1.1
	for j in 5 + u.pr.C * 2:
		var v: Vector2 = Vector2.from_angle(rnd(0, TAU)) * rnd(380, 620) * SF
		_k_gp(u, Vector2(u.x, u.y), v, 0.9, 24 * SF, 1)

## 氷: まわりへ大量のこの字を、ゆっくりと放つ。触れた字は凍えて遅くなる
func _m_frost(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	if k_targets(hp0, 420 * SF, 1).is_empty():
		return
	u.cd = 2.6
	var n: int = 14 + u.pr.C * 4
	var a0: float = rnd(0, TAU)
	for j in n:
		var v: Vector2 = Vector2.from_angle(a0 + TAU * j / n) * 85 * SF
		_k_gp(u, hp0 + v.normalized() * 40 * SF, v, 4.0 * u.pr.D, 20 * SF, 2, true)

## 滅: 全方位へすさまじい連射。撃ち終えると長く休む
func _m_annihilate(u: Dictionary, dt: float, hp0: Vector2) -> void:
	var fire_t: float = float(u.get("fire_t", 0.0))
	if fire_t > 0:
		u.fire_t = fire_t - dt
		u.ang += dt * 9.0
		u.ft2 = float(u.get("ft2", 0.0)) - dt
		while u.ft2 <= 0:
			u.ft2 += 0.035
			for j in 3:
				var v: Vector2 = Vector2.from_angle(u.ang + TAU * j / 3) * 720 * SF
				_k_gp(u, Vector2(u.x, u.y), v, 0.8, 20 * SF, 2)
		if u.fire_t <= 0:
			u.cd = 14.0
		return
	if u.cd > 0:
		return
	if k_targets(hp0, 380 * SF, 6).size() < 4:
		return
	u.fire_t = 2.4
	u.ft2 = 0.0
	shake = max(shake, 5.0)
	ksfx("gong", -6, 0.6)

## 獣・猛・狂…: 字そのものが縦横無尽に暴れまわり、触れた字を大きく弾き飛ばす
func _m_rampage(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.free = true
	if not u.has("vx"):
		var a0: Vector2 = Vector2.from_angle(rnd(0, TAU)) * 400 * SF
		u.vx = a0.x; u.vy = a0.y
	var me: Vector2 = Vector2(u.x, u.y)
	var v: Vector2 = Vector2(u.vx, u.vy)
	var sp: float = (520 + 60 * u.pr.T) * SF * (1.0 + 0.1 * (u.pr.R - 1))
	# 狙いをころころ変えて突っ込む。離れすぎたら主人公のほうへ戻る
	u.rt = float(u.get("rt", 0.0)) - dt
	if u.rt <= 0 or not u.has("rg"):
		u.rt = rnd(0.35, 0.8)
		var tg = k_targets(hp0, 460 * SF, 12)
		u.rg = (Vector2(tg.pick_random().x, tg.pick_random().y) if tg.size() else hp0 + Vector2.from_angle(rnd(0, TAU)) * 120 * SF)
	var goal: Vector2 = u.rg
	if me.distance_to(hp0) > 480 * SF:
		goal = hp0
	var want: Vector2 = (goal - me).normalized() * sp
	v = v.lerp(want, min(1.0, dt * 5.0))
	if v.length() > sp:
		v = v.normalized() * sp
	me += v * dt
	u.x = me.x; u.y = me.y
	u.vx = v.x; u.vy = v.y
	u.face = -1 if v.x < 0 else 1
	for e in k_targets(me, 60 * SF * u.pr.A, 4):
		if me.distance_to(Vector2(e.x, e.y)) < e.rad + 24 * SF:
			if _k_eff_hit(u, e, me, u.pr.KN * 2.0 + 260, 0.35, "rp"):
				_k_mark(u, e.x, e.y, 26 * SF)
				shake = max(shake, 2.5)
			# はね返って向きを変える（重ならない）
			var away: Vector2 = (me - Vector2(e.x, e.y)).normalized()
			v = v.bounce(away) if v.dot(away) < 0 else v
			u.vx = v.x; u.vy = v.y
			u.rt = 0.0

## 災: でたらめな所に起こり、飛び火して広がる。字そのものもふらつく
func _m_spread(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.free = true
	u.wt = float(u.get("wt", 0.0)) - dt
	if u.wt <= 0 or not u.has("wp"):
		u.wt = rnd(0.5, 1.1)
		var tg0 = k_targets(hp0, 440 * SF, 40)
		u.wp = (Vector2(tg0.pick_random().x, tg0.pick_random().y) if tg0.size() else hp0) + Vector2.from_angle(rnd(0, TAU)) * rnd(20, 90) * SF
		u.landed = false
	var k: float = 1.0 - pow(0.004, dt)
	u.x = lerp(float(u.x), float(u.wp.x), k)
	u.y = lerp(float(u.y), float(u.wp.y), k)
	if u.landed or Vector2(u.x, u.y).distance_to(u.wp) > 18 * SF or u.cd > 0:
		return
	u.landed = true
	u.cd = 1.4
	if true:
		var p: Vector2 = Vector2(u.x, u.y)
		KFX.append({"k": "blight", "u": u, "x": p.x, "y": p.y, "t": 0.0, "life": 2.0 * u.pr.D, "r": 0.0, "R": 44 * SF * u.pr.A, "gen": 0, "kid": false, "sd": rnd(0, TAU)})
	ksfx("thud", -14, 0.7)

## 降: 字の頭上へ降りそそぐ
func _m_fall(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(hp0, 460 * SF, 30)
	if tg.is_empty():
		return
	u.cd = 2.2
	tg.shuffle()
	for j in min(u.pr.C + 1, tg.size()):
		var e = tg[j]
		KFX.append({"k": "drop", "u": u, "x": e.x, "y": e.y, "t": 0.0, "delay": 0.45 + j * 0.12, "R": 60 * SF * u.pr.A, "sd": rnd(0, TAU)})

## 守: 主人公のまわりを巡り、近づく字を押し返す
func _m_guard(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.free = true
	u.ang += dt * 1.6 * u.pr.R
	var R: float = 96 * SF * u.pr.A
	u.guardR = R
	var p := hp0 + Vector2.from_angle(u.ang) * R
	u.x = p.x; u.y = p.y
	for e in k_targets(hp0, R + 30 * SF, 8):
		_k_eff_hit(u, e, hp0, 0.0, 0.6, "g")

## 流: 主人公から字の群れへ、帯になって流れる
func _m_flow(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(hp0, 420 * SF, 1)
	if tg.is_empty():
		return
	u.cd = 1.3
	var d := (Vector2(tg[0].x, tg[0].y) - hp0).normalized()
	for j in u.pr.C:
		var dj := d.rotated((j - (u.pr.C - 1) * 0.5) * 0.35)
		KFX.append({"k": "stream", "u": u, "x0": hp0.x, "y0": hp0.y, "dx": dj.x, "dy": dj.y, "s": 0.0, "L": 420 * SF * u.pr.A, "hit": {}, "t": 0.0, "sd": rnd(0, TAU)})

## 巡: 主人公のまわりを巡る（部首の効果そのものが回る）
func _m_orbit(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.free = true
	u.ang += dt * 2.4 * u.pr.R
	var R: float = 115 * SF * u.pr.A
	u.orbR = R
	var p0: Vector2 = hp0 + Vector2.from_angle(u.ang) * R
	u.x = p0.x; u.y = p0.y
	for j in u.pr.C:
		var p = hp0 + Vector2.from_angle(u.ang + TAU * j / u.pr.C) * R
		for e in k_targets(p, 34 * SF * u.pr.A + 30 * SF, u.pr.X):
			_k_eff_hit(u, e, hp0, u.pr.KN * 0.6, 0.5 / u.pr.R, "o")

## 響: まわりへ一気に広がる
func _m_burst(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var c := Vector2(u.x, u.y)
	var R: float = 230 * SF * u.pr.A
	var tg = k_targets(c, R, 4 + 2 * u.pr.C)
	if tg.is_empty():
		return
	u.cd = 1.7
	for e in tg:
		_k_eff_hit(u, e, c, u.pr.KN * 1.2)
	KFX.append({"k": "wave", "u": u, "x": c.x, "y": c.y, "t": 0.0, "R": R, "sd": rnd(0, TAU)})
	pass  # 口の響きは無音（鳴り続けて不快）

## 縛: 近くの字に絡みついて動きを止める
func _m_bind(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(Vector2(u.x, u.y), 300 * SF * u.pr.A, u.pr.C + 1)
	if tg.is_empty():
		return
	u.cd = 1.6
	for e in tg:
		_k_eff_hit(u, e, Vector2(u.x, u.y), 0.0)
		e.daze = max(float(e.daze), 0.9 * u.pr.D)
		KFX.append({"k": "tether", "u": u, "e": e, "t": 0.0, "life": 0.9 * u.pr.D, "sd": rnd(0, TAU)})

## 放: 近くの字へ部首の効果を飛ばす
func _m_shoot(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(Vector2(u.x, u.y), 480 * SF * u.pr.A, u.pr.C)
	if tg.is_empty():
		return
	u.cd = 0.5
	for j in u.pr.C:
		var e = tg[j % tg.size()]
		var v = (Vector2(e.x, e.y) - Vector2(u.x, u.y)).normalized().rotated(rnd(-0.06, 0.06)) * 620 * SF
		KFX.append({"k": "proj", "u": u, "x": u.x, "y": u.y, "vx": v.x, "vy": v.y, "life": 1.0 * u.pr.A, "n": u.pr.X, "hit": {}, "sd": rnd(0, TAU)})

func _k_ripple(u: Dictionary, _dt: float) -> void:
	if u.cd > 0:
		return
	u.cd = 1.8
	for j in u.pr.C:
		KFX.append({"k": "ring", "u": u, "x": u.x, "y": u.y, "r": 0.0, "R": 170 * SF * u.pr.A, "sp": 300 * SF, "hit": {}, "delay": j * 0.22})
	ksfx("soft", -14, 1.3)

func _k_trail(u: Dictionary, dt: float, hp0: Vector2) -> void:
	# 火は主人公の前へ放つ（回らない）。字に当たると、その場でしばらく燃える
	if u.cd > 0:
		return
	u.cd = 1.0
	# 前＝主人公が最後に動いた向き。しばらく動いていなければ、いちばん近い字の方を前とする
	var dir: Vector2 = hero.get("last_dir", Vector2.ZERO)
	if time - float(hero.get("move_t", -99.0)) > 4.0 or dir.length() < 0.1:
		var tg = k_targets(hp0, 600 * SF, 1)
		dir = (Vector2(tg[0].x, tg[0].y) - hp0) if tg.size() else Vector2(float(hero.face), 0.0)
	dir = dir.normalized()
	var n: int = int(u.pr.C)
	for j in n:
		var a: float = (j - (n - 1) / 2.0) * 0.2
		var v: Vector2 = dir.rotated(a) * 640 * SF
		KFX.append({"k": "fireball", "u": u, "x": hp0.x + dir.x * 30 * SF, "y": hp0.y + dir.y * 30 * SF, "vx": v.x, "vy": v.y, "life": 1.0 * u.pr.A, "n": int(u.pr.X), "hit": {}})
	ksfx("dash", -14, 0.8)

func _k_tree(u: Dictionary, _dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	u.cd = 1.7
	var have = KFX.filter(func(f): return f.k == "tree" and f.u == u).size()
	for j in u.pr.C:
		if have + j >= 5 + u.pr.C * 2:
			break
		var tg = k_targets(hp0, 340 * SF, 6)
		var an: float = rnd(0, TAU) if tg.is_empty() else atan2(tg[0].y - hp0.y, tg[0].x - hp0.x) + rnd(-0.6, 0.6)
		var p = hp0 + Vector2.from_angle(an) * rnd(110, 150) * SF
		KFX.append({"k": "tree", "u": u, "x": p.x, "y": p.y, "r": 26 * SF * u.pr.A, "life": 7.0 * u.pr.D, "max": 7.0 * u.pr.D, "hp": 2 + u.pr.X, "t": 0.0})
	ksfx("thud", -12, 1.4)

func _k_orbit(u: Dictionary, dt: float, hp0: Vector2) -> void:
	u.ang += dt * 2.4 * u.pr.R
	var R: float = (125 if u.has("par") else 110) * SF * u.pr.A
	for j in u.pr.C:
		var p = hp0 + Vector2.from_angle(u.ang + TAU * j / u.pr.C) * R
		for e in k_targets(p, 30 * SF * u.pr.A + 34 * SF, u.pr.X):
			k_hit(u, e, hp0, u.pr.KN * 0.6, 0.5 / u.pr.R, "o")

func _k_blade(u: Dictionary, dt: float, hp0: Vector2) -> void:
	if u.dash != null:
		u.dash.t += dt / 0.16
		var k: float = min(1.0, u.dash.t)
		u.x = lerp(float(u.dash.a.x), float(u.dash.b.x), k)
		u.y = lerp(float(u.dash.a.y), float(u.dash.b.y), k)
		if k >= 1.0:
			var c = Vector2(u.x, u.y)
			for e in k_targets(c, 70 * SF * u.pr.A, u.pr.X + 1):
				k_hit(u, e, c, u.pr.KN)
			slash(u.dash.a.x, u.dash.a.y, u.x + (u.x - u.dash.a.x) * 0.3, u.y + (u.y - u.dash.a.y) * 0.3, false)
			ksfx("slash", -10, rnd(1.1, 1.3))
			u.dash.left -= 1
			var nx = k_targets(c, 260 * SF * u.pr.A, 3).filter(func(e): return e.alive)
			if u.dash.left > 0 and nx.size():
				u.dash = {"a": c, "b": Vector2(nx[0].x, nx[0].y), "t": 0.0, "left": u.dash.left}
			else:
				u.dash = null
		return
	if u.cd > 0:
		return
	var tg = k_targets(hp0, 380 * SF * u.pr.A, 1)
	if tg.is_empty():
		return
	u.cd = 0.45
	u.dash = {"a": Vector2(u.x, u.y), "b": Vector2(tg[0].x, tg[0].y), "t": 0.0, "left": u.pr.C + 1}

func _k_arrow(u: Dictionary, _dt: float) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(Vector2(u.x, u.y), 520 * SF * u.pr.A, u.pr.C)
	if tg.is_empty():
		return
	u.cd = 0.4
	for j in u.pr.C:
		var e = tg[j % tg.size()]
		var v = (Vector2(e.x, e.y) - Vector2(u.x, u.y)).normalized().rotated(rnd(-0.08, 0.08)) * 760 * SF
		KFX.append({"k": "arrow", "u": u, "x": u.x, "y": u.y, "vx": v.x, "vy": v.y, "life": 0.9 * u.pr.A, "n": u.pr.X + 1, "hit": {}})
	ksfx("dash", -16, 1.6)

func _k_shout(u: Dictionary, _dt: float) -> void:
	if u.cd > 0:
		return
	var c = Vector2(u.x, u.y)
	var tg = k_targets(c, 280 * SF * u.pr.A, 3 + 2 * u.pr.C)
	if tg.is_empty():
		return
	u.cd = 1.6
	var pts = []
	for e in tg:
		k_hit(u, e, c, u.pr.KN * 0.8)
		pts.append(Vector2(e.x, e.y))
	KFX.append({"k": "shout", "u": u, "x": c.x, "y": c.y, "t": 0.0, "pts": pts, "R": 280 * SF * u.pr.A})
	pass  # 口の響きは無音（鳴り続けて不快）

func _k_beast(u: Dictionary, dt: float, hp0: Vector2) -> void:
	# 分身は出さない。仲間の字そのものが駆けて噛みつき、字を弾き飛ばして定位置へ戻る
	if u.has("par"):
		# 脇の獣: 本体のそばに来た字に噛みつくだけ（動かない・字も出さない）
		if u.cd > 0:
			return
		var near = k_targets(Vector2(u.x, u.y), 120 * SF * u.pr.A, 1)
		if near.size():
			u.cd = 1.4
			_k_eff_hit(u, near[0], Vector2(u.x, u.y), u.pr.KN * 1.4)
			_k_mark(u, near[0].x, near[0].y)
		return
	var home: Vector2 = u.get("slot", hp0)
	if u.dash == null:
		if u.cd > 0:
			return
		var tg = k_targets(Vector2(u.x, u.y), 420 * SF * u.pr.A, 1)
		if tg.is_empty():
			return
		u.dash = {"e": tg[0], "ph": 0, "t": 0.0, "left": max(1, int(u.pr.T / 2))}
		ksfx("dash", -14, 1.3)
		return
	var dd: Dictionary = u.dash
	dd.t += dt
	var sp: float = 560 * SF * (1.0 + 0.1 * (u.pr.R - 1))
	var me := Vector2(u.x, u.y)
	if dd.ph == 0:
		var e: Dictionary = dd.e
		if not e.alive or dd.t > 1.4:
			dd.ph = 1
			return
		var to: Vector2 = Vector2(e.x, e.y) - me
		u.face = -1 if to.x < 0 else 1
		if to.length() < e.rad + 26 * SF:
			# 噛む: 字を大きく弾き飛ばし、自分も跳ね返る（重ならない）
			_k_eff_hit(u, e, me, u.pr.KN * (0.8 + 0.35 * u.pr.T))
			_k_mark(u, e.x, e.y)
			ksfx("slash", -12, 0.8)
			var back: Vector2 = -to.normalized() * (e.rad + 40 * SF)
			u.x += back.x; u.y += back.y
			dd.left -= 1
			var nx = k_targets(Vector2(u.x, u.y), 260 * SF * u.pr.A, 2).filter(func(o): return o.alive and o != e)
			if dd.left > 0 and nx.size():
				u.dash = {"e": nx[0], "ph": 0, "t": 0.0, "left": dd.left}
			else:
				dd.ph = 1
			return
		var st: Vector2 = to.normalized() * min(to.length(), sp * dt)
		u.x += st.x; u.y += st.y
	else:
		var to2: Vector2 = home - me
		if to2.length() < 10 * SF or dd.t > 3.0:
			u.dash = null
			u.cd = 1.0
			return
		var st2: Vector2 = to2.normalized() * min(to2.length(), sp * 0.8 * dt)
		u.x += st2.x; u.y += st2.y

func _k_slam(u: Dictionary, _dt: float, hp0: Vector2) -> void:
	if u.cd > 0:
		return
	var cand = k_targets(hp0, 420 * SF, 30)
	if cand.is_empty():
		return
	u.cd = 1.1
	var R: float = 120 * SF * u.pr.A
	# 字がいちばん固まっている所へ
	var best = []
	for e in cand:
		var nn = cand.filter(func(f): return Vector2(f.x, f.y).distance_to(Vector2(e.x, e.y)) < R).size()
		best.append([nn, e])
	best.sort_custom(func(a, b): return a[0] > b[0])
	for j in min(u.pr.C, best.size()):
		var e = best[j][1]
		KFX.append({"k": "rock", "u": u, "x": e.x, "y": e.y, "t": 0.0, "delay": 0.4 + j * 0.15, "R": R})

func _k_aura(u: Dictionary, dt: float, hp0: Vector2) -> void:
	var R: float = 115 * SF * u.pr.A
	if u.cd > 0:
		return
	u.cd = 0.6
	for e in k_targets(hp0, R, 3 + u.pr.X * 2):
		k_hit(u, e, hp0, 0.0)
		e.slow = max(float(e.get("slow", 0.0)), 0.5 * u.pr.D)

func _k_throw(u: Dictionary, _dt: float) -> void:
	if u.cd > 0:
		return
	var tg = k_targets(Vector2(u.x, u.y), 420 * SF * u.pr.A, u.pr.C)
	if tg.is_empty():
		return
	u.cd = 0.45
	for j in u.pr.C:
		var e = tg[j % tg.size()]
		KFX.append({"k": "stone", "u": u, "x0": u.x, "y0": u.y, "x": e.x + e.kx * 0.1, "y": e.y + e.ky * 0.1, "t": 0.0, "dur": 0.4, "R": 64 * SF * u.pr.A, "delay": j * 0.08})

func _k_wall(u: Dictionary, _dt: float, hp0: Vector2) -> void:
	var R: float = 80 * SF * u.pr.A
	for e in k_targets(hp0, R + 40 * SF, 99):
		var d: float = Vector2(e.x, e.y).distance_to(hp0)
		if d < R + e.rad:
			# 囲い（バリア）は押し返さない。触れている字を削り続けるだけ
			k_hit(u, e, hp0, 0.0, 0.7 / u.pr.R, "w")

func _k_fx(dt: float) -> void:
	for f in KFX:
		var u: Dictionary = f.u
		match f.k:
			"ring":
				if f.delay > 0:
					f.delay -= dt
					continue
				f.r += f.sp * dt
				for e in k_targets(Vector2(f.x, f.y), f.r + 30 * SF):
					if f.hit.has(e.id):
						continue
					var d: float = Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y))
					if abs(d - f.r) < e.rad + 12 * SF:
						f.hit[e.id] = 1
						# 波紋に当たった字は濡れる（濡れた字は削られると近くの濡れた字へ連鎖する）
						e.kwet = time + 3.0
						k_hit(u, e, Vector2(f.x, f.y), 0.0)
			"fire":
				f.life -= dt
				for e in k_targets(Vector2(f.x, f.y), f.r + 26 * SF, u.pr.X):
					if k_hit(u, e, Vector2(f.x, f.y), 0.0, 0.45, "f"):
						# 炎に触れた字は燃え続け、近くの字へ燃え移る
						e.kburn = max(float(e.get("kburn", 0.0)), 2.0)
						e.kburn_u = u
			"tree":
				f.life -= dt
				f.t += dt
				for e in k_targets(Vector2(f.x, f.y), f.r + 40 * SF, 6):
					if Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y)) < f.r + e.rad:
						if k_hit(u, e, Vector2(f.x, f.y), u.pr.KN * 2.4 + 200, 0.35, "t" + str(f.x)):
							f.hp -= 1
							if f.hp <= 0:
								f.life = 0.0
								shatter(f.x, f.y - f.r, "木", f.r * 2, 0.5, Kraft.FAM_COL["樹"])
			"fireball":
				f.life -= dt
				f.x += f.vx * dt
				f.y += f.vy * dt
				for e in k_targets(Vector2(f.x, f.y), 60 * SF):
					if f.hit.has(e.id) or Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y)) > e.rad + 10 * SF:
						continue
					f.hit[e.id] = 1
					k_hit(u, e, Vector2(f.x, f.y), 0.0)
					# 当たった所で、しばらく燃える
					KFX.append({"k": "fire", "u": u, "x": e.x, "y": e.y, "r": 32 * SF * u.pr.A, "life": 2.4 * u.pr.D, "max": 2.4 * u.pr.D})
					e.kburn = max(float(e.get("kburn", 0.0)), 2.0)
					e.kburn_u = u
					f.n -= 1
					if f.n <= 0:
						f.life = 0.0
						break
			"arrow":
				f.life -= dt
				f.x += f.vx * dt
				f.y += f.vy * dt
				for e in k_targets(Vector2(f.x, f.y), 40 * SF):
					if f.hit.has(e.id) or Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y)) > e.rad + 6 * SF:
						continue
					f.hit[e.id] = 1
					k_hit(u, e, Vector2(f.x - f.vx, f.y - f.vy), u.pr.KN * 0.6, 0.0, "", not f.has("norid"), 1 if f.has("norid") else -1)
					f.n -= 1
					if f.n <= 0:
						f.life = 0.0
						break
			"rock":
				if f.delay > 0:
					f.delay -= dt
					if f.delay <= 0:
						var c = Vector2(f.x, f.y)
						for e in k_targets(c, f.R, 4 + u.pr.X * 2):
							k_hit(u, e, c, u.pr.KN * 2.6 + 200)
							e.daze = max(float(e.daze), 0.5 * u.pr.D)
						shake = max(shake, 6.0)
						sfx.play("thud", -6, 0.8)
					continue
				f.t += dt
			"stone":
				if f.delay > 0:
					f.delay -= dt
					continue
				f.t += dt
				if f.t >= f.dur and not f.has("done"):
					f.done = true
					var c2 = Vector2(f.x, f.y)
					for e in k_targets(c2, f.R + 20 * SF, u.pr.X + 2):
						k_hit(u, e, c2, u.pr.KN)
					sfx.play("tick", -10, 0.7)
			"shout", "echo":
				f.t += dt
			"mark":
				f.t += dt
			"blight":
				f.t += dt
				f.r = min(float(f.R), f.R * f.t / 0.45)
				for e in k_targets(Vector2(f.x, f.y), f.r + 20 * SF, 6):
					_k_eff_hit(u, e, Vector2(f.x, f.y), u.pr.KN * 0.5, 0.5, "b" + str(int(f.x)))
				# 飛び火: でたらめな向きへ次の災いが起こる
				if not f.kid and f.t > 0.55 and int(f.gen) < 2 + int(u.pr.C):
					f.kid = true
					for m in randi_range(1, 2):
						var p: Vector2 = Vector2(f.x, f.y) + Vector2.from_angle(rnd(0, TAU)) * f.R * rnd(1.5, 2.4)
						spawn_blight.call_deferred(u, p, int(f.gen) + 1, float(f.R) * 0.9, float(f.life))
			"drop":
				if f.delay > 0:
					f.delay -= dt
					if f.delay <= 0:
						for e in k_targets(Vector2(f.x, f.y), f.R, 3 + u.pr.X):
							_k_eff_hit(u, e, Vector2(f.x, f.y), u.pr.KN * 0.8)
						# 落ちた所に溜まって、しばらく削りつづける
						KFX.append({"k": "pool", "u": u, "x": f.x, "y": f.y, "R": f.R, "t": 0.0, "life": 2.6 * u.pr.D, "sd": f.sd})
					continue
				f.t += dt
			"stream":
				f.t += dt
				f.s += 560 * SF * dt
				var hd: Vector2 = Vector2(f.x0, f.y0) + Vector2(f.dx, f.dy) * f.s
				for e in k_targets(hd, 46 * SF, 6):
					if f.hit.has(e.id):
						continue
					f.hit[e.id] = 1
					_k_eff_hit(u, e, hd - Vector2(f.dx, f.dy) * 30, u.pr.KN * 1.2)
			"wave", "beam", "arc", "sunring":
				f.t += dt
			"pool":
				f.t += dt
				for e in k_targets(Vector2(f.x, f.y), f.R + 10 * SF, 10):
					_k_eff_hit(u, e, Vector2(f.x, f.y), 30.0, 0.45, "pl" + str(int(f.x)))
			"tether":
				f.t += dt
			"gp", "rv":
				f.life -= dt
				f.x += f.vx * dt
				f.y += f.vy * dt
				for e in k_targets(Vector2(f.x, f.y), 50 * SF):
					if f.hit.has(e.id) or Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y)) > e.rad + 10 * SF:
						continue
					f.hit[e.id] = 1
					_k_eff_hit(u, e, Vector2(f.x - f.vx, f.y - f.vy), u.pr.KN * (0.5 if f.k == "rv" else 0.8))
					if f.get("slow", false):
						e.slow = max(float(e.get("slow", 0.0)), 2.5)
						e.daze = max(float(e.daze), 0.4)
					if f.k == "gp":
						f.n -= 1
						if f.n <= 0:
							f.life = 0.0
							break
			"proj":
				f.life -= dt
				f.x += f.vx * dt
				f.y += f.vy * dt
				for e in k_targets(Vector2(f.x, f.y), 40 * SF):
					if f.hit.has(e.id) or Vector2(e.x, e.y).distance_to(Vector2(f.x, f.y)) > e.rad + 8 * SF:
						continue
					f.hit[e.id] = 1
					_k_eff_hit(u, e, Vector2(f.x - f.vx, f.y - f.vy), u.pr.KN * 0.8)
					_k_mark(u, f.x, f.y, 24 * SF)
					f.n -= 1
					if f.n <= 0:
						f.life = 0.0
						break
	KFX = KFX.filter(func(f): return _k_alive(f))

func spawn_blight(u: Dictionary, p: Vector2, gen: int, R: float, life: float) -> void:
	if not _k_live(u):
		return
	KFX.append({"k": "blight", "u": u, "x": p.x, "y": p.y, "t": 0.0, "life": life, "r": 0.0, "R": R, "gen": gen, "kid": false, "sd": rnd(0, TAU)})

func _k_alive(f: Dictionary) -> bool:
	match f.k:
		"ring": return f.r < f.R
		"fire", "tree", "arrow", "fireball": return f.life > 0
		"rock": return f.delay > 0 or f.t < 0.5
		"stone": return f.t < f.dur + 0.3
		"shout": return f.t < 0.5
		"echo": return f.t < 0.35
		"mark": return f.t < 0.4
		"blight": return f.t < f.life
		"drop": return f.delay > 0 or f.t < 0.45
		"stream": return f.s < f.L + 200 * SF
		"wave": return f.t < 0.5
		"sunring": return f.t < 0.7
		"beam": return f.t < 0.35
		"arc": return f.t < 0.25
		"pool": return f.t < f.life
		"tether": return f.t < f.life and f.e.alive
		"proj", "gp", "rv": return f.life > 0
	return false

func _draw_kraft(ci: CanvasItem) -> void:
	if KU.is_empty() and KFX.is_empty():
		return
	semantic_combat.draw(self, ci)
	var hp0 = Vector2(hero.x, hero.y)
	# 技
	for f in KFX:
		var col: Color = f.u.pr.get("col", Kraft.FAM_COL.get(f.u.pr.body, KD.SUMI))
		match f.k:
			"ring":
				if f.delay <= 0:
					var a: float = 1.0 - f.r / f.R
					ci.draw_arc(Vector2(f.x, f.y), f.r, 0, TAU, 64, Color(col, 0.75 * a), 5 * SF * (0.4 + a), true)
					ci.draw_arc(Vector2(f.x, f.y), f.r * 0.92, 0, TAU, 64, Color(col, 0.3 * a), 2 * SF, true)
			"fire":
				var k: float = f.life / f.max
				glow(ci, Vector2(f.x, f.y), f.r * 1.6, Color(1.0, 0.45, 0.1, 0.35 * k))
				_k_eff_draw(ci, "炎", Vector2(f.x, f.y), f.r * 0.8 * (0.6 + 0.4 * k), k, f.x)
			"tree":
				var g: float = clamp(f.t / 0.4, 0.0, 1.0)
				var k2: float = clamp(f.life / 0.6, 0.0, 1.0)
				ci.draw_circle(Vector2(f.x, f.y), f.r, Color(col, 0.10 * k2))
				ci.draw_line(Vector2(f.x, f.y + f.r * 0.6), Vector2(f.x, f.y + f.r * 0.6 - f.r * 1.6 * g), Color(KD.SUMI, 0.75 * k2), 5 * SF, true)
				_k_eff_draw(ci, "樹", Vector2(f.x, f.y - f.r * 1.0 * g), f.r * 1.3 * g, k2, f.x)
				for h in f.hp:
					ci.draw_circle(Vector2(f.x - 8 * SF + h * 8 * SF, f.y + f.r * 0.9), 2.5 * SF, Color(col, 0.8 * k2))
			"fireball":
				var vd: Vector2 = Vector2(f.vx, f.vy).normalized()
				for q in 3:
					glow(ci, Vector2(f.x, f.y) - vd * q * 14 * SF, (26 - q * 6) * SF, Color(1.0, 0.45, 0.1, 0.45 - q * 0.12))
				glyph(ci, String(f.u.get("ach", "火")), Vector2(f.x, f.y), 26 * SF, Color(1.0, 0.55, 0.12), Color(KD.SHU, 0.7), 3, sin(time * 20) * 0.15)
			"arrow":
				var v = Vector2(f.vx, f.vy).normalized()
				ci.draw_line(Vector2(f.x, f.y) - v * 26 * SF, Vector2(f.x, f.y), Color(col, 0.95), 3 * SF, true)
				ci.draw_line(Vector2(f.x, f.y), Vector2(f.x, f.y) - v.rotated(0.5) * 9 * SF, Color(col, 0.95), 3 * SF, true)
				ci.draw_line(Vector2(f.x, f.y), Vector2(f.x, f.y) - v.rotated(-0.5) * 9 * SF, Color(col, 0.95), 3 * SF, true)
			"rock":
				var c = Vector2(f.x, f.y)
				if f.delay > 0:
					var k3: float = 1.0 - f.delay / 0.4
					ci.draw_arc(c, f.R, 0, TAU, 48, Color(col, 0.35), 2 * SF, true)
					ci.draw_circle(c, f.R * 0.3 * k3, Color(KD.SUMI, 0.2))
					_k_eff_draw(ci, "岩", c - Vector2(0, (1.0 - k3) * 260 * SF), 26 * SF, 0.95, f.x)
				else:
					var a2: float = 1.0 - f.t / 0.5
					ci.draw_arc(c, f.R * (0.6 + f.t), 0, TAU, 48, Color(col, 0.7 * a2), 6 * SF * a2, true)
					_k_eff_draw(ci, "岩", c, 26 * SF, a2, f.x)
			"stone":
				if f.delay <= 0:
					var k4: float = clamp(f.t / f.dur, 0.0, 1.0)
					var p = Vector2(f.x0, f.y0).lerp(Vector2(f.x, f.y), k4) - Vector2(0, sin(k4 * PI) * 80 * SF)
					if k4 < 1.0:
						ci.draw_circle(p, 6 * SF, Color(col, 0.95))
					else:
						var a3: float = 1.0 - (f.t - f.dur) / 0.3
						ci.draw_arc(Vector2(f.x, f.y), f.R * (1.2 - 0.4 * a3), 0, TAU, 32, Color(col, 0.7 * a3), 3 * SF, true)
			"mark":
				_k_eff_draw(ci, f.u.pr.eff, Vector2(f.x, f.y), f.r * (0.8 + f.t), 1.0 - f.t / 0.4, f.x, f.u.pr.col)
			"blight":
				var ab: float = clamp(min(f.t / 0.3, (f.life - f.t) / 0.5), 0.0, 1.0)
				ci.draw_circle(Vector2(f.x, f.y), f.r, Color(col, 0.10 * ab))
				_dash_ellipse(ci, Vector2(f.x, f.y), f.r, f.r * 0.8, Color(col, 0.45 * ab), 2 * SF)
				_k_eff_draw(ci, f.u.pr.eff, Vector2(f.x, f.y), f.r * 0.6, ab, f.sd, f.u.pr.col)
			"drop":
				if f.delay > 0:
					var kd: float = 1.0 - clamp(f.delay / 0.45, 0.0, 1.0)
					ci.draw_arc(Vector2(f.x, f.y), f.R, 0, TAU, 36, Color(col, 0.3), 2 * SF, true)
					glyph(ci, f.u.ch, Vector2(f.x, f.y - (1.0 - kd) * 300 * SF), 30 * SF, Color(col, 0.95), Color(KD.WASHI, 0.85), 3)
				else:
					_k_eff_draw(ci, f.u.pr.eff, Vector2(f.x, f.y), f.R * (0.5 + f.t), 1.0 - f.t / 0.45, f.sd, f.u.pr.col)
			"stream":
				for q in 6:
					var back: float = q * 34 * SF
					var sq: float = float(f.s) - back
					if sq < 0 or sq > float(f.L):
						continue
					var qp: Vector2 = Vector2(f.x0, f.y0) + Vector2(f.dx, f.dy) * sq
					_k_eff_draw(ci, f.u.pr.eff, qp, 24 * SF * (1.0 - q * 0.12), 1.0 - q * 0.15, f.sd + q, f.u.pr.col)
			"arc":
				# 筆の払いのような弧（主人公についていく）
				var aa: float = 1.0 - f.t / 0.25
				var c3: Vector2 = Vector2(hero.x, hero.y)
				var a1: float = f.an - f.span * 0.5
				var sweep: float = f.span * min(1.0, f.t / 0.08)
				# 太い墨の払い＋刃の光
				for q in 4:
					var rq: float = f.R * (0.78 + q * 0.07)
					ci.draw_arc(c3, rq, a1, a1 + sweep, 28, Color(col.darkened(0.2), (0.85 - q * 0.15) * aa), f.w * (1.0 - q * 0.18), true)
				ci.draw_arc(c3, f.R, a1, a1 + sweep, 28, Color(KD.SUMI, 0.9 * aa), 3 * SF, true)
				ci.draw_arc(c3, f.R * 0.9, a1 + sweep * 0.2, a1 + sweep, 20, Color(1, 1, 1, 0.8 * aa), 2 * SF, true)
			"beam":
				var ab2: float = 1.0 - f.t / 0.35
				ci.draw_line(f.a, f.b, Color(col, 0.35 * ab2), f.w * 2.4, true)
				ci.draw_line(f.a, f.b, Color(col.lightened(0.4), 0.85 * ab2), f.w, true)
				ci.draw_line(f.a, f.b, Color(1, 1, 0.92, 0.95 * ab2), f.w * 0.35, true)
			"pool":
				var ap: float = clamp(min(f.t / 0.15, (f.life - f.t) / 0.4), 0.0, 1.0)
				var wob: float = 1.0 + 0.05 * sin(time * 5 + f.sd)
				ci.draw_set_transform(Vector2(f.x, f.y), 0.0, Vector2(1.0, 0.55))
				ci.draw_circle(Vector2.ZERO, f.R * wob, Color(col, 0.22 * ap))
				ci.draw_arc(Vector2.ZERO, f.R * wob, 0, TAU, 40, Color(col, 0.6 * ap), 2.5 * SF, true)
				ci.draw_arc(Vector2.ZERO, f.R * 0.6 * wob, 0, TAU, 32, Color(col, 0.35 * ap), 1.5 * SF, true)
				ci.draw_set_transform(Vector2.ZERO, 0.0, Vector2.ONE)
			"sunring":
				var asr: float = 1.0 - f.t / 0.7
				var rr: float = f.R * (0.55 + 0.45 * min(1.0, f.t / 0.18))
				var csr: Vector2 = Vector2(f.x, f.y)
				ci.draw_circle(csr, rr, Color(col, 0.16 * asr))
				ci.draw_arc(csr, rr, 0, TAU, 64, Color(col.lightened(0.15), 0.95 * asr), 5 * SF, true)
				ci.draw_arc(csr, rr * 0.93, 0, TAU, 64, Color(1, 1, 0.9, 0.5 * asr), 1.5 * SF, true)
				for q in 12:
					var an: float = f.sd + q * TAU / 12 + f.t * 0.6
					ci.draw_line(csr + Vector2.from_angle(an) * rr * 0.8, csr + Vector2.from_angle(an) * rr * 1.08, Color(col.lightened(0.2), 0.6 * asr), 3 * SF, true)
			"wave":
				var aw: float = 1.0 - f.t / 0.5
				var rw: float = 30 * SF + f.t / 0.5 * f.R
				ci.draw_arc(Vector2(f.x, f.y), rw, 0, TAU, 48, Color(col, 0.45 * aw), 3 * SF, true)
				for q in 8:
					var wpos: Vector2 = Vector2(f.x, f.y) + Vector2.from_angle(f.sd + q * TAU / 8) * rw
					_k_eff_draw(ci, f.u.pr.eff, wpos, 16 * SF, aw, f.sd + q, f.u.pr.col)
			"tether":
				var at: float = clamp((f.life - f.t) / 0.3, 0.0, 1.0)
				var a0: Vector2 = Vector2(f.u.x, f.u.y)
				var b0: Vector2 = Vector2(f.e.x, f.e.y)
				var pts3 := PackedVector2Array()
				for q in 11:
					var tq: float = q / 10.0
					pts3.append(a0.lerp(b0, tq) + (b0 - a0).orthogonal().normalized() * sin(tq * TAU * 2 + time * 8) * 6 * SF)
				ci.draw_polyline(pts3, Color(col, 0.7 * at), 2.5 * SF, true)
				_k_eff_draw(ci, f.u.pr.eff, b0, 20 * SF, at, f.sd, f.u.pr.col)
			"gp":
				var ag: float = clamp(f.life / 0.25, 0.0, 1.0) * (0.7 if f.get("slow", false) else 1.0)
				glyph(ci, f.u.ch, Vector2(f.x, f.y), f.sz, Color(f.u.pr.col, ag), Color(KD.WASHI, 0.8 * ag), 2)
			"rv":
				# 川の流れ: 筆の線のように尾を引く
				var ar2: float = clamp(f.life / 0.3, 0.0, 1.0)
				var tail: Vector2 = Vector2(f.x - f.vx * 0.06, f.y - f.vy * 0.06)
				ci.draw_line(tail, Vector2(f.x, f.y), Color(f.u.pr.col, 0.85 * ar2), 7 * SF, true)
			"proj":
				glyph(ci, f.u.ch, Vector2(f.x, f.y), 28 * SF, Color(col, 0.95), Color(KD.WASHI, 0.85), 3, atan2(f.vy, f.vx) * 0.0)
			"echo":
				var a5: float = 1.0 - f.t / 0.35
				ci.draw_arc(Vector2(f.x, f.y), 20 * SF + f.t * 200 * SF, 0, TAU, 32, Color(col, 0.6 * a5), 2 * SF, true)
			"shout":
				var a4: float = 1.0 - f.t / 0.5
				ci.draw_arc(Vector2(f.x, f.y), 40 * SF + f.t * f.R, 0, TAU, 48, Color(col, 0.5 * a4), 3 * SF, true)
				for p2 in f.pts:
					ci.draw_line(Vector2(f.x, f.y), p2, Color(col, 0.6 * a4), 2.5 * SF, true)
	# 脇の部品の効果が起きている字の印（根・呪い・噛み）
	for e in E:
		if not e.alive or not on_view(e.x, e.y, 40):
			continue
		if time < float(e.get("kroot", -1.0)):
			var c0 = Vector2(e.x, e.y + e.rad * 0.7)
			for j in 4:
				var an: float = PI * 0.15 + j * PI * 0.23
				ci.draw_line(c0, c0 + Vector2(cos(an), sin(an) * 0.4) * e.rad * 1.1, Color(Kraft.FAM_COL["樹"], 0.85), 3 * SF, true)
		if time < float(e.get("kcurse", -1.0)):
			_dash_ellipse(ci, Vector2(e.x, e.y), e.rad * 1.15, e.rad * 1.15, Color(Kraft.FAM_COL["霊"], 0.7), 2 * SF)
		if time < float(e.get("kwet", -1.0)):
			for j in 3:
				var dp = Vector2(e.x - e.rad * 0.6 + j * e.rad * 0.6, e.y + e.rad * 0.8 + fmod(time * 40 + j * 7, 14.0) * SF)
				ci.draw_circle(dp, 2.6 * SF, Color(Kraft.FAM_COL["波"], 0.85))
		if int(e.get("kbleed", 0)) > 0:
			for j2 in 3:
				var bp = Vector2(e.x - e.rad * 0.5 + j2 * e.rad * 0.5, e.y - e.rad * 0.95)
				ci.draw_line(bp, bp + Vector2(0, 9 * SF), Color(0.75, 0.1, 0.05, 0.9), 3 * SF, true)
		if float(e.get("slow", 0.0)) > 0 and float(e.get("kburn", 0.0)) <= 0:
			pass
	# 常にある技（回る光・結界・囲い）
	var all_u: Array = []
	for u0 in KU:
		all_u.append(u0)
		all_u.append_array(u0.subs)
	for u in all_u:
		var pr: Dictionary = u.pr
		var col2: Color = pr.get("col", Kraft.FAM_COL.get(pr.body, KD.SUMI))
		match ("" if semantic_combat.handles(String(pr.get("motion", ""))) else String(pr.get("motion", ""))):
			"lamp":
				# 灯: 字そのものが灯りになって、主人公のまわりを照らす（火などの分身は出さない）
				var LR: float = float(u.get("lampR", 165 * SF))
				var fl2: float = 1.0 + 0.04 * sin(time * 7 + u.id)
				glow(ci, hp0, LR * 1.15 * fl2, Color(1.0, 0.82, 0.45, 0.20))
				glow(ci, Vector2(u.x, u.y), 70 * SF * fl2, Color(1.0, 0.8, 0.4, 0.45))
			"dragon":
				var sg: Array = u.get("segs", [])
				for i in range(sg.size() - 1, -1, -1):
					var kk: float = 1.0 - float(i + 1) / (sg.size() + 1)
					glyph(ci, u.ch, sg[i], 34 * SF * (0.55 + 0.45 * kk), Color(col2, 0.35 + 0.6 * kk), Color(KD.WASHI, 0.8), 3)
			"garlic":
				var GA: float = float(u.get("garR", 105 * SF)) * (1.0 + 0.03 * sin(time * 3))
				ci.draw_circle(hp0, GA, Color(col2, 0.08))
				ci.draw_arc(hp0, GA, 0, TAU, 64, Color(col2, 0.35), 2 * SF, true)
			"guard":
				var GR: float = float(u.get("guardR", 96 * SF))
				_dash_ellipse(ci, hp0, GR, GR, Color(col2, 0.35), 2 * SF)
			"orbit":
				var OR: float = float(u.get("orbR", 115 * SF))
				for j in range(1, pr.C):
					var op3: Vector2 = hp0 + Vector2.from_angle(u.ang + TAU * j / pr.C) * OR
					glyph(ci, u.ch, op3, 26 * SF, Color(col2, 0.9), Color(KD.WASHI, 0.85), 3)
		match ("" if String(pr.get("motion", "")) != "" else pr.kind):
			"orbit":
				# 光の字（日・月…）そのものが回る
				for j in pr.C:
					var p3 = hp0 + Vector2.from_angle(u.ang + TAU * j / pr.C) * (125 if u.has("par") else 110) * SF * pr.A
					# 光の玉（字の分身は出さない）
					glow(ci, p3, 40 * SF * pr.A, Color(1.0, 0.85, 0.4, 0.45))
					ci.draw_circle(p3, 7 * SF * sqrt(pr.A), Color(1.0, 0.93, 0.7, 0.95))
			"aura":
				var R: float = 115 * SF * pr.A
				ci.draw_circle(hp0, R, Color(col2, 0.07))
				_dash_ellipse(ci, hp0, R, R, Color(col2, 0.5 + 0.2 * sin(time * 4)), 2 * SF)
			"wall":
				var R2: float = 80 * SF * pr.A
				ci.draw_arc(hp0, R2, 0, TAU, 64, Color(col2, 0.55 + 0.4 * u.hitp), (5 + 4 * u.hitp) * SF, true)
		if u.has("par"):
			# 脇の部品は字を出さない（技の効果だけ）
			continue
		if not k_is_body(u):
			continue
		# 仲間の字（技の色の縁、当てた瞬間に膨らむ）
		var sz: float = 34 * SF * (1.0 + 0.15 * u.hitp) * (1.0 + 0.04 * min(6.0, pr.T))
		glow(ci, Vector2(u.x, u.y), sz * 1.2, Color(col2, 0.25))
		# 仲間の字は部首の色（火は朱、水は藍…）
		var dim: float = 0.45 if float(u.get("cd", 0.0)) > 3.0 and String(pr.get("motion", "")) == "annihilate" else 1.0
		glyph(ci, u.ch, Vector2(u.x, u.y), sz, Color(col2, dim), Color(KD.WASHI, 0.95), 4)
		if u.lv > 1:
			txt(ci, UF, u.x + sz * 0.45, u.y + sz * 0.2, "%d" % u.lv, 11 * SF + 2, col2)


## ======== 字の試験場: あらゆる字の性能を、字に囲まれた所で試す ========
var kl_on := false
var kl = {}
const KL_SC = [
	["囲まれる", "まわり一周から24の字が迫る"],
	["群れ", "右から30の字が押し寄せる"],
	["硬い字", "部品の多い大きな字が6つ"],
	["速い字", "足の速い字が16、四方から"],
	["湧き続ける", "字が絶えず湧く（毎秒の削りを見る）"],
]

func start_kl() -> void:
	Kraft.load_db()
	start()
	lab_on = true
	kl_on = true
	next_boss = 1e9
	banner = null
	set_hint("", 0)
	kl = {"q": "", "fam": "", "sel": 0, "top": 0, "list": [], "cur": "淡", "party": ["淡"], "lv": 1, "sc": 0,
		"t": 0.0, "kills0": 0, "touch": 0, "done": -1.0, "hist": [], "n0": 0, "eat0": {}}
	kl_filter()
	kl.sel = max(0, kl.list.find("淡"))
	kl_restart()

func kl_filter() -> void:
	var q: String = kl.q
	var out: Array = []
	for c in Kraft.ALL:
		var k: Dictionary = Kraft.K[c]
		if not Kraft.can_ally(c):
			continue
		if kl.fam != "" and Kraft.rad_of(c) != kl.fam:
			continue
		if q != "" and not String(k.en).begins_with(q):
			continue
		out.append(c)
	kl.list = out
	kl.sel = clampi(kl.sel, 0, max(0, out.size() - 1))

func kl_party_set(chs: Array) -> void:
	kl.party = chs
	kl_restart()

func kl_restart() -> void:
	lab_clear()
	kraft_clear()
	for c in kl.party:
		kraft_add(c, kl.lv)
	for u in KU:
		u.x = hero.x; u.y = hero.y
	dmg_by = {}
	kl.t = 0.0
	kl.kills0 = kills
	kl.touch = 0
	kl.done = -1.0
	kl.spawned = 0
	# 同じ場面は毎回同じ字が同じ所に出る（Lv や字を変えても、敵は変わらない。比べられるように）
	seed(9173 + int(kl.sc) * 101)
	var hp0 = Vector2(hero.x, hero.y)
	match int(kl.sc):
		0:
			for i in 24:
				var an: float = TAU * i / 24.0
				var e = spawn_enemy(kl_def(1, 3), hp0 + Vector2(cos(an) * 360, sin(an) * 270) * SF)
				e.born = 1.0
		1:
			hero.last_dir = Vector2.RIGHT
			hero.face = 1
			kl.stream = 30
		2:
			for i in 6:
				var an2: float = TAU * i / 6.0
				var e2 = spawn_enemy(kl_def(3, 9), hp0 + Vector2(cos(an2) * 340, sin(an2) * 260) * SF)
				e2.born = 1.0
		3:
			for i in 16:
				var an3: float = TAU * i / 16.0
				var e3 = spawn_enemy(kl_def(1, 2), hp0 + Vector2(cos(an3) * 380, sin(an3) * 290) * SF, "fast")
				e3.born = 1.0
	kl.n0 = movers()

## 試験場に出す字（相性の仕掛けのある字と撃ってくる字は除く）
func kl_def(lo: int, hi: int):
	var pool = KD.SPAWN_DEFS.filter(func(d): return d.lv >= lo and d.lv <= hi and counter_of(d.ch).is_empty() and not SHOOTERS.has(d.ch) and not ["氷", "岩", "毒", "闇", "霧", "鬼", "呪"].has(d.ch) and not _is_fire(d.ch))
	return pool.pick_random() if pool.size() else null

func kl_tick(dt: float) -> void:
	# 主人公を、左右の札のあいだの真ん中に見せる
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.75, 1.2)
	cam = Vector2(hero.x, hero.y) + Vector2((340 - 260) * S / 2, 50 * S)
	hp = max_hp
	pending_lv = 0
	xp = 0
	kl.t += dt
	var hp0 = Vector2(hero.x, hero.y)
	if int(kl.sc) == 1 and kl.get("stream", 0) > 0 and tick("kl_st", dt, 0.18):
		kl.stream -= 1
		var e = spawn_enemy(kl_def(1, 3), hp0 + Vector2(480 * SF, rnd(-240, 240) * SF))
		e.born = 1.0
	if int(kl.sc) == 4 and movers() < 26 and tick("kl_sp", dt, 0.25):
		var an = rnd(0, TAU)
		var e2 = spawn_enemy(kl_def(1, 3), hp0 + Vector2(cos(an) * 380, sin(an) * 290) * SF)
		e2.born = 1.0
	if kl.done < 0 and int(kl.sc) != 4 and kl.t > 1.0 and movers() == 0 and kl.get("stream", 0) <= 0:
		kl.done = kl.t
		kl_record()

func kl_eaten() -> int:
	var n = 0
	for u in KU:
		n += int(dmg_by.get(ku_tag(u), 0))
	return n

func kl_record() -> void:
	var name = "".join(kl.party)
	kl.hist.push_front({"who": name + ("" if kl.lv == 1 else " Lv%d" % kl.lv), "sc": KL_SC[kl.sc][0], "t": kl.done, "eat": kl_eaten(), "ps": kl_eaten() / max(0.5, kl.t), "touch": kl.touch})
	if kl.hist.size() > 6:
		kl.hist.pop_back()

## 合体の演出を見る: 字の部品（二つ〜四つ）が寄り合って、その字になる
func kl_fuse_show(ch: String) -> void:
	var k: Dictionary = Kraft.K.get(ch, {})
	if k.is_empty():
		return
	var parts: Array = k.lv if k.lv.size() >= 3 and k.lv.size() <= 4 else k.op
	if parts.size() < 2:
		parts = [ch]
	var c: Vector2 = Vector2(hero.x, hero.y - 90 * SF)
	var ps: Array = []
	for j in parts.size():
		ps.append([parts[j], c + Vector2.from_angle(TAU * j / parts.size() - PI / 2) * 150 * SF])
	FUSE_FX.append({"a": parts[0], "b": parts[min(1, parts.size() - 1)], "res": ch, "pa": ps[0][1], "pb": ps[min(1, ps.size() - 1)][1], "c": c, "t": 0.0, "ps": ps})
	sfx.play("fuse", -4, 1.2)
	later(0.9, func(): sfx.play("stamp", -2))

func kl_key(ev: InputEventKey) -> bool:
	var kc: int = ev.keycode
	if kc == KEY_ESCAPE:
		kl_on = false
		lab_on = false
		kraft_clear()
		to_title()
		return true
	if kc == KEY_UP or kc == KEY_DOWN:
		kl.sel = clampi(kl.sel + (1 if kc == KEY_DOWN else -1), 0, max(0, kl.list.size() - 1))
		if kl.list.size():
			kl.cur = kl.list[kl.sel]
		return true
	if kc == KEY_PAGEUP or kc == KEY_PAGEDOWN:
		kl.sel = clampi(kl.sel + (16 if kc == KEY_PAGEDOWN else -16), 0, max(0, kl.list.size() - 1))
		if kl.list.size():
			kl.cur = kl.list[kl.sel]
		return true
	if kc == KEY_ENTER or kc == KEY_KP_ENTER:
		if kl.list.size():
			kl.cur = kl.list[kl.sel]
			if ev.shift_pressed:
				kl_add(kl.cur)
			else:
				kl_party_set([kl.cur])
		return true
	if kc == KEY_TAB:
		kl_add(kl.cur)
		return true
	if kc == KEY_F4:
		kl_fuse_show(kl.cur)
		return true
	if kc == KEY_LEFT or kc == KEY_RIGHT:
		kl.lv = clampi(kl.lv + (1 if kc == KEY_RIGHT else -1), 1, 9)
		kl_restart()
		return true
	if kc == KEY_SPACE:
		kl_restart()
		return true
	if kc >= KEY_1 and kc <= KEY_5:
		kl.sc = kc - KEY_1
		kl_restart()
		return true
	if kc == KEY_BACKSPACE:
		if kl.q != "":
			kl.q = kl.q.substr(0, kl.q.length() - 1)
			kl_filter()
		return true
	if kc == KEY_DELETE:
		kl.q = ""
		kl.fam = ""
		kl_filter()
		return true
	var ch = ""
	if ev.unicode >= 65 and ev.unicode <= 122:
		ch = String.chr(ev.unicode).to_lower()
	if ch >= "a" and ch <= "z" and ch.length() == 1:
		kl.q += ch
		kl.sel = 0
		kl_filter()
		if kl.list.size():
			kl.cur = kl.list[0]
		return true
	return true

func kl_add(c: String) -> void:
	if kl.party.has(c):
		return
	if kl.party.size() >= 4:
		kl.party.pop_front()
	kl.party.append(c)
	kl_restart()

func kl_pick(i: int) -> void:
	kl.sel = i
	kl.cur = kl.list[i]
	kl_party_set([kl.cur])

var _kl_rads: Array = []
## 試験場の絞り込みに出す部首（仲間になれる字の多い順に24）
func kl_rads() -> Array:
	if _kl_rads.is_empty():
		var cnt = {}
		for c in Kraft.ALL:
			if Kraft.can_ally(c):
				var r: String = Kraft.rad_of(c)
				cnt[r] = int(cnt.get(r, 0)) + 1
		var ks: Array = cnt.keys()
		ks.sort_custom(func(a, b): return cnt[a] > cnt[b])
		_kl_rads = ks.slice(0, 24)
	return _kl_rads

func kl_set_fam(f: String) -> void:
	kl.fam = "" if kl.fam == f else f
	kl.sel = 0
	kl_filter()

func kl_set_sc(i: int) -> void:
	kl.sc = i
	kl_restart()

func kl_lv(d: int) -> void:
	kl.lv = clampi(kl.lv + d, 1, 9)
	kl_restart()

func kl_remove(c: String) -> void:
	kl.party.erase(c)
	kl_restart()

func _kl_card(ci: CanvasItem, ch: String, x: float, y: float, w: float, S: float) -> float:
	var k: Dictionary = Kraft.K.get(ch, {})
	if k.is_empty():
		return y
	var pr: Dictionary = Kraft.prof(ch, kl.lv)
	var col: Color = Kraft.FAM_COL.get(pr.body, KD.SUMI)
	glyph(ci, ch, Vector2(x + 50 * S, y + 50 * S), 86 * S, KD.SUMI)
	txt(ci, PF, x + 104 * S, y + 6 * S, String(k.en), 20 * S, KD.SUMI)
	txt(ci, UF, x + 104 * S, y + 34 * S, String(k.jp) + "　%d画" % int(k.stk), 12 * S, Color(KD.SUMI, 0.7))
	var mv: String = String(pr.get("motion", ""))
	var mj: Array = Kraft.MOTION_JP[mv] if mv != "" else [Kraft.BODY[pr.body][1], Kraft.BODY[pr.body][2]]
	ci.draw_rect(Rect2(x + 104 * S, y + 58 * S, w - 104 * S, 37 * S), Color(col, 0.12))
	wrap_text(ci, UF, x + 112 * S, y + 61 * S, "部首 %s ─ %s" % [Kraft.rad_of(ch), Kraft.effect_jp(ch).split("（")[0]], w - 118 * S, 12 * S, col, 2)
	y += 100 * S
	y += wrap_text(ci, UF, x, y, "効果（部首 %s から）: %s" % [Kraft.rad_of(ch), Kraft.effect_jp(ch)], w, 12 * S, KD.SUMI, 2) + 4 * S
	var basis: String = "字の意味" if String(pr.get("semantic_source", "radical")) != "radical" else "部首の属性"
	y += wrap_text(ci, UF, x, y, "%s → %s ─ %s" % [basis, mj[0], mj[1]], w, 12 * S, KD.SUMI, 3) + 6 * S
	if pr.get("transform", false):
		y += wrap_text(ci, UF, x, y, "【転義】" + String(pr.get("transform_note", "")), w, 12 * S, KD.SHU, 2) + 6 * S
	# 組み立て
	var ops: Array = k.op
	var made: String = ("%s ＝ %s ＋ %s" % [ch, ops[0], ops[1]]) if ops.size() == 2 else "%s（これ以上は組めない素の字）" % ch
	txt(ci, UF, x, y, made, 14 * S, KD.SUMI)
	y += 24 * S
	# 素（葉）: 系統の色で。どの能力値を上げたか
	txt(ci, UF, x, y + 4 * S, "素", 12 * S, Color(KD.SUMI, 0.6))
	var xx: float = x + 26 * S
	for c in k.lv:
		var f: String = Kraft.fam_of(c)
		var cc: Color = Kraft.FAM_COL.get(f, Color(KD.SUMI, 0.35))
		if xx > x + w - 40 * S:
			y += 40 * S
			xx = x + 26 * S
		ci.draw_rect(Rect2(xx, y, 38 * S, 36 * S), Color(cc, 0.12))
		glyph(ci, c, Vector2(xx + 19 * S, y + 14 * S), 22 * S, cc if f != "" else Color(KD.SUMI, 0.45))
		var lab: String = Kraft.STAT_JP.get(Kraft.FAM[f].stat, "") if f != "" else "－"
		txt(ci, UF, xx + 19 * S, y + 25 * S, lab, 9 * S, cc, 1)
		xx += 42 * S
	y += 46 * S
	var inheritance: Array = []
	for material in pr.get("traits", []):
		inheritance.append("%s→%s" % [material.source, Kraft.EFFECT_JP.get(material.effect, material.family).split("（")[0]])
	y += wrap_text(ci, UF, x, y, "部品の継承: " + ("・".join(inheritance) if not inheritance.is_empty() else "主属性を凝縮する"), w, 11 * S, Color(KD.SUMI, 0.75), 2) + 4 * S
	y += wrap_text(ci, UF, x, y, "Lv%d: %s" % [kl.lv, pr.get("growth_note", "")], w, 11 * S, KD.SHU, 2) + 6 * S
	txt(ci, UF, x, y, "格 %.1f（素の数。高いほど全体が強い）　Lv %d" % [pr.T, kl.lv], 12 * S, Color(KD.SUMI, 0.75))
	y += 22 * S
	# 能力値
	for st in Kraft.STATS:
		var v: float = pr.s[st]
		txt(ci, UF, x, y, Kraft.STAT_JP[st], 12 * S, KD.SUMI)
		var bx: float = x + 44 * S
		var bw: float = w - 150 * S
		ci.draw_rect(Rect2(bx, y + 3 * S, bw, 10 * S), Color(KD.SUMI, 0.08))
		for j in int(v):
			ci.draw_rect(Rect2(bx + j * (bw / 6.0), y + 3 * S, bw / 6.0 - 2 * S, 10 * S), col)
		txt(ci, UF, x + w, y, Kraft.stat_meaning(pr, st), 11 * S, Color(KD.SUMI, 0.75), 2)
		y += 19 * S
	y += 6 * S
	var uses: Array = Kraft.USES.get(ch, [])
	if uses.size():
		y += wrap_text(ci, UF, x, y, "この字を材料に（%d）: %s" % [uses.size(), "".join(uses.slice(0, 28))], w, 12 * S, Color(KD.SUMI, 0.75), 3)
	return y

func _draw_kl(ci: CanvasItem) -> void:
	var S: float = clamp(min(W / 1280.0, H / 800.0), 0.75, 1.2)
	var lw: float = 260 * S
	var rw: float = 340 * S
	# ---- 左: 字の一覧 ----
	ci.draw_rect(Rect2(0, 0, lw, H), Color(KD.WASHI, 0.96))
	ci.draw_line(Vector2(lw, 0), Vector2(lw, H), Color(KD.SUMI, 0.3), 1)
	txt(ci, UF, 14 * S, 10 * S, "字の試験場", 20 * S, KD.SHU)
	txt(ci, UF, 14 * S, 38 * S, "%d字（全%d字）" % [kl.list.size(), Kraft.ALL.size()], 11 * S, Color(KD.SUMI, 0.6))
	ci.draw_rect(Rect2(14 * S, 58 * S, lw - 28 * S, 28 * S), Color(1, 1, 1, 0.8))
	ci.draw_rect(Rect2(14 * S, 58 * S, lw - 28 * S, 28 * S), Color(KD.SUMI, 0.4), false, 1)
	txt(ci, PF, 22 * S, 62 * S, kl.q if kl.q != "" else "英語で探す（打つ）", 14 * S, KD.SUMI if kl.q != "" else Color(KD.SUMI, 0.4))
	# 系統で絞る
	var fx: float = 14 * S
	var fy: float = 94 * S
	# 部首で絞る（仲間の多い部首から）
	for f in kl_rads():
		var r = Rect2(fx, fy, 36 * S, 30 * S)
		var on: bool = kl.fam == f
		var col: Color = Kraft.RAD_COL.get(f, Kraft.FAM_COL.get(Kraft.fam_of(f), KD.SUMI))
		ci.draw_rect(r, col if on else Color(col, 0.12))
		txt(ci, UF, r.get_center().x, fy + 5 * S, f, 15 * S, KD.WASHI if on else col, 1)
		buttons.append([r, kl_set_fam.bind(f)])
		fx += 39 * S
		if fx > lw - 40 * S:
			fx = 14 * S
			fy += 33 * S
	var ly: float = fy + 40 * S
	var rh: float = 30 * S
	var rows: int = int((H - ly - 10 * S) / rh)
	if kl.sel < kl.top:
		kl.top = kl.sel
	if kl.sel >= kl.top + rows:
		kl.top = kl.sel - rows + 1
	for i in range(kl.top, min(kl.list.size(), kl.top + rows)):
		var c: String = kl.list[i]
		var k: Dictionary = Kraft.K[c]
		var r2 = Rect2(8 * S, ly, lw - 16 * S, rh - 2 * S)
		if i == kl.sel:
			ci.draw_rect(r2, Color(KD.SHU, 0.14))
		if kl.party.has(c):
			ci.draw_rect(r2, Color(KD.KIN, 0.9), false, 2)
		glyph(ci, c, Vector2(r2.position.x + 16 * S, r2.get_center().y), 22 * S, KD.SUMI)
		txt(ci, PF, r2.position.x + 36 * S, ly + 6 * S, String(k.en), 12 * S, KD.SUMI)
		var col2: Color = Kraft.FAM_COL.get(k.b, KD.SUMI)
		txt(ci, UF, r2.end.x - 6 * S, ly + 5 * S, Kraft.rad_of(c), 13 * S, col2, 2)
		txt(ci, UF, r2.end.x - 28 * S, ly + 8 * S, "%d" % k.lv.size(), 10 * S, Color(KD.SUMI, 0.45), 2)
		buttons.append([r2, kl_pick.bind(i)])
		ly += rh
	# ---- 右: 字の性能 ----
	var rx: float = W - rw
	ci.draw_rect(Rect2(rx, 0, rw, H), Color(KD.WASHI, 0.96))
	ci.draw_line(Vector2(rx, 0), Vector2(rx, H), Color(KD.SUMI, 0.3), 1)
	var y: float = _kl_card(ci, kl.cur, rx + 14 * S, 12 * S, rw - 28 * S, S)
	# いまの仲間
	y = max(y + 10 * S, H - 150 * S)
	txt(ci, UF, rx + 14 * S, y, "試している字（Enter 入れかえ／Tab 足す・4つまで）", 11 * S, Color(KD.SUMI, 0.6))
	y += 20 * S
	var px: float = rx + 14 * S
	for c in kl.party:
		var r3 = Rect2(px, y, 70 * S, 62 * S)
		ci.draw_rect(r3, Color(1, 1, 1, 0.7))
		ci.draw_rect(r3, Color(KD.KIN, 0.9), false, 2)
		glyph(ci, c, r3.get_center() - Vector2(0, 6 * S), 36 * S, KD.SUMI)
		var n: int = int(dmg_by.get("K:" + c, 0))
		txt(ci, UF, r3.get_center().x, r3.end.y - 16 * S, "傷 %d" % n, 10 * S, KD.SHU, 1)
		buttons.append([Rect2(r3.end.x - 18 * S, r3.position.y, 18 * S, 18 * S), kl_remove.bind(c)])
		txt(ci, UF, r3.end.x - 9 * S, r3.position.y + 1 * S, "×", 12 * S, Color(KD.SUMI, 0.6), 1)
		px += 76 * S
	y += 70 * S
	button(ci, Rect2(rx + 14 * S, y, 40 * S, 30 * S), "−", kl_lv.bind(-1), "ghost")
	txt(ci, UF, rx + 64 * S, y + 6 * S, "Lv %d（←→）" % kl.lv, 13 * S, KD.SUMI)
	button(ci, Rect2(rx + 160 * S, y, 40 * S, 30 * S), "＋", kl_lv.bind(1), "ghost")
	# ---- 下: 場面と、結果 ----
	var bx: float = lw + 12 * S
	var bw: float = rx - lw - 24 * S
	var by: float = H - 132 * S
	ci.draw_rect(Rect2(lw, by - 8 * S, rx - lw, H - by + 8 * S), Color(KD.WASHI, 0.9))
	var sw: float = bw / KL_SC.size()
	for i in KL_SC.size():
		var r4 = Rect2(bx + i * sw, by, sw - 6 * S, 34 * S)
		var on2: bool = int(kl.sc) == i
		ci.draw_rect(r4, KD.SUMI if on2 else Color(1, 1, 1, 0.7))
		ci.draw_rect(r4, KD.SUMI, false, 1.5)
		txt(ci, UF, r4.get_center().x, by + 8 * S, "%d %s" % [i + 1, KL_SC[i][0]], 13 * S, KD.WASHI if on2 else KD.SUMI, 1)
		buttons.append([r4, kl_set_sc.bind(i)])
	by += 42 * S
	var eat: int = kl_eaten()
	var kd: int = kills - int(kl.kills0)
	var st: String
	if int(kl.sc) == 4:
		st = "与えた傷 %d　毎秒 %.1f　崩した字 %d　主人公に触れた %d" % [eat, eat / max(0.5, kl.t), kd, kl.touch]
	elif kl.done >= 0:
		st = "全滅まで %.1f秒　与えた傷 %d　毎秒 %.1f　主人公に触れた %d" % [kl.done, eat, eat / max(0.5, kl.done), kl.touch]
	else:
		st = "%.1f秒　残り %d　与えた傷 %d　毎秒 %.1f　主人公に触れた %d" % [kl.t, movers() + int(kl.get("stream", 0)), eat, eat / max(0.5, kl.t), kl.touch]
	txt(ci, UF, bx, by, st, 15 * S, KD.SHU if kl.done >= 0 else KD.SUMI)
	txt(ci, UF, bx, by + 22 * S, KL_SC[kl.sc][1] + "　　Space もう一度　1〜5 場面　↑↓ 字を選ぶ　F4 合体の演出　Esc 戻る", 11 * S, Color(KD.SUMI, 0.6))
	var hy: float = by + 42 * S
	var hx: float = bx
	for h in kl.hist.slice(0, 3):
		txt(ci, UF, hx, hy, "%s %s %.1f秒 毎秒%.1f" % [h.who, h.sc, h.t, h.ps], 11 * S, Color(KD.SUMI, 0.7))
		hx += bw / 3.0

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

func _after_fuse(_res: String) -> void:
	# 合体は自動で続かない（作字台で自分で作る）
	pass

func _draw_fuse_fx(ci: CanvasItem) -> void:
	_draw_states(ci)
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
			if f.has("ps"):
				# 三つ・四つの部品: 輪になって回りながら寄り合う
				var ps: Array = f.ps
				for j in ps.size():
					var aj: float = an + TAU * j / ps.size()
					var qj: Vector2 = Vector2(ps[j][1]).lerp(c + Vector2(cos(aj), sin(aj) * 0.6) * rr, k)
					glyph(ci, ps[j][0], qj, sz, Kraft.col_of(ps[j][0]) if Kraft.RAD_COL.has(ps[j][0]) else KD.AI, Color(paper_col(), 0.9), 5)
			else:
				glyph(ci, f.a, qa, sz, KD.AI, Color(paper_col(), 0.9), 5)
				glyph(ci, f.b, qb, sz, KD.AI, Color(paper_col(), 0.9), 5)
		else:
			var u: float = clamp((t - 0.9) / 0.6, 0.0, 1.0)
			if t < 1.0:
				glow(ci, c, sz * 3, Color(KD.KIN, (1.0 - (t - 0.9) / 0.1) * 0.8))
			var sc: float = 1.6 - 0.6 * _ease(u)
			glow(ci, c, sz * 1.6, Color(KD.KIN, 0.4 * (1.0 - u * 0.5)))
			glyph(ci, f.res, c, sz * 1.2 * sc, Kraft.col_of(f.res) if f.has("ps") else KD.KIN, Color(KD.SUMI, 0.9), 6)
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
	lab_on = false
	kl_on = false
	devmap = false
	reset()
	kraft_clear()
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
	var list = typables().filter(func(t): return not t.get("dirm", false) and not ((t.get("ch", "") == "岩" or t.get("ch", "") == "氷") and not has_counter(t.ch)))
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
	if state == "craft":
		# 自動操作: 作れる字を一つ作って閉じる
		if craft.fx == null:
			var lst: Array = craft_list()
			if lst.size():
				var lr: Array = lst[lst.size() - 1]
				if lr.size() > 5:
					craft_make(lr[0], lr[5])
				else:
					_craft_pick(lr[1], lr[2])
			else:
				close_craft()
		elif craft.fx.t > 1.2:
			close_craft()
		return
	if state == "play" and not lab_on and time > 10.0 and tick("auto_craft", dt, 12.0) and craft_list().size():
		open_craft()
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
	if ev is InputEventKey and ev.pressed and not ev.echo:
		if ev.keycode == KEY_F5:
			reload_game()
			return
		if ev.keycode == KEY_F7:
			toggle_bgm()
			return
	if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
		for gb in global_btns:
			if gb[0].has_point(ev.position):
				gb[1].call()
				get_viewport().set_input_as_handled()
				return
	if state == "intro":
		if (ev is InputEventKey and ev.pressed) or (ev is InputEventMouseButton and ev.pressed):
			to_title()
		return
	if ev is InputEventKey and ev.pressed and kl_on and state == "play":
		kl_key(ev)
		get_viewport().set_input_as_handled()
		return
	if ev is InputEventKey and ev.pressed and state == "craft":
		if not ev.echo or ev.keycode in [KEY_LEFT, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_BACKSPACE]:
			craft_key(ev)
		get_viewport().set_input_as_handled()
		return
	if ev is InputEventKey and ev.pressed:
		var kc: int = ev.keycode
		if kc == KEY_TAB and state == "play" and not lab_on:
			open_craft()
			get_viewport().set_input_as_handled()
			return
		if kc == KEY_ENTER or kc == KEY_KP_ENTER:
			if state == "title":
				_watch() if watch_mode else start()
			elif state == "over":
				start()
			elif state == "paused":
				toggle_pause()
			return
		if kc == KEY_F2 and (state == "play" or state == "paused"):
			devmap = not devmap
			return
		if devmap and (kc == KEY_EQUAL or kc == KEY_KP_ADD):
			devmap_z = min(4.0, devmap_z * 1.25)
			return
		if devmap and (kc == KEY_MINUS or kc == KEY_KP_SUBTRACT):
			devmap_z = max(0.25, devmap_z / 1.25)
			return
		if lab_on and state == "play":
			if kc == KEY_TAB:
				lab_next(-1 if ev.shift_pressed else 1)
				get_viewport().set_input_as_handled()
				return
			if kc == KEY_SPACE:
				lab_toggle()
				get_viewport().set_input_as_handled()
				return
			if kc == KEY_F1:
				lab_switch()
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
		spr.visible = e.get("obj", "") != "kana" and not e.get("hidden", false)   # 檻の中のかな・姿を消した鬼は描かない
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
		# 弾き返した硬い字は、少しだけ震える（動かない）
		var wb: float = float(e.get("wob", 0.0))
		if wb > 0:
			e.wob = max(0.0, wb - 0.06)
			xf[0] += sin(time * 70.0) * 5.0 * SF * wb
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
	# 字の大きさは段に丸めて、余りは拡大で合わせる（大きさが毎フレーム変わる寄りの場面で、字を作り直し続けて重くなるのを防ぐ）
	var fs: float = _glyph_size(size)
	var k: float = size / fs
	ci.draw_set_transform_matrix(Oracle.BASE * Transform2D(rot, sc * k, 0.0, c))
	var w = tw(GF, ch, fs)
	var base = Vector2(-w / 2, fs * 0.36)
	if ow > 0:
		ci.draw_string_outline(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(fs), max(1, int(ow / k)), ocol)
	ci.draw_string(GF, base, ch, HORIZONTAL_ALIGNMENT_LEFT, -1, int(fs), col)
	ci.draw_set_transform_matrix(Oracle.BASE)

const GLYPH_SIZES = [8, 10, 12, 14, 16, 18, 20, 23, 26, 30, 34, 38, 44, 50, 56, 64, 72, 82, 94, 108, 124, 142, 164, 190, 220, 256, 300, 360]
func _glyph_size(size: float) -> float:
	if size <= 8.0:
		return max(1.0, round(size))
	for g in GLYPH_SIZES:
		if g >= size * 0.94:
			return float(g)
	return 360.0

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
	glyph_gimmicks.draw(self, ci)
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
	_draw_kraft(ci)
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
		if sz < 2.0:
			continue
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
		if e.get("hidden", false) or fogged(e):
			continue
		if e.get("rest", 0.0) > 0:
			if e.get("glyph_gate", false):
				continue
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
		# 命（HP）の棒: 札のすぐ下。タイピング以外の攻撃で減る
		if not objk and e.has("hp_max") and (not still or float(e.hp) < float(e.hp_max)):
			# 棒の長さは命の量＝敵の格（雑魚は短く、強敵は長い）。札や字とは関係ない
			var hk: float = clamp(float(e.hp) / max(1.0, float(e.hp_max)), 0.0, 1.0)
			var hw: float = min(260.0 * SF, (16.0 + float(e.hp_max) * 6.0) * max(0.85, SF))
			var hx: float = e.x - hw / 2
			var hy: float = y + bh + 2
			var hh: float = max(3.0, 3.5 * SF)
			ci.draw_rect(Rect2(hx, hy, hw, hh), Color(ink, 0.25 * la))
			var hit: float = clamp(1.0 - (time - float(e.get("hp_t", -9.0))) / 0.25, 0.0, 1.0)
			ci.draw_rect(Rect2(hx, hy, hw * hk, hh), Color(KD.SHU.lerp(Color(1, 0.95, 0.8), hit * 0.6), la))
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
	var playing = state == "play" or state == "paused" or state == "craft" or state == "levelup" or state == "choosing" or state == "dying"
	if playing:
		_draw_darkness(ci)
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
	ink_world.draw(self, ci)
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
	if oni != null and not oni.has("dead") and (abs(oni.x - cam.x) > W / 2 or abs(oni.y - cam.y) > H / 2):
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
	if kl_on and (state == "play" or state == "paused"):
		_draw_kl(ci)
	elif state != "over":
		_draw_hud(ci)
		_draw_notes(ci)
		if state == "play" and not lab_on:
			_draw_craft_btn(ci)
		if lab_on and (state == "play" or state == "paused"):
			_draw_lab(ci)
	if state == "levelup" or state == "choosing":
		_draw_fuse(ci)
	if state == "fusion":
		_draw_cine(ci)
	if state == "paused":
		_draw_pause(ci)
	if state == "craft":
		_draw_craft(ci)
	if state == "over":
		_draw_over(ci)
	if banner != null and state != "craft":
		_draw_banner(ci)
	if devmap and state != "title" and state != "intro":
		_draw_devmap(ci)
	_draw_global_btns(ci)

## どの場面からでも押せる: 再起動（F5）と音楽の入／切（F7）。左下の隅
var global_btns: Array = []
func _draw_global_btns(ci: CanvasItem) -> void:
	global_btns = []
	var y: float = H - 40
	var specs = [["↻ 再起動", reload_game, 92], ["♪ 音楽 " + ("入" if sfx.bgm_on else "切"), toggle_bgm, 104]]
	var x: float = 12
	for sp in specs:
		var r = Rect2(x, y, sp[2], 28)
		ci.draw_rect(r, Color(KD.WASHI, 0.75))
		ci.draw_rect(r, Color(KD.SUMI, 0.45), false, 1)
		txt(ci, UF, r.get_center().x, y + 6, sp[0], 12, Color(KD.SUMI, 0.85), 1)
		buttons.append([r, sp[1]])
		global_btns.append([r, sp[1]])
		x += sp[2] + 6

## ゲームを最初から読み直す（オープニングから）
func reload_game() -> void:
	save_meta()
	get_tree().reload_current_scene()

func toggle_bgm() -> void:
	sfx.bgm_on = not sfx.bgm_on
	meta.bgm = sfx.bgm_on
	save_meta()
	sfx._mix()

## ---- 開発用の全体マップ（F2）: 景の配置・いまの字・出る字の一覧 ----
func _draw_devmap(ci: CanvasItem) -> void:
	ci.draw_rect(Rect2(0, 0, W, H), Color(0.93, 0.91, 0.86, 1.0))
	var mw: float = W * 0.66
	var c0 = Vector2(mw / 2, H / 2)
	var span: float = 9.0 / devmap_z   # 見える区画の数（横）
	var sc: float = mw / (span * CHS())
	var center = Vector2(hero.x, hero.y)
	var to_s = func(p: Vector2) -> Vector2: return c0 + (p - center) * sc
	# 区画の格子
	var kx0 = floori((center.x - span * CHS() / 2) / CHS())
	var ky0 = floori((center.y - span * 0.6 * CHS()) / CHS())
	for kx in range(kx0, kx0 + int(span) + 2):
		var x: float = to_s.call(Vector2(kx * CHS(), 0)).x
		ci.draw_line(Vector2(x, 0), Vector2(x, H), Color(KD.SUMI, 0.12), 1)
	for ky in range(ky0, ky0 + int(span) + 2):
		var y: float = to_s.call(Vector2(0, ky * CHS())).y
		ci.draw_line(Vector2(0, y), Vector2(mw, y), Color(KD.SUMI, 0.12), 1)
	# 出発点
	var so: Vector2 = to_s.call(stage_origin)
	ci.draw_circle(so, 5, KD.SHU)
	txt(ci, UF, so.x + 8, so.y - 8, "出発点", 10, KD.SHU)
	# 川
	for r in RIVERS:
		var a: Vector2 = to_s.call(Vector2(r.x0, r.y - r.h / 2))
		var b: Vector2 = to_s.call(Vector2(r.x1, r.y + r.h / 2))
		ci.draw_rect(Rect2(a, b - a), Color(KD.AI, 0.35))
	# 景の配置（まだ置かれていないものも、予定として出す）
	var items: Array = map_items()
	for i in items.size():
		var it: Dictionary = items[i]
		var p: Vector2 = to_s.call(map_pos(it))
		var done: bool = map_done.has("%d:%d" % [stage_i(), i])
		var col: Color = KD.SHU if it.kind == "guard" else (KD.KIN if it.kind == "obj" else (KD.AI if it.kind == "river" else KD.SUMI))
		if it.kind == "river":
			var a2: Vector2 = to_s.call(stage_origin + Vector2(float(it.x), float(it.y)) * CHS())
			var b2: Vector2 = to_s.call(stage_origin + Vector2(float(it.x1), float(it.y)) * CHS())
			ci.draw_line(a2, b2, Color(KD.AI, 0.6), 6)
			txt(ci, UF, a2.x + 4, a2.y - 16, it.note, 10, KD.AI)
			continue
		ci.draw_circle(p, 14, Color(col, 0.18 if done else 0.35))
		ci.draw_arc(p, 14, 0, TAU, 24, Color(col, 0.9), 1.5, true)
		glyph(ci, String(it.get("ch", "岩")), p, 18, col)
		var ly: float = p.y + 20 if it.kind == "obj" else p.y - 7
		txt(ci, UF, p.x + (-10 if it.kind == "obj" else 16), ly, String(it.note) + ("" if done else "（未配置）"), 10, Color(KD.SUMI, 0.85))
	# いまいる字
	for e in E:
		if not e.alive:
			continue
		var pe: Vector2 = to_s.call(Vector2(e.x, e.y))
		if pe.x < 0 or pe.x > mw or pe.y < 0 or pe.y > H:
			continue
		if e.get("still", false):
			ci.draw_circle(pe, 2, Color(0.4, 0.5, 0.35, 0.6))
		else:
			ci.draw_circle(pe, 3, Color(KD.SHU, 0.8))
	# 主人公と画面の範囲
	var hp_s: Vector2 = to_s.call(center)
	ci.draw_rect(Rect2(hp_s - Vector2(W, H) * sc / 2, Vector2(W, H) * sc), Color(KD.SUMI, 0.6), false, 1.5)
	Oracle.draw(ci, form, hp_s, 20, KD.SHU, {"lw": 2.5})
	# 右の札: 景の情報と出る字
	var px: float = mw + 16
	ci.draw_rect(Rect2(mw, 0, W - mw, H), Color(KD.WASHI, 1))
	ci.draw_line(Vector2(mw, 0), Vector2(mw, H), KD.SUMI, 2)
	var st = KD.D.get("STAGES", [])
	var sd: Dictionary = st[stage_i()] if stage_i() < st.size() else {}
	var y: float = 14
	txt(ci, DF, px, y, "全体マップ（開発用）", 18, KD.SHU)
	y += 30
	txt(ci, UF, px, y, String(sd.get("title", "")) + "　時間 " + KD.fmt_t(time) + "　次の漢詩 " + (KD.fmt_t(next_boss) if next_boss < 1e8 else "—"), 12, KD.SUMI)
	y += 22
	y += wrap_text(ci, UF, px, y, String(sd.get("concept", "")), W - mw - 32, 11, Color(KD.SUMI, 0.8), 4) + 8
	txt(ci, UF, px, y, "波: 静10秒 → 増20秒 → 群7秒 → 凪7秒（くり返し）", 11, KD.SUMI)
	y += 20
	var pool: Array = []
	for c in sd.get("pool", []):
		if not pool.has(c):
			pool.append(c)
	var foes = pool.filter(func(c): return not counter_of(c).is_empty())
	var shooters = pool.filter(func(c): return SHOOTERS.has(c))
	txt(ci, UF, px, y, "出る字（%d）" % pool.size(), 12, KD.SHU)
	y += 18
	y += wrap_text(ci, GF, px, y, "".join(pool), W - mw - 32, 16, KD.SUMI, 6) + 6
	txt(ci, UF, px, y, "困った字と、解く仲間", 12, KD.SHU)
	y += 18
	for f in foes:
		var cc = counter_of(f)
		var dd: String = String(cc.d)
		txt(ci, UF, px, y, "%s → %s　%s" % [f, "・".join(cc.by), dd.substr(0, 24) + ("…" if dd.length() > 24 else "")], 10, KD.SUMI)
		y += 15
	y += 6
	txt(ci, UF, px, y, "持っている魂: " + "".join(souls.keys()), 10, Color(KD.SUMI, 0.8))
	y += 15
	txt(ci, UF, px, y, "仲間: " + "".join(owned.keys()), 10, Color(KD.SUMI, 0.8))
	y += 22
	txt(ci, UF, px, y, "凡例: 朱=待ち伏せの字　金=宝　墨=岩・群生　藍=川", 10, Color(KD.SUMI, 0.7))
	y += 15
	txt(ci, UF, px, y, "F2 で閉じる　＋／− で拡大・縮小　配置は data/game.json の MAPS", 10, Color(KD.SUMI, 0.7))

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
		var at = "自動戦闘中 — 作字台で仲間を育てます／F6 で手動に戻す"
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
	var ids: Array = KU.map(func(u): return u.ch)
	for id in owned.keys():
		if not ids.has(id):
			ids.append(id)
	ids = ids.slice(0, max(1, int(W * 0.48 / 48)))
	for id in ids:
		ax -= 42
		var r = Rect2(ax, H - 62, 40, 46)
		var inh = absorbed.has(id)
		ci.draw_rect(r, KD.SUMI if inh else Color(KD.YORU if nui else KD.WASHI, 0.85))
		ci.draw_rect(r, KD.KIN if inh else fg, false, 2)
		glyph(ci, id, r.get_center() + Vector2(0, -6), 22, KD.KIN if inh else fg)
		var crafted_lv: int = k_lv(id)
		txt(ci, UF, r.get_center().x, r.position.y + 32, ("Lv%d" % crafted_lv) if crafted_lv > 0 else (("継%d" % L(id)) if inh else "●".repeat(L(id))), 8, KD.SHU, 1)
		# この字が与えたダメージの合計（小さく）
		var dv: int = int(dmg_by.get("K:" + id, dmg_by.get(id, 0)))
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
	var lede = "原稿用紙の上で、すべての漢字が生き物になった。犬は駆け、蛇はうねり、火は揺らめき、木は風にしなる。字の下の英単語を打ち切ると、主人公がその字へ突っ込んで斬る。一撃ごとに字の部品がはがれて別の字になり（森→林→木）、最後の部品を崩すと消える。倒した字の魂を作字台（Tab）で組み合わせて仲間を作る（木＋木＝林、火＋戌＝烕）。部首の属性を受け継ぎ、ときどき字の意味が戦い方を変える。同じ字を重ねると技の姿も育つ。主人公はずっと象形文字のまま。ヒロインの「魚」は、やがて降りてくる巨大な漢詩に囚われている。"
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
	button(ci, Rect2(x0 + 176 * S, y + 52 * S, 170 * S, 36 * S), "効果の試験場", start_lab, "ghost")
	button(ci, Rect2(x0 + 356 * S, y + 52 * S, 150 * S, 36 * S), "全体マップ", _open_devmap, "ghost")
	button(ci, Rect2(x0 + 516 * S, y + 52 * S, 170 * S, 36 * S), "字の試験場", start_kl, "main")
	if watch_mode:
		var wt = "自動戦闘で観る — 主人公を選んで「始める」か Enter"
		var ww = tw(UF, wt, 13 * S) + 28 * S
		ci.draw_rect(Rect2(x0 + 368 * S, y + 10 * S, ww, 30 * S), KD.SHU)
		txt(ci, UF, x0 + 382 * S, y + 16 * S, wt, 13 * S, KD.WASHI)
	else:
		txt(ci, UF, x0 + 368 * S, y + 16 * S, "Enter で開始　｜　最高記録 " + (KD.fmt_t(meta.best) if float(meta.get("best", 0)) > 0 else "—"), 12 * S, KD.SUMI)
	y += 100 * S
	wrap_text(ci, UF, x0, y, "甲骨文字形: oracle-bone-jgw-1203 — Qing-sheng Li & Yu-lin Bian, github.com/aylqs2025/oracle-bone-jgw-1203, CC BY 4.0（線データを描画用に変形）。フォント: Zen Old Mincho / Zen Kaku Gothic New / Dela Gothic One / JetBrains Mono / Noto Serif（SIL OFL）。字の組み立て: CHISE IDS（cjkvi-ids）、英語の意味: KANJIDIC2（EDRDG, CC BY-SA 4.0）。プロトタイプ。", min(W - x0 * 2, 900 * S), 10 * S, Color(KD.SUMI, 0.6))

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
	for u in KU:
		if not ids.has(u.ch):
			ids.append(u.ch)
	if ids.is_empty():
		txt(ci, UF, r.get_center().x, r.position.y + 130 * S, "まだいない", 14 * S, Color(KD.SUMI, 0.5), 1)
		return
	var cols = 3
	var cw: float = (r.size.x - 24 * S) / cols
	for i in ids.size():
		var id: String = ids[i]
		var c = Vector2(r.position.x + 12 * S + cw * (i % cols + 0.5), r.position.y + 70 * S + int(i / cols) * 74 * S)
		var kl2: int = k_lv(id)
		glyph(ci, id, c, 48 * S, KD.KIN if kl2 > 0 else KD.AI, Color(KD.WASHI, 0.9), 3)
		txt(ci, UF, c.x, c.y + 26 * S, "●".repeat(max(L(id), kl2)), 8 * S, KD.SHU, 1)

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
	txt(ci, UF, x0 + 250 * S, y0 + 12 * S, "倒した字の魂を一つ選んで、仲間としてよみがえらせる — 英単語を打ち切る。朱の枠は自機の字・作字の素材", 13 * S, KD.SUMI)
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
			var badge = "自機の字" if p.t == "k" else "作字の素材"
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

# ---------- オープニング: 映画のカットシーン（奥行きのある舞台・被写界深度） ----------
## 舞台は三次元。x 右・y 上・z 奥（単位はおよそ人の背丈）。カメラは位置・向き（yaw/pitch）・焦点距離・ピント・絞りを持つ
## 物語: 山あいの村 → 地平に秦の軍勢 → 襲撃（子と魚がさらわれる）→ 人は殴り倒される
##        → 始皇帝（帝）が丞相の李・宦官の趙・将軍の蒙を従えて現れ、詔で村を焼く → 灰の中から人が立つ → 題字
const INTRO_LEN = 33.0
func start_intro() -> void:
	state = "intro"
	intro_t = 0.0
	intro_snd = {}

func _intro_sounds() -> void:
	var t: float = intro_t
	var cues = [[0.2, "koto"], [1.6, "koto"], [3.0, "koto"], [4.6, "koto"], [6.2, "koto"], [9.0, "warn"], [9.6, "boom"],
		[13.2, "slash"], [13.6, "slash"], [14.0, "slash"], [14.5, "slash"], [15.4, "brush"], [16.9, "dash"], [17.3, "hurt"], [17.6, "boom"],
		[18.4, "gong"], [21.6, "gong"], [22.4, "brush"], [23.2, "boom"], [26.6, "brush"], [28.4, "warn"], [29.4, "fuse"], [30.6, "dash"], [31.1, "stamp"]]
	for i in cues.size():
		if t >= cues[i][0] and not intro_snd.has(i):
			intro_snd[i] = true
			if cues[i][1] == "koto":
				sfx.koto(i * 2)
			else:
				sfx.play(cues[i][1], -4)
	# 行進の太鼓
	if t > 10.4 and t < 13.0:
		var b: int = int((t - 10.4) / 0.42)
		if not intro_snd.has("b%d" % b):
			intro_snd["b%d" % b] = true
			sfx.play("taiko", -10 if b % 2 else -5, 1.0 if b % 2 else 0.85)
	# 帝の前の太鼓（ゆっくり重く）
	if t > 18.6 and t < 23.4:
		var b2: int = int((t - 18.6) / 0.8)
		if not intro_snd.has("k%d" % b2):
			intro_snd["k%d" % b2] = true
			sfx.play("taiko", -6, 0.7)

func _ih(x: float) -> float:
	return sin(clamp(x, 0.0, 1.0) * PI)

func _ss(a: float, b: float, x: float) -> float:
	return _ease(clamp((x - a) / max(0.001, b - a), 0.0, 1.0))

# ---- カメラ ----
var icam = {"p": Vector3.ZERO, "yaw": 0.0, "pitch": 0.0, "f": 1.0, "focus": 10.0, "ap": 0.0, "roll": 0.0}

## カット: [始, 終, 始のカメラ, 終のカメラ]。カメラ = [位置, yaw, pitch, 焦点距離, ピントの距離, 絞り]
const SHOTS = [
	[0.0, 4.2, [Vector3(0, 3.4, -1.5), 0.0, -0.3, 1.0, 10.0, 0.2], [Vector3(0.3, 1.5, 2.2), 0.0, -0.08, 1.1, 7.0, 0.4]],        # 俯瞰から村へ降りる
	[4.2, 7.0, [Vector3(-2.1, 0.8, 5.0), 0.5, -0.04, 1.6, 3.4, 1.6], [Vector3(-2.0, 0.8, 5.15), 0.48, -0.04, 1.65, 3.3, 1.6]],   # 人ごしに池の魚
	[7.0, 9.0, [Vector3(2.6, 0.35, 6.6), -0.45, 0.04, 1.7, 2.7, 1.6], [Vector3(2.4, 0.35, 6.9), -0.42, 0.04, 1.75, 2.7, 1.6]],      # 子と犬と女（低い位置）
	[9.0, 10.6, [Vector3(-1.3, 0.8, 5.6), 0.15, 0.0, 2.4, 1.45, 2.4], [Vector3(-1.3, 0.8, 5.65), 0.1, 0.03, 2.5, 40.0, 2.4]],  # 人の顔 → 地平へピント送り
	[10.6, 13.0, [Vector3(3.8, 0.3, 10.4), -0.12, 0.1, 1.3, 14.0, 1.0], [Vector3(3.6, 0.3, 10.7), -0.12, 0.08, 1.35, 5.0, 1.0]],      # 迫る軍勢（あおり）
	[13.0, 14.6, [Vector3(4.5, 1.6, 4.0), -0.42, -0.08, 1.1, 7.0, 0.3], [Vector3(3.8, 1.5, 4.6), -0.38, -0.08, 1.15, 6.5, 0.3]],    # 襲撃
	[14.6, 15.6, [Vector3(1.7, 0.6, 7.4), -0.3, 0.0, 2.0, 2.4, 2.0], [Vector3(1.65, 0.6, 7.5), -0.3, 0.0, 2.1, 2.3, 2.0]],         # 女が子をかばう
	[15.6, 16.8, [Vector3(0.0, 1.4, 4.5), 0.05, -0.08, 1.4, 5.0, 1.0], [Vector3(0.2, 1.6, 4.8), 0.05, -0.1, 1.5, 5.0, 1.0]],       # 網が落ちる
	[16.8, 17.7, [Vector3(-0.2, 0.5, 2.4), 0.0, 0.02, 1.1, 5.0, 0.6], [Vector3(-0.2, 0.5, 2.2), 0.0, 0.02, 1.1, 2.0, 0.6]],        # 人が飛び込み、殴り飛ばされる
	[17.7, 18.1, null, null],                                                                                                    # 暗転
	[18.1, 21.6, [Vector3(-0.6, 0.3, 2.3), 0.08, 0.07, 1.25, 17.0, 2.2], [Vector3(-0.6, 0.3, 2.4), 0.08, 0.07, 1.3, 17.0, 2.2]],    # 倒れた人ごしに、帝の到来（手前はボケる）
	[21.6, 23.6, [Vector3(0.9, 0.6, 15.6), -0.12, 0.2, 2.2, 5.0, 1.6], [Vector3(0.8, 0.55, 16.0), -0.12, 0.22, 2.4, 4.6, 1.6]],     # 帝のあおり。李が詔を読む
	[23.6, 25.2, [Vector3(0.6, 2.6, 23.5), PI, -0.22, 1.3, 9.0, 1.0], [Vector3(0.5, 2.5, 24.0), PI, -0.22, 1.35, 9.0, 1.0]],         # 帝の背ごしに、燃える村
	[25.2, 26.5, [Vector3(1.7, 1.3, 9.4), 0.2, 0.0, 2.2, 3.0, 2.4], [Vector3(1.7, 1.3, 9.6), 0.2, 0.0, 2.2, 3.0, 2.4]],          # 網の中で振り返る魚
	[26.5, 29.4, [Vector3(-1.9, 0.25, 0.9), 0.2, 0.03, 2.0, 0.6, 2.6], [Vector3(-1.9, 0.3, 1.1), 0.2, 0.02, 2.2, 2.6, 2.6]],      # 灰の中から（火の粉 → 人へピント送り）
	[29.4, 31.0, [Vector3(-1.6, 0.25, 0.0), 0.08, 0.12, 1.3, 3.3, 1.2], [Vector3(-1.6, 0.25, 1.2), 0.08, 0.1, 1.3, 2.4, 1.2]],      # 覚醒（あおり）
	[31.0, 33.0, null, null],                                                                                                    # 題字
]

func _shot_of(t: float) -> Array:
	for s in SHOTS:
		if t < s[1]:
			return s
	return SHOTS[-1]

func _set_cam(t: float) -> Array:
	var s: Array = _shot_of(t)
	if s[2] == null:
		return s
	var k: float = clamp((t - s[0]) / (s[1] - s[0]), 0.0, 1.0)
	var e: float = _ease(k)
	var a: Array = s[2]
	var b: Array = s[3]
	icam.p = Vector3(a[0]).lerp(b[0], e)
	icam.yaw = lerp(float(a[1]), float(b[1]), e)
	icam.pitch = lerp(float(a[2]), float(b[2]), e)
	icam.f = lerp(float(a[3]), float(b[3]), e)
	# ピント送りは後半で一気に（映画のフォーカス・プル）
	icam.focus = lerp(float(a[4]), float(b[4]), _ss(0.25, 0.75, k))
	icam.ap = lerp(float(a[5]), float(b[5]), e)
	# 手持ちのゆれ
	icam.p += Vector3(sin(t * 1.3) * 0.02, sin(t * 1.7) * 0.015, 0)
	icam.roll = sin(t * 0.9) * 0.01
	return s

## 舞台の点を画面へ: [画面の位置, 1単位の画面の大きさ, 奥行き]
func _pj(p: Vector3) -> Array:
	var d: Vector3 = p - icam.p
	var cy: float = cos(-icam.yaw)
	var sy: float = sin(-icam.yaw)
	d = Vector3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy)
	var cp: float = cos(icam.pitch)
	var sp: float = sin(icam.pitch)
	d = Vector3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp)
	if d.z < 0.15:
		return [Vector2(-9999, -9999), 0.0, d.z]
	var s: float = icam.f * H * 0.62 / d.z
	var v: Vector2 = Vector2(d.x, -d.y) * s
	v = v.rotated(icam.roll)
	return [Vector2(W / 2, H * 0.5) + v, s, d.z]

## ボケの大きさ（画素）: ピントから外れるほど大きい
func _coc(z: float) -> float:
	return clamp(abs(1.0 / z - 1.0 / icam.focus) * icam.ap * icam.f * H * 0.03, 0.0, 26.0)

# ---- 描く物の一覧（奥から順に描く） ----
var _ids: Array = []
## 字を一つ置く: kind = "o"（甲骨文）か "g"（漢字）。h は背丈（単位）
func _iq(kind: String, ch: String, p: Vector3, h: float, col: Color, o := {}) -> void:
	_ids.append({"k": kind, "ch": ch, "p": p, "h": h, "col": col, "o": o})

func _ifx(fn: Callable, p: Vector3) -> void:
	_ids.append({"k": "fx", "fn": fn, "p": p})

func _flush_iq(ci, fog: Color) -> void:
	var items: Array = []
	for it in _ids:
		var pr: Array = _pj(it.p)
		if pr[1] <= 0:
			continue
		it.sp = pr[0]
		it.sc = pr[1]
		it.z = pr[2]
		items.append(it)
	items.sort_custom(func(a, b): return a.z > b.z)
	if ci == null:
		_dof_assign(items, fog)
		return
	for it in items:
		if it.k == "fx":
			it.fn.call(ci, it.sp, it.sc, it.z)
			continue
		var sz: float = it.h * it.sc
		if sz < 2 or sz > H * 6:
			continue
		# 遠いほど霞む（空気遠近法）
		var haze: float = clamp((it.z - 8.0) / 40.0, 0.0, 0.75)
		var col: Color = it.col.lerp(Color(fog, it.col.a), haze)
		var coc: float = _coc(it.z)
		var pos: Vector2 = it.sp + Vector2(0, -sz * 0.5)
		if coc < 1.2:
			_iq_draw(ci, it, pos, sz, col)
		else:
			# ボケ: 円形にずらして薄く重ねる
			var n: int = 8
			var c2: Color = Color(col, col.a * 0.24)
			for j in n:
				_iq_draw(ci, it, pos + Vector2.from_angle(TAU * j / n) * coc, sz, c2, true)
			_iq_draw(ci, it, pos, sz, Color(col, col.a * 0.18), true)

## ---- 被写界深度: 舞台を奥行きの層に分けて別々に描き、層ごとにぼかして重ねる ----
## 字は線で描くので、線をずらして重ねる方式ではボケにならない。描いた絵そのものをぼかす
## 層の解像度: ピントの層は等倍、ボケる層は小さく描く（ぼかすので粗さは見えず、重さも減る）
const DOF_RES_L = [0.5, 0.25, 0.5, 1.0, 0.5, 0.25]
const DOF_N = 6   # 0: 空と山 / 1: 奥の大きなボケ / 2: 奥の小さなボケ / 3: ピント / 4: 手前の小さなボケ / 5: 手前の大きなボケ
var dof_vps: Array = []
var intro_hold := -1.0
var dof_layers: Array = []
var dof_rects: Array = []
var dof_cl: CanvasLayer
var dof_items: Array = [[], [], [], [], [], []]
var dof_r: Array = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

func _setup_dof() -> void:
	dof_cl = CanvasLayer.new()
	dof_cl.layer = 4
	dof_cl.visible = false
	add_child(dof_cl)
	var sh = load("res://shaders/dof.gdshader")
	for i in DOF_N:
		var vp = SubViewport.new()
		vp.transparent_bg = true
		vp.size = Vector2i(max(64, int(W * DOF_RES_L[i])), max(64, int(H * DOF_RES_L[i])))
		vp.render_target_update_mode = SubViewport.UPDATE_DISABLED
		add_child(vp)
		var l = DrawLayer.new()
		l.scale = Vector2(DOF_RES_L[i], DOF_RES_L[i])
		l.fn = _draw_dof_layer.bind(i)
		vp.add_child(l)
		var tr = TextureRect.new()
		tr.texture = vp.get_texture()
		tr.set_anchors_preset(Control.PRESET_FULL_RECT)
		tr.mouse_filter = Control.MOUSE_FILTER_IGNORE
		var m = ShaderMaterial.new()
		m.shader = sh
		tr.material = m
		dof_cl.add_child(tr)
		dof_vps.append(vp)
		dof_layers.append(l)
		dof_rects.append(tr)

func _tick_dof() -> void:
	if dof_layers.is_empty():
		return
	var on: bool = state == "intro"
	if on:
		var s: Array = _set_cam(intro_t)
		on = s[2] != null
	dof_cl.visible = on
	if not on:
		for i in DOF_N:
			dof_vps[i].render_target_update_mode = SubViewport.UPDATE_DISABLED
		return
	for i in DOF_N:
		var sz = Vector2i(max(64, int(W * DOF_RES_L[i])), max(64, int(H * DOF_RES_L[i])))
		if dof_vps[i].size != sz:
			dof_vps[i].size = sz
	# 舞台の字を並べて、層に振り分ける。空の層は描かない
	_draw_intro_world(null, intro_t)
	for i in DOF_N:
		var used: bool = i == 0 or not dof_items[i].is_empty()
		dof_vps[i].render_target_update_mode = SubViewport.UPDATE_ALWAYS if used else SubViewport.UPDATE_DISABLED
		dof_rects[i].visible = used
		dof_rects[i].material.set_shader_parameter("radius", dof_r[i] * DOF_RES_L[i])
		if used:
			dof_layers[i].queue_redraw()

## 字を層へ。ピントからの外れ（ボケの大きさ）で分け、層のボケはその平均
func _dof_assign(items: Array, fog: Color) -> void:
	for i in DOF_N:
		dof_items[i] = []
	var sums = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
	for it in items:
		var coc: float = _coc(it.z) * 1.3
		var near: bool = it.z < icam.focus
		var b: int = 3
		if coc >= 1.5:
			if near:
				b = 5 if coc >= 9.0 else 4
			else:
				b = 1 if coc >= 9.0 else 2
		it.fog = fog
		dof_items[b].append(it)
		sums[b] += coc
	for i in range(1, DOF_N):
		dof_r[i] = 0.0 if i == 3 or dof_items[i].is_empty() else min(40.0, sums[i] / dof_items[i].size())
	# 空と山は、いちばん遠い所のボケ
	dof_r[0] = min(30.0, _coc(80.0) * 1.3)

func _draw_dof_layer(ci: CanvasItem, i: int) -> void:
	if state != "intro":
		return
	if i == 0:
		_intro_bg(ci, intro_t)
		return
	for it in dof_items[i]:
		if it.k == "fx":
			it.fn.call(ci, it.sp, it.sc, it.z)
			continue
		var sz: float = it.h * it.sc
		if sz < 2 or sz > H * 3.5:
			continue
		var haze: float = clamp((it.z - 8.0) / 40.0, 0.0, 0.75)
		var col: Color = it.col.lerp(Color(it.fog, it.col.a), haze)
		# 線の字は半透明にしない（線の重なりが濃く浮くため）。薄さは霞の色へ寄せて出す
		if it.k == "o" and col.a < 1.0:
			col = Color(it.fog, 1.0).lerp(Color(col, 1.0), col.a)
		_iq_draw(ci, it, it.sp + Vector2(0, -sz * 0.5), sz, col)

func _iq_draw(ci: CanvasItem, it: Dictionary, pos: Vector2, sz: float, col: Color, soft := false) -> void:
	var o: Dictionary = it.o
	if it.k == "o":
		var oo = {"lw": 1.6, "rot": o.get("rot", 0.0), "sx": o.get("sx", 1.0), "sy": o.get("sy", 1.0), "wob": 0.25, "t": intro_t * 2}
		if o.has("glow") and not soft:
			oo["glow"] = o.glow
		Oracle.draw(ci, it.ch, pos, sz, col, oo)
	else:
		var oc: Color = o.get("oc", Color.TRANSPARENT)
		glyph(ci, it.ch, pos + Vector2(0, sz * 0.05), sz, col, Color(oc, oc.a * (0.3 if soft else 1.0)), 0.0 if soft else o.get("ow", 0.0) * sz / 60.0, o.get("rot", 0.0), Vector2(o.get("sx", 1.0), o.get("sy", 1.0)))

# ---- 舞台 ----
const I_ARMY = "兵戈矛兵刃鬼兵戈殺兵矛賊兵刀戈兵斬兵鬼矛兵戈兵刃"
func _draw_intro(ci: CanvasItem) -> void:
	var t: float = intro_t
	var s: Array = _set_cam(t)
	if s[2] == null or dof_layers.is_empty():
		ci.draw_rect(Rect2(0, 0, W, H), Color.BLACK)
		if s[2] != null:
			_draw_intro_world(ci, t)
	else:
		# 舞台は奥行きの層ごとに描いてぼかす（_tick_dof）。ここは夜の帳だけ
		var night0: float = _ss(9.0, 10.4, t)
		if night0 > 0:
			ci.draw_rect(Rect2(0, 0, W, H), Color(0.04, 0.02, 0.03, 0.18 * night0))
	# カットの頭の呼吸
	var since: float = t - float(s[0])
	if since < 0.07 and float(s[0]) > 0:
		ci.draw_rect(Rect2(0, 0, W, H), Color(0, 0, 0, 1.0 - since / 0.07))
	# 打撃の閃光
	if t > 17.3 and t < 17.38:
		ci.draw_rect(Rect2(0, 0, W, H), Color(KD.WASHI, 0.7))
	# 黒帯（シネマスコープ）
	var bar: float = H * 0.12
	ci.draw_rect(Rect2(0, 0, W, bar), Color.BLACK)
	ci.draw_rect(Rect2(0, H - bar, W, bar), Color.BLACK)
	# 人物の名（帝と部下が出た時だけ、小さく）
	if t > 21.8 and t < 23.5:
		var na: float = _ss(21.8, 22.2, t) * (1.0 - _ss(23.1, 23.5, t))
		txt(ci, UF, W * 0.07, H - bar * 0.8, "始皇帝 ─ 帝", 14, Color(KD.KIN, na))
		txt(ci, UF, W * 0.07, H - bar * 0.45, "丞相 李　宦官 趙　将軍 蒙", 12, Color(KD.WASHI, 0.7 * na))
	# 題字
	if t > 31.0:
		var ta2: float = clamp((t - 31.0) / 0.15, 0.0, 1.0)
		var tsz = 56.0 * (1.0 + (1.0 - ta2) * 0.6)
		var ty0 = H * 0.44
		ci.draw_rect(Rect2(W / 2 - tsz * 2.6, ty0, tsz * 1.1, tsz * 1.1), Color(KD.WASHI, ta2))
		txt(ci, DF, W / 2 - tsz * 2.05, ty0, "漢", tsz * 0.9, Color(KD.SUMI, ta2), 1)
		ci.draw_rect(Rect2(W / 2 - tsz * 1.4, ty0, tsz * 1.1, tsz * 1.1), Color(KD.SHU, ta2))
		txt(ci, DF, W / 2 - tsz * 0.85, ty0, "字", tsz * 0.9, Color(KD.WASHI, ta2), 1)
		txt(ci, DF, W / 2 - tsz * 0.15, ty0, "SURVIVOR", tsz * 0.9, Color(KD.WASHI, ta2))
	txt(ci, UF, W - 20, H - bar * 0.62, "キーかクリックで飛ばす", 12, Color(KD.WASHI, 0.35), 2)

## 村・軍勢・帝。時刻 t で全員の位置を決めて並べる
func _draw_intro_world(ci, t: float) -> void:
	_ids.clear()
	var night: float = _ss(9.0, 10.4, t)
	var burn: float = _ss(13.2, 15.5, t) * (1.0 - _ss(30.0, 31.0, t))
	var sky: Color = Color(0.93, 0.91, 0.86).lerp(Color(0.10, 0.07, 0.07), night)
	var fog: Color = sky.lerp(Color(0.75, 0.25, 0.12), burn * 0.6)
	var ink: Color = KD.SUMI.lerp(Color(0.9, 0.86, 0.8), night * 0.85)
	if ci != null:
		_intro_bg(ci, t)
	_draw_intro_people(t, ink, night, burn)
	_flush_iq(ci, fog)
	# 夜の帳
	if night > 0 and ci != null:
		ci.draw_rect(Rect2(0, 0, W, H), Color(0.04, 0.02, 0.03, 0.18 * night))

## 空・遠い山・地面（いちばん奥の層）
func _intro_bg(ci: CanvasItem, t: float) -> void:
	var night: float = _ss(9.0, 10.4, t)
	var burn: float = _ss(13.2, 15.5, t) * (1.0 - _ss(30.0, 31.0, t))
	var sky: Color = Color(0.93, 0.91, 0.86).lerp(Color(0.10, 0.07, 0.07), night)
	var ink: Color = KD.SUMI.lerp(Color(0.9, 0.86, 0.8), night * 0.85)
	# 空と地面（地平はカメラの向きで上下する）
	ci.draw_rect(Rect2(0, 0, W, H), sky)
	var hz: Array = _pj(icam.p + Vector3(sin(icam.yaw) * 1000.0, 0.0, cos(icam.yaw) * 1000.0) * Vector3(1, 0, 1) + Vector3(0, -icam.p.y, 0))
	var hy: float = clamp(hz[0].y if hz[1] > 0 else H * 0.5, -H, H * 2)
	# 遠い山（水墨画）を地平に。カメラの向きでゆっくり流れる
	var home = art("scene_far")
	var mw: float = W * 1.6
	var mh: float = mw * home.get_height() / home.get_width()
	var mx: float = W / 2 - mw / 2 - icam.yaw * W * 0.5 - icam.p.x * 4.0
	ci.draw_texture_rect(home, Rect2(mx, hy - mh * 0.62, mw, mh), false, Color(ink, 0.6 * (1.0 - night * 0.4)))
	# 夕焼け・火の照り返し
	glow(ci, Vector2(W * 0.5, hy), W * 0.8, Color(0.85, 0.3, 0.12, 0.35 * burn))
	# 地面
	var gcol: Color = sky.lerp(KD.SUMI, 0.08 + night * 0.1)
	ci.draw_rect(Rect2(0, hy, W, H * 3), gcol)
	# 地面の筋（奥へ集まる）: 奥行きを見せる
	for zz in [2.0, 3.0, 4.5, 6.5, 9.0, 13.0, 18.0, 26.0, 38.0]:
		var a0: Array = _pj(Vector3(-30, 0, zz))
		var b0: Array = _pj(Vector3(30, 0, zz))
		if a0[1] > 0 and b0[1] > 0:
			ci.draw_line(a0[0], b0[0], Color(ink, 0.05 + 0.08 / (1.0 + zz * 0.1)), 1.5)

## 象形文字の色（字ごとに変える。夜は明るく寄せて闇に沈まないように）
const OC_COL = {"門": Color(0.36, 0.34, 0.44), "木": Color(0.20, 0.44, 0.24), "牛": Color(0.52, 0.30, 0.15), "羊": Color(0.44, 0.50, 0.26),
	"犬": Color(0.74, 0.50, 0.10), "女": Color(0.60, 0.22, 0.46), "子": Color(0.08, 0.50, 0.56), "魚": Color(0.14, 0.32, 0.66)}
func _oc(ch: String, night: float, a := 1.0) -> Color:
	var c: Color = OC_COL.get(ch, KD.SUMI)
	return Color(c.lerp(Color(1, 0.97, 0.9), 0.42 * night), a)

## 村・軍勢・帝・人（字を並べるだけ。描くのは層ごと）
func _draw_intro_people(t: float, ink: Color, night: float, burn: float) -> void:
	# ---- 村 ----
	var peace: float = 1.0 - _ss(9.0, 9.6, t)
	# 家（宀）と木: 奥と手前に散らして、層を作る
	for hpos in [Vector3(-5.5, 0, 16), Vector3(4.8, 0, 14), Vector3(-2.8, 0, 22), Vector3(7.5, 0, 24), Vector3(1.5, 0, 28)]:
		_iq("o", "門", hpos, 2.2, _oc("門", night, 0.85))
		if burn > 0:
			_ifx(_fx_fire.bind(burn, hpos.x), hpos + Vector3(0, 0.1, -0.1))
	for tp in [Vector3(-7, 0, 11), Vector3(-4.2, 0, 9.5), Vector3(6.5, 0, 10), Vector3(9, 0, 18), Vector3(-9, 0, 20), Vector3(3.2, 0, 19)]:
		_iq("o", "木", tp, 2.0 + fmod(tp.x * 7, 1.0), _oc("木", night, 0.85), {"rot": sin(t * 0.6 + tp.x) * 0.03})
	# 手前の草（大きくボケる前景）
	for gp in [Vector3(-1.4, 0, 1.4), Vector3(1.9, 0, 1.8), Vector3(-3.2, 0, 2.6), Vector3(0.4, 0, 2.2)]:
		_iq("o", "木", gp, 0.9, _oc("木", night, 0.7), {"rot": sin(t * 1.4 + gp.x) * 0.08, "sy": 0.7})
	# 池と魚
	var pond: Vector3 = Vector3(0.6, 0, 7.6)
	_ifx(_fx_pond.bind(night), pond)
	var fishp: Vector3 = pond + Vector3(0, 0.1, 0)
	var frot: float = 0.0
	var fnet: float = _ss(16.0, 16.4, t)
	if t < 16.0:
		# 池の中をゆっくり泳ぎ、ときどき小さく水面を跳ねる（向きは変えない）
		var sw: float = sin(t * 0.9)
		fishp += Vector3(sw * 0.45, 0.04 * sin(t * 2.3), 0.12 * cos(t * 0.9))
		frot = cos(t * 0.9) * 0.08
		var jf: float = fposmod(t / 3.6, 1.0)
		if t < 9.0 and jf < 0.22:
			var k2: float = jf / 0.22
			fishp += Vector3(0, _ih(k2) * 0.35, 0)
			frot += (k2 - 0.5) * 0.4
	# 子・犬・女
	var kid: Vector3 = Vector3(1.4 + sin(t * 1.4) * 0.6 * peace, 0, 9.0)
	kid.y += abs(sin(t * 9.0)) * 0.18 * peace
	var dog: Vector3 = Vector3(kid.x + 0.7 * (1.0 if cos(t * 1.4) > 0 else -0.3), abs(sin(t * 10.0)) * 0.15, 9.2)
	var wom: Vector3 = Vector3(0.9, 0, 9.8)
	var hide: float = _ss(9.4, 10.0, t)
	kid = kid.lerp(wom + Vector3(-0.35, 0, 0.3), hide)
	# 人（主人公）
	var hero3: Vector3 = Vector3(-0.8, 0, 7.0)
	var hrot: float = 0.0
	var hcol: Color = ink
	var hglow: float = 0.0
	var hh: float = 1.0
	if t < 9.0:
		var jf2: float = fposmod(t / 1.8, 1.0)
		hrot = 0.12 * _ih(jf2 / 0.45) if jf2 < 0.45 else 0.0
	elif t < 16.8:
		hrot = 0.1
		hero3 += Vector3(randf_range(-1, 1), 0, 0) * 0.01 * _ss(9.2, 9.5, t)
	elif t < 17.3:
		# 飛び込む
		hero3 = hero3.lerp(Vector3(0.4, 0.2, 8.6), _ss(16.8, 17.3, t))
		hrot = 0.4
	else:
		# 殴り飛ばされ、手前に落ちて伏す
		var kk: float = _ss(17.3, 17.75, t)
		hero3 = Vector3(0.4, 0.2, 8.6).lerp(Vector3(-1.2, 0, 3.6), kk) + Vector3(0, _ih(kk) * 1.4, 0)
		hrot = -kk * 6.8 if kk < 1 else -1.5
		if t > 26.5:
			# 灰の中から: ぴくりと動き、這い、くずおれ、立つ
			var push: float = _ss(27.2, 28.0, t)
			var slip: float = _ih(clamp((t - 28.0) / 0.4, 0.0, 1.0)) * 0.35
			var stand: float = _ss(28.4, 29.2, t)
			hrot = -1.5 + push * 0.85 + stand * 0.65 - slip
			var ire: float = _ss(28.6, 29.4, t)
			hcol = ink.lerp(KD.SHU, ire)
			hglow = ire
			var awk: float = _ss(29.6, 30.3, t)
			hh = 1.0 + awk * 0.5
			var go: float = _ss(30.6, 31.0, t)
			hero3 += Vector3(0, 0, go * 9.0)
	# 帝の一行と軍勢
	var army_in: float = _ss(9.6, 10.4, t)
	var adv: float = _ss(10.4, 13.2, t)
	var leave: float = _ss(25.0, 28.0, t)
	var nr: int = 6
	var nc: int = 8
	var army: Array = []
	for r in nr:
		for c in nc:
			var i: int = r * nc + c
			var ch: String = I_ARMY[i % I_ARMY.length()]
			# 群れは隊列にしない: 一人ずつ散らばって、ばらばらの速さで駆けてくる
			var h1: float = fposmod(sin(i * 12.9898) * 43758.5453, 1.0)
			var h2: float = fposmod(sin(i * 78.233) * 12345.678, 1.0)
			var h3: float = fposmod(sin(i * 39.425) * 24634.633, 1.0)
			var x: float = (h1 - 0.5) * 13.0 + (c - (nc - 1) * 0.5) * 0.35
			var z0: float = 40.0 + h2 * 22.0
			var z1: float = 8.5 + h3 * 16.0 + r * 0.4
			# 足の速い者が先に来る（一人ずつ着く時刻がずれる）
			var go0: float = 9.8 + h2 * 1.6
			var go1: float = go0 + 1.6 + h3 * 1.6
			var run: float = _ss(go0, go1, t)
			var z: float = lerp(z0, z1, run)
			# 駆けながら左右に揺れる
			x += sin(t * (2.0 + h1 * 2.0) + i) * 0.35 * (1.0 - abs(run - 0.5) * 2.0 + 0.2) * (1.0 if run < 1.0 else 0.2)
			var y: float = 0.0
			if run > 0.0 and run < 1.0:
				y = abs(sin(t * (6.0 + h3 * 3.0) + i)) * 0.18
			elif t > 10.4 and t < 13.2:
				y = abs(sin((t - 10.4) / 0.42 * PI + h1)) * 0.06
			# 帝の道をあけて、左右に分かれてひれ伏す
			var part: float = _ss(18.3, 19.4, t)
			var side: float = -1.0 if x < 0 else 1.0
			x += side * part * 1.6
			var bow: float = _ss(19.6 + h1 * 0.6, 20.1 + h1 * 0.6, t) * (1.0 - _ss(23.6, 24.0, t))
			# 去る（奥へ）
			z += leave * 30.0
			army.append([ch, Vector3(x, y, z), bow])
			if army_in > 0:
				var lean: float = (0.12 + h1 * 0.1) * (1.0 if run > 0.0 and run < 1.0 else 0.0)
				_iq("g", ch, Vector3(x, y, z), 0.9 + h3 * 0.35, Color(0.62, 0.13, 0.07, army_in), {"oc": Color(0.02, 0.01, 0.01, 0.9), "ow": 4.0, "sy": 1.0 - bow * 0.35, "rot": bow * 0.3 - lean})
	# 旗（秦）
	if army_in > 0:
		for fx in [-3.2, 0.0, 3.2]:
			var fz: float = lerp(44.0, 10.6, adv) + leave * 30.0
			_ifx(_fx_banner.bind(army_in, t), Vector3(fx, 0, fz))
	# 帝（始皇帝）: 軍勢の後ろから、車の上に立って現れる。大きすぎず、高みから見下ろす
	var emp_in: float = _ss(18.4, 19.6, t)
	var ez: float = lerp(30.0, 20.0, _ss(18.4, 21.0, t)) + leave * 26.0
	var emp: Vector3 = Vector3(0, 0.55, ez)
	if emp_in > 0:
		_ifx(_fx_chariot.bind(emp_in), Vector3(0, 0, ez))
		_ifx(_fx_aura.bind(emp_in), emp + Vector3(0, 0.6, 0.05))
		_iq("g", "帝", emp, 1.35, Color(0.92, 0.72, 0.22, emp_in), {"oc": Color(0.1, 0.05, 0.02, 0.95), "ow": 5.0, "rot": -0.05 * _ss(22.6, 23.0, t)})
		# 部下: 丞相の李（詔を読む）・宦官の趙（帝に寄り添う）・将軍の蒙（戈を持つ）
		var li: Vector3 = Vector3(-1.1, 0, ez - 0.6)
		var zhao: Vector3 = Vector3(1.0, 0, ez - 0.3)
		var meng: Vector3 = Vector3(-2.3, 0, ez - 1.6)
		var lbow: float = _ss(19.8, 20.3, t) * (1.0 - _ss(21.9, 22.3, t))
		_iq("g", "李", li, 1.0, Color(0.78, 0.72, 0.6, emp_in), {"oc": Color(0.05, 0.03, 0.02, 0.9), "ow": 3.0, "sy": 1.0 - lbow * 0.3, "rot": lbow * 0.25})
		_iq("g", "趙", zhao, 0.95, Color(0.62, 0.45, 0.68, emp_in), {"oc": Color(0.05, 0.03, 0.02, 0.9), "ow": 3.0, "rot": -0.12 + sin(t * 3) * 0.02})
		_iq("g", "蒙", meng, 1.1, Color(0.6, 0.64, 0.72, emp_in), {"oc": Color(0.05, 0.03, 0.02, 0.9), "ow": 3.0})
		# 李が詔を広げる
		var scroll: float = _ss(22.2, 22.8, t) * (1.0 - _ss(24.0, 24.4, t))
		if scroll > 0:
			_ifx(_fx_scroll.bind(scroll), li + Vector3(0.45, 0.75, -0.1))
	# 網と、担ぐ鬼（子と魚）
	var cap_go: float = _ss(16.4, 17.6, t)
	var kid_c: Vector3 = kid.lerp(Vector3(1.6, 1.15, 12.0), cap_go) + Vector3(0, 0, leave * 28.0)
	var fish_c: Vector3 = fishp.lerp(Vector3(2.4, 1.15, 12.4), cap_go) + Vector3(0, 0, leave * 28.0)
	if t >= 16.4:
		kid = kid_c
		fishp = fish_c
	var knet: float = _ss(15.7, 16.1, t)
	# 襲われる者（牛・羊・犬・女）: 斬られて宙を舞い、墨に還る
	var victims = [["牛", Vector3(-3.4, 0, 12.6), 13.2, 1.0], ["羊", Vector3(-2.3, 0, 11.6), 13.6, 0.8], ["犬", dog, 14.2, 0.7], ["女", wom, 15.35, 1.0]]
	for v in victims:
		var p0: Vector3 = v[1]
		var te: float = v[2]
		var rot: float = 0.0
		var al: float = 1.0
		if t > 9.0 and t < te:
			p0 += Vector3(randf_range(-1, 1), 0, 0) * 0.02
		if t >= te:
			var u: float = t - te
			var k3: float = clamp(u / 0.7, 0.0, 1.0)
			p0 = p0.lerp(p0 + Vector3(-1.2, 0, -0.6), k3) + Vector3(0, _ih(k3) * 1.2, 0)
			rot = -k3 * 5.6 if k3 < 1 else -1.5
			al = 1.0 - _ss(te + 2.5, te + 4.0, t)
			if u < 0.25:
				_ifx(_fx_slash.bind(1.0 - u / 0.25), v[1] + Vector3(0, 0.5, -0.1))
		if al > 0:
			p0.y -= 0.38 * abs(sin(rot)) * v[3]
			_iq("o", v[0], p0, v[3], _oc(v[0], night, al), {"rot": rot})
	_iq("o", "子", kid, 0.65, _oc("子", night), {"rot": sin(t * 14) * 0.2 if t > 16.4 else 0.0})
	_iq("o", "魚", fishp, 0.75, _oc("魚", night), {"rot": frot + (sin(t * 14) * 0.12 if t > 16.4 else 0.0)})
	if knet > 0:
		for cp in [kid, fishp]:
			_ifx(_fx_net.bind(knet), cp + Vector3(0, 0.45 + (1.0 - knet) * 3.0, -0.05))
		if t > 16.4:
			_iq("g", "鬼", kid + Vector3(0, 0.95, 0.05), 0.9, Color(0.7, 0.1, 0.08), {"oc": Color(0.02, 0.01, 0.01, 0.9), "ow": 3.0})
			_iq("g", "鬼", fishp + Vector3(0, 0.95, 0.05), 0.9, Color(0.7, 0.1, 0.08), {"oc": Color(0.02, 0.01, 0.01, 0.9), "ow": 3.0})
	# 大鬼が人を殴る
	if t > 16.6 and t < 17.8:
		var sw: float = _ss(16.9, 17.3, t)
		_iq("g", "鬼", Vector3(0.9 - sw * 0.4, 0, 9.2), 1.4, Color(0.7, 0.1, 0.08), {"oc": Color(0.02, 0.01, 0.01, 0.9), "ow": 4.0, "rot": -0.5 * _ih(sw)})
	# 人（倒れている時は地面に寝かせる）
	hero3.y -= 0.38 * abs(sin(hrot)) * hh
	if hglow > 0:
		_ifx(_fx_ire.bind(hglow, t), hero3 + Vector3(0, 0.5 * hh, -0.05))
	_iq("o", "人", hero3, hh, Color(hcol, 1.0), {"rot": hrot, "glow": 0.3 + hglow})
	# 舞う火の粉・灰（三次元に散らす）
	if t > 13.0:
		var amt: float = _ss(13.0, 14.5, t) * (1.0 - _ss(30.5, 31.0, t))
		for k in 70:
			var ph: float = fposmod(t * 0.12 + k * 0.137, 1.0)
			var ep: Vector3 = Vector3(fmod(k * 3.7, 12.0) - 6.0 + sin(t * 0.7 + k) * 0.4, ph * 5.0, fmod(k * 1.9, 24.0) + 0.6)
			_ifx(_fx_ember.bind(amt * (1.0 - ph), k), ep)
	if t > 25.2 and t < 26.5:
		icam.focus = max(0.5, fish_c.z - icam.p.z)

# ---- 効果（舞台の点に描く。sp は画面の位置、sc は1単位の大きさ、z は奥行き） ----
func _fx_fire(ci: CanvasItem, sp: Vector2, sc: float, z: float, k: float, seed: float) -> void:
	var r: float = sc * 1.2
	glow(ci, sp + Vector2(0, -r * 0.6), r * 1.8, Color(1.0, 0.45, 0.1, 0.45 * k))
	for j in 3:
		var h: float = r * (1.4 - abs(j - 1) * 0.4) * (1.0 + 0.15 * sin(intro_t * 13 + seed + j))
		_flame(ci, sp + Vector2((j - 1) * r * 0.45, 0), r * 0.4, h, Color(0.95, 0.35 + 0.12 * j, 0.08, 0.8 * k))

func _fx_pond(ci: CanvasItem, sp: Vector2, sc: float, z: float, night: float) -> void:
	_dash_ellipse(ci, sp, sc * 0.9, sc * 0.16, Color(KD.AI.lerp(KD.AIN, night), 0.55), max(1.0, sc * 0.02))
	_dash_ellipse(ci, sp, sc * 0.55, sc * 0.09, Color(KD.AI.lerp(KD.AIN, night), 0.3), max(1.0, sc * 0.015))

func _fx_banner(ci: CanvasItem, sp: Vector2, sc: float, z: float, a: float, t: float) -> void:
	var top: Vector2 = sp + Vector2(0, -sc * 3.0)
	ci.draw_line(sp, top, Color(0.08, 0.06, 0.05, a), max(1.0, sc * 0.05))
	var w: float = sc * 0.9
	var pts := PackedVector2Array()
	for i in 9:
		var u: float = i / 8.0
		pts.append(top + Vector2(u * w, sin(t * 4 + u * 4) * sc * 0.06))
	for i in range(8, -1, -1):
		var u2: float = i / 8.0
		pts.append(top + Vector2(u2 * w, sc * 1.1 + sin(t * 4 + u2 * 4) * sc * 0.06))
	ci.draw_colored_polygon(pts, Color(0.12, 0.08, 0.06, 0.92 * a))
	glyph(ci, "秦", top + Vector2(w * 0.5, sc * 0.55), sc * 0.75, Color(KD.SHU, a))

func _fx_chariot(ci: CanvasItem, sp: Vector2, sc: float, z: float, a: float) -> void:
	# 帝の車: 台と二つの輪
	var w: float = sc * 1.6
	ci.draw_rect(Rect2(sp + Vector2(-w / 2, -sc * 0.55), Vector2(w, sc * 0.12)), Color(0.15, 0.1, 0.05, a))
	for sx in [-1.0, 1.0]:
		var c: Vector2 = sp + Vector2(sx * w * 0.42, -sc * 0.3)
		ci.draw_arc(c, sc * 0.3, 0, TAU, 28, Color(0.15, 0.1, 0.05, a), max(1.0, sc * 0.05), true)
		for k in 6:
			ci.draw_line(c, c + Vector2.from_angle(k * TAU / 6 + intro_t * 0.3) * sc * 0.3, Color(0.15, 0.1, 0.05, a * 0.8), max(1.0, sc * 0.02))
	# 黄金の天蓋
	ci.draw_line(sp + Vector2(0, -sc * 0.55), sp + Vector2(0, -sc * 2.5), Color(KD.KIN, a), max(1.0, sc * 0.04))
	var cp := PackedVector2Array([sp + Vector2(-sc * 0.9, -sc * 2.3), sp + Vector2(0, -sc * 2.75), sp + Vector2(sc * 0.9, -sc * 2.3)])
	ci.draw_colored_polygon(cp, Color(KD.KIN, 0.8 * a))
	glow(ci, sp + Vector2(0, -sc * 1.4), sc * 1.6, Color(KD.KIN, 0.18 * a))

func _fx_aura(ci: CanvasItem, sp: Vector2, sc: float, z: float, a: float) -> void:
	glow(ci, sp, sc * 1.5, Color(KD.KIN, 0.28 * a))
	glow(ci, sp, sc * 0.8, Color(1.0, 0.9, 0.6, 0.2 * a))

func _fx_scroll(ci: CanvasItem, sp: Vector2, sc: float, z: float, k: float) -> void:
	var w: float = sc * 0.9 * k
	var r = Rect2(sp + Vector2(-w / 2, -sc * 0.25), Vector2(w, sc * 0.5))
	ci.draw_rect(r, Color(0.92, 0.86, 0.66, 0.95))
	ci.draw_rect(r, Color(KD.KIN, 0.9), false, max(1.0, sc * 0.02))
	if k > 0.6:
		glyph(ci, "詔", r.get_center(), sc * 0.36, Color(KD.SUMI, (k - 0.6) / 0.4))

func _fx_net(ci: CanvasItem, sp: Vector2, sc: float, z: float, k: float) -> void:
	var nt = art("net")
	var nw: float = sc * 1.1
	var nh: float = nw * nt.get_height() / nt.get_width()
	ci.draw_texture_rect(nt, Rect2(sp.x - nw / 2, sp.y - nh * 0.6, nw, nh), false, Color(KD.WASHI, 0.85 * k))

func _fx_slash(ci: CanvasItem, sp: Vector2, sc: float, z: float, k: float) -> void:
	ci.draw_line(sp + Vector2(sc * 0.7, -sc * 0.6), sp + Vector2(-sc * 0.6, sc * 0.5), Color(KD.WASHI, k), max(2.0, sc * 0.06))
	glow(ci, sp, sc * 0.8, Color(KD.SHU, 0.6 * k))

func _fx_ember(ci: CanvasItem, sp: Vector2, sc: float, z: float, a: float, k: int) -> void:
	if a <= 0.02:
		return
	var coc: float = _coc(z)
	var r: float = max(1.0, sc * 0.025) + coc * 0.8
	var col: Color = Color(1.0, 0.55 + 0.3 * fmod(k * 0.37, 1.0), 0.2, a * (0.9 if coc < 2 else 0.35))
	ci.draw_circle(sp, r, col)
	if coc > 3:
		ci.draw_arc(sp, r, 0, TAU, 18, Color(col, a * 0.4), 1.0, true)

func _fx_ire(ci: CanvasItem, sp: Vector2, sc: float, z: float, k: float, t: float) -> void:
	glow(ci, sp, sc * 1.4, Color(KD.SHU, 0.5 * k + sin(t * 9) * 0.05))
	if t > 29.6 and t < 30.4:
		var rk: float = (t - 29.6) / 0.8
		ci.draw_arc(sp, sc * (0.5 + rk * 3.5), 0, TAU, 72, Color(KD.SHU, 1.0 - rk), 10 * (1.0 - rk) + 1, true)

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
		print("[owned] ", owned, " kraft=", KU.map(func(u): return u.ch + str(u.lv)), " souls=", souls.keys())
		get_tree().quit()

func glow(ci: CanvasItem, c: Vector2, r: float, col: Color) -> void:
	ci.draw_texture_rect(tex_glow, Rect2(c.x - r, c.y - r, r * 2, r * 2), false, col)

## 縦のグラデーションの帯
func vgrad(ci: CanvasItem, r: Rect2, top: Color, bot: Color) -> void:
	ci.draw_polygon(PackedVector2Array([r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]), PackedColorArray([top, top, bot, bot]))
