#version 300 es

precision mediump float;
precision mediump sampler2D;

uniform sampler2D src0;
uniform sampler2D src1;

out vec4 fragColor;

void main() {
	vec3 bloom = texelFetch(src0, ivec2(gl_FragCoord.xy), 0).rgb * 0.5;
	vec3 original = texelFetch(src1, ivec2(gl_FragCoord.xy), 0).rgb;
	fragColor = vec4(bloom + original, 1.0);
}
