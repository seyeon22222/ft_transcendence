#version 300 es

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

in vec4 position;

out vec2 uv;

void main() {
	uv = position.xy * 0.5 + 0.5;
	gl_Position = P * V * M * vec4(position.xyz, 1.0);
}