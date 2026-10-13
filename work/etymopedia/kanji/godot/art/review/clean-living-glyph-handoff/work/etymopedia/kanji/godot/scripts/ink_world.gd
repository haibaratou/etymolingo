extends RefCounted
## Reuses approved Chinese landscape paintings behind the playable paper.
## The center and all typing labels remain unobstructed.

func draw(g, ci: CanvasItem) -> void:
	if g.state not in ["play", "pause", "craft", "levelup"] or g.boss != null:
		return
	var landscape: Texture2D = g.art("title_landscape")
	if landscape == null:
		return
	var w: float = g.W * 1.12
	var h: float = w * landscape.get_height() / landscape.get_width()
	var drift: float = sin(g.ui_time * 0.035) * 12 * g.SF
	var a: float = 0.14 if not g.kl_on else 0.075
	ci.draw_texture_rect(landscape, Rect2(-g.W * 0.06 + drift, -h * 0.25, w, h), false, Color(1, 1, 1, a))
	var river: Texture2D = g.art("scene_river")
	if river != null:
		var rw: float = g.W * 0.72
		var rh: float = rw * river.get_height() / river.get_width()
		ci.draw_texture_rect(river, Rect2(g.W * 0.38, g.H - rh * 0.38, rw, rh), false, Color(1, 1, 1, 0.075))
