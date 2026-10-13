extends RefCounted
## Characters form the world: solid 壁, a typeable 門, an actual open passage.
## Independent from combat profiles and the dictionary crafting recipes.
const Data = preload("res://scripts/kd.gd")

var rooms: Array = []
var stages: Dictionary = {}
var previous_enemies: Dictionary = {}

func clear() -> void:
	rooms.clear()
	stages.clear()
	previous_enemies.clear()

func tick(g, dt: float) -> void:
	if g.state != "play" or g.test_mode.has("nofield"):
		return
	if (g.lab_on or g.test_mode.has("kl")) and not g.test_mode.has("glyphworld"):
		return
	var stage: int = g.stage_i()
	if not stages.has(stage) and g.boss == null:
		stages[stage] = true
		spawn_room(g, g.stage_origin + Vector2(430, -30) * g.SF)
	for room in rooms:
		_ensure_gate(g, room)
		room.open_t = min(1.0, float(room.open_t) + dt * 1.8) if room.open else 0.0
	# Enemy knockback and charges use the same solid boundary as the player.
	# Continuous segment checks prevent a fast glyph tunnelling through a wall.
	var live: Dictionary = {}
	for e in g.E:
		if not e.alive or e.is_boss or e.get("still", false) or e.get("obj", "") != "":
			continue
		var id: int = int(e.id)
		var p: Vector2 = Vector2(e.x, e.y)
		var prev: Vector2 = previous_enemies.get(id, p)
		var fixed: Vector2 = block(g, prev, p, min(26.0 * g.SF, float(e.rad) * 0.55))
		if fixed.distance_squared_to(p) > 0.01:
			e.x = fixed.x
			e.y = fixed.y
			e.kx *= 0.15
			e.ky *= 0.15
		live[id] = fixed
	previous_enemies = live

func spawn_room(g, center: Vector2) -> Dictionary:
	stages[g.stage_i()] = true
	var s: float = g.SF
	var hx: float = 195.0 * s
	var hy: float = 150.0 * s
	var thick: float = 22.0 * s
	var gap: float = 112.0 * s
	var x0: float = center.x - hx
	var x1: float = center.x + hx
	var y0: float = center.y - hy
	var y1: float = center.y + hy
	var walls: Array = [
		Rect2(x0, y0 - thick * 0.5, hx * 2, thick),
		Rect2(x0, y1 - thick * 0.5, hx * 2, thick),
		Rect2(x1 - thick * 0.5, y0, thick, hy * 2),
		Rect2(x0 - thick * 0.5, y0, thick, hy - gap * 0.5),
		Rect2(x0 - thick * 0.5, center.y + gap * 0.5, thick, hy - gap * 0.5),
	]
	var gate: Dictionary = g.spawn_enemy({"ch": "門", "en": "gate"}, Vector2(x0, center.y), "still")
	gate.still = true
	gate.obj = "glyph_gate"
	gate.glyph_gate = true
	gate.rest = 0.0
	gate.rest_max = 99999.0
	gate.size = 65.0 * s
	gate.rad = 28.0 * s
	gate.spd = 0.0
	gate.born = 1.0
	g.set_word(gate, "gate")
	var room = {
		"center": center, "walls": walls,
		"gate_rect": Rect2(x0 - thick * 0.5, center.y - gap * 0.5, thick, gap),
		"gate": gate, "open": false, "open_t": 0.0, "reward": null,
		"bounds": Rect2(x0, y0, hx * 2, hy * 2),
	}
	rooms.append(room)
	return room

## Field chunks and stage scenery may unload independently of this module.
## The gate is persistent scenery, so the solid doorway can never lose its
## typing target and strand the player outside a closed ruin.
func _ensure_gate(g, room: Dictionary) -> void:
	var gate: Dictionary = room.gate
	if gate.alive and g.E.has(gate):
		return
	gate.alive = true
	gate.locked = false
	gate.still = true
	gate.obj = "glyph_gate"
	gate.rest = gate.rest_max if room.open else 0.0
	if not g.E.has(gate):
		g.E.append(gate)
	if gate.has("spr") and (not is_instance_valid(gate.spr) or gate.spr.is_queued_for_deletion()):
		gate.erase("spr")
	g._make_sprite(gate)

## Called before the normal object switch. A gate is scenery and stays alive.
func use(g, target: Dictionary) -> bool:
	if target.get("obj", "") != "glyph_gate":
		return false
	for room in rooms:
		if room.gate != target:
			continue
		if room.open:
			return true
		room.open = true
		room.open_t = 0.0
		target.locked = false
		target.typed = ""
		g.set_node(target, Data.mk_node("開"))
		target.rest = target.rest_max
		target.flash = 0.5
		target.pulse = 1.0
		# The existing 宝 object supplies the normal reward interaction.
		room.reward = g.place_obj("宝", room.center + Vector2(50, 0) * g.SF, Vector2i(1 << 20, 3))
		g.add_text(target.x, target.y - 75 * g.SF, "門 → 開　道が開いた", 19 * g.SF + 4, Data.KIN, 1.8)
		g.set_hint("壁は通れない。開いた門から入り、宝の字を打つ", 6.0)
		g.sfx.play("brush", -8, 0.8)
		return true
	return false

func _solids() -> Array:
	var solids: Array = []
	for room in rooms:
		solids.append_array(room.walls)
		if not room.open:
			solids.append(room.gate_rect)
	return solids

## Slab intersection. A returned value of 2 means no contact on this segment.
func _entry(rect: Rect2, a: Vector2, b: Vector2) -> float:
	var d: Vector2 = b - a
	var enter := 0.0
	var leave := 1.0
	for axis in 2:
		var origin: float = a[axis]
		var delta: float = d[axis]
		var low: float = rect.position[axis]
		var high: float = rect.end[axis]
		if abs(delta) < 0.00001:
			if origin < low or origin > high:
				return 2.0
		else:
			var t0: float = (low - origin) / delta
			var t1: float = (high - origin) / delta
			if t0 > t1:
				var swap: float = t0
				t0 = t1
				t1 = swap
			enter = max(enter, t0)
			leave = min(leave, t1)
			if enter > leave:
				return 2.0
	return enter if enter >= 0.0 and enter <= 1.0 else 2.0

func can_reach(_g, from: Vector2, to: Vector2) -> bool:
	for solid in _solids():
		if _entry(solid, from, to) <= 1.0:
			return false
	return true

func block(_g, from: Vector2, to: Vector2, radius: float) -> Vector2:
	var contact := 2.0
	for solid in _solids():
		var expanded: Rect2 = solid.grow(radius)
		# A newly spawned glyph inside a boundary should be ejected to its
		# nearest edge instead of becoming trapped there forever.
		if expanded.has_point(from):
			var distances: Array = [abs(from.x - expanded.position.x), abs(expanded.end.x - from.x), abs(from.y - expanded.position.y), abs(expanded.end.y - from.y)]
			var side: int = distances.find(distances.min())
			var fixed: Vector2 = from
			match side:
				0: fixed.x = expanded.position.x - 0.1
				1: fixed.x = expanded.end.x + 0.1
				2: fixed.y = expanded.position.y - 0.1
				3: fixed.y = expanded.end.y + 0.1
			return fixed
		contact = min(contact, _entry(expanded, from, to))
	return from.lerp(to, max(0.0, contact - 0.0002)) if contact <= 1.0 else to

func draw(g, ci: CanvasItem) -> void:
	var s: float = g.SF
	var col: Color = Data.WASHI if g.night > 0.5 else Data.SUMI
	for room in rooms:
		var center: Vector2 = room.center
		if not g.on_view(center.x, center.y, -450 * s):
			continue
		# Architecture is made of the actual wall glyph, with open paper
		# between the four sides. No unrelated particle shapes hide the words.
		for wall in room.walls:
			var horizontal: bool = wall.size.x > wall.size.y
			var extent: float = wall.size.x if horizontal else wall.size.y
			var n: int = max(2, int(extent / (42 * s)))
			for j in n:
				var p: Vector2 = wall.position + wall.size * 0.5
				var d: float = (float(j) / max(1, n - 1) - 0.5) * (extent - 25 * s)
				p += Vector2(d, 0) if horizontal else Vector2(0, d)
				g.glyph(ci, "壁", p, 31 * s, Color(col, 0.78), Color.TRANSPARENT, 0)
		var gp: Vector2 = Vector2(room.gate.x, room.gate.y)
		if room.open:
			# 開 may be outside the original enemy texture atlas. Font drawing
			# keeps the actual open-gate glyph visible independently of it.
			g.glyph(ci, "開", gp, 52 * s, Color(Data.KIN, 0.95), Color(Data.WASHI if g.night < 0.5 else Data.YORU, 0.9), 3 * s)
			# Opening moves the two leaves aside; the living 開 remains visible.
			var k: float = smoothstep(0.0, 1.0, float(room.open_t))
			for side in [-1, 1]:
				var p: Vector2 = gp + Vector2(0, side * (34 + 26 * k) * s)
				g.glyph(ci, "門", p, 30 * s, Color(Data.KIN, 0.45), Color.TRANSPARENT, 0, side * k * 0.22)
			g.txt(ci, g.UF, gp.x, gp.y + 89 * s, "開 — 通り抜けられる", 12 * s + 2, Data.KIN, 1)
		else:
			g.txt(ci, g.UF, gp.x, gp.y + 84 * s, "門を打つと開く", 12 * s + 2, Data.KIN, 1)
		g.txt(ci, g.UF, center.x, room.bounds.position.y - 50 * s, "字でできた古城", 13 * s + 3, Color(col, 0.6), 1)
