#version 300 es

uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

in vec4 position;
in vec3 normal;
in vec2 uv;

out vec4 world_position;
out vec4 f_normal;
out vec2 f_uv;

void main() {
	world_position = M * vec4(position.xyz, 1.0);
	f_normal = transpose(inverse(M)) * vec4(normal, 0.0);
	f_uv = uv;
	gl_Position = P * V * world_position;
}