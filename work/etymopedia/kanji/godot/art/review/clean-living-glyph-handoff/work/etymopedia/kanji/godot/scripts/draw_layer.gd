## 描画関数を呼ぶだけの層（地面・効果・単語札・画面表示）
class_name DrawLayer
extends Node2D

var fn: Callable
static var prof := {}

func _draw() -> void:
	if fn.is_valid():
		var t0 = Time.get_ticks_usec()
		fn.call(self)
		var k = fn.get_method()
		prof[k] = prof.get(k, 0) + Time.get_ticks_usec() - t0
