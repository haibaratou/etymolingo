## 効果音と音楽。効果音は使い回しの再生器で鳴らす
class_name Sfx
extends Node

var on = true
var bgm_on = true
var streams = {}
var players: Array[AudioStreamPlayer] = []
var idx = 0
var bgm_day: AudioStreamPlayer
var bgm_night: AudioStreamPlayer
var bgm_boss: AudioStreamPlayer
var night_mix = 0.0
var boss_mix = 0.0
const PENTA := [0, 2, 4, 7, 9]

func _ready() -> void:
	for n in ["tick", "koto", "slash", "dash", "thud", "soft", "miss", "hurt", "lv", "taiko", "boom", "fuse", "xp", "zap", "warn", "stamp", "brush", "bite", "gong"]:
		streams[n] = load("res://assets/sfx/%s.wav" % n)
	for i in 16:
		var p = AudioStreamPlayer.new()
		add_child(p)
		players.append(p)
	bgm_day = _bgm("bgm_day")
	bgm_night = _bgm("bgm_night")
	bgm_boss = _bgm("bgm_boss")

func _bgm(n: String) -> AudioStreamPlayer:
	var p = AudioStreamPlayer.new()
	p.stream = load("res://assets/sfx/%s.wav" % n)
	p.volume_db = -80
	add_child(p)
	p.finished.connect(func(): p.play())
	return p

func start_bgm() -> void:
	if not bgm_day.playing:
		bgm_day.play()
	if not bgm_night.playing:
		bgm_night.play()
	if not bgm_boss.playing:
		bgm_boss.play()

func set_night(v: float) -> void:
	night_mix = v
	_mix()

## 決戦の恐ろしい曲へ切り替える（0..1）
func set_boss(v: float) -> void:
	boss_mix = v
	_mix()

func _mix() -> void:
	var on_v = 1.0 if (bgm_on and on) else 0.0
	var nb: float = 1.0 - boss_mix
	bgm_day.volume_db = linear_to_db(max(0.0001, (1.0 - night_mix) * 0.55 * on_v * nb))
	bgm_night.volume_db = linear_to_db(max(0.0001, night_mix * 0.6 * on_v * nb))
	bgm_boss.volume_db = linear_to_db(max(0.0001, boss_mix * 0.8 * on_v))

func play(n: String, vol := 0.0, pitch := 1.0) -> void:
	if not on or not streams.has(n):
		return
	var p = players[idx]
	idx = (idx + 1) % players.size()
	p.stream = streams[n]
	p.volume_db = vol
	p.pitch_scale = pitch
	p.play()

## 連撃に合わせて五音音階を上っていく琴
func koto(step: int) -> void:
	var i = step % 15
	var semi: int = PENTA[i % 5] + 12 * (i / 5)
	play("koto", -4.0, pow(2.0, (semi - 7) / 12.0))
