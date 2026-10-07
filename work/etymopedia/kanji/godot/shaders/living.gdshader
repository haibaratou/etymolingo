// 生きている字: 字の意味で字形がしなる・うねる・揺らめく。墨のかすれ、和紙の縁取り、墨がにじんで現れる
shader_type canvas_item;

uniform float t = 0.0;
uniform int mo = 0;
uniform float face = 1.0;
uniform float ph = 0.0;
uniform float st = 9.0;
uniform float cells = 1.0;
uniform vec4 ink : source_color = vec4(0.09, 0.08, 0.06, 1.0);
uniform vec4 halo : source_color = vec4(0.92, 0.91, 0.88, 0.85);
uniform vec4 flash_col : source_color = vec4(0.82, 0.23, 0.14, 1.0);
uniform float flash = 0.0;
uniform float reveal = 1.0;
uniform float alpha = 1.0;
uniform float grain = 1.0;
uniform float glow = 0.0;
uniform vec4 glow_col : source_color = vec4(0.78, 0.63, 0.27, 1.0);

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	f = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void fragment() {
	vec2 uv = UV;
	float u = fract(uv.x * cells);
	float v = uv.y;
	float k = 0.7; // 字の大きさ ÷ 画像のマス
	vec2 off = vec2(0.0);
	float tt = t;
	if (mo == 1) { if (v > 0.55) off.x = sin(tt * st * 1.8 + v * 2.0) * 0.07 * (v - 0.55) / 0.45 * face; }
	else if (mo == 2) { off.y = sin(tt * 7.0 - u * 7.0) * 0.12; }
	else if (mo == 3) { off.y = sin(tt * 6.0 - u * 5.0) * 0.08 * (0.3 + u); }
	else if (mo == 5) { off.x = sin(tt * 15.0 + v * 9.0 + ph) * 0.07 * (1.0 - v); }
	else if (mo == 6) { off.x = sin(tt * 2.2 + ph) * 0.16 * pow(1.0 - v, 2.0); }
	else if (mo == 8) { off.x = sin(tt * 4.0 + v * 10.0 + ph) * 0.04; }
	else if (mo == 9) { off.x = sin(tt * 3.0 + v * 4.0 + ph) * 0.07; }
	else if (mo == 10) { off.y = sin(tt * 22.0 + u * 14.0) * 0.03; }
	vec2 suv = uv - vec2(off.x * k / cells, off.y * k);
	float a = texture(TEXTURE, suv).a;
	// 和紙の縁取り（字が背景に溶けないように）
	vec2 px = TEXTURE_PIXEL_SIZE * 3.2;
	float h = 0.0;
	for (int i = 0; i < 8; i++) {
		float ang = float(i) * 0.785398;
		h = max(h, texture(TEXTURE, suv + vec2(cos(ang), sin(ang)) * px).a);
	}
	// 墨のかすれ: 縁がわずかに欠ける
	float n = vnoise(suv * vec2(70.0 * cells, 70.0)) * 0.6 + vnoise(suv * vec2(18.0 * cells, 18.0)) * 0.4;
	float ia = smoothstep(0.18, 0.62, a - (n - 0.5) * 0.32 * grain);
	vec3 col = mix(ink.rgb, flash_col.rgb, flash);
	// 墨だまり: 字の芯が少し濃い
	col *= mix(1.0, 0.82, smoothstep(0.85, 1.0, a) * (1.0 - flash));
	vec4 o = vec4(halo.rgb, h * halo.a);
	o = mix(o, vec4(col, 1.0), ia);
	o.a = max(ia, h * halo.a);
	// 光（金の字・選ばれた字）
	if (glow > 0.0) {
		float gsum = 0.0;
		for (int i = 0; i < 8; i++) {
			float ang = float(i) * 0.785398 + 0.3;
			gsum += texture(TEXTURE, suv + vec2(cos(ang), sin(ang)) * TEXTURE_PIXEL_SIZE * 9.0).a;
		}
		gsum /= 8.0;
		o.rgb = mix(glow_col.rgb, o.rgb, o.a);
		o.a = max(o.a, gsum * glow * 0.7);
	}
	// 墨がにじんで現れる（reveal 0→1）
	float rn = vnoise(uv * vec2(6.0 * cells, 6.0)) * 0.7 + vnoise(uv * vec2(23.0 * cells, 23.0)) * 0.3;
	float vis = smoothstep(rn - 0.06, rn + 0.03, reveal * 1.12 - 0.02);
	o.a *= vis * alpha;
	COLOR = o;
}
