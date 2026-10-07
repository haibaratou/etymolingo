## 描画関数を呼ぶだけの層（地面・効果・単語札・画面表示）
class_name DrawLayer
extends Node2D

var fn: Callable

func _draw() -> void:
	if fn.is_valid():
		fn.call(self)
