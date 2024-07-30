#version 300 es

precision mediump float;
precision mediump sampler2D;

uniform sampler2D src;
uniform float threshold;

out vec4 fragColor;

void main() {
	vec4 color = texelFetch(src, ivec2(gl_FragCoord.xy), 0);
	float brightness = dot(vec3(0.299,0.587, 0.114), color.xyz);
	fragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(color.xyz, 1.0), bvec4(brightness > threshold));
}