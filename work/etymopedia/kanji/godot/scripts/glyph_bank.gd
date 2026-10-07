## 字の画像を起動時にまとめて作る。敵・仲間の字は、この画像に「生きている字」のシェーダーをかけて動かす
class_name GlyphBank
extends Node

const CELL := 160
const FS := 112
var tex = {}          # 文字列 → Texture2D（白い字。色はシェーダーで付ける）
var font: FontFile

func build(strings: Array) -> void:
	var list: Array = []
	for s in strings:
		if s != "" and not tex.has(s) and not list.has(s):
			list.append(s)
	var page_w = 2048
	var per_row = page_w / CELL
	var i = 0
	while i < list.size():
		var vp = SubViewport.new()
		vp.size = Vector2i(page_w, page_w)
		vp.transparent_bg = true
		vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS
		add_child(vp)
		var layer = DrawLayer.new()
		vp.add_child(layer)
		var placed: Array = []
		var col = 0
		var row = 0
		while i < list.size():
			var s: String = list[i]
			var w = s.length()
			if col + w > per_row:
				col = 0
				row += 1
			if row >= per_row:
				break
			placed.append([s, col, row, w])
			col += w
			i += 1
		layer.fn = func(ci: CanvasItem):
			for p in placed:
				var x0: float = p[1] * CELL
				var y0: float = p[2] * CELL
				ci.draw_string(font, Vector2(x0, y0 + CELL * 0.5 + FS * 0.36), p[0], HORIZONTAL_ALIGNMENT_CENTER, CELL * p[3], FS, Color.WHITE)
		layer.queue_redraw()
		if DisplayServer.get_name() == "headless":
			await get_tree().process_frame
		else:
			await RenderingServer.frame_post_draw
			await RenderingServer.frame_post_draw
		var img = vp.get_texture().get_image()
		if img == null or img.is_empty():
			img = Image.create(page_w, page_w, false, Image.FORMAT_RGBA8)
		for p in placed:
			var r = Rect2i(p[1] * CELL, p[2] * CELL, CELL * p[3], CELL)
			var sub = img.get_region(r)
			tex[p[0]] = ImageTexture.create_from_image(sub)
		vp.queue_free()

func get_tex(s: String) -> Texture2D:
	return tex.get(s)
