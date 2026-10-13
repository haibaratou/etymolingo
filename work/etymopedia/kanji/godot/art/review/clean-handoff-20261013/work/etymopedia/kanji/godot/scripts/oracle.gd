## 甲骨文（主人公とヒロインだけが使う古い字形）を筆の線で描く
class_name Oracle

static func pts_of(ch: String) -> Array:
	var g = KD.JGW.get(ch)
	if g == null:
		return []
	var out = []
	for d in g.p:
		var nums = []
		var rx = RegEx.new()
		rx.compile("-?[0-9.]+")
		for m in rx.search_all(d):
			nums.append(float(m.get_string()))
		var a = PackedVector2Array()
		var k = 0
		while k + 1 < nums.size():
			a.append(Vector2(nums[k], nums[k + 1]))
			k += 2
		out.append(a)
	return out

static var cache = {}
## 映画的なカメラ（オープニング用）。ふだんは単位行列
static var BASE := Transform2D.IDENTITY
static var glow_tex: Texture2D

## ci に甲骨文を描く。o: rot, sx, sy, lw, wob, t, reveal, glow(0..1)
static func draw(ci: CanvasItem, ch: String, pos: Vector2, size: float, col: Color, o: Dictionary = {}) -> void:
	var g = KD.JGW.get(ch)
	if g == null:
		return
	if not cache.has(ch):
		cache[ch] = pts_of(ch)
	var strokes: Array = cache[ch]
	var vw: float = g.vb[2]
	var vh: float = g.vb[3]
	var s = size / max(vw, vh)
	var sx: float = o.get("sx", 1.0)
	var sy: float = o.get("sy", 1.0)
	ci.draw_set_transform_matrix(BASE * Transform2D(o.get("rot", 0.0), Vector2(s * sx, s * sy), 0.0, pos))
	var base: float = g.w * o.get("lw", 1.7)
	var wob: float = o.get("wob", 0.0)
	var t: float = o.get("t", 0.0)
	var rev: float = o.get("reveal", 1.0)
	var glow: float = o.get("glow", 0.0)
	var n = strokes.size()
	for pass_i in (2 if glow > 0.0 else 1):
		var is_glow = glow > 0.0 and pass_i == 0
		var c = col
		var wmul = 1.0
		if is_glow:
			# にじむ光: 線に沿って柔らかい点を置く（角がとがらない）
			if glow_tex == null:
				continue
			var gc = Color(col.r, col.g, col.b, col.a * 0.10 * glow)
			var rad = base * 2.6
			for i in n:
				if rev * n - i <= 0.0:
					break
				var sp: PackedVector2Array = strokes[i]
				for j in range(1, sp.size()):
					var a0 = sp[j - 1] - Vector2(vw, vh) * 0.5
					var a1 = sp[j] - Vector2(vw, vh) * 0.5
					var steps = max(1, int(a0.distance_to(a1) / (base * 1.1)))
					for k in steps + 1:
						var q = a0.lerp(a1, float(k) / steps)
						ci.draw_texture_rect(glow_tex, Rect2(q.x - rad, q.y - rad, rad * 2, rad * 2), false, gc)
			continue
		for i in n:
			var r = rev * n - i
			if r <= 0.0:
				break
			r = min(1.0, r)
			var pts: PackedVector2Array = strokes[i]
			var m = pts.size()
			var last = (m - 1) * r
			var prev = Vector2.ZERO
			for j in m:
				var p: Vector2 = pts[j]
				if wob > 0.0:
					p += Vector2(sin(t * 5.0 + p.y * 0.4 + i) * wob, cos(t * 4.0 + p.x * 0.35 + i) * wob * 0.6)
				p -= Vector2(vw, vh) * 0.5
				if j > last:
					var f = last - (j - 1)
					p = prev.lerp(p, f)
				if j > 0:
					# 筆圧: 線の中ほどが太く、入りと払いが細い
					var f0 = float(j - 1) / max(1, m - 1)
					var f1 = float(j) / max(1, m - 1)
					var w0 = base * wmul * (0.62 + 0.38 * sin(PI * f0))
					var w1 = base * wmul * (0.62 + 0.38 * sin(PI * f1))
					_seg(ci, prev, p, w0, w1, c)
				prev = p
				if j > last:
					break
			if m == 1:
				ci.draw_circle(prev, base * wmul * 0.5, c)
	ci.draw_set_transform_matrix(BASE)

static func _seg(ci: CanvasItem, a: Vector2, b: Vector2, wa: float, wb: float, c: Color) -> void:
	var d = b - a
	if d.length() < 0.001:
		ci.draw_circle(a, wa * 0.5, c)
		return
	var nrm = Vector2(-d.y, d.x).normalized()
	ci.draw_colored_polygon(PackedVector2Array([a + nrm * wa * 0.5, b + nrm * wb * 0.5, b - nrm * wb * 0.5, a - nrm * wa * 0.5]), c)
	ci.draw_circle(a, wa * 0.5, c)
	ci.draw_circle(b, wb * 0.5, c)
