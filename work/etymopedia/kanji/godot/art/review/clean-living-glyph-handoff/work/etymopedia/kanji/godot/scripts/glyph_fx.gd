extends RefCounted
## Attacks are arrangements of living letters. This is also the collision geometry.
## Every point/radius is in battle coordinates; no texture or hidden area supplies damage.
const MAX_FORM_GLYPHS := 30
# Combat admits at most 72 complete effects. Existing formations never lose
# letters merely because another companion attacks.
const MAX_VISIBLE_GLYPHS := 72 * MAX_FORM_GLYPHS
const FIRE := Color(0.80, 0.12, 0.08)
const WATER := Color(0.13, 0.43, 0.69)
const WOOD := Color(0.22, 0.48, 0.25)
const LIGHT := Color(0.77, 0.49, 0.06)
const ICE := Color(0.30, 0.58, 0.72)
const METAL := Color(0.33, 0.37, 0.42)
const STONE := Color(0.42, 0.33, 0.24)
const THREAD := Color(0.62, 0.28, 0.29)
const INK := Color(0.26, 0.24, 0.23)

static func _put(out: Array, ch: String, p: Vector2, size: float, col: Color, hit: bool = true, rot: float = 0.0, sc: Vector2 = Vector2.ONE, slot: String = "") -> void:
	if out.size() >= MAX_FORM_GLYPHS or col.a <= 0.03 or size < 3.0:
		return
	out.append({"ch": ch, "p": p, "size": size, "rot": rot, "sc": sc, "col": col, "hit": hit, "radius": size * 0.38 * maxf(sc.x, sc.y), "slot": slot if not slot.is_empty() else str(out.size())})

static func _color(col: Color, alpha: float) -> Color:
	return Color(col, clampf(alpha, 0.0, 1.0))

static func _material(f: Dictionary) -> Color:
	var pr: Dictionary = f.get("u", {}).get("pr", {})
	match String(pr.get("eff", pr.get("body", "人"))):
		"炎": return FIRE
		"波", "bubble": return WATER
		"樹": return WOOD
		"光": return LIGHT
		"岩", "trample", "horn": return STONE
		"刃", "矢": return METAL
		"門": return STONE
	return INK

static func _ring(out: Array, ch: String, p: Vector2, r: float, count: int, size: float, col: Color, hit: bool, angle: float = 0.0) -> void:
	for j in count:
		var a: float = angle + TAU * float(j) / float(count)
		_put(out, ch, p + Vector2.from_angle(a) * r, size, col, hit, sin(a) * 0.055)

## The same forms are cached by combat and drawn unchanged after contacts resolve.
static func forms(g: Node, f: Dictionary) -> Array:
	var out: Array = []
	var sf: float = float(g.get("SF"))
	var p: Vector2 = f.get("p", Vector2.ZERO)
	var d: Vector2 = f.get("d", Vector2.RIGHT)
	var side: Vector2 = d.orthogonal()
	var r: float = float(f.get("r", 30.0 * sf))
	var age: float = float(f.get("t", 0.0))
	var life: float = float(f.get("life", 1.0))
	var lv: int = clampi(int(f.get("lv", 1)), 1, 6)
	var uid: int = int(f.get("id", 0))
	var u: Dictionary = f.get("u", {})
	var ch: String = String(u.get("ch", "字"))
	var k: String = String(f.get("k", ""))
	var alpha: float = clampf(minf(age / 0.10, life / 0.35), 0.0, 1.0)
	var active: bool = life >= 0.06 and alpha > 0.12
	var col: Color = _color(_material(f), alpha)
	var size: float = (29.0 + mini(lv, 4) * 1.3) * sf
	var phase: float = age * 7.0 + float(uid) * 1.7
	match k:
		"wood_loop":
			# The completed enclosure is a typographic path. Keep the interior empty.
			var path: Array = f.get("path", [])
			var perimeter: float = 0.0
			for j in path.size():
				perimeter += Vector2(path[j]).distance_to(Vector2(path[(j + 1) % path.size()]))
			if path.size() >= 3 and perimeter > 1.0:
				var count: int = mini(28, maxi(8, int(perimeter / (35.0 * sf))))
				for j in count:
					var along: float = perimeter * float(j) / float(count)
					var spot: Vector2 = Vector2(path[0])
					for seg in path.size():
						var a: Vector2 = Vector2(path[seg])
						var b: Vector2 = Vector2(path[(seg + 1) % path.size()])
						var length: float = a.distance_to(b)
						if along <= length:
							spot = a.lerp(b, along / maxf(0.01, length))
							break
						along -= length
					_put(out, "木", spot, 21.0 * sf, _color(WOOD, alpha * 0.85), false, sin(age * 3.0 + j) * 0.045)
		"wood_converge":
			_put(out, "木", p, 29.0 * sf, _color(WOOD, alpha), active, sin(age * 4.0 + uid) * 0.05, Vector2.ONE, "converge_head")
			for j in 2:
				var q: Vector2 = p - d * (23.0 + j * 21.0) * sf + side * sin(age * 5.0 - j) * 4.0 * sf
				_put(out, "木", q, (20.0 - j * 3.0) * sf, _color(WOOD, alpha * (0.75 - j * 0.14)), active, sin(age * 3.0 + j) * 0.07, Vector2.ONE, "converge_tail%d" % j)
		"water_link":
			_put(out, "水", p, 25.0 * sf, _color(WATER, alpha), active, sin(age * 5.0 + uid) * 0.05, Vector2.ONE, "water_link_head")
			_put(out, "水", p - d * 24.0 * sf + side * sin(age * 4.0) * 3.0 * sf, 16.0 * sf, _color(WATER, alpha * 0.69), active, sin(age * 4.0) * 0.07, Vector2.ONE, "water_link_tail")
		"tree", "rest", "thorn":
			# A pair is 林; three 木 form the triangular body of 森. They grow in place.
			var grown: float = clampf(age / 0.65, 0.35, 1.0)
			var trail: bool = bool(f.get("trail", false))
			var wood_count: int = 3 if ch == "森" else (2 if ch == "林" else 1)
			for material in u.get("pr", {}).get("traits", []):
				if String(material.get("family", "")) == "樹":
					wood_count = maxi(wood_count, int(material.get("count", 1)))
			wood_count = maxi(wood_count, int(f.get("wood", 1)))
			var n: int = mini(3, wood_count) if k == "tree" else 1
			var base_size: float = (31.0 if n == 1 else (24.0 if trail else 27.0)) * sf * grown
			var poses: Array = [Vector2.ZERO] if n == 1 else ([Vector2(-16.0, 0.0), Vector2(16.0, 0.0)] if n == 2 else [Vector2(0.0, -22.0), Vector2(-20.0, 12.0), Vector2(20.0, 12.0)])
			if trail and n == 3:
				poses = [Vector2(0.0, -15.0), Vector2(-14.0, 8.0), Vector2(14.0, 8.0)]
			for j in poses.size():
				var sway: float = sin(age * 1.7 + uid + j) * 0.045 * grown
				_put(out, "木" if k != "thorn" else "艹", p + Vector2(poses[j]) * sf * grown, base_size, _color(WOOD, alpha), active and age >= 0.45, sway, Vector2(1.0, 0.90 + 0.10 * grown))
			if k == "tree" and lv >= 3 and not trail:
				for j in 2:
					var branch: Vector2 = Vector2(-43.0 if j == 0 else 43.0, 24.0) * sf * grown
					_put(out, "木", p + branch, 20.0 * sf * grown, _color(WOOD, alpha * 0.70), active and age >= 0.65, sin(age + j) * 0.05)
			elif k == "tree" and lv >= 3 and trail:
				for j in 2:
					var twig: Vector2 = Vector2(-24.0 if j == 0 else 24.0, 23.0) * sf * grown
					_put(out, "木", p + twig, 14.0 * sf * grown, _color(WOOD, alpha * 0.64), active and age >= 0.65, sin(age + j) * 0.06)
			if k == "rest":
				_put(out, "人", p + Vector2(-27.0, 9.0) * sf, 22.0 * sf, _color(INK, alpha * 0.75), false, sin(age * 0.7) * 0.04)
		"flame", "burn":
			# Fire itself is the projectile. Flicker changes its posture, never its identity.
			var tint: Color = FIRE.lerp(Color(0.96, 0.29, 0.09), 0.16 + 0.12 * sin(phase))
			if k == "flame":
				var posture: Vector2 = Vector2(0.93 + sin(phase) * 0.07, 1.08 + cos(phase * 1.2) * 0.10)
				_put(out, "火", p + side * sin(phase) * 3.0 * sf, size, _color(tint, alpha), active, sin(phase * 0.9) * 0.095, posture, "fire_head")
				if lv >= 3:
					for j in 2:
						var q: Vector2 = p - d * (25.0 + j * 15.0) * sf + side * sin(phase - j) * 10.0 * sf
						_put(out, "火", q, (21.0 - j * 4.0) * sf, _color(FIRE, alpha * (0.75 - j * 0.16)), active, sin(phase - j) * 0.12, Vector2(0.9, 1.1), "fire_tail%d" % j)
			else:
				var count: int = 5 if lv >= 3 else 3
				for j in count:
					var a: float = float(j) * 2.39996 + uid
					var q: Vector2 = p + Vector2.from_angle(a) * minf(r * 0.68, 33.0 * sf) + Vector2(0.0, sin(phase + j) * 3.0 * sf)
					_put(out, "火", q, (21.0 + sin(phase + j) * 1.5) * sf, _color(tint, alpha * 0.93), active, sin(phase + j) * 0.08, Vector2(0.9, 1.15))
		"wave":
			var stream: bool = bool(f.get("stream", false))
			var width: float = minf(r * (0.7 + minf(1.0, age) * 0.45), 113.0 * sf)
			if stream:
				# River strokes flow in separate longitudinal lanes, not overlapping fans.
				for j in (5 if lv >= 3 else 3):
					var q: Vector2 = p - d * j * 32.0 * sf + side * sin(age * 3.0 - j * 0.6) * 4.0 * sf
					_put(out, "川", q, 23.0 * sf, _color(WATER, alpha * (1.0 - j * 0.10)), active, sin(age * 3.0 - j) * 0.045)
			else:
				var material_count: int = clampi(int(u.get("pr", {}).get("C", 1)), 1, 4)
				var lanes: int = mini(5, (1 if lv < 3 else (3 if lv < 5 else 5)) + material_count - 1)
				var lane_space: float = 65.0 * sf * clampf(float(u.get("pr", {}).get("A", 1.0)), 0.85, 2.4)
				var n: int = 5
				if lanes > 1:
					width = minf(width, lane_space * 0.30)
					n = 3 if lane_space >= 80.0 * sf else 2
				var rows: int = 2 if lv >= 3 else 1
				for row in rows:
					for j in n:
						var x: float = (float(j) / maxf(1.0, float(n - 1)) * 2.0 - 1.0) * width
						var q: Vector2 = p + side * x + d * (sin(age * 4.5 + j * 0.8 + row * 1.1) * 8.0 * sf - row * 34.0 * sf)
						_put(out, "水", q, (23.0 if row == 0 else 19.0) * sf, _color(WATER, alpha * (1.0 if row == 0 else 0.66)), active, sin(age * 3.0 + j) * 0.045)
		"thunder":
			var delay: float = float(f.get("delay", 0.58))
			var top: Vector2 = p - Vector2(0.0, 145.0 * sf)
			_put(out, "雲", top, 30.0 * sf, _color(INK, alpha * 0.72), false)
			if age < delay:
				_put(out, "雷", p, 22.0 * sf, _color(LIGHT, alpha * (0.22 + age / delay * 0.32)), false)
			else:
				var flash: float = clampf(1.0 - (age - delay) / 0.55, 0.0, 1.0)
				for j in 5:
					var q: Vector2 = top.lerp(p, float(j + 1) / 6.0) + Vector2(((-1.0 if j % 2 == 0 else 1.0) * 9.0 + sin(age * 24.0 + j) * 2.0) * sf, 0.0)
					_put(out, "電", q, 21.0 * sf, _color(LIGHT, alpha * flash), active and age <= delay + 0.30, 0.04 if j % 2 == 0 else -0.04)
				_put(out, "雷", p, 34.0 * sf, _color(LIGHT, alpha * flash), active and age <= delay + 0.30)
				if lv >= 3:
					for wing in [-1.0, 1.0]:
						for j in 3:
							var q: Vector2 = p + Vector2(wing * (j + 1) * 22.0, -55.0 + j * 19.0) * sf
							_put(out, "電", q, 18.0 * sf, _color(LIGHT, alpha * flash * 0.78), active and age <= delay + 0.30, wing * 0.08)
		"snow", "rain":
			var snow: bool = k == "snow"
			var count: int = 10 if lv >= 3 else 7
			var span: float = minf(r * 0.8, 116.0 * sf)
			_put(out, "雲", p - Vector2(0.0, 112.0 * sf), 28.0 * sf, _color(ICE if snow else WATER, alpha * 0.64), false)
			for j in count:
				var x: float = (float(j) / maxf(1.0, float(count - 1)) * 2.0 - 1.0) * span
				var y: float = fmod(age * (49.0 if snow else 118.0) * sf + j * 33.0 * sf, 153.0 * sf) - 93.0 * sf
				var q: Vector2 = p + Vector2(x + (sin(age * 2.1 + j) * 9.0 * sf if snow else 0.0), y)
				_put(out, "雪" if snow else "雨", q, (20.0 if snow else 19.0) * sf, _color(ICE if snow else WATER, alpha * 0.88), active and age >= (0.30 if snow else 0.25), sin(age + j) * 0.09 if snow else 0.0)
		"cut":
			var delay: float = float(f.get("delay", 0.0))
			var progress: float = clampf((age - delay) / 0.32, 0.0, 1.0)
			var span: float = float(f.get("span", 1.35))
			var a: float = d.angle() - span * 0.5 + progress * span
			# A moving blade, with a short readable arc of actual 刃 behind it.
			_put(out, "刀", p + Vector2.from_angle(a) * r * 0.88, 33.0 * sf, col, active and age >= delay, a * 0.18)
			for j in (6 if lv >= 3 else 4):
				var trail: float = a - float(j + 1) * 0.15
				var q: Vector2 = p + Vector2.from_angle(trail) * r * (0.86 - float(j % 2) * 0.12)
				_put(out, "刃", q, (24.0 - j * 1.4) * sf, _color(_material(f), alpha * (0.80 - j * 0.08)), active and age >= delay, trail * 0.16)
		"net":
			var grow: float = clampf(age / 0.3, 0.2, 1.0)
			var reach: float = minf(r * 0.8, 73.0 * sf) * grow
			var n: int = 4 if lv >= 3 else 3
			for y in n:
				for x in n:
					var q: Vector2 = p + Vector2((float(x) / float(n - 1) * 2.0 - 1.0) * reach, (float(y) / float(n - 1) * 2.0 - 1.0) * reach * 0.8)
					_put(out, "糸", q, 20.0 * sf, _color(THREAD, alpha * 0.91), active and age >= 0.25, sin(age * 1.6 + x + y) * 0.03)
		"shelter":
			var reach: float = minf(r * 0.65, 76.0 * sf)
			_put(out, "宀", p - Vector2(0.0, reach * 0.78), 33.0 * sf, col, active and age > 0.2)
			for wing in [-1.0, 1.0]:
				for j in (3 if lv >= 3 else 2):
					_put(out, "守", p + Vector2(wing * reach, (-0.42 + j * 0.58) * reach), 23.0 * sf, col, active and age > 0.2)
		"gust":
			for j in (5 if lv >= 3 else 3):
				var q: Vector2 = p - d * j * 24.0 * sf + side * sin(age * 7.0 - j * 1.0) * minf(r * 0.48, 35.0 * sf)
				_put(out, "風", q, (30.0 - j * 2.5) * sf, _color(Color(0.23, 0.48, 0.43), alpha * (1.0 - j * 0.10)), active, sin(age * 5.0 - j) * 0.18)
		"rock":
			var delay: float = float(f.get("delay", 0.55))
			var drop: float = clampf(age / delay, 0.0, 1.0)
			var q: Vector2 = p - Vector2(0.0, (1.0 - drop * drop) * 220.0 * sf)
			_put(out, "岩", q, 37.0 * sf, _color(STONE, alpha), active and age >= delay, sin(age * 3.0) * 0.06)
			if lv >= 3:
				for wing in [-1.0, 1.0]:
					_put(out, "石", q + Vector2(wing * 29.0, 15.0) * sf, 24.0 * sf, _color(STONE, alpha * 0.85), active and age >= delay, wing * 0.08)
		"mend", "rally":
			var progress: float = clampf(age / 1.2, 0.0, 1.0)
			var reach: float = r * (1.0 - progress) if k == "mend" else r * progress
			_ring(out, "生" if k == "mend" else "人", p, reach, 8 if lv >= 3 else 5, 22.0 * sf, _color(WOOD if k == "mend" else STONE, alpha * 0.8), active and age >= 0.25, age * 0.18)
			_put(out, "心" if k == "mend" else "众", p, 29.0 * sf * (1.0 + sin(age * 6.0) * 0.055), _color(WOOD if k == "mend" else STONE, alpha), false)
		"sun":
			_put(out, "日", p - Vector2(0.0, 70.0 * sf), 34.0 * sf, _color(LIGHT, alpha), false)
			var progress: float = clampf((age - float(f.get("delay", 0.0))) / 0.85, 0.0, 1.0)
			_ring(out, "光", p, r * progress, 12 if lv >= 3 else 8, 22.0 * sf, _color(LIGHT, alpha * 0.84), active and age >= float(f.get("delay", 0.0)) + 0.25)
		"ray":
			var n: int = mini(12, maxi(4, int(r / (41.0 * sf))))
			for j in n:
				_put(out, "光", p + d * (float(j + 1) / float(n) * r), (26.0 if j == n - 1 else 21.0) * sf, _color(LIGHT, alpha * (0.72 + float(j) / float(n) * 0.25)), active, sin(age * 12.0 + j) * 0.04)
		"seed":
			var progress: float = clampf(age / maxf(0.01, float(f.get("max", 0.85))), 0.0, 1.0)
			var q: Vector2 = p.lerp(Vector2(f.get("goal", p)), progress) - Vector2(0.0, sin(progress * PI) * 90.0 * sf)
			_put(out, "艹", q, 22.0 * sf, _color(WOOD, alpha), active, sin(progress * PI) * 0.25)
		"pounce":
			_put(out, "虎" if ch.contains("虎") else "犬", p, 34.0 * sf, col, active, sin(age * 8.0) * 0.09)
			if lv >= 3:
				for j in 3:
					_put(out, "爪", p - d * (22.0 + j * 18.0) * sf + side * (j - 1) * 13.0 * sf, 21.0 * sf, _color(_material(f), alpha * (0.75 - j * 0.12)), active, d.angle() * 0.10)
		"feather":
			_put(out, "鳥", p, 25.0 * sf, col, active, sin(age * 10.0 + uid) * 0.15, Vector2(1.0, 0.95 + sin(age * 10.0 + uid) * 0.08))
		"heart":
			var gather: float = float(f.get("gather", 0.62))
			_put(out, "心", p, 31.0 * sf * (1.0 + sin(age * 9.0) * 0.10), _color(FIRE, alpha), false)
			var reach: float = r * (1.0 - age / gather) if age < gather else r * clampf((age - gather) / 0.65, 0.0, 1.0)
			_ring(out, "心", p, reach, 10 if lv >= 3 else 6, 21.0 * sf, _color(FIRE, alpha * 0.80), active and age > gather)
		"inscribe", "followthrough":
			var progress: float = clampf(age / (0.24 if k == "followthrough" else 0.45), 0.0, 1.0)
			var reach: float = r * progress
			var lead: String = "言" if k == "inscribe" else ("刀" if String(f.get("source", "")) == "刃" else "矢")
			_put(out, lead, p + d * reach, 28.0 * sf, col, active, d.angle() * 0.12)
			for j in (4 if lv >= 3 else 2):
				_put(out, "文" if k == "inscribe" else lead, p + d * maxf(0.0, reach - (j + 1) * 28.0 * sf), (21.0 - j * 1.5) * sf, _color(_material(f), alpha * (0.76 - j * 0.12)), active, sin(age * 4.0 + j) * 0.04)
		"annihilate":
			var gather: float = float(f.get("gather", 1.05))
			var width: float = float(f.get("width", 72.0 * sf))
			if age < gather:
				var progress: float = age / gather
				_put(out, "滅", p + d * 34.0 * sf, (30.0 + progress * 7.0) * sf, _color(WATER, alpha), false)
				for wing in [-1.0, 1.0]:
					for j in 4:
						var q: Vector2 = p + d * (65.0 + j * 35.0) * sf + side * wing * width * (1.3 - progress * 0.65)
						_put(out, "水", q, 22.0 * sf, _color(WATER, alpha * (0.65 + j * 0.06)), false, sin(age * 4.0 + j) * 0.045)
				_put(out, "火", p + d * 24.0 * sf + side * 26.0 * sf, 20.0 * sf, _color(FIRE, alpha * 0.80), false, sin(phase) * 0.08)
				_put(out, "戈", p + d * 24.0 * sf - side * 26.0 * sf, 23.0 * sf, _color(METAL, alpha * 0.80), false)
			else:
				var progress: float = clampf((age - gather) / 0.75, 0.0, 1.0)
				var reach: float = r * progress
				_put(out, "滅", p + d * reach, 38.0 * sf, _color(WATER, alpha), active, sin(age * 7.0) * 0.025, Vector2.ONE, "annihilate_head")
				var lanes: int = 3 if lv >= 3 else 2
				for row in lanes:
					for j in 8:
						var dist: float = reach - (j + 1) * 43.0 * sf
						if dist < 28.0 * sf:
							continue
						var lateral: float = (float(row) - float(lanes - 1) * 0.5) * width * 0.56
						var q: Vector2 = p + d * dist + side * (lateral + sin(age * 7.0 - j * 0.9 + row) * 6.0 * sf)
						_put(out, "水", q, (23.0 if row == 1 else 21.0) * sf, _color(WATER, alpha * (0.93 - j * 0.025)), active, sin(age * 4.0 + j) * 0.04, Vector2.ONE, "water%d_%d" % [row, j])
				_put(out, "火", p + d * maxf(25.0 * sf, reach - 31.0 * sf) + side * width * 0.74, 23.0 * sf, _color(FIRE, alpha * 0.86), active, sin(phase) * 0.085, Vector2.ONE, "inherited_fire")
				_put(out, "戈", p + d * maxf(25.0 * sf, reach - 31.0 * sf) - side * width * 0.74, 25.0 * sf, _color(METAL, alpha * 0.86), active, d.angle() * 0.14, Vector2.ONE, "inherited_cut")
		"bomb":
			var delay: float = float(f.get("delay", 1.0))
			if age < delay:
				_put(out, "爆", p, (29.0 + age / delay * 6.0) * sf, _color(FIRE, alpha), false, sin(age * 15.0) * 0.035)
				_ring(out, "火", p, (38.0 - age / delay * 17.0) * sf, 4, 17.0 * sf, _color(FIRE, alpha * 0.65), false, age * 0.3)
			else:
				var progress: float = clampf((age - delay) / 0.50, 0.0, 1.0)
				var opacity: float = alpha * (1.0 - progress * 0.45)
				_ring(out, "火", p, r * progress, 16 if lv >= 3 else 10, 24.0 * sf, _color(FIRE, opacity), active and age <= delay + 0.70, age * 0.12)
				if lv >= 3:
					_ring(out, "火", p, r * progress * 0.58, 8, 19.0 * sf, _color(FIRE, opacity * 0.72), active and age <= delay + 0.70, 0.2)
		"cage":
			var reach: float = minf(r * 0.78, 82.0 * sf) * clampf(age / 0.4, 0.2, 1.0)
			_put(out, "囚", p, 27.0 * sf, _color(STONE, alpha * 0.60), false)
			for j in 8:
				var a: float = float(j) * TAU / 8.0
				var q: Vector2 = p + Vector2(cos(a), sin(a)) * reach / maxf(absf(cos(a)), absf(sin(a)))
				_put(out, "囗", q, 25.0 * sf, _color(STONE, alpha), active and age >= 0.4)
		"haze":
			var spirit: bool = bool(f.get("spirit", false))
			var tint: Color = Color(0.32, 0.43, 0.52) if not spirit else INK
			_put(out, "月" if not spirit else "霊", p - Vector2(0.0, 70.0 * sf), 31.0 * sf, _color(tint, alpha * 0.72), false)
			for j in (8 if lv >= 3 else 5):
				var a: float = j * 2.39996 + age * 0.18
				var q: Vector2 = p + Vector2.from_angle(a) * minf(r * 0.8, 143.0 * sf) * (0.63 + 0.22 * sin(age + j))
				_put(out, "月" if not spirit else "魂", q, 24.0 * sf, _color(tint, alpha * (0.38 + sin(age * 1.2 + j) * 0.12)), active, sin(age * 0.4 + j) * 0.08)
		"calamity":
			var delay: float = float(f.get("delay", 0.65))
			var fire: bool = String(f.get("element", "波")) == "炎"
			if age < delay:
				_put(out, "災", p, 22.0 * sf, _color(STONE, alpha * 0.40), false)
			else:
				_put(out, "火" if fire else "水", p, 32.0 * sf, _color(FIRE if fire else WATER, alpha), active, sin(phase) * 0.08)
				for j in (4 if lv >= 3 else 2):
					var a: float = float(j) * TAU / (4.0 if lv >= 3 else 2.0)
					_put(out, "火" if fire else "水", p + Vector2.from_angle(a) * 33.0 * sf, 22.0 * sf, _color(FIRE if fire else WATER, alpha * 0.76), active, sin(phase + j) * 0.06)
		"arrow":
			_put(out, "矢", p, 31.0 * sf, col, active and not bool(f.get("done", false)), d.angle() * 0.16)
			if lv >= 3:
				_put(out, "弓", p - d * 28.0 * sf, 19.0 * sf, _color(_material(f), alpha * 0.65), active and not bool(f.get("done", false)), d.angle() * 0.10)
		"moon":
			for j in (3 if lv >= 3 else 1):
				var a: float = float(f.get("angle", 0.0)) + j * TAU / 3.0
				_put(out, "月", p + Vector2.from_angle(a) * r, 29.0 * sf, _color(Color(0.38, 0.47, 0.58), alpha), active, sin(age + j) * 0.06)
		"echo":
			var delay: float = float(f.get("delay", 0.0))
			if age >= delay:
				var reach: float = r * clampf((age - delay) / 0.8, 0.0, 1.0)
				_ring(out, "口" if String(u.get("pr", {}).get("body", "")) == "声" else "音", p, reach, 12 if lv >= 3 else 8, 22.0 * sf, col, active)
		"dragon":
			var count: int = mini(14, int(f.get("segments", 8)))
			for j in count:
				var a: float = float(f.get("angle", 0.0)) - j * 0.19
				var reach: float = r * (1.0 + 0.13 * sin(age * 2.5 - j * 0.5))
				var q: Vector2 = p + Vector2.from_angle(a) * reach
				_put(out, "龍", q, (34.0 if j == 0 else 25.0 - j * 0.35) * sf, _color(_material(f), alpha * (1.0 - j * 0.032)), active, sin(a) * 0.11)
		"protect":
			_put(out, "守", p + d * r * 0.6, 34.0 * sf, col, false, sin(age * 4.0) * 0.04)
		"afterlight":
			var target: Dictionary = f.get("e", {})
			var q: Vector2 = g.enemy_visual_point(target) if g.has_method("enemy_visual_point") and not target.is_empty() else Vector2(float(target.get("x", p.x)), float(target.get("y", p.y)))
			_put(out, "光", q + Vector2(0.0, -8.0 * sf), 24.0 * sf, _color(LIGHT, alpha), active and age >= float(f.get("delay", 0.4)) and bool(target.get("alive", false)))
		"impact":
			# Brief contact punctuation is tiny and translucent; the attack remains the focus.
			var material: String = String(u.get("pr", {}).get("eff", ""))
			var mark: String = "火" if material == "炎" else ("水" if material == "波" else ("木" if material == "樹" else "丶"))
			_put(out, mark, p + d * age * 14.0 * sf, 14.0 * sf, _color(_material(f), alpha * 0.38), false, age * 0.15)
		"cling":
			var target: Dictionary = f.get("e", {})
			if bool(target.get("alive", false)) and float(target.get("kburn", 0.0)) > 0.0:
				var q: Vector2 = g.enemy_visual_point(target) if g.has_method("enemy_visual_point") else Vector2(float(target.get("x", p.x)), float(target.get("y", p.y)))
				var target_size: float = float(target.get("size", 40.0 * sf))
				for j in 3:
					var a: float = -PI * 0.65 + j * TAU / 3.0 + sin(age * 3.0 + j) * 0.12
					var off: Vector2 = Vector2.from_angle(a) * target_size * 0.36 + Vector2(0.0, sin(phase + j) * 2.0 * sf)
					_put(out, "火", q + off, (12.0 + sin(phase + j)) * sf, _color(FIRE, 0.9), false, sin(phase + j) * 0.10, Vector2(0.9, 1.13), "cling%d" % j)
	return out

## Persistent status letters attach to the actual remaining enemy part, never the old image.
## There are at most three status types; 火 has priority and is always visibly red.
static func status_forms(g: Node, e: Dictionary, include_fire: bool = true) -> Array:
	var out: Array = []
	if not bool(e.get("alive", false)):
		return out
	var sf: float = float(g.get("SF"))
	var now: float = float(g.get("time"))
	var p: Vector2 = g.enemy_visual_point(e) if g.has_method("enemy_visual_point") else Vector2(float(e.get("x", 0.0)), float(e.get("y", 0.0)))
	var rad: float = maxf(14.0 * sf, float(e.get("size", 40.0 * sf)) * 0.38)
	var types: int = 0
	var phase: float = now * 7.0 + float(e.get("id", 0)) * 1.7
	var burning: bool = float(e.get("kburn", 0.0)) > 0.0
	if include_fire and burning:
		for j in 3:
			var a: float = -PI * 0.65 + j * TAU / 3.0 + sin(now * 3.0 + j) * 0.12
			_put(out, "火", p + Vector2.from_angle(a) * rad + Vector2(0.0, sin(phase + j) * 2.0 * sf), (12.0 + sin(phase + j)) * sf, _color(FIRE, 0.92), false, sin(phase + j) * 0.10, Vector2(0.90, 1.13))
		types += 1
	elif burning:
		# A cling effect already drew 火; it still counts toward the three-type limit.
		types = 1
	if float(e.get("kwet", 0.0)) > now and types < 3:
		_put(out, "水", p + Vector2(rad * 0.9, rad * 0.6), 13.0 * sf, _color(WATER, 0.86), false, sin(now * 2.0) * 0.045)
		types += 1
	if float(e.get("kroot", 0.0)) > now and types < 3:
		_put(out, "木", p + Vector2(0.0, rad * 0.85), 14.0 * sf, _color(WOOD, 0.9), false)
		types += 1
	if float(e.get("sem_frost", 0.0)) > now and types < 3:
		_put(out, "雪", p + Vector2(-rad * 0.88, rad * 0.45), 13.0 * sf, _color(ICE, 0.85), false, sin(now) * 0.06)
		types += 1
	if float(e.get("sem_bind", 0.0)) > now and types < 3:
		_put(out, "糸", p + Vector2(-rad * 0.87, -rad * 0.35), 13.0 * sf, _color(THREAD, 0.86), false)
		types += 1
	return out

static func _draw_form(g: Node, ci: CanvasItem, body: Dictionary) -> void:
	# A hairline paper rim keeps strokes legible where enemies cross them.
	# It is not a luminous disk, opaque plaque, or second visual attack body.
	var tint: Color = body.col
	g.glyph(ci, String(body.ch), Vector2(body.p), float(body.size), tint, Color(0.97, 0.95, 0.88, tint.a * 0.55), 0.7 * float(g.get("SF")), float(body.get("rot", 0.0)), Vector2(body.get("sc", Vector2.ONE)))

## Small character punctuation for legacy contacts. It never supplies collision geometry.
static func draw_impact(g: Node, ci: CanvasItem, effect: String, p: Vector2, r: float, alpha: float, seed: float = 0.0) -> void:
	var out: Array = []
	var sf: float = float(g.get("SF"))
	var ch: String = "丶"
	var col: Color = INK
	match effect:
		"炎", "火": ch = "火"; col = FIRE
		"波", "bubble", "水": ch = "水"; col = WATER
		"樹", "木": ch = "木"; col = WOOD
		"光", "日": ch = "光"; col = LIGHT
		"刃", "claw": ch = "刃"; col = METAL
		"矢": ch = "矢"; col = METAL
		"声": ch = "口"
		"岩", "horn", "trample": ch = "石"; col = STONE
		"peck": ch = "鳥"
		"sting": ch = "虫"
		"bite", "獣": ch = "爪"
		"門": ch = "囗"; col = STONE
		"霊": ch = "魂"
	_put(out, ch, p + Vector2.from_angle(seed) * minf(r * 0.2, 5.0 * sf), 15.0 * sf, _color(col, alpha * 0.7), false, sin(seed) * 0.09)
	for letter in out:
		_draw_form(g, ci, letter)

static func draw(g: Node, ci: CanvasItem, effects: Array) -> void:
	var clinging: Dictionary = {}
	for f in effects:
		var body: Array = f.glyphs if f.has("glyphs") else forms(g, f)
		for letter in body:
			_draw_form(g, ci, letter)
		if String(f.get("k", "")) == "cling" and not body.is_empty():
			clinging[int(f.get("e", {}).get("id", -1))] = true
	var enemies: Variant = g.get("E")
	if enemies is Array:
		var status_budget: int = 150
		for e in enemies:
			if status_budget <= 0:
				break
			for letter in status_forms(g, e, not clinging.has(int(e.get("id", -1)))):
				_draw_form(g, ci, letter)
				status_budget -= 1
	ci.draw_set_transform_matrix(Oracle.BASE)
