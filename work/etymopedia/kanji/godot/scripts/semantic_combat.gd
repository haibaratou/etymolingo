extends RefCounted
## Meaning supplies the motion; the actual radical and material traits supply contact effects.
## All damage goes through main.k_hit, so HP depletion still removes one component.
## Own effects are bounded and do not alter the original oracle-bone glyph data.
const Kraft = preload("res://scripts/kraft.gd")
const GlyphFX = preload("res://scripts/glyph_fx.gd")
const MOTIONS = ["plant", "blaze", "tide", "thunder", "snowfall", "cleave", "weave", "shelter", "gust", "boulder", "rest", "mend", "radiance", "scatter_seed", "pounce", "flock", "rally", "heart_pulse", "inscribe", "rainfall", "annihilate", "detonate", "cage", "haze", "calamity", "shoot", "orbit", "burst", "aura", "dragon", "spread"]
const MAX_FX := 72
var fx: Array = []
var next_id := 0
var checks := 0
var hits := 0
var contact_trace: Array = []
var inherited_trace: Array = []

func clear() -> void:
	fx.clear()
	checks = 0
	hits = 0
	contact_trace.clear()
	inherited_trace.clear()

func handles(motion: String) -> bool:
	return MOTIONS.has(motion)

func _dir(m: Node) -> Vector2:
	var d: Vector2 = m.hero.get("last_dir", Vector2.ZERO)
	if d.length_squared() < 0.01:
		d = Vector2(float(m.hero.get("face", 1)), 0.0)
	return d.normalized()

func _scale(u: Dictionary) -> float:
	return clampf(float(u.pr.get("A", 1.0)), 0.85, 2.4)

func _lv(u: Dictionary) -> int:
	return clampi(int(u.get("lv", 1)), 1, 6)

func _emit(k: String, u: Dictionary, p: Vector2, d: Vector2, life: float, r: float, extra: Dictionary = {}) -> Dictionary:
	if fx.size() >= MAX_FX:
		return {}
	next_id += 1
	var f: Dictionary = {"id": next_id, "k": k, "u": u, "p": p, "d": d, "t": 0.0, "life": life, "max": life, "r": r, "lv": _lv(u), "hit": {}, "pulse": 0.0}
	f.merge(extra, true)
	fx.append(f)
	return f

func _count(u: Dictionary, kind: String) -> int:
	var n: int = 0
	for f in fx:
		if f.u == u and f.k == kind:
			n += 1
	return n

## Return true only for the motions this module supplies. Main advances u.cd/u.t.
func run(m: Node, u: Dictionary, dt: float, hp0: Vector2) -> bool:
	var motion: String = String(u.pr.get("motion", ""))
	if not handles(motion):
		return false
	var sf: float = float(m.SF)
	var lv: int = _lv(u)
	var a: float = _scale(u)
	var d: Vector2 = _dir(m)
	var side: Vector2 = d.orthogonal()
	if motion == "plant":
		_plant(m, u, hp0)
		return true
	if motion == "rest":
		_rest(m, u, dt, hp0)
		return true
	if u.cd > 0.0:
		return true
	var inherited_count: int = clampi(int(u.pr.get("C", 1)), 1, 4)
	var lanes: int = mini(5, (1 if lv < 3 else (3 if lv < 5 else 5)) + inherited_count - 1)
	match motion:
		"blaze":
			u.cd = 1.6
			for j in lanes:
				var aim: Vector2 = d.rotated((float(j) - float(lanes - 1) * 0.5) * 0.25)
				_emit("flame", u, hp0 + aim * 30.0 * sf, aim, 0.8 + lv * 0.045, (24.0 + lv * 4.0) * sf * a, {"speed": (380.0 + lv * 20.0) * sf})
			m.ksfx("dash", -18.0, 0.8)
		"tide":
			u.cd = 2.4
			var streams: bool = ["河", "江", "洲", "州", "順", "渓"].has(String(u.ch))
			var count: int = 3 if streams else lanes
			for j in count:
				var off: float = (float(j) - float(count - 1) * 0.5) * (42.0 if streams else 65.0) * sf * a
				_emit("wave", u, hp0 + side * off + d * 25.0 * sf, d, 1.45 + lv * 0.12, (38.0 if streams else 75.0 + lv * 15.0) * sf * a, {"speed": 270.0 * sf, "stream": streams})
			m.ksfx("soft", -18.0, 0.8)
		"thunder":
			u.cd = 3.6
			for j in lanes:
				var p: Vector2 = hp0 + d * (155.0 + j % 2 * 55.0) * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 105.0 * sf * a
				_emit("thunder", u, p, d, 1.45 + j * 0.08, (66.0 + lv * 9.0) * sf * a, {"delay": 0.58 + j * 0.08})
		"snowfall":
			u.cd = 4.8
			for j in lanes:
				var p: Vector2 = hp0 + d * 125.0 * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 105.0 * sf * a
				_emit("snow", u, p, d, minf(6.0, 3.5 * float(u.pr.D)), (82.0 + lv * 14.0) * sf * a)
		"cleave":
			u.cd = 1.3
			for j in lanes:
				var aim: Vector2 = d.rotated((float(j) - float(lanes - 1) * 0.5) * 0.5)
				_emit("cut", u, hp0, aim, 0.62 + j * 0.09, (122.0 + lv * 21.0) * sf * a, {"delay": j * 0.09, "span": 1.35})
			m.ksfx("slash", -18.0, 1.1)
		"weave":
			u.cd = 3.9
			for j in lanes:
				var p: Vector2 = hp0 + d * 135.0 * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 95.0 * sf * a
				_emit("net", u, p, d, minf(5.0, 2.6 * float(u.pr.D)), (68.0 + lv * 10.0) * sf * a, {"origin": hp0})
		"shelter":
			u.cd = 14.0 * float(u.pr.R)
			u.sem_shield = {"charges": 2 if lv >= 3 else 1, "until": float(m.time) + 5.5}
			_emit("shelter", u, hp0, d, 5.5, (95.0 + lv * 12.0) * sf * a)
			m.add_text(hp0.x, hp0.y - 75.0 * sf, "庇護 +%d" % (2 if lv >= 3 else 1), 16.0 * sf, u.pr.col, 0.9)
		"gust":
			u.cd = 2.7
			for j in lanes:
				var aim: Vector2 = d.rotated((float(j) - float(lanes - 1) * 0.5) * 0.24)
				_emit("gust", u, hp0 + aim * 35.0 * sf, aim, 1.85, (49.0 + lv * 8.0) * sf * a, {"origin": hp0, "speed": 250.0 * sf})
		"boulder":
			u.cd = 3.5
			for j in lanes:
				var p: Vector2 = hp0 + d * (140.0 + j % 2 * 50.0) * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 105.0 * sf * a
				_emit("rock", u, p, d, 2.8 + j * 0.12, (49.0 + lv * 8.0) * sf * a, {"delay": 0.55 + j * 0.12, "speed": 150.0 * sf})
		"mend":
			u.cd = maxf(10.0, 16.0 - lv)
			_heal(m, u, hp0, "癒 +1")
			_emit("mend", u, hp0, d, 2.0, (150.0 + lv * 25.0) * sf * a)
		"radiance":
			u.cd = 2.8
			for j in mini(3, inherited_count):
				_emit("sun", u, hp0, d, 2.1 + j * 0.2, (135.0 + lv * 15.0) * sf * a * (1.0 + j * 0.12), {"delay": j * 0.28, "layer": j})
			if lv >= 2:
				var n: int = mini(5, inherited_count + (2 if lv >= 3 else 0))
				for j in n:
					var aim: Vector2 = d.rotated((float(j) - float(n - 1) * 0.5) * 0.2)
					_emit("ray", u, hp0 - Vector2(0.0, 65.0 * sf), aim, 0.8, (390.0 + lv * 45.0) * sf * a, {"width": (12.0 + lv * 2.5) * sf * a})
		"scatter_seed":
			u.cd = 2.8
			var seeds: int = mini(8, 2 + mini(4, lv) + inherited_count - 1)
			for j in seeds:
				var aim: Vector2 = d.rotated((float(j) - float(seeds - 1) * 0.5) * 0.23)
				_emit("seed", u, hp0, aim, 0.85, 15.0 * sf, {"goal": hp0 + aim * (145.0 + (j % 2) * 45.0) * sf * a})
		"pounce":
			u.cd = 2.3
			for j in lanes:
				var aim: Vector2 = d.rotated((float(j) - float(lanes - 1) * 0.5) * 0.22)
				_emit("pounce", u, hp0, aim, 0.75, (39.0 + lv * 7.0) * sf * a, {"origin": hp0, "reach": (190.0 + lv * 30.0) * sf * a})
			m.ksfx("dash", -18.0, 1.05)
		"flock":
			u.cd = 2.4
			var birds: int = 3 + (4 if lv >= 3 else 0) + (2 if lv >= 5 else 0) + (inherited_count - 1) * 2
			for j in birds:
				var rank: int = int((j + 1) / 2)
				var wing: float = 0.0 if j == 0 else (-1.0 if j % 2 == 0 else 1.0)
				var p: Vector2 = hp0 - d * rank * 18.0 * sf + side * wing * rank * 27.0 * sf
				_emit("feather", u, p, d, 1.7, (17.0 + lv * 3.0) * sf * a, {"speed": 330.0 * sf, "wing": wing})
		"rally":
			u.cd = 5.5
			for other in m.KU:
				if other != u:
					other.haste = maxf(float(other.get("haste", 0.0)), 0.18 + lv * 0.055)
			_emit("rally", u, hp0, d, 1.4, (150.0 + lv * 20.0) * sf * a)
		"heart_pulse":
			u.cd = 3.2
			_emit("heart", u, hp0, d, 1.7, (150.0 + lv * 24.0) * sf * a, {"gather": 0.62})
		"inscribe":
			u.cd = 2.1
			for j in lanes:
				var aim: Vector2 = d.rotated((float(j) - float(lanes - 1) * 0.5) * 0.28)
				_emit("inscribe", u, hp0 + aim * 28.0 * sf, aim, 1.0, (130.0 + lv * 18.0) * sf * a)
		"rainfall":
			u.cd = 4.2
			for j in lanes:
				var p: Vector2 = hp0 + d * 125.0 * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 100.0 * sf * a
				_emit("rain", u, p, d, minf(6.0, 3.4 * float(u.pr.D)), (80.0 + lv * 13.0) * sf * a)
		"annihilate":
			# 滅 changes water's gentle propagation into a charged, converging torrent.
			# A corridor can remove multiple components only by repeatedly exhausting HP.
			u.cd = 10.0 * float(u.pr.R)
			_emit("annihilate", u, hp0, d, 3.4, (440.0 + lv * 65.0) * sf * a, {"width": (58.0 + lv * 13.0) * sf * a, "gather": 1.05, "strikes": 0})
		"detonate":
			u.cd = 6.2
			_emit("bomb", u, hp0 + d * 155.0 * sf * a, d, 2.2, (125.0 + lv * 22.0) * sf * a, {"delay": 1.0})
		"cage":
			u.cd = 6.0
			for j in lanes:
				_emit("cage", u, hp0 + d * 150.0 * sf * a + side * (float(j) - float(lanes - 1) * 0.5) * 130.0 * sf * a, d, 3.1, (73.0 + lv * 8.0) * sf * a)
		"haze":
			u.cd = 5.4
			_emit("haze", u, hp0, d, 4.8, (160.0 + lv * 28.0) * sf * a)
		"calamity", "spread":
			u.cd = 7.2
			for j in 3 + (2 if lv >= 3 else 0):
				var p: Vector2 = hp0 + d * (120.0 + j * 55.0) * sf * a + side * sin(j * 2.4) * 85.0 * sf * a
				_emit("calamity", u, p, d, 4.7 + j * 0.25, (68.0 + lv * 11.0) * sf * a, {"delay": 0.65 + j * 0.25, "element": "炎" if j % 2 else "波"})
		"shoot":
			u.cd = 1.3
			var arrows: int = 1 + mini(2, int(u.pr.C) - 1) + (2 if lv >= 3 else 0)
			for j in arrows:
				var aim: Vector2 = d.rotated((float(j) - float(arrows - 1) * 0.5) * 0.18)
				_emit("arrow", u, hp0 + aim * 25.0 * sf, aim, 1.35, 16.0 * sf * a, {"speed": 520.0 * sf, "pierce": 1 + lv + int(u.pr.X)})
		"orbit":
			u.cd = 0.5
			if _count(u, "moon") == 0:
				_emit("moon", u, hp0, d, 3.0, (100.0 + lv * 13.0) * sf * a, {"angle": float(u.get("ang", 0.0))})
			else:
				for f in fx:
					if f.u == u and f.k == "moon":
						f.life = 3.0
		"burst":
			u.cd = 2.8
			for j in (1 if lv < 3 else 3):
				_emit("echo", u, hp0, d, 1.5 + j * 0.16, (165.0 + lv * 20.0) * sf * a, {"delay": j * 0.16})
		"aura":
			u.cd = 3.8
			_emit("haze", u, hp0, d, 4.0, (100.0 + lv * 18.0) * sf * a, {"spirit": true})
		"dragon":
			u.cd = 0.5
			if _count(u, "dragon") == 0:
				_emit("dragon", u, hp0, d, 4.0, (130.0 + lv * 20.0) * sf * a, {"angle": float(u.get("ang", 0.0)), "segments": 6 + lv * 2})
			else:
				for f in fx:
					if f.u == u and f.k == "dragon":
						f.life = 4.0
	return true

## Finite shelter absorbs contact without touching enemy position or HP.
## Main's legacy shield has different side effects and is intentionally never used.
func protect(m: Node, enemy: Dictionary) -> bool:
	for u in m.KU:
		var guard: Dictionary = u.get("sem_shield", {})
		if guard.is_empty() or int(guard.get("charges", 0)) <= 0 or float(m.time) >= float(guard.get("until", 0.0)):
			continue
		guard.charges -= 1
		m.hero.inv = maxf(float(m.hero.get("inv", 0.0)), 0.45)
		var p: Vector2 = Vector2(m.hero.x, m.hero.y)
		_emit("protect", u, p, (Vector2(enemy.x, enemy.y) - p).normalized(), 0.8, 75.0 * float(m.SF))
		m.add_text(p.x, p.y - 55.0 * float(m.SF), "%s 守護" % String(u.ch), 17.0 * float(m.SF), u.pr.col, 0.8)
		return true
	return false

func _heal(m: Node, u: Dictionary, p: Vector2, text: String) -> void:
	if int(m.hp) < int(m.max_hp):
		m.hp = mini(int(m.max_hp), int(m.hp) + 1)
		m.add_text(p.x, p.y - 55.0 * float(m.SF), text, 18.0 * float(m.SF), u.pr.col, 1.25)

## 木 grows on the route actually walked. Spacing is measured along the route,
## so stopped heroes add no trees and sharp turns never create random plants.
func _plant(m: Node, u: Dictionary, p: Vector2) -> void:
	var sf: float = float(m.SF)
	var lv: int = _lv(u)
	var wood: int = 0
	for material in u.pr.get("inherited", []):
		if String(material.get("family", "")) == "樹":
			wood += int(material.get("count", 1))
	wood = maxi(1, wood)
	var spacing: float = clampf(68.0 / (1.0 + 0.08 * (lv - 1) + 0.08 * (wood - 1)), 42.0, 68.0) * sf
	var life: float = minf(21.0, (10.0 + lv * 1.3 + wood * 0.8) * clampf(float(u.pr.D), 1.0, 1.35))
	if not u.has("sem_trail_prev"):
		u.sem_trail_prev = p
		u.sem_trail_carry = 0.0
		u.sem_trail_path = [{"p": p, "time": float(m.time)}]
		return
	var previous: Vector2 = u.sem_trail_prev
	u.sem_trail_prev = p
	var distance: float = previous.distance_to(p)
	if distance <= 0.05 * sf:
		return
	# Restart a route after a teleport rather than grow across a skipped screen.
	if distance > 500.0 * sf:
		u.sem_trail_carry = 0.0
		u.sem_trail_path = [{"p": p, "time": float(m.time)}]
		return
	var direction: Vector2 = (p - previous).normalized()
	var carry: float = float(u.get("sem_trail_carry", 0.0))
	var along: float = spacing - carry
	while along <= distance:
		var planted: Vector2 = previous + direction * along
		if _count(u, "tree") < 36 + lv * 6 + wood * 2:
			_emit("tree", u, planted, Vector2.UP, life, (32.0 + lv * 3.0 + wood * 2.0) * sf * _scale(u), {"trail": true, "wood": wood})
		var path: Array = u.get("sem_trail_path", [])
		path = path.filter(func(v): return float(m.time) - float(v.time) <= life)
		if float(m.time) >= float(u.get("sem_loop_next", 0.0)):
			for j in range(0, maxi(0, path.size() - 5)):
				if planted.distance_to(Vector2(path[j].p)) > spacing * 1.15:
					continue
				var polygon: Array = []
				for v in path.slice(j):
					polygon.append(Vector2(v.p))
				polygon.append(planted)
				if absf(_path_area(polygon)) < 8000.0 * sf * sf:
					continue
				_close_wood_path(m, u, polygon, wood)
				u.sem_loop_next = float(m.time) + 3.5
				path = []
				break
		path.append({"p": planted, "time": float(m.time)})
		if path.size() > 96:
			path.pop_front()
		u.sem_trail_path = path
		along += spacing
	u.sem_trail_carry = fmod(carry + distance, spacing)

func _path_area(path: Array) -> float:
	var area: float = 0.0
	for i in path.size():
		var a: Vector2 = path[i]
		var b: Vector2 = path[(i + 1) % path.size()]
		area += a.cross(b)
	return area * 0.5

## A completed route becomes an explicit 木 frame. Only visible 木 traveling
## inward from that frame can hurt the enclosed characters; selection is harmless.
func _close_wood_path(m: Node, u: Dictionary, polygon: Array, wood: int) -> void:
	var sf: float = float(m.SF)
	var center: Vector2 = Vector2.ZERO
	for point in polygon:
		center += Vector2(point)
	center /= float(polygon.size())
	_emit("wood_loop", u, center, Vector2.UP, 1.4, 25.0 * sf, {"path": polygon})
	var boundary: PackedVector2Array = PackedVector2Array(polygon)
	var reach: float = 0.0
	for point in polygon:
		reach = maxf(reach, Vector2(point).distance_to(center))
	var branches: int = mini(6, 2 + int(_lv(u) >= 3) + mini(3, wood - 1))
	var enclosed: int = 0
	for enemy in m.k_targets(center, reach + 70.0 * sf, 40):
		var goal: Vector2 = m.enemy_visual_point(enemy)
		if not Geometry2D.is_point_in_polygon(goal, boundary):
			continue
		for j in branches:
			var index: int = posmod(j * int(polygon.size() / branches) + enclosed * 3, polygon.size())
			var origin: Vector2 = polygon[index]
			var toward: Vector2 = (goal - origin).normalized()
			var duration: float = clampf(origin.distance_to(goal) / (190.0 * sf) + 0.25, 0.45, 3.0)
			_emit("wood_converge", u, origin, toward, duration, (20.0 + _lv(u) * 2.0) * sf, {"origin": origin, "goal": goal, "speed": 190.0 * sf, "enclosed": int(enemy.id)})
		enclosed += 1
		if enclosed >= 6:
			break
	m.ksfx("soft", -18.0, 0.85)

func _rest(m: Node, u: Dictionary, dt: float, hp0: Vector2) -> void:
	var sf: float = float(m.SF)
	var previous: Vector2 = u.get("rest_prev", hp0)
	var stationary: bool = hp0.distance_to(previous) < maxf(1.3 * sf, 36.0 * sf * dt) and String(m.hero.get("state", "idle")) == "idle"
	u.rest_prev = hp0
	u.rest_charge = maxf(0.0, float(u.get("rest_charge", 0.0)) + (dt if stationary else -dt * 3.5))
	u.rest_cool = maxf(0.0, float(u.get("rest_cool", 0.0)) - dt)
	if u.cd <= 0.0:
		u.cd = 5.7
		_emit("rest", u, hp0 + Vector2(45.0 * sf, 0.0), Vector2.UP, 6.0, (85.0 + _lv(u) * 10.0) * sf * _scale(u))
	if float(u.rest_charge) >= maxf(3.0, 6.0 - _lv(u) * 0.6) and float(u.rest_cool) <= 0.0 and int(m.hp) < int(m.max_hp):
		_heal(m, u, hp0, "休息 +1")
		u.rest_charge = 0.0
		u.rest_cool = 8.0
		_emit("mend", u, hp0, Vector2.UP, 1.5, 110.0 * sf * _scale(u))

func _effect(m: Node, u: Dictionary, e: Dictionary, effect: String, amount: float, direction: Vector2 = Vector2.ZERO) -> void:
	var duration: float = clampf(float(u.pr.get("D", 1.0)), 1.0, 3.0) * amount
	match effect:
		"炎":
			_attach_burn(m, u, e, 1.5 * duration)
		"波":
			e.kwet = float(m.time) + 2.5 * duration
		"樹":
			e.kroot = float(m.time) + 0.7 * duration
			e.slow = maxf(float(e.get("slow", 0.0)), 1.1 * duration)
		"霊":
			e.slow = maxf(float(e.get("slow", 0.0)), 1.5 * duration)
		"岩", "trample", "horn":
			e.daze = maxf(float(e.get("daze", 0.0)), 0.45 * duration)
		"声":
			e.daze = maxf(float(e.get("daze", 0.0)), 0.24 * duration)
		"光":
			# Light leaves a visible scorching mark; its delayed HP hit cannot recurse.
			if float(m.time) >= float(e.get("sem_light_at", 0.0)) and _count(u, "afterlight") < 7:
				e.sem_light_at = float(m.time) + 1.5
				_emit("afterlight", u, m.enemy_visual_point(e), direction, 0.85, 25.0 * float(m.SF), {"e": e, "delay": 0.4})
		"刃", "矢":
			# An inherited cutting/shooting material continues through the first contact.
			if float(m.time) >= float(e.get("sem_pierce_at", 0.0)) and _count(u, "followthrough") < 5:
				e.sem_pierce_at = float(m.time) + 1.5
				var d: Vector2 = direction if direction.length_squared() > 0.01 else _dir(m)
				_emit("followthrough", u, m.enemy_visual_point(e), d, 0.55, 100.0 * float(m.SF) * amount, {"ignore": int(e.id), "source": effect})
		"門":
			e.daze = maxf(float(e.get("daze", 0.0)), 0.18 * duration)
			if String(u.pr.get("motion", "")) != "shelter" and float(m.time) >= float(u.get("sem_gate_next", 0.0)):
				u.sem_gate_next = float(m.time) + 14.0
				u.sem_shield = {"charges": 1, "until": float(m.time) + 2.0}
				_emit("shelter", u, Vector2(m.hero.x, m.hero.y), direction, 2.0, 90.0 * float(m.SF))
		"人":
			e.daze = maxf(float(e.get("daze", 0.0)), 0.12 * duration)
			if float(m.time) >= float(u.get("sem_help_next", 0.0)):
				u.sem_help_next = float(m.time) + 5.0
				for other in m.KU:
					if other != u:
						other.haste = maxf(float(other.get("haste", 0.0)), 0.14 * amount)
		"sting":
			e.daze = maxf(float(e.get("daze", 0.0)), 0.4 * duration)
			e.slow = maxf(float(e.get("slow", 0.0)), 1.2 * duration)
		"bubble":
			e.slow = maxf(float(e.get("slow", 0.0)), 1.6 * duration)
		"獣", "bite", "claw":
			if int(e.get("kbleed", 0)) <= 0:
				e.kbleed = 2 if effect == "claw" else 1
				e.kbleed_t = float(m.time) + 0.65
				e.kbleed_u = u
	inherited_trace.append({"e": int(e.id), "source": String(u.ch), "effect": effect, "amount": amount, "t": float(m.time), "burn": float(e.get("kburn", 0.0)), "wet": float(e.get("kwet", 0.0)), "root": float(e.get("kroot", 0.0))})
	if inherited_trace.size() > 96:
		inherited_trace.pop_front()

## The same enemy dictionary survives component stripping, so its small 火 keep
## clinging to the remaining radical. Main owns the half-second HP status ticks.
func _attach_burn(m: Node, u: Dictionary, e: Dictionary, duration: float) -> void:
	if not bool(e.get("alive", false)):
		return
	e.kburn = maxf(float(e.get("kburn", 0.0)), duration)
	e.kburn_u = u
	e.sem_burn = true
	for f in fx:
		if String(f.k) == "cling" and f.get("e", {}) == e:
			f.u = u
			f.life = float(e.kburn)
			f.max = maxf(float(f.max), float(e.kburn))
			return
	_emit("cling", u, m.enemy_visual_point(e), Vector2.UP, float(e.kburn), 24.0 * float(m.SF), {"e": e, "bound_ch": String(e.ch)})

## A wet chain is an actual traveling 水, never a hidden area HP subtraction.
## Targets are chosen once; new contacts do not recursively emit another chain.
func water_chain(m: Node, u: Dictionary, source: Dictionary) -> void:
	if float(m.time) < float(source.get("sem_water_chain_at", 0.0)) or _count(u, "water_link") >= 6:
		return
	source.sem_water_chain_at = float(m.time) + 0.8
	var sf: float = float(m.SF)
	var origin: Vector2 = m.enemy_visual_point(source)
	var count: int = 0
	for enemy in m.k_targets(origin, 230.0 * sf, 20):
		if enemy == source or float(m.time) >= float(enemy.get("kwet", -1.0)):
			continue
		var goal: Vector2 = m.enemy_visual_point(enemy)
		_emit("water_link", u, origin, (goal - origin).normalized(), origin.distance_to(goal) / (300.0 * sf) + 0.2, 20.0 * sf, {"goal": goal, "speed": 300.0 * sf, "ignore": int(source.id), "pierce": 1})
		count += 1
		if count >= 2 or _count(u, "water_link") >= 6:
			break

func _hit(m: Node, f: Dictionary, e: Dictionary, from: Vector2, cooldown: float = 0.0, knock: float = 0.0) -> bool:
	checks += 1
	var u: Dictionary = f.u
	if not bool(e.get("alive", false)):
		return false
	# k_hit always respects enemy HP and break_part; barriers pass zero knockback.
	var ok: bool = m.k_hit(u, e, from, knock, cooldown, "sem%d" % int(f.id))
	if not ok:
		return false
	hits += 1
	if bool(e.get("alive", false)):
		_effect(m, u, e, String(u.pr.get("eff", u.pr.get("body", "人"))), 1.0, f.d)
		for material in u.pr.get("traits", []):
			_effect(m, u, e, String(material.get("effect", material.get("family", ""))), minf(0.95, 0.45 + int(material.get("count", 1)) * 0.1), f.d)
	# A contact stamp shows exactly which inherited material acted, with a strict cap.
	if _count(u, "impact") < 7:
		_emit("impact", u, m.enemy_visual_point(e), f.d, 0.42, 24.0 * float(m.SF))
	return true

## Damage geometry comes only from the glyph body used by draw(). Broad queries
## find candidates; each one still has to touch a displayed character stroke.
## Matching glyphs are swept across their previous position to prevent tunneling.
func _glyph_contact(m: Node, f: Dictionary, previous: Array, current: Array, once: bool = true, cooldown: float = 0.0, knock: float = 0.0) -> Array:
	var result: Array = []
	var contacted: Dictionary = {}
	var sweeps: Array = []
	var lower: Vector2 = Vector2(INF, INF)
	var upper: Vector2 = Vector2(-INF, -INF)
	var previous_slots: Dictionary = {}
	for j in previous.size():
		previous_slots[String(previous[j].get("slot", str(j)))] = previous[j]
	var limit: int = int(f.get("pierce", 2 + int(f.u.pr.get("X", 1)) + int(f.lv)))
	if String(f.k) == "flame":
		limit = 1
	if once and f.hit.size() >= limit:
		return result
	for i in current.size():
		var body: Dictionary = current[i]
		if not bool(body.get("hit", false)):
			continue
		var end: Vector2 = body.p
		var start: Vector2 = end
		var slot: String = String(body.get("slot", str(i)))
		if previous_slots.has(slot):
			var before: Dictionary = previous_slots[slot]
			if bool(before.get("hit", false)) and String(before.ch) == String(body.ch):
				start = before.p
		# Falling text respawns above its own column. The wrap is not a streak.
		if ["rain", "snow"].has(String(f.k)) and end.y < start.y - 16.0 * float(m.SF):
			start = end
		var radius: float = maxf(1.0, float(body.get("radius", float(body.size) * 0.38)))
		sweeps.append({"body": body, "start": start, "end": end, "radius": radius})
		lower.x = minf(lower.x, minf(start.x, end.x) - radius)
		lower.y = minf(lower.y, minf(start.y, end.y) - radius)
		upper.x = maxf(upper.x, maxf(start.x, end.x) + radius)
		upper.y = maxf(upper.y, maxf(start.y, end.y) + radius)
	if sweeps.is_empty():
		return result
	# One candidate query per complete formation. The enclosing circle includes
	# the sweep bounds plus the same enemy-size/visible-motion margin as before.
	var center: Vector2 = (lower + upper) * 0.5
	var candidates: Array = m.k_targets(center, lower.distance_to(upper) * 0.5 + 70.0 * float(m.SF), 99)
	for sweep in sweeps:
		var body: Dictionary = sweep.body
		var start: Vector2 = sweep.start
		var end: Vector2 = sweep.end
		var radius: float = float(sweep.radius)
		for e in candidates:
			if contacted.has(e.id) or (once and f.hit.has(e.id)) or int(e.id) == int(f.get("ignore", -1)):
				continue
			if String(f.k) == "afterlight" and e != f.e:
				continue
			var enemy_p: Vector2 = m.enemy_visual_point(e)
			var point: Vector2 = Geometry2D.get_closest_point_to_segment(enemy_p, start, end)
			if point.distance_to(enemy_p) > radius + float(e.rad):
				continue
			var ok: bool = false
			if String(f.k) == "water_link":
				var previous_chain: bool = bool(m._k_chain)
				m._k_chain = true
				ok = _hit(m, f, e, point - Vector2(f.d) * radius, cooldown, 0.0)
				m._k_chain = previous_chain
			elif ["afterlight", "followthrough"].has(String(f.k)):
				ok = m.k_hit(f.u, e, point, 0.0, cooldown, "glyph%d" % int(f.id), false, 1)
				if ok:
					hits += 1
			else:
				ok = _hit(m, f, e, point - Vector2(f.d) * radius, cooldown, knock)
			if not ok:
				continue
			contacted[e.id] = true
			f.hit[e.id] = true
			var contact: Dictionary = {"e": e, "p": point, "ch": String(body.ch)}
			result.append(contact)
			contact_trace.append({"kind": String(f.k), "e": int(e.id), "ch": String(body.ch), "from": start, "to": end, "p": point, "radius": radius, "t": float(m.time)})
			if contact_trace.size() > 96:
				contact_trace.pop_front()
			if once and f.hit.size() >= limit:
				return result
	return result

func tick(m: Node, dt: float) -> void:
	# A slow frame still lets a newly born glyph become visible before moving
	# past its first target. Each substep retains the exact shared letter body.
	if dt > 0.05:
		var steps: int = mini(16, int(ceil(dt / 0.04)))
		for step in steps:
			tick(m, dt / float(steps))
		return
	# New impacts and clinging 火 draw immediately, but never deal another hit
	# recursively during the same frame.
	var current_fx: Array = fx.duplicate()
	for f in current_fx:
		if not m._k_live(f.u):
			f.life = 0.0
			continue
		var previous: Array = f.get("glyphs", GlyphFX.forms(m, f))
		f.prev_glyphs = previous
		f.t += dt
		f.life -= dt
		var p: Vector2 = f.p
		var sf: float = float(m.SF)
		var u: Dictionary = f.u
		var kind: String = String(f.k)
		var once: bool = true
		var cooldown: float = 0.0
		var knock: float = 0.0
		var damaging: bool = true
		match kind:
			"tree", "thorn", "rest":
				once = false
				cooldown = 0.8
			"flame", "wave", "feather", "arrow":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				if kind == "wave":
					knock = 25.0 * sf
			"burn":
				once = false
				cooldown = 0.65
			"thunder":
				if float(f.t) >= float(f.delay) and not f.get("struck", false):
					f.struck = true
					m.shake = maxf(float(m.shake), 2.0 + int(f.lv) * 0.5)
					m.ksfx("thud", -18.0, 1.5)
			"snow", "rain":
				once = false
				cooldown = 0.9
			"net":
				once = false
				cooldown = 0.95
			"shelter":
				f.p = Vector2(m.hero.x, m.hero.y)
				once = false
				cooldown = 0.85
			"gust":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				once = false
				cooldown = 0.7
				knock = 30.0 * sf
			"rock":
				if float(f.t) >= float(f.delay):
					if not f.get("landed", false):
						f.landed = true
						m.shake = maxf(float(m.shake), 2.0 + int(f.lv))
						m.ksfx("thud", -18.0, 0.75)
					f.p = p + Vector2(f.d) * float(f.speed) * dt
				once = false
				cooldown = 0.7
				knock = 50.0 * sf
			"mend", "rally", "protect", "impact", "wood_loop":
				damaging = false
			"wood_converge", "water_link":
				var offset: Vector2 = Vector2(f.goal) - p
				f.p = p + offset.normalized() * minf(offset.length(), float(f.speed) * dt)
			"seed":
				damaging = false
				if f.life <= 0.0:
					_emit("thorn", u, f.goal, f.d, minf(7.0, 3.8 * float(u.pr.D)), (38.0 + int(f.lv) * 6.0) * sf * _scale(u))
			"pounce":
				var q: float = clampf(float(f.t) / 0.45, 0.0, 1.0)
				f.p = Vector2(f.origin) + Vector2(f.d) * float(f.reach) * sin(q * PI * 0.5)
				knock = 55.0 * sf
			"annihilate":
				once = false
				cooldown = 0.35
				if float(f.t) > float(f.gather) and not f.get("released", false):
					f.released = true
					m.shake = maxf(float(m.shake), 3.0)
					m.ksfx("soft", -17.0, 0.6)
			"bomb":
				if float(f.t) >= float(f.delay) and not f.get("detonated", false):
					f.detonated = true
					m.shake = maxf(float(m.shake), 4.0)
					m.ksfx("thud", -17.0, 0.7)
				knock = 45.0 * sf
			"cage":
				once = false
				cooldown = 1.0
			"haze":
				f.p = Vector2(m.hero.x, m.hero.y)
				once = false
				cooldown = 1.0
			"calamity":
				once = false
				cooldown = 0.85
			"moon":
				f.p = Vector2(m.hero.x, m.hero.y)
				f.angle += dt * (1.1 + int(f.lv) * 0.13)
				u.free = true
				var q: Vector2 = Vector2(f.p) + Vector2.from_angle(float(f.angle)) * float(f.r)
				u.x = q.x
				u.y = q.y
				once = false
				cooldown = 0.65
			"dragon":
				f.p = Vector2(m.hero.x, m.hero.y)
				f.angle += dt * 1.25
				u.free = true
				var segs: Array = []
				for j in int(f.segments):
					var angle: float = float(f.angle) - j * 0.19
					var reach: float = float(f.r) * (1.0 + 0.13 * sin(float(f.t) * 2.5 - j * 0.5))
					var point: Vector2 = Vector2(f.p) + Vector2.from_angle(angle) * reach
					if j == 0:
						u.x = point.x
						u.y = point.y
					else:
						segs.append(point)
				u.segs = segs
				once = false
				cooldown = 0.65
				knock = 25.0 * sf
			"afterlight":
				if not bool(f.e.get("alive", false)):
					f.life = 0.0
				else:
					f.p = m.enemy_visual_point(f.e)
			"cling":
				damaging = false
				if not bool(f.e.get("alive", false)) or float(f.e.get("kburn", 0.0)) <= 0.0:
					f.life = 0.0
				else:
					f.p = m.enemy_visual_point(f.e)
					f.life = float(f.e.kburn)
					f.bound_ch = String(f.e.ch)
		f.glyphs = GlyphFX.forms(m, f)
		if not damaging:
			continue
		var contacts: Array = _glyph_contact(m, f, previous, f.glyphs, once, cooldown, knock)
		for contact in contacts:
			var enemy: Dictionary = contact.e
			if kind == "flame":
				_attach_burn(m, u, enemy, 1.8 * clampf(float(u.pr.D), 1.0, 3.0))
				if _count(u, "burn") < 7:
					_emit("burn", u, contact.p, f.d, minf(4.0, 2.1 * float(u.pr.D)), (22.0 + int(f.lv) * 3.0) * sf)
				f.life = 0.0
				continue
			if not bool(enemy.get("alive", false)):
				continue
			match kind:
				"burn":
					_attach_burn(m, u, enemy, 1.5)
				"thunder":
					enemy.daze = maxf(float(enemy.get("daze", 0.0)), 0.55)
				"snow":
					enemy.slow = maxf(float(enemy.get("slow", 0.0)), 1.8)
					enemy.sem_frost = float(m.time) + 1.8
				"net", "cage":
					enemy.daze = maxf(float(enemy.get("daze", 0.0)), 0.45 if kind == "net" else 0.2)
					enemy.slow = maxf(float(enemy.get("slow", 0.0)), 1.0)
					enemy.sem_bind = float(m.time) + 1.0
				"haze":
					enemy.slow = maxf(float(enemy.get("slow", 0.0)), 1.1)
				"calamity":
					_effect(m, u, enemy, String(f.element), 0.9, f.d)
				"ray", "afterlight":
					f.done = true
		if ["arrow", "water_link"].has(kind) and f.hit.size() >= int(f.pierce):
			f.life = 0.0
	fx = fx.filter(func(f): return float(f.life) > 0.0)

## Render the exact cached character bodies used by contact simulation.
func draw(m: Node, ci: CanvasItem) -> void:
	GlyphFX.draw(m, ci, fx)
