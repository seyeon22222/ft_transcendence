#version 300 es

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

in vec4 position;

void main() {
	gl_Position = P * V * M * vec4(position.xyz, 1.0);
}