extends SceneTree
## 仲間になれる全字の性能を一覧にする（検証用）
## godot --headless --path . --script res://tools/dump_kraft.gd -- [出力先.tsv]
const Kraft = preload("res://scripts/kraft.gd")
func _init() -> void:
	Kraft.load_db()
	var out: String = "user://kraft_dump.tsv"
	var a: PackedStringArray = OS.get_cmdline_user_args()
	if a.size() > 0:
		out = a[0]
	var f := FileAccess.open(out, FileAccess.WRITE)
	f.store_line("ch\ten\tjp\tbody\tkind\tmotion\teff\trad\tparts\tP\tA\tR\tC\tD\tX\tKN")
	var n := 0
	for ch in Kraft.K:
		if not Kraft.can_ally(ch):
			continue
		var p: Dictionary = Kraft.prof(ch, 1)
		var k: Dictionary = Kraft.K[ch]
		f.store_line("\t".join([ch, String(k.get("en", "")), String(k.get("jp", "")), p.body, p.kind, p.motion, p.eff, p.rad, "+".join(k.get("op", [])),
			str(p.P), "%.2f" % p.A, "%.2f" % p.R, str(p.C), "%.2f" % p.D, str(p.X), str(int(p.KN))]))
		n += 1
	f.close()
	print("[dump_kraft] ", n, " allies -> ", ProjectSettings.globalize_path(out) if out.begins_with("user://") else out)
	quit()
