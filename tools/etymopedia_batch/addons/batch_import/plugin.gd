@tool
extends EditorPlugin
# Read-only preview of the single current target CSV; never writes shared data.
const INPUT_CSV := "D:/Projects/dot-image-review/ready_union_scopes_20261015.csv"
var error_message := ""

func _enter_tree() -> void:
	_run()

func _json(path: String) -> Variant:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		error_message = "Cannot read " + path
		return null
	var parser := JSON.new()
	var err := parser.parse(file.get_as_text().trim_prefix("\ufeff"))
	file.close()
	if err != OK:
		error_message = "Invalid JSON: " + path
		return null
	return parser.data

func _csv(path: String) -> Array:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		error_message = "Cannot read " + path
		return []
	var result: Array = []
	while not file.eof_reached():
		var row := file.get_csv_line()
		if row.size() == 1 and row[0].is_empty():
			continue
		if result.is_empty():
			row[0] = row[0].trim_prefix("\ufeff")
		result.append(row)
	file.close()
	return result

func _cell(row: Array, columns: Dictionary, primary: String, alias: String = "") -> String:
	var index: int = int(columns.get(primary, columns.get(alias, -1)))
	return str(row[index]) if index >= 0 and index < row.size() else ""

func _candidates(path: String = INPUT_CSV) -> Dictionary:
	var table := _csv(path)
	if table.is_empty():
		return {"rows": [], "total": 0, "input": path}
	var columns: Dictionary = {}
	for i in table[0].size():
		columns[str(table[0][i])] = i
	if not columns.has("filename") and not columns.has("ファイル名"):
		error_message = "Target CSV lacks literal filename column"
		return {}
	var out: Array = []
	var seen: Dictionary = {}
	var completed := 0
	var held := 0
	for index in range(1, table.size()):
		var row: Array = Array(table[index])
		var name := _cell(row, columns, "ファイル名", "filename")
		var state := _cell(row, columns, "制作状態")
		if columns.has("generation_eligible") and _cell(row, columns, "generation_eligible") != "True":
			held += 1
			continue
		if state in ["generated", "reviewed", "applied"]:
			completed += 1
			continue
		if state in ["needs_revision", "error"] or _cell(row, columns, "generation_need_status") == "date_review_required_not_confirmed_regeneration":
			held += 1
			continue
		if name.is_empty() or name.get_file() != name or not name.ends_with(".png") or seen.has(name.to_lower()):
			error_message = "Invalid or colliding exact filename: " + name
			return {}
		var prompt := _cell(row, columns, "画像生成プロンプト", "prompt")
		var gloss := _cell(row, columns, "語義", "ja")
		if prompt.is_empty() or gloss.is_empty():
			held += 1
			continue
		seen[name.to_lower()] = true
		out.append({"i": index, "f": name, "identity": _cell(row, columns, "identity"), "w": _cell(row, columns, "単語", "word"), "roots": _cell(row, columns, "語根ID_JSON", "roots"), "ja": gloss, "en": _cell(row, columns, "第一英語義", "en"), "prompt": prompt, "r": int(_cell(row, columns, "rarity"))})
	return {"rows": out, "total": out.size(), "completed": completed, "held": held, "input": path, "input_sha256": FileAccess.get_sha256(path), "scope": "explicit_generation_targets_only_not_full_image_inventory", "read_only": true}

func _run() -> void:
	var request: Variant = _json("res://request.json")
	if not request is Dictionary:
		push_error(error_message)
		return
	if str(request.get("action", "candidates")) != "candidates":
		push_error("Read-only preview. Use workflow_io.py with an explicit dot owner token to append; never create parallel generation CSVs.")
		return
	var candidates := _candidates(str(request.get("input_csv", INPUT_CSV)))
	if not error_message.is_empty():
		push_error(error_message)
		return
	var rows: Array = candidates.rows
	candidates.erase("rows")
	var offset: int = maxi(0, int(request.get("offset", 0)))
	var limit: int = clampi(int(request.get("limit", 50)), 1, 100)
	candidates["offset"] = offset
	candidates["next_offset"] = mini(offset + limit, rows.size())
	print("BATCH_META " + JSON.stringify(candidates))
	for row in rows.slice(offset, offset + limit):
		print("BATCH_ROW " + JSON.stringify(row))
