extends RefCounted
## Meaning supplies the motion; the actual radical and material traits supply contact effects.
## All damage goes through main.k_hit, so HP depletion still removes one component.
## Own effects are bounded and do not alter the original oracle-bone glyph data.
const Kraft = preload("res://scripts/kraft.gd")
const MOTIONS = ["plant", "blaze", "tide", "thunder", "snowfall", "cleave", "weave", "shelter", "gust", "boulder", "rest", "mend", "radiance", "scatter_seed", "pounce", "flock", "rally", "heart_pulse", "inscribe", "rainfall", "annihilate", "detonate", "cage", "haze", "calamity", "shoot", "orbit", "burst", "aura", "dragon", "spread"]
const MAX_FX := 220
var fx: Array = []
var next_id := 0
var checks := 0
var hits := 0

func clear() -> void:
	fx.clear()
	checks = 0
	hits = 0

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
	if motion == "rest":
		_rest(m, u, dt, hp0)
		return true
	if u.cd > 0.0:
		return true
	var inherited_count: int = clampi(int(u.pr.get("C", 1)), 1, 4)
	var lanes: int = mini(5, (1 if lv < 3 else (3 if lv < 5 else 5)) + inherited_count - 1)
	match motion:
		"plant":
			u.cd = 2.6
			var seq: int = int(u.get("sem_seq", 0))
			var count: int = 1 + mini(3, int(u.pr.C) - 1) + (2 if lv >= 3 else 0)
			for j in count:
				if _count(u, "tree") >= 4 + lv * 2:
					break
				var angle: float = d.angle() + float(seq + j) * 2.399963
				var reach: float = (115.0 + (35.0 if lv >= 3 and (seq + j) % 2 == 0 else 0.0)) * sf * a
				_emit("tree", u, hp0 + Vector2.from_angle(angle) * reach, Vector2.UP, minf(13.0, 7.0 * float(u.pr.D)), (38.0 + lv * 5.0) * sf * a)
			u.sem_seq = seq + count
			m.ksfx("thud", -18.0, 1.35)
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
			e.kburn = maxf(float(e.get("kburn", 0.0)), 1.5 * duration)
			e.kburn_u = u
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
				_emit("afterlight", u, Vector2(e.x, e.y), direction, 0.85, 25.0 * float(m.SF), {"e": e, "delay": 0.4})
		"刃", "矢":
			# An inherited cutting/shooting material continues through the first contact.
			if float(m.time) >= float(e.get("sem_pierce_at", 0.0)) and _count(u, "followthrough") < 5:
				e.sem_pierce_at = float(m.time) + 1.5
				var d: Vector2 = direction if direction.length_squared() > 0.01 else _dir(m)
				_emit("followthrough", u, Vector2(e.x, e.y), d, 0.55, 100.0 * float(m.SF) * amount, {"ignore": int(e.id), "source": effect})
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
		_emit("impact", u, Vector2(e.x, e.y), f.d, 0.42, 24.0 * float(m.SF))
	return true

func _area(m: Node, f: Dictionary, p: Vector2, radius: float, cooldown: float = 0.65, knock: float = 0.0) -> void:
	for e in m.k_targets(p, radius + 65.0 * float(m.SF), 36):
		if Vector2(e.x, e.y).distance_to(p) <= radius + float(e.rad):
			_hit(m, f, e, p, cooldown, knock)

func _segment(m: Node, f: Dictionary, a: Vector2, b: Vector2, width: float, once: bool = true, knock: float = 0.0) -> void:
	var center: Vector2 = (a + b) * 0.5
	for e in m.k_targets(center, a.distance_to(b) * 0.5 + width + 70.0 * float(m.SF), 40):
		if once and f.hit.size() >= 2 + int(f.u.pr.get("X", 1)) + int(f.lv):
			break
		if once and f.hit.has(e.id):
			continue
		var ep: Vector2 = Vector2(e.x, e.y)
		var nearest: Vector2 = Geometry2D.get_closest_point_to_segment(ep, a, b)
		if nearest.distance_to(ep) <= width + float(e.rad):
			if _hit(m, f, e, a, 0.0 if once else 0.65, knock):
				f.hit[e.id] = true

func _sector(m: Node, f: Dictionary) -> void:
	for e in m.k_targets(f.p, f.r + 70.0 * float(m.SF), 36):
		if f.hit.size() >= 2 + int(f.u.pr.get("X", 1)) + int(f.lv):
			break
		if f.hit.has(e.id):
			continue
		var v: Vector2 = Vector2(e.x, e.y) - Vector2(f.p)
		var dot: float = v.normalized().dot(Vector2(f.d))
		if v.length() < float(e.rad) + 35.0 * float(m.SF) or (dot >= cos(float(f.get("span", 1.35)) * 0.5) and v.length() <= float(f.r) + float(e.rad)):
			if _hit(m, f, e, f.p, 0.0, float(f.u.pr.KN) * 0.22):
				f.hit[e.id] = true

func tick(m: Node, dt: float) -> void:
	# Snapshot avoids processing effects appended by impact/burn during this tick.
	var current: Array = fx.duplicate()
	for f in current:
		if not m._k_live(f.u):
			f.life = 0.0
			continue
		f.t += dt
		f.life -= dt
		f.pulse -= dt
		var p: Vector2 = f.p
		var sf: float = float(m.SF)
		var u: Dictionary = f.u
		match String(f.k):
			"tree", "thorn", "rest":
				if f.t >= 0.45 and f.pulse <= 0.0:
					f.pulse = 0.8
					_area(m, f, p, float(f.r) * (0.6 if f.k == "rest" else 0.8), 0.7)
				if f.k == "tree" and int(f.lv) >= 3 and f.pulse > 0.78:
					# Mature forests link neighboring roots; the link itself has a hit shape.
					for other in current:
						if other.k == "tree" and other.u == u and int(other.id) < int(f.id) and Vector2(other.p).distance_to(p) < 165.0 * sf * _scale(u):
							_segment(m, f, p, other.p, 10.0 * sf, false)
							break
			"flame":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				_segment(m, f, p, f.p, float(f.r) * 0.7)
				if f.life <= 0.0:
					_emit("burn", u, f.p, f.d, minf(7.0, 2.8 * float(u.pr.D)), float(f.r) * 1.35)
			"burn":
				if f.pulse <= 0.0:
					f.pulse = 0.6
					_area(m, f, p, f.r, 0.55)
					for e in m.k_targets(p, float(f.r) + 40.0 * sf, 14):
						if Vector2(e.x, e.y).distance_to(p) < float(f.r) + float(e.rad):
							e.kburn = maxf(float(e.get("kburn", 0.0)), 1.5)
							e.kburn_u = u
			"wave":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				var width: float = minf(float(f.r) * (0.7 + minf(1.0, float(f.t)) * 0.45), 113.0 * sf)
				var side: Vector2 = Vector2(f.d).orthogonal()
				_segment(m, f, p - side * width, f.p + side * width, 18.0 * sf)
				for e in m.k_targets(f.p, width + 30.0 * sf, 20):
					if f.hit.has(e.id):
						e.kwet = float(m.time) + 2.5
			"thunder":
				if float(f.t) >= float(f.delay) and not f.get("struck", false):
					f.struck = true
					_area(m, f, p, f.r, 0.0)
					for e in m.k_targets(p, float(f.r) + 30.0 * sf, 16):
						if Vector2(e.x, e.y).distance_to(p) < float(f.r) + float(e.rad):
							e.daze = maxf(float(e.get("daze", 0.0)), 0.55)
					m.shake = maxf(float(m.shake), 2.0 + int(f.lv) * 0.5)
					m.ksfx("thud", -18.0, 1.5)
			"snow":
				if float(f.t) >= 0.7 and f.pulse <= 0.0:
					f.pulse = 0.9
					_area(m, f, p, f.r, 0.85)
					for e in m.k_targets(p, float(f.r) + 30.0 * sf, 24):
						if Vector2(e.x, e.y).distance_to(p) < float(f.r) + float(e.rad):
							e.slow = maxf(float(e.get("slow", 0.0)), 1.8)
			"cut":
				if float(f.t) >= float(f.delay) + 0.08:
					_sector(m, f)
			"net":
				if float(f.t) >= 0.25 and f.pulse <= 0.0:
					f.pulse = 0.95
					_area(m, f, p, f.r, 0.9)
					for e in m.k_targets(p, float(f.r) + 20.0 * sf, 20):
						if Vector2(e.x, e.y).distance_to(p) < float(f.r) + float(e.rad):
							e.daze = maxf(float(e.get("daze", 0.0)), 0.45)
							e.slow = maxf(float(e.get("slow", 0.0)), 1.0)
			"shelter":
				f.p = Vector2(m.hero.x, m.hero.y)
				if f.pulse <= 0.0:
					f.pulse = 0.85
					_area(m, f, f.p, float(f.r) * 0.85, 0.8, 0.0)
			"gust":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				_segment(m, f, p, f.p, f.r, false, 30.0 * sf)
			"rock":
				if float(f.t) >= float(f.delay):
					if not f.get("landed", false):
						f.landed = true
						_area(m, f, p, float(f.r) * 1.6, 0.0, 70.0 * sf)
						m.shake = maxf(float(m.shake), 2.0 + int(f.lv))
						m.ksfx("thud", -18.0, 0.75)
					f.p = p + Vector2(f.d) * float(f.speed) * dt
					_segment(m, f, p, f.p, float(f.r) * 0.8, false, 50.0 * sf)
			"mend", "sun", "rally":
				if float(f.t) >= 0.25 + float(f.get("delay", 0.0)) and not f.get("done", false):
					f.done = true
					_area(m, f, p, f.r, 0.0, 0.0)
			"ray":
				_segment(m, f, p, p + Vector2(f.d) * float(f.r), f.width)
			"seed":
				if f.life <= 0.0:
					_emit("thorn", u, f.goal, f.d, minf(7.0, 3.8 * float(u.pr.D)), (38.0 + int(f.lv) * 6.0) * sf * _scale(u))
			"pounce":
				var q: float = clampf(float(f.t) / 0.45, 0.0, 1.0)
				f.p = Vector2(f.origin) + Vector2(f.d) * float(f.reach) * sin(q * PI * 0.5)
				_segment(m, f, p, f.p, f.r, true, 55.0 * sf)
			"feather":
				f.p = p + Vector2(f.d) * float(f.speed) * dt
				_segment(m, f, p, f.p, f.r)
			"heart":
				if float(f.t) > float(f.gather):
					var radius: float = float(f.r) * clampf((float(f.t) - float(f.gather)) / 0.65, 0.0, 1.0)
					for e in m.k_targets(p, radius + 60.0 * sf, 35):
						if not f.hit.has(e.id) and absf(Vector2(e.x, e.y).distance_to(p) - radius) <= float(e.rad) + 18.0 * sf:
							if _hit(m, f, e, p):
								f.hit[e.id] = true
			"inscribe":
				var end: Vector2 = p + Vector2(f.d) * float(f.r) * clampf(float(f.t) / 0.45, 0.0, 1.0)
				_segment(m, f, p, end, (16.0 + int(f.lv) * 3.0) * sf)
			"rain":
				if float(f.t) >= 0.45 and f.pulse <= 0.0:
					f.pulse = 0.9
					_area(m, f, p, f.r, 0.85)
					for e in m.k_targets(p, float(f.r) + 35.0 * sf, 25):
						if Vector2(e.x, e.y).distance_to(p) <= float(f.r) + float(e.rad):
							e.kwet = float(m.time) + 2.8
			"annihilate":
				if float(f.t) > float(f.gather) and f.pulse <= 0.0:
					f.pulse = 0.35
					f.strikes += 1
					var end: Vector2 = p + Vector2(f.d) * float(f.r) * clampf((float(f.t) - float(f.gather)) / 0.75, 0.0, 1.0)
					_segment(m, f, p + Vector2(f.d) * 25.0 * sf, end, f.width, false, 0.0)
					if int(f.strikes) == 1:
						m.shake = maxf(float(m.shake), 3.0)
						m.ksfx("soft", -17.0, 0.6)
			"bomb":
				if float(f.t) >= float(f.delay) and not f.get("done", false):
					f.done = true
					_area(m, f, p, f.r, 0.0, 45.0 * sf)
					_emit("burn", u, p, f.d, 2.2, float(f.r) * 0.7)
					m.shake = maxf(float(m.shake), 4.0)
					m.ksfx("thud", -17.0, 0.7)
			"cage":
				if float(f.t) >= 0.4:
					for e in m.k_targets(p, float(f.r) + 30.0 * sf, 20):
						if Vector2(e.x, e.y).distance_to(p) <= float(f.r) + float(e.rad) * 0.4:
							e.daze = maxf(float(e.get("daze", 0.0)), 0.2)
							if f.pulse <= 0.0:
								_hit(m, f, e, p, 0.95, 0.0)
					if f.pulse <= 0.0:
						f.pulse = 1.0
			"haze":
				f.p = Vector2(m.hero.x, m.hero.y)
				if f.pulse <= 0.0:
					f.pulse = 1.0
					_area(m, f, f.p, float(f.r) * 0.9, 0.95, 0.0)
					for e in m.k_targets(f.p, f.r, 22):
						e.slow = maxf(float(e.get("slow", 0.0)), 1.1)
			"calamity":
				if float(f.t) >= float(f.delay) and f.pulse <= 0.0:
					f.pulse = 0.85
					_area(m, f, p, f.r, 0.8, 0.0)
					for e in m.k_targets(p, float(f.r) + 30.0 * sf, 20):
						if Vector2(e.x, e.y).distance_to(p) <= float(f.r) + float(e.rad):
							_effect(m, u, e, String(f.element), 0.9)
			"arrow":
				if not f.get("done", false):
					f.p = p + Vector2(f.d) * float(f.speed) * dt
					_segment(m, f, p, f.p, f.r)
					if f.hit.size() >= int(f.pierce):
						f.done = true
						f.life = minf(float(f.life), 0.16)
			"moon":
				f.p = Vector2(m.hero.x, m.hero.y)
				f.angle += dt * (1.1 + int(f.lv) * 0.13)
				u.free = true
				var q: Vector2 = Vector2(f.p) + Vector2.from_angle(float(f.angle)) * float(f.r)
				u.x = q.x
				u.y = q.y
				_area(m, f, q, 28.0 * sf * _scale(u), 0.65, 0.0)
				if int(f.lv) >= 3:
					for j in 2:
						var point: Vector2 = Vector2(f.p) + Vector2.from_angle(float(f.angle) + (j + 1) * TAU / 3.0) * float(f.r)
						_area(m, f, point, 24.0 * sf * _scale(u), 0.65, 0.0)
			"echo":
				if float(f.t) >= float(f.delay):
					var radius: float = float(f.r) * clampf((float(f.t) - float(f.delay)) / 0.8, 0.0, 1.0)
					for e in m.k_targets(p, radius + 60.0 * sf, 35):
						if not f.hit.has(e.id) and absf(Vector2(e.x, e.y).distance_to(p) - radius) <= float(e.rad) + 15.0 * sf:
							if _hit(m, f, e, p):
								f.hit[e.id] = true
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
					_area(m, f, point, (22.0 + int(f.lv) * 3.0) * sf, 0.65, 25.0 * sf)
				u.segs = segs
			"afterlight":
				var target: Dictionary = f.e
				if bool(target.get("alive", false)):
					f.p = Vector2(target.x, target.y)
					if float(f.t) >= float(f.delay) and not f.get("done", false):
						f.done = true
						m.k_hit(u, target, f.p, 0.0, 0.0, "light", false, 1)
			"followthrough":
				var end: Vector2 = p + Vector2(f.d) * float(f.r) * clampf(float(f.t) / 0.24, 0.0, 1.0)
				for e in m.k_targets((p + end) * 0.5, float(f.r) + 60.0 * sf, 12):
					if int(e.id) == int(f.ignore) or f.hit.has(e.id):
						continue
					var point: Vector2 = Geometry2D.get_closest_point_to_segment(Vector2(e.x, e.y), p, end)
					if point.distance_to(Vector2(e.x, e.y)) < float(e.rad) + 8.0 * sf:
						f.hit[e.id] = true
						m.k_hit(u, e, p, 0.0, 0.0, "pierce", false, 1)
	fx = fx.filter(func(f): return float(f.life) > 0.0)

## Raster brush marks are the visual vocabulary. Existing ink art is a safe fallback.
func _sprite(m: Node, ci: CanvasItem, name: String, p: Vector2, size: Vector2, alpha: float = 1.0, rotation: float = 0.0, tint: Color = Color.WHITE) -> void:
	if alpha <= 0.005 or minf(size.x, size.y) <= 0.1:
		return
	var tex: Texture2D = m.art("fx_semantic_" + name)
	if tex == null:
		var fallback: String = "stroke0"
		match name:
			"tree", "root", "flame": fallback = "splash0"
			"leaf": fallback = "fx_semantic_feather"
			"wind": fallback = "stroke1"
			"wave": fallback = "splashw0"
			"cloud": fallback = "cloud2"
			"rock": fallback = "blot1"
			"net": fallback = "net"
			"sun": fallback = "blot0"
		tex = m.art(fallback)
	if tex == null:
		return
	ci.draw_set_transform_matrix(Oracle.BASE * Transform2D(rotation, Vector2.ONE, 0.0, p))
	ci.draw_texture_rect(tex, Rect2(-size * 0.5, size), false, Color(tint, alpha * tint.a))
	ci.draw_set_transform_matrix(Oracle.BASE)

func _stamp_name(effect: String) -> String:
	match effect:
		"炎": return "flame"
		"波", "bubble": return "wave"
		"樹": return "root"
		"光": return "sun"
		"岩", "horn", "trample": return "rock"
		"獣", "claw", "bite", "sting": return "claw"
		"peck": return "feather"
		"霊": return "cloud"
	return "slash"

func _brush_segment(m: Node, ci: CanvasItem, a: Vector2, b: Vector2, width: float, alpha: float, name: String = "slash", tint: Color = Color.WHITE) -> void:
	_sprite(m, ci, name, (a + b) * 0.5, Vector2(a.distance_to(b), width), alpha, (b - a).angle(), tint)

func _ring(m: Node, ci: CanvasItem, p: Vector2, r: float, alpha: float, tint: Color, count: int = 12) -> void:
	if r < 3.0:
		return
	for j in count:
		var angle: float = TAU * float(j) / count
		var a: Vector2 = p + Vector2.from_angle(angle) * r
		var b: Vector2 = p + Vector2.from_angle(angle + TAU / count * 0.92) * r
		_brush_segment(m, ci, a, b, maxf(6.0 * float(m.SF), r * 0.09), alpha, "slash", tint)

func draw(m: Node, ci: CanvasItem) -> void:
	var sf: float = float(m.SF)
	for f in fx:
		var p: Vector2 = f.p
		var r: float = f.r
		var d: Vector2 = f.d
		var u: Dictionary = f.u
		var age: float = f.t
		var alpha: float = clampf(minf(age / 0.16, float(f.life) / 0.55), 0.0, 1.0)
		var col: Color = u.pr.get("col", Color(0.2, 0.2, 0.2))
		var ink: Color = Color.WHITE.lerp(col.lightened(0.22), 0.25)
		match String(f.k):
			"tree", "rest":
				var growth: float = clampf(age / 0.8, 0.06, 1.0)
				var height: float = r * (2.35 if f.k == "tree" else 2.1) * growth
				_sprite(m, ci, "root", p + Vector2(0.0, 6.0 * sf), Vector2(r * 2.1, r * 0.7), alpha * 0.55, 0.0, ink)
				_sprite(m, ci, "tree", p - Vector2(0.0, height * 0.43), Vector2(r * 1.65 * growth, height), alpha * 0.76, sin(float(m.time) * 1.3 + int(f.id)) * 0.025, ink)
				if int(f.lv) >= 3 and f.k == "tree":
					for other in fx:
						if other.k == "tree" and other.u == u and int(other.id) < int(f.id) and Vector2(other.p).distance_to(p) < 165.0 * sf * _scale(u):
							_brush_segment(m, ci, p, other.p, 17.0 * sf, alpha * 0.55, "root", ink)
							break
				if f.k == "rest":
					var charge: float = clampf(float(u.get("rest_charge", 0.0)) / maxf(3.0, 6.0 - _lv(u) * 0.6), 0.0, 1.0)
					if charge > 0.05:
						m.glyph(ci, String(u.ch), p - Vector2(48.0 * sf, 38.0 * sf), 25.0 * sf * (0.8 + charge * 0.3), Color(col, alpha * (0.3 + charge * 0.7)), Color(1.0, 1.0, 1.0, alpha * 0.75), 2.0)
			"flame", "burn":
				var h: float = r * (2.8 if f.k == "flame" else 2.0)
				var count: int = 3 if f.k == "burn" and int(f.lv) >= 3 else 1
				for j in count:
					var off: Vector2 = Vector2((float(j) - float(count - 1) * 0.5) * r * 0.7, 0.0)
					var sway: float = sin(float(m.time) * 8.0 + j * 1.8 + int(f.id)) * 0.08
					_sprite(m, ci, "flame", p + off - Vector2(0.0, h * 0.25), Vector2(r * 1.7, h), alpha * 0.88, sway, Color(1.0, 0.67, 0.44))
				if f.k == "flame":
					_sprite(m, ci, "flame", p - d * r * 1.1, Vector2(r, r * 1.8), alpha * 0.38, d.angle() + PI * 0.5)
			"wave":
				var width: float = minf(r * (0.7 + minf(1.0, age) * 0.45), 113.0 * sf)
				var visual_width: float = minf(width * 2.3, 260.0 * sf)
				_sprite(m, ci, "wave", p, Vector2(visual_width, minf(r * 1.0, 110.0 * sf)), alpha * 0.54, d.angle() - PI * 0.5, ink)
				_sprite(m, ci, "wave", p - d * r * 0.52, Vector2(visual_width * 0.82, minf(r * 0.7, 90.0 * sf)), alpha * 0.17, d.angle() - PI * 0.5, ink)
			"thunder":
				var cloudp: Vector2 = p - Vector2(0.0, 165.0 * sf)
				_sprite(m, ci, "cloud", cloudp, Vector2(r * 2.6, r * 1.05), alpha, 0.0, ink)
				if age < float(f.delay):
					_sprite(m, ci, "wave", p, Vector2(r * 1.3, r * 0.35), alpha * 0.35, 0.0, ink)
				else:
					var bolt_alpha: float = clampf(1.0 - (age - float(f.delay)) / 0.62, 0.0, 1.0)
					_sprite(m, ci, "lightning", (cloudp + p) * 0.5, Vector2(r * 1.25, cloudp.distance_to(p) + r * 0.8), bolt_alpha)
					if int(f.lv) >= 3:
						for s in [-1.0, 1.0]:
							_brush_segment(m, ci, p - Vector2(0.0, 55.0 * sf), p + Vector2(s * r * 0.75, r * 0.1), 22.0 * sf, bolt_alpha * 0.75, "lightning")
					_sprite(m, ci, "root", p, Vector2(r * 2.3, r * 0.7), bolt_alpha * 0.7, 0.0, ink)
			"snow":
				_sprite(m, ci, "cloud", p - Vector2(0.0, r * 1.1), Vector2(r * 2.5, r * 0.8), alpha * 0.65, 0.0, Color(0.7, 0.8, 0.92))
				_sprite(m, ci, "wave", p + Vector2(0.0, r * 0.12), Vector2(r * 2.1, r * 0.65), alpha * 0.42, 0.0, Color(0.45, 0.7, 0.9))
				# Snowfall has downward trajectories and a settled slowing carpet.
				for j in 8 + int(f.lv) * 2:
					var x: float = sin(j * 2.399 + int(f.id)) * r * 0.85
					var y: float = fmod(age * 72.0 * sf + j * 27.0 * sf, r * 1.8) - r * 1.3
					_sprite(m, ci, "leaf", p + Vector2(x + sin(age * 2.5 + j) * 8.0 * sf, y), Vector2(11.0, 11.0) * sf, alpha * 0.75, j + age * 0.6, Color(0.48, 0.68, 0.9))
			"cut":
				var q: float = clampf((age - float(f.delay)) / 0.32, 0.0, 1.0)
				var sweep: float = d.angle() - float(f.span) * 0.5 + q * float(f.span)
				for j in 3:
					var an: float = sweep - j * 0.18
					var end: Vector2 = p + Vector2.from_angle(an) * r
					_brush_segment(m, ci, p + Vector2.from_angle(an) * r * 0.18, end, r * (0.2 - j * 0.035), alpha * (0.85 - j * 0.18), "slash", ink)
			"net":
				var stretch: float = clampf(age / 0.3, 0.1, 1.0)
				_sprite(m, ci, "net", p, Vector2(r * 2.0, r * 1.6) * stretch, alpha * 0.85, d.angle(), ink)
				if int(f.lv) >= 3:
					for j in 3:
						var knot: Vector2 = p + Vector2.from_angle(d.angle() + j * TAU / 3.0) * r * 0.65
						_brush_segment(m, ci, f.origin, knot, 7.0 * sf, alpha * 0.5, "root", ink)
			"shelter":
				# A recognizable roof and pillars shelter the hero, never displace enemies.
				var top: Vector2 = p - Vector2(0.0, r * 0.85)
				for s in [-1.0, 1.0]:
					var corner: Vector2 = p + Vector2(s * r, -r * 0.35)
					_brush_segment(m, ci, top, corner, 20.0 * sf, alpha * 0.8, "slash", ink)
					_brush_segment(m, ci, corner, p + Vector2(s * r * 0.75, r * 0.6), 13.0 * sf, alpha * 0.5, "slash", ink)
				if int(f.lv) >= 3:
					_brush_segment(m, ci, top - Vector2(0.0, 16.0 * sf), p + Vector2(-r * 1.15, -r * 0.25), 16.0 * sf, alpha * 0.55, "slash", ink)
					_brush_segment(m, ci, top - Vector2(0.0, 16.0 * sf), p + Vector2(r * 1.15, -r * 0.25), 16.0 * sf, alpha * 0.55, "slash", ink)
			"gust":
				var normal: Vector2 = d.orthogonal()
				for j in 4:
					var swirl: float = sin(age * 8.0 + j * 1.6)
					var q: Vector2 = p - d * j * r * 0.65 + normal * swirl * r * 0.6
					_sprite(m, ci, "wind", q, Vector2(r * 2.1, r * 0.75), alpha * (0.72 - j * 0.11), d.angle(), Color(0.5, 0.72, 0.7))
					_sprite(m, ci, "leaf", q + normal * cos(age * 6.0 + j) * r * 0.4, Vector2(18.0, 12.0) * sf, alpha * 0.75, age * 5.0 + j, ink)
			"rock":
				var fall: float = clampf(age / float(f.delay), 0.0, 1.0)
				var rockp: Vector2 = p - Vector2(0.0, (1.0 - fall * fall) * 220.0 * sf)
				_sprite(m, ci, "rock", rockp - Vector2(0.0, r * 0.2), Vector2(r * 2.1, r * 1.8), alpha, (age - float(f.delay)) * 1.8 if f.get("landed", false) else 0.0, ink)
				_sprite(m, ci, "cloud", p + Vector2(0.0, r * 0.3), Vector2(r * 2.5, r * 0.55), alpha * (0.28 if fall < 1.0 else 0.55), 0.0, ink)
			"mend":
				var progress: float = clampf(age / 1.4, 0.0, 1.0)
				_ring(m, ci, p, r * progress, alpha * (1.0 - progress * 0.6), col.lightened(0.25), 10 + int(f.lv) * 2)
				_sprite(m, ci, "leaf", p - Vector2(0.0, 18.0 * sf + age * 22.0 * sf), Vector2(34.0, 45.0) * sf, alpha, 0.0, Color(0.42, 0.65, 0.38))
			"sun":
				var sunp: Vector2 = p - Vector2(0.0, 78.0 * sf)
				if int(f.get("layer", 0)) == 0:
					_sprite(m, ci, "sun", sunp, Vector2(88.0, 88.0) * sf * (1.0 + int(f.lv) * 0.15), alpha)
				_ring(m, ci, p, r * clampf((age - float(f.get("delay", 0.0))) / 0.85, 0.0, 1.0), alpha * 0.45, Color(0.92, 0.68, 0.18), 14)
			"ray":
				var end: Vector2 = p + d * r
				_brush_segment(m, ci, p, end, float(f.width) * 2.2, alpha * 0.7, "slash", Color(1.0, 0.72, 0.18))
				_brush_segment(m, ci, p, end, float(f.width) * 0.65, alpha * 0.9, "slash", Color(1.0, 0.91, 0.6))
			"seed":
				var progress: float = clampf(age / float(f.max), 0.0, 1.0)
				var seedp: Vector2 = p.lerp(Vector2(f.goal), progress) - Vector2(0.0, sin(progress * PI) * 90.0 * sf)
				_sprite(m, ci, "leaf", seedp, Vector2(20.0, 15.0) * sf, alpha, progress * 4.0 + int(f.id), ink)
			"thorn":
				var growth: float = clampf(age / 0.75, 0.05, 1.0)
				_sprite(m, ci, "root", p, Vector2(r * 2.0, r * 0.8) * growth, alpha * 0.65, 0.0, ink)
				for j in (3 if int(f.lv) >= 3 else 1):
					var off: Vector2 = Vector2((j - 1.0) * r * 0.5 if int(f.lv) >= 3 else 0.0, -r * 0.42 * growth)
					_sprite(m, ci, "leaf", p + off, Vector2(r * 1.1, r * 1.5) * growth, alpha, (float(j) - 1.0) * 0.4, ink)
			"pounce":
				_sprite(m, ci, "claw", p, Vector2(r * 2.7, r * 2.0), alpha, d.angle() - PI * 0.5, ink)
				if age < 0.4:
					_brush_segment(m, ci, f.origin, p, r * 0.55, alpha * 0.4, "slash", ink)
			"feather":
				var flap: float = sin(age * 13.0 + int(f.id)) * 0.15
				_sprite(m, ci, "feather", p, Vector2(r * 2.2, r * 1.45), alpha, d.angle() + flap, ink)
			"rally":
				_ring(m, ci, p, r * clampf(age / 0.8, 0.0, 1.0), alpha * 0.75, col, 8 + int(f.lv) * 2)
				for other in m.KU:
					if other != u:
						var spot: Vector2 = Vector2(other.x, other.y)
						_sprite(m, ci, "sun", spot - Vector2(0.0, 24.0 * sf), Vector2(22.0, 22.0) * sf, alpha * 0.55, 0.0, ink)
			"heart":
				if age < float(f.gather):
					var gather: float = 1.0 - age / float(f.gather)
					for j in 5 + int(f.lv):
						var point: Vector2 = p + Vector2.from_angle(j * TAU / (5.0 + int(f.lv))) * r * gather
						_sprite(m, ci, "cloud", point, Vector2(34.0, 16.0) * sf, alpha * 0.55, j * 0.7, ink)
				else:
					var reach: float = r * clampf((age - float(f.gather)) / 0.65, 0.0, 1.0)
					_ring(m, ci, p, reach, alpha * 0.85, col, 10 + int(f.lv) * 2)
				m.glyph(ci, String(u.ch), p, 27.0 * sf * (1.0 + 0.12 * sin(age * 12.0)), Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.8), 2.0)
			"inscribe":
				var reach: float = r * clampf(age / 0.45, 0.0, 1.0)
				_brush_segment(m, ci, p, p + d * reach, (30.0 + int(f.lv) * 5.0) * sf, alpha * 0.9, "slash", ink)
				m.glyph(ci, String(u.ch), p + d * reach, 29.0 * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.8), 2.0)
			"rain":
				_sprite(m, ci, "cloud", p - Vector2(0.0, r * 1.05), Vector2(r * 2.5, r * 0.8), alpha * 0.85, 0.0, ink)
				_sprite(m, ci, "wave", p + Vector2(0.0, r * 0.2), Vector2(r * 2.2, r * 0.8), alpha * 0.45, 0.0, Color(0.4, 0.63, 0.85))
				for j in 9 + int(f.lv):
					var x: float = sin(j * 2.399 + int(f.id)) * r * 0.9
					var y: float = fmod(age * 160.0 * sf + j * 31.0 * sf, r * 1.8) - r * 1.2
					var drop: Vector2 = p + Vector2(x, y)
					_brush_segment(m, ci, drop - Vector2(2.0, 17.0) * sf, drop, 4.0 * sf, alpha * 0.62, "slash", Color(0.35, 0.6, 0.83))
					if j % 3 == 0:
						m.glyph(ci, String(u.ch), drop, 13.0 * sf, Color(col, alpha * 0.75), Color(1.0, 1.0, 1.0, alpha * 0.7), 1.0)
			"annihilate":
				var width: float = f.width
				var side: Vector2 = d.orthogonal()
				var fire_material: bool = false
				var cutting_material: bool = false
				for material in u.pr.get("traits", []):
					fire_material = fire_material or String(material.get("family", "")) == "炎"
					cutting_material = cutting_material or ["刃", "矢"].has(String(material.get("family", "")))
				if age < float(f.gather):
					var q: float = age / float(f.gather)
					for s in [-1.0, 1.0]:
						var start: Vector2 = p + d * r * 0.65 + side * s * width * (3.0 - q * 2.0)
						var finish: Vector2 = p + d * 40.0 * sf
						_brush_segment(m, ci, start, finish, width * 0.65, alpha * 0.65, "wave", Color(0.22, 0.43, 0.64))
						if fire_material:
							_sprite(m, ci, "flame", finish + side * s * width * 0.6, Vector2(width * 0.65, width), alpha * 0.75, d.angle() - PI * 0.5, Color(1.0, 0.7, 0.5))
						if cutting_material:
							_brush_segment(m, ci, start, finish, 13.0 * sf, alpha * 0.6, "slash", Color(0.35, 0.4, 0.46))
					m.glyph(ci, String(u.ch), p + d * 40.0 * sf, (40.0 + q * 27.0) * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.85), 3.0)
				else:
					var progress: float = clampf((age - float(f.gather)) / 0.75, 0.0, 1.0)
					var front: Vector2 = p + d * r * progress
					for j in 5:
						var spot: Vector2 = p.lerp(front, (j + 1) / 5.0)
						_sprite(m, ci, "wave", spot, Vector2(width * 2.5, r * progress / 4.0), alpha * 0.72, d.angle() - PI * 0.5, Color(0.16, 0.38, 0.6))
						if int(f.lv) >= 3 and cutting_material:
							_brush_segment(m, ci, spot - side * width, spot + side * width, 18.0 * sf, alpha * 0.7, "slash", Color(0.1, 0.23, 0.37))
						if j % 2 == 0:
							m.glyph(ci, String(u.ch), spot, (32.0 + int(f.lv) * 2.0) * sf, Color(col, alpha * 0.88), Color(1.0, 1.0, 1.0, alpha * 0.92), 3.0)
						if fire_material and j % 2 == 0:
							_sprite(m, ci, "flame", spot + side * width * 0.7, Vector2(width * 0.55, width * 0.7), alpha * 0.45, d.angle() - PI * 0.5, Color(1.0, 0.7, 0.5))
					m.glyph(ci, String(u.ch), front, (56.0 + int(f.lv) * 5.0) * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.9), 4.0)
			"bomb":
				if age < float(f.delay):
					var charge: float = age / float(f.delay)
					_sprite(m, ci, "flame", p, Vector2(r, r * 1.3) * (0.3 + charge * 0.5), alpha * 0.75, sin(age * 16.0) * 0.1)
					m.glyph(ci, String(u.ch), p, (32.0 + charge * 20.0) * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.9), 3.0)
				else:
					var blast: float = clampf((age - float(f.delay)) / 0.3, 0.0, 1.0)
					_ring(m, ci, p, r * blast, alpha * 0.9, Color(0.85, 0.3, 0.12), 14)
					for j in 6 + int(f.lv):
						var an: float = j * TAU / (6.0 + int(f.lv))
						_sprite(m, ci, "flame", p + Vector2.from_angle(an) * r * blast * 0.62, Vector2(r * 0.45, r * 0.7), alpha * 0.75, an - PI * 0.5)
			"cage":
				var reveal: float = clampf(age / 0.4, 0.0, 1.0)
				for j in 4:
					var angle: float = PI * 0.25 + j * PI * 0.5
					var a: Vector2 = p + Vector2.from_angle(angle) * r * 1.25
					var b: Vector2 = p + Vector2.from_angle(angle + PI * 0.5) * r * 1.25
					_brush_segment(m, ci, a, a.lerp(b, reveal), 14.0 * sf, alpha * 0.8, "slash", ink)
				for j in 3:
					var x: float = (j - 1.0) * r * 0.45
					_brush_segment(m, ci, p + Vector2(x, -r * 0.8), p + Vector2(x, r * 0.8 * reveal), 6.0 * sf, alpha * 0.45, "slash", ink)
			"haze":
				for j in 4 + int(f.lv):
					var angle: float = j * 2.399 + age * 0.18
					var point: Vector2 = p + Vector2.from_angle(angle) * r * (0.4 + 0.35 * sin(j * 2.2 + age))
					_sprite(m, ci, "cloud", point, Vector2(r * 1.6, r * 0.6), alpha * 0.28, sin(j + age * 0.3) * 0.1, ink)
				m.glyph(ci, String(u.ch), p - Vector2(0.0, r * 0.65), (32.0 + int(f.lv) * 4.0) * sf, Color(col, alpha * 0.7), Color(1.0, 1.0, 1.0, alpha * 0.55), 2.0)
			"calamity":
				if age >= float(f.delay):
					var grow: float = clampf((age - float(f.delay)) / 0.4, 0.05, 1.0)
					if String(f.element) == "炎":
						_sprite(m, ci, "flame", p - Vector2(0.0, r * 0.4), Vector2(r * 1.6, r * 2.1) * grow, alpha, sin(age * 9.0) * 0.08)
					else:
						_sprite(m, ci, "wave", p, Vector2(r * 2.2, r * 1.2) * grow, alpha * 0.85, 0.0, Color(0.28, 0.5, 0.74))
					m.glyph(ci, String(u.ch), p, 35.0 * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.9), 3.0)
			"arrow":
				_brush_segment(m, ci, p - d * 48.0 * sf, p + d * 10.0 * sf, 10.0 * sf, alpha * 0.65, "slash", ink)
				m.glyph(ci, String(u.ch), p, 28.0 * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.85), 2.0, d.angle() * 0.18)
			"moon":
				for j in (1 if int(f.lv) < 3 else 3):
					var angle: float = float(f.angle) + j * TAU / 3.0
					var point: Vector2 = p + Vector2.from_angle(angle) * r
					_sprite(m, ci, "sun", point, Vector2(50.0, 50.0) * sf, alpha * 0.4, 0.0, Color(0.55, 0.64, 0.72))
					if j > 0:
						m.glyph(ci, String(u.ch), point, 26.0 * sf, Color(col, alpha * 0.85), Color(1.0, 1.0, 1.0, alpha * 0.8), 2.0)
			"echo":
				if age > float(f.delay):
					var progress: float = clampf((age - float(f.delay)) / 0.8, 0.0, 1.0)
					_ring(m, ci, p, r * progress, alpha * 0.8, col, 12)
					for j in 4:
						var point: Vector2 = p + Vector2.from_angle(j * PI * 0.5) * r * progress
						m.glyph(ci, String(u.ch), point, 20.0 * sf, Color(col, alpha * 0.85), Color(1.0, 1.0, 1.0, alpha * 0.8), 2.0)
			"dragon":
				var segs: Array = u.get("segs", [])
				for j in range(segs.size() - 1, -1, -1):
					var fade: float = 1.0 - j / float(segs.size() + 2)
					_sprite(m, ci, "claw", segs[j], Vector2(38.0, 26.0) * sf, alpha * fade * 0.45, float(f.angle) - j * 0.19, ink)
					m.glyph(ci, String(u.ch), segs[j], (22.0 + int(f.lv) * 2.0) * sf * fade, Color(col, alpha * (0.4 + fade * 0.4)), Color(1.0, 1.0, 1.0, alpha * 0.7), 2.0)
			"protect":
				var q: Vector2 = p + d * r * 0.6
				_brush_segment(m, ci, q - d.orthogonal() * r * 0.65, q + d.orthogonal() * r * 0.65, 22.0 * sf, alpha, "slash", ink)
				m.glyph(ci, String(u.ch), q, 40.0 * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.9), 3.0)
			"afterlight":
				_sprite(m, ci, "sun", p, Vector2(r * 2.1, r * 2.1), alpha * 0.6, age * 0.6, Color(1.0, 0.77, 0.36))
			"followthrough":
				var end: Vector2 = p + d * r * clampf(age / 0.24, 0.0, 1.0)
				_brush_segment(m, ci, p, end, 12.0 * sf, alpha * 0.6, "slash", ink)
				m.glyph(ci, "刀" if String(f.source) == "刃" else "矢", end, 20.0 * sf, Color(col, alpha), Color(1.0, 1.0, 1.0, alpha * 0.8), 1.0)
			"impact":
				var effect: String = String(u.pr.get("eff", u.pr.get("body", "人")))
				_sprite(m, ci, _stamp_name(effect), p, Vector2(r * 2.0, r * 1.7), alpha * 0.8, d.angle(), ink)
				var i: int = 0
				for material in u.pr.get("traits", []):
					if i >= 2:
						break
					var fam: String = String(material.get("family", ""))
					var color: Color = Kraft.FAM_COL.get(fam, col)
					var off: Vector2 = Vector2.from_angle(-PI * 0.75 + i * PI * 0.5) * r * 0.9
					_sprite(m, ci, _stamp_name(String(material.get("effect", fam))), p + off, Vector2(r, r), alpha * 0.7, 0.0, Color.WHITE.lerp(color, 0.4))
					i += 1
		# The crafted kanji is the projectile or living attack emblem, not a UI label.
		# Material strokes sit behind it, preserving both identity and radical inheritance.
		_draw_signature(m, ci, f, alpha, col)
	ci.draw_set_transform_matrix(Oracle.BASE)

func _draw_signature(m: Node, ci: CanvasItem, f: Dictionary, alpha: float, col: Color) -> void:
	var sf: float = float(m.SF)
	var p: Vector2 = f.p
	var r: float = f.r
	var d: Vector2 = f.d
	var size: float = (27.0 + mini(4, int(f.lv)) * 2.0) * sf
	var a: float = alpha * 0.9
	match String(f.k):
		"tree":
			p -= Vector2(0.0, r * 0.5 * clampf(float(f.t) / 0.8, 0.0, 1.0))
			size *= 0.8
		"flame", "wave", "gust", "feather", "pounce":
			if f.k == "feather":
				size *= 0.66
			if f.k == "pounce":
				size *= 1.22
		"rock":
			var fall: float = clampf(float(f.t) / float(f.delay), 0.0, 1.0)
			p -= Vector2(0.0, (1.0 - fall * fall) * 220.0 * sf + r * 0.2)
			size *= 1.2
		"thunder", "snow":
			p -= Vector2(0.0, 165.0 * sf if f.k == "thunder" else r * 1.0)
		"net", "cage", "thorn":
			size *= 0.85
		"cut":
			var q: float = clampf((float(f.t) - float(f.delay)) / 0.32, 0.0, 1.0)
			var sweep: float = d.angle() - float(f.span) * 0.5 + q * float(f.span)
			p += Vector2.from_angle(sweep) * r * 0.78
			size *= 1.0
		"sun":
			p -= Vector2(0.0, 78.0 * sf)
			size *= 1.22
		"shelter":
			p -= Vector2(0.0, r * 0.7)
		"rally", "mend":
			p -= Vector2(0.0, 42.0 * sf)
		_:
			return
	m.glyph(ci, String(f.u.ch), p, size, Color(col, a), Color(1.0, 1.0, 1.0, a * 0.9), 2.5)
