#version 300 es

precision mediump float;
precision mediump sampler2D;

uniform sampler2D src;
uniform float threshold;

out vec4 fragColor;

void main() {
	fragColor = texelFetch(src, ivec2(gl_FragCoord.xy), 0);
}