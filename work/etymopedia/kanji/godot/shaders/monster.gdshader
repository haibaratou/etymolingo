shader_type canvas_item;
// 決戦の怪物（水墨画）: 反撃のたびに墨が焼けるように欠けていく。縁は朱に滲む
uniform sampler2D noise_tex : repeat_enable, filter_linear;
uniform float dissolve = 0.0;
uniform float flash = 0.0;
uniform float t = 0.0;
uniform float inv_k = 0.0;
uniform float alpha = 1.0;

void fragment() {
	vec2 uv = UV;
	// 墨がわずかに揺らぐ
	float w = texture(noise_tex, uv * 0.7 + vec2(t * 0.02, t * 0.013)).r - 0.5;
	uv += vec2(w, -w) * 0.004;
	vec4 c = texture(TEXTURE, uv);
	// 夜は白黒反転（明るさだけを反転し、色味は残す）
	float yl = dot(c.rgb, vec3(0.299, 0.587, 0.114));
	c.rgb = mix(c.rgb, clamp(c.rgb + (1.0 - 2.0 * yl), 0.0, 1.0), inv_k);
	if (dissolve > 0.0) {
		float n = texture(noise_tex, UV * 1.4).r * 0.75 + texture(noise_tex, UV * 5.0).r * 0.25;
		float keep = smoothstep(dissolve - 0.015, dissolve + 0.045, n);
		float rim = (1.0 - smoothstep(dissolve, dissolve + 0.07, n)) * keep;
		c.rgb = mix(c.rgb, vec3(0.78, 0.2, 0.1), rim * 0.85);
		c.a *= keep;
	}
	c.rgb = mix(c.rgb, vec3(1.0, 0.93, 0.72), flash * c.a);
	// COLOR は最初からテクスチャの色を掛けた値なので、使わずに置き換える
	COLOR = vec4(c.rgb, c.a * alpha);
}
