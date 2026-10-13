// 被写界深度: 奥行きの層ごとに描いた絵を、ピントからの外れに応じて円形にぼかす
shader_type canvas_item;
uniform float radius = 0.0;

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void fragment() {
	if (radius < 0.6) {
		COLOR = texture(TEXTURE, UV);
	} else {
		vec3 acc = vec3(0.0);
		float aa = 0.0;
		const int N = 24;
		// 画素ごとに並びを回して、ずれた写しが縞に見えないようにする
		float rot = hash(FRAGCOORD.xy) * 6.2832;
		for (int i = 0; i < N; i++) {
			float fi = float(i);
			float r = sqrt((fi + 0.5) / float(N)) * radius;
			float an = fi * 2.39996 + rot;
			vec4 c = texture(TEXTURE, UV + vec2(cos(an), sin(an)) * r * TEXTURE_PIXEL_SIZE);
			acc += c.rgb * c.a;
			aa += c.a;
		}
		vec3 rgb = aa > 0.0001 ? acc / aa : vec3(0.0);
		COLOR = vec4(rgb, aa / float(N));
	}
}
