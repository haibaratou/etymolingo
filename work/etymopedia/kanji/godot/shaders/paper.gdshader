// 原稿用紙: 和紙の繊維、朱の升目（ワールド座標に固定）、紙の縁の焼け。夜（漢詩）は墨の闇に金の粉
shader_type canvas_item;

uniform vec2 cam = vec2(0.0);
uniform vec2 size = vec2(1280.0, 800.0);
uniform float sf = 1.0;
uniform float night = 0.0;
uniform float time = 0.0;
uniform float calm = 0.0;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
	float s = 0.0, a = 0.5;
	for (int i = 0; i < 5; i++) { s += vnoise(p) * a; p = p * 2.03 + 17.0; a *= 0.5; }
	return s;
}

void fragment() {
	vec2 sp = UV * size;
	vec2 w = sp + cam - size * 0.5;
	vec3 washi = vec3(0.922, 0.910, 0.882);
	// 和紙: 大きな雲状のむら＋細かな粒＋ところどころの長い繊維（楮）
	float cloud = fbm(w * 0.0035);
	float grain = hash(floor(w * 0.8)) - 0.5;
	float fibers = 0.0;
	for (int i = 0; i < 3; i++) {
		float an = float(i) * 2.1 + 0.4;
		vec2 dir = vec2(cos(an), sin(an));
		float warp = fbm(w * 0.006 + float(i) * 13.0) * 9.0;
		float line = abs(sin(dot(w, dir) * 0.045 + warp));
		float mask = smoothstep(0.62, 0.8, fbm(w * 0.01 + float(i) * 7.0));
		fibers += smoothstep(0.035, 0.0, line) * mask;
	}
	vec3 col = washi * (0.955 + cloud * 0.07) + grain * 0.018 - fibers * 0.035;
	// 升目: 20字×20行。列の間に細い溝
	float cell = 44.0 * sf, gap = 7.0 * sf, pitch = cell + gap;
	float lx = mod(w.x, pitch);
	float ly = mod(w.y, cell);
	float lw = 1.0;
	float vline = (1.0 - smoothstep(0.0, lw, abs(lx))) + (1.0 - smoothstep(0.0, lw, abs(lx - cell)));
	float inside = step(0.0, lx) * step(lx, cell);
	float hline = (1.0 - smoothstep(0.0, lw, min(ly, cell - ly))) * inside;
	float grid = clamp(vline + hline, 0.0, 1.0);
	// 朱の線は紙に少しにじむ
	grid *= 0.75 + 0.25 * vnoise(w * 0.09);
	vec3 shu = vec3(0.82, 0.23, 0.14);
	col = mix(col, shu, grid * 0.20);
	// 紙の縁の焼け
	vec2 q = UV - 0.5;
	float vig = smoothstep(0.35, 0.85, length(q * vec2(1.0, size.y / size.x) * 1.35));
	col = mix(col, vec3(0.72, 0.62, 0.47), vig * 0.28);
	// 夜: 墨の闇。金の升目と、ゆっくり漂う金の粉
	vec3 yoru = vec3(0.055, 0.051, 0.07) + fbm(w * 0.003 + time * 0.01) * 0.035;
	vec3 ncol = mix(yoru, vec3(0.78, 0.63, 0.27), grid * 0.10);
	vec2 g = floor(w / 23.0);
	float star = step(0.985, hash(g));
	float tw = 0.5 + 0.5 * sin(time * (1.0 + hash(g + 3.0) * 2.0) + hash(g) * 6.28);
	vec2 cc = fract(w / 23.0) - 0.5;
	ncol += vec3(0.85, 0.7, 0.35) * star * tw * smoothstep(0.08, 0.0, length(cc)) * (1.0 - calm * 0.5);
	ncol = mix(ncol, vec3(0.0), vig * 0.5);
	COLOR = vec4(mix(col, ncol, night), 1.0);
}
