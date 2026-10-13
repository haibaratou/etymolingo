extends SceneTree
## Geometry and state contracts for attacks composed from living characters.
## Does not attach Main to the tree: no intro, save, input, or game loop runs.
## Godot --headless --path . --script res://tools/test_glyph_attacks.gd
const Main = preload("res://scripts/main.gd")
const Kraft = preload("res://scripts/kraft.gd")
const Data = preload("res://scripts/kd.gd")
const Sound = preload("res://scripts/sfx.gd")
const Bank = preload("res://scripts/glyph_bank.gd")
const Battle = preload("res://scripts/semantic_combat.gd")
const GlyphFX = preload("res://scripts/glyph_fx.gd")

var passed := 0
var failed := 0
var game: Node
var battle = Battle.new()

func check(ok: bool, label: String) -> void:
	if ok:
		passed += 1
		print("[pass] ", label)
	else:
		failed += 1
		push_error("[fail] " + label)

func _init() -> void:
	seed(173)
	Data.load_all()
	Kraft.load_db()
	game = Main.new()
	game.semantic_combat = battle
	game.test_mode = {"nosave": "1"}
	game.hero_def = Data.hero("人")
	game.sfx = Sound.new()
	game.sfx.on = false
	game.bank = Bank.new()
	game.ents = Node2D.new()
	game.living_shader = load("res://shaders/living.gdshader")
	game.tex_stain.append(game.art("blot0"))
	game.reset()
	game.state = "play"
	game.time = 400.0
	game.hero.x = 0.0
	game.hero.y = 0.0
	game.hero.last_dir = Vector2.RIGHT
	game.hero.face = 1
	test_original_glyphs()
	test_fire_contact_and_attachment()
	test_character_sweep_and_miss()
	test_empty_formation_space()
	test_stationary_enemy_contact()
	test_walked_wood_path()
	test_edge_visibility_and_trial_controls()
	test_missing_letter_fallback()
	test_flight_expiry()
	test_lv_direction_and_formation()
	test_material_inheritance()
	test_visible_water_chain()
	test_traveling_wave_knockback()
	test_form_contracts_and_budget()
	_clear_field()
	print("[glyph-attacks] passed=%d failed=%d" % [passed, failed])
	game.ents.free()
	game.bank.free()
	game.sfx.free()
	game.free()
	quit(1 if failed else 0)

func _clear_field() -> void:
	for e in game.E:
		game._free_sprite(e)
	game.E = []
	game.kraft_clear()
	battle.clear()
	battle.next_id = 0
	game.timers.clear()
	game.time = 400.0
	game.cam = Vector2.ZERO
	game.hero.x = 0.0
	game.hero.y = 0.0
	game.hero.state = "idle"
	game.hero.step_cd = 0.0
	game.hero.step_t = 0.0
	game.hero.last_dir = Vector2.RIGHT
	game.hero.face = 1
	game.kl_on = false

func _unit(ch: String, lv: int = 1) -> Dictionary:
	var u: Dictionary = game.kraft_add(ch, lv)
	u.cd = 0.0
	u.ang = 0.0
	return u

func _enemy(ch: String, p: Vector2, tiny: bool = false) -> Dictionary:
	var e: Dictionary = game.spawn_enemy({"ch": ch}, p, "still")
	e.hp = 1000.0
	e.hp_max = 1000.0
	if tiny:
		e.rad = 4.0
		e.size = 10.0
	return e

func _advance(dt: float) -> void:
	game.time += dt
	game._k_status(dt)
	battle.tick(game, dt)

func _kind(kind: String) -> Dictionary:
	for f in battle.fx:
		if String(f.k) == kind:
			return f
	return {}

func _hits(forms: Array) -> Array:
	return forms.filter(func(g): return bool(g.get("hit", false)))

func _geometry(forms: Array) -> Array:
	var result: Array = []
	for g in forms:
		result.append([g.ch, g.p, g.size, g.rot, g.sc, g.hit, g.radius])
	return result

func _cast(u: Dictionary, motion: String) -> void:
	u.pr.motion = motion
	battle.run(game, u, 0.1, Vector2.ZERO)
	if motion == "plant":
		for i in range(1, 6):
			game.time += 0.1
			game.hero.x = float(i) * 20.0
			battle.run(game, u, 0.1, Vector2(game.hero.x, 0))

func test_original_glyphs() -> void:
	check(FileAccess.get_sha256("res://scripts/oracle.gd") == "07c2537c3a58d5634469356db95382c125810a30ab372d6fd544b7a0df4065cb", "approved oracle drawing script remains byte-identical")
	check(FileAccess.get_sha256("res://data/jgw.json") == "42b02c5e96c149faf3a40c5c56d38fbba4e91b252e706f0ca00ba5016a9462c9", "original oracle-bone dataset remains byte-identical")

func test_fire_contact_and_attachment() -> void:
	_clear_field()
	var u: Dictionary = _unit("炎")
	battle.run(game, u, 0.1, Vector2.ZERO)
	var flame: Dictionary = _kind("flame")
	flame.t = 0.10
	var shown: Array = _hits(GlyphFX.forms(game, flame))
	check(not shown.is_empty() and shown.any(func(g): return String(g.ch) == "火"), "blaze has a visible attacking 火 before contact")
	if shown.is_empty():
		return
	var main_glyph: Dictionary = shown[0]
	var e: Dictionary = _enemy("海", Vector2(main_glyph.p) + Vector2.RIGHT * 130.0)
	var original_word: String = e.word
	e.typed = "s"
	for i in 10:
		_advance(0.04)
		if float(e.get("kburn", 0.0)) > 0.0:
			break
	check(e.hp < 1000.0 and e.ch == "海" and e.word == original_word and e.typed == "s", "visible 火 contact spends HP without deleting kanji or typed progress")
	check(float(e.get("kburn", 0.0)) > 0.0 and e.get("kburn_u", {}) == u, "火 contact starts its real inherited burn status")
	check(not battle.fx.has(flame), "contact consumes the traveling 火 instead of passing a picture through")
	var cling: Dictionary = _kind("cling")
	check(not cling.is_empty() and cling.get("e", {}) == e, "small 火 are attached to the struck enemy identity")
	if cling.is_empty():
		return
	var attached: Array = GlyphFX.forms(game, cling)
	check(attached.size() >= 2 and attached.all(func(g): return String(g.ch) == "火" and not bool(g.hit) and float(g.size) < float(main_glyph.size)), "attached burn is several smaller non-attacking red 火")
	check(attached.all(func(g): return Color(g.col).r > Color(g.col).b and Color(g.col).r > Color(g.col).g), "attached 火 retain a clear red burn color")
	var before: Array = attached.map(func(g): return Vector2(g.p))
	var movement := Vector2(105.0, -73.0)
	e.x += movement.x
	e.y += movement.y
	var moved: Array = GlyphFX.forms(game, cling)
	var follows := moved.size() == before.size()
	for i in mini(moved.size(), before.size()):
		follows = follows and Vector2(moved[i].p).is_equal_approx(before[i] + movement)
	check(follows, "small 火 follow a moving enemy at the same time stamp")
	e.hp = 1.0
	e.eat_cd = 0.0
	game.eat_letter(e, 1)
	check(e.alive and e.ch == "水", "burning composite still peels 海 -> 水 through normal HP rules")
	var peeled: Array = GlyphFX.forms(game, cling)
	check(not peeled.is_empty() and peeled.all(func(g): return Vector2(g.p).distance_to(Vector2(e.x, e.y)) < e.rad + 35.0), "attached 火 follow the remaining radical after component peeling")
	# Keep the remaining radical alive long enough to distinguish status expiry
	# from target death; its normal rank HP was checked by the core suite.
	e.hp = 1000.0
	e.hp_max = 1000.0
	var hp_before: float = e.hp
	for i in 5:
		_advance(0.1)
	check(e.hp < hp_before or e.ch != "水", "attached burn deals continued HP damage through the normal status path")
	for i in 80:
		_advance(0.1)
	check(float(e.get("kburn", 0.0)) <= 0.0 and _kind("cling").is_empty(), "burn status and attached 火 expire together")
	var after_expiry: Array = GlyphFX.status_forms(game, e)
	check(not after_expiry.any(func(g): return String(g.ch) == "火"), "expired burn has no orphaned small 火")

func test_character_sweep_and_miss() -> void:
	_clear_field()
	var u: Dictionary = _unit("炎")
	battle.run(game, u, 0.1, Vector2.ZERO)
	var flame: Dictionary = _kind("flame")
	flame.t = 0.10
	var first: Array = GlyphFX.forms(game, flame)
	var shown: Array = _hits(first)
	if shown.is_empty():
		check(false, "fire supplies character geometry for swept contact")
		return
	var center: Vector2 = shown[0].p
	var travel := Vector2(180.0, 0.0)
	var next: Array = first.duplicate(true)
	for g in next:
		g.p = Vector2(g.p) + travel
	var crossed: Dictionary = _enemy("水", center + travel * 0.5, true)
	var off_path: Dictionary = _enemy("水", center + travel * 0.5 + Vector2(0, 105), true)
	var contacts: Array = battle._glyph_contact(game, flame, first, next)
	check(crossed.hp < 1000.0 and contacts.any(func(c): return c.e == crossed), "a visible 火 crossing an enemy between frames cannot tunnel through")
	check(off_path.hp == 1000.0 and not contacts.any(func(c): return c.e == off_path), "enemy outside the character sweep avoids invisible area damage")
	var spent: float = crossed.hp
	battle._glyph_contact(game, flame, first, next)
	check(crossed.hp == spent, "the same traveling character does not duplicate contact damage")
	var harmless: Dictionary = _enemy("水", center + Vector2(0, -150), true)
	var decoration: Array = [{"ch": "火", "p": Vector2(harmless.x, harmless.y), "size": 15.0, "rot": 0.0, "sc": Vector2.ONE, "radius": 5.7, "hit": false, "col": Color.RED}]
	battle._glyph_contact(game, flame, decoration, decoration)
	check(harmless.hp == 1000.0, "non-attacking decorative or status characters cannot cause contact damage")
	# Rain/snow wrap from bottom to top is a spawn, not a vertical attack sweep.
	var wrapped: Dictionary = _enemy("水", Vector2(480, 0), true)
	var old_drop: Array = [{"ch": "水", "p": Vector2(480, 120), "size": 18.0, "rot": 0.0, "sc": Vector2.ONE, "radius": 6.84, "hit": true, "col": Color.BLUE}]
	var new_drop: Array = old_drop.duplicate(true)
	new_drop[0].p = Vector2(480, -120)
	flame.k = "rain"
	battle._glyph_contact(game, flame, old_drop, new_drop)
	check(wrapped.hp == 1000.0, "wrapped rain does not hit enemies along an invisible upward teleport")

func test_flight_expiry() -> void:
	_clear_field()
	var u: Dictionary = _unit("炎")
	battle.run(game, u, 0.1, Vector2.ZERO)
	for i in 30:
		_advance(0.05)
	check(_kind("flame").is_empty() and _kind("burn").is_empty() and _kind("cling").is_empty(), "a 火 that misses expires without inventing a detached burning disk")

func test_stationary_enemy_contact() -> void:
	_clear_field()
	var u: Dictionary = _unit("炎")
	battle.run(game, u, 0.1, Vector2.ZERO)
	var f: Dictionary = _kind("flame")
	f.t = 0.10
	var forms: Array = GlyphFX.forms(game, f)
	var active: Array = _hits(forms)
	if active.is_empty():
		check(false, "stationary-enemy fixture has a visible 火")
		return
	var grass: Dictionary = _enemy("草", active[0].p)
	grass.still = true
	check(game.k_targets(Vector2(grass.x, grass.y), 100.0).has(grass), "stationary 草 remains a real damage target")
	battle._glyph_contact(game, f, forms, forms)
	check(grass.hp < 1000.0 and float(grass.get("kburn", 0.0)) > 0.0, "visible 火 burns stationary 草 on actual contact")

func test_empty_formation_space() -> void:
	_clear_field()
	var u: Dictionary = _unit("守")
	battle.run(game, u, 0.1, Vector2.ZERO)
	var shelter: Dictionary = _kind("shelter")
	shelter.t = 0.25
	var forms: Array = _hits(GlyphFX.forms(game, shelter))
	var untouched: Dictionary = _enemy("水", Vector2.ZERO, true)
	var touches := false
	for g in forms:
		touches = touches or Vector2(g.p).distance_to(Vector2.ZERO) <= float(g.radius) + float(untouched.rad)
	check(not forms.is_empty() and not touches, "guard formation leaves a visibly empty interior between its actual characters")
	_advance(0.1)
	check(untouched.hp == 1000.0, "enemy inside a formation's empty space avoids the old invisible damage disk")
	var touched: Dictionary = _enemy("水", forms[0].p, true)
	_advance(0.05)
	check(touched.hp < 1000.0, "the same guard formation damages an enemy touching its visible letter")

func test_walked_wood_path() -> void:
	_clear_field()
	var u: Dictionary = _unit("林")
	for i in 60:
		game.time += 0.1
		battle.run(game, u, 0.1, Vector2.ZERO)
	check(battle.fx.is_empty(), "stationary 林 never spawns random or timed trees")
	for i in range(1, 21):
		game.time += 0.1
		game.hero.x = i * 20.0
		battle.run(game, u, 0.1, Vector2(game.hero.x, 0))
	var trees: Array = battle.fx.filter(func(f): return String(f.k) == "tree")
	check(trees.size() >= 5 and trees.all(func(f): return absf(float(f.p.y)) < 0.01 and float(f.p.x) >= 0.0 and float(f.p.x) <= 400.0), "林 grows a spaced 木 trail on the actual walked line")
	var stopped_count: int = trees.size()
	for i in 25:
		game.time += 0.1
		battle.run(game, u, 0.1, Vector2(400, 0))
	check(battle.fx.filter(func(f): return String(f.k) == "tree").size() == stopped_count, "stopping movement stops new trail trees immediately")
	_clear_field()
	u = _unit("林")
	var trapped: Dictionary = _enemy("水", Vector2(120, 120), true)
	var outside: Dictionary = _enemy("水", Vector2(120, -90), true)
	var square: Array = [Vector2.ZERO, Vector2(240, 0), Vector2(240, 240), Vector2(0, 240), Vector2.ZERO]
	battle.run(game, u, 0.1, square[0])
	for side in 4:
		for step in range(1, 13):
			var p: Vector2 = Vector2(square[side]).lerp(square[side + 1], float(step) / 12.0)
			game.time += 0.1
			game.hero.x = p.x
			game.hero.y = p.y
			battle.run(game, u, 0.1, p)
	var enclosing: Array = battle.fx.filter(func(f): return String(f.k) == "wood_converge")
	check(not _kind("wood_loop").is_empty() and not enclosing.is_empty(), "closing a walked 木 loop creates a visible enclosure attack")
	var moving_wood := false
	for f in enclosing:
		f.t = 0.10
		moving_wood = moving_wood or _hits(GlyphFX.forms(game, f)).any(func(g): return String(g.ch) == "木")
	check(moving_wood, "enclosure damage is carried by visible converging 木 characters")
	for i in 35:
		_advance(0.05)
	print("[wood-loop] enclosed_hp=%.1f outside_hp=%.1f contacts=%d" % [trapped.hp, outside.hp, battle.contact_trace.size()])
	check(trapped.hp < 1000.0 and outside.hp == 1000.0, "closed 木 trail attacks the enclosed enemy while the outside enemy avoids it")
	var density: Array = []
	for ch in ["林", "森"]:
		_clear_field()
		u = _unit(ch)
		battle.run(game, u, 0.1, Vector2.ZERO)
		for i in range(1, 31):
			game.time += 0.1
			game.hero.x = float(i) * 20.0
			battle.run(game, u, 0.1, Vector2(game.hero.x, 0))
		var count := 0
		for f in battle.fx:
			f.t = 0.8
			count += _hits(GlyphFX.forms(game, f)).filter(func(g): return String(g.ch) == "木").size()
		density.append(count)
	check(int(density[1]) > int(density[0]), "crafting 林 into 森 inherits a denser living 木 trail")

func test_edge_visibility_and_trial_controls() -> void:
	_clear_field()
	var edge: Dictionary = _enemy("海", Vector2.ZERO)
	var keep := true
	for x in [-game.W * 0.5 + 4.0, game.W * 0.5 - 4.0, game.W * 0.5 + edge.size * 0.4]:
		edge.x = x
		game._sync_visuals(0.0)
		keep = keep and edge.spr.visible
	check(keep, "living enemies remain visible while their character overlaps either viewport edge")
	edge.x = game.W * 0.5 + edge.size * 2.0
	game._sync_visuals(0.0)
	check(not edge.spr.visible, "a fully offscreen character can be culled after leaving the viewport")
	var u: Dictionary = _unit("林")
	game.kl_on = true
	game.kl.lv = 1
	game.kl.party = ["林"]
	var enemy_id: int = edge.id
	var unit_id: int = u.id
	var ev := InputEventKey.new()
	ev.pressed = true
	ev.keycode = KEY_RIGHT
	game.kl_key(ev)
	game.tick_hero(0.12)
	check(game.hero.x > 0.0 and game.E.any(func(e): return int(e.id) == enemy_id) and game.KU.any(func(k): return int(k.id) == unit_id) and int(game.kl.lv) == 1, "trial arrow movement preserves enemies, companions, and their level")
	ev.keycode = KEY_KP_ADD
	game.kl_key(ev)
	check(int(game.kl.lv) == 2 and int(u.lv) == 2 and game.E.any(func(e): return int(e.id) == enemy_id) and game.KU.any(func(k): return int(k.id) == unit_id), "trial level increase upgrades the existing companion without restarting its world")
	game.kl_on = false

func test_lv_direction_and_formation() -> void:
	for row in [["炎", "blaze"], ["海", "tide"], ["雷", "thunder"], ["林", "plant"], ["囚", "cage"], ["滅", "annihilate"]]:
		_clear_field()
		var u: Dictionary = _unit(row[0])
		_cast(u, row[1])
		var baseline: Array = []
		for f in battle.fx:
			f.t = 0.8 if row[1] != "annihilate" else 1.5
			baseline.append(_geometry(GlyphFX.forms(game, f)))
		_clear_field()
		u = _unit(row[0])
		_enemy("海", Vector2(-500, 240))
		_cast(u, row[1])
		var relocated: Array = []
		for f in battle.fx:
			f.t = 0.8 if row[1] != "annihilate" else 1.5
			relocated.append(_geometry(GlyphFX.forms(game, f)))
		check(relocated == baseline, "Lv1 %s character formation ignores enemy location" % row[0])
	for ch in ["炎", "海", "林", "雷"]:
		var counts: Array = []
		for lv in [1, 3]:
			_clear_field()
			var u: Dictionary = _unit(ch, lv)
			_cast(u, String(u.pr.motion))
			var count := 0
			for f in battle.fx:
				f.t = 0.8
				count += GlyphFX.forms(game, f).size()
			counts.append(count)
		check(int(counts[1]) > int(counts[0]), "%s Lv3 grows a denser character formation than Lv1" % ch)

func test_missing_letter_fallback() -> void:
	_clear_field()
	var e: Dictionary = _enemy("獣", Vector2(100, 60))
	e.spr.texture = null
	e.mo = ""
	e.t = 0.0
	game._sync_visuals(0.0)
	check(game.glyph_fallback_needed(e), "a visible 獣 missing its cached glyph texture is eligible for readable font fallback")
	check(game.enemy_visual_point(e).is_equal_approx(Vector2(100, 60)), "missing-texture fallback uses the actual enemy world position in a detached fixture")
	e.mo = "flutter"
	e.t = 0.2
	e.ph = 0.4
	var expected: Vector2 = Vector2(e.x, e.y + sin(e.t * 7.0 + e.ph) * e.size * 0.14)
	check(game.enemy_visual_point(e).is_equal_approx(expected), "fallback and attached statuses can use the same visible animated enemy center")
	e.spr.texture = GradientTexture2D.new()
	check(not game.glyph_fallback_needed(e), "an existing glyph texture is not drawn a second time by fallback")
	e.spr.texture = null
	e.hidden = true
	game._sync_visuals(0.0)
	check(not game.glyph_fallback_needed(e), "fallback respects intentionally hidden enemies")
	e.hidden = false
	e.x = game.W * 0.5 + e.size * 2.0
	game._sync_visuals(0.0)
	check(not game.glyph_fallback_needed(e), "fallback does not draw a fully offscreen missing-texture enemy")
	e.x = 100.0
	e.captive = true
	game._sync_visuals(0.0)
	check(not game.glyph_fallback_needed(e), "fallback preserves captive-letter visibility rules")

func test_material_inheritance() -> void:
	_clear_field()
	var u: Dictionary = _unit("沐")
	var e: Dictionary = _enemy("海", Vector2(120, 0))
	var f: Dictionary = battle._emit("wave", u, Vector2(e.x, e.y), Vector2.RIGHT, 1.0, 70.0, {"speed": 0.0})
	f.t = 0.10
	var forms: Array = GlyphFX.forms(game, f)
	var visible: Array = _hits(forms)
	check(forms.any(func(g): return String(g.ch) == "水"), "沐 wave carries its primary 水 in the actual character formation")
	if visible.is_empty():
		check(false, "沐 supplies visible attacking character geometry")
		return
	e.x = visible[0].p.x
	e.y = visible[0].p.y
	battle._glyph_contact(game, f, forms, forms)
	check(e.hp < 1000.0 and float(e.get("kwet", 0.0)) > game.time and float(e.get("kroot", 0.0)) > game.time, "沐 visible contact applies primary water and inherited 木 roots")
	var statuses: Array = GlyphFX.status_forms(game, e)
	check(statuses.any(func(g): return String(g.ch) == "水") and statuses.any(func(g): return String(g.ch) == "木"), "primary and secondary material statuses remain readable as 水 and 木")
	check(statuses.all(func(g): return not bool(g.hit)), "inherited state marks remain supplemental non-attacking characters")
	check(Kraft.prof("滅").transform and Kraft.prof("滅").motion == "annihilate" and Kraft.prof("滅").eff == "波", "rare 滅 changes attack direction while preserving inherited water")

func test_form_contracts_and_budget() -> void:
	_clear_field()
	var reps: Dictionary = {}
	for ch in Kraft.ALL:
		if Kraft.can_ally(ch) and not reps.has(Kraft.motion_of(ch)):
			reps[Kraft.motion_of(ch)] = ch
	for motion in battle.MOTIONS:
		_clear_field()
		var u: Dictionary = _unit(reps.get(motion, "明"), 3)
		_cast(u, motion)
		var valid := true
		var max_count := 0
		for f in battle.fx:
			for age in [0.12, 0.75, 1.4]:
				f.t = age
				var forms: Array = GlyphFX.forms(game, f)
				max_count = maxi(max_count, forms.size())
				for g in forms:
					var sc: Vector2 = g.sc
					valid = valid and String(g.ch) != "" and Vector2(g.p).is_finite() and is_finite(float(g.size)) and float(g.size) > 0.0 and is_finite(float(g.rot))
					valid = valid and is_finite(float(g.radius)) and float(g.radius) >= 0.0
					if bool(g.hit):
						valid = valid and float(g.radius) <= float(g.size) * maxf(absf(sc.x), absf(sc.y)) * 0.4 + 0.01
		check(valid and max_count > 0 and max_count <= GlyphFX.MAX_FORM_GLYPHS, "%s uses finite readable glyph geometry within its particle budget" % motion)
	_clear_field()
	var u: Dictionary = _unit("炎", 3)
	for i in battle.MAX_FX + 25:
		battle._emit("flame", u, Vector2(i * 2.0, 0.0), Vector2.RIGHT, 2.0, 24.0, {"speed": 0.0})
	check(battle.fx.size() <= battle.MAX_FX, "attack emitters enforce the global finite effect-body budget")
	_advance(0.01)
	var glyph_count := 0
	var bounded := true
	for f in battle.fx:
		var glyphs: Array = f.get("glyphs", GlyphFX.forms(game, f))
		glyph_count += glyphs.size()
		bounded = bounded and glyphs.size() <= GlyphFX.MAX_FORM_GLYPHS
	check(bounded, "every cached draw/contact body respects its shared glyph budget")
	check(glyph_count <= GlyphFX.MAX_VISIBLE_GLYPHS, "all active character formations fit the shared global glyph budget")
	print("[glyph-budget] bodies=%d visible_characters=%d" % [battle.fx.size(), glyph_count])

func test_visible_water_chain() -> void:
	_clear_field()
	var u: Dictionary = _unit("沐")
	var source: Dictionary = _enemy("水", Vector2.ZERO, true)
	var neighbor: Dictionary = _enemy("水", Vector2(150, 0), true)
	var off_path: Dictionary = _enemy("水", Vector2(75, 50), true)
	source.kwet = game.time + 10.0
	neighbor.kwet = game.time + 10.0
	game.k_hit(u, source, Vector2(-20, 0), 0.0)
	check(source.hp < 1000.0 and neighbor.hp == 1000.0 and off_path.hp == 1000.0, "hitting a wet source cannot instantly damage another wet enemy")
	var link: Dictionary = _kind("water_link")
	check(not link.is_empty() and link.goal == Vector2(neighbor.x, neighbor.y), "wet inheritance creates a real 水 traveling toward the wet neighbor")
	if link.is_empty():
		return
	_advance(0.10)
	var forms: Array = _hits(GlyphFX.forms(game, link))
	check(not forms.is_empty() and forms.all(func(g): return String(g.ch) == "水") and neighbor.hp == 1000.0, "水 is visibly in flight while distant neighbor HP remains unchanged")
	for i in 18:
		_advance(0.04)
	check(neighbor.hp < 1000.0 and battle.contact_trace.any(func(c): return String(c.kind) == "water_link" and int(c.e) == int(neighbor.id) and String(c.ch) == "水"), "traveling 水 damages the wet neighbor only on actual character contact")
	check(off_path.hp == 1000.0, "nearby enemy outside the 水 trajectory avoids chain damage")
	check(_kind("water_link").is_empty(), "one 水 chain ends after its contact without recursively striking neighbors")

func test_traveling_wave_knockback() -> void:
	_clear_field()
	var u: Dictionary = _unit("海")
	var f: Dictionary = battle._emit("wave", u, Vector2.ZERO, Vector2.RIGHT, 1.2, 70.0, {"speed": 270.0})
	f.t = 0.10
	var forms: Array = _hits(GlyphFX.forms(game, f))
	if forms.is_empty():
		check(false, "traveling-water fixture has a visible 水")
		return
	var e: Dictionary = _enemy("海", Vector2(forms[0].p) + Vector2.RIGHT * 20.0, true)
	_advance(0.05)
	var shove: Vector2 = Vector2(e.kx, e.ky)
	check(e.hp < 1000.0 and shove.length() > 0.0 and shove.length() <= 25.0 * game.SF + 0.01, "traveling 水 has a small bounded shove only after visible contact")
