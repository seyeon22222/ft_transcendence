#version 300 es

precision mediump float;
precision mediump sampler2D;

uniform sampler2D src;

const float radius = 10.0;

out vec4 fragColor;

float gaussian(float v) {
	float	stddev = 5.0;
	float	a = 1.0 / (2.50662 * stddev);
	float	b = -1.0 / (2.0 * stddev * stddev);

	return a * exp(b * v * v);
}

void main() {
	vec3 color = vec3(0.0);
	float sum = 0.0;

	for (float i = -radius; i <= radius; ++i) {
		float g = gaussian(i);
		color += texelFetch(src, ivec2(gl_FragCoord.xy + vec2(0, i)), 0).xyz * g;
		sum += g;
	}
	color /= sum;
	fragColor = vec4(color, 1.0);
}