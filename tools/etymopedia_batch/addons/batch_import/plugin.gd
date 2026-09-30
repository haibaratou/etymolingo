@tool
extends EditorPlugin
# Bounded local data import. No network, OS.execute, shell, or dictionary writes.
const PUBLIC_ROOT := "D:/etymolingo"
const SOURCE_ROOT := "D:/etymon-source"
const WORK := PUBLIC_ROOT + "/work/etymopedia"
const SAMPLE := WORK + "/etymopedia_sample"
var error_message := ""

func _enter_tree() -> void:
	_run()

func _json(path: String) -> Variant:
	var file := FileAccess.open(path, FileAccess.READ)
	if file == null:
		error_message = "Cannot read " + path
		return null
	if file.get_length() > 64000000:
		error_message = "Input exceeds 64 MB: " + path
		return null
	var parser := JSON.new()
	var err := parser.parse(file.get_as_text().trim_prefix("\ufeff"))
	file.close()
	if err != OK:
		error_message = "Invalid JSON: " + path + ": " + parser.get_error_message()
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
		if result.is_empty() and not row.is_empty():
			row[0] = row[0].trim_prefix("\ufeff")
		result.append(row)
	file.close()
	return result

func _image_names(path: String, names: Dictionary) -> void:
	for filename in DirAccess.get_files_at(path):
		if filename.to_lower().ends_with(".png"):
			names[filename.to_lower()] = true
	for dirname in DirAccess.get_directories_at(path):
		if not dirname.begins_with("."):
			_image_names(path.path_join(dirname), names)

func _prompt_names(path: String, names: Dictionary) -> void:
	for filename in DirAccess.get_files_at(path):
		if filename.begins_with("prompt_rows_") and filename.ends_with(".csv") and filename != "prompt_rows_template.csv":
			var table := _csv(path.path_join(filename))
			if table.size() > 0:
				var col: int = table[0].find("ファイル名")
				if col >= 0:
					for row in table.slice(1):
						if row.size() > col:
							names[str(row[col]).to_lower()] = true

func _key(word: String, roots: Variant) -> String:
	var joined := ""
	if roots is Array or roots is PackedStringArray:
		joined = "+".join(roots)
	return word + "\u001f" + joined

func _candidates() -> Dictionary:
	var words: Variant = _json(PUBLIC_ROOT + "/app/data/generated-etymon/words.json")
	if not words is Array:
		return {}
	var todo := _csv(SOURCE_ROOT + "/tools/word-art-todo.csv")
	var dates := _csv(WORK + "/png_creation_dates.csv")
	if todo.is_empty() or dates.is_empty():
		return {}
	var mapping: Dictionary = {}
	for row in todo.slice(1):
		if row.size() >= 5:
			mapping[str(row[1]) + "\u001f" + str(row[2])] = str(row[0])
	var date_name: int = dates[0].find("Filename")
	if date_name < 0:
		date_name = dates[0].find("FileName")
	if date_name < 0:
		date_name = 0
	var date_redo: int = dates[0].find("RedoRequired")
	if date_redo < 0:
		error_message = "RedoRequired column missing"
		return {}
	var redo: Dictionary = {}
	for row in dates.slice(1):
		if row.size() > date_redo:
			redo[str(row[date_name]).to_lower()] = str(row[date_redo])
	var stage: Dictionary = {}
	_image_names(WORK + "/_illust", stage)
	var reserved: Dictionary = {}
	_prompt_names(WORK, reserved)
	_prompt_names(SAMPLE, reserved)
	var counts: Dictionary = {}
	var cases: Dictionary = {}
	for word in words:
		var spelling: String = str(word.get("w", ""))
		counts[spelling] = int(counts.get(spelling, 0)) + 1
		var lower := spelling.to_lower()
		if not cases.has(lower):
			cases[lower] = spelling
		elif str(cases[lower]) != spelling:
			cases[lower] = "#CLASH"
	var simple := RegEx.new()
	simple.compile("^[A-Za-z0-9_-]+$")
	var out: Array = []
	var seen: Dictionary = {}
	var no_gloss := 0
	var no_name := 0
	for index in words.size():
		var word: Dictionary = words[index]
		var spelling := str(word.get("w", ""))
		var filename := ""
		if word.has("pica"):
			filename = str(word.pica) + ".png"
		elif mapping.has(_key(spelling, word.get("p", []))):
			filename = str(mapping[_key(spelling, word.get("p", []))])
		elif int(counts.get(spelling, 0)) == 1 and simple.search(spelling) != null:
			var base := spelling
			if ["con", "prn", "aux", "nul", "com1", "com2", "com3", "com4", "com5", "com6", "com7", "com8", "com9", "lpt1", "lpt2", "lpt3", "lpt4", "lpt5", "lpt6", "lpt7", "lpt8", "lpt9"].has(base.to_lower()):
				base += "_word"
			elif spelling != spelling.to_lower() and str(cases.get(spelling.to_lower(), "")) == "#CLASH":
				base += "_cap"
			filename = base + ".png"
		if filename.is_empty():
			no_name += 1
			continue
		var lower := filename.to_lower()
		if stage.has(lower) or reserved.has(lower) or str(redo.get(lower, "")) == "NO" or seen.has(lower):
			continue
		if FileAccess.file_exists(PUBLIC_ROOT + "/assets/word/" + filename) and not redo.has(lower):
			continue
		var gloss := str(word.get("ja", "")).strip_edges()
		if gloss.is_empty():
			no_gloss += 1
			continue
		seen[lower] = true
		var rarity: int = 999999
		if word.get("r") != null:
			rarity = int(word.r)
		out.append({"i": index, "f": filename, "w": spelling, "ja": gloss, "en": word.get("en", ""), "pos": word.get("pos", ""), "r": rarity})
	out.sort_custom(func(a, b): return a.r < b.r if a.r != b.r else a.f < b.f)
	return {"source_words": words.size(), "staged_images": stage.size(), "reserved_prompts": reserved.size(), "missing_gloss": no_gloss, "missing_filename": no_name, "total": out.size(), "rows": out}

func _quote(value: String) -> String:
	return "\"" + value.replace("\"", "\"\"") + "\""

func _fail(message: String) -> void:
	print("BATCH_ERROR " + message)
	push_error(message)

func _run() -> void:
	var request: Variant = _json("res://request.json")
	if not request is Dictionary:
		_fail(error_message)
		return
	var candidates := _candidates()
	if not error_message.is_empty() or candidates.is_empty():
		_fail(error_message)
		return
	var rows: Array = candidates.rows
	candidates.erase("rows")
	if str(request.get("action", "candidates")) == "candidates":
		var offset: int = maxi(0, int(request.get("offset", 0)))
		var limit: int = clampi(int(request.get("limit", 50)), 1, 100)
		candidates["offset"] = offset
		candidates["next_offset"] = mini(offset + limit, rows.size())
		print("BATCH_META " + JSON.stringify(candidates))
		for row in rows.slice(offset, offset + limit):
			print("BATCH_ROW " + JSON.stringify(row))
		return
	if str(request.get("action")) != "finalize":
		_fail("Unknown action")
		return
	var number: int = int(request.get("batch", 2))
	if number < 1 or number > 999:
		_fail("Invalid batch number")
		return
	var draft_path := "res://drafts_%03d.json" % number
	var drafts: Variant = _json(draft_path)
	var template := _csv(SAMPLE + "/prompt_rows_template.csv")
	if not drafts is Array or template.size() < 2 or template[0].size() != 7 or template[1].size() != 7:
		_fail("Invalid drafts or template: " + error_message)
		return
	if drafts.size() != 500:
		_fail("Expected 500 drafts; received " + str(drafts.size()))
		return
	var template_prompt: String = template[1][3]
	var style_at: int = template_prompt.find("Style:")
	if style_at < 0:
		_fail("Template lacks Style")
		return
	var suffix := template_prompt.substr(style_at).strip_edges()
	var by_name: Dictionary = {}
	for row in rows:
		by_name[row.f] = row
	var batch: Array = []
	var used: Dictionary = {}
	var min_words := 9999
	var max_words := 0
	var sum_words := 0
	for draft in drafts:
		var filename := str(draft.get("f", ""))
		if not by_name.has(filename) or used.has(filename.to_lower()):
			_fail("Ineligible or duplicate filename: " + filename)
			return
		var row: Dictionary = by_name[filename]
		var sense := str(draft.get("sense", "")).strip_edges()
		var subject := str(draft.get("subject", "")).strip_edges()
		var composition := str(draft.get("composition", "")).strip_edges()
		if sense.is_empty() or not str(row.ja).contains(sense) or subject.is_empty() or composition.is_empty():
			_fail("Incomplete or non-source sense: " + filename)
			return
		var local_suffix := suffix
		if bool(draft.get("allow_text", false)):
			local_suffix = suffix.replace("No text, numerals, labels, logos or watermark.", "Only the specified essential text or symbols. No unrelated labels, logos or watermark.")
		var prompt := "Subject: " + subject + "\n\nComposition: " + composition + "\n\n" + local_suffix
		var words_count: int = prompt.replace("\n", " ").split(" ", false).size()
		if words_count < 75 or words_count > 135 or prompt.contains("Reference:"):
			_fail("Prompt length/format: " + filename + " " + str(words_count))
			return
		used[filename.to_lower()] = true
		min_words = mini(min_words, words_count)
		max_words = maxi(max_words, words_count)
		sum_words += words_count
		batch.append({"r": row.r, "f": filename, "cells": [filename, str(row.ja), sense, prompt, "作成済み", "", "references/invidious.png"]})
	batch.sort_custom(func(a, b): return a.r < b.r if a.r != b.r else a.f < b.f)
	var destination := SAMPLE + "/prompt_rows_%03d.csv" % number
	if FileAccess.file_exists(destination):
		_fail("Destination exists; refusing overwrite: " + destination)
		return
	var all_lines: PackedStringArray = []
	var header: PackedStringArray = []
	for cell in template[0]:
		header.append(_quote(str(cell)))
	all_lines.append(",".join(header))
	for item in batch:
		var cells: PackedStringArray = []
		for cell in item.cells:
			cells.append(_quote(str(cell)))
		all_lines.append(",".join(cells))
	var output := FileAccess.open(destination, FileAccess.WRITE)
	if output == null:
		_fail("Cannot save CSV")
		return
	output.store_buffer(PackedByteArray([239, 187, 191]))
	output.store_string("\r\n".join(all_lines) + "\r\n")
	output.close()
	var check := _csv(destination)
	if check.size() != 501:
		_fail("Readback row count failed: " + str(check.size()))
		return
	for row in check:
		if row.size() != 7:
			_fail("Readback column count failed")
			return
	print("BATCH_SAVED " + JSON.stringify({"path": destination, "rows": 500, "columns": 7, "unique_filenames": used.size(), "review_required": 0, "min_words": min_words, "max_words": max_words, "mean_words": float(sum_words) / 500.0, "first": batch[0].f, "last": batch[-1].f, "rarity_min": batch[0].r, "rarity_max": batch[-1].r, "sha256": FileAccess.get_sha256(destination)}))
