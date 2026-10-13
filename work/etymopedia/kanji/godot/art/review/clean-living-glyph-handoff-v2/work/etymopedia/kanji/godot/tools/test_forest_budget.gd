extends SceneTree
## Saturated forest routes must retain visible paths and room for their payoff.
## No scene tree game loop, saves, or visible window is started by this fixture.
const Main = preload("res://scripts/main.gd")
const Kraft = preload("res://scripts/kraft.gd")
const Data = preload("res://scripts/kd.gd")
const Sound = preload("res://scripts/sfx.gd")
const Bank = preload("res://scripts/glyph_bank.gd")
const Battle = preload("res://scripts/semantic_combat.gd")

var game: Node
var battle = Battle.new()
var passed := 0
var failed := 0

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
	test_high_level_path_admission()
	test_saturated_visible_loop()
	_clear_field()
	print("[forest-budget] passed=%d failed=%d" % [passed, failed])
	game.ents.free()
	game.bank.free()
	game.sfx.free()
	game.free()
	quit(1 if failed else 0)

func _clear_field() -> void:
	for enemy in game.E:
		game._free_sprite(enemy)
	game.E = []
	game.kraft_clear()
	battle.clear()
	game.timers.clear()

func _trees() -> Array:
	return battle.fx.filter(func(f): return String(f.k) == "tree")

func _walk_to(u: Dictionary, start: Vector2, end: Vector2) -> void:
	var steps: int = maxi(1, int(ceil(start.distance_to(end) / 20.0)))
	for j in steps:
		game.time += 0.005
		battle.run(game, u, 0.033, start.lerp(end, float(j + 1) / float(steps)))

func test_high_level_path_admission() -> void:
	_clear_field()
	var u: Dictionary = game.kraft_add("森", 6)
	battle.run(game, u, 0.033, Vector2.ZERO)
	check(u.sem_trail_path.is_empty(), "unplanted initial hero position is never recorded as a tree")
	for j in 80:
		game.time += 0.005
		battle.run(game, u, 0.033, Vector2((j + 1) * 120.0, 0))
	var visible: Array = _trees()
	check(visible.size() <= Battle.MAX_UNIT_TREES and visible.size() >= 30, "Lv6 森 keeps a finite per-companion trail without filling all attack slots")
	check(battle.fx.size() <= Battle.MAX_FX - Battle.TREE_FX_RESERVE, "tree admission leaves twelve complete effect slots for closing and other attacks")
	var ids: Dictionary = {}
	for f in visible:
		ids[int(f.id)] = true
	var path: Array = u.sem_trail_path
	check(path.size() == visible.size() and path.all(func(v): return ids.has(int(v.get("fxid", -1)))), "every recorded path point belongs to a successfully emitted visible tree")
	var before: Array = path.duplicate(true)
	battle.run(game, u, 0.033, Vector2(9900, 0))
	check(u.sem_trail_path == before and _trees().size() == visible.size(), "rejected high-level growth does not record invisible walk points")
	visible[0].life = 0.0
	battle.run(game, u, 0.033, Vector2(9910, 0))
	check(not u.sem_trail_path.any(func(v): return int(v.get("fxid", -1)) == int(visible[0].id)), "expired tree bodies leave the recorded enclosure path")

func test_saturated_visible_loop() -> void:
	_clear_field()
	var u: Dictionary = game.kraft_add("森", 6)
	var position := Vector2(-160, -160)
	battle.run(game, u, 0.033, position)
	for next in [Vector2(160, -160), Vector2(160, 160), Vector2(-160, 160), Vector2(-160, -125)]:
		_walk_to(u, position, next)
		position = next
	check(battle.fx.all(func(f): return String(f.k) == "tree") and u.sem_trail_path.size() >= 20, "test route is still open and has an actual continuous visible 木 boundary")
	var tree_ids: Array = _trees().map(func(f): return int(f.id))
	while battle.fx.size() < Battle.MAX_FX - Battle.TREE_FX_RESERVE:
		battle._emit("rally", u, Vector2(4000, -4000), Vector2.RIGHT, 5.0, 30.0)
	var reserved: int = Battle.MAX_FX - battle.fx.size()
	check(reserved == 12, "saturated route begins with exactly twelve reserved effect slots")
	var trapped: Dictionary = game.spawn_enemy({"ch": "森"}, Vector2.ZERO)
	trapped.hp = 1000.0
	trapped.hp_max = 1000.0
	var outside: Dictionary = game.spawn_enemy({"ch": "草"}, Vector2(400, 0))
	outside.still = true
	outside.hp = 1000.0
	outside.hp_max = 1000.0
	_walk_to(u, position, Vector2(-160, -150))
	var loop: Array = battle.fx.filter(func(f): return String(f.k) == "wood_loop")
	var converge: Array = battle.fx.filter(func(f): return String(f.k) == "wood_converge")
	check(not loop.is_empty() and not converge.is_empty(), "closing an existing visible route still releases its 木 payoff when new planting is saturated")
	check(_trees().map(func(f): return int(f.id)) == tree_ids, "saturated loop closure preserves every existing tree instead of removing displayed letters")
	check(battle.fx.size() <= Battle.MAX_FX, "reserved enclosure release respects the global complete-effect budget")
	for j in 60:
		game.time += 0.03
		battle.tick(game, 0.03)
	check(trapped.hp < 1000.0 and outside.hp == 1000.0, "reserved visible 木 converge hits the enclosed enemy while outside grass remains unharmed")
