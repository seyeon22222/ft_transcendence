#version 300 es

precision mediump float;

uniform sampler2D foreground_texture;
uniform sampler2D background_texture;

in vec2	uv;

out vec4 fragColor;

void main() {
	vec2 flipped_uv = vec2(0.0, 1.0) + vec2(1.0, -1.0) * uv;
	// vec2 pixelated_uv = floor(flipped_uv * vec2(48.0, 32.0)) / vec2(48.0, 32.0);
	vec2 pixelated_uv = floor(flipped_uv * vec2(24.0, 16.0)) / vec2(24.0, 16.0);
	vec4 bg = texture(background_texture, flipped_uv);
	vec4 fg = texture(foreground_texture, pixelated_uv);
	fragColor = vec4(mix(bg.xyz * 2.0, fg.xyz, fg.a), 1.0);

}