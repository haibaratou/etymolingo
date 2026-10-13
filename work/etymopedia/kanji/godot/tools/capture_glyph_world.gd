extends SceneTree
## Deterministic recordings of real gameplay: no replacement art or collider overlays.
var game: Node
var out_dir := "res://art/review/glyph-capture"
var case_name := "wood"
var frames := 0
var elapsed := 0.0
var capture_clock := 0.0
var capture_step := 0.08
var samples: Array = []

func _initialize() -> void:
	for arg in OS.get_cmdline_user_args():
		if arg.begins_with("--out="):
			out_dir = arg.substr(6)
		if arg.begins_with("--case="):
			case_name = arg.substr(7)
	call_deferred("_record")

func _wait(seconds: float) -> void:
	var t := 0.0
	while t < seconds:
		await process_frame
		var dt: float = minf(0.05, game.get_process_delta_time())
		t += dt
		elapsed += dt
		capture_clock += dt
		if capture_clock >= capture_step:
			capture_clock = 0.0
			await RenderingServer.frame_post_draw
			var result: int = root.get_texture().get_image().save_png("%s/frame_%04d.png" % [out_dir, frames])
			assert(result == OK)
			frames += 1
			samples.append({"time": elapsed, "game_time": game.time, "hero": [game.hero.x, game.hero.y], "hits": game.semantic_combat.hits, "fx": game.semantic_combat.fx.size(), "letters": game.semantic_combat.fx.map(func(f): return {"k": f.k, "p": f.p, "age": f.t, "glyphs": f.get("glyphs", [])}), "targets": game.E.filter(func(e): return e.alive).map(func(e): return {"id": e.id, "ch": e.ch, "p": [e.x, e.y], "rad": e.rad, "captive": e.captive, "locked": e.locked, "hp": e.get("hp", 0), "burn": e.get("kburn", 0), "visible": e.spr.visible if e.has("spr") else false})})

func _move(direction: Vector2, steps: int) -> void:
	var keycode: int = KEY_RIGHT if direction == Vector2.RIGHT else (KEY_LEFT if direction == Vector2.LEFT else (KEY_UP if direction == Vector2.UP else KEY_DOWN))
	var party_ids: Array = game.KU.map(func(u): return u.id)
	for i in steps:
		var press := InputEventKey.new()
		press.keycode = keycode
		press.physical_keycode = keycode
		press.pressed = true
		Input.parse_input_event(press)
		await process_frame
		var release := InputEventKey.new()
		release.keycode = keycode
		release.physical_keycode = keycode
		Input.parse_input_event(release)
		await _wait(0.22)
		assert(game.KU.map(func(u): return u.id) == party_ids, "Movement must never recreate companions")

func _target(ch: String, p: Vector2, health: int) -> Dictionary:
	var e: Dictionary = game.place_plant([ch, "", 1], p, Vector2i(1 << 20, 0))
	e.born = 1.0
	e.hp = health
	e.hp_max = health
	return e

func _record() -> void:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(out_dir))
	game = load("res://main.tscn").instantiate()
	root.add_child(game)
	while game.state == "boot":
		await process_frame
	game.start_kl()
	for e in game.E:
		e.alive = false
		if e.has("spr"):
			e.spr.visible = false
	game.kraft_clear()
	game.kl.glyph_demo = true
	game.kl.t = 0.0
	game.banner = null
	game.hero.state = "idle"
	game.hero.last_dir = Vector2.RIGHT
	game.hero.x = -165.0 * game.SF
	game.hero.y = 0.0
	game.cam = Vector2(game.hero.x, game.hero.y)
	game.test_mode.nosave = "1"
	match case_name:
		"fire":
			game.kl.demo_caption = "赤い「火」が草に当たり、小さな「火」がまとわりつく"
			game.kraft_add("炎", 1)
			var grass: Dictionary = _target("草", Vector2(35.0, 0.0) * game.SF, 18)
			_target("花", Vector2(115.0, -85.0) * game.SF, 16)
			await _wait(2.2)
			# Moving a burning word keeps its three little 火 attached to that word.
			grass.y -= 45.0 * game.SF
			await _wait(2.0)
			await _move(Vector2.RIGHT, 1)
			await _move(Vector2.LEFT, 1)
			await _wait(1.5)
		"wood", "forest":
			var ally: String = "森" if case_name == "forest" else "林"
			game.kl.demo_caption = "歩いた道に「木」が育つ。道を閉じると、内側へ木が迫る"
			game.hero.x = -165.0 * game.SF
			game.hero.y = 165.0 * game.SF
			game.kraft_add(ally, 1)
			_target("獣", Vector2.ZERO, 2)
			_target("草", Vector2(-265.0, -55.0) * game.SF, 14)
			await _wait(0.5)
			await _move(Vector2.RIGHT, 3)
			await _move(Vector2.UP, 3)
			await _move(Vector2.LEFT, 3)
			await _move(Vector2.DOWN, 3)
			await _wait(2.4)
		_:
			game.kl.demo_caption = "文字を組んだ攻撃 ― " + case_name
			game.kraft_add(case_name, 3)
			_target("獣", Vector2(45.0, 0.0) * game.SF, 30)
			_target("草", Vector2(110.0, -80.0) * game.SF, 14)
			await _wait(6.0)
	var report := {"case": case_name, "frames": frames, "duration": elapsed, "checks": game.semantic_combat.checks, "hits": game.semantic_combat.hits, "contact_trace": game.semantic_combat.contact_trace, "samples": samples}
	var f := FileAccess.open(out_dir + "/capture.json", FileAccess.WRITE)
	f.store_string(JSON.stringify(report, "\t"))
	print("[glyph-capture] case=%s frames=%d hits=%d" % [case_name, frames, game.semantic_combat.hits])
	quit(0)
