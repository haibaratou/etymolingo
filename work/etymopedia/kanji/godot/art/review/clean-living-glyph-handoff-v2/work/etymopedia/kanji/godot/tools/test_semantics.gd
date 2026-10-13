extends SceneTree
## Deterministic contracts for crafting and part stripping.
## Godot --headless --path . --script res://tools/test_semantics.gd
## This fixture never joins Main to the scene tree, so no introduction, game
## loop, user save, or visible window can run.
const Main = preload("res://scripts/main.gd")
const Kraft = preload("res://scripts/kraft.gd")
const Data = preload("res://scripts/kd.gd")
const Sound = preload("res://scripts/sfx.gd")
const Bank = preload("res://scripts/glyph_bank.gd")
const GlyphWorld = preload("res://scripts/glyph_gimmicks.gd")
const Battle = preload("res://scripts/semantic_combat.gd")

var passed := 0
var failed := 0
var game: Node

func check(ok: bool, label: String) -> void:
	if ok:
		passed += 1
		print("[pass] ", label)
	else:
		failed += 1
		push_error("[fail] " + label)

func _init() -> void:
	Data.load_all()
	Kraft.load_db()
	game = Main.new()
	game.test_mode = {"nosave": "1"}
	game.hero_def = Data.hero("人")
	game.sfx = Sound.new()
	game.sfx.on = false
	game.bank = Bank.new()
	game.ents = Node2D.new()
	game.living_shader = load("res://shaders/living.gdshader")
	game.tex_stain.append(game.art("blot0"))
	game.reset()
	game.state = "craft"
	test_crafting()
	test_enemy_health()
	test_profiles()
	test_motion_dispatch()
	test_visual_growth_and_rest()
	test_inherited_combat()
	test_glyph_world()
	print("[semantics] passed=%d failed=%d" % [passed, failed])
	game.ents.free()
	game.bank.free()
	game.sfx.free()
	game.free()
	quit(1 if failed else 0)

func test_crafting() -> void:
	check(Kraft.can_ally("林") and Kraft.can_ally("森"), "only dictionary composites become companions")
	check(not Kraft.can_ally("木") and not Kraft.can_ally("火"), "single radicals remain materials")
	check(Kraft.make("日", "月").has("明"), "dictionary recipe 日 + 月 = 明")
	check(Kraft.make("木", "木").has("林"), "dictionary recipe 木 + 木 = 林")
	check(Kraft.make("木", "林").has("森"), "crafted companion remains a recipe ingredient")
	game.souls = {"木": 2, "日": 2, "月": 1, "火": 2, "犬": 1}
	check(game.craft_avail("人") == 99, "hero radical is unlimited")
	check(not game.craft_enough(["人", "人"]), "hero-only recipe cannot create free companions")
	check(not game.craft_enough(["木", "木", "木"]), "repeated materials require actual stock")
	game.craft.a = "人"
	game.craft.b = "木"
	game._craft_try2()
	check(game.k_lv("休") == 1, "crafting creates companion through the live KU path")
	check(int(game.souls.木) == 1, "crafting consumes non-hero soul exactly once")
	check(game.craft_avail("人") == 99 and game.form == "人", "crafting preserves unlimited hero and hero form")
	game.craft.a = "人"
	game.craft.b = "木"
	game._craft_try2()
	check(game.k_lv("休") == 2 and int(game.souls.木) == 0, "repeat craft upgrades the same companion")
	game.craft_use("休")
	check(game.k_lv("休") == 1, "using a companion as material spends one level")
	game.craft_use("休")
	check(game.k_lv("休") == 0, "spending final level removes the ingredient companion")
	game.hp = 7
	game.pending_lv = 2
	game.level_reward()
	check(game.hp == 9 and game.pending_lv == 0 and game.form == "人", "level rewards restore one life and preserve hero")
	game.state = "play"
	game.time = 11.0
	game.auto_on = true
	game.souls = {"木": 1}
	game.auto_tick(12.1)
	check(game.state == "craft", "automatic play opens the craft bench after time passes")
	game.auto_tick(0.1)
	check(not game.KU.is_empty() and int(game.souls.木) == 0, "automatic play crafts a real dictionary companion and spends its soul")
	print("[auto-crafted] ", game.KU.map(func(u): return u.ch))
	game.auto_on = false
	game.kraft_clear()

func test_enemy_health() -> void:
	game.state = "play"
	game.time = 10.0
	game.cam = Vector2.ZERO
	var e: Dictionary = game.spawn_enemy({"ch": "海"}, Vector2(300, 50))
	var expected: float = game.hp_of(e)
	var original_word: String = e.word
	var typed_marker := "s"
	e.typed = typed_marker
	check(e.hp == expected, "enemy HP comes from the rank table")
	game.set_word(e, "a")
	var short_hp: float = e.hp_max
	game.set_word(e, "extraordinarilylongtranslatedword")
	check(e.hp_max == short_hp, "translated word length cannot change enemy HP")
	game.set_word(e, original_word)
	e.typed = typed_marker
	game.eat_letter(e, 1)
	check(e.ch == "海" and e.hp == expected - 1.0, "non-typing attack spends HP before changing the kanji")
	check(e.word == original_word and e.typed == typed_marker, "non-typing damage preserves typed word progress")
	e.eat_cd = 0.0
	game.eat_letter(e, int(e.hp))
	check(e.alive and e.ch == "水", "HP exhaustion strips one part and retains radical 海 -> 水")
	check(e.hp == game.hp_of(e), "remaining radical receives its own full rank HP")
	check(e.beh == Data.beh_of("水", Data.strokes("水")), "remaining radical receives its own movement rule")
	game._free_sprite(e)

func test_profiles() -> void:
	var coverage := {"character": 0, "meaning": 0, "radical": 0}
	var ally_count := 0
	var blank := 0
	var unknown := 0
	for ch in Kraft.K:
		if not Kraft.can_ally(ch):
			continue
		ally_count += 1
		var info: Dictionary = Kraft.motion_info(ch)
		var motion: String = info.motion
		coverage[info.source] += 1
		if motion == "":
			blank += 1
		if not Kraft.MOTION_JP.has(motion):
			unknown += 1
	check(ally_count == 2645 and blank == 0 and unknown == 0, "every existing companion has a named motion and explanation")
	print("[coverage] ", coverage)
	for ch in ["明", "休", "伐", "沐", "災"]:
		var p: Dictionary = Kraft.prof(ch)
		check(p.inherited.size() >= 2 and p.traits.size() >= 1, "%s keeps its secondary material attributes" % ch)
	check(Kraft.prof("明").inherited.any(func(t): return t.source == "月"), "明 explicitly inherits 月 alongside primary 日")
	check(Kraft.prof("沐").traits.any(func(t): return t.source == "木" and t.family == "樹"), "沐 inherits 木 roots alongside 水")
	check(Kraft.prof("災").traits.any(func(t): return t.source == "巛" and t.family == "波"), "災 preserves the dictionary's 巛 water component")
	check(Kraft.prof("滅").transform and Kraft.prof("滅").motion == "annihilate" and Kraft.prof("滅").eff == "波", "rare 滅 redirects water into offense while retaining its radical")
	check(not Kraft.prof("汁").transform and Kraft.prof("汁").motion == "tide", "ordinary water companion retains its radical behavior")
	check(Kraft.prof("森").T > Kraft.prof("林").T and Kraft.prof("森").traits[0].count > Kraft.prof("林").traits[0].count, "林 -> 森 inherits the repeated 木 stack")
	var probe_ch := "semantic-test-probe"
	var probes := [["resting", "rest"], ["burning", "blaze"], ["to guard; protect", "shelter"], ["restaurant", "rally"], ["firefly", "radiance"], ["clearly", "rally"]]
	for row in probes:
		Kraft.K[probe_ch] = {"b": "人", "en": row[0], "via": "人", "rad": "人", "src": "人", "lv": ["人"]}
		check(Kraft.motion_of(probe_ch) == row[1], "meaning tokens respect word boundaries: %s" % row[0])
	Kraft.K.erase(probe_ch)

func _emission_shape(battle) -> Array:
	var result: Array = []
	for f in battle.fx:
		result.append([f.k, f.p, f.d, f.r, f.get("goal", Vector2.ZERO), f.get("origin", Vector2.ZERO)])
	return result

func test_motion_dispatch() -> void:
	var battle = Battle.new()
	var representatives: Dictionary = {}
	for ch in Kraft.ALL:
		if Kraft.can_ally(ch):
			var motion: String = Kraft.motion_of(ch)
			if not representatives.has(motion):
				representatives[motion] = ch
	for motion in battle.MOTIONS:
		game.kraft_clear()
		battle.clear()
		# inscribe/dragon are optional dispatches retained for future dictionary
		# entries; their update code is exercised without fabricating a recipe.
		var ch: String = representatives.get(motion, "明")
		var u: Dictionary = game.kraft_add(ch)
		u.pr.motion = motion
		u.cd = 0.0
		u.ang = 0.0
		game.hero.last_dir = Vector2.RIGHT
		game.hero.face = 1
		var foes: Array = game.E
		game.E = []
		var dispatched: bool = battle.run(game, u, 0.1, Vector2.ZERO)
		if motion == "plant":
			check(dispatched and battle.fx.is_empty(), "plant waits for an actual walked route")
			battle.run(game, u, 0.1, Vector2(180, 0))
		check(dispatched and not battle.fx.is_empty(), "motion dispatch emits %s" % motion)
		var shape: Array = _emission_shape(battle)
		battle.tick(game, 0.1)
		check(not battle.fx.is_empty() and float(battle.fx[0].t) > 0.0, "motion update advances %s" % motion)
		battle.clear()
		var second: Dictionary = game.kraft_add(ch)
		second.lv = 1
		second.pr = Kraft.prof(ch)
		second.pr.motion = motion
		second.cd = 0.0
		second.ang = 0.0
		second.erase("sem_seq")
		second.erase("rest_prev")
		second.erase("rest_charge")
		second.erase("rest_cool")
		second.erase("sem_trail_prev")
		second.erase("sem_trail_carry")
		second.erase("sem_trail_path")
		game.E = [{"x": -220.0, "y": 450.0, "alive": true, "is_boss": false, "still": false, "obj": "", "captive": false}]
		battle.run(game, second, 0.1, Vector2.ZERO)
		if motion == "plant":
			battle.run(game, second, 0.1, Vector2(180, 0))
		check(_emission_shape(battle) == shape, "Lv1 %s direction ignores enemy location" % motion)
		battle.clear()
		game.E = foes
	game.kraft_clear()
	var live_unit: Dictionary = game.kraft_add("炎")
	live_unit.cd = 0.0
	var saved_foes: Array = game.E
	game.E = []
	game.kraft_tick(0.1)
	check(not game.semantic_combat.fx.is_empty() and game.KFX.is_empty(), "normal crafted KU companions reach semantic attacks through main.kraft_tick")
	game.E = saved_foes
	game.kraft_clear()

func test_visual_growth_and_rest() -> void:
	var battle = Battle.new()
	game.hero.last_dir = Vector2.RIGHT
	for ch in ["炎", "明", "森"]:
		game.kraft_clear()
		var u: Dictionary = game.kraft_add(ch, 1)
		u.cd = 0.0
		battle.clear()
		battle.run(game, u, 0.1, Vector2.ZERO)
		if ch == "森":
			battle.run(game, u, 0.1, Vector2(400, 0))
		var simple: int = battle.fx.size()
		game.kraft_clear()
		u = game.kraft_add(ch, 3)
		u.cd = 0.0
		battle.clear()
		battle.run(game, u, 0.1, Vector2.ZERO)
		if ch == "森":
			battle.run(game, u, 0.1, Vector2(400, 0))
		check(battle.fx.size() > simple, "%s Lv3 visibly adds attack forms beyond Lv1" % ch)
	game.kraft_clear()
	battle.clear()
	var rest: Dictionary = game.kraft_add("休")
	rest.cd = 0.0
	game.hp = 7
	game.hero.state = "idle"
	for i in 60:
		battle.run(game, rest, 0.1, Vector2.ZERO)
	check(game.hp == 8, "休 heals after an actual sustained stationary rest")
	game.kraft_clear()
	battle.clear()
	rest = game.kraft_add("休")
	rest.cd = 0.0
	game.hp = 7
	for i in 60:
		battle.run(game, rest, 0.1, Vector2(i * 10, 0))
	check(game.hp == 7, "moving prevents the rest healing charge")
	game.kraft_clear()
	battle.clear()

func test_inherited_combat() -> void:
	var battle = Battle.new()
	game.kraft_clear()
	game.time = 300.0
	var u: Dictionary = game.kraft_add("沐")
	var e: Dictionary = game.spawn_enemy({"ch": "森"}, Vector2(140, 0))
	e.hp = 1000.0
	e.hp_max = 1000.0
	var original_word: String = e.word
	var f := {"id": 900, "u": u, "d": Vector2.RIGHT}
	check(battle._hit(game, f, e, Vector2.ZERO), "inherited contact uses the normal HP damage path")
	check(float(e.get("kwet", 0.0)) > game.time and float(e.get("kroot", 0.0)) > game.time and float(e.slow) > 0.0, "沐 contact applies primary water and inherited 木 roots")
	check(e.ch == "森" and e.word == original_word and e.hp < 1000.0, "inherited effects spend HP without erasing kanji or typed words")
	game.kraft_clear()
	u = game.kraft_add("災")
	f = {"id": 901, "u": u, "d": Vector2.RIGHT}
	e.erase("kwet")
	e.erase("kburn")
	battle._hit(game, f, e, Vector2.ZERO)
	check(float(e.get("kburn", 0.0)) > 0.0 and float(e.get("kwet", 0.0)) > game.time, "災 contact inherits both 火 and 巛 water")
	game.kraft_clear()
	battle.clear()
	u = game.kraft_add("滅")
	u.cd = 0.0
	game.hero.last_dir = Vector2.RIGHT
	battle.run(game, u, 0.1, Vector2.ZERO)
	e.erase("kwet")
	var hp_before: float = e.hp
	for i in 24:
		game.time += 0.1
		battle.tick(game, 0.1)
	check(e.hp < hp_before and float(e.get("kwet", 0.0)) > game.time, "滅 charged torrent deals HP damage and retains water inheritance")
	game.kraft_clear()
	battle.clear()
	u = game.kraft_add("守")
	u.cd = 0.0
	e.x = 70.0
	e.y = 0.0
	e.kx = 0.0
	e.ky = 0.0
	battle.run(game, u, 0.1, Vector2.ZERO)
	battle.tick(game, 0.3)
	check(e.kx == 0.0 and e.ky == 0.0 and e.x == 70.0 and e.y == 0.0, "shelter damage does not push enemies away")
	var life_before: int = game.hp
	check(battle.protect(game, e), "shelter can absorb one contact")
	check(not battle.protect(game, e) and game.hp == life_before, "Lv1 shelter has finite protection")
	game.kraft_clear()
	battle.clear()
	u = game.kraft_add("守", 3)
	u.cd = 0.0
	battle.run(game, u, 0.1, Vector2.ZERO)
	var shelter_until: float = u.sem_shield.until
	battle.tick(game, 0.3)
	check(int(u.sem_shield.charges) == 2 and float(u.sem_shield.until) == shelter_until, "門 contact inheritance does not overwrite Lv3 shelter charges or expiry")
	check(battle.protect(game, e) and battle.protect(game, e) and not battle.protect(game, e), "Lv3 shelter absorbs exactly two contacts")
	game.kraft_clear()
	battle.clear()
	u = game.kraft_add("明")
	f = {"id": 903, "u": u, "d": Vector2.RIGHT}
	e.sem_light_at = 0.0
	battle._hit(game, f, e, Vector2.ZERO)
	var light_hp: float = e.hp
	battle.tick(game, 0.5)
	check(e.hp == light_hp - 1.0, "inherited 日/月 light leaves a real delayed HP scorch")
	game.kraft_clear()
	battle.clear()
	u = game.kraft_add("伐")
	f = {"id": 904, "u": u, "d": Vector2.RIGHT}
	e.x = 140.0
	e.y = 0.0
	e.sem_pierce_at = 0.0
	var behind: Dictionary = game.spawn_enemy({"ch": "森"}, Vector2(185, 0))
	behind.hp = 1000.0
	behind.hp_max = 1000.0
	game.E = [e, behind]
	battle._hit(game, f, e, Vector2.ZERO)
	battle.tick(game, 0.3)
	check(behind.hp == 999.0, "inherited 戈 continues through first contact into the next enemy")
	game._free_sprite(behind)
	game._free_sprite(e)
	game.kraft_clear()
	battle.clear()

func test_glyph_world() -> void:
	var world = GlyphWorld.new()
	game.state = "play"
	var center := Vector2(430, -30)
	var room: Dictionary = world.spawn_room(game, center)
	var gate: Dictionary = room.gate
	var outside := Vector2(0, -30)
	var inside := Vector2(480, -30)
	check(gate.alive and gate.ch == "門" and gate.word == "gate", "closed 門 is an actual living gate typing target")
	check(game.typables().has(gate), "gate appears in the normal typing target list")
	check(not world.can_reach(game, outside, inside), "closed 門 blocks target attacks through the gate")
	var stopped: Vector2 = world.block(game, outside, inside, 20.0)
	check(stopped.x < gate.x - 20.0, "closed gate blocks even a full-speed crossing segment")
	game.hero.x = outside.x
	game.hero.y = outside.y
	check(world.can_reach(game, outside, game.strike_point(gate)), "closed gate itself can be approached from outside")
	var over_wall: Vector2 = world.block(game, Vector2(430, -350), center, 20.0)
	check(over_wall.y < center.y - 150.0, "wall blocks the player independently of the gate")
	game.E.erase(gate)
	gate.alive = false
	world.tick(game, 0.1)
	check(gate.alive and game.typables().has(gate), "field cleanup cannot leave a solid room without a gate target")
	check(world.use(game, gate), "normal gate object interaction opens the door")
	check(gate.alive and gate.ch == "開" and room.open, "opened door remains visible alive as 開")
	check(world.can_reach(game, outside, inside), "opening 門 creates a real traversable passage")
	check(world.block(game, outside, inside, 20.0) == inside, "movement crosses the opened passage")
	check(not world.can_reach(game, Vector2(430, -350), center), "opening the gate does not remove solid 壁")
	check(room.reward != null and room.reward.ch == "宝" and room.reward.alive, "opening reveals the existing 宝 reward inside")
	var count: int = game.E.size()
	world.use(game, gate)
	check(game.E.size() == count, "an opened gate cannot create duplicate treasure")
	game._free_sprite(gate)
	game._free_sprite(room.reward)
	world.clear()
	# Exercise the actual input -> queued dash -> object interaction hooks.
	game.glyph_gimmicks.clear()
	var integrated: Dictionary = game.glyph_gimmicks.spawn_room(game, center)
	var integrated_gate: Dictionary = integrated.gate
	game.E = [integrated_gate]
	game.hero.x = outside.x
	game.hero.y = outside.y
	game.hero.state = "idle"
	game.hero.target = null
	game.hero.queue = []
	game.next_boss = 99999.0
	for c in "gate":
		game.key(c)
	check(game.hero.state == "dash" and game.hero.target == integrated_gate, "typing gate uses the real main input and accepts the gate approach")
	game.tick_hero(1.0)
	check(integrated.open and integrated_gate.ch == "開" and integrated_gate.alive, "real typed gate dash opens the passage through use_obj")
	game._free_sprite(integrated_gate)
	if integrated.reward != null:
		game._free_sprite(integrated.reward)
	game.glyph_gimmicks.clear()
