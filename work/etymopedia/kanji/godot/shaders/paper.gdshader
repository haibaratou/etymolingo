// 原稿用紙: 和紙の繊維、朱の升目（ワールド座標に固定）、紙の縁の焼け。夜（漢詩）は墨の闇に金の粉
// 和紙のむら・粒は、あらかじめ作った繰り返しの絵（washi_tile.png）を引くだけにして軽くしている
shader_type canvas_item;

uniform vec2 cam = vec2(0.0);
uniform vec2 size = vec2(1280.0, 800.0);
uniform float sf = 1.0;
uniform float night = 0.0;
uniform float time = 0.0;
uniform float calm = 0.0;
uniform sampler2D paper_tex : repeat_enable, filter_linear;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void fragment() {
	vec2 sp = UV * size;
	vec2 w = sp + cam - size * 0.5;
	vec3 washi = vec3(0.922, 0.910, 0.882);
	vec4 tx = texture(paper_tex, w / 512.0);
	float cloud = texture(paper_tex, w / 1700.0).r * 0.6 + tx.r * 0.4;
	vec3 col = washi * (0.955 + cloud * 0.07) + (tx.g - 0.5) * 0.018;
	// 升目: 列の間に細い溝
	float cell = 44.0 * sf, gap = 7.0 * sf, pitch = cell + gap;
	float lx = mod(w.x, pitch);
	float ly = mod(w.y, cell);
	float vline = (1.0 - smoothstep(0.0, 1.0, abs(lx))) + (1.0 - smoothstep(0.0, 1.0, abs(lx - cell)));
	float inside = step(0.0, lx) * step(lx, cell);
	float hline = (1.0 - smoothstep(0.0, 1.0, min(ly, cell - ly))) * inside;
	float grid = clamp(vline + hline, 0.0, 1.0);
	grid *= 0.75 + 0.25 * texture(paper_tex, w / 90.0).r;
	vec3 shu = vec3(0.82, 0.23, 0.14);
	col = mix(col, shu, grid * 0.20);
	// 紙の縁の焼け
	vec2 q = UV - 0.5;
	float vig = smoothstep(0.35, 0.85, length(q * vec2(1.0, size.y / size.x) * 1.35));
	col = mix(col, vec3(0.72, 0.62, 0.47), vig * 0.28);
	if (night > 0.001) {
		// 夜: 墨の闇。金の升目と、ゆっくり漂う金の粉
		vec3 yoru = vec3(0.055, 0.051, 0.07) + texture(paper_tex, w / 2400.0 + vec2(time * 0.002, 0.0)).r * 0.035;
		vec3 ncol = mix(yoru, vec3(0.78, 0.63, 0.27), grid * 0.10);
		vec2 g = floor(w / 23.0);
		float star = step(0.985, hash(g));
		float tw = 0.5 + 0.5 * sin(time * (1.0 + hash(g + 3.0) * 2.0) + hash(g) * 6.28);
		vec2 cc = fract(w / 23.0) - 0.5;
		ncol += vec3(0.85, 0.7, 0.35) * star * tw * smoothstep(0.08, 0.0, length(cc)) * (1.0 - calm * 0.5);
		ncol = mix(ncol, vec3(0.0), vig * 0.5);
		col = mix(col, ncol, night);
	}
	COLOR = vec4(col, 1.0);
}
