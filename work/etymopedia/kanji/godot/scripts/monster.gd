class_name Monster
extends RefCounted
## 漢詩の決戦に現れる古の怪物。山海経の木版や漢代の画像石、殷周の青銅器の文様のような
## 太い墨線・平らな色・細い陰影線で描く。座標は -1..1 の単位で、draw_set_transform で拡大する。

const KINDS = ["hundun", "chiyou", "taotie"]
const INFO = {
	"hundun": {"name": "渾沌", "alt": "帝江", "en": "HUNDUN", "src": "山海経・西山経",
		"say": "黄なる嚢のごとく、赤きこと丹火のごとし。六足四翼、面目なし。歌舞を識る"},
	"chiyou": {"name": "蚩尤", "alt": "兵主", "en": "CHIYOU", "src": "武梁祠 画像石",
		"say": "銅の頭に鉄の額。五兵を作り、黄帝と涿鹿の野に戦う"},
	"taotie": {"name": "饕餮", "alt": "", "en": "TAOTIE", "src": "殷周 青銅器",
		"say": "首ありて身なし。人を食らいて未だ咽まず"},
}
## 一句ごとに崩れていく部位の数（胴や顔は最後の句で崩れる）
const BREAKS = {"hundun": 10, "chiyou": 6, "taotie": 6}

static var _ci: CanvasItem
static var _a := 1.0
static var _ink := Color.BLACK

static func draw(ci: CanvasItem, kind: String, c: Vector2, s: float, t: float, broken: float, ink: Color, a: float, flinch := 0.0) -> void:
	_ci = ci
	_a = a
	_ink = Color(ink, a)
	var nb = int(floor(broken * BREAKS.get(kind, 6) + 0.001))
	var sh = Vector2(sin(t * 47.0), cos(t * 39.0)) * flinch * 0.03
	ci.draw_set_transform(c + sh * s, 0.0, Vector2(s, s))
	match kind:
		"hundun": _hundun(t, nb)
		"chiyou": _chiyou(t, nb)
		"taotie": _taotie(t, nb)
	ci.draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)

# ---------- 道具 ----------
static func _c(r: float, g: float, b: float, k := 1.0) -> Color:
	return Color(r, g, b, _a * k)

static func ell(c: Vector2, rx: float, ry: float, n := 40, a0 := 0.0, a1 := TAU) -> PackedVector2Array:
	var p = PackedVector2Array()
	for i in n + 1:
		var a = a0 + (a1 - a0) * i / n
		p.append(c + Vector2(cos(a) * rx, sin(a) * ry))
	return p

static func fill(p: PackedVector2Array, col: Color) -> void:
	if p.size() >= 3:
		var q = p
		if q[0].distance_to(q[q.size() - 1]) < 0.0001:
			q = q.slice(0, q.size() - 1)
		_ci.draw_colored_polygon(q, col)

static func line(p: PackedVector2Array, w: float, col := Color(0, 0, 0, -1)) -> void:
	_ci.draw_polyline(p, _ink if col.a < 0 else col, w, true)

static func shape(p: PackedVector2Array, col: Color, w := 0.022) -> void:
	fill(p, col)
	var q = p
	if q[0].distance_to(q[q.size() - 1]) > 0.0001:
		q = q.duplicate()
		q.append(q[0])
	line(q, w)

## 二次ベジェ
static func qb(a: Vector2, c: Vector2, b: Vector2, n := 14) -> PackedVector2Array:
	var p = PackedVector2Array()
	for i in n + 1:
		var f = float(i) / n
		var u = 1 - f
		p.append(a * u * u + c * 2 * u * f + b * f * f)
	return p

## 太い四肢: 墨の線の上に色の線を重ねて、縁取りされた手足にする
static func limb(p: PackedVector2Array, w: float, col: Color) -> void:
	line(p, w)
	line(p, w * 0.58, col)

## 渦（雲紋・雷紋の元）
static func spiral(c: Vector2, r: float, turns: float, a0: float, dir := 1.0, n := 40) -> PackedVector2Array:
	var p = PackedVector2Array()
	for i in n + 1:
		var f = float(i) / n
		var a = a0 + dir * f * turns * TAU
		p.append(c + Vector2(cos(a), sin(a)) * r * (1.0 - f * 0.85))
	return p

## 四角い渦（雷紋）
static func square_spiral(c: Vector2, r: float, dir := 1.0) -> PackedVector2Array:
	var p = PackedVector2Array()
	var d = [Vector2(1, 0), Vector2(0, 1), Vector2(-1, 0), Vector2(0, -1)]
	var cur = c + Vector2(-r, -r)
	var len = r * 2
	p.append(cur)
	for i in 7:
		var v: Vector2 = d[i % 4]
		v.x *= dir
		cur += v * len
		p.append(cur)
		if i % 2 == 1:
			len -= r * 0.5
		if len <= 0.01:
			break
	return p

## 先細りの角
static func horn(a: Vector2, c: Vector2, b: Vector2, w0: float, col: Color) -> void:
	var pts = qb(a, c, b, 16)
	var left = PackedVector2Array()
	var right = PackedVector2Array()
	for i in pts.size():
		var d: Vector2 = (pts[min(i + 1, pts.size() - 1)] - pts[max(i - 1, 0)]).normalized()
		var n = Vector2(-d.y, d.x)
		var w = w0 * (1.0 - float(i) / pts.size() * 0.92)
		left.append(pts[i] + n * w)
		right.append(pts[i] - n * w)
	right.reverse()
	shape(left + right, col, 0.018)
	# 角の節
	for i in range(2, pts.size() - 4, 3):
		var d2: Vector2 = (pts[i + 1] - pts[i - 1]).normalized()
		var n2 = Vector2(-d2.y, d2.x)
		var w2 = w0 * (1.0 - float(i) / pts.size() * 0.92)
		line(PackedVector2Array([pts[i] + n2 * w2, pts[i] - n2 * w2]), 0.01)

# ---------- 渾沌（帝江）: 黄色い嚢の胴、丹火の赤、六つの足、四つの翼、顔がない。歌い踊る ----------
static func _hundun(t: float, nb: int) -> void:
	var bob = sin(t * 2.2) * 0.04
	var O = Vector2(0, bob)
	var ochre = _c(0.86, 0.66, 0.27, 0.92)
	var pale = _c(0.95, 0.86, 0.64, 0.9)
	var red = _c(0.78, 0.2, 0.12, 0.75)
	# 丹火の揺らぎ（胴の縁から立つ炎）
	for i in 14:
		var an = float(i) / 14 * TAU
		var base = O + Vector2(0, 0.05) + Vector2(cos(an) * 0.64, sin(an) * 0.52)
		var out = Vector2(cos(an), sin(an))
		var ln = 0.13 + 0.05 * sin(t * 5 + i * 1.7)
		var tip = base + out * ln + Vector2(-out.y, out.x) * sin(t * 6 + i) * 0.04
		line(qb(base, base + out * ln * 0.5 + Vector2(-out.y, out.x) * 0.05, tip, 8), 0.035, red)
	# 翼（四枚）: 番号は崩れる順
	var wings = [[-1, -0.16, 0], [1, -0.16, 2], [-1, 0.14, 4], [1, 0.14, 6]]
	for wd in wings:
		if nb > wd[2]:
			continue
		var side: float = wd[0]
		var up: bool = wd[1] < 0
		var piv = O + Vector2(side * 0.5, wd[1])
		var flap = sin(t * 1.7 + wd[1] * 4) * 0.2
		var ang = -PI / 2 + side * ((0.95 if up else 1.95) + flap)
		for k in 5:
			var fa = ang + side * (k - 2) * 0.2
			var ln2 = 0.5 + (0.22 if up else 0.12) * (1.0 - abs(k - 2) / 2.0)
			var dv = Vector2(cos(fa), sin(fa))
			var nv = Vector2(-dv.y, dv.x)
			var leaf = PackedVector2Array([piv, piv + dv * ln2 * 0.4 + nv * 0.065, piv + dv * ln2, piv + dv * ln2 * 0.4 - nv * 0.065])
			shape(leaf, pale, 0.016)
			line(PackedVector2Array([piv + dv * 0.05, piv + dv * ln2 * 0.85]), 0.008)
	# 六つの足（踊るように交互に上がる）
	var legx = [-0.44, -0.27, -0.09, 0.09, 0.27, 0.44]
	var legb = [1, 5, 8, 9, 7, 3]
	for i in 6:
		if nb > legb[i]:
			continue
		var x: float = legx[i]
		var lift: float = max(0.0, sin(t * 4.4 + i * PI)) * 0.08
		var hip = O + Vector2(x, 0.05 + sqrt(max(0.0, 1.0 - pow(x / 0.62, 2))) * 0.46)
		var knee = hip + Vector2(x * 0.35, 0.2 - lift)
		var foot = Vector2(x * 1.32, 0.9 - lift * 1.4 + bob * 0.3)
		limb(PackedVector2Array([hip, knee, foot]), 0.075, ochre)
		for k in 3:
			var cl = foot + Vector2((k - 1) * 0.035, 0.0)
			line(PackedVector2Array([cl, cl + Vector2((k - 1) * 0.025, 0.04)]), 0.014)
	# 胴（黄色い嚢）
	var sq = sin(t * 4.4) * 0.025
	var body = ell(O + Vector2(0, 0.05), 0.62 * (1 + sq), 0.5 * (1 - sq), 48)
	shape(body, ochre, 0.03)
	# 嚢の口（くくった首と房）
	var neck = PackedVector2Array([O + Vector2(-0.13, -0.42), O + Vector2(0.13, -0.42), O + Vector2(0.07, -0.56), O + Vector2(-0.07, -0.56)])
	shape(neck, ochre, 0.022)
	line(PackedVector2Array([O + Vector2(-0.1, -0.5), O + Vector2(0.1, -0.5)]), 0.02)
	for k in 3:
		var tc = O + Vector2((k - 1) * 0.07, -0.62 - (0.02 if k == 1 else 0.0))
		shape(ell(tc, 0.05, 0.065, 16), red, 0.016)
	# 雲紋（胴の模様）
	var spots = [[-0.27, -0.05, 0.13, 1.0], [0.24, 0.12, 0.12, -1.0], [0.0, 0.3, 0.1, 1.0], [0.32, -0.2, 0.09, 1.0], [-0.34, 0.24, 0.08, -1.0], [0.02, -0.22, 0.08, -1.0]]
	for sp in spots:
		line(spiral(O + Vector2(sp[0], sp[1] + 0.05), sp[2], 1.6, t * 0.4, sp[3]), 0.016, Color(_ink, _a * 0.75))
	# 下側の陰影線
	for i in 15:
		var x2 = -0.5 + i * 0.0714
		var yb = 0.05 + sqrt(max(0.0, 1.0 - pow(x2 / 0.62, 2))) * 0.5
		line(PackedVector2Array([O + Vector2(x2, yb - 0.1), O + Vector2(x2 + 0.01, yb - 0.025)]), 0.008, Color(_ink, _a * 0.6))

# ---------- 蚩尤: 獣の頭・四つの目・角、武器を握る。漢の画像石の戦神 ----------
static func _chiyou(t: float, nb: int) -> void:
	var br = sin(t * 1.6) * 0.012
	var wv = sin(t * 1.3) * 0.07
	var bronze = _c(0.58, 0.38, 0.22, 0.92)
	var dark = _c(0.36, 0.22, 0.14, 0.92)
	var steel = _c(0.86, 0.84, 0.76, 0.92)
	var red = _c(0.78, 0.2, 0.12, 0.9)
	# 脚（踏ん張る）
	for sd in [-1.0, 1.0]:
		limb(PackedVector2Array([Vector2(sd * 0.15, 0.32), Vector2(sd * 0.36, 0.6), Vector2(sd * 0.4, 0.9)]), 0.11, bronze)
		line(PackedVector2Array([Vector2(sd * 0.32, 0.92), Vector2(sd * 0.5, 0.92)]), 0.035)
	# 裳
	shape(PackedVector2Array([Vector2(-0.24, 0.28), Vector2(0.24, 0.28), Vector2(0.32, 0.47), Vector2(-0.32, 0.47)]), dark)
	for i in 7:
		var x = -0.26 + i * 0.087
		line(PackedVector2Array([Vector2(x * 0.92, 0.3), Vector2(x, 0.46)]), 0.008)
	# 腕と武器（崩れる順: 剣0 盾1 戈2 鉞3）
	var sh = [Vector2(-0.3, -0.24 + br), Vector2(0.3, -0.24 + br)]
	# 上の腕
	var hand_l = Vector2(-0.62, -0.72 + wv)
	var hand_r = Vector2(0.62, -0.7 - wv)
	limb(PackedVector2Array([sh[0], Vector2(-0.56, -0.38 + wv * 0.5), hand_l]), 0.085, bronze)
	limb(PackedVector2Array([sh[1], Vector2(0.56, -0.38 - wv * 0.5), hand_r]), 0.085, bronze)
	# 下の腕
	var hand_l2 = Vector2(-0.5, 0.22)
	var hand_r2 = Vector2(0.52, 0.2)
	limb(PackedVector2Array([Vector2(-0.28, -0.08), Vector2(-0.54, 0.02), hand_l2]), 0.08, bronze)
	limb(PackedVector2Array([Vector2(0.28, -0.08), Vector2(0.55, 0.0), hand_r2]), 0.08, bronze)
	if nb <= 2:   # 戈（長い柄に横向きの刃）
		var top = hand_l + Vector2(-0.04, -0.5)
		var bot = hand_l + Vector2(0.03, 0.4)
		line(PackedVector2Array([bot, top]), 0.03)
		line(PackedVector2Array([bot, top]), 0.016, dark)
		var bl = top + Vector2(0.004, 0.08)
		shape(PackedVector2Array([bl, bl + Vector2(-0.26, 0.02), bl + Vector2(-0.3, 0.07), bl + Vector2(-0.02, 0.06)]), steel, 0.016)
		line(qb(top, top + Vector2(0.08, 0.05), top + Vector2(0.06, 0.16)), 0.02, red)
	if nb <= 0:   # 剣
		var d = Vector2(0.25, -1).normalized()
		var g0 = hand_r + d * 0.04
		shape(PackedVector2Array([g0 + Vector2(-d.y, d.x) * 0.03, g0 + d * 0.5, g0 - Vector2(-d.y, d.x) * 0.03]), steel, 0.016)
		line(PackedVector2Array([hand_r + Vector2(-d.y, d.x) * 0.08, hand_r - Vector2(-d.y, d.x) * 0.08]), 0.03)
	if nb <= 1:   # 盾（饕餮の顔の小さな盾）
		var sc = hand_l2 + Vector2(-0.06, 0.02)
		shape(ell(sc, 0.16, 0.23, 28), red, 0.022)
		line(spiral(sc + Vector2(-0.06, -0.05), 0.05, 1.3, t, 1.0, 20), 0.012)
		line(spiral(sc + Vector2(0.06, -0.05), 0.05, 1.3, t + PI, -1.0, 20), 0.012)
		line(PackedVector2Array([sc + Vector2(0, -0.18), sc + Vector2(0, 0.18)]), 0.012)
	if nb <= 3:   # 鉞
		var hb = hand_r2 + Vector2(0.02, 0.22)
		var ht = hand_r2 + Vector2(-0.02, -0.26)
		line(PackedVector2Array([hb, ht]), 0.026)
		var ax = PackedVector2Array([ht + Vector2(0, 0.02), ht + Vector2(0.2, -0.08), ht + Vector2(0.24, 0.06), ht + Vector2(0.2, 0.2), ht + Vector2(0, 0.12)])
		shape(ax, steel, 0.016)
	# 胴（鱗の鎧）
	var torso = PackedVector2Array([Vector2(-0.33, -0.28 + br), Vector2(0.33, -0.28 + br), Vector2(0.22, 0.32), Vector2(-0.22, 0.32)])
	shape(torso, bronze, 0.026)
	for r in 5:
		var y = -0.18 + r * 0.09 + br * 0.5
		var hw = 0.3 - r * 0.02
		var n = 5
		for i in n:
			var x0 = -hw + i * hw * 2 / n
			line(qb(Vector2(x0, y), Vector2(x0 + hw / n, y + 0.05), Vector2(x0 + hw * 2 / n, y), 6), 0.009)
	line(PackedVector2Array([Vector2(-0.23, 0.24), Vector2(0.23, 0.24)]), 0.03)
	# 頭（牛の頭・四つ目）
	var hy = -0.47 + br
	for sd in [-1.0, 1.0]:
		var hidx = 4 if sd < 0 else 5
		if nb <= hidx:
			horn(Vector2(sd * 0.13, hy - 0.13), Vector2(sd * 0.48, hy - 0.2), Vector2(sd * 0.38, hy - 0.5), 0.055, _c(0.93, 0.88, 0.74, 0.92))
		shape(PackedVector2Array([Vector2(sd * 0.17, hy - 0.1), Vector2(sd * 0.3, hy - 0.06), Vector2(sd * 0.19, hy - 0.01)]), bronze, 0.014)
	var head = PackedVector2Array([Vector2(-0.17, hy - 0.15), Vector2(0.17, hy - 0.15), Vector2(0.19, hy - 0.03), Vector2(0.1, hy + 0.14), Vector2(-0.1, hy + 0.14), Vector2(-0.19, hy - 0.03)])
	shape(head, bronze, 0.026)
	var glow = 0.6 + 0.4 * sin(t * 3.0)
	for e in [Vector2(-0.065, hy - 0.08), Vector2(0.065, hy - 0.08), Vector2(-0.12, hy - 0.01), Vector2(0.12, hy - 0.01)]:
		shape(ell(e, 0.03, 0.022, 12), _c(0.95, 0.85, 0.4, glow), 0.012)
		fill(ell(e, 0.012, 0.012, 8), _ink)
	shape(ell(Vector2(0, hy + 0.09), 0.08, 0.045, 16), dark, 0.014)
	fill(ell(Vector2(-0.03, hy + 0.09), 0.012, 0.01, 8), _ink)
	fill(ell(Vector2(0.03, hy + 0.09), 0.012, 0.01, 8), _ink)

# ---------- 饕餮: 青銅器の獣面。首ありて身なし。左右対称の目・角・耳と雷紋 ----------
static func _taotie(t: float, nb: int) -> void:
	var brz = _c(0.33, 0.48, 0.41, 0.92)
	var brz2 = _c(0.24, 0.36, 0.31, 0.92)
	var pale = _c(0.86, 0.82, 0.66, 0.92)
	var red = _c(0.8, 0.22, 0.14, 0.95)
	var br = 1.0 + sin(t * 1.4) * 0.02
	var half = [Vector2(0, -0.44), Vector2(0.25, -0.5), Vector2(0.52, -0.4), Vector2(0.7, -0.18), Vector2(0.74, 0.1), Vector2(0.6, 0.34), Vector2(0.36, 0.44), Vector2(0.16, 0.52), Vector2(0, 0.48)]
	var outline = PackedVector2Array()
	for p in half:
		outline.append(Vector2(p.x, p.y) * br)
	for i in range(half.size() - 2, 0, -1):
		outline.append(Vector2(-half[i].x, half[i].y) * br)
	# 角・耳（後ろ側）: 崩れる順 左耳0 右耳1 左角2 右角3 左牙4 右牙5
	for sd in [-1.0, 1.0]:
		var ear_i = 0 if sd < 0 else 1
		var horn_i = 2 if sd < 0 else 3
		if nb <= horn_i:
			# C字に巻く角
			var a = Vector2(sd * 0.16, -0.42)
			var c1 = Vector2(sd * 0.2, -0.95)
			var b = Vector2(sd * 0.62, -0.7)
			var curve = qb(a, c1, b, 16)
			var curl = spiral(Vector2(sd * 0.55, -0.6), 0.1, 1.2, -PI / 2 + (0.0 if sd > 0 else PI), sd, 20)
			limb(curve, 0.1, brz)
			limb(curl, 0.06, brz)
		if nb <= ear_i:
			var ec = Vector2(sd * 0.86, 0.0)
			shape(ell(ec, 0.15, 0.2, 24), brz, 0.022)
			line(spiral(ec, 0.12, 1.6, t * 0.3, sd, 30), 0.022)
	shape(outline, brz, 0.03)
	# 雷紋（地の文様）
	for gy in range(-4, 5):
		for gx in range(-7, 8):
			var p = Vector2(gx * 0.1 + (0.05 if gy % 2 else 0.0), gy * 0.1) * br
			if not Geometry2D.is_point_in_polygon(p, outline):
				continue
			if abs(p.x) < 0.08 or (abs(abs(p.x) - 0.27) < 0.16 and abs(p.y + 0.08) < 0.12):
				continue
			line(square_spiral(p, 0.03, 1.0 if p.x > 0 else -1.0), 0.008, brz2)
	# 鼻筋（中央の稜）
	shape(PackedVector2Array([Vector2(-0.05, -0.42), Vector2(0.05, -0.42), Vector2(0.06, 0.18), Vector2(-0.06, 0.18)]), brz2, 0.02)
	for i in 6:
		var y = -0.36 + i * 0.09
		line(PackedVector2Array([Vector2(-0.05, y), Vector2(0.05, y)]), 0.01)
	var glow = 0.55 + 0.45 * sin(t * 2.2)
	for sd in [-1.0, 1.0]:
		# 眉
		var brow = qb(Vector2(sd * 0.08, -0.22), Vector2(sd * 0.3, -0.34), Vector2(sd * 0.5, -0.22), 14)
		limb(brow, 0.06, brz)
		line(spiral(Vector2(sd * 0.5, -0.17), 0.05, 1.2, -PI / 2, sd, 16), 0.022)
		# 目（臣の字形のような大きな目）
		var ec = Vector2(sd * 0.27, -0.08)
		var top = qb(ec + Vector2(-0.19, 0.0), ec + Vector2(0.0, -0.17), ec + Vector2(0.19, 0.0), 12)
		var bot = qb(ec + Vector2(0.19, 0.0), ec + Vector2(0.0, 0.12), ec + Vector2(-0.19, 0.0), 12)
		var eye = top + bot.slice(1)
		shape(eye, pale, 0.026)
		fill(ell(ec, 0.07, 0.07, 18), _ink)
		fill(ell(ec, 0.03, 0.03, 12), _c(0.9, 0.3, 0.15, glow))
		# 鼻の渦
		line(spiral(Vector2(sd * 0.12, 0.24), 0.07, 1.4, PI, sd, 20), 0.022)
		# 上あごと牙
		line(qb(Vector2(sd * 0.04, 0.34), Vector2(sd * 0.25, 0.4), Vector2(sd * 0.44, 0.3), 12), 0.03)
		var fang_i = 4 if sd < 0 else 5
		if nb <= fang_i:
			for k in 3:
				var fx = sd * (0.1 + k * 0.1)
				shape(PackedVector2Array([Vector2(fx - 0.035, 0.36), Vector2(fx + 0.035, 0.37), Vector2(fx, 0.46 + (0.02 if k == 1 else 0.0))]), pale, 0.012)
			shape(PackedVector2Array([Vector2(sd * 0.4, 0.31), Vector2(sd * 0.47, 0.3), Vector2(sd * 0.5, 0.58), Vector2(sd * 0.44, 0.5)]), pale, 0.014)
	# 口の奥（下あごがない）
	fill(ell(Vector2(0, 0.42), 0.18, 0.05, 16), red)
